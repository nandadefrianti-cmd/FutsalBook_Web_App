-- =====================================================================
-- FutsalBook - database/triggers.sql
-- BAGIAN 3 dari 5. Jalankan SETELAH functions.sql.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Audit status booking (pengembangan dari file lama).
--    Beda dengan versi lama: juga mencatat saat booking DIBUAT (status_lama = NULL)
--    dan siapa yang mengubah (changed_by).
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO booking_logs (booking_id, status_lama, status_baru, changed_by, waktu)
        VALUES (NEW.id, NULL, NEW.status, auth.uid(), NOW());
    ELSIF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO booking_logs (booking_id, status_lama, status_baru, changed_by, waktu)
        VALUES (NEW.id, OLD.status, NEW.status, auth.uid(), NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_booking_status_audit
AFTER INSERT OR UPDATE OF status ON bookings
FOR EACH ROW
EXECUTE FUNCTION log_booking_status_change();

-- ---------------------------------------------------------------------
-- 2. Saat pengguna mendaftar di Supabase Auth, otomatis buat baris profiles.
--    Frontend mengirim nama lewat:
--      supabase.auth.signUp({ email, password, options: { data: { nama } } })
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nama)
    VALUES (
        NEW.id,
        COALESCE(NULLIF(trim(NEW.raw_user_meta_data->>'nama'), ''), split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();