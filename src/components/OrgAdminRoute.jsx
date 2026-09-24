import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useOrgAuth } from '../context/OrgAuthContext.jsx'

// Gates the Org Admin dashboard. Access comes from EITHER of two session
// kinds (see OrgAuthContext.jsx): a direct Org Admin login (orgAdmin
// truthy), or a respondent session belonging to an opted-in Org Admin
// (user.isOrgAdminOf truthy). Both are checked before deciding "no access".
export default function OrgAdminRoute({ children }) {
  const { isAuthenticated, isAuthLoading, user } = useAuth()
  const { isOrgAuthenticated, isOrgAuthLoading, orgAdmin } = useOrgAuth()
  const location = useLocation()

  if (isAuthLoading || isOrgAuthLoading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Checking your session…
      </div>
    )
  }

  const hasAccess = isOrgAuthenticated || Boolean(isAuthenticated && user?.isOrgAdminOf)
  if (!hasAccess) {
    // A signed-in respondent who just isn't an org admin belongs on My
    // Page; anyone else (including a stale org-admin cookie) goes to the
    // Org Admin login, remembering where they were headed.
    if (isAuthenticated) {
      return <Navigate to="/my-page" replace />
    }
    return <Navigate to="/org-login" replace state={{ from: location.pathname }} />
  }

  return children
}
