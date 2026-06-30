# Google Ads Measurement Plan

## Scope

This plan covers the public website at `www.sandboxhotel.com` for direct booking inquiries. It does not add Google Ads credentials, conversion IDs, payment details, promo codes, or secrets to the repo.

## Current Implementation

- Tag loading is GTM-first through container `GTM-MPNHZC8S` in `public/index.html`.
- The homepage does not add a standalone `gtag.js` pageview. GA4 pageviews should remain owned by GTM.
- CTA and booking events are emitted as predictable `dataLayer` events from `public/assets/js/analytics.js`.
- Booking lead ingestion stays on `/api/booking-ingest` in `src/index.js`.

## Data Layer Events

| Event | Trigger | Required use |
| --- | --- | --- |
| `page_context` | Page script boot | Page type, language, canonical URL, and attribution context for GTM variables |
| `book_cta_click` | Any `data-analytics="book-now"` CTA | Engagement signal; do not mark as primary conversion |
| `booking_submit_attempt` | Booking form submit, WhatsApp button, email button | Form intent and funnel diagnostics |
| `booking_send_success` | LINE, WhatsApp, or email message handoff succeeds | Primary direct inquiry conversion candidate |
| `contact_call_click` | Telephone links | Secondary conversion or observation |
| `contact_line_click` | LINE links | Secondary conversion or observation unless it is a booking send |
| `contact_whatsapp_click` | WhatsApp button/link | Secondary conversion or observation |
| `contact_email_click` | Mailto links and email send button | Secondary conversion or observation |
| `map_directions_click` | Google Maps links | Location intent; observation only |
| `sticky_cta_click` | Sticky bottom bar clicks | Mobile CTA diagnostics |
| `language_switch` | Language selector | UX diagnostics only |

## Allowed Event Parameters

The analytics layer may send:

- `event_category`
- `event_label`
- `cta_location`
- `send_channel`
- `sticky_action`
- `language`
- `page_path`
- `page_title`
- `canonical_url`
- `room_type`
- `guests`
- `checkin`
- `checkout`
- `link_url`
- `gclid`
- `gbraid`
- `wbraid`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`
- `attribution_captured_at`
- `attribution_landing_page_path`

Do not send guest name, phone, email, notes, message body, payment information, room price, or staff/admin data to GA4 or Google Ads.

## Attribution Capture

The website captures only these URL parameters:

- `gclid`
- `gbraid`
- `wbraid`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

Capture behavior:

- Values are whitelisted, control-character stripped, trimmed, and length-limited.
- Values are stored first-party in `localStorage` key `sbx_attribution` for up to 90 days.
- Attribution is attached to internal booking lead payloads as `attribution`.
- Attribution is available to GTM on `page_context`, CTA events, `booking_submit_attempt`, and `booking_send_success`.
- The root domain redirect from `sandboxhotel.com` to `www.sandboxhotel.com` preserves the full query string.

## Recommended GTM Setup

1. Keep the existing GTM container on the site. Do not add a standalone GA4 pageview snippet in the repo.
2. Add a Conversion Linker tag firing on all pages.
3. Configure the GA4 Configuration tag in GTM to fire pageviews once per page.
4. Create Data Layer Variables for:
   - `event_category`
   - `event_label`
   - `cta_location`
   - `send_channel`
   - `room_type`
   - `guests`
   - `checkin`
   - `checkout`
   - `gclid`
   - `gbraid`
   - `wbraid`
   - all `utm_*` fields
5. Create custom event triggers for the event names in this plan.
6. Create a Google Ads conversion action for direct booking inquiry.
7. Fire the Google Ads conversion tag on `booking_send_success`.
8. Pass no PII into the Google Ads tag. If enhanced conversions for leads are later enabled, configure that inside GTM only after the account owner accepts the required terms and legal/privacy review.

## Conversion Classification

Primary conversion:

- `booking_send_success`

Secondary or observation conversions:

- `contact_call_click`
- `contact_line_click`
- `contact_whatsapp_click`
- `contact_email_click`

Not conversions:

- `book_cta_click`
- `booking_submit_attempt`
- `map_directions_click`
- `sticky_cta_click`
- `language_switch`

## Manual Setup Still Required

- Google Ads account, billing, and conversion action creation.
- GTM tag publishing and preview QA.
- GA4 event registration if GA4 reports need custom dimensions for attribution and CTA location.
- Consent and privacy notice review by the account owner.
- Phone call conversion setup if the hotel wants call reporting beyond click events.

## References

- Google Tag Manager Conversion Linker: https://support.google.com/tagmanager/answer/7549390
- Google Ads enhanced conversions for leads: https://support.google.com/google-ads/answer/11021502
- Google Ads URL options and tracking parameters: https://support.google.com/google-ads/answer/6305348
