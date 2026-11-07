import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import { getCVAdvice } from '../../../utils/cvAdvice'
import { useCVState } from '../../../store/CVContext'
import { TEMPLATES } from '../../../data/templates'
import { calculateProgress, SECTIONS } from '../../../utils/progressCalc'
import { buildCVData } from '../../../utils/buildCVData'
import { StepHeader, StepNav } from './StepCoordonnees'

const STEP_KEYS = ['personalInfo', 'summary', 'experience', 'education', 'skills', 'template']

export default function StepFinaliser({ onBack, onGoTo }) {
  const { t, i18n } = useTranslation()
  const state        = useCVState()
  const pdfRef       = useRef(null)
  const [generating, setGenerating] = useState(false)

  const { global, sections } = calculateProgress(state)
  const tpl      = TEMPLATES.find(tp => tp.id === state.templateId)
  const advice   = getCVAdvice(state)
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

      {/* Comment améliorer ce CV : conseils précis, chacun avec un lien vers la bonne section */}
      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{t('editor.advice.title')}</div>
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          {advice.length ? t('editor.advice.subtitle', { count: advice.length }) : t('editor.advice.done')}
        </p>
        {advice.map((a, i) => (
          <div key={i} style={adviceRow}>
            <span style={adviceTag}>{t(`editor.steps.${STEP_KEYS[a.step]}`)}</span>
            <span style={{ flex: 1, fontSize: '0.84rem', lineHeight: 1.45 }}>{t(`editor.advice.items.${a.key}`, a.params)}</span>
            <button onClick={() => onGoTo?.(a.step)} style={adviceBtn}>
              {t('editor.advice.fix')} <ArrowRight size={13} />
            </button>
          </div>
        ))}
        {advice.length === 0 && (
          <div style={{ ...adviceRow, color: 'var(--color-text-muted)' }}>
            <CheckCircle size={16} style={{ color: 'var(--color-coral)' }} />
            <span style={{ fontSize: '0.84rem' }}>{t('editor.advice.allGood')}</span>
          </div>
        )}
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

function completionColor() {
  return 'var(--color-coral)'
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
  backgroundColor: 'var(--color-coral)', color: '#fff',
  fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', transition: 'opacity 0.15s',
}

const adviceRow = {
  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', marginBottom: 8,
  background: '#fff', border: '1px solid var(--color-border)', borderRadius: 10,
}
const adviceTag = {
  fontFamily: 'var(--font-mono)', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.05em',
  color: 'var(--color-coral-deep)', background: '#fbeaea', padding: '3px 8px', borderRadius: 99, flexShrink: 0,
}
const adviceBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0,
  background: 'none', border: '1.5px solid var(--color-border)', borderRadius: 99,
  padding: '5px 12px', fontSize: '0.78rem', fontWeight: 600, fontFamily: 'inherit',
  color: 'var(--color-text)', cursor: 'pointer',
}
