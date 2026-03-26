# PHASE_2_ARCHITECTURE_REPORT

## Before structure

```
public/assets/css/
├── design-tokens.css
└── home.css

public/assets/js/
├── analytics.js
└── home.js
```

## After structure

```
public/assets/css/
├── design-tokens.css
├── home.css
└── components/
    └── booking-form.css

public/assets/js/
├── analytics.js
├── home.js
└── components/
    ├── device-detect.js
    ├── gallery-carousel.js
    └── header-scroll.js
```

## Bloated files addressed

- `public/assets/css/home.css` no longer carries the booking form block and quick-date styles; those are isolated in `public/assets/css/components/booking-form.css`.
- `public/assets/js/home.js` no longer mixes device profiling, gallery carousel behavior, and header scroll state with i18n and booking logic. Those isolated concerns now live in `public/assets/js/components/`.

## Dead code removed

- Removed the duplicated inline implementations of device detection, gallery carousel bootstrapping, and header scroll handling from `public/assets/js/home.js` after moving them into dedicated component files.
- Removed the booking-form style block from `public/assets/css/home.css` after moving it into a dedicated component stylesheet.

## Risks avoided

- Preserved `public/index.html` content hierarchy, booking markup, metadata, schema, and multilingual hooks.
- Kept `public/assets/js/home.js` as the core i18n and booking runtime so existing locale-key coverage remains intact.
- Loaded component scripts with `defer` before `home.js` so boot order remains deterministic without introducing module tooling or framework changes.
- Kept CSS selectors unchanged, only relocating them to a dedicated stylesheet to minimize visual regression risk.

## Exact files moved, split, removed, or normalized

### Split / added
- `public/assets/css/components/booking-form.css` (new; extracted from `public/assets/css/home.css`)
- `public/assets/js/components/device-detect.js` (new; extracted from `public/assets/js/home.js`)
- `public/assets/js/components/gallery-carousel.js` (new; extracted from `public/assets/js/home.js`)
- `public/assets/js/components/header-scroll.js` (new; extracted from `public/assets/js/home.js`)

### Updated
- `public/assets/css/home.css`
- `public/assets/js/home.js`
- `public/index.html`
- `src/index.test.js`

### Removed
- No standalone files removed in this phase.

## Follow-up recommendations

1. Extract the booking/translation configuration payload from `public/assets/js/home.js` only when the i18n test harness is ready to read locale data from multiple sources explicitly.
2. Introduce section-level CSS layers for gallery/reviews/location only after visual regression tooling is in place.
3. Repair the repo lint command by adding the missing ESLint dependency or updating `package.json` so linting becomes a reliable regression gate again.
4. Normalize legacy image paths under `public/images/` vs `public/assets/images/` in a dedicated asset pass once caching/versioning rules are planned.
