'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  decodeEntities, xmltvTime, parseXmltv, guideSummary, searchGuide,
  MAX_XML_BYTES
} = require('../src/core/xmltv.cjs');

const schedule = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<!DOCTYPE tv SYSTEM "xmltv.dtd">',
  '<tv>',
  '<channel id="news.gb"><display-name lang="en">News &amp; Weather</display-name></channel>',
  '<channel id="film.gb"><display-name>Film Station</display-name></channel>',
  '<programme start="20261110120000 +0000" stop="20261110130000 +0000" channel="news.gb">',
  '<title>Lunch &amp; News</title><desc>National &lt;regional&gt; updates.</desc>',
  '</programme>',
  '<programme start="20261110130000 +0000" stop="20261110140000 +0000" channel="news.gb">',
  '<title><![CDATA[Afternoon <briefing>]]></title><sub-title>Edition 2</sub-title>',
  '</programme>',
  '<programme start="20261110130000 +0000" stop="20261110150000 +0000" channel="film.gb">',
  '<title>Private Film</title>',
  '</programme>',
  '</tv>'
].join('\n');

test('parses XMLTV channels, entities, CDATA and broadcast dates', () => {
  const guide = parseXmltv(schedule, Date.UTC(2026, 10, 10, 11));
  assert.equal(guide.channels.length, 2);
  assert.equal(guide.channels[0].name, 'News & Weather');
  assert.equal(guide.programmes.length, 3);
  assert.equal(guide.programmes[0].title, 'Lunch & News');
  assert.equal(guide.programmes[0].description, 'National <regional> updates.');
  assert.equal(guide.programmes[1].title, 'Afternoon <briefing>');
  assert.equal(guide.programmes[0].start, Date.UTC(2026, 10, 10, 12));
  assert.equal(decodeEntities('Me &amp; You &#x1f37f;'), 'Me & You 🍿');
});

test('interprets XMLTV time offsets and rejects malformed dates', () => {
  assert.equal(xmltvTime('20261110120000 +0100'), Date.UTC(2026, 10, 10, 11));
  assert.equal(xmltvTime('202611101200 BST'), Date.UTC(2026, 10, 10, 11));
  assert.equal(xmltvTime('20261110120000 -0500'), Date.UTC(2026, 10, 10, 17));
  assert.throws(() => xmltvTime('20260230120000 +0000'), /Invalid/);
  assert.throws(() => xmltvTime('20261110120000 +1560'), /Invalid/);
});

test('guide search matches tvg_id exactly and leaves channel names alone', () => {
  const guide = parseXmltv(schedule);
  const now = Date.UTC(2026, 10, 10, 12, 30);
  const matches = searchGuide(guide, [
    { name: 'Anything', tvg_id: 'news.gb' },
    { name: 'Film Station', tvg_id: '' },
    { name: 'News & Weather', tvg_id: 'no.match' }
  ], '', 2, now);
  assert.equal(matches.matchedChannels, 1);
  assert.equal(matches.unmatchedChannels, 2);
  assert.deepEqual(matches.results.map(x => x.title), ['Lunch & News', 'Afternoon <briefing>']);
  assert.equal(matches.results[0].channelName, 'Anything');
  assert.deepEqual(searchGuide(guide, [{ name: 'News & Weather', tvg_id: 'wrong' }], '', 2, now).results, []);
  assert.deepEqual(searchGuide(guide, [{ name: 'News', tvg_id: 'news.gb' }], 'edition 2', 2, now).results.map(x => x.title), ['Afternoon <briefing>']);
});

test('guide expiry uses programme coverage, without pretending to fetch updates', () => {
  const now = Date.UTC(2026, 10, 10, 12, 30);
  const fresh = parseXmltv(schedule, now);
  assert.equal(guideSummary(fresh, now).expired, false);
  assert.equal(guideSummary(fresh, now + 86400000).expired, true);
  assert.equal(guideSummary(fresh, now + 8 * 86400000).old, true);
  assert.equal(guideSummary(null), null);
});

test('rejects malformed XML, undeclared entities and internal DTD definitions', () => {
  assert.throws(() => parseXmltv('<!DOCTYPE tv [<!ENTITY stolen SYSTEM "file:///etc/passwd">]><tv></tv>'), /DTD/);
  assert.throws(() => parseXmltv('<tv><programme channel="x" start="20261110120000"><title>&stolen;</title></programme></tv>'), /entity/i);
  assert.throws(() => parseXmltv('<tv><channel id="x"></tv>'), /Mismatched/);
  assert.throws(() => parseXmltv('<tv></tv>'), /no programmes/);
  assert.throws(() => parseXmltv('<tv><programme channel="x" start="20261110120000" stop="20261110110000"><title>A</title></programme></tv>'), /ends before/);
});

test('guide import and queries reject oversized and invalid payloads', () => {
  assert.throws(() => parseXmltv('x'.repeat(MAX_XML_BYTES + 1)), /larger than/);
  const guide = parseXmltv(schedule);
  assert.throws(() => searchGuide(guide, [], 'x'.repeat(121)), /too long/);
  assert.throws(() => searchGuide(guide, [], '', 365), /window/);
  assert.throws(() => searchGuide(guide, new Array(20001)), /Too many/);
});


test('a deliberate channel mapping takes precedence without changing the channel record', () => {
  const guide = parseXmltv(schedule);
  const now = Date.UTC(2026, 10, 10, 12, 30);
  const channels = [{ id: 'local-1', name: 'Regional News', tvg_id: 'not-in-guide' }];
  const overrides = { 'local-1': 'news.gb' };
  const result = searchGuide(guide, channels, '', 2, now, overrides);
  assert.equal(result.matchedChannels, 1);
  assert.deepEqual(result.results.map(item => item.title), ['Lunch & News', 'Afternoon <briefing>']);
  assert.equal(channels[0].tvg_id, 'not-in-guide');
  assert.equal(searchGuide(guide, channels, '', 2, now).matchedChannels, 0);
});

test('obsolete overrides remain unmatched until corrected rather than silently falling back', () => {
  const guide = parseXmltv(schedule);
  const channels = [{ id: 'local-1', name: 'Regional News', tvg_id: 'news.gb' }];
  const result = searchGuide(guide, channels, '', 2, Date.UTC(2026, 10, 10, 12), { 'local-1': 'retired.gb' });
  assert.equal(result.matchedChannels, 0);
  assert.equal(result.unmatchedChannels, 1);
});

test('shared guide IDs list each linked channel while preserving the result cap', () => {
  const guide = parseXmltv(schedule);
  const now = Date.UTC(2026, 10, 10, 12, 15);
  const channels = [
    { id: 'a', name: 'News Standard', tvg_id: 'news.gb' },
    { id: 'b', name: 'News HD', tvg_id: '' }
  ];
  const results = searchGuide(guide, channels, '', 2, now, { b: 'news.gb' });
  assert.equal(results.matchedChannels, 2);
  assert.equal(results.unmatchedChannels, 0);
  assert.deepEqual(results.results.filter(entry => entry.title === 'Lunch & News').map(entry => entry.channelName), ['News Standard', 'News HD']);
  const many = Array.from({ length: 200 }, (_, i) => ({ id: 'id' + i, name: 'News ' + i, tvg_id: 'news.gb' }));
  const limited = searchGuide(guide, many, '', 2, now);
  assert.equal(limited.results.length, 120);
  assert.equal(limited.more, true);
});
