import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Hero image is hotlinked from Unsplash (free license, no attribution
// required) rather than bundled into the repo — swap this URL for a
// self-hosted asset whenever there's a preferred photo, ideally one shot
// for UVAA rather than stock.
const HERO_IMAGE = 'https://images.unsplash.com/photo-1757063313438-6e7cb0d09809?fm=jpg&q=80&w=2000&auto=format&fit=crop'
const BAND_IMAGE = 'https://images.unsplash.com/photo-1730316335818-27a6e9eaec17?fm=jpg&q=80&w=2400&auto=format&fit=crop'

// Small, uniform-size outline icons — kept inline so the page has no
// external icon-font/library dependency.
const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M12 7.5v5l3.5 2" />
  </svg>
)
const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)
const IconList = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6h11" /><path d="M9 12h11" /><path d="M9 18h11" />
    <path d="M4 6h.01" /><path d="M4 12h.01" /><path d="M4 18h.01" />
  </svg>
)
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.5 8.5 0 0 1-11.9 7.8L4 21l1.7-5.1A8.5 8.5 0 1 1 21 11.5Z" />
  </svg>
)
const IconPulse = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h4l2-7 4 14 2-7h6" />
  </svg>
)
const IconBars = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 20V10" /><path d="M12 20V4" /><path d="M19 20v-7" />
  </svg>
)
const IconCompass = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" /><path d="M15 9l-2 6-6 2 2-6 6-2Z" />
  </svg>
)

export default function Welcome() {
  const { isAuthenticated, user } = useAuth()
  const destination = user?.isAdmin ? '/admin/users' : '/my-page'
  const destinationLabel = user?.isAdmin ? 'Go to Admin' : 'Go to My Page'

  return (
    <>
      {/* ============ HERO — full-bleed photo background ============ */}
      <section className="hero hero-photo-bg" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="hero-bg-scrim" aria-hidden="true"></div>

        <div className="container-wide hero-grid-bg">
          <div className="hero-copy-glass">
            <span className="eyebrow">
              <span className="dot"></span> A framework for the moments that test you
            </span>
            <h1>
              Know how you decide, <span className="accent">when it matters most.</span>
            </h1>
            <p className="lead">
              Most assessments measure what people say they would do. UVAA examines what happens
              to judgement when a situation becomes difficult.
            </p>
            {isAuthenticated ? (
              <div className="hero-actions">
                <Link to={destination} className="btn btn-primary btn-lg">{destinationLabel}</Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
                <Link to="/framework#dimensions" className="link-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.98rem' }}>
                  Explore the Framework →
                </Link>
              </div>
            )}
          </div>

          <div className="icon-row">
            <div className="icon-item">
              <span className="icon-badge"><IconGrid /></span>
              <span className="icon-num">47 situations</span>
              <span className="icon-label">not self-description</span>
            </div>
            <div className="icon-item">
              <span className="icon-badge"><IconClock /></span>
              <span className="icon-num">50 minutes</span>
              <span className="icon-label">two parts, one sitting</span>
            </div>
            <div className="icon-item">
              <span className="icon-badge"><IconTarget /></span>
              <span className="icon-num">1 profile</span>
              <span className="icon-label">a score and a pattern, not a type</span>
            </div>
            <div className="icon-item">
              <span className="icon-badge"><IconList /></span>
              <span className="icon-num">Ordered</span>
              <span className="icon-label">development priorities, not a list</span>
            </div>
          </div>
        </div>

        <div className="hero-badge-float" aria-hidden="true">
          <div className="ring-wrap">
            <div className="ring-track"></div>
            <span className="ring-value">73</span>
          </div>
          <span className="badge-caption">Sample result</span>
          <span className="badge-label">How they operate, from one UVAA profile</span>
        </div>
      </section>

      {/* ============ EXPERIENCE PANEL — copy + CTA left, steps right ============ */}
      <section>
        <div className="container-wide">
          <div className="panel-dark panel-dark-split">
            <div className="panel-left">
              <div className="section-head panel-head-left">
                <span className="eyebrow"><span className="dot"></span> The UVAA experience</span>
                <h2>Not a type. A measured pattern.</h2>
                <p>Two parts, one sitting, scored automatically — see the full structure on The Assessment.</p>
              </div>
              <Link to="/the-assessment" className="btn btn-ghost panel-cta">See how it works →</Link>
            </div>

            <div className="step-grid">
              <div className="step-card">
                <span className="step-icon"><IconChat /></span>
                <span className="step-no">01</span>
                <h4>Part one — 15 items</h4>
                <p>Short situations that establish how you operate day to day.</p>
              </div>
              <div className="step-card">
                <span className="step-icon"><IconPulse /></span>
                <span className="step-no">02</span>
                <h4>Part two — 32 items</h4>
                <p>Workplace situations, three responses each. None is obviously right.</p>
              </div>
              <div className="step-card">
                <span className="step-icon"><IconBars /></span>
                <span className="step-no">03</span>
                <h4>Scoring — automatic</h4>
                <p>Four capacity scores and a Decision Quality Index from 0 to 100.</p>
              </div>
              <div className="step-card">
                <span className="step-icon"><IconCompass /></span>
                <span className="step-no">04</span>
                <h4>Report — minutes</h4>
                <p>Generated and emailed as a PDF, available in your account for 90 days.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PANORAMA BAND (pull-quote) ============ */}
      <section className="panorama-band" style={{ backgroundImage: `url(${BAND_IMAGE})` }}>
        <div className="container">
          <p className="pull-quote">
            “Most assessments measure what people say they would do. UVAA measures what their
            judgement actually does when the situation is hard.”
          </p>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      {!isAuthenticated && (
        <section>
          <div className="container">
            <div className="cta-band">
              <h2>Worth a conversation before it is worth a cohort.</h2>
              <p>Discuss the instrument, review a sample report, and consider a pilot cohort.</p>
              <div className="hero-actions">
                <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
