import React from 'react';

function LapanganTarifPage() {
  const vinylRates = [
    {
      lapangan: 'Lapangan A & B',
      hari: 'Weekday (Sen - Jum)',
      isWeekend: false,
      jamText: '08.00 - 15.00',
      isNight: false,
      harga: 'Rp100.000',
    },
    {
      lapangan: 'Lapangan A & B',
      hari: 'Weekday (Sen - Jum)',
      isWeekend: false,
      jamText: '15.00 - 23.00',
      isNight: true,
      harga: 'Rp150.000',
    },
    {
      lapangan: 'Lapangan A & B',
      hari: 'Weekend (Sab - Min)',
      isWeekend: true,
      jamText: '08.00 - 15.00',
      isNight: false,
      harga: 'Rp130.000',
    },
    {
      lapangan: 'Lapangan A & B',
      hari: 'Weekend (Sab - Min)',
      isWeekend: true,
      jamText: '15.00 - 23.00',
      isNight: true,
      harga: 'Rp180.000',
    },
  ];

  const sintetisRates = [
    {
      lapangan: 'Lapangan C',
      hari: 'Weekday (Sen - Jum)',
      isWeekend: false,
      jamText: '08.00 - 15.00',
      isNight: false,
      harga: 'Rp80.000',
    },
    {
      lapangan: 'Lapangan C',
      hari: 'Weekday (Sen - Jum)',
      isWeekend: false,
      jamText: '15.00 - 23.00',
      isNight: true,
      harga: 'Rp120.000',
    },
    {
      lapangan: 'Lapangan C',
      hari: 'Weekend (Sab - Min)',
      isWeekend: true,
      jamText: '08.00 - 15.00',
      isNight: false,
      harga: 'Rp100.000',
    },
    {
      lapangan: 'Lapangan C',
      hari: 'Weekend (Sab - Min)',
      isWeekend: true,
      jamText: '15.00 - 23.00',
      isNight: true,
      harga: 'Rp150.000',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Tag, Header Title & Operational Badge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> INFORMASI VENUE & MASTER DATA
          </span>
          <h1 className="text-3xl font-black text-[#0f244e] tracking-tight mb-1">
            Lapangan & Tarif
          </h1>
          <p className="text-slate-500 text-sm">
            Data lapangan dan tarif per jam (hanya lihat).
          </p>
        </div>

        {/* Status Operasional Badge */}
        <div className="bg-white border border-slate-200/80 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3 self-start md:self-auto">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
            ✓
          </div>
          <div>
            <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">STATUS OPERASIONAL</span>
            <span className="text-xs font-black text-[#0f244e]">Sistem Tarif Aktif</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KIRI: KARTU LAPANGAN (4 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-base">
                🏟️
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f244e]">Lapangan</h3>
                <p className="text-xs text-slate-400">Total 3 Unit Tersedia</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-lg border border-slate-200/60">
              Terkunci
            </span>
          </div>

          {/* Info Lokasi & Jam Operasional */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex items-start gap-2.5 text-slate-700">
              <span className="text-slate-400">📍</span>
              <div>
                <span className="font-bold text-[#0f244e]">FutsalBook Arena</span>
                <p className="text-slate-500">Jl. Akses UI No. 45, Depok</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-slate-700 pt-1">
              <span className="text-slate-400">⏰</span>
              <span>Buka Setiap Hari: <strong className="text-[#0f244e]">08.00 – 23.00 WIB</strong></span>
            </div>
          </div>

          {/* Daftar Lapangan & Tipe */}
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              <span>Nama Lapangan</span>
              <span>Jenis Lantai</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-sm text-[#0f244e]">Lapangan A</span>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200/60 flex items-center gap-1">
                  <span>🔲</span> Vinyl
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-sm text-[#0f244e]">Lapangan B</span>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200/60 flex items-center gap-1">
                  <span>🔲</span> Vinyl
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-100 hover:border-slate-200 transition">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-sm text-[#0f244e]">Lapangan C</span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200/60 flex items-center gap-1">
                  <span>🌿</span> Rumput Sintetis
                </span>
              </div>
            </div>
          </div>

          {/* Banner Foto Fasilitas */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-36 bg-slate-900 group">
            <img
              src="https://i.pinimg.com/1200x/86/a8/32/86a832d631b6efee9276539d1cef1fcf.jpg"
              alt="Fasilitas Arena"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
            <div className="absolute bottom-3 left-4 right-4">
              <span className="text-xs font-bold text-white tracking-wide">
                Fasilitas Standar Kompetisi Nasional
              </span>
            </div>
          </div>
        </div>

        {/* KANAN: KARTU TARIF PER JAM (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-base">
                💵
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f244e]">Tarif per Jam</h3>
                <p className="text-xs text-slate-400">Skema Biaya Sewa Berdasarkan Waktu</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[11px] font-bold rounded-lg border border-slate-200/60 flex items-center gap-1">
              <span>🔒</span> Mode Baca Saja
            </span>
          </div>

          {/* Tabel Tarif Custom */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Lapangan</th>
                  <th className="py-3 px-4">Hari</th>
                  <th className="py-3 px-4">Jam</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Harga per Jam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                
                {/* CATEGORY 1: VINYL */}
                <tr className="bg-slate-50/60">
                  <td colSpan="4" className="py-2.5 px-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
                    ⚙️ KATEGORI VINYL (LAPANGAN A & B)
                  </td>
                </tr>

                {vinylRates.map((row, idx) => (
                  <tr key={`v-${idx}`} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-[#0f244e]">{row.lapangan}</td>
                    <td className="py-3.5 px-4">
                      {row.isWeekend ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Weekend <span className="text-[10px] font-normal text-slate-400">(Sab - Min)</span>
                        </span>
                      ) : (
                        <span>Weekday <span className="text-[10px] font-normal text-slate-400">(Sen - Jum)</span></span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span>{row.isNight ? '🌙' : '☀️'}</span>
                        <span>{row.jamText}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#0f244e] text-sm">
                      {row.harga}
                    </td>
                  </tr>
                ))}

                {/* CATEGORY 2: RUMPUT SINTETIS */}
                <tr className="bg-slate-50/60">
                  <td colSpan="4" className="py-2.5 px-4 text-[10px] font-black uppercase tracking-wider text-slate-500 pt-4">
                    🌿 KATEGORI RUMPUT SINTETIS (LAPANGAN C)
                  </td>
                </tr>

                {sintetisRates.map((row, idx) => (
                  <tr key={`s-${idx}`} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-[#0f244e]">{row.lapangan}</td>
                    <td className="py-3.5 px-4">
                      {row.isWeekend ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Weekend <span className="text-[10px] font-normal text-slate-400">(Sab - Min)</span>
                        </span>
                      ) : (
                        <span>Weekday <span className="text-[10px] font-normal text-slate-400">(Sen - Jum)</span></span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span>{row.isNight ? '🌙' : '☀️'}</span>
                        <span>{row.jamText}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#0f244e] text-sm">
                      {row.harga}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* Notice Info Box */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              i
            </span>
            <p className="leading-relaxed">
              Harga yang tercantum sudah termasuk fasilitas lampu penerangan standar malam, bola pertandingan, serta ruang bilas dan loker pemain.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LapanganTarifPage;