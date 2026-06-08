import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const DEFAULT_ACCENT = '#B8963E'

export default function Executive({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const GOLD      = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')

  const s = {
    root:          { width: 794, minHeight: 1123, backgroundColor: '#fff', fontFamily: "'Garamond', 'Georgia', serif", fontSize: 13, color: '#1a1a1a', padding: '52px 64px' },
    header:        { textAlign: 'center', marginBottom: 28, paddingBottom: 24 },
    name:          { fontSize: 36, fontWeight: 700, color: '#111', letterSpacing: '0.1em', textTransform: 'uppercase' },
    goldLine:      { width: 60, height: 2, backgroundColor: GOLD, margin: '12px auto' },
    titleText:     { fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', fontStyle: 'italic' },
    contactRow:    { display: 'flex', justifyContent: 'center', gap: 20, fontSize: 12, color: '#666', marginTop: 12, flexWrap: 'wrap' },
    sectionTitle:  { fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, textAlign: 'center', marginTop: 22, marginBottom: 10 },
    sectionDivider:{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
    divLine:       { flex: 1, height: 1, backgroundColor: '#e8e0d0' },
    diamond:       { color: GOLD, fontSize: 10 },
    jobTitle:      { fontWeight: 700, fontSize: 14, color: '#1a1a1a' },
    jobPeriod:     { fontSize: 12, color: GOLD, fontWeight: 600 },
    jobMeta:       { fontSize: 12, color: '#888', fontStyle: 'italic', marginBottom: 5 },
    bullet:        { marginLeft: 16, marginBottom: 2, fontSize: 13, color: '#333', listStyle: 'none' },
    bodyText:      { fontSize: 13, lineHeight: 1.7, color: '#444', textAlign: 'justify' },
    twoCol:        { display: 'flex', gap: 40 },
  }

  function SectionDivider({ title }) {
    return (
      <div style={s.sectionTitle}>
        <div style={s.sectionDivider}>
          <div style={s.divLine} />
          <span style={s.diamond}>◆ {title} ◆</span>
          <div style={s.divLine} />
        </div>
      </div>
    )
  }

  return (
    <div style={s.root}>
      <div style={s.header}>
        <div style={s.name}>{firstName} {lastName}</div>
        <div style={s.goldLine} />
        <div style={s.titleText}>{P.title}</div>
        <div style={s.contactRow}>
          {[P.email, P.phone, P.location, P.linkedin, P.website]
            .filter(Boolean)
            .flatMap((item, i, arr) =>
              i < arr.length - 1
                ? [<span key={item}>{item}</span>, <span key={`s${i}`}>&nbsp;|&nbsp;</span>]
                : [<span key={item}>{item}</span>]
            )}
        </div>
      </div>

      <SectionDivider title={t('cv.sections.profile')} />
      <p style={s.bodyText}>{P.summary}</p>

      <SectionDivider title={t('cv.sections.experience')} />
      {P.experience.map((e, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={s.jobTitle}>{e.title}</span>
            <span style={s.jobPeriod}>{e.period}</span>
          </div>
          <div style={s.jobMeta}>{e.company} · {e.location}</div>
          {e.bullets.map((b, j) => <div key={j} style={s.bullet}>◦ {b}</div>)}
        </div>
      ))}

      <SectionDivider title={t('cv.sections.educationSkills')} />
      <div style={s.twoCol}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8, color: '#555' }}>{t('cv.labels.educationUpper')}</div>
          {P.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={s.jobTitle}>{e.degree}</div>
              <div style={s.jobMeta}>{e.school} · {e.year}</div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8, color: '#555' }}>{t('cv.labels.skillsUpper')}</div>
          <p style={{ ...s.bodyText, textAlign: 'left' }}>{P.skills.join(' · ')}</p>
          <div style={{ marginTop: 12, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8, color: '#555' }}>{t('cv.labels.languagesUpper')}</div>
          {P.languages.map(l => (
            <div key={l.lang} style={{ fontSize: 13, marginBottom: 3 }}>
              {l.lang} — <span style={{ color: '#888', fontStyle: 'italic' }}>{l.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
