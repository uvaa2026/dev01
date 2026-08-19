import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Smooth-scrolls to the element matching the current URL hash whenever the
// hash changes (e.g. nav links from other pages linking to "/#dimensions").
export default function useScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])
}
