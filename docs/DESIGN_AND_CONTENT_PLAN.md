# Caritas Mutare — Design & Content Plan

This document defines how we represent Caritas Mutare on the web: design system, project representation, NGO best practices, and asset usage. It aligns with the organisation’s material (Website Information, PROJECTS 2, PROJECTS3) and the existing prototype.

---

## 1. Design System

### 1.1 Brand Alignment
- **Caritas red** (primary): Already in use (`#d32f2f`). Keep as primary for CTAs, key headings, and accents.
- **White / light backgrounds**: Clean, accessible, print-friendly.
- **Secondary accents**: Use sparingly for stats, tags, and programme differentiation (e.g. success green for agriculture, blue for water/climate).

### 1.2 Typography

**Principles**: Readability first; limit to two type families (headings + body). Ensure WCAG AA contrast and sufficient size (body ≥16px, line-height 1.5–1.6).

**Recommended pairing (option A — distinctive & trustworthy)**  
- **Headings**: **Source Serif 4** or **Merriweather** (Google Fonts). Serif conveys tradition, stability, and fits a faith-based development organisation.  
- **Body**: **Source Sans 3** or **Inter** (Google Fonts). Humanist sans-serif, excellent readability and accessibility.

**Current (option B — keep and refine)**  
- **Headings + body**: **Roboto** (current). Safe, clear, and already in use. If we keep it, we can still improve hierarchy (size/weight) and line-height for long-form content.

**Recommendation**: Adopt **Source Sans 3** for body and **Source Serif 4** for headings. Load via Google Fonts in `index.html` and set in `createTheme` in `client/src/index.tsx`. Fallbacks: `"Georgia", "Times New Roman", serif` for headings and `"Helvetica", "Arial", sans-serif` for body.

**Sizes (reference)**  
- Body: 16px (1rem), line-height 1.6  
- Lead/intro: 18–20px  
- H1: 2.25–2.5rem, H2: 1.75–2rem, H3: 1.5rem  
- Small/captions: 14px  

### 1.3 Spacing & Layout
- Use MUI spacing scale (8px base). Sections: 6–8 (48–64px) vertical rhythm.
- Max content width: 1200px (lg) for readability; full-bleed only for heroes and galleries.
- Cards and programme blocks: consistent padding (e.g. 3), rounded corners (12px) to match existing cards.

### 1.4 Imagery
- **Real over stock**: Prefer Caritas’s own photos (programmes, beneficiaries, partners). Placeholders only where assets are pending.
- **Alt text**: Every image has descriptive alt text (programme name, what’s shown, context).
- **Performance**: Lazy-load below the fold; optimise file size (see ASSET_MANAGEMENT_STRATEGY.md).

---

## 2. Representing Projects & Programmes

### 2.1 Data Model (Canonical)
Each **project** has:
- **Identity**: Title (EN/SH), short slug/key, optional acronym (e.g. SERARP, DiDRR).
- **Donors & partners**: Donor name(s), partner name(s), optional logo URLs.
- **Scope**: Target (e.g. “1200 individuals”, “500 households”), location (wards/districts), duration (start–end).
- **Narrative**: Short description, full description, theory of change, key pathways (bullets).
- **Media**: Hero image, gallery images (paths in data or CMS later).
- **Status**: Active / completed; display “Active” or “Ongoing” where relevant.

Programme **pages** derive from this: one source of truth in `client/src/data/caritasProjects.ts` (or API later). No duplicated project facts in multiple components.

### 2.2 How We Show Projects (UI Patterns)

- **Programme hub (/programs)**  
  - Grid of **project cards**. Each card: title, one-line summary, target/duration, donor/partner logos (small), “Learn more” → programme page.

- **Single programme page (/programs/:slug)**  
  - Hero: Title, location, duration, donor/partner logos (larger).  
  - Sections: Description → Theory of change → Key pathways (bullet list) → Impact/stats (if we have them) → Gallery.  
  - Optional: “Related programmes” at bottom.

- **Donor / partner trust**  
  - Logo strip on homepage (“Supported by / In partnership with”) and on each programme page.  
  - Logos from `public/images/partners/` (e.g. `cafod.png`, `trocaire.png`, `cbm-global.png`, `oak-foundation.png`).  
  - Consistent size and greyscale or brand colours per partner guidelines.

### 2.3 Mapping Organisation Material to Routes

| Content (from PDFs) | Route / usage |
|---------------------|----------------|
| SERARP | `/programs/serarp` or under “Livelihoods / Resilience” |
| CETLRCCAP | `/programs/cetlrccap` or “Climate & Livelihoods” |
| DiDRR | `/programs/didrr` — “Disability-Inclusive DRR” |
| ILP | `/programs/ilp` — “Inclusive Livelihoods” |
| Soup Kitchen | `/programs/soup-kitchen` (existing) |
| St Theresa Pre-School | `/programs/education` (or `/programs/st-theresa-preschool`) |
| Mai Maria Village | `/programs/mai-maria-village` or “Our Work” / “Assets” |
| CFNSHPP | `/programs/cfnshpp` (Chimanimani food & nutrition) |
| Day of the Poor | News/events or “Stories” |

We can group some under thematic programme pages (e.g. “Livelihoods” lists SERARP, ILP, CETLRCCAP) and link to individual project pages for detail.

---

## 3. NGO Best Practices: Trust, Donors, Storytelling

### 3.1 Building Donor & Investor Trust
- **Transparency**: Show who funds what (donor + partner per project). Display “Funded by X, implemented with Y”.
- **Concrete numbers**: Use the organisation’s figures (e.g. “1200 individuals”, “500 households”, “7 districts”). Prefer exact numbers from their docs; round only for headlines if needed.
- **Stories over jargon**: Lead with impact and beneficiaries; keep “theory of change” and “pathways” in a clear, scannable format (headings + bullets).
- **Contact & accountability**: Clear contact page, physical address, and (if applicable) link to annual reports or governance info.

### 3.2 Making Them Stand Out
- **Diocesan identity**: “Developmental extension of the Catholic Church, Diocese of Mutare” and “Guided by Catholic Social Teaching” are differentiators — use in About and programme intros.
- **Geography**: Prominent mention of the 7 districts and Manicaland; map or district list where useful.
- **Inclusion**: Highlight disability-inclusive (DiDRR, ILP) and gender focus (e.g. SERARP, CETLRCCAP) as strengths.
- **Own initiatives**: Soup Kitchen, St Theresa Pre-School, Mai Maria Village show self-driven work — give them visible space.

### 3.3 Telling the Story
- **Homepage**: Mission + vision + 2–3 impact numbers; featured programmes; donor/partner logos; clear CTAs (Donate, Volunteer, Contact).
- **Programme pages**: Problem → what we do → theory of change → key pathways → (when available) photos and quotes.
- **Language**: Professional but warm; avoid long paragraphs. Short sentences and bullet lists for theory of change and pathways.
- **Multilingual**: Keep EN/SH; ensure all new programme content exists in both in `data` and i18n.

---

## 4. Assets: Logos, Pictures, Structure

### 4.1 Folder Structure (under `client/public/images/`)
- `programs/` — Per-programme images (hero, gallery). Subfolders by slug: e.g. `serarp/`, `soup-kitchen/`, `didrr/`.
- `partners/` — Donor and partner logos (e.g. CAFOD, Trocaire, CBM Global, Oak Foundation). Use official logos where permission exists.
- `leadership/` — Fr. Gumbeze, Sr. Angeline, Bishop, etc.
- `general/` — Hero backgrounds, Day of the Poor, events.
- `placeholders/` — Temporary placeholders until real assets are in place.

### 4.2 Naming
- **Logos**: `{organisation-slug}.png` or `.svg` (e.g. `cafod.png`, `trocaire.png`, `cbm-global.png`, `oak-foundation.png`).
- **Programme images**: `{program-slug}-{description}.jpg` (e.g. `serarp-ward7-irrigation.jpg`).

### 4.3 Using the Assets You Have
- The five image assets you provided can be copied into `client/public/images/` once we know which are logos vs programme/event photos. Suggested locations:
  - Partner/donor logos → `client/public/images/partners/`.
  - Programme or event photos → `client/public/images/programs/{program-slug}/` or `general/`.
- Reference them from the canonical project data (e.g. `donorLogos: ['/images/partners/cafod.png']`) so the UI stays data-driven.

---

## 5. Implementation Order (Suggested)

1. **Data & types**: Add `Project` type and `caritasProjects.ts` with all projects from the PDFs (see next section).
2. **Theme**: Add chosen fonts (Source Sans 3 + Source Serif 4) and adjust typography in `createTheme`.
3. **Assets**: Create `public/images/partners/` and `public/images/programs/` structure; drop in logos and one hero per programme where available.
4. **Programme hub**: Refactor Programs page to render from `caritasProjects` (cards with donor logos, target, duration).
5. **Programme detail**: Create a reusable programme template and add/refactor routes for each project (SERARP, Soup Kitchen, DiDRR, etc.).
6. **Homepage**: Add “Supported by” logo strip; ensure stats and featured programmes use canonical data.
7. **i18n**: Add Shona keys for all new programme titles and descriptions.

This plan keeps the app consistent, maintainable, and ready to scale with new projects and assets. All representation decisions trace back to this document and the organisation’s official material.
