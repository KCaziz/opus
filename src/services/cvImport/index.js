/**
 * CV Import Engine — public API
 *
 * importCV(file) → Promise<StorePayload>
 *
 * Pipeline:
 *   File (PDF|DOCX)
 *   → text extraction
 *   → language detection
 *   → section splitting
 *   → per-section entity extraction
 *   → normalization to store format
 */

import { extractPdfText  } from './extractors/pdfExtractor.js'
import { extractDocxText } from './extractors/docxExtractor.js'

import { splitIntoSections, getSectionText, getHeaderText, detectLanguage } from './parser/sectionFinder.js'
import { extractContactEntities, extractName, extractTitle, extractLocation } from './parser/contactParser.js'
import { parseExperience }   from './parser/entryParser.js'
import { parseEducation  }   from './parser/entryParser.js'
import { parseSkills, parseLanguages, parseCertifications } from './parser/skillsParser.js'
import { normalizeToStore }  from './normalizer.js'

// ── Supported file types ────────────────────────────────────────────
const SUPPORTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
]
const SUPPORTED_EXTENSIONS = ['.pdf', '.docx', '.doc']
const MAX_SIZE_MB = 10

// ── Main entry point ────────────────────────────────────────────────

/**
 * Import a CV file and return a store-ready payload.
 *
 * @param {File} file - PDF or DOCX file
 * @returns {Promise<StorePayload>} - ready to dispatch as IMPORT_CV_DATA payload
 * @throws {Error} - with user-facing message on failure
 */
export async function importCV(file) {
  validateFile(file)

  // 1. Extract raw text
  const rawText = await extractText(file)
  if (!rawText?.trim()) {
    throw makeError('NO_TEXT', 'The document contains no extractable text. It may be an image-based scan.')
  }

  // 2. Detect language
  const lang = detectLanguage(rawText)

  // 3. Split into sections
  const sections = splitIntoSections(rawText)
  const headerText = getHeaderText(sections)

  // 4. Extract contact info from header + full text
  const contact = extractContactEntities(rawText)
  const headerLines = headerText.split('\n').filter(Boolean)
  const nameInfo = extractName(headerLines)
  const title    = extractTitle(headerLines, contact.email, contact.phone)
  const location = extractLocation(headerText + '\n' + rawText.slice(0, 500))

  // 5. Extract summary
  const summaryText = getSectionText(sections, 'summary') || guessummary(sections, headerText)

  // 6. Extract experience
  const expText = getSectionText(sections, 'experience')
  const experience = expText ? parseExperience(expText) : []

  // 7. Extract education
  const eduText = getSectionText(sections, 'education')
  const education = eduText ? parseEducation(eduText) : []

  // 8. Extract skills
  const skillsText = getSectionText(sections, 'skills')
  const skills = skillsText ? parseSkills(skillsText) : []

  // 9. Extract languages
  const langsText = getSectionText(sections, 'languages')
  const languages = langsText ? parseLanguages(langsText) : []

  // 10. Extract certifications
  const certText = getSectionText(sections, 'certifications')
  const certifications = certText ? parseCertifications(certText) : []

  // 11. Build raw parsed object
  const raw = {
    firstName:      nameInfo.firstName,
    lastName:       nameInfo.lastName,
    email:          contact.email,
    phone:          contact.phone,
    address:        '',
    city:           location.city,
    country:        location.country,
    title,
    linkedin:       contact.linkedin,
    website:        contact.website,
    summary:        summaryText.trim(),
    experience,
    education,
    skills,
    languages,
    certifications,
    // metadata — not stored but useful for debugging
    _meta: { lang, sectionsFound: sections.map(s => s.name) },
  }

  // 12. Normalize to store format
  return normalizeToStore(raw)
}

// ── Helpers ──────────────────────────────────────────────────────────

function makeError(code, fallback) {
  const err = new Error(fallback)
  err.code = code
  return err
}

function validateFile(file) {
  if (!file) throw makeError('NO_FILE', 'No file selected.')

  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
  const isSupported =
    SUPPORTED_TYPES.includes(file.type) ||
    SUPPORTED_EXTENSIONS.includes(ext)

  if (!isSupported) {
    throw makeError('UNSUPPORTED_FORMAT', `Unsupported format: ${file.type || ext}. Use PDF or DOCX.`)
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw makeError('FILE_TOO_LARGE', `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max: ${MAX_SIZE_MB} MB.`)
  }
}

async function extractText(file) {
  const ext = file.name.toLowerCase()
  if (ext.endsWith('.pdf') || file.type === 'application/pdf') {
    return extractPdfText(file)
  }
  if (ext.endsWith('.docx') || ext.endsWith('.doc') || file.type.includes('word')) {
    return extractDocxText(file)
  }
  throw new Error('Format de fichier non reconnu.')
}

/**
 * If no explicit summary section was found, try to use the second paragraph
 * of the header block as the summary (common in simple CV layouts).
 */
function guessummary(sections, headerText) {
  const lines = headerText.split('\n').map(l => l.trim()).filter(Boolean)
  // Look for a block of descriptive text (3+ words, not an entity)
  for (let i = 3; i < lines.length; i++) {
    const l = lines[i]
    if (l.split(' ').length >= 5 && l.length > 30) return l
  }
  return ''
}
