import React from 'react';
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import HexDecoration from '../components/HexDecoration'

function Box({ style, children, className = '' }) {
  return (
    <div className={`placeholder-box ${className}`} style={style}>
      {children}
    </div>
  )
}

function FaqItem({ question, open }) {
  return (
    <div className="faq-item d-flex justify-content-between align-items-center gap-3">
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{question}</span>
      {open ? <ChevronUp size={14} style={{ flexShrink: 0 }} /> : <ChevronDown size={14} style={{ flexShrink: 0 }} />}
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      {/* ── HERO ── */}
      <section className="section-gap" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <p className="label-tag mb-2">{t('home.hero.eyebrow')}</p>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                {t('home.hero.title')}
              </h1>
              <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: 440, lineHeight: 1.7 }}>
                {t('home.hero.subtitle')}
              </p>
              <div className="mt-4 d-flex flex-wrap gap-3">
                <Link to="/builder" className="btn-dark-opus d-inline-block text-decoration-none">
                  {t('home.hero.cta')}
                </Link>
                <Link
                  to="/improve"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '10px 22px', borderRadius: 8, fontWeight: 600,
                    fontSize: '0.9rem', textDecoration: 'none',
                    border: '1.5px solid var(--color-border)',
                    backgroundColor: '#fff', color: 'var(--color-text)',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <Sparkles size={15} />
                  {t('home.hero.improve')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', right: '-20px', top: '-20px', color: 'var(--color-text)', opacity: 0.12, pointerEvents: 'none' }}>
          <HexDecoration rows={7} cols={6} size={32} gap={8} />
        </div>
      </section>

      {/* ── PREVIEW / PROGRESS BAND ── */}
      <section className="section-gap-sm" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-5">
              <Box style={{ height: 240, position: 'relative' }}>
                <div style={{
                  position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(26,26,24,0.78)', color: '#fff', borderRadius: 8,
                  padding: '6px 14px', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em',
                  textAlign: 'center',
                }}>
                  60%<br />
                  <span style={{ fontSize: '0.7rem', fontWeight: 400, opacity: 0.75 }}>
                    {t('home.preview.progress')}
                  </span>
                </div>
              </Box>
            </div>
            <div className="col-md-7">
              <Box style={{ height: 240 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT CAN YOU DO ── */}
      <section className="section-gap">
        <div className="container">
          <h2 className="text-center mb-5" style={{ fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', letterSpacing: '-0.02em' }}>
            {t('home.whatCanYouDo')}
          </h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card-opus" style={{ height: 280, position: 'relative' }}>
                <div style={{
                  position: 'absolute', bottom: 20, left: 20, right: 20,
                  background: 'rgba(244,244,242,0.88)', borderRadius: 10,
                  padding: '12px 14px', backdropFilter: 'blur(4px)',
                }}>
                  <p className="mb-1" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    {t('home.featureCard.title')}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {t('home.featureCard.desc')}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4"><Box style={{ height: 280 }} /></div>
            <div className="col-md-4"><Box style={{ height: 280 }} /></div>
          </div>
        </div>
      </section>

      {/* ── WHY OPUS ── */}
      <section className="section-gap" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-md-5">
              <p className="label-tag mb-2">{t('home.whyOpus.eyebrow')}</p>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                {t('home.whyOpus.title')}
              </h2>
              <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                {t('home.whyOpus.desc')}
              </p>
            </div>
            <div className="col-md-7">
              <Box style={{ height: 280 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE SECTION ── */}
      <section className="section-gap">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-md-7">
              <Box style={{ height: 280 }} />
            </div>
            <div className="col-md-5">
              <p className="label-tag mb-2">{t('home.section.eyebrow')}</p>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', letterSpacing: '-0.02em' }}>
                {t('home.section.title')}
              </h2>
              <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                {t('home.section.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="section-gap" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-5">
              <Box style={{ height: '100%', minHeight: 320 }} />
            </div>
            <div className="col-md-7 d-flex flex-column gap-3">
              <Box style={{ height: 96 }} />
              <Box style={{ height: 96 }} />
              <Box style={{ height: 96 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── TEMPLATE SHOWCASE ── */}
      <section className="section-gap">
        <div className="container">
          <div className="row g-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="col-md-4">
                <Box style={{ height: 380 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORT / FAQ ── */}
      <section className="section-gap" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-md-5">
              <p className="label-tag mb-2">{t('home.support.eyebrow')}</p>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                {t('home.support.title')}
              </h2>
              <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem', lineHeight: 1.7 }}>
                {t('home.support.desc')}
              </p>
            </div>

            <div className="col-md-7">
              <div className="p-4" style={{ background: 'var(--color-surface-2)', borderRadius: 16 }}>
                <p className="label-tag mb-3" style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                  {t('home.support.faqTitle')}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {t('home.support.faqBody')}
                </p>

                <div className="d-flex flex-column gap-2">
                  {['home.support.faq2', 'home.support.faq3', 'home.support.faq4'].map((key, i) => (
                    <FaqItem key={i} question={t(key)} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
