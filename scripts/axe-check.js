import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { JSDOM } from 'jsdom';
import axe from 'axe-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const HTML_PATH = join(__dirname, '../public/index.html');
const html = readFileSync(HTML_PATH, 'utf8');

// Create a jsdom instance pointing at the production URL so relative-URL
// resolution inside jsdom works correctly.
const dom = new JSDOM(html, { url: 'https://www.sandboxhotel.com/' });
const { window } = dom;

// Inject axe-core into the jsdom window context.
// axe.source is the full self-contained axe bundle as a string.
window.eval(axe.source);

// Run axe against the parsed document using the jsdom window's axe instance.
const results = await new Promise((resolve, reject) => {
  window.axe.run(
    dom.window.document,
    {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      },
    },
    (err, res) => (err ? reject(err) : resolve(res))
  );
});

const critical = results.violations.filter(
  (v) => v.impact === 'critical' || v.impact === 'serious'
);

if (critical.length > 0) {
  console.error(
    `\naxe-check: ${critical.length} critical/serious violation(s) found in public/index.html\n`
  );
  for (const v of critical) {
    console.error(`  [${v.impact.toUpperCase()}] ${v.id}`);
    console.error(`  Description : ${v.description}`);
    console.error(`  Help        : ${v.helpUrl}`);
    for (const n of v.nodes) {
      console.error(`  Node        : ${n.html.slice(0, 140)}`);
    }
    console.error('');
  }
  process.exit(1);
}

console.log(
  `axe-check passed — ${results.violations.length} total violation(s), none critical/serious.`
);
