import React, { useState } from "react";
import { login, register } from "../services/authService";

// Satu halaman untuk Masuk dan Daftar. Pemain dan admin memakai form yang sama:
// role dibaca dari database setelah login (App.jsx yang mengarahkan ke halaman yang sesuai).
export default function Auth({ onLogin, onNavigate }) {
  const [mode, setMode] = useState("masuk"); // "masuk" | "daftar"
  const [nama, setNama] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ulangi, setUlangi] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const gantiMode = (m) => {
    setMode(m);
    setError("");
    setInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setInfo("");
    setLoading(true);
    try {
      if (mode === "daftar") {
        const hasil = await register({ nama, email, password, ulangi, no_telp: noTelp });
        // Jika "Confirm email" di Supabase masih menyala, belum ada sesi aktif.
        if (!hasil?.session) {
          setInfo("Pendaftaran berhasil. Silakan cek email untuk konfirmasi, lalu masuk.");
          setMode("masuk");
          return;
        }
      } else {
        await login({ email, password });
      }
      // Sesi dibuat Supabase; App.jsx mengarahkan sesuai role (admin -> dashboard, pemain -> jadwal).
      if (onLogin) onLogin();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-[#060814] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition";

  return (
    <div className="min-h-screen bg-[#060814] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-[#0b0f24] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("home")}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
        >
          ← Kembali ke Beranda
        </button>

        <div>
          <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-1">
            FUTSALBOOK
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {mode === "masuk" ? "Selamat Datang!" : "Buat Akun Baru"}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            {mode === "masuk"
              ? "Masuk untuk melanjutkan ke aplikasi."
              : "Daftar untuk mulai booking lapangan."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "daftar" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nama / Username
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama kamu"
                  required
                  minLength={2}
                  maxLength={100}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  No. Telepon (opsional)
                </label>
                <input
                  type="tel"
                  value={noTelp}
                  onChange={(e) => setNoTelp(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={mode === "daftar" ? 6 : undefined}
              autoComplete={mode === "daftar" ? "new-password" : "current-password"}
              className={inputClass}
            />
          </div>

          {mode === "daftar" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Ulangi Password
              </label>
              <input
                type="password"
                value={ulangi}
                onChange={(e) => setUlangi(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className={inputClass}
              />
            </div>
          )}

          {error && (
            <p role="alert" className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {info && (
            <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold py-3 rounded-xl transition text-sm cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            {loading ? "Memproses..." : mode === "masuk" ? "Masuk" : "Daftar"}
          </button>
        </form>

        <p className="text-xs text-center text-slate-400">
          {mode === "masuk" ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            type="button"
            onClick={() => gantiMode(mode === "masuk" ? "daftar" : "masuk")}
            className="text-emerald-400 font-semibold hover:underline cursor-pointer"
          >
            {mode === "masuk" ? "Daftar" : "Masuk"}
          </button>
        </p>
      </div>
    </div>
  );
}