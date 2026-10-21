-- 1. is_admin(): pengecekan role admin.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT COALESCE((SELECT role = 'admin' FROM profiles WHERE id = auth.uid()), false);
$$;

-- 2. hitung_harga(): menghitung tarif otomatis berdasarkan tanggal (Weekday/Weekend).
CREATE OR REPLACE FUNCTION hitung_harga(p_court INT, p_tanggal DATE)
RETURNS NUMERIC
LANGUAGE plpgsql STABLE SET search_path = public
AS $$
DECLARE
    v_harga NUMERIC;
BEGIN
    -- ISO Day: 6 = Sabtu, 7 = Minggu
    IF EXTRACT(ISODOW FROM p_tanggal) IN (6, 7) THEN
        SELECT harga_weekend INTO v_harga FROM courts WHERE id = p_court;
    ELSE
        SELECT harga_weekday INTO v_harga FROM courts WHERE id = p_court;
    END IF;

    IF v_harga IS NULL THEN
        RAISE EXCEPTION 'Lapangan tidak ditemukan atau tarif belum diatur';
    END IF;

    RETURN v_harga;
END;
$$;

-- 3. create_booking: membuat booking baru dengan otomatisasi harga Weekday/Weekend.
CREATE OR REPLACE FUNCTION create_booking(
    p_court INT, p_tanggal DATE, p_jam TIME, p_nama TEXT, p_telp TEXT, p_metode TEXT)
RETURNS INT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_user   UUID := auth.uid();
    v_buka   TIME;
    v_tutup  TIME;
    v_harga  NUMERIC;
    v_nama   TEXT;
    v_telp   TEXT;
    v_id     INT;
BEGIN
    IF v_user IS NULL THEN
        RAISE EXCEPTION 'Silakan login terlebih dahulu';
    END IF;
    IF p_court IS NULL OR p_tanggal IS NULL OR p_jam IS NULL THEN
        RAISE EXCEPTION 'Pilih lapangan, tanggal, dan jam terlebih dahulu';
    END IF;

    v_nama := trim(COALESCE(p_nama, ''));
    IF v_nama = '' THEN
        SELECT nama INTO v_nama FROM profiles WHERE id = v_user;
    END IF;

    v_telp := regexp_replace(COALESCE(p_telp, ''), '[^0-9]', '', 'g');

    SELECT v.jam_buka, v.jam_tutup INTO v_buka, v_tutup
    FROM courts c JOIN venues v ON v.id = c.venue_id
    WHERE c.id = p_court;

    IF v_buka IS NULL THEN
        RAISE EXCEPTION 'Lapangan tidak ditemukan';
    END IF;
    IF p_jam < v_buka OR p_jam >= v_tutup THEN
        RAISE EXCEPTION 'Jam di luar jam operasional';
    END IF;

    -- Hitung harga dinamis berdasarkan hari (Weekday vs Weekend)
    v_harga := hitung_harga(p_court, p_tanggal);

    BEGIN
        INSERT INTO bookings (user_id, court_id, tanggal, jam_mulai, jam_selesai,
                              nama_pemesan, no_telp, metode_bayar, total_harga)
        VALUES (v_user, p_court, p_tanggal, p_jam, p_jam + INTERVAL '1 hour',
                v_nama, v_telp, p_metode, v_harga)
        RETURNING id INTO v_id;
    EXCEPTION WHEN unique_violation THEN
        RAISE EXCEPTION 'Slot sudah terisi';
    END;

    INSERT INTO payments (booking_id, jumlah, metode) VALUES (v_id, v_harga, p_metode);
    UPDATE profiles SET no_telp = v_telp WHERE id = v_user AND no_telp IS NULL;

    RETURN v_id;
END;
$$;

-- 4. konfirmasi_pembayaran
CREATE OR REPLACE FUNCTION konfirmasi_pembayaran(p_booking INT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_status VARCHAR;
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Tidak punya akses';
    END IF;

    SELECT status INTO v_status FROM bookings WHERE id = p_booking FOR UPDATE;

    IF v_status <> 'terisi' THEN
        RAISE EXCEPTION 'Booking tidak dalam status terisi';
    END IF;

    UPDATE payments
       SET status = 'dikonfirmasi', dikonfirmasi_pada = now(), dikonfirmasi_oleh = auth.uid()
     WHERE booking_id = p_booking;

    UPDATE bookings SET status = 'lunas' WHERE id = p_booking;
END;
$$;

-- 5. batalkan_booking
CREATE OR REPLACE FUNCTION batalkan_booking(p_booking INT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_admin   BOOLEAN := is_admin();
    v_status  VARCHAR;
BEGIN
    SELECT status INTO v_status FROM bookings
    WHERE id = p_booking AND (user_id = auth.uid() OR v_admin) FOR UPDATE;

    IF v_status IS NULL OR v_status = 'dibatalkan' THEN
        RAISE EXCEPTION 'Booking tidak ditemukan atau sudah dibatalkan';
    END IF;

    UPDATE bookings SET status = 'dibatalkan' WHERE id = p_booking;
    UPDATE payments SET status = 'dibatalkan' WHERE booking_id = p_booking;
END;
$$;

-- 6. get_slot_terisi
CREATE OR REPLACE FUNCTION get_slot_terisi(p_court INT, p_tanggal DATE)
RETURNS TABLE (jam_mulai TIME, status VARCHAR, milik_saya BOOLEAN)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT b.jam_mulai, b.status, (b.user_id = auth.uid())
    FROM bookings b
    WHERE b.court_id = p_court
      AND b.tanggal  = p_tanggal
      AND b.status  <> 'dibatalkan'
    ORDER BY b.jam_mulai;
$$;

-- 7. update_tarif: pembaruan tarif Weekday & Weekend oleh Admin.
CREATE OR REPLACE FUNCTION update_tarif(p_court INT, p_harga_weekday NUMERIC, p_harga_weekend NUMERIC)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Tidak punya akses';
    END IF;
    
    UPDATE courts 
    SET harga_weekday = p_harga_weekday,
        harga_weekend = p_harga_weekend
    WHERE id = p_court;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lapangan tidak ditemukan';
    END IF;
END;
$$;

-- LAPORAN
CREATE OR REPLACE FUNCTION laporan_ringkasan()
RETURNS TABLE (total_pendapatan NUMERIC, total_transaksi BIGINT, total_lunas BIGINT,
               total_terisi BIGINT, total_dibatalkan BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Tidak punya akses'; END IF;
    RETURN QUERY
        SELECT COALESCE(SUM(b.total_harga) FILTER (WHERE b.status = 'lunas'), 0)::NUMERIC,
               COUNT(*),
               COUNT(*) FILTER (WHERE b.status = 'lunas'),
               COUNT(*) FILTER (WHERE b.status = 'terisi'),
               COUNT(*) FILTER (WHERE b.status = 'dibatalkan')
        FROM bookings b;
END;
$$;

CREATE OR REPLACE FUNCTION laporan_pendapatan(p_bulan DATE)
RETURNS TABLE (lapangan VARCHAR, jumlah_booking BIGINT, total_pendapatan NUMERIC)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Tidak punya akses'; END IF;
    RETURN QUERY
        SELECT c.nama_lapangan, COUNT(b.id), COALESCE(SUM(b.total_harga), 0)
        FROM courts c
        LEFT JOIN bookings b
               ON b.court_id = c.id
              AND b.status   = 'lunas'
              AND date_trunc('month', b.tanggal) = date_trunc('month', p_bulan)
        GROUP BY c.id, c.nama_lapangan
        ORDER BY 3 DESC, c.nama_lapangan;
END;
$$;

-- VIEWS ADMIN
CREATE OR REPLACE VIEW v_jadwal_harian WITH (security_invoker = true) AS
SELECT b.id AS booking_id, b.kode_booking, b.tanggal, b.jam_mulai, b.jam_selesai,
       c.nama_lapangan AS lapangan, b.nama_pemesan AS pemain, b.no_telp,
       b.metode_bayar, b.status, b.total_harga
FROM bookings b
JOIN courts c ON c.id = b.court_id
WHERE b.status <> 'dibatalkan';

CREATE OR REPLACE VIEW v_daftar_pembayaran WITH (security_invoker = true) AS
SELECT b.id AS booking_id, b.kode_booking, b.nama_pemesan AS pemain, b.no_telp,
       c.nama_lapangan AS lapangan, b.tanggal, b.jam_mulai, b.jam_selesai,
       b.total_harga, b.metode_bayar, b.status, b.created_at
FROM bookings b
JOIN courts c ON c.id = b.court_id;