# Sandbox Hotel Site — Implementation Checklist

**Last updated:** 2026-03-19  
**Purpose:** Convert the current action plan into a tracked execution checklist with estimates, dependencies, owners, and measurable success criteria.

---

## Status Legend

- `Not started` — no implementation work opened yet
- `In progress` — active engineering work underway
- `Blocked` — external input, credentials, or business decision required
- `Needs decision` — repo or product direction must be confirmed before work starts
- `Done` — merged and verified

---

## Planning Assumptions

- Estimates are in **engineer days** and assume one engineer familiar with the codebase.
- Business confirmation items may require hotel operations or marketing input.
- The production deployment path is the root Worker plus static public site, not the scaffold workspace packages.
- CI quality checks already exist and should be extended rather than replaced.

---

## Phase 1 — Production Hygiene

**Goal:** Remove live placeholders, eliminate documentation ambiguity, and tighten deployment understanding.  
**Target effort:** 1.5 to 2.5 engineer days plus external confirmations.

| ID | Task | Status | Owner | Estimate | Dependencies | Success criteria |
|---|---|---|---|---:|---|---|
| P1-01 | Confirm live Google review count and update TH/EN/ZH homepage strings | Blocked | Ops + Eng | 0.25 | Access to current verified review count | All three locale strings in `public/index.html` use the approved count; the 3 review-count TODO comments are removed |
| P1-02 | Replace the LINE fallback placeholder with the real account ID | Blocked | Ops + Eng | 0.25 | Real LINE Official Account ID | No `YOUR_LINE_ID` placeholder remains in `public/index.html`; fallback link opens the correct LINE target |
| P1-03 | Align root docs with the actual deployment model | Not started | Eng | 0.5 | None | `README.md`, `README-MONOREPO.md`, and `docs/ARCHITECTURE.md` consistently describe Cloudflare Worker + `public/` as the active site deployment path |
| P1-04 | Confirm GitHub branch protection requires the active quality checks | Not started | Eng | 0.25 | GitHub admin access | `quality.yml` checks are required for merge to `main`; protection rules documented in repo docs or PR template |
| P1-05 | Add a short production configuration section for business-owned values | Not started | Eng | 0.5 | Outcome of P1-01 and P1-02 | A short doc section lists which values are business-owned, where they live, and who updates them |

**Phase 1 exit criteria**

- No production placeholder values remain in the homepage source.
- Core docs no longer imply the scaffold packages are the primary deploy target.
- Merge protection reflects the CI checks already defined in the repository.

---

## Phase 2 — Worker Test Coverage

**Goal:** Add confidence around the production Worker before deeper refactors.  
**Target effort:** 4.5 to 6.5 engineer days.

| ID | Task | Status | Owner | Estimate | Dependencies | Success criteria |
|---|---|---|---|---:|---|---|
| P2-01 | Set up a Worker test harness with D1 mocking or test fixtures | Not started | Eng | 1.0 | Package/tool choice for Worker testing | A repeatable test command exists locally and in CI for `src/index.js` |
| P2-02 | Add auth and session tests | Not started | Eng | 1.0 | P2-01 | Tests cover bootstrap status, login, logout, unauthorized access, and session cookie behavior |
| P2-03 | Add CORS and security header tests | Not started | Eng | 0.75 | P2-01 | Tests assert allowed origins, OPTIONS handling, and response headers on API and static asset paths |
| P2-04 | Add booking lead and reservation flow tests | Not started | Eng | 1.5 | P2-01 | Tests cover booking ingest, reservation creation, reservation action handling, and validation failures |
| P2-05 | Add housekeeping, settings, and reporting smoke tests | Not started | Eng | 1.0 | P2-01 | Tests cover representative role-gated endpoints and expected response shape |
| P2-06 | Add the test command to CI and make failures block merges | Not started | Eng | 0.5 | P2-01 to P2-05 | CI runs Worker tests on PRs and fails on regression |
| P2-07 | Document local test workflow for future contributors | Not started | Eng | 0.25 | P2-06 | Repo docs explain how to run the Worker tests and what fixtures are required |

**Phase 2 exit criteria**

- The production Worker has automated tests for authentication, core booking flows, and role-gated operational endpoints.
- Tests run in CI and gate merges.
- Engineers can make changes to `src/index.js` without relying only on manual verification.

---

## Phase 3 — D1 Schema and Operational Safety

**Goal:** Put the production data model under source control and reduce environment ambiguity.  
**Target effort:** 2.0 to 4.0 engineer days plus access to the live database.

| ID | Task | Status | Owner | Estimate | Dependencies | Success criteria |
|---|---|---|---|---:|---|---|
| P3-01 | Export the authoritative live D1 schema | Blocked | Eng | 0.5 | Cloudflare access and live DB access | A current schema export exists and matches production tables used by the Worker |
| P3-02 | Create the `migrations/` directory and commit the baseline schema | Blocked | Eng | 0.5 | P3-01 | `wrangler.jsonc` now points to a real version-controlled migrations path |
| P3-03 | Document the D1 migration workflow | Not started | Eng | 0.5 | P3-02 | Docs explain how to create, apply, and review schema changes safely |
| P3-04 | Add a lightweight schema verification step to CI or local validation | Not started | Eng | 1.0 | P3-02 | A script or test verifies required tables and key columns expected by the Worker |
| P3-05 | Document environment ownership for Cloudflare secrets and data stores | Not started | Eng | 0.5 | None | Docs clearly separate D1, Worker secrets, and the independent Flask PMS environment |

**Phase 3 exit criteria**

- The D1 schema is version-controlled.
- Engineers have a documented process for schema evolution.
- Production data assumptions are verifiable instead of implicit.

---

## Phase 4 — Frontend Maintainability

**Goal:** Reduce the risk and cost of changing the homepage and site metadata.  
**Target effort:** 6.0 to 9.0 engineer days.

| ID | Task | Status | Owner | Estimate | Dependencies | Success criteria |
|---|---|---|---|---:|---|---|
| P4-01 | Extract inline CSS from `public/index.html` into a versioned stylesheet | Not started | Eng | 2.5 | Phase 2 recommended before major refactor | Homepage layout and theme behavior remain unchanged; CSS is externalized and cacheable |
| P4-02 | Extract inline JS from `public/index.html` into versioned script files | Not started | Eng | 2.0 | P4-01 preferred | Booking interactions, theme switching, analytics hooks, and sticky controls still work after extraction |
| P4-03 | Move homepage i18n strings into a dedicated structure | Not started | Eng | 1.5 | P4-02 preferred | Locale content is no longer embedded in one large inline block; translations remain complete for TH, EN, and ZH |
| P4-04 | Extend SEO validation beyond the homepage | Not started | Eng | 1.0 | Existing `quality.yml` workflow | CI checks representative landing pages for title, description, canonical, hreflang, and JSON-LD basics |
| P4-05 | Add a content freshness check for production TODOs and stale business placeholders | Not started | Eng | 0.75 | Existing CI workflow | CI flags production TODO markers or placeholder values before merge |
| P4-06 | Verify homepage and landing pages after extraction using a manual regression pass | Not started | Eng | 0.5 | P4-01 to P4-05 | Desktop and mobile smoke pass completed with no broken navigation, forms, locale switching, or metadata regressions |

**Phase 4 exit criteria**

- The homepage is no longer a single monolithic source file for CSS, JS, and content.
- Core SEO and content regressions are checked automatically.
- Routine content or UI changes can be made with lower risk.

---

## Phase 5 — Repository Shape Cleanup

**Goal:** Make the repo structure reflect the actual product architecture.  
**Target effort:** 1.5 to 3.0 engineer days.

| ID | Task | Status | Owner | Estimate | Dependencies | Success criteria |
|---|---|---|---|---:|---|---|
| P5-01 | Decide whether scaffold packages are future intent or dead weight | Needs decision | Eng + Owner | 0.25 | Product direction | Clear decision recorded for `packages/web`, `packages/api`, and `packages/shared` |
| P5-02 | If unused, remove stale workspace entries and package references | Needs decision | Eng | 0.75 | P5-01 | Root `package.json` and docs no longer advertise unused workspaces |
| P5-03 | If retained, document their non-production status clearly | Needs decision | Eng | 0.5 | P5-01 | Docs explain why the packages remain and how they relate to the root deployment |
| P5-04 | Simplify onboarding documentation around the actual site path | Not started | Eng | 0.5 | P5-01 to P5-03 | A new contributor can identify the live site entrypoints without ambiguity |
| P5-05 | Review scripts and root commands for consistency with the chosen repo shape | Not started | Eng | 0.5 | P5-01 to P5-03 | Root scripts and docs match the chosen repository structure |

**Phase 5 exit criteria**

- Repo structure and docs tell the same story.
- New contributors are not misled by outdated workspace scaffolding.

---

## Deferred Enhancements

These are worthwhile, but they should follow the stability and maintainability work above.

| ID | Task | Status | Owner | Estimate | Dependency | Success criteria |
|---|---|---|---|---:|---|---|
| D-01 | Refactor the hero from CSS background image to semantic `<img fetchpriority="high">` | Deferred | Eng | 1.5 to 2.5 | Phase 4 recommended | LCP path is more reliable across browsers; hero visuals remain unchanged |
| D-02 | Add a pre-commit hook for linting | Deferred | Eng | 0.5 | Phase 2 preferred | Lint failures are caught before push as well as in CI |
| D-03 | Add maskable PWA icon assets and manifest entry | Deferred | Design + Eng | 0.5 to 1.0 | New icon asset | `site.webmanifest` includes a valid maskable icon variant |
| D-04 | Add responsive visual regression testing | Deferred | Eng | 1.5 to 2.0 | Phase 4 recommended | Key layouts are checked at mobile, tablet, and desktop widths in automation |

---

## Suggested Sprint Order

### Sprint 1

- P1-01 review count confirmation and update
- P1-02 LINE ID replacement
- P1-03 docs alignment
- P2-01 test harness setup
- P2-02 auth and session tests

### Sprint 2

- P2-03 CORS and security header tests
- P2-04 booking and reservation tests
- P2-06 CI test integration
- P3-01 authoritative D1 export
- P3-02 baseline migrations commit

### Sprint 3

- P3-03 migration workflow docs
- P3-04 schema verification
- P4-01 CSS extraction
- P4-04 expanded SEO validation

### Sprint 4

- P4-02 JS extraction
- P4-03 i18n extraction
- P4-05 content freshness checks
- P4-06 regression pass
- P5-01 repository shape decision

---

## Overall Success Metrics

- No unresolved business placeholders remain in production-facing source.
- Worker behavior is covered by automated tests and enforced in CI.
- D1 schema changes are version-controlled and documented.
- The homepage is materially easier to modify without touching one monolithic file.
- Repo structure and onboarding docs accurately reflect how the site is deployed and maintained.
