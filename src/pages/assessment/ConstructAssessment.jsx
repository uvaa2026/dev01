import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAssessment } from '../../context/AssessmentContext.jsx'
import { CONSTRUCT_SCENARIOS } from '../../data/constructScenarios.js'
import { api, ApiError } from '../../lib/api.js'

const AUTO_ADVANCE_MS = 450
const DRAFT_SAVE_DEBOUNCE_MS = 600

// Stage 2 of the assessment ("TCM" in product shorthand — the Construct/ECM
// module). Deliberately mirrors GunaProfiler.jsx's structure and behaviour
// (one question per page, save draft, back/next, 72h resume) — same product
// requirement ("Same as Guna but this will be 32 questions"), 4 options
// (A-D) per scenario instead of 3, and a different completion message: no
// immediate scoring reveal, since the combined report only becomes
// available once both stages are scored (see Report.jsx).
export default function ConstructAssessment() {
  const navigate = useNavigate()
  const { constructAnswers, answerConstruct } = useAssessment()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('loading') // loading | locked | quiz | submitting | done | error
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submittedAt, setSubmittedAt] = useState(null)
  const [resumeNotice, setResumeNotice] = useState(null) // 'resumed' | 'expired' | null
  const [draftSaveState, setDraftSaveState] = useState('idle') // idle | saving | saved | error
  const advanceTimer = useRef(null)
  const draftSaveTimer = useRef(null)
  const hasLoadedRef = useRef(false)

  const total = CONSTRUCT_SCENARIOS.length
  const scenario = CONSTRUCT_SCENARIOS[index]
  const selected = constructAnswers[scenario?.id]
  const answeredIds = useMemo(() => new Set(Object.keys(constructAnswers)), [constructAnswers])
  const answeredCount = answeredIds.size

  // On arrival: locked if the Guna profiler isn't submitted yet (the API
  // enforces this too — this is just so the UI doesn't let someone start
  // typing into a quiz that will fail to submit). Otherwise same
  // submitted/draft/fresh handling as GunaProfiler.
  useEffect(() => {
    let cancelled = false
    api
      .getConstructAssessment()
      .then((data) => {
        if (cancelled) return
        if (data.locked) {
          setPhase('locked')
          return
        }
        if (data.submitted) {
          setSubmittedAt(data.submittedAt)
          setPhase('done')
          return
        }
        if (data.draft && data.draft.answers?.length) {
          for (const a of data.draft.answers) answerConstruct(a.scenarioId, a.optionKey)
          const savedIndex = typeof data.draft.currentIndex === 'number' ? data.draft.currentIndex : 0
          setIndex(Math.max(0, Math.min(total - 1, savedIndex)))
          setResumeNotice('resumed')
        } else if (data.expired) {
          setResumeNotice('expired')
        }
        hasLoadedRef.current = true
        setPhase('quiz')
      })
      .catch((err) => {
        if (cancelled) return
        setLoadError(err instanceof ApiError ? err.message : 'Could not load the assessment. Please try again.')
        setPhase('error')
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => {
    clearTimeout(advanceTimer.current)
    clearTimeout(draftSaveTimer.current)
  }, [])

  const persistDraft = useCallback((map, currentIndex) => {
    const answers = Object.entries(map).map(([scenarioId, optionKey]) => ({ scenarioId, optionKey }))
    setDraftSaveState('saving')
    api
      .saveConstructDraft(answers, currentIndex)
      .then((res) => {
        setDraftSaveState('saved')
        if (res?.restarted) setResumeNotice('expired')
      })
      .catch(() => setDraftSaveState('error'))
  }, [])

  useEffect(() => {
    if (phase !== 'quiz' || !hasLoadedRef.current) return undefined
    clearTimeout(draftSaveTimer.current)
    draftSaveTimer.current = setTimeout(() => {
      persistDraft(constructAnswers, index)
    }, DRAFT_SAVE_DEBOUNCE_MS)
    return () => clearTimeout(draftSaveTimer.current)
  }, [constructAnswers, index, phase, persistDraft])

  // Accepts an optional answers-map override for the same reason as
  // GunaProfiler's submit — avoids a state-race on the final question.
  const submit = useCallback(async (answersMapOverride) => {
    setPhase('submitting')
    setSubmitError(null)
    const map = answersMapOverride || constructAnswers
    const answers = CONSTRUCT_SCENARIOS.map((s) => ({ scenarioId: s.id, optionKey: map[s.id] }))
    try {
      const data = await api.submitConstructAssessment(answers)
      setSubmittedAt(data.submittedAt)
      setPhase('done')
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not save your responses. Please try again.')
      setPhase('quiz')
    }
  }, [constructAnswers])

  const goToIndex = useCallback((next) => {
    clearTimeout(advanceTimer.current)
    setIndex(Math.max(0, Math.min(total - 1, next)))
  }, [total])

  const handleSelect = useCallback((optionKey) => {
    answerConstruct(scenario.id, optionKey)
    clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => {
      if (index === total - 1) {
        submit({ ...constructAnswers, [scenario.id]: optionKey })
      } else {
        setIndex((i) => Math.min(total - 1, i + 1))
      }
    }, AUTO_ADVANCE_MS)
  }, [answerConstruct, scenario, index, total, submit, constructAnswers])

  function handleBack() {
    if (index === 0) {
      navigate('/my-page')
      return
    }
    goToIndex(index - 1)
  }

  function handleSaveDraft() {
    clearTimeout(draftSaveTimer.current)
    persistDraft(constructAnswers, index)
  }

  // Keyboard shortcuts: 1-3 (or A-C) picks an option, left arrow navigates back.
  useEffect(() => {
    if (phase !== 'quiz') return undefined
    function onKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const optionByDigit = { 1: 0, 2: 1, 3: 2 }
      if (optionByDigit[e.key] !== undefined && scenario.options[optionByDigit[e.key]]) {
        handleSelect(scenario.options[optionByDigit[e.key]].key)
        return
      }
      const letterMatch = scenario.options.find((o) => o.key.toLowerCase() === e.key.toLowerCase())
      if (letterMatch) {
        handleSelect(letterMatch.key)
        return
      }
      if (e.key === 'ArrowLeft') handleBack()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, scenario, selected])

  if (phase === 'loading') {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your assessment…
      </div>
    )
  }

  if (phase === 'locked') {
    return (
      <div className="assessment-shell container">
        <div className="result-panel">
          <div className="eyebrow"><span className="dot"></span> Not yet available</div>
          <h1>Finish the Guna profiler first</h1>
          <p>
            The Construct assessment opens up once you've completed the Guna profiler — that's stage
            one of two.
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/assessment/guna" className="btn btn-primary btn-lg">Go to Guna profiler</Link>
            <Link to="/my-page" className="btn btn-ghost btn-lg">Back to My Page</Link>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'error') {
    return (
      <div className="assessment-shell container">
        <div className="result-panel">
          <h1>Something went wrong</h1>
          <p>{loadError}</p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Try again</button>
            <Link to="/my-page" className="btn btn-ghost">Back to My Page</Link>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="assessment-shell container">
        <div className="result-panel">
          <div className="eyebrow"><span className="dot"></span> Construct assessment complete</div>
          <div className="result-badge" aria-hidden="true">✓</div>
          <h1>Your responses are recorded</h1>
          <p>
            Thank you for completing both parts of the assessment. There's nothing more for you to
            do — your combined report will be available on My Page once it's ready.
            {submittedAt && (
              <> Submitted {new Date(submittedAt).toLocaleString()}.</>
            )}
          </p>
          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="/my-page" className="btn btn-primary btn-lg">Back to My Page</Link>
          </div>
        </div>
      </div>
    )
  }

  // phase === 'quiz' or 'submitting'
  return (
    <div className="assessment-shell container">
      {resumeNotice && (
        <div
          className={`status-msg ${resumeNotice === 'expired' ? 'error' : 'success'}`}
          style={{ display: 'block' }}
          role="status"
        >
          {resumeNotice === 'expired'
            ? 'Your previous in-progress session was more than 72 hours old, so it was cleared — starting fresh.'
            : 'Welcome back — resumed where you left off.'}
        </div>
      )}

      <div className="assessment-topbar">
        <div className="guna-stepper" role="tablist" aria-label="Question progress">
          {CONSTRUCT_SCENARIOS.map((s, i) => {
            const isAnswered = answeredIds.has(s.id)
            const isCurrent = i === index
            const isReachable = isAnswered || isCurrent
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                aria-label={`Question ${i + 1}${isAnswered ? ' (answered)' : ''}`}
                className={`guna-dot${isCurrent ? ' current' : ''}${isAnswered ? ' answered' : ''}`}
                disabled={!isReachable}
                onClick={() => isReachable && goToIndex(i)}
              >
                {isAnswered && !isCurrent ? '✓' : i + 1}
              </button>
            )
          })}
        </div>
        <span className="progress-label">{answeredCount} of {total} answered</span>
      </div>

      <div className="quiz-card" key={scenario.id}>
        <div className="quiz-kicker">Construct assessment · Question {index + 1} of {total}</div>
        <h1 className="quiz-question">{scenario.situation}</h1>

        <div className="option-list" role="radiogroup" aria-label={scenario.situation}>
          {scenario.options.map((opt, i) => (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={selected === opt.key}
              className={`option${selected === opt.key ? ' selected' : ''}`}
              onClick={() => handleSelect(opt.key)}
              disabled={phase === 'submitting'}
            >
              <span className="option-badge">{i + 1}</span>
              <span className="option-text">{opt.text}</span>
            </button>
          ))}
        </div>

        {submitError && (
          <div className="status-msg error" style={{ display: 'block' }} role="alert">{submitError}</div>
        )}

        <div className="quiz-nav">
          <button type="button" className="btn btn-ghost" onClick={handleBack} disabled={phase === 'submitting'}>
            {index === 0 ? 'Exit' : 'Back'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleSaveDraft}
            disabled={phase === 'submitting' || answeredCount === 0}
          >
            {draftSaveState === 'saving' ? 'Saving…' : 'Save draft'}
          </button>
          {phase === 'submitting' && (
            <span className="btn btn-primary" aria-disabled="true" style={{ pointerEvents: 'none', opacity: 0.7 }}>
              Saving…
            </span>
          )}
        </div>
        <p className="quiz-hint">
          There are no right or wrong answers — answer with what you'd actually do. Selecting an answer moves you
          on automatically — no need to click anything else. Tip: press 1, 2, or 3 to answer quickly.
          {draftSaveState === 'saved' && ' Draft saved.'}
        </p>
      </div>
    </div>
  )
}
