import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

// Content sourced verbatim from the supplied deck (home_screen.pptx, slide 5
// "Why UVAA"). The page header itself ("The judgement gap is usually visible
// only after it costs something.") is change.txt's instruction; the deck's
// own line below it is kept as the lead-in.
export default function WhyUvaa() {
  return (
    <>
      <PageHeader
        eyebrow="Why UVAA"
        title="The judgement gap is usually visible only after it costs something."
        lead="You have already paid for this, without knowing what it was. The gap between what someone knows and what they do under pressure stays invisible until it costs you something. When it does, it rarely looks like a judgement problem."
      />

      <section>
        <div className="container">
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

          <div className="overview" style={{ marginTop: 48 }}>
            <p className="overview-copy">
              None of these show up in performance data as a decision problem. They show up as
              delivery slippage, attrition, or a client relationship that cooled.
            </p>
            <p className="overview-copy">
              Instruments that ask people to describe themselves cannot find this, because the
              person describing themselves is in the calm moment. UVAA is built to find it.
            </p>
            <p className="overview-copy">
              It has also become the capability worth measuring. Nobody is now worried about
              whether their people can produce analysis. They are worried about whether someone
              will hold a position when a client pushes, unwind their own decision when the
              evidence turns, or sit in ambiguity without closing early.
            </p>
          </div>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 40 }}>
            <Link to="/framework" className="btn btn-ghost btn-lg">See the Framework</Link>
            <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
