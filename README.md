# Sandbox Hotel Site

Sandbox Hotel's brochure and marketing repository.

This repo is intentionally limited to the public-facing website, a small Cloudflare Worker API layer, and shared frontend utilities. The authoritative PMS and booking engine now live in the separate [`nakalasbakalas/sandbox-pms`](https://github.com/nakalasbakalas/sandbox-pms) repository.

## Source Of Truth

- `sandbox-hotel-site`:
  brochure site, marketing content, static assets, contact-style inquiry UX, and non-authoritative web helpers
- `sandbox-pms`:
  reservations, live availability, booking engine, front desk, housekeeping, cashier, payments, admin, reporting, and all operational business rules

Do not add operational PMS logic to this repo. If a feature needs live availability, reservation state, payment orchestration, or staff operations, it belongs in `sandbox-pms`.

## Domain Topology

Recommended production topology:

- `www.sandboxhotel.com` -> `sandbox-hotel-site`
- `book.sandboxhotel.com` -> public booking engine in `sandbox-pms`
- `staff.sandboxhotel.com` -> staff PMS in `sandbox-pms`

This repo does not reverse-proxy PMS traffic. It can only:

- link to the canonical booking and staff origins
- redirect convenience entry paths such as `/book` and `/staff`
- remain the marketing surface at `www`

See [docs/domain-topology.md](docs/domain-topology.md) for the shared deployment model and handoff between repos.
Production URL defaults for the brochure deploy target are in [.env.production.example](.env.production.example), while [.dev.vars.example](.dev.vars.example) stays local-only.

Metadata policy:

- keep brochure canonical metadata pinned to the live `www` domain
- do not template brochure canonicals to `book` or `staff`
- non-canonical preview hosts are marked `noindex` by the Worker

## Repo Structure

- `packages/web` - static hotel website on Cloudflare Workers
- `packages/api` - lightweight brochure-support API worker
- `packages/shared` - shared frontend utilities
- `packages/pms` - docs-only authority stub pointing to `sandbox-pms`
- `archive/pms-legacy-frozen` - archived legacy duplicate kept temporarily for reference only; do not run or edit

See [README-MONOREPO.md](README-MONOREPO.md) for the workspace structure and [docs/pms-authority-boundaries.md](docs/pms-authority-boundaries.md) for the architecture boundary.

## Quick Start

```bash
npm install
npm run dev
```

## Guardrails

- `npm run guard:pms-authority` verifies that `packages/pms` stays docs-only.
- Root `build`, `deploy`, and `dev` scripts run that guard automatically.
- The archived duplicate at `archive/pms-legacy-frozen` is frozen and non-authoritative.

## Deployment

- Development: `npm run dev`
- Build: `npm run build`
- Deploy: `npm run deploy`

The hotel-site deployment must remain brochure-only. Any operational PMS deployment belongs to `sandbox-pms`.
