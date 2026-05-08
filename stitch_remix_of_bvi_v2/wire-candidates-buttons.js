// wire-candidates-buttons.js
// Wires "Prepare to run" and "Add to Calendar" buttons in all desktop candidates pages
const fs   = require('fs');
const path = require('path');

const ROOT        = __dirname;
const CANDIDATES  = path.join(ROOT, 'candidates');

// Desktop-only folders (skip mobile variants)
const SKIP = new Set([
  'election-results-mobile','faqs-mobile','key-actions-mobile',
  'news-notices-mobile','no-election-mobile','upcoming-elections-mobile',
  'voting-day-mobile','prepare-to-run'   // prepare-to-run already done; itself has no hero buttons
]);

const folders = fs.readdirSync(CANDIDATES, { withFileTypes: true })
  .filter(e => e.isDirectory() && !SKIP.has(e.name))
  .map(e => path.join(CANDIDATES, e.name, 'index.html'))
  .filter(f => fs.existsSync(f));

let updated = 0;

for (const file of folders) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  // ── 1. Wire "Prepare to run" button ─────────────────────────────────────
  // Pattern: unwired button (no onclick) with text "Prepare to run"
  const prepareOld = /<button([^>]*)>Prepare to run<\/button>/g;
  if (prepareOld.test(html)) {
    html = html.replace(
      /<button([^>]*)>Prepare to run<\/button>/g,
      '<a href="../prepare-to-run/index.html"$1 style="display:inline-flex;align-items:center;">Prepare to run</a>'
    );
    changed = true;
  }

  // ── 2. Wire "Add to Calendar" button ────────────────────────────────────
  // Pattern: unwired button (no onclick) containing "Add to Calendar"
  // Replace with an <a download> pointing to the .ics one level up (candidates/)
  const calOld = /<button([^>]*)>\s*(<span[^<]*<\/span>\s*)?Add to Calendar\s*<\/button>/g;
  if (calOld.test(html)) {
    html = html.replace(
      /<button([^>]*)>(\s*(?:<span[^<]*<\/span>\s*)?)Add to Calendar\s*<\/button>/g,
      '<a href="../election-day-2024.ics" download$1 style="display:inline-flex;align-items:center;gap:0.5rem;">$2Add to Calendar</a>'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('✓ ' + path.relative(ROOT, file));
    updated++;
  } else {
    console.log('– skip (no match): ' + path.relative(ROOT, file));
  }
}

console.log('\nDone — updated ' + updated + ' file(s).');
