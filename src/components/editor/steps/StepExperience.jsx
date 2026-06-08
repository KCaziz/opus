import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pencil, Trash2, X } from 'lucide-react'
import { useCVState, useCVDispatch } from '../../../store/CVContext'
import { ACTIONS } from '../../../store/cvReducer'
import { StepHeader, StepNav, labelStyle, inputStyle } from './StepCoordonnees'

const TODAY_MONTH = new Date().toISOString().slice(0, 7) // e.g. "2026-06"
const MIN_MONTH   = '1950-01'

const EMPTY_ENTRY = {
  title: '', company: '', location: '',
  startDate: '', endDate: '', isCurrent: false,
  bullets: [''],
}

export default function StepExperience({ onBack, onNext }) {
  const { t }    = useTranslation()
  const state    = useCVState()
  const dispatch = useCVDispatch()
  const [editing, setEditing] = useState(null) // null | 'new' | index

  const exp = state.experience
  const [draft, setDraft] = useState({ ...EMPTY_ENTRY })

  function openNew()     { setDraft({ ...EMPTY_ENTRY }); setEditing('new') }
  function openEdit(i)   { setDraft({ ...exp[i] });       setEditing(i)    }
  function closeDraft()  { setEditing(null) }

  const dateError = (!draft.isCurrent && draft.startDate && draft.endDate && draft.endDate < draft.startDate)
    ? t('editor.experience.dateError')
    : null

  function saveDraft() {
    if (!draft.title?.trim() || !draft.company?.trim() || dateError) return
    if (editing === 'new') {
      dispatch({ type: ACTIONS.ADD_EXPERIENCE, payload: draft })
    } else {
      dispatch({ type: ACTIONS.UPDATE_EXPERIENCE, payload: { index: editing, data: draft } })
    }
    closeDraft()
  }

  function removeEntry(i) {
    dispatch({ type: ACTIONS.REMOVE_EXPERIENCE, payload: i })
  }

  function updateBullet(i, val) {
    const bullets = [...draft.bullets]
    bullets[i] = val
    setDraft(d => ({ ...d, bullets }))
  }

  function addBullet() {
    setDraft(d => ({ ...d, bullets: [...d.bullets, ''] }))
  }

  return (
    <div>
      <StepHeader title={t('editor.experience.title')} subtitle={t('editor.experience.subtitle')} />

      {/* List of saved entries */}
      {exp.length > 0 && editing === null && (
        <div style={{ marginBottom: 20 }}>
          {exp.map((e, i) => (
            <EntryCard
              key={i}
              title={e.title}
              subtitle={`${e.company}${e.location ? ` · ${e.location}` : ''}`}
              meta={e.period || e.startDate}
              onEdit={() => openEdit(i)}
              onDelete={() => removeEntry(i)}
            />
          ))}
        </div>
      )}

      {editing === null && (
        <button onClick={openNew} style={addBtn}>
          + {t('editor.experience.addEntry')}
        </button>
      )}

      {/* Draft form */}
      {editing !== null && (
        <div style={formCard}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 16 }}>
            {editing === 'new' ? t('editor.experience.addEntry') : t('editor.experience.editEntry')}
          </h4>

          <div style={{ display: 'flex', gap: 12 }}>
            <Field label={t('editor.experience.jobTitle')} required>
              <input
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                style={inputStyle(!!draft.title)}
              />
            </Field>
            <Field label={t('editor.experience.company')} required>
              <input
                value={draft.company}
                onChange={e => setDraft(d => ({ ...d, company: e.target.value }))}
                style={inputStyle(!!draft.company)}
              />
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            <Field label={t('editor.experience.location')}>
              <input
                value={draft.location}
                onChange={e => setDraft(d => ({ ...d, location: e.target.value }))}
                style={inputStyle(!!draft.location)}
              />
            </Field>
            <Field label={t('editor.experience.startDate')}>
              <input
                type="month"
                value={draft.startDate}
                min={MIN_MONTH}
                max={TODAY_MONTH}
                onChange={e => setDraft(d => ({ ...d, startDate: e.target.value }))}
                style={inputStyle(!!draft.startDate)}
              />
            </Field>
            {!draft.isCurrent && (
              <Field label={t('editor.experience.endDate')}>
                <input
                  type="month"
                  value={draft.endDate}
                  min={draft.startDate || MIN_MONTH}
                  max={TODAY_MONTH}
                  onChange={e => setDraft(d => ({ ...d, endDate: e.target.value }))}
                  style={{
                    ...inputStyle(!!draft.endDate),
                    ...(dateError ? { borderColor: '#dc2626' } : {}),
                  }}
                />
                {dateError && (
                  <span style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: 4, display: 'block' }}>
                    {dateError}
                  </span>
                )}
              </Field>
            )}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, fontSize: '0.82rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={draft.isCurrent}
              onChange={e => setDraft(d => ({ ...d, isCurrent: e.target.checked, endDate: '' }))}
            />
            {t('editor.experience.current')}
          </label>

          {/* Bullet points */}
          <div style={{ marginTop: 14 }}>
            <label style={labelStyle}>{t('editor.experience.description')}</label>
            {draft.bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <input
                  value={b}
                  onChange={e => updateBullet(i, e.target.value)}
                  placeholder={t('editor.experience.bulletPlaceholder')}
                  style={{ ...inputStyle(!!b), flex: 1 }}
                />
                {draft.bullets.length > 1 && (
                  <button
                    onClick={() => setDraft(d => ({ ...d, bullets: d.bullets.filter((_, j) => j !== i) }))}
                    style={iconBtn}
                  ><X size={14} /></button>
                )}
              </div>
            ))}
            <button onClick={addBullet} style={ghostBtn}>{t('editor.experience.addBullet')}</button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button onClick={closeDraft} style={cancelBtn}>{t('common.cancel')}</button>
            <button
              onClick={saveDraft}
              disabled={!draft.title?.trim() || !draft.company?.trim() || !!dateError}
              style={{ ...saveBtn, opacity: (draft.title?.trim() && draft.company?.trim() && !dateError) ? 1 : 0.4 }}
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      )}

      <StepNav onBack={onBack} onNext={onNext} canContinue={exp.length > 0 && editing === null} t={t} />
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: '#dc2626', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function EntryCard({ title, subtitle, meta, onEdit, onDelete }) {
  return (
    <div style={{
      backgroundColor: '#fff', border: '1.5px solid var(--color-border)',
      borderRadius: 10, padding: '12px 14px', marginBottom: 8,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{title}</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{subtitle}</div>
        {meta && <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{meta}</div>}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={onEdit}   style={iconActionBtn('#2563eb')}><Pencil size={12} /></button>
        <button onClick={onDelete} style={iconActionBtn('#dc2626')}><Trash2 size={12} /></button>
      </div>
    </div>
  )
}

/* ── Styles ── */
const addBtn = {
  width: '100%', padding: '10px', border: '1.5px dashed var(--color-border)',
  borderRadius: 10, backgroundColor: 'transparent', cursor: 'pointer',
  fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit', color: 'var(--color-text)',
}
const formCard = {
  backgroundColor: 'var(--color-surface)', borderRadius: 12,
  padding: '20px', marginBottom: 16,
  border: '1px solid var(--color-border)',
}
const iconBtn = {
  width: 36, height: 40, border: '1px solid var(--color-border)',
  borderRadius: 8, backgroundColor: '#fff', cursor: 'pointer',
  fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0, color: '#dc2626',
}
const ghostBtn = {
  fontSize: '0.78rem', color: 'var(--color-text-muted)', background: 'none',
  border: 'none', cursor: 'pointer', padding: '2px 0', fontFamily: 'inherit',
}
const cancelBtn = {
  padding: '8px 18px', border: '1.5px solid var(--color-border)',
  borderRadius: 8, backgroundColor: '#fff', cursor: 'pointer',
  fontSize: '0.82rem', fontFamily: 'inherit',
}
const saveBtn = {
  padding: '8px 20px', border: 'none',
  borderRadius: 8, backgroundColor: 'var(--color-text)', color: '#fff',
  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
}
const iconActionBtn = (color) => ({
  width: 28, height: 28, border: 'none', borderRadius: 6,
  backgroundColor: `${color}15`, color, fontSize: '0.75rem',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
})
