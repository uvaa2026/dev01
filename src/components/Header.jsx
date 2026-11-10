import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useOrgAuth } from '../context/OrgAuthContext.jsx'

// "Floating Intelligence Navigation" — a single floating glass pill
// (.nav-float) instead of the previous full-width two-row bar. The six
// section links fold into four hover/tap dropdowns so the bar reads as
// four words wide on desktop; on narrow screens the dropdowns disappear
// entirely in favour of a full-screen panel (.nav-mobile-panel) listing
// every link flat.
//
// Register is deliberately gone from here — "Begin Assessment" sends a
// guest to /login, which already offers both "Create an account" and
// "Register your organisation" (see Login.jsx) — so what were three
// competing top-level buttons (Explore a Pilot / Register / Begin) are
// down to two.
const NAV_GROUPS = [
  {
    label: 'Discover',
    items: [
      { to: '/#challenge', label: 'The Challenge' },
      { to: '/#about-uvaa', label: 'About UVAA' },
    ],
  },
  {
    label: 'The Assessment',
    items: [
      { to: '/#assessment', label: 'Assessment Overview' },
      { to: '/#what-you-receive', label: 'What You Receive' },
    ],
  },
  {
    label: 'How It Works',
    items: [
      { to: '/#how-it-works', label: 'The Development Journey' },
      { to: '/#development-approach', label: 'Development Approach' },
    ],
  },
  {
    label: 'About',
    items: [
      { to: '/#about-us', label: 'About Us' },
      { to: '/#faq', label: 'FAQ' },
    ],
  },
]

// Small gap tolerated between leaving a trigger and landing on its
// dropdown — same debounced hover pattern Footer.jsx already uses for its
// floating link panel, so a cursor crossing the 10px gap between the
// trigger and the menu doesn't close it first.
const CLOSE_DELAY_MS = 200
const SCROLL_THRESHOLD = 18

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const { isOrgAuthenticated, orgAdmin, clearOrgAdmin } = useOrgAuth()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function handleOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenGroup(null)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  // The mobile panel covers the whole viewport — lock background scroll
  // while it's open so the page underneath doesn't move with it.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  function openGroupNow(label) {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpenGroup(label)
  }

  function closeGroupSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenGroup(null), CLOSE_DELAY_MS)
  }

  function toggleGroup(label) {
    setOpenGroup((g) => (g === label ? null : label))
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  async function handleLogout() {
    // The session cookie is shared between the two login kinds — one
    // logout call clears it regardless of which context is active.
    await logout()
    clearOrgAdmin()
    closeMobile()
    navigate('/')
  }

  const actionButtons = isAuthenticated ? (
    <>
      {user?.isAdmin && <Link to="/admin/users" className="btn btn-ghost" onClick={closeMobile}>Admin</Link>}
      {user?.isOrgAdminOf && <Link to="/org-admin" className="btn btn-ghost" onClick={closeMobile}>Org Dashboard</Link>}
      <Link to="/my-page" className="btn btn-ghost" onClick={closeMobile}>
        {user?.fullName ? user.fullName.split(' ')[0] : 'My page'}
      </Link>
      <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
    </>
  ) : isOrgAuthenticated ? (
    <>
      <Link to="/org-admin" className="btn btn-ghost" onClick={closeMobile}>
        {orgAdmin?.fullName ? orgAdmin.fullName.split(' ')[0] : 'Org Dashboard'}
      </Link>
      <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
    </>
  ) : (
    <>
      <Link to="/#pilot" className="btn btn-ghost" onClick={closeMobile}>Explore a Pilot</Link>
      <Link to="/login" className="btn btn-primary" onClick={closeMobile}>Begin Assessment &rarr;</Link>
    </>
  )

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-float">
        <Link to="/" className="brand" aria-label="UVAA home" onClick={closeMobile}>
          <span className="brand-logotype">
            UV<span className="brand-a1">A</span><span className="brand-a2">&Lambda;</span><sup className="brand-tm">&trade;</sup>
          </span>
          <span className="brand-sub">Decision Intelligence</span>
          <span className="brand-signal" aria-hidden="true">
            <svg viewBox="0 0 40 20">
              <defs>
                <linearGradient id="uvaa-signal-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#4dd8ff" />
                  <stop offset="1" stopColor="#8b7cff" />
                </linearGradient>
              </defs>
              <path d="M0 10 H5 L9 3 L13 17 L17 6 L21 14 L25 10 H40" />
            </svg>
          </span>
        </Link>

        <nav className="nav-menu" aria-label="Primary" ref={menuRef}>
          {NAV_GROUPS.map((group) => (
            <div
              key={group.label}
              className={`nav-item${openGroup === group.label ? ' open' : ''}`}
              onMouseEnter={() => openGroupNow(group.label)}
              onMouseLeave={closeGroupSoon}
            >
              <button
                type="button"
                className="nav-trigger"
                aria-expanded={openGroup === group.label}
                onClick={() => toggleGroup(group.label)}
              >
                {group.label}
                <svg className="nav-chevron" viewBox="0 0 10 6" aria-hidden="true">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="nav-dropdown" role="menu">
                {group.items.map((item) => (
                  <Link key={item.to} to={item.to} role="menuitem" onClick={() => setOpenGroup(null)}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="nav-actions">{actionButtons}</div>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobileNav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
          <span className="nav-toggle-bar"></span>
        </button>
      </div>

      <div className={`nav-mobile-panel${mobileOpen ? ' open' : ''}`} id="mobileNav">
        <button type="button" className="nav-mobile-close" aria-label="Close menu" onClick={closeMobile}>&times;</button>
        <nav className="nav-mobile-links" aria-label="Mobile">
          {NAV_GROUPS.flatMap((group) => group.items).map((item) => (
            <Link key={item.to} to={item.to} onClick={closeMobile}>{item.label}</Link>
          ))}
        </nav>
        <div className="nav-mobile-actions">{actionButtons}</div>
      </div>
    </header>
  )
}
