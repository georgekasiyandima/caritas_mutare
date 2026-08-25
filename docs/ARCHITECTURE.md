# Caritas Mutare — Architecture & Maintenance Guide

How the system fits together, the conventions to follow when adding to it, and
the known problems we have not fixed yet.

Read this before your first change. If you change direction, update this file.

---

## 1. The shape of the system

Three deployed pieces:

| Piece | Runs on | Source |
|-------|---------|--------|
| Public site + staff console (React SPA) | Vercel | `client/` |
| REST API (Express) | Render | `server/` |
| Database | Neon Postgres in production, SQLite file locally | `server/migrations/` |

The React app is a **single-page app**. Every URL serves the same
`index.html`, and React Router decides what to render. There is no server-side
rendering, so "the page is not rendering" is almost always one of: the route
isn't registered in `App.tsx`, the build didn't deploy, or the host isn't
falling back to `index.html` for deep links.

The client calls the API using **relative paths** (`/api/...`). Locally that
works because `client/package.json` sets `"proxy": "http://localhost:5000"`.
In production it depends on a Vercel rewrite — see the deployment section,
because this is currently broken.

---

## 2. Frontend

### Layout and routing

`App.tsx` is the whole route table. Public pages are nested inside
`PublicLayout`, which supplies `Navbar`, `Footer`, `StickyDonateBar` and
`WhatsAppWidget`. Never add those to a page yourself. Admin pages nest inside
`ProtectedRoute` → `AdminLayout`. The login page sits outside both because it
has no chrome.

Provider order, outermost first: `HelmetProvider` → `QueryClientProvider` →
`ThemeProvider` → `BrowserRouter` → `ErrorBoundary` → `ToastProvider` →
`AuthProvider` → `Suspense` → `Routes`.

All pages are lazy-loaded with `React.lazy`, so adding a page means adding both
the `lazy(...)` import and the `<Route>`.

### The design system lives in one file

`client/src/lib/sitePageLayout.ts` holds the shared MUI style tokens:
`pageRoot`, `pageHero`, `pageOverline`, `pageH1`, `pageLead`, `outlineCard`,
`outlineCardHover`, `sectionVerticalPadding`, `formCardHeader`,
`closingCtaSectionSx(theme)`, and the `SECTION_BG_ALT` wash.

**Use these instead of inventing new spacing and borders.** A page that looks
subtly off is usually a page that hardcoded its own `sx` values.

### The recipe for a new public page

1. Add `lazy()` import and `<Route>` inside `PublicLayout` in `App.tsx`.
2. Wrap the page in `<Box sx={pageRoot}>`.
3. Add `<SEO title=... description=... canonicalPath=... />` as the first child.
4. Pick a hero: `<HeroBanner>` when you have a photograph,
   `<Box sx={pageHero}>` when it's a text-only header.
5. Alternate section backgrounds between `background.paper` and
   `SECTION_BG_ALT`.
6. Use `outlineCard` (plus `outlineCardHover` if clickable) for cards.
7. Close with `closingCtaSectionSx(theme)` if the page should drive a donation.
8. Add `<BackToTopButton />` on long pages.
9. Add nav and footer links, plus `nav.*` keys in **both** `en.json` and
   `sh.json`.

`MarathonPage.tsx` is a clean, recent example of all nine steps.

### One gotcha with MUI `sx` and TypeScript

Spreading style objects inline (`sx={{ ...outlineCard, height: '100%' }}`)
produces a union type TypeScript can't always assign to `SxProps<Theme>`, and
you get an unhelpful "No overload matches this call". Declare the style as an
array with an explicit type instead:

```ts
const factCardSx: SxProps<Theme> = [outlineCard, { height: '100%' }] as SxProps<Theme>;
```

### Content lives in `lib/`, not in components

`client/src/lib/` is the static content layer, and it is the source of truth:

| File | Holds |
|------|-------|
| `organisation.ts` | Emails, phones, address, hours, social links, map embed |
| `caritasProjects.ts` | The 8 programmes, bilingual fields, galleries, partner logos |
| `marathonEvent.ts` | Marathon dates, fees, hero and gallery images |
| `sitePageLayout.ts` | Design tokens (above) |
| `api.ts` | The fetch wrapper (below) |

Never hardcode a phone number or email into a component. Import `orgContact`.
Two components currently violate this and are listed in the issues register.

### Talking to the API

`client/src/lib/api.ts` wraps `fetch` and exports `apiGet`, `apiPost`,
`apiPatch`, `apiPut`, `apiDelete`, `apiDownload`, and an `ApiError` class. It
attaches the bearer token from `localStorage` and converts non-2xx responses
into thrown `ApiError`s.

**Use these helpers.** Some older code (`AuthContext`, the news pages) calls
raw `fetch` and therefore bypasses the shared error handling.

Server state has no single approach yet: React Query is configured and used on
three pages, while admin pages use `useState` + `useEffect`. React Query is the
better default for new read-only screens.

### Auth on the client

`AuthContext` stores the JWT in `localStorage`, verifies it on boot against
`GET /api/auth/verify`, and exposes `user`, `isAuthenticated`, `isLoading`,
`login`, `logout`, `hasRole`. It also patches `window.fetch` globally so any
401 from `/api/*` clears the token and fires an `auth:unauthorized` event that
`AdminLayout` turns into a toast plus redirect.

Gate routes with `<ProtectedRoute>`, and `<ProtectedRoute roles={['admin']}>`
for admin-only screens. Don't check roles by hand inside a page.

### User feedback

Admin pages use `useToast()`. Public forms use an inline MUI `<Alert>`. Pick
whichever matches the surrounding page rather than mixing both.

---

## 3. Backend

### Request pipeline

```
dotenv → knex migrate → (seed) → helmet → compression → rate limits
  → CORS → morgan → body parsers → static /uploads
  → /api/* routers → global error handler → 404
```

Rate limiting is tiered: 100 requests per 15 min across `/api/`, 10 per 15 min
on login, and 5 per 15 min on each public form POST.

CORS reads a comma-separated `CLIENT_URL`, optionally allows `*.vercel.app`
previews via `ALLOW_VERCEL_PREVIEWS`, and is permissive for localhost and LAN
addresses outside production.

Migrations run automatically at boot. Seeds run automatically outside
production, and in production only when `RUN_SEEDS_ON_BOOT=true`.

### Two generations of route code

This is the single most important thing to understand about the backend.

**`routes/system.js` is the modern pattern** and what new code should copy:
Knex query builder, `express-validator` on every endpoint through a shared
`sendValidation()` helper, shared pagination and CSV-escaping helpers, and
audit-log writes on every mutation.

**`routes/content.js`, `news.js`, `donations.js`, `volunteers.js`,
`contact.js` are the legacy pattern**: hand-written SQL strings through the
`dbGet`/`dbRun`/`dbAll` shim, validation only on some endpoints, no audit
logging, and response shapes that differ per file.

When you touch a legacy route, move it toward the `system.js` pattern rather
than adding more of the old style.

### Auth and roles

JWTs are signed with `{ userId, username, role }`, secret from `JWT_SECRET`,
expiry from `JWT_EXPIRES_IN` (default 7 days). In production the server
**throws at boot** if `JWT_SECRET` is missing, which is deliberate — signing
with a known default would be worse than crashing. Locally it falls back to
`dev-only-change-me`.

There is exactly one role check, `requireAdmin`, testing `req.user.role ===
'admin'`. There is no multi-role RBAC despite the roles plumbing on the client.

Passwords are bcrypt with 10 salt rounds.

### Database

`server/knexfile.js` selects the driver: Postgres when `NODE_ENV=production`
**and** `DATABASE_URL` is set, otherwise a SQLite file. Note the trap — a
production deploy without `DATABASE_URL` silently falls back to SQLite on
ephemeral disk, and the data disappears on restart.

Schema lives in `server/migrations/`. Never edit an applied migration; add a
new one. Current tables: `users`, `news`, `programs`, `donations`,
`volunteers`, `contact_messages`, `site_settings`, `system_projects`,
`system_beneficiaries`, `system_activity_logs`, `system_soup_kitchen_logs`,
`system_documents`, `audit_logs`.

All user input reaches SQL through bound parameters or the Knex builder. I
found no SQL injection. The hand-written SQL has a different problem, below.

### Donation pledges are pledges, not payments

Public submissions to `POST /api/donations` are stored with
`payment_status = 'pending'` and no `payment_id`, because no money has moved.
Staff mark them received in the admin console, where the UI reads "Received"
rather than "Completed". Keep this honest — do not default new donation code
to a completed state.

---

## 4. Known issues register

Verified against the code, worst first. Nothing here is fixed.

### Production-breaking

**A. The deployed frontend cannot reach the API.** `vercel.json` has a `builds`
block but **no `rewrites` block**, so `/api/*` never proxies to Render.
Requesting `https://caritas-mutare.vercel.app/api/health` returns
`text/html` — the React shell — instead of JSON. Every API-backed feature is
broken in production: staff login, contact form, volunteer applications,
donation pledges, news. `docs/DEPLOYMENT.md` §3a documents the exact rewrite
that was never added.

**B. The API does not answer at the documented URL.**
`https://caritas-mutare-api.onrender.com` returns a plain-text `Not Found` at
every path including `/`. That is Render's edge, not our Express 404 (which
returns JSON `{"message":"Route not found"}`), so no service is running at that
hostname. Either the Render service was never created, or it lives at a
different URL that needs to go into `vercel.json` and the docs.

**~~C. Hand-written SQL is SQLite-only and will throw on Postgres.~~ FIXED.**
Double-quoted literals (which Postgres reads as *identifiers*) and the SQLite
builtins `datetime('now', ...)` / `strftime()` appeared across `content.js`,
`news.js`, `donations.js` and `volunteers.js`, including the public news feed
and programmes list. Date cutoffs now come from `database/sqlCompat.js` as
bound parameters, and month bucketing branches per dialect. Verified on SQLite:
the 30-day and 12-month cutoffs filter correctly.

### Correctness

**~~D. `GET /api/news/admin/stats` is unreachable.~~ FIXED.** It was registered
after `GET /admin/:id`, so Express matched `/admin/stats` as `id = "stats"`.
The literal route now sits above the parameterised one, and `/admin/:id` gained
`param('id').isInt()`.

**~~E. `POST /api/auth/register` trusts the `role` field.~~ FIXED.** `role` is
now validated against `ASSIGNABLE_ROLES`. Only `admin` is assignable, because
`requireAdmin` gates every staff endpoint — adding a lesser role without
relaxing those guards would create accounts that can log in but do nothing.

**F. `GET /api/donations/stats` is public** and exposes aggregate donation
totals with no auth (`donations.js`). Confirm that is intended.

### Maintainability

**G. No tests anywhere.** Both `package.json` files declare test tooling
(`jest`, `@testing-library/*`) and neither has a single test file. This is the
biggest long-term risk given the site is going live.

**~~H. Missing `:id` validation~~ FIXED.** `middleware/validate.js` now
provides `idParam()` and `runValidation`, applied across `content.js`,
`news.js`, `donations.js` and `volunteers.js`. Validation runs as middleware
rather than inside handlers, so a route cannot silently skip it by forgetting
the call — which is how these endpoints lost validation in the first place.
`routes/system.js` still uses its local `sendValidation()`; migrate it when
that file is next touched rather than in a separate churn-only change.

**I. Audit logging is partial.** Only `system.js` and `auth.js` write to
`audit_logs`. Admin mutations to news, content, donations, volunteers and
contact messages leave no trail.

**~~J. `discardHoneypot` is copy-pasted~~ FIXED.** Extracted to
`middleware/honeypot.js` as a factory taking a log label and success message.

**K. Contact details bypass `orgContact`.** `WhatsAppWidget.tsx:33` hardcodes
`+263774671893`; `SocialRail.tsx:4` still imports `mockContactInfo`, whose
social URLs differ from `orgContact.social`.

**L. Oversized files.** `server/routes/system.js` is 1034 lines;
`HomePage.tsx` 784; `DonatePage.tsx` 711; `BeneficiariesPage.tsx` 684. The
admin CRUD pages repeat the same table + drawer + confirm-dialog shape four
times with no shared abstraction.

**M. Bilingual data is collected but not displayed.** `caritasProjects.ts`
carries `_sh` fields for every programme, but pages always read `_en`. Roughly
a quarter to a third of visible UI strings go through i18n; `MarathonPage`,
`LeadershipPage`, `ProgrammeDetailPage` and the whole admin console are
hardcoded English.

**N. Dead code.** `data/contentManager.ts`, `config/content.ts`,
`WorkInProgressPage.tsx` are imported nowhere. `data/mockData.ts` survives only
through `SocialRail`. The `system_documents` table has no routes, and `multer`
plus `UPLOAD_PATH`/`MAX_FILE_SIZE` are declared but unwired.

---

## 5. Maintenance habits

**Branching.** Short-lived `feat/*` branches off `main`, one PR each, delete
after merge. Vercel only deploys `main`, so nothing is live until it lands
there. Avoid long stacks of dependent branches — we ended up with six at once,
and they had to be merged in a strict order.

**Before every PR:**

```bash
cd client && npx tsc --noEmit    # ~4 min, catches the MUI sx errors
cd server && npm run migrate     # confirm migrations still apply cleanly
```

**Adding a field end to end:** migration → route validation → response shape →
client type → form control → admin column → both locale files.

**Adding an image:** put it under `client/public/images/<area>/`, reference it
by absolute public path, and record it in `client/public/images/README_ASSETS.md`.

**Secrets.** `.env` is gitignored and no production credentials are committed.
`env.example` is the template. Rotate `JWT_SECRET` and the bootstrap admin
password before launch.

**When something "doesn't render",** check in this order: route registered in
`App.tsx`; branch merged to `main`; Vercel build green; host rewrites deep
links to `index.html`; browser console for a failed chunk load.
