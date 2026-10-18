'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { parseM3u } = require('../src/core/m3u.cjs');
const { writeChannels, readChannels } = require('../src/core/channels.cjs');

test('imports playlist metadata while leaving every source disabled', () => {
  const channels = parseM3u('#EXTM3U\n#EXTINF:-1 tvg-id="news.gb" tvg-logo="https://example.test/logo" group-title="News, World",World News\nhttps://example.test/stream.m3u8\n');
  assert.equal(channels.length, 1);
  assert.equal(channels[0].name, 'World News');
  assert.equal(channels[0].category, 'News, World');
  assert.equal(channels[0].enabled, false);
  assert.deepEqual(readChannels(writeChannels(channels)), channels);
});

test('does not silently expose XXX channels', () => {
  const [channel] = parseM3u('#EXTM3U\n#EXTINF:-1 group-title="XXX",Private\nrtsp://example.test/live\n');
  assert.equal(channel.adult, true);
  assert.equal(channel.audience, 'xxx');
  assert.equal(channel.enabled, false);
});

test('rejects HLS manifests and invalid protocols', () => {
  assert.throws(() => parseM3u('#EXTM3U\n#EXT-X-TARGETDURATION:6\nfile.ts\n'), /HLS/);
  assert.throws(() => parseM3u('#EXTM3U\n#EXTINF:-1,Hello\njavascript:alert(1)\n'), /protocol/);
  assert.throws(() => parseM3u('#EXTM3U\n'), /No channels/);
});
