BEGIN;
-- Menggunakan hitung_harga agar otomatis menyesuaikan tarif hari (Weekday/Weekend)
INSERT INTO bookings (user_id, court_id, tanggal, jam_mulai, jam_selesai, nama_pemesan, no_telp, metode_bayar, total_harga)
VALUES ((SELECT id FROM profiles LIMIT 1), 1, CURRENT_DATE + 1, '19:00', '20:00', 'Demo', '081200000000', 'QRIS', hitung_harga(1, CURRENT_DATE + 1));

-- A2 (ERROR: duplicate key value violates unique constraint "uq_slot_aktif")
INSERT INTO bookings (user_id, court_id, tanggal, jam_mulai, jam_selesai, nama_pemesan, no_telp, metode_bayar, total_harga)
VALUES ((SELECT id FROM profiles LIMIT 1), 1, CURRENT_DATE + 1, '19:00', '20:00', 'Demo', '081200000000', 'QRIS', hitung_harga(1, CURRENT_DATE + 1));
-- A3
ROLLBACK;
-- A4 (harus 0 baris)
SELECT * FROM bookings WHERE court_id = 1 AND tanggal = CURRENT_DATE + 1 AND jam_mulai = '19:00';

-- BAGIAN B. TRIGGER: log perubahan status (buat/konfirmasi/batalkan booking lewat aplikasi dulu)
SELECT waktu, booking_id, status_lama, status_baru FROM booking_logs ORDER BY waktu DESC LIMIT 10;

-- BAGIAN C. DATA DUMMY BESAR untuk demo index (~32.000 baris, tanggal lampau)
-- Menggunakan hitung_harga(c.id, d::DATE) agar harga sesuai hari di tanggal tersebut
INSERT INTO bookings (user_id, court_id, tanggal, jam_mulai, jam_selesai, nama_pemesan, no_telp, metode_bayar, status, total_harga)
SELECT (SELECT id FROM profiles LIMIT 1), c.id, d::DATE,
       make_time(h, 0, 0), make_time(h + 1, 0, 0), 'Dummy', '081200000000', 'QRIS', 'lunas', hitung_harga(c.id, d::DATE)
FROM courts c,
     generate_series(CURRENT_DATE - 800, CURRENT_DATE - 70, INTERVAL '1 day') AS d,
     generate_series(8, 22) AS h;
SELECT COUNT(*) FROM bookings;

-- BAGIAN D. EXPLAIN SEBELUM vs SESUDAH INDEX
-- D1. Tanpa index
DROP INDEX IF EXISTS idx_court_tanggal;
ANALYZE bookings;
EXPLAIN ANALYZE SELECT jam_mulai, status FROM bookings WHERE court_id = 1 AND tanggal = CURRENT_DATE - 100;
-- D2. Dengan index
CREATE INDEX idx_court_tanggal ON bookings (court_id, tanggal);
ANALYZE bookings;
EXPLAIN ANALYZE SELECT jam_mulai, status FROM bookings WHERE court_id = 1 AND tanggal = CURRENT_DATE - 100;

-- BAGIAN E. LAPORAN (JOIN + agregasi), versi SQL Editor (tanpa cek admin)
SELECT c.nama_lapangan AS lapangan, COUNT(b.id) AS jumlah_booking, SUM(b.total_harga) AS total_pendapatan
FROM courts c LEFT JOIN bookings b ON b.court_id = c.id AND b.status = 'lunas'
GROUP BY c.id, c.nama_lapangan ORDER BY total_pendapatan DESC NULLS LAST;

-- BAGIAN F. BERSIHKAN data dummy (WAJIB sebelum demo aplikasi agar angka admin kembali nol)
DELETE FROM bookings WHERE nama_pemesan = 'Dummy';
SELECT COUNT(*) FROM bookings;