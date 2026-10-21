INSERT INTO venues (nama_tempat, alamat, jam_buka, jam_tutup)
VALUES ('FutsalBook Arena', 'Jl. Akses UI No. 45, Depok', '08:00', '23:00');

-- Mengisi harga_weekday dan harga_weekend sesuai UI aplikasi
INSERT INTO courts (venue_id, nama_lapangan, jenis_lantai, deskripsi, harga_weekday, harga_weekend)
SELECT v.id, x.nama, x.lantai, x.deskripsi, x.h_weekday, x.h_weekend
FROM venues v,
     (VALUES ('Lapangan A', 'Vinyl',           'Indoor Standard', 150000, 180000),
             ('Lapangan B', 'Vinyl',           'Turnamen Resmi',  150000, 180000),
             ('Lapangan C', 'Rumput Sintetis', NULL,               80000, 100000)) 
     AS x(nama, lantai, deskripsi, h_weekday, h_weekend);

INSERT INTO profiles (id, nama, no_telp)
SELECT u.id,
       CASE WHEN length(COALESCE(NULLIF(trim(u.raw_user_meta_data->>'nama'), ''), split_part(COALESCE(u.email, ''), '@', 1))) >= 2
            THEN left(COALESCE(NULLIF(trim(u.raw_user_meta_data->>'nama'), ''), split_part(COALESCE(u.email, ''), '@', 1)), 100)
            ELSE 'Pemain' END,
       NULL
FROM auth.users u
ON CONFLICT (id) DO NOTHING;