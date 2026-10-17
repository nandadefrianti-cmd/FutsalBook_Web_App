import React from 'react';

export default function AdminSidebar({ activeMenu, setActiveMenu, onLogout }) {
  const menus = [
    { key: 'jadwalHarian', label: 'Jadwal Harian' },
    { key: 'konfirmasiPembayaran', label: 'Konfirmasi Pembayaran' },
    { key: 'lapanganTarif', label: 'Lapangan & Tarif' },
    { key: 'laporan', label: 'Laporan' },
  ];

  return (
    <aside style={styles.sidebar}>
      <div>
        <h1 style={styles.logo}>FutsalBook</h1>
        <nav style={styles.menuList}>
          {menus.map((m) => {
            const isActive = activeMenu === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setActiveMenu(m.key)}
                style={{
                  ...styles.menuButton,
                  ...(isActive ? styles.activeMenuButton : {}),
                }}
              >
                {m.label}
              </button>
            );
          })}
        </nav>
      </div>

      <button onClick={onLogout} style={styles.logoutButton}>
        Keluar
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #EAEAEA',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '24px 0',
    height: '100vh',
    position: 'sticky',
    top: 0,
    boxSizing: 'border-box',
  },
  logo: {
    color: '#1b4332',
    fontSize: '22px',
    fontWeight: '700',
    padding: '0 24px',
    marginBottom: '32px',
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  menuButton: {
    padding: '12px 24px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4B5563',
    cursor: 'pointer',
    borderLeft: '4px solid transparent',
  },
  activeMenuButton: {
    backgroundColor: '#1b4332',
    color: '#ffffff',
    borderLeft: '4px solid #0f251c',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    padding: '0 24px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
  },
};