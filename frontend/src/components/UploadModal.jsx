import React, { useState } from 'react';

export default function UploadModal({ onSubmit, onClose }) {
  const [file, setFile] = useState(null);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalCard}>
        <h3 style={styles.modalTitle}>Upload Bukti Bayar</h3>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
          Pilih File Bukti Transfer
        </p>

        <div style={styles.fileInputContainer}>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div style={{ ...styles.modalActions, marginTop: '24px' }}>
          <button onClick={onClose} style={styles.outlineBtn}>
            Batal
          </button>
          <button onClick={() => onSubmit(file)} style={styles.confirmBtn}>
            Kirim
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
  fileInputContainer: {
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    padding: '12px',
  },
};