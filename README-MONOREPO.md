# Sandbox Hotel Site Workspace

This repo is the brochure-site workspace for Sandbox Hotel. It is no longer the home of the operational PMS.

## Authority Boundary

- Canonical PMS + booking engine repo: [`nakalasbakalas/sandbox-pms`](https://github.com/nakalasbakalas/sandbox-pms)
- Brochure/marketing repo: `nakalasbakalas/sandbox-hotel-site`

The `sandbox-hotel-site` workspace must not contain active PMS business logic. If a feature depends on live inventory, reservations, cashier, housekeeping, staff auth, payments, or admin operations, it belongs in `sandbox-pms`.

Recommended domain split:

- `www.<domain>` for this brochure workspace
- `book.<domain>` for the public booking engine in `sandbox-pms`
- `staff.<domain>` for the staff PMS in `sandbox-pms`

The brochure repo may redirect into those origins, but it should not proxy or absorb operational PMS behavior.

## Workspace Structure

```text
sandbox-hotel-site/
  packages/
    web/                 Cloudflare Workers static site frontend
    api/                 Brochure-support API worker
    shared/              Shared frontend utilities
    pms/                 Docs-only authority stub
  docs/
    pms-authority-boundaries.md
  archive/
    pms-legacy-frozen/   Archived duplicate snapshot; frozen, not authoritative
  scripts/
    guard-pms-authority.mjs
```

## Active Workspaces

### `packages/web`
- Static hotel website
- Deploys on Cloudflare Workers

### `packages/api`
- Lightweight API worker for brochure support
- Must not become a second booking engine

### `packages/shared`
- Shared utilities for `web` and `api`

## Non-Workspace PMS Paths

### `packages/pms`
This directory is intentionally docs-only. It exists to redirect contributors to `sandbox-pms` and to make the repo boundary obvious.

### `archive/pms-legacy-frozen`
This is a frozen archive of an old duplicate PMS copy. It is intentionally excluded from workspaces, must not be deployed, and must not be used as a source of truth.

## Guardrails

- `npm run guard:pms-authority`
  Verifies that `packages/pms` stays docs-only and that the root workspace list does not reintroduce `packages/pms`.
- Root `dev`, `build`, and `deploy` scripts run the guard first.

## Development

```bash
npm install
npm run dev
```

For PMS work, use the separate `sandbox-pms` repo.

## Support

- Brochure repo boundary note: [docs/pms-authority-boundaries.md](docs/pms-authority-boundaries.md)
- Canonical PMS implementation: `nakalasbakalas/sandbox-pms`
