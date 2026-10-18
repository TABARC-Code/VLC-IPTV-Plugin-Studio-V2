'use strict';

const crypto = require('node:crypto');

const FIELDS = Object.freeze([
  'id', 'name', 'category', 'country', 'language', 'stream_url',
  'logo_url', 'tvg_id', 'enabled', 'adult', 'notes', 'audience'
]);
// Keep the saved CSV readable by the original VLC Lua extension.
const EXPORT_FIELDS = Object.freeze([
  'id', 'name', 'group', 'country', 'language', 'stream_url',
  'logo_url', 'tvg_id', 'enabled', 'audience', 'adult', 'notes'
]);
const AUDIENCES = new Set(['cartoons', '12+', '16+', '18+', 'xxx', 'unrated']);
const MAX_CSV_BYTES = 20 * 1024 * 1024;
const TRUTHY = new Set(['true', '1', 'yes', 'y']);
const FALSY = new Set(['false', '0', 'no', 'n', '']);

function clean(value) {
  return String(value ?? '').replace(/^\uFEFF/, '').trim();
}

function toBoolean(value, field, rowNumber) {
  const normal = clean(value).toLowerCase();
  if (TRUTHY.has(normal)) return true;
  if (FALSY.has(normal)) return false;
  throw new Error(`Row ${rowNumber}: ${field} must be true or false.`);
}

function parseCsv(text) {
  if (Buffer.byteLength(text, 'utf8') > MAX_CSV_BYTES) {
    throw new Error('CSV is larger than 20 MB. Split it into smaller libraries first.');
  }
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      if (field.length) throw new Error(`CSV has a stray quote near character ${index + 1}.`);
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (quoted) throw new Error('CSV ends inside a quoted value.');
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }
  return rows.filter(values => values.some(value => value.trim() !== ''));
}

function normaliseHeaders(headers) {
  return headers.map(header => {
    const value = clean(header).toLowerCase().replace(/[\s-]+/g, '_');
    if (value === 'group' || value === 'group_title') return 'category';
    if (value === 'url') return 'stream_url';
    if (value === 'mature' || value === '18+') return 'adult';
    return value;
  });
}

function audienceFromGroup(group) {
  const value = clean(group).toLowerCase();
  if (value === 'adult' || value === 'xxx' || value === 'adult (xxx)') return 'xxx';
  if (value === 'animation' || value === 'cartoons') return 'cartoons';
  return AUDIENCES.has(value) ? value : 'unrated';
}

function stableId(channel, rowNumber) {
  const material = `${channel.name}\0${channel.stream_url}\0${rowNumber}`;
  return crypto.createHash('sha256').update(material).digest('hex').slice(0, 12);
}

function validateChannel(raw, rowNumber, seen = new Set()) {
  const channel = Object.fromEntries(FIELDS.map(field => [field, clean(raw[field])]));
  channel.enabled = toBoolean(raw.enabled ?? 'true', 'enabled', rowNumber);
  channel.adult = toBoolean(raw.adult ?? 'false', 'adult', rowNumber);
  channel.audience = clean(raw.audience).toLowerCase();
  if (channel.audience && !AUDIENCES.has(channel.audience)) {
    throw new Error(`Row ${rowNumber}: unsupported audience label.`);
  }
  // An explicit rating wins; older adult flags map to 18+ rather than XXX.
  if (!channel.audience) {
    const groupAudience = audienceFromGroup(channel.category);
    if (groupAudience === 'xxx' || groupAudience === '18+') channel.audience = groupAudience;
    else if (channel.adult) channel.audience = '18+';
  }
  channel.adult = channel.audience === 'xxx' || channel.audience === '18+';
  if (!channel.name) throw new Error(`Row ${rowNumber}: name is required.`);
  if (!channel.stream_url) throw new Error(`Row ${rowNumber}: stream_url is required.`);
  if (/[\u0000\r\n]/.test(channel.stream_url)) throw new Error(`Row ${rowNumber}: stream_url must fit on one line.`);
  let parsed;
  try {
    parsed = new URL(channel.stream_url);
  } catch {
    throw new Error(`Row ${rowNumber}: stream_url is not a complete URL.`);
  }
  if (!['http:', 'https:', 'rtsp:', 'rtmp:', 'udp:'].includes(parsed.protocol)) {
    throw new Error(`Row ${rowNumber}: unsupported stream protocol ${parsed.protocol}`);
  }
  channel.id = channel.id || stableId(channel, rowNumber);
  if (seen.has(channel.id)) throw new Error(`Row ${rowNumber}: duplicate id “${channel.id}”.`);
  seen.add(channel.id);
  return channel;
}

function readChannels(text) {
  const records = parseCsv(text);
  if (!records.length) return [];
  const headers = normaliseHeaders(records.shift());
  if (new Set(headers).size !== headers.length) throw new Error('CSV has duplicate or equivalent columns.');
  for (const required of ['name', 'stream_url']) {
    if (!headers.includes(required)) throw new Error(`CSV needs a ${required} column.`);
  }
  const seen = new Set();
  return records.map((values, offset) => {
    if (values.length !== headers.length) {
      throw new Error(`Row ${offset + 2}: expected ${headers.length} columns, found ${values.length}.`);
    }
    const raw = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
    return validateChannel(raw, offset + 2, seen);
  });
}

function quote(value) {
  const text = typeof value === 'boolean' ? String(value) : String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeChannels(channels) {
  const seen = new Set();
  const checked = channels.map((channel, index) => validateChannel(channel, index + 2, seen));
  const lines = [EXPORT_FIELDS.join(',')];
  for (const channel of checked) {
    // VLC's native CSV reader uses one physical line per channel.
    if (/[\r\n]/.test(channel.notes)) throw new Error('Channel notes must fit on one line for VLC compatibility.');
    lines.push(EXPORT_FIELDS.map(field => quote(field === 'group' ? channel.category : channel[field])).join(','));
  }
  return `${lines.join('\r\n')}\r\n`;
}

function m3u(channels) {
  const lines = ['#EXTM3U'];
  const seen = new Set();
  for (let index = 0; index < channels.length; index += 1) {
    const channel = validateChannel(channels[index], index + 2, seen);
    if (!channel.enabled) continue;
    const attr = value => String(value ?? '').replaceAll('"', "'").replace(/[\r\n]/g, ' ');
    lines.push(`#EXTINF:-1 tvg-id="${attr(channel.tvg_id)}" tvg-name="${attr(channel.name)}" tvg-logo="${attr(channel.logo_url)}" group-title="${attr(channel.category)}",${attr(channel.name)}`);
    lines.push(channel.stream_url);
  }
  return `${lines.join('\n')}\n`;
}

function facets(channels) {
  const count = key => Object.entries(channels.reduce((all, channel) => {
    const value = channel[key] || 'Unsorted';
    all[value] = (all[value] || 0) + 1;
    return all;
  }, {})).sort(([a], [b]) => a.localeCompare(b));
  return { categories: count('category'), countries: count('country') };
}

module.exports = { AUDIENCES, EXPORT_FIELDS, FIELDS, MAX_CSV_BYTES, audienceFromGroup, facets, m3u, parseCsv, readChannels, validateChannel, writeChannels };

