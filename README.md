# Sandbox Hotel Site

A complete hotel management system with website, API, and property management system.

## Project Structure

This is a **monorepo** containing multiple packages:

- **`packages/web`** - Static hotel website (Cloudflare Workers)
- **`packages/api`** - REST API backend (Cloudflare Workers)
- **`packages/shared`** - Shared Node.js utilities
- **`packages/pms`** - Flask Property Management System (full hotel ops)

## Quick Start

### Frontend Development
```bash
npm run dev -w packages/web
```

### Deploy Website
```bash
npm run deploy -w packages/web
```

### PMS (Property Management System)
```bash
cd packages/pms
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

## Full Documentation

See [README-MONOREPO.md](README-MONOREPO.md) for complete monorepo documentation.

## Packages

### Web Frontend
- **Location**: `packages/web/`
- **Tech**: HTML, CSS, JavaScript, Cloudflare Workers
- **Commands**: `npm run dev`, `npm run deploy`

### API Backend  
- **Location**: `packages/api/`
- **Tech**: Node.js, Cloudflare Workers
- **Commands**: `npm run dev`, `npm run deploy`

### Shared Utilities
- **Location**: `packages/shared/`
- **Tech**: Node.js / JavaScript
- **Used by**: `web`, `api` packages

### PMS (Property Management System)
- **Location**: `packages/pms/`
- **Tech**: Python, Flask, PostgreSQL
- **Features**: Reservations, staff auth, housekeeping, cashier, admin panel, reporting
- **Run**: `cd packages/pms && python app.py`

## Installation

```bash
# Install Node.js dependencies
npm install

# Set up Python PMS
cd packages/pms
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Configuration

Each package has its own `.env.example` file. Copy and customize:

```bash
# For each package directory
cp .env.example .env
# Then edit .env with your actual values
```

## Deployment

- **Development**: `npm run dev -w packages/web`
- **Staging**: Deploy to Cloudflare Workers (requires auth)
- **Production**: See deployment section in individual package READMEs
