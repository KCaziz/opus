import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2 } from 'lucide-react'
import { useCVState, useCVDispatch } from '../../../store/CVContext'
import { ACTIONS } from '../../../store/cvReducer'
import { StepHeader, StepNav, labelStyle, inputStyle } from './StepCoordonnees'

const CURRENT_YEAR = new Date().getFullYear()
const MIN_YEAR     = 1950

const EMPTY_ENTRY = { degree: '', school: '', location: '', startYear: '', endYear: '', grade: '' }

export default function StepFormation({ onBack, onNext }) {
  const { t }    = useTranslation()
  const state    = useCVState()
  const dispatch = useCVDispatch()
  const edu      = state.education
  const [editing, setEditing] = useState(null)
  const [draft,   setDraft]   = useState({ ...EMPTY_ENTRY })

  function openNew()    { setDraft({ ...EMPTY_ENTRY }); setEditing('new') }
  function openEdit(i)  { setDraft({ ...edu[i] });       setEditing(i)    }
  function closeDraft() { setEditing(null) }

  const yearError = (draft.startYear && draft.endYear && Number(draft.endYear) < Number(draft.startYear))
    ? t('editor.education.yearError')
    : null

  function setYear(key, raw) {
    const clamped = raw === '' ? '' : String(Math.min(CURRENT_YEAR, Math.max(MIN_YEAR, Number(raw))))
    setDraft(d => ({ ...d, [key]: clamped }))
  }

  function saveDraft() {
    if (!draft.degree?.trim() || !draft.school?.trim() || yearError) return
    if (editing === 'new') {
      dispatch({ type: ACTIONS.ADD_EDUCATION, payload: draft })
    } else {
      dispatch({ type: ACTIONS.UPDATE_EDUCATION, payload: { index: editing, data: draft } })
    }
    closeDraft()
  }

  const textFields = [
    { key: 'degree',   label: t('editor.education.degree'),   required: true,  half: false },
    { key: 'school',   label: t('editor.education.school'),   required: true,  half: true  },
    { key: 'location', label: t('editor.education.location'), required: false, half: true  },
  ]

  return (
    <div>
      <StepHeader title={t('editor.education.title')} subtitle={t('editor.education.subtitle')} />

      {edu.length > 0 && editing === null && (
        <div style={{ marginBottom: 20 }}>
          {edu.map((e, i) => (
            <EduCard key={i} entry={e}
              onEdit={() => openEdit(i)}
              onDelete={() => dispatch({ type: ACTIONS.REMOVE_EDUCATION, payload: i })}
            />
          ))}
        </div>
      )}

      {editing === null && (
        <button onClick={openNew} style={addBtn}>
          + {t('editor.education.addEntry')}
        </button>
      )}

      {editing !== null && (
        <div style={formCard}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 16 }}>
            {editing === 'new' ? t('editor.education.addEntry') : t('editor.education.editEntry')}
          </h4>

          {/* Text fields */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {textFields.map(f => (
              <div key={f.key} className={f.half ? 'field-half' : 'field-full'}>
                <label style={labelStyle}>
                  {f.label}
                  {f.required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
                </label>
                <input
                  type="text"
                  value={draft[f.key]}
                  onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.label}
                  style={inputStyle(!!draft[f.key])}
                />
              </div>
            ))}
          </div>

          {/* Year fields */}
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <div className="field-half">
              <label style={labelStyle}>{t('editor.education.startYear')}</label>
              <input
                type="number"
                value={draft.startYear}
                min={MIN_YEAR}
                max={CURRENT_YEAR}
                step={1}
                placeholder="2020"
                onChange={e => setDraft(d => ({ ...d, startYear: e.target.value }))}
                onBlur={e => setYear('startYear', e.target.value)}
                style={inputStyle(!!draft.startYear)}
              />
            </div>
            <div className="field-half">
              <label style={labelStyle}>{t('editor.education.endYear')}</label>
              <input
                type="number"
                value={draft.endYear}
                min={draft.startYear || MIN_YEAR}
                max={CURRENT_YEAR}
                step={1}
                placeholder={String(CURRENT_YEAR)}
                onChange={e => setDraft(d => ({ ...d, endYear: e.target.value }))}
                onBlur={e => setYear('endYear', e.target.value)}
                style={{
                  ...inputStyle(!!draft.endYear),
                  ...(yearError ? { borderColor: '#dc2626' } : {}),
                }}
              />
              {yearError && (
                <span style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: 4, display: 'block' }}>
                  {yearError}
                </span>
              )}
            </div>
          </div>

          {/* Grade */}
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>{t('editor.education.grade')}</label>
            <input
              type="text"
              value={draft.grade}
              onChange={e => setDraft(d => ({ ...d, grade: e.target.value }))}
              placeholder={t('editor.education.grade')}
              style={inputStyle(!!draft.grade)}
            />
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={closeDraft} style={cancelBtn}>{t('common.cancel')}</button>
            <button
              onClick={saveDraft}
              disabled={!draft.degree?.trim() || !draft.school?.trim() || !!yearError}
              style={{ ...saveBtn, opacity: (draft.degree?.trim() && draft.school?.trim() && !yearError) ? 1 : 0.4 }}
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      )}

      <StepNav onBack={onBack} onNext={onNext} canContinue={edu.length > 0 && editing === null} t={t} />
    </div>
  )
}

function EduCard({ entry, onEdit, onDelete }) {
  return (
    <div style={{
      backgroundColor: '#fff', border: '1.5px solid var(--color-border)',
      borderRadius: 10, padding: '12px 14px', marginBottom: 8,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{entry.degree}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
          {entry.school}{entry.location ? ` · ${entry.location}` : ''}
        </div>
        {(entry.startYear || entry.endYear) && (
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {entry.startYear}{entry.endYear ? ` — ${entry.endYear}` : ''}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onEdit}   style={iconActionBtn('#2563eb')}><Pencil size={12} /></button>
        <button onClick={onDelete} style={iconActionBtn('#dc2626')}><Trash2 size={12} /></button>
      </div>
    </div>
  )
}

const addBtn    = { width: '100%', padding: '10px', border: '1.5px dashed var(--color-border)', borderRadius: 10, backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', color: 'var(--color-text)' }
const formCard  = { backgroundColor: 'var(--color-surface)', borderRadius: 12, padding: '20px', marginBottom: 16, border: '1px solid var(--color-border)' }
const cancelBtn = { padding: '8px 18px', border: '1.5px solid var(--color-border)', borderRadius: 8, backgroundColor: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'inherit' }
const saveBtn   = { padding: '8px 20px', border: 'none', borderRadius: 8, backgroundColor: 'var(--color-text)', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit' }
const iconActionBtn = (color) => ({ width: 28, height: 28, border: 'none', borderRadius: 6, backgroundColor: `${color}15`, color, fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' })
