# CV Import Engine — Architecture

## Pipeline

```
File (PDF | DOCX)
     │
     ▼
┌─────────────────┐
│   Extractors    │  pdfExtractor.js / docxExtractor.js
│  (raw text)     │  → plain text, one \n per line, \n\n between pages
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  sectionFinder  │  parser/sectionFinder.js
│  (split text    │  → detects section headers (Expérience, Education…)
│   into blocks)  │  → returns [{ name, lines[] }]
└────────┬────────┘
         │
         ├──► header block  → contactParser  (name, email, phone, linkedin, title, location)
         ├──► experience    → entryParser    ([{ title, company, dates, bullets }])
         ├──► education     → entryParser    ([{ degree, school, years }])
         ├──► skills        → skillsParser   (string[])
         ├──► languages     → skillsParser   ([{ lang, level }])
         └──► certifications→ skillsParser   (string[])
                  │
                  ▼
         ┌────────────────┐
         │   normalizer   │  normalizer.js
         │  (→ store fmt) │  → maps to the shape expected by CVContext
         └────────────────┘
                  │
                  ▼
          StorePayload dispatched as IMPORT_CV_DATA
```

## Files

| File | Role |
|---|---|
| `index.js` | Public entry point. Orchestrates the full pipeline. |
| `extractors/pdfExtractor.js` | PDF.js wrapper. Reconstructs reading order from raw draw-order items by grouping on Y coordinate then sorting by X within each row. |
| `extractors/docxExtractor.js` | Mammoth.js wrapper. Converts DOCX to plain text preserving paragraph breaks. |
| `constants/patterns.js` | All regex constants (dates, bullets, contact entities, ALL_CAPS headers). |
| `constants/keywords.js` | Section header keyword lists in FR / EN / AR. Compiled into a flat `KEYWORD_MAP` for O(1) lookup. |
| `parser/sectionFinder.js` | Line-by-line scan that detects section headers and splits text into named blocks. |
| `parser/dateParser.js` | Parses a date token ("Jan 2020", "01/2020", "2020") → `"YYYY-MM"`. Extracts ranges from a line. |
| `parser/entryParser.js` | Parses experience (date-anchor strategy) and education (block strategy). |
| `parser/contactParser.js` | Extracts name, email, phone, LinkedIn, website, location from the header block. |
| `parser/skillsParser.js` | Parses skills (comma/pipe/colon formats), languages, certifications. |
| `normalizer.js` | Maps the raw parsed object to the exact shape the store expects. |

## Section Detection

Two-pass strategy:

1. **Keyword match** — exact or starts-with check against `KEYWORD_MAP` (FR/EN/AR keywords).  
   Examples: `"Expérience"`, `"Work Experience"`, `"الخبرة"`.

2. **ALL_CAPS heuristic** — if a short line is fully uppercase AND contains a full known term  
   (word-boundary check), treat it as a header.  
   Examples: `"PROFESSIONAL BACKGROUND"`, `"CAREER HISTORY"`.

## Experience Parsing

Each date-range line acts as an **anchor**. From it the parser:

- Looks **backward** up to 4 lines for title / company / location.
- Handles three common layouts:
  1. Meta lines before the date (`Title\nCompany\nLocation\nJan 2020 – Present`)
  2. Date and title on the **same line** (`Software Engineer | Google  Jan 2020 – Present`)
  3. Date **first**, meta lines below (`Jan 2020 – Present\nSoftware Engineer\nGoogle`)
- Looks **forward** for bullet points, stopping at the next blank line or the next date anchor (no fixed skip offset).

If no date ranges are found at all, falls back to blank-line-delimited block parsing.

## Known Limitations

| Issue | Impact |
|---|---|
| **Two-column PDFs** | PDF.js returns items in draw order. Columns can interleave. Section detection usually recovers, but bullets may be mis-ordered. |
| **Image-based PDFs** | html2canvas → jsPDF output has no text layer. Detected as `NO_TEXT` error. |
| **Graphical CVs** | Skill bars, circular charts, icons: visual information is lost. |
| **Tables in DOCX** | Mammoth flattens table cells; column associations are lost. |
| **Non-standard date formats** | Quarters (`Q1 2020`), seasons, or non-Gregorian calendars are not parsed. |
| **Overlapping section names** | A line like `"Training & Education"` maps to whichever keyword matches first. |

## Adding a New Language

1. Add keywords to all relevant sections in `constants/keywords.js`.
2. Add present-term synonyms to `PRESENT_TERMS` in the same file.
3. Add month abbreviations to `MONTH_MAP` in `parser/dateParser.js`.
4. Extend the `detectLanguage` scoring in `parser/sectionFinder.js`.
