import React, { useState, useEffect } from "react";

const STORAGE_KEY = "bookings";

export default function KonfirmasiPembayaranPage() {
  const [bookings, setBookings] = useState([]);

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setBookings(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = bookings.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setBookings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("futsalbook-bookings-updated"));
  };

  return (
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
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">Belum ada transaksi.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">{b.id}</td>
                    <td className="py-3 px-4 font-bold">{b.playerName || b.customerName}</td>
                    <td className="py-3 px-4">
                      {b.court || b.lapangan} ({b.slot || b.time})
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {b.status !== "Lunas" && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, "Lunas")}
                          className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Set Lunas
                        </button>
                      )}
                      {b.status !== "Dibatalkan" && (
                        <button
                          onClick={() => handleUpdateStatus(b.id, "Dibatalkan")}
                          className="px-3 py-1.5 bg-rose-500/20 text-rose-300 font-semibold text-xs rounded-lg cursor-pointer"
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
  );
}