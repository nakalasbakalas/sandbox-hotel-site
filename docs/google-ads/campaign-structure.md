# Google Ads Campaign Structure

## Launch Objective

Drive profitable direct booking inquiries for Sandbox Hotel in Nakhon Si Thammarat. Optimize for qualified inquiry sends first, then tighten bidding after enough conversion data is available.

## Recommended Launch Campaigns

### 1. Brand Search

Purpose: Capture people already looking for Sandbox Hotel.

Settings:

- Network: Google Search only
- Location: Thailand first; add selected international source markets only if inquiry quality supports it
- Language: Thai and English
- Bidding: Start with Maximize Clicks with a CPC ceiling or Manual CPC if conversion volume is low; move to Maximize Conversions after reliable conversion history
- Conversion: `booking_send_success` as the primary goal

Ad groups:

- Sandbox Hotel
- Sandbox Hotel Nakhon Si Thammarat
- Sandbox Hotel booking

### 2. Nakhon Hotel Search

Purpose: Capture high-intent hotel searches in the destination.

Settings:

- Network: Google Search only
- Location: Thailand, with observation segments for Bangkok, Surat Thani, Phuket, Krabi, Songkhla, and Nakhon Si Thammarat
- Language: Thai and English
- Bidding: Conservative CPC cap at launch; increase only on inquiries that the hotel confirms as useful

Ad groups:

- Hotels in Nakhon Si Thammarat
- Nakhon Si Thammarat accommodation
- Direct booking hotel
- Quiet city hotel

### 3. Room Intent Search

Purpose: Match travelers who know the stay type they need.

Ad groups:

- Twin room Nakhon Si Thammarat
- Double room Nakhon Si Thammarat
- Hotel with parking
- Hotel with Wi-Fi

### 4. Remarketing Search Observation

Purpose: Bid more confidently on returning visitors without launching display remarketing too early.

Settings:

- Use search audiences in observation mode first.
- Do not start Display or Performance Max until conversion tracking has been QA'd and at least several weeks of inquiry quality data exists.

## Initial Budget Split

Use relative allocation until the account owner sets actual budgets:

- Brand Search: 20 percent
- Nakhon Hotel Search: 45 percent
- Room Intent Search: 30 percent
- Testing reserve: 5 percent

## Landing Page

Use:

- `https://www.sandboxhotel.com/`

Required final URL parameters:

- `utm_source=google`
- `utm_medium=cpc`
- `utm_campaign={campaignid}`
- `utm_term={keyword}`
- `utm_content={creative}`

Do not add guest identifiers or account secrets to URLs.

## Assets

Recommended assets:

- Call asset: hotel phone number, only if the account owner confirms call hours and call handling.
- Location asset: connect the verified Google Business Profile if available.
- Sitelinks: Rooms, Book Direct, Location, FAQ.
- Callouts: Direct booking, Spacious rooms, Quiet stay, Wi-Fi, Parking.
- Structured snippets: Amenities such as Wi-Fi, Parking, Air conditioning, Laundry, Coffee/snack bar.

## Guardrails

- Do not claim a fixed discount, guaranteed lowest market price, free cancellation, star rating, or specific review count unless the owner confirms it and the live source supports it.
- Do not use competitor names in ad copy without legal review.
- Do not run broad match until negative keywords and conversion tracking have proven stable.
- Do not optimize to all clicks; optimize to `booking_send_success` quality and owner-confirmed booking outcomes.
