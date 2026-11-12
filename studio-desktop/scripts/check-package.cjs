'use strict';

// I prefer failing here, before three platforms build the wrong version.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = filename => fs.readFileSync(path.join(root, filename), 'utf8');

const app = JSON.parse(read('package.json'));
const lock = JSON.parse(read('package-lock.json'));
const version = read('VERSION').trim();
const main = read('src/main.cjs');
const html = read('src/renderer/index.html');
const config = read('electron-builder.yml');

assert.match(version, /^\d+\.\d+\.\d+$/);
assert.equal(app.version, version);
assert.equal(lock.version, version);
assert.equal(lock.packages[''].version, version);
assert.match(main, new RegExp("const VERSION = '" + version.replace(/\./g, '\\.') + "'"));
assert.ok(html.includes('id="version">v' + version));
assert.ok(html.includes('../../node_modules/lucide/dist/umd/lucide.js'));
assert.ok(fs.existsSync(path.join(root, 'node_modules/lucide/dist/umd/lucide.js')));
assert.ok(fs.existsSync(path.join(root, 'assets/icon.ico')));
assert.ok(fs.existsSync(path.join(root, 'assets/icon.png')));
assert.ok(config.includes('asar: true'));
assert.ok(config.includes('deleteAppDataOnUninstall: false'));
assert.ok(config.includes('node_modules/lucide/dist/umd/lucide.js'));
assert.ok(config.includes('target: nsis') && config.includes('target: dmg') && config.includes('target: AppImage'));
process.stdout.write('Studio package metadata and required files agree.\n');
