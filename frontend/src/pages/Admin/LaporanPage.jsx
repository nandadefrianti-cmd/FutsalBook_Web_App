import React, { useState, useEffect } from "react";

const STORAGE_KEY = "bookings";

export default function LaporanPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setBookings(data);
  }, []);

  const totalRevenue = bookings
    .filter((b) => b.status === "Lunas" || b.status === "TERISI")
    .reduce((sum, b) => sum + (Number(b.price) || 150000), 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold">Laporan & ringkasan Pendapatan</h2>
        <p className="text-xs text-slate-400 mt-1">Ringkasan statistik operasional FutsalBook Arena.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold">TOTAL PENDAPATAN</p>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            Rp{totalRevenue.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-xs text-slate-400 font-bold">TOTAL TRANSAKSI</p>
          <p className="text-2xl font-black text-white mt-2">{bookings.length} Pesanan</p>
        </div>
      </div>
    </div>
  );
}