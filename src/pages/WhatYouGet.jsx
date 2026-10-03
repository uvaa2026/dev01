import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

// Content sourced verbatim from the deck (slides 6 "Sample result" and
// 7 "What you get").
export default function WhatYouGet() {
  return (
    <>
      <PageHeader
        eyebrow="What You Get"
        title="Two perspectives. Different decisions. One shared evidence base."
        lead="Two documents, and they are for different people."
      />

      <section>
        <div className="container">
          <div className="vertical-grid">
            <div className="vertical-card">
              <h3>Individual report — each participant</h3>
              <p>
                How they operate, how their judgement held across the four capacities, the
                pattern that combination produces, and which capacity to address first. Delivered
                directly to them within minutes.
              </p>
            </div>
            <div className="vertical-card">
              <h3>Cohort report — you</h3>
              <p>
                Where the group is fragile, which capacities are weakest across the team, and how
                the patterns distribute across the people you depend on. Individual scores are
                not in it unless the person agreed.
              </p>
            </div>
          </div>

          <p className="overview-copy" style={{ marginTop: 32, textAlign: 'center' }}>
            Most assessments return a type and leave you holding it. UVAA returns a score, a
            pattern, and an ordered list of what to work on, in which order, and why that order
            rather than another.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span> Sample result</span>
            <h2>One profile from a technology services cohort</h2>
            <p>Settled by disposition, and the decisions did not hold when the pressure was live.</p>
          </div>

          <div className="result-card">
            <div className="capacity-bar-row">
              <div className="capacity-bar-label">
                <span className="name">How they operate</span>
                <span className="pct">73</span>
              </div>
              <div className="capacity-bar-track">
                <div className="capacity-bar-fill" style={{ width: '73%' }}></div>
              </div>
            </div>
            <div className="capacity-bar-row">
              <div className="capacity-bar-label">
                <span className="name">Under pressure</span>
                <span className="pct">33</span>
              </div>
              <div className="capacity-bar-track">
                <div className="capacity-bar-fill" style={{ width: '33%', background: 'var(--accent-violet)' }}></div>
              </div>
            </div>
          </div>

          <p className="overview-copy" style={{ marginTop: 28, textAlign: 'center', maxWidth: '62ch', marginLeft: 'auto', marginRight: 'auto' }}>
            This person reads as composed to everyone around them. Nothing in how they come
            across signals the gap. Which is precisely why nobody had spotted it.
          </p>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 40 }}>
            <Link to="/for-organisations" className="btn btn-ghost btn-lg">See How It Runs</Link>
            <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
