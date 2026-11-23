import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'

// Mirrors ForgotPassword.jsx exactly, for the separate Org Admin login
// (OrgLogin.jsx) — a distinct identity space (organisation_contacts /
// organisation_contact_credentials), so it needs its own request endpoint
// (POST /org/forgot-password) and its own "back to log in" link, even
// though the reset-password page that follows is shared between both
// account kinds. Same generic response either way the email resolves — see
// that endpoint's comment on uvaa-api's side for why.
export default function OrgForgotPassword() {
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
      const data = await api.requestOrgPasswordReset(email)
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
        <p>Enter the email address on your Org Admin account and we'll send a link to choose a new password.</p>
        <ul className="auth-aside-list">
          <li><span className="ico" aria-hidden="true">1</span> The link expires in 60 minutes and can only be used once.</li>
          <li><span className="ico" aria-hidden="true">2</span> No email? Check spam, or confirm you're using the address your organisation registered with.</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Forgot your password?</h1>
          <p className="subtitle">Remembered it after all? <Link to="/org-login" className="link-accent">Back to admin login</Link>.</p>

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
            <Link to="/org-login" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '20px' }}>
              Back to admin login
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
