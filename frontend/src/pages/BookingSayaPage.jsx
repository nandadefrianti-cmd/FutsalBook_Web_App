import React from 'react';

export default function BookingSayaPage({ onOpenUploadModal }) {
  const bookings = [
    { id: 1, lapangan: 'Lapangan A', tanggal: '21 Okt 2026', jam: '19.00 - 20.00', total: 'Rp150.000', status: 'Belum bayar', aksi: 'upload' },
    { id: 2, lapangan: 'Lapangan B', tanggal: '22 Okt 2026', jam: '16.00 - 17.00', total: 'Rp150.000', status: 'Menunggu konfirmasi', aksi: 'batalkan' },
    { id: 3, lapangan: 'Lapangan C', tanggal: '18 Okt 2026', jam: '10.00 - 11.00', total: 'Rp80.000', status: 'Lunas', aksi: 'batalkan' },
    { id: 4, lapangan: 'Lapangan A', tanggal: '15 Okt 2026', jam: '20.00 - 21.00', total: 'Rp150.000', status: 'Dibatalkan', aksi: 'none' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.headerArea}>
        <h2 style={styles.pageTitle}>Booking Saya</h2>
        <p style={styles.pageSub}>Riwayat dan status pemesananmu.</p>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>LAPANGAN</th>
              <th style={styles.th}>TANGGAL</th>
              <th style={styles.th}>JAM</th>
              <th style={styles.th}>TOTAL</th>
              <th style={styles.th}>STATUS</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} style={styles.trRow}>
                <td style={styles.tdBold}>{b.lapangan}</td>
                <td style={styles.td}>{b.tanggal}</td>
                <td style={styles.td}>{b.jam}</td>
                <td style={styles.td}>{b.total}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(b.status === 'Lunas' ? styles.badgeLunas : {}),
                      ...(b.status === 'Belum bayar' ? styles.badgeBelum : {}),
                      ...(b.status === 'Menunggu konfirmasi' ? styles.badgeMenunggu : {}),
                      ...(b.status === 'Dibatalkan' ? styles.badgeBatal : {}),
                    }}
                  >
                    {b.status}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <div style={styles.actionGroup}>
                    {b.aksi === 'upload' && (
                      <button style={styles.uploadBtn} onClick={onOpenUploadModal}>
                        Upload Bukti
                      </button>
                    )}
                    {b.aksi !== 'none' && <button style={styles.cancelBtn}>Batalkan</button>}
                    {b.aksi === 'none' && <span style={styles.dash}>-</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    maxWidth: '1200px',
    margin: '0 auto',
  },
  headerArea: { marginBottom: '24px' },
  pageTitle: { fontSize: '22px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#64748B' },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
  },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  th: { padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px' },
  trRow: { borderBottom: '1px solid #F1F5F9' },
  td: { padding: '16px 20px', fontSize: '13px', color: '#475569' },
  tdBold: { padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: '#0F172A' },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'inline-block',
  },
  badgeLunas: { backgroundColor: '#ECFDF5', color: '#059669' },
  badgeBelum: { backgroundColor: '#FEF2F2', color: '#DC2626' },
  badgeMenunggu: { backgroundColor: '#FEF3C7', color: '#D97706' },
  badgeBatal: { backgroundColor: '#F1F5F9', color: '#64748B' },
  actionGroup: { display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' },
  uploadBtn: {
    backgroundColor: '#0F172A',
    color: '#ffffff',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    color: '#EF4444',
    border: '1px solid #FCA5A5',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  dash: { color: '#94A3B8' },
};