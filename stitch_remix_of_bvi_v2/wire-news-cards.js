// wire-news-cards.js
// Links the 3 news cards to their detail pages across every index.html
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

// The 3 detail pages (absolute paths)
const DETAIL_ABS     = path.join(ROOT, 'poll-workers', 'news-detail',     'index.html');
const CANDIDATES_ABS = path.join(ROOT, 'poll-workers', 'news-candidates', 'index.html');
const SCHEDULE_ABS   = path.join(ROOT, 'poll-workers', 'news-schedule',   'index.html');

// Skip: the detail pages themselves (they already cross-link), code.html files
const SKIP_FILES = new Set([DETAIL_ABS, CANDIDATES_ABS, SCHEDULE_ABS]);

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else if (entry.name === 'index.html') results.push(full);
  }
  return results;
}

const files = walk(ROOT).filter(f => !SKIP_FILES.has(f));

// Relative path from a source file to a target absolute path
function rel(src, target) {
  return path.relative(path.dirname(src), target).replace(/\\/g, '/');
}

// Wire a specific news card:
// Finds the opening <a> tag that (a) contains href="#" and (b) is followed (within
// ~600 chars) by the given title string; replaces that href="#" with the target href.
function wireCard(html, title, targetHref) {
  // Match an <a ... href="#" ...> block whose next ~600 chars include the title
  // We look for <a followed eventually by href="#" on the same tag, then check
  // that the following content contains the title before the next </a>
  const titleEsc = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Strategy: replace href="#" only in <a> opening tags that precede the title
  // We do this in two passes with a stateful replacer
  let changed = false;

  // Find each <a ...href="#"...> opening tag, test whether the next 800 chars has the title
  html = html.replace(/<a([^>]*?)href="#"([^>]*?)>/g, (match, pre, post, offset) => {
    // Look ahead in the remaining HTML for the title (within ~800 chars)
    const ahead = html.slice(offset, offset + 800);
    if (ahead.includes(title)) {
      changed = true;
      return `<a${pre}href="${targetHref}"${post}>`;
    }
    return match;
  });

  return { html, changed };
}

let totalUpdated = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  let fileChanged = false;

  const d  = rel(file, DETAIL_ABS);
  const c  = rel(file, CANDIDATES_ABS);
  const s  = rel(file, SCHEDULE_ABS);

  let r;

  r = wireCard(html, 'New voter guidelines released', d);
  if (r.changed) { html = r.html; fileChanged = true; }

  r = wireCard(html, 'Important update for candidates', c);
  if (r.changed) { html = r.html; fileChanged = true; }

  // Some pages use "Important update for candidates" but others use slightly different text
  r = wireCard(html, 'Update for candidates', c);
  if (r.changed) { html = r.html; fileChanged = true; }

  r = wireCard(html, 'Changes in election schedule', s);
  if (r.changed) { html = r.html; fileChanged = true; }

  if (fileChanged) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('✓ ' + path.relative(ROOT, file));
    totalUpdated++;
  }
}

console.log('\nDone — ' + totalUpdated + ' file(s) updated.');
