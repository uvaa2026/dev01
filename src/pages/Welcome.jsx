import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import heroImage from '../assets/hero-profile.jpg'

export default function Welcome() {
  const { isAuthenticated, user } = useAuth()
  const destination = user?.isAdmin ? '/admin/users' : '/my-page'
  const destinationLabel = user?.isAdmin ? 'Go to Admin' : 'Go to My Page'

  return (
    <>
      {/* ============ HERO — full-bleed photo, narrow copy column, a
          small note floating at the right, a numbered row along the
          bottom. Structure follows the agreed reference layout. ============ */}
      <section className="hero-wide" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-wide-art" aria-hidden="true"></div>
        <div className="hero-wide-shade" aria-hidden="true"></div>

        <div className="container-wide hero-wide-stage">
          <div className="hero-wide-copy">
            <p className="hero-wide-kicker">Judgement doesn't fail suddenly.<br />It drifts under pressure.</p>
            <h1 className="hero-wide-title">
              Know how you decide,<br /><span className="accent">when it matters most.</span>
            </h1>
            <p className="hero-wide-desc">
              Most assessments measure what people say they would do. UVAA examines what happens
              to judgement when a situation becomes difficult.
            </p>
            {isAuthenticated ? (
              <Link to={destination} className="hero-wide-cta">{destinationLabel} <b>→</b></Link>
            ) : (
              <Link to="/talk-to-us" className="hero-wide-cta">Talk to Us <b>→</b></Link>
            )}
          </div>

          <aside className="hero-wide-note" aria-hidden="true">
            <p className="hero-wide-note-head">Pressure doesn't<br />create the response.<br />It reveals it.</p>
            <div className="hero-wide-note-rule"></div>
            <p className="hero-wide-note-list">Clarity<br />Composure<br />Confidence</p>
          </aside>
        </div>

        <div className="container-wide hero-wide-steps">
          <div className="hero-step">
            <span className="hero-step-no">01</span>
            <p>47 situations<br />Not self-description</p>
            <span className="hero-step-tick"></span>
          </div>
          <div className="hero-step">
            <span className="hero-step-no">02</span>
            <p>50 minutes<br />Two parts, one sitting</p>
            <span className="hero-step-tick"></span>
          </div>
          <div className="hero-step">
            <span className="hero-step-no">03</span>
            <p>1 profile<br />A score, not a type</p>
            <span className="hero-step-tick"></span>
          </div>
          <div className="hero-step">
            <span className="hero-step-no">04</span>
            <p>Ordered<br />Priorities, not a list</p>
            <span className="hero-step-tick"></span>
          </div>
          <div className="hero-wide-sig">
            {isAuthenticated ? (
              <>A sharper<br />view of<br />judgement</>
            ) : (
              <>Worth a conversation<br />before it's worth<br />a cohort</>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
