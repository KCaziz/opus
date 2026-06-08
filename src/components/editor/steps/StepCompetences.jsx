import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useCVState, useCVDispatch } from '../../../store/CVContext'
import { ACTIONS } from '../../../store/cvReducer'
import { StepHeader, StepNav, labelStyle, inputStyle } from './StepCoordonnees'

const LANGUAGE_LEVELS = ['native', 'c2', 'c1', 'b2', 'b1', 'a2']

export default function StepCompetences({ onBack, onNext }) {
  const { t }      = useTranslation()
  const state      = useCVState()
  const dispatch   = useCVDispatch()
  const [skillInput, setSkillInput] = useState('')
  const [langName,   setLangName]   = useState('')
  const [langLevel,  setLangLevel]  = useState('c1')
  const [certInput,  setCertInput]  = useState('')

  function addSkill(e) {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault()
      const val = skillInput.trim().replace(/,$/, '')
      if (!state.skills.includes(val)) {
        dispatch({ type: ACTIONS.SET_SKILLS, payload: [...state.skills, val] })
      }
      setSkillInput('')
    }
  }

  function removeSkill(sk) {
    dispatch({ type: ACTIONS.SET_SKILLS, payload: state.skills.filter(s => s !== sk) })
  }

  function addLanguage() {
    if (!langName.trim()) return
    dispatch({ type: ACTIONS.ADD_LANGUAGE, payload: { lang: langName.trim(), level: t(`editor.skills.levels.${langLevel}`) } })
    setLangName('')
    setLangLevel('c1')
  }

  function addCert() {
    if (!certInput.trim()) return
    dispatch({ type: ACTIONS.SET_CERTIFICATIONS, payload: [...state.certifications, certInput.trim()] })
    setCertInput('')
  }

  const canContinue = state.skills.length > 0

  return (
    <div>
      <StepHeader title={t('editor.skills.title')} subtitle={t('editor.skills.subtitle')} />

      {/* Skills tags */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>{t('editor.skills.title')}</label>
        <div style={tagsContainer}>
          {state.skills.map(sk => (
            <span key={sk} style={tag}>
              {sk}
              <button onClick={() => removeSkill(sk)} style={tagRemove}><X size={11} /></button>
            </span>
          ))}
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={addSkill}
            placeholder={state.skills.length === 0 ? t('editor.skills.skillPlaceholder') : '+ …'}
            style={{ border: 'none', outline: 'none', fontSize: '0.875rem', minWidth: 140, backgroundColor: 'transparent', fontFamily: 'inherit' }}
          />
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: 5 }}>
          Appuyez sur <kbd style={{ fontSize: '0.68rem', padding: '1px 5px', border: '1px solid #ccc', borderRadius: 4 }}>Entrée</kbd> pour ajouter.
          {state.skills.length > 0 && ` ${t('editor.skills.skillsAdded', { count: state.skills.length })}`}
        </p>
      </div>

      {/* Languages */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>{t('editor.skills.languages')}</label>
        {state.languages.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            {state.languages.map((l, i) => (
              <div key={i} style={langRow}>
                <span style={{ fontSize: '0.875rem' }}><strong>{l.lang}</strong> — {l.level}</span>
                <button
                  onClick={() => dispatch({ type: ACTIONS.REMOVE_LANGUAGE, payload: i })}
                  style={{ ...tagRemove, position: 'static', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
                ><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={langName}
            onChange={e => setLangName(e.target.value)}
            placeholder={t('editor.skills.languageName')}
            style={{ ...inputStyle(!!langName), flex: 1 }}
          />
          <select
            value={langLevel}
            onChange={e => setLangLevel(e.target.value)}
            style={{ ...inputStyle(true), flex: 1 }}
          >
            {LANGUAGE_LEVELS.map(lvl => (
              <option key={lvl} value={lvl}>{t(`editor.skills.levels.${lvl}`)}</option>
            ))}
          </select>
          <button onClick={addLanguage} style={addBtn}>{t('common.add')}</button>
        </div>
      </div>

      {/* Certifications */}
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>{t('editor.skills.certifications')}</label>
        {state.certifications.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            {state.certifications.map((c, i) => (
              <div key={i} style={langRow}>
                <span style={{ fontSize: '0.875rem' }}>• {c}</span>
                <button
                  onClick={() => dispatch({ type: ACTIONS.SET_CERTIFICATIONS, payload: state.certifications.filter((_, j) => j !== i) })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center' }}
                ><X size={14} /></button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={certInput}
            onChange={e => setCertInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCert()}
            placeholder={t('editor.skills.certPlaceholder')}
            style={{ ...inputStyle(!!certInput), flex: 1 }}
          />
          <button onClick={addCert} style={addBtn}>{t('common.add')}</button>
        </div>
      </div>

      <StepNav onBack={onBack} onNext={onNext} canContinue={canContinue} t={t} />
    </div>
  )
}

const tagsContainer = {
  display: 'flex', flexWrap: 'wrap', gap: 6,
  border: '1.5px solid var(--color-border)',
  borderRadius: 8, padding: '8px 10px',
  backgroundColor: '#fff', minHeight: 44,
  alignItems: 'center',
}
const tag = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  backgroundColor: 'var(--color-surface)', borderRadius: 20,
  padding: '3px 10px', fontSize: '0.82rem', fontWeight: 500,
}
const tagRemove = {
  background: 'none', border: 'none', cursor: 'pointer',
  fontSize: '1rem', lineHeight: 1, color: 'var(--color-text-muted)',
  padding: 0, position: 'relative', top: '-1px',
}
const langRow = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  backgroundColor: 'var(--color-surface)', borderRadius: 8,
  padding: '6px 10px', marginBottom: 5,
}
const addBtn = {
  padding: '0 16px', height: 40, border: 'none',
  borderRadius: 8, backgroundColor: 'var(--color-text)', color: '#fff',
  cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
  flexShrink: 0,
}
