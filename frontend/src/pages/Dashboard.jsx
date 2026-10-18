import React, { useState } from 'react';
import JadwalHarianPage from './Admin/JadwalHarianPage';
import KonfirmasiPembayaranPage from './Admin/KonfirmasiPembayaranPage';
import LapanganTarifPage from './Admin/LapanganTarifPage';
import LaporanPage from './Admin/LaporanPage';

function Dashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState('jadwal'); // jadwal, konfirmasi, tarif, laporan

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800 font-sans flex antialiased">
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-[#071638] text-white flex flex-col justify-between p-4 shrink-0 border-r border-slate-800 min-h-screen">
        <div>
          <div className="flex items-center gap-2.5 px-3 py-4 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#a3e635] text-slate-950 font-bold flex items-center justify-center shadow-md">
              ⚽
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              Futsal<span className="text-[#a3e635]">Book</span>
            </span>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveMenu('jadwal')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
                activeMenu === 'jadwal'
                  ? 'bg-[#a3e635] text-slate-950 shadow-lg shadow-[#a3e635]/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span>📅</span> Jadwal Harian
            </button>

            <button
              onClick={() => setActiveMenu('konfirmasi')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                activeMenu === 'konfirmasi'
                  ? 'bg-[#a3e635] text-slate-950 shadow-lg shadow-[#a3e635]/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span>💵</span> Konfirmasi Pembayaran
            </button>

            <button
              onClick={() => setActiveMenu('tarif')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                activeMenu === 'tarif'
                  ? 'bg-[#a3e635] text-slate-950 shadow-lg shadow-[#a3e635]/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span>🏟️</span> Lapangan & Tarif
            </button>

            <button
              onClick={() => setActiveMenu('laporan')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                activeMenu === 'laporan'
                  ? 'bg-[#a3e635] text-slate-950 shadow-lg shadow-[#a3e635]/20 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <span>📊</span> Laporan
            </button>
          </nav>
        </div>

        {/* Profile Bottom */}
        <div className="bg-[#0f244e] p-3 rounded-2xl flex items-center justify-between border border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold border border-slate-600">
              👤
            </div>
            <span className="text-sm font-bold text-white">
              {user?.name || 'Admin'}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-slate-300 hover:text-rose-400 transition px-2 py-1"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Konten Berdasarkan Menu Aktif */}
      <main className="flex-1 p-8 md:p-10 overflow-y-auto">
        {activeMenu === 'jadwal' && <JadwalHarianPage user={user} onLogout={onLogout} />}
        {activeMenu === 'konfirmasi' && <KonfirmasiPembayaranPage user={user} />}
        {activeMenu === 'tarif' && <LapanganTarifPage user={user} />}
        {activeMenu === 'laporan' && <LaporanPage user={user} />}
      </main>
    </div>
  );
}

export default Dashboard;