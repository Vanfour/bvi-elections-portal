/**
 * fix-hide-header-register-mobile.js
 *
 * On mobile (≤640px) the header .sh-register button AND the mob-register-strip
 * both show, creating a duplicate. Since the mob-register-strip anchor no longer
 * has the sh-register class, hiding .sh-register at ≤640px will ONLY remove
 * the header button, leaving the strip visible.
 *
 * Replaces:
 *   .sh-register { padding: 0.375rem 0.875rem; font-size: 10px; }
 * With:
 *   .sh-register { display: none !important; }
 *
 * in every @media (max-width: 640px) block across all index.html files.
 */
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules'].includes(entry.name)) continue;
      walk(full, results);
    } else if (entry.name === 'index.html') {
      results.push(full);
    }
  }
  return results;
}

const pages = walk(ROOT);
let changed = 0;

for (const file of pages) {
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  // Pattern 1: subpages injected by make-responsive.js (single-line media block)
  html = html.replace(
    /(@media \(max-width: 640px\) \{[^}]*?)\.sh-register \{ padding: [^}]+; font-size: [^}]+; \}/g,
    '$1.sh-register { display: none !important; }'
  );

  // Pattern 2: homepage multi-line style block
  html = html.replace(
    /\.sh-register \{ padding: 0\.375rem 0\.875rem; font-size: 10px; \} \/\* compact on mobile \*\//g,
    '.sh-register { display: none !important; }'
  );

  // Pattern 3: any remaining compact variant
  html = html.replace(
    /\.sh-register \{ padding: 0\.375rem 0\.875rem; font-size: 10px; \}/g,
    '.sh-register { display: none !important; }'
  );

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
    console.log('Fixed:', path.relative(ROOT, file));
  }
}

console.log(`\nDone. ${changed}/${pages.length} files updated.`);
