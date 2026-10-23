import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../lib/supabase', () => ({
  supabase: { rpc: vi.fn(), from: vi.fn(), auth: { getUser: vi.fn() } },
}))

import { supabase } from '../lib/supabase'
import { bookSlot, cancelBooking, bisaDibatalkan, getMyBookings } from '../services/bookingService'
import { validateBooking, validateTelp, validateTarif, jenisHari, hargaSlot } from '../services/validators'
import { buatSlotHari } from '../services/slotService'
import { getRingkasan, setLunas, ubahTarif, getDaftarPembayaran } from '../services/adminService'
import { rutePascaLogin } from '../services/authService'
import { rupiah, jamUI, tanggalPanjang, geserHari } from '../lib/format'
import { pesanError } from '../lib/errors'

beforeEach(() => vi.clearAllMocks())
const MASA_DEPAN = '2030-01-02'

describe('Booking', () => {
  it('1. booking sukses mengirim 6 parameter dengan nama bersih dan nomor angka saja', async () => {
    supabase.rpc.mockResolvedValue({ data: 42, error: null })
    const id = await bookSlot({ courtId: 1, tanggal: MASA_DEPAN, jam: '19:00', nama: '  Salwa ', telp: '0812-3456-7890', metode: 'QRIS' })
    expect(id).toBe(42)
    expect(supabase.rpc).toHaveBeenCalledWith('create_booking', {
      p_court: 1, p_tanggal: MASA_DEPAN, p_jam: '19:00', p_nama: 'Salwa', p_telp: '081234567890', p_metode: 'QRIS',
    })
  })
  it('2. slot sudah terisi -> pesan ramah', async () => {
    supabase.rpc.mockResolvedValue({ data: null, error: { message: 'Slot sudah terisi' } })
    await expect(bookSlot({ courtId: 1, tanggal: MASA_DEPAN, jam: '19:00', nama: 'Salwa', telp: '081234567890', metode: 'DANA' }))
      .rejects.toThrow('Slot sudah terisi. Pilih jam lain.')
  })
  it('3. validasi: metode di luar 4 pilihan ditolak, telepon kosong ditolak, nama pendek ditolak, slot lewat ditolak', () => {
    const dasar = { courtId: 1, tanggal: MASA_DEPAN, jam: '19:00', nama: 'Salwa', telp: '081234567890', metode: 'QRIS' }
    expect(() => validateBooking({ ...dasar, metode: 'BITCOIN' })).toThrow('metode pembayaran')
    expect(() => validateBooking({ ...dasar, metode: 'gopay' })).toThrow('metode pembayaran') // harus huruf besar
    expect(validateBooking({ ...dasar, metode: 'GOPAY' })).toBeTruthy()
    expect(validateBooking({ ...dasar, metode: 'OVO' })).toBeTruthy()
    expect(validateBooking({ ...dasar, metode: 'DANA' })).toBeTruthy()
    expect(() => validateBooking({ ...dasar, telp: '' })).toThrow('wajib diisi')
    expect(() => validateBooking({ ...dasar, telp: '1111' })).toThrow('tidak valid')
    expect(() => validateBooking({ ...dasar, nama: 'A' })).toThrow('Nama pemesan')
    expect(() => validateBooking({ ...dasar, tanggal: '2020-01-01' })).toThrow('sudah lewat')
    expect(validateBooking(dasar)).toEqual({ nama: 'Salwa', telp: '081234567890' })
  })
  it('4. nomor telepon: 08.., +62.. valid; opsional untuk pendaftaran', () => {
    expect(validateTelp('+62 812 3456 7890')).toBe('6281234567890')
    expect(validateTelp('', { kosongBoleh: true })).toBe('')
    expect(() => validateTelp('11111')).toThrow()
  })
  it('5. batalkan memanggil batalkan_booking; Booking Saya kosong jika belum pernah booking', async () => {
    supabase.rpc.mockResolvedValue({ data: null, error: null })
    await cancelBooking(7)
    expect(supabase.rpc).toHaveBeenCalledWith('batalkan_booking', { p_booking: 7 })
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    const q = { select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(), order: vi.fn() }
    q.order.mockReturnValueOnce(q).mockResolvedValueOnce({ data: [], error: null })
    supabase.from.mockReturnValue(q)
    expect(await getMyBookings()).toEqual([])
  })
  it('6. tombol batalkan hanya untuk status terisi dan waktu belum lewat', () => {
    const sekarang = new Date(2026, 9, 21, 12, 0)
    expect(bisaDibatalkan({ status: 'terisi', tanggal: '2026-10-21', jam_mulai: '19:00:00' }, sekarang)).toBe(true)
    expect(bisaDibatalkan({ status: 'terisi', tanggal: '2026-10-21', jam_mulai: '09:00:00' }, sekarang)).toBe(false)
    expect(bisaDibatalkan({ status: 'lunas', tanggal: '2026-10-22', jam_mulai: '19:00:00' }, sekarang)).toBe(false)
    expect(bisaDibatalkan({ status: 'dibatalkan', tanggal: '2026-10-22', jam_mulai: '19:00:00' }, sekarang)).toBe(false)
  })
})

describe('Slot', () => {
  it('7. 15 slot (08-23), penanda terisi/milikku/lewat', () => {
    const sekarang = new Date(2026, 9, 21, 10, 30)
    const s = buatSlotHari('08:00:00', '23:00:00',
      [{ jam_mulai: '19:00:00', status: 'terisi', milik_saya: false }, { jam_mulai: '20:00:00', status: 'terisi', milik_saya: true }],
      '2026-10-21', sekarang)
    expect(s).toHaveLength(15)
    expect(s[0]).toMatchObject({ jam: '08:00', label: '08.00 - 09.00', status: 'lewat' })
    expect(s[3].status).toBe('kosong') // 11:00
    expect(s.find((x) => x.jam === '19:00').status).toBe('terisi')
    expect(s.find((x) => x.jam === '20:00').status).toBe('milikku')
    expect(s[14].label).toBe('22.00 - 23.00')
  })
})

describe('Admin', () => {
  it('8. ringkasan awal bernilai nol (belum ada booking)', async () => {
    supabase.rpc.mockResolvedValue({ data: [{ total_pendapatan: 0, total_transaksi: 0, total_lunas: 0, total_terisi: 0, total_dibatalkan: 0 }], error: null })
    expect(await getRingkasan()).toEqual({ totalPendapatan: 0, totalTransaksi: 0, totalLunas: 0, totalTerisi: 0, totalDibatalkan: 0 })
    supabase.rpc.mockResolvedValue({ data: [], error: null })
    expect((await getRingkasan()).totalPendapatan).toBe(0)
  })
  it('9. set lunas, ubah tarif (validasi), daftar pembayaran kosong', async () => {
    supabase.rpc.mockResolvedValue({ data: null, error: null })
    await setLunas(5)
    expect(supabase.rpc).toHaveBeenCalledWith('konfirmasi_pembayaran', { p_booking: 5 })
    await ubahTarif(1, '160000', '190000')
    expect(supabase.rpc).toHaveBeenCalledWith('update_tarif', { p_court: 1, p_weekday: 160000, p_weekend: 190000 })
    await expect(ubahTarif(1, '500', '190000')).rejects.toThrow('Tarif harus')
    await expect(ubahTarif(1, '160000', '99999999')).rejects.toThrow('Tarif harus')
    expect(() => validateTarif('15000.5')).toThrow()
    const q = { select: vi.fn().mockReturnThis(), order: vi.fn().mockResolvedValue({ data: null, error: null }) }
    supabase.from.mockReturnValue(q)
    expect(await getDaftarPembayaran()).toEqual([])
  })
  it('10. login: admin ke /admin/jadwal, pemain ke /jadwal', () => {
    expect(rutePascaLogin('admin')).toBe('/admin/jadwal')
    expect(rutePascaLogin('pemain')).toBe('/jadwal')
  })
})

describe('Tarif weekday / weekend', () => {
  it('12. jenis hari dan harga slot mengikuti Sen-Jum = weekday, Sab-Min = weekend', () => {
    // 2026-10-21 Rabu, 2026-10-23 Jumat, 2026-10-24 Sabtu, 2026-10-25 Minggu, 2026-10-26 Senin
    expect(jenisHari('2026-10-21')).toBe('weekday')
    expect(jenisHari('2026-10-23')).toBe('weekday')
    expect(jenisHari('2026-10-24')).toBe('weekend')
    expect(jenisHari('2026-10-25')).toBe('weekend')
    expect(jenisHari('2026-10-26')).toBe('weekday')
    const court = { harga_weekday: '150000.00', harga_weekend: '180000.00' }
    expect(hargaSlot(court, '2026-10-21')).toBe(150000)
    expect(hargaSlot(court, '2026-10-24')).toBe(180000)
    expect(hargaSlot(null, '2026-10-24')).toBe(0)
    expect(hargaSlot(court, '')).toBe(0)
  })
})

describe('Format', () => {
  it('13. rupiah, jam, tanggal', () => {
    expect(rupiah(150000)).toBe('Rp 150.000')
    expect(rupiah(0)).toBe('Rp 0')
    expect(jamUI('09:00:00')).toBe('09.00')
    expect(tanggalPanjang('2026-10-21')).toBe('Rabu, 21 Oktober 2026')
    expect(geserHari('2026-10-31', 1)).toBe('2026-11-01')
    expect(pesanError({ message: 'permission denied for function x' })).toContain('tidak punya akses')
  })
})
