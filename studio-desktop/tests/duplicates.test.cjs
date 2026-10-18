'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { duplicateCandidates } = require('../src/core/duplicates.cjs');

test('finds repeated URLs without removing separate channel variants', () => {
  const groups = duplicateCandidates([
    { id:'1', name:'Main', stream_url:'https://example.test/live?k=1', tvg_id:'abc' },
    { id:'2', name:'Other', stream_url:'https://example.test/live?k=1', tvg_id:'ABC' },
    { id:'3', name:'Variant', stream_url:'https://example.test/live?k=2', tvg_id:'xyz' }
  ]);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].reason, 'Same stream URL');
  assert.deepEqual(groups[0].channels.map(c=>c.id), ['1','2']);
  assert.equal(groups[1].reason, 'Same guide ID');
  assert.equal(JSON.stringify(groups).includes('k=1'), false);
});

test('does not flag empty metadata or token variants', () => {
  assert.deepEqual(duplicateCandidates([
    {id:'a',name:'A',stream_url:'https://host/live?token=a'},
    {id:'b',name:'B',stream_url:'https://host/live?token=b'}
  ]), []);
});
