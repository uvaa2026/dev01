import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

// Public, no-login-required user guide for the whole platform — one combined
// page covering both the respondent journey and the Org Admin journey, per
// the product decision to replace the old UVAA-Quick-Start-Guide.pdf with a
// page that's always current and doesn't need a download. Structured like
// TermsOfUse.jsx (PageHeader + a single 760px prose column) rather than as a
// new design, so it reads as part of the same site rather than a bolted-on
// help centre.
//
// Content here is written to match what the product actually does today —
// Register.jsx, OrgRegister.jsx, BeforeYouBegin.jsx, MyPage.jsx,
// OrgAdminDashboard.jsx, Login.jsx/OrgLogin.jsx and the two forgot-password
// flows — not an idealised description. If any of those flows change, this
// page should be updated alongside them.
const LAST_UPDATED = 'November 2026'

export default function Guide() {
  return (
    <>
      <PageHeader
        eyebrow="Guide"
        title="How to use UVAA."
        lead={`Everything you need to register, take the assessment, or run a cohort as an organisation. Last updated: ${LAST_UPDATED}`}
      />

      <section>
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>

          <h2>Two ways to use UVAA</h2>
          <p>
            Most people land on this page one of two ways: as a <strong>respondent</strong>, taking
            the assessment yourself with a cohort code your organisation gave you, or as an{' '}
            <strong>Org Admin</strong>, setting UVAA up for your organisation and managing who
            takes it. This guide covers both. Use the headings below to jump to the part that
            applies to you.
          </p>

          <hr style={{ margin: '32px 0', border: 0, borderTop: '1px solid var(--border-subtle, #e5e5e5)' }} />

          <h2>For respondents</h2>

          <h3>1. Creating your account</h3>
          <p>
            Go to <Link to="/register" className="link-accent">Register</Link> and enter the
            cohort code your organisation shared with you. Once it's recognised, you'll fill in
            your profile — name, email, a password (minimum 8 characters, with at least one
            capital letter and one number), your industry, what you lead, and your experience —
            and give three separate consents:
          </p>
          <ul>
            <li>Consent for your assessment responses to be processed and scored — this one is
              required to use the Service at all;</li>
            <li>Consent for your organisation's facilitator to see your profile and scores —
              on by default, but you can decline it;</li>
            <li>Consent for your organisation's Admin to see your profile and scores — off by
              default, you choose whether to turn it on.</li>
          </ul>
          <p>
            Declining the facilitator or Admin consent changes nothing about the report you get
            yourself — it only controls who else, if anyone, can see it. You can revisit this
            any time by contacting your organisation's Admin.
          </p>

          <h3>2. Verifying your email</h3>
          <p>
            After registering, we send a verification link to your email. You need to open that
            email and click the button on the confirmation page yourself — the link doesn't
            verify automatically just from being opened or scanned, which is deliberate: it keeps
            a corporate mail-security scanner from using up your one-time link before you even
            see it. Each link is single-use and expires after 24 hours; if yours has expired,
            register again or contact your Admin.
          </p>

          <h3>3. Logging in</h3>
          <p>
            Once verified, log in from <Link to="/login" className="link-accent">Login</Link>.
            Forgotten your password? Use{' '}
            <Link to="/forgot-password" className="link-accent">Forgot password?</Link> on that
            page — we'll email a reset link that's valid for 60 minutes and can only be used
            once.
          </p>

          <h3>4. Before you begin</h3>
          <p>
            The first time you start, you'll see a short briefing page explaining what the
            assessment measures in plain terms: two parts, about 50 minutes in total, no right or
            wrong answers, and that your organisation only ever sees patterns across the group —
            never your individual answers, unless you've separately consented to share your own
            score. You confirm you've read it before the assessment itself opens.
          </p>

          <h3>5. Taking the assessment</h3>
          <p>
            From <Link to="/my-page" className="link-accent">My Page</Link> you'll see two steps,
            completed in order:
          </p>
          <ul>
            <li><strong>Core Orientation</strong> — 15 short situations establishing your baseline,
              about 5 minutes;</li>
            <li><strong>Decision Quality Index</strong> — 32 scenarios covering the full picture,
              about 30 minutes. This unlocks only once Core Orientation is submitted.</li>
          </ul>
          <p>
            For both parts, choose what you'd actually do, not what sounds best — if nothing
            matches exactly, pick the closest option. Your progress saves as you go, so you can
            stop and resume within 72 hours of starting. Once a part is submitted, your answers
            are locked and can't be changed.
          </p>

          <h3>6. Your report</h3>
          <p>
            Once both parts are submitted and scoring is complete, a "View your report" link
            appears on My Page. The report is yours; it isn't shown to anyone else unless you
            consented to share it, as above.
          </p>

          <hr style={{ margin: '32px 0', border: 0, borderTop: '1px solid var(--border-subtle, #e5e5e5)' }} />

          <h2>For organisations (Org Admin)</h2>

          <h3>1. Registering your organisation</h3>
          <p>
            Go to <Link to="/org-register" className="link-accent">Register your organisation</Link>{' '}
            and provide your organisation's name and type, the number of seats you need, and how
            you want participants to join:
          </p>
          <ul>
            <li><strong>Approval</strong> — either automatic (anyone with the code is registered
              immediately) or manual (you review and approve each registration yourself);</li>
            <li><strong>Identification</strong> — either anonymous (anyone with the code, and a
              matching email domain if you set one, can register) or a named roster you upload
              in advance;</li>
            <li>an optional <strong>work email domain</strong> restriction, so only addresses on
              your domain can use the code.</li>
          </ul>
          <p>
            You'll also set up the required Admin account (that's you, or whoever will run the
            dashboard) and can optionally add a Facilitator — a second contact who, with each
            respondent's consent, can also see profiles and scores. Either of you can additionally
            take the assessment yourselves by checking "I also want to take the assessment
            myself."
          </p>

          <h3>2. Verifying and getting your cohort code</h3>
          <p>
            Like a respondent account, the Admin email needs to be verified with an explicit
            click before anything else happens — in this case, before your cohort code is issued.
            Once verified, your cohort code is shown on screen; share it with your participants
            so they can register.
          </p>

          <h3>3. Logging in to the Admin dashboard</h3>
          <p>
            Admins log in separately from respondents, at{' '}
            <Link to="/org-login" className="link-accent">Admin login</Link> — this is true even
            if you also have your own respondent account; the two are independent. If you forget
            your Admin password, use{' '}
            <Link to="/org-forgot-password" className="link-accent">Forgot password?</Link> on
            that page for a reset link.
          </p>

          <h3>4. Running your cohort</h3>
          <p>From your Admin dashboard (<code>/org-admin</code>) you can:</p>
          <ul>
            <li>See seats used, total registered, pending approvals, and reports ready at a glance;</li>
            <li>Copy your cohort code at any time to share again;</li>
            <li>If you chose manual approval, approve or reject each pending registration;</li>
            <li>See every participant's name, email, approval status, and whether they've
              completed each assessment part — their score is shown only if they've consented to
              share it with you, and only once it's ready;</li>
            <li>Open a participant's row for more detail, again only where they've consented;</li>
            <li>View the <strong>cohort report</strong> — how your group as a whole responds to
              pressure, in aggregate. This never shows an individual's answers;</li>
            <li>If you chose a named roster, add people one at a time or paste a CSV (columns:
              <code>fullName,email</code>) — only pre-loaded emails can then register with your
              code.</li>
          </ul>

          <hr style={{ margin: '32px 0', border: 0, borderTop: '1px solid var(--border-subtle, #e5e5e5)' }} />

          <h2>Getting help</h2>
          <p>
            For anything this guide doesn't cover — a stuck verification link, a question about
            your report, or help setting up your organisation — reach out to{' '}
            <a href="mailto:sayee@dheemerconsulting.com" className="link-accent">sayee@dheemerconsulting.com</a>.
            For how your data is handled, see{' '}
            <a href="/#privacy" className="link-accent">Privacy &amp; Data</a>; for the legal
            terms of using UVAA, see{' '}
            <Link to="/terms" className="link-accent">Terms &amp; Conditions</Link>.
          </p>

        </div>
      </section>
    </>
  )
}
