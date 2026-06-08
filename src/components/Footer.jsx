import React from 'react';
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer-opus py-2">
      <div className="container">
        <div className="row align-items-start mt-2">
          <div className="col-md-4 mb-4 mb-md-0 ">
            <div className="navbar-brand-opus mb-2" style={{ fontWeight: 700, fontSize: '1.1rem' }}>opus</div>
            <p className="label-tag" style={{ lineHeight: 1.6, maxWidth: 240 }}>
              {t('footer.description')}
            </p>
          </div>

          <div className="col-md-4 mb-4 mb-md-0" />

          <div className="col-md-4 d-flex flex-column align-items-md-end gap-1">
            <Link to="/about"   className="text-decoration-none label-tag">{t('footer.links.about')}</Link>
            <Link to="/contact" className="text-decoration-none label-tag">{t('footer.links.contact')}</Link>
          </div>
        </div>

        <hr style={{ borderColor: 'var(--color-border)', margin: '2rem 0 1rem' }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="label-tag">{t('footer.rights')}</span>
          <div className="d-flex gap-4">
            <Link to="/terms"   className="text-decoration-none label-tag">{t('footer.links.terms')}</Link>
            <Link to="/privacy" className="text-decoration-none label-tag">{t('footer.links.privacy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
