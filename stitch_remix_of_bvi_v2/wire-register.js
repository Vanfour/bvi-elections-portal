// wire-register.js
// Updates all HTML files so the sh-register button links to voters/register/index.html
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

// Resolve all index.html files recursively
function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else if (entry.name === 'index.html') results.push(full);
  }
  return results;
}

const files = walk(ROOT);

// Relative path from a given HTML file to voters/register/index.html
function relToRegister(htmlFile) {
  const registerAbs = path.join(ROOT, 'voters', 'register', 'index.html');
  return path.relative(path.dirname(htmlFile), registerAbs).replace(/\\/g, '/');
}

let updated = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const rel = relToRegister(file);

  // Pattern: the nav-wiring condition for sh-register pointing to L.voters (or L.voters with &&)
  // We replace it to point to the register page directly
  const oldPattern = /else if\(\/REGISTER\/\.test\(t\)&&a\.classList\.contains\('sh-register'\)(?:&&L\.voters)?\)\s*a\.href=L\.voters;/g;
  const newCode    = `else if(/REGISTER/.test(t)&&a.classList.contains('sh-register')) a.href='${rel}';`;

  if (oldPattern.test(html)) {
    html = html.replace(oldPattern, newCode);
    fs.writeFileSync(file, html, 'utf8');
    console.log('✓ ' + path.relative(ROOT, file));
    updated++;
  }
}

console.log('\nDone — updated ' + updated + ' file(s).');
