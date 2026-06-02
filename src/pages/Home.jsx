import { Link } from 'react-router-dom'
import HexDecoration from '../components/HexDecoration'

/* ── small reusable placeholder ── */
function Box({ style, children, className = '' }) {
  return (
    <div className={`placeholder-box ${className}`} style={style}>
      {children}
    </div>
  )
}

/* ── FAQ item ── */
function FaqItem({ question, open }) {
  return (
    <div className="faq-item d-flex justify-content-between align-items-center gap-3">
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{question}</span>
      <i className={`bi bi-chevron-${open ? 'up' : 'down'}`} style={{ fontSize: '0.8rem', flexShrink: 0 }} />
    </div>
  )
}

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="section-gap" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <p className="label-tag mb-2">Autre Chose</p>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
                Créer un CV professionnel<br />en quelques clicks!
              </h1>
              <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: 440, lineHeight: 1.7 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
              <Link to="/builder" className="btn-dark-opus mt-4 d-inline-block text-decoration-none">
                Créer mon CV
              </Link>
            </div>
          </div>
        </div>

        {/* Hexagon decoration */}
        <div style={{ position: 'absolute', right: '-20px', top: '-20px', color: 'var(--color-text)', opacity: 0.12, pointerEvents: 'none' }}>
          <HexDecoration rows={7} cols={6} size={32} gap={8} />
        </div>
      </section>

      {/* ── PREVIEW / PROGRESS BAND ── */}
      <section className="section-gap-sm" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="row g-4 align-items-center">
            {/* Big preview card */}
            <div className="col-md-5">
              <Box style={{ height: 240, position: 'relative' }}>
                {/* mini progress badge */}
                <div style={{
                  position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(26,26,24,0.78)', color: '#fff', borderRadius: 8,
                  padding: '6px 14px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.04em'
                }}>
                  60%<br />
                  <span style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.75 }}>complété</span>
                </div>
              </Box>
            </div>

            {/* Right placeholder */}
            <div className="col-md-7">
              <Box style={{ height: 240 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT CAN YOU DO ── */}
      <section className="section-gap">
        <div className="container">
          <h2 className="text-center mb-5" style={{ fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 2rem)', letterSpacing: '-0.02em' }}>
            What can you do with opus?
          </h2>

          <div className="row g-4">
            {/* Card 1 – has text overlay */}
            <div className="col-md-4">
              <div className="card-opus" style={{ height: 280, position: 'relative' }}>
                <div style={{
                  position: 'absolute', bottom: 20, left: 20, right: 20,
                  background: 'rgba(244,244,242,0.88)', borderRadius: 10,
                  padding: '12px 14px', backdropFilter: 'blur(4px)'
                }}>
                  <p className="mb-1" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Section Title</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-4">
              <Box style={{ height: 280 }} />
            </div>

            {/* Card 3 */}
            <div className="col-md-4">
              <Box style={{ height: 280 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY OPUS – left text / right image ── */}
      <section className="section-gap" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-md-5">
              <p className="label-tag mb-2">Autre Chose</p>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Pourquoi créer mon CV<br />avec Opus?
              </h2>
              <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
            </div>
            <div className="col-md-7">
              <Box style={{ height: 280 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE SECTION – left image / right text ── */}
      <section className="section-gap">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-md-7">
              <Box style={{ height: 280 }} />
            </div>
            <div className="col-md-5">
              <p className="label-tag mb-2">Autre Chose</p>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', letterSpacing: '-0.02em' }}>
                Section Title
              </h2>
              <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="section-gap" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="row g-4">
            {/* Big left card */}
            <div className="col-md-5">
              <Box style={{ height: '100%', minHeight: 320 }} />
            </div>

            {/* Right stack of 3 */}
            <div className="col-md-7 d-flex flex-column gap-3">
              <Box style={{ height: 96 }} />
              <Box style={{ height: 96 }} />
              <Box style={{ height: 96 }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── SPACER SECTION (large empty area in mockup = template showcase) ── */}
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
            {/* Left – text */}
            <div className="col-md-5">
              <p className="label-tag mb-2">Vous avez toujours des questions?</p>
              <h2 style={{ fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Notre équipes de support Clients est toujours à l'écoute
              </h2>
              <p className="mt-3" style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
              </p>
            </div>

            {/* Right – FAQ */}
            <div className="col-md-7">
              <div
                className="p-4"
                style={{ background: 'var(--color-surface-2)', borderRadius: 16 }}
              >
                <p className="label-tag mb-3" style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                  Question numéro un ?
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore. Ut enim ad minim veniam.
                </p>

                <div className="d-flex flex-column gap-2">
                  {[
                    'Question numéro deux ?',
                    'Question numéro trois ?',
                    'Question numéro quatre ?',
                  ].map((q, i) => (
                    <FaqItem key={i} question={q} />
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
