import { PRESENT_TERMS } from '../constants/keywords.js'
import { DATE_RANGE_RE, YEAR_RANGE_RE, STANDALONE_YEAR_RE } from '../constants/patterns.js'

const MONTH_MAP = {
  // French
  jan: '01', janv: '01', janvier: '01',
  fév: '02', fevr: '02', février: '02', 'fev': '02',
  mars: '03', mar: '03',
  avr: '04', avril: '04',
  mai: '05',
  juin: '06', jun: '06',
  juil: '07', juillet: '07', jul: '07',
  août: '08', aout: '08', aug: '08',
  sep: '09', sept: '09', septembre: '09',
  oct: '10', octobre: '10',
  nov: '11', novembre: '11',
  déc: '12', dec: '12', décembre: '12', decembre: '12',
  // English
  january: '01', february: '02', march: '03', april: '04',
  may: '05', june: '06', july: '07', august: '08',
  september: '09', october: '10', november: '11', december: '12',
}

/** Normalize a raw date token (e.g. "Jan. 2020", "01/2020", "2020") to "YYYY-MM" or null */
export function parseDate(raw) {
  if (!raw) return null
  const s = raw.trim().toLowerCase().replace(/\.$/, '')

  if (isPresent(s)) return 'present'

  // MM/YYYY
  const slashMatch = s.match(/^(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    return `${slashMatch[2]}-${slashMatch[1].padStart(2, '0')}`
  }

  // YYYY-MM or YYYY/MM
  const isoMatch = s.match(/^(\d{4})[-/](\d{2})$/)
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}`

  // Month YYYY (possibly with dot after month abbrev)
  const monthMatch = s.match(/^([a-zàâäéèêëîïôùûüçœæ.]+)\.?\s+(\d{4})$/)
  if (monthMatch) {
    const monthKey = monthMatch[1].replace(/\./g, '').trim()
    const mm = MONTH_MAP[monthKey]
    if (mm) return `${monthMatch[2]}-${mm}`
  }

  // Plain year "2020"
  const yearOnly = s.match(/^(\d{4})$/)
  if (yearOnly) return `${yearOnly[1]}-01`

  return null
}

/** Check if a token represents "present / current" */
export function isPresent(s) {
  return PRESENT_TERMS.some(t => s.toLowerCase().includes(t.toLowerCase()))
}

/**
 * Extract a date range from a text string.
 * Returns { startDate, endDate, isCurrent } or null if no range found.
 */
export function extractDateRange(text) {
  if (!text) return null

  // Try full date range pattern first (e.g. "Jan 2020 - Dec 2023")
  const rangeMatch = text.match(DATE_RANGE_RE)
  if (rangeMatch) {
    const start = parseDate(rangeMatch[1])
    const rawEnd = rangeMatch[2]
    const isCurrent = isPresent(rawEnd)
    const end = isCurrent ? null : parseDate(rawEnd)
    if (start) return { startDate: start, endDate: end, isCurrent }
  }

  // Try year-only range (e.g. "2020 - 2023" or "2020 – présent")
  const yearMatch = text.match(YEAR_RANGE_RE)
  if (yearMatch) {
    const start = `${yearMatch[1]}-01`
    const isCurrent = isPresent(yearMatch[2])
    const end = isCurrent ? null : `${yearMatch[2]}-01`
    return { startDate: start, endDate: end, isCurrent }
  }

  return null
}

/**
 * Extract a single year from text (for education).
 * Returns the year as a string, or empty string.
 */
export function extractYear(text) {
  const m = text?.match(STANDALONE_YEAR_RE)
  return m ? m[1] : ''
}

/**
 * Extract a year range for education, e.g. "2018 - 2022".
 * Returns { startYear, endYear }.
 */
export function extractYearRange(text) {
  const rangeMatch = text?.match(/\b((?:19|20)\d{2})\s*[-–—]\s*((?:19|20)\d{2})\b/)
  if (rangeMatch) return { startYear: rangeMatch[1], endYear: rangeMatch[2] }

  const single = extractYear(text)
  if (single) return { startYear: '', endYear: single }

  return { startYear: '', endYear: '' }
}
