import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Loader2, CheckCircle } from 'lucide-react'
import { useCVState, useCVDispatch } from '../../../store/CVContext'
import { ACTIONS } from '../../../store/cvReducer'
import { ACCENT_COLORS, TEMPLATES } from '../../../data/templates'
import { calculateProgress, SECTIONS } from '../../../utils/progressCalc'
import { buildCVData } from '../../../utils/buildCVData'
import { StepHeader, StepNav } from './StepCoordonnees'

export default function StepFinaliser({ onBack }) {
  const { t, i18n } = useTranslation()
  const state        = useCVState()
  const dispatch     = useCVDispatch()
  const pdfRef       = useRef(null)
  const [generating, setGenerating] = useState(false)

  const { global, sections } = calculateProgress(state)
  const tpl      = TEMPLATES.find(tp => tp.id === state.templateId)
  const tips     = ['tip1', 'tip2', 'tip3', 'tip4']
  const pdfData  = buildCVData(state, i18n.language)
  const CVTpl    = tpl?.component
  const firstName = state.personalInfo.firstName || 'CV'
  const lastName  = state.personalInfo.lastName  || ''

  async function handlePDF() {
    if (!pdfRef.current || generating) return
    setGenerating(true)
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 794,
        windowWidth: 794,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf     = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297)
      pdf.save(`${firstName}${lastName ? '_' + lastName : ''}_CV.pdf`)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <StepHeader title={t('editor.finalize.title')} subtitle={t('editor.finalize.subtitle')} />

      {/* Global completion */}
      <div style={completionBar}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {t('editor.finalize.completion', { percent: global })}
          </span>
          <span style={{ fontSize: '0.85rem', color: completionColor(global) }}>{global}%</span>
        </div>
        <div style={progressTrack}>
          <div style={{ ...progressFill, width: `${global}%`, backgroundColor: completionColor(global) }} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {SECTIONS.map(sec => (
            <div key={sec.id} style={{ flex: 1, minWidth: 80, textAlign: 'center' }}>
              <div style={{ height: 4, borderRadius: 2, backgroundColor: 'var(--color-surface-2)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${sections[sec.id]}%`, backgroundColor: completionColor(sections[sec.id]), borderRadius: 2 }} />
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: 3 }}>
                {t(`progress.sections.${sec.id}`)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div style={{ marginTop: 24, marginBottom: 20 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>{t('editor.finalize.colorTitle')}</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 10 }}>{t('editor.finalize.colorHint')}</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {ACCENT_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: c.hex })}
              title={t(c.labelKey)}
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

      {/* PDF Download */}
      <div style={pdfSection}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{t('editor.finalize.downloadPDF')}</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
            {t('editor.finalize.pdfNote')}
          </p>
        </div>
        <button
          onClick={handlePDF}
          disabled={generating}
          style={{ ...dlBtn, opacity: generating ? 0.65 : 1, cursor: generating ? 'wait' : 'pointer', minWidth: 100 }}
        >
          {generating ? (
            <><Loader2 size={15} className="icon-spin" style={{ marginRight: 6 }} />{t('editor.finalize.pdfGenerating')}</>
          ) : (
            <><Download size={15} style={{ marginRight: 6 }} />PDF</>
          )}
        </button>
      </div>

      {/* Tips */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 10 }}>{t('editor.finalize.tips')}</div>
        {tips.map(k => (
          <div key={k} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: '0.82rem', color: 'var(--color-text-muted)', alignItems: 'flex-start' }}>
            <CheckCircle size={14} style={{ color: '#059669', flexShrink: 0, marginTop: 1 }} />
            {t(`editor.finalize.${k}`)}
          </div>
        ))}
      </div>

      <StepNav onBack={onBack} onNext={() => {}} canContinue={false} t={t} isLast />

      {/* Hidden full-size render for PDF capture */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, zIndex: -1, pointerEvents: 'none' }}>
        <div ref={pdfRef} style={{ width: 794 }}>
          {CVTpl && (
            <CVTpl
              data={{
                firstName: state.personalInfo.firstName,
                lastName:  state.personalInfo.lastName,
                photo:     state.personalInfo.photo,
                _cv:       pdfData,
              }}
              accentColor={state.accentColor || tpl?.defaultColor}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function completionColor(pct) {
  if (pct < 40) return '#f59e0b'
  if (pct < 70) return '#3b82f6'
  return '#059669'
}

const completionBar = {
  backgroundColor: 'var(--color-surface)', borderRadius: 12, padding: '16px 18px',
  border: '1px solid var(--color-border)',
}
const progressTrack = {
  height: 8, borderRadius: 4,
  backgroundColor: 'var(--color-surface-2)', overflow: 'hidden',
}
const progressFill = {
  height: '100%', borderRadius: 4, transition: 'width 0.4s ease',
}
const pdfSection = {
  display: 'flex', gap: 16, alignItems: 'center',
  backgroundColor: 'var(--color-surface)', borderRadius: 12,
  padding: '16px 18px', border: '1px solid var(--color-border)',
}
const dlBtn = {
  padding: '8px 20px', border: 'none', borderRadius: 8,
  backgroundColor: 'var(--color-text)', color: '#fff',
  fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', transition: 'opacity 0.15s',
}
