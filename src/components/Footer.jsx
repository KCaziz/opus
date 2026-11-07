import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from './Logo'

// Pied de page (maquette) : logo, mention, liens légaux
export default function Footer() {
  const { t } = useTranslation()
  const link = { color: 'inherit', textDecoration: 'none' }

  return (
    <footer className="footer-opus">
      <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3"
           style={{ padding: '40px 12px', fontSize: 13, color: 'var(--color-text-muted)' }}>
        <Logo height={22} style={{ color: 'var(--color-coral)' }} />
        <span>{t('landing.footer.rights')}</span>
        <span className="d-flex flex-wrap" style={{ gap: 22 }}>
          <Link to="/contact" style={link}>{t('landing.footer.contact')}</Link>
          <Link to="/terms"   style={link}>{t('landing.footer.terms')}</Link>
          <Link to="/privacy" style={link}>{t('landing.footer.privacy')}</Link>
        </span>
      </div>
    </footer>
  )
}
