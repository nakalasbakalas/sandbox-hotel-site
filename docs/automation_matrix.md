# Automation Matrix — Sandbox Hotel Site

**Last updated:** 2026-03-18

Defines the optimization agent system: what each check covers, when it runs, its threshold, output, and blocking behaviour.

---

## Trigger Legend

| Symbol | Trigger |
|---|---|
| 🔁 | Every local dev cycle (pre-commit) |
| 🔀 | Every commit / PR open |
| 🚀 | On deploy |
| 📅 | Scheduled (weekly/monthly) |

---

## Agent / Check Matrix

| # | Agent | Purpose | Trigger | Threshold / Rule | Output | Blocking? |
|---|---|---|---|---|---|---|
| 1 | **Lint + Format** | Enforce code style, catch syntax errors | 🔁 🔀 | Zero ESLint errors; Prettier-clean | Pass/fail diff | ✅ Blocks commit |
| 2 | **Performance Smoke** | Key CWV signals and resource budget | 🔀 🚀 | LCP < 2.5 s, CLS < 0.1, no render-blocking JS, hero preload present | Lighthouse JSON summary | ⚠️ Warns on PR; blocks on deploy |
| 3 | **Accessibility Check** | WCAG 2.1 AA scan | 🔀 | Zero axe critical/serious violations; heading order correct; all images have alt | axe report | ✅ Blocks PR merge |
| 4 | **SEO Validation** | Meta, canonical, JSON-LD, hreflang consistency | 🔀 🚀 | Unique title + description; canonical present; BreadcrumbList items have distinct URLs; hreflang consistent between HTML and sitemap | SEO summary report | ⚠️ Warns on PR; blocks on deploy |
| 5 | **Image Optimisation** | Detect oversized or non-WebP assets | 📅 🚀 | No PNG/JPG > 200 KB reachable without WebP equivalent; all room/gallery images have WebP + 400px thumb variants | List of offending files | ⚠️ Warns |
| 6 | **Font / Loading** | Check non-blocking font strategy intact | 🔀 | `font-display: swap` present; no synchronous stylesheet for Fonts; hero image preloaded | Pass/fail | ⚠️ Warns |
| 7 | **Dead Code / Unused Assets** | Find unreferenced JS, CSS, images | 📅 | No `<img src>` or CSS `url()` references pointing to missing files; no JS imports unresolved | List of dead references | ⚠️ Warns |
| 8 | **Security Headers** | Verify response headers on production | 🚀 📅 | `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy` non-empty, `Permissions-Policy` present | Header audit report | ✅ Blocks deploy |
| 9 | **Dependency Audit** | Check for known vulnerabilities | 🔀 📅 | Zero high/critical severity CVEs in npm deps | `npm audit` report | ✅ Blocks PR (high/crit) |
| 10 | **Responsive / UI Regression** | Catch layout overflow, broken grids | 📅 | No horizontal scroll at 320/768/1280 px; no clipped interactive elements in screenshots | Visual diff or Playwright report | ⚠️ Warns |
| 11 | **Content Freshness** | Detect stale metadata, old TODO markers | 📅 | No `// TODO` comments in production locale strings; sitemap `lastmod` dates not > 90 days stale | Stale item list | ⚠️ Warns |
| 12 | **Build Quality Gate** | Final pre-deploy verification bundle | 🚀 | All of #1, #3, #4, #8 must pass; performance smoke must not exceed 3.5 s LCP | Combined gate report | ✅ Blocks deploy |

---

## Recommended Tool Stack

| Tool | Use case |
|---|---|
| ESLint + Prettier | #1 Lint/format |
| Lighthouse CI (`lhci`) | #2 Performance smoke, #6 Font/loading |
| axe-core / Playwright + axe | #3 Accessibility |
| Custom Node script (parse HTML + sitemap) | #4 SEO validation |
| Sharp + Node script | #5 Image audit |
| Node `fs.readdirSync` + HTML parser | #7 Dead code |
| `curl -I` + Node assertion script | #8 Security headers |
| `npm audit --audit-level=high` | #9 Dependency audit |
| Playwright screenshot + pixelmatch | #10 Responsive regression |
| Node grep script | #11 Content freshness |

---

## Current Implementation Status

| Check | Status | Location |
|---|---|---|
| Lint/Format | 🟡 Config added (`.eslintrc.json`) but no pre-commit hook | Root `.eslintrc.json` |
| Performance smoke | 🔴 Not automated | — |
| Accessibility | 🔴 Not automated | — |
| SEO validation | 🔴 Not automated | — |
| Image optimisation | 🔴 Not automated | — |
| Security headers | 🟢 Headers now set in Worker | `src/index.js` |
| Dependency audit | 🟡 Manual (`npm audit`) | — |
| CI workflow | 🟡 Scaffolded (`.github/workflows/quality.yml`) | `.github/workflows/` |

---

## Next Implementation Steps

1. **Immediate:** Wire `npm audit` and ESLint to the GitHub Actions workflow (scaffolded).
2. **Sprint 1:** Add `lhci` to Actions for performance smoke on PRs.
3. **Sprint 1:** Add axe-core script to Actions for accessibility gate on PRs.
4. **Sprint 2:** Add SEO validation script (parse meta + sitemap + JSON-LD).
5. **Sprint 2:** Add image audit script (check WebP coverage + file sizes).
6. **Ongoing:** Schedule weekly runs of checks #7, #10, #11.
