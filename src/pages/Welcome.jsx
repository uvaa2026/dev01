import { Link } from 'react-router-dom'
import useScrollToHash from '../lib/useScrollToHash.js'
import { useAuth } from '../context/AuthContext.jsx'

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
              UVAA (Under-pressure Value-Anchored Adaptive Intelligence) is a Vedic-neuroeconomic
              psychometric framework that measures your emotional decision-stability under pressure —
              and gives you a personalised, three-tier plan to strengthen it.
            </p>
            {isAuthenticated ? (
              <div className="hero-actions">
                <Link to={destination} className="btn btn-primary btn-lg">{destinationLabel}</Link>
              </div>
            ) : (
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">Create your account</Link>
                <Link to="/login" className="btn btn-ghost btn-lg">I already have an account</Link>
              </div>
            )}
            <div className="trust-bar">
              <span>DPDP Act 2023 compliant</span>
              <span>Privacy by design</span>
              <span>~50 minutes to complete</span>
            </div>
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

      {/* ============ ABOUT / OVERVIEW ============ */}
      <section id="about">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span> Overview</span>
            <h2>A framework built for the moments that test you</h2>
            <p>Grounded in Vedic philosophy and validated against neuroeconomic bias research.</p>
          </div>
          <div className="overview">
            <p className="overview-copy">
              UVAA looks at how your judgement behaves when a situation gets difficult, rather than at
              what you know or how you describe yourself.
            </p>
            <p className="overview-copy">
              It measures two things. How you operate, which is the state you tend to work from. And
              decision quality under pressure, which is what happens to that judgement when the
              pressure is live.
            </p>
            <p className="overview-copy">
              The two do not always agree. Where they diverge is usually the most useful thing the
              assessment can tell you.
            </p>
            <p className="overview-copy">
              The framework draws on the three gunas from Vedic literature alongside research in
              behavioural economics on how judgement distorts under pressure.
            </p>
          </div>
        </div>
      </section>

      {/* ============ DIMENSIONS ============ */}
      <section id="dimensions">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span> The Framework</span>
            <h2>Four dimensions, one composite score</h2>
            <p>Your EDSI (Emotional Stability Under Pressure Score) is built from four construct dimensions, each mapped to a specific neuroeconomic bias mechanism.</p>
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

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span> Your journey</span>
            <h2>From registration to your practice plan</h2>
            <p>Two parts, one sitting, 35 to 45 minutes.</p>
            <p>Part one asks how you tend to respond in everyday situations.<br />Part two puts you in work situations and asks what you would do.</p>
          </div>

          <div className="journey">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Register</h4>
              <p>Tell us your professional context, career stage, and experience.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Guna profiler</h4>
              <p>15 short vignettes that establish your baseline disposition.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Construct assessment</h4>
              <p>32 realistic, role-specific scenarios across four dimensions.</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Your score</h4>
              <p>EDSI and NKOI scores with a clear dimension-by-dimension profile.</p>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <h4>Practice plan</h4>
              <p>A personalised, three-tier plan delivered to your inbox as a PDF.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOR ORGANISATIONS ============ */}
      {!isAuthenticated && (
      <section id="organisations">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span> For organisations</span>
            <h2>Cohort insight without compromising privacy</h2>
            <p>HR administrators and facilitators see the patterns. Individuals keep their own score.</p>
          </div>

          <div className="trust-panel">
            <ul>
              <li>Aggregate EDSI distribution and dimension-level insight across your cohort.</li>
              <li>Individual respondent scores stay private unless explicit consent is given.</li>
              <li>Cohort completion tracking, deadlines, and CSV export for your HR systems.</li>
              <li>Data residency in India · DPDP Act 2023 compliant · AES-256 encryption at rest.</li>
            </ul>
            
              <div>
                <Link to="/register" className="btn btn-primary">Set up your organisation</Link>
              </div>
            
          </div>
        </div>
      </section>
              )}
      {/* ============ CTA ============ */}
      {!isAuthenticated && (
        <section>
          <div className="container">
            <div className="cta-band">
              <h2>Ready to see your profile?</h2>
              <p>Registration takes about two minutes. The full assessment takes about fifty.</p>
              <div className="hero-actions">
                <Link to="/register" className="btn btn-primary btn-lg">Create your account</Link>
                <Link to="/login" className="btn btn-ghost btn-lg">Log in</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
