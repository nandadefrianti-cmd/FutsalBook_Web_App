import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ConfirmModal from '../components/ConfirmModal';
import UploadModal from '../components/UploadModal';
import JadwalPage from './JadwalPage';
import BookingSayaPage from './BookingSayaPage';

// Komponen Admin (Perbaikan jalur import dengan menambahkan ./ di depannya)
import AdminSidebar from '../components/AdminSidebar';
import JadwalHarianPage from './Admin/JadwalHarianPage';
import KonfirmasiPembayaranPage from './Admin/KonfirmasiPembayaranPage';
import LapanganTarifPage from './Admin/LapanganTarifPage';
import LaporanPage from './Admin/LaporanPage';
export default function Dashboard() {
  // Ambil data user dari localStorage untuk cek role
  const storedUser = JSON.parse(localStorage.getItem('user')) || { role: 'player' };
  const isAdmin = storedUser.role === 'admin';

  const [activeTab, setActiveTab] = useState(isAdmin ? 'jadwalHarian' : 'jadwal');

  // Player States
  const [venue, setVenue] = useState('Futsal Arena Ciputat');
  const [court, setCourt] = useState('Lapangan 1');
  const [date, setDate] = useState('2026-05-14');
  const [selectedSlot, setSelectedSlot] = useState({ jam: '19:00 - 20:00', harga: 'Rp 150.000' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Data Dummy Slot & Booking
  const slots = [
    { jam: '08:00 - 09:00', harga: 'Rp 120.000', status: 'available' },
    { jam: '09:00 - 10:00', harga: 'Rp 120.000', status: 'booked' },
    { jam: '10:00 - 11:00', harga: 'Rp 120.000', status: 'available' },
    { jam: '11:00 - 12:00', harga: 'Rp 120.000', status: 'available' },
    { jam: '12:00 - 13:00', harga: 'Rp 120.000', status: 'booked' },
    { jam: '13:00 - 14:00', harga: 'Rp 120.000', status: 'available' },
    { jam: '14:00 - 15:00', harga: 'Rp 120.000', status: 'available' },
    { jam: '15:00 - 16:00', harga: 'Rp 130.000', status: 'booked' },
    { jam: '16:00 - 17:00', harga: 'Rp 130.000', status: 'available' },
    { jam: '17:00 - 18:00', harga: 'Rp 130.000', status: 'available' },
    { jam: '18:00 - 19:00', harga: 'Rp 150.000', status: 'available', tag: 'Ramai' },
    { jam: '19:00 - 20:00', harga: 'Rp 150.000', status: 'available', tag: 'Ramai' },
    { jam: '20:00 - 21:00', harga: 'Rp 150.000', status: 'booked', tag: 'Ramai' },
    { jam: '21:00 - 22:00', harga: 'Rp 150.000', status: 'available', tag: 'Ramai' },
    { jam: '22:00 - 23:00', harga: 'Rp 150.000', status: 'available', tag: 'Ramai' },
  ];

  const [myBookings, setMyBookings] = useState([
    { id: 1, tanggal: '16 Mei 2026', jam: '19:00 - 20:00', lapangan: 'Lapangan 1', total: 'Rp 150.000', statusBooking: 'Menunggu', statusBayar: 'Belum bayar' },
    { id: 2, tanggal: '18 Mei 2026', jam: '20:00 - 21:00', lapangan: 'Lapangan 2', total: 'Rp 150.000', statusBooking: 'Menunggu', statusBayar: 'Menunggu konfirmasi' },
    { id: 3, tanggal: '20 Mei 2026', jam: '16:00 - 17:00', lapangan: 'Lapangan 1', total: 'Rp 130.000', statusBooking: 'Terkonfirmasi', statusBayar: 'Lunas' },
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // Tampilan Khusus Admin dengan Layout Sidebar
  if (isAdmin) {
    return (
      <div style={styles.adminLayout}>
        <AdminSidebar
          activeMenu={activeTab}
          setActiveMenu={setActiveTab}
          onLogout={handleLogout}
        />
        <main style={styles.adminMainContent}>
          {activeTab === 'jadwalHarian' && <JadwalHarianPage />}
          {activeTab === 'konfirmasiPembayaran' && <KonfirmasiPembayaranPage />}
          {activeTab === 'lapanganTarif' && <LapanganTarifPage />}
          {activeTab === 'laporan' && <LaporanPage />}
        </main>
      </div>
    );
  }

  // Tampilan Player
  return (
    <div style={styles.dashboardContainer}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main style={styles.mainContent}>
        {activeTab === 'jadwal' ? (
          <JadwalPage
            venue={venue}
            setVenue={setVenue}
            court={court}
            setCourt={setCourt}
            date={date}
            setDate={setDate}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            onBookingClick={() => setShowConfirmModal(true)}
            slots={slots}
          />
        ) : (
          <BookingSayaPage
            bookings={myBookings}
            onOpenUploadModal={() => setShowUploadModal(true)}
          />
        )}
      </main>

      {showConfirmModal && (
        <ConfirmModal
          slot={selectedSlot}
          court={court}
          onConfirm={() => {
            alert('Booking berhasil dibuat!');
            setShowConfirmModal(false);
            setActiveTab('bookingSaya');
          }}
          onClose={() => setShowConfirmModal(false)}
        />
      )}

      {showUploadModal && (
        <UploadModal
          onSubmit={() => {
            alert('Bukti bayar berhasil dikirim!');
            setShowUploadModal(false);
          }}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
}

const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#F8F7F2',
    fontFamily: 'sans-serif',
    boxSizing: 'border-box',
  },
  mainContent: {
    maxWidth: '1100px',
    margin: '32px auto',
    padding: '0 20px',
  },
  adminLayout: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#F8F7F2',
    fontFamily: 'sans-serif',
    boxSizing: 'border-box',
  },
  adminMainContent: {
    flex: 1,
    padding: '40px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};