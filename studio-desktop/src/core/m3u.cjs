'use strict';

const { MAX_CSV_BYTES, validateChannel, writeChannels } = require('./channels.cjs');

// Read local playlists only. HLS manifests describe segments, not TV channels.
function parseM3u(text) {
  if (typeof text !== 'string' || Buffer.byteLength(text, 'utf8') > MAX_CSV_BYTES) {
    throw new Error('Playlist exceeds the 20 MB import limit.');
  }
  const lines = text.replace(/^\uFEFF/, '').split(/\r?\n/);
  if (!lines[0]?.trim().startsWith('#EXTM3U')) throw new Error('Not an extended M3U playlist.');
  if (lines.some(line => /^#EXT-X-/i.test(line.trim()))) {
    throw new Error('This is an HLS media manifest, not a channel playlist.');
  }
  let metadata = {};
  let extgrp = '';
  const found = [];
  const seen = new Set();
  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('#EXTINF:')) {
      // The first comma outside quoted attributes divides metadata and display name.
      let quoted = false, separator = -1;
      for (let n = 8; n < line.length; n += 1) {
        if (line[n] === '"') quoted = !quoted;
        if (line[n] === ',' && !quoted) { separator = n; break; }
      }
      if (separator < 0 || quoted) throw new Error('Invalid EXTINF record at line ' + (i + 1) + '.');
      const header = line.slice(8, separator);
      const attrs = Object.fromEntries([...header.matchAll(/([\w-]+)="([^"]*)"/g)].map(item => [item[1], item[2]]));
      metadata = {
        name: line.slice(separator + 1).trim() || attrs['tvg-name'] || '',
        category: attrs['group-title'] || '',
        country: attrs['tvg-country'] || '',
        language: attrs['tvg-language'] || '',
        logo_url: attrs['tvg-logo'] || '',
        tvg_id: attrs['tvg-id'] || ''
      };
      continue;
    }
    if (line.startsWith('#EXTGRP:')) { extgrp = line.slice(8).trim(); continue; }
    if (line.startsWith('#')) continue;
    if (/[\u0000-\u001f]/.test(line)) throw new Error('Invalid stream URL at line ' + (i + 1) + '.');
    const details = {
      ...metadata,
      id: 'import-' + String(found.length + 1).padStart(6, '0'),
      name: metadata.name || 'Channel ' + (found.length + 1),
      category: metadata.category || extgrp,
      stream_url: line,
      enabled: false, // Imported streams remain disabled until reviewed.
      adult: false,
      notes: '',
      audience: ''
    };
    found.push(validateChannel(details, i + 1, seen));
    if (found.length > 20000) throw new Error('Playlist exceeds the 20,000-channel limit.');
    metadata = {};
    extgrp = '';
  }
  if (!found.length) throw new Error('No channels found in the playlist.');
  // Ensure it can be saved using the native-compatible CSV writer.
  writeChannels(found);
  return found;
}

module.exports = { parseM3u };
