import React from 'react';
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES, RTL_LANGUAGES } from '../i18n/index'
import { useEffect } from 'react'

export default function LanguageSwitcher({ compact = false }) {
  const { i18n, t } = useTranslation()
  const current     = i18n.language?.slice(0, 2) || 'fr'

  function changeLanguage(lng) {
    i18n.changeLanguage(lng)
  }

  // Sync <html dir> on language change
  useEffect(() => {
    document.documentElement.dir  = RTL_LANGUAGES.includes(current) ? 'rtl' : 'ltr'
    document.documentElement.lang = current
  }, [current])

  if (compact) {
    return (
      <select
        value={current}
        onChange={e => changeLanguage(e.target.value)}
        style={{
          border: '1px solid var(--color-border)', borderRadius: 8,
          padding: '4px 8px', fontSize: '0.78rem',
          backgroundColor: 'transparent', cursor: 'pointer',
          fontFamily: 'inherit', outline: 'none',
        }}
      >
        {SUPPORTED_LANGUAGES.map(lng => (
          <option key={lng} value={lng}>{t(`languages.${lng}`)}</option>
        ))}
      </select>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {SUPPORTED_LANGUAGES.map(lng => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          style={{
            fontSize: '0.72rem', padding: '3px 9px',
            border: '1px solid var(--color-border)', borderRadius: 20,
            cursor: 'pointer', fontFamily: 'inherit',
            backgroundColor: current === lng ? 'var(--color-text)' : 'transparent',
            color: current === lng ? '#fff' : 'var(--color-text-muted)',
            fontWeight: current === lng ? 700 : 400,
            transition: 'all 0.15s',
          }}
        >
          {t(`languages.${lng}`)}
        </button>
      ))}
    </div>
  )
}
