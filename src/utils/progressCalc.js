/**
 * Calculates CV completion percentage per section and globally.
 * Weights reflect the importance of each section for a complete CV.
 */

const SECTIONS = [
  {
    id: 'personalInfo',
    weight: 30,
    requiredFields: ['firstName', 'lastName', 'email'],
    allFields: ['firstName', 'lastName', 'email', 'phone', 'title'],
    calc(state) {
      const info = state.personalInfo
      const filled = this.allFields.filter(f => info[f]?.trim?.()).length
      return Math.round((filled / this.allFields.length) * 100)
    },
  },
  {
    id: 'summary',
    weight: 15,
    calc(state) {
      const len = state.summary?.trim?.().length || 0
      if (len === 0) return 0
      if (len >= 100) return 100
      return Math.round((len / 100) * 100)
    },
  },
  {
    id: 'experience',
    weight: 30,
    calc(state) {
      const exp = state.experience
      if (exp.length === 0) return 0
      if (exp.length >= 2) return 100
      const e = exp[0]
      const fields = [e.title, e.company, e.period || (e.startDate && e.endDate)]
      const filled = fields.filter(Boolean).length
      return Math.round((filled / fields.length) * 75)
    },
  },
  {
    id: 'education',
    weight: 15,
    calc(state) {
      return state.education.length > 0 ? 100 : 0
    },
  },
  {
    id: 'skills',
    weight: 10,
    calc(state) {
      const skillPct = Math.min(state.skills.length / 3, 1) * 100
      return Math.round(skillPct)
    },
  },
]

export function calculateProgress(cvState) {
  let totalWeight  = 0
  let weightedSum  = 0
  const sections   = {}

  for (const section of SECTIONS) {
    const pct = section.calc(cvState)
    sections[section.id] = pct
    weightedSum  += (pct * section.weight) / 100
    totalWeight  += section.weight
  }

  const global = Math.round((weightedSum / totalWeight) * 100)
  return { global, sections }
}

export { SECTIONS }
