import { useEffect, useState } from "react";
import { getCourts } from "../services/slotService";
import { rupiah } from "../lib/format";

// Foto lapangan dicocokkan lewat nama. Nama, lantai, dan HARGA diambil dari database.
const FOTO = {
  "Lapangan A":
    "https://i.pinimg.com/1200x/47/a1/35/47a135ace3bb63af9268b3dc450b5008.jpg",
  "Lapangan B":
    "https://i.pinimg.com/1200x/81/b6/3b/81b63bd45899d3951ce49dfbe95262ba.jpg",
  "Lapangan C":
    "https://i.pinimg.com/1200x/ad/03/65/ad03659eed8b847cf1b46679c7bfe8d3.jpg",
};
const FOTO_CADANGAN = FOTO["Lapangan A"];

// "Vinyl - Indoor Standard" / "Rumput Sintetis"
const keterangan = (c) =>
  (c.jenis_lantai.toLowerCase().includes("rumput") ? "🌿 " : "🔹 ") +
  c.jenis_lantai +
  (c.deskripsi ? " - " + c.deskripsi : "");

export default function HomePage({
  user,
  onNavigate,
  onLogout,
}) {
  const userName =
    user?.name || user?.username || user?.email || "";
  const isAdmin = user?.role === "admin";

  // Daftar lapangan + harga dari database (boleh dibaca tanpa login).
  const [courts, setCourts] = useState([]);
  const [memuat, setMemuat] = useState(true);
  const [errorCourts, setErrorCourts] = useState("");

  useEffect(() => {
    let batal = false;
    getCourts()
      .then((data) => {
        if (!batal) setCourts(data);
      })
      .catch((e) => {
        if (!batal) setErrorCourts(e.message);
      })
      .finally(() => {
        if (!batal) setMemuat(false);
      });
    return () => {
      batal = true;
    };
  }, []);

  // Mengarahkan pengguna sesuai status login dan role.
  const startBooking = () => {
    if (!user) {
      // App.jsx mengarahkan ke halaman masuk, lalu kembali ke Jadwal setelah login.
      onNavigate?.("jadwal");
    } else if (isAdmin) {
      onNavigate?.("dashboard");
    } else {
      onNavigate?.("jadwal");
    }
  };

  // Tombol logout menggunakan fungsi dari App.jsx.
  const handleUserLogout = () => {
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] font-sans text-white antialiased">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070b19]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-bold text-slate-950 shadow-md shadow-emerald-500/20">
              ⚽
            </span>

            <span className="text-lg font-extrabold tracking-tight">
              Futsal<span className="text-emerald-400">Book</span>
            </span>
          </button>

          {/* Navigasi */}
          <nav className="hidden items-center gap-1 md:flex">
            <button
              type="button"
              onClick={() => onNavigate?.("home")}
              className="rounded-lg bg-slate-800/60 px-4 py-2 text-sm font-semibold text-emerald-400 transition"
            >
              Beranda
            </button>

            <button
              type="button"
              onClick={startBooking}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/40 hover:text-white"
            >
              Jadwal Lapangan
            </button>

            {user && !isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate?.("booking-saya")}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/40 hover:text-white"
              >
                Booking Saya
              </button>
            )}

            {isAdmin && (
              <button
                type="button"
                onClick={() => onNavigate?.("dashboard")}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/40 hover:text-white"
              >
                Dashboard
              </button>
            )}
          </nav>

          {/* Akun pengguna */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2 sm:gap-3 sm:px-4">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-xs font-bold uppercase text-emerald-400">
                  {userName.charAt(0)}
                </div>

                <div className="hidden sm:block">
                  <p className="max-w-32 truncate text-sm font-semibold text-slate-200">
                    {userName}
                  </p>
                  <p className="text-xs capitalize text-slate-500">
                    {user.role}
                  </p>
                </div>

                <span className="hidden text-slate-600 sm:inline">
                  |
                </span>

                <button
                  type="button"
                  onClick={handleUserLogout}
                  className="text-xs font-semibold text-red-400 transition hover:text-red-300"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate?.("auth")}
                className="rounded-lg border border-slate-700/80 bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 sm:px-5"
              >
                Masuk
              </button>
            )}
          </div>
        </div>

        {/* Navigasi tambahan untuk layar kecil */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-emerald-400"
          >
            Beranda
          </button>

          <button
            type="button"
            onClick={startBooking}
            className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300"
          >
            Jadwal Lapangan
          </button>

          {user && !isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate?.("booking-saya")}
              className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300"
            >
              Booking Saya
            </button>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => onNavigate?.("dashboard")}
              className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-xs text-slate-300"
            >
              Dashboard
            </button>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-800/60 px-6 py-16 sm:py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1920&auto=format&fit=crop')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/60 via-[#070b19]/80 to-[#070b19]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 shadow-sm">
            <span>🛡️</span>
            SISTEM RESERVASI RESMI KELOMPOK 10
          </div>

          <h1 className="mb-3 text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            Booking Lapangan,{" "}
            <span className="text-emerald-400">Gas Main!</span>
          </h1>

          <p className="mx-auto max-w-xl text-sm font-normal text-slate-300 sm:text-base">
            Selamat datang,{" "}
            <span className="font-semibold text-emerald-400">
              {userName || "Sobat Futsal"}
            </span>
            ! Kelola jadwal dan amankan lapangan pilihanmu tanpa ribet.
          </p>

          <button
            type="button"
            onClick={startBooking}
            className="mt-7 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:bg-emerald-400"
          >
            {isAdmin
              ? "Buka Dashboard Admin →"
              : "Booking Lapangan Sekarang →"}
          </button>
        </div>
      </section>

      {/* DAFTAR LAPANGAN */}
      <section className="mx-auto max-w-7xl px-6 py-14 sm:py-16">
        <div className="mb-8">
          <h2 className="mb-1 text-2xl font-bold tracking-tight">
            Daftar Lapangan
          </h2>
          <p className="text-sm text-slate-400">
            Pilih lapangan terbaik untuk tim kamu.
          </p>
        </div>

        {memuat && (
          <p className="text-sm text-slate-400">Memuat daftar lapangan...</p>
        )}
        {errorCourts && (
          <p role="alert" className="text-sm text-rose-400">
            {errorCourts}
          </p>
        )}
        {!memuat && !errorCourts && courts.length === 0 && (
          <p className="text-sm text-slate-400">Belum ada lapangan.</p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {courts.map((court) => (
            <article
              key={court.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg transition hover:border-emerald-500/40"
            >
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={FOTO[court.nama_lapangan] || FOTO_CADANGAN}
                  alt={court.nama_lapangan}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-slate-950 shadow">
                  ● Tersedia
                </div>
              </div>

              <div className="flex flex-grow flex-col justify-between p-5">
                <div>
                  <h3 className="mb-1 text-lg font-bold">
                    {court.nama_lapangan}
                  </h3>
                  <p className="mb-4 text-xs text-slate-400">
                    {keterangan(court)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
                  <span className="text-sm font-bold text-emerald-400">
                    {rupiah(court.harga_weekday)}
                    <span className="text-xs font-normal text-slate-400">
                      /jam
                    </span>
                    <span className="block text-[11px] font-normal text-slate-400">
                      Sab-Min {rupiah(court.harga_weekend)}/jam
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={startBooking}
                    className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
                  >
                    Pilih Jadwal
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CARA BOOKING */}
      <section className="mx-auto max-w-7xl border-t border-slate-800/60 px-6 py-14 sm:py-16">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-emerald-400">
            Kemudahan Reservasi
          </span>

          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            Cara Booking
          </h2>

          <p className="text-sm text-slate-400">
            Tiga langkah praktis untuk mengamankan jadwal tanding tim Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-bold text-slate-950">
              1
            </div>
            <h3 className="mb-1 text-base font-bold">Pilih Slot</h3>
            <p className="text-xs leading-5 text-slate-400">
              Pilih lapangan, tanggal, dan jam yang sesuai.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-bold text-slate-950">
              2
            </div>
            <h3 className="mb-1 text-base font-bold">
              Bayar (Simulasi)
            </h3>
            <p className="text-xs leading-5 text-slate-400">
              Pilih metode QRIS, GoPay, DANA, atau OVO. Pembayaran pada aplikasi ini
              disimulasikan, tidak ada uang yang diproses.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 font-bold text-slate-950">
              3
            </div>
            <h3 className="mb-1 text-base font-bold">
              Tunggu Konfirmasi
            </h3>
            <p className="text-xs leading-5 text-slate-400">
              Admin memeriksa booking dan mengubah status pemesanan.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER - SATU SAJA */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 px-6 py-6 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
          <div>FutsalBook Arena – Kelompok 10</div>
          <div>
            © {new Date().getFullYear()} FutsalBook. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
