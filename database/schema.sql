-- ---------------------------------------------------------------------
-- 1. profiles  (PENGGANTI tabel "users" di file lama)
--    Email + password disimpan Supabase Auth (tabel auth.users), jadi
--    kolom email dan password_hash TIDAK dibuat lagi. id sama dengan auth.users.id.
-- ---------------------------------------------------------------------
CREATE TABLE profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama        VARCHAR(100) NOT NULL CHECK (length(trim(nama)) >= 2),
    role        VARCHAR(20)  NOT NULL DEFAULT 'pemain' CHECK (role IN ('pemain', 'admin')),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------
-- 2. venues  (tempat futsal). jam_buka/jam_tutup = jam operasional.
--    Kolom pemilik_id dihapus: aplikasi hanya punya 1 tempat dan 1 peran admin.
-- ---------------------------------------------------------------------
CREATE TABLE venues (
    id          SERIAL PRIMARY KEY,
    nama_tempat VARCHAR(100) NOT NULL,
    alamat      TEXT NOT NULL,
    jam_buka    TIME NOT NULL DEFAULT '08:00',
    jam_tutup   TIME NOT NULL DEFAULT '23:00',
    CONSTRAINT check_jam_operasional CHECK (jam_tutup > jam_buka)
);

-- ---------------------------------------------------------------------
-- 3. courts  (lapangan)
-- ---------------------------------------------------------------------
CREATE TABLE courts (
    id              SERIAL PRIMARY KEY,
    venue_id        INT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    nama_lapangan   VARCHAR(50) NOT NULL,
    jenis_lantai    VARCHAR(50),
    CONSTRAINT unique_nama_lapangan UNIQUE (venue_id, nama_lapangan)
);

-- ---------------------------------------------------------------------
-- 4. price_rules  (tarif per jam, beda weekday/weekend dan beda rentang jam)
--    jam_selesai tidak ikut dihitung. Contoh 08:00-15:00 berarti jam 08..14.
-- ---------------------------------------------------------------------
CREATE TABLE price_rules (
    id          SERIAL PRIMARY KEY,
    court_id    INT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
    jenis_hari  VARCHAR(20) NOT NULL CHECK (jenis_hari IN ('weekday', 'weekend')),
    jam_mulai   TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    harga       NUMERIC(10,2) NOT NULL CHECK (harga >= 0),
    CONSTRAINT check_jam_tarif CHECK (jam_selesai > jam_mulai)
);

-- ---------------------------------------------------------------------
-- 5. bookings  (1 baris = 1 slot berdurasi 1 jam)
--    status:  pending              = belum bayar (default, sama dengan file lama)
--             menunggu_konfirmasi  = bukti sudah diunggah, menunggu admin
--             lunas                = admin sudah konfirmasi
--             dibatalkan           = dibatalkan pemain/admin
-- ---------------------------------------------------------------------
CREATE TABLE bookings (
    id          SERIAL PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES profiles(id),
    court_id    INT  NOT NULL REFERENCES courts(id),
    tanggal     DATE NOT NULL,
    jam_mulai   TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    status      VARCHAR(20) NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'menunggu_konfirmasi', 'lunas', 'dibatalkan')),
    total_harga NUMERIC(10,2) NOT NULL CHECK (total_harga >= 0),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_jam CHECK (jam_selesai > jam_mulai)
);

-- ---------------------------------------------------------------------
-- 6. payments  (bukti pembayaran; 1 booking = 1 pembayaran)
-- ---------------------------------------------------------------------
CREATE TABLE payments (
    id                  SERIAL PRIMARY KEY,
    booking_id          INT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    jumlah              NUMERIC(10,2) NOT NULL CHECK (jumlah >= 0),
    metode              VARCHAR(50) DEFAULT 'transfer',
    bukti_url           TEXT NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'menunggu_konfirmasi'
                        CHECK (status IN ('menunggu_konfirmasi', 'dikonfirmasi')),
    waktu_bayar         TIMESTAMPTZ DEFAULT now(),
    dikonfirmasi_pada   TIMESTAMPTZ,
    dikonfirmasi_oleh   UUID REFERENCES profiles(id)
);

-- ---------------------------------------------------------------------
-- 7. booking_logs  (riwayat status; diisi OTOMATIS oleh trigger di triggers.sql)
-- ---------------------------------------------------------------------
CREATE TABLE booking_logs (
    id          SERIAL PRIMARY KEY,
    booking_id  INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    status_lama VARCHAR(20),
    status_baru VARCHAR(20) NOT NULL,
    changed_by  UUID,
    waktu       TIMESTAMPTZ DEFAULT now()
);

-- =====================================================================
-- INDEX
-- =====================================================================

-- A. ANTI DOUBLE BOOKING. Satu slot hanya boleh punya SATU booking aktif.
--    Ini menggantikan "CONSTRAINT unique_slot UNIQUE (...)" di file lama, karena
--    UNIQUE biasa akan MENGUNCI slot selamanya walaupun bookingnya sudah dibatalkan.
--    Versi "partial" ini mengabaikan booking berstatus dibatalkan.
CREATE UNIQUE INDEX uq_slot_aktif
    ON bookings (court_id, tanggal, jam_mulai)
    WHERE status <> 'dibatalkan';

-- B. INDEX PERFORMA untuk query jadwal "lapangan X pada tanggal Y" (dipakai di demo EXPLAIN).
CREATE INDEX idx_court_tanggal ON bookings (court_id, tanggal);

-- C. Index pendukung.
CREATE INDEX idx_bookings_user ON bookings (user_id);
CREATE INDEX idx_logs_booking  ON booking_logs (booking_id);