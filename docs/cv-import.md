# CV Import Engine — Documentation

> Last updated: 2026-06  
> Author: generated at project setup  

---

## Table of contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Workflow complet](#workflow-complet)
4. [Bibliothèques utilisées](#bibliothèques-utilisées)
5. [Extraction PDF](#extraction-pdf)
6. [Extraction DOCX](#extraction-docx)
7. [Analyse et parsing](#analyse-et-parsing)
8. [Normalisation des données](#normalisation-des-données)
9. [Points d'entrée UI](#points-dentrée-ui)
10. [Limites connues](#limites-connues)
11. [Pistes d'amélioration futures](#pistes-damélioration-futures)

---

## Overview

Le moteur d'import de CV est un pipeline **entièrement client-side** qui transforme un fichier PDF ou DOCX en un objet de données structuré, compatible avec le store Redux de l'application.

**Aucune donnée n'est envoyée à un serveur.** Tout le traitement se fait dans le navigateur.

### Objectif

```
PDF ou DOCX
    ↓
Extraction du texte brut
    ↓
Détection de la langue (FR / EN / AR)
    ↓
Découpage en sections (expérience, formation, compétences…)
    ↓
Extraction des entités par section
    ↓
Normalisation vers CVData
    ↓
Dispatch IMPORT_CV_DATA → store Redux
```

---

## Architecture

```
src/services/
  documentParser.js               ← API publique (wrapper)
  cvImport/
    index.js                      ← Point d'entrée : importCV(file)
    extractors/
      pdfExtractor.js             ← Extraction PDF via PDF.js
      docxExtractor.js            ← Extraction DOCX via Mammoth
    parser/
      dateParser.js               ← Normalisation des dates
      contactParser.js            ← Email, téléphone, LinkedIn, nom
      sectionFinder.js            ← Détection et découpage des sections
      entryParser.js              ← Parsing expériences + formations
      skillsParser.js             ← Compétences, langues, certifications
    constants/
      keywords.js                 ← Mots-clés des en-têtes de sections (FR/EN/AR)
      patterns.js                 ← Regex patterns réutilisables
    normalizer.js                 ← Conversion vers le format du store
```

### Séparation des responsabilités

| Module | Responsabilité |
|--------|---------------|
| `extractors/` | Lire le fichier binaire et produire du texte brut |
| `parser/` | Comprendre la structure du texte et extraire les entités |
| `constants/` | Données de référence (mots-clés, regex) |
| `normalizer.js` | Assurer la conformité avec le schéma du store |
| `index.js` | Orchestrer le pipeline et gérer les erreurs |

---

## Workflow complet

### 1. Validation du fichier

```js
validateFile(file)
```

Vérifie :
- Type MIME supporté (`application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- Extension supportée (`.pdf`, `.docx`)
- Taille ≤ 10 Mo

### 2. Extraction du texte

Selon le type de fichier :
- `.pdf` → `extractPdfText(file)` (PDF.js)
- `.docx` → `extractDocxText(file)` (Mammoth)

Résultat : une chaîne de caractères avec des sauts de ligne préservant la structure du document.

### 3. Détection de la langue

```js
const lang = detectLanguage(rawText)
// 'fr' | 'en' | 'ar'
```

Compte les occurrences de mots-clés caractéristiques de chaque langue dans le texte.

### 4. Découpage en sections

```js
const sections = splitIntoSections(rawText)
```

Parcourt le texte ligne par ligne. Une ligne est considérée comme un **en-tête de section** si :
1. Elle correspond exactement (ou partiellement) à un mot-clé connu (`KEYWORD_MAP`)
2. Elle est entièrement en majuscules et fait moins de 50 caractères (`ALL_CAPS_RE`)

Le résultat est un tableau `[{ name: 'experience' | 'education' | ..., lines: string[] }]`.  
La section `header` correspond aux lignes avant le premier en-tête reconnu.

### 5. Extraction des entités

#### Informations de contact

Depuis le texte complet + section header :

| Entité | Méthode |
|--------|---------|
| Email | Regex `EMAIL_RE` sur le texte complet |
| Téléphone | Regex `PHONE_RE` avec filtre anti-code postal |
| LinkedIn | Regex `LINKEDIN_RE` sur le texte complet |
| Site web | Regex `WEBSITE_RE` + fallback `PLAIN_URL_RE` |
| Nom | Première ligne non-email/non-téléphone de la section header |
| Titre | Ligne après le nom, avant les coordonnées |
| Localisation | Pattern "Ville, Pays" ou "CP Ville" |

#### Expériences professionnelles

Algorithme :
1. Chercher les **plages de dates** dans le texte de la section (ancres)
2. Remonter depuis chaque date pour extraire le titre/l'entreprise
3. Descendre depuis chaque date pour extraire les bullet points
4. Séparer titre et entreprise par les marqueurs ` — `, ` | `, ` @ `, ` at `, ` chez `

#### Formations

Regroupement par blocs (séparés par lignes vides), puis :
- Extraction de la plage d'années (`YEAR_RANGE_RE`)
- Première ligne non-date = diplôme
- Deuxième ligne = établissement
- Ligne contenant "mention/grade/honours" = mention

#### Compétences

Détection des séparateurs : virgule, slash ` / `, pipe ` | `, ou une compétence par ligne.

#### Langues

Patterns reconnus :
- `Français (Natif)`
- `English — Fluent (C1)`
- `Français : Courant`
- `Arabe Bilingue`

#### Certifications

Une ligne non vide = une certification.

### 6. Normalisation

```js
return normalizeToStore(raw)
```

- Capitalise les noms propres
- Normalise les dates au format `YYYY-MM` (requis par le store)
- Nettoie les URLs LinkedIn (supprime `https://www.`)
- Déduplique les compétences
- Filtre les entrées vides

---

## Bibliothèques utilisées

### PDF.js (`pdfjs-dist` v6)

- **Usage** : extraction du texte des fichiers PDF
- **Avantage** : bibliothèque officielle Mozilla, très robuste
- **Configuration Vite** : le worker est résolu via `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href`
- **Limite** : les PDFs composés uniquement d'images (scans) ne produisent pas de texte extractible

### Mammoth.js (`mammoth` v1)

- **Usage** : extraction du texte des fichiers DOCX
- **Avantage** : supporte le format Word nativement, produit un texte bien structuré
- **Import** : `mammoth/mammoth.browser.js` pour éviter les dépendances Node.js
- **Limite** : les fichiers `.doc` (ancien format) ont un support limité

---

## Extraction PDF

```js
// pdfExtractor.js
const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
for (let i = 1; i <= pdf.numPages; i++) {
  const page    = await pdf.getPage(i)
  const content = await page.getTextContent()
  // Reconstitution du texte avec préservation des sauts de ligne
  // basée sur les changements de coordonnée Y
}
```

La position verticale (`transform[5]`) de chaque item de texte est utilisée pour détecter les changements de ligne : si `|lastY - currentY| > 5`, on insère un saut de ligne.

---

## Extraction DOCX

```js
// docxExtractor.js
const result = await mammoth.extractRawText({ arrayBuffer })
return result.value
```

`extractRawText` produit du texte brut avec des sauts de ligne pour chaque paragraphe. C'est plus fiable que `convertToHtml` pour le parsing textuel car il n'y a pas de bruit HTML à gérer.

---

## Normalisation des données

Le schéma cible correspond exactement au store Redux :

```typescript
interface StorePayload {
  personalInfo: {
    firstName: string
    lastName:  string
    email:     string
    phone:     string
    address:   string
    city:      string
    country:   string
    title:     string
    linkedin:  string    // sans https://www.
    website:   string
    photo:     null      // jamais extrait d'un PDF/DOCX
  }
  summary:        string
  experience:     ExperienceEntry[]
  education:      EducationEntry[]
  skills:         string[]
  languages:      { lang: string; level: string }[]
  certifications: string[]
}

interface ExperienceEntry {
  title:     string
  company:   string
  location:  string
  startDate: string    // "YYYY-MM" ou ""
  endDate:   string    // "YYYY-MM" ou ""
  isCurrent: boolean
  bullets:   string[]
}

interface EducationEntry {
  degree:    string
  school:    string
  location:  string
  startYear: string    // "YYYY" ou ""
  endYear:   string    // "YYYY" ou ""
  grade:     string
}
```

---

## Points d'entrée UI

### 1. `/improve` — "Améliorer mon CV"

**Fichier** : `src/pages/Improve.jsx`

Flow :
1. Utilisateur uploade son CV (drag-and-drop ou file picker)
2. Animation visuelle en 4 étapes pendant l'analyse
3. Affichage d'un résumé des données extraites (nb d'expériences, formations, compétences…)
4. Bouton "Choisir un modèle" → navigue vers `/builder`
5. Dans Builder : l'utilisateur choisit un template → navigue vers `/onboarding/:templateId`
6. Dans Onboarding : `hasImportedData` est vrai → le bouton "Continuer" **ne RESET pas** le store

### 2. `/onboarding/:templateId` — "Créer depuis un CV existant"

**Fichier** : `src/pages/Onboarding.jsx`

L'option "Import" dans l'onboarding utilise le même pipeline.  
Si `parseDocument` réussit, `IMPORT_CV_DATA` est dispatché et l'utilisateur est redirigé vers `/editor`.

---

## Limites connues

| Limite | Détail |
|--------|--------|
| **PDFs scannés** | Les PDFs qui sont des images (scans sans OCR) ne contiennent pas de texte. L'extraction retourne une chaîne vide. |
| **Mises en page complexes** | Les CV multi-colonnes peuvent avoir leur texte extrait dans un ordre non-linéaire par PDF.js (lecture colonne par colonne peut mélanger les sections). |
| **Tableaux** | Les CV utilisant des tableaux (fréquent dans Word) peuvent produire un texte mal ordonné avec Mammoth. |
| **Images inline** | Les photos de profil dans le CV ne sont pas extraites. `photo` est toujours `null` après import. |
| **Précision du nom** | L'extraction du prénom/nom se base sur les premières lignes. Si le CV commence par une tagline ou un titre, le nom peut ne pas être correctement identifié. |
| **Langues mixtes** | Un CV écrit à moitié en français et à moitié en anglais peut tromper la détection de langue et manquer certaines sections. |
| **Formats `.doc`** | L'ancien format Word binaire (`.doc`) est peu fiable avec Mammoth. Préférer `.docx`. |

---

## Pistes d'amélioration futures

### Court terme

- **OCR** : intégrer Tesseract.js pour traiter les PDFs scannés
- **Amélioration du parsing multi-colonnes** : utiliser les coordonnées X de PDF.js pour reconstruire l'ordre de lecture correct
- **Confiance par champ** : retourner un score de confiance pour chaque champ extrait (utile pour l'UI)

### Moyen terme

- **Post-processing IA** : appeler un LLM (Claude API) via `mapToStoreFormat` pour corriger et enrichir les données extraites
  ```js
  // documentParser.js — future version
  export async function mapToStoreFormat(rawParsed) {
    const aiEnhanced = await callClaudeAPI(rawParsed)
    return aiEnhanced
  }
  ```
- **Support LinkedIn URL** : extraire le profil LinkedIn depuis une URL pour pré-remplir plus de données
- **Projets** : le parser identifie une section `projects` mais le store ne l'affiche pas encore dans l'éditeur

### Long terme

- **Analyse ATS** : comparer le CV importé avec une offre d'emploi (job description parsing)
- **Score de CV** : évaluer la complétude, la clarté, la pertinence des mots-clés
- **Import depuis LinkedIn** : via l'export PDF de LinkedIn (format très standardisé, facile à parser)
- **Versioning** : permettre de garder plusieurs versions du CV importé

---

## Ajouter un nouveau format

Pour supporter un nouveau format (ex : `.odt`, `.txt`) :

1. Créer `src/services/cvImport/extractors/odtExtractor.js`
2. Implémenter `extractOdtText(file) → Promise<string>`
3. Ajouter la branche dans `index.js` :
   ```js
   if (ext.endsWith('.odt')) return extractOdtText(file)
   ```
4. Mettre à jour `validateFile` pour accepter le nouveau MIME type

---

## Ajouter une nouvelle section parsée

Pour reconnaître une nouvelle section (ex : "Références") :

1. Dans `constants/keywords.js`, ajouter la clé `references` dans `SECTION_KEYWORDS`
2. Créer la fonction `parseReferences(text)` dans `parser/skillsParser.js` ou un nouveau fichier
3. Appeler la fonction dans `index.js` après le step 9
4. Mettre à jour `normalizer.js` pour inclure le champ dans le payload
5. Vérifier que le reducer handle le nouveau champ (`IMPORT_CV_DATA` spread tout, donc ça fonctionne automatiquement si le champ existe dans `initialState`)
