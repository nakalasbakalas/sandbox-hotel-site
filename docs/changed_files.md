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
| `public/index.html` | Switched localized external links to `data-i18n-html` and appended locale-specific sr-only "opens in new tab" text for Maps/Facebook actions |
| `public/sitemap.xml` | Added missing homepage image sitemap entries for the twin room and lobby assets |
| `public/404.html` | Added Open Graph image metadata so the 404 page now exposes a social preview image and alt text |
| `public/privacy.html` | Added Open Graph image metadata and alt text for social sharing consistency |
| `public/hotels/*/index.html` | Added `og:image:alt` metadata to hotel landing pages |
| `public/guides/*/index.html` | Added `og:image:alt` metadata to guide pages |
| `public/index.html` | Updated Open Graph alternate locale from `zh_CN` to `zh_Hans` for metadata consistency |
| `public/index.html` | Tightened homepage Hotel/WebSite JSON-LD to factual fields only; removed unverifiable rating/payment/audience claims and added IDs, map, expanded image set, and contact metadata |
| `public/privacy.html` | Added `hreflang` alternates and locale metadata for TH/EN/ZH variants |
| `public/hotels/*/index.html` | Added TH and `zh-Hans` hreflang alternates to hotel landing pages |
| `public/guides/*/index.html` | Added TH and `zh-Hans` hreflang alternates to guide pages |
| `public/hotels/*/index.html` | Normalized page titles and meta/social descriptions across hotel landing pages |
| `public/guides/*/index.html` | Normalized page titles and meta/social descriptions across guide pages |
| `docs/remaining_items_plan.md` | Synced tracker statuses after verifying localized external-link fixes, `book_tip` coverage, landing-page link state, and carousel roledescription |
| `public/hotels/*/index.html` | Normalized visible breadcrumb labels to match schema/page titles on hotel landing pages |
| `public/guides/*/index.html` | Normalized visible breadcrumb labels to match schema/page titles on guide pages |
| `.eslintrc.json` | New — ESLint config for JS quality enforcement |
| `.github/workflows/quality.yml` | New — CI quality gate workflow (lint + audit on PR/push) |
