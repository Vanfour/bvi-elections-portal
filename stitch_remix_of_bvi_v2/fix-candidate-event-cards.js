/**
 * fix-candidate-event-cards.js
 *
 * Matches the blue event countdown card on all remaining candidate desktop
 * pages to the voters/upcoming-events-v2 style:
 * - Responsive heading (text-2xl md:text-3xl, centered on mobile)
 * - grid grid-cols-4 countdown (no flex-wrap)
 * - Compact boxes on mobile (p-2 md:p-4, text-2xl md:text-4xl)
 * - Full-width stacked buttons on mobile (flex-col sm:flex-row)
 */
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

const PAGES = [
  'candidates/campaign-finance/index.html',
  'candidates/candidate-requirements/index.html',
  'candidates/election-process/index.html',
  'candidates/election-results/index.html',
  'candidates/faqs/index.html',
  'candidates/key-actions/index.html',
  'candidates/news-notices/index.html',
  'candidates/forms-documents/index.html',
  'candidates/contact-office/index.html',
  'candidates/prepare-to-run/index.html',
  'candidates/no-election/index.html',
];

const REPLACEMENTS = [
  // 1. Outer card container padding + flex
  [
    /relative p-8 pl-4 md:pl-12 lg:pl-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16/g,
    'relative p-6 md:p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-4 md:gap-8 lg:gap-16'
  ],
  // 2. Left div (flex-1 w-full → w-full)
  [
    /<!-- Left Content: Countdown Timer -->\n<div class="flex-1 w-full">/g,
    '<!-- Left Content: Countdown Timer -->\n<div class="w-full">'
  ],
  // 3. Heading: text-3xl → text-2xl md:text-3xl, mb-8 → mb-4 md:mb-8, add centered + change text
  [
    /<h2 class="text-3xl font-black text-white font-headline mb-8">Next Election: <span class="font-normal text-slate-300">General Election<\/span><\/h2>/g,
    '<h2 class="text-2xl md:text-3xl font-black text-white font-headline mb-4 md:mb-8 text-center lg:text-left">Election Day <span class="font-normal text-slate-300">is in</span></h2>'
  ],
  // 4. Countdown container: flex flex-wrap gap-4 → grid grid-cols-4 gap-3 md:gap-4
  [
    /<div class="flex flex-wrap gap-4">/g,
    '<div class="grid grid-cols-4 gap-3 md:gap-4">'
  ],
  // 5. Countdown boxes: p-4 min-w-[85px] → p-2 md:p-4
  [
    /bg-white\/5 border border-white\/10 backdrop-blur-sm rounded-xl p-4 min-w-\[85px\] text-center shadow-sm/g,
    'bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-2 md:p-4 text-center shadow-sm'
  ],
  // 6. Numbers: text-4xl → text-2xl md:text-4xl, mb-2 → mb-1 md:mb-2
  [
    /block text-4xl font-black text-white leading-none mb-2/g,
    'block text-2xl md:text-4xl font-black text-white leading-none mb-1 md:mb-2'
  ],
  // 7. Labels: text-[10px] tracking-[0.15em] → text-[8px] md:text-[10px] tracking-wider md:tracking-[0.15em]
  [
    /text-\[10px\] font-bold text-slate-400 uppercase tracking-\[0\.15em\]/g,
    'text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider md:tracking-[0.15em]'
  ],
  // 8. Right div container
  [
    /<!-- Right Content -->\n<div class="flex-1 w-full flex flex-col justify-center self-stretch">/g,
    '<!-- Right Content -->\n<div class="w-full flex flex-col items-center lg:items-start self-stretch mt-4 lg:mt-0">'
  ],
  // 9. Date row: flex gap-4 mb-4 items-center → flex items-start gap-4 mb-4 md:mb-8
  [
    /<div class="flex gap-4 mb-4 items-center">/g,
    '<div class="flex items-start gap-4 mb-4 md:mb-8">'
  ],
  // 10. Calendar icon: hide on xs
  [
    /<span class="material-symbols-outlined text-white text-3xl font-bold">calendar_today<\/span>/g,
    '<span class="material-symbols-outlined text-white text-3xl font-bold hidden sm:block mt-1">calendar_today</span>'
  ],
  // 11. Date text size
  [
    /<span class="text-xl font-black text-white">Monday, November 25, 2024<\/span>/g,
    '<span class="text-lg md:text-xl font-black text-white">Monday, Nov 25, 2024</span>\n<span class="text-sm font-bold text-slate-300 mt-1">Polls open 6:00 AM – 6:00 PM</span>'
  ],
  // 12. Button container: flex flex-wrap gap-3 → flex flex-col sm:flex-row gap-4 w-full
  [
    /<div class="flex flex-wrap gap-3">/g,
    '<div class="flex flex-col sm:flex-row gap-4 w-full">'
  ],
  // 13. Red CTA buttons: old style → new full-width mobile style
  [
    /bg-\[#E03C31\] text-white px-4 md:px-8 py-3\.5 rounded-lg font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md inline-flex items-center/g,
    'bg-[#E03C31] text-white w-full sm:w-auto px-4 md:px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all shadow-lg flex items-center justify-center'
  ],
  // 14. Border outline buttons (Add to Calendar style)
  [
    /border-2 border-white border-opacity-30 text-white px-6 py-3\.5 rounded-lg font-black text-xs uppercase tracking-wider hover:bg-white\/5 active:scale-95 transition-all flex items-center gap-2" style="display:inline-flex;align-items:center;gap:0\.5rem;"/g,
    'border-2 border-white/30 text-white w-full sm:w-auto px-6 py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"'
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
