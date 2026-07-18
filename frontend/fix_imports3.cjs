const fs = require('fs');
const path = require('path');

const renamesRaw = fs.readFileSync('fix_imports_renames2.txt', 'utf8').trim().split('\n');
const map = new Map();
for (const line of renamesRaw) {
  const [oldP, newP] = line.split(' -> ').map(s => s.trim());
  const oldRel = oldP.replace(/^src\//, '').replace(/\.(tsx|ts)$/, '');
  const newRel = newP.replace(/^src\//, '').replace(/\.(tsx|ts)$/, '');
  map.set(oldRel, '@/' + newRel);
}

const oldRoots = ['data/', 'utils/'];

function walk(dir, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walk(full, files);
    } else if (/\.(tsx|ts)$/.test(entry.name)) {
      files.push(full);
    }
  }
}

const files = [];
walk('src', files);

const importRe = /from\s+['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;

let totalChanges = 0;
let unresolved = [];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  content = content.replace(importRe, (whole, g1, g2) => {
    const spec = g1 || g2;
    if (!spec) return whole;
    let logical;
    if (spec.startsWith('@/')) {
      logical = spec.slice(2);
    } else if (spec.startsWith('.')) {
      const fileDir = path.dirname(file);
      const resolved = path.join(fileDir, spec);
      logical = path.relative('src', resolved).split(path.sep).join('/');
    } else {
      return whole;
    }
    const hitRoot = oldRoots.find(r => logical.startsWith(r));
    if (!hitRoot) return whole;
    const newAlias = map.get(logical);
    if (!newAlias) {
      unresolved.push(file + ': ' + spec + ' (logical: ' + logical + ')');
      return whole;
    }
    changed = true;
    totalChanges++;
    return whole.replace(spec, newAlias);
  });
  if (changed) {
    fs.writeFileSync(file, content);
  }
}

console.log('Total changes:', totalChanges);
if (unresolved.length) {
  console.log('UNRESOLVED:');
  unresolved.forEach(u => console.log(' ', u));
}
