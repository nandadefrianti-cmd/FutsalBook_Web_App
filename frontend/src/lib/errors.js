// Mengubah pesan error Supabase/Postgres menjadi pesan Indonesia yang ramah.
// Pesan dari fungsi database (RAISE EXCEPTION) sudah berbahasa Indonesia, jadi diteruskan apa adanya.
export function pesanError(error) {
  const msg = (error && error.message) || ''
  if (msg.includes('Slot sudah terisi')) return 'Slot sudah terisi. Pilih jam lain.'
  if (msg.includes('Invalid login credentials')) return 'Email atau kata sandi salah.'
  if (msg.includes('User already registered')) return 'Email sudah terdaftar. Silakan masuk.'
  if (msg.includes('Password should be at least')) return 'Kata sandi minimal 6 karakter.'
  if (msg.includes('Email not confirmed')) return 'Email belum dikonfirmasi. Cek kotak masuk email kamu.'
  if (msg.includes('permission denied')) return 'Kamu tidak punya akses untuk tindakan ini.'
  if (msg.includes('JWT expired')) return 'Sesi habis. Silakan masuk lagi.'
  if (msg.includes('Failed to fetch')) return 'Tidak ada koneksi ke server. Coba lagi.'
  return msg || 'Terjadi kesalahan. Coba lagi.'
}

// Membuka hasil { data, error } dari supabase: lempar Error jika gagal, kembalikan data jika berhasil.
export function cek(hasil) {
  if (hasil.error) throw new Error(pesanError(hasil.error))
  return hasil.data
}
