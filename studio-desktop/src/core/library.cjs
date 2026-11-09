'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');

const BACKUP_DIRECTORY = '.backups';
const MAX_BACKUPS = 5;
const MAX_LIBRARY_BYTES = 20 * 1024 * 1024;
const locks = new Map();

function validName(name) {
  if (typeof name !== 'string' || name === '.' || name === '..' ||
      !/^[^/\\\u0000-\u001f]+\.csv$/i.test(name) || path.basename(name) !== name) {
    throw new Error('Invalid library filename.');
  }
  return name;
}

function revision(contents) {
  return crypto.createHash('sha256').update(contents, 'utf8').digest('hex');
}

function assertContents(contents) {
  if (typeof contents !== 'string' || Buffer.byteLength(contents, 'utf8') > MAX_LIBRARY_BYTES) {
    throw new Error('Library exceeds the 20 MB limit.');
  }
}

async function writePrivate(file, contents) {
  let handle;
  try {
    handle = await fs.open(file, 'wx', 0o600);
    await handle.writeFile(contents, 'utf8');
    await handle.sync();
  } catch (error) {
    if (handle) {
      await handle.close();
      await fs.rm(file, { force: true }).catch(() => {});
    }
    throw error;
  }
  await handle.close();
}

async function readCurrent(directory, name) {
  validName(name);
  const target = path.join(directory, name);
  let details;
  try {
    details = await fs.lstat(target);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  if (!details.isFile() || details.isSymbolicLink()) {
    throw new Error('Library path is not a regular file.');
  }
  const contents = await fs.readFile(target, 'utf8');
  assertContents(contents);
  return { contents, revision: revision(contents) };
}

async function readLibrary(directory, name) {
  const current = await readCurrent(directory, name);
  if (!current) throw new Error('Library could not be found.');
  return current;
}

function backupFilename(name) {
  return name + '.' + Date.now() + '-' + crypto.randomUUID() + '.bak';
}

function isBackup(name, filename) {
  return filename.startsWith(name + '.') &&
    /^\d{13}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.bak$/.test(
      filename.slice(name.length + 1));
}

async function backupDirectory(directory, create) {
  const location = path.join(directory, BACKUP_DIRECTORY);
  if (create) await fs.mkdir(location, { recursive: true, mode: 0o700 });
  let details;
  try {
    details = await fs.lstat(location);
  } catch (error) {
    if (!create && error.code === 'ENOENT') return null;
    throw error;
  }
  if (!details.isDirectory() || details.isSymbolicLink()) {
    throw new Error('Backup location is not a safe directory.');
  }
  return location;
}

async function listBackups(directory, name) {
  validName(name);
  const location = await backupDirectory(directory, false);
  if (!location) return [];
  const entries = await fs.readdir(location, { withFileTypes: true });
  return entries
    .filter(entry => entry.isFile() && isBackup(name, entry.name))
    .map(entry => ({
      id: entry.name,
      createdAt: new Date(Number(entry.name.slice(name.length + 1, name.length + 14))).toISOString()
    }))
    .sort((a, b) => b.id.localeCompare(a.id));
}

async function pruneBackups(directory, name) {
  const list = await listBackups(directory, name);
  const location = path.join(directory, BACKUP_DIRECTORY);
  for (const item of list.slice(MAX_BACKUPS)) {
    await fs.rm(path.join(location, item.id), { force: true });
  }
}

async function withLibraryLock(directory, name, task) {
  const key = path.resolve(directory, name);
  const previous = locks.get(key) || Promise.resolve();
  let release;
  const current = new Promise(resolve => { release = resolve; });
  locks.set(key, current);
  await previous;
  try {
    return await task();
  } finally {
    release();
    if (locks.get(key) === current) locks.delete(key);
  }
}

async function saveLibrary(directory, name, contents, expectedRevision = null) {
  validName(name);
  assertContents(contents);
  if (expectedRevision !== null &&
      (typeof expectedRevision !== 'string' || !/^[0-9a-f]{64}$/.test(expectedRevision))) {
    throw new Error('Invalid library revision.');
  }
  return withLibraryLock(directory, name, async () => {
    await fs.mkdir(directory, { recursive: true, mode: 0o700 });
    const current = await readCurrent(directory, name);
    if ((current?.revision || null) !== expectedRevision) {
      throw new Error('This library changed on disk. Reload it or save under another name.');
    }
    const newRevision = revision(contents);
    if (current && newRevision === current.revision) return { name, revision: newRevision };
    const target = path.join(directory, name);
    if (!current) {
      await writePrivate(target, contents);
      return { name, revision: newRevision };
    }

    const backups = await backupDirectory(directory, true);
    await writePrivate(path.join(backups, backupFilename(name)), current.contents);

    const temporary = path.join(directory, '.' + crypto.randomUUID() + '.tmp');
    try {
      await writePrivate(temporary, contents);
      // Another application may edit the CSV. Refuse to replace that newer work.
      const latest = await readCurrent(directory, name);
      if (!latest || latest.revision !== current.revision) {
        throw new Error('This library changed during saving. Reload it before trying again.');
      }
      await fs.rename(temporary, target);
    } finally {
      await fs.rm(temporary, { force: true }).catch(() => {});
    }
    await pruneBackups(directory, name).catch(() => {});
    return { name, revision: newRevision };
  });
}

async function importLibrary(directory, requestedName, contents) {
  validName(requestedName);
  assertContents(contents);
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const parts = path.parse(requestedName);
  for (let index = 1; index <= 1000; index += 1) {
    const name = index === 1 ? requestedName : parts.name + '-' + index + parts.ext;
    try {
      await writePrivate(path.join(directory, name), contents);
      return { name, revision: revision(contents) };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  throw new Error('Could not find a free filename for the imported library.');
}

async function loadBackup(directory, name, backupId) {
  validName(name);
  if (typeof backupId !== 'string' || !isBackup(name, backupId)) {
    throw new Error('Invalid backup selection.');
  }
  const backups = await listBackups(directory, name);
  if (!backups.some(item => item.id === backupId)) throw new Error('Backup no longer exists.');
  const contents = await fs.readFile(path.join(directory, BACKUP_DIRECTORY, backupId), 'utf8');
  assertContents(contents);
  return contents;
}

module.exports = {
  importLibrary, listBackups, loadBackup, readLibrary, revision, saveLibrary, validName
};
