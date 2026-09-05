import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../../lib/api.js'

export default function AdminUsers() {
  const [state, setState] = useState({ status: 'loading', users: [], error: null })

  useEffect(() => {
    let cancelled = false
    api
      .adminListUsers()
      .then((data) => { if (!cancelled) setState({ status: 'ready', users: data.users, error: null }) })
      .catch((err) => {
        if (cancelled) return
        setState({
          status: 'error',
          users: [],
          error: err instanceof ApiError ? err.message : 'Could not load the user list.',
        })
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="admin-shell container">
      <div className="admin-header">
        <div>
          <span className="eyebrow"><span className="dot"></span> Admin</span>
          <h1>Registered users</h1>
          <p className="subtitle">
            {state.status === 'ready' ? `${state.users.length} registered` : 'Loading…'}
          </p>
        </div>
      </div>

      {state.status === 'error' && (
        <div className="status-msg error" style={{ display: 'block' }} role="alert">{state.error}</div>
      )}

      {state.status === 'loading' && (
        <p style={{ color: 'var(--text-muted)' }}>Loading users…</p>
      )}

      {state.status === 'ready' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Organisation</th>
                <th>Verified</th>
                <th>Guna profiler</th>
                <th>Construct</th>
                <th>Report</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {state.users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link to={`/admin/users/${u.id}`} className="admin-row-link">{u.fullName}</Link>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.organisationName}</td>
                  <td>
                    {u.isEmailVerified
                      ? <span className="verified-badge">Verified</span>
                      : <span className="pending-badge">Pending</span>}
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
              {state.users.length === 0 && (
                <tr><td colSpan={8} className="admin-table-muted">No registered users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
