import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index.js";
import { applySchema } from "./setup.js";

/*
 * Housekeeping, settings, and reporting smoke tests (P2-05)
 *
 * Covers representative role-gated endpoints and expected
 * response shape for operational modules.
 */

let sessionCookie = "";

async function callWorker(path, options = {}) {
  const url = `https://www.sandboxhotel.com${path}`;
  const request = new Request(url, {
    method: options.method || "GET",
    headers: {
      "content-type": "application/json",
      origin: "https://www.sandboxhotel.com",
      ...(options.cookie ? { cookie: options.cookie } : {}),
      ...(options.headers || {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

async function bootstrapAndLogin() {
  const res = await callWorker("/api/bootstrap", {
    method: "POST",
    body: { name: "Admin", email: "admin@test.com", password: "password123" },
  });
  sessionCookie = res.headers.get("set-cookie").split(";")[0];
}

describe("Housekeeping, Settings & Reporting", () => {
  beforeEach(async () => {
    await applySchema(env.DB);
    await bootstrapAndLogin();
  });

  // ── Dashboard ─────────────────────────────────────────

  it("returns dashboard data for authenticated user", async () => {
    const res = await callWorker("/api/dashboard", { cookie: sessionCookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.dashboard).toBeDefined();
    expect(typeof body.dashboard.arrivals).toBe("number");
    expect(typeof body.dashboard.departures).toBe("number");
    expect(typeof body.dashboard.occupied).toBe("number");
    expect(typeof body.dashboard.dirtyRooms).toBe("number");
    expect(typeof body.dashboard.pendingLeads).toBe("number");
    expect(typeof body.dashboard.revenueToday).toBe("number");
  });

  it("rejects dashboard without auth", async () => {
    const res = await callWorker("/api/dashboard");
    expect(res.status).toBe(401);
  });

  // ── Settings ──────────────────────────────────────────

  it("gets property settings", async () => {
    const res = await callWorker("/api/settings", { cookie: sessionCookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.settings).toBeDefined();
    expect(body.settings.name).toBe("Sandbox Hotel");
    expect(body.settings.currency).toBe("THB");
  });

  it("updates property settings (admin role)", async () => {
    const res = await callWorker("/api/settings", {
      method: "PUT",
      cookie: sessionCookie,
      body: {
        name: "Updated Hotel",
        timezone: "Asia/Bangkok",
        checkin_time: "15:00",
        checkout_time: "12:00",
        tax_rate: 10,
        contact_phone: "+66801111111",
        contact_email: "hotel@example.com",
        line_id: "test_line",
      },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.settings.name).toBe("Updated Hotel");
    expect(body.settings.checkin_time).toBe("15:00");
  });

  // ── Room types ────────────────────────────────────────

  it("lists room types", async () => {
    const res = await callWorker("/api/room-types", { cookie: sessionCookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.roomTypes.length).toBeGreaterThan(0);
    expect(body.roomTypes[0].code).toBeDefined();
  });

  // ── Rooms ─────────────────────────────────────────────

  it("lists rooms with type info", async () => {
    const res = await callWorker("/api/rooms", { cookie: sessionCookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.rooms.length).toBeGreaterThan(0);
    expect(body.rooms[0].room_number).toBeDefined();
    expect(body.rooms[0].room_type_name).toBeDefined();
  });

  it("updates room status", async () => {
    const roomsRes = await callWorker("/api/rooms", { cookie: sessionCookie });
    const { rooms } = await roomsRes.json();
    const room = rooms[0];

    const res = await callWorker("/api/rooms/status", {
      method: "POST",
      cookie: sessionCookie,
      body: { room_id: room.id, status: "vacant_dirty" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
  });

  // ── Housekeeping tasks ────────────────────────────────

  it("lists housekeeping tasks", async () => {
    const res = await callWorker("/api/housekeeping/tasks", { cookie: sessionCookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.tasks)).toBe(true);
  });

  it("updates housekeeping task status after checkout", async () => {
    // Create a reservation, check in, check out to generate a task
    const roomsRes = await callWorker("/api/rooms", { cookie: sessionCookie });
    const { rooms } = await roomsRes.json();

    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: {
        guest_name: "HK Guest",
        checkin_date: "2026-04-20",
        checkout_date: "2026-04-22",
        room_id: rooms[0].id,
      },
    });
    const { reservation } = await createRes.json();

    await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "confirm" },
    });
    await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "check_in" },
    });
    await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "check_out" },
    });

    // Now list housekeeping tasks — should have the departure clean
    const tasksRes = await callWorker("/api/housekeeping/tasks", { cookie: sessionCookie });
    const { tasks } = await tasksRes.json();
    expect(tasks.length).toBeGreaterThan(0);

    const openTask = tasks.find((t) => t.status === "open");
    expect(openTask).toBeDefined();

    // Complete the task
    const updateRes = await callWorker(`/api/housekeeping/tasks/${openTask.id}/status`, {
      method: "POST",
      cookie: sessionCookie,
      body: { status: "done" },
    });
    expect(updateRes.status).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.ok).toBe(true);
  });

  // ── Daily report ──────────────────────────────────────

  it("returns daily report for admin", async () => {
    const res = await callWorker("/api/reports/daily?date=2026-04-01", {
      cookie: sessionCookie,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.report).toBeDefined();
    expect(typeof body.report.occupancy).toBe("number");
    expect(typeof body.report.payments).toBe("number");
    expect(Array.isArray(body.report.statusBreakdown)).toBe(true);
  });

  // ── Audit log ─────────────────────────────────────────

  it("returns audit events for admin", async () => {
    const res = await callWorker("/api/audit", { cookie: sessionCookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.events)).toBe(true);
    expect(body.events.length).toBeGreaterThan(0); // bootstrap creates audit
  });

  // ── Folio operations ──────────────────────────────────

  it("adds folio line and payment to a reservation", async () => {
    // Create a reservation
    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: {
        guest_name: "Folio Guest",
        checkin_date: "2026-04-25",
        checkout_date: "2026-04-27",
        nightly_rate: 1200,
      },
    });
    const { reservation } = await createRes.json();
    const folioId = reservation.folio?.id;
    expect(folioId).toBeTruthy();

    // Add a line item
    const lineRes = await callWorker(`/api/folios/${folioId}/lines`, {
      method: "POST",
      cookie: sessionCookie,
      body: {
        line_type: "extra_charge",
        description: "Minibar",
        amount: 350,
        quantity: 1,
      },
    });
    expect(lineRes.status).toBe(201);
    const lineBody = await lineRes.json();
    expect(lineBody.folio.lines.length).toBeGreaterThan(1);

    // Add a payment
    const payRes = await callWorker(`/api/folios/${folioId}/payments`, {
      method: "POST",
      cookie: sessionCookie,
      body: {
        payment_method: "cash",
        amount: 500,
        reference: "RCP-001",
      },
    });
    expect(payRes.status).toBe(201);
    const payBody = await payRes.json();
    expect(payBody.folio.payments.length).toBe(1);
    expect(payBody.folio.paid_amount).toBe(500);
  });

  // ── 404 for unknown API routes ────────────────────────

  it("returns 404 for unknown API route", async () => {
    const res = await callWorker("/api/not-a-route", {
      cookie: sessionCookie,
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });
});
