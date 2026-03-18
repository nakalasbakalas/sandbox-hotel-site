# Priority Actions — Sandbox Hotel Site

**Last updated:** 2026-03-18

Actions marked ✅ are complete. Remaining items ordered by impact vs effort.

---

## Immediate / Low Effort

| # | Action | Impact | Risk |
|---|---|---|---|
| ✅ | Move `<meta charset>` + viewport before GTM snippet | Perf, spec compliance | None |
| ✅ | Remove `<link rel="shortcut icon">` | Cleanliness | None |
| ✅ | Add `<link rel="preconnect">` for GTM | Perf (LCP) | None |
| ✅ | Fix BreadcrumbList: both positions had same URL | SEO (schema validity) | None |
| ✅ | Fix hreflang mismatch (`zh-CN` vs `zh-Hans`) between HTML and sitemap | SEO | None |
| ✅ | Remove `role="button"` from `<summary>` | A11y | None |
| ✅ | Fix theme toggle `aria-label` | A11y | None |
| ✅ | Fix hero section `aria-label` from "Hero" | A11y | None |
| ✅ | Add `sandbox` + fix `referrerpolicy` on Google Maps iframe | Security | None |
| ✅ | Add `Secure` flag to session cookie | Security | None |
| ✅ | Restrict CORS from `*` to production origin | Security | Dev workflow (localhost) |
| ✅ | Add security response headers (XCTO, XFO, RP, PP) | Security | None |

---

## High Impact, Medium Effort

| # | Action | Impact | Risk | Notes |
|---|---|---|---|---|
| 1 | Add `aria-roledescription="carousel"` and `aria-live` to gallery carousel | A11y | Low | Update JS to emit ARIA live announcements on slide change |
| 2 | Fix skip link to use `clip-path` clip pattern | A11y | Low | CSS-only change |
| 3 | Add `<span class="sr-only">(opens in new tab)</span>` to `target="_blank"` links | A11y | Low | Small pattern to all external links in nav/contact |
| 4 | Update hero to use `<img fetchpriority="high">` instead of CSS `background-image` | Perf (LCP) | Medium | Requires layout refactor of hero section |
| 5 | Add image sitemap entries for SEO landing pages | SEO | None | Manual XML edits to `sitemap.xml` |
| 6 | Update `hero_review_count` strings and remove the 3 TODO comments | Maintainability | None | Verify current review count monthly |

---

## Medium Impact, Higher Effort

| # | Action | Impact | Risk | Notes |
|---|---|---|---|---|
| 7 | Add service worker for repeat-visit caching and offline fallback | Perf, UX | Medium | Careful cache invalidation strategy required |
| 8 | Create `migrations/` directory with authoritative D1 schema file | Reliability | Low | Export current schema via `wrangler d1 export` |
| 9 | Add `lint` script and ESLint config | Maintainability | Low | See `.eslintrc.json` in repo root |
| 10 | Add `purpose: "maskable"` variant to `site.webmanifest` icons | PWA | None | Requires a maskable icon asset |
| 11 | Add CI/CD pipeline for quality gates | DevOps | Low | See `.github/workflows/quality.yml` |

---

## Structural / Long-Term

| # | Action | Impact | Risk | Notes |
|---|---|---|---|---|
| 12 | Extract inline CSS from `index.html` into versioned, cacheable external stylesheet | Perf (cache), Maintainability | High | Requires introducing a build step or split manually |
| 13 | Extract inline i18n JS from `index.html` | Maintainability | High | Same — needs build pipeline or splitting strategy |
| 14 | Remove or repurpose dead workspace scaffolding (`packages/api`, `packages/web`, `packages/shared`) | Maintainability | Low | Confirm no future intent before deleting |
| 15 | Add unit tests for `src/index.js` endpoints | Reliability | Low | Use `vitest` + Cloudflare Workers test helpers |
| 16 | Convert hero background-image to positioned `<img>` | Perf (LCP) | Medium | Significant layout change |
