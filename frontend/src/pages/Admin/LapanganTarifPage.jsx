import React from 'react';

export default function LapanganTarifPage() {
  const tarifList = [
    { lapangan: 'Lapangan A & B', hari: 'Weekday (Sen - Jum)', jam: '08.00 - 15.00', harga: 'Rp100.000' },
    { lapangan: 'Lapangan A & B', hari: 'Weekday (Sen - Jum)', jam: '15.00 - 23.00', harga: 'Rp150.000' },
    { lapangan: 'Lapangan A & B', hari: 'Weekend (Sab - Min)', jam: '08.00 - 15.00', harga: 'Rp130.000' },
    { lapangan: 'Lapangan A & B', hari: 'Weekend (Sab - Min)', jam: '15.00 - 23.00', harga: 'Rp180.000' },
    { lapangan: 'Lapangan C', hari: 'Weekday (Sen - Jum)', jam: '08.00 - 15.00', harga: 'Rp80.000' },
    { lapangan: 'Lapangan C', hari: 'Weekday (Sen - Jum)', jam: '15.00 - 23.00', harga: 'Rp120.000' },
    { lapangan: 'Lapangan C', hari: 'Weekend (Sab - Min)', jam: '08.00 - 15.00', harga: 'Rp100.000' },
    { lapangan: 'Lapangan C', hari: 'Weekend (Sab - Min)', jam: '15.00 - 23.00', harga: 'Rp150.000' },
  ];

  return (
    <div>
      <div style={styles.topHeader}>
        <div>
          <span style={styles.badgeMaster}>● INFORMASI VENUE & MASTER DATA</span>
          <h2 style={styles.pageTitle}>Lapangan & Tarif</h2>
          <p style={styles.pageSub}>Data lapangan dan tarif per jam (hanya lihat).</p>
        </div>
        <div style={styles.statusOpsBadge}>
          <span>🟢</span>
          <span>Status Operasional: <b>Sistem Tarif Aktif</b></span>
        </div>
      </div>

      <div style={styles.contentGrid}>
        {/* Kolom Kiri: Info Lapangan */}
        <div style={styles.cardBox}>
          <h3 style={styles.boxTitle}>Lapangan <span style={styles.terkunciBadge}>Terkunci</span></h3>
          <p style={styles.boxSub}>Total 3 Unit Tersedia</p>

          <div style={styles.arenaInfoCard}>
            <h4>FutsalBook Arena</h4>
            <p>Jl. Contoh No. 1, Jakarta</p>
            <p style={{ marginTop: '6px' }}>🕒 Buka Setiap Hari: 08.00 – 23.00 WIB</p>
          </div>

          <div style={styles.lapanganListTable}>
            <div style={styles.lapRow}><span>🟢 Lapangan A</span><span>⊞ Vinyl</span></div>
            <div style={styles.lapRow}><span>🟢 Lapangan B</span><span>⊞ Vinyl</span></div>
            <div style={styles.lapRow}><span>🟢 Lapangan C</span><span>🌱 Rumput Sintetis</span></div>
          </div>

          <div style={styles.miniBanner}>
            <img
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=500&q=80"
              alt="Fasilitas"
              style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Kolom Kanan: Tabel Tarif per Jam */}
        <div style={styles.cardBox}>
          <h3 style={styles.boxTitle}>Tarif per Jam <span style={styles.modeBadge}>🔒 Mode Baca Saja</span></h3>
          <p style={styles.boxSub}>Skema Biaya Sewa Berdasarkan Waktu</p>

          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>Lapangan</th>
                <th style={styles.th}>Hari</th>
                <th style={styles.th}>Jam</th>
                <th style={styles.th}>Harga per Jam</th>
              </tr>
            </thead>
            <tbody>
              {tarifList.map((t, idx) => (
                <tr key={idx} style={styles.trRow}>
                  <td style={styles.tdBold}>{t.lapangan}</td>
                  <td style={styles.td}>{t.hari}</td>
                  <td style={styles.td}>{t.jam}</td>
                  <td style={{ ...styles.tdBold, color: '#0F172A' }}>{t.harga}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  topHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  badgeMaster: { fontSize: '11px', fontWeight: '700', color: '#059669', letterSpacing: '0.5px' },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#0F172A', marginTop: '2px', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#64748B' },
  statusOpsBadge: { backgroundColor: '#ffffff', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px', display: 'flex', gap: '8px', alignItems: 'center' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '24px' },
  cardBox: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0' },
  boxTitle: { fontSize: '16px', fontWeight: '700', color: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  boxSub: { fontSize: '13px', color: '#64748B', marginBottom: '16px' },
  terkunciBadge: { fontSize: '10px', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '4px' },
  modeBadge: { fontSize: '10px', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '4px' },
  arenaInfoCard: { backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#334155' },
  lapanganListTable: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  lapRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#F8FAFC', borderRadius: '6px', fontSize: '13px', fontWeight: '600' },
  miniBanner: { borderRadius: '8px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  th: { padding: '12px 14px', fontSize: '11px', fontWeight: '700', color: '#475569' },
  trRow: { borderBottom: '1px solid #F1F5F9' },
  td: { padding: '12px 14px', fontSize: '12px', color: '#475569' },
  tdBold: { padding: '12px 14px', fontSize: '12px', fontWeight: '700', color: '#0F172A' },
};