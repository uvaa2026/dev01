import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'
import { GunaOrientationBar, DqiGauge, CapacityBars, PatternGrid } from '../components/reportCharts.jsx'

// The single, full-page, read-only report — only reachable in any meaningful
// sense once both stages are scored (GET /assessment/report returns
// { ready: false } until then; MyPage only ever links here once `ready` is
// true). Someone who bookmarks or types the URL early just sees a "not
// ready yet" panel, same information either way.
//
// Layout and copy follow UVAA_Report_V4_050926.docx exactly: five fixed
// sections in a fixed order (no tabs, no collapsing, no reordering), the
// "held pattern" rule that truncates the report after section 3 for the
// Reserved-but-steady case, and a horizontal-scroll fallback for the nine
// cell pattern grid on narrow viewports (the spec's stated mobile option,
// chosen over replacing the grid with a text indicator so the grid itself
// — the section's whole point — still renders for everyone).
export default function Report() {
  const [phase, setPhase] = useState('loading') // loading | not-ready | ready | error
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .getReport()
      .then((data) => {
        if (cancelled) return
        if (data.ready) {
          setReport(data)
          setPhase('ready')
        } else {
          setPhase('not-ready')
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Could not load your report. Please try again.')
        setPhase('error')
      })
    return () => { cancelled = true }
  }, [])

  if (phase === 'loading') {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your report…
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="assessment-shell container">
        <div className="result-panel">
          <h1>Something went wrong</h1>
          <p>{error}</p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>
            <Link to="/my-page" className="btn btn-ghost">Back to My Page</Link>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'not-ready') {
    return (
      <div className="assessment-shell container">
        <div className="result-panel">
          <div className="eyebrow"><span className="dot"></span> Not ready yet</div>
          <h1>Your report isn't available yet</h1>
          <p>
            Your report becomes available once both the Guna profiler and the Construct assessment
            are complete and scored. Check back on My Page — a link will appear there the moment
            it's ready.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/my-page" className="btn btn-primary btn-lg">Back to My Page</Link>
          </div>
        </div>
      </div>
    )
  }

  // phase === 'ready'
  const { orientation, dqi, capacities, pattern, developmentFocus, heldPattern } = report

  return (
    <div className="results-shell container uvaa-report">
      <div className="results-header">
        <span className="eyebrow"><span className="dot"></span> Your report</span>
        <h1>Your UVAA report</h1>
        <div className="print-actions">
          <button type="button" className="btn btn-ghost" onClick={() => window.print()}>
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Section 1 — About this assessment. Fixed text, prints on every report. */}
      <section className="report-section" id="section-1">
        <h2 className="report-section-title">1. About this assessment</h2>

        <p>
          UVAA looks at how your judgement behaves when a situation gets difficult, rather than at
          what you know or how you describe yourself.
        </p>
        <p>
          It measures two things. How you operate, which is the state you tend to work from. And
          decision quality under pressure, which is what happens to that judgement when the pressure
          is live. The two do not always agree, and where they diverge is usually the most useful
          thing this report can tell you.
        </p>

        <h3 className="report-subhead">How to read the report</h3>
        <p>
          The report describes patterns, not verdicts. Where something does not match your
          experience, that gap is worth looking at rather than dismissing, in either direction.
        </p>
        <p>
          Scores are percentages of the available range. They are not comparisons against other
          people. A score of 60 means your responses accounted for 60 percent of the available
          quality on that scale, not that you scored higher than 60 percent of respondents.
        </p>

        <h3 className="report-subhead">Confidentiality</h3>
        <p>
          Your individual responses and scores are not visible to anyone in your organisation without
          your explicit consent. Group level patterns may be reported without identifying individuals.
        </p>

        <h3 className="report-subhead">Limitations</h3>
        <p>
          This is one sitting of a self-report instrument. Workload, recent events and current
          circumstances all influence how someone answers. Read it as a starting point rather than a
          settled conclusion.
        </p>
      </section>

      {/* Section 2 — Your Core Orientation. Stacked bar; dominance block; one
          of three margin narratives. */}
      <section className="report-section" id="section-2">
        <h2 className="report-section-title">2. Your Core Orientation</h2>

        <GunaOrientationBar
          sattvaPct={orientation.sattvaPct}
          rajasPct={orientation.rajasPct}
          tamasPct={orientation.tamasPct}
        />

        <p>
          UVAA describes your core orientation using the three gunas from Vedic literature. Every
          person's orientation will be the combination of all three. What varies is the proportion,
          and which one you most often work from.
        </p>
        <p>
          This is a short reading of core orientation, not a full personality profile. Fifteen
          situations show the state you most often work from. They are not enough to describe you
          comprehensively, and this section does not attempt to.
        </p>

        <h3 className="report-subhead">Sattva, described here as composure.</h3>
        <p>
          You process things before you react. Situations can sit unresolved while you think them
          through, without any pull to close them early. The gap between what you feel and what you
          do is wider than it is for most people.
        </p>

        <h3 className="report-subhead">Rajas, described here as drive.</h3>
        <p>
          You move fast. Situations produce energy and you would rather act than wait. Things left
          open are uncomfortable in a way that pushes you toward settling them, and waiting feels
          like a cost in itself.
        </p>

        <h3 className="report-subhead">Tamas, described here as reserve.</h3>
        <p>
          You conserve. Situations register without producing much pull, and you put effort where it
          is needed rather than across the board. Where something does not require you, you are
          unlikely to step in.
        </p>

        {orientation.marginNote && <p className="report-margin-note">{orientation.marginNote}</p>}

        <div className="orientation-dominance-block">
          <h3 className="report-subhead">{orientation.profile.heading}</h3>

          <p className="dominance-block-label">What this looks like</p>
          <p>{orientation.profile.whatThisLooksLike}</p>

          <p className="dominance-block-label">What it supports</p>
          <p>{orientation.profile.whatItSupports}</p>

          <p className="dominance-block-label">Where it costs you</p>
          <p>{orientation.profile.whereItCostsYou}</p>

          <p className="dominance-block-label">How others may see it</p>
          <p>{orientation.profile.howOthersMaySeeIt}</p>
        </div>

        <p>
          What this suggests about your decisions and what the situations actually showed are
          compared in the next two sections. They do not always agree.
        </p>
      </section>

      {/* Section 3 — Decision Quality Under Pressure. Gauge, capacity bars,
          DQI band callout, per-capacity lines. */}
      <section className="report-section" id="section-3">
        <h2 className="report-section-title">3. Decision Quality Under Pressure</h2>

        <p>
          Section 2 described how you operate. This section measures what happened to your judgement
          in thirty two situations built to apply specific kinds of pressure.
        </p>
        <p>
          Four capacities are assessed, each across eight situations. Each corresponds to a pattern
          documented in decision research and in Vedic literature.
        </p>

        <h3 className="report-subhead">Upeksha, Emotional Balance.</h3>
        <p>
          Weighting good news and bad news evenly when both are present. Losses land harder than
          equivalent gains, consistently and across people, which pulls judgement toward whichever
          signal hit heavier.
        </p>

        <h3 className="report-subhead">Anuvigna, Pressure Non-Reactivity.</h3>
        <p>
          Responding to the crux of a challenge rather than to the challenge. Under social threat the
          response is generated faster than deliberate assessment can happen.
        </p>

        <h3 className="report-subhead">Anasakti, Detached Decision-Making.</h3>
        <p>
          Judging your own prior positions and investments as rigorously as you judge anyone else's.
          Owning something inflates what we believe it is worth, which is why reversing your own
          decision is harder than reversing someone else's.
        </p>

        <h3 className="report-subhead">Viveka, Clarity in Complexity.</h3>
        <p>
          Staying in genuine uncertainty long enough to reach a judgement rather than a comfortable
          answer. Under ambiguity people lean toward a known outcome over an unknown one, even where
          the unknown is better.
        </p>

        <div className="dqi-gauge-wrap">
          <DqiGauge pct={dqi.pct} band={dqi.band} />
        </div>

        <div className="dqi-callout">
          <h3 className="report-subhead">{dqi.callout.headline}</h3>
          <p>{dqi.callout.body}</p>
        </div>

        <CapacityBars capacities={capacities} />

        <div className="capacity-lines">
          {capacities.map((c) => (
            <div className="capacity-line-row" key={c.dimension}>
              <p className="capacity-line-name">{c.name}</p>
              <p>{c.line}</p>
            </div>
          ))}
        </div>
      </section>

      {heldPattern ? (
        <section className="report-section held-pattern-note" id="section-held">
          <p>
            Your facilitator will be in touch to go through this result with you directly.
          </p>
        </section>
      ) : (
        <>
          {/* Section 4 — Your UVAA Pattern. Nine cell grid, dominance x pattern band. */}
          <section className="report-section" id="section-4">
            <h2 className="report-section-title">4. Your UVAA Pattern</h2>

            <p>
              Section 2 described how you operate. Section 3 measured what happened to your judgement
              under pressure. This is the relationship between them, which is the finding this
              assessment exists to produce.
            </p>

            <div className="pattern-grid-scroll">
              <PatternGrid dominance={orientation.dominance} patternBand={pattern.patternBand} />
            </div>

            <div className="pattern-text-block">
              <h3 className="report-subhead">{pattern.label}</h3>
              <p>{pattern.description}</p>

              <p className="dominance-block-label">What holds</p>
              <p>{pattern.whatHolds}</p>

              <p className="dominance-block-label">Development focus</p>
              <p>{pattern.developmentFocus}</p>
            </div>
          </section>

          {/* Section 5 — Development Focus. Capacities below 67, ascending. */}
          <section className="report-section" id="section-5">
            <h2 className="report-section-title">5. Development Focus</h2>

            <p className="report-italic">Knowing is well begun. Doing is well done.</p>
            <p>
              UVAA provides a development plan for every profile, whether that is maintenance or
              development, working across three layers: how you frame a situation, what you do in the
              moment, and sustained practice.
            </p>
            <p>The areas below are where that plan will focus.</p>

            <h3 className="report-subhead">{developmentFocus.headline}</h3>

            {developmentFocus.items.length > 0 && (
              <ol className="development-focus-list">
                {developmentFocus.items.map((item) => (
                  <li key={item.dimension}>
                    {item.name} {Math.round(item.pct)}%
                    {item.startHere && <span className="start-here-tag">start here</span>}
                  </li>
                ))}
              </ol>
            )}

            <p>{developmentFocus.body}</p>

            <p className="report-plan-footer">
              Your development plan sets out which layer carries the work for your pattern, and the
              practice that addresses each area.
            </p>
          </section>
        </>
      )}

      <div className="results-actions">
        <Link to="/my-page" className="btn btn-primary btn-lg">Back to My Page</Link>
      </div>
    </div>
  )
}
