import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Inverse of ProtectedRoute: keeps a signed-in visitor OFF pages that only
// make sense when signed out (Login, Register). Without this, someone
// already logged in could still open /login or /register directly and see
// the form, which is confusing and was showing up as a real usability bug.
export default function GuestRoute({ children }) {
  const { isAuthenticated, isAuthLoading, user } = useAuth()

  if (isAuthLoading) {
    return null // avoid a flash of the login/register form before the check resolves
  }

  if (isAuthenticated) {
    return <Navigate to={user?.isAdmin ? '/admin/users' : '/my-page'} replace />
  }

  return children
}
