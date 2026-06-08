import { getPlaceholder } from '../data/cvPlaceholder'
import { useTranslation } from 'react-i18next'

const SIDEBAR_W  = 230
const SIDEBAR_BG = '#0F172A'
const DEFAULT_ACCENT = '#38BDF8'

export default function ModerneColore({ data, accentColor }) {
  const { t, i18n } = useTranslation()
  const P         = data?._cv || getPlaceholder(i18n.language)
  const ACCENT    = accentColor || DEFAULT_ACCENT
  const firstName = data?.firstName || t('builder.firstNamePlaceholder')
  const lastName  = data?.lastName  || t('builder.lastNamePlaceholder')
  const initials  = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  const s = {
    root:             { width: 794, minHeight: 1123, backgroundColor: '#fff', fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: 13, color: '#1a1a1a', display: 'flex' },
    sidebar:          { width: SIDEBAR_W, minHeight: 1123, backgroundColor: SIDEBAR_BG, padding: '44px 24px', flexShrink: 0, color: '#fff' },
    avatar:           { width: 80, height: 80, borderRadius: '50%', backgroundColor: '#1e3a5f', border: `3px solid ${ACCENT}`, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: ACCENT },
    sidebarName:      { fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 4 },
    sidebarTitle:     { fontSize: 12, color: ACCENT, marginBottom: 24 },
    sideSectionTitle: { fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 8, marginTop: 18 },
    sideItem:         { fontSize: 12, color: '#94a3b8', marginBottom: 6, lineHeight: 1.4 },
    sideItemLabel:    { display: 'block', fontSize: 11, color: '#64748b', marginBottom: 1 },
    skillRow:         { marginBottom: 6 },
    skillName:        { fontSize: 12, color: '#cbd5e1', marginBottom: 3 },
    skillBar:         { height: 4, backgroundColor: '#1e3a5f', borderRadius: 2, overflow: 'hidden' },
    skillFill:        { height: '100%', backgroundColor: ACCENT, borderRadius: 2 },
    main:             { flex: 1, padding: '44px 32px' },
    mainName:         { fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 4 },
    mainTitle:        { fontSize: 14, color: '#64748b', marginBottom: 24 },
    sectionTitle:     { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: ACCENT, borderLeft: `3px solid ${ACCENT}`, paddingLeft: 8, marginTop: 20, marginBottom: 10 },
    jobTitle:         { fontWeight: 700, fontSize: 13, color: '#0f172a' },
    jobPeriod:        { fontSize: 12, color: '#fff', fontWeight: 600, backgroundColor: ACCENT, borderRadius: 3, padding: '1px 6px', marginLeft: 8 },
    jobMeta:          { fontSize: 12, color: '#94a3b8', marginBottom: 5 },
    bullet:           { marginLeft: 12, marginBottom: 2, fontSize: 13, color: '#334155' },
    body:             { fontSize: 13, lineHeight: 1.6, color: '#475569' },
  }

  function SkillBar({ name, pct }) {
    return (
      <div style={s.skillRow}>
        <div style={s.skillName}>{name}</div>
        <div style={s.skillBar}>
          <div style={{ ...s.skillFill, width: `${pct}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div style={s.root}>
      <div style={s.sidebar}>
        <div style={s.avatar}>{initials}</div>
        <div style={s.sidebarName}>{firstName}<br />{lastName}</div>
        <div style={s.sidebarTitle}>{P.title}</div>

        <div style={s.sideSectionTitle}>{t('cv.sections.contact')}</div>
        {[
          { label: t('cv.labels.email'),    val: P.email    },
          { label: t('cv.labels.phone'),    val: P.phone    },
          { label: t('cv.labels.location'), val: P.location },
          { label: t('cv.labels.linkedin'), val: P.linkedin },
          { label: t('cv.labels.website'),  val: P.website  },
        ].filter(({ val }) => !!val).map(({ label, val }) => (
          <div key={label} style={s.sideItem}>
            <span style={s.sideItemLabel}>{label}</span>
            {val}
          </div>
        ))}

        <div style={s.sideSectionTitle}>{t('cv.sections.skills')}</div>
        {[['React', 95], ['Node.js', 88], ['TypeScript', 85], ['Python', 78], ['Docker', 72], ['AWS', 65]]
          .map(([n, p]) => <SkillBar key={n} name={n} pct={p} />)}

        <div style={s.sideSectionTitle}>{t('cv.sections.languages')}</div>
        {P.languages.map(l => (
          <div key={l.lang} style={s.sideItem}>
            <span style={s.sideItemLabel}>{l.level}</span>
            {l.lang}
          </div>
        ))}
      </div>

      <div style={s.main}>
        <div style={s.mainName}>{firstName}<br />{lastName}</div>
        <div style={s.mainTitle}>{P.title}</div>

        <div style={{ ...s.sectionTitle, marginTop: 0 }}>{t('cv.sections.profile')}</div>
        <p style={s.body}>{P.summary}</p>

        <div style={s.sectionTitle}>{t('cv.sections.experience')}</div>
        {P.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
              <span style={s.jobTitle}>{e.title}</span>
              <span style={s.jobPeriod}>{e.period}</span>
            </div>
            <div style={s.jobMeta}>{e.company} · {e.location}</div>
            {e.bullets.slice(0, 3).map((b, j) => <div key={j} style={s.bullet}>→ {b}</div>)}
          </div>
        ))}

        <div style={s.sectionTitle}>{t('cv.sections.education')}</div>
        {P.education.map((e, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={s.jobTitle}>{e.degree}</span>
              <span style={s.jobPeriod}>{e.year}</span>
            </div>
            <div style={s.jobMeta}>{e.school}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
