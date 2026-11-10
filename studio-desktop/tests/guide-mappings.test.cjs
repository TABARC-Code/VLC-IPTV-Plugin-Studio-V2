'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { mappingFile, readMappings, setMapping } = require('../src/core/guide-mappings.cjs');

async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tabarc-guide-links-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return path.join(root, 'mapping-data');
}

test('saves deliberate guide links apart from channel CSV files', async t => {
  const dir = await fixture(t);
  await setMapping(dir, 'news.csv', 'channel-1', 'news.region.gb');
  const stored = await readMappings(dir, 'news.csv');
  assert.equal(stored['channel-1'], 'news.region.gb');
  assert.equal(Object.keys(stored).length, 1);
  assert.equal((await fs.readFile(mappingFile(dir, 'news.csv'), 'utf8')).includes('stream_url'), false);
  if (process.platform !== 'win32') {
    assert.equal((await fs.stat(mappingFile(dir, 'news.csv'))).mode & 0o777, 0o600);
  }
});

test('separate libraries have separate mappings, including similar names', async t => {
  const dir = await fixture(t);
  await setMapping(dir, 'news.csv', 'shared', 'guide.one');
  await setMapping(dir, 'News.csv', 'shared', 'guide.two');
  assert.equal((await readMappings(dir, 'news.csv')).shared, 'guide.one');
  assert.equal((await readMappings(dir, 'News.csv')).shared, 'guide.two');
});

test('clearing a link leaves unrelated mappings intact', async t => {
  const dir = await fixture(t);
  await setMapping(dir, 'channels.csv', 'one', 'guide.a');
  await setMapping(dir, 'channels.csv', 'two', 'guide.b');
  await setMapping(dir, 'channels.csv', 'one', null);
  const stored = await readMappings(dir, 'channels.csv');
  assert.equal(Object.hasOwn(stored, 'one'), false);
  assert.equal(stored.two, 'guide.b');
  assert.equal(Object.keys(await setMapping(dir, 'channels.csv', 'unknown', null)).length, 1);
});

test('simultaneous changes keep both independent channel links', async t => {
  const dir = await fixture(t);
  await Promise.all([
    setMapping(dir, 'channels.csv', 'one', 'guide.a'),
    setMapping(dir, 'channels.csv', 'two', 'guide.b')
  ]);
  const stored = await readMappings(dir, 'channels.csv');
  assert.equal(stored.one, 'guide.a');
  assert.equal(stored.two, 'guide.b');
});

test('rejects unsafe channel IDs, guide IDs, library names and altered files', async t => {
  const dir = await fixture(t);
  await assert.rejects(setMapping(dir, '../outside.csv', 'channel', 'guide'), /Invalid library/);
  await assert.rejects(setMapping(dir, 'channels.csv', 'with\nline', 'guide'), /Invalid channel/);
  await assert.rejects(setMapping(dir, 'channels.csv', 'safe', ''), /Invalid guide/);
  await setMapping(dir, 'channels.csv', 'safe', 'guide');
  await fs.writeFile(mappingFile(dir, 'channels.csv'), '{"format":1,"mappings":{"bad":"untrimmed "}}');
  await assert.rejects(readMappings(dir, 'channels.csv'), /Invalid guide/);
});

test('a symbolic-link cache file is rejected rather than followed', async t => {
  if (process.platform === 'win32') return;
  const dir = await fixture(t);
  await fs.mkdir(dir, { recursive: true });
  const target = path.join(path.dirname(dir), 'outside.json');
  await fs.writeFile(target, '{"format":1,"mappings":{}}');
  await fs.symlink(target, mappingFile(dir, 'channels.csv'));
  await assert.rejects(readMappings(dir, 'channels.csv'), /unsafe/);
});
