'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { facets, m3u, parseCsv, readChannels, writeChannels } = require('../src/core/channels.cjs');

const HEADER = 'id,name,group,country,language,stream_url,logo_url,tvg_id,enabled,audience,adult,notes';

function channel(changes = {}) {
  return {
    id: 'one', name: 'World News', category: 'News', country: 'GB', language: 'English',
    stream_url: 'https://example.test/live.m3u8?token=private', logo_url: '', tvg_id: 'world.news',
    enabled: true, adult: false, notes: '', audience: '', ...changes
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
  const original = [channel({ notes: 'Comma, quote " without line breaks' })];
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


// The saved file is also the native VLC extension's input format.
test('Studio export has the original nine columns and preserves explicit XXX labels', () => {
  const sample = readChannels('id,name,group,country,language,stream_url,logo_url,tvg_id,enabled,audience\\ncam-1,Garage,Camera,GB,en,rtsp://example.test/stream,,,true,xxx\\n'.replaceAll('\\n', '\n'));
  assert.equal(sample[0].adult, true);
  assert.equal(sample[0].audience, 'xxx');
  const output = writeChannels(sample);
  assert.equal(output.split('\r\n')[0], HEADER);
  assert.deepEqual(readChannels(output), sample);
});

test('legacy adult labels stay hidden and translate to native categories', () => {
  const [explicit] = readChannels('name,group,stream_url,enabled,adult\\nLate,News,https://example.test/late,true,true\\n'.replaceAll('\\n','\n'));
  assert.equal(explicit.audience, '18+');
  const [grouped] = readChannels('name,group,stream_url,enabled\\nLate,Adult (XXX),https://example.test/late,true\\n'.replaceAll('\\n','\n'));
  assert.equal(grouped.audience, 'xxx');
  assert.equal(grouped.adult, true);
});

test('aliases cannot silently override a column and multiline notes cannot break VLC input', () => {
  assert.throws(() => readChannels('name,group,category,stream_url\\nA,News,Other,https://example.test/live\\n'.replaceAll('\\n','\n')), /duplicate/i);
  assert.throws(() => writeChannels([channel({notes:'Line one\\nLine two'.replaceAll('\\n','\n')})]), /one line/);
});
