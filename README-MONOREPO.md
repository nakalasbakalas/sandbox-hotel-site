# Sandbox Hotel Monorepo

Complete hotel management system with website, API worker, and property management system.

## How Workspaces Relate to Production

The **production deployment** is driven by `wrangler.jsonc` at the repo root:

- **Worker entry point**: `src/index.js`
- **Static assets**: `public/`
- **Database**: Cloudflare D1

The npm workspaces below provide development tooling and scaffolding. Only `packages/web` is actively used (its `wrangler` dev dependency drives the root `dev`/`build`/`deploy` scripts).

## Workspace Structure

```
monorepo/
├── src/index.js        ← PRODUCTION Worker entry point
├── public/             ← PRODUCTION static site
├── packages/
│   ├── web/            - Workspace for wrangler dev/build/deploy scripts
│   ├── api/            - Scaffold (not deployed; reserved for future use)
│   ├── shared/         - Scaffold (shared utilities; reserved for future use)
│   └── pms/            - Flask PMS (independent Python app, deploys to Render)
├── package.json        - Root npm configuration
└── wrangler.jsonc      - Cloudflare deployment config
```

## Workspaces

### 🌐 `packages/web` — Frontend Workspace
Provides the `wrangler` dev dependency used by root scripts.
- **Tech**: Wrangler CLI
- **Deploy**: `npm run deploy -w packages/web` (deploys `src/index.js` + `public/`)
- **Dev**: `npm run dev -w packages/web`

### 🔌 `packages/api` — API Scaffold
Placeholder workspace for future API extraction. **Not currently deployed.**
- **Tech**: Node.js, Cloudflare Workers
- **Status**: Scaffold only

### 🔧 `packages/shared` — Shared Utilities Scaffold
Placeholder for shared code. **Not currently imported by the production Worker.**
- **Tech**: JavaScript/Node.js
- **Usage**: `import from "@sandbox-hotel/shared"` (when adopted)

### 🏨 `packages/pms` — Property Management System
Full-featured hotel management platform. **Deploys independently to Render.**
- **Tech**: Flask, Python, PostgreSQL, SQLAlchemy
- **Setup**: `cd packages/pms && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
- **Run**: `cd packages/pms && python app.py`
- **Database**: PostgreSQL (production on Render) / SQLite (local dev)

## Quick Start

### Cloudflare Worker + Static Site

```bash
npm install
npx wrangler dev        # local dev server
npm test                # run Worker integration tests
npm run lint            # ESLint
```

### Python PMS

```bash
cd packages/pms
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py           # http://localhost:5000
```

## Dependencies Between Packages

- `web` → uses `shared` (declared; shared is scaffold-only for now)
- `api` → uses `shared` (declared; both are scaffold-only)
- `pms` → independent Python application

## Deployment

| Component | Command | Target |
|-----------|---------|--------|
| Website + Worker | `npx wrangler deploy` | Cloudflare Workers |
| Python PMS | Git push to Render-connected branch | Render |

## Configuration

- **Cloudflare secrets**: `npx wrangler secret put SECRET_NAME`
- **Python PMS**: Copy `packages/pms/.env.example` → `packages/pms/.env`
- **Root**: `.env.example` at repo root for any shared config

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full deployment architecture.
