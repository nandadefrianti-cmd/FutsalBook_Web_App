-- =====================================================================
-- FutsalBook - database/seed.sql
-- BAGIAN 5 dari 5. Data awal. Jalankan SEKALI, paling akhir.
-- Harga dibuat rapi supaya konsisten dengan tab "Tarif" di UI.
-- =====================================================================

INSERT INTO venues (nama_tempat, alamat, jam_buka, jam_tutup)
VALUES ('FutsalBook Arena', 'Jl. Contoh No. 1, Jakarta', '08:00', '23:00');

-- Slot terakhir mulai 22:00 (selesai 23:00).
INSERT INTO courts (venue_id, nama_lapangan, jenis_lantai)
SELECT v.id, x.nama, x.lantai
FROM venues v,
     (VALUES ('Lapangan A', 'Vinyl'),
             ('Lapangan B', 'Vinyl'),
             ('Lapangan C', 'Rumput Sintetis')) AS x(nama, lantai);

-- Tarif per jam. Lapangan C (rumput sintetis) lebih murah.
-- kolom: jenis_hari, jam_mulai, jam_selesai, harga_vinyl, harga_rumput
INSERT INTO price_rules (court_id, jenis_hari, jam_mulai, jam_selesai, harga)
SELECT c.id, r.hari, r.jm::TIME, r.js::TIME,
       CASE WHEN c.jenis_lantai = 'Vinyl' THEN r.h_vinyl ELSE r.h_rumput END
FROM courts c,
     (VALUES ('weekday', '08:00', '15:00', 100000, 80000),
             ('weekday', '15:00', '23:00', 150000, 120000),
             ('weekend', '08:00', '15:00', 130000, 100000),
             ('weekend', '15:00', '23:00', 180000, 150000)) AS r(hari, jm, js, h_vinyl, h_rumput);

-- =====================================================================
-- SETELAH SEED: daftar 1 akun lewat aplikasi (atau Supabase > Authentication > Users > Add user),
-- lalu jadikan akun itu admin dengan menjalankan (ganti emailnya):
--
--   UPDATE profiles SET role = 'admin'
--   WHERE id = (SELECT id FROM auth.users WHERE email = 'EMAIL_ADMIN_KAMU');
-- =====================================================================