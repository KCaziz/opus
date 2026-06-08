import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const DEFAULT_ACCENT = '#2563EB'

export default function ATSModerne({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')

  const s = {
    root: {
      width: 794, minHeight: 1123, backgroundColor: '#fff',
      fontFamily: "'Calibri', Arial, sans-serif", fontSize: 13,
      color: '#1a1a1a', padding: '48px 56px', lineHeight: 1.5,
    },
    name: { fontSize: 30, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' },
    title: { fontSize: 15, color: ACCENT, fontWeight: 600, marginBottom: 10 },
    contact: {
      display: 'flex', gap: 20, fontSize: 12, color: '#555',
      paddingTop: 10, borderTop: `2px solid ${ACCENT}`,
    },
    contactItem: { display: 'flex', alignItems: 'center', gap: 4 },
    sectionTitle: {
      fontSize: 13, fontWeight: 700, color: ACCENT, textTransform: 'uppercase',
      letterSpacing: '0.08em', marginTop: 18, marginBottom: 8,
      paddingBottom: 4, borderBottom: `1px solid ${ACCENT}22`,
    },
    jobTitle: { fontWeight: 700, fontSize: 13 },
    jobMeta: { fontSize: 12, color: '#666', marginBottom: 4 },
    bullet: { marginLeft: 14, marginBottom: 2, fontSize: 13, color: '#222' },
    body: { fontSize: 13, lineHeight: 1.6, color: '#333', marginBottom: 8 },
    skillBadge: {
      display: 'inline-block', fontSize: 12, padding: '2px 8px',
      borderRadius: 3, marginRight: 5, marginBottom: 4,
      backgroundColor: `${ACCENT}11`, color: ACCENT, fontWeight: 600,
    },
  }

  function Section({ title, children }) {
    return (
      <div>
        <div style={s.sectionTitle}>{title}</div>
        {children}
      </div>
    )
  }

  return (
    <div style={s.root}>
      <div style={s.name}>{firstName} {lastName}</div>
      <div style={s.title}>{P.title}</div>

      <div style={s.contact}>
        <span style={s.contactItem}>✉ {P.email}</span>
        <span style={s.contactItem}>✆ {P.phone}</span>
        <span style={s.contactItem}>⌖ {P.location}</span>
        {P.linkedin && <span style={s.contactItem}>in {P.linkedin}</span>}
        {P.website  && <span style={s.contactItem}>🔗 {P.website}</span>}
      </div>

      <Section title={t('cv.sections.profile')}>
        <p style={s.body}>{P.summary}</p>
      </Section>

      <Section title={t('cv.sections.experience')}>
        {P.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={s.jobTitle}>{e.title}</span>
              <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{e.period}</span>
            </div>
            <div style={s.jobMeta}>{e.company} · {e.location}</div>
            {e.bullets.map((b, j) => <div key={j} style={s.bullet}>▸ {b}</div>)}
          </div>
        ))}
      </Section>

      <Section title={t('cv.sections.education')}>
        {P.education.map((e, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={s.jobTitle}>{e.degree}</span>
              <span style={{ fontSize: 12, color: ACCENT, fontWeight: 600 }}>{e.year}</span>
            </div>
            <div style={s.jobMeta}>{e.school}{e.detail ? ` · ${e.detail}` : ''}</div>
          </div>
        ))}
      </Section>

      <Section title={t('cv.sections.skills')}>
        <div style={{ marginTop: 2 }}>
          {P.skills.map((sk, i) => <span key={i} style={s.skillBadge}>{sk}</span>)}
        </div>
      </Section>

      <Section title={t('cv.sections.languages')}>
        <p style={s.body}>{P.languages.map(l => `${l.lang} — ${l.level}`).join(' · ')}</p>
      </Section>
    </div>
  )
}
