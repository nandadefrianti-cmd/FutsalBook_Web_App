CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('pemain', 'admin')) DEFAULT 'pemain'
);

CREATE TABLE venues (
    id SERIAL PRIMARY KEY,
    nama_tempat VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    pemilik_id INT REFERENCES users(id)
);

CREATE TABLE courts (
    id SERIAL PRIMARY KEY,
    venue_id INT REFERENCES venues(id) ON DELETE CASCADE,
    nama_lapangan VARCHAR(50) NOT NULL,
    jenis_lantai VARCHAR(50)
);

CREATE TABLE price_rules (
    id SERIAL PRIMARY KEY,
    court_id INT REFERENCES courts(id) ON DELETE CASCADE,
    jenis_hari VARCHAR(20) CHECK (jenis_hari IN ('weekday', 'weekend')),
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    harga NUMERIC(10, 2) CHECK (harga >= 0)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    court_id INT REFERENCES courts(id),
    tanggal DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_harga NUMERIC(10, 2) CHECK (total_harga >= 0),
    CONSTRAINT unique_slot UNIQUE (court_id, tanggal, jam_mulai),
    CONSTRAINT check_jam CHECK (jam_selesai > jam_mulai)
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
    jumlah NUMERIC(10, 2) NOT NULL,
    metode VARCHAR(50) DEFAULT 'transfer',
    status VARCHAR(20) DEFAULT 'menunggu_konfirmasi',
    waktu_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE booking_logs (
    id SERIAL PRIMARY KEY,
    booking_id INT,
    status_lama VARCHAR(20),
    status_baru VARCHAR(20),
    waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa pencarian jadwal (IK301)
CREATE INDEX idx_court_tanggal ON bookings(court_id, tanggal);