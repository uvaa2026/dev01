import { Fragment, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../../lib/api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useOrgAuth } from '../../context/OrgAuthContext.jsx'

const APPROVAL_LABEL = { PENDING: 'Pending', APPROVED: 'Approved', REJECTED: 'Rejected' }

function errMessage(err, fallback) {
  return err instanceof ApiError ? err.message : fallback
}

export default function OrgAdminDashboard() {
  const { isAuthenticated } = useAuth()
  const { isOrgAuthenticated, orgAdmin, clearOrgAdmin } = useOrgAuth()

  const [overview, setOverview] = useState({ status: 'loading', data: null, error: null })
  const [participants, setParticipants] = useState({ status: 'loading', data: [], error: null })
  const [roster, setRoster] = useState({ status: 'idle', data: [], error: null })
  const [expandedId, setExpandedId] = useState(null)
  const [detailById, setDetailById] = useState({}) // id -> { status, data, error }
  const [copied, setCopied] = useState(false)

  const [rosterForm, setRosterForm] = useState({ fullName: '', email: '' })
  const [rosterCsv, setRosterCsv] = useState('')
  const [rosterStatus, setRosterStatus] = useState(null)
  const [rosterBusy, setRosterBusy] = useState(false)
  const [approvingId, setApprovingId] = useState(null)

  const loadOverview = useCallback(() => {
    setOverview({ status: 'loading', data: null, error: null })
    api.orgAdmin
      .overview()
      .then((data) => setOverview({ status: 'ready', data, error: null }))
      .catch((err) => setOverview({ status: 'error', data: null, error: errMessage(err, 'Could not load your organisation.') }))
  }, [])

  const loadParticipants = useCallback(() => {
    setParticipants((s) => ({ ...s, status: 'loading' }))
    api.orgAdmin
      .participants()
      .then((data) => setParticipants({ status: 'ready', data: data.participants, error: null }))
      .catch((err) => setParticipants({ status: 'error', data: [], error: errMessage(err, 'Could not load participants.') }))
  }, [])

  const loadRoster = useCallback(() => {
    setRoster((s) => ({ ...s, status: 'loading' }))
    api.orgAdmin
      .listRoster()
      .then((data) => setRoster({ status: 'ready', data: data.roster, error: null }))
      .catch((err) => setRoster({ status: 'error', data: [], error: errMessage(err, 'Could not load the roster.') }))
  }, [])

  useEffect(() => {
    loadOverview()
    loadParticipants()
  }, [loadOverview, loadParticipants])

  useEffect(() => {
    if (overview.status === 'ready' && overview.data.provisioningModel === 'NAMED_ROSTER') {
      loadRoster()
    }
  }, [overview.status, overview.data?.provisioningModel, loadRoster])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(overview.data.cohortCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Best-effort — the code is already visible on screen.
    }
  }

  function toggleExpand(id) {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!detailById[id]) {
      setDetailById((d) => ({ ...d, [id]: { status: 'loading' } }))
      api.orgAdmin
        .participant(id)
        .then((data) => setDetailById((d) => ({ ...d, [id]: { status: 'ready', data } })))
        .catch((err) => setDetailById((d) => ({ ...d, [id]: { status: 'error', error: errMessage(err, 'Could not load this participant.') } })))
    }
  }

  async function handleApprove(id, decision) {
    setApprovingId(id)
    try {
      await api.orgAdmin.approve(id, decision)
      loadParticipants()
      loadOverview()
    } catch (err) {
      setParticipants((s) => ({ ...s, error: errMessage(err, 'Could not update approval status.') }))
    } finally {
      setApprovingId(null)
    }
  }

  function handleRosterFormChange(e) {
    const { name, value } = e.target
    setRosterForm((f) => ({ ...f, [name]: value }))
  }

  async function handleAddRosterEntry(e) {
    e.preventDefault()
    setRosterStatus(null)
    setRosterBusy(true)
    try {
      await api.orgAdmin.addRosterEntry(rosterForm)
      setRosterForm({ fullName: '', email: '' })
      setRosterStatus({ type: 'success', message: 'Added to the roster.' })
      loadRoster()
    } catch (err) {
      setRosterStatus({ type: 'error', message: errMessage(err, 'Could not add this person to the roster.') })
    } finally {
      setRosterBusy(false)
    }
  }

  async function handleUploadCsv(e) {
    e.preventDefault()
    setRosterStatus(null)
    if (!rosterCsv.trim()) {
      setRosterStatus({ type: 'error', message: 'Paste CSV text with fullName and email columns first.' })
      return
    }
    setRosterBusy(true)
    try {
      const result = await api.orgAdmin.uploadRosterCsv(rosterCsv)
      setRosterStatus({
        type: result.skippedCount > 0 ? 'info' : 'success',
        message: `Added ${result.addedCount}, skipped ${result.skippedCount}.`
          + (result.skipped?.length ? ` (${result.skipped.map((s) => `row ${s.row}: ${s.reason}`).join('; ')})` : ''),
      })
      setRosterCsv('')
      loadRoster()
    } catch (err) {
      setRosterStatus({ type: 'error', message: errMessage(err, 'Could not upload this CSV.') })
    } finally {
      setRosterBusy(false)
    }
  }

  if (overview.status === 'loading') {
    return <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your organisation…</div>
  }

  if (overview.status === 'error') {
    return (
      <div className="admin-shell container">
        <div className="status-msg error" style={{ display: 'block' }} role="alert">{overview.error}</div>
      </div>
    )
  }

  const org = overview.data
  const pending = participants.data.filter((p) => p.approvalStatus === 'PENDING')

  return (
    <div className="admin-shell container">
      <div className="admin-header">
        <div>
          <span className="eyebrow"><span className="dot"></span> Admin</span>
          <h1>{org.organisationName}</h1>
          <p className="subtitle">
            {isOrgAuthenticated ? orgAdmin?.email : 'Signed in as your respondent account'}
            {isAuthenticated && (
              <>
                {' · '}
                <Link to="/my-page" className="link-accent">Go to my assessment</Link>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-label">Seats</span>
          <span className="stat-card-value">{org.seatsUsed} / {org.seatCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Registered</span>
          <span className="stat-card-value">{org.totalRegistered}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Pending approval</span>
          <span className="stat-card-value">{org.pendingApproval}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Reports ready</span>
          <span className="stat-card-value">{org.reportsReady}</span>
        </div>
      </div>

      <div className="mypage-card" style={{ marginTop: 24 }}>
        <h3>Cohort code</h3>
        <div className="code-display">
          <div className="code-display-value">
            <span>{org.cohortCode}</span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={copyCode}>{copied ? 'Copied!' : 'Copy'}</button>
          </div>
        </div>
        <dl className="info-list" style={{ marginTop: 16 }}>
          <div className="info-row"><dt>Approval mode</dt><dd>{org.approvalMode === 'MANUAL' ? 'Manual review' : 'Automatic'}</dd></div>
          <div className="info-row"><dt>Participant identification</dt><dd>{org.provisioningModel === 'NAMED_ROSTER' ? 'Named roster' : 'Anonymous cohort'}</dd></div>
          <div className="info-row"><dt>Work email domain</dt><dd>{org.emailDomain || 'Not required'}</dd></div>
        </dl>
      </div>

      {pending.length > 0 && (
        <div className="mypage-card" style={{ marginTop: 24 }}>
          <h3>Pending approval ({pending.length})</h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Registered</th><th></th></tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p.id}>
                    <td>{p.fullName}</td>
                    <td>{p.email}</td>
                    <td className="admin-table-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button type="button" className="btn btn-primary btn-sm" disabled={approvingId === p.id} onClick={() => handleApprove(p.id, 'APPROVE')} style={{ marginRight: 8 }}>
                        Approve
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" disabled={approvingId === p.id} onClick={() => handleApprove(p.id, 'REJECT')}>
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mypage-card" style={{ marginTop: 24 }}>
        <h3>Participants ({participants.data.length})</h3>

        {participants.status === 'error' && (
          <div className="status-msg error" style={{ display: 'block' }} role="alert">{participants.error}</div>
        )}

        {participants.status === 'ready' && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Guna</th>
                  <th>Construct</th>
                  <th>Score</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {participants.data.map((p) => (
                  <Fragment key={p.id}>
                    <tr>
                      <td>{p.fullName}</td>
                      <td>{p.email}</td>
                      <td>
                        {p.approvalStatus === 'APPROVED' && <span className="verified-badge">Approved</span>}
                        {p.approvalStatus === 'PENDING' && <span className="pending-badge">Pending</span>}
                        {p.approvalStatus === 'REJECTED' && <span className="pending-badge">Rejected</span>}
                      </td>
                      <td>{p.completion.guna ? <span className="verified-badge">Done</span> : <span className="pending-badge">—</span>}</td>
                      <td>{p.completion.construct ? <span className="verified-badge">Done</span> : <span className="pending-badge">—</span>}</td>
                      <td>
                        {!p.consentOrgAdmin
                          ? <span className="admin-table-muted">Not shared</span>
                          : p.score
                            ? `${p.score.dqiPct}% · ${p.score.patternLabel}`
                            : <span className="admin-table-muted">Not ready</span>}
                      </td>
                      <td>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleExpand(p.id)}>
                          {expandedId === p.id ? 'Hide' : 'Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedId === p.id && (
                      <tr>
                        <td colSpan={7}>
                          <ParticipantDetail detail={detailById[p.id]} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
                {participants.data.length === 0 && (
                  <tr><td colSpan={7} className="admin-table-muted">No participants registered yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {org.provisioningModel === 'NAMED_ROSTER' && (
        <div className="mypage-card" style={{ marginTop: 24 }}>
          <h3>Roster</h3>
          <p className="hint">Only pre-loaded emails can register with your cohort code.</p>

          {rosterStatus && (
            <div className={`status-msg ${rosterStatus.type === 'error' ? 'error' : 'success'}`} style={{ display: 'block' }} role="status">
              {rosterStatus.message}
            </div>
          )}

          <form onSubmit={handleAddRosterEntry} className="roster-add-form">
            <input
              className="input" type="text" placeholder="Full name" required
              value={rosterForm.fullName} onChange={handleRosterFormChange} name="fullName"
            />
            <input
              className="input" type="email" placeholder="Email address" required
              value={rosterForm.email} onChange={handleRosterFormChange} name="email"
            />
            <button type="submit" className="btn btn-primary btn-sm" disabled={rosterBusy}>Add</button>
          </form>

          <form onSubmit={handleUploadCsv} style={{ marginTop: 18 }}>
            <label htmlFor="rosterCsv" className="hint" style={{ display: 'block', marginBottom: 8 }}>
              Or paste CSV (header row: fullName,email)
            </label>
            <textarea
              id="rosterCsv" className="input" rows={4}
              placeholder={'fullName,email\nJane Doe,jane@acme.com'}
              value={rosterCsv} onChange={(e) => setRosterCsv(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost btn-sm" style={{ marginTop: 8 }} disabled={rosterBusy}>Upload CSV</button>
          </form>

          {roster.status === 'ready' && (
            <div className="admin-table-wrap" style={{ marginTop: 20 }}>
              <table className="admin-table">
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Status</th><th>Source</th></tr>
                </thead>
                <tbody>
                  {roster.data.map((r) => (
                    <tr key={r.id}>
                      <td>{r.fullName}</td>
                      <td>{r.email}</td>
                      <td>{r.status === 'REGISTERED' ? <span className="verified-badge">Registered</span> : <span className="pending-badge">Pending</span>}</td>
                      <td className="admin-table-muted">{r.source}</td>
                    </tr>
                  ))}
                  {roster.data.length === 0 && (
                    <tr><td colSpan={4} className="admin-table-muted">No one added yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ParticipantDetail({ detail }) {
  if (!detail || detail.status === 'loading') {
    return <p style={{ color: 'var(--text-muted)', padding: '12px 0' }}>Loading…</p>
  }
  if (detail.status === 'error') {
    return <div className="status-msg error" style={{ display: 'block' }} role="alert">{detail.error}</div>
  }

  const d = detail.data
  if (!d.consentOrgAdmin) {
    return <p className="admin-note">{d.message || 'This participant has not consented to share their profile and scores with you.'}</p>
  }
  if (!d.score) {
    return <p className="admin-note">{d.message || 'Not ready yet.'}</p>
  }

  return (
    <div className="admin-result-summary" style={{ padding: '12px 0' }}>
      <div className="admin-result-stat">
        <span className="admin-result-stat-label">Guna dominance</span>
        <span className="admin-result-stat-value">{d.score.guna.dominance}{d.score.guna.provisional ? ' (provisional)' : ''}</span>
      </div>
      <div className="admin-result-stat">
        <span className="admin-result-stat-label">DQI</span>
        <span className="admin-result-stat-value">{d.score.dqi.pct}% — {d.score.dqi.band}</span>
      </div>
      {Object.entries(d.score.dimensions).map(([dim, val]) => (
        <div className="admin-result-stat" key={dim}>
          <span className="admin-result-stat-label">{dim}</span>
          <span className="admin-result-stat-value">{val.pct}%{val.deficient ? ' (below 67%)' : ''}</span>
        </div>
      ))}
      <div className="admin-result-stat" style={{ gridColumn: '1 / -1' }}>
        <span className="admin-result-stat-label">Pattern</span>
        <span className="admin-result-stat-value">{d.score.pattern.label}</span>
      </div>
    </div>
  )
}
