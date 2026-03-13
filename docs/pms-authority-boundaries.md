# PMS Authority Boundaries

This note defines the permanent ownership split between the two Sandbox Hotel repositories.

## Canonical Repositories

- `nakalasbakalas/sandbox-hotel-site`
  Brochure site, public marketing content, static UX, and lightweight brochure-support APIs
- `nakalasbakalas/sandbox-pms`
  Operational PMS and booking engine source of truth

## What lives in `sandbox-hotel-site`

- marketing pages
- public content and assets
- static inquiry flows
- brochure analytics
- non-authoritative helper endpoints needed by the website

## What lives in `sandbox-pms`

- authoritative live availability
- reservations and booking engine rules
- staff auth and permissions
- front desk workflows
- housekeeping workflows
- cashier, folio, and payment orchestration
- admin configuration
- notifications and reporting

## Integration Rule

If the hotel site needs operational booking behavior, it must call into or link to `sandbox-pms`. It must not duplicate PMS code or drift into a second operational source of truth.

## Legacy Duplicate

`archive/pms-legacy-frozen` is a frozen archive of the old duplicate copy that previously lived in this repo. It is kept only as a short-term reference artifact and must not be deployed or treated as active code.

`packages/pms` is now intentionally documentation-only so contributors hit the boundary immediately.
