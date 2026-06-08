import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Upload, FileText, CheckCircle, AlertCircle,
  ChevronLeft, Loader2, ArrowRight, Sparkles,
} from 'lucide-react'
import { parseDocument, mapToStoreFormat } from '../services/documentParser'
import { useCVDispatch } from '../store/CVContext'
import { ACTIONS } from '../store/cvReducer'

export default function Improve() {
  const { t }    = useTranslation()
  const navigate = useNavigate()
  const dispatch = useCVDispatch()

  const [dragOver,   setDragOver]   = useState(false)
  const [stage,      setStage]      = useState('idle') // idle | loading | done | error
  const [stepIndex,  setStepIndex]  = useState(0)
  const [errorMsg,   setErrorMsg]   = useState('')
  const [result,     setResult]     = useState(null)
  const fileInputRef = useRef(null)

  const STEPS_ANIM = [
    { key: 'extract',  label: t('improve.steps.extract')  },
    { key: 'analyze',  label: t('improve.steps.analyze')  },
    { key: 'identify', label: t('improve.steps.identify') },
    { key: 'map',      label: t('improve.steps.map')      },
  ]

  async function handleFile(file) {
    if (!file) return
    setStage('loading')
    setStepIndex(0)
    setErrorMsg('')

    const stepTimer = setInterval(() => {
      setStepIndex(i => Math.min(i + 1, STEPS_ANIM.length - 1))
    }, 700)

    try {
      const parsed   = await parseDocument(file)
      const cvFields = mapToStoreFormat(parsed)
      clearInterval(stepTimer)
      setResult(cvFields)
      setStage('done')
    } catch (err) {
      clearInterval(stepTimer)
      // Translate known error codes; fall back to raw message
      const msg = err.code
        ? t(`improve.error.${err.code}`, { defaultValue: err.message })
        : (err.message || t('improve.error.generic'))
      setErrorMsg(msg)
      setStage('error')
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  function handleContinue() {
    if (!result) return
    dispatch({ type: ACTIONS.IMPORT_CV_DATA, payload: result })
    navigate('/builder')
  }

  const firstName   = result?.personalInfo?.firstName || ''
  const lastName    = result?.personalInfo?.lastName  || ''
  const expCount    = result?.experience?.length  || 0
  const eduCount    = result?.education?.length   || 0
  const skillsCount = result?.skills?.length      || 0

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', padding: '60px 0' }}>
      <div className="container" style={{ maxWidth: 720 }}>

        {/* Back */}
        <Link to="/" className="btn-editor-back" style={{ marginBottom: 40, display: 'inline-flex' }}>
          <ChevronLeft size={14} /> {t('improve.backToHome')}
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundColor: 'var(--color-text)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={20} color="#fff" />
            </div>
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', letterSpacing: '-0.03em', margin: 0 }}>
              {t('improve.title')}
            </h1>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
            {t('improve.subtitle')}
          </p>
        </div>

        {/* Pipeline diagram */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          marginBottom: 36, overflowX: 'auto', paddingBottom: 4,
        }}>
          {[
            t('improve.pipeline.input'),
            t('improve.pipeline.extract'),
            t('improve.pipeline.analyze'),
            t('improve.pipeline.output'),
          ].map((label, i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div style={{
                padding: '5px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                backgroundColor: i === 0 || i === arr.length - 1 ? 'var(--color-text)' : 'var(--color-surface)',
                color: i === 0 || i === arr.length - 1 ? '#fff' : 'var(--color-text-muted)',
                border: '1.5px solid var(--color-border)',
              }}>
                {label}
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: 28, height: 1, backgroundColor: 'var(--color-border)', margin: '0 4px' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── IDLE state — Dropzone ── */}
        {stage === 'idle' && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? 'var(--color-text)' : 'var(--color-border)'}`,
              borderRadius: 16,
              backgroundColor: dragOver ? 'var(--color-surface)' : '#fff',
              padding: '52px 32px',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              backgroundColor: 'var(--color-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Upload size={28} color="var(--color-text-muted)" />
            </div>
            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 6 }}>
              {t('improve.dropzone.title')}
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 20 }}>
              {t('improve.dropzone.subtitle')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              {['PDF', 'DOCX'].map(fmt => (
                <span key={fmt} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 12px', borderRadius: 8,
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '0.78rem', fontWeight: 600,
                  border: '1px solid var(--color-border)',
                }}>
                  <FileText size={12} /> {fmt}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 14 }}>
              {t('improve.dropzone.maxSize')}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files?.[0])}
            />
          </div>
        )}

        {/* ── LOADING state — animated steps ── */}
        {stage === 'loading' && (
          <div style={{
            backgroundColor: '#fff', borderRadius: 16,
            border: '1.5px solid var(--color-border)',
            padding: '40px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <Loader2 size={20} className="icon-spin" />
              <span style={{ fontWeight: 700 }}>{t('improve.loading')}</span>
            </div>
            {STEPS_ANIM.map((step, i) => (
              <div key={step.key} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 14, opacity: i <= stepIndex ? 1 : 0.3,
                transition: 'opacity 0.4s',
              }}>
                {i < stepIndex ? (
                  <CheckCircle size={16} color="#059669" />
                ) : i === stepIndex ? (
                  <Loader2 size={16} className="icon-spin" color="var(--color-text)" />
                ) : (
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid var(--color-border)' }} />
                )}
                <span style={{ fontSize: '0.875rem', fontWeight: i === stepIndex ? 600 : 400 }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── DONE state — results summary + CTA ── */}
        {stage === 'done' && (
          <div style={{
            backgroundColor: '#fff', borderRadius: 16,
            border: '1.5px solid var(--color-border)',
            padding: '36px 32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <CheckCircle size={28} color="#059669" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{t('improve.done.title')}</div>
                {(firstName || lastName) && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {t('improve.done.importedName', { name: [firstName, lastName].filter(Boolean).join(' ') })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
              {[
                { labelKey: 'improve.done.experiences', count: expCount },
                { labelKey: 'improve.done.education',   count: eduCount },
                { labelKey: 'improve.done.skills',      count: skillsCount },
                { labelKey: 'improve.done.languages',   count: result?.languages?.length || 0 },
              ].map(({ labelKey, count }) => (
                <div key={labelKey} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 10,
                  backgroundColor: count > 0 ? '#f0fdf4' : 'var(--color-surface)',
                  border: `1px solid ${count > 0 ? '#bbf7d0' : 'var(--color-border)'}`,
                  fontSize: '0.82rem',
                }}>
                  <span style={{ fontWeight: 600 }}>{count}</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{t(labelKey)}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
              {t('improve.done.ready')}
            </p>

            <button onClick={handleContinue} style={btnPrimary}>
              {t('improve.done.cta')}
              <ArrowRight size={16} style={{ marginLeft: 8 }} />
            </button>
          </div>
        )}

        {/* ── ERROR state ── */}
        {stage === 'error' && (
          <div style={{
            backgroundColor: '#fef2f2', borderRadius: 16,
            border: '1.5px solid #fecaca',
            padding: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <AlertCircle size={22} color="#dc2626" />
              <span style={{ fontWeight: 700, color: '#dc2626' }}>{t('improve.error.title')}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#991b1b', marginBottom: 20, lineHeight: 1.6 }}>
              {errorMsg}
            </p>
            <button
              onClick={() => { setStage('idle'); setErrorMsg('') }}
              style={{ ...btnPrimary, backgroundColor: '#dc2626' }}
            >
              {t('improve.error.retry')}
            </button>
          </div>
        )}

        {/* Privacy note */}
        {stage === 'idle' && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 24 }}>
            {t('improve.privacy')}
          </p>
        )}
      </div>
    </div>
  )
}

const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '100%', padding: '12px 24px',
  backgroundColor: 'var(--color-text)', color: '#fff',
  border: 'none', borderRadius: 10,
  fontSize: '0.9rem', fontWeight: 700,
  cursor: 'pointer', fontFamily: 'inherit',
  transition: 'opacity 0.15s',
}
