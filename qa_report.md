# Sandbox Hotel — QA Report

## Layout Checks

All homepage sections verified for correct rendering, content order, and visual hierarchy.

| Section | Status | Notes |
|---------|--------|-------|
| Header | ✅ Pass | Transparent overlay on hero; solid fill on scroll. Logo, nav links, language switcher, and Book Now CTA render correctly. |
| Hero | ✅ Pass | Full-bleed background with overlay gradient. Headline, tagline, and dual CTAs centered and legible. |
| Trust Strip | ✅ Pass | Icon + text pairs display in a horizontal row; contrasting background visible in both themes. |
| Why Stay | ✅ Pass | Benefit cards render in responsive grid. Icons, titles, and descriptions aligned consistently. |
| Rooms | ✅ Pass | Side-by-side cards on desktop with large imagery. CTAs ("Get Today's Rate") prominent and clickable. |
| Amenities | ✅ Pass | Icon grid displays correctly grouped by category. Compact layout scans well. |
| Gallery | ✅ Pass | Editorial grid with featured image + thumbnails. Lightbox opens on click. |
| Reviews | ✅ Pass | Guest cards show star ratings, names, and dates. Elevated card treatment applied. |
| Booking | ✅ Pass | Premium card with form fields, date shortcuts, and contact method selector. All booking channels functional. |
| FAQ | ✅ Pass | Accordion expand/collapse works. Contact CTA rendered at section end. |
| Location / Footer | ✅ Pass | Map embed loads. Transport info, contact details, social links, and final CTA present. |

---

## Responsive Checks

### Desktop (≥ 1024px)
- ✅ Full navigation bar displayed inline.
- ✅ Room cards render side-by-side with comparison feel.
- ✅ Gallery editorial grid (1 large + 3 small) renders correctly.
- ✅ Footer uses multi-column layout.
- ✅ Section spacing follows `--space-section` rhythm.

### Tablet (640px – 1024px)
- ✅ Navigation condenses; hamburger menu activates where expected.
- ✅ Room cards display side-by-side at reduced image size.
- ✅ Gallery grid adjusts to 2×2 layout.
- ✅ Booking form fields remain usable at tablet widths.
- ✅ Footer switches to 2-column layout.

### Phone (< 640px)
- ✅ Hamburger menu with slide-out drawer.
- ✅ Hero headline scales down; CTAs stack vertically.
- ✅ Trust strip wraps to 2×2 grid.
- ✅ Room cards stack to single column with full-width images.
- ✅ Date shortcut buttons scroll horizontally.
- ✅ FAQ accordion full-width with comfortable touch targets.
- ✅ Sticky bottom bar renders correctly and doesn't overlap content.

---

## Accessibility Checks

| Check | Status | Details |
|-------|--------|---------|
| **Heading hierarchy** | ✅ Pass | Single `h1` in hero; sections use `h2`; subsections use `h3`. No skipped levels. |
| **Color contrast** | ✅ Pass | Text on sand/ivory backgrounds meets WCAG AA (≥ 4.5:1 for body, ≥ 3:1 for large text). Dark theme contrast verified. |
| **Focus states** | ✅ Pass | All interactive elements (links, buttons, form fields, accordion triggers) show visible focus rings. |
| **Keyboard navigation** | ✅ Pass | Full page navigable via Tab/Shift+Tab. Accordion items toggle with Enter/Space. Skip-to-content link present. |
| **ARIA attributes** | ✅ Pass | Form fields have associated labels. Accordion uses `aria-expanded`. Menu toggle has `aria-label`. |
| **Image alt text** | ✅ Pass | All meaningful images have descriptive `alt` attributes. Decorative images use `alt=""`. |
| **Touch targets** | ✅ Pass | Interactive elements meet 44×44px minimum on mobile viewports. |
| **Reduced motion** | ✅ Pass | Animations respect `prefers-reduced-motion: reduce` media query. |

---

## Performance Notes

- **No new libraries added** — all improvements achieved with vanilla HTML, CSS, and JavaScript.
- **Existing image optimization preserved** — WebP format with JPEG fallbacks, lazy loading via `loading="lazy"`, hero image preloaded.
- **Font loading unchanged** — Fraunces and Manrope loaded via Google Fonts with `display=swap`.
- **No additional HTTP requests** — trust strip icons use inline SVG or existing emoji; no new icon library introduced.
- **CSS custom properties** — design token changes are variable-level only; no increase in stylesheet complexity.
- **Scroll observer** — lightweight `IntersectionObserver` for header background transition; no scroll-jank risk.

---

## Bugs Fixed

| # | Issue | Resolution |
|---|-------|------------|
| 1 | Offers section displayed "Coming Soon" placeholder with no guest value | Replaced with benefit-led "Why Stay" section containing real content. |
| 2 | Room CTAs used passive "Rates on request" — unclear next step | Changed to active "Get Today's Rate" with direct booking channel link. |
| 3 | Trust strip was plain text with low visibility | Added icons and contrasting background for immediate scan-ability. |
| 4 | FAQ section ended abruptly with no exit path | Added contact CTA ("Still have questions? Chat with us on LINE") at section end. |
| 5 | Footer lacked a final conversion prompt | Added "Book Your Stay" CTA in footer for exit-intent recovery. |
| 6 | Uniform section spacing created visual monotony | Introduced alternating spacing rhythm via `--space-section` and `--space-block` tokens. |
| 7 | Room cards lacked comparison feel on desktop | Implemented consistent side-by-side layout with matching card structures. |
| 8 | Header competed visually with hero image | Changed to transparent-on-load header with scroll-triggered solid background. |
| 9 | Typography scale lacked premium weight contrast | Refined display/body weight pairing for clearer visual hierarchy. |

---

## Remaining Optional Enhancements

These items are not required for launch but would further improve the experience:

| Enhancement | Priority | Effort |
|-------------|----------|--------|
| Add micro-interactions to CTA buttons (subtle hover scale/glow) | Low | Small |
| Implement scroll-triggered fade-in for section content | Low | Small |
| Add guest count / years-in-business stats to trust strip | Medium | Small |
| Create a "Compare Rooms" toggle view for side-by-side spec table | Medium | Medium |
| Add seasonal/promotional banner slot below header | Low | Small |
| Integrate live availability check in booking form | High | Large |
| Add review aggregate schema markup for rich search results | Medium | Small |
| Implement A/B testing for hero headline variants | Low | Medium |
| Add WhatsApp click-to-chat floating button on mobile | Low | Small |
