import { cp, mkdir, rm, stat, writeFile, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const demoDir = resolve(projectRoot, 'docs/demo');
const bundlePath = resolve(projectRoot, 'dist/index.browser.min.js');
const pagesDir = resolve(projectRoot, 'dist/pages');
const assetsDir = resolve(pagesDir, 'assets');

async function assertExists(path, description) {
  try {
    await stat(path);
  } catch {
    throw new Error(`Missing ${description}: ${path}`);
  }
}

await assertExists(demoDir, 'demo source directory');
await assertExists(bundlePath, 'browser bundle. Run npm run build before building Pages');

await rm(pagesDir, { recursive: true, force: true });
await mkdir(pagesDir, { recursive: true });
await cp(demoDir, pagesDir, { recursive: true });
await mkdir(assetsDir, { recursive: true });
await copyFile(bundlePath, resolve(assetsDir, 'index.browser.min.js'));
await writeFile(resolve(pagesDir, '.nojekyll'), '');

console.log('GitHub Pages artifact staged in dist/pages');
