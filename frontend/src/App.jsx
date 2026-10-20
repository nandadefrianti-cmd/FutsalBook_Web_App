import React, { useState } from "react";
import Auth from "./pages/Auth";
import HomePage from "./pages/HomePage";
import JadwalPage from "./pages/JadwalPage";
import BookingSayaPage from "./pages/BookingSayaPage";
import Dashboard from "./pages/Dashboard";

function readUser() {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(readUser);

  const [currentRoute, setCurrentRoute] = useState(() => {
    const savedUser = readUser();
    if (!savedUser) return "home";
    return savedUser.role === "admin" ? "dashboard" : "home";
  });

  const [returnTo, setReturnTo] = useState("jadwal");

  const handleNavigate = (route) => {
    if (route === "home") {
      setCurrentRoute("home");
      return;
    }

    if (route === "jadwal") {
      setCurrentRoute("jadwal");
      return;
    }

    if (route === "booking-saya" || route === "booking") {
      if (!user) {
        setReturnTo("booking-saya");
        setCurrentRoute("auth");
        return;
      }
      setCurrentRoute("booking-saya");
      return;
    }

    if (route === "dashboard") {
      if (user?.role === "admin") {
        setCurrentRoute("dashboard");
      } else if (!user) {
        setReturnTo("dashboard");
        setCurrentRoute("auth");
      } else {
        // Jika player mencoba buka dashboard, arahkan ke home
        setCurrentRoute("home");
      }
      return;
    }

    if (route === "auth") {
      setCurrentRoute("auth");
    }
  };

  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    if (userData.role === "admin") {
      setCurrentRoute("dashboard");
    } else {
      const destination = returnTo === "booking-saya" ? "booking-saya" : "jadwal";
      setCurrentRoute(destination);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    setUser(null);
    setReturnTo("jadwal");
    setCurrentRoute("home");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      {currentRoute === "home" && (
        <HomePage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentRoute === "auth" && (
        <Auth
          onLogin={handleLogin}
          onNavigate={handleNavigate}
        />
      )}

      {currentRoute === "jadwal" && (
        <JadwalPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentRoute === "booking-saya" && (
        <BookingSayaPage
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      {currentRoute === "dashboard" && user?.role === "admin" && (
        <Dashboard
          user={user}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}