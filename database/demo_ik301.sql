-- =====================================================================
-- FutsalBook - database/demo_ik301.sql
-- BUKAN bagian instalasi. Bahan DEMO IK301: transaksi, trigger, index EXPLAIN, laporan.
-- Jalankan per BAGIAN (blok-blok di bawah), jangan sekaligus.
-- Syarat: kelima file lain sudah dijalankan dan minimal 1 akun sudah terdaftar.
-- =====================================================================

-- ---------------------------------------------------------------------
-- BAGIAN A. TRANSAKSI + ROLLBACK
-- Blok ini disusun agar seluruhnya gagal bersih: slot yang sama dipesan 2 kali,
-- kedua kali melanggar uq_slot_aktif -> error -> ROLLBACK -> tidak ada yang tersimpan.
-- CARA: blok A1+A2+A3 dijalankan SEKALIGUS (blok/sorot dari BEGIN sampai ROLLBACK, klik Run).
-- Eksekusi berhenti di A2 dengan error, dan Supabase membatalkan transaksinya. Setelah itu jalankan A4.
-- ---------------------------------------------------------------------
-- A1
BEGIN;
INSERT INTO bookings (user_id, court_id, tanggal, jam_mulai, jam_selesai, total_harga)
VALUES ((SELECT id FROM profiles LIMIT 1), 1, CURRENT_DATE + 1, '19:00', '20:00', 150000);

-- A2 (INI AKAN ERROR: duplicate key value violates unique constraint "uq_slot_aktif")
INSERT INTO bookings (user_id, court_id, tanggal, jam_mulai, jam_selesai, total_harga)
VALUES ((SELECT id FROM profiles LIMIT 1), 1, CURRENT_DATE + 1, '19:00', '20:00', 150000);

-- A3
ROLLBACK;

-- A4 (hasil harus 0 baris)
SELECT * FROM bookings WHERE court_id = 1 AND tanggal = CURRENT_DATE + 1 AND jam_mulai = '19:00';

-- ---------------------------------------------------------------------
-- BAGIAN B. TRIGGER: lihat log perubahan status
-- (buat/konfirmasi/batalkan booking lewat aplikasi dulu).
-- ---------------------------------------------------------------------
SELECT waktu, booking_id, status_lama, status_baru
FROM booking_logs
ORDER BY waktu DESC
LIMIT 10;

-- ---------------------------------------------------------------------
-- BAGIAN C. DATA DUMMY BESAR untuk demo index (sekitar 32.000 baris)
-- Tanggal di masa lalu (800 s.d. 70 hari lalu) supaya tidak mengganggu jadwal asli.
-- ---------------------------------------------------------------------
INSERT INTO bookings (user_id, court_id, tanggal, jam_mulai, jam_selesai, status, total_harga)
SELECT (SELECT id FROM profiles LIMIT 1), c.id, d::DATE,
       make_time(h, 0, 0), make_time(h + 1, 0, 0), 'lunas', 100000
FROM courts c,
     generate_series(CURRENT_DATE - 800, CURRENT_DATE - 70, INTERVAL '1 day') AS d,
     generate_series(8, 22) AS h;

SELECT COUNT(*) FROM bookings;   -- catat jumlahnya

-- ---------------------------------------------------------------------
-- BAGIAN D. EXPLAIN SEBELUM vs SESUDAH INDEX
-- ---------------------------------------------------------------------
-- D1. Tanpa index
DROP INDEX IF EXISTS idx_court_tanggal;
ANALYZE bookings;

EXPLAIN ANALYZE
SELECT jam_mulai, status FROM bookings
WHERE court_id = 1 AND tanggal = CURRENT_DATE - 100;
-- Screenshot: "Seq Scan on bookings" + "Execution Time".

-- D2. Dengan index
CREATE INDEX idx_court_tanggal ON bookings (court_id, tanggal);
ANALYZE bookings;

EXPLAIN ANALYZE
SELECT jam_mulai, status FROM bookings
WHERE court_id = 1 AND tanggal = CURRENT_DATE - 100;
-- Screenshot: "Index Scan / Bitmap Index Scan using idx_court_tanggal" + "Execution Time" lebih kecil.

-- ---------------------------------------------------------------------
-- BAGIAN E. LAPORAN (JOIN + agregasi), versi SQL Editor (tanpa cek admin)
-- ---------------------------------------------------------------------
SELECT c.nama_lapangan AS lapangan, COUNT(b.id) AS jumlah_booking, SUM(b.total_harga) AS total_pendapatan
FROM courts c
LEFT JOIN bookings b ON b.court_id = c.id AND b.status = 'lunas'
GROUP BY c.id, c.nama_lapangan
ORDER BY total_pendapatan DESC NULLS LAST;

-- ---------------------------------------------------------------------
-- BAGIAN F. BERSIHKAN data dummy setelah demo/screenshot
-- ---------------------------------------------------------------------
DELETE FROM bookings WHERE tanggal < CURRENT_DATE - 60;
SELECT COUNT(*) FROM bookings;