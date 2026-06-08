/**
 * DOCX text extractor using Mammoth.js.
 * Converts DOCX to HTML then strips tags to get clean text,
 * while preserving paragraph structure via newlines.
 */

/**
 * Extract raw text from a DOCX File/Blob.
 * Returns a string with paragraph breaks.
 */
export async function extractDocxText(file) {
  const mammoth = await import('mammoth/mammoth.browser.js')

  const arrayBuffer = await file.arrayBuffer()

  // Extract raw text (preserves paragraph structure with \n)
  const result = await mammoth.extractRawText({ arrayBuffer })

  if (result.messages?.length) {
    // Log warnings but don't fail
    console.debug('[docxExtractor] Mammoth messages:', result.messages.slice(0, 3))
  }

  return result.value || ''
}

/**
 * Extract HTML from DOCX — useful for richer structural analysis.
 * Returns an HTML string.
 */
export async function extractDocxHtml(file) {
  const mammoth = await import('mammoth/mammoth.browser.js')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml({ arrayBuffer })
  return result.value || ''
}
