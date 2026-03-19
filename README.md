# Sandbox Hotel Site

A hotel management system consisting of a public website, a staff admin panel, and a Cloudflare Worker API — all deployed as a single Cloudflare Workers project.

## How the Site Is Deployed

The **production site** is a single Cloudflare Workers deployment defined by `wrangler.jsonc`:

- **`src/index.js`** — Cloudflare Worker handling API routes, authentication, bookings, and PMS logic.
- **`public/`** — Static HTML, CSS, JS, and images served by the Worker's asset binding.
- **Cloudflare D1** — SQLite-compatible serverless database for operational data.

```bash
# Deploy to production
npx wrangler deploy

# Local development
npx wrangler dev
```

A separate Python/Flask Property Management System lives in `packages/pms/` and deploys independently to Render. See `packages/pms/README.md` for details.

## Repository Structure

```
sandbox-hotel-site/
├── src/index.js            ← Cloudflare Worker (production backend)
├── public/                 ← Static site served by the Worker
│   ├── index.html          ← Hotel homepage (TH / EN / ZH)
│   ├── admin/              ← Staff admin SPA
│   ├── hotels/             ← SEO landing pages
│   └── guides/             ← SEO guide pages
├── test/                   ← Worker integration tests (vitest)
├── wrangler.jsonc          ← Cloudflare deployment config
├── packages/
│   ├── web/                ← Workspace used by root scripts for dev/build/deploy
│   ├── api/                ← Scaffold workspace (not the production backend)
│   ├── shared/             ← Scaffold workspace (shared utilities)
│   └── pms/                ← Python/Flask PMS (separate deployment on Render)
├── docs/                   ← Architecture and localisation docs
└── package.json            ← Monorepo root
```

> **Note:** `packages/web`, `packages/api`, and `packages/shared` are workspace scaffolds that drive the root npm scripts (`dev`, `build`, `deploy`). The actual production Worker entry point is `src/index.js`, and the static site is `public/`.

## Quick Start

```bash
# Install dependencies
npm install

# Start local dev server (Worker + static site)
npx wrangler dev

# Run Worker integration tests
npm test

# Lint source files
npm run lint
```

### PMS (separate system)

```bash
cd packages/pms
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Testing

Worker tests run with [Vitest](https://vitest.dev/) and the [@cloudflare/vitest-pool-workers](https://developers.cloudflare.com/workers/testing/vitest-integration/) pool, which provides an in-process Miniflare environment with a real D1 database.

```bash
npm test          # single run
npm run test:watch  # watch mode
```

Tests live in `test/` and cover authentication, CORS / security headers, booking and reservation flows, and operational endpoints (housekeeping, settings, reporting).

## CI / Quality Checks

The `.github/workflows/quality.yml` workflow runs on every PR and push to `main`:

| Job | What it checks |
|-----|---------------|
| **Lint** | ESLint on `src/`, `public/assets/js/`, `public/admin/app.js` |
| **Worker tests** | All tests in `test/` via `npm test` |
| **Content freshness** | Warns about TODO markers and placeholder values in production HTML |

## Production Configuration — Business-Owned Values

Some values in the codebase are owned by hotel operations and require periodic verification:

| Value | Location | Owner | Notes |
|-------|----------|-------|-------|
| Google review count | `public/index.html` — i18n strings `hero_review_count` (TH, EN, ZH) | Ops | Update monthly; marked with `// TODO: verify review count monthly` |
| LINE Official Account ID | `public/index.html` — LINE share URL | Ops | Replace `@YOUR_LINE_ID` with the real account ID |
| Cloudflare Worker secrets | Cloudflare dashboard / `wrangler secret put` | Eng + Ops | `OPENAI_API_KEY` and any other `env.*` references in `src/index.js` |
| D1 database | Cloudflare dashboard | Eng | Database `sandbox-hotel-pms`, ID in `wrangler.jsonc` |

## Environment Ownership

| Component | Platform | Config location | Managed by |
|-----------|----------|-----------------|------------|
| Worker + static site | Cloudflare Workers | `wrangler.jsonc` + Cloudflare dashboard secrets | Engineering |
| D1 database | Cloudflare D1 | `wrangler.jsonc` `d1_databases` binding | Engineering |
| Python PMS | Render | `packages/pms/.env` / Render dashboard | Engineering (independent from Cloudflare) |
| Business content (review count, LINE ID) | `public/index.html` inline i18n strings | `public/index.html` | Ops + Engineering |

## Further Documentation

- [Architecture overview](docs/ARCHITECTURE.md)
- [Monorepo workspace details](README-MONOREPO.md)
- [Localisation strategy](docs/localization/README.md)
