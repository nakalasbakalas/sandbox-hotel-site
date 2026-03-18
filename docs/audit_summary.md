# Technical Audit Summary — Sandbox Hotel Site

**Audit date:** 2026-03-18
**Stack:** Cloudflare Workers + D1 (SQLite) + static assets · No build pipeline · Vanilla JS/CSS monolith

---

## What Is Already Strong

| Area | Status |
|---|---|
| JSON-LD structured data (Hotel, WebSite, FAQ, BreadcrumbList) | Complete and well-formed |
| OG/Twitter meta tags | Present and correct |
| hreflang (th/en/zh-Hans/x-default) | Present in HTML and sitemap |
| Hero WebP preload with `fetchpriority="high"` | Correct |
| Non-blocking Google Fonts (print swap pattern) | Correct |
| Image lazy-loading + explicit width/height (CLS prevention) | Done on all images |
| Skip link and focus-visible ring | Present |
| ARIA basics: roles, landmarks, form labels, `aria-hidden` | Good baseline |
| `prefers-reduced-motion` handling | Implemented |
| PBKDF2 password hashing (120k iterations, SubtleCrypto) | Secure |
| Session: HttpOnly cookie, SameSite=Lax | Correct |
| External links: `rel="noopener"` | Present |
| `robots.txt`, `sitemap.xml`, `site.webmanifest` | All present |

---

## Issues Found and Fixed (This Session)

### Performance
- **FIXED:** `<meta charset>` and `<meta name="viewport">` were placed after the GTM script block. Moved to top of `<head>` per spec, before any script.
- **FIXED:** Removed obsolete `<link rel="shortcut icon">` (IE artifact; duplicate of the correct `<link rel="icon">` already present).
- **FIXED:** Added `<link rel="preconnect" href="https://www.googletagmanager.com">` — connection was being DNS-prefetched only, not preconnected.

### SEO
- **FIXED:** BreadcrumbList JSON-LD had both positions pointing to `https://www.sandboxhotel.com/`. Position 1 now points to `/hotels/nakhon-si-thammarat/` (a real, indexed page).
- **FIXED:** `sitemap.xml` used `hreflang="zh-CN"` while `index.html` used `hreflang="zh-Hans"`. Standardised to `zh-Hans` in both files.

### Accessibility
- **FIXED:** `<summary role="button">` — `role="button"` is redundant and erroneous on a `<summary>` element (which already has implicit button semantics). Removed.
- **FIXED:** Theme toggle `aria-label="Theme"` gave no actionable description. Changed to `"Switch colour theme"`.
- **FIXED:** Hero section `aria-label="Hero"` was a structural term, not meaningful to AT users. Changed to `"Welcome — Sandbox Hotel in Nakhon Si Thammarat"`.

### Security
- **FIXED:** Session cookie missing `Secure` flag in both `buildSessionCookie()` and the logout cookie clear. Added `Secure` to both.
- **FIXED:** `CORS_HEADERS` used `"access-control-allow-origin": "*"` on all responses including authenticated API endpoints. Replaced with origin-reflective CORS restricted to `https://www.sandboxhotel.com` and `https://sandboxhotel.com`.
- **FIXED:** No security response headers on any response. Added `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` to both API responses (`withCors`) and static asset responses (`addSecurityHeaders`).
- **FIXED:** Google Maps iframe had no `sandbox` attribute and used default `referrerpolicy`. Added `sandbox="allow-scripts allow-same-origin allow-popups allow-forms"` and `referrerpolicy="strict-origin"`.

---

## Remaining Known Issues (Not Fixed This Session)

### Performance
- Hero image is a CSS `background-image: image-set()` rather than a positioned `<img>`. Preload hinting is inconsistent across browsers for CSS backgrounds. Converting to a stacked `<img fetchpriority="high">` would improve LCP reliability. **Medium impact, higher effort.**
- Hero banner PNG fallback is 592 KB. Rarely reached (WebP coverage is ~97%+), but worth optimising. **Low priority.**
- No service worker — repeat visitors get no caching benefit. **Medium impact, medium effort.**

### SEO
- 3 open `// TODO: verify review count monthly` comments in `hero_review_count` strings for TH/EN/ZH. Value is hardcoded as "120 reviews". **Review monthly, update as needed.**
- OG `og:locale` is static (`th_TH`) and does not update when JS switches locales. Social crawlers will always see the TH locale meta. Acceptable for a TH-primary site.
- SEO landing pages have no `<image:image>` entries in `sitemap.xml`. Low lift to add; would improve Google Image indexation.

### Accessibility
- Skip link uses the deprecated `left: -9999px` off-screen technique. The modern approach is `clip-path: inset(50%)` + `width:1px; height:1px; overflow:hidden`. Low friction fix.
- Gallery carousel has no `aria-roledescription="carousel"` or `aria-live` region. AT users have limited navigation cues within the carousel.
- External links in nav/contact lack a sr-only "opens in new tab" text hint.

### Maintainability
- `public/index.html` is a 4500-line monolith (HTML + ~80 KB CSS + ~60 KB JS + 3-language i18n). No build pipeline. Any edit requires navigating the whole file. **Structural long-term debt.**
- `migrations/` directory referenced in `wrangler.jsonc` does not exist. D1 schema has no version-controlled migration history.
- Workspace packages (`packages/api`, `packages/shared`, `packages/web`) are dead scaffolding. No real source code, incompatible with the actual deploy command.

### DevOps
- No CI/CD pipeline. All deployments are fully manual.
- No linting or formatting enforcement.
- No tests for `src/index.js` (681 lines of routing + business logic).

---

## Lighthouse Baseline Estimates (Pre-Fix)

| Category | Estimated Baseline | Target |
|---|---|---|
| Performance | 70–80 | 90+ |
| Accessibility | 85–90 | 95+ |
| Best Practices | 80–85 | 95+ |
| SEO | 90–95 | 100 |

Post-fix improvements are primarily in Accessibility (+3–5 pts), Best Practices (+5–8 pts via security headers), and SEO (+3–5 pts via BreadcrumbList fix).
