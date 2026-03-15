# Repository UI Compaction Audit

| screen/component | current issue | impact | recommended fix | priority |
| --- | --- | --- | --- | --- |
| `public/index.html` hero, nav, sticky CTA | Hero min-height, nav padding, and large CTA spacing consume too much first-view height on desktop/tablet/mobile. | Fewer room, booking, and trust cues appear above the fold. | Reduce nav and hero height, tighten hero panel/CTA spacing, keep touch-safe targets. | High |
| `public/index.html` room cards, offers, amenities, reviews, contact | Card padding, gaps, and media/body spacing are larger than needed for a booking-oriented landing page. | Users scroll more before comparing rooms and seeing contact/book actions. | Normalize shared card padding/gaps, tighten room and amenity internals, keep copy readable. | High |
| `public/index.html` booking form | Form fields, quick chips, and CTA rows are a little loose and stack early on smaller screens. | Booking intent section takes more height than necessary. | Reduce field spacing, chip height, and CTA gaps while preserving labels and focus states. | High |
| `packages/pms/static/styles.css` shared staff UI tokens | Shared PMS layout uses generous one-off spacing across cards, toolbars, tables, lists, and room boards. | Operational screens surface less room, reservation, payment, and status information per viewport. | Introduce reusable density tokens with comfortable / compact / ultra-compact tiers and default staff screens to compact. | High |
| `packages/pms/templates/front_desk_workspace.html` filters | Toolbar filters wrap into tall rows instead of using tighter auto-fit columns. | Front desk operators scroll before reaching the main arrivals/departures list. | Convert filter bar to responsive grid-style compact layout. | High |
| `packages/pms/templates/housekeeping_board.html` filters + room cards | Filter controls and room board cards are readable but vertically loose. | Fewer rooms are visible on one screen, reducing scan speed during rush periods. | Use shared compact density tokens and compact filter-bar layout; tighten room card spacing. | High |
| `packages/pms/templates/staff_reports.html` report header filters | Range controls occupy too much horizontal/vertical space before headline metrics. | Key management metrics start lower than needed. | Reflow filters into dense responsive grid and reduce metric/table spacing through shared tokens. | Medium |
| `public/admin/styles.css` + `public/admin/app.js` dashboard | Standalone admin app uses large root padding, card padding, table cells, and calendar cells. | Dashboard, reservations, and housekeeping tables show fewer rows per screen. | Add density variables, compact defaults, and cleaner section/table/form grouping. | High |
| `public/admin/app.js` reservation/settings forms | Dense workflows still use generic loose grids and repeated section wrappers. | Form-heavy admin tasks require excess scrolling and hide actions below the fold. | Reuse compact form grid, full-width field spans, and consolidated section heads. | Medium |
| repo-wide documentation | Existing audit docs cover architecture and validation, but not compactness standards. | Future UI work can regress into inconsistent spacing again. | Add a compactness audit, density strategy, and exact change log for follow-up work. | Medium |

## Quick wins

- Tighten shared spacing tokens instead of rewriting layouts.
- Default PMS/admin surfaces to compact density.
- Convert high-use filter toolbars to responsive compact grids.
- Reduce room-card, table-row, and hero-section padding with existing components.

## Structural improvements completed in this pass

- Added reusable density tiers for PMS, static marketing, and standalone admin surfaces.
- Consolidated key high-traffic operational screens around the new compact defaults.
- Normalized shared gaps/padding so future UI work can stay consistent without one-off values.
