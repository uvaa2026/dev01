import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError } from '../lib/api.js'
import { CAREER_STAGES, EXPERIENCE_RANGES } from '../data/careerStages.js'

const INITIAL_FORM = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  organisation: '',
  vertical: '',
  careerStage: '',
  experience: '',
  department: '',
  consentAssessment: false,
  consentResearch: false,
  consentShare: false,
}

export default function Register() {
  const formRef = useRef(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const careerStageConfig = form.vertical ? CAREER_STAGES[form.vertical] : null

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleVerticalChange(e) {
    const value = e.target.value
    setForm((f) => ({ ...f, vertical: value, careerStage: '' }))
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    updateField(name, type === 'checkbox' ? checked : value)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)

    if (!formRef.current.reportValidity()) return

    if (form.password !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    setSubmitting(true)
    try {
      await api.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        organisation: form.organisation,
        vertical: form.vertical,
        careerStage: form.careerStage,
        experience: form.experience,
        department: form.department || undefined,
        consent: {
          assessment: form.consentAssessment,
          research: form.consentResearch,
          shareWithHrAdmin: form.consentShare,
        },
      })
      setStatus({ type: 'success', message: 'Account created. Check your email to continue.' })
      setForm(INITIAL_FORM)
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

  return (
    <div className="auth-shell">
      <aside className="auth-aside">
        <span className="eyebrow"><span className="dot"></span> Two minutes to register</span>
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

          <div className="form-note">
            <span aria-hidden="true">ⓘ</span>
            <span>Have an assessment link from your HR administrator? You can still register here — it leads to the same form.</span>
          </div>

          {status && (
            <div className={`status-msg ${status.type === 'error' ? 'error' : 'success'}`} style={{ display: 'block' }} role="status">
              {status.message}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input
                className="input" type="text" id="fullName" name="fullName"
                placeholder="e.g. Priya Raman" autoComplete="name" required
                value={form.fullName} onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                className="input" type="email" id="email" name="email"
                placeholder="you@company.com" autoComplete="email" required
                value={form.email} onChange={handleChange}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  className="input" type="password" id="password" name="password"
                  autoComplete="new-password" required minLength={8}
                  value={form.password} onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  className="input" type="password" id="confirmPassword" name="confirmPassword"
                  autoComplete="new-password" required minLength={8}
                  value={form.confirmPassword} onChange={handleChange}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="organisation">Organisation name</label>
              <input
                className="input" type="text" id="organisation" name="organisation"
                placeholder="e.g. Northwind Technologies" autoComplete="organization" required
                value={form.organisation} onChange={handleChange}
              />
            </div>

            <div className="field">
              <label htmlFor="vertical">Your professional context</label>
              <select
                className="input" id="vertical" name="vertical" required
                value={form.vertical} onChange={handleVerticalChange}
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
                value={form.careerStage} onChange={handleChange}
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
                value={form.experience} onChange={handleChange}
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
                value={form.department} onChange={handleChange}
              />
            </div>

            <fieldset>
              <legend>Consent</legend>
              <div className="checkbox-row required">
                <input
                  type="checkbox" id="consentAssessment" name="consentAssessment" required
                  checked={form.consentAssessment} onChange={handleChange}
                />
                <label htmlFor="consentAssessment">I consent to my assessment responses being processed to generate my profile and report, in line with the DPDP Act 2023.</label>
              </div>
              <div className="checkbox-row">
                <input
                  type="checkbox" id="consentResearch" name="consentResearch"
                  checked={form.consentResearch} onChange={handleChange}
                />
                <label htmlFor="consentResearch">I consent to my anonymised responses being used for research validation of the UVAA framework.</label>
              </div>
              <div className="checkbox-row">
                <input
                  type="checkbox" id="consentShare" name="consentShare"
                  checked={form.consentShare} onChange={handleChange}
                />
                <label htmlFor="consentShare">I consent to my individual score being visible to my organisation's HR administrator.</label>
              </div>
            </fieldset>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account & continue'}
            </button>

            <p className="form-footer-link">By registering you agree to the <a href="#" className="link-accent">Terms of use</a> and <a href="#" className="link-accent">Privacy policy</a>.</p>
          </form>
        </div>
      </div>
    </div>
  )
}
