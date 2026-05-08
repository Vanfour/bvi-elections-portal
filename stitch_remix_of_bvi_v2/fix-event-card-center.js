/**
 * fix-event-card-center.js
 * Centers the Right Content section of the blue event card on mobile.
 * Fixes: Right div alignment, date row centering, button style on all candidate pages.
 */
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

const PAGES = [
  'candidates/campaign-finance/index.html',
  'candidates/election-results/index.html',
  'candidates/faqs/index.html',
  'candidates/key-actions/index.html',
  'candidates/news-notices/index.html',
  'candidates/upcoming-elections/index.html',
  'candidates/voting-day/index.html',
];

const REPLACEMENTS = [
  // 1. Left div: remove flex-1 if still present
  [
    /class="flex-1 w-full">/g,
    'class="w-full">'
  ],
  // 2. Right Content div: old justify-center / no items-center → centered on mobile
  [
    /class="flex-1 w-full flex flex-col justify-center self-stretch">/g,
    'class="w-full flex flex-col items-center lg:items-start self-stretch mt-4 lg:mt-0">'
  ],
  // 3. Right Content div variant (already has w-full but missing items-center)
  [
    /class="w-full flex flex-col justify-center self-stretch">/g,
    'class="w-full flex flex-col items-center lg:items-start self-stretch mt-4 lg:mt-0">'
  ],
  // 4. Date row: add text-center lg:text-left
  [
    /class="flex items-start gap-4 mb-4 md:mb-8">/g,
    'class="flex items-start gap-4 mb-4 md:mb-8 text-center lg:text-left">'
  ],
  // 5. Calendar icon: ensure shown on xs too for centering (show always)
  [
    /class="material-symbols-outlined text-white text-3xl font-bold hidden sm:block mt-1">calendar_today/g,
    'class="material-symbols-outlined text-white text-3xl font-bold mt-1">calendar_today'
  ],
  // 6. Old Prepare to run button (inline style variant)
  [
    /class="bg-\[#E03C31\] text-white px-4 md:px-8 py-3\.5 rounded-lg font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md" style="display:inline-flex;align-items:center;">Prepare to run/g,
    'class="bg-[#E03C31] text-white w-full sm:w-auto px-4 md:px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center">Prepare to Run'
  ],
  // 7. Any remaining old red button style
  [
    /class="bg-\[#E03C31\] text-white px-4 md:px-8 py-3\.5 rounded-lg font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md inline-flex items-center justify-center"/g,
    'class="bg-[#E03C31] text-white w-full sm:w-auto px-4 md:px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center"'
  ],
];

let totalChanged = 0;

for (const relPath of PAGES) {
  const file = path.join(ROOT, relPath);
  if (!fs.existsSync(file)) {
    console.log('SKIP (not found):', relPath);
    continue;
  }

  let html = fs.readFileSync(file, 'utf8');
  const orig = html;

  for (const [pattern, replacement] of REPLACEMENTS) {
    html = html.replace(pattern, replacement);
  }

  if (html !== orig) {
    fs.writeFileSync(file, html, 'utf8');
    totalChanged++;
    console.log('Fixed:', relPath);
  } else {
    console.log('No change:', relPath);
  }
}

console.log(`\nDone. ${totalChanged}/${PAGES.length} files updated.`);
