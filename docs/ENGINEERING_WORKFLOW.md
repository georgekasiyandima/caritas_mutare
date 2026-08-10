# Caritas Mutare - Engineering Workflow and Development Roadmap

**Owner:** George Kasiyandima  
**Project:** Caritas Mutare digital platform  
**Last updated:** 2026-07-18  
**Audience:** Engineering, product, Caritas Mutare stakeholders

This document is the working engineering plan for building the Caritas Mutare
platform in a professional, handover-friendly way. It complements
`docs/ROADMAP.md`, which is stakeholder-facing. This document is for how we
will actually plan, code, review, test, deploy, and maintain the product.

---

## 1. Engineering Principles

We will build the project as a production system, not as a quick demo.

1. **Protect trust first.** Caritas Mutare handles donor, volunteer, staff, and
   beneficiary information. Security, privacy, auditability, and clear data
   ownership matter more than speed.
2. **Keep the architecture simple.** A modular monolith is the right shape for
   this stage. We will not introduce microservices until there is a real scale
   or team reason.
3. **Prefer boring, reliable tools.** React, Express, Postgres, object storage,
   CI, monitoring, and backups are enough for the next stage.
4. **Make every change reviewable.** Work should be scoped, named, tested, and
   documented so another engineer can understand it later.
5. **No hidden production knowledge.** Deployment steps, credentials ownership,
   backup process, and operational decisions must be documented.
6. **Ship in thin vertical slices.** A feature is not done when the UI exists;
   it is done when UI, API, validation, storage, errors, tests, and docs are
   coherent.

---

## 2. Working Style

### Branching

Use short-lived branches. Do not work directly on `main`.

Branch naming:

- `feat/<short-name>` for features
- `fix/<short-name>` for bug fixes
- `chore/<short-name>` for maintenance
- `docs/<short-name>` for documentation
- `test/<short-name>` for test-only changes

Examples:

- `feat/contact-form-api`
- `fix/admin-route-order`
- `chore/github-actions-ci`
- `docs/domain-registration-plan`

### Commits

Use conventional commits:

- `feat: connect volunteer form to API`
- `fix: move analytics routes before id routes`
- `chore: add client build check to CI`
- `docs: add engineering workflow`

### Pull Request Standard

Every pull request should include:

- What changed
- Why it changed
- Screenshots or short screen recording for UI work
- Test evidence
- Deployment or migration notes
- Follow-up work, if any

PRs should stay small enough to review in one sitting. If a change touches UI,
API, database, and deployment at once, split it unless the feature cannot be
tested otherwise.

---

## 3. Definition Of Ready

A task is ready to start when:

- The user or stakeholder problem is clear.
- Acceptance criteria are written.
- Any required content, credentials, or decisions are available.
- Security and data privacy impact is understood.
- The expected test approach is clear.

If a task requires an external decision, split it into:

1. A technical preparation task we can do now.
2. A final integration task once the decision arrives.

---

## 4. Definition Of Done

A task is done when:

- The feature works in the browser and through the API.
- Loading, error, empty, and success states are handled.
- Validation exists on both client and server where relevant.
- Sensitive actions are authenticated and authorized.
- Data is stored in the right place.
- Tests cover the risky behavior.
- Build and lint checks pass.
- Documentation is updated if behavior or operations changed.
- The change can be handed to another engineer or Caritas staff member without
  relying on memory.

---

## 5. Environments

### Local development

Purpose: fast iteration.

- React dev server
- Express API
- SQLite or local Postgres
- Seed admin account
- Test data only

### Staging

Purpose: realistic testing before production.

- Vercel preview or staging project
- Render/Railway/Fly staging API
- Separate Postgres database
- Separate email sender/test mode
- No real beneficiary data unless explicitly approved

### Production

Purpose: live public website and staff operations.

- Vercel production site
- Managed API host
- Managed Postgres
- Cloudflare R2 or equivalent object storage
- Transactional email
- Monitoring, backups, and rollback process

Production must not depend on local machines, local SQLite files, or one
person's private accounts.

---

## 6. Quality Gates

Before production deploy:

- Client build passes.
- Server tests pass.
- Database migrations run successfully.
- No known high-severity security issue remains open.
- Forms have real error handling.
- Admin routes are protected.
- Environment variables are documented.
- Backups are enabled.
- Monitoring is enabled.
- Rollback path is known.

Minimum automated checks to add:

- `npm run build` for the client
- TypeScript check
- ESLint check
- Server unit/integration tests
- API smoke tests
- Migration test against a clean database
- Dependency vulnerability audit
- Playwright smoke tests for homepage, donate, contact, volunteer, and admin
  login

---

## 7. Development Roadmap

### Phase 0 - Engineering foundation

Goal: make development disciplined and repeatable.

- Add this engineering workflow.
- Fix documentation index drift.
- Add GitHub Actions CI.
- Add a PR checklist.
- Confirm branch and commit conventions.
- Add issue labels: `p0`, `p1`, `p2`, `frontend`, `backend`, `security`,
  `devops`, `docs`, `content`, `blocked`.

### Phase 1 - Production blockers

Goal: remove issues that would make production unreliable.

- Fix route ordering bugs in donations, volunteers, and news.
- Convert SQLite-specific analytics SQL to Postgres-safe Knex queries.
- Add Vercel `/api/*` rewrite once the production API URL is known.
- Fix Docker healthcheck.
- Clamp pagination limits on legacy routes.
- Add server-side validation for all public mutation routes.
- Add smoke tests for health, auth, forms, and admin overview.

### Phase 2 - Real engagement flows

Goal: make public forms actually useful.

- Connect contact form to backend.
- Connect volunteer form to backend.
- Connect donation pledge form to backend.
- Add transactional email notifications.
- Add success/error states that match real server responses.
- Add spam protection and per-route rate limits.
- Add admin views for reviewing submissions where missing.

### Phase 3 - Backend and admin production deploy

Goal: make the admin console usable by Caritas staff from any computer.

- Provision production Postgres.
- Deploy API to Render/Railway/Fly.
- Run migrations.
- Bootstrap first admin securely.
- Connect Vercel to API.
- Configure CORS for final domains only.
- Enable monitoring and uptime checks.
- Create staff accounts and train users.

### Phase 4 - Security hardening

Goal: protect staff, donor, volunteer, and beneficiary data.

- Strengthen password policy.
- Add account recovery or admin-managed reset.
- Review JWT storage and session lifetime.
- Add granular roles beyond `admin`.
- Add explicit Content Security Policy.
- Add audit alerts for sensitive actions.
- Document data retention and privacy policy.
- Move file uploads to object storage before real documents are uploaded.

### Phase 5 - Public trust and content

Goal: make the public site credible for donors and partners.

- Replace placeholder stats with sourced numbers.
- Add leadership bios and photos.
- Add annual reports and financial transparency content.
- Add partner logos and programme evidence.
- Add privacy policy, donor statement, and terms.
- Add sitemap and robots.txt.
- Add Search Console and analytics.
- Run accessibility pass.

### Phase 6 - Donations and donor operations

Goal: safely support real donations.

- Confirm finance/legal ownership of payment accounts.
- Choose payment provider(s).
- Add payment webhooks.
- Add donor receipts.
- Add donation admin dashboard.
- Add donor export/reporting.
- Add reconciliation workflow.
- Add recurring giving only after one-time donations are stable.

### Phase 7 - Reporting and scale

Goal: turn operational data into impact reporting.

- Public impact dashboard.
- Project-level impact reports.
- CSV/PDF exports.
- Background jobs for heavy exports and emails.
- More indexes and query performance review.
- Backup restore drills.
- Staff training refresh.

---

## 8. First Engineering Sprint

Recommended first sprint length: 1 week.

Sprint goal: make the codebase safer to deploy and easier to work on.

Tasks:

1. Add CI workflow for client build and basic server checks.
2. Fix route ordering bugs.
3. Fix Docker healthcheck or remove broken healthcheck until implemented.
4. Add server tests for affected routes.
5. Add a public contact-message POST endpoint.
6. Connect contact form to the real endpoint.
7. Document required environment variables for local and production.

Out of scope for Sprint 1:

- Online payments
- Full donor CRM
- Object storage migration
- Major UI redesign
- Large refactors that do not unblock production

---

## 9. Meeting Cadence

For a professional workflow:

- Weekly planning: choose sprint goal and tasks.
- Mid-week check: blockers and review progress.
- End-week demo: show working software, not just code.
- Retrospective: what slowed us down, what to improve.

For stakeholder communication:

- Send Angela a short weekly update.
- Keep technical detail internal unless a decision is needed.
- Separate "needs Caritas input" from "engineering in progress".

---

## 10. Handover Standard

Before handover, the project should include:

- Setup guide
- Deployment runbook
- Environment variable reference
- Domain/DNS ownership notes
- Backup and restore instructions
- Admin user guide
- Troubleshooting guide
- Architecture overview
- Security and data protection notes

The goal is that Caritas Mutare is not locked into one developer. Another
engineer should be able to understand, run, deploy, and support the platform.

