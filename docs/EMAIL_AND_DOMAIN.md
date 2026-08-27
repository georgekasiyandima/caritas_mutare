# Email & Domain — current facts and what we need from Caritas

Prepared for the conversation with the Caritas Mutare team. Section 1 is what
is verifiably true today. Section 2 is what the website does about email right
now, which is the part most likely to surprise people. Section 3 is the
decisions we need from Caritas, and Section 4 is the list of questions to ask.

---

## 1. What the DNS actually says today

Checked live against `caritasmutare.org`:

| Record | Value | What it means |
|--------|-------|---------------|
| MX | `mx00.utande.co.zw`, `mx01.utande.co.zw` | **Utande receives all mail** for the domain |
| NS | `ns1`–`ns4.utande.co.zw` | **Utande controls DNS.** Every record change goes through their portal |
| SPF | `v=spf1 mx ip4:196.44.176.0/24 ... ~all` | Only Utande's own servers may send as `@caritasmutare.org` |
| DMARC | *(none)* | No anti-spoofing policy is published |
| A (root and `www`) | `196.29.35.79` | Points at a Utande address |

Two things follow from this that matter for go-live.

**The domain does not currently show a website.** `196.29.35.79` did not
respond on either HTTP or HTTPS when tested. So pointing `www` at the new
Vercel site should not take anything down — worth one confirmation from
someone in Mutare, since the test was run from outside Zimbabwe.

**Any sending service must be added to SPF.** The current SPF record permits
only Utande's mail servers. If the website starts sending mail as
`@caritasmutare.org` without updating SPF, those messages will fail
authentication and land in spam. There is also no DMARC record, which is worth
adding while we're in the DNS anyway.

---

## 2. What the website does with email today: nothing

This is the important one. There is **no email-sending code in the
application at all** — no mail package is installed, and nothing anywhere in
`server/` sends a message. `env.example` reserves `RESEND_API_KEY` and
`EMAIL_FROM` under a comment that says "not yet wired", and that is accurate.

The practical consequence today:

- Someone submits the **contact form** → the message is saved to the database
  and **nobody is notified**. Angela has to remember to log into
  `/admin/messages` and look.
- Someone applies to **volunteer** → same. Saved, silent.
- Someone pledges a **donation** → same. No acknowledgement to the donor, no
  alert to staff.
- Nobody who fills in a form receives **any confirmation**, so from their side
  the submission looks like it vanished.
- There is **no password reset by email**. A locked-out staff member needs
  someone with server access to run `scripts/create-admin.js`.

For a public-facing NGO site this is a launch blocker in its own right,
separate from the API hosting problem. A donor or a volunteer who hears
nothing back will assume the organisation is not active.

---

## 3. The decisions Caritas needs to make

### Decision 1 — Who holds the Utande credentials?

We need someone who can log into the Utande portal, because go-live requires
DNS changes there. Nothing we need touches the MX records, so **email keeps
working throughout**. What we need to add is:

- one record to point `www` at Vercel,
- two or three records to authorise the website's sending service,
- one DMARC record.

The question is not just "who has the password" but "who is allowed to use
it", and whether we get temporary delegated access or hand the records to
their IT person to enter.

### Decision 2 — Keep Utande mail, or move to Google Workspace?

Utande mail works and there is no urgency. But Google Workspace for Nonprofits
is free for approved organisations and gives Gmail on the own domain, shared
Drive, Calendar and Meet. Worth raising as an option, not a recommendation to
push. If they ever want it, migrating mailboxes later is more disruptive than
starting there — so it's better decided consciously now than by default.

### Decision 3 — Which mailboxes should exist, and who reads them?

Right now only `admin@caritasmutare.org` is known to work. The site's contact
page and the automated notifications need addresses that are actually
monitored. Typical set for an NGO this size:

| Address | Purpose | Needs an owner |
|---------|---------|----------------|
| `admin@` | Exists today | Angela? |
| `info@` | General public enquiries from the contact form | Front desk / programme officer |
| `donate@` | Donation pledges and donor questions | Finance |
| `volunteer@` | Volunteer applications | Programmes |
| `no-reply@` | Outbound only, never read | Nobody — it's a sending identity |

These can all be **aliases forwarding into one inbox** to begin with. That is
the cheapest option and avoids anyone having to check five mailboxes. What
matters is that each has a named human responsible.

### Decision 4 — How the site sends mail

The website should **not** send through the Utande mailbox directly. Sending
through a normal mailbox from a server is fragile, hard to debug, and often
gets throttled or blacklisted. The standard approach is a transactional email
provider — Resend was already the plan, and it's a good fit.

The domain identity stays Caritas's. The provider is only the delivery
mechanism, and it needs the DNS records from Decision 1 to be allowed to send
as the domain. Anything the site sends comes from `no-reply@caritasmutare.org`
with a **Reply-To** of the relevant monitored mailbox, so replies land with a
human.

---

## 4. Questions to put to the Caritas team

**Hosting and credentials**

1. Who holds the login to the Utande portal where the domain, DNS and
   `admin@` mailbox live, and who is authorised to make changes there?
2. Can we get temporary access to add DNS records, or should we hand the exact
   records to their IT contact to enter?
3. Who is the registered owner of `caritasmutare.org`, and when does it renew?
   We do not want it to lapse silently.
4. Is there an existing website at the domain that we might disturb? Our test
   suggests nothing is being served, but please confirm locally.

**Mailboxes**

5. Besides `admin@`, which addresses already exist, and who reads each one?
6. For each of `info@`, `donate@`, `volunteer@` — should it be a real mailbox
   or an alias, and who is the responsible person?
7. What address should appear publicly on the Contact page?
8. Is Angela's own `angela@caritasmutare.org` wanted, or does she work from
   `admin@`?

**Policy**

9. Are they open to Google Workspace for Nonprofits later, or should we plan
   around Utande mail permanently?
10. Who should receive the automated notification when a donation pledge comes
    in? This one has financial-governance implications and shouldn't default to
    whoever is convenient.

---

## 5. What we do once we have answers

In rough order:

1. Add the sending service, its SPF entry, DKIM records and a DMARC policy.
2. Wire notification emails for contact, volunteer and donation submissions,
   plus an acknowledgement to the person who submitted.
3. Add password reset by email so staff lockouts stop needing server access.
4. Point `www` at Vercel and add the API rewrite (see `ARCHITECTURE.md` §4).

Steps 1–3 are our work and need only the DNS records. Step 4 needs the Render
API to actually be running, which is a separate open question.
