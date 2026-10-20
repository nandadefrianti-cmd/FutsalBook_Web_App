import React, { useState, useEffect } from "react";

const STORAGE_KEY = "bookings";
const TARIF_KEY = "futsalbook_tarif";

const DEFAULT_TARIF = {
  "Lapangan A": { weekdayPrice: 150000, weekendPrice: 180000 },
  "Lapangan B": { weekdayPrice: 150000, weekendPrice: 180000 },
  "Lapangan C": { weekdayPrice: 120000, weekendPrice: 150000 },
};

function readBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readTarif() {
  try {
    const parsed = JSON.parse(localStorage.getItem(TARIF_KEY));
    return parsed || DEFAULT_TARIF;
  } catch {
    return DEFAULT_TARIF;
  }
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Dashboard({ user, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState("jadwal");
  const [bookings, setBookings] = useState(readBookings);
  const [tarif, setTarif] = useState(readTarif);
  const [filterDate, setFilterDate] = useState(getTodayString());

  useEffect(() => {
    const syncData = () => {
      setBookings(readBookings());
      setTarif(readTarif());
    };
    window.addEventListener("storage", syncData);
    window.addEventListener("futsalbook-bookings-updated", syncData);
    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("futsalbook-bookings-updated", syncData);
    };
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = bookings.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("futsalbook-bookings-updated"));
  };

  const handleSaveTarif = (courtName, field, value) => {
    const updatedTarif = {
      ...tarif,
      [courtName]: {
        ...tarif[courtName],
        [field]: Number(value) || 0,
      },
    };
    setTarif(updatedTarif);
    localStorage.setItem(TARIF_KEY, JSON.stringify(updatedTarif));
  };

  const dailyBookings = bookings.filter(
    (b) => (b.date === filterDate || b.hariTanggal?.includes(filterDate)) && b.status !== "Dibatalkan"
  );

  const totalRevenue = bookings
    .filter((b) => b.status === "Lunas" || b.status === "TERISI")
    .reduce((sum, b) => sum + (Number(b.price) || 150000), 0);

  return (
    <div className="min-h-screen bg-[#060814] text-white font-sans antialiased">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b19]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate?.("home")}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 font-bold text-slate-950">
              ⚽
            </span>
            <span className="text-lg font-extrabold tracking-tight">
              Futsal<span className="text-emerald-400">Book</span>{" "}
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                ADMIN
              </span>
            </span>
          </div>

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
              onClick={() => onNavigate?.("dashboard")}
              className="rounded-lg bg-slate-800/60 px-4 py-2 text-sm font-semibold text-emerald-400 cursor-pointer"
            >
              Dashboard
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-xs font-bold text-emerald-400">
                A
              </div>
              <span className="hidden max-w-32 truncate text-xs font-semibold text-slate-200 sm:inline">
                {user?.name || "Administrator"}
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
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* NAV TAB MENUS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8">
          {[
            { id: "jadwal", label: "📅 Jadwal Harian" },
            { id: "konfirmasi", label: "💳 Konfirmasi Pembayaran" },
            { id: "tarif", label: "⚙️ Pengaturan Tarif" },
            { id: "laporan", label: "📊 Laporan & Statistik" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20"
                  : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: JADWAL HARIAN */}
        {activeTab === "jadwal" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold">Jadwal Penggunaan Lapangan</h2>
                <p className="text-xs text-slate-400 mt-1">Cek berapa banyak pemesan dan slot terisi dalam sehari.</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-400">PILIH TANGGAL:</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-slate-800 font-bold text-sm">Daftar Slot Terisi ({filterDate})</div>
              {dailyBookings.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">Belum ada booking pada tanggal ini.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Jam Slot</th>
                        <th className="py-3 px-4">Lapangan</th>
                        <th className="py-3 px-4">Nama Pemesan</th>
                        <th className="py-3 px-4">No. HP</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {dailyBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{b.slot || b.time}</td>
                          <td className="py-3 px-4 font-bold">{b.court || b.lapangan}</td>
                          <td className="py-3 px-4">{b.playerName || b.customerName}</td>
                          <td className="py-3 px-4 font-mono">{b.phone || "-"}</td>
                          <td className="py-3 px-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: KONFIRMASI PEMBAYARAN */}
        {activeTab === "konfirmasi" && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-xl font-bold">Konfirmasi Pembayaran Lapangan</h2>
              <p className="text-xs text-slate-400 mt-1">Verifikasi transaksi dan ubah status booking player.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Kode ID</th>
                      <th className="py-3 px-4">Pemesan</th>
                      <th className="py-3 px-4">Jadwal & Lapangan</th>
                      <th className="py-3 px-4">Total Harga</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-500">Belum ada transaksi.</td>
                      </tr>
                    ) : (
                      bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono text-xs text-slate-400">{b.id}</td>
                          <td className="py-3 px-4 font-bold">{b.playerName || b.customerName}</td>
                          <td className="py-3 px-4">
                            {b.court || b.lapangan} ({b.slot || b.time})
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400">{formatRupiah(b.price || 150000)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border uppercase ${
                              b.status === "Lunas" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                              b.status === "Dibatalkan" ? "bg-slate-500/10 text-slate-400 border-slate-500/30" :
                              "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            {/* Tombol Set Lunas hanya muncul jika status BUKAN Lunas dan BUKAN Dibatalkan */}
                            {b.status !== "Lunas" && b.status !== "Dibatalkan" && (
                              <button
                                onClick={() => handleUpdateStatus(b.id, "Lunas")}
                                className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                              >
                                Set Lunas
                              </button>
                            )}

                            {/* Keterangan jika pesanan dibatalkan player */}
                            {b.status === "Dibatalkan" && (
                              <span className="text-xs text-slate-500 italic pr-2">Dibatalkan oleh Player</span>
                            )}

                            {/* Tombol Batalkan hanya muncul jika belum dibatalkan */}
                            {b.status !== "Dibatalkan" && (
                              <button
                                onClick={() => handleUpdateStatus(b.id, "Dibatalkan")}
                                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-xs rounded-lg cursor-pointer"
                              >
                                Batalkan
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PENGATURAN TARIF */}
        {activeTab === "tarif" && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-xl font-bold">Atur Tarif Harga Lapangan</h2>
              <p className="text-xs text-slate-400 mt-1">Ubah harga per jam untuk Weekday dan Weekend.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.keys(tarif).map((courtName) => (
                <div key={courtName} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-emerald-400">{courtName}</h3>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 block">Tarif Weekday (Sen-Jum) / jam</label>
                    <input
                      type="number"
                      value={tarif[courtName].weekdayPrice}
                      onChange={(e) => handleSaveTarif(courtName, "weekdayPrice", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 block">Tarif Weekend (Sab-Min) / jam</label>
                    <input
                      type="number"
                      value={tarif[courtName].weekendPrice}
                      onChange={(e) => handleSaveTarif(courtName, "weekendPrice", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LAPORAN & STATISTIK */}
        {activeTab === "laporan" && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <h2 className="text-xl font-bold">Laporan & Ringkasan Pendapatan</h2>
              <p className="text-xs text-slate-400 mt-1">Ringkasan statistik operasional FutsalBook Arena.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold">TOTAL PENDAPATAN</p>
                <p className="text-2xl font-black text-emerald-400 mt-2">{formatRupiah(totalRevenue)}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold">TOTAL TRANSAKSI</p>
                <p className="text-2xl font-black text-white mt-2">{bookings.length} Pesanan</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold">TERKONFIRMASI / LUNAS</p>
                <p className="text-2xl font-black text-sky-400 mt-2">
                  {bookings.filter((b) => b.status === "Lunas" || b.status === "TERISI").length} Pesanan
                </p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold">DIBATALKAN</p>
                <p className="text-2xl font-black text-rose-400 mt-2">
                  {bookings.filter((b) => b.status === "Dibatalkan").length} Pesanan
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}