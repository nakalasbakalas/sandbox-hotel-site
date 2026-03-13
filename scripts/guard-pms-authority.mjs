import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const activePmsPath = path.join(repoRoot, "packages", "pms");
const packageJsonPath = path.join(repoRoot, "package.json");
const allowedDocsOnlyEntries = new Set(["README.md", "ARCHITECTURE.md"]);

function fail(message) {
  console.error(`[guard:pms-authority] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(activePmsPath)) {
  fail("packages/pms must exist as a docs-only authority stub.");
}

const topLevelEntries = fs.readdirSync(activePmsPath, { withFileTypes: true });
for (const entry of topLevelEntries) {
  if (entry.isDirectory()) {
    fail(`packages/pms must remain docs-only, but found directory "${entry.name}".`);
  }
  if (!allowedDocsOnlyEntries.has(entry.name)) {
    fail(`packages/pms must remain docs-only, but found unexpected file "${entry.name}".`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (Array.isArray(packageJson.workspaces) && packageJson.workspaces.includes("packages/pms")) {
  fail("package.json workspaces must not include packages/pms. The authoritative PMS lives in sandbox-pms.");
}

console.log("[guard:pms-authority] OK: brochure repo boundary is intact.");
