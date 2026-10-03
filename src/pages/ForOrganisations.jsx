import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

// Content sourced verbatim from the deck (slide 9 "How it runs"), plus the
// audience-grouping list change.txt supplies with its own caveat that these
// are suggested groupings to be kept only if they match UVAA's actual
// commercial positioning — shown here with that caveat intact, not as a
// settled claim.
export default function ForOrganisations() {
  return (
    <>
      <PageHeader
        eyebrow="For Organisations"
        title="Start with one cohort. Build only where the evidence supports it."
        lead="One cohort at a time. Twelve to twenty people is the usual starting size, typically a leadership team or a delivery function."
      />

      <section>
        <div className="container">
          <div className="journey">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Cohort set up</h4>
              <p>You give us the group. Everyone gets a link. Nothing is required of you while it runs.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Individual reports</h4>
              <p>Each person receives their own, directly, whether or not they agreed to share their scores with you.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Cohort report</h4>
              <p>What you receive, and the document the engagement is built around.</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Debrief</h4>
              <p>We walk your leadership team through what it found and what it implies. This is where most of the value lands, and it is included.</p>
            </div>
          </div>

          <p className="overview-copy" style={{ marginTop: 32, textAlign: 'center' }}>
            That is the engagement. What follows is optional, and the cohort report is what tells
            you whether it is worth it.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="triple-grid">
            <div className="card">
              <h3>Development plans</h3>
              <p>Per person, matched to their pattern. What each capacity needs and the practice that addresses it.</p>
            </div>
            <div className="card">
              <h3>Coaching</h3>
              <p>Individual or group, working on the areas the assessment identified and the situations where they actually show up.</p>
            </div>
            <div className="card">
              <h3>Progress reviews</h3>
              <p>Reassessment at a defined interval, so movement is measured rather than assumed.</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="section-head">
            <h2>Who this tends to suit</h2>
            <p>Suggested groupings — kept here only as a starting point, to confirm against your own commercial positioning.</p>
          </div>
          <div className="pill-row">
            <span className="pill">Leadership cohorts</span>
            <span className="pill">Client-facing teams</span>
            <span className="pill">High-pressure operational roles</span>
            <span className="pill">Development programmes</span>
            <span className="pill">Organisational research cohorts</span>
          </div>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 40 }}>
            <Link to="/privacy-data" className="btn btn-ghost btn-lg">Privacy &amp; Data</Link>
            <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
