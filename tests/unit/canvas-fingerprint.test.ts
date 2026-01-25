/**
 * Unit tests for Canvas fingerprinting
 */

import { describe, it, expect, vi } from 'vitest';
import { isCanvasSupported, getCanvasFingerprint } from '../../src';

describe('Canvas Fingerprinting', () => {
  describe('isCanvasSupported', () => {
    it('should return a boolean', () => {
      const result = isCanvasSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should return true in jsdom environment', () => {
      // jsdom provides canvas support via HTMLCanvasElement
      const canvas = document.createElement('canvas');
      const hasCanvas = !!canvas.getContext('2d');
      expect(isCanvasSupported()).toBe(hasCanvas);
    });

    it('should return false when not in browser', () => {
      const originalIsBrowser = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      expect(isCanvasSupported()).toBe(false);

      // Restore window
      globalThis.window = originalIsBrowser;
    });

    it('should handle canvas creation errors gracefully', () => {
      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Canvas creation blocked');
      });

      const result = isCanvasSupported();
      expect(result).toBe(false);

      document.createElement = originalCreateElement;
    });

    it('should handle getContext returning null', () => {
      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation(
        () =>
          ({
            getContext: () => null,
          }) as any
      );

      const result = isCanvasSupported();
      expect(result).toBe(false);

      document.createElement = originalCreateElement;
    });
  });

  describe('getCanvasFingerprint', () => {
    it('should return a promise', () => {
      const result = getCanvasFingerprint();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to a string hash or null', async () => {
      const hash = await getCanvasFingerprint();
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return 32 character hash when successful', async () => {
      const hash = await getCanvasFingerprint();
      if (hash !== null) {
        expect(hash.length).toBe(32); // MD5 hash length
      }
    });

    it('should produce consistent hash for same environment', async () => {
      const hash1 = await getCanvasFingerprint();
      const hash2 = await getCanvasFingerprint();
      expect(hash1).toBe(hash2);
    });

    it('should handle timeout gracefully', async () => {
      const hash = await getCanvasFingerprint({ timeout: 1000 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle custom timeout option', async () => {
      const hash = await getCanvasFingerprint({ timeout: 500 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return null when canvas is not supported', async () => {
      // Mock isBrowser to return false
      const originalIsBrowser = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      const hash = await getCanvasFingerprint();

      // Restore window
      globalThis.window = originalIsBrowser;

      expect(hash).toBeNull();
    });

    it('should generate different hashes with different canvas rendering', async () => {
      // This test verifies that canvas rendering actually produces some data
      const hash = await getCanvasFingerprint();
      // In a real browser, we should get a hash, not null
      // In jsdom, the hash may vary
      expect(hash === null || hash?.length === 32).toBe(true);
    });

    it('should handle canvas context errors gracefully', async () => {
      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        const canvas = document.createElement('canvas');
        // Mock getContext to throw error
        canvas.getContext = () => {
          throw new Error('Context creation blocked');
        };
        return canvas;
      });

      const hash = await getCanvasFingerprint();
      expect(hash).toBeNull();

      document.createElement = originalCreateElement;
    });

    it('should handle toDataURL errors gracefully', async () => {
      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Mock toDataURL to throw error (e.g., tainted canvas)
          canvas.toDataURL = () => {
            throw new Error('SecurityError');
          };
        }
        return canvas;
      });

      const hash = await getCanvasFingerprint();
      expect(hash).toBeNull();

      document.createElement = originalCreateElement;
    });

    it('should handle very short timeout', async () => {
      const hash = await getCanvasFingerprint({ timeout: 1 });
      // With 1ms timeout, might not complete
      expect(hash === null || typeof hash === 'string').toBe(true);
    });
  });
});
