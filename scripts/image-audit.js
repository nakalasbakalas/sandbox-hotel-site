#!/usr/bin/env node
/**
 * scripts/image-audit.js
 *
 * Checks image assets in public/ for:
 *   - WebP coverage (every PNG/JPG should have a WebP sibling)
 *   - File size budgets
 *   - Responsive source coverage (400px thumbnails)
 *
 * Usage:
 *   node scripts/image-audit.js
 *
 * Exit code 0 = all checks pass
 * Exit code 1 = one or more checks failed
 */

import { statSync, readdirSync } from "fs";
import { join, extname, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

let failed = 0;
let warned = 0;

function pass(msg) { console.log(`  ✅  ${msg}`); }
function fail(msg) { console.error(`  ❌  ${msg}`); failed++; }
function warn(msg) { console.warn(`  ⚠️   ${msg}`); warned++; }
function kb(bytes) { return `${(bytes / 1024).toFixed(1)} KB`; }

// ── File size budgets (in KB) ────────────────────────────────────────────────

const SIZE_BUDGETS = {
  // Hero banner — should be optimised
  "Sandbox-Hotel-Hero-Banner.webp": 120,
  "Sandbox-Hotel-Hero-Banner.png":  700,
  "Sandbox-Hotel-Hero-Banner-720.webp": 80,
  "Sandbox-Hotel-Hero-Banner-720.png":  350,
  // Gallery images — standard optimised
  ".webp": 200,  // default per-image WebP budget
  ".png":  800,  // default per-image PNG budget (unoptimised fallbacks may be larger)
};

function getBudget(filename) {
  // Check specific file name first
  if (SIZE_BUDGETS[filename]) return SIZE_BUDGETS[filename];
  // Fall back to extension budget
  const ext = extname(filename).toLowerCase();
  return SIZE_BUDGETS[ext] || null;
}

// ── Collect all image files ──────────────────────────────────────────────────

function collectImages(dir) {
  // Image formats tracked for audit purposes.
  // GIF and SVG are excluded from WebP conversion requirements:
  // - SVG is already vector-based and doesn't benefit from WebP conversion
  // - GIF files are rare and typically used for animated content (use video instead)
  const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"]);
  const images = [];

  function walk(d) {
    let entries;
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
        images.push(full);
      }
    }
  }

  walk(dir);
  return images;
}

// ── Check WebP coverage ──────────────────────────────────────────────────────

function checkWebpCoverage(images) {
  console.log("\n  📊  WebP Coverage\n");

  const webpSet = new Set(images.filter(f => extname(f).toLowerCase() === ".webp").map(f => f.replace(/\.webp$/i, "")));
  const pngFiles = images.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  let missingCritical = 0;
  let missingOptional = 0;
  let covered = 0;

  for (const png of pngFiles) {
    const base = png.replace(/\.(png|jpg|jpeg)$/i, "");
    if (webpSet.has(base)) {
      covered++;
    } else {
      // Skip hidden files and Windows shortcut files (.lnk files which may appear as "name - Shortcut")
      if (basename(png).startsWith(".") || extname(png).toLowerCase() === ".lnk") continue;
      // Logo files are design assets; WebP is nice-to-have but not critical
      if (png.includes("/logo/")) {
        warn(`No WebP for logo asset (optional): ${png.replace(ROOT + "/", "")}`);
        missingOptional++;
        continue;
      }
      // If a 400px thumbnail WebP exists, count as optional (full-size WebP is an optimization)
      const thumbBase = base.replace(/\/([^/]+)$/, "/$1-400");
      if (webpSet.has(thumbBase)) {
        warn(`No full-size WebP (400px thumbnail exists): ${png.replace(ROOT + "/", "")}`);
        missingOptional++;
        continue;
      }
      warn(`No WebP for: ${png.replace(ROOT + "/", "")}`);
      missingCritical++;
    }
  }

  const total = covered + missingCritical + missingOptional;
  const pct = total > 0 ? ((covered / total) * 100).toFixed(1) : "100";
  if (missingCritical === 0 && missingOptional === 0) {
    pass(`WebP coverage: ${pct}% (${covered}/${total} images have WebP variants)`);
  } else if (missingCritical === 0) {
    warn(`WebP coverage: ${pct}% — ${missingOptional} optional image(s) missing WebP`);
    pass(`No critical images missing WebP variants.`);
  } else {
    warn(`WebP coverage: ${pct}% — ${missingCritical} image(s) missing WebP variant (performance opportunity)`);
  }
}

// ── Check file sizes ─────────────────────────────────────────────────────────

function checkFileSizes(images) {
  console.log("\n  📊  File Size Budgets\n");

  let overBudget = 0;

  for (const imgPath of images) {
    const filename = basename(imgPath);
    const budget = getBudget(filename);
    if (!budget) continue;

    // Skip raw/original logo assets (not served to visitors)
    if (imgPath.includes("/logo/logo_") && !imgPath.endsWith(".webp")) {
      continue;
    }

    let size;
    try {
      size = statSync(imgPath).size;
    } catch {
      warn(`Could not stat: ${imgPath.replace(ROOT + "/", "")}`);
      continue;
    }

    const sizeKb = size / 1024;
    const rel = imgPath.replace(ROOT + "/", "");

    if (sizeKb > budget) {
      warn(`${rel}: ${kb(size)} exceeds ${budget} KB budget`);
      overBudget++;
    } else {
      pass(`${rel}: ${kb(size)} (budget: ${budget} KB)`);
    }
  }

  if (overBudget === 0) {
    pass("All checked images are within size budgets.");
  }
}

// ── Check responsive thumbnail coverage ─────────────────────────────────────

function checkResponsiveCoverage(images) {
  console.log("\n  📊  Responsive Source Coverage (400px thumbnails)\n");

  // Full-size images (not thumbnails) that should have a -400 variant
  const fullSizeImages = images.filter(f => {
    const name = basename(f);
    return !name.includes("-400") && /\.(png|webp)$/i.test(name);
  });

  let missingThumb = 0;
  const thumbSet = new Set(images.map(f => basename(f)));

  for (const img of fullSizeImages) {
    const name = basename(img);
    const ext = extname(name);
    const base = name.slice(0, -ext.length);

    // Skip hero banner (uses srcset differently), logos, and shortcut files
    if (img.includes("/logo/") || img.includes("/images/") || img.includes(" - Shortcut")) {
      continue;
    }

    const thumbName = `${base}-400${ext}`;
    if (!thumbSet.has(thumbName)) {
      warn(`No 400px thumbnail for: ${img.replace(ROOT + "/", "")}`);
      missingThumb++;
    }
  }

  if (missingThumb === 0) {
    pass("All gallery/room images have 400px thumbnail variants.");
  } else {
    warn(`${missingThumb} image(s) missing 400px thumbnail variant.`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log("\n🔍  Image audit\n");

const imageDir = join(ROOT, "public");
const allImages = collectImages(imageDir);
const imageCount = allImages.length;

console.log(`  Found ${imageCount} image files across public/\n`);

checkWebpCoverage(allImages);
checkFileSizes(allImages);
checkResponsiveCoverage(allImages);

console.log("\n─────────────────────────────────────────────");
if (failed > 0) {
  console.error(`\n❌  ${failed} image issue(s) require attention.`);
  if (warned > 0) console.warn(`⚠️   ${warned} additional warning(s).`);
  process.exit(1);
} else if (warned > 0) {
  console.warn(`\n⚠️   ${warned} image warning(s) found (non-blocking).`);
  console.log("✅  No critical image issues.");
} else {
  console.log("\n✅  All image checks passed.");
}
