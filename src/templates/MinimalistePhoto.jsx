import photoPlaceholder from '../assets/template14.webp'
import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const DEFAULT_ACCENT = '#2D6A4F'

export default function MinimalistePhoto({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')
  const photo     = data?.photo || photoPlaceholder

  const s = {
    root:         { width: 794, minHeight: 1123, backgroundColor: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 13, color: '#1a1a1a' },
    header:       { display: 'flex', alignItems: 'center', padding: '36px 52px', borderBottom: `2.5px solid ${ACCENT}`, gap: 28 },
    photo:        { width: 108, height: 108, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ACCENT}`, flexShrink: 0 },
    headerInfo:   { flex: 1 },
    name:         { fontSize: 30, fontWeight: 800, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 4 },
    titleLine:    { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
    accentDot:    { width: 6, height: 6, borderRadius: '50%', backgroundColor: ACCENT, flexShrink: 0 },
    titleText:    { fontSize: 13, color: ACCENT, fontWeight: 600 },
    contactRow:   { display: 'flex', flexWrap: 'wrap', gap: '3px 18px', fontSize: 11, color: '#666' },
    body:         { padding: '24px 52px' },
    twoCol:       { display: 'flex', gap: 36 },
    sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: ACCENT, marginBottom: 8, marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 },
    sectionLine:  { flex: 1, height: 1, backgroundColor: `${ACCENT}33` },
    jobTitle:     { fontWeight: 700, fontSize: 13 },
    jobPeriod:    { fontSize: 11, color: ACCENT, fontWeight: 600 },
    jobMeta:      { fontSize: 11, color: '#888', marginBottom: 4 },
    bullet:       { marginLeft: 12, marginBottom: 2, fontSize: 12, color: '#444' },
    bodyText:     { fontSize: 12, lineHeight: 1.7, color: '#444' },
    skillTag:     { display: 'inline-block', fontSize: 11, padding: '3px 9px', borderRadius: 12, backgroundColor: `${ACCENT}15`, color: ACCENT, marginRight: 5, marginBottom: 5, fontWeight: 500 },
    langItem:     { fontSize: 12, marginBottom: 5, color: '#333' },
  }

  function STitle({ children }) {
    return (
      <div style={s.sectionTitle}>
        {children}
        <div style={s.sectionLine} />
      </div>
    )
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <img src={photo} alt="profil" style={s.photo} />
        <div style={s.headerInfo}>
          <div style={s.name}>{firstName} {lastName}</div>
          <div style={s.titleLine}>
            <div style={s.accentDot} />
            <div style={s.titleText}>{P.title}</div>
          </div>
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
        <STitle>{t('cv.sections.profile')}</STitle>
        <p style={{ ...s.bodyText, marginTop: 0 }}>{P.summary}</p>

        <div style={s.twoCol}>
          <div style={{ flex: 3 }}>
            <STitle>{t('cv.sections.experience')}</STitle>
            {P.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
                  <span style={s.jobTitle}>{e.title}</span>
                  <span style={s.jobPeriod}>{e.period}</span>
                </div>
                <div style={s.jobMeta}>{e.company} · {e.location}</div>
                {e.bullets.slice(0, 3).map((b, j) => <div key={j} style={s.bullet}>– {b}</div>)}
              </div>
            ))}

            <STitle>{t('cv.sections.education')}</STitle>
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

          <div style={{ flex: 2 }}>
            <STitle>{t('cv.sections.skills')}</STitle>
            <div style={{ marginTop: 2 }}>
              {P.skills.map((sk, i) => <span key={i} style={s.skillTag}>{sk}</span>)}
            </div>

            <STitle>{t('cv.sections.languages')}</STitle>
            {P.languages.map(l => (
              <div key={l.lang} style={s.langItem}>
                <strong>{l.lang}</strong>
                <span style={{ color: '#888', fontSize: 11 }}> — {l.level}</span>
              </div>
            ))}

            <STitle>{t('cv.sections.certifications')}</STitle>
            {P.certifications.map((c, i) => (
              <div key={i} style={{ fontSize: 11, marginBottom: 4, color: '#555' }}>▸ {c}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
