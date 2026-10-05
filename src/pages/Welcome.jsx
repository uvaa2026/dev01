import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

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

          <div className="hero-visual" aria-hidden="true">
            <div className="orb-glow"></div>
            <picture>
              <source srcSet="/hero-orb.webp" type="image/webp" />
              <img src="/hero-orb.png" alt="" className="hero-orb-image" />
            </picture>
          </div>
        </div>
      </section>

      {/* ============ EVIDENCE STRIP (immediately below the hero) ============ */}
      <section className="evidence-section">
        <div className="container">
          <div className="evidence-strip">
            <div className="evidence-item">
              <span className="evidence-num">47</span>
              <span className="evidence-label">real situations, not self-description</span>
            </div>
            <div className="evidence-item">
              <span className="evidence-num">50 min</span>
              <span className="evidence-label">two parts, one sitting</span>
            </div>
            <div className="evidence-item">
              <span className="evidence-num">1 profile</span>
              <span className="evidence-label">a score and a pattern, not a type</span>
            </div>
            <div className="evidence-item">
              <span className="evidence-num">Ordered</span>
              <span className="evidence-label">development priorities, not a list</span>
            </div>
          </div>
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
