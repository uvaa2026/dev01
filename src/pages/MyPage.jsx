import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { CAREER_STAGES } from '../data/careerStages.js'
import { api } from '../lib/api.js'

const VERTICAL_LABELS = {
  IT_TECH: 'IT and Technology Services',
  EDUCATION: 'Education and Academic Institutions',
}

function careerStageLabel(vertical, code) {
  const config = vertical ? CAREER_STAGES[vertical] : null
  return config?.options.find((opt) => opt.value === code)?.label || code
}

export default function MyPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  // null = loading, else { submitted, submittedAt, ... }
  const [gunaStatus, setGunaStatus] = useState(null)
  const [constructStatus, setConstructStatus] = useState(null)
  const [reportStatus, setReportStatus] = useState(null) // { ready } while not ready, or the full report once ready

  useEffect(() => {
    let cancelled = false
    api
      .getGunaAssessment()
      .then((data) => { if (!cancelled) setGunaStatus(data) })
      .catch(() => { if (!cancelled) setGunaStatus({ submitted: false, submittedAt: null }) })
    api
      .getConstructAssessment()
      .then((data) => { if (!cancelled) setConstructStatus(data) })
      .catch(() => { if (!cancelled) setConstructStatus({ locked: true, submitted: false, submittedAt: null }) })
    api
      .getReport()
      .then((data) => { if (!cancelled) setReportStatus(data) })
      .catch(() => { if (!cancelled) setReportStatus({ ready: false }) })
    return () => { cancelled = true }
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  if (!user) return null // ProtectedRoute keeps this from rendering while signed out

  const gunaSubmitted = !!gunaStatus?.submitted
  const constructSubmitted = !!constructStatus?.submitted
  const constructLocked = !gunaSubmitted

  return (
    <div className="mypage-shell container">
      <div className="mypage-header">
        <div>
          <span className="eyebrow"><span className="dot"></span> Signed in</span>
          <h1>Welcome back, {user.fullName.split(' ')[0]}</h1>
          <p className="subtitle">{user.organisationName}</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>Log out</button>
      </div>

      {reportStatus?.ready && (
        <div className="status-msg success" style={{ display: 'block' }}>
          Your report is ready.{' '}
          <Link to="/report" style={{ fontWeight: 600 }}>View your UVAA report →</Link>
        </div>
      )}

      <div className="mypage-grid">
        <section className="mypage-card">
          <h3>Your profile</h3>
          <dl className="info-list">
            <div className="info-row">
              <dt>Full name</dt>
              <dd>{user.fullName}</dd>
            </div>
            <div className="info-row">
              <dt>Email</dt>
              <dd>
                {user.email}{' '}
                {user.isEmailVerified && <span className="verified-badge">Verified</span>}
              </dd>
            </div>
            <div className="info-row">
              <dt>Organisation</dt>
              <dd>{user.organisationName}</dd>
            </div>
            <div className="info-row">
              <dt>Professional context</dt>
              <dd>{VERTICAL_LABELS[user.vertical] || user.vertical}</dd>
            </div>
            <div className="info-row">
              <dt>Career stage</dt>
              <dd>{careerStageLabel(user.vertical, user.careerStage)}</dd>
            </div>
            <div className="info-row">
              <dt>Experience</dt>
              <dd>{user.experience}</dd>
            </div>
            {user.department && (
              <div className="info-row">
                <dt>Department</dt>
                <dd>{user.department}</dd>
              </div>
            )}
            <div className="info-row">
              <dt>Last login</dt>
              <dd>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'This is your first login'}</dd>
            </div>
          </dl>
        </section>

        <section className="mypage-card">
          <h3>1. Guna profiler</h3>
          {gunaStatus === null && (
            <p style={{ color: 'var(--text-muted)' }}>Checking your assessment status…</p>
          )}
          {gunaSubmitted ? (
            <>
              <p>
                <span className="verified-badge">Completed</span>{' '}
                {gunaStatus.submittedAt && `on ${new Date(gunaStatus.submittedAt).toLocaleDateString()}`}
              </p>
              <p>Scoring and your personalised profile will be available with your full report.</p>
              <Link to="/assessment/guna" className="btn btn-ghost btn-block">Review / edit my answers</Link>
            </>
          ) : gunaStatus && (
            <>
              <p>15 short situations to establish your baseline. Takes about five minutes — you can go back and forward, save your progress, and pick up where you left off (within 72 hours).</p>
              <Link to="/assessment/begin" className="btn btn-primary btn-block">
                {gunaStatus.draft ? 'Continue the Guna profiler' : 'Start the Guna profiler'}
              </Link>
            </>
          )}
        </section>

        <section className={`mypage-card${constructLocked ? ' locked-card' : ''}`}>
          <h3>2. Construct assessment</h3>
          {constructStatus === null && (
            <p style={{ color: 'var(--text-muted)' }}>Checking your assessment status…</p>
          )}
          {constructLocked && constructStatus && (
            <p style={{ color: 'var(--text-muted)' }}>Unlocks once you've completed the Guna profiler above.</p>
          )}
          {!constructLocked && constructSubmitted && (
            <>
              <p>
                <span className="verified-badge">Completed</span>{' '}
                {constructStatus.submittedAt && `on ${new Date(constructStatus.submittedAt).toLocaleDateString()}`}
              </p>
              <p>Your combined report will be available once scoring is complete.</p>
            </>
          )}
          {!constructLocked && !constructSubmitted && constructStatus && (
            <>
              <p>32 short scenarios covering the full picture. Takes about thirty minutes — same as the Guna profiler, you can save your progress and resume within 72 hours.</p>
              <Link to="/assessment/construct" className="btn btn-primary btn-block">
                {constructStatus.draft ? 'Continue the Construct assessment' : 'Start the Construct assessment'}
              </Link>
            </>
          )}
        </section>

        <section className={`mypage-card${!reportStatus?.ready ? ' locked-card' : ''}`}>
          <h3>3. Your report</h3>
          {reportStatus === null && (
            <p style={{ color: 'var(--text-muted)' }}>Checking your report status…</p>
          )}
          {reportStatus && !reportStatus.ready && (
            <p style={{ color: 'var(--text-muted)' }}>
              {constructSubmitted
                ? 'Both assessments are in — your report will be available here after some time.'
                : 'Available once both assessments above are complete.'}
            </p>
          )}
          {reportStatus?.ready && (
            <>
              <p><span className="verified-badge">Ready</span></p>
              <Link to="/report" className="btn btn-primary btn-block">View your report</Link>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
