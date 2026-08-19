import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAssessment } from '../../context/AssessmentContext.jsx'
import { CONSTRUCT_SCENARIOS } from '../../data/scenarios.js'

export default function ConstructAssessment() {
  const navigate = useNavigate()
  const { gunaResult, constructAnswers, answerConstruct } = useAssessment()
  const [index, setIndex] = useState(0)

  // Stage 2 shouldn't be reachable before Stage 1 is complete.
  useEffect(() => {
    if (!gunaResult) navigate('/assessment/guna', { replace: true })
  }, [gunaResult, navigate])

  const scenario = CONSTRUCT_SCENARIOS[index]
  const selected = scenario ? constructAnswers[scenario.id] : undefined
  const isLast = index === CONSTRUCT_SCENARIOS.length - 1
  const answeredCount = Object.keys(constructAnswers).length
  const progressPct = Math.round((answeredCount / CONSTRUCT_SCENARIOS.length) * 100)

  if (!gunaResult || !scenario) return null

  function handleSelect(optionKey) {
    answerConstruct(scenario.id, optionKey)
  }

  function handleBack() {
    if (index === 0) {
      navigate('/assessment/guna')
      return
    }
    setIndex((i) => i - 1)
  }

  function handleNext() {
    if (!selected) return
    if (isLast) {
      navigate('/assessment/processing')
      return
    }
    setIndex((i) => i + 1)
  }

  return (
    <div className="assessment-shell container">
      <div className="assessment-topbar">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        {/* Ordinal position only — no dimension name shown, per FR-15 */}
        <span className="progress-label">Situation {index + 1} of {CONSTRUCT_SCENARIOS.length}</span>
      </div>

      <div className="quiz-card">
        <div className="quiz-kicker">Construct assessment</div>
        <h1 className="quiz-question">{scenario.situation}</h1>

        <div className="option-list" role="radiogroup" aria-label={scenario.situation}>
          {scenario.options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={selected === opt.key}
              className={`option${selected === opt.key ? ' selected' : ''}`}
              onClick={() => handleSelect(opt.key)}
            >
              <span className="option-badge">{opt.key}</span>
              <span className="option-text">{opt.text}</span>
            </button>
          ))}
        </div>

        <div className="quiz-nav">
          <button type="button" className="btn btn-ghost" onClick={handleBack}>Back</button>
          <button type="button" className="btn btn-primary" onClick={handleNext} disabled={!selected}>
            {isLast ? 'Finish assessment' : 'Next'}
          </button>
        </div>
        <p className="quiz-hint">Answer with what you’d actually do — there are no right or wrong answers.</p>
      </div>
    </div>
  )
}
