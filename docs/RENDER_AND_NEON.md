# Neon + Render — click-by-click (do this when you log in)

This is the path to **Launch 1**: forms and staff login working on
https://caritas-mutare.vercel.app — **without Utande**.

Have a password manager open. You will create secrets you must not put in
chat or git.

When you are done, send me:

- the Render URL (looks like `https://something.onrender.com`)
- confirmation that `curl …/api/health` returned JSON `{"status":"OK",…}`

Then I will add the Vercel rewrite. **Do not add that rewrite yourself**
until health returns JSON — pointing the site at a dead API makes every
form fail.

---

## Before you click anything

On your laptop, generate a JWT secret and keep it in the password manager:

```bash
openssl rand -hex 48
```

Also invent a **long** bootstrap password for Angela (or for you as first
admin). Not `password`. Store it as `CARITAS_BOOTSTRAP_PASSWORD`.

Decide the first admin username. Suggested: `angela`.

---

## Part A — Neon (the database) — about 5 minutes

1. Open https://neon.tech and **Log in with GitHub** (same GitHub as this
   repo is fine).
2. **Create a project**
   - Name: `caritas-mutare`
   - Postgres: **16** (or whatever the default is — 16 is fine)
   - Region: **Europe** or **US East** — either is fine for admin traffic
3. When the project exists, open **Dashboard** → **Connection details**.
4. Copy the **connection string**.
   - Use the one that includes `?sslmode=require`
   - It starts with `postgres://` or `postgresql://`
5. Paste it in your password manager as **`CARITAS_DATABASE_URL`**.

You are done with Neon for now. Do not create tables by hand — the API
runs migrations on boot.

---

## Part B — Render (the API) — about 10 minutes

1. Open https://render.com and **Log in with GitHub**.
2. Allow Render to see the repo **`georgekasiyandima/caritas_mutare`**.
3. In the Render dashboard: **New** → **Blueprint**.
4. Select that repository. Render should find `render.yaml` and show a
   service named **`caritas-mutare-api`**.
5. Fill in every value marked **Sync: false** (you type these; they are
   not in the file on purpose):

   | Box on screen | What to paste |
   |---------------|----------------|
   | `DATABASE_URL` | Neon string from Part A |
   | `JWT_SECRET` | Output of `openssl rand -hex 48` |
   | `CLIENT_URL` | `https://caritas-mutare.vercel.app` |
   | `BOOTSTRAP_ADMIN_USERNAME` | `angela` (or the name you chose) |
   | `BOOTSTRAP_ADMIN_EMAIL` | `admin@caritasmutare.org` |
   | `BOOTSTRAP_ADMIN_PASSWORD` | The long password you stored |

   Leave `NODE_ENV=production`, `RUN_SEEDS_ON_BOOT=true`, and
   `ALLOW_VERCEL_PREVIEWS=true` as the blueprint already sets them.

6. Click **Apply**. Wait until the service is **Live** (2–5 minutes).
   Free tier can be slow the first time.
7. Open the service → **Logs**. You want to see lines like:
   - `Ran migrations`
   - `Bootstrapped production admin` (or similar)
   - `Server running on port`
8. At the top of the service page, copy the **onrender.com URL**.
   It might be `https://caritas-mutare-api.onrender.com` or a slightly
   different name. Use **whatever Render shows**, not the docs example.

### Check it from your laptop

Replace `YOUR-RENDER-URL` with the URL you copied (no trailing slash):

```bash
curl https://YOUR-RENDER-URL/api/health
```

**Success** looks like JSON:

```json
{"status":"OK","timestamp":"...","environment":"production"}
```

**Failure** looks like:

- plain text `Not Found`
- HTML
- a timeout

If it fails: Render → that service → **Logs**. The first error line is
usually a missing `DATABASE_URL`, a bad Neon string (no `sslmode=require`),
or `JWT_SECRET` empty.

### Login check (optional but useful)

```bash
curl -X POST https://YOUR-RENDER-URL/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"angela","password":"THE_BOOTSTRAP_PASSWORD"}'
```

Success includes a `"token":"eyJ..."`.  
`401` means username/password do not match the bootstrap values.  
`500` means look at Logs again.

---

## Part C — stop here and tell me

Do **not** change `vercel.json` yet.

Send:

1. Render URL  
2. `curl …/api/health` result (the JSON is enough — never send JWT_SECRET
   or the database URL)

I will add the rewrite so
`https://caritas-mutare.vercel.app/api/...` goes to Render. After Vercel
rebuilds, Sign in on the site should work with the bootstrap user.

Then: log in on the website, change the password in profile, and in
Render → Environment delete (or clear) the three `BOOTSTRAP_ADMIN_*`
variables. The user stays in the database; those env vars are only for
first create.

---

## If the Blueprint screen does not appear

Manual create (same result):

1. Render → **New** → **Web Service**
2. Connect the GitHub repo
3. Settings:
   - **Root directory:** `server`
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `node index.js`
   - **Health check path:** `/api/health`
   - **Instance:** Free
4. Add the same environment variables as the table in Part B.
5. Deploy, then do the `curl` health check.

---

## What this does *not* do

- It does **not** change www.caritasmutare.org (that is Utande, later).
- It does **not** send email yet.
- Free Render **sleeps after ~15 minutes idle**. The first request after
  sleep can take 30–60 seconds. That is normal. If health fails forever,
  it is not sleep — it is a boot error in Logs.
