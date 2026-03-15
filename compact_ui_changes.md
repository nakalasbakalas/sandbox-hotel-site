# Compact UI Changes

## Files changed

- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/index.html`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/admin/index.html`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/admin/styles.css`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/public/admin/app.js`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/packages/pms/static/styles.css`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/packages/pms/templates/base.html`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/packages/pms/templates/front_desk_workspace.html`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/packages/pms/templates/housekeeping_board.html`
- `/home/runner/work/sandbox-hotel-site/sandbox-hotel-site/packages/pms/templates/staff_reports.html`

## Exact improvements made

### Public site

- Added reusable density tiers on the root HTML element.
- Reduced hero, nav, CTA, room-card, amenity, review, booking-form, and contact spacing.
- Tightened mobile hero/sticky CTA sizing so more booking context appears above the fold.
- Normalized repeated card padding and grid gaps through shared variables.

### PMS

- Added a shared density token system with `comfortable`, `compact`, and `ultra-compact` tiers.
- Defaulted PMS pages to compact density through the base template.
- Tightened shell padding, card padding, tables, lists, forms, room boards, reports, and status chips.
- Converted front desk, housekeeping, and reports filter forms to responsive compact filter bars so the main operational content starts sooner.

### Standalone admin app

- Defaulted the app to compact density.
- Rebuilt the small admin stylesheet around reusable density variables.
- Tightened root padding, cards, tables, calendar cells, and forms.
- Added clearer compact section heads and denser reservation/settings form spans without changing event wiring.

## Why these changes improve one-screen usability

- Less vertical waste means more rooms, reservations, payments, and actions fit into the first viewport.
- Denser filter/toolbars reduce the scroll cost before operators reach lists and boards.
- Shared density tokens make future compaction changes safer and more consistent than editing one-off spacing values.
- Public booking flows remain premium, but key CTAs and room information now surface earlier on desktop and mobile.
