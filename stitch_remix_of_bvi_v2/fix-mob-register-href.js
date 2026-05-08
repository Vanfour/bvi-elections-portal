/**
 * fix-mob-register-href.js
 *
 * After removing sh-register class from the mob-register-strip <a>,
 * the bvi-nav-wiring JS won't wire its href anymore.
 * This script sets the correct relative href directly in the HTML.
 */
const fs   = require('fs');
const path = require('path');

const ROOT         = __dirname;
const REGISTER_ABS = path.join(ROOT, 'voters', 'register', 'index.html');
const SKIP         = new Set(['index.html']); // homepage already hardcoded

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
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
  // Compute relative path from this file's directory to voters/register/index.html
  const fromDir    = path.dirname(file);
  const relPath    = path.relative(fromDir, REGISTER_ABS).replace(/\\/g, '/');

  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  // Find the mob-register-strip block and replace href="#" on the inner <a>
  // The anchor now has class="flex items-center..." (no sh-register)
  html = html.replace(
    /(<div class="mob-register-strip">\s*<a\s)href="#"(\s+class="(?!.*sh-register)[^"]*")/,
    (m, prefix, rest) => `${prefix}href="${relPath}"${rest}`
  );

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
    console.log(`Fixed href → ${relPath} : ${path.relative(ROOT, file)}`);
  } else {
    // Check if it was already set correctly
    const alreadySet = html.includes(`href="${relPath}"`);
    console.log(`${alreadySet ? 'Already OK' : 'NO MATCH'}: ${path.relative(ROOT, file)}`);
  }
}

console.log(`\nDone. ${changed}/${pages.length} files updated.`);
