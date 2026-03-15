# UI Density Strategy

## Spacing scale

- **comfortable**: premium marketing default for desktop surfaces.
- **compact**: default for PMS/admin operational screens and non-desktop public layouts.
- **ultra-compact**: reserved token set for future dense operational tables/boards that need even more compression.

### Shared rules introduced

- Reduce large section gaps before changing structure.
- Prefer shared spacing tokens over page-specific magic numbers.
- Keep interactive controls at or near 40px+ height on touch layouts.

## Typography adjustments

- Public hero heading range reduced slightly so supporting copy and CTAs appear sooner.
- Supporting public copy blocks (`head`, `heroSub`, reviews, offer copy) use slightly tighter spacing and line-height.
- PMS/admin headings keep hierarchy, but supporting labels, badges, and table headers are slightly tighter for better scanability.

## Card, table, form, and button density rules

### Public marketing surfaces

- Smaller nav and hero chrome.
- Shared section/card padding reduced via `--surfacePad` and `--surfacePadSm`.
- Room, offer, amenity, review, FAQ, and contact cards use tighter internal spacing.
- Booking form fields and quick chips are denser without reducing clarity or focus visibility.

### PMS operational surfaces

- `body[data-density]` now controls shell padding, card padding, grid gaps, toolbar gaps, field spacing, table row height, status pill padding, list spacing, and room-board density.
- PMS defaults to `compact`.
- Filter-heavy screens reuse `.filter-bar` to keep controls in multi-column layouts instead of long wrapped stacks.

### Standalone admin app

- `body[data-density]` drives root padding, card padding, field spacing, table rows, and calendar cell height.
- Compact section heads, table action groups, and form spans make reservations/settings easier to operate on one screen.

## Responsive density behavior

- **Desktop public site:** stays comfortable, but hero/nav/card heights are materially reduced.
- **Tablet/public compact:** automatically switches to compact density, reducing wasted white space before stacked sections.
- **Phone/public compact:** keeps tap-safe controls while reducing hero, sticky CTA, room card, and booking panel height.
- **PMS/admin:** compact by default; grids still collapse at existing breakpoints, but with less excessive vertical padding.

## Safety / accessibility guardrails

- No labels or focus states removed.
- Buttons remain finger-friendly.
- No critical text is hidden or truncated as part of compaction.
- Existing routing, forms, analytics hooks, and business logic remain unchanged.
