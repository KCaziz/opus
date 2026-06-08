import photoPlaceholder from '../assets/template29-33.webp'
import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const DEFAULT_ACCENT = '#457B9D'

export default function NordicPhoto({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')
  const photo     = data?.photo || photoPlaceholder

  const LIGHT_BG = '#F1F5F8'

  const s = {
    root:         { width: 794, minHeight: 1123, backgroundColor: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 13, color: '#1a1a1a' },
    header:       { backgroundColor: LIGHT_BG, borderBottom: `3px solid ${ACCENT}`, display: 'flex', alignItems: 'center', padding: '32px 52px', gap: 28 },
    photo:        { width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: `2.5px solid ${ACCENT}`, flexShrink: 0 },
    headerRight:  { flex: 1 },
    name:         { fontSize: 28, fontWeight: 700, color: '#111', letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 3 },
    titleText:    { fontSize: 13, color: ACCENT, fontWeight: 500, marginBottom: 10 },
    contactRow:   { display: 'flex', flexWrap: 'wrap', gap: '3px 18px', fontSize: 11, color: '#666' },
    body:         { padding: '26px 52px', display: 'flex', gap: 40 },
    leftCol:      { flex: 3 },
    rightCol:     { flex: 2 },
    sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: ACCENT, marginBottom: 8, marginTop: 18, paddingBottom: 4, borderBottom: `1px solid ${ACCENT}44` },
    jobTitle:     { fontWeight: 700, fontSize: 13 },
    jobPeriod:    { fontSize: 11, color: ACCENT, fontWeight: 600 },
    jobMeta:      { fontSize: 11, color: '#888', marginBottom: 4 },
    bullet:       { marginLeft: 12, marginBottom: 2, fontSize: 12, color: '#444' },
    bodyText:     { fontSize: 12, lineHeight: 1.65, color: '#444' },
    skillTag:     { display: 'inline-block', fontSize: 10, padding: '2px 8px', borderRadius: 10, backgroundColor: `${ACCENT}18`, color: ACCENT, marginRight: 4, marginBottom: 4 },
    langItem:     { fontSize: 12, marginBottom: 5, color: '#333' },
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <img src={photo} alt="profil" style={s.photo} />
        <div style={s.headerRight}>
          <div style={s.name}>{firstName} {lastName}</div>
          <div style={s.titleText}>{P.title}</div>
          <div style={s.contactRow}>
            <span>✉ {P.email}</span>
            <span>✆ {P.phone}</span>
            <span>⌖ {P.location}</span>
            {P.linkedin && <span>in {P.linkedin}</span>}
            {P.website  && <span>🔗 {P.website}</span>}
          </div>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.leftCol}>
          <div style={{ ...s.sectionTitle, marginTop: 0 }}>{t('cv.sections.profile')}</div>
          <p style={s.bodyText}>{P.summary}</p>

          <div style={s.sectionTitle}>{t('cv.sections.experience')}</div>
          {P.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                <span style={s.jobTitle}>{e.degree}</span>
                <span style={s.jobPeriod}>{e.year}</span>
              </div>
              <div style={s.jobMeta}>{e.school}</div>
            </div>
          ))}
        </div>

        <div style={s.rightCol}>
          <div style={{ ...s.sectionTitle, marginTop: 0 }}>{t('cv.sections.skills')}</div>
          <div>
            {P.skills.map((sk, i) => <span key={i} style={s.skillTag}>{sk}</span>)}
          </div>

          <div style={s.sectionTitle}>{t('cv.sections.languages')}</div>
          {P.languages.map(l => (
            <div key={l.lang} style={s.langItem}>
              <strong>{l.lang}</strong>
              <span style={{ color: '#888', fontSize: 11 }}> — {l.level}</span>
            </div>
          ))}

          <div style={s.sectionTitle}>{t('cv.sections.certifications')}</div>
          {P.certifications.map((c, i) => (
            <div key={i} style={{ fontSize: 11, marginBottom: 4, color: '#555' }}>▸ {c}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
