/**
 * PDF text extractor using PDF.js (pdfjs-dist).
 *
 * PDF.js returns text items in draw order (not reading order).
 * We reconstruct reading order by:
 *   1. Sorting items by Y descending (PDF origin is bottom-left, so high Y = top of page)
 *   2. Grouping items within Y_TOLERANCE units into the same visual row
 *   3. Sorting each row by X ascending (left to right)
 */

let pdfjsLib = null

async function getPdfJs() {
  if (pdfjsLib) return pdfjsLib
  const lib = await import('pdfjs-dist')
  const workerUrl = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).href
  lib.GlobalWorkerOptions.workerSrc = workerUrl
  pdfjsLib = lib
  return lib
}

export async function extractPdfText(file) {
  const pdfjs = await getPdfJs()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

  const pageTexts = []
  for (let p = 1; p <= pdf.numPages; p++) {
    const page    = await pdf.getPage(p)
    const content = await page.getTextContent()
    pageTexts.push(pageItemsToText(content.items))
  }

  return pageTexts.join('\n\n').replace(/ {2,}/g, ' ').trim()
}

/**
 * Convert one page's text items to an ordered string.
 * Items within Y_TOLERANCE pts of each other are treated as the same row.
 */
function pageItemsToText(items) {
  const positioned = items
    .filter(it => it.str?.trim())
    .map(it => ({
      str: it.str,
      x:   it.transform[4],
      y:   it.transform[5],
    }))

  if (!positioned.length) return ''

  // Sort top-to-bottom (high Y first), then left-to-right within same Y
  positioned.sort((a, b) => b.y - a.y || a.x - b.x)

  // Group into rows by Y proximity
  const Y_TOLERANCE = 3
  const rows = []
  let row = [positioned[0]]

  for (let i = 1; i < positioned.length; i++) {
    if (Math.abs(positioned[i].y - row[0].y) <= Y_TOLERANCE) {
      row.push(positioned[i])
    } else {
      rows.push(row)
      row = [positioned[i]]
    }
  }
  rows.push(row)

  return rows
    .map(r => r.sort((a, b) => a.x - b.x).map(i => i.str).join(' ').trim())
    .filter(Boolean)
    .join('\n')
}
