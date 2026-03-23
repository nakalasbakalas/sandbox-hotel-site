#!/usr/bin/env node
/**
 * scripts/perf-check.js
 *
 * Lightweight static performance audit for the Sandbox Hotel site.
 * Checks key files in public/ for size budgets and asset hygiene.
 *
 * Usage:
 *   node scripts/perf-check.js
 *
 * Exit code 0 = all checks pass
 * Exit code 1 = one or more checks failed
 */

import { readFileSync, statSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

let failed = 0;

function pass(msg) {
  console.log(`  ✅  ${msg}`);
}

function fail(msg) {
  console.error(`  ❌  ${msg}`);
  failed++;
}

function warn(msg) {
  console.warn(`  ⚠️   ${msg}`);
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function fileSize(rel) {
  try {
    return statSync(join(ROOT, rel)).size;
  } catch {
    return null;
  }
}

// ── Budget definitions ──────────────────────────────────────────────────────

const BUDGETS = {
  // HTML payload should be small after CSS/JS extraction
  "public/index.html": { maxKB: 100, label: "Homepage HTML" },

  // Individual CSS/JS bundles
  "public/assets/css/home.css": { maxKB: 80, label: "Home CSS" },
  "public/assets/css/design-tokens.css": { maxKB: 15, label: "Design tokens CSS" },
  "public/assets/js/home.js": { maxKB: 90, label: "Home JS" },
  "public/assets/js/analytics.js": { maxKB: 20, label: "Analytics JS" },

  // Hero images (important for LCP) — target: re-encode to ≤200 KB / ≤100 KB
  "public/images/Sandbox-Hotel-Hero-Banner.webp": { maxKB: 400, label: "Hero image (WebP)" },
  "public/images/Sandbox-Hotel-Hero-Banner-720.webp": { maxKB: 200, label: "Hero image 720 (WebP)" },
};

// ── Checks ──────────────────────────────────────────────────────────────────

console.log("\n🔍  Sandbox Hotel — Static Performance Audit\n");

// 1. File size budgets
console.log("📦  File size budgets:");
for (const [rel, { maxKB, label }] of Object.entries(BUDGETS)) {
  const size = fileSize(rel);
  if (size === null) {
    warn(`${label} — file not found: ${rel}`);
    continue;
  }
  const sizeKB = size / 1024;
  if (sizeKB > maxKB) {
    fail(`${label} is ${kb(size)} (budget: ${maxKB} KB) — ${rel}`);
  } else {
    pass(`${label} is ${kb(size)} (budget: ${maxKB} KB)`);
  }
}

// 2. Check that index.html no longer has large inline style/script blocks
console.log("\n📄  HTML inline asset checks:");
const indexHtml = readFileSync(join(ROOT, "public/index.html"), "utf-8");
const styleBlocks = (indexHtml.match(/<style[\s>]/gi) || []).length;
const inlineScriptKB = (() => {
  let total = 0;
  let m;
  const re = /<script(?![^>]*src=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = re.exec(indexHtml)) !== null) {
    total += m[1].length;
  }
  return total / 1024;
})();

if (styleBlocks === 0) {
  pass("No inline <style> blocks in index.html");
} else {
  warn(`index.html has ${styleBlocks} inline <style> block(s) — consider extracting to home.css`);
}

if (inlineScriptKB < 5) {
  pass(`Inline <script> content is ${inlineScriptKB.toFixed(1)} KB (non-JSON-LD)`);
} else {
  fail(`Inline <script> content is ${inlineScriptKB.toFixed(1)} KB — consider extracting to home.js`);
}

// Check fetchpriority on hero img
if (indexHtml.includes('fetchpriority="high"') && indexHtml.includes('heroBgImg')) {
  pass("Hero image has fetchpriority=\"high\"");
} else {
  fail("Hero image is missing fetchpriority=\"high\" — impacts LCP");
}

// Check external CSS link
if (indexHtml.includes('href="assets/css/home.css"')) {
  pass("home.css is linked from index.html");
} else {
  fail("home.css is not linked from index.html");
}

// Check external JS
if (indexHtml.includes('src="assets/js/home.js"')) {
  pass("home.js is linked from index.html");
} else {
  fail("home.js is not linked from index.html");
}

// 3. Image audit — look for large PNG files that should be WebP
console.log("\n🖼️   Image audit:");
const IMAGE_DIRS = [
  "public/assets/images/gallery",
  "public/assets/images/rooms",
  "public/images",
];
const PNG_MAX_KB = 400;
let imageIssues = 0;
for (const dir of IMAGE_DIRS) {
  let files;
  try {
    files = readdirSync(join(ROOT, dir));
  } catch {
    continue;
  }
  for (const file of files) {
    if (extname(file).toLowerCase() !== ".png") continue;
    if (file.includes("-400")) continue; // thumbnails are expected to be small
    const size = fileSize(`${dir}/${file}`);
    if (size !== null && size / 1024 > PNG_MAX_KB) {
      warn(`Large PNG: ${dir}/${file} (${kb(size)}) — consider WebP or compressing`);
      imageIssues++;
    }
  }
}
if (imageIssues === 0) {
  pass("No oversized PNG files found");
}

// ── Summary ─────────────────────────────────────────────────────────────────

console.log("\n" + "─".repeat(56));
if (failed === 0) {
  console.log(`✅  All checks passed.\n`);
} else {
  console.error(`❌  ${failed} check(s) failed. See above.\n`);
  process.exit(1);
}
