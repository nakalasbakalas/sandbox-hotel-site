# PHASE 1 BASELINE REPORT

## Current architecture

- **Production entrypoint:** `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/src/index.js` (Cloudflare Worker)
- **Homepage source of truth:** `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/index.html`
- **Homepage styles:** `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/assets/css/home.css`
- **Homepage behavior / i18n:** `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/assets/js/home.js`
- **Analytics:** `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/assets/js/analytics.js`
- **Static assets:** `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/assets/images/` and `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/images/`
- **SEO / metadata:** homepage head tags plus `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/robots.txt`, `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/sitemap.xml`, `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/site.webmanifest`
- **Booking / inquiry flow:** homepage form `#bookingForm`, direct contact CTAs, and Worker endpoint `POST /api/booking-ingest`

## Files inspected

- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/package.json`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/src/index.js`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/src/index.test.js`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/index.html`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/assets/js/home.js`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/assets/js/analytics.js`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/assets/css/home.css`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/robots.txt`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/sitemap.xml`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/site.webmanifest`

## Issues found

- Hero CTA copy claimed **“Call or LINE”** even though the CTA only opened a `tel:` link.
- Homepage locale packs still contained a stale **hardcoded Google review count** with a TODO note.
- Several homepage `data-i18n` hooks had **no matching locale keys**, so text stayed English / untranslated after language switching.
- Destination copy used `data-i18n` on paragraphs that contain inline HTML, which would prevent safe translated rich text from rendering.
- Booking submit and email actions **bypassed native form validation**, allowing outbound contact flows with missing required fields.
- Public gallery assets contained stray Windows **`.lnk` shortcut files**.
- Root lint command is still a repo risk: `npm run lint` references ESLint, but the repo currently does not install/configure ESLint.

## Issues fixed

- Updated the hero CTA label to match its actual behavior (`tel:` call CTA).
- Replaced stale hardcoded review-count strings with generic review wording and removed the embedded TODO-style copy.
- Added the missing homepage locale keys for trust copy, rate copy, booking hints, gallery text, and destination text.
- Switched destination summary paragraphs to `data-i18n-html` so translated emphasis markup can render correctly.
- Added booking-form validation gating before LINE and email flows run, including a checkout-after-checkin guard.
- Removed stray `.lnk` files from public gallery assets.
- Added focused regression tests for homepage i18n coverage and booking-form validation wiring.

## Lightweight QA notes

### Homepage
- Main homepage remains monolithic in `public/index.html` with extracted CSS/JS files.
- Hero, rooms, offers, gallery, reviews, FAQ, destination, location, and sticky CTA sections remain intact.

### Booking section
- Booking CTA paths: `#book`, `tel:`, LINE quick links, email button, Worker ingest.
- Submit/email flows now require valid form state before outbound contact is triggered.
- If JavaScript fails entirely, visible phone and LINE links still provide direct contact fallbacks.

### Mobile nav
- Primary mobile nav remains the `<details>`-based header menu with in-page anchors.
- No structural nav changes were made in Phase 1.

### Language switching
- Runtime language switching remains in `public/assets/js/home.js`.
- Homepage i18n coverage was checked against actual `data-i18n`, `data-i18n-html`, and `data-i18n-ph` hooks.

### Metadata / schema presence
- Homepage still includes canonical, hreflang, Open Graph, Twitter tags, and JSON-LD.
- `robots.txt`, `sitemap.xml`, and `site.webmanifest` remain present.

## Issues intentionally deferred

- **Lint baseline:** `npm run lint` is still broken because ESLint is not currently installed/configured in this repo snapshot.
- **Trust claims:** Google rating value (`4.8`) is still hardcoded in homepage copy and should be periodically verified against the live profile.
- **Analytics / SEO depth:** Phase 1 did not redesign schema, tracking taxonomy, or sitemap scope.
- **Broader content consistency audit:** Static SEO landing pages under `/public/hotels/*` and `/public/guides/*` were not fully rewritten in this pass.

## Risks for later phases

- Homepage content, i18n, and CTA behavior are still concentrated in a single large HTML page plus one large JS file.
- Hardcoded business data (rating, support hours, contact claims) still requires manual review discipline.
- Missing lint infrastructure weakens the repo’s automated no-regression baseline.

## Remaining punch-list

### UX
- Improve booking form feedback after submit attempt (success / failure messaging beyond outbound handoff).
- Review CTA hierarchy on mobile to reduce duplicated call / LINE prompts.

### Performance
- Audit homepage JS/CSS size and image compression opportunities.
- Revisit font loading and non-critical asset priorities.

### SEO
- Expand/verify metadata consistency across static subpages.
- Review structured data freshness and supporting entity details.

### Accessibility
- Run a broader accessibility audit on keyboard flows, focus states, and carousel announcements.
- Verify translated content for screen-reader clarity.

### Maintainability
- Split homepage locale/content data from runtime behavior where practical.
- Restore a working lint baseline with an explicit ESLint dependency and configuration.
