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
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'DeviceUUID',
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
        js: '.browser.js',
      };
    },
  },
  // Browser IIFE build (minified)
  {
    entry: ['src/index.ts'],
    format: ['iife'],
    globalName: 'DeviceUUID',
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
        js: '.browser.min.js',
      };
    },
  },
]);
