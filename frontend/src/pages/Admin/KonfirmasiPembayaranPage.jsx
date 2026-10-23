import React, { useCallback, useEffect, useState } from "react";
import { getDaftarPembayaran, setLunas, batalkanBooking } from "../../services/adminService";
import { LABEL_STATUS } from "../../services/bookingService";
import { namaMetode } from "../../config/pembayaran";
import { rupiah, rentangJam, tanggalPanjang } from "../../lib/format";

const WARNA_STATUS = {
  terisi: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  lunas: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  dibatalkan: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

export default function KonfirmasiPembayaranPage() {
  const [rows, setRows] = useState(null); // null = memuat
  const [error, setError] = useState("");
  const [sibuk, setSibuk] = useState(null);

  const muat = useCallback(async () => {
    try {
      setRows(await getDaftarPembayaran());
      setError("");
    } catch (e) {
      setError(e.message);
      setRows([]);
    }
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  const jalankan = async (id, aksi, konfirmasi) => {
    if (konfirmasi && !window.confirm(konfirmasi)) return;
    setSibuk(id);
    try {
      await aksi(id);
      await muat();
    } catch (e) {
      setError(e.message);
    } finally {
      setSibuk(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold">Konfirmasi Pembayaran Lapangan</h2>
        <p className="text-xs text-slate-400 mt-1">Verifikasi transaksi dan ubah status booking player.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-xs font-bold text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Kode ID</th>
                <th className="py-3 px-4">Pemesan</th>
                <th className="py-3 px-4">Jadwal & Lapangan</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4">Total Harga</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rows === null ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-500">Memuat transaksi...</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan="7" className="py-8 text-center text-slate-500">Belum ada transaksi.</td></tr>
              ) : (
                rows.map((b) => (
                  <tr key={b.booking_id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono text-xs text-slate-400">{b.kode_booking}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold">{b.pemain}</p>
                      <p className="font-mono text-xs text-slate-500">{b.no_telp || "-"}</p>
                    </td>
                    <td className="py-3 px-4">
                      {b.lapangan} ({rentangJam(b.jam_mulai, b.jam_selesai)})
                      <p className="text-xs text-slate-500">{tanggalPanjang(b.tanggal)}</p>
                    </td>
                    <td className="py-3 px-4">{namaMetode(b.metode_bayar)}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{rupiah(b.total_harga)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${WARNA_STATUS[b.status] || WARNA_STATUS.terisi}`}>
                        {LABEL_STATUS[b.status] || b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {b.status === "terisi" && (
                        <button
                          type="button"
                          disabled={sibuk === b.booking_id}
                          onClick={() => jalankan(b.booking_id, setLunas)}
                          className="px-3 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-lg cursor-pointer disabled:opacity-50"
                        >
                          Set Lunas
                        </button>
                      )}
                      {b.status !== "dibatalkan" && (
                        <button
                          type="button"
                          disabled={sibuk === b.booking_id}
                          onClick={() => jalankan(b.booking_id, batalkanBooking, `Batalkan booking ${b.kode_booking}?`)}
                          className="px-3 py-1.5 bg-rose-500/20 text-rose-300 font-semibold text-xs rounded-lg cursor-pointer disabled:opacity-50"
                        >
                          Batalkan
                        </button>
                      )}
                      {b.status === "dibatalkan" && (
                        <span className="text-xs italic text-slate-500">
                          Dibatalkan oleh {b.dibatalkan_oleh === "admin" ? "Admin" : "Player"}
                        </span>
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
