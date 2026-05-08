// make-responsive.js  v2  — correct injection + safe responsive transforms
const fs   = require('fs');
const path = require('path');
const ROOT = __dirname;

// ── Target pages (absolute) ──────────────────────────────────────────────────
const TARGETS = {
  voters:         path.join(ROOT,'voters','upcoming-events-v1','index.html'),
  candidates:     path.join(ROOT,'candidates','upcoming-elections','index.html'),
  pollWorkers:    path.join(ROOT,'poll-workers','layout-1','index.html'),
  importantDates: path.join(ROOT,'important-dates','index.html'),
  electionResults:path.join(ROOT,'election-results','index.html'),
  newsPolicies:   path.join(ROOT,'news-policies','index.html'),
  register:       path.join(ROOT,'voters','register','index.html'),
};

// ── Skip list ────────────────────────────────────────────────────────────────
// Skip mobile-only pages and the homepage (already done)
const SKIP_DIR_NAMES = new Set([
  'election-results-mobile','faqs-mobile','key-actions-mobile',
  'news-notices-mobile','no-election-mobile','upcoming-elections-mobile',
  'voting-day-mobile','compact-mobile',
]);
const SKIP_FILES = new Set([ path.join(ROOT,'index.html') ]);

function walk(dir, res=[]) {
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP_DIR_NAMES.has(e.name)) walk(full, res);
    } else if (e.name === 'index.html') res.push(full);
  }
  return res;
}

function rel(src, target) {
  return path.relative(path.dirname(src), target).replace(/\\/g,'/');
}

// ── CSS to inject (only missing pieces — pages already have mob-register CSS) ─
const MOBILE_NAV_CSS = `
  /* ── Mobile hamburger ────────────────────────────────────────────────────── */
  .mob-menu-btn {
    display: none; background: none; border: none; cursor: pointer;
    color: #00205B; padding: 0.25rem; margin-left: 0.75rem; transition: color 0.15s;
  }
  .mob-menu-btn:hover { color: #E03C31; }
  @media (max-width: 1023px) { .mob-menu-btn { display: flex; align-items: center; } }
  /* ── Mobile nav overlay ──────────────────────────────────────────────────── */
  #mob-nav { display: none; position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.4); backdrop-filter: blur(2px); }
  #mob-nav.open { display: block; }
  #mob-nav-panel { position: absolute; top: 0; right: 0; bottom: 0; width: min(320px,85vw); background: #fff; box-shadow: -8px 0 32px rgba(0,0,0,0.15); display: flex; flex-direction: column; overflow-y: auto; }
  .mob-nav-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
  .mob-nav-title { font-size: 12px; font-weight: 900; color: #00205B; text-transform: uppercase; letter-spacing: 0.08em; }
  .mob-nav-close { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0.25rem; transition: color 0.15s; }
  .mob-nav-close:hover { color: #E03C31; }
  .mob-nav-links { flex: 1; padding: 1rem 0; }
  .mob-nav-link { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem 1.5rem; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; color: #00205B; text-decoration: none; border-left: 3px solid transparent; transition: all 0.15s; }
  .mob-nav-link:hover { background: #f8fafc; border-left-color: #E03C31; color: #E03C31; }
  .mob-nav-footer { padding: 1.25rem 1.5rem; border-top: 1px solid #f1f5f9; }
  /* ── Extra responsive header tweaks ─────────────────────────────────────── */
  @media (max-width: 640px) { .sh-inner { padding: 0.75rem 1.25rem !important; } #site-util-bar { padding: 0.4rem 1.25rem !important; } }
`;

// ── Hamburger button HTML ─────────────────────────────────────────────────────
const HAMBURGER =
`      <!-- Hamburger (mobile only) -->
      <button class="mob-menu-btn" onclick="openMobNav()" aria-label="Open menu">
        <span class="material-symbols-outlined" style="font-size:28px">menu</span>
      </button>`;

// ── Mobile nav overlay HTML (paths computed per file) ─────────────────────────
function mobNavHTML(file) {
  const r = k => rel(file, TARGETS[k]);
  return `<!-- Mobile Nav Overlay -->
<div id="mob-nav" onclick="closeMobNavOutside(event)">
  <div id="mob-nav-panel">
    <div class="mob-nav-header">
      <span class="mob-nav-title">Menu</span>
      <button class="mob-nav-close" onclick="closeMobNav()">
        <span class="material-symbols-outlined" style="font-size:24px">close</span>
      </button>
    </div>
    <div class="mob-nav-links">
      <a class="mob-nav-link" href="${r('voters')}"><span class="material-symbols-outlined text-[20px]">how_to_vote</span>For Voters</a>
      <a class="mob-nav-link" href="${r('candidates')}"><span class="material-symbols-outlined text-[20px]">person_raised_hand</span>For Candidates</a>
      <a class="mob-nav-link" href="${r('pollWorkers')}"><span class="material-symbols-outlined text-[20px]">badge</span>For Poll Workers</a>
      <a class="mob-nav-link" href="${r('importantDates')}"><span class="material-symbols-outlined text-[20px]">event</span>Important Dates</a>
      <a class="mob-nav-link" href="${r('electionResults')}"><span class="material-symbols-outlined text-[20px]">bar_chart</span>Election Results</a>
      <a class="mob-nav-link" href="${r('newsPolicies')}"><span class="material-symbols-outlined text-[20px]">newspaper</span>News & Policies</a>
    </div>
    <div class="mob-nav-footer">
      <a href="${r('register')}" class="flex items-center justify-center gap-2 w-full bg-[#E03C31] hover:bg-[#b91c1c] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all">
        <span class="material-symbols-outlined text-[18px]">how_to_reg</span>Register to Vote
      </a>
    </div>
  </div>
</div>`;
}

// ── Mobile nav JS ─────────────────────────────────────────────────────────────
const MOB_JS = `<script id="mob-nav-js">
function openMobNav(){document.getElementById('mob-nav').classList.add('open');document.body.style.overflow='hidden';}
function closeMobNav(){document.getElementById('mob-nav').classList.remove('open');document.body.style.overflow='';}
function closeMobNavOutside(e){if(e.target===document.getElementById('mob-nav'))closeMobNav();}
</script>`;

// ── Content responsive transforms ────────────────────────────────────────────
// IMPORTANT: use (?<!:) lookbehind so we never transform already-prefixed classes
// e.g. md:text-7xl should NOT be further transformed
function makeContentResponsive(html) {

  // 1. Section horizontal padding
  // px-8 → px-4 md:px-8   (only standalone px-8, not with existing prefix)
  html = html.replace(/(?<!:)\bpx-8\b/g, 'px-4 md:px-8');

  // 2. Section vertical padding
  html = html.replace(/(?<!:)\bpy-20\b/g, 'py-12 md:py-20');
  html = html.replace(/(?<!:)\bpy-16\b/g, 'py-10 md:py-16');
  html = html.replace(/(?<!:)\bpy-12\b/g, 'py-8 md:py-12');

  // 3. Hero text sizes — use sm: prefix so existing md:/lg: classes are NOT overridden
  //    e.g. original "text-7xl md:text-7xl" → "text-3xl sm:text-7xl md:text-7xl"  ✓
  html = html.replace(/(?<!:)\btext-7xl\b/g, 'text-3xl sm:text-7xl');
  html = html.replace(/(?<!:)\btext-6xl\b/g, 'text-2xl sm:text-6xl');
  html = html.replace(/(?<!:)\btext-5xl\b/g, 'text-2xl sm:text-5xl');

  // 4. Grid columns → responsive
  html = html.replace(/(?<!:)\bgrid-cols-3\b/g, 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
  html = html.replace(/(?<!:)\bgrid-cols-2\b/g, 'grid-cols-1 md:grid-cols-2');

  // 5. Left padding on hero content
  html = html.replace(/(?<!:)\bpl-12\b/g, 'pl-4 md:pl-12');
  html = html.replace(/(?<!:)\bpl-16\b/g, 'pl-4 md:pl-16');

  // 6. Main+Sidebar flex layouts: make them stack on mobile
  // Pattern: flex items-start gap-(8|10|12) without existing flex-col/flex-row breakpoints
  // We match whole class strings containing these and add flex-col lg:flex-row
  html = html.replace(
    /class="([^"]*\bflex\b[^"]*\bitems-start\b[^"]*\bgap-(?:8|10|12|16)\b[^"]*)"/g,
    (match, cls) => {
      if (/flex-col|flex-row/.test(cls)) return match; // already responsive
      return `class="${cls} flex-col lg:flex-row"`;
    }
  );

  // 7. Disable mobile auto-redirect
  html = html.replace(/mobileVersion\s*:\s*'[^']*'/g, "mobileVersion:null");
  html = html.replace(/mobileVersion\s*:\s*"[^"]*"/g, 'mobileVersion:null');

  // 8. Fix mob-register-strip link to register page (already done by nav-wiring, but hardcode for safety)
  // (skip - nav-wiring already handles sh-register class)

  return html;
}

// ── Main loop ─────────────────────────────────────────────────────────────────
const files = walk(ROOT).filter(f => !SKIP_FILES.has(f));
let updated = 0, skipped = 0, errors = [];

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const orig = html;
  let changed = false;

  // ── Phase 1: Mobile nav injection ───────────────────────────────────────
  if (!html.includes('mob-menu-btn')) {

    // 1a. Add CSS before </style>
    if (html.includes('</style>')) {
      // Insert AFTER existing mob-register-strip CSS if present, before </style>
      html = html.replace('</style>', MOBILE_NAV_CSS + '\n</style>');
      changed = true;
    }

    // 1b. Add hamburger button: inject after the .sh-register anchor closing </a>
    //     and before the two closing </div></div></header>
    //     Pattern: find sh-register anchor, then its inner content, then </a>
    const hammerPat = /(<a[^>]*class="[^"]*sh-register[^"]*"[\s\S]*?<\/a>)(\s*<\/div>\s*<\/div>\s*<\/header>)/;
    if (hammerPat.test(html)) {
      html = html.replace(hammerPat, '$1\n' + HAMBURGER + '$2');
      changed = true;
    } else {
      // Fallback: inject just before </header>
      html = html.replace('</header>', HAMBURGER + '\n    </div>\n  </div>\n</header>');
      errors.push('hamburger fallback: ' + path.relative(ROOT, file));
      changed = true;
    }

    // 1c. Inject mobile nav overlay after mob-register-strip (if it exists)
    //     or right after </header>
    if (html.includes('class="mob-register-strip"')) {
      // After the mob-register-strip closing </div>
      html = html.replace(
        /(<div class="mob-register-strip">[\s\S]*?<\/div>)/,
        '$1\n' + mobNavHTML(file)
      );
    } else {
      // Right after </header>
      html = html.replace('</header>', '</header>\n' + mobNavHTML(file));
    }
    changed = true;

    // 1d. Add JS before </body>
    if (!html.includes('openMobNav') && html.includes('</body>')) {
      html = html.replace('</body>', MOB_JS + '\n</body>');
      changed = true;
    }
  }

  // ── Phase 2: Content responsive classes ─────────────────────────────────
  const before2 = html;
  html = makeContentResponsive(html);
  if (html !== before2) changed = true;

  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('✓ ' + path.relative(ROOT, file));
    updated++;
  } else {
    console.log('– ' + path.relative(ROOT, file));
    skipped++;
  }
}

if (errors.length) {
  console.log('\nWarnings:');
  errors.forEach(e => console.log('  ⚠ ' + e));
}
console.log(`\nDone — ${updated} updated, ${skipped} unchanged.`);
