/**
 * DOCX Parser — stub for future AI-powered extraction.
 *
 * Current:  reads text via mammoth (install: npm i mammoth).
 * Future:   pipe extracted text to AI extraction endpoint.
 */

export async function parseDOCX(file) {
  const rawText = await readAsText(file)
  return {
    rawText,
    structured: await extractWithAI(rawText),
  }
}

async function readAsText(file) {
  // In production: use mammoth
  // import mammoth from 'mammoth'
  // const arrayBuffer = await file.arrayBuffer()
  // const result = await mammoth.extractRawText({ arrayBuffer })
  // return result.value
  return `[DOCX text extraction — install mammoth to enable]\nFilename: ${file.name}`
}

async function extractWithAI(rawText) {
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
