import React, { useEffect, useState } from "react";
import { getJadwalHarian } from "../../services/adminService";
import { LABEL_STATUS } from "../../services/bookingService";
import { tanggalIso, rentangJam } from "../../lib/format";

const WARNA_STATUS = {
  terisi: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  lunas: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
};

export default function JadwalHarianPage() {
  const [filterDate, setFilterDate] = useState(tanggalIso());
  const [rows, setRows] = useState(null); // null = memuat
  const [error, setError] = useState("");

  // Data diambil dari database. Kosong jika belum ada pemain yang booking pada tanggal itu.
  useEffect(() => {
    let batal = false;
    setRows(null);
    getJadwalHarian(filterDate)
      .then((data) => {
        if (!batal) {
          setRows(data);
          setError("");
        }
      })
      .catch((e) => {
        if (!batal) {
          setError(e.message);
          setRows([]);
        }
      });
    return () => {
      batal = true;
    };
  }, [filterDate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold">Jadwal Penggunaan Lapangan</h2>
          <p className="text-xs text-slate-400 mt-1">Cek berapa banyak pemesan dan slot terisi dalam sehari.</p>
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="tgl-jadwal" className="text-xs font-bold text-slate-400">PILIH TANGGAL:</label>
          <input
            id="tgl-jadwal"
            type="date"
            value={filterDate}
            onChange={(e) => e.target.value && setFilterDate(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-sm flex items-center justify-between">
          <span>Daftar Slot Terisi ({filterDate})</span>
          <span className="text-xs font-normal text-slate-400">{rows ? `${rows.length} booking` : ""}</span>
        </div>
        {rows === null ? (
          <div className="p-8 text-center text-slate-500 text-sm">Memuat jadwal...</div>
        ) : rows.length === 0 ? (
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
                {rows.map((b) => (
                  <tr key={b.booking_id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{rentangJam(b.jam_mulai, b.jam_selesai)}</td>
                    <td className="py-3 px-4 font-bold">{b.lapangan}</td>
                    <td className="py-3 px-4">{b.pemain}</td>
                    <td className="py-3 px-4 font-mono">{b.no_telp || "-"}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${WARNA_STATUS[b.status] || WARNA_STATUS.terisi}`}>
                        {LABEL_STATUS[b.status] || b.status}
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
