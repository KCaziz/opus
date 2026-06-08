import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Check } from 'lucide-react'
import { useCVState } from '../../store/CVContext'
import { TEMPLATES } from '../../data/templates'
import { calculateProgress } from '../../utils/progressCalc'
import { buildCVData } from '../../utils/buildCVData'
import TemplatePreview from '../TemplatePreview'

const STEPS = [
  'personalInfo', 'summary', 'experience', 'education', 'skills', 'finalize',
]

export default function WizardLayout({ currentStep, onStepChange, children }) {
  const { t, i18n } = useTranslation()
  const cvState     = useCVState()
  const tpl         = TEMPLATES.find(t => t.id === cvState.templateId)
  const { global: globalPct } = calculateProgress(cvState)

  const previewData = useMemo(() => ({
    firstName: cvState.personalInfo.firstName,
    lastName:  cvState.personalInfo.lastName,
    photo:     cvState.personalInfo.photo,
    _cv:       buildCVData(cvState, i18n.language),
  }), [cvState, i18n.language])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>

      {/* ── Top bar ── */}
      <div style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid var(--color-border)',
        padding: '10px 0',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <div className="container d-flex align-items-center gap-3">

          {/* Back button — real button appearance */}
          <Link
            to="/builder"
            className="btn-editor-back"
          >
            <ChevronLeft size={15} style={{ flexShrink: 0 }} />
            {t('editor.backToTemplates')}
          </Link>

          {/* Separator */}
          <div style={{ width: 1, height: 24, backgroundColor: 'var(--color-border)' }} />

          {/* Template name */}
          {tpl && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {cvState.accentColor && (
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  backgroundColor: cvState.accentColor, flexShrink: 0,
                }} />
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                {tpl.label}
              </span>
            </div>
          )}

          {/* Progress pill — right side */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <ProgressPill pct={globalPct} label={t('editor.progressLabel')} />
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="editor-main-layout" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left: Step nav + form (48%) */}
        <div className="editor-form-col" style={{
          flex: '0 0 48%', overflowY: 'auto',
          padding: '32px 0',
          borderRight: '1px solid var(--color-border)',
        }}>
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 28px' }}>

            {/* Step progress pills */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 36, position: 'relative' }}>
              {STEPS.map((step, idx) => (
                <StepPill
                  key={step}
                  index={idx}
                  label={t(`editor.steps.${step}`)}
                  total={STEPS.length}
                  isActive={idx === currentStep}
                  isDone={idx < currentStep}
                  onClick={() => idx < currentStep && onStepChange(idx)}
                />
              ))}
            </div>

            {/* Form content */}
            {children}
          </div>
        </div>

        {/* Right: Live preview (52%) */}
        <div
          className="editor-preview-panel"
          style={{
            flex: '0 0 52%', overflowY: 'auto',
            backgroundColor: 'var(--color-surface)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '32px 24px',
          }}
        >
          <p style={{
            fontSize: '0.72rem', color: 'var(--color-text-muted)',
            marginBottom: 16, letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            {t('editor.livePreview')}
          </p>
          {tpl ? (
            <TemplatePreview
              component={tpl.component}
              data={previewData}
              accentColor={cvState.accentColor || tpl.defaultColor}
              previewWidth={520}
            />
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Aucun template sélectionné
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StepPill({ index, label, total, isActive, isDone, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1, textAlign: 'center', position: 'relative',
        cursor: isDone ? 'pointer' : 'default',
        paddingBottom: 10,
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: '50%', margin: '0 auto 6px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.72rem', fontWeight: 700, transition: 'all 0.2s',
        backgroundColor: isActive ? 'var(--color-text)' : isDone ? 'var(--color-text)' : 'var(--color-surface)',
        color: isActive || isDone ? '#fff' : 'var(--color-text-muted)',
        border: isActive ? '2px solid var(--color-text)' : isDone ? 'none' : '1.5px solid var(--color-border)',
      }}>
        {isDone ? <Check size={12} /> : index + 1}
      </div>
      <div className="step-pill-label" style={{
        fontSize: '0.72rem',
        color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
        fontWeight: isActive ? 700 : 400,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {label}
      </div>
      {/* Connector line */}
      {index < total - 1 && (
        <div style={{
          position: 'absolute', top: 13, left: '50%', right: '-50%',
          height: 2,
          backgroundColor: isDone ? 'var(--color-text)' : 'var(--color-surface-2)',
          zIndex: -1,
        }} />
      )}
    </div>
  )
}

function ProgressPill({ pct, label }) {
  const color = pct < 40 ? '#f59e0b' : pct < 70 ? '#3b82f6' : '#059669'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%', position: 'relative',
        background: `conic-gradient(${color} ${pct * 3.6}deg, var(--color-surface) 0deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          backgroundColor: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800,
          color: 'var(--color-text)',
        }}>
          {pct}%
        </div>
      </div>
      <div>
        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text)' }}>{pct}%</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{label}</div>
      </div>
    </div>
  )
}
