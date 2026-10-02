import { Link } from 'react-router-dom'
import useScrollToHash from '../lib/useScrollToHash.js'
import { useAuth } from '../context/AuthContext.jsx'

const TALK_TO_US_EMAIL = 'talktous@uvaa.example.com'

export default function Welcome() {
  useScrollToHash()
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
                <a href={`mailto:${TALK_TO_US_EMAIL}`} className="btn btn-primary btn-lg">Talk to Us</a>
                <Link to="/#dimensions" className="link-accent" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.98rem' }}>
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

      {/* ============ FRAMEWORK SNAPSHOT (target of "Explore the Framework") ============ */}
      <section id="dimensions">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span> The Framework</span>
            <h2>Four dimensions, one composite score</h2>
            <p>Your profile is built from four construct dimensions, each mapped to a specific neuroeconomic bias mechanism.</p>
          </div>

          <div className="dimension-grid">
            <div className="card">
              <div className="card-icon">◐</div>
              <h3>Emotional Balance</h3>
              <span className="sanskrit">Upeksha</span>
              <p>Your capacity to stay level when outcomes swing — resisting the pull of loss aversion.</p>
              <span className="tag">vmPFC · loss aversion</span>
            </div>
            <div className="card">
              <div className="card-icon">⚡</div>
              <h3>Pressure Non-Reactivity</h3>
              <span className="sanskrit">Anuvigna</span>
              <p>How you respond in the moment pressure spikes — before the reflex takes over.</p>
              <span className="tag">Amygdala · temporal discounting</span>
            </div>
            <div className="card">
              <div className="card-icon">◇</div>
              <h3>Detached Decision-Making</h3>
              <span className="sanskrit">Anasakti</span>
              <p>Your ability to let go of sunk cost and status quo when the facts have changed.</p>
              <span className="tag">Endowment effect · sunk cost</span>
            </div>
            <div className="card">
              <div className="card-icon">◈</div>
              <h3>Clarity in Complexity</h3>
              <span className="sanskrit">Viveka</span>
              <p>How clearly you can act under ambiguity, without rushing to false certainty.</p>
              <span className="tag">Ambiguity aversion</span>
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
                <a href={`mailto:${TALK_TO_US_EMAIL}`} className="btn btn-primary btn-lg">Talk to Us</a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
