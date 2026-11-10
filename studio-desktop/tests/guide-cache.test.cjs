'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { gzipSync } = require('node:zlib');
const {
  importGuide, writeGuide, readGuide, clearGuide
} = require('../src/core/guide-cache.cjs');

const xml = [
  '<?xml version="1.0"?>',
  '<tv><channel id="a.gb"><display-name>First</display-name></channel>',
  '<programme channel="a.gb" start="20261110110000 +0000" stop="20261110120000 +0000">',
  '<title>Programme One</title></programme></tv>'
].join('');

async function fixture(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tabarc-epg-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  return dir;
}

test('imports local XMLTV and persists a reusable offline cache', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml');
  await fs.writeFile(source, xml);
  const guide = await importGuide(source);
  assert.equal(guide.programmes[0].title, 'Programme One');
  const cacheDir = path.join(dir, 'cached-guide');
  await writeGuide(cacheDir, guide);
  assert.deepEqual(await readGuide(cacheDir), guide);
  assert.equal(await fs.readFile(path.join(cacheDir, 'guide.json'), 'utf8').then(s => s.includes(source)), false);
  await clearGuide(cacheDir);
  assert.equal(await readGuide(cacheDir), null);
});

test('decompresses XMLTV gzip files with an output limit', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml.gz');
  await fs.writeFile(source, gzipSync(Buffer.from(xml)));
  const guide = await importGuide(source);
  assert.equal(guide.programmes.length, 1);
  await fs.writeFile(source, gzipSync(Buffer.from('x'.repeat(24 * 1024 * 1024 + 1))));
  await assert.rejects(importGuide(source), /larger|exceeds|output/i);
});

test('rejects broken UTF-8, non-XMLTV documents and invalid cache', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml');
  await fs.writeFile(source, Buffer.from([0xff, 0xfe]));
  await assert.rejects(importGuide(source));
  await fs.writeFile(source, '<html></html>');
  await assert.rejects(importGuide(source), /XMLTV/);
  await fs.writeFile(path.join(dir, 'guide.json'), '{"format":1,"guide":{"programmes":[]}}');
  await assert.rejects(readGuide(dir), /invalid/i);
});
