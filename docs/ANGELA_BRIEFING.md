# Caritas Mutare Digital Platform — Update for Angela

**From:** George (Cape Town)
**To:** Angela, Caritas Zimbabwe — Diocese of Mutare
**Date:** April 2026

Dear Angela,

Here's a short, non-technical update on where we are with the Caritas Mutare
website and admin system, and what I'll need from your side in the next few
weeks to get us fully live.

---

## 1. What's ready to look at

The public website is already deployed and running on Vercel. It includes:

- A bilingual (English / Shona) homepage, About, Leadership, Programmes, News,
  Donate, Volunteer, and Contact pages.
- A sticky "Donate" button and a cleaned-up navigation that works on both
  desktop and mobile.
- A Staff Sign-in entry point (top-right admin icon, and also in the footer)
  so the Caritas Mutare team can log into the admin console from anywhere.

Behind the website there is now an **admin console** where the team can:

- Add and update **projects / programmes** (with status, funding partner,
  district, M&E fields).
- Register **beneficiaries** (individuals and households) with disability
  inclusion fields.
- Capture **activity logs** — what was done, when, by whom.
- Record **soup kitchen** entries (meals served, attendance).
- Export data to **CSV** for reporting.
- See an **audit log** of who changed what (for accountability).

Everything is protected behind a staff login.

---

## 2. What's still placeholder (and where you come in)

Right now the site shows example numbers, example stories, and example partner
logos. To launch properly and share it with donors, we need the **real**
content. This is the single biggest thing blocking go-live.

Please could you help us pull together:

### Programme information
For each active programme, a short paragraph describing:
- What it does
- Where it operates (districts / wards)
- Current funding partner(s)
- Beneficiary numbers so far
- Start date and current status (planning / active / completed)

### Family & beneficiary stories
6 to 10 short testimonials (around 80–150 words each) — real stories of
individuals or households the programmes have helped. If you can include:
- First name (or a chosen name, if consent for real name isn't given)
- Village / area
- A photo (only if the person has given consent)

I'll send you a simple one-page consent form template that your field officers
can use.

### Headline impact numbers
The kind of figures we'd put on the homepage, for example:
- "X meals served in 2025"
- "Y households supported"
- "Z children reached through education programmes"

Even rough but defensible numbers are fine — we can refine them later.

### Leadership
Name, title, a two-sentence bio, and a headshot for each member of the
leadership team you'd like featured.

### Brand assets
- High-resolution logo (SVG or PNG)
- Confirmation of brand colours (we're using a burgundy tone right now)
- 30–50 good field photos, ideally captioned

---

## 3. Financial transparency — what should go on the site

Donors — especially international ones — increasingly expect to see financial
transparency before they give. If you can share any of the following, we will
host them on the site in a dedicated "Accountability" section:

- **Latest annual report** (PDF)
- **Audited financial statements** for the last 1–2 years
- **Programme budgets** — even a one-page summary per programme
- **NGO registration certificate** and tax status — just a mention builds trust
- **Banking details for donations** — bank name, account name, SWIFT code,
  and mobile-money (EcoCash etc.) if the office uses them. This goes on the
  donate page for donors who prefer direct transfer over card payments.

If some of these documents aren't ready to be public yet, that's fine — share
them with me privately and we'll decide together what to publish.

---

## 4. Email and domain — a small but important decision

Two things we need to sort out on the Caritas Mutare side:

1. **The domain.** I'm assuming `caritasmutare.org` (or similar) — could you
   confirm the exact domain you want, and who on your side has access to its
   DNS settings? I'll need them to add a few records so the site and emails
   work reliably.
2. **Email inboxes.** Does Caritas Mutare already use Google Workspace (Gmail
   under your own domain, e.g. `angela@caritasmutare.org`)? If yes, great —
   we just add a couple of aliases like `info@`, `donate@`, `volunteer@`.
   If no, Google runs a **Workspace for Nonprofits** programme that gives
   qualifying organisations Gmail / Drive / Calendar for free. I'm happy to
   help you apply if that would be useful.

Separately, the website itself needs to send automated emails (contact form
notifications, donor receipts, volunteer applications). I'll wire that up on
my side using a service called Resend — you won't have to manage it, but it
does need those DNS records to be in place.

---

## 5. Hosting & running costs — so there are no surprises

The platform is deliberately built on low-cost modern infrastructure. Realistic
monthly running cost, once we are fully live, is roughly **USD 10–40 / month**,
covering:

- Web hosting (Vercel)
- API hosting (Render)
- Database (Neon Postgres)
- File storage (Cloudflare R2)
- Transactional email (Resend)
- Monitoring (Sentry, UptimeRobot)

Domain renewal is roughly **USD 15 / year**. Google Workspace is free if the
nonprofit application is approved.

I'll put everything in my name initially so we can move fast, and we'll
transfer ownership to Caritas Mutare accounts once the Workspace and billing
are set up on your side.

---

## 6. What happens next (next 4–6 weeks)

1. **You (Angela):** share the content listed in §2 and §3 above, as and when
   you can. Even partial drops are useful — we can add content in waves.
2. **Me:** finish the production backend, connect the admin console to a
   managed database, and wire up email + payments.
3. **Together:** a 30-minute screen-share call once I push the admin console
   live, so I can walk you and anyone else on the team through using it.
4. **Go-live:** point the `caritasmutare.org` domain at the new site and
   announce it.

---

## 7. A note on working style

I'm based in Cape Town; you're in Mutare. To keep us on the same page:

- I'll send you a **short written update every Monday**.
- Let's schedule a **30-minute call every two weeks** to demo progress and
  unblock anything.
- For anything urgent in between, WhatsApp is fine.

---

Please let me know if any of this raises questions, or if there's context I'm
missing about how Caritas Mutare wants to present itself. You know the
organisation and the community; I'm here to turn that into a working digital
platform.

Looking forward to the next step.

Warm regards,
**George**
Ubuntu Tech & Code
