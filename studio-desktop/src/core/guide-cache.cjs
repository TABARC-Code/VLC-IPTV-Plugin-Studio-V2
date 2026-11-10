'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const { constants: fsFlags } = require('node:fs');
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

function validSourcePath(source) {
  if (typeof source !== 'string' || !path.isAbsolute(source) ||
      source.length > 4096 || /[\u0000-\u001f\u007f]/.test(source) ||
      !/\.(xml|xmltv|gz)$/i.test(source)) {
    throw new Error('Choose an absolute local XMLTV path ending in .xml, .xmltv or .gz.');
  }
  return source;
}

function sourceDetails(source, fingerprint, importedAt) {
  validSourcePath(source);
  if (typeof fingerprint !== 'string' || !/^[0-9a-f]{64}$/.test(fingerprint) ||
      !Number.isSafeInteger(importedAt) || importedAt < 0) {
    throw new Error('Invalid saved programme-guide source.');
  }
  return { path: source, fingerprint, importedAt };
}

async function importGuideWithFingerprint(source) {
  validSourcePath(source);
  const info = await fs.lstat(source);
  if (!info.isFile() || info.isSymbolicLink()) {
    throw new Error('The XMLTV source is not a regular file.');
  }
  if (info.size > MAX_SOURCE_BYTES) throw new Error('Compressed XMLTV input exceeds 20 MB.');

  // Open the selected file once. On Unix, reject links even if the path changes
  // between the initial check and opening it.
  const flags = fsFlags.O_RDONLY | (process.platform === 'win32' ? 0 : (fsFlags.O_NOFOLLOW || 0));
  const handle = await fs.open(source, flags);
  let input;
  try {
    const opened = await handle.stat();
    if (!opened.isFile() || opened.size > MAX_SOURCE_BYTES) {
      throw new Error('The XMLTV source is not a supported file or exceeds 20 MB.');
    }
    input = await handle.readFile();
  } finally {
    await handle.close();
  }
  if (input.length > MAX_SOURCE_BYTES) throw new Error('XMLTV source exceeds 20 MB.');
  const data = /\.gz$/i.test(source)
    ? await unzip(input, { maxOutputLength: MAX_XML_BYTES })
    : input;
  if (data.length > MAX_XML_BYTES) throw new Error('XMLTV content exceeds 24 MB.');
  const xml = new TextDecoder('utf-8', { fatal: true }).decode(data);
  const guide = parseXmltv(xml);
  return {
    guide,
    source: sourceDetails(source, crypto.createHash('sha256').update(input).digest('hex'), guide.importedAt)
  };
}

async function importGuide(source) {
  return (await importGuideWithFingerprint(source)).guide;
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

async function readGuideRecord(directory) {
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
  const raw = await fs.readFile(filename, 'utf8');
  if (Buffer.byteLength(raw, 'utf8') > MAX_CACHE_BYTES) {
    throw new Error('Programme-guide cache exceeds its size limit.');
  }
  const record = JSON.parse(raw);
  if (record?.format !== 1 && record?.format !== 2) {
    throw new Error('Unsupported programme-guide cache.');
  }
  return {
    guide: validateCachedGuide(record.guide),
    source: record.format === 2 && record.source !== null && record.source !== undefined
      ? sourceDetails(record.source.path, record.source.fingerprint, record.source.importedAt)
      : null
  };
}

async function readGuide(directory) {
  return (await readGuideRecord(directory))?.guide ?? null;
}

async function writeGuide(directory, guide, source = null) {
  const payload = JSON.stringify({
    format: 2,
    guide: validateCachedGuide(guide),
    source: source === null ? null : sourceDetails(source.path, source.fingerprint, source.importedAt)
  });
  if (Buffer.byteLength(payload, 'utf8') > MAX_CACHE_BYTES) {
    throw new Error('The programme guide exceeds the cache limit.');
  }
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const info = await fs.lstat(directory);
  if (!info.isDirectory() || info.isSymbolicLink()) {
    throw new Error('Unsafe programme-guide directory.');
  }
  const temp = path.join(directory, '.' + crypto.randomUUID() + '.tmp');
  try {
    const handle = await fs.open(temp, 'wx', 0o600);
    try {
      await handle.writeFile(payload, 'utf8');
      await handle.sync();
    } finally {
      await handle.close();
    }
    await fs.rename(temp, cacheFile(directory));
  } finally {
    await fs.rm(temp, { force: true }).catch(() => {});
  }
}

async function refreshGuide(directory) {
  const previous = await readGuideRecord(directory);
  if (!previous?.source) {
    throw new Error('No local source is saved. Import an XMLTV file to choose one.');
  }
  const fresh = await importGuideWithFingerprint(previous.source.path);
  if (fresh.source.fingerprint === previous.source.fingerprint) {
    return { status: 'unchanged', record: previous };
  }
  // A short or broken provider export should not quietly replace a healthy guide.
  const existingCount = previous.guide.programmes.length;
  if (existingCount >= 20 && fresh.guide.programmes.length < Math.ceil(existingCount * 0.6)) {
    throw new Error('The new guide contains far fewer programmes. The saved guide is unchanged; import the file explicitly if this reduction is expected.');
  }
  await writeGuide(directory, fresh.guide, fresh.source);
  return { status: 'updated', record: fresh };
}

async function forgetGuideSource(directory) {
  const record = await readGuideRecord(directory);
  if (!record) return null;
  if (!record.source) return record;
  await writeGuide(directory, record.guide, null);
  return { guide: record.guide, source: null };
}

async function clearGuide(directory) {
  await fs.rm(cacheFile(directory), { force: true });
}

module.exports = {
  MAX_SOURCE_BYTES, MAX_CACHE_BYTES,
  importGuide, importGuideWithFingerprint, readGuide, readGuideRecord,
  writeGuide, refreshGuide, forgetGuideSource, clearGuide
};
