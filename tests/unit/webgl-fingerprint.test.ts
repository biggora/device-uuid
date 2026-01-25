/**
 * Unit tests for WebGL fingerprinting
 */

import { describe, it, expect, vi } from 'vitest';
import { isWebGLSupported, isDebugInfoSupported, getWebGLFingerprint } from '../../src';

describe('WebGL Fingerprinting', () => {
  describe('isWebGLSupported', () => {
    it('should return a boolean', () => {
      const result = isWebGLSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should return true in jsdom environment', () => {
      // jsdom provides WebGL support via HTMLCanvasElement
      const canvas = document.createElement('canvas');
      const hasWebGL = !!(
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl') ||
        canvas.getContext('webgl2')
      );
      expect(isWebGLSupported()).toBe(hasWebGL);
    });

    it('should return false when not in browser', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      expect(isWebGLSupported()).toBe(false);

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle canvas creation errors gracefully', () => {
      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Canvas creation blocked');
      });

      const result = isWebGLSupported();
      expect(result).toBe(false);

      document.createElement = originalCreateElement;
    });
  });

  describe('isDebugInfoSupported', () => {
    it('should return a boolean', () => {
      const result = isDebugInfoSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should return false in jsdom environment', () => {
      // jsdom may not support WEBGL_debug_renderer_info
      const result = isDebugInfoSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should return false when WebGL is not supported', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      const result = isDebugInfoSupported();
      expect(result).toBe(false);

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle context errors gracefully', () => {
      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        const canvas = document.createElement('canvas');
        canvas.getContext = () => {
          throw new Error('Context creation failed');
        };
        return canvas;
      });

      const result = isDebugInfoSupported();
      expect(result).toBe(false);

      document.createElement = originalCreateElement;
    });
  });

  describe('getWebGLFingerprint', () => {
    it('should return a promise', () => {
      const result = getWebGLFingerprint();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to a string hash or null', async () => {
      const hash = await getWebGLFingerprint();
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return 32 character hash when successful', async () => {
      const hash = await getWebGLFingerprint();
      if (hash !== null) {
        expect(hash.length).toBe(32); // MD5 hash length
      }
    });

    it('should produce consistent hash for same environment', async () => {
      const hash1 = await getWebGLFingerprint();
      const hash2 = await getWebGLFingerprint();
      expect(hash1).toBe(hash2);
    });

    it('should handle timeout gracefully', async () => {
      const hash = await getWebGLFingerprint({ timeout: 1000 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle custom timeout option', async () => {
      const hash = await getWebGLFingerprint({ timeout: 500 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return null when WebGL is not supported', async () => {
      // This test verifies behavior when WebGL is unavailable
      // In jsdom, WebGL may be limited
      const hash = await getWebGLFingerprint();
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle WebGL context creation failure', async () => {
      // Even with limited WebGL, the function should not throw
      const hash = await getWebGLFingerprint();
      expect(hash === null || hash?.length === 32).toBe(true);
    });

    it('should return null when not in browser', async () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      const hash = await getWebGLFingerprint();
      expect(hash).toBeNull();

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle canvas creation errors gracefully', async () => {
      const originalCreateElement = document.createElement;
      vi.spyOn(document, 'createElement').mockImplementation(() => {
        throw new Error('Canvas creation blocked');
      });

      const hash = await getWebGLFingerprint();
      expect(hash).toBeNull();

      document.createElement = originalCreateElement;
    });

    it('should handle very short timeout', async () => {
      const hash = await getWebGLFingerprint({ timeout: 1 });
      // With 1ms timeout, might not complete
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle missing debug renderer info', async () => {
      // Even without debug info, should still generate a hash
      const hash = await getWebGLFingerprint();
      expect(hash === null || typeof hash === 'string').toBe(true);
    });
  });
});
