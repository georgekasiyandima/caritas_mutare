# Caritas Mutare — Next steps

This document outlines recommended next steps after the initial planning and asset setup. Use it as a checklist and guide.

---

## 1. **Use the assets in the UI**

- **Partner strip**: On the **homepage** and/or **footer**, add a “Supported by” or “Our partners” section that renders `partnerLogosForSite` from `client/src/data/caritasProjects.ts`. Show each logo (with `name` as alt text) linking optionally to the partner’s site.
- **Programme pages**: Refactor or add programme detail pages (e.g. `/programs/serarp`, `/programs/didrr`, `/programs/soup-kitchen`) so they:
  - Load project from `getProjectBySlug(slug)`.
  - Display `heroImage`, `galleryImages`, `donorLogoUrls`, `partnerLogoUrls`, theory of change, and key pathways.
- **Programme hub**: Update **ProgramsPage** to list projects from `getActiveProjects()` (or `caritasProjects`) with cards showing title, summary, target, duration, and donor/partner logos.
- **Leadership**: Use **Bishop Horan** photo at `images/leadership/bishop-horan.png` on the Leadership page (e.g. “Bishop Paul Horan (O’CARM)”). Add Fr. Gumbeze, Sr. Angeline, and other leaders when photos are available.
- **Impact / gallery**: Add a section (homepage or dedicated page) that uses `generalImpactImages` in a simple grid or carousel.

---

## 2. **Design system (optional but recommended)**

- **Fonts**: In `client/src/index.tsx`, add **Source Sans 3** and **Source Serif 4** (Google Fonts) and set them in `createTheme` as in [DESIGN_AND_CONTENT_PLAN.md](DESIGN_AND_CONTENT_PLAN.md). Keep body at 16px and line-height ~1.6.
- **Colours**: Keep Caritas red as primary; use success/info for programme accents where it helps.
- **Accessibility**: Ensure contrast (WCAG AA), focus states, and alt text for all images.

---

## 3. **Routes for all projects**

Current project routes in data:

- `/programs/serarp`, `/programs/cetlrccap`, `/programs/didrr`, `/programs/ilp`
- `/programs/soup-kitchen`, `/programs/education`, `/programs/mai-maria-village`, `/programs/cfnshpp`

Add these routes in `App.tsx` and either:

- Use **one** reusable **ProgrammeDetailPage** that reads `slug` from the URL and calls `getProjectBySlug(slug)`, or  
- Create a small page per project that still pulls content from `caritasProjects`.

Prefer the single reusable page to avoid duplication.

---

## 4. **Content and copy**

- Replace any remaining placeholder text (e.g. in `mockData.ts`, `mockContactInfo`, `mockTeamMembers`) with real contact details, team bios, and stats from the organisation.
- Add **Shona** strings for all new programme titles, summaries, and theory-of-change text in i18n and in `caritasProjects` where you use bilingual fields.
- If the **Bishop Horan** image appears too dark in the app, replace `images/leadership/bishop-horan.png` with a brighter version from the original source.

---

## 5. **Optional partner logos**

When you have files for:

- **MISEREOR** → save as `images/partners/misereor.png` and add to `partnerLogosForSite` and any relevant project.
- **QUAPAZ** (Quadriplegics and Paraplegics Association of Zimbabwe) → `images/partners/quapaz.png`.
- **FODPZ** (Federation of Organisations of Disabled People in Zimbabwe) → `images/partners/fodpz.png`.

Then reference them in project data (e.g. DiDRR, ILP) and in `partnerLogosForSite` if they should appear in the global strip.

---

## 6. **Testing and deploy**

- **Test**: Run `npm test` and add a few tests for critical paths (e.g. programme list loads from data, partner logos render).
- **Build**: Run `npm run build` and fix any type or lint errors.
- **Deploy**: Use your existing process (e.g. Vercel, Docker). Ensure `client/public/images` is included in the build so all assets are served.

---

## 7. **Docs to keep updated**

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — When you change structure or principles.
- **[DESIGN_AND_CONTENT_PLAN.md](DESIGN_AND_CONTENT_PLAN.md)** — When you change typography, colours, or content patterns.
- **client/public/images/README_ASSETS.md** — When you add or rename images or logos.

---

## Quick reference

| Goal | Where to look |
|------|----------------|
| List all projects | `caritasProjects`, `getActiveProjects()` |
| Partner logos for site | `partnerLogosForSite` |
| General impact gallery | `generalImpactImages` |
| One project by URL slug | `getProjectBySlug(slug)` |
| Design and typography | [DESIGN_AND_CONTENT_PLAN.md](DESIGN_AND_CONTENT_PLAN.md) |
| Architecture and principles | [ARCHITECTURE.md](ARCHITECTURE.md) |

You have a solid base: canonical project data, partner logos, leadership and programme images, and clear structure. The next step is to connect this data to the UI (programme hub, programme detail, partner strip, leadership, impact gallery) and then refine content and deploy.
