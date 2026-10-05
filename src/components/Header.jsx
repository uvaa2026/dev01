import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useOrgAuth } from '../context/OrgAuthContext.jsx'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const { isOrgAuthenticated, orgAdmin, clearOrgAdmin } = useOrgAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    setOpen(false)
    // The session cookie is shared between the two login kinds — one
    // logout call clears it regardless of which context is active.
    await logout()
    clearOrgAdmin()
    navigate('/')
  }

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Primary">
        <Link to="/" className="brand" aria-label="UVAA home" onClick={() => setOpen(false)}>
          <span className="brand-logotype">
            UV<span className="brand-a1">A</span><span className="brand-a2">A</span>
          </span>
          <span className="brand-divider" aria-hidden="true"></span>
          <span className="brand-sub">Emotional stability under pressure</span>
        </Link>

        <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          <li><NavLink to="/why-uvaa" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : undefined)}>Why</NavLink></li>
          <li><NavLink to="/framework" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : undefined)}>Framework</NavLink></li>
          <li><NavLink to="/the-assessment" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : undefined)}>Assessment</NavLink></li>
          <li><NavLink to="/what-you-get" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : undefined)}>Benefits</NavLink></li>
          <li><NavLink to="/for-organisations" onClick={() => setOpen(false)} className={({ isActive }) => (isActive ? 'active' : undefined)}>Organisations</NavLink></li>
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              {user?.isAdmin && (
                <Link to="/admin/users" className="btn btn-ghost" onClick={() => setOpen(false)}>Admin</Link>
              )}
              {user?.isOrgAdminOf && (
                <Link to="/org-admin" className="btn btn-ghost" onClick={() => setOpen(false)}>Org Dashboard</Link>
              )}
              <Link to="/my-page" className="btn btn-ghost" onClick={() => setOpen(false)}>
                {user?.fullName ? user.fullName.split(' ')[0] : 'My page'}
              </Link>
              <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
            </>
          ) : isOrgAuthenticated ? (
            <>
              <Link to="/org-admin" className="btn btn-ghost" onClick={() => setOpen(false)}>
                {orgAdmin?.fullName ? orgAdmin.fullName.split(' ')[0] : 'Org Dashboard'}
              </Link>
              <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-text-link" onClick={() => setOpen(false)}>Sign In</Link>
              <Link to="/register" className="btn btn-ghost" onClick={() => setOpen(false)}>Register</Link>
              <Link to="/talk-to-us" className="btn btn-primary" onClick={() => setOpen(false)}>Talk to Us</Link>
            </>
          )}
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="navLinks"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </nav>
    </header>
  )
}
