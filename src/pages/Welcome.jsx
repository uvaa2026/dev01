import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import useScrollToHash from '../lib/useScrollToHash.js'
import heroImage from '../assets/home-hero.jpg'

// Home is now the single long page: hero, then Assessment, Discover (why
// UVAA) and Framework — the content that used to live on /the-assessment,
// /why-uvaa and /framework respectively, each still reachable as an anchor
// section from the header's nav (Discover/Framework/Experience) — plus a
// Journey overview and a closing CTA. useScrollToHash() makes those links,
// and the old page routes (which now redirect here with a hash), land on
// the right section whether or not Home was already open.
//
// Everything below the hero is wrapped in an opaque .home-body so the
// site-wide #main background (the fixed wave/mountain photo used on the
// other marketing pages) doesn't show through here — Home keeps its own
// flat dark backdrop under the hero photo.
export default function Welcome() {
  useScrollToHash()
  const { isAuthenticated, user } = useAuth()
  const destination = user?.isAdmin ? '/admin/users' : '/my-page'
  const destinationLabel = user?.isAdmin ? 'Go to Admin' : 'Go to My Page'

  return (
    <>
      {/* ============ HERO — full-bleed photo, narrow copy column, a
          small note floating at the right, a numbered row along the
          bottom. ============ */}
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
              <Link to={destination} className="hero-wide-cta">{destinationLabel} <b>&rarr;</b></Link>
            ) : (
              <Link to="/talk-to-us" className="hero-wide-cta">Talk to Us <b>&rarr;</b></Link>
            )}
          </div>

          <aside className="hero-wide-note" aria-hidden="true">
            <p className="hero-wide-note-head">Pressure doesn't<br />create the response.<br />It reveals it.</p>
            <div className="hero-wide-note-rule"></div>
            <p className="hero-wide-note-list">Clarity<br />Composure<br />Confidence</p>
          </aside>
        </div>
      </section>

      {/* ============ Everything below the hero sits on its own opaque
          dark backdrop so the fixed wave/mountain page background doesn't
          show through on Home. ============ */}
      <div className="home-body">
      {/* ============ ASSESSMENT (was /the-assessment) ============ */}
      <section id="assessment" className="editorial-hero">
        <div className="container">
          <p className="editorial-label center">The Assessment</p>
          <h2 className="editorial-statement">Real situations. Honest responses. One complete pattern.</h2>
          <p className="editorial-lead">Two parts, one sitting.</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="stat-circle-row">
            <div className="stat-circle">
              <div className="stat-circle-badge">47</div>
              <h3>situations, scenario driven choices</h3>
              <p>Fifteen establish core orientation. Thirty-two measure decision quality across
                four capacities. One sitting, around 45 minutes.</p>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge">0</div>
              <h3>self-rating scales</h3>
              <p>Every item presents a situation and three courses of action. No agree-disagree,
                no sliders.</p>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge">9</div>
              <h3>patterns, not types</h3>
              <p>Orientation crossed with decision quality. A person is not placed in a box.</p>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge stat-circle-badge-word">Minutes</div>
              <p style={{ marginTop: 10 }}>Report &mdash; generated and emailed as a PDF. Available in the participant's account for ninety days.</p>
            </div>
          </div>

          <p className="overview-copy" style={{ marginTop: 20, textAlign: 'center' }}>
            No result is returned between the two parts, deliberately. Knowing your own
            orientation would change how you answer what follows, and the divergence between the
            two is the thing worth measuring.
          </p>

          <div className="scenario-preview">
            <span className="notice">Illustrative only &mdash; not scored, not part of the real item bank</span>
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
        </div>
      </section>

      {/* ============ DISCOVER / WHY UVAA (was /why-uvaa) ============ */}
      <section id="discover" className="editorial-hero">
        <div className="container">
          <p className="editorial-label center">Why UVAA</p>
          <h2 className="editorial-statement">
            The judgement gap is usually invisible &mdash;<br />
            <span className="accent">until it costs you something.</span>
          </h2>
          <p className="editorial-lead">
            The gap between what someone knows and what they do under pressure stays hidden
            until it costs you something. When it does, it rarely looks like a judgement problem.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
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

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="closing-statement">
            The gap was always there. The only question is whether you see it before it costs
            you &mdash; or after.
          </p>
        </div>
      </section>

      {/* ============ FRAMEWORK (was /framework) ============ */}
      <section id="framework" className="editorial-hero">
        <div className="container">
          <p className="editorial-label center">The Framework</p>
          <h2 className="editorial-statement">A framework built for the moments that test you.</h2>
          <p className="editorial-lead">
            Grounded in Vedic philosophy and validated against neuro-economics research. UVAA
            looks at how your judgement behaves when a situation gets difficult, rather than at
            what you know or how you describe yourself.
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2>How you operate</h2>
            <p>
              How a person operates is described through their core orientation, which is
              supported using their gunas from Vedic philosophy. Everyone shows all three &mdash;
              what varies is the dominance.
            </p>
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

      <section>
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
              <div className="card-icon">&#9680;</div>
              <h3>Emotional Balance</h3>
              <span className="sanskrit">Upeksha</span>
              <p>Weighting good news and bad news evenly when both arrive together.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9889;</div>
              <h3>Pressure Non-Reactivity</h3>
              <span className="sanskrit">Anuvigna</span>
              <p>Responding to the crux of a challenge rather than to the challenge.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9671;</div>
              <h3>Detached Decision-Making</h3>
              <span className="sanskrit">Anasakti</span>
              <p>Judging your own prior positions as rigorously as you judge anyone else's.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9672;</div>
              <h3>Clarity in Complexity</h3>
              <span className="sanskrit">Viveka</span>
              <p>Staying in uncertainty long enough to reach a judgement rather than a comfortable answer.</p>
            </div>
          </div>

          <p className="overview-copy" style={{ marginTop: 36, fontStyle: 'italic', textAlign: 'center' }}>
            The two are measured independently, and they do not always agree. Where they diverge
            is the finding.
          </p>
        </div>
      </section>

      {/* ---- Outcome: UVAA Patterns — headings only, values blurred ---- */}
      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <h2>Outcome: UVAA Patterns</h2>
            <p>Core orientation crossed with decision quality. It says something neither number says alone.</p>
          </div>

          <div className="patterns-matrix-wrap">
            <table className="patterns-matrix">
              <thead>
                <tr>
                  <th></th>
                  <th>At risk</th>
                  <th>Developing</th>
                  <th>Anchored</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Sattva<span className="sanskrit">Composure</span></th>
                  <td className="patterns-matrix-value"><span>Composed but unanchored</span></td>
                  <td className="patterns-matrix-value"><span>Composed, decides unevenly</span></td>
                  <td className="patterns-matrix-value"><span>Composed and steady</span></td>
                </tr>
                <tr>
                  <th>Rajas<span className="sanskrit">Drive</span></th>
                  <td className="patterns-matrix-value"><span>Activated and reactive</span></td>
                  <td className="patterns-matrix-value"><span>Fast, skips the check</span></td>
                  <td className="patterns-matrix-value"><span>Driven by effort</span></td>
                </tr>
                <tr>
                  <th>Tamas<span className="sanskrit">Reserve</span></th>
                  <td className="patterns-matrix-value"><span>Reserved and withdrawn</span></td>
                  <td className="patterns-matrix-value"><span>Reserved, decides late</span></td>
                  <td className="patterns-matrix-value"><span>Reserved but steady</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="overview-copy" style={{ marginTop: 20, textAlign: 'center', maxWidth: '56ch', marginLeft: 'auto', marginRight: 'auto' }}>
            Nine patterns, not nine types. What each one means is covered in full once an
            assessment is run.
          </p>
        </div>
      </section>

      {/* ============ JOURNEY ============ */}
      <section>
        <div className="container">
          <div className="section-head">
            <h2>The Journey</h2>
          </div>

          <div className="journey">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Assess</h4>
              <p>47 situations, one sitting, around 45 minutes.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Report</h4>
              <p>Individual reports to each person, cohort report to the organisation.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Plan</h4>
              <p>The development plan, targeted by pattern across the three layers.</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Coach</h4>
              <p>Individual or group work on the identified capacities.</p>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <h4>Reassess</h4>
              <p>The same instrument at a defined interval. Movement, measured.</p>
            </div>
          </div>

          <div className="journey-note">
            <h4>What UVAA does differently</h4>
            <p>
              Most assessments stop at telling you where you are. Some go on to what to do. Very
              few stay until the needle moves. UVAA does.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CLOSING CTA ============ */}
      <section style={{ paddingTop: 0 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          {isAuthenticated ? (
            <Link to={destination} className="hero-wide-cta" style={{ display: 'inline-flex' }}>{destinationLabel} <b>&rarr;</b></Link>
          ) : (
            <Link to="/talk-to-us" className="hero-wide-cta" style={{ display: 'inline-flex' }}>Talk to Us <b>&rarr;</b></Link>
          )}
        </div>
      </section>
      </div>
    </>
  )
}
