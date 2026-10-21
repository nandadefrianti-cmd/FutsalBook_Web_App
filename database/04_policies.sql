ALTER TABLE profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues       ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_logs ENABLE ROW LEVEL SECURITY;

-- Policy SELECT
CREATE POLICY profiles_select ON profiles
    FOR SELECT TO authenticated USING (id = auth.uid() OR is_admin());

CREATE POLICY venues_select ON venues FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY courts_select ON courts FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY bookings_select ON bookings
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_admin());

CREATE POLICY payments_select ON payments
    FOR SELECT TO authenticated
    USING (is_admin() OR EXISTS (
        SELECT 1 FROM bookings b WHERE b.id = payments.booking_id AND b.user_id = auth.uid()));

CREATE POLICY logs_select ON booking_logs
    FOR SELECT TO authenticated USING (is_admin());

-- ---------------------------------------------------------------------
-- Hak eksekusi fungsi: hanya pengguna login.
-- ---------------------------------------------------------------------
REVOKE ALL ON FUNCTION is_admin()                                         FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION create_booking(INT, DATE, TIME, TEXT, TEXT, TEXT)  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION konfirmasi_pembayaran(INT)                         FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION batalkan_booking(INT)                              FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION get_slot_terisi(INT, DATE)                         FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION update_tarif(INT, NUMERIC, NUMERIC)                FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION laporan_ringkasan()                                FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION laporan_pendapatan(DATE)                           FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION is_admin()                                        TO authenticated;
GRANT EXECUTE ON FUNCTION create_booking(INT, DATE, TIME, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION konfirmasi_pembayaran(INT)                        TO authenticated;
GRANT EXECUTE ON FUNCTION batalkan_booking(INT)                             TO authenticated;
GRANT EXECUTE ON FUNCTION get_slot_terisi(INT, DATE)                        TO authenticated;
GRANT EXECUTE ON FUNCTION update_tarif(INT, NUMERIC, NUMERIC)               TO authenticated;
GRANT EXECUTE ON FUNCTION laporan_ringkasan()                               TO authenticated;
GRANT EXECUTE ON FUNCTION laporan_pendapatan(DATE)                          TO authenticated;