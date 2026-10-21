DROP TRIGGER IF EXISTS trg_new_user ON auth.users;

DROP VIEW IF EXISTS v_jadwal_harian, v_konfirmasi_pembayaran, v_daftar_pembayaran CASCADE;

DROP TABLE IF EXISTS booking_logs, payments, bookings, price_rules, courts, venues, profiles CASCADE;

DROP FUNCTION IF EXISTS create_booking(INT, DATE, TIME)                      CASCADE;
DROP FUNCTION IF EXISTS create_booking(INT, DATE, TIME, TEXT)                CASCADE;
DROP FUNCTION IF EXISTS create_booking(INT, DATE, TIME, TEXT, TEXT, TEXT)    CASCADE;
DROP FUNCTION IF EXISTS upload_bukti(INT, TEXT)                              CASCADE;
DROP FUNCTION IF EXISTS konfirmasi_pembayaran(INT)                           CASCADE;
DROP FUNCTION IF EXISTS batalkan_booking(INT)                                CASCADE;
DROP FUNCTION IF EXISTS get_slot_terisi(INT, DATE)                           CASCADE;
DROP FUNCTION IF EXISTS hitung_harga(INT, DATE, TIME)                        CASCADE;
DROP FUNCTION IF EXISTS laporan_pendapatan(DATE)                             CASCADE;
DROP FUNCTION IF EXISTS laporan_okupansi(DATE)                               CASCADE;
DROP FUNCTION IF EXISTS laporan_jam_ramai(DATE)                              CASCADE;
DROP FUNCTION IF EXISTS laporan_ringkasan()                                  CASCADE;
DROP FUNCTION IF EXISTS update_tarif(INT, NUMERIC)                           CASCADE;
DROP FUNCTION IF EXISTS is_admin()                                           CASCADE;
DROP FUNCTION IF EXISTS log_booking_status_change()                          CASCADE;
DROP FUNCTION IF EXISTS handle_new_user()                                    CASCADE;

DO $$
BEGIN
    DROP POLICY IF EXISTS bukti_upload ON storage.objects;
    DROP POLICY IF EXISTS bukti_read   ON storage.objects;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Policy storage dilewati: %', SQLERRM;
END $$;
