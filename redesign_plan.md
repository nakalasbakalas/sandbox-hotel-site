# Sandbox Hotel — Redesign Implementation Plan

## Page Structure

The redesigned homepage follows a deliberate top-to-bottom narrative that moves visitors from awareness → trust → evaluation → conversion.

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Header** | Transparent nav over hero; brand, menu, language switcher, Book Now CTA. Gains solid background on scroll. |
| 2 | **Hero** | Full-bleed image with benefit-led headline, supporting tagline, and dual CTAs (primary: Book Now, secondary: Explore Rooms). |
| 3 | **Trust Strip** | Icon-paired proof points (direct booking, local host, fast confirmation) in a contrasting bar below the hero. |
| 4 | **Why Stay** | 3–4 benefit-led cards replacing the old offers placeholder. Communicates guest value, not feature lists. |
| 5 | **Rooms** | Side-by-side room cards (Twin / Double) with large imagery, benefit copy, and strong rate CTAs. |
| 6 | **Amenities** | Compact icon grid grouped by category (Room, Hotel, Services). Scannable, not text-heavy. |
| 7 | **Gallery** | Editorial layout: featured hero image with supporting thumbnail grid. Lightbox for full-screen viewing. |
| 8 | **Reviews** | Guest testimonials with star ratings and dates. Elevated card treatment for credibility. |
| 9 | **Booking** | Premium conversion block with date picker, room selector, contact method, urgency copy, and date shortcuts. |
| 10 | **FAQ** | Clean accordion ordered by booking relevance. Ends with a contact CTA ("Still have questions?"). |
| 11 | **Location / Footer** | Map embed, transport info, full contact details, social links, and a final booking CTA. |

---

## Component-by-Component Implementation

### 1. Header

**Before:** Sticky opaque nav bar.
**After:** Transparent overlay on hero; `backdrop-filter` blur + solid background triggered via `IntersectionObserver` on scroll.

```
Structure:
┌─────────────────────────────────────────┐
│ Logo       Nav Links       [Lang] [Book]│
└─────────────────────────────────────────┘
```

- Logo left-aligned; nav links centered or right-grouped.
- Language switcher: compact dropdown (TH / EN / 中文).
- "Book Now" CTA: `--accent-primary` filled button, always visible.

### 2. Hero

**Layout:** Full-viewport background image with dark overlay gradient. Content vertically centered.

```
┌─────────────────────────────────────────┐
│                                         │
│        [Headline — Fraunces 700]        │
│        [Tagline — Manrope 400]          │
│   [Book Now]  [Explore Rooms →]         │
│                                         │
└─────────────────────────────────────────┘
```

- Primary CTA: high-contrast filled button.
- Secondary CTA: ghost/outline button or text link.
- Headline: benefit-led ("Your quiet escape in Nakhon Si Thammarat").
- Preloaded hero image; WebP with JPEG fallback.

### 3. Trust Strip

**Layout:** Horizontal bar with 3–4 icon + text pairs on a subtle contrasting background.

```
┌─────────────────────────────────────────┐
│ ✓ Book Direct   ✓ Local Host   ✓ Fast  │
└─────────────────────────────────────────┘
```

- Icons: inline SVG or emoji for zero-dependency rendering.
- Background: `--sand-dark` (light theme) or subtle panel color (dark theme).
- Responsive: wraps to 2×2 grid on mobile.

### 4. Why Stay

**Layout:** 3–4 equal-width cards in a responsive grid.

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│  🏖 Icon  │  │  🌿 Icon  │  │  ☕ Icon  │
│  Title   │  │  Title   │  │  Title   │
│  Benefit │  │  Benefit │  │  Benefit │
└──────────┘  └──────────┘  └──────────┘
```

- Each card: icon, short title, one-sentence benefit.
- No "Coming Soon" — every card delivers real value.
- Grid: `repeat(auto-fit, minmax(260px, 1fr))`.

### 5. Rooms

**Layout:** Two room cards side-by-side on desktop; stacked on mobile.

```
┌────────────────────┐  ┌────────────────────┐
│ [Room Image]       │  │ [Room Image]       │
│ Room Name          │  │ Room Name          │
│ • Benefit 1        │  │ • Benefit 1        │
│ • Benefit 2        │  │ • Benefit 2        │
│ [Get Today's Rate] │  │ [Get Today's Rate] │
└────────────────────┘  └────────────────────┘
```

- Large 16:9 images (not thumbnails).
- Benefit-led bullet points instead of raw feature lists.
- CTA: "Get Today's Rate" — active, confident language.
- Comparison feel via consistent card structure.

### 6. Amenities

**Layout:** Icon grid, 3–4 columns on desktop, 2 columns on mobile.

- Grouped visually: Room amenities → Hotel amenities → Services.
- Each item: icon + short label (no paragraph descriptions).
- Compact density — visitors scan, not read.

### 7. Gallery

**Layout:** Editorial grid with one featured (large) image and smaller supporting thumbnails.

```
┌────────────────┬────────┐
│                │  img2  │
│   Featured     ├────────┤
│   Image        │  img3  │
│                ├────────┤
│                │  img4  │
└────────────────┴────────┘
```

- Lightbox on click (existing implementation preserved).
- Lazy-loaded below the fold.
- Maintains existing image assets.

### 8. Reviews

**Layout:** Horizontal scrollable cards or 2–3 column grid.

- Star rating + guest name + date.
- Elevated card with subtle shadow.
- Optional "View all reviews" link.

### 9. Booking

**Layout:** Centered premium card with form fields and urgency copy.

```
┌─────────────────────────────────────────┐
│     Ready to book your stay?            │
│     Fast direct confirmation.           │
│                                         │
│  [Check-in]  [Check-out]  [Room Type]   │
│  [Tonight] [Tomorrow] [This Weekend]    │
│  [Contact via: LINE / WhatsApp / Email] │
│                                         │
│           [Book Now →]                  │
└─────────────────────────────────────────┘
```

- Date shortcut buttons reduce friction.
- Contact method selector preserves all existing channels.
- Premium card treatment (shadow, generous padding, accent border).

### 10. FAQ

**Layout:** Single-column accordion, max-width constrained for readability.

- Questions ordered by booking relevance (check-in time, cancellation, payment).
- Smooth expand/collapse animation.
- Section ends with: "Still have questions? Chat with us on LINE →"

### 11. Location / Footer

**Layout:** Map + directions block, then full footer.

```
┌─────────────────────────────────────────┐
│  [Map Embed]        Transport Info      │
│                     From Airport: ...   │
│                     From Station: ...   │
├─────────────────────────────────────────┤
│ Logo   Quick Links   Contact   Social   │
│              © 2024 Sandbox Hotel       │
│              [Book Your Stay →]         │
└─────────────────────────────────────────┘
```

- Map: embedded Google Maps iframe (existing).
- Footer: organized columns with final booking CTA.

---

## Design System Adjustments

### Color Tokens

| Token | Light Theme | Dark Theme | Usage |
|-------|------------|------------|-------|
| `--sand` | `#F5F0E8` | — | Page background (light) |
| `--sand-dark` | `#E8E1D5` | — | Alternate section bg, trust strip |
| `--charcoal` | `#2B2823` | `#F5F0E8` | Primary text |
| `--charcoal-light` | `#3F3A34` | `#E8E1D5` | Secondary text |
| `--bronze` | `#A8653F` | `#C4825F` | Primary accent, CTAs, links |
| `--bronze-light` | `#C4825F` | `#D4A866` | Hover states |
| `--gold` | `#C9974A` | `#D4A866` | Secondary accent, highlights |
| `--olive` | `#6B715A` | `#8A9176` | Trust/success signals |
| `--panel-bg` | `#FFFFFF` | `#12161D` | Card backgrounds |
| `--border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` | Subtle borders |

### Typography

| Role | Font | Weight | Size (desktop) | Size (mobile) |
|------|------|--------|----------------|---------------|
| Hero headline | Fraunces | 700 | `clamp(2.5rem, 5vw, 4rem)` | ~2.5rem |
| Section heading | Fraunces | 600 | `clamp(1.75rem, 3vw, 2.5rem)` | ~1.75rem |
| Card title | Manrope | 700 | 1.25rem | 1.125rem |
| Body | Manrope | 400 | 1rem | 0.9375rem |
| Caption / meta | Manrope | 500 | 0.875rem | 0.8125rem |
| CTA button | Manrope | 700 | 1rem | 1rem |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-section` | `clamp(4rem, 8vw, 7rem)` | Between major page sections |
| `--space-block` | `clamp(2rem, 4vw, 3.5rem)` | Between content blocks within a section |
| `--space-card-pad` | `clamp(1.25rem, 2vw, 2rem)` | Card internal padding |
| `--space-grid-gap` | `clamp(1rem, 2vw, 1.5rem)` | Grid/flex gap |
| `--space-inline` | `0.5rem` | Inline element spacing |

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| **Mobile** | < 640px | Single column; stacked cards; hamburger menu; 2×2 trust strip grid. |
| **Tablet** | 640px – 1024px | Two-column room cards; condensed nav; gallery grid adjusts to 2+2. |
| **Desktop** | > 1024px | Full layout; side-by-side rooms; editorial gallery grid; expanded nav. |

### Mobile-Specific Notes
- Header collapses to hamburger menu with slide-out drawer.
- Hero headline scales down via `clamp()`; CTA buttons stack vertically.
- Trust strip wraps to 2×2 grid.
- Room cards stack to single column with full-width images.
- Booking form fields stack vertically; date shortcuts become a scrollable row.
- Sticky bottom bar remains for quick "Book Now" access.
- Touch targets minimum 44×44px per WCAG guidelines.

### Tablet-Specific Notes
- Room cards display side-by-side at reduced image size.
- Gallery featured image shrinks; grid becomes 2×2.
- FAQ accordion uses full width with comfortable padding.
- Footer shifts from 4-column to 2-column layout.
