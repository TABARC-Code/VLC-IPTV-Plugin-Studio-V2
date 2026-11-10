'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { gunzip } = require('node:zlib');
const { promisify } = require('node:util');
const {
  MAX_XML_BYTES, MAX_GUIDE_CHANNELS, MAX_PROGRAMMES, parseXmltv
} = require('./xmltv.cjs');

const unzip = promisify(gunzip);
const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_CACHE_BYTES = 64 * 1024 * 1024;

function cacheFile(directory) {
  return path.join(directory, 'guide.json');
}

async function importGuide(source) {
  if (typeof source !== 'string' || !/\.(xml|xmltv|gz)$/i.test(source)) {
    throw new Error('Choose a local XMLTV file ending in .xml, .xmltv or .gz.');
  }
  const info = await fs.lstat(source);
  if (!info.isFile() || info.isSymbolicLink()) throw new Error('The XMLTV source is not a regular file.');
  if (info.size > MAX_SOURCE_BYTES) throw new Error('Compressed XMLTV input exceeds 20 MB.');
  const input = await fs.readFile(source);
  if (input.length > MAX_SOURCE_BYTES) throw new Error('XMLTV source exceeds 20 MB.');
  const data = /\.gz$/i.test(source)
    ? await unzip(input, { maxOutputLength: MAX_XML_BYTES })
    : input;
  if (data.length > MAX_XML_BYTES) throw new Error('XMLTV content exceeds 24 MB.');
  const xml = new TextDecoder('utf-8', { fatal: true }).decode(data);
  return parseXmltv(xml);
}

async function writeGuide(directory, guide) {
  const payload = JSON.stringify({ format: 1, guide });
  if (Buffer.byteLength(payload, 'utf8') > MAX_CACHE_BYTES) {
    throw new Error('The programme guide exceeds the cache limit.');
  }
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const info = await fs.lstat(directory);
  if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('Unsafe programme-guide directory.');
  const temp = path.join(directory, '.' + crypto.randomUUID() + '.tmp');
  try {
    await fs.writeFile(temp, payload, { encoding: 'utf8', mode: 0o600, flag: 'wx' });
    await fs.rename(temp, cacheFile(directory));
  } finally {
    await fs.rm(temp, { force: true }).catch(() => {});
  }
}

function validateCachedGuide(guide) {
  if (!guide || !Number.isFinite(guide.importedAt) ||
      !Array.isArray(guide.channels) || !Array.isArray(guide.programmes) ||
      guide.channels.length > MAX_GUIDE_CHANNELS || guide.programmes.length > MAX_PROGRAMMES) {
    throw new Error('Stored programme guide is invalid.');
  }
  for (const item of guide.programmes) {
    if (!item || typeof item.channelId !== 'string' || typeof item.title !== 'string' ||
        !Number.isFinite(item.start) || (item.stop !== null && !Number.isFinite(item.stop))) {
      throw new Error('Stored programme guide has invalid entries.');
    }
  }
  guide.programmes.sort((a, b) => a.start - b.start);
  return guide;
}

async function readGuide(directory) {
  const filename = cacheFile(directory);
  let info;
  try {
    info = await fs.lstat(filename);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  if (!info.isFile() || info.isSymbolicLink() || info.size > MAX_CACHE_BYTES) {
    throw new Error('Unsafe or oversized programme-guide cache.');
  }
  const value = JSON.parse(await fs.readFile(filename, 'utf8'));
  if (value.format !== 1) throw new Error('Unsupported programme-guide cache.');
  return validateCachedGuide(value.guide);
}

async function clearGuide(directory) {
  await fs.rm(cacheFile(directory), { force: true });
}

module.exports = {
  MAX_SOURCE_BYTES, MAX_CACHE_BYTES, importGuide, writeGuide, readGuide, clearGuide
};
