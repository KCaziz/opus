import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { TEMPLATES } from '../data/templates'
import TemplatePreview from '../components/TemplatePreview'

export default function EditorPlaceholder() {
  const { templateId } = useParams()
  const tpl = TEMPLATES.find(t => t.id === templateId)

  if (!tpl) {
    return (
      <div className="container section-gap">
        <p>Modèle introuvable. <Link to="/builder">Retour à la sélection</Link></p>
      </div>
    )
  }

  return (
    <div className="section-gap">
      <div className="container">
        <Link to="/builder" className="btn-editor-back">
          <ChevronLeft size={14} /> Retour aux modèles
        </Link>
        <h1 style={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.03em', marginTop: 16, marginBottom: 4 }}>
          {tpl.label}
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: 32 }}>
          L'éditeur complet arrivera prochainement. Voici l'aperçu de votre modèle sélectionné.
        </p>
        <TemplatePreview component={tpl.component} data={{ firstName: 'Prénom', lastName: 'Nom' }} previewWidth={400} />
      </div>
    </div>
  )
}
