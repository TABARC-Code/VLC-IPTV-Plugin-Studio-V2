'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { validName } = require('./library.cjs');

const MAX_MAPPING_BYTES = 16 * 1024 * 1024;
const MAX_MAPPINGS = 20000;
const writes = new Map();

function validId(value, limit, label) {
  if (typeof value !== 'string' || !value || value.length > limit ||
      /[\u0000-\u001f\u007f]/.test(value) || value !== value.trim()) {
    throw new Error('Invalid ' + label + '.');
  }
  return value;
}

function mappingFile(directory, library) {
  validName(library);
  const digest = crypto.createHash('sha256').update(library, 'utf8').digest('hex');
  return path.join(directory, 'library-' + digest + '.json');
}

async function safeDirectory(directory, create = false) {
  if (create) await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  let info;
  try {
    info = await fs.lstat(directory);
  } catch (error) {
    if (!create && error.code === 'ENOENT') return false;
    throw error;
  }
  if (!info.isDirectory() || info.isSymbolicLink()) {
    throw new Error('Guide mapping directory is unsafe.');
  }
  return true;
}

function checkMappings(mappings) {
  if (!mappings || typeof mappings !== 'object' || Array.isArray(mappings) ||
      Object.keys(mappings).length > MAX_MAPPINGS) {
    throw new Error('Guide mappings have an invalid format or too many entries.');
  }
  const clean = Object.create(null);
  for (const [channelId, guideId] of Object.entries(mappings)) {
    validId(channelId, 10000, 'channel ID');
    validId(guideId, 400, 'guide ID');
    clean[channelId] = guideId;
  }
  return clean;
}

async function readMappings(directory, library) {
  const filename = mappingFile(directory, library);
  const found = await safeDirectory(directory);
  if (!found) return Object.create(null);
  let info;
  try {
    info = await fs.lstat(filename);
  } catch (error) {
    if (error.code === 'ENOENT') return Object.create(null);
    throw error;
  }
  if (!info.isFile() || info.isSymbolicLink() || info.size > MAX_MAPPING_BYTES) {
    throw new Error('Guide mapping file is unsafe or too large.');
  }
  const data = await fs.readFile(filename, 'utf8');
  if (Buffer.byteLength(data, 'utf8') > MAX_MAPPING_BYTES) {
    throw new Error('Guide mapping file is too large.');
  }
  const parsed = JSON.parse(data);
  if (parsed?.format !== 1) throw new Error('Unsupported guide mapping format.');
  return checkMappings(parsed.mappings);
}

async function setMapping(directory, library, channelId, guideId) {
  validName(library);
  validId(channelId, 10000, 'channel ID');
  if (guideId !== null) validId(guideId, 400, 'guide ID');
  const filename = mappingFile(directory, library);
  const previous = writes.get(filename) || Promise.resolve();
  let release;
  const next = new Promise(resolve => { release = resolve; });
  writes.set(filename, next);
  await previous;
  try {
    const mappings = await readMappings(directory, library);
    if (guideId === null) {
      if (!Object.hasOwn(mappings, channelId)) return mappings;
      delete mappings[channelId];
    } else {
      if (!Object.hasOwn(mappings, channelId) && Object.keys(mappings).length >= MAX_MAPPINGS) {
        throw new Error('Too many guide mappings.');
      }
      mappings[channelId] = guideId;
    }
    const content = JSON.stringify({ format: 1, mappings });
    if (Buffer.byteLength(content, 'utf8') > MAX_MAPPING_BYTES) {
      throw new Error('Guide mappings exceed the file limit.');
    }
    await safeDirectory(directory, true);
    const temp = path.join(directory, '.' + crypto.randomUUID() + '.tmp');
    try {
      const handle = await fs.open(temp, 'wx', 0o600);
      try {
        await handle.writeFile(content, 'utf8');
        await handle.sync();
      } finally {
        await handle.close();
      }
      await fs.rename(temp, filename);
    } finally {
      await fs.rm(temp, { force: true }).catch(() => {});
    }
    return mappings;
  } finally {
    release();
    if (writes.get(filename) === next) writes.delete(filename);
  }
}

module.exports = { MAX_MAPPINGS, mappingFile, readMappings, setMapping };
