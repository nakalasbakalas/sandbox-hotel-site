# Locale Strategy Document

**Purpose**: Define transcreation approach, tone, CTA style, and localization rules for each target language.

**Date**: 2026-03-18
**Project**: Sandbox Hotel Website
**Locales**: Thai (th), English (en), Simplified Chinese (zh-CN)

---

## EXECUTIVE SUMMARY

This document defines the localization strategy for **three core languages**:
- **Thai (th)**: Primary market — local Thai guests and domestic travelers
- **English (en)**: International market — Western travelers, expats, English-speaking Asians
- **Simplified Chinese (zh-CN)**: Growing market — mainland Chinese tourists exploring Southern Thailand

**Core Principle**: **Transcreation, not translation**
Each language version must sound native, not mechanically converted from another language.

---

## LOCALE: THAI (th)

### Target Audience
- **Domestic Thai travelers**: Business travelers, families, couples
- **Southern Thailand locals**: Short stays, extended stays
- **Bangkok/Central Thailand visitors**: Exploring Southern regions

### Tone & Voice
**Primary tone**: Warm, approachable, service-oriented

**Characteristics**:
- Friendly but professional
- Natural Thai hospitality language
- Balanced use of Thai and transliterated English terms (common in modern Thai hospitality)
- Polite register without excessive formality

**Avoid**:
- Overly formal royal/high register Thai (too stiff for hotel website)
- Literal English-to-Thai word-for-word translations
- Western marketing clichés that don't translate culturally

### Sentence Structure
**Preference**: Short, clear sentences

**Thai-specific considerations**:
- Thai readers prefer concise phrasing over elaborate descriptions
- Use natural Thai sentence flow, not English clause structure
- Subject-Verb-Object is less rigid in Thai — adapt as needed
- Use Thai particles (ครับ/ค่ะ, นะ, เลย) for natural tone in conversational contexts

**Example**:
- ❌ Weak: "เราขอแนะนำโรงแรมของเราซึ่งตั้งอยู่ในนครศรีธรรมราช" (mechanical translation)
- ✅ Strong: "Sandbox Hotel ในนครศรีธรรมราช" (natural, direct)

### CTA Style
**Format**: Action-oriented, immediate, friendly

**Key patterns**:
- **High-urgency**: "จองเลย" (Book now) — uses particle "เลย" for immediacy
- **Low-commitment**: "เช็คห้องว่าง" (Check available rooms) — natural Thai phrasing
- **Contact**: "โทรหรือ LINE" (Call or LINE) — conversational, channel-specific

**Avoid**:
- Overly aggressive sales language ("จองเดี๋ยวนี้ด่วน!" = "Book now urgent!")
- Literal translations of English CTAs that sound awkward in Thai

### Typography & Text Expansion
**Expected expansion**: Thai text is typically **0.9-1.1x** English length

**Considerations**:
- Thai script uses more vertical space (ascenders/descenders)
- Line height should be at least 1.4-1.6 for readability
- Thai text can wrap more naturally than English (no hyphenation needed)

**UI-safe practices**:
- Button labels: Keep under 15 Thai characters
- Headlines: Break with `<br>` if needed for rhythm
- Form labels: 1-3 words ideal

### Formality Level
**Standard register**: Neutral-polite

**When to use polite particles**:
- ✅ FAQ answers, booking confirmations, terms: Add "ครับ/ค่ะ" or "นะครับ/นะคะ"
- ✅ Direct questions to guest: "คุณต้องการอะไรเพิ่มไหมครับ?"
- ❌ UI labels, buttons, section headers: No particles needed
- ❌ Room descriptions: Descriptive tone, no particles

### SEO Behavior
**Search intent in Thai**:
- Thai users search both in Thai and English
- Common queries: "โรงแรม นครศรีธรรมราช", "ที่พักในนครศรีธรรมราช", "hotel nakhon si thammarat"
- Mixed-language queries are normal: "hotel นครศรีธรรมราช ราคาถูก"

**Meta optimization**:
- Include Thai keywords naturally: "โรงแรม", "ที่พัก", "จองตรง", "ราคาดี"
- Place name in Thai: "นครศรีธรรมราช"
- Keep brand name in Roman: "Sandbox Hotel"

**Page titles**: 50-60 Thai characters (shorter than English 60-70 chars)

### Culture-Specific Wording
**Accommodation terminology**:
- "ที่พัก" (lodging) vs. "โรงแรม" (hotel): Use "โรงแรม" for hotel context, "ที่พัก" for general accommodation
- "ห้องพัก" (guest room) preferred over just "ห้อง" (room) in formal descriptions

**Hospitality language**:
- Emphasize "service" (บริการ) and "help" (ช่วยเหลือ) — core Thai hospitality values
- "สะดวก" (convenient) is a key selling point in Thai travel
- "เงียบ" or "เงียบสงบ" (quiet) resonates strongly with Thai guests seeking rest

**Booking confidence**:
- "จองตรงกับโรงแรม" (book direct with hotel) — emphasizes personal relationship
- "รับประกัน" (guarantee) — strong trust signal, use carefully
- "ยืนยันรวดเร็ว" (fast confirmation) — addresses Thai preference for quick response

---

## LOCALE: ENGLISH (en)

### Target Audience
- **Western travelers**: Europeans, Americans, Australians exploring Southeast Asia
- **English-speaking Asians**: Singaporeans, Malaysians, educated Thai/Chinese speakers
- **Digital nomads & expats**: Long-term visitors needing work-friendly accommodations

### Tone & Voice
**Primary tone**: Clear, calm, credible

**Characteristics**:
- Professional hospitality English (not overly casual, not overly formal)
- Benefit-focused messaging (what guests gain, not just features)
- Direct and transparent (no marketing fluff or exaggerated claims)
- Warm but businesslike

**Avoid**:
- Generic travel clichés ("paradise", "hidden gem", "unforgettable experience")
- Overused luxury adjectives ("sumptuous", "opulent", "exquisite")
- Unnecessary superlatives ("the best hotel in Thailand")
- Buzzwords without substance ("curated", "artisanal", "boutique" without context)

### Sentence Structure
**Preference**: Concise, active voice

**English-specific considerations**:
- Aim for 15-20 words per sentence average
- Use parallel structure in bullet lists
- Prefer strong verbs over weak verb + adverb combinations
- Lead with benefits, follow with features

**Example**:
- ❌ Weak: "We have a really great team that will help you with anything you need during your stay"
- ✅ Strong: "Local staff available to assist during your stay"

### CTA Style
**Format**: Action verb + clear outcome

**Key patterns**:
- **High-commitment**: "Book Now" — standard, clear
- **Low-commitment**: "Check Availability" — reduces friction, preferred for main CTA
- **Information**: "Explore Rooms", "View Gallery" — discovery-oriented
- **Contact**: "Call or LINE" — channel-specific, direct

**Best practices**:
- Use title case for button text: "Check Availability" not "check availability"
- Keep CTAs under 3 words when possible
- Avoid clever/cute phrasing that may confuse non-native speakers

### Typography & Text Expansion
**Baseline locale**: English is the **reference length** (1.0x)

**Considerations**:
- English is relatively compact compared to many languages
- Average word length: 5.1 characters
- Line breaks: Avoid orphans (single words on final line)

**UI-safe practices**:
- Button labels: 1-3 words, 8-20 characters
- Headlines: 5-10 words
- Meta descriptions: 140-160 characters

### Formality Level
**Standard register**: Professional-friendly

**Pronoun use**:
- Use "you" (second person) to address guests directly
- Use "we" (first person plural) for hotel actions
- Avoid "one" (third person) — too formal for hospitality

**Contractions**:
- ✅ Use in conversational contexts: "We'll reply", "It's available"
- ❌ Avoid in formal contexts: Terms & conditions, legal notices

### SEO Behavior
**Search intent in English**:
- International travelers search: "hotel in nakhon si thammarat", "where to stay nakhon si thammarat", "accommodation southern thailand"
- Long-tail queries: "quiet hotel nakhon si thammarat", "direct booking hotel thailand"
- Location + attribute: "nakhon si thammarat hotel wifi parking"

**Meta optimization**:
- Include geographic keywords: "Nakhon Si Thammarat", "Southern Thailand"
- Include intent keywords: "hotel", "accommodation", "where to stay", "direct booking"
- Include differentiators: "quiet", "spacious", "direct booking"

**Page titles**: 50-60 characters (~8-12 words)

### Culture-Specific Wording
**Direct booking emphasis**:
- English speakers increasingly value direct booking to avoid OTA fees
- Key phrases: "Best Rate Direct", "No booking fees", "Book direct & save"

**Accommodation expectations**:
- Emphasize practical benefits: "Fast Wi-Fi for work", "Quiet-side rooms"
- Include specific details: "28-32 m²" not just "spacious"
- Address common concerns: "Government-issued ID required at check-in"

**Regional context**:
- Many English speakers don't know Nakhon Si Thammarat — provide geographic/cultural context
- Position as "authentic Thailand" vs. tourist beaches
- Reference well-known landmarks (Wat Phra Mahathat) for credibility

---

## LOCALE: SIMPLIFIED CHINESE (zh-CN)

### Target Audience
- **Mainland Chinese tourists**: Independent travelers, families, young professionals
- **Chinese expats in Southeast Asia**: Business travelers, regional visitors
- **Chinese digital nomads**: Remote workers exploring Thailand

### Tone & Voice
**Primary tone**: Clear, practical, trustworthy

**Characteristics**:
- Straightforward, efficient communication
- Focus on tangible benefits (price, convenience, cleanliness)
- Respectful without excessive formality
- Information-dense but scannable

**Avoid**:
- Overly flowery or poetic language (less effective in commercial hospitality context)
- Direct translations of English marketing phrases that sound unnatural in Chinese
- Excessive use of 您 (overly formal "you") — use sparingly, not in every sentence
- Western-centric cultural references

### Sentence Structure
**Preference**: Concise, direct statements

**Chinese-specific considerations**:
- Chinese can express ideas in fewer characters than English
- Prefer simple sentences over complex compound sentences
- Topic-comment structure is natural in Chinese
- No articles (的/得/地) needed in every phrase — use only when necessary for clarity

**Example**:
- ❌ Weak (literal translation): "我们的酒店是一个非常适合您的安静的地方" (Our hotel is a very suitable quiet place for you)
- ✅ Strong (natural Chinese): "安静舒适的住宿环境" (Quiet and comfortable lodging environment)

### CTA Style
**Format**: Verb + object (concise action)

**Key patterns**:
- **High-commitment**: "立即预订" (Book now) — standard, urgent
- **Low-commitment**: "查看空房" (Check available rooms) — information-seeking
- **Information**: "查看房型" (View room types) — discovery
- **Contact**: "电话或LINE" (Phone or LINE) — direct, channel-specific

**Best practices**:
- Keep CTAs to 2-4 Chinese characters when possible
- Use standard Chinese e-commerce language (familiar to online Chinese users)
- Avoid overly creative phrasing that may confuse

### Typography & Text Expansion
**Expected compression**: Chinese text is typically **0.6-0.8x** English length

**Considerations**:
- Chinese characters are square/fixed-width — predictable spacing
- Vertical text alignment is generally good
- Chinese can be denser — add spacing/line-height for readability

**UI-safe practices**:
- Button labels: 2-5 characters ideal
- Headlines: 6-12 characters
- Line height: 1.5-1.8 for comfortable reading

### Formality Level
**Standard register**: Polite-neutral

**Pronoun guidance**:
- Use "您" (formal you) in: Direct questions, booking confirmations, FAQ answers
- Use "你" (casual you) or omit: UI labels, short descriptions, mobile-friendly copy
- Hotel = "我们" (we), Guest = "您/你" or just implied by context

**Politeness markers**:
- Add "请" (please) in instructions: "请选择日期" (Please select dates)
- End requests with "谢谢" (thank you) where appropriate
- Avoid overly humble language (不好意思, 麻烦您) — too self-deprecating for hotel website

### SEO Behavior
**Search intent in Chinese**:
- Mainland Chinese search in Chinese: "洛坤府酒店", "泰国南部住宿", "洛坤住宿推荐"
- Booking-intent queries: "洛坤府酒店预订", "直订酒店泰国", "洛坤府哪里住"
- Attribute searches: "安静酒店泰国", "泰南舒适酒店", "洛坤府经济型酒店"

**Meta optimization**:
- Use Chinese place name: "洛坤府" (standard transliteration for Nakhon Si Thammarat)
- Include region: "泰国南部" (Southern Thailand) or "泰南"
- Include intent: "酒店", "住宿", "直订"
- Include attributes: "安静", "舒适", "经济实惠"

**Page titles**: 25-35 Chinese characters

### Culture-Specific Wording
**Booking preferences**:
- Chinese travelers value transparency: "无手续费" (no fees), "无加价" (no mark-up)
- Emphasize direct communication: "微信/LINE 可联系" (Can contact via WeChat/LINE)
- Price clarity: "准确价格" (exact price), "今日房价" (today's rate)

**Accommodation priorities**:
- **Cleanliness**: "干净" (clean) is critical — mention explicitly
- **Wi-Fi quality**: "高速Wi-Fi" (high-speed Wi-Fi) — essential for Chinese guests
- **Location convenience**: "交通便利" (convenient transport), "市中心" (city centre)
- **Value**: "性价比高" (good value) — important consideration

**Travel context**:
- Provide clear directions/transport info (Chinese tourists often travel independently)
- Mention proximity to known landmarks: "靠近Wat Phra Mahathat寺庙"
- Explain regional position: "泰国湾沿岸" (Gulf of Thailand coast), "非拥挤度假区" (not crowded resort area)

**Trust signals**:
- Emphasize direct booking security: "酒店直订更安心" (Direct booking more reassuring)
- Show concrete info: "28-32㎡客房" (specific room size), "办公桌" (work desk)
- Use review snippets: "住客评价" (guest reviews) with star ratings

---

## CROSS-LOCALE COMPARISON

### Tone Spectrum

| Dimension | Thai | English | Chinese |
|-----------|------|---------|---------|
| Warmth | High (friendly, service-oriented) | Medium (professional-friendly) | Medium-Low (practical, clear) |
| Formality | Medium (polite, not stiff) | Medium (professional) | Medium (respectful, not excessive) |
| Directness | Low-Medium (softer phrasing) | High (clear, transparent) | High (efficient, concise) |
| Detail Level | Medium (key facts + reassurance) | High (specific details) | High (concrete information) |

### CTA Intensity

| Commitment | Thai | English | Chinese |
|------------|------|---------|---------|
| High | "จองเลย" (emphatic) | "Book Now" (standard) | "立即预订" (standard) |
| Medium | "จองห้องพัก" | "Reserve Your Stay" | "预订您的住宿" |
| Low | "เช็คห้องว่าง" (check) | "Check Availability" (explore) | "查看空房" (check) |

### Sentence Length Targets

| Content Type | Thai | English | Chinese |
|--------------|------|---------|---------|
| Headlines | 8-12 words | 5-10 words | 6-10 characters |
| Button CTAs | 2-4 words | 1-3 words | 2-4 characters |
| Body sentences | 12-18 words | 15-20 words | 15-25 characters |
| Meta descriptions | 80-100 chars | 140-160 chars | 60-80 chars |

---

## IMPLEMENTATION RULES

### 1. Transcreation Workflow

**For each string**:
1. **Understand intent**: What is the business/conversion goal?
2. **Adapt for locale**: What phrasing achieves that goal naturally in this language?
3. **Check UI fit**: Does it fit probable UI constraints?
4. **Verify consistency**: Is terminology aligned with glossary?

**Example (hero headline)**:
- **English**: "Your quiet retreat in Nakhon Si Thammarat"
  - Intent: Positioning as peaceful, personal space
- **Thai**: "พักผ่อน เงียบสบาย ในนครศรีธรรมราช"
  - Adaptation: Simple, direct benefits (rest, quiet, comfortable)
- **Chinese**: "位于洛坤府的现代静谧住宿"
  - Adaptation: Modern + quiet accommodation (practical + benefit)

### 2. Key Phrase Handling

**Do NOT translate literally**:
- ❌ "Your quiet retreat" → 你的安静的度假胜地 (awkward Chinese)
- ✅ "Your quiet retreat" → 安静舒适的住宿 (natural: quiet comfortable lodging)

**Preserve business intent**:
- "Best Rate Guaranteed" in English = trust/price promise
- Thai: "รับประกันราคาดีที่สุด" (guarantee best price) — maintains promise
- Chinese: "直订最优惠价格保证" (direct booking best rate guarantee) — emphasizes direct booking benefit

### 3. HTML & Markup Preservation

**When string contains HTML**:
- Preserve HTML tags exactly: `<br>`, `<b>`, `<strong>`, `<span>`
- Adapt text content inside tags
- Test that markup creates appropriate visual hierarchy in each language

**Example**:
```html
<!-- English -->
<span class="kw a">Direct booking</span> • <span class="kw">Fast confirmation</span>

<!-- Thai -->
<span class="kw a">จองตรงกับโรงแรม</span> • <span class="kw">ยืนยันรวดเร็ว</span>

<!-- Chinese -->
<span class="kw a">酒店直订</span> • <span class="kw">快速确认</span>
```

### 4. Variable/Placeholder Handling

**Dynamic content** (dates, numbers, names):
- Preserve placeholder syntax
- Ensure grammar works naturally when placeholder is replaced
- Test with actual data

**Example**:
- English: "Check-in: {checkin}" ✓ works naturally
- Thai: "เช็คอิน: {checkin}" ✓ works naturally
- Chinese: "入住：{checkin}" ✓ works naturally

### 5. Fallback Strategy

**Current implementation**:
```javascript
function t(key) {
  const pack = I18N[CURRENT_LANG] || I18N[I18N_DEFAULT] || {};
  return pack[key] || (I18N.en && I18N.en[key]) || (I18N.th && I18N.th[key]) || "";
}
```

**Fallback order**: Selected language → Thai (default) → English → Empty string

**Best practice**: Ensure ALL keys exist in ALL locales to avoid fallback scenario.

---

## QUALITY CHECKLIST

Before finalizing any locale, verify:

- [ ] Reads naturally to a native speaker (not machine-translated)
- [ ] Preserves business/conversion intent
- [ ] Uses terminology consistently (per glossary)
- [ ] Fits probable UI constraints
- [ ] Contains no grammatical errors
- [ ] Uses appropriate formality level
- [ ] Includes proper punctuation for language
- [ ] Maintains semantic consistency with other locales
- [ ] Preserves HTML markup correctly (if applicable)
- [ ] Works with placeholders/variables (if applicable)

---

## NEXT STEPS

1. ✅ Strategy defined
2. → Create locale-specific style guides (detailed examples per section)
3. → Transcreate all strings per locale
4. → QA review for native quality
5. → Layout risk assessment
6. → Implementation and testing

---

**Document Status**: Complete
**Last Updated**: 2026-03-18
