import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'

// Requests a password reset link by email. The API always returns the same
// generic success message whether or not the email matches an account (see
// POST /auth/forgot-password) — this page shows that same message either
// way, so it never reveals which email addresses are registered.
export default function ForgotPassword() {
  const formRef = useRef(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (!formRef.current.reportValidity()) return

    setSubmitting(true)
    try {
      const data = await api.requestPasswordReset(email)
      setStatus({
        type: 'success',
        message: data?.message || "If an account exists for that email address, we've sent a password reset link.",
      })
    } catch (err) {
      setStatus({
        type: 'error',
        message: err instanceof ApiError ? err.message : 'Could not send the reset link right now. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow"><span className="dot"></span> Account recovery</span>
        <h2>We'll send you a link to reset it</h2>
        <p>Enter the email address on your UVAA account and we'll send a link to choose a new password.</p>
        <ul className="auth-aside-list">
          <li><span className="ico" aria-hidden="true">1</span> The link expires in 60 minutes and can only be used once.</li>
          <li><span className="ico" aria-hidden="true">2</span> No email? Check spam, or confirm you're using the address you registered with.</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Forgot your password?</h1>
          <p className="subtitle">Remembered it after all? <Link to="/login" className="link-accent">Back to log in</Link>.</p>

          {status && (
            <div className={`status-msg ${status.type === 'error' ? 'error' : 'success'}`} style={{ display: 'block' }} role="status">
              {status.message}
            </div>
          )}

          {status?.type !== 'success' && (
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  className="input" type="email" id="email" name="email"
                  placeholder="you@company.com" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          )}

          {status?.type === 'success' && (
            <Link to="/login" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '20px' }}>
              Back to log in
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
