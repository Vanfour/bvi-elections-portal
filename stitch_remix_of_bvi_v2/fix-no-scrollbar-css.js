/**
 * fix-no-scrollbar-css.js
 * Adds the missing .no-scrollbar CSS rule to every index.html that
 * uses the class but doesn't already define scrollbar-width: none.
 */
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = 'D:/Kalman/Election Govt. Vg/Election/stitch_remix_of_bvi_v2';

// Find all index.html files using no-scrollbar
const files = execSync(`grep -rl "no-scrollbar" "${ROOT}"`, { encoding: 'utf8' })
  .trim().split('\n')
  .filter(f => f.endsWith('index.html'));

const CSS_INJECT = `  /* Hide scrollbar while keeping scroll functionality */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

const MARKER = 'scrollbar-width: none';

let totalChanged = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');

  // Skip if already defined
  if (html.includes(MARKER)) {
    console.log('Already has CSS:', file.replace(ROOT + '/', ''));
    continue;
  }

  // Inject before </style>
  if (!html.includes('</style>')) {
    console.log('No </style> found:', file.replace(ROOT + '/', ''));
    continue;
  }

  html = html.replace('</style>', CSS_INJECT + '</style>');
  fs.writeFileSync(file, html, 'utf8');
  totalChanged++;
  console.log('Fixed:', file.replace(ROOT + '/', ''));
}

console.log(`\nDone. ${totalChanged}/${files.length} files updated.`);
