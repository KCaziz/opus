import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const BG         = '#0D1117'
const SURFACE    = '#161B22'
const BORDER     = '#30363D'
const BLUE       = '#58A6FF'
const YELLOW     = '#E3B341'
const SIDEBAR_W  = 220
const DEFAULT_GREEN = '#3FB950'

export default function Developer({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const GREEN     = accentColor || DEFAULT_GREEN
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  const s = {
    root:             { width: 794, minHeight: 1123, backgroundColor: BG, display: 'flex', fontFamily: "'Courier New', 'Consolas', monospace", fontSize: 13, color: '#C9D1D9' },
    sidebar:          { width: SIDEBAR_W, minHeight: 1123, backgroundColor: SURFACE, borderRight: `1px solid ${BORDER}`, padding: '36px 20px', flexShrink: 0 },
    avatar:           { width: 72, height: 72, borderRadius: '50%', border: `2px solid ${GREEN}`, backgroundColor: '#1c2128', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: GREEN, marginBottom: 14 },
    name:             { fontSize: 17, fontWeight: 700, color: '#fff', lineHeight: 1.2 },
    title:            { fontSize: 12, color: GREEN, marginTop: 4, marginBottom: 20 },
    sideSectionTitle: { fontSize: 11, fontWeight: 700, color: '#8B949E', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, marginTop: 16 },
    sideItem:         { fontSize: 12, color: '#8B949E', marginBottom: 5, lineHeight: 1.4, wordBreak: 'break-all' },
    techTag:          { display: 'inline-block', fontSize: 11, padding: '2px 7px', borderRadius: 3, marginRight: 4, marginBottom: 4, border: `1px solid ${BORDER}`, color: '#8B949E' },
    main:             { flex: 1, padding: '36px 28px' },
    sectionTitle:     { fontSize: 12, fontWeight: 700, color: BLUE, marginBottom: 10, marginTop: 18, display: 'flex', alignItems: 'center', gap: 8 },
    sectionLine:      { flex: 1, height: 1, backgroundColor: BORDER },
    comment:          { color: '#6E7681', fontSize: 12, marginBottom: 6, fontStyle: 'italic' },
    jobTitle:         { color: YELLOW, fontWeight: 700, fontSize: 13 },
    jobPeriod:        { color: GREEN, fontSize: 12 },
    jobCompany:       { color: '#8B949E', fontSize: 12, marginBottom: 4 },
    bullet:           { color: '#C9D1D9', fontSize: 12, marginLeft: 12, marginBottom: 2 },
    body:             { color: '#8B949E', fontSize: 12, lineHeight: 1.6 },
  }

  function Section({ title, children }) {
    return (
      <div>
        <div style={s.sectionTitle}>
          <span style={{ color: GREEN }}>#</span> {title}
          <div style={s.sectionLine} />
        </div>
        {children}
      </div>
    )
  }

  return (
    <div style={s.root}>
      <div style={s.sidebar}>
        <div style={s.avatar}>{initials}</div>
        <div style={s.name}>{firstName} {lastName}</div>
        <div style={s.title}>// {P.title}</div>

        <div style={s.sideSectionTitle}>{t('cv.sections.contact')}</div>
        {[['📧', P.email], ['📱', P.phone], ['📍', P.location], ['🔗', P.linkedin], ['💻', P.website]]
          .filter(([, val]) => !!val)
          .map(([icon, val]) => (
            <div key={val} style={s.sideItem}>{icon} {val}</div>
          ))}

        <div style={s.sideSectionTitle}>{t('cv.sections.stack')}</div>
        {['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL',
          'Docker', 'Kubernetes', 'AWS', 'Git', 'GraphQL', 'Redis'].map(tech => (
          <span key={tech} style={s.techTag}>{tech}</span>
        ))}

        <div style={s.sideSectionTitle}>{t('cv.sections.languages')}</div>
        {P.languages.map(l => (
          <div key={l.lang} style={s.sideItem}>
            {l.lang} <span style={{ color: GREEN }}>({l.level})</span>
          </div>
        ))}
      </div>

      <div style={s.main}>
        <div style={{ ...s.comment, marginTop: 0 }}>/* README.md */</div>

        <Section title={t('cv.sections.aboutCode')}>
          <p style={s.body}>{P.summary}</p>
        </Section>

        <Section title={t('cv.sections.experienceCode')}>
          {P.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={s.comment}>// {e.period}</div>
              <div style={s.jobTitle}>{e.title}</div>
              <div style={s.jobCompany}>@ {e.company}</div>
              {e.bullets.map((b, j) => <div key={j} style={s.bullet}>→ {b}</div>)}
            </div>
          ))}
        </Section>

        <Section title={t('cv.sections.educationCode')}>
          {P.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={s.jobTitle}>{e.degree}</div>
              <div style={s.jobCompany}>{e.school}</div>
              <div style={s.comment}>// {e.year}{e.detail ? ` — ${e.detail}` : ''}</div>
            </div>
          ))}
        </Section>

        <Section title={t('cv.sections.certificationsCode')}>
          {P.certifications.map((c, i) => (
            <div key={i} style={{ ...s.bullet, marginLeft: 0, marginBottom: 4 }}>✓ {c}</div>
          ))}
        </Section>
      </div>
    </div>
  )
}
