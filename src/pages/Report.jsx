import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DIMENSION_LABELS } from '../data/constructScenarios.js'
import { api, ApiError } from '../lib/api.js'

const DIMENSION_ORDER = ['UPEKSHA', 'ANUVIGNA', 'ANASAKTI', 'VIVEKA']
const DIMENSION_COLOR = {
  UPEKSHA: 'var(--accent-cyan)',
  ANUVIGNA: 'var(--accent-magenta)',
  ANASAKTI: 'var(--accent-violet)',
  VIVEKA: 'var(--accent-amber)',
}

const DQI_BAND_LABEL = {
  ANCHORED: 'Anchored',
  DEVELOPING: 'Developing',
  AT_RISK: 'At risk',
}

// The single, full-page, read-only combined report — only reachable in any
// meaningful sense once both stages are scored (GET /assessment/report
// returns { ready: false } until then; MyPage only ever links here once
// `ready` is true). Someone who bookmarks or types the URL early just sees
// a "not ready yet" panel, same information either way.
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
  const { dqi, dimensions, pattern, needsFacilitatorReview } = report

  return (
    <div className="results-shell container">
      <div className="results-header">
        <span className="eyebrow"><span className="dot"></span> Your report</span>
        <h1>Your UVAA report</h1>
        <p>This is a read-only summary of how your responses scored across both parts of the assessment.</p>
      </div>

      <div className="score-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="score-card">
          <div className="label">DQI — Decision Quality Index</div>
          <div className="value">{Math.round(dqi.pct)}%</div>
          <span className="band">{DQI_BAND_LABEL[dqi.band] || dqi.band}</span>
        </div>
      </div>

      <div className="dimension-scores">
        <h2>Dimension breakdown</h2>
        {DIMENSION_ORDER.map((dim) => {
          const d = dimensions[dim]
          if (!d) return null
          return (
            <div className="dim-row" key={dim}>
              <div className="dim-row-label">
                <span className="name">{DIMENSION_LABELS[dim]?.name ?? dim}</span>
                <span className="pct">{Math.round(d.pct)}%</span>
              </div>
              <div className="dim-row-track">
                <div
                  className="dim-row-fill"
                  style={{ width: `${Math.max(0, Math.min(100, d.pct))}%`, background: DIMENSION_COLOR[dim] }}
                />
              </div>
              {d.deficient && <span className="dim-row-flag">Below 67% — an area worth attention</span>}
            </div>
          )
        })}
      </div>

      {!pattern.provisional && pattern.label && (
        <div className="priority-panel">
          <div className="label">Your UVAA pattern</div>
          <h3>{pattern.label}</h3>
          <p>{pattern.meaning}</p>
        </div>
      )}

      {pattern.provisional && (
        <div className="priority-panel">
          <div className="label">Your UVAA pattern</div>
          <h3>Not available this time</h3>
          <p>
            Your Guna profiler responses didn't establish a single clear tendency, so a pattern label
            isn't shown for this report. Your DQI and dimension scores above are unaffected.
          </p>
        </div>
      )}

      {needsFacilitatorReview && (
        <div className="status-msg success" style={{ display: 'block' }}>
          A facilitator will follow up with you directly to walk through this result.
        </div>
      )}

      <div className="results-actions">
        <Link to="/my-page" className="btn btn-primary btn-lg">Back to My Page</Link>
      </div>
    </div>
  )
}
