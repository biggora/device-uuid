import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM and CJS builds for Node.js
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: false,
    treeshake: true,
    target: 'es2020',
    outDir: 'dist',
    outExtension({ format }) {
      return {
        js: format === 'cjs' ? '.cjs' : '.js',
      };
    },
  },
  // Browser IIFE build (unminified)
  {
    entry: { 'index.browser': 'src/browser.ts' },
    format: ['iife'],
    globalName: 'DeviceUUIDModule',
    splitting: false,
    sourcemap: true,
    clean: false,
    minify: false,
    treeshake: true,
    target: 'es2020',
    outDir: 'dist',
    platform: 'browser',
    outExtension() {
      return {
        js: '.js',
      };
    },
  },
  // Browser IIFE build (minified)
  {
    entry: { 'index.browser.min': 'src/browser.ts' },
    format: ['iife'],
    globalName: 'DeviceUUIDModule',
    splitting: false,
    sourcemap: true,
    clean: false,
    minify: true,
    treeshake: true,
    target: 'es2020',
    outDir: 'dist',
    platform: 'browser',
    outExtension() {
      return {
        js: '.js',
      };
    },
  },
]);
