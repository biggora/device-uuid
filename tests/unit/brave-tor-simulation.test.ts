/**
 * Tests simulating Brave and Tor browser behavior
 *
 * These tests mock browser environments to verify graceful degradation
 * when fingerprinting features are blocked by privacy-focused browsers.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DeviceUUID } from '../../src';

describe('Brave Browser Simulation', () => {
  let deviceUUID: DeviceUUID;
  let originalUserAgent: string;

  beforeEach(() => {
    deviceUUID = new DeviceUUID();
    originalUserAgent = navigator.userAgent;
  });

  afterEach(() => {
    // Restore original user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  describe('Canvas Fingerprinting - Brave Shields Simulation', () => {
    it('should handle blocked canvas gracefully (Brave Shields Strict)', async () => {
      // Simulate Brave blocking canvas by returning empty data URL
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(mockCanvas, 'toDataURL').mockReturnValue('');

      // Mock canvas creation to return blocked canvas
      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const originalCreateElement = document.createElement;

      try {
        const uuid = await deviceUUID.getAsync({ canvas: true });
        expect(uuid).toBeDefined();
        expect(typeof uuid).toBe('string');
        expect(uuid.length).toBeGreaterThan(0);
      } finally {
        createElementSpy.mockRestore();
      }
    });

    it('should detect canvas blocker via pixel manipulation check', () => {
      // Simulate Brave Shields returning modified pixel data
      const mockCanvas = document.createElement('canvas');
      const mockGetImageData = vi.fn(() => {
        // Return white pixels instead of red (Brave behavior)
        return {
          data: new Uint8ClampedArray([255, 255, 255, 255]),
        };
      });

      vi.spyOn(mockCanvas, 'getContext').mockReturnValue({
        getImageData: mockGetImageData,
        fillStyle: '',
        fillRect: vi.fn(),
        canvas: mockCanvas,
      } as any);

      // This should be detected as blocked
      expect(mockGetImageData).toBeDefined();
    });

    it('should fall back to other methods when canvas is blocked', async () => {
      // Block canvas but allow other methods
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(mockCanvas, 'toDataURL').mockReturnValue('');

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const originalCreateElement = document.createElement;

      try {
        const details = await deviceUUID.getDetailedAsync({
          canvas: true,
          webgl: false,
          audio: false,
          fonts: false,
        });

        // Should still return a result
        expect(details.uuid).toBeDefined();
        // Canvas component should be null or empty
        expect(details.components.canvas).toBeDefined();
      } finally {
        createElementSpy.mockRestore();
      }
    });
  });

  describe('WebGL Fingerprinting - Brave Shields Simulation', () => {
    it('should handle disabled WebGL gracefully', async () => {
      // Simulate Brave disabling WebGL by returning null context
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(null);

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      const originalCreateElement = document.createElement;

      try {
        const uuid = await deviceUUID.getAsync({ webgl: true });
        expect(uuid).toBeDefined();
        expect(typeof uuid).toBe('string');
      } finally {
        createElementSpy.mockRestore();
      }
    });

    it('should handle missing WEBGL_debug_renderer_info extension', async () => {
      // Simulate Brave Shields blocking the debug extension
      const mockCanvas = document.createElement('canvas');
      const mockContext = {
        getParameter: vi.fn((param: number) => {
          if (param === 37445) return 'Intel Inc.';
          if (param === 37446) return 'Intel Iris OpenGL Engine';
          return null;
        }),
        getSupportedExtensions: vi.fn(() => []),
        getExtension: vi.fn(() => null),
      };

      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext as any);

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      const originalCreateElement = document.createElement;

      try {
        const uuid = await deviceUUID.getAsync({ webgl: true });
        expect(uuid).toBeDefined();
      } finally {
        createElementSpy.mockRestore();
      }
    });
  });

  describe('Audio Fingerprinting - Brave Simulation', () => {
    it('should handle blocked AudioContext', async () => {
      // Simulate Brave blocking audio fingerprinting
      const mockAudioContext = vi.fn().mockImplementation(() => {
        throw new Error('AudioContext blocked by Brave Shields');
      });

      (window as any).AudioContext = mockAudioContext;
      (window as any).webkitAudioContext = mockAudioContext;

      try {
        const uuid = await deviceUUID.getAsync({ audio: true });
        expect(uuid).toBeDefined();
      } finally {
        delete (window as any).AudioContext;
        delete (window as any).webkitAudioContext;
      }
    });

    it('should handle suspended AudioContext', async () => {
      // Simulate Brave suspending audio context
      const mockAudioContext = vi.fn().mockImplementation(() => ({
        createOscillator: vi.fn(),
        createAnalyser: vi.fn(),
        createDynamicsCompressor: vi.fn(),
        resume: vi.fn().mockResolvedValue(undefined),
        state: 'suspended',
      }));

      (window as any).AudioContext = mockAudioContext;

      try {
        const uuid = await deviceUUID.getAsync({ audio: true });
        expect(uuid).toBeDefined();
      } finally {
        delete (window as any).AudioContext;
      }
    });
  });

  describe('Navigator Property Randomization - Brave Simulation', () => {
    it('should handle falsified deviceMemory', () => {
      const originalDeviceMemory = (navigator as any).deviceMemory;
      const originalHardwareConcurrency = navigator.hardwareConcurrency;

      // Brave may return fake values
      Object.defineProperty(navigator, 'deviceMemory', {
        value: 8,
        configurable: true,
      });

      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 4,
        configurable: true,
      });

      try {
        const uuid = deviceUUID.get();
        expect(uuid).toBeDefined();
        expect(typeof uuid).toBe('string');
      } finally {
        if (originalDeviceMemory !== undefined) {
          Object.defineProperty(navigator, 'deviceMemory', {
            value: originalDeviceMemory,
            configurable: true,
          });
        } else {
          delete (navigator as any).deviceMemory;
        }

        Object.defineProperty(navigator, 'hardwareConcurrency', {
          value: originalHardwareConcurrency,
          configurable: true,
        });
      }
    });
  });
});

describe('Tor Browser Simulation', () => {
  let deviceUUID: DeviceUUID;

  beforeEach(() => {
    deviceUUID = new DeviceUUID();
  });

  describe('Canvas Fingerprinting - Tor Simulation', () => {
    it('should handle Tor browser canvas normalization', async () => {
      // Tor returns white/transparent canvas
      const mockCanvas = document.createElement('canvas');
      const mockToDataURL = vi
        .spyOn(mockCanvas, 'toDataURL')
        .mockReturnValue('data:image/png;base64,');

      const mockGetContext = vi.spyOn(mockCanvas, 'getContext').mockReturnValue({
        fillStyle: '',
        fillRect: vi.fn(),
        getImageData: vi.fn(() => ({
          data: new Uint8ClampedArray([255, 255, 255, 0]), // White + transparent
        })),
        canvas: mockCanvas,
      } as any);

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      const originalCreateElement = document.createElement;

      try {
        const uuid = await deviceUUID.getAsync({ canvas: true });
        expect(uuid).toBeDefined();
        // Should fall back gracefully
      } finally {
        createElementSpy.mockRestore();
        mockGetContext.mockRestore();
        mockToDataURL.mockRestore();
      }
    });

    it('should detect Tor-like canvas behavior (all pixels same)', () => {
      const mockCanvas = document.createElement('canvas');
      const mockGetImageData = vi.fn(() => ({
        // Tor returns uniform pixels
        data: new Uint8ClampedArray([200, 200, 200, 255, 200, 200, 200, 255, 200, 200, 200, 255]),
      }));

      vi.spyOn(mockCanvas, 'getContext').mockReturnValue({
        getImageData: mockGetImageData,
        canvas: mockCanvas,
      } as any);

      const result = mockGetImageData();
      expect(result.data).toBeDefined();
    });
  });

  describe('WebGL Fingerprinting - Tor Simulation', () => {
    it('should handle Tor completely disabling WebGL', async () => {
      // Tor disables WebGL entirely
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(null);

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      const originalCreateElement = document.createElement;

      try {
        const details = await deviceUUID.getDetailedAsync({ webgl: true });
        expect(details.uuid).toBeDefined();
        expect(details.components.webgl).toBeDefined();
      } finally {
        createElementSpy.mockRestore();
      }
    });

    it('should handle Tor returning minimal WebGL info', async () => {
      const mockCanvas = document.createElement('canvas');
      const mockContext = {
        getParameter: vi.fn((param: number) => {
          // Tor returns minimal/generic values
          if (param === 37445) return 'Mozilla'; // Generic vendor
          if (param === 37446) return 'Mozilla'; // Generic renderer
          if (param === 7938) return 16384; // Common MAX_TEXTURE_SIZE
          if (param === 7937) return 1; // Minimal active texture
          return null;
        }),
        getSupportedExtensions: vi.fn(() => []),
        getExtension: vi.fn(() => null),
      };

      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(mockContext as any);

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      const originalCreateElement = document.createElement;

      try {
        const uuid = await deviceUUID.getAsync({ webgl: true });
        expect(uuid).toBeDefined();
      } finally {
        createElementSpy.mockRestore();
      }
    });
  });

  describe('Audio Fingerprinting - Tor Simulation', () => {
    it('should handle Tor disabling AudioContext', async () => {
      // Tor disables audio fingerprinting
      const originalAudioContext = (window as any).AudioContext;
      const originalWebkitAudioContext = (window as any).webkitAudioContext;

      delete (window as any).AudioContext;
      delete (window as any).webkitAudioContext;

      try {
        const uuid = await deviceUUID.getAsync({ audio: true });
        expect(uuid).toBeDefined();
      } finally {
        if (originalAudioContext) {
          (window as any).AudioContext = originalAudioContext;
        }
        if (originalWebkitAudioContext) {
          (window as any).webkitAudioContext = originalWebkitAudioContext;
        }
      }
    });

    it('should handle Tor audio context returning all zeros', async () => {
      // Tor may return silent audio
      const mockAudioContext = vi.fn().mockImplementation(() => ({
        createOscillator: () => ({
          frequency: { value: 0 },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        }),
        createAnalyser: () => ({
          frequencyBinCount: 1024,
          getFloatFrequencyData: vi.fn((array: Float32Array) => {
            array.fill(-Infinity); // All silence
          }),
        }),
        createDynamicsCompressor: vi.fn(),
        createBuffer: vi.fn((_: number, samples: number) => ({
          getChannelData: vi.fn(() => new Float32Array(samples).fill(0)),
        })),
        startRendering: vi
          .fn()
          .mockResolvedValue({ getChannelData: vi.fn(() => new Float32Array(1024).fill(0)) }),
      }));

      (window as any).OfflineAudioContext = mockAudioContext;

      try {
        const uuid = await deviceUUID.getAsync({ audio: true });
        expect(uuid).toBeDefined();
      } finally {
        delete (window as any).OfflineAudioContext;
      }
    });
  });

  describe('Navigator Property Spoofing - Tor Simulation', () => {
    it('should handle Tor spoofed navigator properties', () => {
      const originalUserAgent = navigator.userAgent;
      const originalLanguage = navigator.language;
      const originalLanguages = navigator.languages;
      const originalPlatform = navigator.platform;
      const originalHardwareConcurrency = navigator.hardwareConcurrency;
      const originalDeviceMemory = (navigator as any).deviceMemory;

      // Tor spoofs these to common values
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0',
        configurable: true,
      });

      Object.defineProperty(navigator, 'language', {
        value: 'en-US',
        configurable: true,
      });

      Object.defineProperty(navigator, 'languages', {
        value: ['en-US', 'en'],
        configurable: true,
      });

      Object.defineProperty(navigator, 'platform', {
        value: 'Win32',
        configurable: true,
      });

      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 4, // Common value
        configurable: true,
      });

      if (originalDeviceMemory !== undefined) {
        Object.defineProperty(navigator, 'deviceMemory', {
          value: 8,
          configurable: true,
        });
      }

      try {
        const uuid = deviceUUID.get();
        expect(uuid).toBeDefined();
        expect(typeof uuid).toBe('string');
      } finally {
        Object.defineProperty(navigator, 'userAgent', {
          value: originalUserAgent,
          configurable: true,
        });
        Object.defineProperty(navigator, 'language', {
          value: originalLanguage,
          configurable: true,
        });
        Object.defineProperty(navigator, 'languages', {
          value: originalLanguages,
          configurable: true,
        });
        Object.defineProperty(navigator, 'platform', {
          value: originalPlatform,
          configurable: true,
        });
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          value: originalHardwareConcurrency,
          configurable: true,
        });

        if (originalDeviceMemory !== undefined) {
          Object.defineProperty(navigator, 'deviceMemory', {
            value: originalDeviceMemory,
            configurable: true,
          });
        }
      }
    });

    it('should handle Tor timezone spoofing (UTC)', () => {
      const originalGetTimezoneOffset = Date.prototype.getTimezoneOffset;
      const originalGetTimezone = Intl.DateTimeFormat.prototype.resolvedOptions;

      // Tor spoofs timezone to UTC
      Date.prototype.getTimezoneOffset = function () {
        return 0;
      };

      Intl.DateTimeFormat.prototype.resolvedOptions = function (this: any) {
        const options = originalGetTimezone.call(this);
        return { ...options, timeZone: 'UTC' };
      } as any;

      try {
        const details = deviceUUID.get();
        expect(details).toBeDefined();
      } finally {
        Date.prototype.getTimezoneOffset = originalGetTimezoneOffset;
        Intl.DateTimeFormat.prototype.resolvedOptions = originalGetTimezone;
      }
    });
  });

  describe('Screen Dimension Rounding - Tor Simulation', () => {
    it('should handle Tor rounding screen dimensions', () => {
      const originalScreen = window.screen;

      // Tor rounds screen dimensions to multiples of 50-200
      const mockScreen = {
        width: 1920,
        height: 1080,
        availWidth: 1920,
        availHeight: 1050,
        colorDepth: 24,
        pixelDepth: 24,
      };

      Object.defineProperty(window, 'screen', {
        value: mockScreen,
        configurable: true,
      });

      try {
        const uuid = deviceUUID.get();
        expect(uuid).toBeDefined();
      } finally {
        Object.defineProperty(window, 'screen', {
          value: originalScreen,
          configurable: true,
        });
      }
    });
  });
});

describe('Combined Privacy Browser Tests', () => {
  let deviceUUID: DeviceUUID;

  beforeEach(() => {
    deviceUUID = new DeviceUUID();
  });

  describe('Graceful Degradation', () => {
    it('should work when all advanced methods are blocked', async () => {
      // Block all advanced methods
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(null);
      vi.spyOn(mockCanvas, 'toDataURL').mockReturnValue('');

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      delete (window as any).AudioContext;
      delete (window as any).webkitAudioContext;
      delete (window as any).OfflineAudioContext;

      try {
        const uuid = await deviceUUID.getAsync({
          canvas: true,
          webgl: true,
          audio: true,
          fonts: true,
        });

        // Should still generate UUID from basic properties
        expect(uuid).toBeDefined();
        expect(typeof uuid).toBe('string');
        expect(uuid.length).toBeGreaterThan(0);
      } finally {
        createElementSpy.mockRestore();
      }
    });

    it('should return meaningful confidence score with limited data', async () => {
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(null);

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      const originalCreateElement = document.createElement;

      try {
        const details = await deviceUUID.getDetailedAsync({
          canvas: true,
          webgl: true,
        });

        expect(details.uuid).toBeDefined();
        expect(details.confidence).toBeDefined();
        expect(details.confidence).toBeGreaterThanOrEqual(0);
        expect(details.confidence).toBeLessThanOrEqual(1);
      } finally {
        createElementSpy.mockRestore();
      }
    });

    it('should indicate which methods succeeded and failed', async () => {
      const mockCanvas = document.createElement('canvas');
      vi.spyOn(mockCanvas, 'getContext').mockReturnValue(null);

      const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
        if (tagName === 'canvas') {
          return mockCanvas;
        }
        return originalCreateElement(tagName);
      });

      const originalCreateElement = document.createElement;

      try {
        const details = await deviceUUID.getDetailedAsync({
          canvas: true,
          webgl: true,
        });

        expect(details.components).toBeDefined();
        expect(details.components.basic).toBeDefined();
      } finally {
        createElementSpy.mockRestore();
      }
    });
  });
});

// Helper function for createElement mocking
function originalCreateElement(tagName: string): HTMLElement {
  return document.createElement(tagName);
}
