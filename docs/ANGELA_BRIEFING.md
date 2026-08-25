# Caritas Mutare Digital Platform — Update for Angela

**From:** George (Cape Town)
**To:** Angela, Caritas Zimbabwe — Diocese of Mutare
**Date:** April 2026

Dear Angela,

Here's a short, non-technical update on where we are with the Caritas Mutare
website and admin system, and what I'll need from your side in the next few
weeks to get us fully live.

A quick framing note first: this is **Caritas Mutare's first website**, so
we're building from a clean slate. That's a good thing — we don't have to
unpick anything old — but it does mean we should ship something real and
modest first, let the team live with it for a few weeks, and then grow it.

---

## 1. What's ready to look at — public preview

The **public website** is deployed to Vercel and you can share the link with
colleagues for feedback. It includes:

- A bilingual (English / Shona) homepage, About, Leadership, Programmes, News,
  Donate, Volunteer, and Contact pages.
- A sticky "Donate" button and clean navigation on both desktop and mobile.
- A Staff Sign-in entry point in the top navigation for when the admin
  console goes live (see §2 below).

**Please note:** what's live right now is the *public-facing* site only.
The Sign-in button is visible but will not work yet — that's the next wave of
work (about 2–3 weeks from now, see §2). For now, please treat the Vercel
link as a **preview** and send me any feedback on wording, layout, images or
flow.

The admin console — where the team will eventually be able to:

- Add and update **projects / programmes** (status, funding partner,
  district, monitoring & evaluation fields).
- Register **beneficiaries** (individuals and households) with disability
  inclusion fields.
- Capture **activity logs** — what was done, when, by whom.
- Record **soup kitchen** entries (meals served, attendance).
- Upload **photos and documents** for news articles and reports.
- Export data to **CSV** for reporting.
- See an **audit log** of who changed what (for accountability).

— is fully built but not yet connected to the production server. That's the
next piece of work I'm starting on.

---

## 2. What's still placeholder (and where you come in)

Right now the site shows example numbers, example stories, and example partner
logos. To launch properly and share it with donors, we need the **real**
content. This is the single biggest thing blocking go-live.

Please could you help us pull together:

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

## 4. Email and domain — what I already know, and what I still need from you

Good news: the domain `caritasmutare.org` is already registered and the
`admin@caritasmutare.org` mailbox is already working. From the public DNS I
can see that the domain, DNS and email are all hosted with **Utande** (the
Zimbabwean ISP), which is completely fine. The small implication is that
whenever we make changes on the website side, we have to be careful not to
touch anything that affects email.

To plan the go-live properly, could you confirm the following on your side:

1. **Utande control-panel access** — who in Mutare has login credentials to
   the Utande portal where the domain, DNS and `admin@` mailbox live? When we
   point `www.caritasmutare.org` at the new site, that person (or I, with
   temporary access) will need to add **one DNS record**. MX and email
   records stay untouched.
2. **Existing mailboxes** — besides `admin@caritasmutare.org`, are there any
   other inboxes already in use (e.g. `info@`, `angela@`, `donate@`)? This
   affects what we put on the "Contact" page.
3. **Domain registration** — who is listed as the registrant, and when does
   the domain renew? (Visible inside the Utande portal.) I just want to make
   sure it won't silently expire on us.
4. **Email upgrade — optional, no rush** — Utande mail works, but many
   nonprofits eventually move to **Google Workspace for Nonprofits** (free if
   approved). It gives you Gmail under your own domain, shared Drive,
   Calendar, Meet — things that make team collaboration a lot smoother.
   Happy to apply for this on Caritas Mutare's behalf if and when you're
   interested; not urgent.

Separately, the website itself needs to send automated emails (contact-form
notifications, donor receipts, volunteer applications). I'll wire that up on
my side using a service called **Resend**. It adds a couple of DNS records
(again, not touching your email MX) and you won't have to manage it.

---

## 5. How content & media will be managed (before and after go-live)

A common concern I want to answer up front: *"once the site is live, how does
the team actually add new stories, photos and reports?"*

The answer depends on the stage we're in. We'll work in three clear phases:

### Phase 1 — Pre-launch (now → first content drop)
You and your field officers drop content into a **shared Google Drive
folder** I'll set up for Caritas Mutare, structured by programme and news
item. That includes photos, one-paragraph summaries, testimonials, and any
documents. I'll then optimise the images, polish the copy lightly, and
publish it onto the site from my end. This keeps things simple while the
team gets used to the look and feel, and it lets me catch any issues with
image quality or consent before anything goes public.

### Phase 2 — After go-live (normal operations)
Once the admin console is connected, Caritas staff log in at
`caritasmutare.org/admin` and:

- Create or edit news articles, projects, team members, soup-kitchen entries
  etc. directly through friendly forms.
- **Upload photos and documents** through an upload button — no need to
  email files to me. These are stored on a professional file-storage service
  (Cloudflare R2) which is fast and free up to 10 GB.
- Save as **Draft** first, review, then **Publish** when ready.

I'll run a 30-minute training session for 2–3 people, and I'll leave a
short **"How to publish a news article" PDF + video** in the admin so new
staff can learn without needing me.

### Videos
We will **not** host videos on the website itself — it's expensive and
slow. Videos go on the **Caritas Mutare YouTube channel**, and the website
embeds them from there. Same pattern used by UNICEF, CAFOD and Caritas
Internationalis.

### Photo + consent basics
I'll send a one-page guide, but the short version is:

- Ideally landscape, at least 1600 pixels wide.
- File names like `chimanimani-food-distribution-2025-03.jpg` (not
  `IMG_4712.HEIC`) — this helps us find things later.
- For any photo where a person's face is identifiable, we need a signed
  consent form on file. I'll provide a template.

---

## 6. Hosting & running costs — so there are no surprises

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

## 7. What happens next (realistic 4–6 week plan)

**Week 1–2 (me):**
- Deploy the backend to a production server (Render), with a managed
  Postgres database (Neon) and file storage (Cloudflare R2).
- Connect the admin console to the deployed backend.
- Create real admin accounts for you and one colleague.

**Week 1–4 (you):**
- Share the content listed in §2 and §3 above, as and when you can. Even
  partial drops are useful — we can publish in waves.
- Confirm the Utande portal access and mailbox questions in §4.
- Send me the logo, brand colours, and 30–50 field photos.

**Week 3–4 (together):**
- A 30-minute screen-share call once the admin is live so I can walk you
  and 1–2 colleagues through using it.
- First wave of real content published (a few programmes + a handful of
  stories).

**Week 4–6 (together):**
- Add the final DNS record so the site goes live at
  `www.caritasmutare.org`.
- Announce the launch to partners and donors.

Nothing here is rigid — if real content takes longer than expected, we push
the announcement. A quiet, complete site is better than a loud, empty one.

---

## 8. What changed in this second preview (from your feedback)

Thank you for the first round of feedback. Everything on the list below is now
in place on the preview link — please have a fresh look and confirm I've
captured it correctly.

**Homepage**
- Caritas name on the hero now reads **"Caritas Zimbabwe Roman Catholic Diocese of Mutare"**.
- Removed "Catholic community development organization". Added the tagline
  **"Development arm of the Catholic Church and humanitarian response."**
- Supported-by strip now shows **Caritas Mutare, CRS, Trócaire, CCJP Mutare
  Diocese, Zimbabwe Government** — Irish Aid is no longer on the public strip.
- Impact figures now read **Lives impacted 500,000+ · Families served 50,000+ ·
  Communities reached 100+ · Years of service 50+**.

**About page**
- Mission sentence now reads *"…for the vulnerable — men, women, boys and girls,
  inclusive of persons with disabilities — in a sustainable manner within the
  Diocese of Mutare."*
- Values card uses **"Catholic social teachings"** (not "tradition").
- Thematic areas now include **"Including persons with disabilities in
  humanitarian response and livelihoods"** as a distinct line.
- Sister-organisation list updated: removed ZWLA, Fambidzanai, Women and Land
  in Zimbabwe, FODPZ. Added **Catholic Commission for Justice and Peace in
  Zimbabwe, Mutare Diocese Safeguarding Office, Mutare Diocese Health
  Commission, Mutare Diocese Education Commission**.

**Leadership page**
- The Development Coordinator card no longer shows a personal name (it will
  remain generic until we have an up-to-date team sheet from you).
- The "Own projects" card uses the generic wording you asked for:
  *"Caritas Mutare also has its own projects with initiatives such as Mai
  Maria Village, the Soup Kitchen and education support…"*
- Added an explicit **Board of Directors** block explaining that Caritas Mutare
  is governed by **7 members — Chairperson and Vice-Chairperson, Secretary and
  Vice-Secretary, Treasurer, and two Committee Members.**

**Visuals**
- The Caritas logo is larger in the top navigation (heights bumped from ~48px
  up to 72–80px on desktop) so it reads as the primary brand mark rather than
  an afterthought.
- Four of the new soup-kitchen photos you shared are now:
  - Used as the **soup-kitchen programme hero image**,
  - At the front of the **soup-kitchen gallery**,
  - Interleaved into the **homepage "Our impact" carousel**.

**Contact / Footer**
- Address on the Contact page and footer now reads
  **Mai Maria Village · Stand No. 19449, Dangamvura Township · Triangle of
  Raheen, Mutare District · Zimbabwe**.
- Primary contact email is **admin@caritasmutare.org**.
- Opening hours shown as **Mon – Thu 08:00 – 16:45** and **Fri 08:00 – 13:00**.

If any of the above reads wrong to you, send me the exact wording you prefer
and I'll swap it in.

---

## 9. Logo — getting a clean, professional SVG

You mentioned the free online tools aren't producing a usable SVG. That's
normal — auto-tracers guess at curves and almost always ruin the geometry on a
logo with text, rays or a chalice. Here's the recommended route, in order of
effort:

**Option A (best — one-off, ~USD 50–100):**  
Brief a freelance designer on **Fiverr** or **99designs** with:
1. The highest-resolution PNG of the current Caritas Mutare logo you can find
   (a scan of a printed letterhead works).
2. A sentence of instruction: *"Please redraw this as a clean vector (SVG)
   logo. Deliver SVG, PNG with transparent background at 2048px, and a
   monochrome (white) version for dark backgrounds. Keep the typography and
   the chalice faithful to the original."*
3. Brand colours (we've inferred forest-green `#1b6e4a` and warm-gold `#c49a2a`
   from the current PNG — confirm with your team).

Expected turnaround: 3–5 days. They'll send vector files; I drop them into the
site and the difference is dramatic.

**Option B (free, if there is an original file somewhere):**  
Ask your predecessor or the Diocese communications office whether the logo was
ever designed in **Adobe Illustrator, CorelDRAW or Inkscape**. That source
file (`.ai`, `.cdr`, `.svg`) is the gold standard — we never need to redraw it.

**Option C (stop-gap, free, I can do it):**  
I can clean up the existing PNG (remove the white background, sharpen edges,
export at higher resolution) so the site looks better in the meantime. It
won't be a true vector, but it will stop looking pixellated on large screens.
Say the word and I'll do this in a day.

What I'd avoid:
- Free "PNG → SVG" converters (Vectorizer, Adobe Express auto-trace, etc.) for
  final use. Fine for sketches; terrible for a published brand mark.
- AI logo generators (Looka, Tailor Brands, Canva). They'll produce something
  *new* that drifts from Caritas Mutare's actual identity — not what we want.

My suggestion: **start Option A in parallel with everything else**. Three to
five days from brief to delivery means we can have a proper SVG on the site
before the public launch, without it blocking anything.

---

## 10. A note on working style

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
Ubuntu Tech & Code - Full Stack Software Engineer.
