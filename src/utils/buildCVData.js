import { getPlaceholder } from '../data/cvPlaceholder'

const MONTHS_FR = ['Jan.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sep.', 'Oct.', 'Nov.', 'Déc.']
const MONTHS_EN = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']
const MONTHS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
const PRESENT   = { fr: 'Présent', en: 'Present', ar: 'الآن' }

function getLang(lang) {
  if (lang?.startsWith('en')) return 'en'
  if (lang?.startsWith('ar')) return 'ar'
  return 'fr'
}

function fmtDate(dateStr, lang) {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const l = getLang(lang)
  const months = l === 'en' ? MONTHS_EN : l === 'ar' ? MONTHS_AR : MONTHS_FR
  const m = months[parseInt(month, 10) - 1] || ''
  return `${m} ${year}`.trim()
}

function fmtPeriod(start, end, isCurrent, lang) {
  const l   = getLang(lang)
  const s   = fmtDate(start, lang)
  const e   = isCurrent ? PRESENT[l] : (fmtDate(end, lang) || PRESENT[l])
  return s ? `${s} — ${e}` : e
}

/**
 * Converts cvState from the store into the same shape as getPlaceholder().
 * Templates use: const P = data?._cv || getPlaceholder(i18n.language)
 * Pass the return value as data._cv to a template to render real user data.
 */
export function buildCVData(cvState, lang) {
  const P    = getPlaceholder(lang)
  const info = cvState.personalInfo

  const location = [info.city, info.country].filter(Boolean).join(', ')

  const experience = cvState.experience.length > 0
    ? cvState.experience.map(e => ({
        title:    e.title    || '',
        company:  e.company  || '',
        location: e.location || '',
        period:   fmtPeriod(e.startDate, e.endDate, e.isCurrent, lang),
        bullets:  Array.isArray(e.bullets) ? e.bullets.filter(Boolean) : [],
      }))
    : P.experience

  const education = cvState.education.length > 0
    ? cvState.education.map(e => ({
        degree: e.degree  || '',
        school: e.school  || '',
        year:   e.endYear || e.startYear || '',
        detail: e.grade   || '',
      }))
    : P.education

  return {
    title:          info.title    || P.title,
    email:          info.email    || P.email,
    phone:          info.phone    || P.phone,
    location:       location      || P.location,
    linkedin:       info.linkedin || '',
    website:        info.website  || '',
    summary:        cvState.summary || P.summary,
    experience,
    education,
    skills:         cvState.skills.length > 0         ? cvState.skills         : P.skills,
    languages:      cvState.languages.length > 0      ? cvState.languages      : P.languages,
    certifications: cvState.certifications.length > 0 ? cvState.certifications : P.certifications,
  }
}
