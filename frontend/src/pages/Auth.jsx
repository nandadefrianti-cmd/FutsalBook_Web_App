import React, { useState } from "react";

export default function Auth({ onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // FUNGSI UNTUK PILIH AKUN DEMO
  const handleSelectDemo = (roleType) => {
    if (roleType === "admin") {
      setEmail("admin@futsalbook.id");
      setPassword("admin123");
      
      // Langsung proses login sebagai Admin
      const adminUser = {
        id: "usr-admin",
        name: "Administrator",
        username: "admin",
        email: "admin@futsalbook.id",
        role: "admin", // PENTING: Role diset tegas ke admin
      };
      
      onLogin(adminUser);
    } else {
      setEmail("player@futsalbook.id");
      setPassword("player123");
      
      // Langsung proses login sebagai Player
      const playerUser = {
        id: "usr-player",
        name: "Player Demo",
        username: "player",
        email: "player@futsalbook.id",
        role: "player", // PENTING: Role diset tegas ke player
      };

      onLogin(playerUser);
    }
  };

  // FUNGSI SUBMIT FORM MANUAL
  const handleSubmit = (e) => {
    e.preventDefault();

    const isAdmin = email.includes("admin");
    const userData = {
      id: isAdmin ? "usr-admin" : `usr-${Date.now()}`,
      name: isAdmin ? "Administrator" : email.split("@")[0],
      username: email.split("@")[0],
      email: email,
      role: isAdmin ? "admin" : "player", // Memastikan role ditentukan berdasarkan email
    };

    onLogin(userData);
  };

  return (
    <div className="min-h-screen bg-[#060814] flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-md bg-[#0b0f24] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Tombol Kembali */}
        <button
          type="button"
          onClick={() => onNavigate && onNavigate("home")}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
        >
          ← Kembali ke Beranda
        </button>

        {/* Header Title */}
        <div>
          <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-1">
            FUTSALBOOK
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Selamat Datang!</h1>
          <p className="text-slate-400 text-xs mt-1">
            Masuk untuk melanjutkan ke aplikasi.
          </p>
        </div>

        {/* Form Login Manual */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              required
              className="w-full bg-[#060814] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#060814] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold py-3 rounded-xl transition text-sm cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            Masuk
          </button>
        </form>

        {/* Pilihan Akun Demo */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <p className="text-xs text-slate-400 font-semibold">Pilih akun demo</p>

          <div className="space-y-2">
            {/* Box Demo Admin */}
            <div
              onClick={() => handleSelectDemo("admin")}
              className="p-3 bg-[#060814] border border-slate-800 hover:border-emerald-400/50 rounded-xl cursor-pointer transition group"
            >
              <p className="text-sm font-bold text-slate-200 group-hover:text-emerald-400">
                Admin
              </p>
              <p className="text-xs text-slate-500 font-mono">
                admin@futsalbook.id • admin123
              </p>
            </div>

            {/* Box Demo Player */}
            <div
              onClick={() => handleSelectDemo("player")}
              className="p-3 bg-[#060814] border border-slate-800 hover:border-emerald-400/50 rounded-xl cursor-pointer transition group"
            >
              <p className="text-sm font-bold text-emerald-400">Player</p>
              <p className="text-xs text-slate-500 font-mono">
                player@futsalbook.id • player123
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-600">
          Login demo frontend — belum terhubung ke backend.
        </p>
      </div>
    </div>
  );
}