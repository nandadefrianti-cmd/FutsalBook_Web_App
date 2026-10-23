import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getVenue, getCourts, getSlotTerisi, buatSlotHari } from "../services/slotService";
import { bookSlot } from "../services/bookingService";
import { hargaSlot } from "../services/validators";
import { METODE_BAYAR } from "../config/pembayaran";
import { rupiah, tanggalPanjang, tanggalIso, geserHari } from "../lib/format";

// Foto dicocokkan lewat nama lapangan. Data lapangan, harga, jam buka diambil dari database.
const FOTO = {
  "Lapangan A": "https://i.pinimg.com/1200x/47/a1/35/47a135ace3bb63af9268b3dc450b5008.jpg",
  "Lapangan B": "https://i.pinimg.com/1200x/81/b6/3b/81b63bd45899d3951ce49dfbe95262ba.jpg",
  "Lapangan C": "https://i.pinimg.com/1200x/ad/03/65/ad03659eed8b847cf1b46679c7bfe8d3.jpg",
};
const FOTO_CADANGAN = FOTO["Lapangan A"];

export default function JadwalPage({ user, onNavigate, onLogout }) {
  const { refresh } = useAuth();
  const today = tanggalIso();

  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(""); // contoh "19:00"
  const [terisi, setTerisi] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("QRIS");
  const [customerPhone, setCustomerPhone] = useState(user?.no_telp || "");
  const [error, setError] = useState("");
  const [memuat, setMemuat] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const namaPemesan = user?.name || user?.username || "";
  const bolehBooking = !!user && user.role !== "admin";

  // Nomor telepon dari profil (jika sudah pernah disimpan).
  useEffect(() => {
    if (user?.no_telp) setCustomerPhone((sekarang) => sekarang || user.no_telp);
  }, [user]);

  // Venue dan daftar lapangan (dari database).
  useEffect(() => {
    let batal = false;
    Promise.all([getVenue(), getCourts()])
      .then(([v, c]) => {
        if (batal) return;
        setVenue(v);
        setCourts(c);
        setSelectedCourtId((awal) => awal ?? c[0]?.id ?? null);
      })
      .catch((e) => !batal && setError(e.message))
      .finally(() => !batal && setMemuat(false));
    return () => {
      batal = true;
    };
  }, []);

  // Slot yang sudah dipesan pada lapangan + tanggal terpilih.
  const muatSlot = useCallback(async () => {
    if (!selectedCourtId) return;
    try {
      setTerisi(await getSlotTerisi(selectedCourtId, selectedDate));
    } catch (e) {
      setError(e.message);
    }
  }, [selectedCourtId, selectedDate]);

  useEffect(() => {
    muatSlot();
  }, [muatSlot]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentCourt = courts.find((c) => c.id === selectedCourtId) || null;
  const slots = venue ? buatSlotHari(venue.jam_buka, venue.jam_tutup, terisi, selectedDate) : [];
  const slotDipilih = slots.find((s) => s.jam === selectedSlot) || null;
  const activePrice = hargaSlot(currentCourt, selectedDate);
  const [yy, mm, dd] = selectedDate.split("-").map(Number);
  const isWeekend = [0, 6].includes(new Date(yy, mm - 1, dd).getDay());
  const jamBukaLabel = venue
    ? `${venue.jam_buka.slice(0, 5).replace(":", ".")}–${venue.jam_tutup.slice(0, 5).replace(":", ".")}`
    : "";

  const resetPilihan = () => {
    setSelectedSlot("");
    setError("");
  };

  const changeMonth = (offset) => {
    setViewDate((previous) => new Date(previous.getFullYear(), previous.getMonth() + offset, 1, 12));
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
            resetPilihan();
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

  // Dipanggil setelah pembayaran (simulasi) berhasil. Booking + pembayaran dibuat
  // dalam SATU transaksi di database (fungsi create_booking).
  const saveBookingAfterPayment = async () => {
    if (submitting) return false;
    setSubmitting(true);
    setError("");
    try {
      await bookSlot({
        courtId: selectedCourtId,
        tanggal: selectedDate,
        jam: selectedSlot,
        nama: namaPemesan,
        telp: customerPhone,
        metode: selectedPayment,
      });
      setShowQrisModal(false);
      setShowSuccessModal(true);
      setSelectedSlot("");
      await muatSlot();
      if (refresh) refresh(); // nomor telepon tersimpan di profil -> terisi otomatis berikutnya
      return true;
    } catch (err) {
      setError(err.message);
      setShowQrisModal(false);
      await muatSlot(); // slot mungkin baru saja diambil orang lain
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleBooking = () => {
    setError("");
    if (!bolehBooking) {
      setError("Hanya akun Player yang dapat melakukan booking. Silakan masuk sebagai Player.");
      return;
    }
    if (!customerPhone.trim()) {
      setError("Masukkan nomor telepon terlebih dahulu.");
      return;
    }
    if (!slotDipilih) {
      setError("Silakan pilih slot jam terlebih dahulu.");
      return;
    }
    if (slotDipilih.status !== "kosong") {
      setError("Slot jam tidak tersedia. Pilih jam lain.");
      return;
    }
    if (selectedPayment === "QRIS") {
      setShowQrisModal(true);
    } else {
      saveBookingAfterPayment();
    }
  };

  const initialUser = (user?.name || user?.username || user?.email || "S").charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#070b19] font-sans text-white antialiased selection:bg-emerald-500 selection:text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#070b19]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button type="button" onClick={() => onNavigate?.("home")} className="flex items-center gap-2.5 cursor-pointer">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400 font-bold text-slate-950">⚽</span>
            <span className="text-lg font-extrabold tracking-tight">Futsal<span className="text-emerald-400">Book</span></span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            <button type="button" onClick={() => onNavigate?.("home")} className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer">Beranda</button>
            <button type="button" onClick={() => onNavigate?.("jadwal")} className="rounded-lg bg-slate-800/60 px-4 py-2 text-sm font-semibold text-emerald-400 cursor-pointer">Jadwal Lapangan</button>
            {bolehBooking && <button type="button" onClick={() => onNavigate?.("booking-saya")} className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer">Booking Saya</button>}
            {user?.role === "admin" && <button type="button" onClick={() => onNavigate?.("dashboard")} className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/50 hover:text-white cursor-pointer">Dashboard</button>}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 sm:gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/20 text-xs font-bold text-emerald-400">{initialUser}</div>
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
        {memuat && <p className="mb-4 text-sm text-slate-400">Memuat data lapangan...</p>}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <section className="space-y-6 lg:col-span-8">
            <div className="group relative h-64 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl md:h-72">
              <img src={FOTO[currentCourt?.nama_lapangan] || FOTO_CADANGAN} alt={currentCourt?.nama_lapangan || "Lapangan"} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b19] via-[#070b19]/40 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-3">
                <div>
                  <h1 className="mb-1 text-2xl font-black tracking-tight md:text-3xl">{venue?.nama_tempat || "FutsalBook Arena"}</h1>
                  <p className="flex items-center gap-1.5 text-xs text-slate-300 md:text-sm">📍 {venue?.alamat || "Jl. Akses UI No. 45, Depok"}</p>
                </div>
                {jamBukaLabel && <span className="shrink-0 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-emerald-400 backdrop-blur-md">Buka {jamBukaLabel}</span>}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5 shadow-lg">
              <div className="flex flex-1 items-center gap-1 sm:gap-2">
                {courts.map((court) => (
                  <button key={court.id} type="button" onClick={() => { setSelectedCourtId(court.id); resetPilihan(); }} className={`flex-1 rounded-xl px-2 py-2.5 text-xs font-bold transition cursor-pointer sm:px-4 sm:text-sm ${selectedCourtId === court.id ? "border border-slate-700 bg-slate-800 text-white shadow-md" : "text-slate-400 hover:bg-slate-950/40 hover:text-slate-200"}`}>{court.nama_lapangan}</button>
                ))}
              </div>
              {currentCourt && <span className="hidden rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] font-extrabold tracking-wider text-emerald-400 sm:inline-block">{currentCourt.jenis_lantai.toUpperCase()}</span>}
            </div>

            <div className="relative" ref={calendarRef}>
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-lg">
                <button type="button" aria-label="Tanggal sebelumnya" disabled={selectedDate <= today} onClick={() => { setSelectedDate(geserHari(selectedDate, -1)); resetPilihan(); }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-lg text-slate-300 transition hover:border-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer">‹</button>
                <button type="button" onClick={() => setShowCalendar((shown) => !shown)} className="flex items-center gap-2 text-center text-sm font-bold text-white transition hover:text-emerald-400 md:text-base cursor-pointer">📅 <span>{tanggalPanjang(selectedDate)}</span> ▾</button>
                <button type="button" aria-label="Tanggal berikutnya" onClick={() => { setSelectedDate(geserHari(selectedDate, 1)); resetPilihan(); }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-lg text-slate-300 transition hover:border-slate-700 hover:text-white cursor-pointer">›</button>
              </div>

              {showCalendar && (
                <div className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-2xl border border-slate-700/90 bg-[#0f172a] p-4 shadow-2xl shadow-black/80">
                  <div className="mb-4 flex items-center justify-between px-1">
                    <button type="button" onClick={() => changeMonth(-1)} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer">‹</button>
                    <span className="text-sm font-bold tracking-wide">{viewDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}</span>
                    <button type="button" onClick={() => changeMonth(1)} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white cursor-pointer">›</button>
                  </div>
                  <div className="mb-2 grid grid-cols-7 gap-1 text-center">{["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => <span key={day} className="text-[10px] font-bold uppercase text-slate-400">{day}</span>)}</div>
                  <div className="grid grid-cols-7 justify-items-center gap-1">{renderCalendarDays()}</div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold tracking-tight">Pilih Jam</h2>
                <span className="text-right text-xs font-medium text-slate-400">{jamBukaLabel}</span>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot.jam && slot.status === "kosong";
                  const tak_tersedia = slot.status === "terisi" || slot.status === "lewat";
                  return (
                    <button
                      key={slot.jam}
                      type="button"
                      disabled={slot.status === "lewat"}
                      onClick={() => {
                        if (slot.status === "terisi") {
                          setError(`Slot jam ${slot.label} sudah dipesan.`);
                        } else if (slot.status === "milikku") {
                          setError(`Slot jam ${slot.label} sudah kamu pesan. Lihat di menu Booking Saya.`);
                        } else if (slot.status === "kosong") {
                          setSelectedSlot(slot.jam);
                          setError("");
                        }
                      }}
                      className={`rounded-xl border p-3 text-xs font-semibold transition cursor-pointer disabled:cursor-not-allowed ${
                        slot.status === "terisi"
                          ? "border-rose-800 bg-rose-950/70 text-rose-300"
                          : slot.status === "milikku"
                          ? "border-emerald-700 bg-emerald-950/50 text-emerald-300"
                          : slot.status === "lewat"
                          ? "border-slate-900 bg-slate-950/40 text-slate-600"
                          : isSelected
                          ? "border-emerald-400 bg-emerald-400 text-slate-950 shadow-lg"
                          : "border-slate-800 bg-slate-950 text-slate-200 hover:border-slate-600"
                      }`}
                    >
                      <span className="block">{slot.label}</span>
                      {slot.status === "terisi" && <span className="mt-1 block text-[9px] uppercase font-extrabold text-rose-400">TERISI</span>}
                      {slot.status === "milikku" && <span className="mt-1 block text-[9px] uppercase font-extrabold text-emerald-400">MILIKMU</span>}
                      {tak_tersedia && slot.status === "lewat" && <span className="mt-1 block text-[9px] uppercase font-extrabold text-slate-600">LEWAT</span>}
                    </button>
                  );
                })}
              </div>

              {error && <div role="alert" className="mb-4 rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-sm text-rose-200">{error}</div>}
            </div>
          </section>

          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
              <h2 className="mb-3 border-b border-slate-800 pb-3 text-lg font-bold">Harga Lapangan</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Weekday (Sen–Jum)</span><span className="font-bold text-white">{currentCourt ? rupiah(currentCourt.harga_weekday) : "-"}<span className="text-xs font-normal text-slate-400">/jam</span></span></div>
                <div className="flex justify-between"><span className="text-slate-400">Weekend (Sab–Min)</span><span className="font-bold text-white">{currentCourt ? rupiah(currentCourt.harga_weekend) : "-"}<span className="text-xs font-normal text-slate-400">/jam</span></span></div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
              <h2 className="border-b border-slate-800 pb-3 text-lg font-bold">Ringkasan Booking</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Lapangan</span><span className="font-semibold text-white">{currentCourt?.nama_lapangan || "-"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Tanggal</span><span className="text-white">{tanggalPanjang(selectedDate)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Waktu</span><span className="text-white">{slotDipilih ? slotDipilih.label : "Belum dipilih"}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Tarif</span><span className="text-white">{isWeekend ? "Weekend" : "Weekday"}</span></div>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Nama Pemesan</label>
                <input type="text" value={namaPemesan} readOnly className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-white opacity-80" />
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">No. Telepon</label>
                <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Contoh: 081234567890" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm text-white focus:border-emerald-400 outline-none" />
                <p className="text-xs text-slate-500">Masukkan nomor yang aktif agar admin dapat menghubungi kamu.</p>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Metode Pembayaran</p>
                <div className="space-y-2">
                  {METODE_BAYAR.map((p) => (
                    <label key={p.kode} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 ${selectedPayment === p.kode ? "border-emerald-500 bg-emerald-500/10" : "border-slate-800 bg-slate-950"}`}>
                      <span className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-bold text-emerald-400">{p.simbol}</span>
                        <span>
                          <span className="block text-xs font-bold text-white">{p.nama}</span>
                          <span className="block text-[10px] text-slate-400">{p.deskripsi}</span>
                        </span>
                      </span>
                      <input type="radio" name="payment" value={p.kode} checked={selectedPayment === p.kode} onChange={(e) => setSelectedPayment(e.target.value)} className="accent-emerald-400 cursor-pointer" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3"><span className="text-slate-400">Total Harga</span><span className="text-lg font-bold text-emerald-400">{slotDipilih ? rupiah(activePrice) : "Rp 0"}</span></div>
              <button type="button" onClick={handleBooking} disabled={!slotDipilih || submitting} className="mt-2 w-full rounded-xl bg-emerald-400 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-500 disabled:opacity-50 cursor-pointer">{submitting ? "Memproses..." : "Booking Sekarang"}</button>
            </div>
          </aside>
        </div>
      </main>

      {showQrisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center shadow-2xl">
            <h2 className="text-lg font-bold">Simulasi Pembayaran QRIS</h2>
            <p className="text-xs text-slate-400">Ini hanya demo. Tidak ada pembayaran nyata yang diproses.</p>
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl border-4 border-emerald-400 bg-white p-3"><div className="border-2 border-dashed border-slate-950 p-3 text-xs font-black text-slate-950">QRIS DEMO FUTSALBOOK</div></div>
            <button type="button" disabled={submitting} onClick={() => saveBookingAfterPayment()} className="w-full rounded-xl bg-emerald-400 py-3 text-xs font-bold text-slate-950 transition hover:bg-emerald-500 disabled:opacity-60 cursor-pointer">{submitting ? "Memproses..." : "Simulasikan Pembayaran Berhasil"}</button>
            <button type="button" onClick={() => setShowQrisModal(false)} className="w-full rounded-xl bg-slate-800 py-2 text-xs text-slate-300 transition hover:bg-slate-700 cursor-pointer">Batal</button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl text-emerald-400">✓</div>
            <h2 className="text-xl font-bold">Booking Berhasil Dibuat!</h2>
            <p className="text-xs text-slate-400">Booking tersimpan dengan status TERISI. Admin akan mengonfirmasi pembayaranmu.</p>
            <button type="button" onClick={() => { setShowSuccessModal(false); onNavigate?.("booking-saya"); }} className="w-full rounded-xl bg-emerald-400 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-500 cursor-pointer">Lihat Status Booking</button>
            <button type="button" onClick={() => setShowSuccessModal(false)} className="w-full rounded-xl bg-slate-800 py-2 text-xs text-slate-300 transition hover:bg-slate-700 cursor-pointer">Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}
