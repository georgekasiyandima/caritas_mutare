# Decisions Log — Caritas Mutare Platform

Purpose: a running record of key technical and product decisions, why they were
made, and what could change them. This is not a full changelog — it's the
*reasoning* behind decisions, so anyone (including future us) can understand
why the project looks the way it does without having to ask.

Add a new entry whenever a decision is made that would be non-obvious to
someone joining the project later, or that trades one thing off against
another. Keep entries short — a paragraph, not an essay.

---

## Format for new entries

```
## [YYYY-MM-DD] Short decision title

**Decision:** What was decided.

**Context:** Why this came up / what problem it solves.

**Alternatives considered:** What else was on the table, briefly.

**Trade-offs accepted:** What we're giving up or accepting as a known limitation.

**Revisit if:** What would make us reconsider this decision.
```

---

## 2026-08-14 — Backend hosting stack: Render + Neon Postgres

**Decision:** Backend API hosted on Render, database on Neon (serverless Postgres).
Frontend stays on Vercel (already in production).

**Context:** Backend has not yet been built. Needed a hosting decision before
starting backend work, given the project's actual requirements: project/programme
data, admin content management, contact form, volunteer submissions, reports,
and donations (later, lower priority for now).

**Alternatives considered:** Continuing with SQLite (existing README described
this) — rejected, doesn't handle concurrent writes well and isn't suitable for
production data going forward. Heroku — more expensive at this scale, no
strong reason to prefer over Render for this project's needs.

**Trade-offs accepted:** Render's free tier spins down after inactivity,
causing a slow "cold start" on the first request after idle periods. Accepted
for now given low expected traffic on admin routes; the public donation flow
is the one place this could matter more if donation volume grows.

**Revisit if:** Donation traffic or public-facing request volume grows enough
that cold-start latency becomes a real user-facing problem — at that point,
consider a paid Render tier or an alternative host.

---

## 2026-08-14 — Database: migrating from SQLite to Postgres before backend build

**Decision:** Backend will use PostgreSQL (via Neon) from the start, not SQLite.

**Context:** Original project scaffolding used SQLite. No production data exists
yet, so this is the cheapest possible time to make this change — before real
donor/beneficiary data exists, not after.

**Alternatives considered:** Keep SQLite for now, migrate later if needed —
rejected, since migrating a live system with real data is materially harder
and riskier than deciding correctly up front.

**Trade-offs accepted:** None significant — this is a strictly better starting
position for the same amount of current effort.

**Revisit if:** N/A — this isn't expected to need revisiting.

---

## 2026-08-14 — Build order: incremental backend slices, contact form first

**Decision:** Backend will be built in small, ordered vertical slices rather
than all at once: (1) Contact form, (2) Auth, (3) Projects CRUD, (4)
Beneficiaries, (5) Volunteers, (6) Activity/Audit logs, (7) Reports, (8)
Donations — in that order.

**Context:** Solo developer, learning-in-progress on backend architecture.
Small incremental slices reduce risk and create working, deployed checkpoints
along the way rather than one large all-or-nothing build.

**Alternatives considered:** Building the full API surface before any frontend
integration — rejected, higher risk of building the wrong thing before
getting real feedback from a working slice.

**Trade-offs accepted:** Slower to reach full feature parity with what the
frontend currently expects, but each slice is independently shippable and
testable.

**Revisit if:** A second developer joins the project — build order may be
parallelized differently with more than one person.

---

## 2026-08-14 — Marathon event: static page first, no registration backend yet

**Decision:** Add the Caritas Mutare 21km Marathon as a new public page
(static content: date, route, sponsor info, past highlights), without a
backend registration system in version 1.

**Context:** Annual flagship event was missing from the site entirely.
Team's current registration process (paper/WhatsApp/Google Form — to be
confirmed with Angela) is not yet replaced; adding the page gives the event
a real presence on the site without committing to backend work before it's
confirmed to be wanted.

**Alternatives considered:** Building a full events content-management system
with a generalized `/events` structure — rejected for now as premature
generalization; there is currently exactly one recurring event, and building
for a hypothetical second one adds complexity with no current benefit.

**Trade-offs accepted:** No online registration in v1 — registration stays
on whatever channel the team currently uses, until confirmed otherwise.

**Revisit if:** Team confirms they want online registration, or a second
recurring event is added (at which point a more general `/events` structure
becomes worth the complexity).

---

## 2026-09-27 — Dependencies live with the code that uses them

**Decision:** The root `package.json` holds only the dev helper scripts
(`dev`, `install-all`, `test`, `build`) plus `concurrently` and `cross-env`.
App dependencies live only in `client/package.json` (React, MUI) and
`server/package.json` (Express, Knex, pg, bcryptjs). `sqlite3` is a server
devDependency; Render installs with `npm ci --omit=dev`, and the API refuses
to start in production without a Postgres `DATABASE_URL`.

**Context:** The root file dated from September 2025, before `client/` and
`server/` had their own packages. It duplicated React, MUI and Express, had
drifted (`@testing-library/react` 14 at root vs 13 in client), and listed
packages nothing imports (`axios`, `styled-components`, `framer-motion`,
`yup`, a webpack/Babel toolchain). Neither Vercel nor Render ever read it.

**Password hashing stays on `bcryptjs`:** pure JS, so installs never need a
C++ toolchain and never break on a Node upgrade or OS change. It is ~2–3×
slower than native `bcrypt` and runs on the main thread, which is irrelevant
at a few staff logins a day. Hashes are compatible, so switching is cheap.

**Revisit if:** Public self-service accounts or heavy login traffic appear —
then move to native `bcrypt` or `argon2`.

---

## 2026-09-27 — One public contact record; donation totals are staff-only

**Decision:** Every public phone, email and social URL comes from
`client/src/lib/organisation.ts`. `GET /api/donations/stats` requires an
admin JWT. There is no public “we received X” figure until Communications
asks for one.

**Context:** WhatsApp and the homepage social rail still read a leftover
mock file whose Twitter/Instagram links were the LinkedIn profile. The
footer YouTube button opened youtube.com, not a Caritas channel. Donation
totals sat on an unauthenticated route.

**Trade-offs accepted:** YouTube is omitted until a real channel URL exists.

**Revisit if:** A YouTube channel is confirmed, or the office wants a
published fundraising total on the site.

---

## 2026-10-08 — Production defaults no longer trust every Vercel site or a weak admin

**Decision:** `ALLOW_VERCEL_PREVIEWS` and `RUN_SEEDS_ON_BOOT` default to
false. Preview CORS, when enabled, accepts only `caritas-mutare*.vercel.app`.
The `admin` / `password` user is created only when `NODE_ENV` is exactly
`development` or `test`. Admin search uses `LOWER(...) LIKE` so Postgres
matches the case-insensitive SQLite behaviour. CSV cells that look like
formulas are prefixed with a quote. CI runs the API tests on Postgres.
Every route not on a public allowlist must return 401 without a token.
Production dependencies are the patched releases from `npm audit fix`.
`multer` is removed. The Dockerfile uses Node 20.

**Context:** The blueprint allowed any Vercel hostname and re-ran seeds on
every boot. A missing or mistyped `NODE_ENV` inserted the known password.
Spreadsheet exports would run formulas typed into public forms. Search
tests passed on SQLite and could miss on Neon. Auth depended on route
order with no test.

**Revisit if:** A second Vercel project name is used for previews, or
file uploads are built on storage that survives a restart.

---

## 2026-10-08 — Audit rows are insert-only, and failed logins keep no typed text

**Decision:** `audit_logs` rejects UPDATE and DELETE with a database trigger.
The stored IP is `req.ip` (the address Render's proxy reports), not the
first value in `X-Forwarded-For`. A failed login records `unknown` or the
real account name. It does not record the username that was typed.

**Context:** The header is set by the visitor, so they could write any
address and the log would believe it. People paste passwords into the
username box. "Append-only" was a comment; the same database connection
could change or delete a row.

**Trade-offs accepted:** A failed guess no longer shows which name was
tried. Someone who owns the database can still drop the trigger. The
browser's user-agent string is still whatever the browser sends.

**Revisit if:** Caritas wants a separate database user that cannot drop
triggers, or a published log that must show attempted usernames.

---

## 2026-09-29 — Staff news and programme edits are audited

**Decision:** Creating, updating or deleting a news article or CMS programme,
and updating site settings, writes a row to `audit_logs`. Public news reads
go through `apiGet`, so a failed request is an error rather than an empty
list.

**Context:** The operations console already audited its own changes. News
and programme writes did not, so a staff edit left no trail. News pages
also called `fetch` directly and treated a failed response as success.

**Revisit if:** A public CMS is built and needs a different audit shape.

---

## Open questions — not yet decided

- **Email system status:** Awaiting confirmation from Angela on what system
  Caritas Mutare currently uses for email, to determine whether the contact
  form should integrate with it directly or send to a separate inbox.
- **Payment processor for donations:** Not yet chosen. Needs research into
  what's available/reasonable for a Zimbabwe-based nonprofit receiving
  donations (likely international donors too) — Stripe, PayFast, or similar.
  Deferred until the donations slice is actually being built.
- **Marathon registration process (current state):** Need to confirm with
  Angela's team what they currently use, before deciding if/when to build
  a v2 with real backend registration.

  ## 2026-08-21 — Contact table: keep existing simpler schema, defer enhancements

**Decision:** Use the already-migrated `contact_messages` table as-is
(auto-increment id, no updated_at/ip_address/user_agent) rather than
building the richer schema drafted earlier.

**Context:** Table already exists and matches the working route. Rebuilding
it before launch adds risk and time for fields that aren't launch-critical.

**Revisit if:** Spam becomes a real problem post-launch, or an audit trail
on submissions is specifically requested.