import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera, ChevronDown, ChevronLeft, ChevronRight, Download, X } from 'lucide-react'
import { useCVState, useCVDispatch } from '../../../store/CVContext'
import { ACTIONS } from '../../../store/cvReducer'
import { TEMPLATES } from '../../../data/templates'
import { COUNTRIES } from '../../../data/countries'

export default function StepCoordonnees({ onNext }) {
  const { t }    = useTranslation()
  const state    = useCVState()
  const dispatch = useCVDispatch()
  const info     = state.personalInfo

  const isPhotoTemplate = TEMPLATES.find(tpl => tpl.id === state.templateId)
    ?.categories.includes('avec-photo') ?? false

  function update(field, value) {
    dispatch({ type: ACTIONS.UPDATE_PERSONAL_INFO, payload: { [field]: value } })
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImage(file, 400)
    dispatch({ type: ACTIONS.UPDATE_PERSONAL_INFO, payload: { photo: compressed } })
  }

  function removePhoto() {
    dispatch({ type: ACTIONS.UPDATE_PERSONAL_INFO, payload: { photo: null } })
  }

  const fields = [
    { key: 'firstName', label: t('editor.personalInfo.firstName'), required: true,  half: true },
    { key: 'lastName',  label: t('editor.personalInfo.lastName'),  required: true,  half: true },
    { key: 'title',     label: t('editor.personalInfo.title_field'), required: false, half: false, hint: t('editor.personalInfo.title_hint') },
    { key: 'email',     label: t('editor.personalInfo.email'),     required: true,  half: true },
    { key: 'phone',     label: t('editor.personalInfo.phone'),     required: false, half: true },
    { key: 'city',      label: t('editor.personalInfo.city'),      required: false, half: true },
    { key: 'country',   label: t('editor.personalInfo.country'),   required: false, half: true },
    { key: 'linkedin',  label: t('editor.personalInfo.linkedin'),  required: false, half: true },
    { key: 'website',   label: t('editor.personalInfo.website'),   required: false, half: true },
  ]

  const canContinue = info.firstName?.trim() && info.lastName?.trim() && info.email?.trim()

  return (
    <div>
      <StepHeader
        title={t('editor.personalInfo.title')}
        subtitle={t('editor.personalInfo.subtitle')}
      />

      {/* Photo upload — only for photo templates */}
      {isPhotoTemplate && (
        <div style={{ marginBottom: 22 }}>
          <label style={labelStyle}>{t('editor.personalInfo.photo')}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <label
              htmlFor="photo-upload"
              style={{
                width: 90, height: 90, borderRadius: '50%', flexShrink: 0,
                border: info.photo ? `2px solid var(--color-text)` : '2px dashed var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                cursor: 'pointer', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'border-color 0.15s',
              }}
            >
              {info.photo ? (
                <img
                  src={info.photo}
                  alt="profil"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                  <Camera size={22} style={{ display: 'block', margin: '0 auto 4px' }} />
                  <span style={{ fontSize: '0.68rem' }}>{t('editor.personalInfo.addPhoto')}</span>
                </div>
              )}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              <div>{t('editor.personalInfo.photoHint')}</div>
              {info.photo && (
                <button
                  onClick={removePhoto}
                  style={{
                    marginTop: 6, fontSize: '0.75rem', color: '#dc2626',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <X size={12} />{t('editor.personalInfo.removePhoto')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
        {fields.map(f => (
          <div key={f.key} className={f.half ? 'field-half' : 'field-full'}>
            <label style={labelStyle}>
              {f.label}
              {f.required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
            </label>
            {f.key === 'country' ? (
              <CountrySelect
                value={info.country || ''}
                onChange={val => update('country', val)}
                placeholder={f.label}
                style={inputStyle(!!info.country)}
              />
            ) : (
              <input
                type={f.key === 'email' ? 'email' : 'text'}
                value={info[f.key] || ''}
                onChange={e => update(f.key, e.target.value)}
                placeholder={f.hint || f.label}
                style={inputStyle(!!info[f.key])}
              />
            )}
          </div>
        ))}
      </div>

      <StepNav onNext={onNext} canContinue={canContinue} t={t} />
    </div>
  )
}

/** Searchable country dropdown */
function CountrySelect({ value, onChange, placeholder, style }) {
  const [open,   setOpen]   = useState(false)
  const [search, setSearch] = useState('')
  const ref    = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10)
  }, [open])

  const filtered = COUNTRIES.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => { setOpen(o => !o); setSearch('') }}
        style={{
          ...style,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          userSelect: 'none',
        }}
      >
        <span style={{ color: value ? 'var(--color-text)' : '#aaa', fontSize: '0.9rem' }}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={15}
          style={{
            color: 'var(--color-text-muted)', flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s',
          }}
        />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
          backgroundColor: '#fff',
          border: '1.5px solid var(--color-text)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          overflow: 'hidden',
        }}>
          {/* Search input */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setOpen(false)}
              placeholder="Rechercher un pays..."
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '0.875rem', fontFamily: 'inherit',
                backgroundColor: 'transparent',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-text-muted)', display: 'flex' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Country list */}
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length > 0 ? filtered.map(c => (
              <div
                key={c}
                onClick={() => { onChange(c); setOpen(false); setSearch('') }}
                style={{
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  backgroundColor: c === value ? 'var(--color-surface)' : 'transparent',
                  fontWeight: c === value ? 600 : 400,
                  transition: 'background-color 0.1s',
                }}
                onMouseEnter={e => { if (c !== value) e.currentTarget.style.backgroundColor = 'var(--color-bg)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = c === value ? 'var(--color-surface)' : 'transparent' }}
              >
                {c}
              </div>
            )) : (
              <div style={{ padding: '12px 14px', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Aucun résultat
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Resize + compress an image file to a max width, returns a base64 JPEG */
function compressImage(file, maxWidth) {
  return new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = e => {
      const img = new Image()
      img.onload = () => {
        const ratio  = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width  = img.width  * ratio
        canvas.height = img.height * ratio
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.88))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

// ── Shared sub-components ──

export function StepHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>{title}</h2>
      {subtitle && <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 5, lineHeight: 1.5 }}>{subtitle}</p>}
    </div>
  )
}

export function StepNav({ onBack, onNext, canContinue = true, t, isLast = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--color-border)' }}>
      {onBack ? (
        <button onClick={onBack} className="btn-step-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ChevronLeft size={15} />{t('common.back')}
        </button>
      ) : <div />}
      <button
        onClick={onNext}
        disabled={!canContinue}
        className="btn-step-primary"
        style={{ opacity: canContinue ? 1 : 0.45, cursor: canContinue ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}
      >
        {isLast
          ? <><Download size={14} />{t('editor.finalize.downloadPDFSoon')}</>
          : <>{t('common.next')}<ChevronRight size={15} /></>
        }
      </button>
    </div>
  )
}

export const labelStyle = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600,
  marginBottom: 6, color: 'var(--color-text)',
}

export const inputStyle = (filled) => ({
  width: '100%', height: 42, padding: '0 13px',
  border: `1.5px solid ${filled ? 'var(--color-text)' : 'var(--color-border)'}`,
  borderRadius: 8, fontSize: '0.9rem',
  backgroundColor: '#fff', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
})

export const textareaStyle = (filled) => ({
  width: '100%', padding: '11px 13px',
  border: `1.5px solid ${filled ? 'var(--color-text)' : 'var(--color-border)'}`,
  borderRadius: 8, fontSize: '0.9rem',
  backgroundColor: '#fff', outline: 'none',
  fontFamily: 'inherit', resize: 'vertical', minHeight: 130,
  transition: 'border-color 0.15s',
})
