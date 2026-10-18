import React, { useState } from 'react';

function BookingSayaPage({ onNavigate, user, onLogout }) {
  const [bookingList, setBookingList] = useState([
    { id: 'BK-101', lapangan: 'Lapangan A', tanggal: '21 Okt 2026', jam: '19.00 - 20.00', total: 'Rp150.000', status: 'Belum bayar' },
    { id: 'BK-102', lapangan: 'Lapangan B', tanggal: '22 Okt 2026', jam: '16.00 - 17.00', total: 'Rp150.000', status: 'Menunggu konfirmasi' },
    { id: 'BK-103', lapangan: 'Lapangan C', tanggal: '18 Okt 2026', jam: '10.00 - 11.00', total: 'Rp80.000', status: 'Lunas' },
    { id: 'BK-104', lapangan: 'Lapangan A', tanggal: '15 Okt 2026', jam: '20.00 - 21.00', total: 'Rp150.000', status: 'Dibatalkan' },
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  const handleBatalkan = (id) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pemesanan ini?')) {
      setBookingList((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'Dibatalkan' } : item)));
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setBookingList((prev) => prev.map((item) => (item.id === selectedBooking.id ? { ...item, status: 'Menunggu konfirmasi' } : item)));
    setSelectedBooking(null);
    setUploadFile(null);
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-white font-sans antialiased">
      <header className="sticky top-0 z-40 bg-[#070b19]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center font-bold text-slate-950">⚽</div>
              <span className="font-extrabold text-lg text-white">Futsal<span className="text-emerald-400">Book</span></span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <button onClick={() => onNavigate && onNavigate('home')} className="px-4 py-2 text-sm text-slate-300">Beranda</button>
              <button onClick={() => onNavigate && onNavigate('jadwal')} className="px-4 py-2 text-sm text-slate-300">Jadwal Lapangan</button>
              <button onClick={() => onNavigate && onNavigate('booking')} className="px-4 py-2 text-sm font-semibold text-emerald-400 bg-slate-800/60 rounded-lg">Booking Saya</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="text-xs font-semibold text-slate-200">{user?.name}</span>
              <button onClick={onLogout} className="text-xs text-rose-400">Keluar</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-black text-white mb-6">Booking Saya</h1>
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-xs font-extrabold text-slate-400 uppercase">
              <tr>
                <th className="py-4 px-6">LAPANGAN</th>
                <th className="py-4 px-6">TANGGAL</th>
                <th className="py-4 px-6">JAM</th>
                <th className="py-4 px-6">TOTAL</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {bookingList.map((item) => (
                <tr key={item.id}>
                  <td className="py-5 px-6 font-bold">{item.lapangan}</td>
                  <td className="py-5 px-6">{item.tanggal}</td>
                  <td className="py-5 px-6">{item.jam}</td>
                  <td className="py-5 px-6 text-emerald-400 font-semibold">{item.total}</td>
                  <td className="py-5 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      item.status === 'Lunas' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' :
                      item.status === 'Belum bayar' ? 'bg-amber-400/10 text-amber-400 border-amber-400/30' :
                      item.status === 'Menunggu konfirmasi' ? 'bg-sky-400/10 text-sky-400 border-sky-400/30' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    {item.status === 'Belum bayar' && (
                      <button onClick={() => setSelectedBooking(item)} className="px-4 py-1.5 bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl mr-2">Upload Bukti</button>
                    )}
                    {item.status !== 'Dibatalkan' && (
                      <button onClick={() => handleBatalkan(item.id)} className="text-xs text-slate-400 hover:text-rose-400">Batalkan</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md">
            <h3 className="text-lg font-bold text-white mb-2">Upload Bukti Pembayaran</h3>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files[0])} className="w-full text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800" required />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setSelectedBooking(null)} className="px-4 py-2 text-xs bg-slate-800 text-slate-300 rounded-xl">Batal</button>
                <button type="submit" className="px-5 py-2 text-xs bg-emerald-400 text-slate-950 font-bold rounded-xl">Kirim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingSayaPage;