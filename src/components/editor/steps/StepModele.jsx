import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera, Check } from 'lucide-react'
import { useCVState, useCVDispatch } from '../../../store/CVContext'
import { ACTIONS } from '../../../store/cvReducer'
import { TEMPLATES, ACCENT_COLORS } from '../../../data/templates'
import { buildCVData } from '../../../utils/buildCVData'
import TemplatePreview from '../../TemplatePreview'
import { StepHeader, StepNav, PhotoField } from './StepCoordonnees'

const hasPhoto = tpl => tpl?.categories.includes('avec-photo')

/**
 * Étape « Choisissez » : le modèle vient à la fin, une fois le contenu prêt.
 * Changer de modèle ne touche pas aux données (contenu séparé de la présentation).
 */
export default function StepModele({ onNext, onBack }) {
  const { t, i18n } = useTranslation()
  const state       = useCVState()
  const dispatch    = useCVDispatch()

  const data = useMemo(() => ({
    firstName: state.personalInfo.firstName,
    lastName:  state.personalInfo.lastName,
    photo:     state.personalInfo.photo,
    _cv:       buildCVData(state, i18n.language),
  }), [state, i18n.language])

  function choose(tpl) {
    dispatch({ type: ACTIONS.SET_TEMPLATE,     payload: tpl.id })
    dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: tpl.defaultColor })
  }

  const selected = TEMPLATES.find(tpl => tpl.id === state.templateId)

  return (
    <div>
      <StepHeader title={t('editor.template.title')} subtitle={t('editor.template.subtitle')} />

      {/* Le modèle choisi affiche une photo : on la demande ici, sans revenir en arrière */}
      {hasPhoto(selected) && (
        <div style={{
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 12, padding: '16px 18px 0', marginBottom: 24,
        }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
            {t('editor.template.photoNeeded', { name: selected.label })}
          </p>
          <PhotoField />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
        {TEMPLATES.map(tpl => {
          const active = tpl.id === state.templateId
          return (
            <button
              key={tpl.id}
              onClick={() => choose(tpl)}
              aria-pressed={active}
              style={{
                background: 'none', border: 0, padding: 0, cursor: 'pointer',
                textAlign: 'left', fontFamily: 'inherit', color: 'var(--color-text)',
              }}
            >
              <div style={{
                borderRadius: 10, position: 'relative',
                outline: active ? '2.5px solid var(--color-coral)' : '1px solid var(--color-border)',
                outlineOffset: active ? 3 : 0,
              }}>
                <TemplatePreview
                  component={tpl.component}
                  data={data}
                  accentColor={active ? (state.accentColor || tpl.defaultColor) : tpl.defaultColor}
                  previewWidth={140}
                />
                {hasPhoto(tpl) && (
                  <span title={t('editor.template.withPhoto')} style={{
                    position: 'absolute', top: 8, left: 8, padding: '3px 7px', borderRadius: 99,
                    background: 'rgba(255,255,255,.92)', color: 'var(--color-text)', fontSize: '0.65rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 1px 4px rgba(0,0,0,.12)',
                  }}><Camera size={11} />{t('editor.template.withPhoto')}</span>
                )}
                {active && (
                  <span style={{
                    position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%',
                    background: 'var(--color-coral)', color: '#fff', display: 'grid', placeItems: 'center',
                  }}><Check size={13} /></span>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: active ? 700 : 500, marginTop: 8 }}>{tpl.label}</div>
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: 28 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>{t('editor.finalize.colorTitle')}</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>{t('editor.finalize.colorHint')}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {ACCENT_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: c.hex })}
              title={t(c.labelKey)}
              aria-label={t(c.labelKey)}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none',
                backgroundColor: c.hex, cursor: 'pointer',
                outline: state.accentColor === c.hex ? `3px solid ${c.hex}` : '3px solid transparent',
                outlineOffset: 3,
                transform: state.accentColor === c.hex ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.15s',
              }}
            />
          ))}
        </div>
      </div>

      <StepNav onBack={onBack} onNext={onNext} t={t} />
    </div>
  )
}
