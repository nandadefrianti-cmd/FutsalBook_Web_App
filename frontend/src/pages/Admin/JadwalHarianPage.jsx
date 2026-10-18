import React, { useState } from 'react';

function JadwalHarianPage({ user, onLogout }) {
  const [selectedDate, setSelectedDate] = useState('2026-10-21');

  // Data Dummy Booking Harian Presisi Sesuai Gambar
  const dailyBookings = [
    {
      id: 1,
      jam: '08.00 – 09.00',
      lapangan: 'Lapangan A',
      pemesan: 'Andi Pratama',
      status: 'Lunas',
    },
    {
      id: 2,
      jam: '10.00 – 11.00',
      lapangan: 'Lapangan B',
      pemesan: 'Budi Setiawan',
      status: 'Menunggu konfirmasi',
    },
    {
      id: 3,
      jam: '16.00 – 17.00',
      lapangan: 'Lapangan B',
      pemesan: 'Citra Lestari',
      status: 'Lunas',
    },
    {
      id: 4,
      jam: '19.00 – 20.00',
      lapangan: 'Lapangan A',
      pemesan: 'Dika Firmansyah',
      status: 'Belum bayar',
    },
    {
      id: 5,
      jam: '20.00 – 21.00',
      lapangan: 'Lapangan C',
      pemesan: 'Fajar Maulana',
      status: 'Menunggu konfirmasi',
    },
  ];

  const formatTanggalIndonesia = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleShiftDate = (days) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };

  return (
    <div>
      {/* Header Title & Navigasi Tanggal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0f244e] tracking-tight mb-1">
            Jadwal Harian
          </h1>
          <p className="text-slate-500 text-sm">
            Daftar booking pada tanggal yang dipilih.
          </p>
        </div>

        {/* Filter Tanggal */}
        <div className="flex items-center bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-sm gap-3">
          <button
            onClick={() => handleShiftDate(-1)}
            className="text-slate-400 hover:text-slate-700 px-1 font-bold text-lg"
          >
            ‹
          </button>
          <div className="flex items-center gap-2 font-bold text-sm text-[#0f244e]">
            <span>📅</span>
            <span>{formatTanggalIndonesia(selectedDate)}</span>
          </div>
          <button
            onClick={() => handleShiftDate(1)}
            className="text-slate-400 hover:text-slate-700 px-1 font-bold text-lg"
          >
            ›
          </button>
        </div>
      </div>

      {/* Cards Summary Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            BOOKING HARI INI
          </span>
          <div className="text-4xl font-black text-[#0f244e]">5</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            MENUNGGU KONFIRMASI
          </span>
          <div className="text-4xl font-black text-[#0f244e]">2</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            PENDAPATAN BULAN INI
          </span>
          <div className="text-3xl md:text-4xl font-black text-[#0f244e]">
            Rp3.450.000
          </div>
        </div>
      </div>

      {/* Tabel Jadwal Harian */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f6fb] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 rounded-l-xl">JAM</th>
                <th className="py-3.5 px-6">LAPANGAN</th>
                <th className="py-3.5 px-6">PEMESAN</th>
                <th className="py-3.5 px-6 rounded-r-xl">STATUS PEMBAYARAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {dailyBookings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-bold text-[#0f244e]">
                    {item.jam}
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {item.lapangan}
                  </td>
                  <td className="py-4 px-6 text-slate-800 font-semibold">
                    {item.pemesan}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Lunas'
                          ? 'bg-[#a3e635] text-slate-950'
                          : item.status === 'Menunggu konfirmasi'
                          ? 'bg-[#fde68a] text-amber-900'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
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

export default JadwalHarianPage;