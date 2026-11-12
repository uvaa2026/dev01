import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import useScrollToHash from '../lib/useScrollToHash.js'
import { api, ApiError } from '../lib/api.js'
import heroImage from '../assets/home-hero.jpg'
import founderPhoto from '../assets/hero-profile.jpg'

// Home is the ENTIRE site now — a single long page, content supplied by
// Marketing ("UVAA — Single-Page Website Content", received 2026-11-10,
// 18 sections). WhyUvaa.jsx, Framework.jsx, TheAssessment.jsx,
// WhatYouGet.jsx, ForOrganisations.jsx, PrivacyData.jsx,
// WhatUvaaDoesNotClaim.jsx and TalkToUs.jsx are retired — their content is
// folded into the matching section below and every internal link now
// points at an anchor on this page instead of a separate route. The page
// files themselves are left on disk (same as the retired frontend scoring
// data files from the security pass) since this session can't delete
// files on your machine — delete them yourself whenever convenient:
//   uvaa-webapp/src/pages/WhyUvaa.jsx
//   uvaa-webapp/src/pages/Framework.jsx
//   uvaa-webapp/src/pages/TheAssessment.jsx
//   uvaa-webapp/src/pages/WhatYouGet.jsx
//   uvaa-webapp/src/pages/ForOrganisations.jsx
//   uvaa-webapp/src/pages/PrivacyData.jsx
//   uvaa-webapp/src/pages/WhatUvaaDoesNotClaim.jsx
//   uvaa-webapp/src/pages/TalkToUs.jsx
//
// Anchor map (also drives Header.jsx's nav and the old-route redirects in
// App.jsx): #challenge, #about-uvaa, #assessment, #capacities,
// #distinction, #results, #what-you-receive, #how-it-works,
// #development-approach, #who-for, #privacy, #framework-story, #about-us,
// #faq, #pilot, #contact.
//
// Section 18 ("Final Brand Statement and Footer") is rendered as the last
// block of THIS page's own content (.brand-footer below), not as a change
// to the global Footer.jsx — that component's small floating link menu
// still appears on every other route (login, assessment, admin, …) and is
// untouched.
export default function Welcome() {
  useScrollToHash()
  const { isAuthenticated, user } = useAuth()
  const destination = user?.isAdmin ? '/admin/users' : '/my-page'
  const destinationLabel = user?.isAdmin ? 'Go to Admin' : 'Go to My Page'

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
              Decision-Making Under Pressure.
            </h1>
            <p className="hero-wide-desc">
              <strong>Knowing what to do isn't the same as doing it when it matters.</strong>{' '}
              Pressure, uncertainty and emotion change how even good leaders respond.
            </p>
            <p className="hero-wide-desc">
              UVAA is a scenario-based leadership assessment that separates{' '}
              <strong>core orientation</strong> from <strong>decision quality</strong> &mdash;
              giving you a pattern, a development focus, and a plan.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
              {isAuthenticated ? (
                <Link to={destination} className="hero-wide-cta">{destinationLabel} <b>&rarr;</b></Link>
              ) : (
                <>
                  <Link to="#assessment" className="hero-wide-cta">Discover How UVAA Works <b>&rarr;</b></Link>
                  <Link to="#contact" className="btn btn-ghost btn-lg">Talk to us</Link>
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
              <h3>scenarios with three choices</h3>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge">4</div>
              <h3>decision capacities</h3>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge">9</div>
              <h3>decision patterns</h3>
            </div>
            <div className="stat-circle">
              <div className="stat-circle-badge stat-circle-badge-word">~45 min</div>
              <h3>one sitting</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Everything below the hero sits on its own opaque
          dark backdrop so the fixed wave/mountain page background doesn't
          show through on Home. ============ */}
      <div className="home-body">

      {/* ============================================================
          SECTION 2 — THE CHALLENGE
          ============================================================ */}
      <section id="challenge" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">THE LEADERSHIP CHALLENGE</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Knowing Is Not the Same as Doing.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            Leadership is tested by the choices people make when things get difficult &mdash;
            not just by what they know. Four familiar ways that goes wrong:
          </p>

          <div className="dimension-grid">
            <div className="card">
              <h3>01 &mdash; Decisions That Arrive Too Late</h3>
              <p>Right in principle, but it loses its value once the moment has passed.</p>
            </div>
            <div className="card">
              <h3>02 &mdash; Wrong Calls Under Emotion</h3>
              <p>How the moment felt outweighed what the evidence said.</p>
            </div>
            <div className="card">
              <h3>03 &mdash; Positions Held Too Long</h3>
              <p>Doubling down on a bad call rather than admitting it.</p>
            </div>
            <div className="card">
              <h3>04 &mdash; Escalations Under Pressure</h3>
              <p>Reacting to the pressure instead of the actual problem.</p>
            </div>
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            It's not what a leader knows &mdash; it's how they judge when pressure rises.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 3 — INTRODUCING UVAA
          ============================================================ */}
      <section id="about-uvaa" className="editorial-hero">
        <div className="container">
          <p className="editorial-label center">A DIFFERENT PERSPECTIVE ON LEADERSHIP ASSESSMENT</p>
          <h2 className="editorial-statement">What Is UVAA?</h2>
          <p className="editorial-lead">
            A structured, scenario-based assessment of judgment under pressure &mdash; not
            another personality profile. UVAA focuses on two distinct dimensions:
          </p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="triple-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 820, margin: '0 auto' }}>
            <div className="card">
              <h3>Core Orientation</h3>
              <p>The underlying orientation from which an individual tends to approach situations.</p>
            </div>
            <div className="card">
              <h3>Decision Quality</h3>
              <p>How an individual's choices are assessed across four capacities associated with
                decision-making under pressure.</p>
            </div>
          </div>

          <p className="overview-copy" style={{ margin: '32px auto', textAlign: 'center' }}>
            UVAA reads these two dimensions together through a nine-pattern framework &mdash;
            showing where composure and judgment come apart, and what to develop first.
          </p>

          <div className="section-head">
            <h2>Why does the distinction matter?</h2>
          </div>
          <div className="dimension-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="card">
              <p>Composed on the surface, inconsistent in the choices that matter.</p>
            </div>
            <div className="card">
              <p>Highly driven, but quick to skip past the evidence.</p>
            </div>
            <div className="card">
              <p>Reserved in style, yet steady where it counts.</p>
            </div>
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            Orientation is one part of the story. Decision quality is another. UVAA looks at the
            relationship between them.
          </p>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 32 }}>
            <Link to="#assessment" className="btn btn-primary btn-lg">Explore the UVAA Assessment</Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4 — THE ASSESSMENT
          ============================================================ */}
      <section id="assessment" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">THE INSTRUMENT</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            47 Situations. Three Choices. A Structured View of Judgment. No Rating Scales.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            Every question presents a situation and three possible responses &mdash; no
            agree/disagree statements, no rating sliders. Just the choice you'd actually make.
          </p>

          <div className="section-head">
            <h2>How the assessment is organized</h2>
          </div>
          <div className="evidence-strip">
            <div className="evidence-item">
              <span className="evidence-num">15 questions</span>
              <span className="evidence-label">Core Orientation &mdash; examine the participant's underlying orientation.</span>
            </div>
            <div className="evidence-item">
              <span className="evidence-num">32 questions</span>
              <span className="evidence-label">Decision Quality &mdash; examine decision choices across four capacities.</span>
            </div>
            <div className="evidence-item">
              <span className="evidence-num">One sitting</span>
              <span className="evidence-label">Approximately 45 minutes. Participants complete the assessment in a single session.</span>
            </div>
          </div>

          <div className="section-head">
            <h2>What happens after the assessment?</h2>
            <p>
              Your Decision Quality Index, four capacity scores and a decision pattern &mdash;
              a structured starting point for understanding your tendencies and what to develop.
            </p>
          </div>

          <p className="closing-statement">
            Not another personality label. A structured interpretation of decision choices.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 5 — THE FOUR CAPACITIES
          ============================================================ */}
      <section id="capacities">
        <div className="container">
          <p className="editorial-label center">THE UVAA FRAMEWORK</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Four Capacities. One More Complete View of Decision Tendencies.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            Four complementary capacities &mdash; how emotion, uncertainty, pressure and
            attachment shape judgment.
          </p>

          <div className="dimension-grid">
            <div className="card">
              <div className="card-icon">&#9680;</div>
              <h3>01 &mdash; Upeksha</h3>
              <span className="sanskrit">Emotional Balance</span>
              <p className="card-question">When the stakes are emotional, can the evidence still be weighed fairly?</p>
              <p>Measures whether the emotional weight of good or bad news distorts how fairly
                a situation gets evaluated.</p>
              <p className="card-focus"><strong>Assessment focus:</strong> Balanced consideration of positive and negative signals.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9672;</div>
              <h3>02 &mdash; Viveka</h3>
              <span className="sanskrit">Clarity in Complexity</span>
              <p className="card-question">When the answer is uncertain, can what matters most still be recognized?</p>
              <p>Examines whether someone sits with uncertainty long enough to reach a considered
                judgment, rather than rushing to the familiar answer.</p>
              <p className="card-focus"><strong>Assessment focus:</strong> Discernment amid complexity and uncertainty.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9889;</div>
              <h3>03 &mdash; Anuvigna</h3>
              <span className="sanskrit">Pressure Non-Reactivity</span>
              <p className="card-question">When the pressure rises, is the response directed at the problem or the immediate reaction?</p>
              <p>Examines whether criticism, conflict or threat triggers a reaction &mdash; or a
                response to what's actually being asked.</p>
              <p className="card-focus"><strong>Assessment focus:</strong> Responding to the crux, not the reaction.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9671;</div>
              <h3>04 &mdash; Anasakti</h3>
              <span className="sanskrit">Detached Decision-Making</span>
              <p className="card-question">When the evidence changes, can the decision change with it?</p>
              <p>Examines whether past effort and personal investment make it harder to change
                course when the evidence calls for it.</p>
              <p className="card-focus"><strong>Assessment focus:</strong> Reconsidering prior positions without excessive attachment.</p>
            </div>
          </div>

          <p className="overview-copy" style={{ margin: '32px auto 0', textAlign: 'center' }}>
            <strong>Together:</strong> emotional weight, complexity, reaction and attachment
            &mdash; one structured picture of how you decide.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 6 — THE DISTINCTION
          ============================================================ */}
      <section id="distinction" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">CORE ORIENTATION + DECISION QUALITY</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            How Someone Appears Is Not the Whole Picture.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            UVAA distinguishes between a person's core orientation and their assessed decision
            quality.
          </p>

          <div className="guna-grid">
            <div className="card">
              <h3>Composure</h3>
              <span className="sanskrit">A composed orientation</span>
            </div>
            <div className="card">
              <h3>Drive</h3>
              <span className="sanskrit">An action-oriented, driven orientation</span>
            </div>
            <div className="card">
              <h3>Reserve</h3>
              <span className="sanskrit">A reserved orientation</span>
            </div>
          </div>

          <p className="overview-copy" style={{ margin: '28px auto', textAlign: 'center' }}>
            Everyone has all three &mdash; what differs is the proportion, and which one a
            person works from most. None is better. Decision quality is scored separately,
            through the Decision Quality Index.
          </p>

          <div className="callout-bar" style={{ maxWidth: 780, margin: '0 auto' }}>
            <strong>Why separately?</strong> A composed orientation doesn't guarantee sound
            judgment, and a driven one doesn't rule it out. Examining both independently is what
            lets UVAA read the relationship between them.
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            Not a fixed personality type &mdash; a pattern meant to support reflection and
            development.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 7 — THE RESULTS
          ============================================================ */}
      <section id="results">
        <div className="container">
          <p className="editorial-label center">THE UVAA DECISION QUALITY INDEX</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            From Individual Choices to Interpretable Patterns.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            The four capacity scores combine into a single{' '}
            <strong>Decision Quality Index (DQI)</strong>, 0&ndash;100, grouped into
            developmental bands &mdash; not clinical diagnoses or a verdict on competence.
          </p>

          <div className="section-head">
            <h2>Beyond a Single Score</h2>
            <p>The composite score is one view; the four capacity scores add detail. UVAA then
              reads orientation against decision quality through nine patterns.</p>
          </div>

          <p className="editorial-label center" style={{ marginBottom: 16 }}>The Nine UVAA Patterns</p>
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
                  <td className="patterns-matrix-value"><span>Composed but Unanchored</span></td>
                  <td className="patterns-matrix-value"><span>Composed, Decides Unevenly</span></td>
                  <td className="patterns-matrix-value"><span>Composed and Steady</span></td>
                </tr>
                <tr>
                  <th>Drive</th>
                  <td className="patterns-matrix-value"><span>Activated and Reactive</span></td>
                  <td className="patterns-matrix-value"><span>Fast, Skips the Check</span></td>
                  <td className="patterns-matrix-value"><span>Driven by Effort</span></td>
                </tr>
                <tr>
                  <th>Reserve</th>
                  <td className="patterns-matrix-value"><span>Reserved and Withdrawn</span></td>
                  <td className="patterns-matrix-value"><span>Reserved, Decides Late</span></td>
                  <td className="patterns-matrix-value"><span>Reserved but Steady</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="overview-copy" style={{ margin: '24px auto 0', textAlign: 'center', maxWidth: '64ch' }}>
            Each pattern pairs an orientation with a decision-quality band &mdash; surfacing
            where the two diverge, and where to develop next.
          </p>

          <div className="callout-bar callout-bar-accent" style={{ maxWidth: 780, margin: '32px auto 0' }}>
            <strong>Patterns, Not Permanent Labels.</strong> An interpretation of responses on
            the day &mdash; not a fixed classification. Read it alongside the capacity scores to
            see where to start.
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8 — WHAT YOU RECEIVE
          ============================================================ */}
      <section id="what-you-receive" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">FROM ASSESSMENT TO INSIGHT</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Meaningful Results for Individuals. A Broader View for Organizations.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            UVAA provides two reporting perspectives: one for the individual participant and one
            for the organization.
          </p>

          <div className="vertical-grid">
            <div className="vertical-card">
              <h3>01 &mdash; Individual Assessment Report</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>A clearer view of your decision-making tendencies under pressure.</p>
              <p className="item-label" style={{ marginTop: 18 }}>The report includes:</p>
              <p className="item-label">Core Orientation</p>
              <p>What it supports, and where its limits are.</p>
              <p className="item-label">Decision Quality Index</p>
              <p>A composite score and band, explained.</p>
              <p className="item-label">Four Capacity Scores</p>
              <p>Emotional Balance, Clarity, Pressure Non-Reactivity, Detachment.</p>
              <p className="item-label">UVAA Decision Pattern</p>
              <p>One of nine, read against your orientation and DQI.</p>
              <p className="item-label">Development Focus</p>
              <p>Which capacity to work on first, and why.</p>
              <p style={{ marginTop: 16 }}>Yours to keep &mdash; you decide whether to share it with your employer.</p>
            </div>
            <div className="vertical-card">
              <h3>02 &mdash; Organizational Cohort Report</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Understand the group without losing sight of the individual.</p>
              <p className="item-label" style={{ marginTop: 18 }}>The report includes:</p>
              <p className="item-label">Decision Quality Distribution</p>
              <p>How DQI scores spread across the group.</p>
              <p className="item-label">Pattern Distribution</p>
              <p>How the nine patterns show up across the cohort.</p>
              <p className="item-label">Capacity-Level Insights</p>
              <p>Where the group, as a whole, may need attention.</p>
              <p className="item-label">Participation Dashboard</p>
              <p>Who's completed the assessment.</p>
              <p style={{ marginTop: 16 }}>Group patterns only &mdash; individual scores are shared only with that
                participant's consent.</p>
            </div>
          </div>

          <div className="callout-bar" style={{ maxWidth: 820, margin: '32px auto 0' }}>
            <strong>One assessment. Two perspectives.</strong> Personal insight for the
            individual; structured, cohort-level patterns for the organization.
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9 — THE DEVELOPMENT JOURNEY
          ============================================================ */}
      <section id="how-it-works">
        <div className="container">
          <p className="editorial-label center">BEYOND THE REPORT</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Assessment Is the Starting Point. Development Is the Opportunity.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            An assessment identifies what to pay attention to. What happens next is a five-step
            pathway.
          </p>

          <div className="journey">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Assess</h4>
              <p>The structured, scenario-based assessment &mdash; scored for orientation and
                decision quality.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Report</h4>
              <p>Individual results to the participant; cohort-level reporting to the
                organization.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Plan</h4>
              <p>A development plan built around your own capacities and pattern &mdash; not a
                generic one.</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Coach</h4>
              <p>Optional coaching, focused on the capacities the plan identifies.</p>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <h4>Reassess</h4>
              <p>A later check-in measures movement, capacity by capacity.</p>
            </div>
          </div>

          <div className="journey-note">
            <h4>A Development Pathway, Not a One-Size-Fits-All Program.</h4>
            <p>
              Most assessments end at the report, with no way to tell if anything moved. A
              repeatable instrument is what turns that into a programme.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 10 — THE THREE-LAYER DEVELOPMENT APPROACH
          ============================================================ */}
      <section id="development-approach" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span> TARGETED DEVELOPMENT</span>
            <h2>Different Patterns May Call for Different Development Approaches</h2>
            <p>UVAA's development framework considers three complementary layers.</p>
          </div>

          <div className="triple-grid">
            <div className="card">
              <h3>Cognitive</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>How You Understand</p>
              <p>How you frame a situation and read the information in it.</p>
            </div>
            <div className="card">
              <h3>Behavioural</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>How You Respond</p>
              <p>What you actually do at the point of pressure.</p>
            </div>
            <div className="card">
              <h3>Practice</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>What You Strengthen Over Time</p>
              <p>Building the underlying capacity through sustained practice, not a one-off
                technique.</p>
            </div>
          </div>

          <div className="callout-bar callout-bar-accent" style={{ maxWidth: 820, margin: '32px auto 0' }}>
            <strong>Development Begins with Understanding the Pattern.</strong> Attention goes
            where the pattern points &mdash; not the same support for everyone.
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 11 — WHO UVAA IS FOR
          ============================================================ */}
      <section id="who-for">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><span className="dot"></span> DESIGNED FOR LEADERSHIP DEVELOPMENT</span>
            <h2>For Those Who Lead. And Those Who Develop Leaders</h2>
            <p>UVAA doesn't count the years &mdash; it weighs the choices you made and who they
              affected. Three versions, matched to scope:</p>
          </div>

          <div className="triple-grid">
            <div className="card">
              <h3>Leading a Team or Project</h3>
              <p>For professionals responsible for delivery through others, building trust and
                navigating competing expectations.</p>
            </div>
            <div className="card">
              <h3>Leading a Function</h3>
              <p>For leaders balancing the needs of several teams, resources, people and clients.</p>
            </div>
            <div className="card">
              <h3>Leading a Business Unit</h3>
              <p>For leaders accountable for direction, consequential trade-offs and organizational
                outcomes.</p>
            </div>
          </div>

          <div className="callout-bar" style={{ maxWidth: 820, margin: '32px auto 0' }}>
            <strong>For Business Sponsors, HR and L&amp;D Teams</strong> &mdash; a structured way
            to talk about leadership development priorities, with participants in control of
            their own results.
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            Team, function or business unit &mdash; decision-making under pressure is the same
            challenge.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 12 — PRIVACY AND RESPONSIBLE USE
          ============================================================ */}
      <section id="privacy" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">DEVELOPMENT FIRST. PRIVACY BY DESIGN.</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Personal Insight Should Remain Personal.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            UVAA is designed for leadership development, with individual privacy and consent
            central to the reporting approach.
          </p>

          <div className="triple-grid">
            <div className="card">
              <h3>Your Report Belongs to You</h3>
              <p>Each participant receives their individual assessment report directly.</p>
            </div>
            <div className="card">
              <h3>Sharing Is a Choice</h3>
              <p>Scores aren't automatically shared with your employer. Declining doesn't limit
                your own access to your report.</p>
            </div>
            <div className="card">
              <h3>Consent Is Specific</h3>
              <p>Explicit consent governs access to your information, facilitators included.</p>
            </div>
            <div className="card">
              <h3>Organizations Receive Cohort Insights</h3>
              <p>Group-level patterns, without requiring every individual result.</p>
            </div>
            <div className="card">
              <h3>Minimal Employee Data Transfer</h3>
              <p>Access runs on group size and participant tokens &mdash; not a full employee
                roster.</p>
            </div>
            <div className="card">
              <h3>Intended for Development</h3>
              <p>It is not a clinical assessment and does not diagnose mental-health conditions.</p>
            </div>
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            The purpose is understanding and development - not labelling, judging or
            penalizing individuals.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 13 — ABOUT THE FRAMEWORK
          ============================================================ */}
      <section id="framework-story">
        <div className="container">
          <p className="editorial-label center">THE THINKING BEHIND UVAA</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            An Old Question. A New Approach.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            Sound judgment under pressure is an old question &mdash; explored through philosophy,
            psychology and decision research.
          </p>

          <p className="overview-copy" style={{ margin: '0 auto 24px', textAlign: 'center', maxWidth: '68ch' }}>
            UVAA draws on <em>Sthitaprajna</em>, the Bhagavad Gita's description of steady
            judgment, alongside decision research on loss aversion, ambiguity aversion and
            sunk-cost thinking &mdash; translated into a structured, scenario-based assessment.
          </p>

          <div className="guna-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="card">
              <h3>Upeksha</h3>
              <span className="sanskrit">Emotional Balance</span>
            </div>
            <div className="card">
              <h3>Viveka</h3>
              <span className="sanskrit">Clarity in Complexity</span>
            </div>
            <div className="card">
              <h3>Anuvigna</h3>
              <span className="sanskrit">Pressure Non-Reactivity</span>
            </div>
            <div className="card">
              <h3>Anasakti</h3>
              <span className="sanskrit">Detached Decision-Making</span>
            </div>
          </div>

          <div className="callout-bar" style={{ maxWidth: 820, margin: '32px auto 0' }}>
            <strong>Grounded in Research. Being Tested in Practice.</strong> The theory explains
            the thinking; reliability and real-world relevance are still being evaluated through
            pilot engagements.
          </div>

          <p className="overview-copy" style={{ margin: '20px auto 0', textAlign: 'center', fontSize: '0.85rem' }}>
            Indian Patent Application No. 202641076718, published 3 July 2026, Publication No. 27/2026.
          </p>
        </div>
      </section>

      {/* ============================================================
          SECTION 14 — THE FOUNDER
          ============================================================ */}
      <section id="about-us" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">THE PERSON BEHIND UVAA</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center', marginBottom: 40 }}>
            Meet Dr. Sayee Bhuvaneswari.
          </h2>

          <div className="founder-grid">
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
                <a href="mailto:sayee@dheemerconsulting.com" className="btn btn-primary">Connect With Dr. Sayee</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 15 — FREQUENTLY ASKED QUESTIONS
          ============================================================ */}
      <section id="faq">
        <div className="container">
          <p className="editorial-label center">COMMON QUESTIONS</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Understanding UVAA
          </h2>

          <div className="faq-list" style={{ marginTop: 32 }}>
            <details className="faq-item">
              <summary>Is UVAA a personality test?</summary>
              <p>No. UVAA doesn't assign fixed personality types. It evaluates core orientation
                and decision quality separately, then reads the relationship through the
                four-capacity, nine-pattern framework.</p>
            </details>
            <details className="faq-item">
              <summary>How long does the assessment take?</summary>
              <p>Approximately 45 minutes in one sitting. The instrument contains 47
                scenario-based questions, each presenting three possible courses of action.</p>
            </details>
            <details className="faq-item">
              <summary>What does UVAA measure?</summary>
              <p>Core orientation, plus four decision capacities: Emotional Balance, Clarity,
                Pressure Non-Reactivity and Detachment &mdash; combined into a Decision Quality
                Index and one of nine patterns.</p>
            </details>
            <details className="faq-item">
              <summary>Does UVAA measure how someone actually behaves at work?</summary>
              <p>No. It examines choices in structured scenarios, which offer insight into
                tendencies &mdash; but aren't the same as observing real workplace behavior. That
                link requires further validation.</p>
            </details>
            <details className="faq-item">
              <summary>What does an organization receive?</summary>
              <p>Organizations receive cohort-level reporting, including DQI distribution, pattern
                spread and development-related insights. Individual scores are not automatically
                disclosed to employers.</p>
            </details>
            <details className="faq-item">
              <summary>Is the assessment suitable for recruitment or promotion decisions?</summary>
              <p>No. UVAA is intended for leadership development, not a tool for determining
                hiring, promotion or termination outcomes &mdash; though it can complement those
                decisions.</p>
            </details>
            <details className="faq-item">
              <summary>Is UVAA a mental-health assessment?</summary>
              <p>No. UVAA is not a clinical diagnostic tool and does not assess or diagnose
                mental-health conditions.</p>
            </details>
            <details className="faq-item">
              <summary>Does every participant need coaching?</summary>
              <p>No. Assessment and reporting are the starting point. Development plan,
                coaching and reassessment are optional.</p>
            </details>
            <details className="faq-item">
              <summary>Can UVAA track changes over time?</summary>
              <p>Yes, through reassessment at a defined interval, compared against your
                baseline &mdash; though a score change isn't automatic proof of improved
                real-world decision-making.</p>
            </details>
            <details className="faq-item">
              <summary>How do we get started?</summary>
              <p>Begin with a conversation. We can walk you through the assessment, show you a
                sample report and discuss what an initial pilot could look like for your
                organization.</p>
            </details>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 16 — THE PILOT INVITATION
          ============================================================ */}
      <section id="pilot" style={{ paddingTop: 0 }}>
        <div className="container">
          <p className="editorial-label center">EXPLORE UVAA FOR YOUR ORGANIZATION</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Worth a Conversation Before It Is Worth a Cohort.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            You don't need to commit to a full program to see whether UVAA fits. Start by
            exploring the instrument and its outputs.
          </p>

          <div className="section-head">
            <h2>In an initial conversation, we can:</h2>
          </div>
          <ul className="auth-aside-list" style={{ maxWidth: 560, margin: '0 auto' }}>
            <li><span className="ico" aria-hidden="true">1</span> Understand your organization's leadership development priorities.</li>
            <li><span className="ico" aria-hidden="true">2</span> Walk you through the UVAA assessment and four-capacity framework.</li>
            <li><span className="ico" aria-hidden="true">3</span> Show you what an individual and cohort report looks like.</li>
            <li><span className="ico" aria-hidden="true">4</span> Explain the privacy and consent approach.</li>
            <li><span className="ico" aria-hidden="true">5</span> Discuss a potential pilot for your team.</li>
          </ul>

          <p className="overview-copy" style={{ margin: '28px auto 0', textAlign: 'center' }}>
            An initial pilot would typically involve approximately 10&ndash;30 participants, with
            the scope agreed according to your organization's needs.
          </p>

          <p className="closing-statement" style={{ marginTop: 24 }}>
            See what UVAA examines. Understand what it reports. Then decide whether a pilot makes
            sense.
          </p>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 32 }}>
            <Link to="#contact" className="btn btn-primary btn-lg">Schedule a UVAA Walkthrough</Link>
            <Link to="#contact" className="btn btn-ghost btn-lg">Ask About a Pilot</Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 17 — CONTACT
          ============================================================ */}
      <section id="contact">
        <div className="container">
          <p className="editorial-label center">LET'S START A CONVERSATION</p>
          <h2 className="editorial-statement" style={{ textAlign: 'center' }}>
            Curious About What UVAA Could Reveal?
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            Lead a business, HR or L&amp;D? We'd welcome a conversation &mdash; tell us a little
            about your organization and what you'd like to explore.
          </p>

          <div className="result-card" style={{ maxWidth: 640, margin: '32px auto 0' }}>
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
                    <label htmlFor="contactFullName">Full Name</label>
                    <input
                      className="input" type="text" id="contactFullName" name="fullName"
                      placeholder="Your name" required
                      value={contact.fullName} onChange={handleContactChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="contactWorkEmail">Work Email</label>
                    <input
                      className="input" type="email" id="contactWorkEmail" name="workEmail"
                      placeholder="you@company.com" required
                      value={contact.workEmail} onChange={handleContactChange}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="contactOrganisation">Organization</label>
                  <input
                    className="input" type="text" id="contactOrganisation" name="organisation"
                    placeholder="Company name" required
                    value={contact.organisation} onChange={handleContactChange}
                  />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="contactRole">Your Role</label>
                    <select
                      className="input" id="contactRole" name="role" required
                      value={contact.role} onChange={handleContactChange}
                    >
                      <option value="" disabled>Select your role</option>
                      {CONTACT_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="contactInterest">What Would You Like to Explore?</label>
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
                  <label htmlFor="contactMessage">Message</label>
                  <textarea
                    className="input" id="contactMessage" name="message" rows={4}
                    placeholder="Tell us a little about your organization, your leadership development priorities, or any questions you have."
                    value={contact.message} onChange={handleContactChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={contactSubmitting}>
                  {contactSubmitting ? 'Sending…' : 'Start the Conversation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 18 — FINAL BRAND STATEMENT AND FOOTER
          (part of this page's own content — the global floating
          Footer.jsx component still renders separately below, on every
          route, unchanged.)
          ============================================================ */}
      <footer className="brand-footer">
        <div className="container">
          <p className="brand-footer-logo">UVAA</p>
          <p className="brand-footer-tagline">Decision-making Under Pressure.</p>
          <p className="brand-footer-desc">
            A development-focused leadership decision assessment examining the relationship
            between core orientation and decision quality.
          </p>
          <p className="brand-footer-caps">Upeksha &middot; Viveka &middot; Anuvigna &middot; Anasakti</p>
          <p className="brand-footer-credit">Developed by Dr. Sayee Bhuvaneswari.</p>

          <nav className="brand-footer-nav" aria-label="Footer">
            <Link to="#challenge">The Challenge</Link>
            <Link to="#assessment">The Assessment</Link>
            <Link to="#capacities">Four Capacities</Link>
            <Link to="#what-you-receive">Reports</Link>
            <Link to="#about-us">About</Link>
            <Link to="#contact">Contact</Link>
          </nav>

          <p className="brand-footer-legal-links">
            <a href="#">Privacy Policy</a>{' · '}<a href="#">Terms of Use</a>
          </p>

          <div className="brand-footer-notice">
            <strong>Important Notice:</strong> UVAA is intended for leadership development. It is
            not a clinical diagnostic instrument and should not be used for hiring, promotion or
            termination decisions. Assessment results must be interpreted within the limitations
            of the instrument.
          </div>

          <p className="brand-footer-copyright">&copy; 2026 UVAA. All rights reserved.</p>

          <div className="hero-actions" style={{ justifyContent: 'center' }}>
            <Link to="#contact" className="hero-wide-cta" style={{ display: 'inline-flex' }}>Explore a UVAA Pilot <b>&rarr;</b></Link>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
