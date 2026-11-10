import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Home is now the entire marketing site, addressed by anchors
// (/#assessment, /#faq, /#contact, …) rather than separate routes.
// React Router's <Link to="/#id"> only does a client-side pushState when
// you're already on "/" — the browser's native "jump to fragment on load"
// behaviour never fires, so nothing scrolls on its own. This hook fixes
// that: it watches the route's hash and scrolls the matching element into
// view, on first mount and on every later hash change (including the
// no-op case of clicking the same anchor link twice).
//
// `.site-header` is `position: sticky`, so a plain scrollIntoView would
// land the target's heading half-hidden under it — see the
// `scroll-margin-top` rule added alongside this hook in index.css.
export default function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const id = hash.slice(1)
    // Give the just-rendered page a frame to lay out before measuring —
    // relevant right after navigating here from a different route.
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(raf)
  }, [hash])
}
