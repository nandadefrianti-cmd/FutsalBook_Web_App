-- =====================================================================
-- FutsalBook - database/functions.sql
-- BAGIAN 2 dari 5. Fungsi (logika bisnis + transaksi), laporan, dan view.
-- Jalankan SETELAH schema.sql.
-- Semua fungsi memakai "security definer": berjalan dengan hak pemilik database
-- sehingga pemain tidak perlu hak langsung ke tabel (aman bersama RLS di policies.sql).
-- Setiap fungsi = SATU TRANSAKSI. Jika ada error di tengah, semua perubahan dibatalkan.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. is_admin(): apakah pengguna yang sedang login berperan admin?
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
    SELECT COALESCE((SELECT role = 'admin' FROM profiles WHERE id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------------
-- 2. hitung_harga(lapangan, tanggal, jam): tarif 1 jam dari price_rules.
--    Sabtu/Minggu memakai tarif 'weekend', selain itu 'weekday'.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION hitung_harga(p_court INT, p_tanggal DATE, p_jam TIME)
RETURNS NUMERIC
LANGUAGE plpgsql STABLE SET search_path = public
AS $$
DECLARE
    v_jenis_hari TEXT;
    v_harga      NUMERIC;
BEGIN
    IF EXTRACT(ISODOW FROM p_tanggal) IN (6, 7) THEN
        v_jenis_hari := 'weekend';
    ELSE
        v_jenis_hari := 'weekday';
    END IF;

    SELECT harga INTO v_harga
    FROM price_rules
    WHERE court_id   = p_court
      AND jenis_hari = v_jenis_hari
      AND p_jam >= jam_mulai
      AND p_jam <  jam_selesai
    LIMIT 1;

    IF v_harga IS NULL THEN
        RAISE EXCEPTION 'Tarif untuk jam % belum diatur', to_char(p_jam, 'HH24:MI');
    END IF;
    RETURN v_harga;
END;
$$;

-- ---------------------------------------------------------------------
-- 3. create_booking (F3). Dipanggil: supabase.rpc('create_booking', {...})
--    Mengembalikan id booking baru. Pesan error yang mungkin muncul:
--      'Slot sudah terisi'  <- ditangkap dari unique_violation (dialog error di UI)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_booking(p_court INT, p_tanggal DATE, p_jam TIME)
RETURNS INT
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_user   UUID := auth.uid();
    v_buka   TIME;
    v_tutup  TIME;
    v_harga  NUMERIC;
    v_id     INT;
BEGIN
    IF v_user IS NULL THEN
        RAISE EXCEPTION 'Silakan login terlebih dahulu';
    END IF;

    SELECT v.jam_buka, v.jam_tutup INTO v_buka, v_tutup
    FROM courts c JOIN venues v ON v.id = c.venue_id
    WHERE c.id = p_court;

    IF v_buka IS NULL THEN
        RAISE EXCEPTION 'Lapangan tidak ditemukan';
    END IF;
    IF EXTRACT(MINUTE FROM p_jam) <> 0 THEN
        RAISE EXCEPTION 'Jam harus tepat (contoh 19:00)';
    END IF;
    IF p_jam < v_buka OR p_jam >= v_tutup THEN
        RAISE EXCEPTION 'Jam di luar jam operasional (% - %)',
            to_char(v_buka, 'HH24:MI'), to_char(v_tutup, 'HH24:MI');
    END IF;
    IF (p_tanggal + p_jam) < (now() AT TIME ZONE 'Asia/Jakarta') THEN
        RAISE EXCEPTION 'Slot ini sudah lewat';
    END IF;

    v_harga := hitung_harga(p_court, p_tanggal, p_jam);

    BEGIN
        INSERT INTO bookings (user_id, court_id, tanggal, jam_mulai, jam_selesai, total_harga)
        VALUES (v_user, p_court, p_tanggal, p_jam, p_jam + INTERVAL '1 hour', v_harga)
        RETURNING id INTO v_id;
    EXCEPTION WHEN unique_violation THEN
        RAISE EXCEPTION 'Slot sudah terisi';
    END;

    RETURN v_id;
END;
$$;

-- ---------------------------------------------------------------------
-- 4. upload_bukti (F4). Menyimpan URL bukti bayar dan mengubah status booking
--    menjadi menunggu_konfirmasi. Boleh unggah ulang selama belum lunas.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION upload_bukti(p_booking INT, p_url TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_status VARCHAR;
    v_total  NUMERIC;
BEGIN
    IF COALESCE(trim(p_url), '') = '' THEN
        RAISE EXCEPTION 'Bukti bayar wajib diunggah';
    END IF;

    SELECT status, total_harga INTO v_status, v_total
    FROM bookings
    WHERE id = p_booking AND user_id = auth.uid()
    FOR UPDATE;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Booking tidak ditemukan';
    END IF;
    IF v_status NOT IN ('pending', 'menunggu_konfirmasi') THEN
        RAISE EXCEPTION 'Booking ini tidak bisa diunggah bukti (status: %)', v_status;
    END IF;

    INSERT INTO payments (booking_id, jumlah, bukti_url)
    VALUES (p_booking, v_total, p_url)
    ON CONFLICT (booking_id)
    DO UPDATE SET bukti_url = EXCLUDED.bukti_url,
                  waktu_bayar = now(),
                  status = 'menunggu_konfirmasi';

    UPDATE bookings SET status = 'menunggu_konfirmasi' WHERE id = p_booking;
END;
$$;

-- ---------------------------------------------------------------------
-- 5. konfirmasi_pembayaran (F6). Khusus admin.
-- ---------------------------------------------------------------------
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

    IF v_status IS DISTINCT FROM 'menunggu_konfirmasi' THEN
        RAISE EXCEPTION 'Booking tidak dalam status menunggu konfirmasi';
    END IF;

    UPDATE payments
       SET status = 'dikonfirmasi',
           dikonfirmasi_pada = now(),
           dikonfirmasi_oleh = auth.uid()
     WHERE booking_id = p_booking;

    UPDATE bookings SET status = 'lunas' WHERE id = p_booking;
END;
$$;

-- ---------------------------------------------------------------------
-- 6. batalkan_booking (F5). Pemilik booking atau admin.
--    ATURAN SAAT INI: booking yang sudah lunas BOLEH dibatalkan, tanpa refund
--    (tulis di README). Untuk melarangnya, hapus tanda "--" pada 3 baris IF di bawah.
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION batalkan_booking(p_booking INT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_status VARCHAR;
BEGIN
    SELECT status INTO v_status
    FROM bookings
    WHERE id = p_booking AND (user_id = auth.uid() OR is_admin())
    FOR UPDATE;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Booking tidak ditemukan';
    END IF;
    IF v_status = 'dibatalkan' THEN
        RAISE EXCEPTION 'Booking sudah dibatalkan';
    END IF;
    -- IF v_status = 'lunas' THEN
    --     RAISE EXCEPTION 'Booking yang sudah lunas tidak bisa dibatalkan';
    -- END IF;

    UPDATE bookings SET status = 'dibatalkan' WHERE id = p_booking;
END;
$$;

-- ---------------------------------------------------------------------
-- 7. get_slot_terisi (F2). Slot yang sudah dipesan siapa pun pada lapangan+tanggal.
--    Pemain biasa tidak boleh membaca booking orang lain, jadi lewat fungsi ini
--    yang hanya mengembalikan jam, status, dan penanda milik_saya.
-- ---------------------------------------------------------------------
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

-- =====================================================================
-- LAPORAN (F9, 3 tabel). Parameter p_bulan = tanggal mana pun di bulan tsb.
-- Contoh: SELECT * FROM laporan_pendapatan('2026-10-01');
-- =====================================================================

-- 8. Pendapatan per lapangan (JOIN + COUNT + SUM; hanya booking lunas).
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

-- 9. Okupansi per lapangan = slot terisi / total slot sebulan.
--    total slot = (jam operasional per hari) x (jumlah hari dalam bulan).
CREATE OR REPLACE FUNCTION laporan_okupansi(p_bulan DATE)
RETURNS TABLE (lapangan VARCHAR, slot_terisi BIGINT, total_slot INT, okupansi_persen NUMERIC)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    v_hari INT := EXTRACT(DAY FROM (date_trunc('month', p_bulan) + INTERVAL '1 month - 1 day'))::INT;
BEGIN
    IF NOT is_admin() THEN RAISE EXCEPTION 'Tidak punya akses'; END IF;
    RETURN QUERY
        SELECT c.nama_lapangan,
               COUNT(b.id),
               (FLOOR(EXTRACT(EPOCH FROM (v.jam_tutup - v.jam_buka)) / 3600)::INT) * v_hari,
               ROUND(100.0 * COUNT(b.id)
                     / ((FLOOR(EXTRACT(EPOCH FROM (v.jam_tutup - v.jam_buka)) / 3600)::INT) * v_hari), 1)
        FROM courts c
        JOIN venues v ON v.id = c.venue_id
        LEFT JOIN bookings b
               ON b.court_id = c.id
              AND b.status  <> 'dibatalkan'
              AND date_trunc('month', b.tanggal) = date_trunc('month', p_bulan)
        GROUP BY c.id, c.nama_lapangan, v.jam_buka, v.jam_tutup
        ORDER BY 4 DESC, c.nama_lapangan;
END;
$$;

-- 10. Lima jam paling ramai (semua lapangan digabung).
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
-- VIEW untuk halaman admin. security_invoker = aturan RLS pemanggil tetap berlaku
-- (admin melihat semua baris, pemain hanya miliknya).
-- =====================================================================

-- 11. F7 Jadwal harian. Frontend: .from('v_jadwal_harian').select('*').eq('tanggal', '2026-10-21')
CREATE OR REPLACE VIEW v_jadwal_harian WITH (security_invoker = true) AS
SELECT b.id AS booking_id, b.tanggal, b.jam_mulai, b.jam_selesai,
       c.nama_lapangan AS lapangan, p.nama AS pemain,
       b.status, b.total_harga
FROM bookings b
JOIN courts c   ON c.id = b.court_id
JOIN profiles p ON p.id = b.user_id
WHERE b.status <> 'dibatalkan';

-- 12. F6 Daftar pembayaran yang menunggu konfirmasi.
CREATE OR REPLACE VIEW v_konfirmasi_pembayaran WITH (security_invoker = true) AS
SELECT b.id AS booking_id, p.nama AS pemain, c.nama_lapangan AS lapangan,
       b.tanggal, b.jam_mulai, b.total_harga,
       pay.bukti_url, pay.waktu_bayar
FROM payments pay
JOIN bookings b ON b.id = pay.booking_id
JOIN courts c   ON c.id = b.court_id
JOIN profiles p ON p.id = b.user_id
WHERE b.status = 'menunggu_konfirmasi';