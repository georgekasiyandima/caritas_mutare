# Caritas Mutare — Technical Roadmap

**Owner:** George (Cape Town) • **Partner:** Angela + Caritas Mutare team (Mutare, Zimbabwe)
**Last updated:** 2026-04-22

This document is the single source of truth for where the Caritas Mutare digital
platform is today, where we are taking it, and what we need from the Zimbabwe
team to get there. It is written to be shared with Caritas Mutare leadership.

---

## 1. What we are building

A bilingual (English / Shona) digital platform for **Caritas Zimbabwe — Diocese
of Mutare** that does three jobs:

1. **Public website** — mission, programmes, news, leadership, contact, and a
   donation / volunteer funnel. The storefront of the organisation.
2. **Admin console (CMS + M&E)** — staff sign in to manage projects,
   beneficiaries, activity logs, soup-kitchen records, news articles, and
   (soon) donations. This replaces spreadsheets and gives Caritas Mutare a
   single, auditable record of who we serve and how.
3. **Donation / engagement pipeline** — a branded donate page, pledge capture,
   and (in later phases) online payments, so international and diaspora donors
   can give directly.

The stack is intentionally modern but low-cost to run:

- **Frontend:** React 18 + TypeScript + MUI, deployed to **Vercel**.
- **Backend:** Node.js + Express + Knex, currently using SQLite for development;
  will move to managed Postgres for production.
- **Auth:** JWT with role-based access (admin / staff).
- **Hosting target (production):** Vercel (web) + Render or Railway (API) +
  Neon/Supabase (Postgres) + Cloudflare R2 or AWS S3 (file uploads).

---

## 2. Current status (April 2026)

### Shipped
- Public pages: Home, About, Leadership, Programs (+ programme detail), News
  (+ article detail), Donate, Volunteer, Contact.
- Bilingual UI (EN / SH) with i18next.
- Sticky donate bar, SEO component, partner logo strip, story cards, hero
  banner, transparency block, community-voice block.
- Admin console Wave 1: project CRUD, beneficiaries, activity logs, soup
  kitchen, audit log, CSV export, M&E fields.
- Database migrations for donations pledge fields (ready for payments).
- Deployed on **Vercel** (frontend). Admin API still runs locally for now.

### In flight / known gaps
- **Admin entry point** — was hidden until login; now surfaced in the navbar
  and mobile drawer so staff can find `Staff sign-in` from any page.
- **Backend not yet deployed** — the admin console only works locally until we
  stand up the API service.
- **No production database** — still on SQLite; fine for dev, not for live.
- **No real content** — placeholder stats, stories, and financials. Waiting on
  Angela for real figures, testimonials, and documents.
- **No transactional email** — contact/volunteer/donation forms don't email
  anyone yet.
- **No online payments** — the donate page captures intent but doesn't yet
  charge a card.

---

## 3. Roadmap — phased delivery

### Phase 1 — Production-ready public site *(2–3 weeks)*
Goal: a site Caritas Mutare can confidently share with donors and the media.

| Item | What | Status |
|------|------|--------|
| Real content | Replace placeholder copy, stats, stories, financial figures | **Needs Angela** |
| Logo & brand assets | High-res logo, brand colours confirmed, photo library | **Needs Angela** |
| Legal pages | Privacy policy, terms, donor protection statement | George drafts, Mutare approves |
| Custom domain | Point `caritasmutare.org` (or chosen domain) at Vercel | **Needs Mutare** (DNS access) |
| Email infrastructure | `admin@caritasmutare.org`, `info@…`, `donate@…` | **Needs Mutare** (see §5) |
| Transactional email | Forms (contact, volunteer) send to Mutare inbox via Resend/Postmark | George builds |
| SEO + analytics | Google Search Console, Google Analytics 4, sitemap, robots.txt | George builds |
| Accessibility pass | Alt text, colour contrast, keyboard nav | George builds |

### Phase 2 — Backend + admin console in production *(2–3 weeks)*
Goal: Mutare staff can sign in from any computer and manage the platform.

| Item | What |
|------|------|
| Deploy API | Render or Railway (free/low tier), behind HTTPS |
| Managed Postgres | Neon (free tier) or Supabase; migrate from SQLite |
| File storage | Move `uploads/` off the server to Cloudflare R2 / S3 |
| Staff accounts | Create per-user accounts for Angela + team, define roles |
| Training | Short Loom walkthrough + one live session with Angela |
| Backups | Nightly DB snapshots + retention policy |

### Phase 3 — Donations & engagement *(3–4 weeks)*
Goal: accept real donations from anywhere in the world.

| Item | What |
|------|------|
| Payment provider | **Stripe** (international cards, ZAR/USD) + **PayFast** or **Paynow** for local ZIM |
| Donation flow | One-time + recurring, with receipt email and admin dashboard tile |
| Pledges | Capture pledge amounts without charging (already half-built) |
| Donor CRM-lite | Per-donor history in admin console, CSV export for reporting |
| Gift Aid / tax receipts | Automated PDF receipts (design review with Angela) |
| Donor newsletter | Simple Mailchimp/Buttondown integration, double opt-in |

### Phase 4 — Storytelling & transparency *(ongoing)*
Goal: turn the site into a living report, not a brochure.

| Item | What |
|------|------|
| Impact dashboard (public) | Live counters fed from admin data: beneficiaries, meals served, projects active |
| Financial transparency | Upload annual reports, audited financials, project budgets — viewable on the site |
| Story library | Angela + team publish beneficiary stories from the admin console |
| Media library | Photo / video gallery with proper consent tagging |

---

## 4. Hosting — where things live

| Layer | Provider | Plan | Est. monthly cost |
|-------|----------|------|-------------------|
| Frontend (web) | **Vercel** | Hobby → Pro when traffic grows | $0 → $20 |
| Backend API | **Render** (or Railway) | Starter | $7 |
| Database | **Neon** Postgres (or Supabase) | Free tier is enough for year 1 | $0 → $19 |
| File storage | **Cloudflare R2** | Pay as you go | <$5 |
| Domain | Registrar (Namecheap / GoDaddy) | Annual | ~$15/yr |
| Email sending | **Resend** or **Postmark** | 3k emails/mo free → $10 | $0 → $10 |
| Email inboxes | **Google Workspace** | Nonprofit plan (free via TechSoup) | $0 if approved |
| Monitoring | **Sentry** (errors) + **UptimeRobot** | Free tiers | $0 |

**Realistic year-1 running cost:** roughly **$10–$40 / month** once we move off
free tiers, assuming Google Workspace for Nonprofits is approved.

> **On Vercel auto-redeploy:** yes — every `git push` to the `main` branch on
> GitHub triggers a fresh production build on Vercel within ~2 minutes. A local
> `git commit` alone does **not** redeploy; the commit must be pushed.

---

## 5. Email infrastructure — what we need from Mutare

Two separate things are often confused; we need **both**:

### (a) Inbox email — "what the team reads and sends from"
- Examples: `admin@caritasmutare.org`, `angela@caritasmutare.org`.
- Best option: **Google Workspace for Nonprofits** (free for approved NGOs via
  Google.org / TechSoup). Gives the team Gmail, Calendar, Drive, Meet under
  the `@caritasmutare.org` domain.
- Decision needed: does Caritas Mutare already have Workspace? If yes — we
  just add `info@`, `donate@`, `volunteer@` aliases. If no — I can help
  Angela apply.

### (b) Transactional / system email — "what the website sends automatically"
- Used for: contact form submissions, volunteer applications, donation
  receipts, admin password resets.
- Best option: **Resend** or **Postmark**. Free tier covers ~3,000 emails/month.
- Needs: DNS records (SPF, DKIM, DMARC) on `caritasmutare.org` so emails don't
  land in spam. I'll provide the exact records; Mutare's domain admin pastes
  them in.

---

## 6. What we need from Caritas Mutare (checklist for Angela)

### Access & accounts
- [ ] Confirmation of preferred domain (`caritasmutare.org`?) and DNS admin contact.
- [ ] Is there already a Google Workspace account for the domain? If yes — we
      need an admin invite. If no — let's start the Workspace for Nonprofits
      application together.
- [ ] List of staff who need admin console logins (name, role, email).

### Content (real data replaces placeholders)
- [ ] **Project figures** — for each active programme: beneficiary counts,
      districts covered, funding partner, start/end dates, current status.
- [ ] **Family / beneficiary stories** — 6–10 short testimonials (80–150
      words each), with a first name, village, and a photo if consent given.
      We'll provide a simple consent form template.
- [ ] **Impact stats** — headline numbers for the homepage (e.g. "X meals
      served in 2025", "Y households supported").
- [ ] **Leadership bios & photos** — name, title, 2-sentence bio, headshot.
- [ ] **Partner logos** — high-resolution PNG/SVG.
- [ ] **Photo library** — 30–50 high-quality field photos, ideally with
      captions and consent tags.

### Financial transparency
- [ ] **Most recent annual report** (PDF) — we'll host it on the site.
- [ ] **Audited financials** for the last 1–2 years if available.
- [ ] **Programme budgets** — even a one-page summary per programme is
      valuable.
- [ ] **Banking details for donations** — bank name, account name, SWIFT,
      mobile-money (EcoCash) if used. This goes on the donate page for
      donors who prefer direct transfer.
- [ ] **Registration / legal docs** — NGO registration certificate, tax
      status — one-line mention on the site builds donor trust.

### Brand
- [ ] High-resolution logo (SVG + PNG).
- [ ] Brand colours (we're currently using a burgundy `#7D0000` — confirm or
      correct).
- [ ] Any existing brand guideline document.

---

## 7. Risks & open questions

- **Donation acceptance in-country.** Stripe doesn't operate in Zimbabwe; we
  will route international donations via Stripe to a South African or partner
  account, and local ZW donations via Paynow/EcoCash. Needs legal/finance
  sign-off from Mutare.
- **Data protection.** Beneficiary data (names, addresses, disability status)
  is sensitive. We're using auth + audit logs. Before going live we should
  agree on a short data policy with Mutare.
- **Backups & continuity.** Once in production we need a named person in
  Mutare who has recovery credentials in a sealed envelope.
- **Bandwidth in Mutare.** Admin console is built to be light, but we should
  test it on a Mutare connection before training day.

---

## 8. Communication cadence

- **Weekly async update** — George → Angela, Mondays, written.
- **Bi-weekly call** — 30 min, George + Angela, screen-share demo.
- **Shared folder** — Google Drive (once Workspace is sorted) for content
  drops and document review.
- **Issue tracker** — GitHub Issues on the repo; Angela can watch without
  needing to code.

---

*Prepared by George Kasiyandima (Ubuntu Tech) for Caritas Zimbabwe — Diocese of Mutare.*
