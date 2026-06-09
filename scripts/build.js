// scripts/build.js
// A minimal "build" step: copy src/ into dist/. Real projects might transpile,
// bundle, or compile here — the point is that the pipeline produces an artifact.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(root, 'src'), path.join(dist, 'src'), { recursive: true });
fs.copyFileSync(path.join(root, 'package.json'), path.join(dist, 'package.json'));

console.log('Build complete: created dist/');
