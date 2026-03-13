# Sandbox Hotel - API

Backend API worker for Sandbox Hotel, deployed on Cloudflare Workers.

This worker is brochure-support only. It is not the authoritative booking engine or PMS API. Live availability, reservations, payments, and staff operations belong in the `sandbox-pms` repository.

## Endpoints

- `GET /api/health` - Health check
- `GET /api/rooms` - Brochure placeholder response only, not authoritative live inventory

## Development

```bash
npm run dev
```

## Deployment

```bash
npm run deploy
```

## Dependencies

- `@sandbox-hotel/shared` - Shared utilities and constants
