import { useTranslation } from 'react-i18next'
import { useCVState, useCVDispatch } from '../../../store/CVContext'
import { ACTIONS } from '../../../store/cvReducer'
import { StepHeader, StepNav, labelStyle, textareaStyle } from './StepCoordonnees'

export default function StepResume({ onBack, onNext }) {
  const { t }    = useTranslation()
  const state    = useCVState()
  const dispatch = useCVDispatch()
  const count    = state.summary?.length || 0

  return (
    <div>
      <StepHeader title={t('editor.summary.title')} subtitle={t('editor.summary.subtitle')} />

      <div>
        <label style={labelStyle}>{t('editor.summary.title')}</label>
        <textarea
          value={state.summary}
          onChange={e => dispatch({ type: ACTIONS.SET_SUMMARY, payload: e.target.value })}
          placeholder={t('editor.summary.placeholder')}
          style={{ ...textareaStyle(count > 0), minHeight: 160 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
            {t('editor.summary.hint')}
          </p>
          <span style={{ fontSize: '0.72rem', color: count >= 100 ? '#059669' : 'var(--color-text-muted)' }}>
            {t('editor.summary.charCount', { count })}
          </span>
        </div>
      </div>

      <StepNav onBack={onBack} onNext={onNext} canContinue={count > 0} t={t} />
    </div>
  )
}
