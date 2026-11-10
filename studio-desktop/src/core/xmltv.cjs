'use strict';

const MAX_XML_BYTES = 24 * 1024 * 1024;
const MAX_GUIDE_CHANNELS = 10000;
const MAX_PROGRAMMES = 60000;
const MAX_DEPTH = 32;
const WEEK = 7 * 86400000;

function decodeEntities(value) {
  return String(value).replace(/&([^;]{1,40});|&/g, (_match, entity) => {
    if (!entity) throw new Error('Incomplete XML entity.');
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
    if (Object.hasOwn(named, entity)) return named[entity];
    let number;
    if (/^#x[0-9a-f]+$/i.test(entity)) number = Number.parseInt(entity.slice(2), 16);
    else if (/^#[0-9]+$/.test(entity)) number = Number.parseInt(entity.slice(1), 10);
    else throw new Error('Unsupported XML entity.');
    if (!Number.isInteger(number) || number < 1 || number > 0x10ffff ||
        (number >= 0xd800 && number <= 0xdfff) ||
        (number < 0x20 && ![9, 10, 13].includes(number))) {
      throw new Error('Invalid XML character reference.');
    }
    return String.fromCodePoint(number);
  });
}

function findTagEnd(xml, from) {
  let quote = '';
  for (let i = from; i < xml.length; i++) {
    if (quote) {
      if (xml[i] === quote) quote = '';
    } else if (xml[i] === '"' || xml[i] === "'") quote = xml[i];
    else if (xml[i] === '>') return i;
  }
  throw new Error('Unterminated XML tag.');
}

function parseTag(raw) {
  const first = /^([A-Za-z_][A-Za-z0-9_.:-]*)(?=\s|$)/.exec(raw);
  if (!first) throw new Error('Invalid XML tag name.');
  let rest = raw.slice(first[0].length).trim();
  const attrs = Object.create(null);
  while (rest) {
    const part = /^([A-Za-z_][A-Za-z0-9_.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(rest);
    if (!part) throw new Error('Invalid XML attributes.');
    if (Object.hasOwn(attrs, part[1])) throw new Error('Duplicate XML attribute.');
    attrs[part[1]] = decodeEntities(part[2] ?? part[3]);
    rest = rest.slice(part[0].length).trim();
  }
  return { name: first[1], attrs };
}

function scanXml(input, openNode, closeNode) {
  const xml = input.replace(/^\uFEFF/, '');
  const stack = [];
  let rootSeen = false;
  let i = 0;
  while (i < xml.length) {
    const start = xml.indexOf('<', i);
    const endText = start < 0 ? xml.length : start;
    if (endText > i) {
      const raw = xml.slice(i, endText);
      const node = stack[stack.length - 1];
      if (!node && raw.trim()) throw new Error('Text outside XMLTV document.');
      if (node && ['title', 'sub-title', 'desc', 'display-name', 'category'].includes(node.name)) {
        node.text += decodeEntities(raw);
      } else if (raw.includes('&')) decodeEntities(raw);
    }
    if (start < 0) break;
    if (xml.startsWith('<!--', start)) {
      const end = xml.indexOf('-->', start + 4);
      if (end < 0) throw new Error('Unterminated XML comment.');
      i = end + 3;
      continue;
    }
    if (xml.startsWith('<![CDATA[', start)) {
      const end = xml.indexOf(']]>', start + 9);
      if (end < 0) throw new Error('Unterminated CDATA.');
      const node = stack[stack.length - 1];
      if (node && ['title', 'sub-title', 'desc', 'display-name', 'category'].includes(node.name)) {
        node.text += xml.slice(start + 9, end);
      }
      i = end + 3;
      continue;
    }
    if (xml.startsWith('<?', start)) {
      const end = xml.indexOf('?>', start + 2);
      if (end < 0) throw new Error('Unterminated XML declaration.');
      i = end + 2;
      continue;
    }
    if (/^<!DOCTYPE\b/i.test(xml.slice(start, start + 12))) {
      const end = findTagEnd(xml, start + 9);
      const declaration = xml.slice(start, end + 1);
      // Keep the external DTD name as text; no external resource is ever opened.
      if (declaration.includes('[') || !/^<!DOCTYPE\s+tv(?:\s|>)/i.test(declaration)) {
        throw new Error('XMLTV internal DTD definitions are unsupported.');
      }
      i = end + 1;
      continue;
    }
    if (xml.startsWith('<!', start)) throw new Error('Unsupported XML declaration.');
    const end = findTagEnd(xml, start + 1);
    const inner = xml.slice(start + 1, end).trim();
    if (inner.startsWith('/')) {
      const name = inner.slice(1).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_.:-]*$/.test(name)) throw new Error('Invalid closing tag.');
      const node = stack.pop();
      if (!node || node.name !== name) throw new Error('Mismatched XML closing tag.');
      closeNode(node, stack.at(-1) || null);
    } else {
      const selfClose = inner.endsWith('/');
      const parsed = parseTag(selfClose ? inner.slice(0, -1).trimEnd() : inner);
      if (!stack.length) {
        if (rootSeen || parsed.name !== 'tv') throw new Error('Expected one XMLTV tv document.');
        rootSeen = true;
      }
      if (stack.length >= MAX_DEPTH) throw new Error('XMLTV nesting is too deep.');
      const parent = stack.at(-1) || null;
      const node = { name: parsed.name, attrs: parsed.attrs, text: '' };
      stack.push(node);
      openNode(node, parent);
      if (selfClose) {
        stack.pop();
        closeNode(node, parent);
      }
    }
    i = end + 1;
  }
  if (!rootSeen || stack.length) throw new Error('Incomplete XMLTV document.');
}

function xmltvTime(input) {
  const value = String(input ?? '').trim();
  const match = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?(?:\s*(Z|UTC|GMT|BST|[+-]\d{4}))?$/i.exec(value);
  if (!match) throw new Error('Unsupported XMLTV broadcast time.');
  const [year, month, day, hour, minute, second] =
    [Number(match[1]), Number(match[2]), Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6] || 0)];
  const utc = Date.UTC(year, month - 1, day, hour, minute, second);
  const date = new Date(utc);
  if (year < 1900 || year > 2200 || date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day ||
      date.getUTCHours() !== hour || date.getUTCMinutes() !== minute ||
      date.getUTCSeconds() !== second) {
    throw new Error('Invalid XMLTV broadcast date.');
  }
  const timezone = (match[7] || 'UTC').toUpperCase();
  let offset = timezone === 'BST' ? 60 : 0;
  if (/^[+-]\d{4}$/.test(timezone)) {
    const hours = Number(timezone.slice(1, 3));
    const minutes = Number(timezone.slice(3));
    if (hours > 14 || minutes >= 60 || (hours === 14 && minutes !== 0)) {
      throw new Error('Invalid XMLTV timezone offset.');
    }
    offset = (hours * 60 + minutes) * (timezone[0] === '-' ? -1 : 1);
  }
  return utc - offset * 60000;
}

function parseXmltv(xml, importedAt = Date.now()) {
  if (typeof xml !== 'string' || Buffer.byteLength(xml, 'utf8') > MAX_XML_BYTES) {
    throw new Error('XMLTV guide is larger than 24 MB.');
  }
  const channels = [];
  const programmes = [];
  const channelIds = new Set();
  let currentChannel = null;
  let currentProgramme = null;
  scanXml(xml, (node, parent) => {
    if (node.name === 'channel' && parent?.name === 'tv') {
      currentChannel = { name: '' };
    }
    if (node.name === 'programme' && parent?.name === 'tv') {
      currentProgramme = { title: '', subtitle: '', description: '', category: '' };
    }
  }, (node, parent) => {
    if (node.name === 'display-name' && parent?.name === 'channel' && currentChannel) {
      const name = node.text.replace(/\s+/g, ' ').trim().slice(0, 200);
      if (name && !currentChannel.name) currentChannel.name = name;
    }
    if (currentProgramme && parent?.name === 'programme') {
      const value = node.text.replace(/\s+/g, ' ').trim();
      if (node.name === 'title' && !currentProgramme.title) currentProgramme.title = value.slice(0, 300);
      if (node.name === 'sub-title' && !currentProgramme.subtitle) currentProgramme.subtitle = value.slice(0, 300);
      if (node.name === 'desc' && !currentProgramme.description) currentProgramme.description = value.slice(0, 1800);
      if (node.name === 'category' && !currentProgramme.category) currentProgramme.category = value.slice(0, 100);
    }
    if (node.name === 'channel' && parent?.name === 'tv') {
      const id = (node.attrs.id || '').trim();
      if (!id || id.length > 400 || channelIds.has(id)) throw new Error('Invalid or duplicate XMLTV channel ID.');
      channelIds.add(id);
      channels.push({ id, name: currentChannel?.name || id });
      if (channels.length > MAX_GUIDE_CHANNELS) throw new Error('XMLTV exceeds the channel limit.');
      currentChannel = null;
    }
    if (node.name === 'programme' && parent?.name === 'tv') {
      const id = (node.attrs.channel || '').trim();
      if (!id || id.length > 400 || !node.attrs.start) throw new Error('XMLTV programme is missing channel or start time.');
      const start = xmltvTime(node.attrs.start);
      const stop = node.attrs.stop ? xmltvTime(node.attrs.stop) : null;
      if (stop !== null && stop <= start) throw new Error('XMLTV programme ends before it starts.');
      if (!currentProgramme?.title) throw new Error('XMLTV programme has no title.');
      programmes.push({
        channelId: id, start, stop, title: currentProgramme.title,
        subtitle: currentProgramme.subtitle, description: currentProgramme.description,
        category: currentProgramme.category
      });
      if (programmes.length > MAX_PROGRAMMES) throw new Error('XMLTV exceeds the programme limit.');
      currentProgramme = null;
    }
    if (node.name === 'tv' && parent === null && programmes.length === 0) {
      throw new Error('XMLTV file contains no programmes.');
    }
  });
  programmes.sort((a, b) => a.start - b.start);
  return { importedAt, channels, programmes };
}

function guideSummary(guide, now = Date.now()) {
  if (!guide) return null;
  const coverageEnd = guide.programmes.reduce((max, p) => Math.max(max, p.stop ?? p.start), 0);
  return {
    importedAt: guide.importedAt,
    channels: guide.channels.length,
    programmes: guide.programmes.length,
    coverageEnd,
    expired: coverageEnd < now,
    old: guide.importedAt + WEEK < now
  };
}

function searchGuide(guide, channels, query = '', windowDays = 2, now = Date.now(), mappings = {}) {
  if (!guide) return { results: [], matchedChannels: 0, unmatchedChannels: 0, more: false };
  if (!Array.isArray(channels) || channels.length > 20000) throw new Error('Too many channels in guide request.');
  if (typeof query !== 'string' || query.length > 120) throw new Error('Guide search is too long.');
  if (![2, 7].includes(windowDays)) throw new Error('Invalid guide window.');
  const available = new Map();
  let missing = 0;
  let matched = 0;
  const known = new Set(guide.programmes.map(p => p.channelId));
  for (const channel of channels) {
    const override = typeof channel?.id === 'string' && Object.hasOwn(mappings, channel.id)
      ? mappings[channel.id] : null;
    const id = typeof override === 'string' ? override :
      (typeof channel?.tvg_id === 'string' ? channel.tvg_id.trim() : '');
    if (!id || !known.has(id)) { missing++; continue; }
    matched++;
    if (!available.has(id)) available.set(id, []);
    available.get(id).push(String(channel.name || id).slice(0, 250));
  }
  const term = query.trim().toLocaleLowerCase();
  const horizon = now + windowDays * 86400000;
  const results = [];
  let more = false;
  for (const item of guide.programmes) {
    if (item.start > horizon) break;
    const names = available.get(item.channelId);
    if (!names) continue;
    if (item.stop !== null ? item.stop <= now : item.start < now) continue;
    if (term && ![item.title, item.subtitle, item.description, item.category].join(' ').toLocaleLowerCase().includes(term)) continue;
    for (const channelName of names) {
      if (results.length >= 120) { more = true; break; }
      results.push({ ...item, channelName });
    }
    if (more) break;
  }
  return { results, matchedChannels: matched, unmatchedChannels: missing, more };
}

module.exports = {
  MAX_XML_BYTES, MAX_GUIDE_CHANNELS, MAX_PROGRAMMES,
  decodeEntities, xmltvTime, parseXmltv, guideSummary, searchGuide
};
