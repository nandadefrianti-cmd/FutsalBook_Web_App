-- =====================================================================
-- FutsalBook - database/02_functions.sql
-- Logika bisnis (tiap fungsi = SATU TRANSAKSI), laporan, dan view admin.
-- Semua fungsi security definer; hak akses diatur di 04_policies.sql.
-- =====================================================================

-- 1. is_admin(): apakah pengguna yang login berperan admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT COALESCE((SELECT role = 'admin' FROM profiles WHERE id = auth.uid()), false);
$$;

-- 1b. hitung_harga: tarif satu jam pada tanggal tertentu.
--     Sabtu dan Minggu = harga_weekend, Senin-Jumat = harga_weekday. NULL jika lapangan tidak ada.
--     (Hari libur nasional tidak dibedakan; tulis sebagai batasan di README.)
CREATE OR REPLACE FUNCTION hitung_harga(p_court INT, p_tanggal DATE)
RETURNS NUMERIC
LANGUAGE sql STABLE SET search_path = public
AS $$
    SELECT CASE WHEN EXTRACT(ISODOW FROM p_tanggal) IN (6, 7) THEN c.harga_weekend ELSE c.harga_weekday END
    FROM courts c
    WHERE c.id = p_court;
$$;

-- 2. create_booking: dipanggil setelah pemain menekan "Simulasikan Pembayaran Berhasil".
--    Membuat booking (status terisi) + catatan pembayaran dalam satu transaksi.
--    Pesan error yang bisa muncul: 'Slot sudah terisi' (anti double booking).
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
    IF p_metode IS NULL OR p_metode NOT IN ('QRIS', 'GOPAY', 'DANA', 'OVO') THEN
        RAISE EXCEPTION 'Pilih metode pembayaran (QRIS, GoPay, DANA, atau OVO)';
    END IF;

    v_nama := trim(COALESCE(p_nama, ''));
    IF v_nama = '' THEN
        SELECT nama INTO v_nama FROM profiles WHERE id = v_user;
    END IF;
    IF v_nama IS NULL OR length(v_nama) < 2 OR length(v_nama) > 100 THEN
        RAISE EXCEPTION 'Nama pemesan harus 2 sampai 100 karakter';
    END IF;

    v_telp := regexp_replace(COALESCE(p_telp, ''), '[^0-9]', '', 'g');
    IF v_telp !~ '^(08|62)[0-9]{8,12}$' THEN
        RAISE EXCEPTION 'Nomor telepon tidak valid. Contoh: 081234567890';
    END IF;

    SELECT v.jam_buka, v.jam_tutup, hitung_harga(c.id, p_tanggal) INTO v_buka, v_tutup, v_harga
    FROM courts c JOIN venues v ON v.id = c.venue_id
    WHERE c.id = p_court;

    IF v_buka IS NULL THEN
        RAISE EXCEPTION 'Lapangan tidak ditemukan';
    END IF;
    IF EXTRACT(MINUTE FROM p_jam) <> 0 OR EXTRACT(SECOND FROM p_jam) <> 0 THEN
        RAISE EXCEPTION 'Jam harus tepat (contoh 19:00)';
    END IF;
    IF p_jam < v_buka OR p_jam >= v_tutup THEN
        RAISE EXCEPTION 'Jam di luar jam operasional (% - %)',
            to_char(v_buka, 'HH24:MI'), to_char(v_tutup, 'HH24:MI');
    END IF;
    IF (p_tanggal + p_jam) < (now() AT TIME ZONE 'Asia/Jakarta') THEN
        RAISE EXCEPTION 'Slot ini sudah lewat';
    END IF;

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

    -- Simpan nomor ke profil (sekali) agar kolom telepon terisi otomatis di booking berikutnya.
    UPDATE profiles SET no_telp = v_telp WHERE id = v_user AND no_telp IS NULL;

    RETURN v_id;
END;
$$;

-- 3. konfirmasi_pembayaran ("Set Lunas"). Khusus admin. terisi -> lunas.
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

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Booking tidak ditemukan';
    END IF;
    IF v_status <> 'terisi' THEN
        RAISE EXCEPTION 'Booking tidak dalam status terisi (status: %)', v_status;
    END IF;

    UPDATE payments
       SET status = 'dikonfirmasi', dikonfirmasi_pada = now(), dikonfirmasi_oleh = auth.uid()
     WHERE booking_id = p_booking;

    UPDATE bookings SET status = 'lunas' WHERE id = p_booking;
END;
$$;

-- 4. batalkan_booking. Pemain: hanya booking miliknya, status terisi, belum lewat waktu.
--    Admin: booking apa pun yang belum dibatalkan (termasuk lunas; tanpa refund).
CREATE OR REPLACE FUNCTION batalkan_booking(p_booking INT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_admin   BOOLEAN := is_admin();
    v_status  VARCHAR;
    v_tanggal DATE;
    v_jam     TIME;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Silakan login terlebih dahulu';
    END IF;

    SELECT status, tanggal, jam_mulai INTO v_status, v_tanggal, v_jam
    FROM bookings
    WHERE id = p_booking AND (user_id = auth.uid() OR v_admin)
    FOR UPDATE;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Booking tidak ditemukan';
    END IF;
    IF v_status = 'dibatalkan' THEN
        RAISE EXCEPTION 'Booking sudah dibatalkan';
    END IF;
    IF NOT v_admin THEN
        IF v_status = 'lunas' THEN
            RAISE EXCEPTION 'Booking yang sudah lunas hanya bisa dibatalkan oleh admin';
        END IF;
        IF (v_tanggal + v_jam) < (now() AT TIME ZONE 'Asia/Jakarta') THEN
            RAISE EXCEPTION 'Booking yang waktunya sudah lewat tidak bisa dibatalkan';
        END IF;
    END IF;

    UPDATE bookings SET status = 'dibatalkan' WHERE id = p_booking;
    UPDATE payments SET status = 'dibatalkan' WHERE booking_id = p_booking;
END;
$$;

-- 5. get_slot_terisi: slot yang sudah dipesan siapa pun (pemain tidak boleh membaca
--    booking orang lain, jadi hanya jam, status, dan penanda milik_saya yang dikembalikan).
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

-- 6. update_tarif: admin mengubah tarif weekday dan weekend satu lapangan. Hanya berlaku untuk
--    booking BARU (booking lama menyimpan harga saat dibuat).
CREATE OR REPLACE FUNCTION update_tarif(p_court INT, p_weekday NUMERIC, p_weekend NUMERIC)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Tidak punya akses';
    END IF;
    IF p_weekday IS NULL OR p_weekend IS NULL
       OR p_weekday < 1000 OR p_weekday > 10000000 OR p_weekday <> trunc(p_weekday)
       OR p_weekend < 1000 OR p_weekend > 10000000 OR p_weekend <> trunc(p_weekend) THEN
        RAISE EXCEPTION 'Tarif harus bilangan bulat antara 1.000 dan 10.000.000';
    END IF;
    UPDATE courts SET harga_weekday = p_weekday, harga_weekend = p_weekend WHERE id = p_court;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lapangan tidak ditemukan';
    END IF;
END;
$$;

-- =====================================================================
-- LAPORAN (admin saja)
-- =====================================================================

-- 7. Ringkasan 4 kartu di halaman Laporan. Selalu mengembalikan 1 baris (0 jika belum ada booking).
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

-- 8. Pendapatan per lapangan per bulan (JOIN + COUNT + SUM; hanya booking lunas). Untuk demo IK301.
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

-- 9. Lima jam paling ramai per bulan (semua lapangan). Kosong jika belum ada booking.
CREATE OR REPLACE FUNCTION laporan_jam_ramai(p_bulan DATE)
RETURNS TABLE (jam TEXT, jumlah_booking BIGINT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Tidak punya akses'; END IF;
    RETURN QUERY
        SELECT to_char(b.jam_mulai, 'HH24:MI'), COUNT(*)
        FROM bookings b
        WHERE b.status <> 'dibatalkan'
          AND date_trunc('month', b.tanggal) = date_trunc('month', p_bulan)
        GROUP BY b.jam_mulai
        ORDER BY 2 DESC, b.jam_mulai
        LIMIT 5;
END;
$$;

-- =====================================================================
-- VIEW halaman admin. security_invoker = RLS pemanggil tetap berlaku
-- (admin melihat semua, pemain hanya miliknya).
-- =====================================================================

-- 10. Tab "Jadwal Harian". Kosong jika belum ada booking pada tanggal itu.
--     Frontend: .from('v_jadwal_harian').select('*').eq('tanggal', '2026-10-21').order('jam_mulai')
CREATE OR REPLACE VIEW v_jadwal_harian WITH (security_invoker = true) AS
SELECT b.id AS booking_id, b.kode_booking, b.tanggal, b.jam_mulai, b.jam_selesai,
       c.nama_lapangan AS lapangan, b.nama_pemesan AS pemain, b.no_telp,
       b.metode_bayar, b.status, b.total_harga
FROM bookings b
JOIN courts c ON c.id = b.court_id
WHERE b.status <> 'dibatalkan';

-- 11. Tab "Konfirmasi Pembayaran": semua booking (terisi, lunas, dibatalkan), terbaru di atas.
--     dibatalkan_oleh = 'pemain' atau 'admin' (dari booking_logs), NULL jika tidak dibatalkan.
CREATE OR REPLACE VIEW v_daftar_pembayaran WITH (security_invoker = true) AS
SELECT b.id AS booking_id, b.kode_booking, b.nama_pemesan AS pemain, b.no_telp,
       c.nama_lapangan AS lapangan, b.tanggal, b.jam_mulai, b.jam_selesai,
       b.total_harga, b.metode_bayar, b.status, b.created_at,
       CASE WHEN b.status = 'dibatalkan' THEN COALESCE(x.role, 'pemain') END AS dibatalkan_oleh
FROM bookings b
JOIN courts c ON c.id = b.court_id
LEFT JOIN LATERAL (
    SELECT pr.role
    FROM booking_logs l
    JOIN profiles pr ON pr.id = l.changed_by
    WHERE l.booking_id = b.id AND l.status_baru = 'dibatalkan'
    ORDER BY l.id DESC
    LIMIT 1
) x ON true;
