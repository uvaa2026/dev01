import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, ApiError } from '../../lib/api.js'

// Screen Flow S2 Consent / S4 Briefing, collapsed into one screen per the
// product brief: "system gives you a page explaining what is all this
// about... this page gets your consent — without that they cannot go do
// assessment." Distinct from the consent checkboxes at registration (that
// consent is about data processing; this is the pre-assessment briefing —
// FR-03: what the assessment measures, that there are no right or wrong
// answers, that honest responses are what make the profile useful — plus
// an explicit "I understand, begin" action that the API records
// (respondents.briefing_ack_at) before the Guna profiler will accept any
// answers).
//
// Deliberately says nothing about the four dimensions, the Guna/Sattva-
// Rajas-Tamas framing, or how anything is scored — FR-04: none of that is
// shown to a respondent before or during the assessment.
export default function BeforeYouBegin() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('loading') // loading | ready | acknowledging | error
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api
      .getBriefingStatus()
      .then((data) => {
        if (cancelled) return
        if (data.acknowledged) {
          // Already seen this — don't show it again, go straight in.
          navigate('/assessment/guna', { replace: true })
        } else {
          setPhase('ready')
        }
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof ApiError ? err.message : 'Could not load this page. Please try again.')
        setPhase('error')
      })
    return () => { cancelled = true }
  }, [navigate])

  async function handleBegin() {
    setPhase('acknowledging')
    setError(null)
    try {
      await api.acknowledgeBriefing()
      navigate('/assessment/guna', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save your acknowledgement. Please try again.')
      setPhase('ready')
    }
  }

  if (phase === 'loading') {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading…
      </div>
    )
  }

  return (
    <div className="assessment-shell container">
      <div className="result-panel" style={{ maxWidth: 640 }}>
        <span className="eyebrow"><span className="dot"></span> Before you begin</span>
        <h1 style={{ marginTop: 12 }}>Here’s what this measures</h1>

        <div style={{ textAlign: 'left', marginTop: 8 }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            <strong style={{ color: 'var(--text-primary)' }}>What you'll do.</strong> A two-part
            assessment of how you tend to decide when things get difficult: deadlines, disagreements,
            setbacks. Around 50 minutes in one sitting. Your answers are saved as you go, and you can
            come back within 72 hours.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            <strong style={{ color: 'var(--text-primary)' }}>How to answer.</strong> There are no
            right answers. Choose what you would really do, not what sounds best. If none of the
            options is exactly right, choose the closest one. You won't see scores as you go. Your
            results come together in one report at the end.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Who sees what.</strong> Your report comes
            to you. The organisation that invited you sees patterns across the group, not individual
            answers. Your individual scores are shared only where you agreed when you registered.
          </p>

          {error && (
            <div className="status-msg error" style={{ display: 'block' }} role="alert">{error}</div>
          )}
        </div>

        <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 16 }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleBegin}
            disabled={phase === 'acknowledging'}
          >
            {phase === 'acknowledging' ? 'One moment…' : 'I understand — begin'}
          </button>
        </div>
      </div>
    </div>
  )
}
