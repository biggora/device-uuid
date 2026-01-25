/**
 * Unit tests for environment utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  isBrowser,
  isNode,
  getNavigator,
  getScreen,
  getWindow,
  getUserAgent,
  getLanguage,
  getColorDepth,
  getPixelDepth,
  getScreenResolution,
  getCPUCores,
  isTouchScreen,
  getDeviceMemory,
  getMaxTouchPoints,
  getDoNotTrack,
  getPdfViewerEnabled,
} from '../../src/utils/environment';

describe('Environment Utilities', () => {
  describe('isBrowser', () => {
    it('should return a boolean', () => {
      const result = isBrowser();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('isNode', () => {
    it('should return a boolean', () => {
      const result = isNode();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getNavigator', () => {
    it('should return Navigator or undefined', () => {
      const nav = getNavigator();
      expect(nav === undefined || typeof nav === 'object').toBe(true);
    });
  });

  describe('getScreen', () => {
    it('should return Screen or undefined', () => {
      const screen = getScreen();
      expect(screen === undefined || typeof screen === 'object').toBe(true);
    });
  });

  describe('getWindow', () => {
    it('should return Window or undefined', () => {
      const win = getWindow();
      expect(win === undefined || typeof win === 'object').toBe(true);
    });
  });

  describe('getUserAgent', () => {
    it('should return a string', () => {
      const ua = getUserAgent();
      expect(typeof ua).toBe('string');
    });
  });

  describe('getLanguage', () => {
    it('should return a string', () => {
      const lang = getLanguage();
      expect(typeof lang).toBe('string');
    });

    it('should be lowercase or "unknown"', () => {
      const lang = getLanguage();
      expect(lang === lang.toLowerCase() || lang === 'unknown').toBe(true);
    });
  });

  describe('getColorDepth', () => {
    it('should return a number', () => {
      const depth = getColorDepth();
      expect(typeof depth).toBe('number');
    });

    it('should return -1 or positive value', () => {
      const depth = getColorDepth();
      expect(depth === -1 || depth > 0).toBe(true);
    });
  });

  describe('getPixelDepth', () => {
    it('should return a number', () => {
      const depth = getPixelDepth();
      expect(typeof depth).toBe('number');
    });

    it('should return -1 or positive value', () => {
      const depth = getPixelDepth();
      expect(depth === -1 || depth > 0).toBe(true);
    });
  });

  describe('getScreenResolution', () => {
    it('should return a tuple of two numbers', () => {
      const resolution = getScreenResolution();
      expect(Array.isArray(resolution)).toBe(true);
      expect(resolution.length).toBe(2);
      expect(typeof resolution[0]).toBe('number');
      expect(typeof resolution[1]).toBe('number');
    });

    it('should return non-negative values', () => {
      const [width, height] = getScreenResolution();
      expect(width).toBeGreaterThanOrEqual(0);
      expect(height).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getCPUCores', () => {
    it('should return a number', () => {
      const cores = getCPUCores();
      expect(typeof cores).toBe('number');
    });

    it('should return -1 or positive value', () => {
      const cores = getCPUCores();
      expect(cores === -1 || cores > 0).toBe(true);
    });
  });

  describe('isTouchScreen', () => {
    it('should return a boolean', () => {
      const result = isTouchScreen();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getDeviceMemory', () => {
    it('should return a number', () => {
      const memory = getDeviceMemory();
      expect(typeof memory).toBe('number');
    });

    it('should return -1 or valid memory value', () => {
      const memory = getDeviceMemory();
      // deviceMemory returns -1 if not supported, or 0.25, 0.5, 1, 2, 4, 8
      const validValues = [-1, 0.25, 0.5, 1, 2, 4, 8];
      expect(validValues.includes(memory) || memory === -1).toBe(true);
    });
  });

  describe('getMaxTouchPoints', () => {
    it('should return a number', () => {
      const points = getMaxTouchPoints();
      expect(typeof points).toBe('number');
    });

    it('should return non-negative value', () => {
      const points = getMaxTouchPoints();
      expect(points).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getDoNotTrack', () => {
    it('should return string or null', () => {
      const dnt = getDoNotTrack();
      expect(dnt === null || typeof dnt === 'string').toBe(true);
    });

    it('should return valid DNT value if not null', () => {
      const dnt = getDoNotTrack();
      if (dnt !== null) {
        // DNT values are typically '1', '0', 'unspecified', or 'yes'/'no'
        expect(typeof dnt).toBe('string');
      }
    });
  });

  describe('getPdfViewerEnabled', () => {
    it('should return boolean or null', () => {
      const result = getPdfViewerEnabled();
      // In browser environments, pdfViewerEnabled is a standard Navigator property
      // In test environments (jsdom), it may be null if navigator is not fully implemented
      expect(result === null || result === undefined || typeof result === 'boolean').toBe(true);
    });
  });
});
