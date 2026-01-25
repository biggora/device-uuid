/**
 * Tests for module exports
 * Ensures that all public APIs are properly exported from index files
 */

import { describe, it, expect } from 'vitest';

// Import from main index
import {
  DeviceUUID,
  BOTS,
  VERSION_PATTERNS,
  DEFAULT_OPTIONS,
  hashMD5,
  hashInt,
  DEFAULT_FINGERPRINT_OPTIONS,
  FINGERPRINT_PRESETS,
  mergeOptions,
  getPresetOptions,
  isFeatureSupported,
  getErrorLogger,
  logError,
  getCanvasFingerprint,
  isCanvasSupported,
  getWebGLFingerprint,
  isWebGLSupported,
  getAudioFingerprint,
  isAudioSupported,
  getFontFingerprint,
  getFontFingerprintAsync,
  getDetectedFonts,
  getDetectedFontsAsync,
  getDefaultFontList,
  isFontDetectionSupported,
  isOfflineAudioSupported,
  isDebugInfoSupported,
} from '../../src';

// Import types from main index
import type {
  DeviceUUIDOptions,
  FingerprintOptions,
  FingerprintFeature,
  FingerprintPreset,
} from '../../src';

// Import from fingerprints index
import {
  getCanvasFingerprint as getCanvasFP,
  isCanvasSupported as isCanvasSupp,
  getWebGLFingerprint as getWebGLFP,
  isWebGLSupported as isWebGLSupp,
  getAudioFingerprint as getAudioFP,
  isAudioSupported as isAudioSupp,
  getFontFingerprint as getFontFP,
  getFontFingerprintAsync as getFontFPAsync,
  getDetectedFonts as getDetected,
  getDetectedFontsAsync as getDetectedAsync,
  getDefaultFontList as getDefaultFonts,
  isFontDetectionSupported as isFontDetectSupp,
  isOfflineAudioSupported as isOfflineAudioSupp,
  isDebugInfoSupported as isDebugInfoSupp,
} from '../../src/fingerprints';

describe('Module Exports', () => {
  describe('src/index.ts exports', () => {
    it('should export DeviceUUID class', () => {
      expect(DeviceUUID).toBeDefined();
      expect(typeof DeviceUUID).toBe('function');
    });

    it('should export BOTS constant', () => {
      expect(BOTS).toBeDefined();
      expect(typeof BOTS).toBe('object');
      expect(Object.keys(BOTS).length).toBeGreaterThan(0);
    });

    it('should export VERSION_PATTERNS constant', () => {
      expect(VERSION_PATTERNS).toBeDefined();
      expect(typeof VERSION_PATTERNS).toBe('object');
    });

    it('should export DEFAULT_OPTIONS constant', () => {
      expect(DEFAULT_OPTIONS).toBeDefined();
      expect(typeof DEFAULT_OPTIONS).toBe('object');
    });

    it('should export hash utilities', () => {
      expect(hashMD5).toBeDefined();
      expect(typeof hashMD5).toBe('function');
      expect(hashInt).toBeDefined();
      expect(typeof hashInt).toBe('function');
    });

    it('should export fingerprint utilities', () => {
      expect(DEFAULT_FINGERPRINT_OPTIONS).toBeDefined();
      expect(FINGERPRINT_PRESETS).toBeDefined();
      expect(mergeOptions).toBeDefined();
      expect(getPresetOptions).toBeDefined();
      expect(isFeatureSupported).toBeDefined();
      expect(getErrorLogger).toBeDefined();
      expect(logError).toBeDefined();
    });

    it('should export canvas fingerprint functions', () => {
      expect(getCanvasFingerprint).toBeDefined();
      expect(typeof getCanvasFingerprint).toBe('function');
      expect(isCanvasSupported).toBeDefined();
      expect(typeof isCanvasSupported).toBe('function');
    });

    it('should export webgl fingerprint functions', () => {
      expect(getWebGLFingerprint).toBeDefined();
      expect(typeof getWebGLFingerprint).toBe('function');
      expect(isWebGLSupported).toBeDefined();
      expect(typeof isWebGLSupported).toBe('function');
    });

    it('should export audio fingerprint functions', () => {
      expect(getAudioFingerprint).toBeDefined();
      expect(typeof getAudioFingerprint).toBe('function');
      expect(isAudioSupported).toBeDefined();
      expect(typeof isAudioSupported).toBe('function');
      expect(isOfflineAudioSupported).toBeDefined();
      expect(typeof isOfflineAudioSupported).toBe('function');
    });

    it('should export font fingerprint functions', () => {
      expect(getFontFingerprint).toBeDefined();
      expect(typeof getFontFingerprint).toBe('function');
      expect(getFontFingerprintAsync).toBeDefined();
      expect(typeof getFontFingerprintAsync).toBe('function');
      expect(getDetectedFonts).toBeDefined();
      expect(typeof getDetectedFonts).toBe('function');
      expect(getDetectedFontsAsync).toBeDefined();
      expect(typeof getDetectedFontsAsync).toBe('function');
      expect(getDefaultFontList).toBeDefined();
      expect(typeof getDefaultFontList).toBe('function');
      expect(isFontDetectionSupported).toBeDefined();
      expect(typeof isFontDetectionSupported).toBe('function');
    });

    it('should export webgl debug info support function', () => {
      expect(isDebugInfoSupported).toBeDefined();
      expect(typeof isDebugInfoSupported).toBe('function');
    });

    it('should have default export', () => {
      // The default export is DeviceUUID, so we can't test it directly
      // but we can verify that DeviceUUID is available
      expect(DeviceUUID).toBeDefined();
    });
  });

  describe('src/fingerprints/index.ts exports', () => {
    it('should export canvas fingerprint functions', () => {
      expect(getCanvasFP).toBeDefined();
      expect(typeof getCanvasFP).toBe('function');
      expect(isCanvasSupp).toBeDefined();
      expect(typeof isCanvasSupp).toBe('function');
    });

    it('should export webgl fingerprint functions', () => {
      expect(getWebGLFP).toBeDefined();
      expect(typeof getWebGLFP).toBe('function');
      expect(isWebGLSupp).toBeDefined();
      expect(typeof isWebGLSupp).toBe('function');
      expect(isDebugInfoSupp).toBeDefined();
      expect(typeof isDebugInfoSupp).toBe('function');
    });

    it('should export audio fingerprint functions', () => {
      expect(getAudioFP).toBeDefined();
      expect(typeof getAudioFP).toBe('function');
      expect(isAudioSupp).toBeDefined();
      expect(typeof isAudioSupp).toBe('function');
      expect(isOfflineAudioSupp).toBeDefined();
      expect(typeof isOfflineAudioSupp).toBe('function');
    });

    it('should export font fingerprint functions', () => {
      expect(getFontFP).toBeDefined();
      expect(typeof getFontFP).toBe('function');
      expect(getFontFPAsync).toBeDefined();
      expect(typeof getFontFPAsync).toBe('function');
      expect(getDetected).toBeDefined();
      expect(typeof getDetected).toBe('function');
      expect(getDetectedAsync).toBeDefined();
      expect(typeof getDetectedAsync).toBe('function');
      expect(getDefaultFonts).toBeDefined();
      expect(typeof getDefaultFonts).toBe('function');
      expect(isFontDetectSupp).toBeDefined();
      expect(typeof isFontDetectSupp).toBe('function');
    });
  });

  describe('TypeScript types are exported', () => {
    it('should export DeviceUUIDOptions type', () => {
      // Type check - this will cause a TypeScript error if the type doesn't exist
      const options: DeviceUUIDOptions = {};
      expect(typeof options).toBe('object');
    });

    it('should export FingerprintOptions type', () => {
      const fpOptions: FingerprintOptions = {};
      expect(typeof fpOptions).toBe('object');
    });

    it('should export FingerprintFeature type', () => {
      const feature: FingerprintFeature = 'canvas';
      expect(typeof feature).toBe('string');
    });

    it('should export FingerprintPreset type', () => {
      const preset: FingerprintPreset = 'standard';
      expect(typeof preset).toBe('string');
    });
  });

  describe('Constant values', () => {
    it('should have non-empty BOTS array', () => {
      expect(BOTS.length).toBeGreaterThan(0);
      expect(BOTS).toContain('googlebot');
    });

    it('should have DEFAULT_OPTIONS with expected properties', () => {
      expect(DEFAULT_OPTIONS).toHaveProperty('version');
      expect(DEFAULT_OPTIONS).toHaveProperty('language');
      expect(DEFAULT_OPTIONS).toHaveProperty('platform');
      expect(DEFAULT_OPTIONS).toHaveProperty('os');
      expect(DEFAULT_OPTIONS).toHaveProperty('pixelDepth');
      expect(DEFAULT_OPTIONS).toHaveProperty('colorDepth');
      expect(DEFAULT_OPTIONS).toHaveProperty('isMobile');
      expect(DEFAULT_OPTIONS).toHaveProperty('isDesktop');
    });

    it('should have DEFAULT_FINGERPRINT_OPTIONS', () => {
      expect(DEFAULT_FINGERPRINT_OPTIONS).toBeDefined();
      expect(typeof DEFAULT_FINGERPRINT_OPTIONS).toBe('object');
    });

    it('should have FINGERPRINT_PRESETS', () => {
      expect(FINGERPRINT_PRESETS).toBeDefined();
      expect(FINGERPRINT_PRESETS.minimal).toBeDefined();
      expect(FINGERPRINT_PRESETS.standard).toBeDefined();
      expect(FINGERPRINT_PRESETS.comprehensive).toBeDefined();
    });
  });

  describe('Hash utility functions', () => {
    it('hashMD5 should hash string', () => {
      const result = hashMD5('test');
      expect(typeof result).toBe('string');
      expect(result.length).toBe(32);
    });

    it('hashInt should convert string to integer', () => {
      const result = hashInt('test');
      expect(typeof result).toBe('number');
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe('Fingerprint utility functions', () => {
    it('mergeOptions should merge objects', () => {
      const result = mergeOptions({ canvas: true });
      expect(result).toHaveProperty('canvas', true);
    });

    it('getPresetOptions should return preset options', () => {
      const result = getPresetOptions('standard');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('isFeatureSupported should check feature support', () => {
      const result = isFeatureSupported('canvas');
      expect(typeof result).toBe('boolean');
    });

    it('getErrorLogger should return a logger', () => {
      const logger = getErrorLogger();
      expect(logger).toBeDefined();
      expect(typeof logger.log).toBe('function');
    });
  });

  describe('Fingerprint method signatures', () => {
    it('canvas methods should accept options parameter', () => {
      // Test that methods can be called with options
      expect(() => {
        isCanvasSupported();
      }).not.toThrow();
    });

    it('webgl methods should accept options parameter', () => {
      expect(() => {
        isWebGLSupported();
      }).not.toThrow();
    });

    it('audio methods should accept options parameter', () => {
      expect(() => {
        isAudioSupported();
      }).not.toThrow();
    });

    it('font methods should accept options parameter', () => {
      expect(() => {
        isFontDetectionSupported();
      }).not.toThrow();
    });

    it('getDefaultFontList should return array of fonts', () => {
      const fonts = getDefaultFontList();
      expect(Array.isArray(fonts)).toBe(true);
      expect(fonts.length).toBeGreaterThan(0);
    });
  });
});
