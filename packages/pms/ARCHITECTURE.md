# PMS Authority Boundary

## What lives in `sandbox-hotel-site`

- brochure and marketing pages
- static assets and public copy
- brochure-support Cloudflare Worker code
- links or embeds that point guests into the real booking flow

## What lives in `sandbox-pms`

- PMS domain models and migrations
- live inventory and availability
- booking engine and reservation lifecycle
- staff auth and permissions
- front desk, housekeeping, cashier, payments, admin, and reporting

## Rules

1. Do not reimplement PMS business logic in `sandbox-hotel-site`.
2. Do not add a second reservation or payment workflow here.
3. If the brochure repo needs booking functionality, integrate with `sandbox-pms`; do not duplicate it.
4. Keep `packages/pms` documentation-only so the repo boundary stays obvious.
