
const COOKIE_NAME = "sandbox_pms_session";
const HOTEL_TIMEZONE = "Asia/Bangkok";
const DAY_MS = 86400000;

const JSON_HEADERS = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "no-store",
};

const ALLOWED_ORIGINS = new Set(["https://www.sandboxhotel.com", "https://sandboxhotel.com"]);

const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "SAMEORIGIN",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=()",
};

const DEFAULT_BOOKING_FROM_EMAIL = "booking@sandboxhotel.com";
const DEFAULT_ALLOWED_EMAIL_LOCAL_PARTS = ["booking", "reservations"];
const DEFAULT_POSTMARK_API_BASE = "https://api.postmarkapp.com";
const DEFAULT_POSTMARK_MESSAGE_STREAM = "outbound";
const DEFAULT_BOOKING_ACK_SUBJECT = "Sandbox Hotel booking request received";
const BOOKING_EMAIL_DEDUPE_WINDOW_MS = 10 * 60 * 1000;

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      if (url.hostname.toLowerCase() === "sandboxhotel.com") {
        url.hostname = "www.sandboxhotel.com";
        return Response.redirect(url.toString(), 308);
      }

      if (request.method === "OPTIONS") {
        const origin = request.headers.get("origin") || "";
        const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://www.sandboxhotel.com";
        return new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": allowedOrigin,
            "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
            "access-control-allow-headers": "content-type",
            ...SECURITY_HEADERS,
          },
        });
      }

      if (url.pathname === "/admin") {
        return fetchAsset(new Request(new URL("/admin/index.html", url), request), env, url);
      }
      if (!url.pathname.startsWith("/api/")) {
        return fetchAsset(request, env, url);
      }

      const response = await routeRequest(request, env, ctx);
      return withCors(response, request.headers.get("origin") || "");
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      const message = error instanceof HttpError ? error.message : "Internal server error";
      return withCors(json({ ok: false, error: message }, status), request.headers.get("origin") || "");
    }
  },

  async email(message, env) {
    try {
      await handleInboundEmail(message, env);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Inbound email handling failed", error);
      message.setReject("Temporary email processing failure.");
    }
  },
};

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function fetchAsset(request, env, baseUrl) {
  try {
    const assetResponse = await env.ASSETS.fetch(request);
    return addSecurityHeaders(assetResponse);
  } catch {
    const notFoundUrl = new URL("/404", baseUrl);
    try {
      const notFoundResponse = await env.ASSETS.fetch(new Request(notFoundUrl, request));
      return addSecurityHeaders(new Response(notFoundResponse.body, {
        status: 404,
        headers: notFoundResponse.headers,
      }));
    } catch {
      return new Response("Not found", { status: 404 });
    }
  }
}

async function routeRequest(request, env, ctx) {
  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname === "/api/bootstrap/status" && request.method === "GET") {
    const count = await scalar(env.DB, "SELECT COUNT(*) AS count FROM staff_users");
    return json({ ok: true, needsBootstrap: Number(count) === 0 });
  }

  if (pathname === "/api/bootstrap" && request.method === "POST") {
    return bootstrap(request, env);
  }

  if (pathname === "/api/login" && request.method === "POST") {
    return login(request, env);
  }

  if (pathname === "/api/logout" && request.method === "POST") {
    return json({ ok: true }, 200, {
      "set-cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    });
  }

  if (pathname === "/api/booking-ingest" && request.method === "POST") {
    return ingestBookingLead(request, env, null, ctx);
  }

  const session = await requireSession(request, env);

  if (pathname === "/api/session" && request.method === "GET") {
    return json({ ok: true, session });
  }

  if (pathname === "/api/dashboard" && request.method === "GET") {
    return json({ ok: true, dashboard: await getDashboard(env.DB) });
  }

  if (pathname === "/api/settings" && request.method === "GET") {
    return json({ ok: true, settings: await getSettings(env.DB) });
  }

  if (pathname === "/api/settings" && request.method === "PUT") {
    requireRole(session, ["admin", "manager"]);
    return saveSettings(request, env.DB, session);
  }

  if (pathname === "/api/room-types" && request.method === "GET") {
    return json({ ok: true, roomTypes: await all(env.DB, "SELECT * FROM room_types ORDER BY sort_order, id") });
  }

  if (pathname === "/api/rooms" && request.method === "GET") {
    return json({
      ok: true,
      rooms: await all(env.DB, "SELECT rooms.*, room_types.name AS room_type_name FROM rooms JOIN room_types ON room_types.id = rooms.room_type_id ORDER BY rooms.room_number"),
    });
  }

  if (pathname === "/api/rooms/status" && request.method === "POST") {
    requireRole(session, ["admin", "manager", "front_desk", "housekeeping"]);
    return updateRoomStatus(request, env.DB, session);
  }

  if (pathname === "/api/booking-leads" && request.method === "GET") {
    return json({ ok: true, leads: await listLeads(env.DB) });
  }

  if (pathname === "/api/booking-leads/convert" && request.method === "POST") {
    requireRole(session, ["admin", "manager", "front_desk"]);
    return convertLead(request, env.DB, session);
  }

  if (pathname === "/api/reservations" && request.method === "GET") {
    return json({ ok: true, reservations: await listReservations(env.DB, { status: url.searchParams.get("status"), date: url.searchParams.get("date") }) });
  }

  if (pathname === "/api/reservations" && request.method === "POST") {
    requireRole(session, ["admin", "manager", "front_desk"]);
    return createReservation(request, env.DB, session);
  }

  if (pathname === "/api/calendar" && request.method === "GET") {
    const start = url.searchParams.get("start") || todayIso();
    const days = Number(url.searchParams.get("days") || 7);
    return json({ ok: true, ...(await getCalendar(env.DB, start, days)) });
  }

  const reservationActionMatch = pathname.match(/^\/api\/reservations\/(\d+)\/action$/);
  if (reservationActionMatch && request.method === "POST") {
    requireRole(session, ["admin", "manager", "front_desk"]);
    return reservationAction(request, env.DB, session, Number(reservationActionMatch[1]));
  }

  const reservationMatch = pathname.match(/^\/api\/reservations\/(\d+)$/);
  if (reservationMatch && request.method === "GET") {
    return json({ ok: true, reservation: await reservationDetails(env.DB, Number(reservationMatch[1])) });
  }

  const folioMatch = pathname.match(/^\/api\/folios\/reservation\/(\d+)$/);
  if (folioMatch && request.method === "GET") {
    requireRole(session, ["admin", "manager", "front_desk"]);
    return json({ ok: true, folio: await getFolioByReservation(env.DB, Number(folioMatch[1])) });
  }

  const folioLineMatch = pathname.match(/^\/api\/folios\/(\d+)\/lines$/);
  if (folioLineMatch && request.method === "POST") {
    requireRole(session, ["admin", "manager", "front_desk"]);
    return addFolioLine(request, env.DB, session, Number(folioLineMatch[1]));
  }

  const folioPaymentMatch = pathname.match(/^\/api\/folios\/(\d+)\/payments$/);
  if (folioPaymentMatch && request.method === "POST") {
    requireRole(session, ["admin", "manager", "front_desk"]);
    return addPayment(request, env.DB, session, Number(folioPaymentMatch[1]));
  }

  if (pathname === "/api/housekeeping/tasks" && request.method === "GET") {
    return json({ ok: true, tasks: await listHousekeepingTasks(env.DB) });
  }

  const housekeepingTaskMatch = pathname.match(/^\/api\/housekeeping\/tasks\/(\d+)\/status$/);
  if (housekeepingTaskMatch && request.method === "POST") {
    requireRole(session, ["admin", "manager", "front_desk", "housekeeping"]);
    return updateHousekeepingTask(request, env.DB, session, Number(housekeepingTaskMatch[1]));
  }

  if (pathname === "/api/reports/daily" && request.method === "GET") {
    requireRole(session, ["admin", "manager"]);
    return json({ ok: true, report: await dailyReport(env.DB, url.searchParams.get("date") || todayIso()) });
  }

  if (pathname === "/api/audit" && request.method === "GET") {
    requireRole(session, ["admin", "manager"]);
    return json({ ok: true, events: await all(env.DB, "SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 100") });
  }

  throw new HttpError(404, "Route not found");
}

function json(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload, null, 2), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function withCors(response, requestOrigin = "") {
  const headers = new Headers(response.headers);
  const allowedOrigin = ALLOWED_ORIGINS.has(requestOrigin) ? requestOrigin : "https://www.sandboxhotel.com";
  headers.set("access-control-allow-origin", allowedOrigin);
  headers.set("access-control-allow-methods", "GET,POST,PUT,OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, headers });
}

function addSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, headers });
}

async function parseJson(request) {
  try {
    return await request.json();
  } catch {
    throw new HttpError(400, "Invalid JSON payload");
  }
}

function requireFields(payload, fields) {
  for (const field of fields) {
    if (!String(payload[field] ?? "").trim()) {
      throw new HttpError(400, `Missing field: ${field}`);
    }
  }
}

function requireRole(session, roles) {
  if (!roles.includes(session.role)) throw new HttpError(403, "Forbidden");
}

async function bootstrap(request, env) {
  const userCount = Number(await scalar(env.DB, "SELECT COUNT(*) AS count FROM staff_users"));
  if (userCount > 0) throw new HttpError(409, "Bootstrap already completed");

  const payload = await parseJson(request);
  requireFields(payload, ["name", "email", "password"]);
  const now = isoNow();
  const passwordHash = await hashPassword(payload.password);

  await env.DB.batch([
    env.DB.prepare("INSERT INTO properties (id, name, timezone, default_language, secondary_language, checkin_time, checkout_time, tax_rate, service_fee_rate, currency, created_at, updated_at) VALUES (1, ?, ?, 'th', 'en', '14:00', '11:00', 7, 0, 'THB', ?, ?)").bind("Sandbox Hotel", HOTEL_TIMEZONE, now, now),
    env.DB.prepare("INSERT INTO property_settings (property_id, contact_phone, contact_email, line_id, whatsapp_number, address, notes, created_at, updated_at) VALUES (1, '', '', '', '', '', '', ?, ?)").bind(now, now),
    env.DB.prepare("INSERT INTO staff_users (property_id, name, email, password_hash, role, preferred_language, is_active, created_at, updated_at) VALUES (1, ?, ?, ?, 'admin', 'th', 1, ?, ?)").bind(payload.name.trim(), payload.email.trim().toLowerCase(), passwordHash, now, now),
    env.DB.prepare("INSERT INTO room_types (property_id, code, name, description, max_guests, base_rate, sort_order, created_at, updated_at) VALUES (1, 'STD-DBL', 'Standard Double', 'Large room with one double bed', 2, 1200, 1, ?, ?)").bind(now, now),
    env.DB.prepare("INSERT INTO room_types (property_id, code, name, description, max_guests, base_rate, sort_order, created_at, updated_at) VALUES (1, 'STD-TWN', 'Standard Twin', 'Large room with two twin beds', 2, 1200, 2, ?, ?)").bind(now, now),
    env.DB.prepare("INSERT INTO rate_plans (property_id, code, name, description, pricing_mode, created_at, updated_at) VALUES (1, 'BAR', 'Best Available Rate', 'Default direct booking rate', 'base', ?, ?)").bind(now, now),
  ]);

  const roomTypes = await all(env.DB, "SELECT id, code FROM room_types ORDER BY id");
  const rooms = [["101", "STD-DBL"], ["102", "STD-DBL"], ["103", "STD-DBL"], ["104", "STD-DBL"], ["105", "STD-DBL"], ["201", "STD-TWN"], ["202", "STD-TWN"], ["203", "STD-TWN"], ["204", "STD-TWN"], ["205", "STD-TWN"]];
  await env.DB.batch(rooms.map(([roomNumber, code]) => {
    const roomType = roomTypes.find((item) => item.code === code);
    return env.DB.prepare("INSERT INTO rooms (property_id, room_type_id, room_number, floor_label, status, housekeeping_status, notes, created_at, updated_at) VALUES (1, ?, ?, ?, 'vacant_clean', 'clean', '', ?, ?)").bind(roomType.id, roomNumber, roomNumber.startsWith("1") ? "1" : "2", now, now);
  }));

  const session = await createSession(env.DB, 1);
  await insertAudit(env.DB, 1, 1, "bootstrap_completed", "staff_user", 1, "Initial PMS bootstrap completed");
  return json({ ok: true, session: { userId: 1, propertyId: 1, name: payload.name.trim(), email: payload.email.trim().toLowerCase(), role: "admin", preferredLanguage: "th" } }, 201, { "set-cookie": buildSessionCookie(session.token, session.expiresAt) });
}

async function login(request, env) {
  const payload = await parseJson(request);
  requireFields(payload, ["email", "password"]);
  const user = await first(env.DB, "SELECT * FROM staff_users WHERE email = ? AND is_active = 1 LIMIT 1", payload.email.trim().toLowerCase());
  if (!user || !(await verifyPassword(payload.password, user.password_hash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  const session = await createSession(env.DB, user.id);
  await insertAudit(env.DB, user.property_id, user.id, "login", "staff_user", user.id, "Staff user logged in");
  return json({ ok: true, session: sanitizeUser(user) }, 200, { "set-cookie": buildSessionCookie(session.token, session.expiresAt) });
}

async function requireSession(request, env) {
  const token = readCookie(request.headers.get("cookie") || "", COOKIE_NAME);
  if (!token) throw new HttpError(401, "Authentication required");
  const session = await first(env.DB, `SELECT sessions.*, staff_users.name, staff_users.email, staff_users.role, staff_users.preferred_language FROM sessions JOIN staff_users ON staff_users.id = sessions.staff_user_id WHERE sessions.token = ? AND sessions.expires_at > ? LIMIT 1`, token, isoNow());
  if (!session) throw new HttpError(401, "Session expired");
  return { userId: session.staff_user_id, propertyId: session.property_id, name: session.name, email: session.email, role: session.role, preferredLanguage: session.preferred_language };
}

async function createSession(db, staffUserId) {
  const token = createToken();
  const user = await first(db, "SELECT property_id FROM staff_users WHERE id = ? LIMIT 1", staffUserId);
  const expiresAt = new Date(Date.now() + 7 * DAY_MS).toISOString();
  await db.prepare("INSERT INTO sessions (property_id, staff_user_id, token, created_at, expires_at) VALUES (?, ?, ?, ?, ?)").bind(user.property_id, staffUserId, token, isoNow(), expiresAt).run();
  return { token, expiresAt };
}

async function getDashboard(db) {
  const today = todayIso();
  const tomorrow = addDays(today, 1);
  const [arrivals, departures, occupied, dirtyRooms, pendingLeads, payments] = await Promise.all([
    scalar(db, "SELECT COUNT(*) AS count FROM reservations WHERE status IN ('confirmed','checked_in') AND checkin_date = ?", today),
    scalar(db, "SELECT COUNT(*) AS count FROM reservations WHERE status = 'checked_in' AND checkout_date = ?", today),
    scalar(db, "SELECT COUNT(*) AS count FROM reservations WHERE status = 'checked_in'"),
    scalar(db, "SELECT COUNT(*) AS count FROM rooms WHERE status IN ('vacant_dirty','occupied_dirty','inspection')"),
    scalar(db, "SELECT COUNT(*) AS count FROM booking_leads WHERE status = 'new'"),
    scalar(db, "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE payment_date >= ? AND payment_date < ?", `${today}T00:00:00.000Z`, `${tomorrow}T00:00:00.000Z`),
  ]);
  return { arrivals: Number(arrivals || 0), departures: Number(departures || 0), occupied: Number(occupied || 0), dirtyRooms: Number(dirtyRooms || 0), pendingLeads: Number(pendingLeads || 0), revenueToday: Number(payments || 0) };
}

async function getSettings(db) {
  const property = await first(db, "SELECT * FROM properties WHERE id = 1");
  const details = await first(db, "SELECT * FROM property_settings WHERE property_id = 1");
  return { ...property, ...details };
}

async function saveSettings(request, db, session) {
  const payload = await parseJson(request);
  const now = isoNow();
  await db.batch([
    db.prepare("UPDATE properties SET name = ?, timezone = ?, checkin_time = ?, checkout_time = ?, tax_rate = ?, service_fee_rate = ?, currency = ?, updated_at = ? WHERE id = 1").bind(payload.name || "Sandbox Hotel", payload.timezone || HOTEL_TIMEZONE, payload.checkin_time || "14:00", payload.checkout_time || "11:00", Number(payload.tax_rate || 0), Number(payload.service_fee_rate || 0), payload.currency || "THB", now),
    db.prepare("UPDATE property_settings SET contact_phone = ?, contact_email = ?, line_id = ?, whatsapp_number = ?, notes = ?, updated_at = ? WHERE property_id = 1").bind(payload.contact_phone || "", payload.contact_email || "", payload.line_id || "", payload.whatsapp_number || "", payload.notes || "", now),
  ]);
  await insertAudit(db, session.propertyId, session.userId, "settings_updated", "property", 1, "Property settings updated");
  return json({ ok: true, settings: await getSettings(db) });
}

async function ingestBookingLead(request, env, session, ctx) {
  const db = env.DB;
  const payload = await parseJson(request);
  requireFields(payload, ["checkin", "checkout", "guests"]);
  const now = isoNow();
  await db.prepare(`INSERT INTO booking_leads (property_id, source, status, guest_name, guest_contact, guest_notes, requested_room_type, guests, checkin_date, checkout_date, raw_payload, created_at, updated_at) VALUES (1, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(payload.source || "website", payload.name || "", payload.contact || "", payload.notes || "", payload.room || "", Number(payload.guests || 1), payload.checkin, payload.checkout, JSON.stringify(payload), now, now).run();
  const leadId = Number((await first(db, "SELECT last_insert_rowid() AS id")).id);
  const lead = {
    id: leadId,
    source: payload.source || "website",
    guestName: payload.name || "",
    guestContact: payload.contact || "",
    guestNotes: payload.notes || "",
    requestedRoomType: payload.room || "",
    guests: Number(payload.guests || 1),
    checkinDate: payload.checkin,
    checkoutDate: payload.checkout,
    createdAt: now,
  };
  const emailStatus = await maybeQueueBookingLeadAcknowledgement(db, env, lead, ctx);
  if (session) {
    await insertAudit(db, session.propertyId, session.userId, "booking_lead_created", "booking_lead", leadId, "Lead created");
  }
  return json({ ok: true, leadId, emailStatus }, 201);
}

export async function handleInboundEmail(message, env) {
  const recipient = normalizeEmailAddress(message.to);
  const localPart = recipient.split("@")[0]?.split("+")[0] || "";
  const allowedLocalParts = getAllowedEmailLocalParts(env);
  if (allowedLocalParts.length > 0 && !allowedLocalParts.includes(localPart)) {
    message.setReject("Recipient is not configured for this mailbox.");
    return { ok: false, status: "rejected_recipient" };
  }

  const forwardTo = normalizeEmailAddress(env.BOOKING_EMAIL_FORWARD_TO || "");
  if (!forwardTo) {
    message.setReject("Mailbox forwarding is not configured.");
    return { ok: false, status: "rejected_not_configured" };
  }

  await message.forward(forwardTo);
  return { ok: true, status: "forwarded", forwardTo };
}

async function maybeQueueBookingLeadAcknowledgement(db, env, lead, ctx) {
  const guestEmail = extractEmailAddress(lead.guestContact);
  if (!guestEmail) return "skipped_no_email";
  if (!String(env.POSTMARK_SERVER_TOKEN || "").trim()) return "skipped_not_configured";
  if (await hasRecentDuplicateBookingLead(db, lead)) return "skipped_duplicate";

  const task = sendBookingLeadAcknowledgement(env, { ...lead, guestEmail });
  if (ctx && typeof ctx.waitUntil === "function") {
    ctx.waitUntil(
      task.catch((error) => {
        // eslint-disable-next-line no-console
        console.error(`Booking acknowledgement failed for lead ${lead.id}`, error);
      }),
    );
    return "queued";
  }

  try {
    await task;
    return "sent";
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Booking acknowledgement failed for lead ${lead.id}`, error);
    return "failed";
  }
}

async function hasRecentDuplicateBookingLead(db, lead) {
  const cutoff = new Date(Date.parse(lead.createdAt) - BOOKING_EMAIL_DEDUPE_WINDOW_MS).toISOString();
  const duplicate = await first(
    db,
    `SELECT id FROM booking_leads
     WHERE id != ?
       AND created_at >= ?
       AND LOWER(TRIM(COALESCE(guest_contact, ''))) = ?
       AND checkin_date = ?
       AND checkout_date = ?
       AND guests = ?
       AND LOWER(TRIM(COALESCE(requested_room_type, ''))) = ?
       AND LOWER(TRIM(COALESCE(guest_name, ''))) = ?
     ORDER BY created_at DESC
     LIMIT 1`,
    lead.id,
    cutoff,
    normalizeComparableText(lead.guestContact),
    lead.checkinDate,
    lead.checkoutDate,
    lead.guests,
    normalizeComparableText(lead.requestedRoomType),
    normalizeComparableText(lead.guestName),
  );
  return Boolean(duplicate);
}

export async function sendBookingLeadAcknowledgement(env, lead) {
  const fromEmail = normalizeEmailAddress(env.BOOKING_FROM_EMAIL || DEFAULT_BOOKING_FROM_EMAIL) || DEFAULT_BOOKING_FROM_EMAIL;
  const replyToEmail = normalizeEmailAddress(env.BOOKING_REPLY_TO_EMAIL || fromEmail) || fromEmail;
  const payload = {
    From: fromEmail,
    To: lead.guestEmail,
    Subject: String(env.BOOKING_ACK_SUBJECT || DEFAULT_BOOKING_ACK_SUBJECT).trim() || DEFAULT_BOOKING_ACK_SUBJECT,
    ReplyTo: replyToEmail,
    MessageStream: String(env.POSTMARK_MESSAGE_STREAM || DEFAULT_POSTMARK_MESSAGE_STREAM).trim() || DEFAULT_POSTMARK_MESSAGE_STREAM,
    Tag: "booking-lead-acknowledgement",
    TextBody: buildBookingLeadAcknowledgementText(lead),
    Metadata: {
      lead_id: String(lead.id),
      source: String(lead.source || "website"),
    },
  };

  return sendPostmarkEmail(env, payload);
}

async function sendPostmarkEmail(env, payload) {
  const apiBase = String(env.POSTMARK_API_BASE || DEFAULT_POSTMARK_API_BASE).trim().replace(/\/+$/, "");
  const response = await fetch(`${apiBase}/email`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "x-postmark-server-token": String(env.POSTMARK_SERVER_TOKEN || "").trim(),
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = result && typeof result.Message === "string" ? result.Message : `Postmark request failed with status ${response.status}`;
    throw new Error(detail);
  }
  return result;
}

export function buildBookingLeadAcknowledgementText(lead) {
  const greeting = lead.guestName ? `Hello ${lead.guestName},` : "Hello,";
  const lines = [
    greeting,
    "",
    "We received your booking request at Sandbox Hotel.",
    "Our team will review it and reply with availability and pricing soon.",
    "",
    `Reference: Lead ${lead.id}`,
    `Check-in: ${lead.checkinDate}`,
    `Check-out: ${lead.checkoutDate}`,
    `Guests: ${lead.guests}`,
    lead.requestedRoomType ? `Room: ${lead.requestedRoomType}` : null,
    lead.guestContact ? `Contact: ${lead.guestContact}` : null,
    lead.guestNotes ? `Notes: ${lead.guestNotes}` : null,
    "",
    "If you need to add anything, reply to this email and we will pick it up from our booking inbox.",
    "",
    "Sandbox Hotel",
  ].filter(Boolean);
  return lines.join("\n");
}

async function listLeads(db) {
  return all(db, "SELECT * FROM booking_leads ORDER BY CASE status WHEN 'new' THEN 0 ELSE 1 END, created_at DESC LIMIT 100");
}

async function convertLead(request, db, session) {
  const payload = await parseJson(request);
  const lead = await first(db, "SELECT * FROM booking_leads WHERE id = ? LIMIT 1", Number(payload.lead_id));
  if (!lead) throw new HttpError(404, "Lead not found");
  let roomTypeId = payload.room_type_id ? Number(payload.room_type_id) : null;
  if (!roomTypeId && payload.room_type_name) {
    const roomType = await first(db, "SELECT id, base_rate FROM room_types WHERE LOWER(name) = ? OR LOWER(code) = ? LIMIT 1", String(payload.room_type_name).toLowerCase(), String(payload.room_type_name).toLowerCase());
    roomTypeId = roomType?.id || null;
    payload.nightly_rate = payload.nightly_rate || roomType?.base_rate;
  }
  const reservation = await createReservationFromData(db, session, {
    guest_name: payload.guest_name || lead.guest_name || "Guest",
    contact: payload.contact || lead.guest_contact || "",
    notes: payload.notes || lead.guest_notes || "",
    room_type_id: roomTypeId,
    room_id: payload.room_id || null,
    guests: payload.guests || lead.guests || 1,
    checkin_date: payload.checkin_date || lead.checkin_date,
    checkout_date: payload.checkout_date || lead.checkout_date,
    status: payload.status || "tentative",
    source: lead.source,
    nightly_rate: payload.nightly_rate || 1200,
  });
  await db.prepare("UPDATE booking_leads SET status = 'converted', reservation_id = ?, updated_at = ? WHERE id = ?").bind(reservation.id, isoNow(), lead.id).run();
  await insertAudit(db, session.propertyId, session.userId, "booking_lead_converted", "booking_lead", lead.id, `Converted to ${reservation.confirmation_code}`);
  return json({ ok: true, reservation });
}

async function createReservation(request, db, session) {
  const payload = await parseJson(request);
  const reservation = await createReservationFromData(db, session, payload);
  return json({ ok: true, reservation }, 201);
}

async function createReservationFromData(db, session, payload) {
  requireFields(payload, ["guest_name", "checkin_date", "checkout_date"]);
  const roomTypeId = payload.room_type_id ? Number(payload.room_type_id) : null;
  const roomId = payload.room_id ? Number(payload.room_id) : null;
  const nights = nightsBetween(payload.checkin_date, payload.checkout_date);
  if (nights <= 0) throw new HttpError(400, "Checkout date must be after check-in date");
  if (roomId) await ensureRoomAvailable(db, roomId, payload.checkin_date, payload.checkout_date, null);
  else if (roomTypeId) await ensureRoomTypeCapacity(db, roomTypeId, payload.checkin_date, payload.checkout_date);

  const guest = await upsertGuest(db, { full_name: payload.guest_name, phone: payload.contact || payload.phone || "", email: payload.email || "", notes: payload.notes || "" });
  const now = isoNow();
  const nightlyRate = Number(payload.nightly_rate || 1200);
  const totalAmount = nightlyRate * nights;
  const confirmationCode = `SBX-${Date.now().toString().slice(-8)}`;
  await db.prepare(`INSERT INTO reservations (property_id, guest_id, confirmation_code, source, status, guest_name, guest_contact, guest_notes, room_type_id, room_id, checkin_date, checkout_date, adults, children, nightly_rate, total_amount, balance_amount, currency, created_at, updated_at) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'THB', ?, ?)`)
    .bind(guest.id, confirmationCode, payload.source || "manual", payload.status || "tentative", payload.guest_name, payload.contact || payload.phone || "", payload.notes || "", roomTypeId, roomId, payload.checkin_date, payload.checkout_date, Number(payload.adults || payload.guests || 1), Number(payload.children || 0), nightlyRate, totalAmount, totalAmount, now, now).run();
  const reservationId = Number((await first(db, "SELECT last_insert_rowid() AS id")).id);

  await db.prepare("INSERT INTO reservation_rooms (reservation_id, room_id, assigned_from, assigned_to, created_at) VALUES (?, ?, ?, ?, ?)").bind(reservationId, roomId, payload.checkin_date, payload.checkout_date, now).run();
  await db.prepare("INSERT INTO folios (property_id, reservation_id, status, currency, created_at, updated_at) VALUES (1, ?, 'open', 'THB', ?, ?)").bind(reservationId, now, now).run();
  const folioId = Number((await first(db, "SELECT last_insert_rowid() AS id")).id);
  await db.prepare("INSERT INTO folio_lines (folio_id, line_type, description, amount, quantity, posted_at, created_at) VALUES (?, 'room_charge', ?, ?, ?, ?, ?)").bind(folioId, `${nights} night room charge`, nightlyRate, nights, now, now).run();
  await recalcFolio(db, folioId);

  if (session) {
    await insertAudit(db, session.propertyId, session.userId, "reservation_created", "reservation", reservationId, `Reservation ${confirmationCode} created`);
  }
  return reservationDetails(db, reservationId);
}

async function reservationDetails(db, reservationId) {
  const reservation = await first(db, `SELECT reservations.*, room_types.name AS room_type_name, rooms.room_number FROM reservations LEFT JOIN room_types ON room_types.id = reservations.room_type_id LEFT JOIN rooms ON rooms.id = reservations.room_id WHERE reservations.id = ? LIMIT 1`, reservationId);
  if (!reservation) throw new HttpError(404, "Reservation not found");
  reservation.folio = await getFolioByReservation(db, reservationId);
  return reservation;
}

async function listReservations(db, filters) {
  const clauses = [];
  const params = [];
  if (filters.status && filters.status !== "all") {
    clauses.push("reservations.status = ?");
    params.push(filters.status);
  }
  if (filters.date) {
    clauses.push("reservations.checkin_date <= ? AND reservations.checkout_date > ?");
    params.push(filters.date, filters.date);
  }
  return all(db, `SELECT reservations.*, room_types.name AS room_type_name, rooms.room_number FROM reservations LEFT JOIN room_types ON room_types.id = reservations.room_type_id LEFT JOIN rooms ON rooms.id = reservations.room_id ${clauses.length ? `WHERE ${clauses.join(" AND ")}` : ""} ORDER BY reservations.checkin_date ASC, reservations.created_at DESC`, ...params);
}

async function reservationAction(request, db, session, reservationId) {
  const payload = await parseJson(request);
  const reservation = await first(db, "SELECT * FROM reservations WHERE id = ? LIMIT 1", reservationId);
  if (!reservation) throw new HttpError(404, "Reservation not found");
  const now = isoNow();

  if (payload.action === "assign_room") {
    const roomId = Number(payload.room_id);
    await ensureRoomAvailable(db, roomId, reservation.checkin_date, reservation.checkout_date, reservationId);
    await db.batch([
      db.prepare("UPDATE reservations SET room_id = ?, updated_at = ? WHERE id = ?").bind(roomId, now, reservationId),
      db.prepare("INSERT INTO reservation_rooms (reservation_id, room_id, assigned_from, assigned_to, created_at) VALUES (?, ?, ?, ?, ?)").bind(reservationId, roomId, reservation.checkin_date, reservation.checkout_date, now),
    ]);
  } else if (payload.action === "confirm") {
    await db.prepare("UPDATE reservations SET status = 'confirmed', updated_at = ? WHERE id = ?").bind(now, reservationId).run();
  } else if (payload.action === "check_in") {
    if (!reservation.room_id) throw new HttpError(400, "Assign a room before check-in");
    await db.batch([
      db.prepare("UPDATE reservations SET status = 'checked_in', updated_at = ? WHERE id = ?").bind(now, reservationId),
      db.prepare("UPDATE rooms SET status = 'occupied_clean', housekeeping_status = 'clean', updated_at = ? WHERE id = ?").bind(now, reservation.room_id),
    ]);
  } else if (payload.action === "check_out") {
    await db.prepare("UPDATE reservations SET status = 'checked_out', balance_amount = 0, updated_at = ? WHERE id = ?").bind(now, reservationId).run();
    if (reservation.room_id) {
      await db.batch([
        db.prepare("UPDATE rooms SET status = 'vacant_dirty', housekeeping_status = 'dirty', updated_at = ? WHERE id = ?").bind(now, reservation.room_id),
        db.prepare("INSERT INTO housekeeping_tasks (property_id, room_id, reservation_id, task_type, status, notes, created_at, updated_at) VALUES (1, ?, ?, 'departure_clean', 'open', 'Room needs turnaround after checkout', ?, ?)").bind(reservation.room_id, reservationId, now, now),
      ]);
    }
    const folio = await first(db, "SELECT id FROM folios WHERE reservation_id = ? LIMIT 1", reservationId);
    if (folio) await db.prepare("UPDATE folios SET status = 'closed', updated_at = ? WHERE id = ?").bind(now, folio.id).run();
  } else if (payload.action === "cancel" || payload.action === "no_show") {
    await db.prepare("UPDATE reservations SET status = ?, updated_at = ? WHERE id = ?").bind(payload.action === "cancel" ? "cancelled" : "no_show", now, reservationId).run();
  } else {
    throw new HttpError(400, "Unsupported reservation action");
  }

  await insertAudit(db, session.propertyId, session.userId, `reservation_${payload.action}`, "reservation", reservationId, `Reservation action ${payload.action}`);
  return json({ ok: true, reservation: await reservationDetails(db, reservationId) });
}

async function getFolioByReservation(db, reservationId) {
  const folio = await first(db, "SELECT * FROM folios WHERE reservation_id = ? LIMIT 1", reservationId);
  if (!folio) return null;
  return getFolio(db, folio.id);
}

async function addFolioLine(request, db, session, folioId) {
  const payload = await parseJson(request);
  requireFields(payload, ["description", "amount", "line_type"]);
  const now = isoNow();
  await db.prepare("INSERT INTO folio_lines (folio_id, line_type, description, amount, quantity, posted_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(folioId, payload.line_type, payload.description, Number(payload.amount), Number(payload.quantity || 1), now, now).run();
  await recalcFolio(db, folioId);
  await insertAudit(db, session.propertyId, session.userId, "folio_line_added", "folio", folioId, payload.description);
  return json({ ok: true, folio: await getFolio(db, folioId) }, 201);
}

async function addPayment(request, db, session, folioId) {
  const payload = await parseJson(request);
  requireFields(payload, ["amount", "payment_method"]);
  const now = isoNow();
  await db.prepare("INSERT INTO payments (folio_id, payment_method, amount, reference, note, payment_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(folioId, payload.payment_method, Number(payload.amount), payload.reference || "", payload.note || "", now, now).run();
  await recalcFolio(db, folioId);
  await insertAudit(db, session.propertyId, session.userId, "payment_logged", "folio", folioId, `${payload.payment_method} payment`);
  return json({ ok: true, folio: await getFolio(db, folioId) }, 201);
}

async function getFolio(db, folioId) {
  const folio = await first(db, "SELECT * FROM folios WHERE id = ? LIMIT 1", folioId);
  const [lines, payments] = await Promise.all([
    all(db, "SELECT * FROM folio_lines WHERE folio_id = ? ORDER BY posted_at DESC, id DESC", folioId),
    all(db, "SELECT * FROM payments WHERE folio_id = ? ORDER BY payment_date DESC, id DESC", folioId),
  ]);
  return { ...folio, lines, payments };
}

async function recalcFolio(db, folioId) {
  const totals = await first(db, `SELECT COALESCE((SELECT SUM(amount * quantity) FROM folio_lines WHERE folio_id = ?), 0) AS charges, COALESCE((SELECT SUM(amount) FROM payments WHERE folio_id = ?), 0) AS paid`, folioId, folioId);
  const balance = Number(totals.charges || 0) - Number(totals.paid || 0);
  await db.prepare("UPDATE folios SET total_amount = ?, paid_amount = ?, balance_amount = ?, updated_at = ? WHERE id = ?").bind(Number(totals.charges || 0), Number(totals.paid || 0), balance, isoNow(), folioId).run();
  const reservation = await first(db, "SELECT reservation_id FROM folios WHERE id = ? LIMIT 1", folioId);
  if (reservation) await db.prepare("UPDATE reservations SET balance_amount = ?, updated_at = ? WHERE id = ?").bind(balance, isoNow(), reservation.reservation_id).run();
}

async function listHousekeepingTasks(db) {
  return all(db, `SELECT housekeeping_tasks.*, rooms.room_number, reservations.confirmation_code FROM housekeeping_tasks LEFT JOIN rooms ON rooms.id = housekeeping_tasks.room_id LEFT JOIN reservations ON reservations.id = housekeeping_tasks.reservation_id ORDER BY CASE housekeeping_tasks.status WHEN 'open' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END, housekeeping_tasks.created_at DESC`);
}

async function updateHousekeepingTask(request, db, session, taskId) {
  const payload = await parseJson(request);
  const status = payload.status || "done";
  const task = await first(db, "SELECT * FROM housekeeping_tasks WHERE id = ? LIMIT 1", taskId);
  if (!task) throw new HttpError(404, "Task not found");
  const now = isoNow();
  await db.prepare("UPDATE housekeeping_tasks SET status = ?, completed_at = CASE WHEN ? = 'done' THEN ? ELSE completed_at END, updated_at = ? WHERE id = ?").bind(status, status, now, now, taskId).run();
  if (task.room_id && status === "done") {
    await db.prepare("UPDATE rooms SET status = 'vacant_clean', housekeeping_status = 'clean', updated_at = ? WHERE id = ?").bind(now, task.room_id).run();
  }
  await insertAudit(db, session.propertyId, session.userId, "housekeeping_task_updated", "housekeeping_task", taskId, `Task marked ${status}`);
  return json({ ok: true, tasks: await listHousekeepingTasks(db) });
}

async function updateRoomStatus(request, db, session) {
  const payload = await parseJson(request);
  requireFields(payload, ["room_id", "status"]);
  await db.prepare("UPDATE rooms SET status = ?, housekeeping_status = ?, updated_at = ? WHERE id = ?").bind(payload.status, inferHousekeepingStatus(payload.status), isoNow(), Number(payload.room_id)).run();
  await insertAudit(db, session.propertyId, session.userId, "room_status_updated", "room", Number(payload.room_id), `Room status set to ${payload.status}`);
  return json({ ok: true });
}

async function getCalendar(db, start, days) {
  const safeDays = Math.min(Math.max(days, 1), 14);
  const end = addDays(start, safeDays);
  const rooms = await all(db, "SELECT rooms.id, rooms.room_number, room_types.name AS room_type_name FROM rooms JOIN room_types ON room_types.id = rooms.room_type_id ORDER BY rooms.room_number");
  const reservations = await all(db, "SELECT id, confirmation_code, guest_name, room_id, room_type_id, status, checkin_date, checkout_date FROM reservations WHERE status NOT IN ('cancelled','no_show') AND checkin_date < ? AND checkout_date > ?", end, start);
  return { start, days: safeDays, rooms, reservations };
}

async function dailyReport(db, date) {
  const [occupancy, payments, statusBreakdown] = await Promise.all([
    scalar(db, "SELECT COUNT(*) AS count FROM reservations WHERE status = 'checked_in' AND checkin_date <= ? AND checkout_date > ?", date, date),
    scalar(db, "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE payment_date >= ? AND payment_date < ?", `${date}T00:00:00.000Z`, `${addDays(date, 1)}T00:00:00.000Z`),
    all(db, "SELECT status, COUNT(*) AS count FROM reservations GROUP BY status ORDER BY count DESC"),
  ]);
  return { date, occupancy: Number(occupancy || 0), payments: Number(payments || 0), statusBreakdown };
}

async function upsertGuest(db, payload) {
  const phone = String(payload.phone || "").trim();
  const email = String(payload.email || "").trim().toLowerCase();
  let guest = null;
  if (phone) guest = await first(db, "SELECT * FROM guests WHERE phone = ? LIMIT 1", phone);
  if (!guest && email) guest = await first(db, "SELECT * FROM guests WHERE email = ? LIMIT 1", email);
  const now = isoNow();
  if (guest) {
    await db.prepare("UPDATE guests SET full_name = ?, phone = ?, email = ?, notes = ?, updated_at = ? WHERE id = ?").bind(payload.full_name, phone, email, payload.notes || "", now, guest.id).run();
    return { ...guest, full_name: payload.full_name, phone, email };
  }
  await db.prepare("INSERT INTO guests (property_id, full_name, phone, email, notes, created_at, updated_at) VALUES (1, ?, ?, ?, ?, ?, ?)").bind(payload.full_name, phone, email, payload.notes || "", now, now).run();
  return { id: Number((await first(db, "SELECT last_insert_rowid() AS id")).id), full_name: payload.full_name, phone, email };
}

async function ensureRoomAvailable(db, roomId, checkinDate, checkoutDate, reservationId) {
  const room = await first(db, "SELECT * FROM rooms WHERE id = ? LIMIT 1", roomId);
  if (!room) throw new HttpError(404, "Room not found");
  if (room.status === "out_of_order") throw new HttpError(400, "Room is out of order");
  const conflict = await first(db, `SELECT id FROM reservations WHERE room_id = ? AND status NOT IN ('cancelled','no_show','checked_out') AND checkin_date < ? AND checkout_date > ? AND (? IS NULL OR id != ?) LIMIT 1`, roomId, checkoutDate, checkinDate, reservationId, reservationId);
  if (conflict) throw new HttpError(409, "Room is already assigned for those dates");
}

async function ensureRoomTypeCapacity(db, roomTypeId, checkinDate, checkoutDate) {
  const [roomCount, assigned] = await Promise.all([
    scalar(db, "SELECT COUNT(*) AS count FROM rooms WHERE room_type_id = ? AND status != 'out_of_order'", roomTypeId),
    scalar(db, `SELECT COUNT(*) AS count FROM reservations WHERE room_type_id = ? AND status NOT IN ('cancelled','no_show','checked_out') AND checkin_date < ? AND checkout_date > ?`, roomTypeId, checkoutDate, checkinDate),
  ]);
  if (Number(assigned || 0) >= Number(roomCount || 0)) throw new HttpError(409, "No inventory left for the selected room type");
}

async function insertAudit(db, propertyId, staffUserId, action, entityType, entityId, description) {
  await db.prepare("INSERT INTO audit_events (property_id, staff_user_id, action, entity_type, entity_id, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(propertyId, staffUserId, action, entityType, entityId, description || "", isoNow()).run();
}

async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await pbkdf2(password, salt);
  return `${toHex(salt)}:${toHex(new Uint8Array(hash))}`;
}

async function verifyPassword(password, storedHash) {
  const [saltHex, hashHex] = String(storedHash || "").split(":");
  if (!saltHex || !hashHex) return false;
  const hash = await pbkdf2(password, fromHex(saltHex));
  return toHex(new Uint8Array(hash)) === hashHex;
}

async function pbkdf2(password, salt) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 120000 }, material, 256);
}

function createToken() {
  return Array.from(crypto.getRandomValues(new Uint8Array(24))).map((value) => value.toString(16).padStart(2, "0")).join("");
}

function buildSessionCookie(token, expiresAt) {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}`;
}

function readCookie(cookieHeader, name) {
  const parts = cookieHeader.split(/;\s*/);
  for (const part of parts) {
    const [key, ...rest] = part.split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

function sanitizeUser(user) {
  return { userId: user.id, propertyId: user.property_id, name: user.name, email: user.email, role: user.role, preferredLanguage: user.preferred_language };
}

function isoNow() {
  return new Date().toISOString();
}

function todayIso() {
  return new globalThis.Intl.DateTimeFormat("en-CA", { timeZone: HOTEL_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function addDays(date, days) {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

function nightsBetween(start, end) {
  return Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY_MS);
}

function inferHousekeepingStatus(status) {
  if (status.includes("dirty")) return "dirty";
  if (status === "inspection") return "inspection";
  if (status === "out_of_order") return "blocked";
  return "clean";
}

function getAllowedEmailLocalParts(env) {
  const configured = String(env.EMAIL_ROUTING_ALLOWED_LOCAL_PARTS || "").trim();
  const source = configured || DEFAULT_ALLOWED_EMAIL_LOCAL_PARTS.join(",");
  return source
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeComparableText(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeEmailAddress(value) {
  return extractEmailAddress(value);
}

export function extractEmailAddress(value) {
  const match = String(value || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0].toLowerCase() : "";
}

function toHex(array) {
  return Array.from(array).map((value) => value.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
}

async function all(db, sql, ...params) {
  const result = await db.prepare(sql).bind(...params).all();
  return result.results || [];
}

async function first(db, sql, ...params) {
  return db.prepare(sql).bind(...params).first();
}

async function scalar(db, sql, ...params) {
  const row = await first(db, sql, ...params);
  return row ? Object.values(row)[0] : 0;
}
