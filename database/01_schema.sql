-- 1. profiles: data pengguna.
CREATE TABLE profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama        VARCHAR(100) NOT NULL CHECK (length(trim(nama)) >= 2),
    no_telp     VARCHAR(15),
    role        VARCHAR(20)  NOT NULL DEFAULT 'pemain' CHECK (role IN ('pemain', 'admin')),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT check_profile_telp CHECK (no_telp IS NULL OR no_telp ~ '^(08|62)[0-9]{8,12}$')
);

-- 2. venues: tempat futsal + jam operasional.
CREATE TABLE venues (
    id          SERIAL PRIMARY KEY,
    nama_tempat VARCHAR(100) NOT NULL,
    alamat      TEXT NOT NULL,
    jam_buka    TIME NOT NULL DEFAULT '08:00',
    jam_tutup   TIME NOT NULL DEFAULT '23:00',
    CONSTRAINT check_jam_operasional CHECK (jam_tutup > jam_buka)
);

-- 3. courts: lapangan dengan tarif Weekday dan Weekend.
CREATE TABLE courts (
    id              SERIAL PRIMARY KEY,
    venue_id        INT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    nama_lapangan   VARCHAR(50) NOT NULL,
    jenis_lantai    VARCHAR(50) NOT NULL,
    deskripsi       VARCHAR(100),
    harga_weekday   NUMERIC(10,2) NOT NULL CHECK (harga_weekday >= 0),
    harga_weekend   NUMERIC(10,2) NOT NULL CHECK (harga_weekend >= 0),
    CONSTRAINT unique_nama_lapangan UNIQUE (venue_id, nama_lapangan)
);

-- 4. bookings: 1 baris = 1 slot 1 jam.
CREATE TABLE bookings (
    id            SERIAL PRIMARY KEY,
    kode_booking  TEXT GENERATED ALWAYS AS ('FB-' || lpad(id::text, 6, '0')) STORED,
    user_id       UUID NOT NULL REFERENCES profiles(id),
    court_id      INT  NOT NULL REFERENCES courts(id),
    tanggal       DATE NOT NULL,
    jam_mulai     TIME NOT NULL,
    jam_selesai   TIME NOT NULL,
    nama_pemesan  VARCHAR(100) NOT NULL CHECK (length(trim(nama_pemesan)) >= 2),
    no_telp       VARCHAR(15)  NOT NULL CHECK (no_telp ~ '^(08|62)[0-9]{8,12}$'),
    metode_bayar  VARCHAR(20)  NOT NULL CHECK (metode_bayar IN ('QRIS', 'DANA', 'GoPay', 'OVO')),
    status        VARCHAR(20)  NOT NULL DEFAULT 'terisi'
                  CHECK (status IN ('terisi', 'lunas', 'dibatalkan')),
    total_harga   NUMERIC(10,2) NOT NULL CHECK (total_harga >= 0),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_jam CHECK (jam_selesai > jam_mulai)
);

-- 5. payments: simulasi pembayaran.
CREATE TABLE payments (
    id                  SERIAL PRIMARY KEY,
    booking_id          INT NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    jumlah              NUMERIC(10,2) NOT NULL CHECK (jumlah >= 0),
    metode              VARCHAR(20) NOT NULL,
    status              VARCHAR(25) NOT NULL DEFAULT 'menunggu_konfirmasi'
                        CHECK (status IN ('menunggu_konfirmasi', 'dikonfirmasi', 'dibatalkan')),
    waktu_bayar         TIMESTAMPTZ NOT NULL DEFAULT now(),
    dikonfirmasi_pada   TIMESTAMPTZ,
    dikonfirmasi_oleh   UUID REFERENCES profiles(id)
);

-- 6. booking_logs: audit riwayat status.
CREATE TABLE booking_logs (
    id          SERIAL PRIMARY KEY,
    booking_id  INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    status_lama VARCHAR(20),
    status_baru VARCHAR(20) NOT NULL,
    changed_by  UUID,
    waktu       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEX
CREATE UNIQUE INDEX uq_slot_aktif ON bookings (court_id, tanggal, jam_mulai) WHERE status <> 'dibatalkan';
CREATE INDEX idx_court_tanggal   ON bookings (court_id, tanggal);
CREATE INDEX idx_bookings_user    ON bookings (user_id);
CREATE INDEX idx_logs_booking     ON booking_logs (booking_id);