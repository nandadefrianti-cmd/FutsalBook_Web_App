import React, { useState } from "react";
import JadwalHarianPage from "./Admin/JadwalHarianPage";
import KonfirmasiPembayaranPage from "./Admin/KonfirmasiPembayaranPage";
import LapanganTarifPage from "./Admin/LapanganTarifPage";
import LaporanPage from "./Admin/LaporanPage";

// Dashboard admin: hanya kerangka (header + tab). Semua data diambil dari Supabase
// oleh keempat halaman di pages/Admin/ lewat services/adminService.js.
// Tidak ada localStorage di sini.
const TABS = [
  { id: "jadwal", label: "📅 Jadwal Harian" },
  { id: "konfirmasi", label: "💳 Konfirmasi Pembayaran" },
  { id: "tarif", label: "⚙️ Pengaturan Tarif" },
  { id: "laporan", label: "📊 Laporan & Statistik" },
];

export default function Dashboard({ user, onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState("jadwal");

  return (
    <div className="min-h-screen bg-[#060814] text-white font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b19]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate?.("home")}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 font-bold text-slate-950">⚽</span>
            <span className="text-lg font-extrabold tracking-tight">
              Futsal<span className="text-emerald-400">Book</span>{" "}
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">ADMIN</span>
            </span>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            <button type="button" onClick={() => onNavigate?.("home")} className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer">Beranda</button>
            <button type="button" onClick={() => onNavigate?.("jadwal")} className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer">Jadwal Lapangan</button>
            <button type="button" onClick={() => onNavigate?.("dashboard")} className="rounded-lg bg-slate-800/60 px-4 py-2 text-sm font-semibold text-emerald-400 cursor-pointer">Dashboard</button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-xs font-bold text-emerald-400">A</div>
              <span className="hidden max-w-32 truncate text-xs font-semibold text-slate-200 sm:inline">
                {user?.name || user?.username || "Administrator"}
              </span>
              <span className="hidden text-slate-600 sm:inline">|</span>
              <button type="button" onClick={onLogout} className="text-xs font-medium text-rose-400 transition hover:text-rose-300 cursor-pointer">Keluar</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
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

        {activeTab === "jadwal" && <JadwalHarianPage />}
        {activeTab === "konfirmasi" && <KonfirmasiPembayaranPage />}
        {activeTab === "tarif" && <LapanganTarifPage />}
        {activeTab === "laporan" && <LaporanPage />}
      </main>
    </div>
  );
}