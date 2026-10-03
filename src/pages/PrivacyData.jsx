import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

// Content sourced verbatim from the deck (slide 10 "Privacy").
export default function PrivacyData() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy & Data"
        title="Designed for honest participation and responsible use."
        lead="An assessment people do not answer honestly is worse than none. The cohort report is only worth reading if the responses behind it were honest, and people are honest when it is safe to be."
      />

      <section>
        <div className="container">
          <div className="dimension-grid">
            <div className="card">
              <h3>Individual scores stay private</h3>
              <p>Not visible to anyone in the organisation without the respondent's explicit consent. Declining does not change their assessment or their report.</p>
            </div>
            <div className="card">
              <h3>Consent by item</h3>
              <p>Processing, research use and individual sharing are three separate decisions, not one checkbox. That separation is what makes the first two credible.</p>
            </div>
            <div className="card">
              <h3>Data handling</h3>
              <p>Residency in India, DPDP Act 2023 compliant, AES-256 encryption at rest.</p>
            </div>
            <div className="card">
              <h3>Administration</h3>
              <p>Completion tracking, deadlines, CSV export for your HR systems.</p>
            </div>
          </div>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 40 }}>
            <Link to="/what-uvaa-does-not-claim" className="btn btn-ghost btn-lg">What UVAA Does Not Claim</Link>
            <Link to="/talk-to-us" className="btn btn-primary btn-lg">Talk to Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
