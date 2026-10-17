import { Navigate } from 'react-router-dom'
import { useOrgAuth } from '../context/OrgAuthContext.jsx'

// Keeps an already-signed-in Org Admin (direct org-admin session) off
// /org-register and /org-login. Mirrors GuestRoute.jsx's role for
// respondents, scoped to the Org Admin session kind only — a signed-in
// respondent is not redirected away from these pages, since they may be
// registering a second organisation or logging in as an org admin
// separately from their respondent account.
export default function OrgGuestRoute({ children }) {
  const { isOrgAuthenticated, isOrgAuthLoading } = useOrgAuth()

  if (isOrgAuthLoading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    )
  }

  if (isOrgAuthenticated) {
    return <Navigate to="/org-admin" replace />
  }

  return children
}
