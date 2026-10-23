// 150000 -> 'Rp 150.000'
export function rupiah(angka) {
  const n = Math.round(Number(angka) || 0)
  return 'Rp ' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// '09:00:00' -> '09.00'
export function jamUI(waktu) {
  return String(waktu || '').slice(0, 5).replace(':', '.')
}

// ('09:00:00','10:00:00') -> '09.00 - 10.00'
export function rentangJam(mulai, selesai) {
  return `${jamUI(mulai)} - ${jamUI(selesai)}`
}

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

// '2026-10-21' -> 'Rabu, 21 Oktober 2026'
export function tanggalPanjang(tanggal) {
  const [y, m, d] = tanggal.split('-').map(Number)
  const hari = HARI[new Date(y, m - 1, d).getDay()]
  return `${hari}, ${d} ${BULAN[m - 1]} ${y}`
}

// Tanggal lokal perangkat sebagai 'YYYY-MM-DD' (BUKAN toISOString, yang memakai UTC dan bisa salah hari).
export function tanggalIso(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`
}

// Tambah/kurang hari pada 'YYYY-MM-DD'
export function geserHari(tanggal, n) {
  const [y, m, d] = tanggal.split('-').map(Number)
  return tanggalIso(new Date(y, m - 1, d + n))
}

// Tautan WhatsApp dari nomor 08xxxx atau 62xxxx. null jika kosong.
export function linkWa(no) {
  if (!no) return null
  const angka = no.startsWith('0') ? '62' + no.slice(1) : no
  return 'https://wa.me/' + angka
}
