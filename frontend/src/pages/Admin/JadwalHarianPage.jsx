import React, { useState, useEffect } from "react";

const STORAGE_KEY = "bookings";

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function JadwalHarianPage() {
  const [filterDate, setFilterDate] = useState(getTodayString());
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setBookings(data);
  }, []);

  const dailyBookings = bookings.filter(
    (b) => (b.date === filterDate || b.hariTanggal?.includes(filterDate)) && b.status !== "Dibatalkan"
  );

  return (
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
  );
}