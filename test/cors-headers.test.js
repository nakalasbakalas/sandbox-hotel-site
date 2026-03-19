import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index.js";
import { applySchema } from "./setup.js";

/*
 * CORS & Security Header tests (P2-03)
 *
 * Covers: allowed origins, OPTIONS handling, and security
 * headers on API and static asset paths.
 */

async function callWorker(path, options = {}) {
  const url = `https://www.sandboxhotel.com${path}`;
  const request = new Request(url, {
    method: options.method || "GET",
    headers: {
      origin: options.origin || "https://www.sandboxhotel.com",
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

describe("CORS & Security Headers", () => {
  beforeEach(async () => {
    await applySchema(env.DB);
  });

  // ── OPTIONS preflight ─────────────────────────────────

  it("responds 204 to OPTIONS preflight from allowed origin", async () => {
    const res = await callWorker("/api/login", {
      method: "OPTIONS",
      origin: "https://www.sandboxhotel.com",
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://www.sandboxhotel.com");
    expect(res.headers.get("access-control-allow-methods")).toContain("POST");
    expect(res.headers.get("access-control-allow-headers")).toContain("content-type");
  });

  it("responds 204 to OPTIONS from bare domain origin", async () => {
    const res = await callWorker("/api/login", {
      method: "OPTIONS",
      origin: "https://sandboxhotel.com",
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://sandboxhotel.com");
  });

  it("falls back to default origin for unknown origins in OPTIONS", async () => {
    const res = await callWorker("/api/login", {
      method: "OPTIONS",
      origin: "https://evil.com",
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("https://www.sandboxhotel.com");
  });

  // ── Security headers on OPTIONS ───────────────────────

  it("includes security headers on OPTIONS response", async () => {
    const res = await callWorker("/api/login", { method: "OPTIONS" });
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(res.headers.get("permissions-policy")).toBeTruthy();
  });

  // ── CORS headers on API responses ─────────────────────

  it("sets CORS headers on API JSON responses", async () => {
    const res = await callWorker("/api/bootstrap/status", {
      origin: "https://www.sandboxhotel.com",
    });
    expect(res.headers.get("access-control-allow-origin")).toBe("https://www.sandboxhotel.com");
    expect(res.headers.get("access-control-allow-methods")).toContain("GET");
  });

  it("defaults origin for API responses from unknown origin", async () => {
    const res = await callWorker("/api/bootstrap/status", {
      origin: "https://attacker.example",
    });
    expect(res.headers.get("access-control-allow-origin")).toBe("https://www.sandboxhotel.com");
  });

  // ── Security headers on API responses ─────────────────

  it("includes security headers on API responses", async () => {
    const res = await callWorker("/api/bootstrap/status");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(res.headers.get("permissions-policy")).toBeTruthy();
  });

  // ── Non-www redirect ──────────────────────────────────

  it("redirects bare domain to www with 308", async () => {
    const request = new Request("https://sandboxhotel.com/about", {
      method: "GET",
    });
    const ctx = createExecutionContext();
    const res = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://www.sandboxhotel.com/about");
  });

  // ── Error responses include security headers ──────────

  it("includes security headers on error responses", async () => {
    const res = await callWorker("/api/nonexistent-route", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "sandbox_pms_session=fake",
      },
    });
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
  });
});
