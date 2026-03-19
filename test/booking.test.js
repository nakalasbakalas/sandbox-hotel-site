import { env, createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index.js";
import { applySchema } from "./setup.js";

/*
 * Booking lead & reservation flow tests (P2-04)
 *
 * Covers: booking ingest, reservation creation, reservation
 * actions (confirm, check-in, check-out, cancel, no-show),
 * and validation failures.
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
  return sessionCookie;
}

describe("Booking & Reservation Flow", () => {
  beforeEach(async () => {
    await applySchema(env.DB);
    await bootstrapAndLogin();
  });

  // ── Booking lead ingest (public endpoint) ─────────────

  it("creates a booking lead from public form", async () => {
    const res = await callWorker("/api/booking-ingest", {
      method: "POST",
      body: {
        checkin: "2026-04-01",
        checkout: "2026-04-03",
        guests: 2,
        name: "Test Guest",
        contact: "+66801234567",
        notes: "Late arrival",
        room: "STD-DBL",
        source: "website",
      },
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.leadId).toBeGreaterThan(0);
  });

  it("rejects booking lead with missing required fields", async () => {
    const res = await callWorker("/api/booking-ingest", {
      method: "POST",
      body: { checkin: "2026-04-01" },
    });
    expect(res.status).toBe(400);
  });

  it("creates booking lead without auth", async () => {
    // booking-ingest is public — no cookie needed
    const res = await callWorker("/api/booking-ingest", {
      method: "POST",
      body: { checkin: "2026-04-01", checkout: "2026-04-03", guests: 1 },
    });
    expect(res.status).toBe(201);
  });

  // ── Booking lead listing (authenticated) ──────────────

  it("lists booking leads when authenticated", async () => {
    await callWorker("/api/booking-ingest", {
      method: "POST",
      body: { checkin: "2026-04-01", checkout: "2026-04-03", guests: 2, name: "A" },
    });
    const res = await callWorker("/api/booking-leads", { cookie: sessionCookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.leads.length).toBeGreaterThan(0);
  });

  // ── Reservation creation ──────────────────────────────

  it("creates a reservation directly", async () => {
    const res = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: {
        guest_name: "Direct Guest",
        checkin_date: "2026-04-05",
        checkout_date: "2026-04-07",
        guests: 2,
        nightly_rate: 1500,
      },
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.reservation).toBeDefined();
    expect(body.reservation.confirmation_code).toMatch(/^SBX-/);
    expect(body.reservation.guest_name).toBe("Direct Guest");
    expect(body.reservation.total_amount).toBe(3000);
  });

  it("rejects reservation with checkout before checkin", async () => {
    const res = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: {
        guest_name: "Bad Dates",
        checkin_date: "2026-04-07",
        checkout_date: "2026-04-05",
      },
    });
    expect(res.status).toBe(400);
  });

  it("rejects reservation without auth", async () => {
    const res = await callWorker("/api/reservations", {
      method: "POST",
      body: {
        guest_name: "Unauthorized",
        checkin_date: "2026-04-01",
        checkout_date: "2026-04-02",
      },
    });
    expect(res.status).toBe(401);
  });

  it("rejects reservation with missing guest_name", async () => {
    const res = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: {
        checkin_date: "2026-04-01",
        checkout_date: "2026-04-03",
      },
    });
    expect(res.status).toBe(400);
  });

  // ── Reservation listing ───────────────────────────────

  it("lists reservations when authenticated", async () => {
    await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: { guest_name: "X", checkin_date: "2026-04-01", checkout_date: "2026-04-02" },
    });
    const res = await callWorker("/api/reservations", { cookie: sessionCookie });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.reservations.length).toBeGreaterThan(0);
  });

  // ── Reservation detail ────────────────────────────────

  it("gets reservation details by id", async () => {
    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: { guest_name: "Detail Test", checkin_date: "2026-04-10", checkout_date: "2026-04-12" },
    });
    const { reservation } = await createRes.json();
    const res = await callWorker(`/api/reservations/${reservation.id}`, {
      cookie: sessionCookie,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reservation.id).toBe(reservation.id);
  });

  // ── Reservation actions ───────────────────────────────

  it("confirms a reservation", async () => {
    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: { guest_name: "Confirm Me", checkin_date: "2026-04-15", checkout_date: "2026-04-16" },
    });
    const { reservation } = await createRes.json();
    const res = await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "confirm" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reservation.status).toBe("confirmed");
  });

  it("cancels a reservation", async () => {
    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: { guest_name: "Cancel Me", checkin_date: "2026-04-15", checkout_date: "2026-04-16" },
    });
    const { reservation } = await createRes.json();
    const res = await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "cancel" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reservation.status).toBe("cancelled");
  });

  it("marks reservation as no_show", async () => {
    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: { guest_name: "No Show", checkin_date: "2026-04-15", checkout_date: "2026-04-16" },
    });
    const { reservation } = await createRes.json();
    const res = await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "no_show" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reservation.status).toBe("no_show");
  });

  it("rejects unsupported reservation action", async () => {
    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: { guest_name: "Bad Action", checkin_date: "2026-04-15", checkout_date: "2026-04-16" },
    });
    const { reservation } = await createRes.json();
    const res = await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "fly_away" },
    });
    expect(res.status).toBe(400);
  });

  it("checks in a reservation with assigned room", async () => {
    // Get a room from bootstrap
    const roomsRes = await callWorker("/api/rooms", { cookie: sessionCookie });
    const { rooms } = await roomsRes.json();
    const room = rooms[0];

    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: {
        guest_name: "Check In Guest",
        checkin_date: "2026-04-20",
        checkout_date: "2026-04-22",
        room_id: room.id,
      },
    });
    const { reservation } = await createRes.json();

    // Confirm first
    await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "confirm" },
    });

    // Check in
    const res = await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "check_in" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.reservation.status).toBe("checked_in");
  });

  it("rejects check-in without assigned room", async () => {
    const createRes = await callWorker("/api/reservations", {
      method: "POST",
      cookie: sessionCookie,
      body: { guest_name: "No Room", checkin_date: "2026-04-20", checkout_date: "2026-04-22" },
    });
    const { reservation } = await createRes.json();
    const res = await callWorker(`/api/reservations/${reservation.id}/action`, {
      method: "POST",
      cookie: sessionCookie,
      body: { action: "check_in" },
    });
    expect(res.status).toBe(400);
  });

  // ── Lead conversion ───────────────────────────────────

  it("converts a booking lead to a reservation", async () => {
    // Create a lead first
    const leadRes = await callWorker("/api/booking-ingest", {
      method: "POST",
      body: {
        checkin: "2026-05-01",
        checkout: "2026-05-03",
        guests: 2,
        name: "Lead Guest",
        contact: "+66891234567",
      },
    });
    const { leadId } = await leadRes.json();

    const res = await callWorker("/api/booking-leads/convert", {
      method: "POST",
      cookie: sessionCookie,
      body: { lead_id: leadId, nightly_rate: 1300 },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.reservation).toBeDefined();
    expect(body.reservation.confirmation_code).toMatch(/^SBX-/);
  });

  // ── Calendar ──────────────────────────────────────────

  it("retrieves the calendar view", async () => {
    const res = await callWorker("/api/calendar?start=2026-04-01&days=7", {
      cookie: sessionCookie,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.rooms).toBeDefined();
    expect(body.days).toBe(7);
  });
});
