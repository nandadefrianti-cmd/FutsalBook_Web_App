import React, { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Mengecek apakah user sudah login atau belum
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Auth />}
    </div>
  );
}

export default App;