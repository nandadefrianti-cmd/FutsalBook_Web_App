import React, { useState, useEffect } from "react";

const TARIF_KEY = "futsalbook_tarif";
const DEFAULT_TARIF = {
  "Lapangan A": { weekdayPrice: 150000, weekendPrice: 180000 },
  "Lapangan B": { weekdayPrice: 150000, weekendPrice: 180000 },
  "Lapangan C": { weekdayPrice: 120000, weekendPrice: 150000 },
};

export default function LapanganTarifPage() {
  const [tarif, setTarif] = useState(() => {
    return JSON.parse(localStorage.getItem(TARIF_KEY)) || DEFAULT_TARIF;
  });

  const handleSaveTarif = (courtName, field, value) => {
    const updated = {
      ...tarif,
      [courtName]: {
        ...tarif[courtName],
        [field]: Number(value) || 0,
      },
    };
    setTarif(updated);
    localStorage.setItem(TARIF_KEY, JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold">Atur Tarif Harga Lapangan</h2>
        <p className="text-xs text-slate-400 mt-1">Ubah harga per jam untuk Weekday dan Weekend.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.keys(tarif).map((courtName) => (
          <div key={courtName} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-emerald-400">{courtName}</h3>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Tarif Weekday (Sen-Jum) / jam</label>
              <input
                type="number"
                value={tarif[courtName].weekdayPrice}
                onChange={(e) => handleSaveTarif(courtName, "weekdayPrice", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 block">Tarif Weekend (Sab-Min) / jam</label>
              <input
                type="number"
                value={tarif[courtName].weekendPrice}
                onChange={(e) => handleSaveTarif(courtName, "weekendPrice", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}