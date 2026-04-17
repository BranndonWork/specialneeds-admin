# SpecialNeeds POC — Refine.dev in Next.js

This is a proof-of-concept for integrating [Refine.dev](https://refine.dev/) (the admin framework used in `specialneeds-admin`) into the `specialneeds-client` Next.js app. The goal is a unified codebase where the public-facing site and the internal admin dashboard coexist under one Next.js app.

The poc is a copy of the `specialneeds-client` codebase with Refine.dev added on top. Admin pages live under `/pages/admin/`.

---

## Requirements

- **Node 20+** — `@refinedev/core` v5 requires Node >=20. Use nvm: `nvm use 20`
- **Yarn** — this project uses yarn (`.yarnrc` present), not npm
- **Local Django API** running at `http://localhost:8001`
- **`.env.local`** — pulled from Vercel prod (`vercel env pull`). See notes below.

---

## Dev Server

Scripts are in `./scripts/`:

```bash
bash scripts/start.sh    # start (background, logs to scripts/.dev-server.log)
bash scripts/stop.sh     # stop
bash scripts/restart.sh  # restart
```

Server runs at **http://localhost:3000** (port from `NEXT_PUBLIC_PORT` in `.env.local`).

Check logs: `tail -f scripts/.dev-server.log`

---

## Critical: .env.local Notes

The `.env.local` is a Vercel production env pull. It contains `NODE_ENV="production"` hardcoded, which breaks Next.js dev mode (React loads the production JSX runtime — no `jsxDEV`).

**The `start.sh` script overrides this** by explicitly exporting `NODE_ENV=development` after sourcing the env file. Do not remove that line.

The env file also has `NEXT_PUBLIC_HOST="www.specialneeds.com"` which triggers "PRODUCTION MODE" logs in `next.config.js` — this is expected and harmless in local dev.

Key local-pointing vars in `.env.local`:
- `NEXT_PUBLIC_API_URL=http://localhost:8001` — local Django API
- `NEXT_PUBLIC_MEILI_HOST=http://localhost:7700` — local Meilisearch

---

## Admin Pages

| Route | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin/listings` | Listings management |
| `/admin/listings/[...slug]` | Listing detail/edit |
| `/admin/articles` | Articles management |
| `/admin/articles/[...slug]` | Article detail/edit |
| `/admin/posts` | Posts management |
| `/admin/account` | Account settings |

Auth provider: `providers/authProvider.js` — posts to `NEXT_PUBLIC_API_URL/api/v1/token/`, stores JWT in localStorage.

---

## Django API — CORS

The local Django API (`specialneeds-api`) must allow `http://localhost:3000`. This was added in:

```
specialneeds-api/webroot/specialneeds/specialneeds/config/cors.py
```

If the API is not running or CORS fails, restart the Django container:

```bash
docker restart specialneeds-api-django-1
```

---

## Dependencies Note

`@types/react` is pinned to `18` in `devDependencies` (upgraded from 17 to match React 18). `instantsearch.js` ships a nested React 19 in its own `node_modules` — this does not cause issues because `NODE_ENV=development` is now set correctly before the dev server starts.

---

## What's NOT here yet

- Refine.dev integration is in progress — the admin pages exist but the full Refine resource/data provider wiring is the active POC work
- No dedicated `.env.local.example` yet
