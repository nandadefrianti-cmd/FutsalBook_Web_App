import React, { useState } from 'react';

function KonfirmasiPembayaranPage() {
  // Data Dummy Konfirmasi Pembayaran Presisi Sesuai Gambar
  const [payments, setPayments] = useState([
    {
      id: 1,
      pemesan: 'Budi Setiawan',
      lapangan: 'Lapangan B',
      tanggalJam: '22 Okt 2026 - 10.00 - 11.00',
      total: 'Rp150.000',
      buktiImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 2,
      pemesan: 'Fajar Maulana',
      lapangan: 'Lapangan C',
      tanggalJam: '21 Okt 2026 - 20.00 - 21.00',
      total: 'Rp120.000',
      buktiImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: 3,
      pemesan: 'Gita Permata',
      lapangan: 'Lapangan A',
      tanggalJam: '23 Okt 2026 - 18.00 - 19.00',
      total: 'Rp150.000',
      buktiImg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
    },
  ]);

  // State untuk Modal Pratinjau Bukti Pembayaran
  const [selectedBukti, setSelectedBukti] = useState(null);

  // Aksi Konfirmasi Pembayaran oleh Admin
  const handleKonfirmasi = (id, pemesan) => {
    setPayments((prev) => prev.filter((item) => item.id !== id));
    alert(`Pembayaran atas nama ${pemesan} telah berhasil dikonfirmasi!`);
  };

  return (
    <div>
      {/* Header Title & Subtitle */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#0f244e] tracking-tight mb-1">
          Konfirmasi Pembayaran
        </h1>
        <p className="text-slate-500 text-sm">
          Periksa bukti bayar lalu konfirmasi.
        </p>
      </div>

      {/* Card Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f6fb] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6 rounded-l-xl">PEMESAN</th>
                <th className="py-3.5 px-6">LAPANGAN</th>
                <th className="py-3.5 px-6">TANGGAL & JAM</th>
                <th className="py-3.5 px-6">TOTAL</th>
                <th className="py-3.5 px-6">BUKTI</th>
                <th className="py-3.5 px-6 text-right rounded-r-xl">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {payments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition">
                  {/* Pemesan */}
                  <td className="py-5 px-6 font-semibold text-slate-800">
                    {item.pemesan}
                  </td>

                  {/* Lapangan */}
                  <td className="py-5 px-6 text-slate-600">
                    {item.lapangan}
                  </td>

                  {/* Tanggal & Jam */}
                  <td className="py-5 px-6 text-slate-600">
                    {item.tanggalJam}
                  </td>

                  {/* Total */}
                  <td className="py-5 px-6 font-bold text-slate-900">
                    {item.total}
                  </td>

                  {/* Bukti */}
                  <td className="py-5 px-6">
                    <button
                      type="button"
                      onClick={() => setSelectedBukti(item)}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800 underline inline-flex items-center gap-1 transition"
                    >
                      Lihat bukti <span>↗</span>
                    </button>
                  </td>

                  {/* Aksi */}
                  <td className="py-5 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleKonfirmasi(item.id, item.pemesan)}
                      className="px-5 py-2 bg-[#a3e635] hover:bg-[#86efac] text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
                    >
                      Konfirmasi
                    </button>
                  </td>
                </tr>
              ))}

              {/* Tampilan Jika Semua Pembayaran Sudah Dikonfirmasi */}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                    Semua pembayaran telah dikonfirmasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Pratinjau Foto Bukti Pembayaran */}
      {selectedBukti && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0f244e]">Bukti Transfer</h3>
                <p className="text-xs text-slate-400">{selectedBukti.pemesan} • {selectedBukti.total}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBukti(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 text-xs flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-64 mb-5">
              <img
                src={selectedBukti.buktiImg}
                alt="Bukti Transfer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedBukti(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  handleKonfirmasi(selectedBukti.id, selectedBukti.pemesan);
                  setSelectedBukti(null);
                }}
                className="flex-1 py-2.5 bg-[#a3e635] hover:bg-[#86efac] text-slate-950 font-bold text-xs rounded-xl transition shadow-sm"
              >
                Konfirmasi Lunas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KonfirmasiPembayaranPage;