# Fix Log

## Fixed
1. **Resolved workspace build failure**
   - Files: `packages/web/package.json`, `packages/api/package.json`
   - Change: replaced direct `wrangler` script calls with `node ../../node_modules/wrangler/bin/wrangler.js ...`
   - Result: root build and API build now run successfully in this environment.

2. **Normalized admin UI separators and mojibake text**
   - File: `public/admin/app.js`
   - Change: replaced broken glyphs with `&middot;`, `&rarr;`, and `&times;`
   - Result: room labels, stay ranges, balances, and quantity displays render cleanly.

3. **Fixed PostgreSQL setup documentation typo**
   - File: `packages/pms/DATABASE-SETUP.md`
   - Change: corrected `ALTER ROLE sandbox SET timezone TO 'UTC';`

4. **Removed dead PMS import**
   - File: `packages/pms/pms/app.py`
   - Change: removed unused `sqlalchemy as sa`

5. **Made PowerShell backup/restore test portable**
   - File: `packages/pms/tests/test_phase13_security_hardening.py`
   - Change: detect `powershell` or `pwsh`; skip only if neither exists
   - Result: full PMS pytest suite passes in this Linux environment.

## Found only
- Local `/admin` still returns `500` against an uninitialized local D1 database because the schema is absent.
- Wrangler 3 emits deprecation warnings and local runtime compatibility warnings.

## Deferred
- Major Wrangler 4 migration
- Root D1 schema/migrations design
- Repo-wide documentation consolidation

## Not safe to change automatically
- Removing tracked `node_modules`
- Deleting potentially legacy workspaces/packages without ownership confirmation
