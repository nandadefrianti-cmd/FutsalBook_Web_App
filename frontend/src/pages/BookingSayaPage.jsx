import React, { useState, useEffect } from 'react';

const STORAGE_KEY = "bookings";

function readBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function BookingSayaPage({ onNavigate, user, onLogout }) {
  const [bookingList, setBookingList] = useState(readBookings);

  // Sync data otomatis setiap kali ada perbaruan dari localStorage
  useEffect(() => {
    const syncBookings = () => setBookingList(readBookings());
    window.addEventListener("storage", syncBookings);
    window.addEventListener("futsalbook-bookings-updated", syncBookings);
    return () => {
      window.removeEventListener("storage", syncBookings);
      window.removeEventListener("futsalbook-bookings-updated", syncBookings);
    };
  }, []);

  const handleBatalkan = (id) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pemesanan ini?')) {
      const updated = bookingList.map((item) =>
        item.id === id ? { ...item, status: 'Dibatalkan' } : item
      );
      setBookingList(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("futsalbook-bookings-updated"));
    }
  };

  return (
    <div className="min-h-screen bg-[#060814] text-white font-sans antialiased">
      {/* HEADER / NAVBAR LENGKAP */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b19]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 font-bold text-slate-950">
              ⚽
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Futsal<span className="text-emerald-400">Book</span>
            </span>
          </button>

          {/* Menu Navigasi Tengah */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() => onNavigate?.("home")}
              className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer"
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("jadwal")}
              className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer"
            >
              Jadwal Lapangan
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.("booking-saya")}
              className="rounded-lg bg-slate-800/60 px-4 py-2 text-sm font-semibold text-emerald-400 cursor-pointer"
            >
              Booking Saya
            </button>
            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => onNavigate?.("dashboard")}
                className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer"
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Kanan: Profil / Tombol Masuk */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-xs font-bold text-emerald-400">
                  {(user.name || user.username || user.email || "S").charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-32 truncate text-xs font-semibold text-slate-200 sm:inline">
                  {user.name || user.username || user.email}
                </span>
                <span className="hidden text-slate-600 sm:inline">|</span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-xs font-medium text-rose-400 transition hover:text-rose-300 cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate?.("auth")}
                className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 cursor-pointer"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="mb-10">
          <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-2">
            FUTSALBOOK ARENA
          </p>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Booking Saya
          </h1>
          <p className="text-slate-400 text-sm">
            Pantau jadwal lapangan dan status booking kamu di sini.
          </p>
        </div>

        {/* Card List Booking */}
        <div className="space-y-6">
          {bookingList.length === 0 ? (
            <div className="bg-[#0b0f24] border border-slate-800/80 rounded-2xl p-8 text-center text-slate-400">
              Belum ada data booking. Silakan lakukan booking di halaman Jadwal Lapangan.
            </div>
          ) : (
            bookingList.map((item) => (
              <div
                key={item.id}
                className="bg-[#0b0f24] border border-slate-800/80 rounded-2xl p-7 shadow-xl space-y-6"
              >
                {/* Header Card */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-mono mb-1">
                      Kode booking: {item.id}
                    </p>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {item.court || item.lapangan}
                    </h2>
                    <p className="text-sm text-slate-300 mt-1">
                      {item.hariTanggal || item.date} • {item.slot || item.time}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    item.status === 'Lunas' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' :
                    item.status === 'TERISI' ? 'bg-amber-400/10 text-amber-400 border-amber-400/30' :
                    item.status === 'Dibatalkan' ? 'bg-slate-500/10 text-slate-400 border-slate-500/30' :
                    'bg-amber-400/10 text-amber-400 border-amber-400/30'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {item.status || 'TERISI'}
                  </span>
                </div>

                {/* Status Alert Banner */}
                <div className="bg-[#1f0d1a]/80 border border-rose-900/40 rounded-xl p-4 text-rose-200">
                  <p className="text-sm font-bold mb-1">Slot telah terisi</p>
                  <p className="text-xs text-rose-200/80">
                    {item.pesanStatus || `Slot ${item.slot || item.time} di ${item.court || item.lapangan} telah dibooking oleh ${item.playerName || item.customerName || 'Player'}.`}
                  </p>
                </div>

                {/* Info Detail Grid (4 Kolom dengan No. Handphone) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  <div className="bg-[#080b1a] border border-slate-800/60 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Nama Pemesan</p>
                    <p className="text-sm font-bold text-white">
                      {item.playerName || item.customerName || '-'}
                    </p>
                  </div>

                  <div className="bg-[#080b1a] border border-slate-800/60 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">No. Handphone</p>
                    <p className="text-sm font-bold text-white font-mono">
                      {item.phone || '-'}
                    </p>
                  </div>

                  <div className="bg-[#080b1a] border border-slate-800/60 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">
                      Metode Pembayaran
                    </p>
                    <p className="text-sm font-bold text-white uppercase">
                      {item.payment || 'GOPAY'}
                    </p>
                  </div>

                  <div className="bg-[#080b1a] border border-slate-800/60 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Total Harga</p>
                    <p className="text-sm font-bold text-emerald-400">
                      {item.totalHarga || (typeof item.price === 'number' ? `Rp${item.price.toLocaleString('id-ID')}` : 'Rp150.000')}
                    </p>
                  </div>
                </div>

                {/* Tombol Batalkan hanya muncul jika status masih TERISI / PENDING dan belum Lunas */}
                {(item.status === 'TERISI' || item.status === 'pending' || item.status === 'Menunggu Konfirmasi') && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleBatalkan(item.id)}
                      className="px-4 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition cursor-pointer"
                    >
                      Batalkan Booking
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default BookingSayaPage;