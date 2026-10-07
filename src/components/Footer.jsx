import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// The old full-width footer bar is gone — this is a small floating control
// docked to the right edge. Hovering (or tapping, for touch devices without
// hover) reveals the same links the footer used to carry, without
// permanently spending page height on them.
//
// The trigger button and the panel are visually separated by a gap (so the
// panel reads as "floating", not glued to the button). That gap is dead
// space for hit-testing: closing on the instant `mouseleave` fires the
// close the moment the cursor crosses that gap, before it ever reaches the
// panel — the menu "moves away" underneath the pointer. A short close delay
// (cleared if the pointer re-enters before it fires) gives the cursor time
// to cross the gap without the panel vanishing first.
const CLOSE_DELAY_MS = 300

export default function Footer() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const closeTimer = useRef(null)

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function openNow() {
    clearCloseTimer()
    setOpen(true)
  }

  function closeSoon() {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  function closeNow() {
    clearCloseTimer()
    setOpen(false)
  }

  useEffect(() => {
    function handleOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        clearCloseTimer()
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      clearCloseTimer()
    }
  }, [])

  return (
    <div
      className={`footer-fab${open ? ' open' : ''}`}
      ref={rootRef}
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        className="footer-fab-trigger"
        aria-label="Site links"
        aria-expanded={open}
        aria-controls="footerFabPanel"
        onClick={() => (open ? closeNow() : openNow())}
      >
        <span className="footer-fab-dot"></span>
        <span className="footer-fab-dot"></span>
        <span className="footer-fab-dot"></span>
      </button>

      <div className="footer-fab-panel" id="footerFabPanel" role="menu">
        <Link to="/register" onClick={closeNow}>Register</Link>
        <Link to="/login" onClick={closeNow}>Login</Link>
        <a href="#" onClick={closeNow}>Social</a>
        <Link to="/privacy-data" onClick={closeNow}>Privacy &amp; Data</Link>
        <Link to="/what-uvaa-does-not-claim" onClick={closeNow}>What UVAA does not claim</Link>
        <a href="#" onClick={closeNow}>Terms</a>
        <span className="footer-fab-legal">
          © 2026 UVAA Leadership Intelligence &amp; Dheemer Consulting · Indian Patent Application No. 202641076718
        </span>
      </div>
    </div>
  )
}
