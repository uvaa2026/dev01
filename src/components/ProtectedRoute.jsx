import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Gates a route behind a signed-in session. While the initial GET /auth/me
// check is in flight we show nothing (avoids a login-page flash for
// already-signed-in users); once resolved, signed-out visitors are bounced
// to /login with the page they wanted preserved so we can send them back.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isAuthLoading } = useAuth()
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

  return children
}
