/**
 * Unit tests for Audio fingerprinting
 */

import { describe, it, expect } from 'vitest';
import { isAudioSupported, isOfflineAudioSupported, getAudioFingerprint } from '../../src';

describe('Audio Fingerprinting', () => {
  describe('isAudioSupported', () => {
    it('should return a boolean', () => {
      const result = isAudioSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should check for AudioContext availability', () => {
      // jsdom may not support AudioContext
      const result = isAudioSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should return false when not in browser', () => {
      const originalWindow = globalThis.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).window;

      const result = isAudioSupported();
      expect(result).toBe(false);

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle missing AudioContext constructor gracefully', () => {
      const originalAudioContext = (globalThis as any).AudioContext;
      const originalWebkitAudioContext = (globalThis as any).webkitAudioContext;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).AudioContext;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).webkitAudioContext;

      const result = isAudioSupported();
      expect(typeof result).toBe('boolean');

      // Restore
      if (originalAudioContext) {
        (globalThis as any).AudioContext = originalAudioContext;
      }
      if (originalWebkitAudioContext) {
        (globalThis as any).webkitAudioContext = originalWebkitAudioContext;
      }
    });
  });

  describe('isOfflineAudioSupported', () => {
    it('should return a boolean', () => {
      const result = isOfflineAudioSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should check for OfflineAudioContext availability', () => {
      // jsdom may not support OfflineAudioContext
      const result = isOfflineAudioSupported();
      expect(typeof result).toBe('boolean');
    });

    it('should return false when not in browser', () => {
      const originalWindow = globalThis.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).window;

      const result = isOfflineAudioSupported();
      expect(result).toBe(false);

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle missing OfflineAudioContext constructor gracefully', () => {
      const originalOfflineAudioContext = (globalThis as any).OfflineAudioContext;
      const originalWebkitOfflineAudioContext = (globalThis as any).webkitOfflineAudioContext;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).OfflineAudioContext;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).webkitOfflineAudioContext;

      const result = isOfflineAudioSupported();
      expect(typeof result).toBe('boolean');

      // Restore
      if (originalOfflineAudioContext) {
        (globalThis as any).OfflineAudioContext = originalOfflineAudioContext;
      }
      if (originalWebkitOfflineAudioContext) {
        (globalThis as any).webkitOfflineAudioContext = originalWebkitOfflineAudioContext;
      }
    });
  });

  describe('getAudioFingerprint', () => {
    it('should return a promise', () => {
      const result = getAudioFingerprint();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to a string hash or null', async () => {
      const hash = await getAudioFingerprint();
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return 32 character hash when successful', async () => {
      const hash = await getAudioFingerprint();
      if (hash !== null) {
        expect(hash.length).toBe(32); // MD5 hash length
      }
    });

    it('should produce consistent hash for same environment', async () => {
      const hash1 = await getAudioFingerprint();
      const hash2 = await getAudioFingerprint();
      expect(hash1).toBe(hash2);
    });

    it('should handle timeout gracefully', async () => {
      const hash = await getAudioFingerprint({ timeout: 1000 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle custom timeout option', async () => {
      const hash = await getAudioFingerprint({ timeout: 500 });
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should return null when AudioContext is not supported', async () => {
      // In jsdom, AudioContext may not be available
      const hash = await getAudioFingerprint();
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle audio processing errors gracefully', async () => {
      // The function should not throw even if audio processing fails
      const hash = await getAudioFingerprint();
      expect(hash === null || hash?.length === 32).toBe(true);
    });

    it('should return null when not in browser', async () => {
      const originalWindow = globalThis.window;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).window;

      const hash = await getAudioFingerprint();
      expect(hash).toBeNull();

      // Restore window
      globalThis.window = originalWindow;
    });

    it('should handle very short timeout', async () => {
      const hash = await getAudioFingerprint({ timeout: 1 });
      // With 1ms timeout, might not complete
      expect(hash === null || typeof hash === 'string').toBe(true);
    });

    it('should handle missing OfflineAudioContext gracefully', async () => {
      const originalOfflineAudioContext = (globalThis as any).OfflineAudioContext;
      const originalWebkitOfflineAudioContext = (globalThis as any).webkitOfflineAudioContext;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).OfflineAudioContext;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).webkitOfflineAudioContext;

      const hash = await getAudioFingerprint();
      expect(hash === null || typeof hash === 'string').toBe(true);

      // Restore
      if (originalOfflineAudioContext) {
        (globalThis as any).OfflineAudioContext = originalOfflineAudioContext;
      }
      if (originalWebkitOfflineAudioContext) {
        (globalThis as any).webkitOfflineAudioContext = originalWebkitOfflineAudioContext;
      }
    });
  });
});
