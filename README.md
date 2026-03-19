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

For the root Cloudflare Worker, local runtime variables live in `.dev.vars`:

```bash
cp .dev.vars.example .dev.vars
```

Email-related Worker settings:

- `BOOKING_EMAIL_FORWARD_TO`: verified Cloudflare Email Routing destination for inbound `booking@...` mail
- `EMAIL_ROUTING_ALLOWED_LOCAL_PARTS`: optional inbound alias allowlist, defaults to `booking,reservations`
- `POSTMARK_SERVER_TOKEN`: Postmark server token for outbound booking acknowledgements
- `POSTMARK_MESSAGE_STREAM`: optional Postmark message stream, defaults to `outbound`
- `BOOKING_FROM_EMAIL`: sender address for acknowledgements, defaults to `booking@sandboxhotel.com`
- `BOOKING_REPLY_TO_EMAIL`: reply-to address for acknowledgements, defaults to `booking@sandboxhotel.com`

To finish setup in Cloudflare:

1. Verify the destination inbox in Email Routing.
2. Create or edit the Email Worker route for `booking@sandboxhotel.com` so it points to this Worker.
3. Set `POSTMARK_SERVER_TOKEN` with `npx wrangler secret put POSTMARK_SERVER_TOKEN`.
4. Set the non-secret runtime vars from `.dev.vars.example` in your production Worker environment.

## Deployment

- **Development**: `npm run dev -w packages/web`
- **Staging**: Deploy to Cloudflare Workers (requires auth)
- **Production**: See deployment section in individual package READMEs
