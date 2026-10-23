-- =====================================================================
-- FutsalBook - database/03_triggers.sql
-- =====================================================================

-- 1. Audit status booking: mencatat saat dibuat (status_lama NULL) dan setiap perubahan status.
CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO booking_logs (booking_id, status_lama, status_baru, changed_by)
        VALUES (NEW.id, NULL, NEW.status, auth.uid());
    ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO booking_logs (booking_id, status_lama, status_baru, changed_by)
        VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_booking_status_audit
AFTER INSERT OR UPDATE OF status ON bookings
FOR EACH ROW
EXECUTE FUNCTION log_booking_status_change();

-- 2. Saat pengguna mendaftar di Supabase Auth, otomatis buat baris profiles (role pemain).
--    Frontend: supabase.auth.signUp({ email, password, options: { data: { nama, no_telp } } })
--    Nomor tidak valid diabaikan (pendaftaran tidak digagalkan). Nama terlalu pendek diganti 'Pemain'.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_telp TEXT := regexp_replace(COALESCE(NEW.raw_user_meta_data->>'no_telp', ''), '[^0-9]', '', 'g');
    v_nama TEXT := COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'nama'), ''), split_part(COALESCE(NEW.email, ''), '@', 1));
BEGIN
    IF v_telp !~ '^(08|62)[0-9]{8,12}$' THEN
        v_telp := NULL;
    END IF;
    IF length(v_nama) < 2 THEN
        v_nama := 'Pemain';
    END IF;
    INSERT INTO public.profiles (id, nama, no_telp) VALUES (NEW.id, left(v_nama, 100), v_telp);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
