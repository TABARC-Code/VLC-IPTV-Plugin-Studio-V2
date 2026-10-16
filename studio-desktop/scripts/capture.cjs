'use strict';

const path = require('node:path');

process.env.STUDIO_CAPTURE_PATH ||= path.resolve(process.cwd(), 'studio-preview.png');
require('../src/main.cjs');

