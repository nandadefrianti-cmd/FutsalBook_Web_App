import { supabase } from '../lib/supabase'
import { cek } from '../lib/errors'
import { validateTelp } from './validators'

export async function register({ nama, email, password, ulangi, no_telp }) {
  if (!nama || !email || !password) throw new Error('Nama, email, dan kata sandi wajib diisi')
  if (String(nama).trim().length < 2) throw new Error('Nama minimal 2 karakter')
  if (password.length < 6) throw new Error('Kata sandi minimal 6 karakter')
  if (password !== ulangi) throw new Error('Kata sandi dan ulangi kata sandi tidak sama')
  const telp = validateTelp(no_telp, { kosongBoleh: true })
  // role TIDAK dikirim dari sini: pendaftaran selalu menjadi 'pemain' (diatur trigger database).
  const hasil = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { nama: nama.trim(), no_telp: telp } },
  })
  return cek(hasil)
}

export async function login({ email, password }) {
  if (!email || !password) throw new Error('Email dan kata sandi wajib diisi')
  const hasil = await supabase.auth.signInWithPassword({ email: email.trim(), password })
  return cek(hasil)
}

export async function logout() {
  await supabase.auth.signOut()
}

// Nama, nomor telepon, dan role (pemain/admin) dari tabel profiles
export async function getProfile(userId) {
  const hasil = await supabase.from('profiles').select('id, nama, no_telp, role').eq('id', userId).single()
  return cek(hasil)
}

// Tujuan setelah login: admin ke dashboard, pemain ke jadwal. Satu halaman login untuk keduanya.
export function rutePascaLogin(role) {
  return role === 'admin' ? '/admin/jadwal' : '/jadwal'
}
