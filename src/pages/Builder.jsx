import React from 'react';
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CATEGORIES, TEMPLATES, ACCENT_COLORS } from '../data/templates'
import TemplatePreview from '../components/TemplatePreview'
import { useCVDispatch } from '../store/CVContext'
import { ACTIONS } from '../store/cvReducer'

const PREVIEW_W = 380

export default function Builder() {
  const { t }        = useTranslation()
  const navigate     = useNavigate()
  const dispatch     = useCVDispatch()

  const [firstName,       setFirstName]       = useState('')
  const [lastName,        setLastName]         = useState('')
  const [activeCategory,  setActiveCategory]   = useState('all')
  const [hovered,         setHovered]          = useState(null)
  const [selectedColors,  setSelectedColors]   = useState({})

  const cvData = useMemo(() => ({ firstName, lastName }), [firstName, lastName])

  const filtered = useMemo(() =>
    activeCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter(t => t.categories.includes(activeCategory)),
    [activeCategory]
  )

  function handleChoose(tpl) {
    const color = selectedColors[tpl.id] || tpl.defaultColor
    dispatch({ type: ACTIONS.SET_TEMPLATE,     payload: tpl.id })
    dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: color  })
    navigate(`/onboarding/${tpl.id}`)
  }

  function setColor(templateId, hex) {
    setSelectedColors(prev => ({ ...prev, [templateId]: hex }))
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>

      {/* ── Sticky top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        backgroundColor: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container py-4">
          <div className="d-flex flex-wrap align-items-end gap-4 mb-4">
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 5 }}>
                {t('builder.title')}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
                {t('builder.subtitle')}
              </p>
            </div>

            <div className="d-flex gap-3 ms-auto">
              <input
                type="text"
                placeholder={t('builder.firstNamePlaceholder')}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder={t('builder.lastNamePlaceholder')}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className="d-flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => {
              const count = cat.id === 'all'
                ? TEMPLATES.length
                : TEMPLATES.filter(tpl => tpl.categories.includes(cat.id)).length
              const active = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={active ? 'btn-tab-active' : 'btn-tab'}
                >
                  {t(`categories.${cat.id}`)}
                  <span className={active ? 'tab-count-active' : 'tab-count'}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Template grid ── */}
      <div className="container py-5">
        {filtered.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '60px 0', fontSize: '0.95rem' }}>
            {t('builder.noTemplates')}
          </p>
        ) : (
          <div className="builder-grid" style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${PREVIEW_W}px, 1fr))`,
            gap: 36,
            alignItems: 'start',
          }}>
            {filtered.map(tpl => (
              <TemplateCard
                key={tpl.id}
                tpl={tpl}
                cvData={cvData}
                currentColor={selectedColors[tpl.id] || tpl.defaultColor}
                isHovered={hovered === tpl.id}
                onHover={setHovered}
                onColorChange={setColor}
                onSelect={() => handleChoose(tpl)}
                t={t}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TemplateCard({ tpl, cvData, currentColor, isHovered, onHover, onColorChange, onSelect, t }) {
  return (
    <div
      onMouseEnter={() => onHover(tpl.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.18s',
        transform: isHovered ? 'translateY(-5px)' : 'none',
      }}
    >
      {/* Preview thumbnail */}
      <div style={{ position: 'relative' }}>
        <TemplatePreview
          component={tpl.component}
          data={cvData}
          accentColor={currentColor}
          previewWidth={PREVIEW_W}
        />

        {tpl.popular && (
          <div style={popularBadge}>{t('common.popular')}</div>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 8,
          backgroundColor: 'rgba(26,26,24,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.18s', pointerEvents: isHovered ? 'auto' : 'none',
        }}>
          <button onClick={onSelect} className="btn-overlay-choose">
            {t('builder.chooseTemplate')}
          </button>
        </div>
      </div>

      {/* Card info */}
      <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* Name + color swatches */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: '0.925rem', fontWeight: 700, lineHeight: 1.2 }}>{tpl.label}</span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {ACCENT_COLORS.slice(0, 6).map(color => {
              const selected = currentColor === color.hex
              return (
                <button
                  key={color.id}
                  title={t(color.labelKey)}
                  onClick={() => onColorChange(tpl.id, color.hex)}
                  style={{
                    width: 14, height: 14, borderRadius: '50%',
                    padding: 0, cursor: 'pointer', border: 'none',
                    backgroundColor: color.hex,
                    flexShrink: 0,
                    boxShadow: selected
                      ? `0 0 0 2px #fff, 0 0 0 4px ${color.hex}`
                      : '0 0 0 1px rgba(0,0,0,0.12)',
                    transition: 'box-shadow 0.15s',
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Description — clamped to 2 lines */}
        <p style={{
          fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          minHeight: '2.4em',
        }}>
          {tpl.descriptionKey}
        </p>

        {/* Category tags */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {tpl.categories.map(c => (
            <span key={c} style={catTag}>{t(`categories.${c}`)}</span>
          ))}
        </div>

        {/* CTA button */}
        <button onClick={onSelect} className="btn-template-choose">
          {t('builder.chooseBtn')}
        </button>
      </div>
    </div>
  )
}

/* ── Styles ── */
const inputStyle = {
  height: 40, padding: '0 14px',
  border: '1px solid var(--color-border)',
  borderRadius: 8, fontSize: '0.9rem',
  backgroundColor: '#fff', outline: 'none',
  width: 160, fontFamily: 'inherit',
  transition: 'border-color 0.15s',
}

const popularBadge = {
  position: 'absolute', top: 10, right: 10,
  backgroundColor: '#f59e0b', color: '#fff',
  fontSize: '0.72rem', fontWeight: 700,
  padding: '3px 9px', borderRadius: 10, letterSpacing: '0.04em',
}

const catTag = {
  fontSize: '0.72rem', padding: '2px 8px', borderRadius: 8,
  backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)',
}
