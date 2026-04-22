# Deployment Runbook

This document walks through taking the Caritas Mutare platform from "runs
locally" to "Angela can log into the admin console from Mutare". It covers
three services, all on free tiers:

| Piece | Service | Why |
|---|---|---|
| Public website (already live) | **Vercel** | Static hosting, global CDN, free |
| Admin API | **Render** (Node web service) | Simple Node hosting, free tier, auto-deploys on push |
| Database | **Neon** (managed Postgres) | Generous free tier, branchable, serverless |
| File uploads (later wave) | **Cloudflare R2** | 10 GB free, no egress fees |
| Transactional email (later wave) | **Resend** | Free tier for low volume |

The first three are the bare minimum to get login working. R2 and Resend are
flagged in the runbook but are **not required for the first deploy**.

---

## Preflight checklist

Before touching any dashboards, confirm:

- [ ] `git status` is clean on `main`.
- [ ] Local dev still boots successfully (`npm run dev` in the project root).
- [ ] You can log in locally with `admin / password`.
- [ ] You have a password manager ready — you'll create several secrets.

---

## Step 1 — Create the Postgres database (Neon)

1. Go to <https://neon.tech> and sign up / log in (GitHub login is easiest).
2. Create a new project: **Name** `caritas-mutare`, **Postgres version** 16,
   **Region** closest to you (EU West or US East are both fine — latency is
   one-off per admin request, not per user).
3. Once the project is created, open **Connection Details** → copy the
   **Connection string** with the `?sslmode=require` suffix. It looks like:

   ```
   postgres://neondb_owner:XXXX@ep-foo-bar.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

4. Save it in your password manager as **`CARITAS_DATABASE_URL`**. We'll paste
   it into Render in a moment.

Why Neon: branchable databases (so we can spin up a throwaway DB for a PR
review), scales to zero when idle (important for free tier), no credit card
required.

---

## Step 2 — Deploy the API to Render

The repo already includes a `render.yaml` Blueprint at the root, so Render
can create the service automatically.

### 2a. Initial blueprint apply

1. Go to <https://render.com> and sign up / log in (GitHub login).
2. Click **New → Blueprint**.
3. Connect your GitHub account and select the `caritas_mutare` repository.
4. Render detects `render.yaml` and shows a preview with one service:
   `caritas-mutare-api`.
5. For each env var marked "Sync: false", paste the value now:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | The Neon URL from Step 1 |
   | `JWT_SECRET` | Run `openssl rand -hex 48` locally and paste the output |
   | `CLIENT_URL` | Your current Vercel production URL — e.g. `https://caritas-mutare.vercel.app`. You can add more later (comma-separated). |
   | `BOOTSTRAP_ADMIN_USERNAME` | e.g. `angela` |
   | `BOOTSTRAP_ADMIN_EMAIL` | e.g. `angela@caritasmutare.org` |
   | `BOOTSTRAP_ADMIN_PASSWORD` | A long random password — share with Angela via a secure channel (Signal / password manager invite) |

6. Click **Apply**. Render will:
   - Clone the repo
   - Run `npm install` in `/server`
   - Start the service with `node index.js`
   - Run the Knex migrations automatically on first boot (the server does
     this before listening)
   - Run the seed, which creates the first admin from the bootstrap
     variables above
   - Expose the service at something like
     `https://caritas-mutare-api.onrender.com`

7. Wait for the build to finish (~2–3 min) and check the logs for:
   ```
   ✅ Ran migrations: ...
   🌱 Bootstrapped production admin: angela
   🚀 Server running on port ...
   ```

### 2b. Sanity-check the API

From your laptop:

```bash
curl https://caritas-mutare-api.onrender.com/api/health
# => {"status":"OK","timestamp":"...","environment":"production"}
```

A login test:

```bash
curl -X POST https://caritas-mutare-api.onrender.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"angela","password":"<the bootstrap password>"}'
# => {"message":"Login successful","token":"eyJ...","user":{...}}
```

If this returns a token, **the backend is fully working in production**. If
it returns 500, open the Render "Logs" tab — the error will be the top line.

### 2c. Rotate the bootstrap password

Before sharing anything, ask Angela to log in via the website (next step) and
change her password from her profile. Then, in the Render dashboard, delete
(or blank out) the three `BOOTSTRAP_ADMIN_*` env vars so they're not lying
around. The admin persists in the database regardless.

---

## Step 3 — Point the Vercel frontend at the API

We use a **Vercel rewrite** so the frontend keeps calling relative `/api/*`
paths, and Vercel transparently proxies those requests to Render. No CORS
headaches, no frontend env vars, no code changes.

### 3a. Update `vercel.json`

Open the root `vercel.json` and add a `rewrites` block:

```json
{
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://caritas-mutare-api.onrender.com/api/:path*"
    }
  ]
}
```

Replace the destination with your actual Render URL from Step 2.

### 3b. Commit & push

```bash
git add vercel.json
git commit -m "feat(deploy): proxy /api/* from Vercel to Render API"
git push origin main
```

Vercel will rebuild automatically. Once it's done, visit your Vercel URL,
click **Sign in**, and log in with Angela's credentials. **This should
actually work now.**

### 3c. Optional: narrow CORS once you're happy

Once the rewrite is confirmed working, Vercel requests reach the API as
same-origin (from the API's perspective they come from the Render domain
itself, not the Vercel domain — because the rewrite runs server-side). You
can safely remove `ALLOW_VERCEL_PREVIEWS=true` from Render if you want to
lock things down.

---

## Step 4 — Custom domain (`www.caritasmutare.org`)

**Do this only after Angela has confirmed Utande portal access.** See §4 of
`docs/ANGELA_BRIEFING.md`.

1. In Vercel, project **Settings → Domains → Add** → enter
   `www.caritasmutare.org`.
2. Vercel shows a DNS record to add — typically a `CNAME` like:
   ```
   CNAME www  cname.vercel-dns.com
   ```
3. Ask the Utande admin (or whoever holds the control panel) to add that
   single CNAME record. **Do not touch any MX or SPF records** — that would
   break `admin@caritasmutare.org`.
4. Wait for DNS propagation (usually minutes, up to 48 hours worst case).
5. Once Vercel shows the domain as "Valid", update the Render `CLIENT_URL`
   env var to include the custom domain too:
   ```
   https://caritas-mutare.vercel.app,https://www.caritasmutare.org
   ```
6. Redeploy (Render → **Manual Deploy → Deploy latest commit**).

---

## Step 5 — (Next wave) Persistent uploads via Cloudflare R2

Reserved for a later wave. Until R2 is wired up, admin file uploads will
land on Render's ephemeral disk and disappear on every deploy. For early
demo use that's fine; before we ask staff to upload "real" photos, this
needs to happen.

Sketch of the work:

1. Create a Cloudflare account, enable R2, create bucket `caritas-mutare`.
2. Create an R2 API token with read/write scope to that bucket.
3. Add `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` to
   `server/package.json`.
4. Refactor the multer upload middleware to stream directly to R2 instead
   of local disk; store the public URL in the DB instead of a local path.
5. Add `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
   `R2_BUCKET`, `R2_PUBLIC_URL` env vars to Render.

---

## Troubleshooting

### Render "Deploy succeeded" but `/api/health` returns a cold-start delay

Expected on the free tier. The service sleeps after 15 minutes of inactivity;
the next request spins it back up (≈30 seconds). Any paid plan eliminates
this. For admin use it's tolerable.

### Login returns 500 with "relation \"users\" does not exist"

Migrations didn't run. Check the Render deploy logs for the migration output
from the boot sequence. Re-deploy: **Manual Deploy → Clear build cache &
deploy**.

### Login returns 401 with valid credentials

The bootstrap admin wasn't created, usually because:
- `RUN_SEEDS_ON_BOOT` isn't `true`, or
- `BOOTSTRAP_ADMIN_USERNAME` / `BOOTSTRAP_ADMIN_PASSWORD` weren't set on the
  deploy that ran migrations

Use the shell script as a rescue:

```bash
# From the Render dashboard: Shell tab
node scripts/create-admin.js angela angela@caritasmutare.org 'new-long-password'
```

### Login works locally but not on Vercel

Most likely the rewrite hasn't been added / is pointing at the wrong URL.
Check `vercel.json` → `rewrites[0].destination` matches the live Render URL.

### CORS errors in the browser console (rather than a rewrite)

If you skipped the rewrite and are calling the API directly from Vercel,
make sure the Vercel URL is listed in `CLIENT_URL` on Render. The simpler
fix is to add the rewrite as per Step 3.

---

## Rollback

Every piece is independently reversible:

- **Frontend bad push**: `git revert <sha> && git push`. Vercel auto-redeploys.
- **Backend bad push**: in Render, click any previous deploy and hit
  **Rollback**. Re-runs migrations safely (they're idempotent).
- **Bad database migration**: `npm run migrate:down` from your laptop while
  `DATABASE_URL` is pointed at Neon. Keep the rollback in a throwaway shell;
  don't ship a broken migration to `main` if you can help it.
