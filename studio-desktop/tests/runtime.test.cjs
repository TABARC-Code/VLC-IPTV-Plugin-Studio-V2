'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const {
  cleanupOwnedPlaylists,
  createPrivatePlaylist,
  isTrustedRendererUrl,
  playlistDirectory,
  removePlaylist
} = require('../src/core/runtime.cjs');

test('temporary playlists are private, removable and confined to the owned directory', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tabarc-runtime-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  const playlist = await createPrivatePlaylist(root, '#EXTM3U\nhttps://example.test/private\n');
  assert.equal(path.dirname(playlist), playlistDirectory(root));
  assert.match(path.basename(playlist), /^playlist-[0-9a-f-]+\.m3u$/);
  assert.equal(await fs.readFile(playlist, 'utf8'), '#EXTM3U\nhttps://example.test/private\n');

  if (process.platform !== 'win32') {
    const mode = (await fs.stat(playlist)).mode & 0o777;
    assert.equal(mode, 0o600);
  }

  await removePlaylist(playlist);
  await assert.rejects(fs.stat(playlist), error => error.code === 'ENOENT');
});

test('startup cleanup removes only playlists created by this application', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'tabarc-runtime-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));

  await createPrivatePlaylist(root, '#EXTM3U\n');
  const directory = playlistDirectory(root);
  const unrelated = path.join(directory, 'keep.txt');
  await fs.writeFile(unrelated, 'keep');

  assert.equal(await cleanupOwnedPlaylists(root), 1);
  assert.equal(await fs.readFile(unrelated, 'utf8'), 'keep');
});

test('IPC trust check accepts only the exact packaged renderer URL', () => {
  const expected = 'file:///C:/app/renderer/index.html';
  assert.equal(isTrustedRendererUrl(expected, expected), true);
  assert.equal(isTrustedRendererUrl(`${expected}?spoofed=1`, expected), false);
  assert.equal(isTrustedRendererUrl('https://example.test/index.html', expected), false);
  assert.equal(isTrustedRendererUrl(undefined, expected), false);
});
