import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'
import { useOrgAuth } from '../context/OrgAuthContext.jsx'

export default function OrgLogin() {
  const formRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshOrgAdmin } = useOrgAuth()
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (!formRef.current.reportValidity()) return

    setSubmitting(true)
    try {
      await api.orgLogin(form)
      setStatus({ type: 'success', message: 'Logged in. Redirecting…' })
      await refreshOrgAdmin()
      const destination = location.state?.from || '/org-admin'
      setTimeout(() => navigate(destination, { replace: true }), 300)
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setStatus({ type: 'info', message: err.message })
      } else if (err instanceof ApiError && err.status === 403) {
        setStatus({ type: 'error', message: err.message || 'Please verify your organisation email before logging in.' })
      } else {
        setStatus({ type: 'error', message: err.message || 'Could not log in. Check your details and try again.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow"><span className="dot"></span> Admin</span>
        <h2>Run your organisation's cohort</h2>
        <p>See who's registered, approve pending participants, manage your roster, and view scores that participants chose to share with you.</p>
        <ul className="auth-aside-list">
          <li><span className="ico" aria-hidden="true">1</span> This login is separate from a participant account.</li>
          <li><span className="ico" aria-hidden="true">2</span> You can log in here whether or not you take the assessment yourself.</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Admin login</h1>
          <p className="subtitle">
            Registering as a participant instead? <Link to="/login" className="link-accent">Go to participant login</Link>.
          </p>

          {status && (
            <div className={`status-msg ${status.type === 'error' ? 'error' : 'success'}`} style={{ display: 'block' }} role="status">
              {status.message}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                className="input" type="email" id="email" name="email"
                placeholder="you@company.com" autoComplete="email" required
                value={form.email} onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                className="input" type="password" id="password" name="password"
                autoComplete="current-password" required
                value={form.password} onChange={handleChange}
              />
            </div>

            <div className="alt-actions">
              <label htmlFor="rememberMe">
                <input
                  type="checkbox" id="rememberMe" name="rememberMe"
                  checked={form.rememberMe} onChange={handleChange}
                />
                Remember me
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log in'}
            </button>

            <p className="form-footer-link">
              Haven't registered your organisation yet? <Link to="/org-register" className="link-accent">Register it here</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
