import {
  EMAIL_RE, PHONE_RE, LINKEDIN_RE, WEBSITE_RE, PLAIN_URL_RE,
} from '../constants/patterns.js'

/**
 * Extract all contact entities from the full raw text.
 * Returns { email, phone, linkedin, website }
 */
export function extractContactEntities(text) {
  const emailMatch    = text.match(EMAIL_RE)
  const phoneMatch    = extractPhone(text)
  const linkedinMatch = text.match(LINKEDIN_RE)
  const websiteMatch  = extractWebsite(text)

  return {
    email:    emailMatch?.[0]?.trim()    || '',
    phone:    phoneMatch                 || '',
    linkedin: cleanLinkedin(linkedinMatch?.[0]) || '',
    website:  websiteMatch               || '',
  }
}

function extractPhone(text) {
  const match = text.match(PHONE_RE)
  if (!match) return ''
  const candidate = match[0].trim()
  const digits = candidate.replace(/\D/g, '')
  // Must have between 8 and 15 digits
  if (digits.length < 8 || digits.length > 15) return ''
  // Reject if it looks like two consecutive years: "20202023"
  if (/^(19|20)\d{2}(19|20)\d{2}$/.test(digits)) return ''
  // Reject pure year
  if (/^(19|20)\d{2}$/.test(digits)) return ''
  return candidate
}

function cleanLinkedin(raw) {
  if (!raw) return ''
  return raw.replace(/^https?:\/\/(?:www\.)?/, '').replace(/\/$/, '')
}

function extractWebsite(text) {
  const full = text.match(WEBSITE_RE)
  if (full) return full[0]
  const plain = text.match(PLAIN_URL_RE)
  if (plain) {
    const url = plain[0]
    // Exclude linkedin URLs
    if (url.toLowerCase().includes('linkedin')) return ''
    return url
  }
  return ''
}

/**
 * Extract name from the first lines of the CV.
 * Returns { firstName, lastName, fullName }
 */
export function extractName(lines) {
  // Try first 5 non-empty lines — name is usually line 1
  const candidates = lines
    .slice(0, 6)
    .map(l => l.trim())
    .filter(l =>
      l.length > 1 &&
      l.length < 60 &&
      !EMAIL_RE.test(l) &&
      !PHONE_RE.test(l) &&
      !LINKEDIN_RE.test(l) &&
      !WEBSITE_RE.test(l) &&
      !l.includes('@') &&
      !/^\d/.test(l) &&        // doesn't start with digit
      !/^[+\d\s()\-]+$/.test(l) // not purely phone-like
    )

  if (!candidates.length) return { firstName: '', lastName: '', fullName: '' }

  const fullName = candidates[0]

  // Split on space — heuristic: first word = firstName, rest = lastName
  const parts = fullName.replace(/\s+/, ' ').trim().split(' ')
  if (parts.length === 1) return { firstName: fullName, lastName: '', fullName }

  // If all caps last name pattern: "DUPONT Jean" → reverse
  const firstPart = parts[0]
  const isAllCaps = firstPart === firstPart.toUpperCase() && /[A-Z]{2,}/.test(firstPart)
  if (isAllCaps && parts.length >= 2) {
    return {
      firstName: parts.slice(1).join(' '),
      lastName:  firstPart,
      fullName,
    }
  }

  return {
    firstName: parts[0],
    lastName:  parts.slice(1).join(' '),
    fullName,
  }
}

/**
 * Extract professional title from lines near the name.
 * Returns a string or ''
 */
export function extractTitle(lines, email, phone) {
  const stopPatterns = [EMAIL_RE, PHONE_RE, LINKEDIN_RE, WEBSITE_RE]
  const skip = [email, phone].filter(Boolean)

  for (let i = 1; i < Math.min(7, lines.length); i++) {
    const line = lines[i].trim()
    if (!line) continue
    if (skip.some(s => line.includes(s))) continue
    if (stopPatterns.some(r => r.test(line))) continue
    if (line.length < 4 || line.length > 100) continue
    if (/^\d/.test(line)) continue

    // Title lines are usually: a job title like "Ingénieur Logiciel Senior"
    // They are shorter than 80 chars and don't look like address / city
    return line
  }
  return ''
}

/**
 * Extract location (city/country) from first lines.
 * Looks for patterns like "Paris, France" or "75001 Paris".
 */
export function extractLocation(text) {
  // Pattern: "City, Country" or "ZIP City"
  const cityCountry = text.match(/\b([A-ZÀ-Ö][a-zà-ö]+(?:\s[A-ZÀ-Ö][a-zà-ö]+)?),\s*([A-ZÀ-Ö][a-zà-ö]+(?:\s[A-ZÀ-Ö][a-zà-ö]+)?)\b/)
  if (cityCountry) return { city: cityCountry[1], country: cityCountry[2] }

  // Pattern: ZIP code + city
  const zipCity = text.match(/\b\d{5}\s+([A-ZÀ-Ö][a-zà-ö]+(?:\s[A-ZÀ-Ö][a-zà-ö]+)?)\b/)
  if (zipCity) return { city: zipCity[1], country: '' }

  return { city: '', country: '' }
}
