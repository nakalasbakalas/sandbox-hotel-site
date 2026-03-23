import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";

import worker, { handleInboundEmail } from "./index.js";

const homepageHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const homepageJs = fs.readFileSync(new URL("../public/assets/js/home.js", import.meta.url), "utf8");

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
