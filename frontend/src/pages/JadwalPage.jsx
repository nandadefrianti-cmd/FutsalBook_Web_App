import React, { useEffect, useRef, useState } from "react";

const COURTS = {
  "Lapangan A": {
    type: "VINYL",
    image:
      "https://i.pinimg.com/1200x/47/a1/35/47a135ace3bb63af9268b3dc450b5008.jpg",
    weekdayPrice: 150000,
    weekendPrice: 180000,
  },
  "Lapangan B": {
    type: "VINYL",
    image:
      "https://i.pinimg.com/1200x/81/b6/3b/81b63bd45899d3951ce49dfbe95262ba.jpg",
    weekdayPrice: 150000,
    weekendPrice: 180000,
  },
  "Lapangan C": {
    type: "RUMPUT SINTETIS",
    image:
      "https://i.pinimg.com/1200x/ad/03/65/ad03659eed8b847cf1b46679c7bfe8d3.jpg",
    weekdayPrice: 120000,
    weekendPrice: 150000,
  },
};

const SLOTS = Array.from({ length: 15 }, (_, index) => {
  const start = index + 8;
  return `${String(start).padStart(2, "0")}.00 - ${String(start + 1).padStart(2, "0")}.00`;
});

const STORAGE_KEY = "bookings";

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readBookings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatTanggalIndonesia(dateString) {
  if (!dateString) return "Pilih tanggal";
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function isCancelled(booking) {
  return String(booking.status || "").toLowerCase() === "cancelled" ||
    String(booking.status || "").toLowerCase() === "dibatalkan";
}

function bookingTime(booking) {
  return booking.slot || booking.time || "";
}

export default function JadwalPage({ user, onNavigate, onLogout }) {
  const today = getLocalDateString();
  const [selectedCourt, setSelectedCourt] = useState("Lapangan A");
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("gopay");
  const [customerName, setCustomerName] = useState(
    user?.name || user?.username || ""
  );
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookings, setBookings] = useState(readBookings);
  const [bookingNotice, setBookingNotice] = useState("");
  const [error, setError] = useState("");
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const initial = new Date();
    initial.setDate(1);
    initial.setHours(12, 0, 0, 0);
    return initial;
  });
  const calendarRef = useRef(null);

  useEffect(() => {
    const savedName = user?.name || user?.username || "";
    if (savedName) setCustomerName(savedName);
  }, [user]);

  useEffect(() => {
    const syncBookings = () => setBookings(readBookings());
    window.addEventListener("storage", syncBookings);
    window.addEventListener("futsalbook-bookings-updated", syncBookings);
    return () => {
      window.removeEventListener("storage", syncBookings);
      window.removeEventListener("futsalbook-bookings-updated", syncBookings);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentCourt = COURTS[selectedCourt];
  const selectedDateObj = new Date(`${selectedDate}T12:00:00`);
  const dayOfWeek = selectedDateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const activePrice = isWeekend
    ? currentCourt.weekendPrice
    : currentCourt.weekdayPrice;

  const changeMonth = (offset) => {
    setViewDate((previous) =>
      new Date(previous.getFullYear(), previous.getMonth() + offset, 1, 12)
    );
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let index = 0; index < firstDay; index += 1) {
      days.push(<div key={`empty-${index}`} className="h-9 w-9" />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = selectedDate === dateString;
      const isPast = dateString < today;
      days.push(
        <button
          key={dateString}
          type="button"
          disabled={isPast}
          onClick={() => {
            setSelectedDate(dateString);
            setSelectedSlot("");
            setBookingNotice("");
            setError("");
            setShowCalendar(false);
          }}
          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition ${
            isSelected
              ? "bg-emerald-400 text-slate-950 shadow-lg"
              : isPast
                ? "cursor-not-allowed text-slate-700"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const getBookingForSlot = (slot) =>
    bookings.find(
      (booking) =>
        (booking.court === selectedCourt || booking.lapangan === selectedCourt) &&
        (booking.date === selectedDate || booking.hariTanggal?.includes(selectedDate)) &&
        bookingTime(booking) === slot &&
        !isCancelled(booking)
    );

  const selectedSlotBooking = selectedSlot
    ? getBookingForSlot(selectedSlot)
    : null;

  const saveBookingAfterPayment = () => {
    if (user?.role !== "player") {
      setError("Silakan masuk menggunakan akun Player untuk melakukan booking.");
      setShowQrisModal(false);
      return false;
    }

    const name = (user?.name || user?.username || customerName).trim();
    if (!name) {
      setError("Nama pemesan belum tersedia. Lengkapi nama akun terlebih dahulu.");
      setShowQrisModal(false);
      return false;
    }
    if (!customerPhone.trim()) {
      setError("Nomor telepon wajib diisi sebelum melakukan booking.");
      setShowQrisModal(false);
      return false;
    }
    if (!/^[+0-9][0-9+\s()-]{7,19}$/.test(customerPhone.trim())) {
      setError("Masukkan nomor telepon yang valid, minimal 8 digit.");
      setShowQrisModal(false);
      return false;
    }
    if (!selectedDate || !selectedSlot) {
      setError("Pilih tanggal dan jam bermain terlebih dahulu.");
      return false;
    }
    if (selectedDate < today) {
      setError("Tanggal booking tidak boleh sudah lewat.");
      return false;
    }

    const latestBookings = readBookings();
    const alreadyBooked = latestBookings.some(
      (booking) =>
        (booking.court === selectedCourt || booking.lapangan === selectedCourt) &&
        (booking.date === selectedDate || booking.hariTanggal?.includes(selectedDate)) &&
        bookingTime(booking) === selectedSlot &&
        !isCancelled(booking)
    );

    if (alreadyBooked) {
      setBookings(latestBookings);
      setError("Slot ini sudah dipesan. Silakan pilih jam lain.");
      setShowQrisModal(false);
      return false;
    }

    const newBooking = {
      id: `FB-${Date.now()}`,
      userId: user?.id || user?.email || name,
      playerName: name,
      customerName: name,
      phone: customerPhone.trim(),
      email: user?.email || "",
      court: selectedCourt,
      lapangan: selectedCourt,
      date: selectedDate,
      hariTanggal: formatTanggalIndonesia(selectedDate),
      slot: selectedSlot,
      time: selectedSlot,
      payment: selectedPayment.toUpperCase(),
      price: activePrice,
      totalHarga: formatRupiah(activePrice),
      status: "TERISI",
      pesanStatus: `Slot ${selectedSlot} di ${selectedCourt} telah dibooking oleh ${name}.`,
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...latestBookings];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    window.dispatchEvent(new Event("futsalbook-bookings-updated"));
    setError("");
    setBookingNotice(
      `Booking berhasil dibuat. ${selectedCourt}, ${selectedSlot}, ${formatTanggalIndonesia(selectedDate)}.`
    );
    setShowQrisModal(false);
    setShowSuccessModal(true);
    setCustomerPhone("");
    return true;
  };

  const handleBooking = () => {
    setError("");
    setBookingNotice("");

    if (user?.role !== "player") {
      setError("Hanya akun Player yang dapat melakukan booking.");
      return;
    }
    if (!customerPhone.trim()) {
      setError("Masukkan nomor telepon terlebih dahulu.");
      return;
    }
    if (!/^[+0-9][0-9+\s()-]{7,19}$/.test(customerPhone.trim())) {
      setError("Masukkan nomor telepon yang valid, minimal 8 digit.");
      return;
    }
    if (!selectedSlot) {
      setError("Silakan pilih slot jam terlebih dahulu.");
      return;
    }
    if (selectedSlotBooking) {
      const pemesan = selectedSlotBooking.playerName || selectedSlotBooking.customerName || "pengguna lain";
      setError(`Slot jam ${selectedSlot} sudah dibooking oleh ${pemesan}. Silakan pilih jam lain.`);
      return;
    }
    if (selectedDate < today) {
      setError("Tanggal booking tidak boleh sudah lewat.");
      return;
    }

    if (selectedPayment === "qris") {
      setShowQrisModal(true);
    } else {
      saveBookingAfterPayment();
    }
  };

  const monthLabel = viewDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative min-h-screen bg-[#070b19] font-sans text-white antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b19]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 font-bold text-slate-950">⚽</span>
            <span className="text-lg font-extrabold tracking-tight">Futsal<span className="text-emerald-400">Book</span></span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            <button type="button" onClick={() => onNavigate?.("home")} className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer">Beranda</button>
            <button type="button" onClick={() => onNavigate?.("jadwal")} className="rounded-lg bg-slate-800/60 px-4 py-2 text-sm font-semibold text-emerald-400 cursor-pointer">Jadwal Lapangan</button>
            {user?.role === "player" && <button type="button" onClick={() => onNavigate?.("booking-saya")} className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer">Booking Saya</button>}
            {user?.role === "admin" && <button type="button" onClick={() => onNavigate?.("dashboard")} className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer">Dashboard</button>}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-xs font-bold text-emerald-400">{(user.name || user.username || user.email || "S").charAt(0).toUpperCase()}</div>
                <span className="hidden max-w-32 truncate text-xs font-semibold text-slate-200 sm:inline">{user.name || user.username || user.email}</span>
                <span className="hidden text-slate-600 sm:inline">|</span>
                <button type="button" onClick={onLogout} className="text-xs font-medium text-rose-400 transition hover:text-rose-300 cursor-pointer">Keluar</button>
              </div>
            ) : (
              <button type="button" onClick={() => onNavigate?.("auth")} className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 cursor-pointer">Masuk</button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* PILIH LAPANGAN DAN JAM */}
          <section className="space-y-6 lg:col-span-8">
            <div className="group relative h-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl md:h-72">
              <img src={currentCourt.image} alt={selectedCourt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-[#070b19]/40 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-3">
                <div>
                  <h1 className="mb-1 text-2xl font-black tracking-tight md:text-3xl">FutsalBook Arena</h1>
                  <p className="flex items-center gap-1.5 text-xs text-slate-300 md:text-sm">📍 Jl. Akses UI No. 45, Depok</p>
                </div>
                <span className="shrink-0 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">Buka 08.00–23.00</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5 shadow-lg">
              <div className="flex flex-1 items-center gap-1 sm:gap-2">
                {Object.keys(COURTS).map((court) => (
                  <button key={court} type="button" onClick={() => { setSelectedCourt(court); setSelectedSlot(""); setBookingNotice(""); setError(""); }} className={`flex-1 rounded-xl px-2 py-2.5 text-xs font-bold transition cursor-pointer sm:px-4 sm:text-sm ${selectedCourt === court ? "border border-slate-700 bg-slate-800 text-white shadow-md" : "text-slate-400 hover:bg-slate-950/40 hover:text-slate-200"}`}>{court}</button>
                ))}
              </div>
              <span className="hidden rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] font-extrabold tracking-wider text-emerald-400 sm:inline-block">{currentCourt.type}</span>
            </div>

            {/* PEMILIH TANGGAL */}
            <div className="relative" ref={calendarRef}>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-lg">
                <button type="button" aria-label="Tanggal sebelumnya" disabled={selectedDate <= today} onClick={() => { const date = new Date(`${selectedDate}T12:00:00`); date.setDate(date.getDate() - 1); setSelectedDate(getLocalDateString(date)); setSelectedSlot(""); setError(""); setBookingNotice(""); }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-lg text-slate-300 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer">‹</button>
                <button type="button" onClick={() => { setViewDate(new Date(Number(selectedDate.slice(0, 4)), Number(selectedDate.slice(5, 7)) - 1, 1, 12)); setShowCalendar((shown) => !shown); }} className="flex items-center gap-2 text-center text-sm font-bold text-white transition hover:text-emerald-400 md:text-base cursor-pointer">📅 <span>{formatTanggalIndonesia(selectedDate)}</span> ▾</button>
                <button type="button" aria-label="Tanggal berikutnya" onClick={() => { const date = new Date(`${selectedDate}T12:00:00`); date.setDate(date.getDate() + 1); setSelectedDate(getLocalDateString(date)); setSelectedSlot(""); setError(""); setBookingNotice(""); }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-lg text-slate-300 transition hover:border-slate-700 hover:text-white cursor-pointer">›</button>
              </div>

              {showCalendar && (
                <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-slate-700/90 bg-[#0f172a] p-4 shadow-2xl shadow-black/80">
                  <div className="mb-4 flex items-center justify-between px-1">
                    <button type="button" onClick={() => changeMonth(-1)} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer">‹</button>
                    <span className="text-sm font-bold tracking-wide">{monthLabel}</span>
                    <button type="button" onClick={() => changeMonth(1)} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer">›</button>
                  </div>
                  <div className="mb-2 grid grid-cols-7 gap-1 text-center">{["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => <span key={day} className="text-[10px] font-bold uppercase text-slate-400">{day}</span>)}</div>
                  <div className="grid grid-cols-7 justify-items-center gap-1">{renderCalendarDays()}</div>
                </div>
              )}
            </div>

            {/* SLOT JAM */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold tracking-tight">Pilih Jam</h2>
                <span className="text-right text-xs font-medium text-slate-400">08.00–23.00</span>
              </div>
              
              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {SLOTS.map((slot) => {
                  const slotBooking = getBookingForSlot(slot);
                  const isSelected = selectedSlot === slot && !slotBooking;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        if (slotBooking) {
                          const pemesan = slotBooking.playerName || slotBooking.customerName || "pengguna lain";
                          setError(`Slot jam ${slot} sudah dibooking oleh ${pemesan}. Silakan pilih jam lain.`);
                          setBookingNotice("");
                        } else {
                          setSelectedSlot(slot);
                          setBookingNotice("");
                          setError("");
                        }
                      }}
                      className={`rounded-xl border p-3 text-xs font-semibold transition cursor-pointer ${
                        slotBooking
                          ? "border-rose-800 bg-rose-950/70 text-rose-300 hover:border-rose-600"
                          : isSelected
                            ? "border-emerald-400 bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-400/20"
                            : "border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-600"
                      }`}
                    >
                      <span className="block">{slot}</span>
                      {slotBooking && (
                        <span className="mt-1 block text-[9px] uppercase tracking-wide font-extrabold text-rose-400">
                          TERISI
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {error && <div role="alert" className="mb-4 rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>}
              {bookingNotice && <div role="status" className="mb-4 rounded-xl border border-emerald-700 bg-emerald-950/40 p-4 text-sm text-emerald-200">{bookingNotice}</div>}

              <div className="flex flex-wrap items-center gap-5 border-t border-slate-800/80 pt-4 text-xs font-semibold">
                <div className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-md border border-slate-800 bg-slate-950" /><span className="text-slate-300">Tersedia</span></div>
                <div className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-md bg-emerald-400" /><span className="text-slate-300">Dipilih</span></div>
                <div className="flex items-center gap-2"><span className="h-3.5 w-3.5 rounded-md border border-rose-800 bg-rose-950" /><span className="text-slate-300">Terisi / Dipesan</span></div>
              </div>
            </div>
          </section>

          {/* HARGA DAN RINGKASAN */}
          <aside className="space-y-6 lg:col-span-4">
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
              <h2 className="border-b border-slate-800 pb-3 text-base font-bold">Harga Lapangan</h2>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between gap-3 text-slate-300"><span>Weekday (Sen–Jum)</span><span className="font-bold text-white">{formatRupiah(currentCourt.weekdayPrice)}<span className="font-normal text-slate-400">/jam</span></span></div>
                <div className="flex items-center justify-between gap-3 text-slate-300"><span>Weekend (Sab–Min)</span><span className="font-bold text-white">{formatRupiah(currentCourt.weekendPrice)}<span className="font-normal text-slate-400">/jam</span></span></div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
              <h2 className="border-b border-slate-800 pb-3 text-lg font-bold">Ringkasan Booking</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4"><span className="text-slate-400">Lapangan</span><span className="font-semibold text-white">{selectedCourt}</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-400">Tanggal</span><span className="text-right font-semibold text-white">{formatTanggalIndonesia(selectedDate)}</span></div>
                <div className="flex justify-between gap-4"><span className="text-slate-400">Waktu</span><span className="text-right font-semibold text-white">{selectedSlot || "Belum dipilih"}</span></div>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <label htmlFor="customerName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Nama Pemesan</label>
                <input id="customerName" type="text" value={user?.name || user?.username || customerName} onChange={(event) => setCustomerName(event.target.value)} readOnly={Boolean(user?.name || user?.username)} placeholder="Masukkan nama pemesan" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none read-only:opacity-80" />
              </div>
              
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <label
                  htmlFor="customerPhone"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  No. Telepon
                </label>
                <input
                  id="customerPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={customerPhone}
                  onChange={(event) => {
                    setCustomerPhone(event.target.value);
                    setError("");
                  }}
                  required
                  maxLength={20}
                  placeholder="Contoh: 081234567890"
                  aria-describedby="customerPhoneHelp"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                />
                <p id="customerPhoneHelp" className="text-[11px] leading-5 text-slate-500">
                  Masukkan nomor yang aktif agar admin dapat menghubungi kamu.
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Metode Pembayaran</p>
                <div className="space-y-2">
                  {[
                    { value: "qris", title: "QRIS (Simulasi Scan)", detail: "Simulasi pembayaran QRIS", symbol: "▦" },
                    { value: "gopay", title: "GoPay", detail: "Pembayaran melalui GoPay", symbol: "G" },
                    { value: "dana", title: "DANA", detail: "Pembayaran melalui DANA", symbol: "D" },
                    { value: "ovo", title: "OVO", detail: "Pembayaran melalui OVO", symbol: "O" },
                  ].map((payment) => (
                    <label key={payment.value} className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 transition ${selectedPayment === payment.value ? "border-emerald-500 bg-emerald-500/10" : "border-slate-800 bg-slate-950 hover:border-slate-700"}`}>
                      <span className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-bold text-emerald-400">{payment.symbol}</span><span><span className="block text-xs font-bold text-white">{payment.title}</span><span className="mt-0.5 block text-[10px] text-slate-400">{payment.detail}</span></span></span>
                      <input type="radio" name="payment" value={payment.value} checked={selectedPayment === payment.value} onChange={(event) => setSelectedPayment(event.target.value)} className="accent-emerald-400 cursor-pointer" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3"><span className="font-medium text-slate-400">Total Harga</span><span className="text-lg font-bold text-emerald-400">{selectedSlot ? formatRupiah(activePrice) : "Rp0"}</span></div>
              <button type="button" onClick={handleBooking} disabled={!selectedSlot || Boolean(selectedSlotBooking)} className="mt-2 w-full rounded-xl bg-emerald-400 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none cursor-pointer">{selectedSlotBooking ? "Slot Sudah Dipesan" : "Booking Sekarang"}</button>
              {user?.role !== "player" && <p className="text-xs leading-5 text-amber-300">Login sebagai Player diperlukan untuk melakukan booking.</p>}
            </div>
          </aside>
        </div>
      </main>

      {/* MODAL QRIS */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="qris-title" className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center shadow-2xl">
            <h2 id="qris-title" className="text-lg font-bold">Simulasi Pembayaran QRIS</h2>
            <p className="text-xs leading-5 text-slate-400">Ini hanya demo frontend. Tidak ada pembayaran nyata yang diproses.</p>
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl border-4 border-emerald-400 bg-white p-3"><div className="border-2 border-dashed border-slate-950 p-3 text-xs font-black tracking-tight text-slate-950">QRIS DEMO FUTSALBOOK</div></div>
            <button type="button" onClick={saveBookingAfterPayment} className="w-full rounded-xl bg-emerald-400 py-3 text-xs font-bold text-slate-950 transition hover:bg-emerald-500 cursor-pointer">Simulasikan Pembayaran Berhasil</button>
            <button type="button" onClick={() => setShowQrisModal(false)} className="w-full rounded-xl bg-slate-800 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700 cursor-pointer">Batal</button>
          </div>
        </div>
      )}

      {/* MODAL BOOKING BERHASIL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="success-title" className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/20 text-3xl text-emerald-400">✓</div>
            <h2 id="success-title" className="text-xl font-bold">Booking Berhasil Dibuat!</h2>
            <p className="text-xs leading-5 text-slate-400">Booking tersimpan dengan status <span className="font-semibold text-rose-400 uppercase">Terisi</span>.</p>
            <button type="button" onClick={() => { setShowSuccessModal(false); onNavigate?.("booking-saya"); }} className="w-full rounded-xl bg-emerald-400 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-500 cursor-pointer">Lihat Status Booking</button>
            <button type="button" onClick={() => setShowSuccessModal(false)} className="w-full rounded-xl bg-slate-800 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700 cursor-pointer">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}