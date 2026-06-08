import { KEYWORD_MAP, ALL_SECTION_TERMS } from '../constants/keywords.js'
import { ALL_CAPS_RE, SKIP_LINE_RE } from '../constants/patterns.js'

/**
 * Detect if a line is a section header.
 * Returns the section name (e.g. 'experience') or null.
 *
 * Detection order:
 *   1. Direct keyword match — highest confidence
 *   2. StartsWith keyword — catches "Expériences professionnelles"
 *   3. ALL_CAPS + full-term match — catches "PROFESSIONAL BACKGROUND"
 */
export function detectSectionHeader(line) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.length < 2 || trimmed.length > 65) return null
  if (SKIP_LINE_RE.test(trimmed)) return null

  const lower = trimmed.toLowerCase()
    .replace(/[*_#:◆◇►▶▼▸\-–—|]/g, '')
    .trim()

  if (!lower) return null

  // 1. Direct keyword match (exact or trailing-s plural)
  for (const [keyword, section] of Object.entries(KEYWORD_MAP)) {
    if (lower === keyword || lower === keyword + 's') return section

    // Starts-with match: keyword must occupy the full line or be followed by a space
    // e.g. "expériences professionnelles" starts with "expériences"
    const kl = keyword.length
    if (
      lower.startsWith(keyword) &&
      (lower.length === kl || lower[kl] === ' ') &&
      lower.length <= kl + 25
    ) return section
  }

  // 2. ALL_CAPS heuristic: require a full known term to appear in the line
  // Use word-boundary checks to avoid false positives from short prefixes
  if (ALL_CAPS_RE.test(trimmed)) {
    for (const term of ALL_SECTION_TERMS) {
      if (
        lower === term ||
        lower.startsWith(term + ' ') ||
        lower.endsWith(' ' + term) ||
        lower.includes(' ' + term + ' ')
      ) {
        return KEYWORD_MAP[term] || null
      }
    }
  }

  return null
}

/**
 * Split raw text into labelled sections.
 * Returns: [{ name: 'header' | 'experience' | 'education' | ..., lines: string[] }]
 * The first section (before any detected header) always gets name 'header'.
 */
export function splitIntoSections(text) {
  const rawLines = text.split('\n')
  const sections = []
  let current = { name: 'header', lines: [] }

  for (const rawLine of rawLines) {
    const section = detectSectionHeader(rawLine)
    if (section) {
      if (current.lines.length > 0 || sections.length > 0) {
        sections.push(current)
      }
      current = { name: section, lines: [] }
    } else {
      current.lines.push(rawLine)
    }
  }
  if (current.lines.length > 0) sections.push(current)

  return sections
}

/**
 * Get content of a specific section as a joined string.
 * When multiple sections share the same name, their lines are merged.
 */
export function getSectionText(sections, name) {
  return sections
    .filter(s => s.name === name)
    .flatMap(s => s.lines)
    .join('\n')
}

/** Get the header block (everything before the first detected section). */
export function getHeaderText(sections) {
  return getSectionText(sections, 'header')
}

/**
 * Detect the dominant language of the CV.
 * Returns 'fr' | 'en' | 'ar'.
 */
export function detectLanguage(text) {
  const lower = text.toLowerCase()
  const frScore = countMatches(lower, ['expérience', 'formation', 'compétences', 'langues', 'profil', 'résumé'])
  const enScore = countMatches(lower, ['experience', 'education', 'skills', 'languages', 'profile', 'summary'])
  const arScore = countMatches(lower, ['الخبرة', 'التعليم', 'المهارات', 'اللغات', 'الملف', 'ملخص'])
  if (arScore > frScore && arScore > enScore) return 'ar'
  if (enScore > frScore) return 'en'
  return 'fr'
}

function countMatches(text, terms) {
  return terms.filter(t => text.includes(t)).length
}
