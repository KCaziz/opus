import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar-opus py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand-opus text-decoration-none">opus</Link>
        <div className="d-flex gap-4 align-items-center">
          <Link to="/about" className="text-decoration-none text-muted-custom" style={{ fontSize: '0.875rem' }}>
            About us
          </Link>
        </div>
      </div>
    </nav>
  )
}
