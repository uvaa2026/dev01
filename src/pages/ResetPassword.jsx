import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const formRef = useRef(null)

  // 'form' (waiting on the new password) | 'submitting' | 'success' | 'missing-token' | 'error'
  const [phase, setPhase] = useState(token ? 'form' : 'missing-token')
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errorMessage, setErrorMessage] = useState(
    token ? '' : 'This reset link is missing a token. Please use the full link from your email.',
  )

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    if (!formRef.current.reportValidity()) return
    if (form.password !== form.confirmPassword) {
      setErrorMessage('Those passwords do not match.')
      return
    }

    setPhase('submitting')
    try {
      await api.resetPassword(token, form.password)
      setPhase('success')
    } catch (err) {
      setPhase('form')
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : 'Could not reset your password right now. Please try again.',
      )
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow"><span className="dot"></span> Account recovery</span>
        <h2>Choose a new password</h2>
        <p>Pick a password you haven't used on UVAA before. This link can only be used once.</p>
        <ul className="auth-aside-list">
          <li><span className="ico" aria-hidden="true">1</span> Reset links are single-use and expire after 60 minutes.</li>
          <li><span className="ico" aria-hidden="true">2</span> Once reset, you can log in immediately with your new password.</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Reset your password</h1>

          {phase === 'missing-token' && (
            <>
              <div className="status-msg error" style={{ display: 'block' }} role="status">{errorMessage}</div>
              <p className="form-footer-link" style={{ marginTop: '20px' }}>
                <Link to="/forgot-password" className="link-accent">Request a new reset link</Link>
                {' · '}
                <Link to="/login" className="link-accent">Back to log in</Link>
              </p>
            </>
          )}

          {phase === 'success' && (
            <>
              <div className="status-msg success" style={{ display: 'block' }} role="status">
                Your password has been reset. You can now log in.
              </div>
              <Link to="/login" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '20px' }}>
                Go to login
              </Link>
            </>
          )}

          {(phase === 'form' || phase === 'submitting') && (
            <>
              {errorMessage && (
                <div className="status-msg error" style={{ display: 'block' }} role="alert">{errorMessage}</div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="password">New password</label>
                  <input
                    className="input" type="password" id="password" name="password"
                    autoComplete="new-password" required minLength={8}
                    value={form.password} onChange={handleChange}
                  />
                  <p className="hint">Minimum 8 characters.</p>
                </div>

                <div className="field">
                  <label htmlFor="confirmPassword">Confirm new password</label>
                  <input
                    className="input" type="password" id="confirmPassword" name="confirmPassword"
                    autoComplete="new-password" required minLength={8}
                    value={form.confirmPassword} onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={phase === 'submitting'}>
                  {phase === 'submitting' ? 'Resetting…' : 'Reset password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
