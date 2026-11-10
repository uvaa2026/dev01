import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useOrgAuth } from '../context/OrgAuthContext.jsx'

// Two rows: logo + action buttons on top, the six section links on their
// own row underneath. Previously all of this tried to fit on one line,
// which (once the single-page rebuild added three more nav links and an
// extra "Explore a Pilot" button) no longer fit above the old 1040px
// collapse point and read as cramped — see index.css's Navigation section
// for the layout. Letting .nav-links wrap onto its own full-width row
// means it never needs a hamburger/dropdown at any width, so the mobile
// menu toggle and its "open" panel are gone too.
export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const { isOrgAuthenticated, orgAdmin, clearOrgAdmin } = useOrgAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    // The session cookie is shared between the two login kinds — one
    // logout call clears it regardless of which context is active.
    await logout()
    clearOrgAdmin()
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="nav container">
        <div className="nav-top">
          <Link to="/" className="brand" aria-label="UVAA home">
            <span className="brand-logotype">
              UV<span className="brand-a1">A</span><span className="brand-a2">&Lambda;</span><sup className="brand-tm">&trade;</sup>
            </span>
            <span className="brand-sub">Decision Intelligence</span>
          </Link>

          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                {user?.isAdmin && <Link to="/admin/users" className="btn btn-ghost">Admin</Link>}
                {user?.isOrgAdminOf && <Link to="/org-admin" className="btn btn-ghost">Org Dashboard</Link>}
                <Link to="/my-page" className="btn btn-ghost">
                  {user?.fullName ? user.fullName.split(' ')[0] : 'My page'}
                </Link>
                <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
              </>
            ) : isOrgAuthenticated ? (
              <>
                <Link to="/org-admin" className="btn btn-ghost">
                  {orgAdmin?.fullName ? orgAdmin.fullName.split(' ')[0] : 'Org Dashboard'}
                </Link>
                <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/#pilot" className="btn btn-ghost">Explore a Pilot</Link>
                <Link to="/register" className="btn btn-ghost">Register</Link>
                <Link to="/login" className="btn btn-primary">Begin &rarr;</Link>
              </>
            )}
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary">
          <Link to="/#challenge">The Challenge</Link>
          <Link to="/#about-uvaa">About UVAA</Link>
          <Link to="/#assessment">The Assessment</Link>
          <Link to="/#what-you-receive">What You Receive</Link>
          <Link to="/#how-it-works">How It Works</Link>
          <Link to="/#about-us">About Us</Link>
        </nav>
      </div>
    </header>
  )
}
