# Source Content Map — Sandbox Hotel Website

**Purpose**: Complete inventory of all translatable strings across the website, organized by functional area.

**Date**: 2026-03-18
**Languages**: Thai (th), English (en), Simplified Chinese (zh-CN)
**Implementation**: Inline i18n object in `public/index.html`

---

## 1. HEADER / NAVIGATION

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `brand_location` | Site subtitle | "Nakhon Si Thammarat, Thailand" | Place name |
| `nav_support` | Trust badge | "Best Rate Direct" | Short CTA phrase |
| `nav_line_cta` | LINE button | "LINE" | App name |
| `nav_book` | Primary CTA | "Book Now" | Main conversion button |
| `nav_rooms` | Nav link | "Rooms" | Section anchor |
| `nav_offers` | Nav link | "Offers" | Section anchor |
| `nav_amenities` | Nav link | "Amenities" | Section anchor |
| `nav_gallery` | Nav link | "Gallery" | Section anchor |
| `nav_reviews` | Nav link | "Reviews" | Section anchor |
| `nav_faq` | Nav link | "FAQ" | Section anchor |
| `nav_location` | Nav link | "Location" | Section anchor |

---

## 2. HERO SECTION

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `hero_kicker` | HTML headline preface | Complex HTML with kw classes | Supports markup |
| `hero_kicker_short` | Simple headline preface | "Sandbox Hotel • Direct Booking" | Fallback |
| `hero_title` | Main H1 headline | "Your quiet retreat<br>in Nakhon Si Thammarat" | Supports `<br>` |
| `hero_sub` | Hero subheading (long) | Complex HTML with list | Supports markup |
| `hero_sub_short` | Hero subheading (short) | "Spacious rooms, fast direct booking..." | Clean text |
| `hero_fine` | Check-in details | Complex HTML with `<b>` | Supports markup |
| `cta_request` | Primary CTA | "Check Availability" | Core conversion |
| `cta_call_line` | Secondary CTA | "Call or LINE" | Alternative action |
| `cta_call_number` | Call button with number | "Call: 088-578-3478" | Includes number |
| `cta_email` | Email link label | "Email" | Simple label |
| `cta_open_map` | Map link label | "Open Map" | Simple action |
| `hero_view_rooms` | Link with arrow | "Explore Rooms →" | Includes arrow |
| `hero_review_count` | Review count text | "· 120 reviews on Google" | Dynamic count |
| `hero_best_rate` | Guarantee message | "Best Rate Guaranteed — book direct & save" | Trust builder |

---

## 3. TRUST BAR

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `trust_direct` | Trust badge | "Direct Booking" | Short phrase |
| `trust_quiet` | Trust badge | "Quiet Rooms" | Short phrase |
| `trust_wifi` | Trust badge | "Free Wi‑Fi" | Short phrase |
| `trust_parking` | Trust badge | "Parking" | One word |
| `trust_support` | Trust badge | "Call / LINE Support" | Short phrase |

---

## 4. ROOMS SECTION

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `rooms_title` | Section H2 | "Rooms" | One word |
| `rooms_sub` | Section intro | HTML with markup | Supports markup |
| `rooms_btn` | Section CTA | "Check Availability" | Reused key |
| `rooms_fine` | Pricing disclaimer | "Rates can change by date..." | Long explanation |
| `price_from` | Price prefix | "From" | One word |
| `price_ask` | Price alternative | "Ask" | One word |
| `price_today` | Rate qualifier | "today's rate" | Short phrase |
| `price_rates_on_request` | CTA link | "Get today's exact rate →" | With arrow |
| `btn_call` | Generic call button | "Call" | One word |
| `btn_see_photos` | Photo link | "See photos" | Short action |

### Room: Standard Twin

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `room_standard_twin_title` | Room name | "Standard Twin" | Product name |
| `room_standard_twin_btn` | Book button | "Book Twin Room" | Action + name |
| `room_standard_twin_meta` | HTML badge line | HTML with markup | Supports markup |
| `room_twin_best_for` | Use case | "**Best for:** Solo guests..." | With bold |
| `tag_2_twin_beds` | Room tag | "2 Twin Beds" | Spec |
| `tag_28_32_m` | Size tag | "28–32 m²" | Spec |
| `tag_guests_1_2` | Capacity tag | "Guests 1–2" | Spec |
| `bullet_desk` | Feature bullet | "Work desk + chair" | Short feature |
| `bullet_quiet_side` | Feature bullet | "Quiet-side allocation (on request)" | Longer |
| `bullet_ac_hot_shower` | Feature bullet | "AC + hot shower" | Short feature |
| `bullet_large_room` | Feature bullet | "Large room layout" | Alternative |

### Room: Standard Double

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `room_standard_double_title` | Room name | "Standard Double" | Product name |
| `room_standard_double_btn` | Book button | "Book Double Room" | Action + name |
| `room_standard_double_meta` | HTML badge line | HTML with markup | Supports markup |
| `room_double_best_for` | Use case | "**Best for:** Couples..." | With bold |
| `tag_1_double_bed` | Room tag | "1 Double Bed" | Spec |
| `bullet_comfort_double_bed` | Feature bullet | "Comfortable double bed" | Feature |
| `bullet_great_for_couples` | Feature bullet | "Great for couples or solo travelers" | Use case |
| `bullet_fast_wifi` | Feature bullet | "Fast Wi-Fi" | Short feature |

### Room Options (select dropdown)

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `opt_standard_twin` | Option label | "Standard Twin" | Clean label |
| `opt_standard_double` | Option label | "Standard Double" | Clean label |

---

## 5. OFFERS / WHY STAY

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `offers_title` | Section H2 | "Why Stay at Sandbox Hotel" | Question form |
| `offers_sub` | Section intro | "Everything you need..." | Benefit statement |
| `offers_btn` | Section CTA | "Check Availability" | Reused |
| `offer1_title` | Feature headline | "Fast Direct Booking" | Benefit |
| `offer1_desc` | Feature description | "Message your dates..." | Explanation |
| `offer2_title` | Feature headline | "Spacious Comfortable Rooms" | Benefit |
| `offer2_desc` | Feature description | "28–32 m² rooms with..." | Details |
| `offer3_title` | Feature headline | "Quiet Practical Stay" | Benefit |
| `offer3_desc` | Feature description | "Quiet-side rooms on request..." | Details |
| `offer4_title` | Feature headline | "Flexible Short & Long Stay" | Benefit |
| `offer4_desc` | Feature description | "From one night to extended..." | Details |
| `offer5_title` | Feature headline | "Friendly Service" | Benefit |
| `offer5_desc` | Feature description | "Local staff available..." | Details |
| `offer6_title` | Feature headline | "Flexible Stays" | Benefit |
| `offer6_desc` | Feature description | "From one night to extended..." | Details |

### Alternative "Why Choose" section

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `why_title` | Section H2 | "Why guests choose Sandbox" | Alternative |
| `why_sub` | Section intro | "Simple, reliable..." | Short |
| `why_1_t` | Feature title | "Large rooms" | Short |
| `why_1_d` | Feature desc | "Comfortable space..." | Short |
| `why_2_t` | Feature title | "Fast confirmation" | Short |
| `why_2_d` | Feature desc | "Call or message..." | Short |
| `why_3_t` | Feature title | "Essentials covered" | Short |
| `why_3_d` | Feature desc | "Wi‑Fi, AC, parking..." | Short |

---

## 6. AMENITIES SECTION

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `amen_title` | Section H2 | "Guest Amenities" | Section header |
| `amen_sub` | Section intro | "Essentials designed..." | Intro text |
| `amen_wifi_title` | Amenity name | "Wi‑Fi" | Product |
| `amen_wifi_desc` | Amenity detail | "Fast, reliable internet..." | Description |
| `amen_parking_title` | Amenity name | "Parking" | Product |
| `amen_parking_desc` | Amenity detail | "Limited on-site guest..." | Description |
| `amen_ac_title` | Amenity name | "Air Conditioning" | Product |
| `amen_ac_desc` | Amenity detail | "Comfortable climate control..." | Description |
| `amen_laundry_title` | Amenity name | "Laundry Service" | Product |
| `amen_laundry_desc` | Amenity detail | "Laundry support available..." | Description |
| `amen_coffee_title` | Amenity name | "Coffee & Snack Bar" | Product |
| `amen_coffee_desc` | Amenity detail | "Light refreshments available..." | Description |
| `amen_service_title` | Amenity name | "Guest Support" | Product |
| `amen_service_desc` | Amenity detail | "Friendly staff available..." | Description |

---

## 7. BOOKING FORM

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `book_title` | Section H2 | "Reserve Your Stay" | Action headline |
| `book_sub` | Section intro | HTML with markup | Supports markup |
| `book_callnow` | Button | "Call Now" | Alternative CTA |
| `lbl_checkin` | Form label | "Check-in" | Field label |
| `lbl_checkout` | Form label | "Check-out" | Field label |
| `lbl_guests` | Form label | "Guests" | Field label |
| `lbl_room` | Form label | "Room" | Field label |
| `lbl_name` | Form label | "Name" | Field label |
| `lbl_contact` | Form label | "Contact (phone / email)" | Field label |
| `lbl_notes` | Form label | "Notes" | Field label |
| `ph_name` | Placeholder | "Your name" | Input hint |
| `ph_contact` | Placeholder | "+66 … or email" | Input hint |
| `ph_notes` | Placeholder | "Arrival time, special requests..." | Input hint |
| `btn_send_line` | Submit button | "Book via LINE" | Channel + action |
| `btn_send_wa` | Submit button | "Book via WhatsApp" | Channel + action |
| `btn_send_email` | Submit button | "Book via Email" | Channel + action |
| `form_hint` | Help text | "We'll reply with availability..." | Expectation |
| `quick_label` | Quick dates label | "Quick dates" | UI label |
| `quick_tonight` | Quick button | "Tonight" | Date preset |
| `quick_tomorrow` | Quick button | "Tomorrow" | Date preset |
| `quick_weekend` | Quick button | "Weekend" | Date preset |
| `quick_7n` | Quick button | "7 nights" | Date preset |
| `quick_clear` | Quick button | "Clear" | Action |
| `stay_summary_placeholder` | Empty state | "Select dates to see a summary." | Instruction |
| `stay_nights` | Unit label | "nights" | Lowercase plural |
| `stay_guests` | Unit label | "guests" | Lowercase plural |
| `stay_room` | Label | "Room" | Singular |
| `best_rate_note` | Inline message | "Direct booking = fastest..." | Trust message |
| `book_tip` | Tip message | "Tip: Add your estimated..." | Help text |
| `book_guarantee` | Trust message | "Best Rate Guaranteed..." | Guarantee |
| `book_checkin_info` | Info text | "**Check-in:** From 14:00..." | With markup |
| `book_id_note` | Info text | "**ID required:**..." | With markup |

---

## 8. GALLERY

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `gallery_title` | Section H2 | "Gallery" | Section name |
| `gallery_sub` | Section intro | "Swipe through photos..." | Instruction |
| `gal_exterior_title` | Photo caption title | "Hotel Exterior" | Caption |
| `gal_exterior_desc` | Photo caption text | "A clear look at the property..." | Description |
| `gal_entrance_title` | Photo caption title | "Entrance & Arrival" | Caption |
| `gal_entrance_desc` | Photo caption text | "Convenient access..." | Description |
| `gal_std_double_title` | Photo caption title | "Standard Double Room" | Caption |
| `gal_std_double_desc` | Photo caption text | "Comfortable double bed..." | Description |
| `gal_std_twin_title` | Photo caption title | "Standard Twin Room" | Caption |
| `gal_std_twin_desc` | Photo caption text | "Two single beds..." | Description |
| `gal_bathroom_desc` | Photo caption text | "Hot shower and fresh essentials." | Description |
| `gal_swipe_hint` | Instruction | "Swipe for more photos..." | Help text |
| `svg_lobby_and_reception` | Icon label | "Lobby & Reception" | Feature label |
| `svg_clean_bathrooms` | Icon label | "Clean Bathrooms" | Feature label |

---

## 9. REVIEWS

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `reviews_title` | Section H2 | "Guest Reviews" | Section name |
| `reviews_sub` | Section intro | "Check location and the latest..." | Instruction |
| `btn_view_maps` | CTA button | "View on Google Maps" | External link |
| `btn_view_facebook` | CTA button | "Facebook" | External link |
| `review1_title` | Review source | HTML with stars | Supports markup |
| `review1_text` | Review quote | "Fast check-in, stable Wi-Fi..." | Quote |
| `review2_title` | Review source | HTML with stars | Supports markup |
| `review2_text` | Review quote | "Clean and comfortable..." | Quote |
| `review3_title` | Review source | HTML with stars | Supports markup |
| `review3_text` | Review quote | "Spacious room and helpful..." | Quote |
| `review4_title` | Review source | HTML with stars | Supports markup |
| `review4_text` | Review quote | "Quiet, comfortable..." | Quote |
| `review5_title` | Review source | HTML with stars | Supports markup |
| `review5_text` | Review quote | "Big room, clean..." | Quote |

---

## 10. FAQ

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `faq_title` | Section H2 | "FAQ" | Acronym |
| `faq_sub` | Section intro | "Common questions before booking." | Short intro |
| `faq_btn` | CTA | "Send Request" | Action |
| `faq_show_more` | Expand button | "Show more questions" | Action |
| `faq_cta_text` | Footer text | "Still have questions?..." | Invitation |
| `faq_q1` | Question | "How do I book the fastest?" | User question |
| `faq_a1` | Answer | "Call or message us..." | Answer text |
| `faq_q2` | Question | "What time is check-in..." | User question |
| `faq_a2` | Answer | "Check-in from 14:00..." | Answer text |
| `faq_q3` | Question | "What do I need at check-in?" | User question |
| `faq_a3` | Answer | "A government-issued ID..." | Answer text |
| `faq_q4` | Question | "Can rates change by date?" | User question |
| `faq_a4` | Answer | "Yes. Rates vary by date..." | Answer text |
| `faq_q5` | Question | "Do you have parking?" | User question |
| `faq_a5` | Answer | "Yes, guest parking is..." | Answer text |
| `faq_q6` | Question | "Is the hotel suitable..." | User question |
| `faq_a6` | Answer | "We aim for quiet rooms..." | Answer text |
| `faq_q7` | Question | "Is smoking allowed?" | User question |
| `faq_a7` | Answer | "For guest comfort..." | Answer text |
| `faq_q8` | Question | "What is the cancellation policy?" | User question |
| `faq_a8` | Answer | "Cancellation rules can vary..." | Answer text |
| `faq_q9` | Question | "Where is Sandbox Hotel located..." | User question |
| `faq_a9` | Answer | "Sandbox Hotel is located at..." | Long answer |
| `faq_q10` | Question | "What attractions are near..." | User question |
| `faq_a10` | Answer | "Sandbox Hotel is close to..." | Long answer |
| `faq_q11` | Question | "Is Sandbox Hotel a good base..." | User question |
| `faq_a11` | Answer | "Yes. Nakhon Si Thammarat is..." | Long answer |

---

## 11. DESTINATION SECTION (About Nakhon Si Thammarat)

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `dest_title` | Section H2 | "About Nakhon Si Thammarat" | OR "Staying in Nakhon..." |
| `dest_sub` | Section intro | "Southern Thailand's historic..." | Description |
| `dest_where_title` | Sub-section H3 | "Where is Nakhon Si Thammarat?" | OR "Where We Are" |
| `dest_where_body` | Body text | Long paragraph | Geographic info |
| `dest_where_body_short` | Body text (short) | Short paragraph | Alternative |
| `dest_why_title` | Sub-section H3 | "Why Visit Nakhon Si Thammarat?" | OR "Why Visit" |
| `dest_why_body` | Body text | Long paragraph | Pitch |
| `dest_why_body_short` | Body text (short) | Short paragraph | Alternative |
| `dest_attractions_title` | Sub-section H3 | "Key Attractions..." | OR "Nearby Attractions" |
| `dest_howtoget_title` | Sub-section H3 | "How to Get to..." | OR "Getting Here" |
| `dest_howtoget_note` | Additional note | "Sandbox Hotel is a short drive..." | Help text |
| `dest_region_title` | Sub-section H3 | "Nakhon Si Thammarat in..." | Optional |
| `dest_region_body` | Body text | Long paragraph | Regional context |
| `dest_cta_text` | Footer text | "Planning a trip to..." | OR "Learn more..." |
| `dest_link_city` | Link label | "Hotels in Nakhon Si Thammarat →" | Internal link |
| `dest_link_south` | Link label | "Hotels in Southern Thailand →" | Internal link |

---

## 12. LOCATION & CONTACT

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `loc_title` | Section H2 | "Location & Contact" | Section name |
| `loc_sub` | Section intro | "Choose the fastest contact..." | Instruction |
| `loc_address` | Label | "Address:" | Field label |
| `loc_plus` | Label | "Plus Code:" | Field label |
| `loc_notes` | Note text | "Notes: Policies may vary..." | Disclaimer |

---

## 13. FOOTER

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `back_to_top` | Link label | "Back to top" | Navigation |
| `footer_lang` | Label | "Language:" | Selector label |

---

## 14. STICKY BAR

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `sticky_title` | Bold text | "Ready to book?" | Question |
| `sticky_sub` | Support text | "Tap a button — fastest..." | Instruction |

---

## 15. MESSAGE TEMPLATES (for LINE/WhatsApp)

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `msg_title` | Message subject | "Booking request – Sandbox Hotel" | Email/message header |
| `msg_checkin` | Field label | "Check-in" | Structured message |
| `msg_checkout` | Field label | "Check-out" | Structured message |
| `msg_guests` | Field label | "Guests" | Structured message |
| `msg_room` | Field label | "Room" | Structured message |
| `msg_name` | Field label | "Name" | Structured message |
| `msg_contact` | Field label | "Contact" | Structured message |
| `msg_notes` | Field label | "Notes" | Structured message |
| `msg_nights` | Field label | "Nights" | Structured message |
| `msg_closing` | Closing text | "Please confirm availability..." | Polite request |
| `line_opened_hint` | UI feedback | "LINE opened." | System message |
| `line_clipboard_hint` | UI feedback | "Message copied to clipboard." | System message |
| `line_clipboard_fail` | UI fallback | "Tip: copy your message..." | System message |

---

## 16. SEO METADATA

| Key | Purpose | Current English | Notes |
|-----|---------|----------------|-------|
| `meta_title` | Page `<title>` | "Hotel in Nakhon Si Thammarat..." | ~60 chars |
| `meta_desc` | Meta description | "Looking for a hotel in..." | ~160 chars |
| `og_title` | Open Graph title | "Hotel in Nakhon Si Thammarat..." | Social share |
| `og_desc` | Open Graph desc | "Book direct with Sandbox Hotel..." | Social share |

---

## MISSING KEYS (not currently in i18n object)

The following elements use hardcoded text and should be added to i18n:

1. **Check-in info on booking form**: "Tip: Add your estimated arrival time..." — partially exists as `book_tip`
2. **Check-in/Check-out info**: "Check-in: From 14:00 • Check-out: By 11:00" — needs key `book_checkin_info`
3. **ID requirement**: "ID required: Government-issued ID or passport needed at check-in." — needs key `book_id_note`

---

## SUMMARY

**Total translatable keys**: ~250+
**Sections covered**: 16
**Implementation method**: Inline JavaScript object with `data-i18n`, `data-i18n-html`, and `data-i18n-ph` attributes
**Fallback strategy**: English → Thai → empty string

**Key observations**:
- Many keys support HTML markup (bold, line breaks, spans with classes)
- Some keys have long/short variants for responsive layouts
- Consistent naming convention: `section_element_variant`
- Room-specific content uses clear prefixes
- Message templates mirror form fields for consistency
