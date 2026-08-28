import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Same shape as ProtectedRoute, plus an is_admin check. A signed-in
// non-admin visiting an admin URL is sent to My Page rather than /login —
// they're authenticated, just not authorised for this area.
export default function AdminRoute({ children }) {
  const { isAuthenticated, isAuthLoading, user } = useAuth()
  const location = useLocation()

  if (isAuthLoading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Checking your session…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!user?.isAdmin) {
    return <Navigate to="/my-page" replace />
  }

  return children
}
