'use strict';

const { listCameras } = require('./client.cjs');

async function main() {
  const cameras = await listCameras({
    baseUrl: process.env.HA_URL,
    token: process.env.HA_TOKEN,
    allowLocalHttp: process.env.HA_ALLOW_LOCAL_HTTP === '1'
  });
  process.stdout.write(JSON.stringify({ count: cameras.length, cameras }, null, 2) + '\n');
}

main().catch(error => {
  process.stderr.write((error.message || 'Camera discovery failed.') + '\n');
  process.exitCode = 1;
});
