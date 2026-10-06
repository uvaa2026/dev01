import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// The old full-width footer bar is gone — this is a small floating control
// docked to the right edge, centered vertically. Hovering (or tapping, for
// touch devices without hover) reveals the same links the footer used to
// carry, without permanently spending page height on them.
export default function Footer() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    function handleOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <div
      className={`footer-fab${open ? ' open' : ''}`}
      ref={rootRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="footer-fab-trigger"
        aria-label="Site links"
        aria-expanded={open}
        aria-controls="footerFabPanel"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="footer-fab-dot"></span>
        <span className="footer-fab-dot"></span>
        <span className="footer-fab-dot"></span>
      </button>

      <div className="footer-fab-panel" id="footerFabPanel" role="menu">
        <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
        <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
        <a href="#" onClick={() => setOpen(false)}>Social</a>
        <Link to="/privacy-data" onClick={() => setOpen(false)}>Privacy &amp; Data</Link>
        <Link to="/what-uvaa-does-not-claim" onClick={() => setOpen(false)}>What UVAA does not claim</Link>
        <a href="#" onClick={() => setOpen(false)}>Terms</a>
        <span className="footer-fab-legal">
          © 2026 UVAA Leadership Intelligence &amp; Dheemer Consulting · Indian Patent Application No. 202641076718
        </span>
      </div>
    </div>
  )
}
