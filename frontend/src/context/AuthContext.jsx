import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { getProfile } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null) // { id, nama, no_telp, role }
  const [loading, setLoading] = useState(true)

  const muatProfil = useCallback(async (u) => {
    if (!u) { setUser(null); setProfile(null); setLoading(false); return }
    setUser(u)
    try {
      setProfile(await getProfile(u.id))
    } catch {
      setProfile(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => muatProfil(data.session?.user ?? null))
    // setTimeout: Supabase melarang memanggil query langsung di dalam callback ini
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => muatProfil(session?.user ?? null), 0)
    })
    return () => sub.subscription.unsubscribe()
  }, [muatProfil])

  const value = { user, profile, loading, isAdmin: profile?.role === 'admin', refresh: () => muatProfil(user) }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
