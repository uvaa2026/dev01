import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DIMENSION_LABELS } from '../../data/constructScenarios.js'
import { api, ApiError } from '../../lib/api.js'

const VERTICAL_LABELS = {
  IT_TECH: 'IT and Technology Services',
  EDUCATION: 'Education and Academic Institutions',
}

const DOMINANCE_LABELS = {
  SATTVA: 'Sattva',
  RAJAS: 'Rajas',
  TAMAS: 'Tamas',
}

const DQI_BAND_LABEL = {
  ANCHORED: 'Anchored',
  DEVELOPING: 'Developing',
  AT_RISK: 'At risk',
}

const DIMENSION_ORDER = ['UPEKSHA', 'ANUVIGNA', 'ANASAKTI', 'VIVEKA']

function pct(count) {
  return `${((count / 15) * 100).toFixed(1)}%`
}

export default function AdminUserDetail() {
  const { id } = useParams()
  const [profile, setProfile] = useState({ status: 'loading', data: null, error: null })
  // Each of these: null = not requested yet, { status: 'loading' }, { status: 'ready', data }, or { status: 'error', error }
  const [guna, setGuna] = useState(null)
  const [construct, setConstruct] = useState(null)
  const [report, setReport] = useState(null)
  const [showGunaReview, setShowGunaReview] = useState(false)
  const [showConstructReview, setShowConstructReview] = useState(false)

  useEffect(() => {
    let cancelled = false
    setProfile({ status: 'loading', data: null, error: null })
    setGuna(null)
    setConstruct(null)
    setReport(null)
    setShowGunaReview(false)
    setShowConstructReview(false)
    api
      .adminGetUser(id)
      .then((data) => { if (!cancelled) setProfile({ status: 'ready', data, error: null }) })
      .catch((err) => {
        if (cancelled) return
        setProfile({ status: 'error', data: null, error: err instanceof ApiError ? err.message : 'Could not load this user.' })
      })
    return () => { cancelled = true }
  }, [id])

  function loadGunaResult() {
    setGuna({ status: 'loading' })
    api
      .adminGetUserGuna(id)
      .then((data) => setGuna({ status: 'ready', data }))
      .catch((err) => setGuna({ status: 'error', error: err instanceof ApiError ? err.message : 'Could not load the result.' }))
  }

  function loadConstructResult() {
    setConstruct({ status: 'loading' })
    api
      .adminGetUserConstruct(id)
      .then((data) => setConstruct({ status: 'ready', data }))
      .catch((err) => setConstruct({ status: 'error', error: err instanceof ApiError ? err.message : 'Could not load the result.' }))
  }

  function loadReport() {
    setReport({ status: 'loading' })
    api
      .adminGetUserReport(id)
      .then((data) => setReport({ status: 'ready', data }))
      .catch((err) => setReport({ status: 'error', error: err instanceof ApiError ? err.message : 'Could not load the report.' }))
  }

  if (profile.status === 'loading') {
    return <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  }

  if (profile.status === 'error') {
    return (
      <div className="admin-shell container">
        <div className="status-msg error" style={{ display: 'block' }} role="alert">{profile.error}</div>
        <Link to="/admin/users" className="btn btn-ghost" style={{ marginTop: 16 }}>Back to user list</Link>
      </div>
    )
  }

  const { respondent, assessments, reportReady } = profile.data

  return (
    <div className="admin-shell container">
      <div className="admin-header">
        <div>
          <Link to="/admin/users" className="link-accent admin-back-link">← All users</Link>
          <h1>{respondent.fullName}</h1>
          <p className="subtitle">{respondent.email}</p>
        </div>
      </div>

      <div className="mypage-grid">
        <section className="mypage-card">
          <h3>Profile</h3>
          <dl className="info-list">
            <div className="info-row"><dt>Organisation</dt><dd>{respondent.organisationName}</dd></div>
            <div className="info-row"><dt>Professional context</dt><dd>{VERTICAL_LABELS[respondent.vertical] || respondent.vertical}</dd></div>
            <div className="info-row"><dt>Career stage</dt><dd>{respondent.careerStage}</dd></div>
            <div className="info-row"><dt>Experience</dt><dd>{respondent.experience}</dd></div>
            {respondent.department && (
              <div className="info-row"><dt>Department</dt><dd>{respondent.department}</dd></div>
            )}
            <div className="info-row">
              <dt>Email verified</dt>
              <dd>{respondent.isEmailVerified ? <span className="verified-badge">Verified</span> : <span className="pending-badge">Pending</span>}</dd>
            </div>
            <div className="info-row"><dt>Registered</dt><dd>{new Date(respondent.createdAt).toLocaleString()}</dd></div>
            <div className="info-row"><dt>Last login</dt><dd>{respondent.lastLoginAt ? new Date(respondent.lastLoginAt).toLocaleString() : '—'}</dd></div>
          </dl>
        </section>

        <section className="mypage-card">
          <h3>Assessments</h3>
          <div className="admin-assessment-row">
            <div>
              <strong>Guna profiler (TPE)</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {assessments.guna.submitted
                  ? `Completed ${new Date(assessments.guna.submittedAt).toLocaleString()}`
                  : 'Not started'}
              </p>
            </div>
            {assessments.guna.submitted && (
              <button type="button" className="btn btn-primary" onClick={loadGunaResult} disabled={guna?.status === 'loading'}>
                {guna?.status === 'loading' ? 'Loading…' : 'View result'}
              </button>
            )}
          </div>

          <div className="admin-assessment-row" style={{ marginTop: 16 }}>
            <div>
              <strong>Construct assessment (ECM)</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {assessments.construct.submitted
                  ? `Completed ${new Date(assessments.construct.submittedAt).toLocaleString()}`
                  : 'Not started'}
              </p>
            </div>
            {assessments.construct.submitted && (
              <button type="button" className="btn btn-primary" onClick={loadConstructResult} disabled={construct?.status === 'loading'}>
                {construct?.status === 'loading' ? 'Loading…' : 'View result'}
              </button>
            )}
          </div>

          <div className="admin-assessment-row" style={{ marginTop: 16 }}>
            <div>
              <strong>Combined report</strong>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {reportReady ? 'Ready' : 'Not ready — both assessments must be completed'}
              </p>
            </div>
            {reportReady && (
              <button type="button" className="btn btn-primary" onClick={loadReport} disabled={report?.status === 'loading'}>
                {report?.status === 'loading' ? 'Loading…' : 'View report'}
              </button>
            )}
          </div>
        </section>
      </div>

      {guna?.status === 'error' && (
        <div className="status-msg error" style={{ display: 'block', marginTop: 24 }} role="alert">{guna.error}</div>
      )}

      {guna?.status === 'ready' && (
        <section className="mypage-card admin-result-card">
          <h3>TPE result — Guna dominance</h3>

          <div className="admin-result-summary">
            <div className="admin-result-stat">
              <span className="admin-result-stat-label">Dominance</span>
              <span className="admin-result-stat-value">
                {DOMINANCE_LABELS[guna.data.result.dominance]}
                {guna.data.result.provisional && <span className="pending-badge" style={{ marginLeft: 8 }}>Provisional</span>}
              </span>
            </div>
            <div className="admin-result-stat">
              <span className="admin-result-stat-label">Sattva</span>
              <span className="admin-result-stat-value">{guna.data.result.sattvaCount} / 15 ({pct(guna.data.result.sattvaCount)})</span>
            </div>
            <div className="admin-result-stat">
              <span className="admin-result-stat-label">Rajas</span>
              <span className="admin-result-stat-value">{guna.data.result.rajasCount} / 15 ({pct(guna.data.result.rajasCount)})</span>
            </div>
            <div className="admin-result-stat">
              <span className="admin-result-stat-label">Tamas</span>
              <span className="admin-result-stat-value">{guna.data.result.tamasCount} / 15 ({pct(guna.data.result.tamasCount)})</span>
            </div>
          </div>

          {guna.data.result.provisional && (
            <p className="admin-note">
              No guna reached the 8-of-15 dominance threshold, so this resolved to the highest count
              (tie-broken toward Sattva &gt; Rajas &gt; Tamas where relevant). Treat as provisional —
              this distinction is facilitator-only per the scoring guide and would be omitted from any
              participant-facing report.
            </p>
          )}

          <p className="admin-note">
            TPE_raw {guna.data.result.tpeRaw} · TPE_index {guna.data.result.tpeIndex?.toFixed(1)} —
            research metric only, retained for validation analysis, not used in any product calculation
            or shown to the respondent.
          </p>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Submitted {new Date(guna.data.submittedAt).toLocaleString()} · Scored {new Date(guna.data.scoredAt).toLocaleString()}
          </p>

          <button type="button" className="btn btn-ghost" onClick={() => setShowGunaReview((v) => !v)} style={{ marginTop: 16 }}>
            {showGunaReview ? 'Hide answer review' : 'Review answers'}
          </button>

          {showGunaReview && (
            <ol className="admin-answer-review">
              {guna.data.review.map((q, i) => (
                <li key={q.vignetteId} className="admin-answer-item">
                  <div className="admin-answer-item-prompt"><strong>Q{i + 1}.</strong> {q.prompt}</div>
                  <ul className="admin-answer-options">
                    {q.options.map((opt) => (
                      <li key={opt.key} className={opt.key === q.selectedKey ? 'admin-answer-option selected' : 'admin-answer-option'}>
                        <span className="admin-answer-option-key">{opt.key}</span>
                        <span className="admin-answer-option-text">{opt.text}</span>
                        <span className="admin-answer-option-guna">{DOMINANCE_LABELS[opt.guna]}</span>
                        {opt.key === q.selectedKey && <span className="admin-answer-option-picked">Selected</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {construct?.status === 'error' && (
        <div className="status-msg error" style={{ display: 'block', marginTop: 24 }} role="alert">{construct.error}</div>
      )}

      {construct?.status === 'ready' && (
        <section className="mypage-card admin-result-card">
          <h3>ECM result — Construct scores</h3>

          <div className="admin-result-summary">
            <div className="admin-result-stat">
              <span className="admin-result-stat-label">DQI</span>
              <span className="admin-result-stat-value">
                {construct.data.result.dqiRaw} raw · {construct.data.result.dqiPct?.toFixed(1)}%
                {' '}
                <span className="pending-badge" style={{ marginLeft: 8 }}>{DQI_BAND_LABEL[construct.data.result.dqiBand] || construct.data.result.dqiBand}</span>
              </span>
            </div>
            {DIMENSION_ORDER.map((dim) => (
              <div className="admin-result-stat" key={dim}>
                <span className="admin-result-stat-label">{DIMENSION_LABELS[dim]?.name ?? dim}</span>
                <span className="admin-result-stat-value">
                  {construct.data.result.dimensionRaw[dim]} / 24 ({construct.data.result.dimensionPct[dim]?.toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Submitted {new Date(construct.data.submittedAt).toLocaleString()} · Scored {new Date(construct.data.scoredAt).toLocaleString()}
          </p>

          <button type="button" className="btn btn-ghost" onClick={() => setShowConstructReview((v) => !v)} style={{ marginTop: 16 }}>
            {showConstructReview ? 'Hide answer review' : 'Review answers'}
          </button>

          {showConstructReview && (
            <ol className="admin-answer-review">
              {construct.data.review.map((q, i) => (
                <li key={q.scenarioId} className="admin-answer-item">
                  <div className="admin-answer-item-prompt">
                    <strong>Q{i + 1}.</strong> {q.situation}
                    {' '}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({DIMENSION_LABELS[q.dimension]?.name ?? q.dimension})</span>
                  </div>
                  <ul className="admin-answer-options">
                    {q.options.map((opt) => (
                      <li key={opt.key} className={opt.key === q.selectedKey ? 'admin-answer-option selected' : 'admin-answer-option'}>
                        <span className="admin-answer-option-key">{opt.key}</span>
                        <span className="admin-answer-option-text">{opt.text}</span>
                        <span className="admin-answer-option-guna">score {opt.score}</span>
                        {opt.key === q.selectedKey && <span className="admin-answer-option-picked">Selected</span>}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {report?.status === 'error' && (
        <div className="status-msg error" style={{ display: 'block', marginTop: 24 }} role="alert">{report.error}</div>
      )}

      {report?.status === 'ready' && report.data.ready && (
        <section className="mypage-card admin-result-card">
          <h3>Combined report — facilitator view</h3>
          <p className="admin-note">
            Everything the respondent's own report shows, plus the guna dominance details and research
            metrics that stay facilitator-only.
          </p>

          <div className="admin-result-summary">
            <div className="admin-result-stat">
              <span className="admin-result-stat-label">Guna dominance</span>
              <span className="admin-result-stat-value">
                {DOMINANCE_LABELS[report.data.guna.dominance]}
                {report.data.guna.provisional && <span className="pending-badge" style={{ marginLeft: 8 }}>Provisional</span>}
              </span>
            </div>
            <div className="admin-result-stat">
              <span className="admin-result-stat-label">DQI</span>
              <span className="admin-result-stat-value">
                {report.data.dqi.pct?.toFixed(1)}% — {DQI_BAND_LABEL[report.data.dqi.band] || report.data.dqi.band}
              </span>
            </div>
            {DIMENSION_ORDER.map((dim) => (
              <div className="admin-result-stat" key={dim}>
                <span className="admin-result-stat-label">{DIMENSION_LABELS[dim]?.name ?? dim}</span>
                <span className="admin-result-stat-value">
                  {report.data.dimensions[dim]?.pct?.toFixed(1)}%
                  {report.data.dimensions[dim]?.deficient && ' (below 67%)'}
                </span>
              </div>
            ))}
          </div>

          <div className="priority-panel" style={{ marginTop: 20 }}>
            <div className="label">
              UVAA pattern
              {report.data.pattern.provisional && <span className="pending-badge" style={{ marginLeft: 8 }}>Provisional (guna lean, not a firm dominance)</span>}
              {report.data.pattern.steppedDown && <span className="pending-badge" style={{ marginLeft: 8 }}>Stepped down</span>}
            </div>
            <h3>{report.data.pattern.label}</h3>
            <p>{report.data.pattern.meaning}</p>
          </div>

          {report.data.needsFacilitatorReview && (
            <div className="status-msg error" style={{ display: 'block' }} role="alert">
              Reserved-and-decisive pattern (Tamas + Anchored) — no automated plan prints for this
              respondent. Facilitator follow-up needed.
            </div>
          )}
        </section>
      )}

      {report?.status === 'ready' && !report.data.ready && (
        <div className="status-msg error" style={{ display: 'block', marginTop: 24 }}>{report.data.message}</div>
      )}
    </div>
  )
}
