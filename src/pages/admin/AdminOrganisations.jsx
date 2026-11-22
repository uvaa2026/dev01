import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../../lib/api.js'

const ORG_STATUS_BADGE = {
  ACTIVE: { cls: 'verified-badge', label: 'Active' },
  PENDING_VERIFICATION: { cls: 'pending-badge', label: 'Pending verification' },
  CLOSED: { cls: 'disabled-badge', label: 'Closed' },
}

export default function AdminOrganisations() {
  const [state, setState] = useState({ status: 'loading', organisations: [], error: null })

  useEffect(() => {
    let cancelled = false
    api
      .adminListOrganisations()
      .then((data) => { if (!cancelled) setState({ status: 'ready', organisations: data.organisations, error: null }) })
      .catch((err) => {
        if (cancelled) return
        setState({
          status: 'error',
          organisations: [],
          error: err instanceof ApiError ? err.message : 'Could not load the organisation list.',
        })
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="admin-shell container">
      <div className="admin-nav-tabs">
        <Link to="/admin/users" className="admin-nav-tab">Users</Link>
        <span className="admin-nav-tab active">Organisations</span>
      </div>

      <div className="admin-header">
        <div>
          <span className="eyebrow"><span className="dot"></span> Admin</span>
          <h1>Organisations</h1>
          <p className="subtitle">
            {state.status === 'ready' ? `${state.organisations.length} registered` : 'Loading…'}
          </p>
        </div>
      </div>

      {state.status === 'error' && (
        <div className="status-msg error" style={{ display: 'block' }} role="alert">{state.error}</div>
      )}

      {state.status === 'loading' && (
        <p style={{ color: 'var(--text-muted)' }}>Loading organisations…</p>
      )}

      {state.status === 'ready' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Cohort code</th>
                <th>Seats</th>
                <th>Participants</th>
                <th>Approval mode</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {state.organisations.map((o) => {
                const badge = ORG_STATUS_BADGE[o.orgStatus] || { cls: 'pending-badge', label: o.orgStatus }
                return (
                  <tr key={o.id}>
                    <td>
                      <Link to={`/admin/organisations/${o.id}`} className="admin-row-link">{o.name}</Link>
                    </td>
                    <td><span className={badge.cls}>{badge.label}</span></td>
                    <td className="admin-table-muted">{o.cohortCode || '—'}</td>
                    <td>{o.seatsUsed} / {o.seatCount}</td>
                    <td>{o.respondentCount}</td>
                    <td className="admin-table-muted">{o.approvalMode}</td>
                    <td className="admin-table-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                )
              })}
              {state.organisations.length === 0 && (
                <tr><td colSpan={7} className="admin-table-muted">No organisations registered yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
