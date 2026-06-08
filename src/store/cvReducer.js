export const ACTIONS = {
  SET_TEMPLATE:         'SET_TEMPLATE',
  SET_ACCENT_COLOR:     'SET_ACCENT_COLOR',
  SET_STEP:             'SET_STEP',
  UPDATE_PERSONAL_INFO: 'UPDATE_PERSONAL_INFO',
  SET_SUMMARY:          'SET_SUMMARY',
  ADD_EXPERIENCE:       'ADD_EXPERIENCE',
  UPDATE_EXPERIENCE:    'UPDATE_EXPERIENCE',
  REMOVE_EXPERIENCE:    'REMOVE_EXPERIENCE',
  REORDER_EXPERIENCE:   'REORDER_EXPERIENCE',
  ADD_EDUCATION:        'ADD_EDUCATION',
  UPDATE_EDUCATION:     'UPDATE_EDUCATION',
  REMOVE_EDUCATION:     'REMOVE_EDUCATION',
  SET_SKILLS:           'SET_SKILLS',
  ADD_LANGUAGE:         'ADD_LANGUAGE',
  UPDATE_LANGUAGE:      'UPDATE_LANGUAGE',
  REMOVE_LANGUAGE:      'REMOVE_LANGUAGE',
  SET_CERTIFICATIONS:   'SET_CERTIFICATIONS',
  // Future actions (architecture ready)
  ADD_PROJECT:          'ADD_PROJECT',
  ADD_REFERENCE:        'ADD_REFERENCE',
  ADD_INTEREST:         'ADD_INTEREST',
  ADD_ACHIEVEMENT:      'ADD_ACHIEVEMENT',
  IMPORT_CV_DATA:       'IMPORT_CV_DATA',
  RESET:                'RESET',
}

export const initialState = {
  templateId:   null,
  accentColor:  null,
  currentStep:  0,
  personalInfo: {
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    address:   '',
    city:      '',
    country:   '',
    title:     '',
    linkedin:  '',
    website:   '',
    photo:     null,
  },
  summary:        '',
  experience:     [],
  education:      [],
  skills:         [],
  languages:      [],
  certifications: [],
  // Future sections
  projects:     [],
  references:   [],
  interests:    [],
  achievements: [],
}

export function cvReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TEMPLATE:
      return { ...state, templateId: action.payload }

    case ACTIONS.SET_ACCENT_COLOR:
      return { ...state, accentColor: action.payload }

    case ACTIONS.SET_STEP:
      return { ...state, currentStep: action.payload }

    case ACTIONS.UPDATE_PERSONAL_INFO:
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      }

    case ACTIONS.SET_SUMMARY:
      return { ...state, summary: action.payload }

    case ACTIONS.ADD_EXPERIENCE:
      return { ...state, experience: [...state.experience, action.payload] }

    case ACTIONS.UPDATE_EXPERIENCE:
      return {
        ...state,
        experience: state.experience.map((e, i) =>
          i === action.payload.index ? { ...e, ...action.payload.data } : e
        ),
      }

    case ACTIONS.REMOVE_EXPERIENCE:
      return {
        ...state,
        experience: state.experience.filter((_, i) => i !== action.payload),
      }

    case ACTIONS.REORDER_EXPERIENCE: {
      const list = [...state.experience]
      const [moved] = list.splice(action.payload.from, 1)
      list.splice(action.payload.to, 0, moved)
      return { ...state, experience: list }
    }

    case ACTIONS.ADD_EDUCATION:
      return { ...state, education: [...state.education, action.payload] }

    case ACTIONS.UPDATE_EDUCATION:
      return {
        ...state,
        education: state.education.map((e, i) =>
          i === action.payload.index ? { ...e, ...action.payload.data } : e
        ),
      }

    case ACTIONS.REMOVE_EDUCATION:
      return {
        ...state,
        education: state.education.filter((_, i) => i !== action.payload),
      }

    case ACTIONS.SET_SKILLS:
      return { ...state, skills: action.payload }

    case ACTIONS.ADD_LANGUAGE:
      return { ...state, languages: [...state.languages, action.payload] }

    case ACTIONS.UPDATE_LANGUAGE:
      return {
        ...state,
        languages: state.languages.map((l, i) =>
          i === action.payload.index ? { ...l, ...action.payload.data } : l
        ),
      }

    case ACTIONS.REMOVE_LANGUAGE:
      return {
        ...state,
        languages: state.languages.filter((_, i) => i !== action.payload),
      }

    case ACTIONS.SET_CERTIFICATIONS:
      return { ...state, certifications: action.payload }

    case ACTIONS.IMPORT_CV_DATA:
      return { ...state, ...action.payload }

    case ACTIONS.RESET:
      return { ...initialState }

    default:
      return state
  }
}
