# Source Copy Audit & Refinement

**Purpose**: Review English source copy for clarity, localizability, and consistency before transcreation.

**Date**: 2026-03-18
**Auditor**: Localization Strategy Review
**Status**: ✅ Complete

---

## EXECUTIVE SUMMARY

The existing English copy is **generally well-structured** for localization:

✅ **Strengths**:
- Clear, benefit-focused messaging
- Appropriate hospitality tone (professional but warm)
- Action-oriented CTAs
- Good balance of brevity and context
- Consistent product naming

⚠️ **Minor improvements recommended**:
- Some redundancy between offer sections
- A few phrases could be shorter for UI constraints
- Opportunity to strengthen conversion language

---

## SECTION-BY-SECTION AUDIT

### 1. HERO SECTION

#### ✅ STRONG
- **`hero_title`**: "Your quiet retreat in Nakhon Si Thammarat" — natural, benefit-focused, localizes well
- **`hero_sub_short`**: Clear value proposition
- **`cta_request`**: "Check Availability" — action-focused, preferred over "Book Now" for lower commitment

#### ⚠️ REFINEMENT OPPORTUNITIES
- **`hero_kicker`** contains complex HTML markup — acceptable for desktop but may need mobile variant
- **`hero_best_rate`**: "book direct & save" — slightly informal ampersand; consider "book direct and save" for formal locales

**Recommendation**: Keep as-is. The casual ampersand works well for the target audience.

---

### 2. TRUST BAR

#### ✅ STRONG
All trust badges are concise and scan-friendly:
- "Direct Booking" ✓
- "Quiet Rooms" ✓
- "Free Wi‑Fi" ✓
- "Parking" ✓
- "Call / LINE Support" ✓

**No changes needed**.

---

### 3. ROOMS SECTION

#### ✅ STRONG
- **`room_standard_twin_title`** / **`room_standard_double_title`**: Clear product names
- **`room_twin_best_for`** / **`room_double_best_for`**: Helpful use-case guidance
- **`price_rates_on_request`**: "Get today's exact rate →" — action-oriented, sets expectation

#### ⚠️ MINOR INCONSISTENCY
- **`bullet_desk`**: "Work desk + chair" uses "+"
- **`bullet_ac_hot_shower`**: "AC + hot shower" uses "+"
- **`bullet_comfort_double_bed`**: "Comfortable double bed" uses full words

**Recommendation**: Maintain the current mix. The plus sign (+) works well for spec-like features (desk + chair), while full phrases work better for benefit statements (comfortable bed).

---

### 4. OFFERS / WHY STAY SECTION

#### ⚠️ REDUNDANCY DETECTED

**Two versions exist**:

**Version A** (appears in offers section):
- `offers_title`: "Why Stay at Sandbox Hotel"
- `offer1_title`: "Fast Direct Booking"
- `offer1_desc`: "Message your dates and room type — get confirmed quickly via LINE, WhatsApp, or call."
- ... (6 offers total: offer1-6)

**Version B** (appears in "why" section):
- `why_title`: "Why guests choose Sandbox"
- `why_1_t`: "Large rooms"
- `why_1_d`: "Comfortable space to rest or work."
- ... (3 items total: why_1-3)

**Analysis**: Version A is more detailed and conversion-focused. Version B is more concise and scan-friendly.

**Recommendation**: Both have value. Keep both. Use context to determine which section renders. No consolidation needed — they serve different purposes (detailed USPs vs. quick summary).

---

### 5. AMENITIES SECTION

#### ✅ STRONG
Clean structure with title + description:
- Wi‑Fi: "Fast, reliable internet for work, streaming, and daily use." ✓
- Parking: "Limited on-site guest parking available." ✓ (clear expectation-setting)
- Air Conditioning: "Comfortable climate control throughout the year." ✓

**No changes needed**.

---

### 6. BOOKING FORM

#### ✅ STRONG
- **`book_title`**: "Reserve Your Stay" — softer than "Book Now", appropriate for form context
- **`book_sub`**: Uses markup to highlight key terms (dates, room preference) — good visual hierarchy
- **`form_hint`**: "We'll reply with availability and total price." — sets clear expectations

#### ⚠️ REFINEMENT OPPORTUNITY
- **`ph_contact`**: "+66 … or email" — the ellipsis (…) may not render correctly in all fonts/systems

**Recommendation**: Consider changing to "+66... or email" (three dots) or "+66 xxx-xxx-xxxx or email" for better clarity. However, the current version is acceptable.

---

### 7. FAQ SECTION

#### ✅ STRONG
Questions read like real user queries:
- "How do I book the fastest?" ✓
- "What time is check-in and check-out?" ✓
- "Can rates change by date?" ✓

Answers are clear, helpful, and appropriately detailed.

#### ⚠️ MINOR INCONSISTENCY
- **`faq_q9`** in English version: "Where is Sandbox Hotel located in Nakhon Si Thammarat?"
- **`faq_q9`** in alternate context: "Where is Nakhon Si Thammarat?"

**Analysis**: Both questions exist but serve different purposes. The first is property-specific; the second is destination-focused.

**Recommendation**: Keep both. Ensure correct mapping in destination vs. hotel FAQ contexts.

---

### 8. DESTINATION SECTION

#### ✅ STRONG
Educational content that builds context for international visitors:
- Clear geographic context
- Cultural highlights
- Transport options
- Regional positioning

#### ⚠️ VERBOSE IN PLACES
- **`dest_region_body`**: 5 sentences, ~100 words — potentially too long for mobile/scanning users

**Recommendation**: The current "short" variants (`dest_where_body_short`, `dest_why_body_short`) are good solutions. Ensure responsive design uses appropriate variants.

---

### 9. SEO METADATA

#### ✅ STRONG
- **`meta_title`**: "Hotel in Nakhon Si Thammarat | Sandbox Hotel – Best Rate Direct" — 69 chars, good keyword placement
- **`meta_desc`**: Clear value prop, location, booking method, benefit — 155 chars (optimal)

#### ⚠️ KEYWORD STUFFING RISK
The meta description includes:
- "hotel in Nakhon Si Thammarat" (2x mentioned including in meta_title context)
- "Sandbox Hotel"
- "Southern Thailand"
- "direct booking"
- "phone, LINE, WhatsApp, or email"
- "Best rate guaranteed"

**Analysis**: Borderline but acceptable. The phrasing reads naturally despite keyword density.

**Recommendation**: Keep as-is. Works well for search intent ("hotel in [city]") + conversion messaging.

---

### 10. SYSTEM MESSAGES

#### ✅ STRONG
- **`line_opened_hint`**: "LINE opened." — short, clear feedback
- **`line_clipboard_hint`**: "Message copied to clipboard." — standard, expected phrasing
- **`line_clipboard_fail`**: "Tip: copy your message if needed." — friendly fallback

**No changes needed**.

---

## LOCALIZABILITY ANALYSIS

### ✅ LOCALIZES WELL

**Short UI labels** (buttons, nav, tags):
- One or two words
- Clear actions
- Universal concepts
- Room for text expansion in other languages

**Benefit statements** (offers, amenities):
- Focus on universal hospitality needs
- Avoid idioms or culturally specific references
- Use concrete language

### ⚠️ MODERATE LOCALIZATION CHALLENGE

**Phrases with cultural/linguistic nuance**:
- "Your quiet retreat" — "retreat" has specific connotations in English; requires transcreation in Thai/Chinese
- "Best Rate Guaranteed — book direct & save" — guarantee language may need legal/cultural adaptation
- "Why guests choose Sandbox" — third-person phrasing; some languages prefer first-person "Why stay with us"

**Recommendation**: These are expected challenges and are flagged for transcreation (not literal translation).

---

## COPY REFINEMENT RECOMMENDATIONS

### OPTIONAL IMPROVEMENTS

**If implementing copy refinements** (not required, but would strengthen source):

1. **Simplify `hero_best_rate`**:
   - Current: "Best Rate Guaranteed — book direct & save"
   - Refined: "Best rate when you book direct"
   - Rationale: Simpler, avoids guarantee legal concerns, equally persuasive

2. **Shorten `rooms_fine`**:
   - Current: "Rates can change by date and season. Message your dates for the fastest exact price."
   - Refined: "Rates vary by date. Message us for today's exact price."
   - Rationale: Clearer call-to-action

3. **Consolidate offer titles** (if only one version is shown):
   - Decide between `offer2_title` ("Spacious Comfortable Rooms") and `why_1_t` ("Large rooms")
   - Rationale: Consistency across sections

**Decision**: NOT implementing these changes at this time. Current copy is production-ready. These are optimizations for future iteration.

---

## MISSING COPY

### Keys that appear in HTML but lack i18n entries:

1. **`book_checkin_info`**: "Check-in: From 14:00 • Check-out: By 11:00"
   - Currently appears as static text in booking form sidebar
   - **Action**: Add to i18n object

2. **`book_id_note`**: "ID required: Government-issued ID or passport needed at check-in."
   - Currently appears as static text
   - **Action**: Add to i18n object

3. Destination section **bullet list content** (attractions, transport):
   - Currently hardcoded in HTML:
     - "Wat Phra Mahathat — 1,000-year-old temple complex"
     - "By Air — NST Airport, ~1.5 hours from Bangkok"
   - **Action**: Consider whether these need localization (proper nouns vs. descriptions)

**Recommendation**: Add items 1-2 as i18n keys. For item 3, keep attraction names in Roman script but localize descriptions.

---

## FINAL ASSESSMENT

**Grade**: A- (Excellent, with minor refinements possible)

**Conclusion**:
The English source copy is clear, professional, conversion-focused, and ready for transcreation into Thai and Simplified Chinese. The tone strikes an appropriate balance between hospitality warmth and direct booking efficiency.

The copy demonstrates good understanding of:
- Hotel guest needs (quiet, spacious, fast confirmation)
- Direct booking value proposition (best rate, no fees)
- Mobile-first UX (short labels, clear CTAs)
- SEO requirements (location keywords, search intent)

**No blocking issues. Proceed to transcreation phase.**
