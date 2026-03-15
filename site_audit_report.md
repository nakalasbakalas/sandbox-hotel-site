# Site Audit Report

## Repo map
- **Runtime entrypoint in production:** `src/index.js` via `wrangler.jsonc`
- **Static site assets:** `public/`
- **Admin UI:** `public/admin/index.html`, `public/admin/app.js`, `public/admin/styles.css`
- **Workspace packages:** `packages/web`, `packages/api`, `packages/shared`
- **PMS app:** `packages/pms/` (Flask + SQLAlchemy + pytest suite)

## Fixed
- **Build script reliability**
  - `packages/web/package.json`
  - `packages/api/package.json`
  - Updated workspace scripts to invoke Wrangler through `node ../../node_modules/wrangler/bin/wrangler.js`, avoiding the tracked non-executable `.bin/wrangler` shim that caused `Permission denied` during baseline builds.
- **Admin UI text rendering / encoding cleanup**
  - `public/admin/app.js`
  - Replaced mojibake separators with HTML entities so reservation date ranges, user role separators, room labels, and folio quantities render consistently.
- **Broken PostgreSQL setup documentation**
  - `packages/pms/DATABASE-SETUP.md`
  - Corrected the invalid `ALTER ROLE` example from `default_tzoneTO` to `timezone`.
- **Dead import removal**
  - `packages/pms/pms/app.py`
  - Removed an unused `sqlalchemy as sa` import.
- **Portable PowerShell test execution**
  - `packages/pms/tests/test_phase13_security_hardening.py`
  - Test now uses `powershell` or `pwsh`, and skips only if neither executable exists.

## Found only
- **Fresh local admin flow still fails before bootstrap**
  - `src/index.js`, `wrangler.jsonc`
  - `/admin` calls `/api/bootstrap/status`, which queries `staff_users` immediately. In local Miniflare/D1 with no schema, this returns `500 Internal server error`.
- **Legacy / duplicate package structure remains**
  - `src/index.js`, `packages/api/src/index.js`, `packages/shared/src/index.js`, `README.md`, `README-MONOREPO.md`
  - The live Worker is rooted at `src/index.js`, while `packages/api` and `packages/shared` still present placeholder/legacy package structure and docs. This looks partially obsolete but is not proven safe to remove automatically.
- **Tracked dependency tree in repo history**
  - `node_modules/`
  - The repository tracks `node_modules`, which increases churn and platform-specific breakage risk.

## Deferred
- **Wrangler major-version upgrade**
  - Baseline validation shows Wrangler `3.114.17` is deprecated and `npm audit` reports vulnerabilities with a suggested major upgrade to `wrangler@4.73.0`.
  - Deferred because this is a tooling migration with runtime-compatibility risk.
- **Admin bootstrap/schema initialization for D1 local dev**
  - Needs schema source/migration strategy before auto-fixing.
- **README consolidation**
  - Root docs overlap and drift, but merging them is documentation cleanup beyond the lowest-risk scope.

## Not safe to change automatically
- **Remove `packages/api` / `packages/shared`**
  - Their runtime role is unclear from the current repo state; deletion could break expected workspace workflows.
- **Stop tracking `node_modules`**
  - High-impact repository hygiene change that would touch a very large surface area.
- **Rework root D1 schema/bootstrap model**
  - A safe fix needs product intent for first-run schema creation and deployment migration flow.
