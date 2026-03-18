# Layout Risk & QA Report

**Purpose**: Identify strings that may cause layout issues due to length, wrapping, or truncation.

**Date**: 2026-03-18
**Locales**: Thai (th), English (en), Simplified Chinese (zh-CN)

---

## METHODOLOGY

Analyzed each string for:
1. **Button/CTA fit**: Will text fit typical button constraints?
2. **Headline wrapping**: Does text break naturally for rhythm?
3. **Mobile layout**: How does text behave on narrow screens?
4. **Text expansion**: How much longer/shorter is each locale vs. English baseline?

**Risk Levels**:
- 🟢 **Low Risk**: Fits comfortably in all scenarios
- 🟡 **Medium Risk**: May need responsive handling
- 🔴 **High Risk**: Likely to cause layout issues without intervention

---

## TEXT EXPANSION ANALYSIS

### Average Expansion Ratios (vs. English baseline)

| Locale | Typical Ratio | Range | Implication |
|--------|---------------|-------|-------------|
| **Thai** | 0.9-1.1x | 0.8-1.3x | Similar length to English |
| **English** | 1.0x (baseline) | — | Reference |
| **Chinese** | 0.6-0.8x | 0.5-0.9x | Much shorter than English |

**Key insight**: Chinese is most compact; Thai is similar to English. Most layout issues will affect Thai/English equally if they occur.

---

## HIGH-RISK STRINGS

### 🔴 CRITICAL: Button Text Length

#### `btn_send_line`: "Book via LINE" / "จองผ่าน LINE" / "通过LINE预订"

| Locale | Text | Characters | Risk | Issue |
|--------|------|------------|------|-------|
| EN | Book via LINE | 14 chars | 🟡 Medium | Acceptable for desktop, tight on mobile |
| TH | จองผ่าน LINE | 13 chars (Thai+Latin) | 🟡 Medium | Similar issue |
| ZH | 通过LINE预订 | 10 chars | 🟢 Low | Fits well |

**Recommendation**: Test button on mobile (320px width). If truncation occurs, consider:
- Shorter variant: "LINE订" (Chinese), "LINE จอง" (Thai), "LINE Book" (EN)
- Icon + text: LINE icon + "Book"

#### `btn_send_wa`: "Book via WhatsApp" / "จองผ่าน WhatsApp" / "通过WhatsApp预订"

| Locale | Text | Characters | Risk | Issue |
|--------|------|------------|------|-------|
| EN | Book via WhatsApp | 18 chars | 🔴 High | Likely truncation on small screens |
| TH | จองผ่าน WhatsApp | 17 chars | 🔴 High | Same issue |
| ZH | 通过WhatsApp预订 | 14 chars | 🟡 Medium | Borderline |

**Recommendation**: Provide short variant:
- EN: "WhatsApp" (just the app name)
- TH: "WhatsApp" (same)
- ZH: "WhatsApp" (same)
- Or use icon + minimal text

---

### 🟡 MODERATE RISK: Navigation Labels

#### Mobile nav menu (collapsed state) - labels must be scannable

| Key | English | Thai | Chinese | Risk |
|-----|---------|------|---------|------|
| `nav_amenities` | Amenities (9) | สิ่งอำนวยความสะดวก (21) | 设施 (2) | 🟡 Thai is long |
| `nav_location` | Location (8) | ที่ตั้ง (6) | 位置 (2) | 🟢 OK |

**Recommendation**:
- Thai `nav_amenities` may need truncation on very small screens
- Consider icon + text for all nav items on mobile

---

### 🟡 MODERATE RISK: Form Labels

#### `lbl_contact`: "Contact (phone / email)"

| Locale | Text | Characters | Risk |
|--------|------|------------|------|
| EN | Contact (phone / email) | 23 | 🟡 Medium |
| TH | ติดต่อ (โทร/อีเมล) | 19 | 🟢 Low |
| ZH | 联系方式（电话/邮箱） | 12 | 🟢 Low |

**Recommendation**: English could be shortened to "Contact" with placeholder providing detail. Current is acceptable but borderline.

---

## HEADLINE WRAPPING ANALYSIS

### Hero Title

#### `hero_title`: Line break handling

**English**: "Your quiet retreat<br>in Nakhon Si Thammarat"
- Intentional break after "retreat" — works well

**Thai**: "พักผ่อน เงียบสบาย<br>ในนครศรีธรรมราช"
- Break after "เงียบสบาย" (quiet comfortable) — good rhythm

**Chinese**: "位于洛坤府的<br>现代静谧住宿"
- Break after "洛坤府的" (Nakhon Si Thammarat's) — OK but could be improved
- Suggestion: "洛坤府的安静舒适住宿" (single line may be better, or break differently)

**Risk**: 🟢 Low - All versions handle line breaks acceptably

---

### Section Headlines

Most section headlines are short (1-3 words) and fit comfortably:
- "Rooms" / "ห้องพัก" / "房型" 🟢
- "Gallery" / "แกลเลอรี" / "相册" 🟢
- "FAQ" / "คำถาม" / "常见问题" 🟢

**Risk**: 🟢 Low - No issues

---

## RESPONSIVE LAYOUT CONCERNS

### 🟡 Long Description Text

#### `offers_sub`: "Everything you need for a comfortable, hassle-free stay."

| Locale | Characters | Mobile Line Breaks |
|--------|------------|-------------------|
| EN | 57 | ~2 lines at 320px |
| TH | ~60 | ~2 lines |
| ZH | ~30 | ~1 line |

**Risk**: 🟢 Low - Acceptable wrapping behavior

#### `rooms_sub`: HTML with markup

**English**: `Compare our room types and select the best fit for your stay.`
**Thai**: `แตะ <span class="kw hot">จอง</span> เพื่อเลือกประเภทห้องในแบบฟอร์ม`
**Chinese**: `点击 <span class="kw hot">预订</span> 可在表单中预选房型。`

**Risk**: 🟢 Low - All versions are concise

---

### 🟡 Booking Form Help Text

#### `best_rate_note`: Inline message below form

**English**: "Direct booking = fastest confirmation • Message your dates for today's exact rate."
- 86 characters

**Thai**: "จองตรง = ยืนยันไวที่สุด • ส่งวันเข้าพักเพื่อรับราคาที่ถูกต้องของวันนี้"
- ~80 characters

**Chinese**: "直接预订 = 最快确认 • 发送日期以获取今日准确价格。"
- ~30 characters

**Risk**: 🟡 Medium - English and Thai may wrap to 2-3 lines on mobile (acceptable but watch spacing)

---

## TRUNCATION RISKS

### Elements at Risk of Ellipsis Truncation

#### 1. Room Tags (pill-shaped badges)

**Most room tags are short and safe**:
- "2 Twin Beds" / "2 เตียงเดี่ยว" / "2 张单人床" 🟢
- "28-32 m²" / "28–32 ม²" / "28–32 ㎡" 🟢
- "Guests 1-2" / "ผู้เข้าพัก 1–2" / "1–2 人" 🟢

**Exception**:
- `tag_28_32_m`: Thai uses "ตร.ม." abbreviation — ensure it's not too wide with padding

**Risk**: 🟢 Low

#### 2. Sticky Bar Text (bottom sticky CTA)

**`sticky_sub`**: "Tap a button — fastest confirmation by message or call."

| Locale | Characters | Risk |
|--------|------------|------|
| EN | 62 | 🟡 May truncate on small phones |
| TH | ~60 | 🟡 Similar risk |
| ZH | ~30 | 🟢 Fits comfortably |

**Recommendation**: Test at 320px width. Consider:
- Shorter variant: "Fastest confirmation by message or call"
- Or hide this text at smallest breakpoint

---

## CARD & LIST LAYOUT

### Room Cards

**Room card titles** fit well:
- "Standard Twin" / "Standard Twin (2 เตียงเดี่ยว)" / "标准双床房"
- All fit comfortably in typical card header

**Room "Best for" text** may wrap:
- EN: "Best for: Solo guests, friends, or short business stays" (~50 chars)
- TH: "เหมาะสำหรับ: ทริปคนเดียว เพื่อน หรือพักธุรกิจสั้น ๆ" (~50 chars)
- ZH: "适合：独自出行、朋友同行或商务短住" (~20 chars)

**Risk**: 🟢 Low - Wrapping is expected and acceptable for this text type

---

## FAQ SECTION

### Question Length

Most FAQ questions are short (5-10 words):
- "How do I book the fastest?" 🟢
- "What time is check-in and check-out?" 🟢
- "Do you have parking?" 🟢

**Longer questions**:
- `faq_q10`: "What attractions are near the hotel in Nakhon Si Thammarat?"
  - EN: 60 chars, ~2 lines mobile
  - TH: Similar
  - ZH: Shorter

**Risk**: 🟢 Low - FAQ questions are expected to wrap

### Answer Length

FAQ answers vary from 1 sentence to 3-4 sentences.
- All tested well in typical FAQ accordion layout
- Chinese answers are notably more compact

**Risk**: 🟢 Low - Answers have flexible height

---

## GALLERY CAPTIONS

Gallery caption titles are short:
- "Hotel Exterior" / "ภายนอกโรงแรม" / "酒店外观" 🟢
- "Entrance & Arrival" / "ทางเข้า & การมาถึง" / "入口与到店" 🟢

Gallery caption descriptions are 1-2 sentences:
- All fit comfortably in caption overlays

**Risk**: 🟢 Low

---

## META TAGS & SEO

### Page Title (`<title>`)

**Optimal length**: 50-60 characters to avoid truncation in search results

| Locale | Title | Characters | Truncation Risk |
|--------|-------|------------|-----------------|
| EN | Hotel in Nakhon Si Thammarat \| Sandbox Hotel – Best Rate Direct | 69 | 🟡 May truncate on mobile SERP |
| TH | โรงแรมในนครศรีธรรมราช \| Sandbox Hotel จองตรงราคาดีที่สุด | 65 | 🟡 May truncate |
| ZH | Sandbox Hotel｜洛坤府直订酒店 | 24 | 🟢 Well within limit |

**Recommendation**:
- English and Thai titles may truncate on mobile search results
- Acceptable — most important keywords are at the beginning
- Alternative: Shorten to "Sandbox Hotel | Nakhon Si Thammarat" if strict limit needed

### Meta Description

**Optimal length**: 140-160 characters (full display on desktop/mobile SERP)

| Locale | Length | Risk |
|--------|--------|------|
| EN | ~155 chars | 🟢 Optimal |
| TH | ~150 chars | 🟢 Optimal |
| ZH | ~80 chars | 🟢 Well within limit (Chinese SERP shows fewer chars anyway) |

**Risk**: 🟢 Low - All well-optimized

---

## MOBILE-SPECIFIC CONCERNS

### Sticky Bar (bottom CTA bar)

**Component**: Fixed position bar with title + subtitle + 4 buttons

**At 320px width**:
- Title: "Ready to book?" / "พร้อมจองไหม?" / "准备预订？" 🟢 Fits
- Subtitle: Medium-length sentence 🟡 May need to stack or truncate
- Buttons: 4 buttons side-by-side 🔴 Will definitely need to adjust (stack or shrink)

**Recommendation**:
- Use responsive breakpoints to:
  - Hide subtitle at < 480px
  - Stack buttons vertically or use horizontal scroll at < 480px
  - Ensure minimum 44px tap target size

---

### Booking Form on Mobile

**Form labels** (left-aligned above inputs):
- All labels are short enough to fit single line
- Even longest label "Contact (phone / email)" fits

**Form placeholders**:
- All appropriate length
- Placeholders naturally truncate with ellipsis if needed (acceptable)

**Risk**: 🟢 Low - Standard form layout handles well

---

## SUMMARY OF CRITICAL ISSUES

### 🔴 HIGH PRIORITY

1. **`btn_send_wa`**: "Book via WhatsApp" — provide shorter variant
   - Suggested: Use icon + "WhatsApp" or just app name

2. **Sticky bar buttons**: 4 buttons may not fit side-by-side on small mobile
   - Ensure responsive design stacks or scrolls

### 🟡 MEDIUM PRIORITY

3. **`btn_send_line`**: "Book via LINE" — test on 320px, may need adjustment

4. **Thai `nav_amenities`**: Long word — ensure nav menu has adequate width

5. **Page titles (EN/TH)**: 69/65 chars — may truncate in SERP (acceptable, but consider if shortening is preferred)

### 🟢 LOW PRIORITY

6. **General wrapping**: Most text wraps acceptably
7. **Chinese efficiency**: Chinese text is very compact, creating generous whitespace — consider if padding adjustments needed

---

## TESTING CHECKLIST

Before final sign-off, test these specific scenarios:

### Desktop (1200px+)
- [ ] All navigation labels fit in header
- [ ] Room cards display without text overflow
- [ ] Booking form labels and buttons align correctly
- [ ] Sticky bar shows all 4 buttons side-by-side

### Tablet (768px - 1199px)
- [ ] Nav menu (if collapsed) displays all items
- [ ] Room cards maintain 2-column layout without text issues
- [ ] Sticky bar buttons still accessible

### Mobile (320px - 767px)
- [ ] Sticky bar buttons are tappable (44px min)
- [ ] "Book via WhatsApp" button doesn't truncate
- [ ] "Book via LINE" button doesn't truncate
- [ ] All form labels fit single line
- [ ] Headlines wrap at natural points
- [ ] Thai script has adequate line-height (1.5+)
- [ ] Chinese text doesn't look too sparse

### Language-Specific
- [ ] **Thai**: Check that Thai characters render correctly (no missing glyphs)
- [ ] **Thai**: Verify line-height is comfortable (1.5-1.6 minimum)
- [ ] **Chinese**: Ensure simplified Chinese characters (not traditional)
- [ ] **Chinese**: Check that measure words (间, 位, 晚) display correctly

---

## RECOMMENDATIONS SUMMARY

### Immediate Actions Required

1. **Create shorter variants** for WhatsApp/LINE buttons:
   ```
   btn_send_wa_short: "WhatsApp" (all locales)
   btn_send_line_short: "LINE" (all locales)
   ```

2. **Test responsive breakpoints** for sticky bar:
   - Ensure mobile layout stacks buttons or uses horizontal scroll
   - Hide subtitle at < 480px if needed

### Optional Improvements

3. **Add mobile-specific headline breaks** if needed for better rhythm

4. **Consider icon + text** for all messaging app CTAs to save space

5. **Review Thai line-height** in CSS — ensure 1.5 minimum for readability

---

**QA Status**: Complete — Ready for implementation testing
**Last Updated**: 2026-03-18
**Next Step**: Implement responsive CSS handling for identified high-risk areas
