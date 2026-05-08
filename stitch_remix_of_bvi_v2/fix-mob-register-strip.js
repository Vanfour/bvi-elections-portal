/**
 * fix-mob-register-strip.js
 *
 * Fixes the mob-register-strip <a> in all subpages so it no longer has the
 * `sh-register` class (which adds margin-left and padding overrides that break
 * the full-width strip layout on mobile). Matches the homepage pattern exactly.
 *
 * Also adds !important to the @media display:block rule to guarantee visibility.
 */
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;
const SKIP = new Set(['index.html']); // homepage is already correct

// ── Helpers ────────────────────────────────────────────────────────────────
function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip mobile/compact folders
      if (['compact-mobile','mobile','node_modules'].includes(entry.name)) continue;
      walk(full, results);
    } else if (entry.name === 'index.html' && !SKIP.has(path.relative(ROOT, full).replace(/\\/g,'/'))) {
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

  // 1. Remove `sh-register` from the mob-register-strip <a> class list.
  //    Pattern: inside <!-- Mobile Register Strip --> block, the <a> has sh-register in its class.
  //    We look for the anchor INSIDE a .mob-register-strip div.
  html = html.replace(
    /(<!-- Mobile Register Strip -->\s*<div class="mob-register-strip">\s*<a\s[^>]*?)class="sh-register ([^"]+)"/,
    (m, prefix, rest) => `${prefix}class="${rest}"`
  );

  // Also handle if sh-register appears at the END of the class list
  html = html.replace(
    /(<!-- Mobile Register Strip -->\s*<div class="mob-register-strip">\s*<a\s[^>]*?)class="([^"]+)\ssh-register"/,
    (m, prefix, rest) => `${prefix}class="${rest}"`
  );

  // 2. Add !important to the mob-register-strip display:block rule
  html = html.replace(
    /@media \(max-width: 640px\) \{ \.mob-register-strip \{ display: block; \} \}/g,
    '@media (max-width: 640px) { .mob-register-strip { display: block !important; } }'
  );

  // 3. Also remove the sh-register class if it appears in the mob-register-strip
  //    in a more relaxed pattern (in case the comment is missing)
  html = html.replace(
    /(<div class="mob-register-strip">\s*<a\s[^>]*?)class="sh-register ([^"]+)"/,
    (m, prefix, rest) => `${prefix}class="${rest}"`
  );
  html = html.replace(
    /(<div class="mob-register-strip">\s*<a\s[^>]*?)class="([^"]+)\ssh-register"/,
    (m, prefix, rest) => `${prefix}class="${rest}"`
  );

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
    console.log('Fixed:', path.relative(ROOT, file));
  } else {
    console.log('Skip (no change needed):', path.relative(ROOT, file));
  }
}

console.log(`\nDone. ${changed}/${pages.length} files updated.`);
