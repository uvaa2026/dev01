import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const isOrg = searchParams.get('type') === 'org'
  // 'ready' (waiting on the person to click Confirm) | 'verifying' | 'success' | 'error'
  //
  // Deliberately NOT auto-verified on page load. Corporate mail security
  // gateways (Outlook Safe Links, Proofpoint, Mimecast, etc.) routinely
  // "detonate" links in a hidden browser before a human ever opens the
  // email — if verification fired on mount, that automated visit alone
  // would consume the token and, for an Org Admin, silently issue and
  // email the cohort code before anyone actually clicked. Requiring an
  // explicit click means a scanner that merely loads the page can't
  // trigger it.
  const [status, setStatus] = useState(token ? 'ready' : 'error')
  const [message, setMessage] = useState(
    token ? '' : 'This verification link is missing a token. Please use the full link from your email.',
  )
  const [cohortCode, setCohortCode] = useState(null)
  const [copied, setCopied] = useState(false)
  const ranRef = useRef(false)

  function handleConfirm() {
    if (ranRef.current || !token) return
    ranRef.current = true
    setStatus('verifying')
    setMessage('Verifying your email…')

    const verify = isOrg ? api.orgVerifyEmail(token) : api.verifyEmail(token)
    verify
      .then((data) => {
        setStatus('success')
        setMessage(data?.message || 'Your email has been verified. You can now log in.')
        if (isOrg && data?.cohortCode) {
          setCohortCode(data.cohortCode)
        }
      })
      .catch((err) => {
        ranRef.current = false
        setStatus('error')
        setMessage(
          err instanceof ApiError
            ? err.message
            : 'Could not verify your email right now. Please try again in a moment.',
        )
      })
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(cohortCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the
      // code is already shown on screen either way, so this is best-effort.
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow">
          <span className="dot"></span> Almost there
        </span>
        <h2>{isOrg ? 'One last step before your cohort code is issued' : 'One last step before you can log in'}</h2>
        <p>
          {isOrg
            ? "We ask every Admin to confirm their email address before we issue a cohort code — it keeps the code tied to a verified organisation."
            : "We ask every respondent to confirm their email address before their first login — it keeps assessment results tied to a verified identity."}
        </p>
        <ul className="auth-aside-list">
          <li>
            <span className="ico" aria-hidden="true">1</span>
            Verification links are single-use and expire after 24 hours.
          </li>
          <li>
            <span className="ico" aria-hidden="true">2</span>
            {isOrg
              ? 'Once verified, share the cohort code with your participants.'
              : 'Once verified, you can log in immediately with the password you set.'}
          </li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <h1>{isOrg ? 'Organisation email verification' : 'Email verification'}</h1>

          {status === 'ready' && (
            <>
              <p style={{ color: 'var(--text-secondary)' }}>
                Click below to confirm this is you and finish verifying your email address.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-block btn-lg"
                onClick={handleConfirm}
              >
                Confirm my email
              </button>
            </>
          )}

          {status !== 'ready' && (
            <div
              className={`status-msg ${status === 'error' ? 'error' : 'success'}`}
              style={{ display: 'block' }}
              role="status"
            >
              {message}
            </div>
          )}

          {status === 'success' && isOrg && cohortCode && (
            <div className="code-display">
              <span className="code-display-label">Your cohort code</span>
              <div className="code-display-value">
                <span>{cohortCode}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={copyCode}>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <p className="hint">Share this code with your participants so they can register.</p>
            </div>
          )}

          {status === 'success' && (
            <Link
              to={isOrg ? '/org-login' : '/login'}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '20px' }}
            >
              {isOrg ? 'Go to Admin login' : 'Go to login'}
            </Link>
          )}

          {status === 'error' && (
            <p className="form-footer-link" style={{ marginTop: '20px' }}>
              <Link to={isOrg ? '/org-register' : '/register'} className="link-accent">Back to registration</Link>
              {' · '}
              <Link to={isOrg ? '/org-login' : '/login'} className="link-accent">Go to login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
