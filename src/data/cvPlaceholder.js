const PLACEHOLDER_FR = {
  title: 'Ingénieur Logiciel Senior',
  email: 'email@exemple.com',
  phone: '+33 6 12 34 56 78',
  location: 'Paris, France',
  linkedin: 'linkedin.com/in/profil',
  website: 'github.com/profil',
  summary:
    "Ingénieur logiciel passionné avec 8 ans d'expérience en développement full-stack. Spécialisé dans les architectures cloud et les systèmes distribués. Reconnu pour livrer des solutions robustes, scalables et maintenables.",
  experience: [
    {
      title: 'Ingénieur Logiciel Senior',
      company: 'TechCorp France',
      location: 'Paris',
      period: 'Janv. 2020 — Présent',
      bullets: [
        "Conception et développement d'APIs RESTful haute performance (Node.js, TypeScript)",
        "Encadrement d'une équipe de 5 développeurs juniors et revues de code",
        'Réduction des temps de chargement de 40 % par optimisation des requêtes SQL',
        "Migration de l'infrastructure vers AWS (EC2, RDS, S3, Lambda)",
      ],
    },
    {
      title: 'Développeur Full Stack',
      company: 'StartupXYZ',
      location: 'Lyon',
      period: 'Mars 2017 — Déc. 2019',
      bullets: [
        "Développement de l'application web principale React / Node.js",
        "Mise en place d'une pipeline CI/CD avec GitHub Actions et Docker",
        'Intégration de passerelles de paiement (Stripe, PayPal)',
      ],
    },
    {
      title: 'Développeur Front-End',
      company: 'Agence Digitale',
      location: 'Marseille',
      period: 'Juin 2015 — Févr. 2017',
      bullets: [
        'Création de sites web responsive pour 20+ clients (HTML, CSS, JavaScript)',
        "Intégration de maquettes Figma avec une fidélité pixel-perfect",
      ],
    },
  ],
  education: [
    { degree: 'Master Informatique — Génie Logiciel', school: 'Université Paris-Saclay', year: '2015', detail: 'Mention Très Bien' },
    { degree: 'Licence Informatique', school: 'Université Aix-Marseille', year: '2013', detail: '' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Git', 'GraphQL'],
  languages: [
    { lang: 'Français', level: 'Natif' },
    { lang: 'Anglais', level: 'Courant (C1)' },
    { lang: 'Arabe', level: 'Bilingue' },
  ],
  certifications: [
    'AWS Certified Solutions Architect — 2022',
    'Google Cloud Professional Developer — 2021',
  ],
}

const PLACEHOLDER_EN = {
  title: 'Senior Software Engineer',
  email: 'email@example.com',
  phone: '+1 555 234 5678',
  location: 'New York, USA',
  linkedin: 'linkedin.com/in/profile',
  website: 'github.com/profile',
  summary:
    "Passionate software engineer with 8 years of full-stack experience. Specialized in cloud architecture and distributed systems. Recognized for delivering robust, scalable, and maintainable solutions.",
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'New York',
      period: 'Jan. 2020 — Present',
      bullets: [
        "Designed and built high-performance RESTful APIs (Node.js, TypeScript)",
        "Mentored a team of 5 junior developers and led code reviews",
        "Reduced page load times by 40% through SQL query optimization",
        "Migrated infrastructure to AWS (EC2, RDS, S3, Lambda)",
      ],
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'San Francisco',
      period: 'Mar. 2017 — Dec. 2019',
      bullets: [
        "Built the main web application using React / Node.js",
        "Set up CI/CD pipeline with GitHub Actions and Docker",
        "Integrated payment gateways (Stripe, PayPal)",
      ],
    },
    {
      title: 'Front-End Developer',
      company: 'Digital Agency',
      location: 'Boston',
      period: 'Jun. 2015 — Feb. 2017',
      bullets: [
        "Created responsive websites for 20+ clients (HTML, CSS, JavaScript)",
        "Implemented Figma designs with pixel-perfect fidelity",
      ],
    },
  ],
  education: [
    { degree: 'M.Sc. Computer Science — Software Engineering', school: 'MIT', year: '2015', detail: 'With Honors' },
    { degree: 'B.Sc. Computer Science', school: 'Boston University', year: '2013', detail: '' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Git', 'GraphQL'],
  languages: [
    { lang: 'English', level: 'Native' },
    { lang: 'French', level: 'Fluent (C1)' },
    { lang: 'Arabic', level: 'Bilingual' },
  ],
  certifications: [
    'AWS Certified Solutions Architect — 2022',
    'Google Cloud Professional Developer — 2021',
  ],
}

const PLACEHOLDER_AR = {
  title: 'مهندس برمجيات أول',
  email: 'email@example.com',
  phone: '+966 50 123 4567',
  location: 'الرياض، السعودية',
  linkedin: 'linkedin.com/in/profile',
  website: 'github.com/profile',
  summary:
    "مهندس برمجيات متحمس مع 8 سنوات من الخبرة في تطوير التطبيقات المتكاملة. متخصص في هندسة السحابة والأنظمة الموزعة. معروف بتقديم حلول قوية وقابلة للتوسع.",
  experience: [
    {
      title: 'مهندس برمجيات أول',
      company: 'شركة تك كورب',
      location: 'الرياض',
      period: 'يناير 2020 — حتى الآن',
      bullets: [
        "تصميم وبناء واجهات برمجة عالية الأداء (Node.js, TypeScript)",
        "قيادة فريق مكون من 5 مطورين وإجراء مراجعات الكود",
        "تحسين أوقات التحميل بنسبة 40% عبر تحسين استعلامات قاعدة البيانات",
        "نقل البنية التحتية إلى AWS (EC2, RDS, S3, Lambda)",
      ],
    },
    {
      title: 'مطور تطبيقات متكاملة',
      company: 'شركة ستارت أب',
      location: 'جدة',
      period: 'مارس 2017 — ديسمبر 2019',
      bullets: [
        "بناء التطبيق الرئيسي باستخدام React / Node.js",
        "إعداد خط CI/CD باستخدام GitHub Actions و Docker",
        "دمج بوابات الدفع الإلكتروني (Stripe, PayPal)",
      ],
    },
    {
      title: 'مطور واجهة أمامية',
      company: 'وكالة رقمية',
      location: 'الدمام',
      period: 'يونيو 2015 — فبراير 2017',
      bullets: [
        "إنشاء مواقع متجاوبة لأكثر من 20 عميل (HTML, CSS, JavaScript)",
        "تطبيق تصاميم Figma بدقة متناهية",
      ],
    },
  ],
  education: [
    { degree: 'ماجستير علوم الحاسب — هندسة البرمجيات', school: 'جامعة الملك عبدالله للعلوم', year: '2015', detail: 'امتياز' },
    { degree: 'بكالوريوس علوم الحاسب', school: 'جامعة الملك سعود', year: '2013', detail: '' },
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Git', 'GraphQL'],
  languages: [
    { lang: 'العربية', level: 'لغة أم' },
    { lang: 'الإنجليزية', level: 'متقدم (C1)' },
    { lang: 'الفرنسية', level: 'متوسط (B2)' },
  ],
  certifications: [
    'AWS Certified Solutions Architect — 2022',
    'Google Cloud Professional Developer — 2021',
  ],
}

export const PLACEHOLDER = PLACEHOLDER_FR

export function getPlaceholder(lang = 'fr') {
  if (lang?.startsWith('en')) return PLACEHOLDER_EN
  if (lang?.startsWith('ar')) return PLACEHOLDER_AR
  return PLACEHOLDER_FR
}
