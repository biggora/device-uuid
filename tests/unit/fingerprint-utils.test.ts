/**
 * Unit tests for fingerprint utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_FINGERPRINT_OPTIONS,
  FINGERPRINT_PRESETS,
  mergeOptions,
  getPresetOptions,
  combineHashes,
  calculateConfidence,
} from '../../src/utils/fingerprint';

describe('Fingerprint Utilities', () => {
  describe('DEFAULT_FINGERPRINT_OPTIONS', () => {
    it('should have all fingerprinting methods disabled by default', () => {
      expect(DEFAULT_FINGERPRINT_OPTIONS.canvas).toBe(false);
      expect(DEFAULT_FINGERPRINT_OPTIONS.webgl).toBe(false);
      expect(DEFAULT_FINGERPRINT_OPTIONS.audio).toBe(false);
      expect(DEFAULT_FINGERPRINT_OPTIONS.fonts).toBe(false);
      expect(DEFAULT_FINGERPRINT_OPTIONS.mediaDevices).toBe(false);
      expect(DEFAULT_FINGERPRINT_OPTIONS.networkInfo).toBe(false);
      expect(DEFAULT_FINGERPRINT_OPTIONS.timezone).toBe(false);
      expect(DEFAULT_FINGERPRINT_OPTIONS.incognitoDetection).toBe(false);
    });

    it('should have default timeout values', () => {
      expect(DEFAULT_FINGERPRINT_OPTIONS.timeout).toBe(5000);
      expect(DEFAULT_FINGERPRINT_OPTIONS.methodTimeout).toBe(1000);
    });
  });

  describe('FINGERPRINT_PRESETS', () => {
    it('should have minimal preset with all methods disabled', () => {
      const minimal = FINGERPRINT_PRESETS.minimal;
      expect(minimal.canvas).toBe(false);
      expect(minimal.webgl).toBe(false);
      expect(minimal.audio).toBe(false);
      expect(minimal.fonts).toBe(false);
    });

    it('should have standard preset with canvas, webgl, and timezone enabled', () => {
      const standard = FINGERPRINT_PRESETS.standard;
      expect(standard.canvas).toBe(true);
      expect(standard.webgl).toBe(true);
      expect(standard.timezone).toBe(true);
      expect(standard.audio).toBe(false);
      expect(standard.fonts).toBe(false);
    });

    it('should have comprehensive preset with all methods enabled', () => {
      const comprehensive = FINGERPRINT_PRESETS.comprehensive;
      expect(comprehensive.canvas).toBe(true);
      expect(comprehensive.webgl).toBe(true);
      expect(comprehensive.audio).toBe(true);
      expect(comprehensive.fonts).toBe(true);
      expect(comprehensive.mediaDevices).toBe(true);
      expect(comprehensive.networkInfo).toBe(true);
      expect(comprehensive.timezone).toBe(true);
      expect(comprehensive.incognitoDetection).toBe(true);
    });

    it('should have longer timeouts for comprehensive preset', () => {
      expect(FINGERPRINT_PRESETS.comprehensive.timeout).toBe(10000);
      expect(FINGERPRINT_PRESETS.comprehensive.methodTimeout).toBe(2000);
    });
  });

  describe('mergeOptions', () => {
    it('should return default options when no options provided', () => {
      const result = mergeOptions();
      expect(result).toEqual(DEFAULT_FINGERPRINT_OPTIONS);
    });

    it('should return default options when undefined provided', () => {
      const result = mergeOptions(undefined);
      expect(result).toEqual(DEFAULT_FINGERPRINT_OPTIONS);
    });

    it('should merge partial options with defaults', () => {
      const result = mergeOptions({ canvas: true });
      expect(result.canvas).toBe(true);
      expect(result.webgl).toBe(false);
      expect(result.timeout).toBe(5000);
    });

    it('should override multiple options', () => {
      const result = mergeOptions({
        canvas: true,
        webgl: true,
        timeout: 3000,
      });
      expect(result.canvas).toBe(true);
      expect(result.webgl).toBe(true);
      expect(result.timeout).toBe(3000);
      expect(result.audio).toBe(false);
    });
  });

  describe('getPresetOptions', () => {
    it('should return minimal preset options', () => {
      const result = getPresetOptions('minimal');
      expect(result).toEqual(FINGERPRINT_PRESETS.minimal);
    });

    it('should return standard preset options', () => {
      const result = getPresetOptions('standard');
      expect(result).toEqual(FINGERPRINT_PRESETS.standard);
    });

    it('should return comprehensive preset options', () => {
      const result = getPresetOptions('comprehensive');
      expect(result).toEqual(FINGERPRINT_PRESETS.comprehensive);
    });

    it('should return a copy, not a reference', () => {
      const result = getPresetOptions('standard');
      result.canvas = false;
      expect(FINGERPRINT_PRESETS.standard.canvas).toBe(true);
    });
  });

  describe('combineHashes', () => {
    it('should combine multiple hashes with default separator', () => {
      const result = combineHashes(['abc123', 'def456', 'ghi789']);
      expect(result).toBe('abc123:def456:ghi789');
    });

    it('should use custom separator', () => {
      const result = combineHashes(['abc', 'def'], '|');
      expect(result).toBe('abc|def');
    });

    it('should filter out null values', () => {
      const result = combineHashes(['abc', null, 'def', null]);
      expect(result).toBe('abc:def');
    });

    it('should filter out empty strings', () => {
      const result = combineHashes(['abc', '', 'def', '']);
      expect(result).toBe('abc:def');
    });

    it('should return empty string for all null/empty input', () => {
      const result = combineHashes([null, '', null]);
      expect(result).toBe('');
    });

    it('should handle single hash', () => {
      const result = combineHashes(['single']);
      expect(result).toBe('single');
    });
  });

  describe('calculateConfidence', () => {
    it('should return 0 for no components', () => {
      const result = calculateConfidence(0, 0);
      expect(result).toBe(0);
    });

    it('should return 1 for all successful components', () => {
      const result = calculateConfidence(5, 5);
      expect(result).toBe(1);
    });

    it('should return 0.5 for half successful components', () => {
      const result = calculateConfidence(4, 2);
      expect(result).toBe(0.5);
    });

    it('should return correct ratio for partial success', () => {
      const result = calculateConfidence(10, 7);
      expect(result).toBeCloseTo(0.7);
    });

    it('should clamp result between 0 and 1', () => {
      const result = calculateConfidence(3, 3);
      expect(result).toBeLessThanOrEqual(1);
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});
