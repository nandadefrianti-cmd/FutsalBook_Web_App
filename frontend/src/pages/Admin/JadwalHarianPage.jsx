import React from 'react';

export default function JadwalHarianPage() {
  const jadwalHariIni = [
    { jam: '08.00 - 09.00', lapangan: 'Lapangan A', pemesan: 'Andi Pratama', status: 'Lunas' },
    { jam: '10.00 - 11.00', lapangan: 'Lapangan B', pemesan: 'Budi Setiawan', status: 'Menunggu konfirmasi' },
    { jam: '16.00 - 17.00', lapangan: 'Lapangan B', pemesan: 'Citra Lestari', status: 'Lunas' },
    { jam: '19.00 - 20.00', lapangan: 'Lapangan A', pemesan: 'Dika Firmansyah', status: 'Belum bayar' },
    { jam: '20.00 - 21.00', lapangan: 'Lapangan C', pemesan: 'Fajar Maulana', status: 'Menunggu konfirmasi' },
  ];

  return (
    <div>
      <div style={styles.topHeader}>
        <div>
          <h2 style={styles.pageTitle}>Jadwal Harian</h2>
          <p style={styles.pageSub}>Daftar booking pada tanggal yang dipilih.</p>
        </div>
        <div style={styles.dateSelector}>
          <span>❮</span>
          <span>📅 Rabu, 21 Okt 2026</span>
          <span>❯</span>
        </div>
      </div>

      {/* Kartu Statistik Atas */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>BOOKING HARI INI</span>
          <h3 style={styles.statValue}>5</h3>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>MENUNGGU KONFIRMASI</span>
          <h3 style={styles.statValue}>2</h3>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>PENDAPATAN BULAN INI</span>
          <h3 style={{ ...styles.statValue, color: '#0F172A' }}>Rp3.450.000</h3>
        </div>
      </div>

      {/* Tabel Jadwal */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>JAM</th>
              <th style={styles.th}>LAPANGAN</th>
              <th style={styles.th}>PEMESAN</th>
              <th style={styles.th}>STATUS PEMBAYARAN</th>
            </tr>
          </thead>
          <tbody>
            {jadwalHariIni.map((item, idx) => (
              <tr key={idx} style={styles.trRow}>
                <td style={styles.tdBold}>{item.jam}</td>
                <td style={styles.td}>{item.lapangan}</td>
                <td style={styles.td}>{item.pemesan}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(item.status === 'Lunas' ? styles.badgeLunas : {}),
                      ...(item.status === 'Belum bayar' ? styles.badgeBelum : {}),
                      ...(item.status === 'Menunggu konfirmasi' ? styles.badgeMenunggu : {}),
                    }}
                  >
                    {item.status}
                  </span>
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
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#64748B' },
  dateSelector: {
    backgroundColor: '#ffffff',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    display: 'flex',
    gap: '12px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' },
  statCard: { backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' },
  statLabel: { fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' },
  statValue: { fontSize: '32px', fontWeight: '800', color: '#0F172A' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  th: { padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px' },
  trRow: { borderBottom: '1px solid #F1F5F9' },
  td: { padding: '16px 20px', fontSize: '13px', color: '#475569' },
  tdBold: { padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: '#0F172A' },
  statusBadge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', display: 'inline-block' },
  badgeLunas: { backgroundColor: '#ECFDF5', color: '#059669' },
  badgeBelum: { backgroundColor: '#FEF2F2', color: '#DC2626' },
  badgeMenunggu: { backgroundColor: '#FEF3C7', color: '#D97706' },
};