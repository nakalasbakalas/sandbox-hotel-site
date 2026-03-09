# Sandbox Hotel Monorepo

Complete hotel management system with website, API, and property management system.

## Workspace Structure

```
monorepo/
├── packages/
│   ├── web/           - Cloudflare Workers static site frontend
│   ├── api/           - Cloudflare Workers API backend
│   ├── shared/        - Shared Node.js utilities
│   └── pms/           - Flask Property Management System
├── package.json       - Root npm configuration
└── README.md          - This file
```

## Workspaces

### 🌐 `packages/web` - Frontend Website
Static hotel website deployed on Cloudflare Workers.
- **Tech**: HTML, CSS, JavaScript, Wrangler
- **Deploy**: `npm run deploy -w packages/web`
- **Dev**: `npm run dev -w packages/web`

### 🔌 `packages/api` - API Worker
Backend API endpoints for the website.
- **Tech**: Node.js, Cloudflare Workers
- **Deploy**: `npm run deploy -w packages/api`
- **Dev**: `npm run dev -w packages/api`

### 🔧 `packages/shared` - Shared Utilities
Shared code and constants for web and api packages.
- **Tech**: JavaScript/Node.js
- **Usage**: Import from `@sandbox-hotel/shared`

### 🏨 `packages/pms` - Property Management System
Full-featured hotel management platform.
- **Tech**: Flask, Python, PostgreSQL, SQLAlchemy
- **Setup**: `cd packages/pms && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
- **Run**: `cd packages/pms && python app.py`
- **Database**: PostgreSQL (production) / SQLite (local dev)

## Quick Start

### Node.js Packages

Install all dependencies:
```bash
npm install
```

Start development servers:
```bash
npm run dev -w packages/web
npm run deploy -w packages/web
```

### Python PMS

Set up Python environment:
```bash
cd packages/pms
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Access at: `http://localhost:5000`

## Dependencies Between Packages

- `web` → imports from `shared`
- `api` → imports from `shared`
- `pms` → independent Python application

## Deployment

- **Frontend**: `npm run deploy -w packages/web` → Cloudflare Workers
- **API**: `npm run deploy -w packages/api` → Cloudflare Workers
- **PMS**: Deploy Flask app to your server/platform

## Development

Each package is independent but shares common utilities. Work on any package:

```bash
# Web frontend
cd packages/web && npm run dev

# PMS
cd packages/pms && python app.py

# Shared utilities edits reflect in all packages automatically
```

## Git Workflow

```bash
# Make changes across packages
git add .
git commit -m "Feature description"
git push
```

All changes to any package will be tracked and versioned together.

## Configuration

Create `.env` files in each package as needed:
- `packages/web/.env` - Frontend config
- `packages/api/.env` - API config
- `packages/pms/.env` - PMS database and settings

Refer to `.env.example` files in each package.

## Support

See README files in each package folder for detailed documentation.
