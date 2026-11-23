import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import useScrollToHash from '../lib/useScrollToHash.js'
import { api, ApiError } from '../lib/api.js'
import heroImage from '../assets/home-hero.jpg'
import founderPhoto from '../assets/hero-profile.jpg'

// Home is the entire site, rebuilt per "UVAA Website Corporate Refresh
// Brief" (Oct 2026): the previous 18-section page read as a 10-minute
// scroll when the buyer (a CHRO/L&D head) scans for about 30 seconds.
// This cuts it to 7 sections — one headline, one line and one visual
// each — folding several old sections together:
//   1. Hero                     (unchanged structure, tightened copy)
//   2. The problem               (was "The Challenge")
//   3. What UVAA measures        (was "About UVAA" + "The Assessment" +
//                                  "Four Capacities" + "The Distinction" +
//                                  "The Results"/nine-pattern table +
//                                  half of "Framework Story")
//   4. What you get               (was "What You Receive" + "Who UVAA Is
//                                  For"'s three-scope cards, now a strip)
//   5. From insight to practice   (was "The Development Journey" +
//                                  "Development Approach", journey-note
//                                  dropped per brief's visual note)
//   6. Trust and privacy          (was "Privacy and Responsible Use" +
//                                  the other half of "Framework Story" +
//                                  "The Founder")
//   7. Pilot and contact          (was "The Pilot Invitation" + "Contact"
//                                  + "FAQ" (9 -> 6 items) + the brand
//                                  footer, folded into one section)
//
// Anchor map (also drives Header.jsx's nav and the old-route redirects in
// App.jsx): #problem, #what-uvaa-measures, #what-you-get, #how-it-works,
// #privacy, #pilot, #faq, #contact. #privacy/#how-it-works/#pilot/#faq/
// #contact are the SAME ids the old page used, kept deliberately so
// Footer.jsx's floating link menu (/#privacy) and any bookmarked links
// don't need to change.
//
// Icons: the brief asks to replace the mixed symbols (◐ ◈ ⚡ ◇) with "one
// set of line icons in a single stroke weight" — LineIcon below renders
// each from a small hand-drawn path/primitive set rather than pulling in
// an icon library, so every icon shares exactly one stroke width/style.
const ICONS = {
  clock: () => (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>),
  pulse: () => (<path d="M3 12h4l2 7 4-14 2 7h6" />),
  lock: () => (<><rect x="6" y="11" width="12" height="9" rx="1.6" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>),
  bolt: () => (<path d="M13 3 6 14h5l-1 7 7-11h-5l1-7Z" />),
  scale: () => (<path d="M12 3v3M12 6l-6 11M12 6l6 11M4 17a2.3 2.3 0 0 0 4 0M16 17a2.3 2.3 0 0 0 4 0M4 21h16" />),
  eye: () => (<><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.6" /></>),
  target: () => (<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></>),
  openHand: () => (<path d="M7 12V6.5a1.8 1.8 0 0 1 3.6 0V11M10.6 11V5a1.8 1.8 0 0 1 3.6 0v6M14.2 11V7a1.8 1.8 0 0 1 3.6 0v6.5c0 3.6-2.4 6-6 6h-1a5.6 5.6 0 0 1-4.6-2.4l-2.6-3.7a1.4 1.4 0 0 1 2.3-1.6L7 14" />),
  person: () => (<><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></>),
  group: () => (<><circle cx="9" cy="9" r="3.2" /><circle cx="17" cy="10" r="2.6" /><path d="M2.8 19.5c0-3.1 2.8-5.5 6.2-5.5s6.2 2.4 6.2 5.5M15.5 14.3c2.5.4 4.5 2.4 4.7 4.9" /></>),
  shieldCheck: () => (<><path d="M12 3.3 19 6v5.3c0 4.6-3 7.6-7 9-4-1.4-7-4.4-7-9V6l7-2.7Z" /><path d="M9 12l2.2 2.2L15 10" /></>),
  handshake: () => (<path d="M3 10.5 7 8l3 2 3-2 4 2.5M3 10.5l3.2 6h2.6l1-1.8M21 10.5l-3.2 6h-2.6l-1-1.8M10 14.2h4" />),
  noEntry: () => (<><circle cx="12" cy="12" r="9" /><path d="M6 12h12" /></>),
}

function LineIcon({ name }) {
  const Shape = ICONS[name]
  if (!Shape) return null
  return (
    <svg className="line-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <Shape />
    </svg>
  )
}

export default function Welcome() {
  useScrollToHash()
  const { isAuthenticated, user } = useAuth()
  const destination = user?.isAdmin ? '/admin/users' : '/my-page'
  const destinationLabel = user?.isAdmin ? 'Go to Admin' : 'Go to My Page'

  const [showPatterns, setShowPatterns] = useState(false)

  const CONTACT_ROLES = [
    'Head of HR / CHRO',
    'L&D / Talent Development',
    'Business / Function Leader',
    'Consultant / Training Partner',
    'Other',
  ]
  const CONTACT_INTERESTS = [
    'Schedule an Assessment Walkthrough',
    'Review a Sample Report',
    'Discuss a Corporate Pilot',
    'Explore a Development Program',
    'Partnership / General Inquiry',
  ]
  const INITIAL_CONTACT = {
    fullName: '', workEmail: '', organisation: '', role: '', interest: '', message: '',
  }

  const contactFormRef = useRef(null)
  const [contact, setContact] = useState(INITIAL_CONTACT)
  const [contactStatus, setContactStatus] = useState(null)
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactDone, setContactDone] = useState(false)

  function handleContactChange(e) {
    const { name, value } = e.target
    setContact((f) => ({ ...f, [name]: value }))
  }

  async function handleContactSubmit(e) {
    e.preventDefault()
    setContactStatus(null)
    if (!contactFormRef.current.reportValidity()) return

    setContactSubmitting(true)
    try {
      await api.submitContactForm(contact)
      setContactDone(true)
    } catch (err) {
      setContactStatus({
        type: 'error',
        message: err instanceof ApiError ? err.message : 'Something went wrong. Please try again, or write to us directly.',
      })
    } finally {
      setContactSubmitting(false)
    }
  }

  return (
    <>
      {/* ============================================================
          SECTION 1 — HERO
          ============================================================ */}
      <section className="hero-wide" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-wide-art" aria-hidden="true"></div>
        <div className="hero-wide-shade" aria-hidden="true"></div>

        <div className="container-wide hero-wide-stage">
          <div className="hero-wide-copy">
            <p className="hero-wide-kicker">LEADERSHIP DECISION ASSESSMENT</p>
            <h1 className="hero-wide-title">
              Decision-making under pressure
            </h1>
            <p className="hero-wide-desc">
              <strong>Knowing what to do isn't the same as doing it when it matters.</strong>{' '}
              See how your leaders decide, and what to develop first.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
              {isAuthenticated ? (
                <Link to={destination} className="hero-wide-cta">{destinationLabel} <b>&rarr;</b></Link>
              ) : (
                <>
                  <Link to="#pilot" className="hero-wide-cta">Request a walkthrough <b>&rarr;</b></Link>
                  <Link to="#how-it-works" className="btn btn-ghost btn-lg">How it works</Link>
                </>
              )}
            </div>
          </div>

          <aside className="hero-wide-note" aria-hidden="true">
            <p className="hero-wide-note-head">Pressure doesn't<br />create the response.<br />It reveals it.</p>
            <div className="hero-wide-note-rule"></div>
            <p className="hero-wide-note-list">Clarity<br />Composure<br />Confidence</p>
          </aside>
        </div>

        <div className="container-wide hero-wide-metrics">
          <div className="stat-circle-row hero-wide-metrics-row">
            <div className="stat-circle">
              <div className="stat-circle-badge">47</div>
              <h3>Scenarios</h3>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge">4</div>
              <h3>Capacities</h3>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge">9</div>
              <h3>Patterns</h3>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge">45</div>
              <h3>Minutes</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Everything below the hero sits on its own opaque
          dark backdrop so the fixed wave/mountain page background doesn't
          show through on Home. ============ */}
      <div className="home-body">

      {/* ============================================================
          SECTION 2 — THE PROBLEM
          ============================================================ */}
      <section id="problem" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">THE LEADERSHIP CHALLENGE</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Good leaders still get it wrong under pressure
          </h2>

          <div className="dimension-grid">
            <div className="card">
              <div className="card-icon"><LineIcon name="clock" /></div>
              <h3>Too late</h3>
              <p>The right call, after the moment has passed.</p>
            </div>
            <div className="card">
              <div className="card-icon"><LineIcon name="pulse" /></div>
              <h3>Too emotional</h3>
              <p>The mood of the moment outweighs the evidence.</p>
            </div>
            <div className="card">
              <div className="card-icon"><LineIcon name="lock" /></div>
              <h3>Too stubborn</h3>
              <p>Doubling down instead of changing course.</p>
            </div>
            <div className="card">
              <div className="card-icon"><LineIcon name="bolt" /></div>
              <h3>Too reactive</h3>
              <p>Responding to the pressure, not the problem.</p>
            </div>
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            It is not what a leader knows. It is how they judge when pressure rises.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 3 — WHAT UVAA MEASURES
          ============================================================ */}
      <section id="what-uvaa-measures">
        <div className="container">
          <p className="editorial-label center">THE UVAA FRAMEWORK</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Four capacities of steady judgment
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            Situational Judgemental Tool with choices
          </p>

          <div className="dimension-grid">
            <div className="card">
              <div className="card-icon"><LineIcon name="scale" /></div>
              <h3>Stay fair</h3>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Emotional balance</p>
              <p>Weigh good and bad news evenly.</p>
              <span className="sanskrit">Upeksha</span>
            </div>
            <div className="card">
              <div className="card-icon"><LineIcon name="eye" /></div>
              <h3>Stay clear</h3>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Clarity in complexity</p>
              <p>Sit with uncertainty long enough to judge well.</p>
              <span className="sanskrit">Viveka</span>
            </div>
            <div className="card">
              <div className="card-icon"><LineIcon name="target" /></div>
              <h3>Stay on the problem</h3>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Pressure non-reactivity</p>
              <p>Respond to the issue, not the reaction.</p>
              <span className="sanskrit">Anudvigna</span>
            </div>
            <div className="card">
              <div className="card-icon"><LineIcon name="openHand" /></div>
              <h3>Stay open</h3>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Detached decision-making</p>
              <p>Change the decision when the evidence changes.</p>
              <span className="sanskrit">Anasakti</span>
            </div>
          </div>

          <p className="overview-copy" style={{ margin: '32px auto 0', textAlign: 'center' }}>
            UVAA also reads each leader's core orientation (composed, driven or reserved) against
            decision quality. The result is one of nine patterns.
          </p>

         {/*  <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button type="button" className="toggle-link" onClick={() => setShowPatterns((v) => !v)}
              aria-expanded={showPatterns} aria-controls="ninePatternsPanel">
              {showPatterns ? 'Hide the nine patterns' : 'See all nine patterns'}
              <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true"
                style={{ transform: showPatterns ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div> */}

         {/*  {showPatterns && (
            
          )} */}

          <div id="ninePatternsPanel" style={{ marginTop: 24 }}>
              <div className="patterns-matrix-wrap">
                <table className="patterns-matrix">
                  <thead>
                    <tr>
                      <th></th>
                      <th>At risk</th>
                      <th>Developing</th>
                      <th>Anchored</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Composure</th>
                      <td className="patterns-matrix-value"><span>Composed but unanchored</span></td>
                      <td className="patterns-matrix-value"><span>Composed, decides unevenly</span></td>
                      <td className="patterns-matrix-value"><span>Composed and steady</span></td>
                    </tr>
                    <tr>
                      <th>Drive</th>
                      <td className="patterns-matrix-value"><span>Activated and reactive</span></td>
                      <td className="patterns-matrix-value"><span>Fast, skips the check</span></td>
                      <td className="patterns-matrix-value"><span>Driven by effort</span></td>
                    </tr>
                    <tr>
                      <th>Reserve</th>
                      <td className="patterns-matrix-value"><span>Reserved and withdrawn</span></td>
                      <td className="patterns-matrix-value"><span>Reserved, decides late</span></td>
                      <td className="patterns-matrix-value"><span>Reserved but steady</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="overview-copy" style={{ margin: '20px auto 0', textAlign: 'center', maxWidth: '64ch' }}>
                Each pattern pairs an orientation with a decision-quality band — an interpretation
                of responses on the day, not a fixed label.
              </p>
            </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4 — WHAT YOU GET
          ============================================================ */}
      <section id="what-you-get" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">FROM ASSESSMENT TO INSIGHT</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            One assessment - Two views
          </h2>

          <div className="vertical-grid">
            <div className="vertical-card">
              <div className="icon-circle"><LineIcon name="person" /></div>
              <h3>Individual view</h3>
              <p>
                Core orientation with decision quality index , four capacity scores, one pattern and a development focus. 
                The report belongs to the participant.
              </p>
            </div>
            <div className="vertical-card">
              <div className="icon-circle"><LineIcon name="group" /></div>
              <h3>Organisation view</h3>
              <p>
               Leading Team  or project, Leading a function, Leading Business unit (s).
              </p>
            </div>
          </div>

          <p className="overview-copy" style={{ margin: '28px auto 10px', textAlign: 'center' }}>
            Three versions, matched to scope:
          </p>
          <div className="pill-row">
            <span className="pill">Team or project</span>
            <span className="pill">Function</span>
            <span className="pill">Business unit</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5 — FROM INSIGHT TO PRACTICE
          ============================================================ */}
      <section id="how-it-works">
        <div className="container">
          <p className="editorial-label center">BEYOND THE REPORT</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            From insight to practice
          </h2>

          <div className="journey">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Assess</h4>
              <p>About 45 minutes, scenario-based.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Report</h4>
              <p>Private results; cohort view for the organisation.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Plan</h4>
              <p>Three layer plan build around your  pattern -what to understand, how to respond, what to practise.</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Coach</h4>
              <p>Optional, focused on the capacity that matters first.</p>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <h4>Re-assess</h4>
              <p>Measure movement, capacity by capacity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6 — TRUST AND PRIVACY
          ============================================================ */}
      <section id="privacy" style={{ paddingTop: 0 }}>
        <div className="container">
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Development first. Privacy by design.
          </h2>

          <div className="triple-grid">
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="icon-circle" style={{ margin: '0 auto 14px' }}><LineIcon name="shieldCheck" /></div>
              <h3 style={{ marginBottom: 0 }}>Your report is yours.</h3>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="icon-circle" style={{ margin: '0 auto 14px' }}><LineIcon name="handshake" /></div>
              <h3 style={{ marginBottom: 0 }}>Sharing is your choice.</h3>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <div className="icon-circle" style={{ margin: '0 auto 14px' }}><LineIcon name="noEntry" /></div>
              <h3 style={{ marginBottom: 0 }}>Not for hiring or promotion.</h3>
            </div>
          </div>

          <p className="overview-copy" style={{ margin: '28px auto 0', textAlign: 'center' }}>
            Not a clinical tool. Organisations receive group patterns only, using group size and
            participant tokens, not a full employee roster.
          </p>

          <p className="overview-copy" style={{ margin: '14px auto 0', textAlign: 'center', fontSize: '0.85rem' }}>
            Grounded in neuro-economics, Decision research and the Bhagavad Gita's idea of steady judgment{' '}
            (<em>Sthitaprajna</em>). Reliability is being tested in pilot engagements.
          </p>

          <div className="founder-grid" style={{ marginTop: 44 }}>
            <img src={founderPhoto} alt="Dr. Sayee Bhuvaneswari" className="founder-photo" />
            <div className="founder-body">
              <h3>Dr. Sayee Bhuvaneswari</h3>
              <span className="founder-credential">Founder, Dheemer Consulting &middot; Author of the UVAA Framework</span>
              <p>
                An engineer turned researcher, Dr. Sayee holds PhDs in Psychology and Economics
                and in Yogic Sciences, bringing together corporate leadership, psychology and
                Indian philosophical traditions.
              </p>
              <p>
                27 years of corporate leadership, including global roles at Hitachi and HCL,
                alongside work as a startup advisor, leadership coach and counselling
                psychologist &mdash; the foundation UVAA is built on.
              </p>
              <div className="hero-actions" style={{ justifyContent: 'flex-start', marginTop: 20 }}>
                <a href="mailto:sayee@dheemerconsulting.com" className="btn btn-primary">Connect</a>
              </div>
              <p className="founder-patent">
                Indian Patent Application No. 202641076718, published 3 July 2026 (Publication No. 27/2026).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7 — PILOT AND CONTACT
          ============================================================ */}
      <section id="pilot">
        <div className="container">
          <p className="editorial-label center">EXPLORE UVAA FOR YOUR ORGANISATION</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Start with a conversation, not a cohort.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            A typical pilot has 10 to 30 participants. Scope is agreed with you.
          </p>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 28 }}>
            <Link to="#contact" className="btn btn-primary btn-lg">Request a walkthrough</Link>
          </div>

          <div id="contact" className="result-card" style={{ maxWidth: 640, margin: '40px auto 0' }}>
            {contactDone ? (
              <div className="status-msg success" style={{ display: 'block' }} role="status">
                Thank you for reaching out to UVAA. Your inquiry has been received. We'll be in
                touch using the contact information you provided.
              </div>
            ) : (
              <form ref={contactFormRef} onSubmit={handleContactSubmit} noValidate>
                {contactStatus && (
                  <div className="status-msg error" style={{ display: 'block' }} role="alert">
                    {contactStatus.message}
                  </div>
                )}

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="contactFullName">Full name</label>
                    <input
                      className="input" type="text" id="contactFullName" name="fullName"
                      placeholder="Your name" required
                      value={contact.fullName} onChange={handleContactChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="contactWorkEmail">Work email</label>
                    <input
                      className="input" type="email" id="contactWorkEmail" name="workEmail"
                      placeholder="you@company.com" required
                      value={contact.workEmail} onChange={handleContactChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="contactOrganisation">Organisation</label>
                  <input
                    className="input" type="text" id="contactOrganisation" name="organisation"
                    placeholder="Company name" required
                    value={contact.organisation} onChange={handleContactChange}
                  />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="contactRole">Your role</label>
                    <select
                      className="input" id="contactRole" name="role" required
                      value={contact.role} onChange={handleContactChange}
                    >
                      <option value="" disabled>Select your role</option>
                      {CONTACT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="contactInterest">What would you like to explore?</label>
                    <select
                      className="input" id="contactInterest" name="interest" required
                      value={contact.interest} onChange={handleContactChange}
                    >
                      <option value="" disabled>Select an option</option>
                      {CONTACT_INTERESTS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="contactMessage">Message (optional)</label>
                  <textarea
                    className="input" id="contactMessage" name="message" rows={4}
                    placeholder="Tell us a little about your organisation, your leadership development priorities, or any questions you have."
                    value={contact.message} onChange={handleContactChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={contactSubmitting}>
                  {contactSubmitting ? 'Sending…' : 'Start the conversation'}
                </button>
              </form>
            )}
          </div>

          <div className="faq-list" id="faq" style={{ marginTop: 56 }}>
            <p className="editorial-label center" style={{ marginBottom: 20 }}>COMMON QUESTIONS</p>
            <details className="faq-item">
              <summary>Is it a personality test?</summary>
              <p>No. UVAA does not assign fixed personality types. It looks at core orientation
                and decision quality separately, then reads the relationship between them.</p>
            </details>
            <details className="faq-item">
              <summary>How long does it take?</summary>
              <p>About 45 minutes, in one sitting, across 47 scenario-based questions.</p>
            </details>
            <details className="faq-item">
              <summary>Is UVAA validated?</summary>
              <p>UVAA is grounded in established decision research. We are building its 
                reliability and validity evidence with pilot organisations, 
                and we share what we find openly.</p>
            </details>
            <details className="faq-item">
              <summary>Is it suitable for hiring or promotion?</summary>
              <p>No. UVAA is built for leadership development, not for hiring, promotion or
                termination decisions — though it can complement those decisions.</p>
            </details>
            <details className="faq-item">
              <summary>Is it a mental-health assessment?</summary>
              <p>No. It is not a clinical or diagnostic tool and does not assess or diagnose
                mental-health conditions.</p>
            </details>
            <details className="faq-item">
              <summary>What does an organisation receive?</summary>
              <p>Cohort-level reporting only — DQI distribution, pattern spread and
                development-related insights. Individual scores are not shared without consent.</p>
            </details>
            <details className="faq-item">
              <summary>How do we get started?</summary>
              <p>Start with a conversation. We'll walk you through the assessment, show you what
                a report looks like, and discuss what a pilot could look like for your
                organisation.</p>
            </details>
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL BRAND STATEMENT AND FOOTER — part of this page's own
          content; the global floating Footer.jsx component still renders
          separately below, on every route, unchanged.
          ============================================================ */}
      <footer className="brand-footer">
        <div className="container">
          <p className="brand-footer-logo">UVAA<sup class="brand-tm">™</sup></p>
          <p className="brand-footer-tagline">Decision-making under pressure</p>
          <p className="brand-footer-desc">
            UVAA is a leadership assessment that shows the gap between how a leader appears and 
            how they decide when pressure rises.
            Emotional balance  Clarity in complexity Pressure non-reactivity  Detached decision-making
          </p>
          <p className="brand-footer-caps">Upeksha &middot; Viveka &middot; Anudvigna &middot; Anasakti</p>
          <p className="brand-footer-credit">Developed by Dr. Sayee Bhuvaneswari</p>

          <nav className="brand-footer-nav" aria-label="Footer">
            <Link to="#problem">The Problem</Link>
            <Link to="#what-uvaa-measures">What UVAA Measures</Link>
            <Link to="#what-you-get">What You Get</Link>
            <Link to="#privacy">Trust &amp; Privacy</Link>
            <Link to="#contact">Contact</Link>
          </nav>

          {/* <p className="brand-footer-legal-links">
            <a href="#">Privacy Policy</a>{' · '}<a href="#">Terms of Use</a>
          </p> */}

          <div className="brand-footer-notice">
            <strong>Important notice:</strong> UVAA is for leadership development. It is not a
            clinical tool and should not be used for hiring, promotion or termination decisions.
          </div>

          <p className="brand-footer-copyright">&copy; 2026 UVAA. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </>
  )
}
