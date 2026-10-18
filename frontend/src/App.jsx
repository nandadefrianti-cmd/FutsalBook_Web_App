import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import JadwalPage from './pages/JadwalPage';
import BookingSayaPage from './pages/BookingSayaPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  // Route default diset ke 'auth' (login) jika user belum terautentikasi
  const [currentRoute, setCurrentRoute] = useState('auth'); 

  useEffect(() => {
    // Cek apakah user sudah pernah login sebelumnya
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Jika admin, langsung ke dashboard; jika player, ke home
        setCurrentRoute(parsedUser.role === 'admin' ? 'dashboard' : 'home');
      } catch (e) {
        console.error("Failed to parse user data", e);
        setCurrentRoute('auth');
      }
    } else {
      setCurrentRoute('auth'); // Jika belum, wajib login terlebih dahulu
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Arahkan sesuai role setelah login
    if (userData.role === 'admin') {
      setCurrentRoute('dashboard');
    } else {
      setCurrentRoute('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentRoute('auth'); // Saat logout, balik ke halaman login awal
  };

  const handleNavigate = (route) => {
    // Proteksi rute: Jika belum login, paksa tetap di halaman auth
    if (!user && route !== 'auth') {
      setCurrentRoute('auth');
      return;
    }
    setCurrentRoute(route);
  };

  // Jika belum login, tampilkan hanya Halaman Auth
  if (!user || currentRoute === 'auth') {
    return (
      <div className="min-h-screen bg-[#070b19] text-white">
        <Auth onLogin={handleLoginSuccess} onNavigate={handleNavigate} />
      </div>
    );
  }

  // Jika login sebagai Admin, tampilkan Dashboard Admin
  if (user.role === 'admin') {
    return <Dashboard user={user} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  // Jika login sebagai Player, tampilkan website utama
  return (
    <div className="min-h-screen bg-[#070b19] text-white">
      {currentRoute === 'home' && (
        <HomePage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}
      {currentRoute === 'jadwal' && (
        <JadwalPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}
      {currentRoute === 'booking' && (
        <BookingSayaPage user={user} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;