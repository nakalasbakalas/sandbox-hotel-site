import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";

import worker, { handleInboundEmail } from "./index.js";

const homepageHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const homepageJs = [
  "../public/assets/js/components/device-detect.js",
  "../public/assets/js/components/gallery-carousel.js",
  "../public/assets/js/components/header-scroll.js",
  "../public/assets/js/home.js",
].map((path) => fs.readFileSync(new URL(path, import.meta.url), "utf8")).join("\n");
const analyticsJs = fs.readFileSync(new URL("../public/assets/js/analytics.js", import.meta.url), "utf8");
const homepageCss = [
  "../public/assets/css/home.css",
  "../public/assets/css/components/booking-form.css",
].map((path) => fs.readFileSync(new URL(path, import.meta.url), "utf8")).join("\n");

function createFakeDb({ duplicateLead = false } = {}) {
  let lastLeadId = 0;

  return {
    prepare(sql) {
      return {
        bind(...params) {
          return {
            async run() {
              if (sql.startsWith("INSERT INTO booking_leads")) {
                lastLeadId += 1;
                return { success: true, meta: { last_row_id: lastLeadId, params } };
              }
              throw new Error(`Unexpected run SQL: ${sql}`);
            },

            async first() {
              if (sql.includes("last_insert_rowid()")) {
                return { id: lastLeadId };
              }
              if (sql.includes("SELECT id FROM booking_leads")) {
                return duplicateLead ? { id: 999 } : null;
              }
              throw new Error(`Unexpected first SQL: ${sql}`);
            },
          };
        },
      };
    },
  };
}

test("handleInboundEmail forwards configured booking inbox messages", async () => {
  const calls = [];
  const message = {
    to: "booking@sandboxhotel.com",
    async forward(destination) {
      calls.push(destination);
    },
    setReject(reason) {
      calls.push({ reject: reason });
    },
  };

  const result = await handleInboundEmail(message, {
    BOOKING_EMAIL_FORWARD_TO: "desk@example.com",
  });

  assert.deepEqual(result, {
    ok: true,
    status: "forwarded",
    forwardTo: "desk@example.com",
  });
  assert.deepEqual(calls, ["desk@example.com"]);
});

test("booking ingest queues a Postmark acknowledgement when guest contact contains an email address", async () => {
  const originalFetch = globalThis.fetch;
  const outboundCalls = [];
  globalThis.fetch = async (url, init) => {
    outboundCalls.push({ url, init });
    return new Response(JSON.stringify({ Message: "OK" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  try {
    const tasks = [];
    const response = await worker.fetch(
      new Request("https://www.sandboxhotel.com/api/booking-ingest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          checkin: "2026-04-01",
          checkout: "2026-04-03",
          guests: "2",
          room: "Standard Twin",
          name: "Jamie Guest",
          contact: "jamie@example.com",
          notes: "Late arrival",
        }),
      }),
      {
        DB: createFakeDb(),
        POSTMARK_SERVER_TOKEN: "pm_test_token",
        BOOKING_FROM_EMAIL: "booking@sandboxhotel.com",
        BOOKING_REPLY_TO_EMAIL: "booking@sandboxhotel.com",
      },
      {
        waitUntil(promise) {
          tasks.push(promise);
        },
      },
    );

    const payload = await response.json();

    assert.equal(response.status, 201);
    assert.equal(payload.ok, true);
    assert.equal(payload.emailStatus, "queued");
    assert.equal(tasks.length, 1);

    await Promise.all(tasks);

    assert.equal(outboundCalls.length, 1);
    assert.equal(outboundCalls[0].url, "https://api.postmarkapp.com/email");

    const postmarkPayload = JSON.parse(outboundCalls[0].init.body);
    assert.equal(postmarkPayload.To, "jamie@example.com");
    assert.equal(postmarkPayload.From, "booking@sandboxhotel.com");
    assert.equal(postmarkPayload.ReplyTo, "booking@sandboxhotel.com");
    assert.match(postmarkPayload.TextBody, /Lead 1/);
    assert.match(postmarkPayload.TextBody, /Standard Twin/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("booking ingest skips the acknowledgement when contact details do not contain an email address", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("Outbound email should not be sent for phone-only contacts.");
  };

  try {
    const tasks = [];
    const response = await worker.fetch(
      new Request("https://www.sandboxhotel.com/api/booking-ingest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          checkin: "2026-04-01",
          checkout: "2026-04-03",
          guests: "2",
          contact: "+66 88 123 4567",
        }),
      }),
      {
        DB: createFakeDb(),
        POSTMARK_SERVER_TOKEN: "pm_test_token",
      },
      {
        waitUntil(promise) {
          tasks.push(promise);
        },
      },
    );

    const payload = await response.json();

    assert.equal(response.status, 201);
    assert.equal(payload.emailStatus, "skipped_no_email");
    assert.equal(tasks.length, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("homepage loads extracted homepage component assets before the core boot script", () => {
  const dom = new JSDOM(homepageHtml);
  const styles = [...dom.window.document.querySelectorAll('link[rel="stylesheet"]')].map((link) => link.getAttribute("href"));
  const scripts = [...dom.window.document.querySelectorAll('script[defer][src]')].map((script) => script.getAttribute("src"));

  assert.ok(styles.includes("assets/css/home.css"));
  assert.ok(styles.includes("assets/css/components/booking-form.css"));
  assert.ok(styles.indexOf("assets/css/home.css") < styles.indexOf("assets/css/components/booking-form.css"));

  assert.ok(scripts.includes("assets/js/components/device-detect.js"));
  assert.ok(scripts.includes("assets/js/components/gallery-carousel.js"));
  assert.ok(scripts.includes("assets/js/components/header-scroll.js"));
  assert.ok(scripts.indexOf("assets/js/components/device-detect.js") < scripts.indexOf("assets/js/home.js"));
  assert.ok(scripts.indexOf("assets/js/components/gallery-carousel.js") < scripts.indexOf("assets/js/home.js"));
  assert.ok(scripts.indexOf("assets/js/components/header-scroll.js") < scripts.indexOf("assets/js/home.js"));
});

test("homepage locale packs include translated location title and footer language buttons render flags only", () => {
  assert.match(homepageJs, /en:\s*\{[\s\S]*?loc_title:\s*"Location & Contact"/);
  assert.match(homepageJs, /zh:\s*\{[\s\S]*?loc_title:\s*"位置与联系"/);

  const dom = new JSDOM(homepageHtml);
  const footerButtons = [...dom.window.document.querySelectorAll(".footerLang .langBtn")];

  assert.equal(footerButtons.length, 3);
  assert.deepEqual(
    footerButtons.map((button) => ({
      lang: button.getAttribute("data-lang"),
      label: button.getAttribute("aria-label"),
      flag: button.querySelector('[aria-hidden="true"]')?.textContent,
      srOnly: button.querySelector(".sr-only")?.textContent,
      visibleText: button.textContent?.trim(),
    })),
    [
      { lang: "th", label: "ภาษาไทย", flag: "🇹🇭", srOnly: "Thai", visibleText: "🇹🇭Thai" },
      { lang: "en", label: "English", flag: "🇬🇧", srOnly: "English", visibleText: "🇬🇧English" },
      { lang: "zh", label: "中文（简体）", flag: "🇨🇳", srOnly: "Chinese (Simplified)", visibleText: "🇨🇳Chinese (Simplified)" },
    ],
  );
});

test("homepage above-the-fold promotes direct booking with clear CTAs, trust proof, and desktop language controls", () => {
  const dom = new JSDOM(homepageHtml);
  const { document } = dom.window;

  const navLangButtons = document.querySelectorAll(".navLangCluster .langBtn");
  assert.equal(navLangButtons.length, 3);
  assert.ok(document.querySelector(".navPrimaryCta[href='#book']"));
  assert.ok(document.querySelector(".navPanelLabel[data-i18n='nav_language']"));
  assert.ok(document.querySelector(".navPanel a[data-i18n='nav_call_hotel'][href='tel:+66885783478']"));
  assert.ok(document.querySelector(".navPanel a[data-i18n='nav_line_chat']"));

  const hero = document.querySelector(".hero");
  assert.ok(hero);
  assert.ok(hero?.querySelector(".heroCTA .btn.primary[href='#book'][data-i18n='cta_check_direct_rate']"));
  assert.ok(hero?.querySelector(".heroCTA .btn.secondary[href='tel:+66885783478'][data-i18n='cta_call_hotel']"));
  assert.ok(hero?.querySelector(".heroDirectNote[data-i18n='hero_direct_booking_benefit']"));
  assert.ok(hero?.querySelector(".heroReviewBadge[data-analytics='map']"));
  assert.equal(hero?.querySelectorAll(".heroProofList .heroProofItem").length, 3);
  assert.ok(document.querySelector(".trustStrip [data-i18n='trust_rooms']"));
});

test("homepage lower sections stay as standalone premium blocks instead of one shared grid", () => {
  const dom = new JSDOM(homepageHtml);
  const { document } = dom.window;

  assert.equal(document.querySelector(".sectionsGrid"), null);
  assert.ok(document.querySelector("#reviews .reviewSectionCard"));
  assert.ok(document.querySelector("#faq .faqSectionCard"));
  assert.ok(document.querySelector("#destination .destinationSectionCard"));
  assert.ok(document.querySelector("#location .locationSectionCard"));
  assert.ok(document.querySelector("#faq .faqCTAActions"));
});

test("homepage location section keeps the contact card and map side by side until phone widths", () => {
  const dom = new JSDOM(homepageHtml);
  const locationGrid = dom.window.document.querySelector("#location .locationGrid");

  assert.equal(locationGrid?.children.length, 2);
  assert.ok(locationGrid?.querySelector(".contactCard"));
  assert.ok(locationGrid?.querySelector(".mapWrap"));
  assert.match(
    homepageCss,
    /@media\s*\(\s*max-width\s*:\s*760px\s*\)\s*\{[\s\S]*?\.locationGrid\s*\{\s*grid-template-columns\s*:\s*1fr\s*;?\s*\}/,
  );
});

test("homepage reviews use the older review-card layout without trust summary widgets", () => {
  const dom = new JSDOM(homepageHtml);
  const { document } = dom.window;

  assert.equal(document.querySelector("#reviews .reviewTrust"), null);
  assert.equal(document.querySelector("#reviews .reviewSource"), null);
  assert.equal(document.querySelectorAll("#reviews .review").length, 5);
  assert.equal(document.querySelectorAll("#reviews .reviewsSide .review").length, 2);
  assert.equal(homepageJs.includes('trust_rating: "4.8"'), true);
  assert.equal(homepageJs.includes("trust_meta"), true);
  assert.equal(homepageJs.includes("btn_view_maps_short"), false);
});

test("homepage gallery uses the patch 1 image set with responsive sources", () => {
  const dom = new JSDOM(homepageHtml);
  const gallerySlides = [...dom.window.document.querySelectorAll("#gallery .galSlide")];
  const galleryImages = gallerySlides.map((slide) => slide.querySelector("img"));

  assert.equal(gallerySlides.length, 6);
  assert.deepEqual(
    galleryImages.map((img) => img?.getAttribute("src")),
    [
      "images/Sandbox-Hotel-Hero-Banner.png",
      "assets/images/gallery/entrance.png",
      "assets/images/gallery/lobby.png",
      "assets/images/gallery/evening-view.png",
      "assets/images/gallery/flower-view.png",
      "assets/images/gallery/staircase.png",
    ],
  );

  assert.match(galleryImages[3]?.getAttribute("srcset") ?? "", /evening-view-400\.png 400w, assets\/images\/gallery\/evening-view\.png 1536w/);
  assert.match(galleryImages[4]?.getAttribute("srcset") ?? "", /flower-view-400\.png 400w, assets\/images\/gallery\/flower-view\.png 1536w/);
  assert.match(galleryImages[5]?.getAttribute("srcset") ?? "", /staircase-400\.png 400w, assets\/images\/gallery\/staircase\.png 1536w/);
  assert.equal(dom.window.document.querySelector("#gallery [data-i18n='gal_evening_view_title']")?.textContent, "Evening Exterior");
  assert.equal(dom.window.document.querySelector("#gallery [data-i18n='gal_staircase_title']")?.textContent, "Staircase & Mural");
});

test("homepage runtime locale keys cover every i18n hook used in the HTML", () => {
  const htmlKeys = [...homepageHtml.matchAll(/data-i18n(?:-html|-ph)?="([^"]+)"/g)].map((match) => match[1]);
  const uniqueKeys = [...new Set(htmlKeys)];
  const missingKeys = uniqueKeys.filter((key) => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return !new RegExp(`[\\{,\\s]${escapedKey}\\s*:`, "m").test(homepageJs);
  });

  assert.deepEqual(missingKeys, []);
});

test("homepage booking actions validate the form before triggering outbound contact flows", () => {
  assert.match(homepageJs, /function validateBookingForm\(form\)/);
  assert.match(homepageJs, /form\?\.addEventListener\("submit", async \(e\)=>\{[\s\S]*?if\(!validateBookingForm\(form\)\) return;/);
  assert.match(homepageJs, /document\.getElementById\("sendWhatsApp"\)\?\.addEventListener\("click", async \(\)=>\{[\s\S]*?if\(!validateBookingForm\(form\)\) return;/);
  assert.match(homepageJs, /document\.getElementById\("sendEmail"\)\?\.addEventListener\("click", async \(\)=>\{[\s\S]*?if\(!validateBookingForm\(form\)\) return;/);
});

test("homepage booking section clearly explains the inquiry flow and offers multi-channel contact", () => {
  const dom = new JSDOM(homepageHtml);
  const { document } = dom.window;
  const bookingSection = document.querySelector("#book");

  assert.ok(bookingSection?.querySelector(".bookingJourneyList"));
  assert.equal(bookingSection?.querySelectorAll(".bookingJourneyList li").length, 3);
  assert.ok(bookingSection?.querySelector(".bookingBenefitList"));
  assert.ok(bookingSection?.querySelector("#sendWhatsApp[data-analytics='whatsapp']"));
  assert.ok(bookingSection?.querySelector("#formHint[role='status'][aria-live='polite']"));
  assert.ok(bookingSection?.querySelector("#contact[autocomplete='email'][aria-describedby*='contactHint']"));
  assert.ok(bookingSection?.querySelector("#checkin[aria-describedby*='checkinHint']"));
  assert.ok(bookingSection?.querySelector("#checkout[aria-describedby*='checkoutHint']"));
  assert.ok(document.querySelector("#stickyBottom .stickyBottomNote"));
});

test("homepage analytics includes dedicated sticky CTA and language switch tracking hooks", () => {
  assert.match(analyticsJs, /sticky_cta_click/);
  assert.match(analyticsJs, /language_switch/);
  assert.match(analyticsJs, /element\.closest\("#stickyBottom"\)/);
  assert.match(homepageJs, /window\.SandboxAnalytics\?\.trackEvent\("language_switch"/);
});
