/**
 * PDF Parser — stub for future AI-powered extraction.
 *
 * Current:  reads raw text from the PDF file object.
 * Future:   send text to AI extraction endpoint → structured CVData.
 *
 * To upgrade to AI extraction, replace extractWithAI() with a real API call.
 */

export async function parsePDF(file) {
  // Stub: returns raw text + empty structured data
  const rawText = await readAsText(file)

  return {
    rawText,
    structured: await extractWithAI(rawText),
  }
}

async function readAsText(file) {
  // In production: use pdfjs-dist to extract text from each page
  // import * as pdfjsLib from 'pdfjs-dist'
  // const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise
  // ...
  return `[PDF text extraction — install pdfjs-dist to enable]\nFilename: ${file.name}`
}

async function extractWithAI(rawText) {
  // Future: POST to /api/ai/extract-cv with rawText
  // const res = await fetch('/api/ai/extract-cv', { method: 'POST', body: JSON.stringify({ text: rawText }) })
  // return res.json()
  return {
    personalInfo: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
  }
}
