import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <span className="brand-mark" aria-hidden="true"></span>
              <span>UVAA</span>
            </Link>
            <p>A patent-published Vedic-neuroeconomic framework for emotional decision-stability, from UVAA Leadership Intelligence and Dheemer Consulting.</p>
          </div>
          <div className="footer-col">
            <h5>Platform</h5>
            <Link to="/why-uvaa">Why UVAA</Link>
            <Link to="/framework">The framework</Link>
            <Link to="/the-assessment">The assessment</Link>
            <Link to="/what-you-get">What you get</Link>
            <Link to="/for-organisations">For organisations</Link>
          </div>
          <div className="footer-col">
            <h5>Account</h5>
            <Link to="/register">Register</Link>
            <Link to="/login">Sign in</Link>
            <Link to="/org-register">Register your organisation</Link>
            <Link to="/org-login">Organisation admin login</Link>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <Link to="/privacy-data">Privacy &amp; data</Link>
            <Link to="/what-uvaa-does-not-claim">What UVAA does not claim</Link>
            <a href="#">Terms of use</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 UVAA Leadership Intelligence &amp; Dheemer Consulting. All rights reserved.</span>
          <span>Indian Patent Application No. 202641076718 · Published 03 Jul 2026 · Dr. Abinsam Sayee Bhuvaneswari</span>
        </div>
      </div>
    </footer>
  )
}
