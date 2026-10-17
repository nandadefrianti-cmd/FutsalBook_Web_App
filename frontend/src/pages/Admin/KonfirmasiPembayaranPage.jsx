import React from 'react';

export default function KonfirmasiPembayaranPage() {
  const pendingPayments = [
    { id: 1, pemesan: 'Budi Setiawan', lapangan: 'Lapangan B', waktu: '22 Okt 2026 - 10.00 - 11.00', total: 'Rp150.000' },
    { id: 2, pemesan: 'Fajar Maulana', lapangan: 'Lapangan C', waktu: '21 Okt 2026 - 20.00 - 21.00', total: 'Rp120.000' },
    { id: 3, pemesan: 'Gita Permata', lapangan: 'Lapangan A', waktu: '23 Okt 2026 - 18.00 - 19.00', total: 'Rp150.000' },
  ];

  return (
    <div>
      <div style={styles.topHeader}>
        <h2 style={styles.pageTitle}>Konfirmasi Pembayaran</h2>
        <p style={styles.pageSub}>Periksa bukti bayar lalu konfirmasi.</p>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thRow}>
              <th style={styles.th}>PEMESAN</th>
              <th style={styles.th}>LAPANGAN</th>
              <th style={styles.th}>TANGGAL & JAM</th>
              <th style={styles.th}>TOTAL</th>
              <th style={styles.th}>BUKTI</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map((p) => (
              <tr key={p.id} style={styles.trRow}>
                <td style={styles.tdBold}>{p.pemesan}</td>
                <td style={styles.td}>{p.lapangan}</td>
                <td style={styles.td}>{p.waktu}</td>
                <td style={styles.td}>{p.total}</td>
                <td style={styles.td}>
                  <span style={styles.linkBukti} onClick={() => alert('Membuka foto bukti transfer...')}>
                    Lihat bukti ↗
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button style={styles.confirmBtn} onClick={() => alert('Pembayaran dikonfirmasi!')}>
                    Konfirmasi
                  </button>
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
  topHeader: { marginBottom: '24px' },
  pageTitle: { fontSize: '24px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' },
  pageSub: { fontSize: '13px', color: '#64748B' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  thRow: { backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' },
  th: { padding: '14px 20px', fontSize: '11px', fontWeight: '700', color: '#475569', letterSpacing: '0.5px' },
  trRow: { borderBottom: '1px solid #F1F5F9' },
  td: { padding: '16px 20px', fontSize: '13px', color: '#475569' },
  tdBold: { padding: '16px 20px', fontSize: '13px', fontWeight: '700', color: '#0F172A' },
  linkBukti: { color: '#0284C7', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' },
  confirmBtn: {
    backgroundColor: '#A3E635',
    color: '#064E3B',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '12px',
    cursor: 'pointer',
  },
};