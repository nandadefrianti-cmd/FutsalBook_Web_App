import React, { useEffect, useState } from "react";
import { getTarif, ubahTarif } from "../../services/adminService";

export default function LapanganTarifPage() {
  const [courts, setCourts] = useState(null); // null = memuat
  const [form, setForm] = useState({}); // { [courtId]: { weekday: "150000", weekend: "180000" } }
  const [pesan, setPesan] = useState({}); // { [courtId]: { tipe: "ok" | "error", teks } }
  const [error, setError] = useState("");
  const [sibuk, setSibuk] = useState(null);

  useEffect(() => {
    let batal = false;
    getTarif()
      .then((data) => {
        if (batal) return;
        setCourts(data);
        const awal = {};
        data.forEach((c) => {
          awal[c.id] = { weekday: String(Math.round(Number(c.harga_weekday))), weekend: String(Math.round(Number(c.harga_weekend))) };
        });
        setForm(awal);
      })
      .catch((e) => {
        if (!batal) {
          setError(e.message);
          setCourts([]);
        }
      });
    return () => {
      batal = true;
    };
  }, []);

  const ubahField = (id, field, nilai) => {
    setForm((f) => ({ ...f, [id]: { ...f[id], [field]: nilai } }));
    setPesan((p) => ({ ...p, [id]: null }));
  };

  // Tarif baru hanya berlaku untuk booking BARU. Booking lama menyimpan harga saat dibuat.
  const simpan = async (court) => {
    setSibuk(court.id);
    try {
      await ubahTarif(court.id, form[court.id].weekday, form[court.id].weekend);
      setPesan((p) => ({ ...p, [court.id]: { tipe: "ok", teks: "Tarif disimpan." } }));
    } catch (e) {
      setPesan((p) => ({ ...p, [court.id]: { tipe: "error", teks: e.message } }));
    } finally {
      setSibuk(null);
    }
  };

  const inputClass =
    "w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-mono";

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold">Atur Tarif Harga Lapangan</h2>
        <p className="text-xs text-slate-400 mt-1">Ubah harga per jam untuk Weekday dan Weekend. Tarif baru berlaku untuk booking berikutnya.</p>
      </div>

      {error && <div role="alert" className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>}
      {courts === null && <p className="text-sm text-slate-400">Memuat tarif...</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(courts || []).map((court) => (
          <div key={court.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-emerald-400">{court.nama_lapangan}</h3>
              <p className="text-xs text-slate-500">{court.jenis_lantai}</p>
            </div>

            <div className="space-y-2">
              <label htmlFor={`wd-${court.id}`} className="text-xs font-semibold text-slate-400 block">Tarif Weekday (Sen-Jum) / jam</label>
              <input
                id={`wd-${court.id}`}
                type="number"
                min="1000"
                step="1000"
                value={form[court.id]?.weekday ?? ""}
                onChange={(e) => ubahField(court.id, "weekday", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`we-${court.id}`} className="text-xs font-semibold text-slate-400 block">Tarif Weekend (Sab-Min) / jam</label>
              <input
                id={`we-${court.id}`}
                type="number"
                min="1000"
                step="1000"
                value={form[court.id]?.weekend ?? ""}
                onChange={(e) => ubahField(court.id, "weekend", e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="button"
              disabled={sibuk === court.id}
              onClick={() => simpan(court)}
              className="w-full rounded-xl bg-emerald-400 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-50 cursor-pointer"
            >
              {sibuk === court.id ? "Menyimpan..." : "Simpan"}
            </button>

            {pesan[court.id] && (
              <p role="status" className={`text-xs ${pesan[court.id].tipe === "ok" ? "text-emerald-400" : "text-rose-400"}`}>
                {pesan[court.id].teks}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
