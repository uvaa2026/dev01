import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

// Content sourced verbatim from the deck (slide 8 "The assessment").
// The "optional scenario preview" below is clearly marked illustrative —
// it is not drawn from the real scored item bank, which this session has
// not been given access to.
export default function TheAssessment() {
  return (
    <>
      <PageHeader
        eyebrow="The Assessment"
        title="Real situations. Honest responses. One complete pattern."
        lead="Two parts, one sitting."
      />

      <section>
        <div className="container">
          <div className="evidence-strip">
            <div className="evidence-item">
              <span className="evidence-num">15 items</span>
              <span className="evidence-label">Part one — short situations that establish how the person operates when nothing in particular is demanding their attention.</span>
            </div>
            <div className="evidence-item">
              <span className="evidence-num">32 items</span>
              <span className="evidence-label">Part two — workplace situations, three responses each. None of them is obviously the right one, which is the point.</span>
            </div>
            <div className="evidence-item">
              <span className="evidence-num">Automatic</span>
              <span className="evidence-label">Scoring — four capacity scores, a Decision Quality Index from 0 to 100, and the pattern produced by crossing that against how they operate.</span>
            </div>
            <div className="evidence-item">
              <span className="evidence-num">Minutes</span>
              <span className="evidence-label">Report — generated and emailed as a PDF. Available in the participant's account for ninety days.</span>
            </div>
          </div>

          <p className="overview-copy" style={{ marginTop: 32, textAlign: 'center' }}>
            No result is returned between the two parts, deliberately. Knowing your own
            orientation would change how you answer what follows, and the divergence between the
            two is the thing worth measuring.
          </p>

          <div className="scenario-preview">
            <span className="notice">Illustrative only — not scored, not part of the real item bank</span>
            <h3>Sample situation</h3>
            <p className="overview-copy">
              A client asks for a commitment in the meeting, before you have had time to check
              with the team doing the work. The room is waiting on your answer.
            </p>
            <div className="scenario-options">
              <div>Give the date they are asking for, and work out how to hit it afterwards.</div>
              <div>Tell them you will confirm by end of day, once you have checked with the team.</div>
              <div>Give a date you know is safe, even though it is later than they wanted.</div>
            </div>
            <p style={{ marginTop: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              This preview demonstrates the interaction only. It is not part of the actual
              assessment and none of these responses is scored.
            </p>
          </div>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 40 }}>
            <Link to="/what-you-get" className="btn btn-ghost btn-lg">See What You Get</Link>
            <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
