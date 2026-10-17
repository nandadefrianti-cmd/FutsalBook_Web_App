import React from 'react';

export default function Navbar({ activeTab, setActiveTab, onLogout }) {
  return (
    <header style={styles.header}>
      <div style={styles.leftNav}>
        <h1 style={styles.logoText}>FutsalBook</h1>
        <nav style={styles.navMenu}>
          <button
            onClick={() => setActiveTab('jadwal')}
            style={{
              ...styles.navTab,
              ...(activeTab === 'jadwal' ? styles.activeNavTab : {}),
            }}
          >
            Jadwal
          </button>
          <button
            onClick={() => setActiveTab('bookingSaya')}
            style={{
              ...styles.navTab,
              ...(activeTab === 'bookingSaya' ? styles.activeNavTab : {}),
            }}
          >
            Booking Saya
          </button>
        </nav>
      </div>

      <button onClick={onLogout} style={styles.logoutLink}>
        Keluar
      </button>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #EAEAEA',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '36px',
  },
  logoText: {
    color: '#1b4332',
    fontSize: '20px',
    fontWeight: '700',
    margin: 0,
  },
  navMenu: {
    display: 'flex',
    gap: '24px',
    height: '64px',
  },
  navTab: {
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4B5563',
    cursor: 'pointer',
    padding: '0 4px',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '2px solid transparent',
  },
  activeNavTab: {
    color: '#1b4332',
    borderBottom: '2px solid #1b4332',
  },
  logoutLink: {
    background: 'none',
    border: 'none',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};