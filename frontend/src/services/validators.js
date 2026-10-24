import { kodeMetodeValid } from '../config/pembayaran'

// Nomor telepon -> angka saja. Contoh: '0812-3456-7890' / '+62 812 3456 7890'.
// Melempar Error jika format salah. kosongBoleh=true mengembalikan '' bila kosong.
export function validateTelp(no, { kosongBoleh = false } = {}) {
  const angka = String(no || '').replace(/[\s\-+()]/g, '')
  if (angka === '') {
    if (kosongBoleh) return ''
    throw new Error('Nomor telepon wajib diisi')
  }
  if (!/^(08|62)[0-9]{8,12}$/.test(angka)) {
    throw new Error('Nomor telepon tidak valid. Contoh: 081234567890')
  }
  return angka
}

// Validasi formulir booking. Mengembalikan data bersih; melempar Error jika tidak valid.
// Aturan yang sama diperiksa ulang di database (create_booking), ini hanya agar pesan cepat muncul.
export function validateBooking({ courtId, tanggal, jam, nama, telp, metode }, sekarang = new Date()) {
  if (!courtId || !tanggal || !jam) {
    throw new Error('Pilih lapangan, tanggal, dan jam terlebih dahulu')
  }
  const namaBersih = String(nama || '').trim()
  if (namaBersih.length < 2 || namaBersih.length > 100) {
    throw new Error('Nama pemesan harus 2 sampai 100 karakter')
  }
  const telpBersih = validateTelp(telp)
  if (!kodeMetodeValid(metode)) {
    throw new Error('Pilih metode pembayaran (QRIS, GoPay, DANA, atau OVO)')
  }
  const [y, m, d] = tanggal.split('-').map(Number)
  const [hh, mm] = jam.split(':').map(Number)
  if (new Date(y, m - 1, d, hh, mm) <= sekarang) {
    throw new Error('Tidak bisa memesan slot yang sudah lewat')
  }
  return { nama: namaBersih, telp: telpBersih }
}

// Jenis hari dari 'YYYY-MM-DD': Sabtu dan Minggu = 'weekend', Senin-Jumat = 'weekday'.
// Aturan yang sama dipakai database (hitung_harga).
export function jenisHari(tanggal) {
  const [y, m, d] = tanggal.split('-').map(Number)
  const hari = new Date(y, m - 1, d).getDay() // 0 = Minggu, 6 = Sabtu
  return hari === 0 || hari === 6 ? 'weekend' : 'weekday'
}

// Harga satu jam di lapangan pada tanggal tertentu (untuk "Harga Lapangan" dan "Total Harga" di layar).
// court = baris dari getCourts(). Harga final yang disimpan tetap dihitung database.
export function hargaSlot(court, tanggal) {
  if (!court || !tanggal) return 0
  return Number(jenisHari(tanggal) === 'weekend' ? court.harga_weekend : court.harga_weekday)
}

// Tarif: bilangan bulat 1.000 - 10.000.000 (sama dengan aturan update_tarif di database).
export function validateTarif(nilai) {
  const n = Number(nilai)
  if (!Number.isInteger(n) || n < 1000 || n > 10000000) {
    throw new Error('Tarif harus bilangan bulat antara 1.000 dan 10.000.000')
  }
  return n
}
