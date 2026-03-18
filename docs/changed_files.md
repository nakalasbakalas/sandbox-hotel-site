# Changed Files — 2026-03-18 Optimization Pass

| File | Change |
|---|---|
| `public/index.html` | Moved `<meta charset>` + viewport before GTM snippet (spec compliance + parsing safety) |
| `public/index.html` | Removed obsolete `<link rel="shortcut icon">` duplicate favicon declaration |
| `public/index.html` | Added `<link rel="preconnect" href="https://www.googletagmanager.com">` |
| `public/index.html` | Fixed BreadcrumbList JSON-LD: position 1 now points to `/hotels/nakhon-si-thammarat/` instead of `/` |
| `public/index.html` | Fixed hero `<section aria-label>` from "Hero" to a meaningful label |
| `public/index.html` | Removed erroneous `role="button"` from `<summary>` element |
| `public/index.html` | Improved theme toggle `aria-label` from "Theme" to "Switch colour theme" |
| `public/index.html` | Added `sandbox` attribute and changed `referrerpolicy` on Google Maps iframe |
| `public/sitemap.xml` | Fixed hreflang `zh-CN` → `zh-Hans` to match `index.html` |
| `src/index.js` | Replaced wildcard CORS with origin-reflective CORS restricted to production domains |
| `src/index.js` | Added `SECURITY_HEADERS` constant with XCTO, XFO, Referrer-Policy, Permissions-Policy |
| `src/index.js` | Applied security headers to all API responses via updated `withCors()` |
| `src/index.js` | Added `addSecurityHeaders()` helper applied to all static asset responses in `fetchAsset()` |
| `src/index.js` | Added `Secure` flag to session cookie in `buildSessionCookie()` and logout cookie clear |
| `docs/audit_summary.md` | New — technical audit findings and what was fixed |
| `docs/priority_actions.md` | New — ordered remaining action list with impact/risk |
| `docs/automation_matrix.md` | New — optimization agent system definition |
| `docs/changed_files.md` | New — this file |
| `.eslintrc.json` | New — ESLint config for JS quality enforcement |
| `.github/workflows/quality.yml` | New — CI quality gate workflow (lint + audit on PR/push) |
