import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'
import { CAREER_STAGES, EXPERIENCE_RANGES } from '../data/careerStages.js'

// Code-first participant registration, in three steps:
//   1. Cohort code -> GET /org/lookup identifies the organisation.
//   2. Profile fields (unchanged from the old single-page form).
//   3. The 3-consent model: Processing (mandatory, no default), Facilitator
//      visibility (default checked/true), Org Admin visibility (default
//      unchecked/false) — declining consent 3 changes nothing else about
//      what the respondent receives.
// Every step keeps its own inline validation; moving back a step never
// loses what was already typed in a later one.
const STEP_CODE = 1
const STEP_PROFILE = 2
const STEP_CONSENT = 3

const INITIAL_PROFILE = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  vertical: '',
  careerStage: '',
  experience: '',
  department: '',
}

export default function Register() {
  const codeFormRef = useRef(null)
  const profileFormRef = useRef(null)
  const consentFormRef = useRef(null)

  const [step, setStep] = useState(STEP_CODE)
  const [cohortCode, setCohortCode] = useState('')
  const [orgInfo, setOrgInfo] = useState(null) // { organisationName, requiresDomainMatch, hasRoster }
  const [profile, setProfile] = useState(INITIAL_PROFILE)
  const [consent, setConsent] = useState({ processing: false, facilitator: true, orgAdmin: false })

  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const careerStageConfig = profile.vertical ? CAREER_STAGES[profile.vertical] : null
  const emailDomainHint = orgInfo?.requiresDomainMatch
    ? "This organisation requires your organisation's work email address to register."
    : null

  async function handleCodeSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!codeFormRef.current.reportValidity()) return

    setSubmitting(true)
    try {
      const data = await api.lookupCohortCode(cohortCode)
      setOrgInfo(data)
      setStep(STEP_PROFILE)
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setStatus({ type: 'info', message: err.message })
      } else {
        setStatus({ type: 'error', message: err.message || "We couldn't find an organisation with that code." })
      }
    } finally {
      setSubmitting(false)
    }
  }

  function handleProfileChange(e) {
    const { name, value } = e.target
    setProfile((f) => ({ ...f, [name]: value }))
  }

  function handleVerticalChange(e) {
    const value = e.target.value
    setProfile((f) => ({ ...f, vertical: value, careerStage: '' }))
  }

  function handleProfileSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!profileFormRef.current.reportValidity()) return

    if (profile.password !== profile.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }
    setStep(STEP_CONSENT)
  }

  function handleConsentChange(e) {
    const { name, checked } = e.target
    setConsent((c) => ({ ...c, [name]: checked }))
  }

  async function handleConsentSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!consentFormRef.current.reportValidity()) return

    if (!consent.processing) {
      setStatus({ type: 'error', message: 'Consent to processing your assessment data is required to continue.' })
      return
    }

    setSubmitting(true)
    try {
      await api.register({
        cohortCode,
        fullName: profile.fullName,
        email: profile.email,
        password: profile.password,
        vertical: profile.vertical,
        careerStage: profile.careerStage,
        experience: profile.experience,
        department: profile.department || undefined,
        consent: {
          processing: consent.processing,
          facilitator: consent.facilitator,
          orgAdmin: consent.orgAdmin,
        },
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
          <span className="eyebrow"><span className="dot"></span> Account created</span>
          <h2>One more step</h2>
          <p>Check your email to verify your address before your first login.</p>
        </aside>
        <div className="auth-main">
          <div className="auth-card">
            <h1>Check your email</h1>
            <div className="status-msg success" style={{ display: 'block' }} role="status">
              Account created. Check your email to verify your address before logging in.
            </div>
            <p className="form-footer-link">
              Already verified? <Link to="/login" className="link-accent">Log in</Link>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow"><span className="dot"></span> Step {step} of 3</span>
        <h2>Begin your Emotional Stability Under Pressure profile</h2>
        <p>Your professional context shapes the scenarios you'll see — this is the only place you'll set it.</p>
        <ul className="auth-aside-list">
          <li><span className="ico" aria-hidden="true">1</span> Full assessment takes about 50 minutes, and your progress is saved as you go.</li>
          <li><span className="ico" aria-hidden="true">2</span> No dimension names or scoring logic are shown before or during the assessment.</li>
          <li><span className="ico" aria-hidden="true">3</span> Your individual score stays private unless you explicitly consent to share it.</li>
        </ul>
      </aside>

      <div className="auth-main">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p className="subtitle">Already registered? <Link to="/login" className="link-accent">Log in instead</Link>.</p>

          {status && (
            <div className={`status-msg ${status.type === 'error' ? 'error' : 'success'}`} style={{ display: 'block' }} role="status">
              {status.message}
            </div>
          )}

          {step === STEP_CODE && (
            <form ref={codeFormRef} onSubmit={handleCodeSubmit} noValidate>
              <div className="form-note">
                <span aria-hidden="true">ⓘ</span>
                <span>Registration is by cohort code only — get this from your organisation's Org Admin.</span>
              </div>

              <div className="field">
                <label htmlFor="cohortCode">Cohort code</label>
                <input
                  className="input" type="text" id="cohortCode" name="cohortCode"
                  placeholder="e.g. ABCD240926EF" required autoFocus
                  value={cohortCode} onChange={(e) => setCohortCode(e.target.value)}
                />
                <span className="hint">Your organisation's Org Admin has this code.</span>
              </div>

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
                {submitting ? 'Checking code…' : 'Continue'}
              </button>

              <p className="form-footer-link">
                Registering on behalf of your organisation? <Link to="/org-register" className="link-accent">Register your organisation instead</Link>.
              </p>
            </form>
          )}

          {step === STEP_PROFILE && (
            <form ref={profileFormRef} onSubmit={handleProfileSubmit} noValidate>
              <div className="form-note">
                <span aria-hidden="true">ⓘ</span>
                <span>Registering under <strong>{orgInfo?.organisationName}</strong>. {emailDomainHint}</span>
              </div>

              <div className="field">
                <label htmlFor="fullName">Full name</label>
                <input
                  className="input" type="text" id="fullName" name="fullName"
                  placeholder="e.g. Priya Raman" autoComplete="name" required
                  value={profile.fullName} onChange={handleProfileChange}
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  className="input" type="email" id="email" name="email"
                  placeholder="you@company.com" autoComplete="email" required
                  value={profile.email} onChange={handleProfileChange}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input
                    className="input" type="password" id="password" name="password"
                    autoComplete="new-password" required minLength={8}
                    value={profile.password} onChange={handleProfileChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <input
                    className="input" type="password" id="confirmPassword" name="confirmPassword"
                    autoComplete="new-password" required minLength={8}
                    value={profile.confirmPassword} onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="vertical">Your professional context</label>
                <select
                  className="input" id="vertical" name="vertical" required
                  value={profile.vertical} onChange={handleVerticalChange}
                >
                  <option value="" disabled>Select your professional context</option>
                  <option value="IT_TECH">IT and Technology Services</option>
                  <option value="EDUCATION">Education and Academic Institutions</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="careerStage">
                  {careerStageConfig ? careerStageConfig.label : 'Which best describes where you are in your career?'}
                </label>
                <select
                  className="input" id="careerStage" name="careerStage" required
                  disabled={!careerStageConfig}
                  value={profile.careerStage} onChange={handleProfileChange}
                >
                  <option value="" disabled>
                    {careerStageConfig ? 'Select an option' : 'Select your professional context first'}
                  </option>
                  {careerStageConfig?.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {careerStageConfig && <span className="hint">{careerStageConfig.hint}</span>}
              </div>

              <div className="field">
                <label htmlFor="experience">Years of professional experience</label>
                <select
                  className="input" id="experience" name="experience" required
                  value={profile.experience} onChange={handleProfileChange}
                >
                  <option value="" disabled>Select a range</option>
                  {EXPERIENCE_RANGES.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="department">Sector or department <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                <input
                  className="input" type="text" id="department" name="department"
                  placeholder="e.g. Engineering, Computer Science Dept."
                  value={profile.department} onChange={handleProfileChange}
                />
              </div>

              <div className="wizard-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(STEP_CODE)}>Back</button>
                <button type="submit" className="btn btn-primary btn-lg">Continue</button>
              </div>
            </form>
          )}

          {step === STEP_CONSENT && (
            <form ref={consentFormRef} onSubmit={handleConsentSubmit} noValidate>
              <fieldset>
                <legend>Consent</legend>

                <div className="checkbox-row required">
                  <input
                    type="checkbox" id="consentProcessing" name="processing" required
                    checked={consent.processing} onChange={handleConsentChange}
                  />
                  <label htmlFor="consentProcessing">
                    I consent to my assessment responses being processed to generate my profile and report, in line with the DPDP Act 2023.
                  </label>
                </div>

                <div className="checkbox-row">
                  <input
                    type="checkbox" id="consentFacilitator" name="facilitator"
                    checked={consent.facilitator} onChange={handleConsentChange}
                  />
                  <label htmlFor="consentFacilitator">
                    I consent to my organisation's facilitator seeing my profile and scores.
                  </label>
                </div>

                <div className="checkbox-row">
                  <input
                    type="checkbox" id="consentOrgAdmin" name="orgAdmin"
                    checked={consent.orgAdmin} onChange={handleConsentChange}
                  />
                  <label htmlFor="consentOrgAdmin">
                    I consent to my organisation's Org Admin seeing my profile and scores.
                  </label>
                </div>

                <p className="hint">
                  Declining the facilitator or Org Admin consent above changes nothing about the report you receive yourself — it only controls who else can see it.
                </p>
              </fieldset>

              <div className="wizard-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setStep(STEP_PROFILE)}>Back</button>
                <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                  {submitting ? 'Creating account…' : 'Create account & continue'}
                </button>
              </div>

              <p className="form-footer-link">By registering you agree to the <a href="#" className="link-accent">Terms of use</a> and <a href="#" className="link-accent">Privacy policy</a>.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
