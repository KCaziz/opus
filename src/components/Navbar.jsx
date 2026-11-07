import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'

// Navigation minimale (maquette) : logo, contact, CTA principal
export default function Navbar() {
  const { t } = useTranslation()

  return (
    <nav className="navbar-opus py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand-opus text-decoration-none" aria-label="OPUS">
          <Logo height={22} style={{ color: 'var(--color-coral)', display: 'block' }} />
        </Link>

        <div className="d-flex gap-4 align-items-center">
          <Link to="/#faq" className="text-decoration-none text-muted-custom" style={{ fontSize: '0.875rem' }}>
            {t('landing.nav.contact')}
          </Link>
          <Link to="/editor" className="btn-dark-opus text-decoration-none" style={{ fontSize: '0.82rem', borderRadius: 999 }}>
            {t('nav.createCV')}
          </Link>
        </div>
      </div>
    </nav>
  )
}
