import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// <ProtectedRoute>...</ProtectedRoute>            -> harus login
// <ProtectedRoute perlu="admin">...</ProtectedRoute> -> harus login DAN admin
export default function ProtectedRoute({ perlu, children }) {
  const { user, profile, loading } = useAuth()
  const lokasi = useLocation()

  if (loading) return <p style={{ padding: 24 }}>Memuat...</p>
  if (!user) return <Navigate to="/masuk" replace state={{ dari: lokasi.pathname }} />
  if (perlu === 'admin' && profile?.role !== 'admin') return <Navigate to="/jadwal" replace />
  return children
}
