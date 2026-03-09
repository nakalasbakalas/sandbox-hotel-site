# Sandbox Hotel - API

Backend API worker for Sandbox Hotel, deployed on Cloudflare Workers.

## Endpoints

- `GET /api/health` - Health check
- `GET /api/rooms` - Get available rooms
- `POST /api/bookings` - Create a booking

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
