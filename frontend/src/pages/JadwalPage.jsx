import React, { useState } from 'react';

export default function JadwalPage({ onBookingClick }) {
  const [selectedCourt, setSelectedCourt] = useState('Lapangan A');
  const [selectedSlot, setSelectedSlot] = useState({ jam: '19.00 - 20.00', harga: 'Rp150.000' });

  // Data detail tiap lapangan
  const courtDetails = {
    'Lapangan A': { type: 'VINYL', price: 'Rp150.000' },
    'Lapangan B': { type: 'VINYL', price: 'Rp150.000' },
    'Lapangan C': { type: 'RUMPUT SINTETIS', price: 'Rp120.000' },
  };

  const currentInfo = courtDetails[selectedCourt];

  const slots = [
    { jam: '08.00 - 09.00', status: 'tersedia' },
    { jam: '09.00 - 10.00', status: 'tersedia' },
    { jam: '10.00 - 11.00', status: 'tersedia' },
    { jam: '11.00 - 12.00', status: 'tersedia' },
    { jam: '12.00 - 13.00', status: 'tersedia' },
    { jam: '13.00 - 14.00', status: 'terisi' },
    { jam: '14.00 - 15.00', status: 'tersedia' },
    { jam: '15.00 - 16.00', status: 'tersedia' },
    { jam: '16.00 - 17.00', status: 'tersedia' },
    { jam: '17.00 - 18.00', status: 'tersedia' },
    { jam: '18.00 - 19.00', status: 'tersedia' },
    { jam: '19.00 - 20.00', status: 'dipilih' },
    { jam: '20.00 - 21.00', status: 'tersedia' },
    { jam: '21.00 - 22.00', status: 'tersedia' },
    { jam: '22.00 - 23.00', status: 'tersedia' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.mainGrid}>
        {/* Kolom Kiri: Banner, Tab Lapangan, Tanggal, & Slot Jam */}
        <div style={styles.leftCol}>
          {/* Banner Venue Utama */}
          <div style={styles.venueBanner}>
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"
              alt="Arena"
              style={styles.bannerImg}
            />
            <div style={styles.bannerOverlay}>
              <h2 style={styles.venueTitle}>FutsalBook Arena</h2>
              <p style={styles.venueAddress}>Jl. Contoh No. 1, Jakarta</p>
              <span style={styles.jamOperasionalBadge}>Buka 08.00 – 23.00</span>
            </div>
          </div>

          {/* Tab Pilihan Lapangan & Badge Tipe Lantai */}
          <div style={styles.courtTabsRow}>
            <div style={styles.tabGroup}>
              {['Lapangan A', 'Lapangan B', 'Lapangan C'].map((court) => (
                <button
                  key={court}
                  style={{
                    ...styles.courtTabBtn,
                    ...(selectedCourt === court ? styles.activeCourtTab : {}),
                  }}
                  onClick={() => {
                    setSelectedCourt(court);
                    setSelectedSlot({ jam: '19.00 - 20.00', harga: courtDetails[court].price });
                  }}
                >
                  {court}
                </button>
              ))}
            </div>
            <span style={styles.vinylBadge}>{currentInfo.type}</span>
          </div>

          {/* Navigasi Tanggal */}
          <div style={styles.dateNavigator}>
            <button style={styles.arrowDateBtn}>❮</button>
            <span style={styles.dateText}>📅 Rabu, 21 Okt 2026</span>
            <button style={styles.arrowDateBtn}>❯</button>
          </div>

          {/* Grid Pilih Jam */}
          <div style={styles.slotSection}>
            <div style={styles.slotHeaderRow}>
              <h4 style={styles.slotHeading}>Pilih Jam</h4>
              <span style={styles.slotSubNote}>15 slot tersedia per hari</span>
            </div>

            <div style={styles.slotsGrid}>
              {slots.map((s, idx) => {
                const isSelected = selectedSlot.jam === s.jam;
                let btnStyle = styles.slotTersedia;
                if (s.status === 'terisi') btnStyle = styles.slotTerisi;
                if (isSelected) btnStyle = styles.slotDipilih;

                return (
                  <button
                    key={idx}
                    style={{ ...styles.slotCard, ...btnStyle }}
                    disabled={s.status === 'terisi'}
                    onClick={() => setSelectedSlot({ jam: s.jam, harga: currentInfo.price })}
                  >
                    <span style={styles.slotTime}>{s.jam}</span>
                    {s.status === 'terisi' && <span style={styles.terisiLabel}>TERISI</span>}
                  </button>
                );
              })}
            </div>

            {/* Keterangan Status Slot */}
            <div style={styles.legendRow}>
              <div style={styles.legendItem}>
                <span style={{ ...styles.legendDot, backgroundColor: '#F7FEE7', border: '1px solid #BEF264' }}></span>
                <span>Tersedia</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{ ...styles.legendDot, backgroundColor: '#CBD5E1' }}></span>
                <span>Terisi</span>
              </div>
              <div style={styles.legendItem}>
                <span style={{ ...styles.legendDot, backgroundColor: '#07111E' }}></span>
                <span>Dipilih</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Harga & Ringkasan Booking */}
        <div style={styles.rightCol}>
          <div style={styles.cardBox}>
            <h3 style={styles.cardBoxTitle}>Harga Lapangan</h3>
            <div style={styles.priceRow}>
              <span style={styles.priceKey}>Weekday (Sen - Jum)</span>
              <span style={styles.priceVal}>Rp150.000 /jam</span>
            </div>
            <div style={styles.priceRow}>
              <span style={styles.priceKey}>Weekend (Sab - Min)</span>
              <span style={styles.priceVal}>Rp180.000 /jam</span>
            </div>
          </div>

          <div style={styles.cardBox}>
            <h3 style={styles.cardBoxTitle}>Ringkasan Booking</h3>
            <div style={styles.summaryRow}>
              <span style={styles.summaryKey}>Lapangan</span>
              <span style={styles.summaryValBold}>{selectedCourt}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryKey}>Tanggal</span>
              <span style={styles.summaryVal}>Rabu, 21 Okt 2026</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryKey}>Waktu</span>
              <span style={styles.summaryVal}>{selectedSlot.jam} (1 jam)</span>
            </div>

            <hr style={styles.divider} />

            <div style={styles.totalRow}>
              <span style={styles.totalKey}>Total Harga</span>
              <span style={styles.totalVal}>{selectedSlot.harga}</span>
            </div>

            <button style={styles.bookingBtn} onClick={onBookingClick}>
              Booking Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 48px',
    backgroundColor: '#F8F9FA',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  venueBanner: {
    position: 'relative',
    height: '240px',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  bannerImg: { width: '100%', height: '100%', objectFit: 'cover' },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '24px',
    background: 'linear-gradient(to top, rgba(7,17,30,0.9), transparent)',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  venueTitle: { fontSize: '24px', fontWeight: '800', marginBottom: '2px' },
  venueAddress: { fontSize: '13px', color: '#94A3B8', marginBottom: '10px' },
  jamOperasionalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
  },
  courtTabsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
  },
  tabGroup: { display: 'flex', gap: '8px' },
  courtTabBtn: {
    padding: '8px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    cursor: 'pointer',
  },
  activeCourtTab: {
    backgroundColor: '#07111E',
    color: '#ffffff',
  },
  vinylBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    padding: '6px 12px',
    borderRadius: '6px',
  },
  dateNavigator: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
  },
  arrowDateBtn: { background: 'none', border: 'none', fontSize: '14px', cursor: 'pointer', color: '#0F172A' },
  dateText: { fontSize: '14px', fontWeight: '700', color: '#0F172A' },
  slotSection: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  slotHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  slotHeading: { fontSize: '16px', fontWeight: '700', color: '#0F172A' },
  slotSubNote: { fontSize: '12px', color: '#94A3B8' },
  slotsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  slotCard: {
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  slotTersedia: { backgroundColor: '#F7FEE7', borderColor: '#BEF264' },
  slotTerisi: { backgroundColor: '#E2E8F0', borderColor: '#CBD5E1', cursor: 'not-allowed', opacity: 0.7 },
  slotDipilih: { backgroundColor: '#07111E', borderColor: '#07111E', color: '#ffffff' },
  slotTime: { fontSize: '13px', fontWeight: '700' },
  terisiLabel: { fontSize: '9px', fontWeight: '700', color: '#64748B', marginTop: '2px' },
  legendRow: { display: 'flex', gap: '20px', fontSize: '12px', color: '#64748B', alignItems: 'center' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px' },
  legendDot: { width: '10px', height: '10px', borderRadius: '50%' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '20px' },
  cardBox: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
  },
  cardBoxTitle: { fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '14px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#475569' },
  priceKey: {},
  priceVal: { fontWeight: '700', color: '#0F172A' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px', color: '#64748B' },
  summaryKey: {},
  summaryVal: { fontWeight: '600', color: '#0F172A' },
  summaryValBold: { fontWeight: '700', color: '#0F172A' },
  divider: { border: 'none', borderTop: '1px solid #E2E8F0', margin: '14px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  totalKey: { fontSize: '14px', fontWeight: '700', color: '#0F172A' },
  totalVal: { fontSize: '18px', fontWeight: '800', color: '#0F172A' },
  bookingBtn: {
    width: '100%',
    backgroundColor: '#A3E635',
    color: '#064E3B',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
  },
};