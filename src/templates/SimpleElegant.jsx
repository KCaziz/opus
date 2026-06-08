import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const SIDEBAR_W = 210

const s = {
  root: {
    width: 794, minHeight: 1123, backgroundColor: '#fff',
    fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: 13,
    color: '#1c1c1c', display: 'flex', lineHeight: 1.5,
  },
  sidebar: {
    width: SIDEBAR_W, minHeight: 1123,
    backgroundColor: '#F7F6F3', padding: '44px 22px',
    flexShrink: 0,
  },
  main: { flex: 1, padding: '44px 32px' },
  name: {
    fontSize: 26, fontWeight: 700, color: '#111',
    letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 4,
  },
  title: { fontSize: 13, color: '#777', marginBottom: 20, fontStyle: 'italic' },
  sideSection: { marginBottom: 22 },
  sideSectionTitle: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: '#888', marginBottom: 8,
    borderBottom: '1px solid #ddd', paddingBottom: 4,
  },
  sideItem: { fontSize: 12, color: '#444', marginBottom: 5, lineHeight: 1.5 },
  sideLabel: { fontSize: 11, color: '#999', display: 'block' },
  skillRow: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 5,
  },
  skillName: { fontSize: 12, color: '#444' },
  skillDots: { display: 'flex', gap: 3 },
  mainSectionTitle: {
    fontSize: 15, fontWeight: 700, color: '#2c2c2c',
    borderBottom: '1.5px solid #e5e5e5', paddingBottom: 5,
    marginBottom: 10, marginTop: 18, letterSpacing: '-0.01em',
  },
  jobTitle: { fontSize: 13, fontWeight: 700, color: '#111' },
  jobMeta: { fontSize: 12, color: '#888', marginBottom: 5 },
  bullet: { fontSize: 12, marginLeft: 12, marginBottom: 2, color: '#333' },
  body: { fontSize: 13, lineHeight: 1.6, color: '#444' },
}

function SkillBar({ name, level }) {
  return (
    <div style={s.skillRow}>
      <span style={s.skillName}>{name}</span>
      <div style={s.skillDots}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            backgroundColor: i <= level ? '#888' : '#ddd',
          }} />
        ))}
      </div>
    </div>
  )
}

export default function SimpleElegant({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || '#555555'
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')

  return (
    <div style={s.root}>
      {/* ── Sidebar ── */}
      <div style={s.sidebar}>
        <div style={{ marginBottom: 28 }}>
          <div style={s.name}>{firstName}<br />{lastName}</div>
          <div style={s.title}>{P.title}</div>
        </div>

        <div style={s.sideSection}>
          <div style={{ ...s.sideSectionTitle, color: ACCENT, borderBottom: `1px solid ${ACCENT}44` }}>{t('cv.sections.contact')}</div>
          {[
            { label: t('cv.labels.email'),    val: P.email    },
            { label: t('cv.labels.phone'),    val: P.phone    },
            { label: t('cv.labels.location'), val: P.location },
            { label: t('cv.labels.linkedin'), val: P.linkedin },
            { label: t('cv.labels.website'),  val: P.website  },
          ].filter(({ val }) => !!val).map(({ label, val }) => (
            <div key={label} style={s.sideItem}>
              <span style={s.sideLabel}>{label}</span>
              {val}
            </div>
          ))}
        </div>

        <div style={s.sideSection}>
          <div style={s.sideSectionTitle}>{t('cv.sections.skills')}</div>
          {[
            ['JavaScript', 5], ['React', 5], ['Node.js', 4],
            ['Python', 4], ['PostgreSQL', 4], ['Docker', 3],
          ].map(([name, level]) => <SkillBar key={name} name={name} level={level} />)}
        </div>

        <div style={s.sideSection}>
          <div style={s.sideSectionTitle}>{t('cv.sections.languages')}</div>
          {P.languages.map(l => (
            <div key={l.lang} style={s.sideItem}>
              <span style={s.sideLabel}>{l.level}</span>
              {l.lang}
            </div>
          ))}
        </div>

        <div style={s.sideSection}>
          <div style={s.sideSectionTitle}>{t('cv.sections.certifications')}</div>
          {P.certifications.map((c, i) => (
            <div key={i} style={s.sideItem}>{c}</div>
          ))}
        </div>
      </div>

      {/* ── Main ── */}
      <div style={s.main}>
        <div style={{ ...s.mainSectionTitle, marginTop: 0 }}>{t('cv.sections.profile')}</div>
        <p style={s.body}>{P.summary}</p>

        <div style={s.mainSectionTitle}>{t('cv.sections.experience')}</div>
        {P.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={s.jobTitle}>{e.title}</span>
              <span style={{ fontSize: 12, color: '#aaa' }}>{e.period}</span>
            </div>
            <div style={s.jobMeta}>{e.company} · {e.location}</div>
            {e.bullets.map((b, j) => <div key={j} style={s.bullet}>– {b}</div>)}
          </div>
        ))}

        <div style={s.mainSectionTitle}>{t('cv.sections.education')}</div>
        {P.education.map((e, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={s.jobTitle}>{e.degree}</span>
              <span style={{ fontSize: 12, color: '#aaa' }}>{e.year}</span>
            </div>
            <div style={s.jobMeta}>{e.school}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
