import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer-opus py-5">
      <div className="container">
        <div className="row align-items-start">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="navbar-brand-opus mb-2" style={{ fontWeight: 700, fontSize: '1.1rem' }}>opus</div>
            <p className="label-tag" style={{ lineHeight: 1.6, maxWidth: 240 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="col-md-4 mb-4 mb-md-0" />

          <div className="col-md-4 d-flex flex-column align-items-md-end gap-1">
            <Link to="/about" className="text-decoration-none label-tag">About us</Link>
            <Link to="/contact" className="text-decoration-none label-tag">Contact us</Link>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--color-border)', margin: '2rem 0 1rem' }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="label-tag">© 2025 Société digital. All rights reserved</span>
          <div className="d-flex gap-4">
            <Link to="/terms" className="text-decoration-none label-tag">Terms and conditions</Link>
            <Link to="/privacy" className="text-decoration-none label-tag">Privacy policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
