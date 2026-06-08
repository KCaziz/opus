import { BULLET_RE } from '../constants/patterns.js'

/**
 * Parse a skills section into a flat string array.
 *
 * Handles:
 *   • Comma / semicolon separated:  "Python, JavaScript, React"
 *   • Pipe separated:               "React | Vue | Angular"
 *   • Slash separated:              "React / Vue / Angular"
 *   • Categorised with colon:       "Frontend: React, Vue, Angular"
 *   • One skill per line
 */
export function parseSkills(text) {
  if (!text.trim()) return []

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const skills = []

  for (const line of lines) {
    // Strip bullet prefix and leading/trailing whitespace
    let clean = line.replace(BULLET_RE, '').trim()
    if (!clean) continue

    // Strip category prefix:  "Programming Languages: Python, JS" → "Python, JS"
    const colonIdx = clean.indexOf(':')
    if (colonIdx > 0 && colonIdx < 40) {
      const afterColon = clean.slice(colonIdx + 1).trim()
      if (afterColon.length > 0) clean = afterColon
    }

    // Split on the dominant separator in this line
    let parts
    if (clean.includes(',') || clean.includes(';')) {
      parts = clean.split(/[,;]/)
    } else if (clean.includes(' | ')) {
      parts = clean.split(' | ')
    } else if (clean.includes(' / ')) {
      parts = clean.split(' / ')
    } else if (clean.includes(' · ')) {
      parts = clean.split(' · ')
    } else {
      parts = [clean]
    }

    for (const p of parts) {
      const s = p.trim()
      if (s.length >= 2 && s.length <= 60) skills.push(s)
    }
  }

  return [...new Set(skills)]
    .filter(s => !/^\d+$/.test(s))          // drop pure-digit strings
    .filter(s => s.split(' ').length <= 6)  // drop very long phrases
}

/**
 * Parse a languages section into [{ lang, level }] objects.
 * Handles:  "Français (Natif)" / "English — Fluent (C1)" / "Français : Courant"
 */
export function parseLanguages(text) {
  if (!text.trim()) return []

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const langs = []

  const LEVEL_HINTS = [
    'natif', 'bilingue', 'courant', 'avancé', 'intermédiaire', 'seuil', 'élémentaire',
    'native', 'bilingual', 'fluent', 'advanced', 'intermediate', 'elementary',
    'c2', 'c1', 'b2', 'b1', 'a2', 'a1',
  ]

  for (const line of lines) {
    const clean = line.replace(BULLET_RE, '').trim()
    if (!clean) continue

    // "Language (Level)" or "Language — Level" or "Language : Level" or "Language - Level"
    const sepMatch = clean.match(/^(.+?)\s*(?:\(([^)]+)\)|—\s*(.+)|:\s*(.+)|-\s*(.+))$/)
    if (sepMatch) {
      const langName = sepMatch[1].trim()
      const level    = (sepMatch[2] || sepMatch[3] || sepMatch[4] || sepMatch[5] || '').trim()
      if (langName.length > 0 && langName.length < 40) {
        langs.push({ lang: langName, level })
        continue
      }
    }

    // "Français Courant" — two words where second looks like a level
    const parts = clean.split(/\s+/)
    if (parts.length === 2) {
      const [a, b] = parts
      if (LEVEL_HINTS.some(h => b.toLowerCase().includes(h))) {
        langs.push({ lang: a, level: b })
        continue
      }
    }

    if (clean.length < 30) langs.push({ lang: clean, level: '' })
  }

  return langs.filter(l => l.lang.length >= 2)
}

/**
 * Parse certifications section — each non-empty line is one certification.
 */
export function parseCertifications(text) {
  return text
    .split('\n')
    .map(l => l.replace(BULLET_RE, '').trim())
    .filter(l => l.length > 3 && l.length < 200)
}
