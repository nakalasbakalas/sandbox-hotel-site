/**
 * D1 schema setup for Worker tests.
 *
 * Creates all tables expected by src/index.js so that the in-memory
 * Miniflare D1 database is usable for integration tests.
 */

const TABLE_NAMES = [
  "audit_events",
  "housekeeping_tasks",
  "payments",
  "folio_lines",
  "folios",
  "reservation_rooms",
  "reservations",
  "booking_leads",
  "guests",
  "rooms",
  "rate_plans",
  "room_types",
  "sessions",
  "staff_users",
  "property_settings",
  "properties",
];

export const DROP_SQL = TABLE_NAMES.map((t) => `DROP TABLE IF EXISTS ${t}`).join(";\n") + ";";

export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS properties (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  timezone TEXT NOT NULL DEFAULT 'Asia/Bangkok',
  default_language TEXT NOT NULL DEFAULT 'th',
  secondary_language TEXT NOT NULL DEFAULT 'en',
  checkin_time TEXT NOT NULL DEFAULT '14:00',
  checkout_time TEXT NOT NULL DEFAULT '11:00',
  tax_rate REAL NOT NULL DEFAULT 7,
  service_fee_rate REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'THB',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS property_settings (
  property_id INTEGER PRIMARY KEY,
  contact_phone TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  line_id TEXT NOT NULL DEFAULT '',
  whatsapp_number TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS staff_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'front_desk',
  preferred_language TEXT NOT NULL DEFAULT 'th',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  staff_user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL DEFAULT 1,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS room_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  max_guests INTEGER NOT NULL DEFAULT 2,
  base_rate REAL NOT NULL DEFAULT 1200,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  room_type_id INTEGER NOT NULL,
  room_number TEXT NOT NULL,
  floor_label TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'vacant_clean',
  housekeeping_status TEXT NOT NULL DEFAULT 'clean',
  notes TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  pricing_mode TEXT NOT NULL DEFAULT 'base',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS booking_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL DEFAULT 1,
  source TEXT NOT NULL DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new',
  guest_name TEXT NOT NULL DEFAULT '',
  guest_contact TEXT NOT NULL DEFAULT '',
  guest_notes TEXT NOT NULL DEFAULT '',
  requested_room_type TEXT NOT NULL DEFAULT '',
  guests INTEGER NOT NULL DEFAULT 1,
  checkin_date TEXT NOT NULL,
  checkout_date TEXT NOT NULL,
  reservation_id INTEGER,
  raw_payload TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL DEFAULT 1,
  guest_id INTEGER,
  confirmation_code TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'tentative',
  guest_name TEXT NOT NULL DEFAULT '',
  guest_contact TEXT NOT NULL DEFAULT '',
  guest_notes TEXT NOT NULL DEFAULT '',
  room_type_id INTEGER,
  room_id INTEGER,
  checkin_date TEXT NOT NULL,
  checkout_date TEXT NOT NULL,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  nightly_rate REAL NOT NULL DEFAULT 1200,
  total_amount REAL NOT NULL DEFAULT 0,
  balance_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'THB',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reservation_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reservation_id INTEGER NOT NULL,
  room_id INTEGER,
  assigned_from TEXT,
  assigned_to TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS folios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL DEFAULT 1,
  reservation_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  total_amount REAL NOT NULL DEFAULT 0,
  paid_amount REAL NOT NULL DEFAULT 0,
  balance_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'THB',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS folio_lines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  folio_id INTEGER NOT NULL,
  line_type TEXT NOT NULL DEFAULT 'room_charge',
  description TEXT NOT NULL DEFAULT '',
  amount REAL NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  posted_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  folio_id INTEGER NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  amount REAL NOT NULL DEFAULT 0,
  reference TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  payment_date TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS housekeeping_tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL DEFAULT 1,
  room_id INTEGER,
  reservation_id INTEGER,
  task_type TEXT NOT NULL DEFAULT 'departure_clean',
  status TEXT NOT NULL DEFAULT 'open',
  notes TEXT NOT NULL DEFAULT '',
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS audit_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  staff_user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
`;

/**
 * Applies the schema to a D1 database binding.
 * Drops all tables first to ensure a clean state.
 */
export async function applySchema(db) {
  // Drop all tables for a clean slate
  const drops = DROP_SQL.split(";").map((s) => s.trim()).filter(Boolean);
  for (const sql of drops) {
    await db.prepare(sql).run();
  }

  // Create all tables
  const statements = SCHEMA_SQL
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sql of statements) {
    await db.prepare(sql).run();
  }
}
