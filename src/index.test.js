import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import worker, { handleInboundEmail } from "./index.js";

const homepageHtml = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");

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
  assert.match(homepageHtml, /en:\s*\{[\s\S]*?loc_title:\s*"Location & Contact"/);
  assert.match(homepageHtml, /zh:\s*\{[\s\S]*?loc_title:\s*"位置与联系"/);
  assert.match(homepageHtml, /data-lang="th"[^>]*aria-label="ภาษาไทย"[^>]*><span aria-hidden="true">🇹🇭<\/span><span class="sr-only">Thai<\/span><\/button>/);
  assert.match(homepageHtml, /data-lang="en"[^>]*aria-label="English"[^>]*><span aria-hidden="true">🇬🇧<\/span><span class="sr-only">English<\/span><\/button>/);
  assert.match(homepageHtml, /data-lang="zh"[^>]*aria-label="中文（简体）"[^>]*><span aria-hidden="true">🇨🇳<\/span><span class="sr-only">Chinese \(Simplified\)<\/span><\/button>/);
});
