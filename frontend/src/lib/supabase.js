import { createClient } from '@supabase/supabase-js'

// Nilai dibaca dari frontend/.env (JANGAN di-commit).
// JANGAN PERNAH memakai Secret key / service_role di frontend.
const url = import.meta.env.VITE_SUPABASE_URL
const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error('VITE_SUPABASE_URL dan kunci Supabase belum diisi di frontend/.env')
}

export const supabase = createClient(url, key)
