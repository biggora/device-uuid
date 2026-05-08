/**
 * Post-build CJS interop shim
 *
 * Appends a module.exports assignment to dist/index.cjs so that:
 *   const DeviceUUID = require('device-uuid')   → returns the DeviceUUID constructor
 *   const { DeviceUUID } = require('device-uuid') → also works
 *
 * Fixes issues #14, #20 ("DeviceUUID is not a constructor" in CJS / Vite production).
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cjsPath = resolve(__dirname, '../dist/index.cjs');

const shim = `
// CJS interop: make \`require('device-uuid')\` return the DeviceUUID constructor
// while keeping named exports accessible via destructuring.
// Fixes #14, #20 ("DeviceUUID is not a constructor" in Vite / bundled CJS).
if (typeof module !== 'undefined' && typeof exports.default === 'function') {
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}
`;

const content = readFileSync(cjsPath, 'utf8');
writeFileSync(cjsPath, content + shim, 'utf8');
console.log('CJS interop shim appended to dist/index.cjs');
