'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { cameraDetails, isLocalHost, listCameras, statesUrl } = require('../src/client.cjs');

test('requires HTTPS unless local HTTP is explicitly enabled', () => {
  assert.equal(statesUrl('https://ha.example.org:8123'), 'https://ha.example.org:8123/api/states');
  assert.throws(() => statesUrl('http://192.168.1.5:8123'), /HTTPS/);
  assert.equal(statesUrl('http://192.168.1.5:8123', true), 'http://192.168.1.5:8123/api/states');
  assert.throws(() => statesUrl('http://example.org:8123', true), /HTTPS/);
});

test('rejects credentials and parameters in the configured base URL', () => {
  assert.throws(() => statesUrl('https://someone:secret@ha.example.org'), /only a scheme/);
  assert.throws(() => statesUrl('https://ha.example.org/?access_token=secret'), /only a scheme/);
  assert.throws(() => statesUrl('not-a-url'), /complete Home Assistant URL/);
});

test('recognises private-network addresses', () => {
  assert.equal(isLocalHost('10.3.2.1'), true);
  assert.equal(isLocalHost('172.16.0.2'), true);
  assert.equal(isLocalHost('172.32.0.1'), false);
  assert.equal(isLocalHost('homeassistant.local'), true);
  assert.equal(isLocalHost('1.1.1.1'), false);
});

test('returns only camera IDs, names and states; never token-bearing entity pictures', () => {
  const items = cameraDetails([
    { entity_id: 'sensor.living_room', state: '19' },
    { entity_id: 'camera.workshop', state: 'idle', attributes: { friendly_name: 'Workshop', entity_picture: '/api/camera_proxy/camera.workshop?token=private' } },
    { entity_id: 'camera.front_door', state: 'unavailable', attributes: { friendly_name: 'Front door' } }
  ]);
  assert.deepEqual(items, [
    { entity_id: 'camera.front_door', name: 'Front door', state: 'unavailable' },
    { entity_id: 'camera.workshop', name: 'Workshop', state: 'idle' }
  ]);
  assert.doesNotMatch(JSON.stringify(items), /private/);
});

test('passes the bearer token without adding it to the returned result', async () => {
  const cameras = await listCameras({
    baseUrl: 'https://ha.example.org',
    token: 'private-access-token',
    fetchImpl: async (url, options) => {
      assert.equal(url, 'https://ha.example.org/api/states');
      assert.equal(options.headers.Authorization, 'Bearer private-access-token');
      assert.equal(options.redirect, 'error');
      return { ok: true, json: async () => [{ entity_id: 'camera.front', state: 'idle' }] };
    }
  });
  assert.equal(cameras.length, 1);
  assert.doesNotMatch(JSON.stringify(cameras), /private-access-token/);
});

test('does not expose the HTTP error body or tokens', async () => {
  await assert.rejects(listCameras({
    baseUrl: 'https://ha.example.org',
    token: 'secret',
    fetchImpl: async () => ({ ok: false, status: 401, text: async () => 'secret' })
  }), error => error.message === 'Home Assistant returned HTTP 401.');
});

test('does not expose transport errors containing credentials', async () => {
  await assert.rejects(listCameras({
    baseUrl: 'https://ha.example.org',
    token: 'secret',
    fetchImpl: async () => { throw new Error('secret'); }
  }), error => error.message === 'Could not connect to Home Assistant.');
});
