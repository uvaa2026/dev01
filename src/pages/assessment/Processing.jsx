import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../../context/AssessmentContext.jsx'
import { CONSTRUCT_SCENARIOS, DIMENSION_LABELS } from '../../data/scenarios.js'
import { computeConstructResults } from '../../lib/scoring.js'

const STEPS = [
  'Scoring your responses',
  'Computing your EDSI and NKOI',
  'Identifying your priority focus area',
  'Preparing your summary',
]

const DIMENSION_COLOR = {
  UPEKSHA: 'var(--accent-cyan)',
  ANUVIGNA: 'var(--accent-magenta)',
  ANASAKTI: 'var(--accent-violet)',
  VIVEKA: 'var(--accent-amber)',
}

export default function Processing() {
  const navigate = useNavigate()
  const { gunaResult, constructAnswers, resetAssessment } = useAssessment()
  const [doneCount, setDoneCount] = useState(0)
  const [phase, setPhase] = useState('processing')

  const allAnswered = Object.keys(constructAnswers).length === CONSTRUCT_SCENARIOS.length

  useEffect(() => {
    if (!gunaResult || !allAnswered) {
      navigate(gunaResult ? '/assessment/construct' : '/assessment/guna', { replace: true })
    }
  }, [gunaResult, allAnswered, navigate])

  useEffect(() => {
    if (!gunaResult || !allAnswered) return undefined
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setDoneCount(i + 1), 450 + i * 420),
    )
    const finalTimer = setTimeout(() => setPhase('results'), 450 + STEPS.length * 420 + 350)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finalTimer)
    }
  }, [gunaResult, allAnswered])

  const results = useMemo(() => {
    if (phase !== 'results') return null
    return computeConstructResults(constructAnswers, CONSTRUCT_SCENARIOS)
  }, [phase, constructAnswers])

  if (!gunaResult || !allAnswered) return null

  if (phase === 'processing') {
    return (
      <div className="processing-shell container">
        <div className="processing-panel">
          <div className="spinner" aria-hidden="true"></div>
          <h1>Processing your results…</h1>
          <p>This takes a few seconds — computing your Emotional Stability Under Pressure profile.</p>
          <ul className="processing-steps">
            {STEPS.map((step, i) => (
              <li key={step} className={i < doneCount ? 'done' : ''}>
                <span className="check">{i < doneCount ? '✓' : ''}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  const { dimensions, edsi, nkoi, priorityDimension } = results

  return (
    <div className="results-shell container">
      <div className="sample-data-note">
        Scored against the sample scenario set shipped with this skeleton — swap in the validated 64-scenario bank to make this a real assessment result.
      </div>

      <div className="results-header">
        <span className="eyebrow"><span className="dot"></span> Your results</span>
        <h1>Your Emotional Stability Under Pressure profile</h1>
        <p>Here’s how your responses broke down across the four dimensions.</p>
      </div>

      <div className="score-grid">
        <div className="score-card">
          <div className="label">EDSI — Emotional Stability Under Pressure</div>
          <div className="value">{Math.round(edsi.pct)}%</div>
          <span className="band">{edsi.band}</span>
        </div>
        <div className="score-card">
          <div className="label">NKOI — Nishkama Karma Outcome Index</div>
          <div className="value">{Math.round(nkoi.pct)}%</div>
          <span className="band">{nkoi.band}</span>
        </div>
      </div>

      <div className="dimension-scores">
        <h2>Dimension breakdown</h2>
        {Object.entries(dimensions).map(([dim, d]) => (
          <div className="dim-row" key={dim}>
            <div className="dim-row-label">
              <span className="name">{DIMENSION_LABELS[dim]?.name ?? dim}</span>
              <span className="pct">{Math.round(d.pct)}%</span>
            </div>
            <div className="dim-row-track">
              <div
                className="dim-row-fill"
                style={{ width: `${d.pct}%`, background: DIMENSION_COLOR[dim] }}
              />
            </div>
            {d.deficient && <span className="dim-row-flag">Below 67% — flagged for priority intervention</span>}
          </div>
        ))}
      </div>

      {priorityDimension && (
        <div className="priority-panel">
          <div className="label">Priority focus area</div>
          <h3>{DIMENSION_LABELS[priorityDimension]?.name}</h3>
          <p>
            This was your lowest-scoring dimension. A full build would generate a three-tier
            intervention plan here — one cognitive tool, one behavioural protocol, and one Vedic
            practice, each contextualised to your professional vertical.
          </p>
        </div>
      )}

      <div className="results-actions">
        <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
          Return home
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-lg"
          onClick={() => {
            resetAssessment()
            navigate('/assessment/guna')
          }}
        >
          Retake the assessment
        </button>
      </div>
    </div>
  )
}
