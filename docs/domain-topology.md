# Domain Topology

This repo is the marketing surface for Sandbox Hotel. The operational booking engine and PMS live in `sandbox-pms`.

## Recommended Topology

- `https://www.sandboxhotel.com` -> `sandbox-hotel-site`
- `https://book.sandboxhotel.com` -> public booking engine in `sandbox-pms`
- `https://staff.sandboxhotel.com` -> staff PMS in `sandbox-pms`

`book` and `staff` can point at the same Flask deployment. They are separate canonical hosts for different audiences, not separate PMS applications.

## What This Repo Does

- serves the brochure site
- links to the booking engine and staff app using explicit environment variables
- redirects convenience paths:
  - `/book` -> booking engine root
  - `/book/...` -> booking engine path
  - `/staff/...` -> staff PMS path
  - `/availability`, `/booking/...`, `/payments/...` -> booking engine path

## What This Repo Does Not Do

- it does not proxy PMS traffic through `www`
- it does not own reservation, payment, or staff operational logic
- it does not share auth state with the PMS

## Environment Variables

Configure these in local `.dev.vars`, CI, and deployment environments:

- `MARKETING_SITE_URL`
- `BOOKING_ENGINE_URL`
- `STAFF_APP_URL`

`SITE_URL` can remain as the brochure alias, but future work should prefer `MARKETING_SITE_URL`.

Production defaults for this repo are captured in [.env.production.example](/C:/Users/nakal/OneDrive/Documents/GitHub/sandbox-hotel-site/.env.production.example). Keep `.dev.vars.example` for local-only values.

## DNS And Custom-Domain Mapping

Production intent:

- `www.sandboxhotel.com` custom domain -> this Cloudflare Worker
- `book.sandboxhotel.com` custom domain -> PMS service
- `staff.sandboxhotel.com` custom domain -> PMS service

This repo does not provision those mappings directly. It expects Cloudflare custom-domain setup for `www` and explicit booking/staff origins to be configured in environment variables.

## Metadata Decision

Keep the homepage canonical, Open Graph URL, and Twitter URL statically pinned to the live `https://www.sandboxhotel.com/` origin.

Why:

- the brochure site has one real public marketing origin
- canonical metadata should stay stable for SEO
- deploy-time templating adds complexity without improving the current architecture

To protect staging and preview hosts, the Worker now sets `X-Robots-Tag: noindex, nofollow` whenever the request host does not match `MARKETING_SITE_URL`.

## Cross-Origin Expectations

- browser navigation between `www`, `book`, and `staff` is expected
- no shared browser session across brochure and PMS origins is required
- any future cross-origin API integration should be explicit and security-reviewed

## Infra Handoff

Operational PMS DNS, TLS, custom domains, and canonical host enforcement live with the `sandbox-pms` deployment. This repo only needs the correct public origins to link and redirect safely.
