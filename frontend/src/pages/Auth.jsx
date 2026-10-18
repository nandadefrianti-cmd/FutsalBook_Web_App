import React, { useState } from 'react';

function Auth({ onLogin, onNavigate }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'player' // default role: 'player' atau 'admin'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulasi data user yang login
    const userData = {
      id: Date.now(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: formData.role // Bisa 'player' atau 'admin'
    };

    onLogin(userData);
  };

  return (
    <div className="min-h-screen bg-[#070b19] flex items-center justify-center px-4 relative">
      {/* Tombol kembali ke Beranda (Hanya muncul jika fungsi onNavigate tersedia) */}
      {onNavigate && (
        <button 
          type="button"
          onClick={() => onNavigate('home')}
          className="absolute top-6 left-6 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition"
        >
          <span>←</span> Kembali ke Beranda
        </button>
      )}

      <div className="bg-slate-900/90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800 backdrop-blur-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-400 text-slate-950 font-bold flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-400/20">
            ⚽
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Futsal<span className="text-emerald-400">Book</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {isRegister ? 'Daftar akun baru Kelompok 10' : 'Masuk untuk kelola jadwal & booking'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full p-3 rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-emerald-400 text-sm transition"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              className="w-full p-3 rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-emerald-400 text-sm transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-emerald-400 text-sm transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Pilih Peran (Role)</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-slate-950 text-white border border-slate-800 focus:outline-none focus:border-emerald-400 text-sm transition"
            >
              <option value="player">Player / Penyewa Lapangan</option>
              <option value="admin">Admin / Pengelola Arena</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-500 font-bold rounded-xl text-slate-950 transition shadow-lg shadow-emerald-400/20 text-sm mt-2"
          >
            {isRegister ? 'Daftar Sekarang' : 'Masuk Sistem'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          {isRegister ? 'Sudah punya akun?' : 'Belum punya akun?'}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-emerald-400 underline font-semibold ml-1"
          >
            {isRegister ? 'Masuk di sini' : 'Buat akun baru'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;