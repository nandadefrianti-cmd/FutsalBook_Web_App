-- =====================================================================
-- FutsalBook - database/05_seed.sql
-- Data awal: 1 venue, 3 lapangan (tarif weekday dan weekend), dan profil untuk akun yang SUDAH ada di Supabase Auth.
-- TIDAK ada data booking: halaman admin dan Booking Saya kosong/nol sampai pemain memesan.
-- =====================================================================

INSERT INTO venues (nama_tempat, alamat, jam_buka, jam_tutup)
VALUES ('FutsalBook Arena', 'Jl. Akses UI No. 45, Depok', '08:00', '23:00');

INSERT INTO courts (venue_id, nama_lapangan, jenis_lantai, deskripsi, harga_weekday, harga_weekend)
SELECT v.id, x.nama, x.lantai, x.deskripsi, x.hari_kerja, x.akhir_pekan
FROM venues v,
     (VALUES ('Lapangan A', 'Vinyl',           'Indoor Standard', 150000, 180000),
             ('Lapangan B', 'Vinyl',           'Turnamen Resmi',  150000, 180000),
             ('Lapangan C', 'Rumput Sintetis', NULL,              120000, 150000)) AS x(nama, lantai, deskripsi, hari_kerja, akhir_pekan);

-- Akun yang sudah terdaftar sebelum reset tidak punya profil lagi: buatkan (role pemain).
INSERT INTO profiles (id, nama, no_telp)
SELECT u.id,
       CASE WHEN length(COALESCE(NULLIF(trim(u.raw_user_meta_data->>'nama'), ''), split_part(COALESCE(u.email, ''), '@', 1))) >= 2
            THEN left(COALESCE(NULLIF(trim(u.raw_user_meta_data->>'nama'), ''), split_part(COALESCE(u.email, ''), '@', 1)), 100)
            ELSE 'Pemain' END,
       NULL
FROM auth.users u
ON CONFLICT (id) DO NOTHING;
