import { supabase } from '../lib/supabase'
import { cek } from '../lib/errors'
import { validateTarif } from './validators'

// ---- Tab "Jadwal Harian" ----
// [] jika belum ada booking pada tanggal itu. tanggal = 'YYYY-MM-DD'.
export async function getJadwalHarian(tanggal) {
  const hasil = await supabase
    .from('v_jadwal_harian')
    .select('*')
    .eq('tanggal', tanggal)
    .order('jam_mulai')
    .order('lapangan')
  return cek(hasil) || []
}

// ---- Tab "Konfirmasi Pembayaran" ----
// Semua booking (terisi/lunas/dibatalkan), terbaru di atas. [] jika belum ada.
// Tombol "Set Lunas" dan "Batalkan" hanya untuk baris berstatus 'terisi'.
// Baris 'dibatalkan' menampilkan "Dibatalkan oleh Player/Admin" dari kolom dibatalkan_oleh.
export async function getDaftarPembayaran() {
  const hasil = await supabase.from('v_daftar_pembayaran').select('*').order('created_at', { ascending: false })
  return cek(hasil) || []
}

export async function setLunas(bookingId) {
  return cek(await supabase.rpc('konfirmasi_pembayaran', { p_booking: bookingId }))
}

// Admin membatalkan booking (boleh status terisi maupun lunas)
export async function batalkanBooking(bookingId) {
  return cek(await supabase.rpc('batalkan_booking', { p_booking: bookingId }))
}

// ---- Tab "Pengaturan Tarif" ----
// Dua tarif per lapangan: weekday (Sen-Jum) dan weekend (Sab-Min). Hanya memengaruhi booking baru.
export async function getTarif() {
  const hasil = await supabase
    .from('courts')
    .select('id, nama_lapangan, jenis_lantai, harga_weekday, harga_weekend')
    .order('nama_lapangan')
  return cek(hasil) || []
}

export async function ubahTarif(courtId, weekday, weekend) {
  const a = validateTarif(weekday)
  const b = validateTarif(weekend)
  return cek(await supabase.rpc('update_tarif', { p_court: courtId, p_weekday: a, p_weekend: b }))
}

// ---- Tab "Laporan & Statistik" ----
// 4 kartu. Selalu mengembalikan angka (0 jika belum ada booking), bukan null.
export async function getRingkasan() {
  const data = cek(await supabase.rpc('laporan_ringkasan'))
  const r = (Array.isArray(data) ? data[0] : data) || {}
  return {
    totalPendapatan: Number(r.total_pendapatan) || 0,
    totalTransaksi: Number(r.total_transaksi) || 0,
    totalLunas: Number(r.total_lunas) || 0,
    totalTerisi: Number(r.total_terisi) || 0,
    totalDibatalkan: Number(r.total_dibatalkan) || 0,
  }
}

// Opsional (laporan per bulan untuk demo IK301). bulan = 'YYYY-MM'
export async function getLaporanPendapatan(bulan) {
  return cek(await supabase.rpc('laporan_pendapatan', { p_bulan: bulan + '-01' })) || []
}

export async function getJamRamai(bulan) {
  return cek(await supabase.rpc('laporan_jam_ramai', { p_bulan: bulan + '-01' })) || []
}
