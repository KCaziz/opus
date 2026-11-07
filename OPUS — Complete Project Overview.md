# OPUS — Complete Project Overview

Prepared for Salim. Status as of 25 October 2026. Everything below is drawn from the decisions made so far; where something has not been decided, it is flagged as open rather than invented.

## 1. The one-paragraph version

OPUS is a French-first CV builder web platform for the Algerian job market. It targets recent graduates and early-career job seekers, and rests on one observation: most CVs fail because of poor structure and clarity, not because of a lack of talent. OPUS guides the user field by field, gives contextual advice at each step, scores the CV's completeness, offers templates, and exports a PDF. The business model is a one-time fee per PDF export, with institutional partnerships and a talent directory as later layers. It is built by two people: Salim (design, product, copy, strategy) and a single fullstack developer.

## 2. Origin and thesis

OPUS comes from firsthand evidence rather than market speculation. In a previous role, Salim reviewed candidate CVs as a recruiter and saw the same failures repeated at scale: weak structure, unclear skills, missing job descriptions, no hierarchy of information. These are not failures of ability; they are failures of format and guidance, which is precisely what software can fix.

The thesis therefore has three parts:

- The problem is structural and widespread among Algerian candidates, particularly first-time job seekers.
- Generic tools (Word templates, foreign builders in English, Canva layouts) do not teach the user what a good CV contains, and mostly do not default to French or to local conventions.
- A guided, opinionated builder that tells the user what to write and why, in French, at the moment they are writing it, produces a measurably better document than a blank page.

The credibility of this thesis is OPUS's strongest asset. It should be visible in the product's voice and in the landing page, but only as claims that can be defended.

## 3. Audience

Primary: recent graduates and early-career job seekers in Algeria. They have little or no professional history to fill a CV with, which makes structure and phrasing, not content volume, the deciding factor. They are mobile-heavy, price-sensitive, and typically pay online with a Dahabia card or a CIB card rather than an international credit card.

Secondary (not at launch): institutions such as universities, training centers, and employment programs that want their cohorts to produce usable CVs; and, much later, recruiters browsing a talent directory.

Explicitly out of scope at launch: any recruiter-side tooling or application tracking. OPUS is candidate-facing only. This is a discipline decision as much as a product one: it keeps a two-person team from building two products.

## 4. Product

### 4.1 Core experience

- **Guided, field-by-field creation.** The user is walked through the CV section by section instead of facing an empty document.
- **Contextual advice.** Each field carries guidance on what recruiters expect: how to phrase a job description, how to express a skill, what to omit.
- **Completeness score.** A running indicator of how finished and well-formed the CV is. This is both a usability device and the main engagement loop: users return to push the score up.
- **Template selection.** A limited set of templates, switchable without re-entering data (which requires the data model to be strictly separated from presentation).
- **PDF export.** The monetized moment.

### 4.2 Platform decisions

- Web application with PWA support from day one, which suits a mobile-dominant audience and avoids app-store dependency.
- French first. Arabic and English follow in later phases. Arabic implies right-to-left layout and a different typographic setup; it should be anticipated in the component architecture now even though it ships later.
- Rule-based guidance for the MVP. AI suggestions are layered in after launch.

### 4.3 The blocking decision: CV section structure

The exact set of CV sections, their fields, their ordering, and their validation rules is not yet locked, and it is the most consequential open item in the project. It determines the database schema, the form flow, the scoring logic, the guidance content, and the PDF layout. Everything downstream waits on it. The landing page has absorbed attention that this decision deserves more.

## 5. Business model

- **B2C, primary:** a one-time fee for PDF export. Simple to explain, simple to bill, and aligned with a user who needs one good CV now rather than a subscription.
- **B2B, secondary:** institutional partnerships (universities, training programs).
- **Phase 3:** a talent directory, which flips the product partly toward recruiters. It should stay a Phase 3 idea until the candidate base justifies it.

**Open items on pricing:** the price point, whether there is a free preview or free tier, whether free exports carry a watermark, and whether a single payment covers re-exports after edits. These shape conversion more than any design choice and have not been settled.

## 6. Go-to-market strategy

The sequence is deliberate:

1. Foundation and build.
2. Private beta with roughly 20 to 50 real users, to validate the flow, the scoring, the guidance quality, and the payment path under real conditions.
3. Public launch.
4. Partnership approach to Student Campuce, a Djezzy and Algérie Poste initiative with verified Dahabia users across 69 wilayas, carried out with actual usage data in hand.

The working principle is that Campuce is approached after launch with proof, not before launch with a pitch. OPUS is positioned as complementary to Campuce Jobs, not as a competitor: Campuce Jobs connects candidates to openings, OPUS makes the candidate worth connecting. Total timeline across all phases is roughly three to four and a half months.

## 7. Brand and design system

**Color.** Coral `#DF5D5D` as the primary accent; near-black `#110303` for text. Coral is a functional accent, not a background color: it exists to direct attention to calls to action, and overuse dilutes that. The decision for the landing page is that coral wash should cover roughly 15 to 20 percent of the page area, confined to the hero, rather than the roughly 40 percent it occupied in earlier iterations.

**Typography.** Three typefaces with distinct jobs: STIX Two Text (serif) for headlines, Figtree for body and interface text, Chivo Mono for data labels and monospaced details. The serif gives editorial credibility appropriate to a document-centric product; the sans keeps the interface legible on small screens; the mono signals precision for scores and labels.

**Tooling.** Figma, with a token system built around the coral, dark-text, and three-typeface scheme.

**Direction.** Cultural specificity and conceptual depth over generic clean SaaS aesthetics, tempered by the lesson from the landing-page work that concept should not outrun shipping.

## 8. The landing page

### 8.1 History

The landing page is the main active workstream and, candidly, the main schedule risk. It went through five or more rounds across several concepts: a notebook aesthetic, an editorial before-and-after layout, and a ticket-stub or convocation metaphor. Each was explored and moved past. The turning point was shifting from HTML mockups to copywriting and content strategy against Salim's own wireframe, which is where the real problems turned out to live.

### 8.2 Current direction

The page was rebuilt as a simpler layout, drawing on chatgpt.com/overview, chatgpt.com/codex, diabrowser.com, and perk.com:

- A full-screen hero with a hard edge.
- Scroll-driven numbered steps beside a large builder-screen preview, fixed at 16:9, with a placeholder until real product screens exist.
- A four-card benefit row.
- Lighter title weights and colors, and a light theme as the default.

Salim considers it a good base for now.

### 8.3 Wireframe structure

The wireframe defines: a minimal navigation (logo, About us); a hero headline in French ("Créer un CV professionnel en quelques clics") with a primary button ("Créer mon CV"); a statistic callout; a "What can you do with OPUS?" feature section; a "Pourquoi créer mon CV avec OPUS?" benefits section; an FAQ with a support block; and a footer with About, Contact, Terms and conditions, and Privacy policy. The footer in the wireframe credits Icosium Digital with a 2025 notice, which should be reconciled with the actual legal entity and the current year before launch.

### 8.4 Copy decisions already made

- Keep the red banner call to action.
- Remove the "Qu'attendez-vous pour commencer ?" block: two consecutive closing calls to action weaken each other rather than reinforcing.
- French corrections applied: "CV créer" becomes "CV créés"; "clicks" becomes "clics". The footer line "All right reserved" is wrong in English as well and needs fixing.
- A duplicate FAQ entry was found and should be replaced with a PWA-related question.
- The statistics (60 percent, 48 percent, 12 percent) are unverified and must not be published without a source. A fabricated statistic on a product whose pitch is credibility is a self-inflicted wound. Either source them, replace them with real beta data after the private beta, or use qualitative claims.

### 8.5 Governing principle

Ship at 80 percent satisfaction. The page can be improved with real beta feedback and real screenshots far more productively than by further abstract iteration.

## 9. Ways of working

Two people, clear split: Salim owns design, product direction, copy, and strategy; the fullstack developer owns implementation. Salim works iteratively but decisively once a direction is chosen, expects direct and opinionated recommendations, and expects pushback to be accepted cleanly so that work moves forward. Continuity across sessions matters, which is why each work session should end on a named next step.

## 10. Roadmap

1. **Lock the CV section structure.** Sections, fields, order, validation, and scoring weights.
2. **Derive the data model and the PDF layout** from that structure.
3. **Close the landing page** at 80 percent: real copy, no unverified statistics, placeholder preview acceptable.
4. **Build the MVP:** guided form flow, rule-based guidance, completeness score, templates, PDF export, PWA shell.
5. **Private beta** with 20 to 50 real users; collect structured feedback and real completion and conversion data.
6. **Public launch**, using beta data to replace placeholder claims on the landing page.
7. **Approach Student Campuce** with usage data.
8. **Post-launch:** Arabic and English, AI suggestions through the backend proxy, institutional partnerships, then the talent directory.

## 11. Risks, stated plainly

- **Landing-page perfectionism.** Already the proven schedule risk. Mitigation: the 80 percent rule.
- **The unlocked CV structure.** The real blocker, and the one most easily avoided because it is less enjoyable than visual work.
- **Willingness to pay.** A one-time fee for an audience of students and fresh graduates is untested. The beta must test price and the free-versus-paid boundary, not just usability.
- **Personal data.** A CV is dense personal data. Algeria has a data protection law (Law 18-07), and the privacy policy, retention rules, and deletion flow should be checked against it before launch; verify the current obligations with a local legal source.
- **Credibility of claims.** Any figure published without a source undermines the product's core promise.
- **Two-person bus factor.** One developer is a single point of failure; keep decisions and handover notes documented.
- **Scope creep toward recruiters.** The talent directory and recruiter features are tempting and should stay deferred.

## 12. Operating principles, collected

- Ship at 80 percent; improve with real data.
- Lock structure before pixels: the CV section structure gates everything.
- Coral is an accent, not a surface.
- Publish only claims that can be sourced.
- One closing call to action, not two.
- Approach partners with proof, not with a pitch.
- Candidate-facing first; recruiter features later, if ever.

## 13. Decisions still open

- Final CV sections, fields, and scoring weights.
- Price point, free tier or preview, watermark policy, re-export rules.
- Number and style of templates at launch.
- Legal entity name and footer credits.
- Sources, or replacements, for the landing page statistics.
