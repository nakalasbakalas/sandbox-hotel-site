
const state = {
  session: null,
  locale: "th",
  dashboard: null,
  roomTypes: [],
  rooms: [],
  reservations: [],
  leads: [],
  tasks: [],
  settings: null,
  calendar: null,
  folio: null,
  report: null,
  audit: [],
};

const copy = {
  th: {
    appTitle: "Sandbox PMS",
    subtitle: "Thai-first hotel operations for front desk, rooms, housekeeping, and daily reporting",
    login: "Login",
    bootstrap: "First-time setup",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    createAdmin: "Create admin",
    signIn: "Sign in",
    signOut: "Sign out",
    dashboard: "Today overview",
    reservations: "Reservations",
    housekeeping: "Housekeeping",
    reports: "Reports",
    settings: "Property settings",
    leads: "Booking leads",
    createReservation: "Create reservation",
    language: "Language",
  },
  en: {
    appTitle: "Sandbox PMS",
    subtitle: "Hotel operations for front desk, rooms, housekeeping, and daily reporting",
    login: "Login",
    bootstrap: "First-time setup",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    createAdmin: "Create admin",
    signIn: "Sign in",
    signOut: "Sign out",
    dashboard: "Today overview",
    reservations: "Reservations",
    housekeeping: "Housekeeping",
    reports: "Reports",
    settings: "Property settings",
    leads: "Booking leads",
    createReservation: "Create reservation",
    language: "Language",
  },
};

function showToast(message, type = "error") {
  const toast = document.createElement("div");
  toast.textContent = message;
  Object.assign(toast.style, {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    padding: "0.75rem 1.25rem",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    lineHeight: "1.4",
    maxWidth: "360px",
    boxShadow: "0 4px 12px rgba(0,0,0,.25)",
    zIndex: "9999",
    opacity: "0",
    transition: "opacity .2s ease",
    background: type === "error" ? "#c0392b" : "#27ae60",
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => { toast.style.opacity = "1"; });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.addEventListener("transitionend", () => toast.remove());
  }, 4000);
}

const RESERVATION_STATUS_ACTIONS = [
  ["tentative", "Confirm", "confirm"],
  ["inquiry", "Confirm", "confirm"],
  ["confirmed", "Check in", "check_in"],
  ["checked_in", "Check out", "check_out"],
];
const app = document.getElementById("app");
boot();

async function boot() {
  const status = await api("/api/bootstrap/status");
  if (status.needsBootstrap) return renderBootstrap();
  try {
    const session = await api("/api/session");
    state.session = session.session;
    state.locale = state.session.preferredLanguage || "th";
    await refreshAll(false);
  } catch {
    renderLogin();
  }
}

function t(key) {
  return copy[state.locale]?.[key] || copy.en[key] || key;
}

function renderBootstrap() {
  app.innerHTML = `
    <div class="auth">
      <form class="card stack" id="bootstrapForm" style="width:min(460px,100%)">
        <span class="badge">${t("bootstrap")}</span>
        <h1>${t("appTitle")}</h1>
        <p class="muted">${t("subtitle")}</p>
        <label>${t("fullName")}<input name="name" required></label>
        <label>${t("email")}<input type="email" name="email" required></label>
        <label>${t("password")}<input type="password" name="password" minlength="8" required></label>
        <button type="submit">${t("createAdmin")}</button>
      </form>
    </div>`;
  document.getElementById("bootstrapForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api("/api/bootstrap", { method: "POST", body: Object.fromEntries(form.entries()) });
    await boot();
  });
}

function renderLogin() {
  app.innerHTML = `
    <div class="auth">
      <form class="card stack" id="loginForm" style="width:min(460px,100%)">
        <span class="badge">${t("login")}</span>
        <h1>${t("appTitle")}</h1>
        <p class="muted">${t("subtitle")}</p>
        <label>${t("email")}<input type="email" name="email" required></label>
        <label>${t("password")}<input type="password" name="password" required></label>
        <button type="submit">${t("signIn")}</button>
      </form>
    </div>`;
  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api("/api/login", { method: "POST", body: Object.fromEntries(form.entries()) });
    await boot();
  });
}

async function refreshAll(render = true) {
  const [dashboard, roomTypes, rooms, reservations, leads, tasks, settings, calendar] = await Promise.all([
    api("/api/dashboard"),
    api("/api/room-types"),
    api("/api/rooms"),
    api("/api/reservations"),
    api("/api/booking-leads"),
    api("/api/housekeeping/tasks"),
    api("/api/settings"),
    api(`/api/calendar?start=${today()}&days=7`),
  ]);
  state.dashboard = dashboard.dashboard;
  state.roomTypes = roomTypes.roomTypes;
  state.rooms = rooms.rooms;
  state.reservations = reservations.reservations;
  state.leads = leads.leads;
  state.tasks = tasks.tasks;
  state.settings = settings.settings;
  state.calendar = calendar;
  if (["admin", "manager"].includes(state.session.role)) {
    const [report, audit] = await Promise.all([api(`/api/reports/daily?date=${today()}`), api("/api/audit")]);
    state.report = report.report;
    state.audit = audit.events;
  } else {
    state.report = null;
    state.audit = [];
  }
  if (!state.folio && state.reservations[0]) {
    await loadFolio(state.reservations[0].id);
  }
  if (render) renderApp();
}

function renderApp() {
  app.innerHTML = `
    <div class="app-shell stack">
      <header class="card app-header">
        <div class="stack">
          <span class="badge">${t("appTitle")}</span>
          <h1>${escapeHtml(state.settings?.name || "Sandbox Hotel")}</h1>
          <p class="muted">${t("subtitle")}</p>
        </div>
        <div class="stack">
          <div class="toolbar section-toolbar">
            <button class="secondary" id="toggleLocale">${t("language")}: ${state.locale.toUpperCase()}</button>
            <button class="secondary" id="refreshButton">Refresh</button>
            <button id="logoutButton">${t("signOut")}</button>
          </div>
          <div class="notice">${escapeHtml(state.session.name)} &middot; ${escapeHtml(state.session.role)}</div>
        </div>
      </header>
      ${renderOverview()}
      ${renderReservations()}
      ${renderHousekeeping()}
      ${renderReports()}
      ${renderSettings()}
    </div>`;
  wireEvents();
}

function renderOverview() {
  const metrics = [
    ["Arrivals", state.dashboard.arrivals],
    ["Departures", state.dashboard.departures],
    ["Occupied", state.dashboard.occupied],
    ["Dirty rooms", state.dashboard.dirtyRooms],
    ["New leads", state.dashboard.pendingLeads],
    ["Payments", `${Number(state.dashboard.revenueToday).toFixed(2)} THB`],
  ];
  return `
    <section class="card stack">
      <div class="section-head"><div><span class="badge">${t("dashboard")}</span><h2>${t("dashboard")}</h2></div></div>
      <div class="grid three metric-grid">${metrics.map(([label, value]) => `<article class="card metric"><span class="muted">${label}</span><strong>${value}</strong></article>`).join("")}</div>
      <div class="stack"><h3>7-day room calendar</h3>${renderCalendar()}</div>
    </section>`;
}

function renderCalendar() {
  const days = Array.from({ length: state.calendar.days }, (_, index) => shiftDate(state.calendar.start, index));
  return `<div class="calendar"><div class="calendar-grid"><div class="header">Room</div>${days.map((day) => `<div class="header">${day}</div>`).join("")}${state.calendar.rooms.map((room) => `<div><strong>${room.room_number}</strong><div class="muted">${room.room_type_name}</div></div>${days.map((day) => {
    const booking = state.calendar.reservations.find((item) => item.room_id === room.id && item.checkin_date <= day && item.checkout_date > day);
    return `<div>${booking ? `<div class="calendar-booking"><strong>${booking.confirmation_code}</strong><span>${escapeHtml(booking.guest_name)}</span><span>${booking.status}</span></div>` : ""}</div>`;
  }).join("")}`).join("")}</div></div>`;
}

function renderReservations() {
  return `
    <section class="card stack">
      <div class="section-head"><div><span class="badge">${t("reservations")}</span><h2>${t("reservations")}</h2></div></div>
      <div class="grid two">
        <article class="card stack">
          <div class="section-head"><h3>${t("leads")}</h3></div>
          <div class="table-wrap"><table><thead><tr><th>Source</th><th>Stay</th><th>Guest</th><th>Status</th><th>Action</th></tr></thead><tbody>
             ${renderLeadRows()}
          </tbody></table></div>
          <h3>${t("createReservation")}</h3>
          <form id="reservationForm" class="grid two dense-form">
            <label>Guest name<input name="guest_name" required></label>
            <label>Contact<input name="contact"></label>
            <label>Check-in<input type="date" name="checkin_date" value="${today()}" required></label>
            <label>Check-out<input type="date" name="checkout_date" value="${shiftDate(today(), 1)}" required></label>
            <label>Guests<input type="number" min="1" max="4" name="guests" value="2"></label>
            <label>Room type<select name="room_type_id"><option value="">Unassigned</option>${state.roomTypes.map((roomType) => `<option value="${roomType.id}">${escapeHtml(roomType.name)}</option>`).join("")}</select></label>
            <label>Status<select name="status"><option value="tentative">tentative</option><option value="confirmed">confirmed</option><option value="inquiry">inquiry</option></select></label>
            <label>Nightly rate<input type="number" step="0.01" name="nightly_rate" value="1200"></label>
            <label class="field-span-full">Notes<textarea name="notes"></textarea></label>
            <button class="field-span-full" type="submit">Save reservation</button>
          </form>
        </article>
        <article class="card stack">
          <div class="section-head"><h3>Reservations</h3></div>
          <div class="table-wrap"><table><thead><tr><th>Code</th><th>Guest</th><th>Stay</th><th>Room</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            ${renderReservationRows()}
          </tbody></table></div>
          ${renderFolio()}
        </article>
      </div>
    </section>`;
}

function renderLeadRows() {
  if (!state.leads.length) return `<tr><td colspan="5" class="muted">No leads</td></tr>`;
  return state.leads.map((lead) => `
    <tr>
      <td>${lead.source}</td>
      <td>${lead.checkin_date} &rarr; ${lead.checkout_date}<br><span class="muted">${escapeHtml(lead.requested_room_type || "-")}</span></td>
      <td>${escapeHtml(lead.guest_name || "-")}<br><span class="muted">${escapeHtml(lead.guest_contact || "")}</span></td>
      <td><span class="pill ${lead.status === "new" ? "warn" : ""}">${lead.status}</span></td>
      <td><button class="secondary" data-convert="${lead.id}">Convert</button></td>
    </tr>
  `).join("");
}

function renderReservationRows() {
  if (!state.reservations.length) return `<tr><td colspan="6" class="muted">No reservations</td></tr>`;
  return state.reservations.map((reservation) => `
    <tr>
      <td>${reservation.confirmation_code}</td>
      <td>${escapeHtml(reservation.guest_name)}<br><span class="muted">${escapeHtml(reservation.guest_contact || "")}</span></td>
      <td>${reservation.checkin_date} &rarr; ${reservation.checkout_date}</td>
      <td>${escapeHtml(reservation.room_number || reservation.room_type_name || "-")}</td>
      <td><span class="pill ${pillClass(reservation.status)}">${reservation.status}</span></td>
      <td>
        <div class="table-actions">
          <button class="secondary" data-folio="${reservation.id}">Folio</button>
          ${renderReservationActionButtons(reservation)}
        </div>
        <form class="table-actions assign-form" data-assign="${reservation.id}">
          <select name="room_id">
            <option value="">Assign room</option>
            ${renderRoomOptions()}
          </select>
          <button class="secondary" type="submit">Assign</button>
        </form>
      </td>
    </tr>
  `).join("");
}

function renderReservationActionButtons(reservation) {
  return RESERVATION_STATUS_ACTIONS.filter(([status]) => reservation.status === status)
    .map(([, label, action]) => `<button class="secondary" data-action="${action}" data-id="${reservation.id}">${label}</button>`)
    .join("") + (
      reservation.status !== "cancelled" && reservation.status !== "checked_out"
        ? `<button class="ghost" data-action="cancel" data-id="${reservation.id}">Cancel</button>`
        : ""
    );
}

function renderRoomOptions() {
  return state.rooms.map((room) => `<option value="${room.id}">${room.room_number} &middot; ${escapeHtml(room.room_type_name)}</option>`).join("");
}

function renderFolio() {
  if (!state.folio) return `<div class="notice">Select a reservation to view folio</div>`;
  return `
    <div class="stack">
      <div class="notice">Reservation #${state.folio.reservation_id} &middot; Balance ${Number(state.folio.balance_amount).toFixed(2)} THB</div>
      <div class="grid two">
        <form id="folioLineForm" class="stack">
          <label>Line type<select name="line_type"><option value="fee">fee</option><option value="discount">discount</option><option value="adjustment">adjustment</option></select></label>
          <label>Description<input name="description" required></label>
          <label>Amount<input type="number" step="0.01" name="amount" required></label>
          <button type="submit">Add charge</button>
        </form>
        <form id="paymentForm" class="stack">
          <label>Method<select name="payment_method"><option value="cash">cash</option><option value="card">card</option><option value="refund">refund</option></select></label>
          <label>Amount<input type="number" step="0.01" name="amount" required></label>
          <label>Reference<input name="reference"></label>
          <button type="submit">Log payment</button>
        </form>
      </div>
      <div class="grid two">
        <div class="table-wrap"><table><thead><tr><th>Charge</th><th>Amount</th><th>Posted</th></tr></thead><tbody>${state.folio.lines.map((line) => `<tr><td>${escapeHtml(line.description)}<br><span class="muted">${line.line_type}</span></td><td>${Number(line.amount).toFixed(2)} &times; ${line.quantity}</td><td>${line.posted_at}</td></tr>`).join("")}</tbody></table></div>
        <div class="table-wrap"><table><thead><tr><th>Payment</th><th>Amount</th><th>When</th></tr></thead><tbody>${state.folio.payments.map((payment) => `<tr><td>${payment.payment_method}<br><span class="muted">${escapeHtml(payment.reference || "")}</span></td><td>${Number(payment.amount).toFixed(2)}</td><td>${payment.payment_date}</td></tr>`).join("")}</tbody></table></div>
      </div>
    </div>`;
}

function renderHousekeeping() {
  return `
    <section class="card stack">
      <div class="section-head"><div><span class="badge">${t("housekeeping")}</span><h2>${t("housekeeping")}</h2></div></div>
      <div class="grid two">
        <article class="card stack">
          <div class="section-head"><h3>Room status board</h3></div>
          <div class="table-wrap"><table><thead><tr><th>Room</th><th>Type</th><th>Status</th><th>Update</th></tr></thead><tbody>${state.rooms.map((room) => `<tr><td>${room.room_number}</td><td>${escapeHtml(room.room_type_name)}</td><td><span class="pill ${pillClass(room.status)}">${room.status}</span></td><td><form class="toolbar" data-room-status="${room.id}"><select name="status">${["vacant_clean","vacant_dirty","occupied_clean","occupied_dirty","inspection","out_of_order"].map((status) => `<option value="${status}" ${room.status === status ? "selected" : ""}>${status}</option>`).join("")}</select><button class="secondary" type="submit">Set</button></form></td></tr>`).join("")}</tbody></table></div>
        </article>
        <article class="card stack">
          <div class="section-head"><h3>Task board</h3></div>
          <div class="table-wrap"><table><thead><tr><th>Room</th><th>Task</th><th>Status</th><th>Done</th></tr></thead><tbody>${state.tasks.map((task) => `<tr><td>${task.room_number || "-"}</td><td>${task.task_type}<br><span class="muted">${escapeHtml(task.notes || "")}</span></td><td><span class="pill ${pillClass(task.status)}">${task.status}</span></td><td>${task.status !== "done" ? `<button class="secondary" data-task="${task.id}">Mark done</button>` : ""}</td></tr>`).join("") || `<tr><td colspan="4" class="muted">No tasks</td></tr>`}</tbody></table></div>
        </article>
      </div>
    </section>`;
}

function renderReports() {
  if (!["admin", "manager"].includes(state.session.role)) return "";
  return `
    <section class="card stack">
      <div class="section-head"><div><span class="badge">${t("reports")}</span><h2>${t("reports")}</h2></div></div>
      <div class="grid two">
        <article class="card stack"><h3>Daily report ${state.report.date}</h3><div class="grid two"><div class="metric"><span class="muted">Occupancy</span><strong>${state.report.occupancy}</strong></div><div class="metric"><span class="muted">Payments</span><strong>${Number(state.report.payments).toFixed(2)}</strong></div></div><div class="table-wrap"><table><thead><tr><th>Status</th><th>Count</th></tr></thead><tbody>${state.report.statusBreakdown.map((row) => `<tr><td>${row.status}</td><td>${row.count}</td></tr>`).join("")}</tbody></table></div></article>
        <article class="card stack"><h3>Audit trail</h3><div class="table-wrap"><table><thead><tr><th>Action</th><th>Entity</th><th>When</th></tr></thead><tbody>${state.audit.map((event) => `<tr><td>${event.action}<br><span class="muted">${escapeHtml(event.description)}</span></td><td>${event.entity_type} #${event.entity_id}</td><td>${event.created_at}</td></tr>`).join("")}</tbody></table></div></article>
      </div>
    </section>`;
}

function renderSettings() {
  const disabled = !["admin", "manager"].includes(state.session.role) ? "disabled" : "";
  return `
    <section class="card stack">
      <div class="section-head"><div><span class="badge">${t("settings")}</span><h2>${t("settings")}</h2></div></div>
      <form id="settingsForm" class="grid three dense-form">
        <label>Hotel name<input name="name" value="${escapeHtml(state.settings.name || "")}" ${disabled}></label>
        <label>Timezone<input name="timezone" value="${escapeHtml(state.settings.timezone || "")}" ${disabled}></label>
        <label>Currency<input name="currency" value="${escapeHtml(state.settings.currency || "")}" ${disabled}></label>
        <label>Check-in<input name="checkin_time" value="${escapeHtml(state.settings.checkin_time || "")}" ${disabled}></label>
        <label>Check-out<input name="checkout_time" value="${escapeHtml(state.settings.checkout_time || "")}" ${disabled}></label>
        <label>Tax rate<input type="number" step="0.01" name="tax_rate" value="${state.settings.tax_rate ?? 0}" ${disabled}></label>
        <label>Service fee<input type="number" step="0.01" name="service_fee_rate" value="${state.settings.service_fee_rate ?? 0}" ${disabled}></label>
        <label>Phone<input name="contact_phone" value="${escapeHtml(state.settings.contact_phone || "")}" ${disabled}></label>
        <label>Email<input name="contact_email" value="${escapeHtml(state.settings.contact_email || "")}" ${disabled}></label>
        <label>LINE<input name="line_id" value="${escapeHtml(state.settings.line_id || "")}" ${disabled}></label>
        <label>WhatsApp<input name="whatsapp_number" value="${escapeHtml(state.settings.whatsapp_number || "")}" ${disabled}></label>
        <label class="field-span-full">Notes<textarea name="notes" ${disabled}>${escapeHtml(state.settings.notes || "")}</textarea></label>
        ${disabled ? "" : `<button class="field-span-full" type="submit">Save settings</button>`}
      </form>
    </section>`;
}

function wireEvents() {
  document.getElementById("logoutButton")?.addEventListener("click", async () => { await api("/api/logout", { method: "POST" }); state.session = null; state.folio = null; renderLogin(); });
  document.getElementById("refreshButton")?.addEventListener("click", () => refreshAll());
  document.getElementById("toggleLocale")?.addEventListener("click", () => { state.locale = state.locale === "th" ? "en" : "th"; renderApp(); });
  document.getElementById("reservationForm")?.addEventListener("submit", submitReservation);
  document.getElementById("settingsForm")?.addEventListener("submit", submitSettings);
  document.getElementById("folioLineForm")?.addEventListener("submit", submitFolioLine);
  document.getElementById("paymentForm")?.addEventListener("submit", submitPayment);
  document.querySelectorAll("[data-convert]").forEach((button) => button.addEventListener("click", () => convertLead(button.dataset.convert)));
  document.querySelectorAll("[data-folio]").forEach((button) => button.addEventListener("click", async () => { await loadFolio(Number(button.dataset.folio)); renderApp(); }));
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", async () => { await api(`/api/reservations/${button.dataset.id}/action`, { method: "POST", body: { action: button.dataset.action } }); await refreshAll(); }));
  document.querySelectorAll("[data-assign]").forEach((form) => form.addEventListener("submit", assignRoom));
  document.querySelectorAll("[data-room-status]").forEach((form) => form.addEventListener("submit", updateRoom));
  document.querySelectorAll("[data-task]").forEach((button) => button.addEventListener("click", async () => { await api(`/api/housekeeping/tasks/${button.dataset.task}/status`, { method: "POST", body: { status: "done" } }); await refreshAll(); }));
}

async function submitReservation(event) { event.preventDefault(); const form = new FormData(event.currentTarget); await api("/api/reservations", { method: "POST", body: Object.fromEntries(form.entries()) }); await refreshAll(); }
async function submitSettings(event) { event.preventDefault(); const form = new FormData(event.currentTarget); await api("/api/settings", { method: "PUT", body: Object.fromEntries(form.entries()) }); await refreshAll(); }
async function submitFolioLine(event) { event.preventDefault(); const form = new FormData(event.currentTarget); await api(`/api/folios/${state.folio.id}/lines`, { method: "POST", body: Object.fromEntries(form.entries()) }); await loadFolio(state.folio.reservation_id); renderApp(); }
async function submitPayment(event) { event.preventDefault(); const form = new FormData(event.currentTarget); await api(`/api/folios/${state.folio.id}/payments`, { method: "POST", body: Object.fromEntries(form.entries()) }); await loadFolio(state.folio.reservation_id); renderApp(); }
async function convertLead(id) { const lead = state.leads.find((item) => item.id === Number(id)); await api("/api/booking-leads/convert", { method: "POST", body: { lead_id: lead.id, guest_name: lead.guest_name, contact: lead.guest_contact, room_type_name: lead.requested_room_type, guests: lead.guests, checkin_date: lead.checkin_date, checkout_date: lead.checkout_date, status: "tentative" } }); await refreshAll(); }
async function assignRoom(event) { event.preventDefault(); const form = new FormData(event.currentTarget); if (!form.get("room_id")) return; await api(`/api/reservations/${event.currentTarget.dataset.assign}/action`, { method: "POST", body: { action: "assign_room", room_id: form.get("room_id") } }); await refreshAll(); }
async function updateRoom(event) { event.preventDefault(); const form = new FormData(event.currentTarget); await api("/api/rooms/status", { method: "POST", body: { room_id: event.currentTarget.dataset.roomStatus, status: form.get("status") } }); await refreshAll(); }
async function loadFolio(reservationId) { const response = await api(`/api/folios/reservation/${reservationId}`); state.folio = response.folio; }

async function api(url, options = {}) {
  const response = await fetch(url, { method: options.method || "GET", headers: { "content-type": "application/json" }, body: options.body ? JSON.stringify(options.body) : undefined });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { showToast(data.error || "Request failed", "error"); throw new Error(data.error || "Request failed"); }
  return data;
}

function today() { return new Date().toISOString().slice(0, 10); }
function shiftDate(date, days) { return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400000).toISOString().slice(0, 10); }
function pillClass(status) { if (["checked_in", "vacant_clean", "done", "confirmed"].includes(status)) return "ok"; if (["cancelled", "no_show", "out_of_order"].includes(status)) return "danger"; return "warn"; }
function escapeHtml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
