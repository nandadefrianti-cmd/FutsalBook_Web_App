import { supabase } from '../lib/supabase'
import { cek } from '../lib/errors'

// Data venue (1 baris: nama, alamat, jam buka/tutup). Boleh dipanggil tanpa login.
export async function getVenue() {
  const hasil = await supabase.from('venues').select('*').limit(1).single()
  return cek(hasil)
}

// Daftar lapangan beserta harga_weekday, harga_weekend, jenis_lantai, deskripsi. Boleh dipanggil tanpa login (Beranda).
export async function getCourts() {
  const hasil = await supabase.from('courts').select('*').order('nama_lapangan')
  return cek(hasil)
}

// Slot yang sudah dipesan: [{ jam_mulai:'19:00:00', status:'terisi'|'lunas', milik_saya:boolean }]
export async function getSlotTerisi(courtId, tanggal) {
  const hasil = await supabase.rpc('get_slot_terisi', { p_court: courtId, p_tanggal: tanggal })
  return cek(hasil) || []
}

// Menyusun daftar slot sehari untuk tampilan "Pilih Jam".
// status: 'kosong' | 'terisi' | 'milikku' | 'lewat'. Slot terakhir mulai 1 jam sebelum jamTutup.
export function buatSlotHari(jamBuka, jamTutup, terisi, tanggal, sekarang = new Date()) {
  const buka = parseInt(jamBuka.slice(0, 2), 10)
  const tutup = parseInt(jamTutup.slice(0, 2), 10)
  const peta = new Map(terisi.map((t) => [t.jam_mulai.slice(0, 5), t]))
  const [y, m, d] = tanggal.split('-').map(Number)
  const slot = []
  for (let h = buka; h < tutup; h++) {
    const jam = String(h).padStart(2, '0') + ':00'
    const selesai = String(h + 1).padStart(2, '0') + ':00'
    let status = 'kosong'
    if (new Date(y, m - 1, d, h, 0) <= sekarang) status = 'lewat'
    else if (peta.has(jam)) status = peta.get(jam).milik_saya ? 'milikku' : 'terisi'
    slot.push({ jam, selesai, label: `${jam.replace(':', '.')} - ${selesai.replace(':', '.')}`, status })
  }
  return slot
}
