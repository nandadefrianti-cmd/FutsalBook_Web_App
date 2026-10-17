import React, { useState } from 'react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('budi.santoso@example.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('player'); // Pilihan role: player / admin
  const [loginError, setLoginError] = useState(false);

  const [registerData, setRegisterData] = useState({
    fullName: 'Budi Santoso',
    email: 'budi.santoso@example.com',
    password: '',
    confirmPassword: '',
  });
  const [registerError, setRegisterError] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Menyimpan data user ke localStorage sesuai pilihan role (player / admin)
    const dummyUser = {
      name: loginRole === 'admin' ? 'Administrator' : 'Salwa',
      email: loginEmail,
      role: loginRole,
    };
    localStorage.setItem('user', JSON.stringify(dummyUser));
    localStorage.setItem('token', 'dummy-token-123');
    window.location.reload();
  };

  return (
    <div style={styles.authContainer}>
      {/* Sisi Kiri: Banner Gambar & Teks */}
      <div style={styles.authLeft}>
        <div style={styles.authOverlay}>
          <div style={styles.authBrand}>
            <span style={styles.brandIcon}>⚽</span>
            <span style={styles.brandText}>FutsalBook</span>
          </div>
          <div style={styles.authHeroContent}>
            <span style={styles.badgeSistem}>
              {isLogin ? 'SISTEM RESERVASI FUTSAL' : 'REGISTRASI MEMBER BARU'}
            </span>
            <h1 style={styles.authHeroTitle}>
              Booking lapangan futsal, <span style={styles.highlight}>tanpa ribet.</span>
            </h1>
            <p style={styles.authHeroDesc}>
              Pilih arena, tentukan jadwal bertanding, dan konfirmasi reservasi tim Anda dalam hitungan detik.
            </p>
          </div>
          <p style={styles.authFooterText}>© 2025 FutsalBook. Semua hak dilindungi.</p>
        </div>
      </div>

      {/* Sisi Kanan: Card Form */}
      <div style={styles.authRight}>
        <div style={styles.authCard}>
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} style={styles.formBox}>
              <div>
                <h2 style={styles.formTitle}>Masuk</h2>
                <p style={styles.formSubtitle}>Masuk untuk memesan atau mengelola lapangan.</p>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>EMAIL</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={styles.textInput}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>KATA SANDI</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    ...styles.textInput,
                    ...(loginError ? styles.inputErrorBorder : {}),
                  }}
                  required
                />
                {loginError && (
                  <p style={styles.errorText}>⚠️ Email atau kata sandi salah</p>
                )}
              </div>

              {/* Pilihan Masuk Sebagai (Player / Admin) */}
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>MASUK SEBAGAI</label>
                <select
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                  style={styles.textInput}
                >
                  <option value="player">Player (Pencari & Pemesan Lapangan)</option>
                  <option value="admin">Admin (Panel Pengelola & Laporan)</option>
                </select>
              </div>

              <button type="submit" style={styles.submitBtn}>
                Masuk
              </button>

              <p style={styles.switchText}>
                Belum punya akun?{' '}
                <span
                  style={styles.linkText}
                  onClick={() => setIsLogin(false)}
                >
                  Daftar
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} style={styles.formBox}>
              <div>
                <h2 style={styles.formTitle}>Daftar</h2>
                <p style={styles.formSubtitle}>Buat akun untuk mulai memesan.</p>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>NAMA LENGKAP</label>
                <input
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, fullName: e.target.value })
                  }
                  style={styles.textInput}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>EMAIL</label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  style={{
                    ...styles.textInput,
                    ...(registerError ? styles.inputErrorBorder : {}),
                  }}
                  required
                />
                {registerError && (
                  <p style={styles.errorText}>⚠️ Email sudah terdaftar</p>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>KATA SANDI</label>
                <input
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                  style={styles.textInput}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>ULANGI KATA SANDI</label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  style={styles.textInput}
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => alert('Registrasi berhasil!')}
                style={styles.submitBtn}
              >
                Daftar ➔
              </button>

              <p style={styles.switchText}>
                Sudah punya akun?{' '}
                <span
                  style={styles.linkText}
                  onClick={() => setIsLogin(true)}
                >
                  Masuk
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  authContainer: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    fontFamily: 'sans-serif',
    backgroundColor: '#F8F9FA',
  },
  authLeft: {
    flex: 1,
    backgroundImage: 'url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  },
  authOverlay: {
    backgroundColor: 'rgba(7, 17, 30, 0.88)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '48px',
    boxSizing: 'border-box',
    color: '#ffffff',
  },
  authBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandIcon: { fontSize: '20px' },
  brandText: { fontSize: '18px', fontWeight: '700' },
  authHeroContent: {
    maxWidth: '450px',
  },
  badgeSistem: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    color: '#34D399',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    display: 'inline-block',
    marginBottom: '20px',
    border: '1px solid rgba(52, 211, 153, 0.3)',
  },
  authHeroTitle: {
    fontSize: '40px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '16px',
  },
  highlight: { color: '#A3E635' },
  authHeroDesc: {
    fontSize: '14px',
    color: '#94A3B8',
    lineHeight: '1.5',
  },
  authFooterText: {
    fontSize: '12px',
    color: '#64748B',
  },
  authRight: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
    border: '1px solid #E2E8F0',
  },
  formBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '4px',
  },
  formSubtitle: {
    fontSize: '13px',
    color: '#64748B',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#475569',
    letterSpacing: '0.5px',
  },
  textInput: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#0F172A',
    backgroundColor: '#ffffff',
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: '12px',
    color: '#EF4444',
    marginTop: '2px',
  },
  submitBtn: {
    backgroundColor: '#A3E635',
    color: '#064E3B',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '6px',
  },
  switchText: {
    fontSize: '13px',
    color: '#64748B',
    textAlign: 'center',
    marginTop: '10px',
  },
  linkText: {
    color: '#0F172A',
    fontWeight: '700',
    cursor: 'pointer',
  },
};