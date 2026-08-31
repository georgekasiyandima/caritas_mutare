# Testing — what we have, and how to write the next one

We test the **contracts people depend on**, not the React pages.

There is no end-to-end browser suite (Playwright / Cypress) and no client
unit tests. That is a deliberate trade this close to go-live: the bugs that
hurt us lived in Express + SQL + auth, not in button styles. Cover those
paths on the server. Verify the public site by walking it after a Vercel
deploy.

---

## What we have today

| Kind | Where | What it is |
|------|--------|------------|
| **API integration** | `server/tests/*.test.js` | Real Express app + real SQLite (temp file). Migrations and seeds run first. |
| **Not unit tests** | — | We do not mock handlers in isolation. Wiring bugs (route order, SQL dialect, validation) only show up with the real stack. |
| **Not E2E** | — | No browser driving Vercel + Render + Neon together. |

Run them:

```bash
cd server && npm test
```

`KNEX_ENV=test` is set by the Jest setup. Rate limiting is off in the harness
so a suite is not banned after ten logins.

---

## Industry standard, applied here

A good test names a **behaviour a person would notice**, then asserts:

1. **The happy path** — the thing we promised (volunteer form saves a row).
2. **The edge that looks successful but must not persist** — honeypot filled
   → HTTP 201, **zero rows**.
3. **Auth** — listing volunteers without a token is 401; with an admin token
   the public row appears.
4. **Honesty** — a public donation cannot mark itself `completed`.
5. **Secrets** — login never returns `password_hash`.

If a test only checks that a function was called, skip it. If it would still
pass when the database was never written, it is not covering the risk.

**Do not test implementation details** (CSS class names, MUI internals).
**Do not snapshot entire HTML pages.**

When you add a public form or an admin list, add the round-trip in
`server/tests/forms.test.js` or a new file using `helpers/harness.js`:

```
POST public → row exists → GET as admin → same row → GET with no token → 401
```

That is enough for Launch 1. Browser E2E can wait until Utande and the custom
domain are live — then one smoke script against production is worth more than
a large local Cypress suite.

---

## What we still do by hand

After every production deploy, walk:

1. Home, Leadership, Marathon, Donate, Volunteer, Contact.
2. Sign in → dashboard **Waiting on you** counts → Messages / Volunteers / Pledges.
3. Submit a test volunteer (use a unique email) and confirm it appears.

Delete or mark the test row when you are done. Do not use a real community
member’s details for this.
