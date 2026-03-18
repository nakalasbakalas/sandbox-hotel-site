# Architecture Overview — Sandbox Hotel

**Date**: 2026-03-18
**Status**: Current (production)

---

## System Overview

The Sandbox Hotel codebase contains **two distinct backend systems** that serve different purposes. This document clarifies which is deployed in production and how all components relate.

---

## 1. Deployed Production Backend — Cloudflare Workers (JS)

**Entry point**: `src/index.js`
**Config**: `wrangler.jsonc`
**Platform**: Cloudflare Workers + Cloudflare Pages

### What it does

- Serves all static assets from the `public/` directory (HTML, CSS, JS, images)
- Handles server-side logic via a Cloudflare Worker (booking form submissions, API endpoints, PMS backend API)
- Connects to **Cloudflare D1** (SQLite-compatible serverless database) for operational data
- Deployed globally via Cloudflare's edge network

### Key configuration (`wrangler.jsonc`)

```jsonc
{
  "name": "sandbox-hotel-site",
  "main": "src/index.js",              // Worker entry point
  "assets": { "directory": "public" }, // Static site files
  "d1_databases": [{
    "binding": "DB",
    "database_name": "sandbox-hotel-pms",
    "database_id": "3edede42-89f4-4d57-b232-10a11b01be00",
    "migrations_dir": "migrations"
  }]
}
```

### Deployment

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy

# Local development
npx wrangler dev
```

### Static site (`public/`)

All public-facing content lives in `public/`:

```
public/
├── index.html          ← Main hotel website (multilingual: TH/EN/ZH)
├── 404.html            ← Branded 404 page
├── privacy.html        ← Privacy policy
├── site.webmanifest    ← PWA manifest
├── robots.txt
├── sitemap.xml
├── llms.txt            ← AI assistant guidance
├── admin/              ← PMS frontend (React-like SPA)
├── assets/             ← Images, icons, JS analytics
├── hotels/             ← SEO landing pages (nakhon-si-thammarat/, southern-thailand/, thailand/)
└── guides/             ← SEO guide pages
```

---

## 2. Python PMS — Separate System (Not the Deployed Backend)

**Location**: `packages/pms/`
**Stack**: Python + Flask + SQLAlchemy + PostgreSQL
**Deployment target**: Render (see `packages/pms/sandboxhotel-render.template.env`)

### What it is

A full-featured Property Management System (PMS) built in Flask. It is a **separate application** from the Cloudflare Workers deployment. It is not served by `wrangler.jsonc` and is not part of the Cloudflare deployment pipeline.

### What it includes

- Staff authentication (RBAC: roles, permissions, sessions, MFA)
- Reservation management (guest profiles, room inventory, check-in/check-out)
- Folio and cashier module (charges, payment requests, documents)
- Housekeeping board
- Manager dashboard and reporting
- Public booking flow
- Notifications layer
- Full PostgreSQL database schema with Alembic migrations

### How it relates to the Cloudflare Worker

The `public/admin/` frontend (served by Cloudflare) is a lightweight SPA that calls API endpoints. In the current architecture:
- **Option A**: The Cloudflare Worker (`src/index.js`) proxies or implements the API that `public/admin/` consumes using D1
- **Option B**: The Python PMS on Render serves the full admin backend, with `public/admin/` configured to call Render endpoints

The actual active integration depends on runtime configuration (environment variables). Check `.env` or Cloudflare Workers secrets to determine which endpoint `public/admin/app.js` points to.

---

## 3. Repository Structure

```
sandbox-hotel-site/
├── src/
│   └── index.js           ← DEPLOYED: Cloudflare Worker (production backend)
├── public/                ← DEPLOYED: Static site served via Cloudflare Pages
├── packages/
│   └── pms/               ← SEPARATE: Python/Flask PMS (Render deployment)
├── migrations/            ← D1 (Cloudflare) database migrations
├── wrangler.jsonc         ← Cloudflare deployment config
├── package.json           ← Node.js monorepo root
└── docs/                  ← Project documentation
```

---

## 4. Environment Variables

### Cloudflare Workers (production)

Secrets are stored in Cloudflare Workers Secrets (not in `.env`). Set via:
```bash
npx wrangler secret put SECRET_NAME
```

Key secrets expected by `src/index.js`:
- Review `src/index.js` for all `env.VARNAME` references to get the full list

### Python PMS (Render)

See `packages/pms/sandboxhotel-render.template.env` for the required environment variables. Copy this to `.env` for local development:
```bash
cp packages/pms/sandboxhotel-render.template.env packages/pms/.env
```

Key variables include: `DATABASE_URL`, `SECRET_KEY`, `FLASK_ENV`, notification service credentials, payment gateway credentials.

---

## 5. Data Stores

| Store | Used By | Purpose |
|-------|---------|---------|
| **Cloudflare D1** (SQLite) | Cloudflare Worker (`src/index.js`) | Production operational data |
| **PostgreSQL** (Render) | Python PMS (`packages/pms/`) | Full PMS data for the Flask backend |

---

## 6. Deployment Summary

| Component | Platform | Deploy Command |
|-----------|----------|----------------|
| Website + Worker | Cloudflare | `npx wrangler deploy` |
| Python PMS | Render | Git push to Render-connected branch |

---

## 7. Development

```bash
# Start Cloudflare dev server (Worker + static site)
npx wrangler dev

# Start Python PMS locally
cd packages/pms
pip install -r requirements.txt
flask run
```

---

*Last updated: 2026-03-18*
