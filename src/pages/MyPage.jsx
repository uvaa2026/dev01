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
  const [gunaStatus, setGunaStatus] = useState(null) // null = loading, else { submitted, submittedAt }

  useEffect(() => {
    let cancelled = false
    api
      .getGunaAssessment()
      .then((data) => { if (!cancelled) setGunaStatus(data) })
      .catch(() => { if (!cancelled) setGunaStatus({ submitted: false, submittedAt: null }) })
    return () => { cancelled = true }
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  if (!user) return null // ProtectedRoute keeps this from rendering while signed out

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
          <h3>Guna profiler</h3>
          {gunaStatus === null && (
            <p style={{ color: 'var(--text-muted)' }}>Checking your assessment status…</p>
          )}
          {gunaStatus?.submitted ? (
            <>
              <p>
                <span className="verified-badge">Completed</span>{' '}
                {gunaStatus.submittedAt && `on ${new Date(gunaStatus.submittedAt).toLocaleDateString()}`}
              </p>
              <p>Scoring and your personalised profile will be available soon.</p>
              <Link to="/assessment/guna" className="btn btn-ghost btn-block">Review / edit my answers</Link>
            </>
          ) : gunaStatus && (
            <>
              <p>15 short situations to establish your baseline. Takes about five minutes — you can go back and forward, and pick up where you left off.</p>
              <Link to="/assessment/guna" className="btn btn-primary btn-block">Start the Guna profiler</Link>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
