import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

// Content sourced verbatim from the deck (slide 11 "What UVAA does not
// claim").
export default function WhatUvaaDoesNotClaim() {
  return (
    <>
      <PageHeader
        eyebrow="Honestly"
        title="Clear boundaries make an assessment more useful."
      />

      <section>
        <div className="container">
          <div className="dimension-grid">
            <div className="card">
              <p>This is one sitting of a self-report instrument. Workload, recent events and current circumstances all influence how someone answers.</p>
            </div>
            <div className="card">
              <p>It is not a comprehensive personality profile. It shows which state someone most often works from. It does not attempt to describe a person.</p>
            </div>
            <div className="card">
              <p>Scores are not percentiles. They are percentages of the available range, not comparisons against a normative population. Normative data is being collected through the current pilot cohorts.</p>
            </div>
            <div className="card">
              <p>It measures how decision quality degrades under pressure. It does not measure whether someone's judgement is sound when they are calm, which is a different question and needs a different instrument.</p>
            </div>
          </div>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 40 }}>
            <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
