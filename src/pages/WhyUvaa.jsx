import { Link } from 'react-router-dom'

// Editorial flow for Why UVAA, following the same visual language as the
// new Home hero (serif statements, small-caps tracked labels, dark glass
// cards) instead of the generic PageHeader banner other pages still use.
// Content is the same material the page already had (the four real-world
// signals and the "what changes" language are carried over verbatim/near-
// verbatim from the previous version) — restructured into:
//
//   WHY UVAA → big statement → 4 real-world signals →
//   WHAT YOU SEE ↔ WHAT CHANGES → closing statement → Explore the Framework
//
// (The Hidden Gap / calm-pressure spectrum section was dropped — it read
// as repeating the big statement above it.)
export default function WhyUvaa() {
  return (
    <>
      {/* ============ WHY UVAA — big statement ============ */}
      <section className="editorial-hero">
        <div className="container">
          <p className="editorial-label center">Why UVAA</p>
          <h1 className="editorial-statement">
            The judgement gap is usually invisible —<br />
            <span className="accent">until it costs you something.</span>
          </h1>
          <p className="editorial-lead">
            The gap between what someone knows and what they do under pressure stays hidden
            until it costs you something. When it does, it rarely looks like a judgement problem.
          </p>
        </div>
      </section>

      {/* ============ 4 REAL-WORLD SIGNALS ============ */}
      <section>
        <div className="container">
          <p className="editorial-label center">Four Real-World Signals</p>
          <p className="editorial-intro">
            None of these show up in performance data as a judgement problem:
          </p>
          <div className="dimension-grid">
            <div className="card">
              <p>A decision that had to be unwound three months later, made by someone who would have called it correctly in a calmer week.</p>
            </div>
            <div className="card">
              <p>An escalation that reached you because the person closest to it could not hold the conversation.</p>
            </div>
            <div className="card">
              <p>A commitment made in a meeting that nobody in the room believed was deliverable.</p>
            </div>
            <div className="card">
              <p>Someone capable leaving, after a period where their judgement had quietly stopped matching their reputation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT YOU SEE ↔ WHAT CHANGES ============ */}
      <section>
        <div className="container">
          <p className="editorial-label center">What You See &harr; What Changes</p>

          <div className="compare-grid">
            <div className="compare-col">
              <p className="compare-col-label">What You See</p>
              <ul className="compare-list">
                <li>Delivery slippage with no single clear cause</li>
                <li>Attrition among people who looked fine on paper</li>
                <li>A client relationship that quietly cooled</li>
                <li>Escalations that should never have reached you</li>
              </ul>
            </div>

            <div className="compare-divider" aria-hidden="true">&harr;</div>

            <div className="compare-col compare-col-accent">
              <p className="compare-col-label">What Changes</p>
              <ul className="compare-list">
                <li>You know who holds a position when a client pushes</li>
                <li>You know who unwinds their own decision when the evidence turns</li>
                <li>You know who can sit in ambiguity without closing early for comfort</li>
                <li>You know who to put in front of the next high-stakes room</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ONE CLOSING STATEMENT ============ */}
      <section>
        <div className="container">
          <p className="closing-statement">
            The gap was always there. The only question is whether you see it before it costs
            you — or after.
          </p>
        </div>
      </section>

      {/* ============ EXPLORE THE FRAMEWORK ============ */}
      <section style={{ paddingTop: 0 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Link to="/framework" className="hero-wide-cta" style={{ display: 'inline-flex' }}>
            Explore the Framework <b>&rarr;</b>
          </Link>
        </div>
      </section>
    </>
  )
}
