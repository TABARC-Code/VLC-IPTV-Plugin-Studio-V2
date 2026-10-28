'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const PLAYLIST_DIRECTORY = 'tabarc-vlc-iptv-studio';
const PLAYLIST_NAME = /^playlist-[0-9a-f-]+\.m3u$/i;

function playlistDirectory(temporaryRoot) {
  return path.join(temporaryRoot, PLAYLIST_DIRECTORY);
}

async function createPrivatePlaylist(temporaryRoot, contents) {
  const directory = playlistDirectory(temporaryRoot);
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const directoryInfo = await fs.lstat(directory);
  if (!directoryInfo.isDirectory() || directoryInfo.isSymbolicLink()) {
    throw new Error('Temporary playlist location is not a safe directory.');
  }
  await fs.chmod(directory, 0o700);
  const playlist = path.join(directory, `playlist-${crypto.randomUUID()}.m3u`);
  await fs.writeFile(playlist, contents, { encoding: 'utf8', mode: 0o600, flag: 'wx' });
  return playlist;
}

async function removePlaylist(playlist) {
  await fs.rm(playlist, { force: true });
}

async function cleanupOwnedPlaylists(temporaryRoot) {
  const directory = playlistDirectory(temporaryRoot);
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return 0;
    throw error;
  }

  const ownedFiles = entries.filter(entry => entry.isFile() && PLAYLIST_NAME.test(entry.name));
  await Promise.all(ownedFiles.map(entry => removePlaylist(path.join(directory, entry.name))));
  return ownedFiles.length;
}

function isTrustedRendererUrl(candidate, expected) {
  return typeof candidate === 'string' && candidate === expected;
}

module.exports = {
  cleanupOwnedPlaylists,
  createPrivatePlaylist,
  isTrustedRendererUrl,
  playlistDirectory,
  removePlaylist
};
