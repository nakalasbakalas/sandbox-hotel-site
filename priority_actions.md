# Priority Actions

## Fixed
- Restore Node build reliability by bypassing the broken tracked Wrangler shim.
- Clean up visible admin UI text encoding defects.
- Repair one broken PostgreSQL setup instruction.
- Remove one proven-dead PMS import.
- Make the PowerShell security test portable to Linux runners with `pwsh`.

## Found only
1. **High:** Define and add the root D1 schema/migration story so `/admin` can bootstrap from a fresh local database.
2. **High:** Plan a Wrangler 4 migration to address deprecation and audit warnings.
3. **Medium:** Decide whether `packages/api` and `packages/shared` are active deliverables or legacy placeholders.
4. **Medium:** Decide whether committed `node_modules` should be removed in a dedicated hygiene PR.
5. **Low:** Consolidate duplicated root documentation.

## Deferred
- All architecture-level cleanup was deferred in favor of low-risk, surgical fixes.

## Not safe to change automatically
- Large dependency upgrades
- Workspace/package removal
- Repository-wide vendor artifact cleanup
- Root database initialization redesign
