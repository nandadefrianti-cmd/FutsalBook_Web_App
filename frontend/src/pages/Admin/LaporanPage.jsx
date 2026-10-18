import React, { useState } from 'react';

function LaporanPage() {
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');

  // Data Dummy Pendapatan per Lapangan
  const revenueData = [
    { lapangan: 'Lapangan A', booking: 12, total: 'Rp1.800.000' },
    { lapangan: 'Lapangan B', booking: 9, total: 'Rp1.350.000' },
    { lapangan: 'Lapangan C', booking: 7, total: 'Rp840.000' },
  ];

  // Data Dummy Jam Paling Ramai
  const busyHoursData = [
    { jam: '19:00', booking: 8 },
    { jam: '20:00', booking: 6 },
    { jam: '18:00', booking: 5 },
    { jam: '16:00', booking: 4 },
    { jam: '17:00', booking: 3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Title & Month Picker */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0f244e] tracking-tight mb-1">
            Laporan
          </h1>
          <p className="text-slate-500 text-sm">
            Ringkasan bulanan.
          </p>
        </div>

        {/* Month Selector Filter */}
        <div className="flex items-center bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-sm gap-3 self-start md:self-auto">
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 px-1 font-bold text-lg transition"
          >
            ‹
          </button>
          <div className="flex items-center gap-2 font-bold text-sm text-[#0f244e]">
            <span>📅</span>
            <span>{selectedMonth}</span>
            <span className="text-slate-400 text-xs">▾</span>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-700 px-1 font-bold text-lg transition"
          >
            ›
          </button>
        </div>
      </div>

      {/* 1. KARTU PENDAPATAN PER LAPANGAN */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0f244e]">
          Pendapatan per Lapangan
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 rounded-l-xl">Lapangan</th>
                <th className="py-3.5 px-6">Jumlah Booking</th>
                <th className="py-3.5 px-6 text-right rounded-r-xl">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {revenueData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-bold text-[#0f244e]">
                    {item.lapangan}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {item.booking}
                  </td>
                  <td className="py-4 px-6 text-right font-black text-[#0f244e]">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. KARTU JAM PALING RAMAI */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0f244e]">
          Jam Paling Ramai
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 rounded-l-xl">Jam</th>
                <th className="py-3.5 px-6 text-right rounded-r-xl">Jumlah Booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {busyHoursData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-4 px-6 font-bold text-[#0f244e]">
                    {item.jam}
                  </td>
                  <td className="py-4 px-6 text-right font-black text-[#0f244e]">
                    {item.booking}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default LaporanPage;