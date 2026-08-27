# Email, domain, and going live — briefing for Caritas Mutare

For Angela and the Caritas Mutare team.

This is a short briefing on **email and the website domain** before go-live.
The first half records what you have already decided. The second half is
what we still need from **Utande**, so mail is not put at risk when the new
site goes live.

---

## Decisions already made

Thank you — this is enough to start shaping a proper digital footprint.

- **Public enquiries:** `admin@caritasmutare.org` is the address the public
  should use. It is what we will show on the Contact page, footer, donate
  and volunteer pages.
- **`egumbeze@caritasmutare.org` comes off the public website.** It becomes
  an internal / admin mailbox only, like the other named staff addresses.
  That change is already being made in the site code.
- **Staff / admin mailboxes to have (internal, not on the website):**
  - `meal@caritasmutare.org`
  - `tsitsi@caritasmutare.org`
  - `egumbeze@caritasmutare.org`

Named people should never be the public face of the organisation’s email.
If someone leaves or changes role, the website would otherwise have to
change. Role addresses stay; people move behind them.

---

## Recommendation: how to set mail up professionally

Caritas suggested a public set of `donate@`, `volunteer@`, `info@` and
`admin@`. Here is a clear recommendation you can approve or adjust.

**Show the public one address: `admin@`.**  
You have already chosen this for enquiries. That is the polished approach.
Visitors should not have to guess which inbox to write to. `info@` on the
website as well as `admin@` would duplicate the same work and split
attention.

**Still create `donate@` and `volunteer@` — but as aliases, not extra
public inboxes.**  
These are *role* addresses. They belong to the work, not to a person.

| Address | On the website? | Purpose |
|---------|-----------------|---------|
| `admin@` | **Yes** — the only public address | All public enquiries |
| `donate@` | No (for now) | Donation pledges and donor follow-up, internally |
| `volunteer@` | No (for now) | Volunteer applications, internally |
| `no-reply@` | No | Website sending only — nobody reads this |
| `info@` | **Do not create yet** | Same job as `admin@`; add later only if you want a second public line |

How this works in practice (simple, cheap, professional):

- `donate@` and `volunteer@` can **forward into `admin@`** (or into the
  right staff mailbox) until you are ready to split the work.
- When the website starts sending automatic notices, a donation pledge
  can go to `donate@` and a volunteer application to `volunteer@` — even
  if those still land in the same inbox today.
- Later, if finance should own pledges, you change the forward. **The
  website does not need to change.**

**Staff names stay internal.**  
`meal@`, `tsitsi@` and `egumbeze@` are for colleagues to write to each
other. They do not appear on the public site.

This is how NGOs and diocesan offices usually run a clean digital
footprint: one public door, role addresses behind it, people behind the
roles. Please confirm you are happy with this, or tell us what to change.

**Still needed from you on mail (short):**

- Who actually checks `admin@` day to day?
- For donation-pledge alerts: `admin@` only, or also a named person
  (e.g. finance / Angela)? This is a governance choice.
- Confirm: create `donate@` and `volunteer@` as aliases now — yes or no?

---

## What we already know about the domain (checked 26 August 2026)

- The domain **caritasmutare.org** is registered and live.
- **Utande** (your internet / hosting provider in Zimbabwe) currently:
  - receives **all email** for `@caritasmutare.org`
  - controls **DNS** — the public “address book” that tells the internet
    where your website and email live
- **www.caritasmutare.org** still points at Utande (`196.29.35.79`), not
  at the new site. From outside Zimbabwe it did not load a page. Please
  confirm in Mutare that there is no old website we would accidentally
  take down.
- The new site is already built and previewed elsewhere. It is **not yet**
  showing at www.caritasmutare.org.

**The most important reassurance:** when we switch the website over, we
will **not** change the mail settings (MX records). Existing inboxes keep
working.

---

## What the new website does with email today

**It does not send any email yet.**

That means:

- Contact form → saved in the system, **nobody is emailed**
- Volunteer application → saved, **nobody is emailed**
- Donation pledge → saved, **nobody is emailed** (not the donor, not staff)
- If a staff member forgets their password → we cannot reset it by email yet

This is a problem for going live. A donor or volunteer who hears nothing
back will assume Caritas is not active. We can turn sending on once the
Utande DNS records below are in place.

---

## What we are trying to do before go-live

Three separate jobs, in this order:

1. **Keep your current email working** (Utande). We do not move mailboxes
   unless you later choose to.
2. **Let the website send a few automatic emails** on your domain
   (a short thank-you to the person who submitted a form, and a notice to
   the right Caritas address — `admin@`, and later `donate@` /
   `volunteer@` if you approve the aliases).
3. **Point www.caritasmutare.org at the new website** — one DNS change,
   **without touching mail**.

Job 2 uses a professional sending service (the plan is **Resend**). That
is not a new mailbox. It is a delivery service. Messages still appear to
come from Caritas Mutare (for example `no-reply@caritasmutare.org`).
Replies go to a real person (`admin@`), not into a black hole.

For that sending to work, Utande’s DNS must **allow** the service to send
as `@caritasmutare.org`. Today, only Utande’s own mail servers are
allowed. If we skip that step, automatic emails land in spam.

---

## What we still need from Utande (please keep this section)

Nothing here asks you to change settings yourselves today. We need
**one person who can log into the Utande portal**, or someone we can send
exact records to.

### Why Utande matters

Utande is not only the mailbox provider. They also hold the DNS login.
**Every change** — website address, permission for the site to send mail,
anti-spam policy — goes through that portal.

We will not change **MX records**. Those are the records that say “email
for this domain goes to Utande.” Changing them would break email. We are
not doing that.

### What we will ask Utande to add (when you say go)

We will give either you or your IT contact the **exact** records. In
plain terms they are:

1. **One record to point `www` at the new website**  
   This is what makes www.caritasmutare.org show the new site. Mail is
   not affected.

2. **A few records so the website is allowed to send as
   `@caritasmutare.org`**  
   Usually: an update to **SPF** (who may send in Caritas’s name), plus
   **DKIM** records (a signature that proves the message is genuine).
   Without these, automatic emails from the site look like spam.

3. **One DMARC record** (recommended while we are in the portal)  
   A short anti-spoofing policy. It helps stop others pretending to be
   Caritas Mutare. It does not change how you read mail.

### What we need you to tell us

1. **Who holds the Utande login** for the domain, DNS and `admin@`
   mailbox, and who is **authorised** to use it?
2. **How we make the changes:** temporary access for us to add the
   records, **or** we send the exact list to your IT contact to type in?
3. **Who is listed as owner of caritasmutare.org, and when does the
   domain renew?** If it expires, the website *and* the email go down
   together.
4. **Is anything still live at www.caritasmutare.org in Mutare?** Our
   test from outside Zimbabwe showed nothing loading. Please confirm
   locally so we do not take down an old page you still use.

### If Utande offers to “fix the website”

Please loop us in **before** anyone changes settings. A well-meant change
to mail records is the one thing that would actually break email. Website
pointing and mail pointing are different settings; they must stay
separate.

---

## What we will not do without you

- We will not touch MX records (that is what would break email).
- We will not point www at the new site until you confirm there is no old
  website still in use.
- We will not put named staff addresses (`meal@`, `tsitsi@`,
  `egumbeze@`) on the public site.
- We will not guess who should receive donation-pledge alerts.

---

## After you confirm, we will

1. Add the sending service and the DNS records (with whoever holds
   Utande).
2. Keep **admin@** as the only public address; take **egumbeze@** off the
   public pages.
3. If you approve: create `donate@` and `volunteer@` as aliases (they can
   forward to `admin@` at first).
4. Turn on: staff notification + a short acknowledgement to the person
   who submitted (contact, volunteer, donation pledge).
5. Add password reset by email for staff.
6. Point **www.caritasmutare.org** at the new site.

Item 6 also needs the API (the “back office” of the website) running in
production. That is our hosting work, separate from Utande.

---

## Short list — what we still need from Caritas

1. Name of the person who can log into **Utande**.
2. Temporary access for us, **or** “send us the records to enter”.
3. Domain owner and **renewal date**.
4. Confirm: is anything still live at www.caritasmutare.org in Mutare?
5. Approve (or adjust) the mailbox plan: public **admin@** only; internal
   `meal@`, `tsitsi@`, `egumbeze@`; aliases **donate@** and **volunteer@**;
   no public **info@** for now.
6. Who checks **admin@** day to day, and who should get **donation-pledge**
   alerts.
7. Keep Utande mail for now, or explore Google Workspace for Nonprofits
   later? (Not urgent — decide on purpose. Moving mailboxes later is
   harder than starting there.)

Thank you. Once we have the Utande contact and your yes/no on the aliases,
email and the public website can be wired without putting current mail at
risk.
