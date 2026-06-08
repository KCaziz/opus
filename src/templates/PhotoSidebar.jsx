import photoPlaceholder from '../assets/template13.webp'
import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const DEFAULT_ACCENT = '#1E3A5F'

export default function PhotoSidebar({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')
  const photo     = data?.photo || photoPlaceholder

  const s = {
    root:             { width: 794, minHeight: 1123, backgroundColor: '#fff', fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 13, color: '#1a1a1a', display: 'flex' },
    sidebar:          { width: 245, minHeight: 1123, backgroundColor: ACCENT, flexShrink: 0, display: 'flex', flexDirection: 'column' },
    photo:            { width: '100%', height: 230, objectFit: 'cover', display: 'block' },
    sideContent:      { padding: '20px 18px', flex: 1 },
    sideName:         { fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 4 },
    sideTitle:        { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 18, lineHeight: 1.4 },
    sideDivider:      { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', margin: '12px 0' },
    sideSectionTitle: { fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 7, marginTop: 14 },
    sideItem:         { fontSize: 11, color: 'rgba(255,255,255,0.82)', marginBottom: 5, lineHeight: 1.45 },
    skillTag:         { display: 'inline-block', fontSize: 10, padding: '2px 7px', borderRadius: 2, marginRight: 4, marginBottom: 5, backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.15)' },
    main:             { flex: 1, padding: '36px 28px' },
    sectionTitle:     { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: ACCENT, borderBottom: `1.5px solid ${ACCENT}33`, paddingBottom: 6, marginBottom: 10, marginTop: 20 },
    jobTitle:         { fontWeight: 700, fontSize: 13, color: '#111' },
    jobPeriod:        { fontSize: 11, color: ACCENT, fontWeight: 600 },
    jobMeta:          { fontSize: 11, color: '#888', marginBottom: 4 },
    bullet:           { marginLeft: 12, marginBottom: 2, fontSize: 12, color: '#444' },
    bodyText:         { fontSize: 12, lineHeight: 1.65, color: '#444' },
  }

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <img src={photo} alt="profil" style={s.photo} />
        <div style={s.sideContent}>
          <div style={s.sideName}>{firstName}<br />{lastName}</div>
          <div style={s.sideTitle}>{P.title}</div>
          <div style={s.sideDivider} />

          <div style={s.sideSectionTitle}>{t('cv.sections.contact')}</div>
          <div style={s.sideItem}>✉ {P.email}</div>
          <div style={s.sideItem}>✆ {P.phone}</div>
          <div style={s.sideItem}>⌖ {P.location}</div>
          {P.linkedin && <div style={s.sideItem}>in {P.linkedin}</div>}
          {P.website  && <div style={s.sideItem}>🔗 {P.website}</div>}

          <div style={s.sideSectionTitle}>{t('cv.sections.skills')}</div>
          {P.skills.slice(0, 9).map((sk, i) => (
            <span key={i} style={s.skillTag}>{sk}</span>
          ))}

          <div style={s.sideSectionTitle}>{t('cv.sections.languages')}</div>
          {P.languages.map(l => (
            <div key={l.lang} style={s.sideItem}>{l.lang} · {l.level}</div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={s.main}>
        <div style={{ ...s.sectionTitle, marginTop: 0 }}>{t('cv.sections.profile')}</div>
        <p style={s.bodyText}>{P.summary}</p>

        <div style={s.sectionTitle}>{t('cv.sections.experience')}</div>
        {P.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 4 }}>
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
            <div style={s.jobMeta}>{e.school}{e.detail ? ` · ${e.detail}` : ''}</div>
          </div>
        ))}

        <div style={s.sectionTitle}>{t('cv.sections.certifications')}</div>
        {P.certifications.map((c, i) => (
          <div key={i} style={{ ...s.bullet, marginLeft: 0, marginBottom: 4 }}>▸ {c}</div>
        ))}
      </div>
    </div>
  )
}
