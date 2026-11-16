import PageHeader from '../components/PageHeader.jsx'

// General Terms & Conditions for the UVAA platform (Dheemer Consulting).
// This is a standard template covering the usual bases for an assessment
// SaaS — acceptance, service description, accounts, IP, data, disclaimers,
// liability, governing law — written to be consistent with what the rest of
// the site already says (not a clinical tool; not for hiring/promotion/
// termination; India data residency; DPDP Act 2023). It is NOT a substitute
// for a lawyer's review before this is relied on commercially — in
// particular the governing-law clause below has a placeholder city that
// needs filling in, and anything about payment/refunds should be checked
// against the organisation's actual pilot/commercial agreements.
const LAST_UPDATED = 'November 2026'

export default function TermsOfUse() {
  return (
    <>
      <PageHeader
        eyebrow="Terms &amp; Conditions"
        title="The terms for using UVAA."
        lead={`Last updated: ${LAST_UPDATED}`}
      />

      <section>
        <div className="container" style={{ maxWidth: 760, margin: '0 auto' }}>

          <h2>1. Acceptance of these Terms</h2>
          <p>
            By creating an account, registering an organisation, or otherwise using the UVAA
            platform (the &ldquo;Service&rdquo;), you agree to these Terms &amp; Conditions. If you are
            registering on behalf of an organisation, you confirm you are authorised to accept
            these terms on that organisation&rsquo;s behalf. If you do not agree, please do not use
            the Service.
          </p>

          <h2>2. What UVAA Is</h2>
          <p>
            UVAA is a leadership decision-assessment tool developed by Dheemer Consulting
            (Indian Patent Application No. 202641076718). It is a development-focused instrument
            intended to help individuals and organisations understand decision-making under
            pressure.
          </p>
          <p>
            UVAA is <strong>not</strong> a clinical, diagnostic, or psychiatric tool, and must not be used
            as the basis for hiring, promotion, termination, or any other formal employment
            decision. It reflects one sitting of a self-report instrument and is influenced by a
            respondent&rsquo;s current workload, recent events, and circumstances at the time of
            taking it &mdash; see &ldquo;What UVAA Measures&rdquo; on the homepage for the fuller explanation of
            what the results do and do not represent.
          </p>

          <h2>3. Accounts and Eligibility</h2>
          <p>
            You must provide accurate registration information and keep your login credentials
            confidential. You are responsible for all activity under your account. The Service is
            intended for use by working professionals; it is not directed at or intended for use
            by children.
          </p>
          <p>
            Participant accounts are created against a cohort code issued by a registered
            organisation. An organisation may restrict registration to a specific email domain or
            to a pre-approved roster of participants, and may set a registration deadline or a
            seat limit &mdash; registration may be declined once any of these conditions is no longer
            met.
          </p>

          <h2>4. Organisation Customers</h2>
          <p>
            An organisation registering with UVAA is responsible for the accuracy of the details
            it provides, for the conduct of the Org Admin and Facilitator contacts it designates,
            and for communicating these Terms and UVAA&rsquo;s Privacy &amp; Data practices to its
            participants before they register. Seats purchased are for the named cohort and
            period agreed at registration or in a separate commercial agreement with Dheemer
            Consulting, where one exists.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Share your account credentials or cohort code with anyone not entitled to use them;</li>
            <li>Attempt to access another respondent&rsquo;s or organisation&rsquo;s data without authorisation;</li>
            <li>Reverse-engineer, scrape, or attempt to extract the scoring methodology, scenario
              content, or underlying question bank from the Service;</li>
            <li>Use the Service for any unlawful purpose, or in a way that could disable, overburden,
              or impair it.</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            The UVAA methodology, scoring framework, scenario and vignette content, platform
            software, and all associated branding are the property of Dheemer Consulting and are
            protected under applicable intellectual property law, including the patent
            application referenced above. Nothing in these Terms transfers any ownership of that
            material to you or your organisation.
          </p>
          <p>
            As between you and Dheemer Consulting, you retain ownership of the personal
            responses you submit; by submitting them you grant Dheemer Consulting the right to
            process and score them as described in the Privacy &amp; Data section, in order to
            provide the Service to you and your organisation.
          </p>

          <h2>7. Privacy and Data</h2>
          <p>
            How assessment data is collected, stored, and shared is described on the{' '}
            <a href="/#privacy" className="link-accent">Privacy &amp; Data</a> page, including that
            individual scores are not visible to an organisation without the respondent&rsquo;s
            explicit, item-level consent, and that data is held in India in line with the
            Digital Personal Data Protection Act, 2023. That page forms part of these Terms.
          </p>

          <h2>8. Fees and Payment</h2>
          <p>
            Where a fee applies, it is charged on the basis agreed with your organisation at the
            time seats were purchased (for example, a pilot or per-seat commercial agreement).
            Fees already paid for seats that have been used or made available to participants are
            generally non-refundable, except as otherwise agreed in writing or required by law.
          </p>

          <h2>9. Suspension and Termination</h2>
          <p>
            Dheemer Consulting may suspend or terminate access to the Service for any account or
            organisation that breaches these Terms, misuses the Service, or where required to
            protect the security or integrity of the platform or other users&rsquo; data. An
            organisation or respondent may stop using the Service at any time; this does not by
            itself delete data already held, which is handled per the Privacy &amp; Data terms.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; Dheemer Consulting does not
            warrant that the Service will be uninterrupted, error-free, or that any report,
            score, or development recommendation will be fit for a particular decision you make
            about a person, including any employment-related decision. See Section 2 above.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Dheemer Consulting&rsquo;s aggregate liability
            arising out of or relating to the Service shall not exceed the fees actually paid for
            the seats or cohort giving rise to the claim in the twelve (12) months preceding it,
            and Dheemer Consulting shall not be liable for indirect, incidental, or consequential
            loss, including loss arising from a decision made on the basis of an assessment
            report.
          </p>

          <h2>12. Changes to These Terms</h2>
          <p>
            These Terms may be updated from time to time; the &ldquo;Last updated&rdquo; date above will
            change accordingly. Continuing to use the Service after an update constitutes
            acceptance of the revised Terms.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India, and any dispute arising from them is
            subject to the exclusive jurisdiction of the courts of [insert city], India.
          </p>

          <h2>14. Contact</h2>
          <p>
            Questions about these Terms can be sent to{' '}
            <a href="mailto:sayee@dheemerconsulting.com" className="link-accent">sayee@dheemerconsulting.com</a>.
          </p>

        </div>
      </section>
    </>
  )
}
