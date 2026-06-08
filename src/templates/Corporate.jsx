import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const DARK = '#1E2A3A'
const DEFAULT_ACCENT = '#C8A96A'

export default function Corporate({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')

  const s = {
    root:          { width: 794, minHeight: 1123, backgroundColor: '#fff', fontFamily: "'Trebuchet MS', Arial, sans-serif", fontSize: 13, color: '#222' },
    header:        { backgroundColor: DARK, padding: '40px 56px 32px', color: '#fff' },
    name:          { fontSize: 32, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff' },
    accentLine:    { width: 50, height: 3, backgroundColor: ACCENT, margin: '10px 0 10px' },
    headerTitle:   { fontSize: 14, color: '#aabbc8', letterSpacing: '0.1em' },
    headerContact: { display: 'flex', gap: 24, marginTop: 18, fontSize: 12, color: '#8899aa' },
    body:          { padding: '32px 56px' },
    sectionTitle:  {
      fontSize: 12, fontWeight: 700, letterSpacing: '0.16em',
      textTransform: 'uppercase', color: DARK,
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 20,
    },
    sectionLine:   { flex: 1, height: 1, backgroundColor: '#e0e0e0' },
    jobTitle:      { fontWeight: 700, fontSize: 13, color: DARK },
    jobPeriod:     { fontSize: 12, color: ACCENT, fontWeight: 600 },
    jobMeta:       { fontSize: 12, color: '#888', marginBottom: 5 },
    bullet:        { marginLeft: 14, marginBottom: 2, fontSize: 13, color: '#333' },
    summaryText:   { fontSize: 13, lineHeight: 1.65, color: '#444' },
    skillChip: {
      display: 'inline-block', fontSize: 12, padding: '3px 10px',
      border: `1px solid ${DARK}33`, borderRadius: 2,
      marginRight: 6, marginBottom: 5, color: DARK,
    },
  }

  function Section({ title, children }) {
    return (
      <div>
        <div style={s.sectionTitle}>{title}<div style={s.sectionLine} /></div>
        {children}
      </div>
    )
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.name}>{firstName} {lastName}</div>
        <div style={s.accentLine} />
        <div style={s.headerTitle}>{P.title.toUpperCase()}</div>
        <div style={s.headerContact}>
          <span>✉ {P.email}</span>
          <span>✆ {P.phone}</span>
          <span>⌖ {P.location}</span>
          {P.linkedin && <span>in {P.linkedin}</span>}
          {P.website  && <span>🔗 {P.website}</span>}
        </div>
      </div>

      <div style={s.body}>
        <Section title={t('cv.sections.summary')}>
          <p style={s.summaryText}>{P.summary}</p>
        </Section>

        <Section title={t('cv.sections.experience')}>
          {P.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={s.jobTitle}>{e.title}</span>
                <span style={s.jobPeriod}>{e.period}</span>
              </div>
              <div style={s.jobMeta}>{e.company} · {e.location}</div>
              {e.bullets.map((b, j) => <div key={j} style={s.bullet}>▪ {b}</div>)}
            </div>
          ))}
        </Section>

        <Section title={t('cv.sections.education')}>
          {P.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={s.jobTitle}>{e.degree}</span>
                <span style={s.jobPeriod}>{e.year}</span>
              </div>
              <div style={s.jobMeta}>{e.school}{e.detail ? ` · ${e.detail}` : ''}</div>
            </div>
          ))}
        </Section>

        <div style={{ display: 'flex', gap: 40 }}>
          <div style={{ flex: 1 }}>
            <Section title={t('cv.sections.skills')}>
              <div>{P.skills.map((sk, i) => <span key={i} style={s.skillChip}>{sk}</span>)}</div>
            </Section>
          </div>
          <div style={{ flex: 1 }}>
            <Section title={t('cv.sections.languages')}>
              {P.languages.map((l, i) => (
                <div key={i} style={{ fontSize: 13, marginBottom: 4, color: '#333' }}>
                  <strong>{l.lang}</strong> — {l.level}
                </div>
              ))}
            </Section>
          </div>
        </div>
      </div>
    </div>
  )
}
