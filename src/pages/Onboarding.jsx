import { useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft, Upload, Check, CheckCircle,
  Loader2, AlertCircle, Pencil, ArrowRight,
  User, Briefcase, GraduationCap, Wrench,
} from 'lucide-react'
import { TEMPLATES } from '../data/templates'
import { parseDocument, mapToStoreFormat } from '../services/documentParser'
import { useCVDispatch, useCVState } from '../store/CVContext'
import { ACTIONS } from '../store/cvReducer'

export default function Onboarding() {
  const { t }        = useTranslation()
  const { templateId } = useParams()
  const navigate       = useNavigate()
  const dispatch       = useCVDispatch()
  const cvState        = useCVState()

  // Check if data was already imported (e.g. from /improve flow)
  const hasImportedData = !!(
    cvState.personalInfo.firstName ||
    cvState.summary ||
    cvState.experience.length > 0
  )

  const tpl = TEMPLATES.find(t => t.id === templateId)

  const [dragOver,   setDragOver]   = useState(false)
  const [parseState, setParseState] = useState('idle') // idle | analyzing | done | error
  const [parseError, setParseError] = useState('')
  const fileInputRef = useRef(null)

  if (!tpl) {
    return (
      <div className="container section-gap">
        <p>Modèle introuvable. <Link to="/builder">Retour</Link></p>
      </div>
    )
  }

  async function handleFile(file) {
    if (!file) return
    setParseState('analyzing')
    setParseError('')
    try {
      const parsed   = await parseDocument(file)
      const cvFields = mapToStoreFormat(parsed)
      dispatch({ type: ACTIONS.IMPORT_CV_DATA, payload: cvFields })
      dispatch({ type: ACTIONS.SET_TEMPLATE,     payload: tpl.id          })
      dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: tpl.defaultColor })
      setParseState('done')
      setTimeout(() => navigate('/editor'), 800)
    } catch (err) {
      setParseState('error')
      setParseError(err.message)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  function handleScratch() {
    // If data was pre-imported (from /improve), preserve it; otherwise reset
    if (!hasImportedData) {
      dispatch({ type: ACTIONS.RESET })
    }
    dispatch({ type: ACTIONS.SET_TEMPLATE,     payload: tpl.id          })
    dispatch({ type: ACTIONS.SET_ACCENT_COLOR, payload: tpl.defaultColor })
    navigate('/editor')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: 860 }}>
        <Link to="/builder" className="btn-editor-back">
          <ChevronLeft size={14} /> {t('editor.backToTemplates')}
        </Link>

        <div style={{ textAlign: 'center', margin: '32px 0 48px' }}>
          <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.03em' }}>
            {t('onboarding.title')}
          </h1>
          <p
            style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 8 }}
            dangerouslySetInnerHTML={{
              __html: t('onboarding.subtitle', { template: `<strong>${tpl.label}</strong>` })
            }}
          />
        </div>

        <div className="row g-4">
          {/* ── Option A: Import ── */}
          <div className="col-md-6">
            <div style={{
              ...cardBase,
              borderStyle: dragOver ? 'solid' : 'dashed',
              borderColor: dragOver ? 'var(--color-text)' : 'var(--color-border)',
              backgroundColor: dragOver ? 'var(--color-surface)' : '#fff',
            }}>
              <div style={iconCircle('var(--color-surface)')}>
                <Upload size={26} color="var(--color-text)" />
              </div>

              <h3 style={cardTitle}>{t('onboarding.import.title')}</h3>
              <p style={cardDesc}>{t('onboarding.import.desc')}</p>

              {parseState === 'idle' && (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  style={dropzone}
                >
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {t('onboarding.import.dropzone')}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {t('onboarding.import.or')}
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{ ...btnOutline, marginTop: 4 }}
                  >
                    {t('onboarding.import.browse')}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    style={{ display: 'none' }}
                    onChange={e => handleFile(e.target.files[0])}
                  />
                  <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: '8px 0 0' }}>
                    {t('onboarding.import.formats')}
                  </p>
                </div>
              )}

              {parseState === 'analyzing' && (
                <div style={{ textAlign: 'center', padding: '20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <Loader2 size={22} className="icon-spin" />
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{t('onboarding.import.analyzing')}</p>
                </div>
              )}

              {parseState === 'done' && (
                <div style={{ textAlign: 'center', padding: '16px 0', color: '#059669', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={28} color="#059669" />
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>{t('onboarding.import.success')}</p>
                </div>
              )}

              {parseState === 'error' && (
                <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: 8, marginTop: 8 }}>
                  <p style={{ fontSize: '0.8rem', color: '#dc2626', margin: 0 }}>{parseError}</p>
                  <button
                    onClick={() => setParseState('idle')}
                    style={{ ...btnOutline, marginTop: 8, fontSize: '0.75rem' }}
                  >
                    Réessayer
                  </button>
                </div>
              )}

              <div style={aiBadge}>
                ✦ {t('onboarding.import.aiHint')}
              </div>
            </div>
          </div>

          {/* ── Option B: Scratch ── */}
          <div className="col-md-6">
            <div style={{ ...cardBase, borderStyle: 'solid' }}>
              <div style={iconCircle(hasImportedData ? '#059669' : 'var(--color-text)')}>
                {hasImportedData ? <Check size={26} color="#fff" /> : <Pencil size={26} color="#fff" />}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h3 style={{ ...cardTitle, margin: 0 }}>
                  {hasImportedData ? 'Continuer avec mes données' : t('onboarding.scratch.title')}
                </h3>
                {!hasImportedData && <span style={recommendedBadge}>{t('onboarding.scratch.badge')}</span>}
                {hasImportedData  && <span style={{ ...recommendedBadge, backgroundColor: '#d1fae5', color: '#065f46' }}>Importé ✓</span>}
              </div>

              <p style={cardDesc}>
                {hasImportedData
                  ? 'Vos informations ont été importées depuis votre CV. Cliquez sur Continuer pour les utiliser avec ce template.'
                  : t('onboarding.scratch.desc')}
              </p>

              <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: User,          label: t('editor.steps.personalInfo') },
                  { icon: Briefcase,     label: t('editor.steps.experience')   },
                  { icon: GraduationCap, label: t('editor.steps.education')    },
                  { icon: Wrench,        label: t('editor.steps.skills')       },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    <Icon size={14} />
                    {label}
                  </div>
                ))}
              </div>

              <button onClick={handleScratch} style={btnPrimary}>
                {hasImportedData ? 'Continuer' : t('onboarding.scratch.cta')}
                <ArrowRight size={14} style={{ marginLeft: 6 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Styles ── */
const cardBase = {
  backgroundColor: '#fff', borderRadius: 16,
  border: '1.5px solid var(--color-border)',
  padding: '32px 28px',
  height: '100%', display: 'flex', flexDirection: 'column',
  transition: 'border-color 0.15s, background-color 0.15s',
}
const iconCircle = (bg) => ({
  width: 56, height: 56, borderRadius: '50%',
  backgroundColor: bg, display: 'flex',
  alignItems: 'center', justifyContent: 'center',
  marginBottom: 20,
})
const cardTitle = { fontSize: '1.05rem', fontWeight: 700, marginBottom: 8 }
const cardDesc  = { fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }
const dropzone  = {
  border: '1.5px dashed var(--color-border)',
  borderRadius: 10, padding: '20px',
  display: 'flex', flexDirection: 'column',
  alignItems: 'center', gap: 6,
  marginTop: 16, backgroundColor: 'var(--color-bg)',
}
const btnOutline = {
  border: '1px solid var(--color-border)',
  borderRadius: 8, padding: '6px 16px',
  fontSize: '0.82rem', cursor: 'pointer',
  backgroundColor: '#fff', fontFamily: 'inherit',
}
const btnPrimary = {
  marginTop: 'auto', paddingTop: 24,
  width: '100%', padding: '10px 0',
  backgroundColor: 'var(--color-text)', color: '#fff',
  border: 'none', borderRadius: 10,
  fontSize: '0.9rem', fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'opacity 0.15s',
}
const aiBadge = {
  marginTop: 'auto', paddingTop: 16,
  fontSize: '0.72rem', color: 'var(--color-text-muted)',
  display: 'flex', alignItems: 'center',
}
const recommendedBadge = {
  fontSize: '0.68rem', fontWeight: 700,
  backgroundColor: '#d1fae5', color: '#065f46',
  padding: '2px 8px', borderRadius: 10,
}
