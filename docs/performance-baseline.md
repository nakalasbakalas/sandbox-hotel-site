# Performance Baseline & Optimization Plan

**Last updated:** 2026-03-23

This document records the current performance state, what was changed as part of the optimization sprint, and what remains as follow-up work.

---

## Baseline (before this sprint)

| Metric | Estimated state |
|--------|----------------|
| `public/index.html` size | ~4,446 lines (~180 KB uncompressed) |
| Inline CSS | ~1,940 lines in a single `<style>` block — uncacheable |
| Inline JS | ~1,480 lines in a single `<script>` block — uncacheable |
| Hero image delivery | CSS `background-image` via `image-set()` — browser cannot preload reliably |
| Repeat-visit caching | No explicit `Cache-Control` on static assets beyond Cloudflare defaults |
| LCP element | Hero CSS background (undetectable by browser preload scanner) |

---

## Changes made in this sprint

### 1. CSS extraction — `public/assets/css/home.css`

**Before:** All CSS (~1,940 lines) was inline in `<style>` in every HTML response. Browsers re-parse the CSS on every visit and cannot cache it independently.

**After:** CSS extracted to `public/assets/css/home.css` and loaded via `<link rel="stylesheet">`. The Worker now sends `Cache-Control: public, max-age=31536000, immutable` for `/assets/css/` paths. After the first load, the CSS file is served from browser cache on repeat visits.

**Impact:** ~1,930 lines removed from the HTML payload. Repeat visits skip re-downloading the CSS entirely.

### 2. JS extraction — `public/assets/js/home.js`

**Before:** ~1,480 lines of homepage JS was inline and re-parsed on every page load.

**After:** JS extracted to `public/assets/js/home.js` and loaded via `<script defer src="...">`. The Worker caches `/assets/js/` paths for 1 year. The `defer` attribute ensures it does not block HTML parsing.

**Impact:** ~1,480 lines removed from the HTML payload. `defer` removes any render-blocking behavior. JS is browser-cached on repeat visits.

### 3. Hero LCP improvement

**Before:** The hero image was applied as a CSS `background-image` via `image-set()`. CSS backgrounds are not visible to the browser's preload scanner, so the image was not requested until after CSS was parsed and applied — delaying LCP.

**After:** The hero image is now a `<picture>` element with `<img fetchpriority="high" decoding="async">` as the first child of the `.hero` container. The `fetchpriority="high"` hint tells the browser to prioritize this resource during the initial load. Combined with the existing `<link rel="preload">` in the `<head>`, this gives the hero image maximum priority.

**Impact:** More reliable and earlier LCP. The browser can start fetching the hero image while parsing HTML, rather than waiting for CSS parsing and first paint.

### 4. Cache-Control headers in Cloudflare Worker

**Before:** The `fetchAsset()` function in `src/index.js` passed asset responses through without modifying cache headers, relying entirely on Cloudflare's default caching behavior.

**After:** `setCacheHeaders()` now sets explicit `Cache-Control` headers:

| Path pattern | Cache-Control |
|---|---|
| `/assets/css/*`, `/assets/js/*`, `/assets/images/*`, `/images/*` | `public, max-age=31536000, immutable` (1 year) |
| `*.html`, `/`, `/admin` | `public, max-age=0, must-revalidate` |
| `*.ico`, `*.webmanifest`, `*.xml` | `public, max-age=86400` (1 day) |

**Impact:** Versioned static assets are now cached for 1 year in browsers and CDN edge nodes. HTML pages are always validated, ensuring users always get the latest content.

---

## Remaining follow-up work

### High priority
- [ ] **Cache busting for `home.css` and `home.js`**: Currently, if you update `home.css` or `home.js`, users with a cached version will not get the update until 1 year expires. Add file hashing/versioning (e.g. `home.v2.css`) or use a build step (esbuild, Vite) with content-hashed filenames.
- [ ] **Service worker** (`/sw.js`): The HTML registers a service worker but `public/sw.js` may not exist. Implement a proper service worker for offline fallback and repeat-visit caching.
- [ ] **Hero PNG fallback size**: The `images/Sandbox-Hotel-Hero-Banner.png` file is ~592 KB. Re-export as a compressed JPEG or smaller PNG for the `<img>` fallback. WebP is already served for modern browsers.

### Medium priority
- [ ] **Critical CSS inlining**: Extract only the above-the-fold CSS (nav, hero, trust strip — roughly 200 lines) and inline it in the `<head>`, while loading the rest of `home.css` asynchronously. This eliminates render-blocking entirely for first paint.
- [ ] **Image size budget**: Audit all images in `public/assets/images/` and `public/images/` to ensure no originals exceed 200 KB.
- [ ] **JS code splitting**: Split `home.js` into smaller modules: `home-core.js` (theme, device, nav), `home-booking.js` (date picker, booking summary), `home-gallery.js` (carousel, room thumbs). Load non-critical modules lazily.

### Low priority / structural
- [ ] **Build pipeline**: Add a build step that minifies CSS and JS and generates content-hashed filenames for `home.css` and `home.js`.
- [ ] **Admin app**: Review `public/admin/app.js` for startup cost. Consider combining `/api/bootstrap/status` and `/api/session` bootstrap checks.
- [ ] **Dead scaffolding**: Remove or archive `packages/api`, `packages/shared`, `packages/web` workspace packages confirmed to be unused.
- [ ] **Lighthouse CI**: Add Lighthouse CI thresholds to `.github/workflows/quality.yml` so performance regressions are caught in CI.

---

## Measuring improvement

Run Lighthouse against the production URL or a local dev server after deploying:

```bash
# Quick local check (requires Node.js 18+)
node scripts/perf-check.js
```

Or use the Chrome DevTools Lighthouse panel / [PageSpeed Insights](https://pagespeed.web.dev/) on:
- `https://www.sandboxhotel.com/`
- `https://www.sandboxhotel.com/admin`

Key metrics to watch:
- **LCP**: Should improve due to `fetchpriority="high"` on hero image
- **FCP**: Should improve due to smaller HTML and no render-blocking inline CSS
- **Repeat visit TTI**: Should improve due to browser caching of CSS/JS assets
- **Total byte weight (first visit)**: Similar (CSS+JS served separately), but browser cache eliminates redundant bytes on repeat visits

---

## Asset inventory after optimization

| Asset | Size | Cache TTL |
|---|---|---|
| `public/index.html` | ~1,039 lines (~42 KB) | must-revalidate |
| `public/assets/css/design-tokens.css` | ~100 lines | 1 year |
| `public/assets/css/home.css` | ~1,933 lines | 1 year |
| `public/assets/js/analytics.js` | small | 1 year |
| `public/assets/js/home.js` | ~1,482 lines | 1 year |
| `images/Sandbox-Hotel-Hero-Banner.webp` | ~600 KB | 1 year |
| `images/Sandbox-Hotel-Hero-Banner.png` | ~592 KB | 1 year |
