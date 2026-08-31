# Weekly note for Angela and the Caritas Mutare team

**Week of 24–30 August 2026 · note dated 31 August 2026**  
For sharing internally. Public site: **https://caritas-mutare.vercel.app**  
We are still waiting on Utande for `www.caritasmutare.org`. Email is unchanged.

---

## What we were trying to get working (plain language)

The website you see is one machine. The list of staff users, volunteer
applications, contact messages and donation pledges lives on another. Sign in
and the forms only work when the first machine actually asks the second.

That path is now open. Staff can sign in on the Vercel site. A volunteer who
submits the form is stored in the database and shows on the staff dashboard
under **Volunteers** — even though automatic email is not set up yet. Staff
must open the dashboard to see new requests.

---

## Done last week

- Connected the live site to the live database (Neon) through the API (Render).
- Staff sign-in on https://caritas-mutare.vercel.app.
- Public forms write to the database: **Contact**, **Volunteer**, **Donate**
  (Donate is a **pledge** — a promise to give — not a card payment).
- Partner list and donation amounts as you asked (CAFOD, CBM Global, Misereor,
  CRS, Trócaire, Government of Zimbabwe, Caritas Zimbabwe National Office).
- Charity 21km Marathon page with race photographs.
- DNS letter prepared for Utande: website records only. **Mail MX must not
  change.** Public enquiries stay **admin@caritasmutare.org**.

---

## This week (31 August – 6 September)

On the site (this round):

- Our own logo is **no longer** listed among strategic partners. We are the
  host; partners are the organisations we work with.
- Marathon photograph on the home page now carries the same kind of caption as
  the project pictures (21 km, USD 20, Soup Kitchen).
- Bishop Paul Horan’s studio portrait is on **Leadership**, shown as a full
  picture so the coat of arms is not cropped.
- Header logo no longer sits on a white rectangle over the home-page photo.
- Staff dashboard shows counts waiting: unread messages, volunteer
  applications, donation pledges.

Still this week on our side:

- Walk the live site after this deploy and confirm forms appear in the
  dashboard.
- Change the first staff password and keep it in the password manager.
  Do not put passwords in email or WhatsApp.
- Send (or follow up) the Utande letter if it has not gone.

---

## What we need from you

- Confirm Bishop Horan’s portrait on Leadership is the one to keep.
- Marathon: date and route when you have them — the page currently says
  “to be announced”.
- Named leadership photos (Coordinator and others) when you are ready.
  Titles without names are honest; we will not invent names.
- Utande: please chase the website DNS only. If they ask about email, the
  answer is **do not change mail**.

---

## What is not in this launch (on purpose)

- No live EcoCash / Visa checkout. A pledge is recorded; staff follow up.
- No automatic email when someone submits a form. The dashboard is the inbox.
- The public address stays `caritas-mutare.vercel.app` until Utande points
  `www.caritasmutare.org` at it.

---

## Towards go-live (end of September)

| When | What |
|------|------|
| This week | This site update live; staff using the dashboard for real enquiries |
| When Utande replies | We check DNS, then add `www.caritasmutare.org` as the public address |
| After DNS is correct | Optional: automatic email (later). Not required to go live. |

Thank you. We will send another short note at the end of this week.
