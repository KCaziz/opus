import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const HEADER_BG = '#F8F5F0'
const DEFAULT_ACCENT = '#8B6F4E'

export default function AvecPhoto({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  const s = {
    root:        { width: 794, minHeight: 1123, backgroundColor: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 13, color: '#2c2c2c' },
    header:      { backgroundColor: HEADER_BG, padding: '36px 52px', display: 'flex', gap: 28, alignItems: 'center', borderBottom: `3px solid ${ACCENT}` },
    photo:       { width: 100, height: 100, borderRadius: '50%', backgroundColor: '#ddd', flexShrink: 0, border: `3px solid ${ACCENT}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#aaa' },
    headerInfo:  { flex: 1 },
    name:        { fontSize: 30, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em', lineHeight: 1.15 },
    accentBar:   { width: 40, height: 3, backgroundColor: ACCENT, margin: '8px 0' },
    titleText:   { fontSize: 14, color: ACCENT, fontWeight: 600 },
    contactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', marginTop: 12, fontSize: 12, color: '#666' },
    body:        { padding: '28px 52px' },
    sectionTitle:{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: ACCENT, borderBottom: `1.5px solid ${ACCENT}44`, paddingBottom: 5, marginBottom: 10, marginTop: 18 },
    twoCol:      { display: 'flex', gap: 36 },
    jobTitle:    { fontWeight: 700, fontSize: 13 },
    jobPeriod:   { fontSize: 12, color: ACCENT, fontWeight: 600 },
    jobMeta:     { fontSize: 12, color: '#888', marginBottom: 4 },
    bullet:      { marginLeft: 12, marginBottom: 2, fontSize: 13 },
    bodyText:    { fontSize: 13, lineHeight: 1.65, color: '#444' },
    skillTag:    { display: 'inline-block', fontSize: 12, padding: '2px 8px', borderRadius: 12, backgroundColor: `${ACCENT}18`, color: ACCENT, marginRight: 5, marginBottom: 5, fontWeight: 500 },
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.photo}>{initials}</div>
        <div style={s.headerInfo}>
          <div style={s.name}>{firstName} {lastName}</div>
          <div style={s.accentBar} />
          <div style={s.titleText}>{P.title}</div>
          <div style={s.contactGrid}>
            <span>✉ {P.email}</span><span>✆ {P.phone}</span>
            <span>⌖ {P.location}</span>
            {P.linkedin && <span>in {P.linkedin}</span>}
            {P.website  && <span>🔗 {P.website}</span>}
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={{ ...s.sectionTitle, marginTop: 0 }}>{t('cv.sections.profile')}</div>
        <p style={s.bodyText}>{P.summary}</p>

        <div style={s.twoCol}>
          <div style={{ flex: 3 }}>
            <div style={s.sectionTitle}>{t('cv.sections.experience')}</div>
            {P.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={s.jobTitle}>{e.title}</span>
                  <span style={s.jobPeriod}>{e.period}</span>
                </div>
                <div style={s.jobMeta}>{e.company} · {e.location}</div>
                {e.bullets.slice(0, 3).map((b, j) => <div key={j} style={s.bullet}>• {b}</div>)}
              </div>
            ))}

            <div style={s.sectionTitle}>{t('cv.sections.education')}</div>
            {P.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={s.jobTitle}>{e.degree}</span>
                  <span style={s.jobPeriod}>{e.year}</span>
                </div>
                <div style={s.jobMeta}>{e.school}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 2 }}>
            <div style={s.sectionTitle}>{t('cv.sections.skills')}</div>
            <div style={{ marginTop: 2 }}>
              {P.skills.map((sk, i) => <span key={i} style={s.skillTag}>{sk}</span>)}
            </div>
            <div style={s.sectionTitle}>{t('cv.sections.languages')}</div>
            {P.languages.map(l => (
              <div key={l.lang} style={{ fontSize: 13, marginBottom: 5 }}>
                <strong>{l.lang}</strong>
                <span style={{ color: '#888', fontSize: 12 }}> — {l.level}</span>
              </div>
            ))}
            <div style={s.sectionTitle}>{t('cv.sections.certifications')}</div>
            {P.certifications.map((c, i) => (
              <div key={i} style={{ fontSize: 12, marginBottom: 4, color: '#555' }}>• {c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
