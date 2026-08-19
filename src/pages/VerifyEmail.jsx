import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('pending') // pending | success | error
  const [message, setMessage] = useState('Verifying your email…')
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true

    if (!token) {
      setStatus('error')
      setMessage('This verification link is missing a token. Please use the full link from your email.')
      return
    }

    api
      .verifyEmail(token)
      .then((data) => {
        setStatus('success')
        setMessage(data?.message || 'Your email has been verified. You can now log in.')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(
          err instanceof ApiError
            ? err.message
            : 'Could not verify your email right now. Please try again in a moment.',
        )
      })
  }, [token])

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow">
          <span className="dot"></span> Almost there
        </span>
        <h2>One last step before you can log in</h2>
        <p>
          We ask every respondent to confirm their email address before their first login — it
          keeps assessment results tied to a verified identity.
        </p>
        <ul className="auth-aside-list">
          <li>
            <span className="ico" aria-hidden="true">1</span>
            Verification links are single-use and expire after 24 hours.
          </li>
          <li>
            <span className="ico" aria-hidden="true">2</span>
            Once verified, you can log in immediately with the password you set.
          </li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Email verification</h1>

          <div
            className={`status-msg ${status === 'error' ? 'error' : 'success'}`}
            style={{ display: 'block' }}
            role="status"
          >
            {message}
          </div>

          {status === 'success' && (
            <Link to="/login" className="btn btn-primary btn-block btn-lg" style={{ marginTop: '20px' }}>
              Go to login
            </Link>
          )}

          {status === 'error' && (
            <p className="form-footer-link" style={{ marginTop: '20px' }}>
              <Link to="/register" className="link-accent">Back to registration</Link>
              {' · '}
              <Link to="/login" className="link-accent">Go to login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
