import React, { useState, useRef, useEffect } from 'react';

function JadwalPage({ onNavigate, user, onLogout }) {
  const [selectedCourt, setSelectedCourt] = useState('Lapangan A');
  const [selectedDate, setSelectedDate] = useState('2026-10-21');
  const [selectedSlot, setSelectedSlot] = useState('19.00 - 20.00');

  // State untuk Kontrol Modal Peringatan Slot Terisi
  const [showBookedModal, setShowBookedModal] = useState(false);
  const [bookedSlotInfo, setBookedSlotInfo] = useState('');

  // State & Ref untuk Pop-up Kalender Interaktif
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2026, 9, 1)); // Oktober 2026
  const calendarRef = useRef(null);

  // Tutup kalender jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeMonth = (offset) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const formattedDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = selectedDate === formattedDayStr;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => {
            setSelectedDate(formattedDayStr);
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

  // Detail konfigurasi masing-masing lapangan
  const courtDetails = {
    'Lapangan A': {
      type: 'VINYL',
      image: 'https://i.pinimg.com/1200x/47/a1/35/47a135ace3bb63af9268b3dc450b5008.jpg',
      weekdayPrice: 'Rp150.000',
      weekendPrice: 'Rp180.000',
    },
    'Lapangan B': {
      type: 'VINYL',
      image: 'https://i.pinimg.com/1200x/6d/f5/88/6df588510bcc0faade4d9682b607dc76.jpg',
      weekdayPrice: 'Rp150.000',
      weekendPrice: 'Rp180.000',
    },
    'Lapangan C': {
      type: 'RUMPUT SINTETIS',
      image: 'https://i.pinimg.com/736x/15/35/24/153524e8c9cad4dadebb131012f90f2a.jpg',
      weekdayPrice: 'Rp120.000',
      weekendPrice: 'Rp150.000',
    }
  };

  const slots = [
    { time: '08.00 - 09.00', status: 'tersedia' },
    { time: '09.00 - 10.00', status: 'tersedia' },
    { time: '10.00 - 11.00', status: 'tersedia' },
    { time: '11.00 - 12.00', status: 'tersedia' },
    { time: '12.00 - 13.00', status: 'tersedia' },
    { time: '13.00 - 14.00', status: 'terisi' },
    { time: '14.00 - 15.00', status: 'tersedia' },
    { time: '15.00 - 16.00', status: 'tersedia' },
    { time: '16.00 - 17.00', status: 'tersedia' },
    { time: '17.00 - 18.00', status: 'tersedia' },
    { time: '18.00 - 19.00', status: 'tersedia' },
    { time: '19.00 - 20.00', status: 'tersedia' },
    { time: '20.00 - 21.00', status: 'tersedia' },
    { time: '21.00 - 22.00', status: 'tersedia' },
    { time: '22.00 - 23.00', status: 'tersedia' },
  ];

  const currentCourt = courtDetails[selectedCourt];

  const formatTanggalIndonesia = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const isWeekend = (dateString) => {
    const day = new Date(dateString).getDay();
    return day === 0 || day === 6;
  };

  const activePrice = isWeekend(selectedDate) 
    ? currentCourt.weekendPrice 
    : currentCourt.weekdayPrice;

  const handleSlotClick = (slot) => {
    if (slot.status === 'terisi') {
      setBookedSlotInfo(slot.time);
      setShowBookedModal(true);
    } else {
      setSelectedSlot(slot.time);
    }
  };

  const handleBooking = () => {
    if (!selectedSlot) {
      alert('Silakan pilih slot jam terlebih dahulu.');
      return;
    }
    if (onNavigate) {
      onNavigate('booking');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-white font-sans antialiased selection:bg-emerald-500 selection:text-slate-950 relative">
      
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#070b19]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
              className="flex items-center gap-2.5 cursor-pointer" 
              onClick={() => onNavigate && onNavigate('home')}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-400 flex items-center justify-center font-bold text-slate-950 shadow-md shadow-emerald-400/20">
                ⚽
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">
                Futsal<span className="text-emerald-400">Book</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => onNavigate && onNavigate('home')} 
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
              >
                Beranda
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('jadwal')} 
                className="px-4 py-2 text-sm font-semibold text-emerald-400 bg-slate-800/60 rounded-lg transition"
              >
                Jadwal Lapangan
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('booking')} 
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 rounded-lg transition"
              >
                Booking Saya
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <span className="text-xs font-semibold text-slate-200">{user.name || 'Salwa'}</span>
                <span className="text-slate-600">|</span>
                <button 
                  onClick={onLogout}
                  className="text-xs font-medium text-rose-400 hover:text-rose-300 transition"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => onNavigate && onNavigate('auth')}
                className="px-5 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition shadow-sm"
              >
                Masuk
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Layout Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Court Info & Slot Grid */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Court Hero Image */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl h-64 md:h-72 bg-slate-900 group">
              <img 
                src={currentCourt.image} 
                alt={selectedCourt} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-[#070b19]/40 to-transparent"></div>
              
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
                    FutsalBook Arena
                  </h1>
                  <p className="text-xs md:text-sm text-slate-300 flex items-center gap-1.5">
                    📍 Jl. Akses UI No. 45, Depok,
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-semibold text-emerald-400 shadow">
                  Buka 08.00 – 23.00
                </span>
              </div>
            </div>

            {/* Court Switcher Tabs */}
            <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 shadow-lg">
              <div className="flex items-center gap-2 flex-1">
                {['Lapangan A', 'Lapangan B', 'Lapangan C'].map((court) => (
                  <button
                    key={court}
                    onClick={() => setSelectedCourt(court)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold transition ${
                      selectedCourt === court
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950/40'
                    }`}
                  >
                    {court}
                  </button>
                ))}
              </div>
              <span className="hidden sm:inline-block px-3 py-1.5 bg-slate-950 text-emerald-400 text-[11px] font-extrabold rounded-xl border border-slate-800 tracking-wider">
                {currentCourt.type}
              </span>
            </div>

            {/* Date Selector Banner dengan Pop-up Kalender Interaktif */}
            <div className="relative" ref={calendarRef}>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between shadow-lg">
                <button 
                  type="button"
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition"
                >
                  ‹
                </button>

                <div 
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="flex items-center gap-2 font-bold text-sm md:text-base text-white cursor-pointer hover:text-emerald-400 transition"
                >
                  📅 <span>{formatTanggalIndonesia(selectedDate)}</span> ▾
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition"
                >
                  ›
                </button>
              </div>

              {/* POP-UP KALENDER MELAYANG */}
              {showCalendar && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-[#0f172a] border border-slate-700/90 rounded-2xl p-4 shadow-2xl shadow-black/80 w-72 backdrop-blur-xl animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <button type="button" onClick={() => changeMonth(-1)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">‹</button>
                    <span className="text-sm font-bold text-white tracking-wide">{formatMonthYear(viewDate)}</span>
                    <button type="button" onClick={() => changeMonth(1)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition">›</button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['SUN', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((d) => (
                      <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 justify-items-center">
                    {renderCalendarDays()}
                  </div>
                </div>
              )}
            </div>

            {/* Slots Card Container */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white tracking-tight">Pilih Jam</h3>
                <span className="text-xs text-slate-400 font-medium">15 slot tersedia per hari</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {slots.map((slot, index) => {
                  const isSelected = selectedSlot === slot.time;
                  const isBooked = slot.status === 'terisi';

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSlotClick(slot)}
                      className={`py-3 px-2 rounded-xl text-xs md:text-sm font-bold border transition duration-200 flex flex-col items-center justify-center gap-0.5 ${
                        isBooked
                          ? 'bg-slate-950/50 border-slate-900 text-slate-500 hover:border-rose-500/40 cursor-pointer'
                          : isSelected
                          ? 'bg-emerald-400 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-400/20 ring-2 ring-emerald-400/50'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-400'
                      }`}
                    >
                      <span>{slot.time}</span>
                      {isBooked && <span className="text-[10px] font-medium uppercase text-slate-500">TERISI</span>}
                    </button>
                  );
                })}
              </div>

              {/* Legend Indicator */}
              <div className="flex items-center gap-6 pt-4 border-t border-slate-800/80 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-500/20 border border-emerald-400"></span>
                  <span className="text-slate-300">Tersedia</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-slate-950 border border-slate-900"></span>
                  <span className="text-slate-500">Terisi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-md bg-emerald-400"></span>
                  <span className="text-slate-300">Dipilih</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE: Pricing Card & Booking Summary */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3">
                Harga Lapangan
              </h3>
              <div className="space-y-2.5 text-xs md:text-sm">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Weekday (Sen - Jum)</span>
                  <span className="font-bold text-white">{currentCourt.weekdayPrice} <span className="text-slate-400 font-normal">/jam</span></span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Weekend (Sab - Min)</span>
                  <span className="font-bold text-white">{currentCourt.weekendPrice} <span className="text-slate-400 font-normal">/jam</span></span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
              <h3 className="text-base font-bold text-white tracking-tight border-b border-slate-800 pb-3">
                Ringkasan Booking
              </h3>

              <div className="space-y-3 text-xs md:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Lapangan</span>
                  <span className="font-bold text-white">{selectedCourt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tanggal</span>
                  <span className="font-semibold text-slate-200">{formatTanggalIndonesia(selectedDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Waktu</span>
                  <span className="font-semibold text-emerald-400">{selectedSlot ? `${selectedSlot} (1 jam)` : 'Belum dipilih'}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm text-slate-300 font-medium">Total Harga</span>
                <span className="text-xl font-black text-emerald-400">
                  {selectedSlot ? activePrice : 'Rp0'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleBooking}
                className="w-full py-3.5 bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-extrabold rounded-xl transition shadow-lg shadow-emerald-400/20 text-sm tracking-wide"
              >
                Booking Sekarang
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* 3. MODAL PERINGATAN "SLOT SUDAH TERISI" */}
      {showBookedModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#ffffff] text-slate-900 p-8 rounded-3xl w-full max-w-sm text-center shadow-2xl border border-slate-100 transform transition-all scale-100">
            <div className="w-14 h-14 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center mx-auto mb-4 text-rose-500 text-2xl font-bold">
              !
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">
              Slot sudah terisi
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Maaf, slot {bookedSlotInfo || '19.00 – 20.00'} di {selectedCourt} baru saja dipesan orang lain. Silakan pilih jam lain.
            </p>
            <button
              type="button"
              onClick={() => setShowBookedModal(false)}
              className="w-full py-3 bg-[#0a1b3a] hover:bg-[#122b5c] text-white font-bold rounded-xl transition text-sm shadow-md"
            >
              Pilih Jam Lain
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default JadwalPage;