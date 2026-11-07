import { TEMPLATES } from '../data/templates'

/**
 * Conseils concrets pour améliorer le CV, calculés à partir de son contenu.
 * Chaque conseil pointe vers l'étape de l'éditeur où le corriger.
 *
 * Index des étapes (voir Editor.jsx) :
 * 0 Coordonnées · 1 Résumé · 2 Expérience · 3 Formation · 4 Compétences · 5 Modèle · 6 Télécharger
 */
export const STEP = { personalInfo: 0, summary: 1, experience: 2, education: 3, skills: 4, template: 5 }

const filled = v => typeof v === 'string' ? v.trim().length > 0 : !!v

export function getCVAdvice(state) {
  const out = []
  const add = (step, key, params = {}) => out.push({ step, key, params })
  const info = state.personalInfo

  // Coordonnées
  if (!filled(info.title))   add(STEP.personalInfo, 'title')
  if (!filled(info.phone))   add(STEP.personalInfo, 'phone')
  if (!filled(info.email))   add(STEP.personalInfo, 'email')
  if (!filled(info.city))    add(STEP.personalInfo, 'city')

  // Résumé
  const len = state.summary?.trim().length || 0
  if (len === 0)      add(STEP.summary, 'summaryEmpty')
  else if (len < 100) add(STEP.summary, 'summaryShort', { count: len })

  // Expérience
  if (state.experience.length === 0) {
    add(STEP.experience, 'experienceEmpty')
  } else {
    state.experience.forEach(e => {
      const name = e.title || e.company || '—'
      if (!(e.bullets || []).some(filled))        add(STEP.experience, 'experienceNoBullets', { name })
      if (!filled(e.startDate))                   add(STEP.experience, 'experienceNoDates', { name })
    })
    if (state.experience.length === 1) add(STEP.experience, 'experienceOne')
  }

  // Formation
  if (state.education.length === 0) add(STEP.education, 'educationEmpty')
  else state.education.forEach(e => {
    if (!filled(e.endYear) && !filled(e.startYear)) add(STEP.education, 'educationNoYears', { name: e.degree || e.school || '—' })
  })

  // Compétences et langues
  if (state.skills.length < 3) add(STEP.skills, 'skillsFew', { count: state.skills.length })
  if (state.languages.length === 0) add(STEP.skills, 'languagesEmpty')

  // Modèle
  const tpl = TEMPLATES.find(t => t.id === state.templateId)
  if (tpl?.categories.includes('avec-photo') && !info.photo) add(STEP.template, 'photoMissing', { name: tpl.label })

  return out
}
