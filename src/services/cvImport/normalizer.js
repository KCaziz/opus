/**
 * Normalizer — maps parsed CV data to the application store format.
 *
 * The store expects:
 *   personalInfo: { firstName, lastName, email, phone, address, city, country, title, linkedin, website }
 *   summary:        string
 *   experience:     [{ title, company, location, startDate, endDate, isCurrent, bullets }]
 *   education:      [{ degree, school, location, startYear, endYear, grade }]
 *   skills:         string[]
 *   languages:      [{ lang, level }]
 *   certifications: string[]
 */

/**
 * Convert a raw ParsedCV object to the store-ready payload.
 * Returns only the data fields (no templateId / accentColor).
 */
export function normalizeToStore(parsed) {
  return {
    personalInfo: normalizePersonalInfo(parsed),
    summary:      (parsed.summary || '').trim(),
    experience:   (parsed.experience || []).map(normalizeExperience).filter(Boolean),
    education:    (parsed.education  || []).map(normalizeEducation).filter(Boolean),
    skills:       uniqueNonEmpty(parsed.skills || []),
    languages:    (parsed.languages || []).filter(l => l.lang),
    certifications: uniqueNonEmpty(parsed.certifications || []),
  }
}

function normalizePersonalInfo(parsed) {
  return {
    firstName: capitalize(parsed.firstName || ''),
    lastName:  capitalize(parsed.lastName  || ''),
    email:     (parsed.email    || '').toLowerCase().trim(),
    phone:     (parsed.phone    || '').trim(),
    address:   (parsed.address  || '').trim(),
    city:      capitalize(parsed.city    || ''),
    country:   capitalize(parsed.country || ''),
    title:     (parsed.title    || '').trim(),
    linkedin:  cleanUrl(parsed.linkedin || ''),
    website:   cleanUrl(parsed.website  || ''),
    photo:     null,
  }
}

function normalizeExperience(exp) {
  if (!exp.title && !exp.company) return null
  return {
    title:     (exp.title    || '').trim(),
    company:   (exp.company  || '').trim(),
    location:  (exp.location || '').trim(),
    startDate: normalizeMonthDate(exp.startDate),
    endDate:   normalizeMonthDate(exp.endDate),
    isCurrent: Boolean(exp.isCurrent),
    bullets:   (exp.bullets  || []).filter(b => b && b.trim().length > 2),
  }
}

function normalizeEducation(edu) {
  if (!edu.degree && !edu.school) return null
  return {
    degree:    (edu.degree    || '').trim(),
    school:    (edu.school    || '').trim(),
    location:  (edu.location  || '').trim(),
    startYear: String(edu.startYear || '').slice(0, 4),
    endYear:   String(edu.endYear   || '').slice(0, 4),
    grade:     (edu.grade || '').trim(),
  }
}

/** Ensure a YYYY-MM string is valid, otherwise return '' */
function normalizeMonthDate(val) {
  if (!val || val === 'present') return ''
  const match = String(val).match(/^(\d{4})-(\d{2})$/)
  if (!match) return ''
  const year  = parseInt(match[1], 10)
  const month = parseInt(match[2], 10)
  if (year < 1950 || year > 2100 || month < 1 || month > 12) return ''
  return val
}

function capitalize(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function cleanUrl(url) {
  return url.replace(/^https?:\/\/(?:www\.)?/, '').replace(/\/$/, '').trim()
}

function uniqueNonEmpty(arr) {
  return [...new Set(arr.map(s => s.trim()).filter(s => s.length > 0))]
}
