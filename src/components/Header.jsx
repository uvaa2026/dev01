import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    setOpen(false)
    await logout()
    navigate('/')
  }

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Primary">
        <Link to="/" className="brand" aria-label="UVAA home" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true"></span>
          <span>
            UVAA
            <span className="brand-sub">Leadership Intelligence</span>
          </span>
        </Link>

        <ul className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          <li><Link to="/#about" onClick={() => setOpen(false)}>About UVAA</Link></li>
          <li><Link to="/#dimensions" onClick={() => setOpen(false)}>The Framework</Link></li>
          <li><Link to="/#how-it-works" onClick={() => setOpen(false)}>How it works</Link></li>
          <li><Link to="/#organisations" onClick={() => setOpen(false)}>For Organisations</Link></li>
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <Link to="/my-page" className="btn btn-ghost" onClick={() => setOpen(false)}>
                {user?.fullName ? user.fullName.split(' ')[0] : 'My page'}
              </Link>
              <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
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
