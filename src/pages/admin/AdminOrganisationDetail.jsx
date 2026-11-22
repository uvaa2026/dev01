import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, ApiError } from '../../lib/api.js'

const ORG_STATUS_BADGE = {
  ACTIVE: { cls: 'verified-badge', label: 'Active' },
  PENDING_VERIFICATION: { cls: 'pending-badge', label: 'Pending verification' },
  CLOSED: { cls: 'disabled-badge', label: 'Closed' },
}

export default function AdminOrganisationDetail() {
  const { id } = useParams()
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [seatInput, setSeatInput] = useState('')
  const [seatState, setSeatState] = useState({ status: 'idle', error: null })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading', data: null, error: null })
    api
      .adminGetOrganisation(id)
      .then((data) => {
        if (cancelled) return
        setState({ status: 'ready', data, error: null })
        setSeatInput(String(data.organisation.seatCount))
      })
      .catch((err) => {
        if (cancelled) return
        setState({ status: 'error', data: null, error: err instanceof ApiError ? err.message : 'Could not load this organisation.' })
      })
    return () => { cancelled = true }
  }, [id])

  async function handleSeatSave() {
    const seatCount = Number(seatInput)
    setSeatState({ status: 'working', error: null })
    try {
      const result = await api.adminSetOrgSeats(id, seatCount)
      setState((prev) => ({
        ...prev,
        data: { ...prev.data, organisation: { ...prev.data.organisation, seatCount: result.seatCount, seatsUsed: result.seatsUsed } },
      }))
      setSeatState({ status: 'idle', error: null })
    } catch (err) {
      setSeatState({ status: 'idle', error: err instanceof ApiError ? err.message : 'Could not update the seat count.' })
    }
  }

  if (state.status === 'loading') {
    return <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  }

  if (state.status === 'error') {
    return (
      <div className="admin-shell container">
        <div className="status-msg error" style={{ display: 'block' }} role="alert">{state.error}</div>
        <Link to="/admin/organisations" className="btn btn-ghost" style={{ marginTop: 16 }}>Back to organisations</Link>
      </div>
    )
  }

  const { organisation: org, users } = state.data
  const badge = ORG_STATUS_BADGE[org.orgStatus] || { cls: 'pending-badge', label: org.orgStatus }

  return (
    <div className="admin-shell container">
      <div className="admin-header">
        <div>
          <Link to="/admin/organisations" className="link-accent admin-back-link">← All organisations</Link>
          <h1>{org.name}</h1>
          <p className="subtitle"><span className={badge.cls}>{badge.label}</span></p>
        </div>
      </div>

      <div className="mypage-grid">
        <section className="mypage-card">
          <h3>Organisation</h3>
          <dl className="info-list">
            <div className="info-row"><dt>Cohort code</dt><dd>{org.cohortCode || '—'}</dd></div>
            <div className="info-row"><dt>Provisioning</dt><dd>{org.provisioningModel}</dd></div>
            <div className="info-row"><dt>Approval mode</dt><dd>{org.approvalMode}</dd></div>
            <div className="info-row"><dt>Email domain</dt><dd>{org.emailDomain || 'Not restricted'}</dd></div>
            <div className="info-row"><dt>Plan</dt><dd>{org.subscriptionPlan}</dd></div>
            <div className="info-row"><dt>Registered</dt><dd>{new Date(org.createdAt).toLocaleString()}</dd></div>
            {org.cohortDeadlineAt && (
              <div className="info-row"><dt>Cohort deadline</dt><dd>{new Date(org.cohortDeadlineAt).toLocaleDateString()}</dd></div>
            )}
          </dl>
        </section>

        <section className="mypage-card">
          <h3>Seats</h3>
          <dl className="info-list">
            <div className="info-row"><dt>Used</dt><dd>{org.seatsUsed}</dd></div>
            <div className="info-row"><dt>Purchased</dt><dd>{org.seatCount}</dd></div>
          </dl>

          {seatState.error && (
            <div className="status-msg error" style={{ display: 'block', marginTop: 12 }} role="alert">{seatState.error}</div>
          )}

          <div className="admin-seat-form">
            <input
              type="number"
              className="input"
              min={org.seatsUsed}
              value={seatInput}
              onChange={(e) => setSeatInput(e.target.value)}
            />
            <button type="button" className="btn btn-primary" disabled={seatState.status === 'working'} onClick={handleSeatSave}>
              {seatState.status === 'working' ? 'Saving…' : 'Update seat count'}
            </button>
          </div>
          <p className="admin-note" style={{ marginTop: 14 }}>
            This changes how many seats the org's cohort code can admit — not the code itself. Can't be
            set lower than the seats already used.
          </p>
        </section>
      </div>

      <div className="admin-table-wrap" style={{ marginTop: 28 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Status</th>
              <th>Guna profiler</th>
              <th>Construct</th>
              <th>Report</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <Link to={`/admin/users/${u.id}`} className="admin-row-link">{u.fullName}</Link>
                </td>
                <td>{u.email}</td>
                <td>
                  {u.isEmailVerified
                    ? <span className="verified-badge">Verified</span>
                    : <span className="pending-badge">Pending</span>}
                </td>
                <td>
                  {u.disabledAt && <span className="disabled-badge">Disabled</span>}
                  {!u.disabledAt && u.approvalStatus === 'PENDING' && <span className="pending-badge">Awaiting approval</span>}
                  {!u.disabledAt && u.approvalStatus === 'REJECTED' && <span className="rejected-badge">Rejected</span>}
                  {!u.disabledAt && u.approvalStatus === 'APPROVED' && <span className="verified-badge">Active</span>}
                </td>
                <td>
                  {u.assessments.guna.submitted
                    ? <span className="verified-badge">Completed</span>
                    : <span className="pending-badge">Not started</span>}
                </td>
                <td>
                  {u.assessments.construct.submitted
                    ? <span className="verified-badge">Completed</span>
                    : <span className="pending-badge">Not started</span>}
                </td>
                <td>
                  {u.reportReady
                    ? <span className="verified-badge">Ready</span>
                    : <span className="pending-badge">Pending</span>}
                </td>
                <td className="admin-table-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={8} className="admin-table-muted">No participants registered under this organisation yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
