'use strict';

const { URL } = require('node:url');

function isLocalHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host === '::1' || host.endsWith('.local') || host.endsWith('.lan')) return true;
  const parts = host.split('.');
  if (parts.length !== 4 || parts.some(part => !/^\d+$/.test(part) || Number(part) > 255)) return false;
  const [a, b] = parts.map(Number);
  return a === 10 || a === 127 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

function statesUrl(base, allowLocalHttp = false) {
  let url;
  try {
    url = new URL(base);
  } catch {
    throw new Error('HA_URL must be a complete Home Assistant URL.');
  }
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('HA_URL must contain only a scheme, host and optional port.');
  }
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && allowLocalHttp && isLocalHost(url.hostname))) {
    throw new Error('Use HTTPS, or explicitly allow HTTP for a local Home Assistant address.');
  }
  return new URL('/api/states', url).toString();
}

function cameraDetails(states) {
  if (!Array.isArray(states)) throw new Error('Home Assistant returned an unexpected state list.');
  return states
    .filter(item => item && typeof item.entity_id === 'string' && /^camera\.[a-z0-9_]+$/.test(item.entity_id))
    .map(item => ({
      entity_id: item.entity_id,
      name: typeof item.attributes?.friendly_name === 'string' && item.attributes.friendly_name.trim()
        ? item.attributes.friendly_name.trim() : item.entity_id,
      state: typeof item.state === 'string' ? item.state : 'unknown'
    }))
    .sort((a, b) => a.entity_id.localeCompare(b.entity_id));
}

async function listCameras({ baseUrl, token, allowLocalHttp = false, timeoutMs = 10000, fetchImpl = globalThis.fetch }) {
  const url = statesUrl(baseUrl, allowLocalHttp);
  if (typeof token !== 'string' || !token.trim()) throw new Error('HA_TOKEN is required.');
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 60000) throw new Error('Invalid timeout.');
  if (typeof fetchImpl !== 'function') throw new Error('A fetch implementation is required.');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
      signal: controller.signal,
      redirect: 'error'
    });
  } catch {
    throw new Error('Could not connect to Home Assistant.');
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new Error('Home Assistant returned HTTP ' + response.status + '.');
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Home Assistant did not return valid JSON.');
  }
  return cameraDetails(data);
}

module.exports = { cameraDetails, isLocalHost, listCameras, statesUrl };
