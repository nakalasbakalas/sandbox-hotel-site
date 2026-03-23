#!/usr/bin/env node
/**
 * scripts/axe-check.js
 *
 * Static accessibility audit using axe-core + jsdom.
 * Parses HTML files from public/ and runs axe rules against each page.
 *
 * Usage:
 *   node scripts/axe-check.js
 *
 * Exit code 0 = all checks pass (or only best-practice warnings)
 * Exit code 1 = critical/serious accessibility violations found
 */

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { JSDOM, VirtualConsole } from "jsdom";
import axe from "axe-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

let totalViolations = 0;
let totalWarnings = 0;

// Pages to audit (relative to repo root)
const PAGES = [
  { path: "public/index.html", name: "Homepage" },
  { path: "public/404.html", name: "404 Page" },
  { path: "public/privacy.html", name: "Privacy Page" },
  { path: "public/hotels/nakhon-si-thammarat/index.html", name: "Hotels: Nakhon Si Thammarat" },
  { path: "public/hotels/southern-thailand/index.html", name: "Hotels: Southern Thailand" },
  { path: "public/hotels/thailand/index.html", name: "Hotels: Thailand" },
  { path: "public/guides/best-hotels-in-nakhon-si-thammarat/index.html", name: "Guide: Best Hotels NST" },
  { path: "public/guides/where-to-stay-in-nakhon-si-thammarat/index.html", name: "Guide: Where to Stay NST" },
];

// Impact levels that cause a non-zero exit code
const BLOCKING_IMPACTS = new Set(["critical", "serious"]);

async function auditPage(pageInfo) {
  const html = readFileSync(join(ROOT, pageInfo.path), "utf8");

  // Create a jsdom instance with axe-core source injected as a global script
  const axeSource = readFileSync(
    join(ROOT, "node_modules/axe-core/axe.min.js"),
    "utf8"
  );

  const virtualConsole = new VirtualConsole();
  // Suppress external resource errors (network not available in static audit)
  virtualConsole.on("jsdomError", () => {});

  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    resources: "usable",
    url: "https://www.sandboxhotel.com/",
    virtualConsole,
    beforeParse(window) {
      // Inject axe-core before the page scripts run
      window.eval(axeSource);
    },
  });

  const { window } = dom;

  // Wait for DOM to settle
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Run axe with rules appropriate for static HTML audit
  const results = await window.axe.run(window.document, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "best-practice"],
    },
    rules: {
      // Skip rules that require live server/JS execution
      "color-contrast": { enabled: false },
      "scrollable-region-focusable": { enabled: false },
    },
  });

  const violations = results.violations || [];
  const incomplete = results.incomplete || [];

  let pageViolations = 0;
  let pageWarnings = 0;

  if (violations.length === 0 && incomplete.length === 0) {
    console.log(`  ✅  ${pageInfo.name} — no violations`);
    return;
  }

  console.log(`\n  📄  ${pageInfo.name} (${pageInfo.path})`);

  for (const v of violations) {
    const isBlocking = BLOCKING_IMPACTS.has(v.impact);
    const icon = isBlocking ? "❌" : "⚠️ ";
    console.log(`    ${icon} [${v.impact.toUpperCase()}] ${v.id}: ${v.help}`);
    console.log(`       ${v.helpUrl}`);
    for (const node of v.nodes.slice(0, 3)) {
      console.log(`       → ${node.html.slice(0, 120)}`);
    }
    if (isBlocking) {
      pageViolations++;
    } else {
      pageWarnings++;
    }
  }

  if (incomplete.length > 0) {
    console.log(`    ℹ️  ${incomplete.length} needs-review item(s) (manual check required)`);
  }

  totalViolations += pageViolations;
  totalWarnings += pageWarnings;
}

async function main() {
  console.log("\n🔍  axe-core accessibility audit\n");

  for (const page of PAGES) {
    try {
      await auditPage(page);
    } catch (err) {
      console.error(`  ❌  ${page.name}: audit error — ${err.message}`);
      totalViolations++;
    }
  }

  console.log("\n─────────────────────────────────────────────");
  if (totalViolations > 0) {
    console.error(`\n❌  ${totalViolations} critical/serious violation(s) found across all pages.`);
    if (totalWarnings > 0) {
      console.warn(`⚠️   ${totalWarnings} moderate/minor warning(s) also found.`);
    }
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.warn(`\n⚠️   ${totalWarnings} moderate/minor warning(s) found (non-blocking).`);
    console.log("✅  No critical/serious violations.");
  } else {
    console.log("\n✅  All pages passed accessibility audit.");
  }
}

main().catch((err) => {
  console.error("Audit failed:", err);
  process.exit(1);
});
