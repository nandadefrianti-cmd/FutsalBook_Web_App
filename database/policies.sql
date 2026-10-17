-- =====================================================================
-- FutsalBook - database/policies.sql
-- BAGIAN 4 dari 5. Row Level Security (RLS) + Storage. Jalankan SETELAH triggers.sql.
-- Prinsip: pemain TIDAK punya hak INSERT/UPDATE langsung pada bookings & payments,
-- semua perubahan wajib lewat fungsi di functions.sql (yang memvalidasi aturan).
-- =====================================================================

ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues       ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_rules  ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_logs ENABLE ROW LEVEL SECURITY;

-- Profil: lihat milik sendiri; admin melihat semua. (Tidak ada UPDATE => role tak bisa dinaikkan sendiri.)
CREATE POLICY profiles_select ON profiles
    FOR SELECT TO authenticated USING (id = auth.uid() OR is_admin());

-- Data master: boleh dibaca siapa pun, termasuk pengunjung yang belum login,
-- karena halaman Beranda menampilkan daftar lapangan dan harga "mulai dari".
-- (F8: lapangan & tarif, baca saja)
CREATE POLICY venues_select ON venues
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY courts_select ON courts
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY price_rules_select ON price_rules
    FOR SELECT TO anon, authenticated USING (true);

-- Booking: pemain hanya melihat miliknya; admin melihat semua.
CREATE POLICY bookings_select ON bookings
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_admin());

-- Pembayaran: pemilik booking atau admin.
CREATE POLICY payments_select ON payments
    FOR SELECT TO authenticated
    USING (is_admin() OR EXISTS (
        SELECT 1 FROM bookings b WHERE b.id = payments.booking_id AND b.user_id = auth.uid()
    ));

-- Log: hanya admin.
CREATE POLICY logs_select ON booking_logs
    FOR SELECT TO authenticated USING (is_admin());

-- ---------------------------------------------------------------------
-- STORAGE: bucket foto bukti bayar. Path file wajib: <user_id>/<nama_file>
-- ---------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('bukti-bayar', 'bukti-bayar', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY bukti_upload ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'bukti-bayar' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY bukti_read ON storage.objects
    FOR SELECT USING (bucket_id = 'bukti-bayar');