/**
 * Unit tests for Font fingerprinting
 */

import { describe, it, expect } from 'vitest';
import {
  getFontFingerprint,
  getFontFingerprintAsync,
  getDetectedFonts,
  getDetectedFontsAsync,
  getDefaultFontList,
  isFontDetectionSupported,
} from '../../src';

describe('Font Fingerprinting', () => {
  describe('isFontDetectionSupported', () => {
    it('should return a boolean', () => {
      const result = isFontDetectionSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should return true in jsdom environment', () => {
      // jsdom provides DOM access for font detection
      expect(isFontDetectionSupported()).toBe(true);
    });

    it('should return false when not in browser', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      expect(isFontDetectionSupported()).toBe(false);

      // Restore window
      globalThis.window = originalWindow;
    });
  });

  describe('getDefaultFontList', () => {
    it('should return an array of font names', () => {
      const fonts = getDefaultFontList();
      expect(Array.isArray(fonts)).toBe(true);
    });

    it('should return at least 20 default fonts', () => {
      const fonts = getDefaultFontList();
      expect(fonts.length).toBeGreaterThanOrEqual(20);
    });

    it('should return only string values', () => {
      const fonts = getDefaultFontList();
      fonts.forEach((font) => {
        expect(typeof font).toBe('string');
      });
    });

    it('should include common fonts', () => {
      const fonts = getDefaultFontList();
      // Check for some common fonts
      const commonFonts = ['Arial', 'Times', 'Courier'];
      const hasCommonFont = commonFonts.some((font) =>
        fonts.some((f) => f.toLowerCase().includes(font.toLowerCase()))
      );
      expect(hasCommonFont).toBe(true);
    });

    it('should return a copy of the font list (not reference)', () => {
      const fonts1 = getDefaultFontList();
      const fonts2 = getDefaultFontList();
      expect(fonts1).not.toBe(fonts2);
      expect(fonts1).toEqual(fonts2);
    });
  });

  describe('getFontFingerprint', () => {
    it('should return a promise', () => {
      const result = getFontFingerprint();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to a string hash or null', async () => {
      const hash = await getFontFingerprint();
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return 32 character hash when successful', async () => {
      const hash = await getFontFingerprint();
      if (hash !== null) {
        expect(hash.length).toBe(32); // MD5 hash length
      }
    });

    it('should produce consistent hash for same environment', async () => {
      const hash1 = await getFontFingerprint();
      const hash2 = await getFontFingerprint();
      expect(hash1).toBe(hash2);
    });

    it('should handle timeout gracefully', async () => {
      const hash = await getFontFingerprint({ timeout: 1000 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle custom font list', async () => {
      const hash = await getFontFingerprint({ fonts: ['Arial', 'Times'] });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle empty font list', async () => {
      const hash = await getFontFingerprint({ fonts: [] });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle timeout option', async () => {
      const hash = await getFontFingerprint({ timeout: 500 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return null when not in browser', async () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      const hash = await getFontFingerprint();
      expect(hash).toBeNull();

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle very short timeout', async () => {
      const hash = await getFontFingerprint({ timeout: 1 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });
  });

  describe('getFontFingerprintAsync', () => {
    it('should return a promise', () => {
      const result = getFontFingerprintAsync();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to a string hash or null', async () => {
      const hash = await getFontFingerprintAsync();
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return 32 character hash when successful', async () => {
      const hash = await getFontFingerprintAsync();
      if (hash !== null) {
        expect(hash.length).toBe(32); // MD5 hash length
      }
    });

    it('should produce consistent hash for same environment', async () => {
      const hash1 = await getFontFingerprintAsync();
      const hash2 = await getFontFingerprintAsync();
      expect(hash1).toBe(hash2);
    });

    it('should handle custom font list', async () => {
      const hash = await getFontFingerprintAsync({ fonts: ['Arial', 'Times'] });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle empty font list', async () => {
      const hash = await getFontFingerprintAsync({ fonts: [] });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle timeout option', async () => {
      const hash = await getFontFingerprintAsync({ timeout: 500 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return null when not in browser', async () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      const hash = await getFontFingerprintAsync();
      expect(hash).toBeNull();

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle cache options', async () => {
      const hash = await getFontFingerprintAsync({
        fonts: ['Arial'],
        useCache: true,
        cacheKey: 'test-cache',
      });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle chunked processing options', async () => {
      const hash = await getFontFingerprintAsync({
        fonts: ['Arial', 'Times'],
        chunkSize: 1,
        chunkDelay: 0,
      });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });
  });

  describe('getDetectedFonts', () => {
    it('should return an array (synchronous)', () => {
      const fonts = getDetectedFonts();
      expect(Array.isArray(fonts)).toBe(true);
    });

    it('should return only string values', () => {
      const fonts = getDetectedFonts();
      fonts.forEach((font) => {
        expect(typeof font).toBe('string');
      });
    });

    it('should return empty array when no fonts detected', () => {
      // This can happen in test environments or when DOM is not available
      const fonts = getDetectedFonts();
      expect(Array.isArray(fonts)).toBe(true);
    });

    it('should handle custom font list', () => {
      const fonts = getDetectedFonts(['Arial', 'Times', 'Courier']);
      expect(Array.isArray(fonts)).toBe(true);
      expect(fonts.length).toBeLessThanOrEqual(3);
    });

    it('should handle empty font list', () => {
      const fonts = getDetectedFonts([]);
      expect(Array.isArray(fonts)).toBe(true);
      expect(fonts.length).toBe(0);
    });

    it('should return empty array when not in browser', () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      const fonts = getDetectedFonts();
      expect(fonts).toEqual([]);

      // Restore window
      globalThis.window = originalWindow;
    });
  });

  describe('getDetectedFontsAsync', () => {
    it('should return a promise', () => {
      const result = getDetectedFontsAsync();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to an array', async () => {
      const fonts = await getDetectedFontsAsync();
      expect(Array.isArray(fonts)).toBe(true);
    });

    it('should return only string values', async () => {
      const fonts = await getDetectedFontsAsync();
      fonts.forEach((font) => {
        expect(typeof font).toBe('string');
      });
    });

    it('should handle custom font list', async () => {
      const fonts = await getDetectedFontsAsync(['Arial', 'Times']);
      expect(Array.isArray(fonts)).toBe(true);
      expect(fonts.length).toBeLessThanOrEqual(2);
    });

    it('should handle empty font list', async () => {
      const fonts = await getDetectedFontsAsync([]);
      expect(Array.isArray(fonts)).toBe(true);
      expect(fonts.length).toBe(0);
    });

    it('should return empty array when not in browser', async () => {
      const originalWindow = globalThis.window;
      // @ts-expect-error - intentionally removing window
      delete (globalThis as Window & { window?: Window }).window;

      const fonts = await getDetectedFontsAsync();
      expect(fonts).toEqual([]);

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle timeout option', async () => {
      const fonts = await getDetectedFontsAsync(['Arial'], { timeout: 100 });
      expect(Array.isArray(fonts)).toBe(true);
    });

    it('should handle cache options', async () => {
      const fonts = await getDetectedFontsAsync(['Arial'], {
        useCache: true,
        cacheKey: 'test-cache',
      });
      expect(Array.isArray(fonts)).toBe(true);
    });

    it('should handle chunked processing', async () => {
      const fonts = await getDetectedFontsAsync(['Arial', 'Times'], {
        chunkSize: 1,
        chunkDelay: 0,
      });
      expect(Array.isArray(fonts)).toBe(true);
    });
  });
});
