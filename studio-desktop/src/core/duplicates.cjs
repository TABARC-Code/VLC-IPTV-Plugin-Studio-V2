'use strict';

// Reports possible duplicate channels. Distinct regional variants may be intentional.
function duplicateCandidates(channels) {
  if (!Array.isArray(channels)) throw new Error('Expected channel records.');
  const groups = [];
  for (const [field, reason] of [['stream_url', 'Same stream URL'], ['tvg_id', 'Same guide ID']]) {
    const byKey = new Map();
    for (const item of channels) {
      if (!item || typeof item !== 'object') continue;
      const value = typeof item[field] === 'string' ? item[field].trim() : '';
      if (!value) continue;
      // Keep query parameters intact. Two token-bearing URLs are not safely interchangeable.
      const key = field === 'tvg_id' ? value.toLowerCase() : value;
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push({ id: String(item.id || ''), name: String(item.name || '') });
    }
    for (const records of byKey.values()) {
      if (records.length > 1) groups.push({ reason, channels: records });
    }
  }
  return groups;
}

module.exports = { duplicateCandidates };
