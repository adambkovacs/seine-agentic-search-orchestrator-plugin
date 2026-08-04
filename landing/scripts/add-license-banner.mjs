#!/usr/bin/env node
// Prepends a third-party license notice to the built JS bundles.
// Runs as a postbuild step (see package.json) because Rollup's
// rollupOptions.output.banner did not propagate through this project's
// Vite 6 build — see vite.config.js. Full license texts:
// ../THIRD-PARTY-LICENSES.md
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BANNER =
  '/* Bundles Chart.js (MIT), three.js (MIT), Lenis (MIT), GSAP (Standard "No Charge" GSAP License). Full texts: THIRD-PARTY-LICENSES.md */\n';

const docsDir = join(import.meta.dirname, '..', '..', 'docs');

function jsFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return jsFiles(p);
    return name.endsWith('.js') ? [p] : [];
  });
}

for (const file of jsFiles(docsDir)) {
  const content = readFileSync(file, 'utf8');
  if (content.startsWith(BANNER)) continue; // already stamped
  writeFileSync(file, BANNER + content);
  console.log(`banner added: ${file}`);
}
