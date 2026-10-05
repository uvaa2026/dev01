import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Hero + panorama images are hotlinked from Unsplash (free license, no
// attribution required) rather than bundled into the repo — swap these two
// URLs for self-hosted assets whenever there's a preferred photo, ideally
// one shot for UVAA rather than stock.
const HERO_IMAGE = 'https://images.unsplash.com/photo-1757063313438-6e7cb0d09809?fm=jpg&q=80&w=1600&auto=format&fit=crop'
const BAND_IMAGE = 'https://images.unsplash.com/photo-1730316335818-27a6e9eaec17?fm=jpg&q=80&w=2400&auto=format&fit=crop'

export default function Welcome() {
  const { isAuthenticated, user } = useAuth()
  const destination = user?.isAdmin ? '/admin/users' : '/my-page'
  const destinationLabel = user?.isAdmin ? 'Go to Admin' : 'Go to My Page'

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
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

          <div className="hero-visual-photo" aria-hidden="true">
            <div className="hero-photo-wrap">
              <img src={HERO_IMAGE} alt="" className="hero-photo" />
              <div className="hero-photo-scrim"></div>
              <span className="hero-photo-tag">Pressure reveals the pattern</span>
              <div className="hero-photo-badge">
                <div className="ring-wrap">
                  <div className="ring-track"></div>
                  <span className="ring-value">73</span>
                </div>
                <span className="badge-caption">Sample result</span>
                <span className="badge-label">How they operate, from one UVAA profile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ICON ROW (the same evidence facts, badge-styled) ============ */}
      <section className="evidence-section">
        <div className="container">
          <div className="icon-row">
            <div className="icon-item">
              <span className="icon-badge">▦</span>
              <span className="icon-num">47 situations</span>
              <span className="icon-label">not self-description</span>
            </div>
            <div className="icon-item">
              <span className="icon-badge">◷</span>
              <span className="icon-num">50 minutes</span>
              <span className="icon-label">two parts, one sitting</span>
            </div>
            <div className="icon-item">
              <span className="icon-badge">◎</span>
              <span className="icon-num">1 profile</span>
              <span className="icon-label">a score and a pattern, not a type</span>
            </div>
            <div className="icon-item">
              <span className="icon-badge">▤</span>
              <span className="icon-num">Ordered</span>
              <span className="icon-label">development priorities, not a list</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCE PANEL (assessment structure, preview) ============ */}
      <section>
        <div className="container">
          <div className="panel-dark">
            <div className="section-head" style={{ marginBottom: 32 }}>
              <span className="eyebrow"><span className="dot"></span> The UVAA experience</span>
              <h2>Not a type. A measured pattern.</h2>
              <p>Two parts, one sitting, scored automatically — see the full structure on The Assessment.</p>
            </div>

            <div className="panel-steps">
              <div className="step">
                <div className="step-num">1</div>
                <h4>Part one — 15 items</h4>
                <p>Short situations that establish how you operate day to day.</p>
              </div>
              <span className="step-arrow" aria-hidden="true">→</span>
              <div className="step">
                <div className="step-num">2</div>
                <h4>Part two — 32 items</h4>
                <p>Workplace situations, three responses each. None is obviously right.</p>
              </div>
              <span className="step-arrow" aria-hidden="true">→</span>
              <div className="step">
                <div className="step-num">3</div>
                <h4>Scoring — automatic</h4>
                <p>Four capacity scores and a Decision Quality Index from 0 to 100.</p>
              </div>
              <span className="step-arrow" aria-hidden="true">→</span>
              <div className="step">
                <div className="step-num">4</div>
                <h4>Report — minutes</h4>
                <p>Generated and emailed as a PDF, available in your account for 90 days.</p>
              </div>
            </div>

            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 32, marginBottom: 0 }}>
              <Link to="/the-assessment" className="btn btn-ghost">See how it works →</Link>
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
