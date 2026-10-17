import React, { useState } from 'react';

export default function HomePage({ onNavigate }) {
  const [selectedLapangan, setSelectedLapangan] = useState('');
  const [tanggal, setTanggal] = useState('2025-05-18');

  const lapanganList = [
    {
      id: 1,
      name: 'Lapangan A',
      badge: 'Indoor Standard',
      lantai: 'Vinyl',
      price: 'Mulai Rp100.000/jam',
      status: 'Tersedia',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'Lapangan B',
      badge: 'Turnamen Resmi',
      lantai: 'Vinyl',
      price: 'Mulai Rp100.000/jam',
      status: 'Tersedia',
      image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      name: 'Lapangan C',
      badge: 'Non-Abrasive Turf',
      lantai: 'Rumput Sintetis',
      price: 'Mulai Rp80.000/jam',
      status: 'Tersedia',
      image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div style={styles.container}>
      {/* 1. HEADER / NAVBAR */}
      <header style={styles.navbar}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>⚽</span>
          <span style={styles.logoText}>FutsalBook</span>
        </div>
        <nav style={styles.navLinks}>
          <button style={{ ...styles.navLink, ...styles.activeNavLink }}>Beranda</button>
          <button style={styles.navLink} onClick={() => onNavigate('jadwal')}>Jadwal Lapangan</button>
        </nav>
        <div style={styles.navRight}>
          <button style={styles.loginBtn} onClick={() => onNavigate('auth')}>Masuk</button>
          <button style={styles.profileIconBtn} onClick={() => onNavigate('auth')}>👤</button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <span style={styles.badgeResmi}>🛡️ SISTEM RESERVASI RESMI</span>
            <h1 style={styles.heroTitle}>Booking Lapangan, <span style={styles.highlightText}>Gas Main!</span></h1>
            <p style={styles.heroSubtitle}>
              Lihat jadwal kosong dan pesan lapangan futsal tanpa chat sana-sini.
            </p>
            <div style={styles.heroActionBtns}>
              <button style={styles.primaryActionBtn} onClick={() => onNavigate('jadwal')}>
                📅 Lihat Jadwal
              </button>
              <button style={styles.secondaryActionBtn} onClick={() => onNavigate('auth')}>
                Masuk ➔
              </button>
            </div>
          </div>
        </div>

        {/* Search / Filter Floating Box */}
        <div style={styles.searchBox}>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>Lapangan</label>
            <select
              value={selectedLapangan}
              onChange={(e) => setSelectedLapangan(e.target.value)}
              style={styles.selectInput}
            >
              <option value="">Pilih lapangan</option>
              <option value="Lapangan A">Lapangan A</option>
              <option value="Lapangan B">Lapangan B</option>
              <option value="Lapangan C">Lapangan C</option>
            </select>
          </div>
          <div style={styles.searchField}>
            <label style={styles.searchLabel}>Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              style={styles.dateInput}
            />
          </div>
          <button style={styles.searchBtn} onClick={() => onNavigate('jadwal')}>
            🔍 Lihat Jadwal
          </button>
        </div>
      </section>

      {/* 3. LAPANGAN KAMI SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionHeaderFlex}>
          <div>
            <h2 style={styles.sectionTitle}>Lapangan Kami</h2>
            <p style={styles.sectionDesc}>Pilih lapangan dan lihat jadwalnya.</p>
          </div>
          <span style={styles.realtimeBadge}>🟢 Update Slot Real-Time</span>
        </div>

        <div style={styles.lapanganGrid}>
          {lapanganList.map((l) => (
            <div key={l.id} style={styles.lapanganCard} onClick={() => onNavigate('jadwal')}>
              <div style={styles.imageContainer}>
                <img src={l.image} alt={l.name} style={styles.cardImage} />
                <span style={styles.cardBadgeTop}>{l.badge}</span>
                <span style={styles.tersediaBadge}>🟢 {l.status}</span>
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle}>{l.name}</h3>
                <p style={styles.cardLantai}>🔲 {l.lantai}</p>
                <div style={styles.cardFooter}>
                  <div>
                    <span style={styles.tarifLabel}>TARIF SEWA</span>
                    <p style={styles.tarifValue}>{l.price}</p>
                  </div>
                  <button style={styles.arrowBtn}>➔</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CARA BOOKING SECTION */}
      <section style={styles.caraBookingSection}>
        <div style={styles.centerHeader}>
          <span style={styles.smallSubtitle}> KEMUDAHAN RESERVASI</span>
          <h2 style={styles.sectionTitle}>Cara Booking</h2>
          <p style={styles.sectionDesc}>Tiga langkah praktis untuk mengamankan jadwal tanding tim Anda.</p>
        </div>

        <div style={styles.stepGrid}>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>1</div>
            <h4 style={styles.stepTitle}>1. Pilih slot</h4>
            <p style={styles.stepDesc}>Pilih lapangan, tanggal, dan jam kosong.</p>
            <span style={styles.stepFooterNote}>🟢 Cek ketersediaan instan</span>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>2</div>
            <h4 style={styles.stepTitle}>2. Upload bukti bayar</h4>
            <p style={styles.stepDesc}>Transfer lalu unggah bukti pembayaranmu.</p>
            <span style={styles.stepFooterNote}>💳 QRIS & Transfer Bank</span>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>3</div>
            <h4 style={styles.stepTitle}>3. Tunggu konfirmasi</h4>
            <p style={styles.stepDesc}>Admin mengonfirmasi dan slotmu aman.</p>
            <span style={styles.stepFooterNote}>⏱️ Konfirmasi cepat &lt; 15 menit</span>
          </div>
        </div>
      </section>

      {/* 5. BANNER BAWAH (Fasilitas Standar FIFA) */}
      <section style={styles.bottomBannerSection}>
        <div style={styles.bottomBannerContent}>
          <div style={styles.bannerInfo}>
            <span style={styles.bannerIcon}>⚽</span>
            <div>
              <h4 style={styles.bannerTitle}>Fasilitas Lengkap & Standar FIFA</h4>
              <p style={styles.bannerDesc}>Kamar bilas air hangat, ruang ganti ber-AC, kantin, dan tribun penonton nyaman.</p>
            </div>
          </div>
          <button style={styles.pesanSekarangBtn} onClick={() => onNavigate('jadwal')}>
            Pesan Sekarang
          </button>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>⚽ FutsalBook Arena – Jl. Contoh No. 1, Jakarta – Buka 08.00 – 23.00</p>
        <p style={styles.footerCopy}>© 2025 FutsalBook. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#F8F9FA',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  navbar: {
    backgroundColor: '#07111E',
    color: '#ffffff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 48px',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '22px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: '#94A3B8',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  activeNavLink: {
    color: '#34D399',
    fontWeight: '600',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  loginBtn: {
    backgroundColor: '#ffffff',
    color: '#07111E',
    border: 'none',
    padding: '8px 20px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  profileIconBtn: {
    backgroundColor: '#1E293B',
    color: '#ffffff',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  heroSection: {
    position: 'relative',
    backgroundColor: '#07111E',
    backgroundImage: 'url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '60px 48px 130px 48px',
    color: '#ffffff',
    textAlign: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 17, 30, 0.88)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '700px',
  },
  badgeResmi: {
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    color: '#34D399',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    display: 'inline-block',
    marginBottom: '16px',
    border: '1px solid rgba(52, 211, 153, 0.3)',
  },
  heroTitle: {
    fontSize: '44px',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '12px',
  },
  highlightText: {
    color: '#A3E635',
  },
  heroSubtitle: {
    fontSize: '15px',
    color: '#94A3B8',
    marginBottom: '28px',
  },
  heroActionBtns: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
  },
  primaryActionBtn: {
    backgroundColor: '#A3E635',
    color: '#064E3B',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
  },
  secondaryActionBtn: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #475569',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
  },
  searchBox: {
    position: 'absolute',
    bottom: '-35px',
    left: '80px',
    right: '80px',
    zIndex: 3,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px 24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  searchField: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderRight: '1px solid #E5E7EB',
    paddingRight: '16px',
    textAlign: 'left',
  },
  searchLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
  },
  selectInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: 'transparent',
    width: '100%',
    cursor: 'pointer',
  },
  dateInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: 'transparent',
    width: '100%',
    cursor: 'pointer',
  },
  searchBtn: {
    backgroundColor: '#A3E635',
    color: '#064E3B',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
  },
  section: {
    padding: '80px 80px 40px 80px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionHeaderFlex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: '4px',
  },
  sectionDesc: {
    fontSize: '14px',
    color: '#64748B',
  },
  realtimeBadge: {
    fontSize: '12px',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '600',
    border: '1px solid #A7F3D0',
  },
  lapanganGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  lapanganCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #E2E8F0',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    transition: 'transform 0.2s',
  },
  imageContainer: {
    position: 'relative',
    height: '170px',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardBadgeTop: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
  },
  tersediaBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#ECFDF5',
    color: '#059669',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '700',
  },
  cardBody: {
    padding: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '6px',
  },
  cardLantai: {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '20px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #F1F5F9',
    paddingTop: '14px',
  },
  tarifLabel: {
    fontSize: '10px',
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  tarifValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0F172A',
  },
  arrowBtn: {
    backgroundColor: '#F1F5F9',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontWeight: '700',
    color: '#0F172A',
  },
  caraBookingSection: {
    backgroundColor: '#ffffff',
    padding: '60px 80px',
    borderTop: '1px solid #E2E8F0',
    borderBottom: '1px solid #E2E8F0',
    textAlign: 'center',
  },
  centerHeader: {
    maxWidth: '600px',
    margin: '0 auto 40px auto',
  },
  smallSubtitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#059669',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  stepGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'left',
  },
  stepCard: {
    backgroundColor: '#F8F9FA',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '24px',
    position: 'relative',
  },
  stepNumber: {
    backgroundColor: '#07111E',
    color: '#ffffff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    marginBottom: '16px',
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '6px',
  },
  stepDesc: {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  stepFooterNote: {
    fontSize: '12px',
    color: '#059669',
    fontWeight: '600',
  },
  bottomBannerSection: {
    maxWidth: '1100px',
    margin: '50px auto',
    padding: '0 20px',
  },
  bottomBannerContent: {
    backgroundColor: '#07111E',
    borderRadius: '16px',
    padding: '30px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#ffffff',
  },
  bannerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  bannerIcon: {
    fontSize: '36px',
  },
  bannerTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  bannerDesc: {
    fontSize: '13px',
    color: '#94A3B8',
  },
  pesanSekarangBtn: {
    backgroundColor: '#A3E635',
    color: '#064E3B',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
  },
  footer: {
    backgroundColor: '#07111E',
    color: '#64748B',
    textAlign: 'center',
    padding: '30px',
    fontSize: '13px',
    borderTop: '1px solid #1E293B',
  },
  footerText: {
    marginBottom: '6px',
    color: '#94A3B8',
  },
  footerCopy: {
    fontSize: '12px',
  },
};