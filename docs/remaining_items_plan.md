# Sandbox Hotel — Milestone Tracker

_Last updated: 2026-03-18_

Status labels: ✅ Done · 🔒 Blocked · ⏳ Deferred · 🔧 Actionable

---

## Hard-Blocked (external action required)

| # | Item | Reason |
|---|------|--------|
| B1 | Create `migrations/` directory | Needs `wrangler d1 export` against live DB to produce authoritative schema |
| B2 | Update `hero_review_count` strings (TH/EN/ZH) + remove 3 TODO comments | Business decision — verify actual Google review count before changing hardcoded "120" |
| B3 | `YOUR_LINE_ID` placeholder in contact fallback logic (`index.html` lines 4045, 4049) | Replace with real LINE Official Account ID once account is confirmed |

---

## Deferred (needs explicit request or layout surgery)

| # | Item | Notes |
|---|------|-------|
| D1 | Hero CSS `background-image` → `<img fetchpriority="high">` refactor | Significant layout change; improves LCP but needs markup surgery + CSS rewrite |
| D2 | Extract inline CSS from `index.html` into versioned external stylesheet | Requires a build pipeline; high risk for regression |
| D3 | Extract inline i18n JS from `index.html` | Same — needs build step |
| D4 | Remove dead workspace scaffolding (`packages/api`, `packages/web`, `packages/shared`) | Confirm there is no future intent before deleting; also remove from `package.json` workspaces |
| D5 | Hero banner PNG fallback (592 KB) | Low priority; WebP coverage ~97% |
| D6 | `og:locale` is static (`th_TH`) and does not update on JS locale switch | Acceptable for TH-primary site; social crawlers always see TH meta |
| D7 | English copy refinements (hero_best_rate, rooms_fine, offer title consolidation) | See `docs/localization/source_copy_audit.md` — production-ready as-is |

---

## Actionable — Accessibility

| # | Item | Files | Status |
|---|------|-------|--------|
| A1 | ✅ Fix skip link to use `clip-path: inset(50%)` pattern | `public/index.html` CSS | ✅ Done 2026-03-18 |
| A2 | ✅ navLineBtn aria-label updated to include "(opens in new tab)" | `public/index.html` line 2244 | ✅ Done 2026-03-18 |
| A3 | ✅ Add `<span class="sr-only">` "(opens in new tab)" to 5 plain-text `target="_blank"` links (contactLine, contactWhatsApp, stickyLine, stickyWA, Facebook) | `public/index.html` lines 2919–2926, 2987–2988 | ✅ Done 2026-03-18 |
| A4 | Add "(opens in new tab)" to `data-i18n` external links (View on Google Maps, Facebook btn, Map) | `public/index.html` lines 2743, 2744, 2925 | 🔧 Needs `data-i18n-html` upgrade + 3 locale string edits |
| A5 | Add `<span class="sr-only">(opens in new tab)</span>` to external links on SEO landing pages | `public/hotels/*/index.html`, `public/guides/*/index.html` | 🔧 Low friction; check each page for target="_blank" |
| A6 | ✅ Gallery carousel — `aria-live`, slide role/label, `setIndex()` live announcements | `public/index.html` | ✅ Done 2026-03-18 Pass 2 |
| A7 | Add `aria-roledescription="carousel"` to the carousel container itself | `public/index.html` | 🔧 1-line addition |

---

## Actionable — SEO

| # | Item | Files | Status |
|---|------|-------|--------|
| S1 | ✅ Add `<image:image>` entries to SEO landing page `<url>` blocks in sitemap | `public/sitemap.xml` | ✅ Done 2026-03-18 |
| S2 | Add `<image:image>` entries for room/gallery images on main homepage `<url>` block | `public/sitemap.xml` | 🔧 Already has 2 entries; add twin room + lobby |

---

## Actionable — i18n / Localization

| # | Item | Files | Status |
|---|------|-------|--------|
| L1 | ✅ `book_checkin_info` and `book_id_note` i18n keys (TH/EN/ZH) | `public/index.html` | ✅ Already present in all 3 locales |
| L2 | Add missing i18n key: `book_tip` (currently hardcoded HTML in TH/ZH fallback) | `public/index.html` | 🔧 Verify all locales have this key |
| L3 | Switch 3 `data-i18n` external link buttons to `data-i18n-html` and append sr-only hint per locale | `public/index.html` | 🔧 Moderate effort — 3 HTML attrs + 9 string edits |
| L4 | Add short button label variants for narrow mobile (identified in localization audit) | `public/index.html` | 🔧 Localization team decision |

---

## Actionable — Performance

| # | Item | Files | Status |
|---|------|-------|--------|
| P1 | ✅ Hero preload hint updated with `imagesrcset` / `imagesizes` for mobile LCP | `public/index.html` line 53 | ✅ Done 2026-03-18 Pass 2 |
| P2 | ✅ Service worker for repeat-visit caching and offline fallback | `public/sw.js` + registration in `public/index.html` | ✅ Done 2026-03-18 Pass 2 |
| P3 | Add `purpose: "maskable"` icon variant to `site.webmanifest` | `public/site.webmanifest` | 🔧 Requires maskable icon asset first |

---

## Actionable — DevOps / Quality

| # | Item | Files | Status |
|---|------|-------|--------|
| Q1 | ✅ ESLint wired into GitHub Actions (`lint` job) | `.github/workflows/quality.yml` | ✅ Done |
| Q2 | ✅ `npm audit` wired into GitHub Actions (`audit` job) | `.github/workflows/quality.yml` | ✅ Done |
| Q3 | ✅ Lighthouse CI job live in GitHub Actions | `.github/workflows/quality.yml` + `.lighthouserc.json` | ✅ Done 2026-03-18 Pass 2 |
| Q4 | ✅ axe-core static accessibility job live in GitHub Actions | `.github/workflows/quality.yml` + `scripts/axe-check.js` | ✅ Done 2026-03-18 Pass 2 |
| Q5 | Wire ESLint pre-commit hook (`.eslintrc.json` exists; no hook yet) | `.husky/` or `package.json` lint-staged | 🔧 Low friction — add husky + lint-staged |
| Q6 | Add unit tests for `src/index.js` (~38 KB of routing + business logic) | `src/__tests__/` | 🔧 Use vitest + Cloudflare Workers test helpers |
| Q7 | Migrate LHCI upload from `temporary-public-storage` to a persistent target | `.lighthouserc.json` | 🔧 Needs LHCI server or Chromatic/similar |
| Q8 | Add SEO validation script: parse meta, sitemap, JSON-LD for regressions | `scripts/seo-check.js` + `quality.yml` | 🔧 Medium effort |
| Q9 | Add image audit script: check WebP coverage + file sizes | `scripts/image-audit.js` + `quality.yml` | 🔧 Medium effort |

---

## Actionable — Maintainability

| # | Item | Files | Status |
|---|------|-------|--------|
| M1 | `migrations/` directory + D1 schema version control | See B1 (blocked) | 🔒 |
| M2 | Remove dead workspace packages from `package.json` `workspaces` array | `package.json` | See D4 |
| M3 | Document `YOUR_LINE_ID` configuration step in README or ARCHITECTURE.md | `docs/ARCHITECTURE.md` | 🔧 Document-only change |

---

## Previously Completed (Pass 1 + Pass 2, 2026-03-18)

| Item |
|------|
| ✅ CORS changed from wildcard `*` to origin-reflective (`ALLOWED_ORIGINS` Set) |
| ✅ Security headers added to all responses (XCTO, XFO, RP, PP) |
| ✅ Session cookie `Secure` flag added |
| ✅ `<meta charset>` + viewport moved before GTM script (spec compliance) |
| ✅ BreadcrumbList position 1 → `/hotels/nakhon-si-thammarat/` |
| ✅ hreflang unified to `zh-Hans` across `index.html` + `sitemap.xml` |
| ✅ `role="button"` removed from `<summary>` |
| ✅ Maps iframe sandboxed |
| ✅ Gallery carousel ARIA (`aria-live`, slide roles, live region) |
| ✅ Hero preload `imagesrcset`/`imagesizes` |
| ✅ Service worker (`public/sw.js`) + registration |
| ✅ Lighthouse CI (`.lighthouserc.json`) |
| ✅ axe accessibility CI (`scripts/axe-check.js`) |
| ✅ Canonical GTM ID `GTM-MPNHZC8S` across all pages |
| ✅ ZH transcreation strings applied |
| ✅ All 5 SEO landing pages exist with full content |
| ✅ `<image:image>` sitemap entries added for main page hero + gallery |
