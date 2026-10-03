import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import useScrollToHash from '../lib/useScrollToHash.js'

// Content sourced verbatim from the deck (slide 4 "The Framework").
export default function Framework() {
  useScrollToHash()
  return (
    <>
      <PageHeader
        eyebrow="The Framework"
        title="A framework built for the moments that test you."
        lead="Grounded in Vedic philosophy and validated against neuro-economics research. UVAA looks at how your judgement behaves when a situation gets difficult, rather than at what you know or how you describe yourself."
      />

      <section>
        <div className="container">
          <div className="section-head">
            <h2>How you operate</h2>
            <p>How a person operates is described using the three gunas. Everyone shows all three. What varies is the proportion.</p>
          </div>

          <div className="guna-grid">
            <div className="card">
              <h3>Sattva</h3>
              <span className="sanskrit">Composure</span>
            </div>
            <div className="card">
              <h3>Rajas</h3>
              <span className="sanskrit">Drive</span>
            </div>
            <div className="card">
              <h3>Tamas</h3>
              <span className="sanskrit">Reserve</span>
            </div>
          </div>
        </div>
      </section>

      <section id="dimensions">
        <div className="container">
          <div className="section-head">
            <h2>Decision quality under pressure</h2>
            <p>
              Measured separately, across four capacities. Each one corresponds to a way
              judgement has been shown to bend under pressure, reliably enough to be predicted.
            </p>
          </div>

          <div className="dimension-grid">
            <div className="card">
              <div className="card-icon">◐</div>
              <h3>Emotional Balance</h3>
              <span className="sanskrit">Upeksha</span>
              <p>Weighting good news and bad news evenly when both arrive together.</p>
            </div>
            <div className="card">
              <div className="card-icon">⚡</div>
              <h3>Pressure Non-Reactivity</h3>
              <span className="sanskrit">Anuvigna</span>
              <p>Responding to the crux of a challenge rather than to the challenge.</p>
            </div>
            <div className="card">
              <div className="card-icon">◇</div>
              <h3>Detached Decision-Making</h3>
              <span className="sanskrit">Anasakti</span>
              <p>Judging your own prior positions as rigorously as you judge anyone else's.</p>
            </div>
            <div className="card">
              <div className="card-icon">◈</div>
              <h3>Clarity in Complexity</h3>
              <span className="sanskrit">Viveka</span>
              <p>Staying in uncertainty long enough to reach a judgement rather than a comfortable answer.</p>
            </div>
          </div>

          <p className="overview-copy" style={{ marginTop: 36, fontStyle: 'italic', textAlign: 'center' }}>
            The two are measured independently, and they do not always agree. Where they diverge
            is the finding.
          </p>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 32 }}>
            <Link to="/the-assessment" className="btn btn-ghost btn-lg">See the Assessment</Link>
            <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
