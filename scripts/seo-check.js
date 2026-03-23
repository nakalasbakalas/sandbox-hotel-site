#!/usr/bin/env node
/**
 * scripts/seo-check.js
 *
 * Static SEO validation for the Sandbox Hotel site.
 * Checks HTML pages for required meta tags, schema markup, hreflang,
 * and canonical URLs.
 *
 * Usage:
 *   node scripts/seo-check.js
 *
 * Exit code 0 = all checks pass
 * Exit code 1 = one or more critical checks failed
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

let failed = 0;
let warned = 0;

function pass(msg) { console.log(`  ✅  ${msg}`); }
function fail(msg) { console.error(`  ❌  ${msg}`); failed++; }
function warn(msg) { console.warn(`  ⚠️   ${msg}`); warned++; }

// ── Pages to audit ──────────────────────────────────────────────────────────

const PAGES = [
  {
    path: "public/index.html",
    name: "Homepage",
    checks: {
      requireHreflang: ["th", "en", "zh-Hans", "x-default"],
      requireJsonLd: ["Hotel", "WebSite", "FAQPage", "BreadcrumbList"],
      requireOgLocale: true,
      requireCanonical: true,
    },
  },
  {
    path: "public/privacy.html",
    name: "Privacy Policy",
    checks: {
      requireCanonical: true,
    },
  },
  {
    path: "public/404.html",
    name: "404 Page",
    checks: {},
  },
  {
    path: "public/hotels/nakhon-si-thammarat/index.html",
    name: "Hotels: Nakhon Si Thammarat",
    checks: {
      requireHreflang: ["en", "th", "x-default"],
      requireJsonLd: ["LodgingBusiness", "BreadcrumbList"],
      requireCanonical: true,
    },
  },
  {
    path: "public/hotels/southern-thailand/index.html",
    name: "Hotels: Southern Thailand",
    checks: {
      requireHreflang: ["en", "x-default"],
      requireJsonLd: ["LodgingBusiness", "BreadcrumbList"],
      requireCanonical: true,
    },
  },
  {
    path: "public/hotels/thailand/index.html",
    name: "Hotels: Thailand",
    checks: {
      requireHreflang: ["en", "x-default"],
      requireJsonLd: ["LodgingBusiness", "BreadcrumbList"],
      requireCanonical: true,
    },
  },
  {
    path: "public/guides/best-hotels-in-nakhon-si-thammarat/index.html",
    name: "Guide: Best Hotels NST",
    checks: {
      requireJsonLd: ["Article", "BreadcrumbList"],
      requireCanonical: true,
    },
  },
  {
    path: "public/guides/where-to-stay-in-nakhon-si-thammarat/index.html",
    name: "Guide: Where to Stay NST",
    checks: {
      requireJsonLd: ["Article", "BreadcrumbList"],
      requireCanonical: true,
    },
  },
];

// ── Helper extractors ────────────────────────────────────────────────────────

function extractMeta(html, property) {
  const re = new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`, "i");
  return (re.exec(html) || re2.exec(html) || [])[1] || null;
}

function extractTitle(html) {
  return (/<title[^>]*>([^<]+)<\/title>/i.exec(html) || [])[1] || null;
}

function extractH1s(html) {
  const re = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  const results = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    results.push(m[1].replace(/<[^>]+>/g, "").trim());
  }
  return results;
}

function extractHreflang(html) {
  const re = /<link[^>]+hreflang=["']([^"']+)["'][^>]*>/gi;
  const langs = [];
  let m;
  while ((m = re.exec(html)) !== null) langs.push(m[1]);
  return langs;
}

function extractJsonLdTypes(html) {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const types = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const obj = JSON.parse(m[1]);
      const t = obj["@type"];
      if (Array.isArray(t)) types.push(...t);
      else if (t) types.push(t);
    } catch {
      // ignore malformed JSON-LD
    }
  }
  return types;
}

function extractCanonical(html) {
  return (/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html) ||
    /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i.exec(html) ||
    [])[1] || null;
}

// ── Audit each page ──────────────────────────────────────────────────────────

function auditPage(pageInfo) {
  const html = readFileSync(join(ROOT, pageInfo.path), "utf8");
  const { checks, name } = pageInfo;

  console.log(`\n  📄  ${name}`);

  // Title
  const title = extractTitle(html);
  if (!title) {
    fail(`${name}: missing <title>`);
  } else if (title.length > 70) {
    warn(`${name}: title is ${title.length} chars (recommended ≤70): "${title}"`);
  } else {
    pass(`title: "${title}"`);
  }

  // Meta description
  const desc = extractMeta(html, "description");
  if (!desc) {
    fail(`${name}: missing <meta name="description">`);
  } else if (desc.length > 160) {
    warn(`${name}: meta description is ${desc.length} chars (recommended ≤160)`);
  } else {
    pass(`meta description: ${desc.length} chars`);
  }

  // OG title + description
  const ogTitle = extractMeta(html, "og:title");
  const ogDesc = extractMeta(html, "og:description");
  if (!ogTitle) fail(`${name}: missing og:title`);
  else pass("og:title present");
  if (!ogDesc) fail(`${name}: missing og:description`);
  else pass("og:description present");

  // OG image
  const ogImage = extractMeta(html, "og:image");
  const ogImageAlt = extractMeta(html, "og:image:alt");
  if (!ogImage) fail(`${name}: missing og:image`);
  else pass("og:image present");
  if (!ogImageAlt) warn(`${name}: missing og:image:alt (social accessibility)`);
  else pass("og:image:alt present");

  // og:locale
  if (checks.requireOgLocale) {
    const ogLocale = extractMeta(html, "og:locale");
    if (!ogLocale) fail(`${name}: missing og:locale`);
    else pass(`og:locale: ${ogLocale}`);
  }

  // Canonical
  if (checks.requireCanonical) {
    const canonical = extractCanonical(html);
    if (!canonical) fail(`${name}: missing <link rel="canonical">`);
    else if (!canonical.startsWith("https://")) warn(`${name}: canonical is not HTTPS: ${canonical}`);
    else pass(`canonical: ${canonical}`);
  }

  // hreflang
  if (checks.requireHreflang && checks.requireHreflang.length > 0) {
    const langs = extractHreflang(html);
    for (const lang of checks.requireHreflang) {
      if (!langs.includes(lang)) {
        fail(`${name}: missing hreflang="${lang}"`);
      } else {
        pass(`hreflang "${lang}" present`);
      }
    }
  }

  // JSON-LD types
  if (checks.requireJsonLd && checks.requireJsonLd.length > 0) {
    const types = extractJsonLdTypes(html);
    // schema.org subtype equivalences: Hotel is a LodgingBusiness, etc.
    const SUBTYPES = {
      LodgingBusiness: ["Hotel", "Motel", "BedAndBreakfast", "Hostel", "Resort"],
    };
    for (const t of checks.requireJsonLd) {
      const equivalents = SUBTYPES[t] || [];
      if (!types.includes(t) && !equivalents.some(s => types.includes(s))) {
        warn(`${name}: JSON-LD type "${t}" not found (types found: ${types.join(", ") || "none"})`);
      } else {
        pass(`JSON-LD @type "${t}" present`);
      }
    }
  }

  // H1
  const h1s = extractH1s(html);
  if (h1s.length === 0) {
    fail(`${name}: no <h1> found`);
  } else if (h1s.length > 1) {
    warn(`${name}: multiple <h1> tags (${h1s.length}) — ensure only one is visible`);
  } else {
    pass(`H1: "${h1s[0].slice(0, 80)}"`);
  }
}

// ── Sitemap checks ───────────────────────────────────────────────────────────

function auditSitemap() {
  console.log("\n  📄  sitemap.xml");

  let xml;
  try {
    xml = readFileSync(join(ROOT, "public/sitemap.xml"), "utf8");
  } catch {
    fail("sitemap.xml not found");
    return;
  }

  const urlCount = (xml.match(/<loc>/g) || []).length;
  if (urlCount === 0) {
    fail("sitemap.xml: no <loc> entries found");
  } else {
    pass(`sitemap.xml: ${urlCount} URL(s) found`);
  }

  if (!xml.includes("hreflang")) {
    warn("sitemap.xml: no hreflang entries (xhtml:link) — consider adding for multilingual pages");
  } else {
    pass("sitemap.xml: hreflang entries present");
  }

  if (!xml.includes("<image:image>")) {
    warn("sitemap.xml: no <image:image> entries — consider adding for Google Image indexation");
  } else {
    pass("sitemap.xml: image entries present");
  }
}

// ── robots.txt check ─────────────────────────────────────────────────────────

function auditRobots() {
  console.log("\n  📄  robots.txt");

  let txt;
  try {
    txt = readFileSync(join(ROOT, "public/robots.txt"), "utf8");
  } catch {
    fail("robots.txt not found");
    return;
  }

  if (!txt.includes("Sitemap:")) {
    warn("robots.txt: missing Sitemap: directive");
  } else {
    pass("robots.txt: Sitemap directive present");
  }

  if (txt.includes("Disallow: /")) {
    warn("robots.txt: blanket Disallow found — verify this is intentional");
  } else {
    pass("robots.txt: no blanket Disallow");
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log("\n🔍  SEO validation\n");

for (const page of PAGES) {
  try {
    auditPage(page);
  } catch (err) {
    fail(`${page.name}: could not read file — ${err.message}`);
  }
}

auditSitemap();
auditRobots();

console.log("\n─────────────────────────────────────────────");
if (failed > 0) {
  console.error(`\n❌  ${failed} SEO issue(s) require attention.`);
  if (warned > 0) console.warn(`⚠️   ${warned} additional warning(s).`);
  process.exit(1);
} else if (warned > 0) {
  console.warn(`\n⚠️   ${warned} SEO warning(s) found (non-blocking).`);
  console.log("✅  No critical SEO issues.");
} else {
  console.log("\n✅  All SEO checks passed.");
}
