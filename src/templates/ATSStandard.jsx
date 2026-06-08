import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const s = {
  root: {
    width: 794, minHeight: 1123, backgroundColor: '#fff',
    fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 13,
    color: '#111', padding: '52px 56px', lineHeight: 1.45,
  },
  name: { fontSize: 26, fontWeight: 700, letterSpacing: '0.04em', marginBottom: 4 },
  contact: { fontSize: 12, color: '#444', marginBottom: 16 },
  divider: { borderTop: '1.5px solid #111', marginBottom: 14, marginTop: 10 },
  sectionTitle: {
    fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', borderBottom: '1px solid #ccc',
    paddingBottom: 3, marginBottom: 10, marginTop: 16,
  },
  jobHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
  jobTitle: { fontWeight: 700, fontSize: 13 },
  jobPeriod: { fontSize: 12, color: '#555' },
  jobCompany: { fontSize: 12, color: '#555', marginBottom: 4 },
  bullet: { marginLeft: 14, marginBottom: 2, fontSize: 13 },
  body: { fontSize: 13, lineHeight: 1.55, marginBottom: 8 },
}

function Section({ title, children }) {
  return (
    <div>
      <div style={s.sectionTitle}>{title}</div>
      {children}
    </div>
  )
}

function Job({ title, company, location, period, bullets }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={s.jobHeader}>
        <span style={s.jobTitle}>{title}</span>
        <span style={s.jobPeriod}>{period}</span>
      </div>
      <div style={s.jobCompany}>{company} · {location}</div>
      {bullets.map((b, i) => (
        <div key={i} style={s.bullet}>• {b}</div>
      ))}
    </div>
  )
}

export default function ATSStandard({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || '#111827'
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')

  return (
    <div style={s.root}>
      <div style={{ ...s.name, borderBottom: `3px solid ${ACCENT}`, paddingBottom: 6 }}>
        {firstName.toUpperCase()} {lastName.toUpperCase()}
      </div>
      <div style={s.contact}>
        {[P.email, P.phone, P.location, P.linkedin, P.website].filter(Boolean).join(' · ')}
      </div>
      <div style={s.divider} />

      <Section title={t('cv.sections.profile')}>
        <p style={s.body}>{P.summary}</p>
      </Section>

      <Section title={t('cv.sections.experience')}>
        {P.experience.map((e, i) => <Job key={i} {...e} />)}
      </Section>

      <Section title={t('cv.sections.education')}>
        {P.education.map((e, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={s.jobHeader}>
              <span style={s.jobTitle}>{e.degree}</span>
              <span style={s.jobPeriod}>{e.year}</span>
            </div>
            <div style={s.jobCompany}>{e.school}{e.detail ? ` · ${e.detail}` : ''}</div>
          </div>
        ))}
      </Section>

      <Section title={t('cv.sections.skills')}>
        <p style={s.body}>{P.skills.join(' · ')}</p>
      </Section>

      <Section title={t('cv.sections.languages')}>
        <p style={s.body}>{P.languages.map(l => `${l.lang} (${l.level})`).join(' · ')}</p>
      </Section>
    </div>
  )
}
