import ATSStandard      from '../templates/ATSStandard'
import ATSModerne       from '../templates/ATSModerne'
import SimpleElegant    from '../templates/SimpleElegant'
import Corporate        from '../templates/Corporate'
import ModerneColore    from '../templates/ModerneColore'
import AvecPhoto        from '../templates/AvecPhoto'
import Executive        from '../templates/Executive'
import Developer        from '../templates/Developer'
import Freelance        from '../templates/Freelance'
import PhotoSidebar     from '../templates/PhotoSidebar'
import MinimalistePhoto from '../templates/MinimalistePhoto'
import CreatifPhoto     from '../templates/CreatifPhoto'
import NordicPhoto      from '../templates/NordicPhoto'

export const CATEGORIES = [
  { id: 'all',           label: 'Tous les modèles' },
  { id: 'ats',           label: 'ATS' },
  { id: 'simple',        label: 'Simple' },
  { id: 'moderne',       label: 'Moderne' },
  { id: 'une-colonne',   label: 'Une colonne' },
  { id: 'avec-photo',    label: 'Avec photo' },
  { id: 'professionnel', label: 'Professionnel' },
  { id: 'creatif',       label: 'Créatif' },
]

/** Universal accent color palette shown on every template card */
export const ACCENT_COLORS = [
  { id: 'blue',   hex: '#2563EB', labelKey: 'colors.blue'   },
  { id: 'green',  hex: '#059669', labelKey: 'colors.green'  },
  { id: 'red',    hex: '#DC2626', labelKey: 'colors.red'    },
  { id: 'purple', hex: '#7C3AED', labelKey: 'colors.purple' },
  { id: 'gray',   hex: '#6B7280', labelKey: 'colors.gray'   },
  { id: 'black',  hex: '#111827', labelKey: 'colors.black'  },
  { id: 'teal',   hex: '#0D9488', labelKey: 'colors.teal'   },
  { id: 'orange', hex: '#B8963E', labelKey: 'colors.orange' },
]

export const TEMPLATES = [
  {
    id: 'ats-standard',
    label: 'ATS Standard',
    descriptionKey: 'Format texte pur, optimisé pour les logiciels de tri automatique.',
    categories: ['ats', 'une-colonne', 'simple'],
    component: ATSStandard,
    defaultColor: '#111827',
    popular: false,
  },
  {
    id: 'ats-moderne',
    label: 'ATS Moderne',
    descriptionKey: 'ATS-friendly avec une légère touche de couleur bleue.',
    categories: ['ats', 'une-colonne'],
    component: ATSModerne,
    defaultColor: '#2563EB',
    popular: true,
  },
  {
    id: 'simple-elegant',
    label: 'Simple Élégant',
    descriptionKey: 'Deux colonnes, typographie serif, sobre et raffiné.',
    categories: ['simple', 'professionnel'],
    component: SimpleElegant,
    defaultColor: '#555555',
    popular: true,
  },
  {
    id: 'corporate',
    label: 'Corporate',
    descriptionKey: 'En-tête sombre, lignes dorées, look corporate premium.',
    categories: ['professionnel'],
    component: Corporate,
    defaultColor: '#C8A96A',
    popular: false,
  },
  {
    id: 'moderne-colore',
    label: 'Moderne Coloré',
    descriptionKey: 'Sidebar sombre, barres de compétences, design tech moderne.',
    categories: ['moderne'],
    component: ModerneColore,
    defaultColor: '#38BDF8',
    popular: true,
  },
  {
    id: 'avec-photo',
    label: 'Avec Photo',
    descriptionKey: 'En-tête avec photo de profil, tons chauds et élégants.',
    categories: ['avec-photo', 'professionnel'],
    component: AvecPhoto,
    defaultColor: '#8B6F4E',
    popular: false,
  },
  {
    id: 'executive',
    label: 'Executive',
    descriptionKey: 'Style directorial, typographie classique centrée, touches dorées.',
    categories: ['professionnel'],
    component: Executive,
    defaultColor: '#B8963E',
    popular: false,
  },
  {
    id: 'developer',
    label: 'Développeur',
    descriptionKey: 'Thème sombre style GitHub, idéal pour les profils tech.',
    categories: ['moderne'],
    component: Developer,
    defaultColor: '#3FB950',
    popular: true,
  },
  {
    id: 'freelance',
    label: 'Freelance',
    descriptionKey: 'Dynamique et coloré, parfait pour les indépendants créatifs.',
    categories: ['moderne', 'simple'],
    component: Freelance,
    defaultColor: '#0D9488',
    popular: false,
  },
  {
    id: 'photo-sidebar',
    label: 'Photo Sidebar',
    descriptionKey: 'Sidebar colorée avec photo de profil pleine hauteur, élégant et professionnel.',
    categories: ['avec-photo', 'professionnel'],
    component: PhotoSidebar,
    defaultColor: '#1E3A5F',
    popular: true,
  },
  {
    id: 'minimaliste-photo',
    label: 'Minimaliste Photo',
    descriptionKey: 'En-tête épuré avec photo circulaire, deux colonnes structurées.',
    categories: ['avec-photo', 'simple'],
    component: MinimalistePhoto,
    defaultColor: '#2D6A4F',
    popular: false,
  },
  {
    id: 'creatif-photo',
    label: 'Créatif Photo',
    descriptionKey: 'En-tête sombre et audacieux avec photo, idéal pour les profils créatifs.',
    categories: ['avec-photo', 'creatif', 'moderne'],
    component: CreatifPhoto,
    defaultColor: '#E63946',
    popular: true,
  },
  {
    id: 'nordic-photo',
    label: 'Nordic Photo',
    descriptionKey: 'Style scandinave épuré, photo circulaire, mise en page deux colonnes.',
    categories: ['avec-photo', 'simple', 'professionnel'],
    component: NordicPhoto,
    defaultColor: '#457B9D',
    popular: false,
  },
]
