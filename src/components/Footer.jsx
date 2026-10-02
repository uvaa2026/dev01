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
            <Link to="/#dimensions">The framework</Link>
            <Link to="/org-register">Register your organisation</Link>
          </div>
          <div className="footer-col">
            <h5>Account</h5>
            <Link to="/login">Sign in</Link>
            <Link to="/org-login">Organisation admin login</Link>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <a href="#">Privacy policy</a>
            <a href="#">Data &amp; consent (DPDP 2023)</a>
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
