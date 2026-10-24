import { supabase } from '../lib/supabase'
import { cek } from '../lib/errors'
import { validateBooking } from './validators'

export const LABEL_STATUS = { terisi: 'TERISI', lunas: 'LUNAS', dibatalkan: 'DIBATALKAN' }

// Dipanggil saat pemain menekan "Simulasikan Pembayaran Berhasil". Mengembalikan id booking baru.
// Slot yang diambil orang lain di tengah jalan -> Error 'Slot sudah terisi. Pilih jam lain.'
export async function bookSlot({ courtId, tanggal, jam, nama, telp, metode }) {
  const bersih = validateBooking({ courtId, tanggal, jam, nama, telp, metode })
  const hasil = await supabase.rpc('create_booking', {
    p_court: courtId,
    p_tanggal: tanggal,
    p_jam: jam,
    p_nama: bersih.nama,
    p_telp: bersih.telp,
    p_metode: metode,
  })
  return cek(hasil)
}

export async function cancelBooking(bookingId) {
  const hasil = await supabase.rpc('batalkan_booking', { p_booking: bookingId })
  return cek(hasil)
}

// Halaman "Booking Saya": hanya milik pengguna yang login. Array kosong [] jika belum pernah booking.
export async function getMyBookings() {
  const { data: sesi } = await supabase.auth.getUser()
  if (!sesi.user) throw new Error('Silakan masuk terlebih dahulu')
  const hasil = await supabase
    .from('bookings')
    .select('id, kode_booking, tanggal, jam_mulai, jam_selesai, nama_pemesan, no_telp, metode_bayar, status, total_harga, courts(nama_lapangan)')
    .eq('user_id', sesi.user.id)
    .order('tanggal', { ascending: false })
    .order('jam_mulai', { ascending: false })
  return cek(hasil) || []
}

// Tombol "Batalkan Booking" untuk pemain: hanya status terisi dan waktunya belum lewat.
export function bisaDibatalkan(b, sekarang = new Date()) {
  if (b.status !== 'terisi') return false
  const [y, m, d] = b.tanggal.split('-').map(Number)
  const [hh, mm] = b.jam_mulai.split(':').map(Number)
  return new Date(y, m - 1, d, hh, mm) > sekarang
}
