'use strict';
// Publish only the two runtime files. Keep the offline entry point unchanged.
const fs = require('node:fs');
const path = require('node:path');
const output = path.join(__dirname, 'dist');
fs.mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'physics.js']) {
  fs.copyFileSync(path.join(__dirname, file), path.join(output, file));
}
console.log('Static site built in dist/ (index.html + physics.js).');
