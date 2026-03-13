# Google Analytics 4 Setup for Sandbox Hotel

This file documents analytics setup for the `sandbox-hotel-site` brochure repo only.

## Tracking ID

`G-13776473901`

## Website Integration

### Method 1: Direct HTML Integration

Add this to `public/index.html` before the closing `</head>` tag:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-13776473901"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "G-13776473901", {
    page_path: window.location.pathname,
    page_title: document.title,
    anonymize_ip: true
  });
</script>
```

### Method 2: Shared JavaScript Module

```javascript
import { initializeGA4, trackBookReservation, trackSearch } from "@sandbox-hotel/shared/src/analytics.js";

initializeGA4();
trackBookReservation(500, 2, 3);
trackSearch("luxury room");
```

## Brochure Events

- `book_hotel` - brochure conversion intent
- `search` - room search or availability inquiry
- `form_submission` - contact or inquiry submission
- `view_item` - room or service view
- `purchase` - completed booking only if the brochure repo is passed a confirmed outcome from the real booking flow

## Canonical PMS Analytics

Operational PMS analytics belong in the separate `sandbox-pms` repo. Do not add Flask template instrumentation, staff-event tracking, or PMS workflow analytics in `sandbox-hotel-site`.

## Real-Time Monitoring

Use Google Analytics Realtime to validate brochure traffic and conversion events for the public site.

## Privacy Compliance

Current setup includes:
- `anonymize_ip: true`
- GA4 event tracking on the brochure site only

If PMS analytics are needed, implement and document them inside `sandbox-pms` so privacy behavior stays aligned with the real operational system.
