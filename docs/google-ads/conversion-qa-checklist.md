# Conversion QA Checklist

Run this before enabling spend and after every GTM publish that touches conversion tags.

## Local Code Checks

- `npm run lint`
- `npm run test:worker`
- `npm run build`

## Website Checks

- Visit `https://www.sandboxhotel.com/?gclid=test-gclid&utm_source=google&utm_medium=cpc&utm_campaign=test&utm_term=nakhon-hotel&utm_content=qa`.
- Confirm the page stays on `www.sandboxhotel.com`.
- Visit `https://sandboxhotel.com/?gclid=test-gclid&utm_source=google`.
- Confirm the redirect lands on `https://www.sandboxhotel.com/?gclid=test-gclid&utm_source=google`.
- In DevTools, confirm `localStorage.sbx_attribution` contains only allowed click ID and UTM fields.
- Confirm no guest name, phone, email, notes, or message body appears in `dataLayer` events.

## CTA Data Layer Checks

With GTM Preview or DevTools, click each item and confirm the event name and `cta_location`.

- Header LINE: `contact_line_click`, `header-line`
- Header book CTA: `book_cta_click`, `header-primary`
- Hero availability CTA: `book_cta_click`, `hero-primary`
- Hero phone CTA: `contact_call_click`, `hero-call`
- Room twin CTA: `book_cta_click`, `room-twin-primary`
- Room double CTA: `book_cta_click`, `room-double-primary`
- Booking header call: `contact_call_click`, `booking-header-call`
- Booking support call: `contact_call_click`, `booking-support-call`
- Booking support LINE: `contact_line_click`, `booking-support-line`
- Booking form LINE submit: `booking_submit_attempt`, then `booking_send_success` with `send_channel=line`
- Booking form WhatsApp: `contact_whatsapp_click`, `booking_submit_attempt`, then `booking_send_success` with `send_channel=whatsapp`
- Booking form email: `contact_email_click`, `booking_submit_attempt`, then `booking_send_success` with `send_channel=email`
- Review map: `map_directions_click`, `reviews-map`
- Review availability: `book_cta_click`, `reviews-primary`
- FAQ availability: `book_cta_click`, `faq-help-primary`
- FAQ phone: `contact_call_click`, `faq-help-call`
- Contact primary phone: `contact_call_click`, `contact-primary-call`
- Contact primary email: `contact_email_click`, `contact-primary-email`
- Contact card phone: `contact_call_click`, `contact-card-call`
- Contact card LINE: `contact_line_click`, `contact-card-line`
- Contact card email: `contact_email_click`, `contact-card-email`
- Contact meta phone: `contact_call_click`, `contact-meta-call`
- Contact meta email: `contact_email_click`, `contact-meta-email`
- Location map: `map_directions_click`, `location-map`
- Sticky call: `contact_call_click` and `sticky_cta_click`, `sticky-call`
- Sticky LINE: `contact_line_click` and `sticky_cta_click`, `sticky-line`
- Sticky availability: `book_cta_click` and `sticky_cta_click`, `sticky-primary`

## GTM Checks

- Conversion Linker fires once on all pages.
- GA4 pageview fires once on page load.
- Google Ads conversion tag fires only on `booking_send_success`.
- Google Ads conversion tag receives conversion ID and label from GTM only, not from repo files.
- GA4 event tags do not receive PII fields.
- Trigger filters do not fire conversion tags on `book_cta_click` or `booking_submit_attempt`.

## Google Ads Checks

- Conversion action is marked primary only after QA passes.
- Attribution model and conversion window are reviewed by the account owner.
- Call reporting is configured only if the owner wants call conversions.
- Enhanced conversions are disabled unless the owner completes privacy/legal review and GTM configuration.

## Launch Hold Conditions

Do not enable spend if any of these are true:

- Duplicate pageviews appear in GA4 DebugView.
- `booking_send_success` does not fire for LINE, WhatsApp, and email.
- Any analytics payload includes guest name, phone, email, notes, or message body.
- Root-to-www redirect drops `gclid`, `gbraid`, `wbraid`, or UTM parameters.
- GTM Preview shows a Google Ads conversion firing on non-send CTA clicks.
