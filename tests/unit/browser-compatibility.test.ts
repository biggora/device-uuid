/**
 * Tests for browser compatibility utilities
 */

import { describe, it, expect } from 'vitest';
import {
  BROWSER_LIMITATIONS,
  BROWSER_FEATURE_SUPPORT,
  BROWSER_WORKAROUNDS,
  getCompatibilityInfo,
} from '../../src/utils/browser-compatibility';

describe('Browser Compatibility Utilities', () => {
  describe('BROWSER_LIMITATIONS', () => {
    it('should have Safari limitations defined', () => {
      expect(BROWSER_LIMITATIONS.safari).toBeDefined();
      expect(BROWSER_LIMITATIONS.safari.canvas).toBeDefined();
      expect(BROWSER_LIMITATIONS.safari.webgl).toBeDefined();
      expect(BROWSER_LIMITATIONS.safari.audio).toBeDefined();
      expect(BROWSER_LIMITATIONS.safari.fonts).toBeDefined();
    });

    it('should have Firefox limitations defined', () => {
      expect(BROWSER_LIMITATIONS.firefox).toBeDefined();
      expect(BROWSER_LIMITATIONS.firefox.canvas).toBeDefined();
      expect(BROWSER_LIMITATIONS.firefox.webgl).toBeDefined();
      expect(BROWSER_LIMITATIONS.firefox.audio).toBeDefined();
    });

    it('should have Chrome limitations defined', () => {
      expect(BROWSER_LIMITATIONS.chrome).toBeDefined();
      expect(BROWSER_LIMITATIONS.chrome.canvas).toBeDefined();
      expect(BROWSER_LIMITATIONS.chrome.webgl).toBeDefined();
      expect(BROWSER_LIMITATIONS.chrome.audio).toBeDefined();
    });

    it('should have Brave limitations defined', () => {
      expect(BROWSER_LIMITATIONS.brave).toBeDefined();
      expect(BROWSER_LIMITATIONS.brave.canvas).toBeDefined();
      expect(BROWSER_LIMITATIONS.brave.webgl).toBeDefined();
      expect(BROWSER_LIMITATIONS.brave.audio).toBeDefined();
    });

    it('should have Tor limitations defined', () => {
      expect(BROWSER_LIMITATIONS.tor).toBeDefined();
      expect(BROWSER_LIMITATIONS.tor.canvas).toBeDefined();
      expect(BROWSER_LIMITATIONS.tor.webgl).toBeDefined();
      expect(BROWSER_LIMITATIONS.tor.audio).toBeDefined();
      expect(BROWSER_LIMITATIONS.tor.fonts).toBeDefined();
    });

    it('should have Edge limitations defined', () => {
      expect(BROWSER_LIMITATIONS.edge).toBeDefined();
      expect(BROWSER_LIMITATIONS.edge.canvas).toBeDefined();
      expect(BROWSER_LIMITATIONS.edge.webgl).toBeDefined();
      expect(BROWSER_LIMITATIONS.edge.audio).toBeDefined();
    });
  });

  describe('BROWSER_FEATURE_SUPPORT', () => {
    it('should have Safari support matrix', () => {
      expect(BROWSER_FEATURE_SUPPORT.safari).toBeDefined();
      expect(BROWSER_FEATURE_SUPPORT.safari.canvas).toBe('partial');
      expect(BROWSER_FEATURE_SUPPORT.safari.webgl).toBe('partial');
      expect(BROWSER_FEATURE_SUPPORT.safari.audio).toBe('partial');
      expect(BROWSER_FEATURE_SUPPORT.safari.fonts).toBe('full');
      expect(BROWSER_FEATURE_SUPPORT.safari.mediaDevices).toBe('full');
    });

    it('should have Firefox support matrix', () => {
      expect(BROWSER_FEATURE_SUPPORT.firefox).toBeDefined();
      expect(BROWSER_FEATURE_SUPPORT.firefox.canvas).toBe('partial');
      expect(BROWSER_FEATURE_SUPPORT.firefox.webgl).toBe('partial');
      expect(BROWSER_FEATURE_SUPPORT.firefox.audio).toBe('partial');
    });

    it('should have Chrome support matrix', () => {
      expect(BROWSER_FEATURE_SUPPORT.chrome).toBeDefined();
      expect(BROWSER_FEATURE_SUPPORT.chrome.canvas).toBe('full');
      expect(BROWSER_FEATURE_SUPPORT.chrome.webgl).toBe('full');
      expect(BROWSER_FEATURE_SUPPORT.chrome.audio).toBe('partial');
    });

    it('should have Brave support matrix with limited support', () => {
      expect(BROWSER_FEATURE_SUPPORT.brave).toBeDefined();
      expect(BROWSER_FEATURE_SUPPORT.brave.canvas).toBe('limited');
      expect(BROWSER_FEATURE_SUPPORT.brave.webgl).toBe('limited');
      expect(BROWSER_FEATURE_SUPPORT.brave.audio).toBe('limited');
    });

    it('should have Tor support matrix with blocked features', () => {
      expect(BROWSER_FEATURE_SUPPORT.tor).toBeDefined();
      expect(BROWSER_FEATURE_SUPPORT.tor.canvas).toBe('blocked');
      expect(BROWSER_FEATURE_SUPPORT.tor.webgl).toBe('blocked');
      expect(BROWSER_FEATURE_SUPPORT.tor.audio).toBe('blocked');
    });

    it('should have Edge support matrix', () => {
      expect(BROWSER_FEATURE_SUPPORT.edge).toBeDefined();
      expect(BROWSER_FEATURE_SUPPORT.edge.canvas).toBe('full');
      expect(BROWSER_FEATURE_SUPPORT.edge.webgl).toBe('full');
    });
  });

  describe('BROWSER_WORKAROUNDS', () => {
    it('should have detectPrivacyMode function', () => {
      expect(BROWSER_WORKAROUNDS.detectPrivacyMode).toBeDefined();
      expect(typeof BROWSER_WORKAROUNDS.detectPrivacyMode).toBe('function');
    });

    it('should have detectCanvasBlocked function', () => {
      expect(BROWSER_WORKAROUNDS.detectCanvasBlocked).toBeDefined();
      expect(typeof BROWSER_WORKAROUNDS.detectCanvasBlocked).toBe('function');
    });
  });

  describe('detectPrivacyMode', () => {
    it('should return indicators array', () => {
      const result = BROWSER_WORKAROUNDS.detectPrivacyMode();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle missing navigator.storage gracefully', () => {
      const originalStorage = (navigator as any).storage;
      delete (navigator as any).storage;

      const result = BROWSER_WORKAROUNDS.detectPrivacyMode();
      expect(Array.isArray(result)).toBe(true);

      if (originalStorage) {
        (navigator as any).storage = originalStorage;
      }
    });
  });

  describe('detectCanvasBlocked', () => {
    it('should detect canvas availability', () => {
      const result = BROWSER_WORKAROUNDS.detectCanvasBlocked();
      expect(typeof result).toBe('boolean');
    });

    it('should handle canvas creation errors gracefully', () => {
      const originalCreateElement = document.createElement;

      // Spy on createElement to verify it's called
      const createElementSpy = () => {
        throw new Error('Canvas creation blocked');
      };

      // Temporarily replace - note this might cause issues but demonstrates error handling
      try {
        document.createElement = createElementSpy;
        const result = BROWSER_WORKAROUNDS.detectCanvasBlocked();
        expect(result).toBe(true);
      } finally {
        document.createElement = originalCreateElement;
      }
    });

    it('should detect normal canvas operation', () => {
      const result = BROWSER_WORKAROUNDS.detectCanvasBlocked();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getCompatibilityInfo', () => {
    it('should return canvas compatibility info', () => {
      const info = getCompatibilityInfo('canvas');
      expect(info.feature).toBe('canvas');
      expect(info.supportLevel).toBeDefined();
      expect(Array.isArray(info.limitations)).toBe(true);
      expect(Array.isArray(info.workarounds)).toBe(true);
      expect(info.limitations.length).toBeGreaterThan(0);
      expect(info.workarounds.length).toBeGreaterThan(0);
    });

    it('should return webgl compatibility info', () => {
      const info = getCompatibilityInfo('webgl');
      expect(info.feature).toBe('webgl');
      expect(info.supportLevel).toBeDefined();
      expect(info.limitations.length).toBeGreaterThan(0);
      expect(info.workarounds.length).toBeGreaterThan(0);
    });

    it('should return audio compatibility info', () => {
      const info = getCompatibilityInfo('audio');
      expect(info.feature).toBe('audio');
      expect(info.supportLevel).toBeDefined();
      expect(info.limitations.length).toBeGreaterThan(0);
      expect(info.workarounds.length).toBeGreaterThan(0);
    });

    it('should return fonts compatibility info', () => {
      const info = getCompatibilityInfo('fonts');
      expect(info.feature).toBe('fonts');
      expect(info.limitations.length).toBeGreaterThan(0);
    });

    it('should return mediaDevices compatibility info', () => {
      const info = getCompatibilityInfo('mediaDevices');
      expect(info.feature).toBe('mediaDevices');
      expect(info.limitations.length).toBeGreaterThan(0);
    });

    it('should return networkInfo compatibility info', () => {
      const info = getCompatibilityInfo('networkInfo');
      expect(info.feature).toBe('networkInfo');
      expect(info.limitations.length).toBeGreaterThan(0);
    });

    it('should return timezone compatibility info with full support', () => {
      const info = getCompatibilityInfo('timezone');
      expect(info.feature).toBe('timezone');
      expect(info.supportLevel).toBe('full');
    });

    it('should return incognitoDetection compatibility info with limited support', () => {
      const info = getCompatibilityInfo('incognitoDetection');
      expect(info.feature).toBe('incognitoDetection');
      expect(info.supportLevel).toBe('limited');
    });

    it('should include privacy mode limitations for canvas', () => {
      const info = getCompatibilityInfo('canvas');
      expect(info.limitations.some((l) => l.includes('private') || l.includes('Private'))).toBe(
        true
      );
    });

    it('should include autoplay policy limitations for audio', () => {
      const info = getCompatibilityInfo('audio');
      expect(info.limitations.some((l) => l.includes('autoplay') || l.includes('user'))).toBe(true);
    });

    it('should include WebGL blocking in Tor browser', () => {
      const info = getCompatibilityInfo('webgl');
      expect(info.limitations.some((l) => l.includes('Tor'))).toBe(true);
    });

    it('should provide workarounds for canvas fingerprinting', () => {
      const info = getCompatibilityInfo('canvas');
      expect(info.workarounds.length).toBeGreaterThan(0);
    });

    it('should provide workarounds for audio autoplay policy', () => {
      const info = getCompatibilityInfo('audio');
      expect(info.workarounds.some((w) => w.includes('user'))).toBe(true);
    });
  });

  describe('Browser Limitations Content', () => {
    it('should document Safari autoplay policy for audio', () => {
      expect(BROWSER_LIMITATIONS.safari.audio.autoplayPolicy).toBeDefined();
      expect(BROWSER_LIMITATIONS.safari.audio.autoplayPolicy).toContain('user gesture');
    });

    it('should document Firefox privacy.resistFingerprinting for canvas', () => {
      expect(BROWSER_LIMITATIONS.firefox.canvas.privacyMode).toBeDefined();
      expect(BROWSER_LIMITATIONS.firefox.canvas.privacyMode).toContain(
        'privacy.resistFingerprinting'
      );
    });

    it('should document Tor browser WebGL blocking', () => {
      expect(BROWSER_LIMITATIONS.tor.webgl.alwaysBlocked).toBeDefined();
      expect(BROWSER_LIMITATIONS.tor.webgl.alwaysBlocked).toContain('disabled');
    });

    it('should document Brave Shields for canvas', () => {
      expect(BROWSER_LIMITATIONS.brave.canvas.shields).toBeDefined();
      expect(BROWSER_LIMITATIONS.brave.canvas.shields).toContain('Shields');
    });
  });
});
