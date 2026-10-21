import React, { useState, useEffect, useRef } from "react";
import Auth from "./pages/Auth";
import HomePage from "./pages/HomePage";
import JadwalPage from "./pages/JadwalPage";
import BookingSayaPage from "./pages/BookingSayaPage";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import { logout } from "./services/authService";

// Navigasi tetap memakai state (tanpa react-router), tetapi pengguna dan role
// SEKARANG berasal dari Supabase (AuthContext), bukan dari localStorage.
export default function App() {
  const { profile, loading } = useAuth();

  // Bentuk objek user dipertahankan agar halaman lama tetap bisa membacanya.
  const user = profile
    ? {
        id: profile.id,
        nama: profile.nama,
        name: profile.nama,
        username: profile.nama,
        no_telp: profile.no_telp,
        role: profile.role,
      }
    : null;

  const [currentRoute, setCurrentRoute] = useState("home");
  const [returnTo, setReturnTo] = useState("jadwal");
  const sudahAwal = useRef(false);

  // 1) Saat halaman pertama kali dimuat: admin yang sudah login langsung ke dashboard.
  useEffect(() => {
    if (loading || sudahAwal.current) return;
    sudahAwal.current = true;
    if (profile?.role === "admin") setCurrentRoute("dashboard");
  }, [loading, profile]);

  // 2) Setelah login berhasil (profil terbaca) di halaman auth: arahkan sesuai role.
  useEffect(() => {
    if (currentRoute !== "auth" || !profile) return;
    if (profile.role === "admin") {
      setCurrentRoute("dashboard");
    } else {
      setCurrentRoute(returnTo === "booking-saya" ? "booking-saya" : "jadwal");
    }
  }, [profile, currentRoute, returnTo]);

  const handleNavigate = (route) => {
    if (route === "home") {
      setCurrentRoute("home");
      return;
    }

    if (route === "auth") {
      setCurrentRoute("auth");
      return;
    }

    // Jadwal & Booking Saya: wajib login.
    if (route === "jadwal" || route === "booking-saya" || route === "booking") {
      const tujuan = route === "jadwal" ? "jadwal" : "booking-saya";
      if (!user) {
        setReturnTo(tujuan);
        setCurrentRoute("auth");
        return;
      }
      setCurrentRoute(tujuan);
      return;
    }

    // Dashboard: hanya admin.
    if (route === "dashboard") {
      if (user?.role === "admin") {
        setCurrentRoute("dashboard");
      } else if (!user) {
        setReturnTo("dashboard");
        setCurrentRoute("auth");
      } else {
        setCurrentRoute("home"); // pemain tidak boleh masuk dashboard
      }
    }
  };

  // Dipanggil oleh halaman Auth setelah login/daftar sukses. Navigasi dilakukan efek (2).
  const handleLogin = () => {};

  const handleLogout = async () => {
    await logout();
    setReturnTo("jadwal");
    setCurrentRoute("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Memuat...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      {currentRoute === "home" && (
        <HomePage user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {currentRoute === "auth" && (
        <Auth onLogin={handleLogin} onNavigate={handleNavigate} />
      )}

      {currentRoute === "jadwal" && user && (
        <JadwalPage user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {currentRoute === "booking-saya" && user && (
        <BookingSayaPage user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {currentRoute === "dashboard" && user?.role === "admin" && (
        <Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
    </div>
  );
}