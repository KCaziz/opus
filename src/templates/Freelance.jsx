import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const DEFAULT_TEAL = '#0D9488'

export default function Freelance({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const TEAL       = accentColor || DEFAULT_TEAL
  const LIGHT_TEAL = `${TEAL}18`
  const firstName  = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName   = data?.lastName  || t('builder.lastNamePlaceholder')

  const s = {
    root: {
      width: 794, minHeight: 1123, backgroundColor: '#fff',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      fontSize: 13, color: '#1f2937',
    },
    topBar: { backgroundColor: TEAL, height: 6 },
    header: {
      padding: '36px 52px 28px',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    },
    name: {
      fontSize: 30, fontWeight: 800, color: '#111827',
      letterSpacing: '-0.03em', lineHeight: 1.15,
    },
    titleBadge: {
      display: 'inline-block', fontSize: 13,
      backgroundColor: LIGHT_TEAL, color: TEAL,
      padding: '3px 10px', borderRadius: 20, fontWeight: 600, marginTop: 8,
    },
    contactBox: { display: 'grid', gridTemplateColumns: '1fr', gap: 5, textAlign: 'right' },
    contactItem: { fontSize: 12, color: '#6b7280', display: 'flex', justifyContent: 'flex-end', gap: 5, alignItems: 'center' },
    body: { padding: '24px 52px' },
    sectionTitle: {
      fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.12em', color: TEAL,
      marginBottom: 10, marginTop: 22,
      paddingBottom: 4, borderBottom: `2px solid ${LIGHT_TEAL}`,
    },
    jobCard: {
      backgroundColor: '#f9fafb', borderRadius: 8,
      padding: '12px 16px', marginBottom: 10,
      borderLeft: `3px solid ${TEAL}`,
    },
    jobTitle: { fontWeight: 700, fontSize: 14, color: '#111827' },
    jobPeriod: {
      fontSize: 12, backgroundColor: LIGHT_TEAL,
      color: TEAL, padding: '1px 7px', borderRadius: 10,
      fontWeight: 600, display: 'inline-block', marginLeft: 6,
    },
    jobMeta: { fontSize: 12, color: '#9ca3af', marginBottom: 5, marginTop: 2 },
    bullet: { fontSize: 13, marginLeft: 12, marginBottom: 2, color: '#374151' },
    bodyText: { fontSize: 13, lineHeight: 1.65, color: '#6b7280' },
    twoCol: { display: 'flex', gap: 32 },
    skillTag: {
      display: 'inline-block', fontSize: 12,
      padding: '3px 10px', borderRadius: 20,
      backgroundColor: LIGHT_TEAL, color: TEAL,
      marginRight: 5, marginBottom: 5, fontWeight: 500,
    },
    langRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    langLevel: { fontSize: 12, backgroundColor: `${TEAL}18`, color: TEAL, padding: '1px 8px', borderRadius: 10 },
  }

  return (
    <div style={s.root}>
      <div style={s.topBar} />

      <div style={s.header}>
        <div>
          <div style={s.name}>{firstName}<br />{lastName}</div>
          <div style={s.titleBadge}>⚡ {P.title}</div>
        </div>
        <div style={s.contactBox}>
          {[['✉', P.email], ['✆', P.phone], ['⌖', P.location], ['in', P.linkedin], ['🔗', P.website]]
            .filter(([, val]) => !!val)
            .map(([icon, val]) => (
              <div key={val} style={s.contactItem}>{val} <strong style={{ color: TEAL }}>{icon}</strong></div>
            ))}
        </div>
      </div>

      <div style={s.body}>
        <div style={{ ...s.sectionTitle, marginTop: 0 }}>{t('cv.sections.about')}</div>
        <p style={s.bodyText}>{P.summary}</p>

        <div style={s.sectionTitle}>{t('cv.sections.experience')}</div>
        {P.experience.map((e, i) => (
          <div key={i} style={s.jobCard}>
            <div>
              <span style={s.jobTitle}>{e.title}</span>
              <span style={s.jobPeriod}>{e.period}</span>
            </div>
            <div style={s.jobMeta}>{e.company} · {e.location}</div>
            {e.bullets.slice(0, 3).map((b, j) => <div key={j} style={s.bullet}>• {b}</div>)}
          </div>
        ))}

        <div style={s.twoCol}>
          <div style={{ flex: 3 }}>
            <div style={s.sectionTitle}>{t('cv.sections.education')}</div>
            {P.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={s.jobTitle}>{e.degree}</span>
                  <span style={{ ...s.jobPeriod, marginLeft: 8 }}>{e.year}</span>
                </div>
                <div style={s.jobMeta}>{e.school}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 2 }}>
            <div style={s.sectionTitle}>{t('cv.sections.skills')}</div>
            <div>{P.skills.map((sk, i) => <span key={i} style={s.skillTag}>{sk}</span>)}</div>

            <div style={{ ...s.sectionTitle, marginTop: 18 }}>{t('cv.sections.languages')}</div>
            {P.languages.map(l => (
              <div key={l.lang} style={s.langRow}>
                <span style={{ fontSize: 13 }}>{l.lang}</span>
                <span style={s.langLevel}>{l.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
