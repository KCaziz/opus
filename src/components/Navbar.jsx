import React from 'react';
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const { t } = useTranslation()

  return (
    <nav className="navbar-opus py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand-opus text-decoration-none">Opus</Link>

        <div className="d-flex gap-4 align-items-center">
          <Link to="/about" className="text-decoration-none text-muted-custom" style={{ fontSize: '0.875rem' }}>
            {t('nav.about')}
          </Link>
          <LanguageSwitcher compact />
          <Link to="/builder" className="btn-dark-opus text-decoration-none" style={{ fontSize: '0.82rem' }}>
            {t('nav.createCV')}
          </Link>
        </div>
      </div>
    </nav>
  )
}
