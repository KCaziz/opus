import { extractDateRange, extractYearRange } from './dateParser.js'
import { DATE_RANGE_RE, YEAR_RANGE_RE, BULLET_RE, STANDALONE_YEAR_RE } from '../constants/patterns.js'

// ── Experience parsing ──────────────────────────────────────────────

/**
 * Parse experience section text into a list of experience entries.
 *
 * Strategy: date-range lines act as anchors.
 * For each date line we look backward (up to 4 lines) for title / company / location,
 * then forward for bullet points.
 * The forward scan stops at the next blank line or the next date anchor — no
 * fixed "+N" skip, so no content is accidentally skipped.
 */
export function parseExperience(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const entries = []

  let i = 0
  while (i < lines.length) {
    const line      = lines[i]
    const dateRange = extractDateRange(line)

    if (!dateRange) { i++; continue }

    // ── Extract title / company / location around this date line ──
    const { title, company, location, afterConsumed = 0 } = extractTitleCompany(lines, i)

    // ── Collect bullets starting after the meta lines consumed ──
    const bulletsStart = i + 1 + afterConsumed
    const bullets = []
    let j = bulletsStart

    while (j < lines.length && j < bulletsStart + 15) {
      const l = lines[j].trim()
      if (!l) break                  // blank line = end of this entry
      if (extractDateRange(l)) break // next date anchor = next entry
      const cleaned = l.replace(BULLET_RE, '').trim()
      if (cleaned.length > 2) bullets.push(cleaned)
      j++
    }

    if (title || company) {
      entries.push({
        title:     title    || '',
        company:   company  || '',
        location:  location || '',
        startDate: dateRange.startDate === 'present' ? '' : (dateRange.startDate || ''),
        endDate:   dateRange.endDate   === 'present' ? '' : (dateRange.endDate   || ''),
        isCurrent: dateRange.isCurrent || false,
        bullets:   bullets.length ? bullets : [''],
      })
    }

    // Advance to wherever the bullet scan stopped.
    // If j points to a blank line → next iteration skips it (no date → i++).
    // If j points to a date line → next iteration processes it immediately.
    i = j
  }

  if (entries.length === 0) return parseFlatExperience(lines)
  return entries
}

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Split "Title | Company" or "Title at Company" or "Title — Company, Location".
 * Returns { title, company, location } or null if no recognized separator found.
 */
function splitTitleCompany(text) {
  const m = text.match(
    /^(.+?)\s*(?:—|–|\||\bat\b|\bchez\b|@)\s*(.+?)(?:\s*(?:—|–|\|),?\s*(.+))?$/
  )
  if (!m) return null
  return {
    title:    m[1].trim(),
    company:  m[2].trim(),
    location: m[3]?.trim() || '',
  }
}

/**
 * Remove all date patterns from a line and return the leftover text.
 * Used when the date and title share one line.
 */
function stripDateFromLine(line) {
  return line
    .replace(new RegExp(DATE_RANGE_RE.source, 'gi'), '')
    .replace(new RegExp(YEAR_RANGE_RE.source, 'gi'), '')
    .replace(new RegExp(STANDALONE_YEAR_RE.source, 'g'), '')
    .replace(/^[\s\-–—|·,•]+|[\s\-–—|·,•]+$/g, '')
    .trim()
}

/**
 * Look backward and forward from a date line to extract title, company, location.
 *
 * Three layouts handled:
 *   1. Meta lines BEFORE the date   → most common FR layout
 *   2. Date + title on the SAME line → common EN layout
 *   3. Date FIRST, meta lines below  → some EN formats
 *
 * Returns { title, company, location, afterConsumed }
 * where afterConsumed = number of lines after the date line that were consumed
 * as meta (title/company/location), so the caller can skip past them before
 * starting bullet extraction.
 */
function extractTitleCompany(lines, dateIdx) {
  // ── Collect up to 4 lines before the date ──
  const before = []
  for (let j = dateIdx - 1; j >= Math.max(0, dateIdx - 4); j--) {
    const l = lines[j].trim()
    if (!l) break
    if (extractDateRange(l)) break
    if (BULLET_RE.test(l)) break
    before.unshift(l)
  }

  // ── Case 1: lines found before the date ──
  if (before.length > 0) {
    // First try inline "Title | Company" on the first line
    const split = splitTitleCompany(before[0])
    if (split) {
      return {
        ...split,
        // A separate second line is most likely the location
        location: before[1] || split.location,
        afterConsumed: 0,
      }
    }
    // Two or more separate lines
    if (before.length >= 2) {
      return {
        title:    before[0],
        company:  before[1],
        location: before[2] || '',   // 3rd line = location / department
        afterConsumed: 0,
      }
    }
    return { title: before[0], company: '', location: '', afterConsumed: 0 }
  }

  // ── Case 2: date and title/company on the same line ──
  const dateLine     = lines[dateIdx] || ''
  const nonDatePart  = stripDateFromLine(dateLine)
  if (nonDatePart.length > 2) {
    const split = splitTitleCompany(nonDatePart)
    if (split) return { ...split, afterConsumed: 0 }
    return { title: nonDatePart, company: '', location: '', afterConsumed: 0 }
  }

  // ── Case 3: date first, title/company on lines below ──
  const after = []
  for (let j = dateIdx + 1; j < Math.min(dateIdx + 4, lines.length); j++) {
    const l = lines[j].trim()
    if (!l) break
    if (extractDateRange(l)) break
    if (BULLET_RE.test(l)) break
    after.push(l)
  }

  if (after.length > 0) {
    const split = splitTitleCompany(after[0])
    if (split) {
      return {
        ...split,
        location: after[1] || split.location,
        afterConsumed: after.length,
      }
    }
    if (after.length >= 2) {
      return {
        title:    after[0],
        company:  after[1],
        location: after[2] || '',
        afterConsumed: after.length,
      }
    }
    return { title: after[0], company: '', location: '', afterConsumed: 1 }
  }

  return { title: '', company: '', location: '', afterConsumed: 0 }
}

/**
 * Fallback: no date ranges found anywhere.
 * Parse as blank-line-delimited blocks, one entry per block.
 */
function parseFlatExperience(lines) {
  const blocks = []
  let block = []
  for (const line of lines) {
    if (!line.trim()) {
      if (block.length) { blocks.push([...block]); block = [] }
    } else {
      block.push(line.trim())
    }
  }
  if (block.length) blocks.push(block)

  return blocks.map(b => ({
    title:     b[0] || '',
    company:   b[1] || '',
    location:  '',
    startDate: '',
    endDate:   '',
    isCurrent: false,
    bullets:   b.slice(2).filter(l => l.length > 3),
  })).filter(e => e.title)
}

// ── Education parsing ───────────────────────────────────────────────

/**
 * Parse education section text into a list of education entries.
 */
export function parseEducation(text) {
  const blocks = groupIntoBlocks(text)
  const entries = []

  for (const block of blocks) {
    const blockText = block.join(' ')
    const yearRange = extractYearRange(blockText)

    const nonDateLines = block.filter(l => !DATE_RANGE_RE.test(l) && !YEAR_RANGE_RE.test(l))
    if (nonDateLines.length === 0) continue

    const degree = nonDateLines[0] || ''
    const school = nonDateLines[1] || ''
    const grade  = nonDateLines.find(l =>
      /(?:mention|grade|gpa|honours|honors|distinction)/i.test(l)
    ) || ''

    entries.push({
      degree:    degree.replace(BULLET_RE, '').trim(),
      school:    school.replace(BULLET_RE, '').trim(),
      location:  '',
      startYear: yearRange.startYear,
      endYear:   yearRange.endYear,
      grade:     grade.replace(BULLET_RE, '').trim(),
    })
  }

  return entries.filter(e => e.degree)
}

function groupIntoBlocks(text) {
  const blocks = []
  let block = []
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) {
      if (block.length) { blocks.push([...block]); block = [] }
    } else {
      block.push(line)
    }
  }
  if (block.length) blocks.push(block)
  return blocks
}
