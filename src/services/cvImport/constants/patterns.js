/** Regex patterns used across the CV import pipeline */

// ── Contact entities ────────────────────────────────────────────────
export const EMAIL_RE    = /[\w.+\-]+@[\w\-]+\.[a-zA-Z]{2,}/
export const PHONE_RE    = /(?:\+?\d{1,3}[\s.\-]?)?\(?\d{2,4}\)?[\s.\-]?\d{2,4}[\s.\-]?\d{2,4}[\s.\-]?\d{0,4}/
export const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w\-]+(?:\/)?/i
export const WEBSITE_RE  = /https?:\/\/(?!.*linkedin\.com)[\w\-.~:/?#[\]@!$&'()*+,;=%]+/i
// Generic URL (no http) — used as fallback for portfolio links
export const PLAIN_URL_RE = /(?:www\.|github\.com\/|gitlab\.com\/|bitbucket\.org\/|portfolio\.|site\.)[\w\-._~:/?#[\]@!$&'()*+,;=%.]+/i

// ── Month names (FR + EN) for date parsing ──────────────────────────
export const MONTH_NAMES_RE = /\b(jan(?:vier|uary)?\.?|fév(?:r(?:ier)?)?\.?|feb(?:ruary)?\.?|mars|mar(?:ch)?\.?|avr(?:il)?\.?|apr(?:il)?\.?|mai|may\.?|juin|jun(?:e)?\.?|juil(?:let)?\.?|jul(?:y)?\.?|août|aout|aug(?:ust)?\.?|sep(?:t(?:embre|ember)?)?\.?|oct(?:obre|ober)?\.?|nov(?:embre|ember)?\.?|déc(?:embre)?\.?|dec(?:ember)?\.?)\s+\d{4}/gi

// Date range patterns (with separators -, –, —, à, to)
const SEP = /[\s]*[-–—\/àto]+[\s]*/
const MONTH_PART = /(?:jan(?:vier|uary)?\.?|fév(?:r(?:ier)?)?\.?|feb(?:ruary)?\.?|mars|mar(?:ch)?\.?|avr(?:il)?\.?|apr(?:il)?\.?|mai|may\.?|juin|jun(?:e)?\.?|juil(?:let)?\.?|jul(?:y)?\.?|août|aout|aug(?:ust)?\.?|sep(?:t(?:embre|ember)?)?\.?|oct(?:obre|ober)?\.?|nov(?:embre|ember)?\.?|déc(?:embre)?\.?|dec(?:ember)?\.?)\s*\.?\s*\d{4}/i
const NUM_DATE   = /\d{1,2}\/\d{4}/
const YEAR_ONLY  = /(?:19|20)\d{2}/
const PRESENT    = /(?:présent|present|aujourd'hui|current|actuellement|maintenant|now|ongoing|en cours)/i

const DATE_TOKEN = new RegExp(
  `(?:${MONTH_PART.source}|${NUM_DATE.source}|${YEAR_ONLY.source}|${PRESENT.source})`,
  'i'
)

export const DATE_RANGE_RE = new RegExp(
  `(${DATE_TOKEN.source})${SEP.source}(${DATE_TOKEN.source})`,
  'i'
)

export const YEAR_RANGE_RE = new RegExp(
  `(${YEAR_ONLY.source})\\s*[-–—]\\s*(${YEAR_ONLY.source}|${PRESENT.source})`,
  'i'
)

// Single standalone year (used in education)
export const STANDALONE_YEAR_RE = /\b((?:19|20)\d{2})\b/

// ── Structural heuristics ────────────────────────────────────────────
// Lines that look like section headers (ALL CAPS, short)
export const ALL_CAPS_RE = /^[A-ZÀÂÄÉÈÊËÎÏÔÙÛÜÇŒÆ\s\-\/&()]{4,50}$/

// Bullet / list markers
export const BULLET_RE = /^[\s]*[•◦▸▪■▷→▶‣⁃–\-*]\s+/

// Lines that are clearly NOT section headers
export const SKIP_LINE_RE = /^(?:https?|www\.|[\w.+]+@|[+\d()\s\-.]+$)/i
