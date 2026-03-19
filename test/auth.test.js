import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index.js";
import { applySchema } from "./setup.js";

/*
 * Auth & session tests (P2-02)
 *
 * Covers: bootstrap status, bootstrap, login, logout,
 * unauthorized access, and session cookie behaviour.
 */

async function callWorker(path, options = {}) {
  const url = `https://www.sandboxhotel.com${path}`;
  const request = new Request(url, {
    method: options.method || "GET",
    headers: {
      "content-type": "application/json",
      origin: "https://www.sandboxhotel.com",
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

describe("Auth & Session", () => {
  beforeEach(async () => {
    await applySchema(env.DB);
  });

  // ── Bootstrap ─────────────────────────────────────────

  it("reports bootstrap needed when no users exist", async () => {
    const res = await callWorker("/api/bootstrap/status");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.needsBootstrap).toBe(true);
  });

  it("bootstraps successfully with valid credentials", async () => {
    const res = await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin", email: "admin@test.com", password: "password123" },
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.session).toBeDefined();
    expect(body.session.email).toBe("admin@test.com");
    expect(body.session.role).toBe("admin");

    // Should set session cookie
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toBeTruthy();
    expect(setCookie).toContain("sandbox_pms_session=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("Secure");
  });

  it("rejects duplicate bootstrap", async () => {
    await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin", email: "admin@test.com", password: "password123" },
    });
    const res = await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin2", email: "admin2@test.com", password: "pass456" },
    });
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects bootstrap with missing fields", async () => {
    const res = await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin" },
    });
    expect(res.status).toBe(400);
  });

  // ── Bootstrap creates initial data ────────────────────

  it("reports bootstrap not needed after successful bootstrap", async () => {
    await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin", email: "admin@test.com", password: "password123" },
    });
    const res = await callWorker("/api/bootstrap/status");
    const body = await res.json();
    expect(body.needsBootstrap).toBe(false);
  });

  // ── Login ─────────────────────────────────────────────

  it("logs in with valid credentials", async () => {
    await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin", email: "admin@test.com", password: "password123" },
    });
    const res = await callWorker("/api/login", {
      method: "POST",
      body: { email: "admin@test.com", password: "password123" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.session.email).toBe("admin@test.com");
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("sandbox_pms_session=");
  });

  it("rejects login with wrong password", async () => {
    await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin", email: "admin@test.com", password: "password123" },
    });
    const res = await callWorker("/api/login", {
      method: "POST",
      body: { email: "admin@test.com", password: "wrong" },
    });
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects login with unknown email", async () => {
    await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin", email: "admin@test.com", password: "password123" },
    });
    const res = await callWorker("/api/login", {
      method: "POST",
      body: { email: "unknown@test.com", password: "password123" },
    });
    expect(res.status).toBe(401);
  });

  it("rejects login with missing fields", async () => {
    const res = await callWorker("/api/login", {
      method: "POST",
      body: { email: "a@b.com" },
    });
    expect(res.status).toBe(400);
  });

  // ── Logout ────────────────────────────────────────────

  it("returns ok and clears cookie on logout", async () => {
    const res = await callWorker("/api/logout", { method: "POST" });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("Max-Age=0");
  });

  // ── Unauthorized access ───────────────────────────────

  it("rejects unauthenticated access to protected endpoints", async () => {
    const res = await callWorker("/api/session");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it("rejects requests with invalid session token", async () => {
    const res = await callWorker("/api/session", {
      headers: { cookie: "sandbox_pms_session=invalidtoken123" },
    });
    expect(res.status).toBe(401);
  });

  // ── Authenticated session ─────────────────────────────

  it("returns session info when authenticated", async () => {
    const bootstrapRes = await callWorker("/api/bootstrap", {
      method: "POST",
      body: { name: "Admin", email: "admin@test.com", password: "password123" },
    });
    const cookie = bootstrapRes.headers.get("set-cookie").split(";")[0];
    const res = await callWorker("/api/session", {
      headers: { cookie },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.session.email).toBe("admin@test.com");
    expect(body.session.role).toBe("admin");
  });
});
