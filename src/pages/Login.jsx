import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const formRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { refreshUser } = useAuth()
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
      await api.login(form)
      setStatus({ type: 'success', message: 'Logged in. Redirecting…' })
      // The login response only carries a minimal { id, fullName, email }
      // shape — refresh from /auth/me so My Page has the full profile
      // (organisation, verticals, verification status, etc.) right away.
      await refreshUser()
      const destination = location.state?.from || '/my-page'
      setTimeout(() => navigate(destination, { replace: true }), 300)
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setStatus({ type: 'info', message: err.message })
      } else if (err instanceof ApiError && err.status === 403) {
        setStatus({ type: 'error', message: err.message || 'Please verify your email before logging in.' })
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
        <span className="eyebrow"><span className="dot"></span> Welcome back</span>
        <h2>Pick up right where you left off</h2>
        <p>If you started an assessment and stepped away, you can resume from your last completed scenario within 72 hours.</p>
        <ul className="auth-aside-list">
          <li><span className="ico" aria-hidden="true">1</span> Respondents resume in-progress assessments automatically.</li>
          <li><span className="ico" aria-hidden="true">2</span> HR administrators reach their cohort dashboard from here.</li>
          <li><span className="ico" aria-hidden="true">3</span> Facilitators access the debrief and Gita reference guide.</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Log in</h1>
          <p className="subtitle">New to UVAA? <Link to="/register" className="link-accent">Create an account</Link>.</p>

          <div className="form-note">
            <span aria-hidden="true">ⓘ</span>
            <span>Received a unique assessment link from your HR administrator? Open that link directly instead of logging in here.</span>
          </div>

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
              <a href="#" className="link-accent">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Log in'}
            </button>

            <div className="divider">or</div>

            <p className="form-footer-link">
              Registering on behalf of your organisation?{' '}
              <Link to="/register" className="link-accent">Set up an HR administrator account</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
