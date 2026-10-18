import React, { useState, useRef, useEffect } from 'react';

function HomePage({ onNavigate }) {
  const [selectedLapangan, setSelectedLapangan] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('2025-05-18');
  
  // State dan Ref untuk kontrol Pop-up Kalender
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2025, 4, 1)); // Mei 2025
  const calendarRef = useRef(null);

  // Fungsi untuk menutup pop-up kalender jika mengeklik area luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCekJadwal = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('jadwal');
  };

  // Helper format tanggal dari YYYY-MM-DD ke DD/MM/YYYY
  const formatDateDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Logika Generate Tanggal untuk Pop-up Kalender
  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    
    // Offset hari kosong
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // List tanggal bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedTanggal === formattedDayStr;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => {
            setSelectedTanggal(formattedDayStr);
            setShowCalendar(false);
          }}
          className={`h-8 w-8 rounded-full text-xs font-semibold flex items-center justify-center transition ${
            isSelected
              ? 'bg-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-400/30 scale-105'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-white font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 bg-[#070b19]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-emerald-500/20">
                ⚽
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Futsal<span className="text-emerald-400">Book</span>
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => onNavigate && onNavigate('home')} 
                className="px-4 py-2 text-sm font-semibold text-emerald-400 bg-slate-800/60 rounded-lg transition"
              >
                Beranda
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('jadwal')} 
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
              >
                Jadwal Lapangan
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate && onNavigate('auth')}
              className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-lg transition shadow-sm"
            >
              Masuk
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('auth')}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white transition"
            >
              👤
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section dengan Background Banner */}
      <section className="relative pt-12 pb-24 px-6 overflow-visible border-b border-slate-800/60">
        <div className="absolute inset-0 z-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1920&auto=format&fit=crop')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070b19]/60 via-[#070b19]/80 to-[#070b19] z-0"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
            <span>🛡️</span> SISTEM RESERVASI RESMI
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 leading-tight">
            Booking Lapangan, <span className="text-emerald-400">Gas Main!</span>
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto mb-8 font-normal">
            Lihat jadwal kosong dan pesan lapangan futsal tanpa chat sana-sini.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button 
              onClick={() => onNavigate && onNavigate('jadwal')}
              className="px-6 py-3 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-400/20 transition flex items-center gap-2 text-sm"
            >
              <span>Lihat Jadwal</span> 
            </button>
            <button 
              onClick={() => onNavigate && onNavigate('auth')}
              className="px-6 py-3 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              <span>Masuk</span> 
            </button>
          </div>
        </div>

        {/* Floating Quick Filter Card */}
        <div className="max-w-4xl mx-auto relative z-30" ref={calendarRef}>
          <form onSubmit={handleCekJadwal} className="bg-slate-900/90 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-slate-700/80 shadow-2xl grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                Lapangan
              </label>
              <select
                value={selectedLapangan}
                onChange={(e) => setSelectedLapangan(e.target.value)}
                className="w-full bg-slate-950 text-white border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="">Pilih lapangan</option>
                <option value="A">Lapangan A (Vinyl - Indoor Standard)</option>
                <option value="B">Lapangan B (Vinyl - Turnamen Resmi)</option>
                <option value="C">Lapangan C (Rumput Sintetis)</option>
              </select>
            </div>

            {/* BARIS TANGGAL DENGAN AKSI KLIK PADA IKON & POPUP KALENDER */}
            <div className="md:col-span-4 relative">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                Tanggal
              </label>

              {/* Box Tanggal Interaktif */}
              <div
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full bg-slate-950 text-white border border-slate-700/80 rounded-xl px-3.5 py-3 text-sm flex items-center justify-between cursor-pointer hover:border-emerald-500 transition"
              >
                <span>{formatDateDisplay(selectedTanggal)}</span>
                <span className="text-slate-400 hover:text-emerald-400 transition text-base">📅</span>
              </div>

              {/* POP-UP KALENDER MELAYANG */}
              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 z-50 bg-[#0f172a] border border-slate-700/90 rounded-2xl p-4 shadow-2xl shadow-black/80 w-72 backdrop-blur-xl animate-in fade-in duration-200">
                  
                  {/* Header Pop-up (Bulan & Navigasi Panah) */}
                  <div className="flex items-center justify-between mb-4 px-1">
                    <button
                      type="button"
                      onClick={() => changeMonth(-1)}
                      className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                    >
                      ‹
                    </button>
                    <span className="text-sm font-bold text-white tracking-wide">
                      {formatMonthYear(viewDate)}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeMonth(1)}
                      className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
                    >
                      ›
                    </button>
                  </div>

                  {/* Header Nama Hari */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['SUN', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
                      <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Grid Tanggal */}
                  <div className="grid grid-cols-7 gap-1 justify-items-center">
                    {renderCalendarDays()}
                  </div>

                </div>
              )}
            </div>

            <div className="md:col-span-3 flex items-end">
              <button
                type="submit"
                className="w-full h-[46px] bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/20 text-sm mt-auto"
              >
                <span>🔍</span> Lihat Jadwal
              </button>
            </div>

          </form>
        </div>
      </section>

      {/* 3. Section: Lapangan Kami */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-1">Lapangan Kami</h2>
            <p className="text-slate-400 text-sm">Pilih lapangan dan lihat jadwalnya.</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Update Slot Real-Time
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Lapangan A */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col group shadow-lg">
            <div className="relative h-52 overflow-hidden bg-slate-950">
              <img 
                src="https://i.pinimg.com/1200x/47/a1/35/47a135ace3bb63af9268b3dc450b5008.jpg" 
                alt="Lapangan A" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                ● Tersedia
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-800">
                ⚡ Indoor Standard
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Lapangan A</h3>
                <p className="text-xs text-slate-400 mb-6">🔹 Vinyl</p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">Tarif Sewa</span>
                  <span className="text-sm font-bold text-emerald-400">Mulai Rp100.000<span className="text-xs font-normal text-slate-400">/jam</span></span>
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('jadwal')}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition"
                >
                  ➡️
                </button>
              </div>
            </div>
          </div>

          {/* Card Lapangan B */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col group shadow-lg">
            <div className="relative h-52 overflow-hidden bg-slate-950">
              <img 
                src="https://i.pinimg.com/1200x/81/b6/3b/81b63bd45899d3951ce49dfbe95262ba.jpg" 
                alt="Lapangan B" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                ● Tersedia
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-800">
                🏆 Turnamen Resmi
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Lapangan B</h3>
                <p className="text-xs text-slate-400 mb-6">🔹 Vinyl</p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">Tarif Sewa</span>
                  <span className="text-sm font-bold text-emerald-400">Mulai Rp100.000<span className="text-xs font-normal text-slate-400">/jam</span></span>
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('jadwal')}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition"
                >
                  ➡️
                </button>
              </div>
            </div>
          </div>

          {/* Card Lapangan C */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-700 transition flex flex-col group shadow-lg">
            <div className="relative h-52 overflow-hidden bg-slate-950">
              <img 
                src="https://i.pinimg.com/1200x/ad/03/65/ad03659eed8b847cf1b46679c7bfe8d3.jpg" 
                alt="Lapangan C" 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full shadow">
                ● Tersedia
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 text-xs font-semibold px-3 py-1 rounded-lg border border-slate-800">
                🌿 Rumput Sintetis
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Lapangan C</h3>
                <p className="text-xs text-slate-400 mb-6">🌿 Rumput Sintetis</p>
              </div>
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-slate-400">Tarif Sewa</span>
                  <span className="text-sm font-bold text-emerald-400">Mulai Rp80.000<span className="text-xs font-normal text-slate-400">/jam</span></span>
                </div>
                <button 
                  onClick={() => onNavigate && onNavigate('jadwal')}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition"
                >
                  ➡️
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Section: Cara Booking */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">Kemudahan Reservasi</span>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">Cara Booking</h2>
          <p className="text-slate-400 text-sm">Tiga langkah praktis untuk mengamankan jadwal tanding tim Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-400/20">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Pilih slot</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">Pilih lapangan, tanggal, dan jam kosong.</p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>⚡</span> Cek ketersediaan instan
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-400/20">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Upload bukti bayar</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">Transfer lalu unggah bukti pembayaranmu.</p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>💳</span> QRIS & Transfer Bank
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 relative flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center mb-6 shadow-md shadow-emerald-400/20">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Tunggu konfirmasi</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">Admin mengonfirmasi dan slotmu aman.</p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>✅</span> Konfirmasi cepat &lt; 15 menit
            </div>
          </div>

        </div>
      </section>

      {/* 5. CTA Banner Bawah */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-slate-900 via-[#0a1228] to-slate-900 border border-slate-800 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-2xl shrink-0">
              ⚽
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">Fasilitas Lengkap & Standar FIFA</h3>
              <p className="text-slate-400 text-xs md:text-sm">Kamar bilas air hangat, ruang ganti ber-AC, kantin, dan tribun penonton nyaman.</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate && onNavigate('jadwal')}
            className="px-6 py-3 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-400/20 text-sm shrink-0"
          >
            Pesan Sekarang
          </button>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-12 py-6 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-emerald-400 flex items-center justify-center text-slate-950 font-bold text-[10px]">⚽</span>
            <span className="text-slate-300 font-medium">FutsalBook Arena</span>
            <span>– Jl. Akses UI No. 45, Depok, – Buka 08.00 - 23.00</span>
          </div>
          <div>
            © 2025 FutsalBook. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default HomePage;