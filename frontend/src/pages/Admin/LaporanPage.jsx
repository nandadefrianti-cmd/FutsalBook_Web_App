import React, { useEffect, useState } from "react";
import { getRingkasan, getLaporanPendapatan, getJamRamai } from "../../services/adminService";
import { rupiah, tanggalIso } from "../../lib/format";

const KOSONG = { totalPendapatan: 0, totalTransaksi: 0, totalLunas: 0, totalTerisi: 0, totalDibatalkan: 0 };

export default function LaporanPage() {
  const [ringkasan, setRingkasan] = useState(KOSONG);
  const [bulan, setBulan] = useState(tanggalIso().slice(0, 7)); // 'YYYY-MM'
  const [perLapangan, setPerLapangan] = useState([]);
  const [jamRamai, setJamRamai] = useState([]);
  const [error, setError] = useState("");

  // 4 kartu ringkasan (semua waktu). Semua 0 jika belum ada booking.
  useEffect(() => {
    getRingkasan()
      .then(setRingkasan)
      .catch((e) => setError(e.message));
  }, []);

  // Tabel per bulan.
  useEffect(() => {
    let batal = false;
    Promise.all([getLaporanPendapatan(bulan), getJamRamai(bulan)])
      .then(([a, b]) => {
        if (!batal) {
          setPerLapangan(a);
          setJamRamai(b);
        }
      })
      .catch((e) => !batal && setError(e.message));
    return () => {
      batal = true;
    };
  }, [bulan]);

  const adaPendapatan = perLapangan.some((r) => Number(r.jumlah_booking) > 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold">Laporan & Ringkasan Pendapatan</h2>
        <p className="text-xs text-slate-400 mt-1">Ringkasan statistik operasional FutsalBook Arena.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold">TOTAL PENDAPATAN</p>
          <p className="text-2xl font-black text-emerald-400 mt-2">{rupiah(ringkasan.totalPendapatan)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold">TOTAL TRANSAKSI</p>
          <p className="text-2xl font-black text-white mt-2">{ringkasan.totalTransaksi} Pesanan</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold">TERKONFIRMASI / LUNAS</p>
          <p className="text-2xl font-black text-sky-400 mt-2">{ringkasan.totalLunas} Pesanan</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold">DIBATALKAN</p>
          <p className="text-2xl font-black text-rose-400 mt-2">{ringkasan.totalDibatalkan} Pesanan</p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <label htmlFor="bulan-laporan" className="text-xs font-bold text-slate-400">PILIH BULAN:</label>
        <input
          id="bulan-laporan"
          type="month"
          value={bulan}
          onChange={(e) => e.target.value && setBulan(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-white text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-bold text-sm">Pendapatan per Lapangan (booking lunas)</div>
          {!adaPendapatan ? (
            <div className="p-8 text-center text-slate-500 text-sm">Belum ada pendapatan pada bulan ini.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Lapangan</th>
                  <th className="py-3 px-4">Booking</th>
                  <th className="py-3 px-4 text-right">Pendapatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {perLapangan.map((r) => (
                  <tr key={r.lapangan}>
                    <td className="py-3 px-4 font-bold">{r.lapangan}</td>
                    <td className="py-3 px-4">{r.jumlah_booking}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">{rupiah(r.total_pendapatan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-bold text-sm">Jam Paling Ramai</div>
          {jamRamai.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Belum ada booking pada bulan ini.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Jam</th>
                  <th className="py-3 px-4 text-right">Jumlah Booking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jamRamai.map((r) => (
                  <tr key={r.jam}>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{r.jam.replace(":", ".")}</td>
                    <td className="py-3 px-4 text-right">{r.jumlah_booking}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
