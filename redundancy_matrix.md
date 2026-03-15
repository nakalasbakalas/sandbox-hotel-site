# Redundancy Matrix

## Fixed
| Area | Evidence | Action |
| --- | --- | --- |
| Dead Python import | `packages/pms/pms/app.py` imported `sqlalchemy as sa` with no `sa.` usage | Removed |

## Found only
| Area | Evidence | Assessment |
| --- | --- | --- |
| Worker entrypoints | `wrangler.jsonc` points to `src/index.js`; `packages/api/src/index.js` is a separate stub worker | Likely legacy/duplicate surface |
| Shared package | `packages/shared/src/index.js` exports placeholder config while root worker/admin do not import it | Possibly obsolete but unverified |
| Root docs | `README.md` and `README-MONOREPO.md` both describe overlapping package structure and commands | Duplicated documentation with drift risk |
| Tracked `node_modules` | Repository includes committed dependency artifacts and platform-specific binaries | Redundant checked-in build output |

## Deferred
| Area | Reason deferred |
| --- | --- |
| Package/workspace removal | Usage contracts are unclear; cleanup could break expected workflows |
| README consolidation | Low-risk but broader than the targeted fixes completed here |

## Not safe to change automatically
| Area | Reason |
| --- | --- |
| Remove `packages/api` | May still be part of intended monorepo packaging/deployment model |
| Remove `packages/shared` | Could be kept intentionally for future workspace consumers |
| Purge tracked dependencies from history | Requires coordinated repo hygiene change |
