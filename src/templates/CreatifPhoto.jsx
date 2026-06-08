import photoPlaceholder from '../assets/template19.webp'
import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const DEFAULT_ACCENT = '#E63946'

export default function CreatifPhoto({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')
  const photo     = data?.photo || photoPlaceholder

  const s = {
    root:        { width: 794, minHeight: 1123, backgroundColor: '#fff', fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, color: '#1a1a1a' },
    topStripe:   { backgroundColor: ACCENT, height: 8 },
    header:      { backgroundColor: '#111', padding: '32px 52px', display: 'flex', alignItems: 'center', gap: 28 },
    photo:       { width: 115, height: 115, borderRadius: 6, objectFit: 'cover', border: `3px solid ${ACCENT}`, flexShrink: 0 },
    headerInfo:  { flex: 1 },
    name:        { fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 6 },
    titleBadge:  { display: 'inline-block', fontSize: 12, backgroundColor: ACCENT, color: '#fff', padding: '3px 12px', borderRadius: 2, fontWeight: 600, marginBottom: 12 },
    contactGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px', fontSize: 11, color: 'rgba(255,255,255,0.65)' },
    body:        { padding: '28px 52px' },
    twoCol:      { display: 'flex', gap: 36 },
    sectionTitle:{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', backgroundColor: ACCENT, padding: '4px 10px', borderRadius: 2, display: 'inline-block', marginBottom: 10, marginTop: 18 },
    jobTitle:    { fontWeight: 700, fontSize: 13 },
    jobPeriod:   { fontSize: 11, color: ACCENT, fontWeight: 600 },
    jobMeta:     { fontSize: 11, color: '#888', marginBottom: 4 },
    bullet:      { marginLeft: 12, marginBottom: 2, fontSize: 12, color: '#444' },
    bodyText:    { fontSize: 12, lineHeight: 1.65, color: '#444' },
    skillTag:    { display: 'inline-block', fontSize: 11, padding: '3px 8px', borderRadius: 2, border: `1px solid ${ACCENT}55`, color: ACCENT, marginRight: 5, marginBottom: 5 },
    langItem:    { fontSize: 12, marginBottom: 5, color: '#333' },
  }

  return (
    <div style={s.root}>
      <div style={s.topStripe} />

      <div style={s.header}>
        <img src={photo} alt="profil" style={s.photo} />
        <div style={s.headerInfo}>
          <div style={s.name}>{firstName} {lastName}</div>
          <div style={s.titleBadge}>{P.title}</div>
          <div style={s.contactGrid}>
            <span>✉ {P.email}</span>
            <span>✆ {P.phone}</span>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span style={s.jobTitle}>{e.title}</span>
                  <span style={s.jobPeriod}>{e.period}</span>
                </div>
                <div style={s.jobMeta}>{e.company} · {e.location}</div>
                {e.bullets.slice(0, 3).map((b, j) => <div key={j} style={s.bullet}>→ {b}</div>)}
              </div>
            ))}

            <div style={s.sectionTitle}>{t('cv.sections.education')}</div>
            {P.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={s.jobTitle}>{e.degree}</div>
                <div style={s.jobMeta}>{e.school} · {e.year}</div>
              </div>
            ))}
          </div>

          <div style={{ flex: 2 }}>
            <div style={s.sectionTitle}>{t('cv.sections.skills')}</div>
            <div style={{ marginTop: 2 }}>
              {P.skills.slice(0, 10).map((sk, i) => <span key={i} style={s.skillTag}>{sk}</span>)}
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
              <div key={i} style={{ fontSize: 11, marginBottom: 4, color: '#555' }}>✓ {c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
