// Metode pembayaran. kode dikirim ke database dan HARUS salah satu dari:
// 'QRIS', 'GOPAY', 'DANA', 'OVO' (huruf besar; database menolak nilai lain).
// Pembayaran pada aplikasi ini DISIMULASIKAN (tidak ada uang yang diproses).
export const METODE_BAYAR = [
  { kode: 'QRIS', nama: 'QRIS (Simulasi Scan)', deskripsi: 'Simulasi pembayaran QRIS', simbol: '▦' },
  { kode: 'GOPAY', nama: 'GoPay', deskripsi: 'Pembayaran melalui GoPay', simbol: 'G' },
  { kode: 'DANA', nama: 'DANA', deskripsi: 'Pembayaran melalui DANA', simbol: 'D' },
  { kode: 'OVO', nama: 'OVO', deskripsi: 'Pembayaran melalui OVO', simbol: 'O' },
]

export const kodeMetodeValid = (kode) => METODE_BAYAR.some((m) => m.kode === kode)

// 'GOPAY' -> 'GoPay' (untuk ditampilkan)
export const namaMetode = (kode) => {
  const m = METODE_BAYAR.find((x) => x.kode === kode)
  return m ? m.nama.replace(' (Simulasi Scan)', '') : kode || '-'
}
