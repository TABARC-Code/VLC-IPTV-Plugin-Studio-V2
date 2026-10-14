'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { facets, m3u, parseCsv, readChannels, writeChannels } = require('../src/core/channels.cjs');

const HEADER = 'id,name,category,country,language,stream_url,logo_url,tvg_id,enabled,adult,notes';

function channel(changes = {}) {
  return {
    id: 'one', name: 'World News', category: 'News', country: 'GB', language: 'English',
    stream_url: 'https://example.test/live.m3u8?token=private', logo_url: '', tvg_id: 'world.news',
    enabled: true, adult: false, notes: '', ...changes
  };
}

test('parses RFC-style quoted commas and quotes', () => {
  const rows = parseCsv('name,notes\r\n"News, World","Says ""hello"""\r\n');
  assert.deepEqual(rows[1], ['News, World', 'Says "hello"']);
});

test('accepts legacy group and mature headings', () => {
  const csv = 'name,group,country,stream_url,enabled,mature\nExample,News,GB,https://example.test/live,true,false\n';
  const [result] = readChannels(csv);
  assert.equal(result.category, 'News');
  assert.equal(result.adult, false);
  assert.match(result.id, /^[a-f0-9]{12}$/);
});

test('round-trips the complete channel schema', () => {
  const original = [channel({ notes: 'Comma, quote " and line\nbreak' })];
  assert.deepEqual(readChannels(writeChannels(original)), original);
});

test('rejects duplicate IDs and unsupported URL schemes', () => {
  assert.throws(() => writeChannels([channel(), channel()]), /duplicate id/i);
  assert.throws(() => writeChannels([channel({ stream_url: 'javascript:alert(1)' })]), /unsupported stream protocol/i);
});

test('M3U excludes disabled rows and neutralises metadata line breaks', () => {
  const output = m3u([channel({ name: 'News\n#EXTINF:bad' }), channel({ id: 'two', enabled: false })]);
  assert.equal(output.match(/https:\/\/example\.test/g).length, 1);
  assert.doesNotMatch(output, /News\n#EXTINF/);
});

test('counts category and country facets', () => {
  const result = facets([channel(), channel({ id: 'two', category: 'Sport', country: 'US' })]);
  assert.deepEqual(result.categories, [['News', 1], ['Sport', 1]]);
  assert.deepEqual(result.countries, [['GB', 1], ['US', 1]]);
});

test('minimal CSV receives safe defaults', () => {
  const [result] = readChannels('name,stream_url\nExample,https://example.test/live\n');
  assert.equal(result.enabled, true);
  assert.equal(result.adult, false);
  assert.equal(Object.keys(result).length, HEADER.split(',').length);
});

