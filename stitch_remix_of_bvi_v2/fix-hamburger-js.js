/**
 * fix-hamburger-js.js
 *
 * Injects the missing openMobNav / closeMobNav / closeMobNavOutside
 * JS functions before </body> on every desktop page that has the
 * hamburger button but is missing the function definitions.
 */
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

const JS_BLOCK = `
<script>
function openMobNav(){document.getElementById('mob-nav').classList.add('open');document.body.style.overflow='hidden';}
function closeMobNav(){document.getElementById('mob-nav').classList.remove('open');document.body.style.overflow='';}
function closeMobNavOutside(e){if(e.target===document.getElementById('mob-nav'))closeMobNav();}
</script>
</body>`;

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

  // Only process pages that have the hamburger button but NOT the function
  const needsFix = html.includes('openMobNav()') && !html.includes('function openMobNav');
  if (!needsFix) continue;

  // Inject before </body>
  html = html.replace('</body>', JS_BLOCK);

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
    console.log('Fixed:', path.relative(ROOT, file));
  }
}

console.log(`\nDone. ${changed} files updated.`);
