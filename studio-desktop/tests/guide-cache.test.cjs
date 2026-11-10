'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { gzipSync } = require('node:zlib');
const {
  importGuide, importGuideWithFingerprint, writeGuide, readGuide, readGuideRecord,
  refreshGuide, forgetGuideSource, clearGuide
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


test('remembers the selected local source alongside its guide', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml');
  await fs.writeFile(source, xml);
  const imported = await importGuideWithFingerprint(source);
  const cacheDir = path.join(dir, 'offline');
  await writeGuide(cacheDir, imported.guide, imported.source);
  const saved = await readGuideRecord(cacheDir);
  assert.deepEqual(saved.source, imported.source);
  assert.equal(saved.source.path, source);
  assert.equal(saved.source.fingerprint.length, 64);
  assert.deepEqual(saved.guide, imported.guide);
});

test('refreshing unchanged source does not overwrite the cached guide', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml');
  await fs.writeFile(source, xml);
  const record = await importGuideWithFingerprint(source);
  const cacheDir = path.join(dir, 'offline');
  await writeGuide(cacheDir, record.guide, record.source);
  const before = await fs.readFile(path.join(cacheDir, 'guide.json'));
  const result = await refreshGuide(cacheDir);
  assert.equal(result.status, 'unchanged');
  assert.deepEqual(await fs.readFile(path.join(cacheDir, 'guide.json')), before);
});

test('refreshing a changed local schedule replaces its guide and updates the fingerprint', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml');
  await fs.writeFile(source, xml);
  const original = await importGuideWithFingerprint(source);
  const cacheDir = path.join(dir, 'offline');
  await writeGuide(cacheDir, original.guide, original.source);
  await fs.writeFile(source, xml.replace('Programme One', 'A new schedule'));
  const result = await refreshGuide(cacheDir);
  assert.equal(result.status, 'updated');
  assert.equal(result.record.guide.programmes[0].title, 'A new schedule');
  assert.notEqual(result.record.source.fingerprint, original.source.fingerprint);
  assert.equal((await readGuide(cacheDir)).programmes[0].title, 'A new schedule');
});

test('broken or missing source does not remove the last usable guide', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml');
  await fs.writeFile(source, xml);
  const original = await importGuideWithFingerprint(source);
  const cacheDir = path.join(dir, 'offline');
  await writeGuide(cacheDir, original.guide, original.source);
  const before = await fs.readFile(path.join(cacheDir, 'guide.json'));
  await fs.writeFile(source, '<tv><programme></tv>');
  await assert.rejects(refreshGuide(cacheDir), /Mismatched|XMLTV|programme/i);
  assert.deepEqual(await fs.readFile(path.join(cacheDir, 'guide.json')), before);
  await fs.unlink(source);
  await assert.rejects(refreshGuide(cacheDir), /ENOENT/);
  assert.deepEqual(await fs.readFile(path.join(cacheDir, 'guide.json')), before);
});

test('a suspiciously small refresh is refused, but an explicit import still works', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml');
  const head = '<tv><channel id="a.gb"><display-name>First</display-name></channel>';
  const line = '<programme channel="a.gb" start="20261110110000 +0000" stop="20261110120000 +0000"><title>Programme One</title></programme>';
  const oldXml = head + line.repeat(30) + '</tv>';
  await fs.writeFile(source, oldXml);
  const original = await importGuideWithFingerprint(source);
  const cacheDir = path.join(dir, 'offline');
  await writeGuide(cacheDir, original.guide, original.source);
  await fs.writeFile(source, head + line + '</tv>');
  await assert.rejects(refreshGuide(cacheDir), /far fewer programmes/);
  assert.equal((await readGuide(cacheDir)).programmes.length, 30);
  const explicitlyImported = await importGuideWithFingerprint(source);
  await writeGuide(cacheDir, explicitlyImported.guide, explicitlyImported.source);
  assert.equal((await readGuide(cacheDir)).programmes.length, 1);
});

test('forgetting a source keeps the guide while removing its stored file path', async t => {
  const dir = await fixture(t);
  const source = path.join(dir, 'schedule.xml');
  await fs.writeFile(source, xml);
  const original = await importGuideWithFingerprint(source);
  const cacheDir = path.join(dir, 'offline');
  await writeGuide(cacheDir, original.guide, original.source);
  const result = await forgetGuideSource(cacheDir);
  assert.equal(result.source, null);
  assert.equal((await readGuideRecord(cacheDir)).source, null);
  assert.equal((await readGuide(cacheDir)).programmes.length, 1);
  await assert.rejects(refreshGuide(cacheDir), /No local source/);
});

test('older caches are supported but require a newly selected source for refreshing', async t => {
  const dir = await fixture(t);
  await fs.writeFile(path.join(dir, 'guide.json'), JSON.stringify({
    format: 1,
    guide: await importGuideWithFingerprint(
      await (async () => {
        const source = path.join(dir, 'old.xml');
        await fs.writeFile(source, xml);
        return source;
      })()
    ).then(value => value.guide)
  }));
  const record = await readGuideRecord(dir);
  assert.equal(record.source, null);
  assert.equal(record.guide.programmes.length, 1);
});

test('invalid source metadata and local links are not accepted', async t => {
  const dir = await fixture(t);
  await assert.rejects(importGuideWithFingerprint('https://example.test/guide.xml'), /absolute local/);
  if (process.platform !== 'win32') {
    const source = path.join(dir, 'source.xml');
    const link = path.join(dir, 'link.xml');
    await fs.writeFile(source, xml);
    await fs.symlink(source, link);
    await assert.rejects(importGuideWithFingerprint(link), /regular file/);
  }
  const guide = await importGuideWithFingerprint(await (async () => {
    const filename = path.join(dir, 'source.xml');
    await fs.writeFile(filename, xml);
    return filename;
  })());
  await assert.rejects(writeGuide(path.join(dir, 'bad-cache'), guide.guide, {
    path: 'https://example.test/programmes.xml',
    fingerprint: guide.source.fingerprint,
    importedAt: guide.guide.importedAt
  }), /absolute local/);
});
