# `packages/pms`

This path is intentionally docs-only.

`sandbox-hotel-site` is no longer allowed to contain an active PMS implementation. The canonical PMS and booking engine live in the separate `nakalasbakalas/sandbox-pms` repository.

Use `sandbox-pms` for:
- live availability
- reservations and booking engine behavior
- front desk workflows
- housekeeping operations
- cashier and folio logic
- payments
- admin configuration
- communications
- reporting

Do not add Python app code, migrations, templates, tests, or deployment config here.

See [ARCHITECTURE.md](ARCHITECTURE.md) for the authority boundary.
