import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'

const TALK_TO_US_EMAIL = 'talktous@uvaa.example.com'

// Content sourced verbatim from the deck (slide 12 "Closing").
export default function TalkToUs() {
  return (
    <>
      <PageHeader
        eyebrow="Talk to Us"
        title="Worth a conversation before it is worth a cohort."
        lead="We will walk you through the instrument, a sample report, and what a pilot would look like for your team. No assessment is run until you have seen what comes out of one."
      />

      <section>
        <div className="container">
          <div className="cta-band">
            <h2>Start with a conversation</h2>
            <p>Reply with a convenient time, or write to us directly.</p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <a href={`mailto:${TALK_TO_US_EMAIL}`} className="btn btn-primary btn-lg">Talk to Us</a>
            </div>
            <p style={{ marginTop: 20, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Or email us directly at{' '}
              <a href={`mailto:${TALK_TO_US_EMAIL}`} className="link-accent">{TALK_TO_US_EMAIL}</a>.
            </p>
          </div>

          <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 28 }}>
            <Link to="/what-you-get" className="btn btn-ghost">Review a sample report first</Link>
            <Link to="/for-organisations" className="btn btn-ghost">See how a cohort engagement runs</Link>
          </div>
        </div>
      </section>
    </>
  )
}
