/**
 * Section header keywords in FR / EN / AR.
 * The parser uses these to split raw CV text into labelled sections.
 */

export const SECTION_KEYWORDS = {
  summary: {
    fr: ['profil', 'résumé professionnel', 'résumé', 'présentation', 'objectif professionnel', 'objectif', 'à propos', 'introduction', 'synthèse', 'accroche'],
    en: ['profile', 'professional summary', 'summary', 'objective', 'about me', 'about', 'introduction', 'overview', 'career objective'],
    ar: ['الملف الشخصي', 'ملخص مهني', 'ملخص', 'نبذة عني', 'نبذة', 'مقدمة', 'الهدف المهني'],
  },
  experience: {
    fr: ['expériences professionnelles', 'expérience professionnelle', 'expériences', 'expérience', 'parcours professionnel', 'emplois', 'carrière', 'postes occupés', 'historique professionnel'],
    en: ['professional experience', 'work experience', 'experience', 'employment history', 'employment', 'career history', 'career', 'work history', 'positions held'],
    ar: ['الخبرة المهنية', 'الخبرات المهنية', 'خبرة مهنية', 'الخبرة', 'خبرات', 'المسيرة المهنية', 'الوظائف السابقة'],
  },
  education: {
    fr: ['formation', 'formations', 'éducation', 'diplômes', 'diplôme', 'cursus scolaire', 'cursus académique', 'cursus', 'études', 'parcours académique', 'scolarité'],
    en: ['education', 'educational background', 'qualifications', 'academic background', 'degrees', 'studies', 'training', 'academic qualifications'],
    ar: ['التعليم', 'المؤهلات العلمية', 'المؤهلات', 'الدراسة', 'الشهادات الأكاديمية', 'الدراسات', 'التحصيل العلمي'],
  },
  skills: {
    fr: ['compétences techniques', 'compétences', 'compétence', 'aptitudes', 'savoir-faire', 'expertise', 'technologies', 'outils', 'soft skills', 'hard skills', 'atouts'],
    en: ['technical skills', 'skills', 'core competencies', 'competencies', 'abilities', 'expertise', 'technologies', 'tools', 'key skills'],
    ar: ['المهارات التقنية', 'المهارات', 'الكفاءات', 'الخبرات التقنية', 'المعارف', 'الأدوات'],
  },
  languages: {
    fr: ['langues', 'langue', 'langues parlées', 'compétences linguistiques', 'langues maîtrisées'],
    en: ['languages', 'language skills', 'linguistic skills', 'language proficiency'],
    ar: ['اللغات', 'اللغة', 'المهارات اللغوية', 'إتقان اللغات'],
  },
  certifications: {
    fr: ['certifications', 'certification', 'certificats', 'certificat', 'accréditations', 'formations certifiantes', 'habilitations', 'licences'],
    en: ['certifications', 'certificates', 'professional certifications', 'accreditations', 'licenses', 'credentials'],
    ar: ['الشهادات المهنية', 'الشهادات', 'الاعتمادات', 'الرخص المهنية'],
  },
  projects: {
    fr: ['projets', 'projet', 'réalisations', 'réalisation', 'portfolio', 'travaux'],
    en: ['projects', 'project', 'achievements', 'portfolio', 'notable projects', 'key projects'],
    ar: ['المشاريع', 'مشروع', 'الإنجازات', 'المحفظة'],
  },
  contact: {
    fr: ['contact', 'coordonnées', 'informations personnelles', 'informations de contact', 'infos personnelles'],
    en: ['contact', 'contact information', 'personal information', 'personal details', 'contact details'],
    ar: ['معلومات الاتصال', 'البيانات الشخصية', 'الاتصال'],
  },
}

// Flat keyword → section map for quick lookup
export const KEYWORD_MAP = (() => {
  const map = {}
  for (const [section, langMap] of Object.entries(SECTION_KEYWORDS)) {
    for (const terms of Object.values(langMap)) {
      for (const term of terms) {
        map[term.toLowerCase()] = section
      }
    }
  }
  return map
})()

// All section keywords merged (any language)
export const ALL_SECTION_TERMS = Object.values(SECTION_KEYWORDS)
  .flatMap(langs => Object.values(langs).flat())
  .map(t => t.toLowerCase())

/** "Present / current" synonyms for date ranges */
export const PRESENT_TERMS = [
  'présent', 'present', "aujourd'hui", 'current', 'actuellement', 'maintenant',
  'now', 'ongoing', 'en cours', 'الآن', 'حتى الآن', 'الحاضر',
]
