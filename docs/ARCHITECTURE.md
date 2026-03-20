# Caritas Mutare — Architecture & Principles

This document defines the technical architecture and guiding principles for the Caritas Mutare web application. It is the single source of truth for how we build, structure, and maintain the platform.

---

## 1. Purpose & Scope

**Product**: A robust, maintainable web app that puts Caritas Mutare (developmental arm of the Catholic Church, Diocese of Mutare) on the map for donors, well-wishers, and partners.

**Goals**:
- Showcase programmes and impact clearly and credibly.
- Build donor and partner trust through transparency and clarity.
- Support sustainable velocity: easy to maintain, test, and extend.
- Optimize for the unknown: structure that accommodates future content and features without big rewrites.

---

## 2. Architectural Principles

### 2.1 Avoid Tight Coupling to Dependencies
- Prefer interfaces and small adapters over importing frameworks directly in domain/UI logic.
- Keep routing, API client, and UI library usage behind thin wrappers where it simplifies testing or swapping.
- No business logic inside framework-specific code (e.g. route handlers only orchestrate; logic lives in services/utils).

### 2.2 Favor Composition Over Inheritance
- Build UIs from small, focused components composed together.
- Shared behaviour via composition (e.g. layout wrappers, shared hooks) rather than deep class hierarchies.
- Data flow: props down, callbacks up; avoid shared mutable state.

### 2.3 Avoid Hasty Abstractions (AHA)
- Introduce abstractions only when duplication or complexity justifies them (rule of three).
- Prefer explicit, readable code over “clever” reuse until patterns are clear.
- Names and modules should reflect current use, not speculative future use.

### 2.4 Separate Concerns
- **Data / content**: Canonical project and org data in `client/src/data/` (e.g. `caritasProjects.ts`, `mockData.ts`). No UI here.
- **UI**: Components and pages only render and handle interaction; they do not define business facts.
- **API / server**: Routes and middleware for auth, content, donations, volunteers; persistence in DB.
- **Config**: Env, feature flags, and content paths in a small set of config modules.

### 2.5 Don’t Synchronize State — Derive It
- Prefer deriving values (e.g. filtered lists, stats) from a single source of truth rather than syncing multiple copies.
- Use React state for minimal, necessary UI state; derive the rest (e.g. from props, context, or query cache).
- Server state via React Query; avoid duplicating server state in local state unless needed for drafts/optimistic UI.

### 2.6 Principle of Least Surprise
- Naming and behaviour should match what a developer would expect from the name and from common conventions.
- Conventions: one main way to do things (e.g. one pattern for “project” data, one for “programme” pages).
- Document non-obvious decisions in this file or in short comments at the call site.

---

## 3. High-Level Structure

```
caritas_mutare/
├── client/                 # React SPA
│   ├── public/             # Static assets (images, logos, docs)
│   │   ├── images/
│   │   │   ├── programs/   # Per-programme images
│   │   │   ├── partners/   # Donor & partner logos
│   │   │   ├── leadership/
│   │   │   └── general/
│   │   └── documents/
│   ├── src/
│   │   ├── components/     # Reusable UI (layout, shared blocks)
│   │   ├── pages/         # Route-level components
│   │   ├── data/          # Canonical content & types (no UI)
│   │   ├── contexts/      # React context (e.g. Auth, Language)
│   │   ├── config/        # App config, content paths
│   │   ├── i18n/          # Translations (en, sh)
│   │   └── index.tsx      # Theme, providers, router
│   └── package.json
├── server/                 # Node/Express API
│   ├── routes/             # Auth, content, donations, volunteers, news
│   ├── middleware/
│   ├── database/
│   └── index.js
├── docs/                    # Architecture, design, content plan
│   ├── ARCHITECTURE.md     # This file
│   └── DESIGN_AND_CONTENT_PLAN.md
└── package.json             # Root scripts (dev, build, test)
```

- **Data layer**: `client/src/data/` holds types and canonical content (e.g. projects, programmes). Pages and components consume this; they don’t redefine it.
- **Assets**: Partner/donor logos and programme images live under `client/public/images/` with a clear naming scheme (see ASSET_MANAGEMENT_STRATEGY.md and DESIGN_AND_CONTENT_PLAN.md).

---

## 4. Craft Principles (How We Build)

- **“Best practices” do not exist** — We choose practices that fit this project and team, not dogma.
- **Do as little as possible** — Solve the problem at hand; avoid speculative features.
- **Make it work, make it right, make it fast** — In that order; optimize only when needed.
- **Optimize for sustainable velocity** — Clear structure and tests over quick hacks.
- **Optimize for the unknown** — Prefer designs that can absorb new programmes, partners, and content.
- **Pragmatism over purity** — Consistency and maintainability matter more than theoretical perfection.
- **Keep it consistent** — Naming, file layout, and patterns should be predictable.
- **Don’t confuse simplicity with familiarity** — Simple means fewer concepts and less indirection; we adopt familiar tools (React, MUI, Express) where they help.
- **Balance innovation with stability** — Prefer stable, well-supported libraries; adopt new tech when the benefit is clear.
- **Take ownership** — Code is documented and testable; we own the behaviour we ship.
- **Use static testing tools** — TypeScript and ESLint are part of the build; no “any” without a justified escape.
- **Don’t prioritize temporary problems over long-term ones** — Fix root causes (e.g. wrong data shape) rather than one-off patches.
- **Default to standards** — HTTP, REST-like APIs, semantic HTML, accessibility (WCAG) where feasible.
- **Prioritize tools with an ecosystem** — React, MUI, React Query, Express; avoid one-off or abandoned libraries.

---

## 5. Debugging & Resilience

- **Least privilege** — Server routes and DB access scoped to what’s needed; admin only where required.
- **Design to fail fast and early** — Validate input at boundaries; return clear errors; log server-side.
- **Optimize for the debugging experience** — Meaningful error messages, structured logs, and minimal “magic” so failures are traceable.
- **Install extinguishers before the fire** — Error boundaries in the app, rate limiting, and validation on critical paths (donations, forms).

---

## 6. Testing & Performance

- **Tests should resemble use** — Prefer tests that mirror user flows or clear API contracts over testing implementation details.
- **Assertions specific** — Assert on observable outcomes (text, behaviour), not internal state.
- **Explicit over implicit** — Test data and expectations should be obvious from the test itself.
- **Weigh cost–benefit of performance** — Measure before optimizing; focus on critical path (e.g. LCP, form submit) and avoid micro-optimizations that hurt readability.

---

## 7. Developer Experience

- **Adapt to and adopt productive tools** — Use the existing stack effectively; add tooling only when it clearly saves time.
- **Document your work** — This doc, DESIGN_AND_CONTENT_PLAN.md, and README; keep them accurate.
- **Enable offline development** — Local backend and static content so dev works without constant network.
- **Deployable commits** — Main branch stays deployable; feature work in branches, merged via short-lived MRs.
- **Small and short-lived merge requests** — Easier review and fewer merge conflicts.
- **Go down to level up** — When stuck, step down a level (e.g. read the dependency or the network tab) instead of adding more layers.

---

## 8. Technology Choices (Summary)

| Layer        | Choice        | Rationale |
|-------------|---------------|-----------|
| Frontend    | React 18      | Ecosystem, team familiarity, composition model |
| UI          | MUI v5        | Accessibility, consistency, theming |
| State       | React Query   | Server state; avoid syncing with local state |
| Routing     | React Router 6| Standard, matches SPA model |
| i18n        | i18next       | English/Shona; already in use |
| Backend     | Node + Express| Simple, same language as frontend |
| DB          | SQLite        | Simple ops, file-based; can migrate later if needed |
| Auth        | JWT           | Stateless, sufficient for admin and API |

---

## 9. Next Steps (From This Baseline)

1. **Content & data**: Populate `client/src/data/caritasProjects.ts` from organisation material; keep types in `types.ts`.
2. **Design system**: Apply DESIGN_AND_CONTENT_PLAN.md (typography, colours, project cards, donor/partner blocks).
3. **Programme pages**: Refactor programme/project pages to consume canonical project data and shared components.
4. **Assets**: Place partner/donor logos and programme images under `public/images/` and reference them from data.
5. **Tests**: Add tests for critical user paths (e.g. viewing programmes, donate/volunteer flows) and for data shape/validation where it matters.

This architecture is the official baseline for the project. Changes to principles or structure should be proposed and reflected here so the team stays aligned.
