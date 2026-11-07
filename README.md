# OPUS

Créateur de CV guidé, en français, pour le marché de l'emploi algérien.
Application web React + Vite.

## Prérequis

- [Node.js](https://nodejs.org/) **18 ou plus** (version LTS recommandée)
- npm (installé avec Node.js)

Pour vérifier :

```bash
node -v
npm -v
```

## Lancer le projet en local

```bash
# 1. Récupérer le projet
git clone <url-du-dépôt> opus
cd opus

# 2. Installer les dépendances (une seule fois, ou après un changement de package.json)
npm install

# 3. Démarrer le serveur de développement
npm run dev
```

Ouvrir ensuite **http://localhost:5173** dans le navigateur.
Les modifications du code s'affichent automatiquement, sans recharger la page.

Pour tester sur téléphone (même réseau Wi-Fi) :

```bash
npm run dev -- --host
```

Puis ouvrir sur le téléphone l'adresse « Network » affichée dans le terminal.

## Autres commandes

| Commande          | Rôle                                                        |
|-------------------|-------------------------------------------------------------|
| `npm run dev`     | Serveur de développement                                    |
| `npm run build`   | Version de production dans le dossier `dist/`               |
| `npm run preview` | Sert la version de `dist/` en local (après `npm run build`) |

## Parcours de l'application

| URL        | Page                                                                                  |
|------------|---------------------------------------------------------------------------------------|
| `/`        | Page d'accueil                                                                        |
| `/editor`  | Éditeur : Coordonnées → Résumé → Expérience → Formation → Compétences → Modèle → Télécharger |

Le CV en cours est sauvegardé dans le navigateur (`localStorage`, clé `opus-cv`).
Pour repartir de zéro, vider cette clé dans les outils de développement du navigateur
(Application → Local Storage), ou utiliser une fenêtre de navigation privée.

## Structure

```
src/
  pages/         Pages (Home = page d'accueil, Editor = éditeur)
  components/    Navbar, Footer, Logo, éditeur et ses étapes (editor/steps)
  templates/     Modèles de CV
  data/          Liste des modèles et couleurs
  store/         État du CV (contexte React + reducer)
  utils/         Calcul du score de complétude, préparation des données
  i18n/          Textes (français d'abord ; arabe et anglais prévus plus tard)
```

Les textes de l'interface se modifient dans `src/i18n/locales/fr/translation.json`.

## Documents de référence

- `OPUS — Complete Project Overview.md` : vision, décisions et feuille de route
- `main.html` : maquette de la page d'accueil (s'ouvre directement dans le navigateur)

## Problèmes fréquents

- **`npm` introuvable** : installer Node.js puis rouvrir le terminal.
- **Port 5173 déjà utilisé** : Vite prend automatiquement le port suivant ; regarder l'adresse affichée dans le terminal.
- **Erreur après un `git pull`** : relancer `npm install`.
