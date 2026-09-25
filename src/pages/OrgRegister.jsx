import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'

const INITIAL_FORM = {
  organisationName: '',
  organisationType: '',
  emailDomain: '',
  seatCount: 10,
  approvalMode: 'AUTO',
  provisioningModel: 'ANONYMOUS',
  adminFullName: '',
  adminEmail: '',
  adminPhone: '',
  adminPassword: '',
  adminConfirmPassword: '',
  adminWantsToParticipate: false,
  hasFacilitator: false,
  facilitatorFullName: '',
  facilitatorEmail: '',
  facilitatorPhone: '',
  facilitatorWantsToParticipate: false,
}

export default function OrgRegister() {
  const formRef = useRef(null)
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (!formRef.current.reportValidity()) return

    if (form.adminPassword !== form.adminConfirmPassword) {
      setStatus({ type: 'error', message: "The Admin's passwords do not match." })
      return
    }
    if (form.hasFacilitator && form.facilitatorEmail.trim().toLowerCase() === form.adminEmail.trim().toLowerCase()) {
      setStatus({ type: 'error', message: 'The facilitator must use a different email address than the Admin.' })
      return
    }

    setSubmitting(true)
    try {
      await api.orgRegister({
        organisationName: form.organisationName,
        organisationType: form.organisationType,
        emailDomain: form.emailDomain.trim() || undefined,
        seatCount: Number(form.seatCount),
        approvalMode: form.approvalMode,
        provisioningModel: form.provisioningModel,
        orgAdmin: {
          fullName: form.adminFullName,
          email: form.adminEmail,
          phone: form.adminPhone || undefined,
          password: form.adminPassword,
          wantsToParticipate: form.adminWantsToParticipate,
        },
        facilitator: form.hasFacilitator
          ? {
              enabled: true,
              fullName: form.facilitatorFullName,
              email: form.facilitatorEmail,
              phone: form.facilitatorPhone || undefined,
              wantsToParticipate: form.facilitatorWantsToParticipate,
            }
          : { enabled: false },
      })
      setDone(true)
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setStatus({ type: 'info', message: err.message })
      } else {
        setStatus({ type: 'error', message: err.message || 'Something went wrong. Please try again.' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="auth-shell">
        <aside className="auth-aside">
          <span className="eyebrow"><span className="dot"></span> Organisation registered</span>
          <h2>Check the Admin inbox</h2>
          <p>We've sent a verification link to {form.adminEmail}. Your cohort code is issued the moment that link is confirmed.</p>
        </aside>
        <div className="auth-main">
          <div className="auth-card">
            <h1>Almost there</h1>
            <div className="status-msg success" style={{ display: 'block' }} role="status">
              Organisation registered. Check the Admin email ({form.adminEmail}) to verify before your cohort code is issued.
            </div>
            <p className="form-footer-link">
              Already verified? <Link to="/org-login" className="link-accent">Log in to your Admin dashboard</Link>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow"><span className="dot"></span> For organisations</span>
        <h2>Bring UVAA to your organisation</h2>
        <p>Purchase seats, set how participants join, and get a single cohort code to share — your people register in minutes.</p>
        <ul className="auth-aside-list">
          <li><span className="ico" aria-hidden="true">1</span> Restrict registration to your own work email domain, or let anyone with the code join.</li>
          <li><span className="ico" aria-hidden="true">2</span> Choose whether every registration needs your approval, or approves automatically.</li>
          <li><span className="ico" aria-hidden="true">3</span> You only ever see a participant's score if they explicitly consent to share it with you.</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card auth-card-wide">
          <h1>Register your organisation</h1>
          <p className="subtitle">Registering as an individual instead? <Link to="/register" className="link-accent">Use a cohort code</Link>.</p>

          {status && (
            <div className={`status-msg ${status.type === 'error' ? 'error' : 'success'}`} style={{ display: 'block' }} role="status">
              {status.message}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <fieldset>
              <legend>Organisation details</legend>

              <div className="field">
                <label htmlFor="organisationName">Organisation name</label>
                <input
                  className="input" type="text" id="organisationName" name="organisationName"
                  placeholder="e.g. Northwind Technologies" autoComplete="organization" required
                  value={form.organisationName} onChange={handleChange}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="organisationType">Type of organisation</label>
                  <select
                    className="input" id="organisationType" name="organisationType" required
                    value={form.organisationType} onChange={handleChange}
                  >
                    <option value="" disabled>Select a type</option>
                    <option value="IT_TECH">IT and Technology Services</option>
                    <option value="EDUCATION">Education and Academic Institutions</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="seatCount">Number of seats</label>
                  <input
                    className="input" type="number" id="seatCount" name="seatCount"
                    min={1} step={1} required
                    value={form.seatCount} onChange={handleChange}
                  />
                  <span className="hint">Minimum 1 seat.</span>
                </div>
              </div>

              <div className="field">
                <label htmlFor="emailDomain">Work email domain <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input
                  className="input" type="text" id="emailDomain" name="emailDomain"
                  placeholder="e.g. acme.com"
                  value={form.emailDomain} onChange={handleChange}
                />
                <span className="hint">If set, only emails on this domain can register with your code. If left blank, sharing the code responsibly is your responsibility.</span>
              </div>

              <div className="field">
                <label>How should new participants be approved?</label>
                <div className="radio-row">
                  <input type="radio" id="approvalAuto" name="approvalMode" value="AUTO" checked={form.approvalMode === 'AUTO'} onChange={handleChange} />
                  <label htmlFor="approvalAuto">Automatically, as soon as they register with the code</label>
                </div>
                <div className="radio-row">
                  <input type="radio" id="approvalManual" name="approvalMode" value="MANUAL" checked={form.approvalMode === 'MANUAL'} onChange={handleChange} />
                  <label htmlFor="approvalManual">I'll review and approve each registration myself</label>
                </div>
              </div>

              <div className="field">
                <label>How will participants be identified?</label>
                <div className="radio-row">
                  <input type="radio" id="provisioningAnonymous" name="provisioningModel" value="ANONYMOUS" checked={form.provisioningModel === 'ANONYMOUS'} onChange={handleChange} />
                  <label htmlFor="provisioningAnonymous">Anyone with the code (and matching domain, if set) can register</label>
                </div>
                <div className="radio-row">
                  <input type="radio" id="provisioningRoster" name="provisioningModel" value="NAMED_ROSTER" checked={form.provisioningModel === 'NAMED_ROSTER'} onChange={handleChange} />
                  <label htmlFor="provisioningRoster">I'll upload a named list of who can register (one by one or by CSV)</label>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend>Admin (required)</legend>
              <p className="hint" style={{ marginBottom: '14px' }}>This person manages your organisation's dashboard, roster, and approvals.</p>

              <div className="field">
                <label htmlFor="adminFullName">Full name</label>
                <input
                  className="input" type="text" id="adminFullName" name="adminFullName"
                  autoComplete="name" required
                  value={form.adminFullName} onChange={handleChange}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="adminEmail">Email address</label>
                  <input
                    className="input" type="email" id="adminEmail" name="adminEmail"
                    autoComplete="email" required
                    value={form.adminEmail} onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="adminPhone">Phone <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                  <input
                    className="input" type="tel" id="adminPhone" name="adminPhone"
                    autoComplete="tel"
                    value={form.adminPhone} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="adminPassword">Password</label>
                  <input
                    className="input" type="password" id="adminPassword" name="adminPassword"
                    autoComplete="new-password" required minLength={8}
                    value={form.adminPassword} onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="adminConfirmPassword">Confirm password</label>
                  <input
                    className="input" type="password" id="adminConfirmPassword" name="adminConfirmPassword"
                    autoComplete="new-password" required minLength={8}
                    value={form.adminConfirmPassword} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="checkbox-row">
                <input
                  type="checkbox" id="adminWantsToParticipate" name="adminWantsToParticipate"
                  checked={form.adminWantsToParticipate} onChange={handleChange}
                />
                <label htmlFor="adminWantsToParticipate">I also want to take the assessment myself as a participant.</label>
              </div>
            </fieldset>

            <fieldset>
              <legend>Facilitator</legend>
              <div className="checkbox-row">
                <input
                  type="checkbox" id="hasFacilitator" name="hasFacilitator"
                  checked={form.hasFacilitator} onChange={handleChange}
                />
                <label htmlFor="hasFacilitator">Add a facilitator for this organisation.</label>
              </div>

              {form.hasFacilitator && (
                <>
                  <div className="field">
                    <label htmlFor="facilitatorFullName">Full name</label>
                    <input
                      className="input" type="text" id="facilitatorFullName" name="facilitatorFullName"
                      autoComplete="name" required={form.hasFacilitator}
                      value={form.facilitatorFullName} onChange={handleChange}
                    />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="facilitatorEmail">Email address</label>
                      <input
                        className="input" type="email" id="facilitatorEmail" name="facilitatorEmail"
                        autoComplete="email" required={form.hasFacilitator}
                        value={form.facilitatorEmail} onChange={handleChange}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="facilitatorPhone">Phone <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                      <input
                        className="input" type="tel" id="facilitatorPhone" name="facilitatorPhone"
                        autoComplete="tel"
                        value={form.facilitatorPhone} onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="checkbox-row">
                    <input
                      type="checkbox" id="facilitatorWantsToParticipate" name="facilitatorWantsToParticipate"
                      checked={form.facilitatorWantsToParticipate} onChange={handleChange}
                    />
                    <label htmlFor="facilitatorWantsToParticipate">The facilitator also wants to take the assessment themselves.</label>
                  </div>
                </>
              )}
            </fieldset>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? 'Registering organisation…' : 'Register organisation'}
            </button>

            <p className="form-footer-link">
              Already registered? <Link to="/org-login" className="link-accent">Log in to your Admin dashboard</Link>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
