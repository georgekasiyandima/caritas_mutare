# Image assets for Caritas Mutare website

Place media files here so the app can reference them. Paths in the app are relative to `public/` (e.g. `/images/partners/cafod.png`).

## Per-project uploads (keep it clean)

When you add photos for a **specific project**, use this flow so nothing stays scattered in `general/` or the site root:

1. **Pick the project folder** — one folder per project slug under `programs/` (create the folder if it does not exist yet):

   | Project (slug) | Put images in |
   |----------------|----------------|
   | SERARP | `programs/serarp/` |
   | CETLRCCAP | `programs/cetlrccap/` (ICSP gallery images) |
   | DiDRR | `programs/didrr/` |
   | ILP | `programs/ilp/` |
   | Soup Kitchen | `programs/soup-kitchen/` |
   | St Theresa Pre-School | `programs/education/` |
   | Mai Maria Village | `programs/mai-maria-village/` *(create when you have assets)* |
   | CFNSHPP (Misereor) | `programs/cfnshpp/` (`cfnshpp-gallery-01.png` … `04.png`) |

2. **Name files clearly** — e.g. `ilp-goat-training-2025.png`, `didrr-workshop-1.jpg`.

3. **Wire them in code** — in `client/src/lib/caritasProjects.ts`, set `heroImage` and/or add paths to `galleryImages` using URLs like `/images/programs/serarp/your-file.png`.

4. **Reserve `general/`** for site-wide use only (homepage impact strip, events, banners not tied to one project).

5. **Site root `public/`** — avoid dropping images there; keep everything under `images/...` for consistency.

When you send images “by project”, we only need: **project name (or slug) + files** — we place them in the matching folder and update `caritasProjects.ts`.

## Current assets

| Location | Files | Use |
|----------|--------|-----|
| **partners/** | `cafod.png`, `cbm-global.png`, `cbm-global-zimbabwe.png`, `quapaz.png`, `fodpz.png`, `oak-foundation.png`, `trocaire.png`, `government-ireland.png`, `caritas-mutare.png`, `caritas-mutare-alt.png`, `zimbabwe-government.png` (+ `-2`, `-3`) | Donor/partner logos. |
| **programs/education/** | `st-theresa-preschool-1.png`, `st-theresa-preschool-2.png`, `children-steps-event.png` | St Theresa Pre-School hero and gallery. |
| **programs/serarp/** | `serarp-mechanics-nyanyadzi-college.png`, `serarp-plastering-class.png`, `serarp-citizen-monitoring-group.png`, `serarp-edutainment-refresh.png`, `serarp-gender-champions-family-tree.png`, `community-poster-oak.png` (optional) | SERARP gallery + hero; Oak poster if used elsewhere. |
| **programs/cfnshpp/** | `cfnshpp-gallery-01.png` … `04.png` | CFNSHPP / Misereor programme gallery. |
| **programs/agriculture/** | `woman-okra-field.png`, `field-green-crops.png`, `seedling-nursery-women.png`, `nursery-shade-house.png`, `livestock-dip-1.png` (legacy / other use) | CETLRCCAP and general agriculture shots. |
| **programs/cetlrccap/** | `icsp-gallery-01.png` … `icsp-gallery-04.png` | CETLRCCAP / ICSP programme gallery. |
| **programs/didrr/** | `didrr-gallery-01.png`, `didrr-gallery-02.png` | DiDRR disability inclusion gallery (mid-term review). |
| **programs/ilp/** | `ilp-gallery-01.png`, `ilp-gallery-02.png` | ILP livelihoods gallery (goats, poultry). |
| **programs/soup-kitchen/** | `soup-kitchen-gallery-01.png` … `06.png` | Official programme gallery (hero = 01). Extra assets may live under `gallery/` (legacy page). |
| **programs/infrastructure/** | `water-bridge-construction.png` | Water/bridge construction (CETLRCCAP / general). |
| **general/** | `promoting-dignified-lives-1.png`, `promoting-dignified-lives-oak-caritas.png`, `health-champions-1.png`, `community-gathering-1.png`, `community-impact-1.png`, `construction-1.png`, `workshop-planning.png`, `beneficiary-with-food.png`, `food-seed-festival-event.png` | Impact section, homepage, events (e.g. Food & Seed Festival). |
| **leadership/** | `bishop-horan.png` | Bishop Paul Horan (O’CARM). Add Fr. Gumbeze, Sr. Angeline when available. |
| **placeholders/** | — | Temporary placeholders if needed. |

## Folders

| Folder | Use |
|--------|-----|
| **partners/** | Donor and partner logos. Names: `cafod.png`, `trocaire.png`, `cbm-global.png`, `oak-foundation.png`. |
| **programs/** | Per-programme images; subfolders by slug (e.g. `serarp/`, `education/`, `agriculture/`). |
| **leadership/** | Leadership photos. |
| **general/** | Hero backgrounds, events, impact gallery. |
| **placeholders/** | Temporary placeholders. |

## Naming

- **Logos**: `{organisation-slug}.png` or `.svg`.
- **Programme images**: `{program-slug}-{description}.png` (e.g. `serarp-vocational-training-1.png`).

## Data references

- **Canonical project list and image URLs:** `client/src/lib/caritasProjects.ts` — `donorLogoUrls`, `partnerLogoUrls`, `heroImage`, `heroImagePosition`, `galleryImages`.
- **Homepage / impact strip (not per-project):** `generalImpactImages` in the same file.
- There is also `client/src/data/caritasProjects.ts` for types/tests; keep it in sync if you edit that copy — the live UI uses **`lib/caritasProjects.ts`**.
