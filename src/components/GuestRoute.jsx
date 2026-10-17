import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Inverse of ProtectedRoute: keeps a signed-in visitor OFF pages that only
// make sense when signed out (Login, Register). Without this, someone
// already logged in could still open /login or /register directly and see
// the form, which is confusing and was showing up as a real usability bug.
export default function GuestRoute({ children }) {
  const { isAuthenticated, isAuthLoading, user } = useAuth()

  if (isAuthLoading) {
    // A brief loading state instead of a blank screen — avoids a flash of
    // the login/register form before the check resolves, while still
    // giving the visitor something to look at during the round trip.
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    )
  }

  if (isAuthenticated) {
    const destination = user?.isAdmin ? '/admin/users' : user?.isOrgAdminOf ? '/org-admin' : '/my-page'
    return <Navigate to={destination} replace />
  }

  return children
}
