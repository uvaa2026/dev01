import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAssessment } from '../../context/AssessmentContext.jsx'
import { GUNA_VIGNETTES } from '../../data/gunaVignettes.js'
import { api, ApiError } from '../../lib/api.js'

const AUTO_ADVANCE_MS = 450
const DRAFT_SAVE_DEBOUNCE_MS = 600

export default function GunaProfiler() {
  const navigate = useNavigate()
  const { gunaAnswers, answerGuna } = useAssessment()
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState('loading') // loading | quiz | submitting | done | error
  const [loadError, setLoadError] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [submittedAt, setSubmittedAt] = useState(null)
  // 'resumed' — a server draft was found and restored; 'expired' — a >72h
  // draft was found and discarded server-side (FR-17), starting fresh.
  const [resumeNotice, setResumeNotice] = useState(null)
  const [draftSaveState, setDraftSaveState] = useState('idle') // idle | saving | saved | error
  const advanceTimer = useRef(null)
  const draftSaveTimer = useRef(null)
  // Guards the auto-save effect against firing during the initial load (the
  // resume-restore itself touches gunaAnswers/index and must not be mistaken
  // for a real edit that needs saving straight back to the server).
  const hasLoadedRef = useRef(false)

  const total = GUNA_VIGNETTES.length
  const vignette = GUNA_VIGNETTES[index]
  const selected = gunaAnswers[vignette?.id]
  const answeredIds = useMemo(() => new Set(Object.keys(gunaAnswers)), [gunaAnswers])
  const answeredCount = answeredIds.size

  // On arrival: a completed submission goes straight to the completion
  // screen; an in-progress draft (FR-17, 72h resume window — enforced
  // server-side) is restored into context at the question it left off on;
  // otherwise it's a fresh attempt, possibly right after an old draft aged
  // out and was discarded.
  useEffect(() => {
    let cancelled = false
    api
      .getGunaAssessment()
      .then((data) => {
        if (cancelled) return
        if (data.submitted) {
          setSubmittedAt(data.submittedAt)
          setPhase('done')
          return
        }
        if (data.draft && data.draft.answers?.length) {
          for (const a of data.draft.answers) answerGuna(a.vignetteId, a.optionKey)
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
    const answers = Object.entries(map).map(([vignetteId, optionKey]) => ({ vignetteId, optionKey }))
    setDraftSaveState('saving')
    api
      .saveGunaDraft(answers, currentIndex)
      .then((res) => {
        setDraftSaveState('saved')
        if (res?.restarted) {
          // Edge case: the tab sat open long enough that the draft aged past
          // 72h between loads — the server discarded it and started a fresh
          // one on this save. Let the respondent know why their earlier
          // answers on this screen no longer match what's stored.
          setResumeNotice('expired')
        }
      })
      .catch(() => setDraftSaveState('error'))
  }, [])

  // Auto-save shortly after every answer or navigation change, once the
  // initial load/resume has finished.
  useEffect(() => {
    if (phase !== 'quiz' || !hasLoadedRef.current) return undefined
    clearTimeout(draftSaveTimer.current)
    draftSaveTimer.current = setTimeout(() => {
      persistDraft(gunaAnswers, index)
    }, DRAFT_SAVE_DEBOUNCE_MS)
    return () => clearTimeout(draftSaveTimer.current)
  }, [gunaAnswers, index, phase, persistDraft])

  // Accepts an optional answers-map override so the very last answer can be
  // submitted correctly even though it hasn't round-tripped through context
  // state yet (see handleSelect below) — without this, submitting on the
  // final question would race the state update and go out missing that
  // last answer.
  const submit = useCallback(async (answersMapOverride) => {
    setPhase('submitting')
    setSubmitError(null)
    const map = answersMapOverride || gunaAnswers
    const answers = GUNA_VIGNETTES.map((v) => ({ vignetteId: v.id, optionKey: map[v.id] }))
    try {
      const data = await api.submitGunaAssessment(answers)
      setSubmittedAt(data.submittedAt)
      setPhase('done')
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not save your responses. Please try again.')
      setPhase('quiz')
    }
  }, [gunaAnswers])

  const goToIndex = useCallback((next) => {
    clearTimeout(advanceTimer.current)
    setIndex(Math.max(0, Math.min(total - 1, next)))
  }, [total])

  const handleSelect = useCallback((optionKey) => {
    answerGuna(vignette.id, optionKey)
    clearTimeout(advanceTimer.current)
    advanceTimer.current = setTimeout(() => {
      if (index === total - 1) {
        // Merge the just-picked answer directly rather than trusting
        // `gunaAnswers` from context — that update may not have landed in
        // this closure yet (see the comment on `submit`).
        submit({ ...gunaAnswers, [vignette.id]: optionKey })
      } else {
        setIndex((i) => Math.min(total - 1, i + 1))
      }
    }, AUTO_ADVANCE_MS)
  }, [answerGuna, vignette, index, total, submit, gunaAnswers])

  function handleBack() {
    if (index === 0) {
      navigate('/my-page')
      return
    }
    goToIndex(index - 1)
  }

  function handleSaveDraft() {
    clearTimeout(draftSaveTimer.current)
    persistDraft(gunaAnswers, index)
  }

  // Keyboard shortcuts: 1/2/3 (or A/B/C) picks an option, arrow keys move
  // between questions that already have an answer (or the current one).
  useEffect(() => {
    if (phase !== 'quiz') return undefined
    function onKeyDown(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const optionByDigit = { 1: 0, 2: 1, 3: 2 }
      if (optionByDigit[e.key] !== undefined && vignette.options[optionByDigit[e.key]]) {
        handleSelect(vignette.options[optionByDigit[e.key]].key)
        return
      }
      const letterMatch = vignette.options.find((o) => o.key.toLowerCase() === e.key.toLowerCase())
      if (letterMatch) {
        handleSelect(letterMatch.key)
        return
      }
      if (e.key === 'ArrowLeft') handleBack()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, vignette, selected])

  if (phase === 'loading') {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your assessment…
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
          <div className="eyebrow"><span className="dot"></span> Guna profiler complete</div>
          <div className="result-badge" aria-hidden="true">✓</div>
          <h1>Your responses are recorded</h1>
          <p>
            Thank you for completing the Guna profiler. There's nothing more to do here — scoring
            and your personalised profile will be available a little later. You can now start the
            Construct assessment from My Page.
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
          {GUNA_VIGNETTES.map((v, i) => {
            const isAnswered = answeredIds.has(v.id)
            const isCurrent = i === index
            const isReachable = isAnswered || isCurrent
            return (
              <button
                key={v.id}
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

      <div className="quiz-card" key={vignette.id}>
        <div className="quiz-kicker">Guna profiler · Question {index + 1} of {total}</div>
        <h1 className="quiz-question">{vignette.prompt}</h1>

        <div className="option-list" role="radiogroup" aria-label={vignette.prompt}>
          {vignette.options.map((opt, i) => (
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
