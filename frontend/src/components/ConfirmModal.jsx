import React from 'react';

export default function ConfirmModal({ slot, court, onConfirm, onClose }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <h3 style={styles.modalTitle}>Konfirmasi Booking</h3>

        <div style={styles.modalRow}>
          <span>Lapangan</span>
          <strong>{court}</strong>
        </div>
        <div style={styles.modalRow}>
          <span>Tanggal</span>
          <strong>14 Mei 2026</strong>
        </div>
        <div style={styles.modalRow}>
          <span>Jam</span>
          <strong>{slot?.jam}</strong>
        </div>
        <div style={{ ...styles.modalRow, borderBottom: 'none' }}>
          <span>Total Harga</span>
          <strong style={{ color: '#059669', fontSize: '16px' }}>
            {slot?.harga}
          </strong>
        </div>

        <div style={styles.modalActions}>
          <button onClick={onClose} style={styles.outlineBtn}>
            Batal
          </button>
          <button onClick={onConfirm} style={styles.confirmBtn}>
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '28px',
    width: '420px',
    maxWidth: '90vw',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: '18px',
    color: '#1b4332',
    fontWeight: '700',
    marginBottom: '20px',
    marginTop: 0,
  },
  modalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid #F3F4F6',
    fontSize: '14px',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  outlineBtn: {
    padding: '8px 18px',
    borderRadius: '6px',
    border: '1px solid #D1D5DB',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  confirmBtn: {
    padding: '8px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#1b4332',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};