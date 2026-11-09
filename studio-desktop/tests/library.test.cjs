'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {
  importLibrary, listBackups, loadBackup, readLibrary, revision, saveLibrary
} = require('../src/core/library.cjs');

async function fixture(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'tabarc-library-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  return dir;
}

test('saving keeps a private recovery copy of the previous library', async t => {
  const dir = await fixture(t);
  const original = 'name,stream_url\nOriginal,https://example.test/first\n';
  const changed = 'name,stream_url\nUpdated,https://example.test/second\n';
  const first = await saveLibrary(dir, 'channels.csv', original);
  const next = await saveLibrary(dir, 'channels.csv', changed, first.revision);
  assert.equal((await readLibrary(dir, 'channels.csv')).contents, changed);
  assert.equal(next.revision, revision(changed));
  const backups = await listBackups(dir, 'channels.csv');
  assert.equal(backups.length, 1);
  assert.equal(await loadBackup(dir, 'channels.csv', backups[0].id), original);
  if (process.platform !== 'win32') {
    assert.equal((await fs.stat(path.join(dir, '.backups', backups[0].id))).mode & 0o777, 0o600);
  }
});

test('stale edits cannot overwrite changes made outside Studio', async t => {
  const dir = await fixture(t);
  const first = await saveLibrary(dir, 'channels.csv', 'old');
  await fs.writeFile(path.join(dir, 'channels.csv'), 'changed outside');
  await assert.rejects(saveLibrary(dir, 'channels.csv', 'stale', first.revision), /changed on disk/);
  assert.equal((await readLibrary(dir, 'channels.csv')).contents, 'changed outside');
});

test('concurrent saves from the same revision cannot silently overwrite each other', async t => {
  const dir = await fixture(t);
  const first = await saveLibrary(dir, 'channels.csv', 'old');
  const settled = await Promise.allSettled([
    saveLibrary(dir, 'channels.csv', 'new one', first.revision),
    saveLibrary(dir, 'channels.csv', 'new two', first.revision)
  ]);
  assert.equal(settled.filter(s => s.status === 'fulfilled').length, 1);
  assert.equal(settled.filter(s => s.status === 'rejected').length, 1);
});

test('imports get unique filenames without overwriting existing libraries', async t => {
  const dir = await fixture(t);
  const one = await importLibrary(dir, 'list.csv', 'first');
  const two = await importLibrary(dir, 'list.csv', 'second');
  assert.equal(one.name, 'list.csv');
  assert.equal(two.name, 'list-2.csv');
  assert.equal((await readLibrary(dir, one.name)).contents, 'first');
  assert.equal((await readLibrary(dir, two.name)).contents, 'second');
});

test('a recovery operation preserves the version it replaces', async t => {
  const dir = await fixture(t);
  const first = await saveLibrary(dir, 'list.csv', 'first');
  const second = await saveLibrary(dir, 'list.csv', 'second', first.revision);
  const backup = (await listBackups(dir, 'list.csv'))[0];
  const content = await loadBackup(dir, 'list.csv', backup.id);
  const third = await saveLibrary(dir, 'list.csv', content, second.revision);
  assert.equal(third.revision, first.revision);
  assert.equal((await listBackups(dir, 'list.csv')).length, 2);
});

test('old backups are limited to five copies per library', async t => {
  const dir = await fixture(t);
  let last = await saveLibrary(dir, 'list.csv', 'version 0');
  for (let index = 1; index <= 8; index += 1) {
    last = await saveLibrary(dir, 'list.csv', 'version ' + index, last.revision);
  }
  assert.equal((await listBackups(dir, 'list.csv')).length, 5);
});

test('backup selection and existing library paths cannot escape the managed directory', async t => {
  const dir = await fixture(t);
  await assert.rejects(readLibrary(dir, '../outside.csv'), /Invalid library/);
  await assert.rejects(loadBackup(dir, 'list.csv', '../secret.csv'), /Invalid backup/);
  await fs.symlink(path.join(dir, 'missing.csv'), path.join(dir, 'linked.csv'));
  await assert.rejects(readLibrary(dir, 'linked.csv'), /regular file/);
});
