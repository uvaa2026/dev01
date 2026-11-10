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
              Judgment Under Pressure.
            </h1>
            <p className="hero-wide-desc">
              <strong>Knowing what to do is not always the same as doing it when it matters.</strong>{' '}
              A leader can understand the right course of action, yet respond differently when
              pressure, uncertainty, emotion and competing demands enter the picture.
            </p>
            <p className="hero-wide-desc">
              <strong>UVAA is a development-focused leadership decision assessment</strong> that
              examines core orientation and decision quality separately through structured,
              scenario-based choices. By exploring four decision capacities, UVAA provides
              individuals and organizations with insight into decision tendencies and potential
              areas for leadership development.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'flex-start' }}>
              {isAuthenticated ? (
                <Link to={destination} className="hero-wide-cta">{destinationLabel} <b>&rarr;</b></Link>
              ) : (
                <>
                  <Link to="#contact" className="hero-wide-cta">Explore a UVAA Pilot <b>&rarr;</b></Link>
                  <Link to="#assessment" className="btn btn-ghost btn-lg">Discover How UVAA Works</Link>
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
              <h3>scenario-based questions</h3>
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
            Leadership is tested not only by what people know, but by the choices they make when
            circumstances become difficult. The right decision can be delayed. Emotions can
            outweigh evidence. Previous commitments can become difficult to reverse. And problems
            can escalate when pressure clouds the situation. Consider four familiar leadership
            challenges.
          </p>

          <div className="dimension-grid">
            <div className="card">
              <h3>01 &mdash; Decisions That Arrive Too Late</h3>
              <p>A decision may be right in principle but lose its value because it comes after the
                moment when it could have made a difference.</p>
            </div>
            <div className="card">
              <h3>02 &mdash; Wrong Calls Under Emotion</h3>
              <p>The immediate emotional weight of a situation can overshadow relevant evidence,
                influencing a decision that might otherwise have been approached differently.</p>
            </div>
            <div className="card">
              <h3>03 &mdash; Positions Held Too Long</h3>
              <p>Leaders may continue defending an earlier decision even when new evidence suggests
                a change of course, because reversing it means acknowledging a mistake or letting go
                of a commitment.</p>
            </div>
            <div className="card">
              <h3>04 &mdash; Escalations Under Pressure</h3>
              <p>A challenging situation can escalate when the people involved react to the pressure
                without clearly identifying the underlying problem.</p>
            </div>
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            The question is not simply what a leader knows. It is how they approach judgment when
            pressure rises. And understanding that requires looking beyond personality or outward
            behavior alone.
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
            UVAA is a structured, scenario-based leadership decision assessment designed to
            examine decision tendencies relevant to judgment under pressure. Unlike broad
            personality profiling, UVAA focuses on two distinct dimensions.
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
                judgment under pressure.</p>
            </div>
          </div>

          <p className="overview-copy" style={{ margin: '32px auto', textAlign: 'center' }}>
            UVAA examines these dimensions separately and interprets their relationship through a
            nine-pattern framework. The objective is not to place people into fixed personality
            categories. It is to provide a more detailed perspective on how individuals approach
            decisions, where their assessed tendencies differ and which capacities may deserve
            developmental attention.
          </p>

          <div className="section-head">
            <h2>Why does the distinction matter?</h2>
          </div>
          <div className="dimension-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="card">
              <p>Someone may appear composed while their assessed decision choices show
                inconsistencies.</p>
            </div>
            <div className="card">
              <p>Someone who is highly driven may approach certain situations quickly without
                adequately examining competing information.</p>
            </div>
            <div className="card">
              <p>Someone who is reserved may demonstrate steady judgment despite appearing less
                immediately decisive.</p>
            </div>
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            UVAA's framework is designed to make these distinctions visible through assessment,
            rather than assuming outward orientation tells the entire story. Core orientation
            describes one aspect of the person. Decision quality examines another. The
            relationship is where UVAA looks for additional insight.
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
            47 Situations. Three Choices. A Structured View of Judgment.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            UVAA uses a scenario-based self-report assessment. Each question presents a situation
            and three possible courses of action. Participants select the response closest to how
            they would approach the situation. There are no traditional agree/disagree statements
            or rating sliders &mdash; the instrument examines the choices participants make within
            structured scenarios.
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
              UVAA applies its defined scoring model to produce a Decision Quality Index,
              capacity-level results and an interpretation of the participant's core orientation
              and decision pattern. The result is an individual assessment profile intended to
              provide a structured starting point for understanding decision tendencies and
              considering development priorities.
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
            UVAA examines decision quality through four complementary capacities. Together, they
            explore different ways emotion, uncertainty, pressure and attachment to outcomes may
            influence judgment.
          </p>

          <div className="dimension-grid">
            <div className="card">
              <div className="card-icon">&#9680;</div>
              <h3>01 &mdash; Upeksha</h3>
              <span className="sanskrit">Emotional Balance</span>
              <p className="card-question">When the stakes are emotional, can the evidence still be weighed fairly?</p>
              <p>Examines how positive and negative information is considered when both are
                present. Setbacks can feel more significant than equivalent gains. Recent
                successes can also influence expectations. The question is whether the emotional
                weight of an outcome is distorting the evaluation of the situation.</p>
              <p className="card-focus"><strong>Assessment focus:</strong> Balanced consideration of positive and negative signals.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9672;</div>
              <h3>02 &mdash; Viveka</h3>
              <span className="sanskrit">Clarity in Complexity</span>
              <p className="card-question">When the answer is uncertain, can what matters most still be recognized?</p>
              <p>Examines how individuals approach uncertainty, competing information and
                difficult trade-offs. Leadership frequently requires choices without complete
                information. The capacity concerns remaining with uncertainty long enough to reach
                a considered judgment rather than rushing toward the most familiar answer.</p>
              <p className="card-focus"><strong>Assessment focus:</strong> Discernment amid complexity and uncertainty.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9889;</div>
              <h3>03 &mdash; Anuvigna</h3>
              <span className="sanskrit">Pressure Non-Reactivity</span>
              <p className="card-question">When the pressure rises, is the response directed at the problem or the immediate reaction?</p>
              <p>Examines how individuals approach situations that provoke emotional or
                interpersonal pressure. Criticism, conflict and perceived threats can generate
                immediate responses. The capacity concerns responding to the substance of the
                challenge rather than being dominated by the initial reaction.</p>
              <p className="card-focus"><strong>Assessment focus:</strong> Deliberate responses under pressure.</p>
            </div>
            <div className="card">
              <div className="card-icon">&#9671;</div>
              <h3>04 &mdash; Anasakti</h3>
              <span className="sanskrit">Detached Decision-Making</span>
              <p className="card-question">When the evidence changes, can the decision change with it?</p>
              <p>Examines the influence of attachment to existing opinions, previous commitments
                and preferred outcomes. Past effort and personal investment can make changing
                direction difficult, even when the circumstances call for reassessment.</p>
              <p className="card-focus"><strong>Assessment focus:</strong> Reconsidering prior positions without excessive attachment.</p>
            </div>
          </div>

          <p className="overview-copy" style={{ margin: '32px auto 0', textAlign: 'center' }}>
            <strong>Together, the four capacities examine how judgment may be influenced by:</strong>{' '}
            Emotional weight. Complexity. Immediate reaction. Attachment to outcomes. UVAA brings
            these perspectives together to provide a structured picture of decision tendencies.
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
            These three broad orientations are not intended to define a person's complete
            personality or determine their leadership worth. Decision quality is assessed
            separately across the four UVAA capacities and summarized through the Decision
            Quality Index.
          </p>

          <div className="callout-bar" style={{ maxWidth: 780, margin: '0 auto' }}>
            <strong>Why assess them separately?</strong> Because the framework does not assume
            that an individual's underlying orientation fully explains the quality of their
            responses to decision scenarios. By examining the two dimensions independently, UVAA
            can interpret their relationship rather than relying on either one alone.
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            The result is not a fixed personality type. It is an assessment pattern intended to
            support reflection and development.
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
            UVAA brings the four capacity scores together into a composite measure called the{' '}
            <strong>Decision Quality Index (DQI)</strong>, presented on a scale from 0 to 100.
            Within the UVAA framework, scores are grouped into three developmental bands.
          </p>

          <div className="band-row">
            <span className="band-pill band-pill-risk"><span className="dot"></span> <strong>At Risk</strong> &mdash; 0 to 39</span>
            <span className="band-pill band-pill-developing"><span className="dot"></span> <strong>Developing</strong> &mdash; 40 to 74</span>
            <span className="band-pill band-pill-anchored"><span className="dot"></span> <strong>Anchored</strong> &mdash; 75 to 100</span>
          </div>

          <p className="overview-copy" style={{ margin: '0 auto 32px', textAlign: 'center' }}>
            These bands describe classifications within UVAA's assessment model. They are not
            clinical diagnoses or judgments of a person's overall competence.
          </p>

          <div className="section-head">
            <h2>Beyond a Single Score</h2>
            <p>A composite score provides one perspective. The four capacity scores provide
              additional detail. UVAA also interprets the relationship between core orientation
              and decision quality through nine patterns.</p>
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
            Each pattern combines the assessed core orientation with the corresponding
            decision-quality band. The purpose is to examine differences between orientation and
            decision choices and identify potential areas for further development.
          </p>

          <div className="callout-bar callout-bar-accent" style={{ maxWidth: 780, margin: '32px auto 0' }}>
            <strong>Patterns, Not Permanent Labels.</strong> A UVAA pattern is an interpretation of
            assessment responses, not a permanent classification of the person. Responses can be
            influenced by workload, recent events and individual circumstances. The value of the
            result lies in understanding the pattern alongside the four capacity scores and
            considering what it may suggest for development.
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
              <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>A clearer view of your decision tendencies.</p>
              <p>Each participant receives an individual report designed to explain their
                assessment results in an understandable and structured way. The report includes
                the Core Orientation reflected in the assessment, the Decision Quality Index and
                its band, the four capacity scores, the UVAA Decision Pattern, and a Development
                Focus indicating which capacity may deserve attention first and why.</p>
              <p>Individual results are intended for personal understanding and development, with
                the participant retaining control over whether their scores are shared with the
                employer.</p>
            </div>
            <div className="vertical-card">
              <h3>02 &mdash; Organizational Cohort Report</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Understand the group without losing sight of the individual.</p>
              <p>Organizations receive a cohort-level view designed to support leadership
                development discussions: Decision Quality Distribution across the group, Pattern
                Distribution across the nine UVAA patterns, Capacity-Level Insights on areas that
                may warrant attention, and a Participation Dashboard.</p>
              <p>The cohort report is intended to help HR and L&amp;D teams explore potential
                development needs without automatically disclosing participants' individual
                scores. Individual-level information is shared only with the participant's
                explicit consent.</p>
            </div>
          </div>

          <div className="callout-bar" style={{ maxWidth: 820, margin: '32px auto 0' }}>
            <strong>One assessment. Two perspectives.</strong> For the individual: insight into
            personal decision tendencies. For the organization: a structured view of cohort-level
            patterns and possible development priorities.
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
            An assessment can identify potential areas for attention. What happens next depends on
            how those insights are interpreted and used. UVAA offers a development pathway that
            can extend beyond initial assessment and reporting.
          </p>

          <div className="journey">
            <div className="step">
              <div className="step-num">1</div>
              <h4>Assess</h4>
              <p>Participants complete the structured scenario-based instrument. UVAA evaluates
                core orientation and decision quality through its scoring framework.</p>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h4>Report</h4>
              <p>Participants receive their individual assessment results. Organizations receive
                cohort-level reporting, with individual-score sharing governed by consent.</p>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h4>Plan</h4>
              <p>A targeted development plan can be developed around the capacities and patterns
                identified, to determine where development work may be most relevant rather than
                applying the same intervention to everyone.</p>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <h4>Coach</h4>
              <p>Optional individual or group coaching focuses on the selected capacities and the
                professional situations in which they may arise.</p>
            </div>
            <div className="step">
              <div className="step-num">5</div>
              <h4>Reassess</h4>
              <p>At a defined interval, the assessment can be administered again to compare
                results with the participant's earlier baseline.</p>
            </div>
          </div>

          <div className="journey-note">
            <h4>A Development Pathway, Not a One-Size-Fits-All Program.</h4>
            <p>
              Assessment and reporting form the core offering. Development planning, coaching and
              reassessment are optional follow-on services, tailored to the organization's needs
              and the assessment findings.
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
            <h2>Different Patterns May Call for Different Development Approaches.</h2>
            <p>UVAA's development framework considers three complementary layers.</p>
          </div>

          <div className="triple-grid">
            <div className="card">
              <h3>Cognitive</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>How You Understand</p>
              <p>Focuses on how an individual frames a situation, interprets information and
                reaches an understanding of the problem. This layer is relevant when the
                difficulty lies in how the situation itself is understood.</p>
            </div>
            <div className="card">
              <h3>Behavioural</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>How You Respond</p>
              <p>Focuses on the actions taken at the point of pressure. This layer is relevant when
                understanding is present but the response does not reflect that understanding.</p>
            </div>
            <div className="card">
              <h3>Practice</h3>
              <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>What You Strengthen Over Time</p>
              <p>Focuses on sustained development of the underlying capacity through continued
                practice. The purpose is to work beyond a single technique or immediate response.</p>
            </div>
          </div>

          <div className="callout-bar callout-bar-accent" style={{ maxWidth: 820, margin: '32px auto 0' }}>
            <strong>Development Begins With Understanding the Pattern.</strong> The intended
            approach is to match developmental attention to the capacity and pattern identified,
            rather than assuming every participant needs the same kind of support. The
            relationship between these activities, changes in assessment scores and real-world
            decision outcomes is an area for continued evaluation.
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
            <h2>For Those Who Lead. And Those Who Develop Leaders.</h2>
            <p>UVAA is initially focused on IT organizations in India and professionals carrying
              leadership responsibility.</p>
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
            <strong>For HR and L&amp;D Teams</strong> &mdash; UVAA provides a structured assessment
            perspective that can support conversations about leadership development priorities.
            Its individual and cohort reports are designed to make decision tendencies more
            visible while respecting participant control over individual results.
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            Whether the responsibility is a team, a function or a business unit, judgment under
            pressure remains a relevant leadership challenge.
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
              <p>Individual scores are not automatically disclosed to the employer. Participants
                control whether they agree to share their results. Declining to share individual
                scores does not change their access to their own report.</p>
            </div>
            <div className="card">
              <h3>Consent Is Specific</h3>
              <p>Access to individual information is governed by explicit consent, including
                whether facilitators may view an individual profile.</p>
            </div>
            <div className="card">
              <h3>Organizations Receive Cohort Insights</h3>
              <p>Organizational reporting is designed to present group-level patterns without
                requiring disclosure of every participant's individual results.</p>
            </div>
            <div className="card">
              <h3>Minimal Employee Data Transfer</h3>
              <p>UVAA's access process is designed around group size and participant tokens rather
                than requiring an employer to transfer its complete employee roster.</p>
            </div>
            <div className="card">
              <h3>Intended for Development, Not Selection</h3>
              <p>UVAA is not intended for making hiring, promotion or termination decisions. It is
                not a clinical assessment and does not diagnose mental-health conditions.</p>
            </div>
          </div>

          <p className="closing-statement" style={{ marginTop: 32 }}>
            The purpose is understanding and development &mdash; not labeling, judging or
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
            An Established Question. A Structured Assessment Approach.
          </h2>
          <p className="editorial-lead" style={{ textAlign: 'center' }}>
            The question of how people maintain sound judgment under changing circumstances has
            been explored through philosophy, psychology and decision research.
          </p>

          <p className="overview-copy" style={{ margin: '0 auto 24px', textAlign: 'center', maxWidth: '68ch' }}>
            UVAA draws conceptual inspiration from the Indian philosophical idea of{' '}
            <em>Sthitaprajna</em>, a description of steady judgment found in the Bhagavad Gita.
            The framework also draws on ideas from decision research and neuroeconomics,
            including loss aversion, ambiguity aversion, the endowment effect and sunk-cost
            considerations. UVAA translates these conceptual foundations into a structured
            scenario-based assessment model.
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
            <strong>Grounded in Ideas. Developed for Practical Examination.</strong> The
            philosophical and theoretical origins explain the thinking behind UVAA. The
            assessment's measurement reliability, validity and relationship to actual workplace
            behavior require empirical evaluation. UVAA is being introduced through pilot
            engagements to examine how its results are understood, how useful they are to
            organizations and how the framework performs in practice.
          </div>
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
                Dr. Sayee Bhuvaneswari brings together experience in corporate leadership,
                psychology, economics and Indian philosophical traditions. An engineer turned
                researcher and practitioner, she holds PhDs in Psychology and Economics and in
                Yogic Sciences.
              </p>
              <p>
                Her background includes 27 years of corporate leadership experience, including
                global roles with Hitachi and HCL, alongside work as a startup advisor, leadership
                coach and counselling psychologist.
              </p>
              <p>
                UVAA brings together these areas of inquiry in an assessment framework focused on
                orientation, decision quality and judgment under pressure.
              </p>
              <p className="founder-patent">
                Patent Application: Indian Patent Application No. 202641076718, published as
                identified in the UVAA product documentation.
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
              <p>No. UVAA is not designed to assign broad or permanent personality types. It
                examines responses to structured decision scenarios, evaluates core orientation
                and decision quality separately, and interprets their relationship through the
                four-capacity and nine-pattern framework.</p>
            </details>
            <details className="faq-item">
              <summary>How long does the assessment take?</summary>
              <p>Approximately 45 minutes in one sitting. The instrument contains 47
                scenario-based questions, each presenting three possible courses of action.</p>
            </details>
            <details className="faq-item">
              <summary>What does UVAA measure?</summary>
              <p>UVAA evaluates core orientation and responses across four decision capacities:
                Emotional Balance, Clarity in Complexity, Pressure Non-Reactivity and Detached
                Decision-Making. The assessment produces a composite Decision Quality Index and
                one of nine interpretive patterns.</p>
            </details>
            <details className="faq-item">
              <summary>Does UVAA measure how someone actually behaves at work?</summary>
              <p>UVAA examines choices made in structured scenarios. These can offer insight into
                decision tendencies, but they are not equivalent to directly observing a person's
                behavior in the workplace. The relationship between scenario-based assessment
                results and real-world decision behavior requires further validation.</p>
            </details>
            <details className="faq-item">
              <summary>What does an organization receive?</summary>
              <p>Organizations receive cohort-level reporting, including DQI distribution, pattern
                spread and development-related insights. Individual scores are not automatically
                disclosed to employers.</p>
            </details>
            <details className="faq-item">
              <summary>Is the assessment suitable for recruitment or promotion decisions?</summary>
              <p>No. UVAA is intended for leadership development, not for determining hiring,
                promotion or termination outcomes.</p>
            </details>
            <details className="faq-item">
              <summary>Is UVAA a mental-health assessment?</summary>
              <p>No. UVAA is not a clinical diagnostic tool and does not assess or diagnose
                mental-health conditions.</p>
            </details>
            <details className="faq-item">
              <summary>Does every participant need coaching?</summary>
              <p>No. Assessment and reporting are the starting point. Development planning,
                coaching and reassessment are optional.</p>
            </details>
            <details className="faq-item">
              <summary>Can UVAA track changes over time?</summary>
              <p>UVAA offers reassessment using the same instrument at a defined interval,
                allowing later scores to be compared with a participant's baseline. Changes in
                assessment scores should not automatically be interpreted as proof of improved
                workplace decision-making.</p>
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
            You do not need to commit to a full assessment program to understand whether UVAA may
            be relevant to your organization. Start by exploring the instrument and its outputs.
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
            Whether you lead HR, work in leadership development or want to understand the
            assessment framework, we'd welcome a conversation. Tell us a little about your
            organization and what you would like to explore.
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
          <p className="brand-footer-tagline">Judgment Under Pressure.</p>
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
