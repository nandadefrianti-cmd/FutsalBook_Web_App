import React from 'react';

export default function LaporanPage() {
  const pendapatan = [
    { lapangan: 'Lapangan A', booking: 12, total: 'Rp1.800.000' },
    { lapangan: 'Lapangan B', booking: 9, total: 'Rp1.350.000' },
    { lapangan: 'Lapangan C', booking: 7, total: 'Rp840.000' },
  ];

  const jamRamai = [
    { jam: '19.00', count: 8 },
    { jam: '20.00', count: 6 },
    { jam: '18.00', count: 5 },
    { jam: '16.00', count: 4 },
    { jam: '17.00', count: 3 },
  ];

  return (
    <div>
      <div style={styles.topHeader}>
        <div>
          <h2 style={styles.pageTitle}>Laporan</h2>
          <p style={styles.pageSub}>Ringkasan bulanan.</p>
        </div>
        <div style={styles.dateSelector}>
          <span>❮</span>
          <span>📅 Oktober 2026</span>
          <span>❯</span>
        </div>
      </div>

      {/* Tabel 1: Pendapatan per Lapangan */}
      <div style={styles.cardBox}>
        <h3 style={styles.boxTitle}>Pendapatan per Lapangan</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Lapangan</th>
              <th style={styles.th}>Jumlah Booking</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Total Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            {pendapatan.map((p, idx) => (
              <tr key={idx} style={styles.trRow}>
                <td style={styles.tdBold}>{p.lapangan}</td>
                <td style={styles.td}>{p.booking}</td>
                <td style={{ ...styles.tdBold, textAlign: 'right', color: '#0F172A' }}>{p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel 2: Jam Paling Ramai */}
      <div style={styles.cardBox}>
        <h3 style={styles.boxTitle}>Jam Paling Ramai</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>Jam</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Jumlah Booking</th>
            </tr>
          </thead>
          <tbody>
            {jamRamai.map((j, idx) => (
              <tr key={idx} style={styles.trRow}>
                <td style={styles.tdBold}>{j.jam}</td>
                <td style={{ ...styles.tdBold, textAlign: 'right', color: '#0F172A' }}>{j.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#64748B' },
  dateSelector: { backgroundColor: '#ffffff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', gap: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  cardBox: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', marginBottom: '24px' },
  boxTitle: { fontSize: '16px', fontWeight: '700', color: '#0F172A', marginBottom: '16px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  th: { padding: '12px 16px', fontSize: '11px', fontWeight: '700', color: '#475569' },
  trRow: { borderBottom: '1px solid #F1F5F9' },
  td: { padding: '14px 16px', fontSize: '13px', color: '#475569' },
  tdBold: { padding: '14px 16px', fontSize: '13px', fontWeight: '700', color: '#0F172A' },
};