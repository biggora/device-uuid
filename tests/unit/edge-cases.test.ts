/**
 * Edge case and error condition tests
 */

import { describe, it, expect } from 'vitest';
import { FingerprintPreset, FingerprintFeature, DeviceUUID } from '../../src';

describe('Edge Cases and Error Conditions', () => {
  describe('Empty/Invalid Inputs', () => {
    it('should handle empty string user agent gracefully', () => {
      const device = new DeviceUUID();
      device.userAgent = '';
      const uuid = device.get();
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle very long user agent strings', () => {
      const device = new DeviceUUID();
      device.userAgent = 'A'.repeat(10000);
      const uuid = device.get();
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle special characters in user agent', () => {
      const device = new DeviceUUID();
      device.userAgent = 'Test/1.0 (®™©) <script>alert(1)</script>';
      const uuid = device.get();
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle null values in options', async () => {
      const device = new DeviceUUID();
      // @ts-expect-error - testing null input
      const uuid = await device.getAsync(null);
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle undefined options', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync(undefined);
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });
  });

  describe('Extreme Timeout Values', () => {
    it('should handle zero timeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ timeout: 0 });
      expect(uuid).toBeTruthy();
    });

    it('should handle negative timeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ timeout: -1 });
      expect(uuid).toBeTruthy();
    });

    it('should handle very large timeout', async () => {
      const device = new DeviceUUID();
      const start = Date.now();
      const uuid = await device.getAsync({ timeout: 999999 });
      const duration = Date.now() - start;
      expect(uuid).toBeTruthy();
      expect(duration).toBeLessThan(1000); // Should complete quickly anyway
    });

    it('should handle NaN timeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ timeout: NaN });
      expect(uuid).toBeTruthy();
    });
  });

  describe('Extreme Method Timeout Values', () => {
    it('should handle zero methodTimeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ methodTimeout: 0 });
      expect(uuid).toBeTruthy();
    });

    it('should handle negative methodTimeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ methodTimeout: -1 });
      expect(uuid).toBeTruthy();
    });

    it('should handle very large methodTimeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ methodTimeout: 999999 });
      expect(uuid).toBeTruthy();
    });
  });

  describe('Font Options Edge Cases', () => {
    it('should handle empty font array', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ fonts: [] });
      expect(uuid).toBeTruthy();
    });

    it('should handle single font', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ fonts: ['Arial'] });
      expect(uuid).toBeTruthy();
    });

    it('should handle very long font list', async () => {
      const device = new DeviceUUID();
      const fonts = Array(1000)
        .fill(0)
        .map((_, i) => `Font${i}`);
      const uuid = await device.getAsync({ fonts });
      expect(uuid).toBeTruthy();
    });

    it('should handle fonts with special characters', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ fonts: ['Arial', 'Times New Roman', 'Courier New'] });
      expect(uuid).toBeTruthy();
    });

    it('should handle null in fonts option', async () => {
      const device = new DeviceUUID();
      // @ts-expect-error - testing null input
      const uuid = await device.getAsync({ fonts: null });
      expect(uuid).toBeTruthy();
    });
  });

  describe('Invalid Presets', () => {
    it('should handle unknown preset as default options', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync('unknown' as FingerprintPreset);
      expect(uuid).toBeTruthy();
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple concurrent getAsync calls', async () => {
      const device = new DeviceUUID();
      const promises = [device.getAsync(), device.getAsync(), device.getAsync()];
      const results = await Promise.all(promises);
      results.forEach((uuid) => {
        expect(uuid).toBeTruthy();
        expect(uuid.length).toBe(36);
      });
    });

    it('should handle concurrent getAsync and get calls', async () => {
      const device = new DeviceUUID();
      const promises = [Promise.resolve(device.get()), device.getAsync(), device.get()];
      const results = await Promise.all(promises);
      results.forEach((uuid) => {
        expect(uuid).toBeTruthy();
        expect(uuid.length).toBe(36);
      });
    });

    it('should handle concurrent getDetailedAsync calls', async () => {
      const device = new DeviceUUID();
      const promises = [
        device.getDetailedAsync(),
        device.getDetailedAsync(),
        device.getDetailedAsync(),
      ];
      const results = await Promise.all(promises);
      results.forEach((details) => {
        expect(details).toHaveProperty('uuid');
        expect(details).toHaveProperty('components');
      });
    });
  });

  describe('Reset During Operations', () => {
    it('should handle reset between operations', async () => {
      const device = new DeviceUUID();
      const uuid1 = await device.getAsync();
      device.reset();
      const uuid2 = await device.getAsync();

      expect(uuid1).toBeTruthy();
      expect(uuid2).toBeTruthy();
      // UUIDs may differ after reset
    });

    it('should handle reset during async operations', async () => {
      const device = new DeviceUUID();
      const promise = device.getAsync('comprehensive');
      device.reset();
      const uuid = await promise;
      expect(uuid).toBeTruthy();
    });
  });

  describe('Memory Stress Tests', () => {
    it('should handle many device instances', () => {
      const instances: DeviceUUID[] = [];
      for (let i = 0; i < 100; i++) {
        instances.push(new DeviceUUID());
      }

      instances.forEach((device) => {
        const uuid = device.get();
        expect(uuid).toBeTruthy();
      });
    });

    it('should handle many sequential async calls', async () => {
      const device = new DeviceUUID();
      for (let i = 0; i < 50; i++) {
        const uuid = await device.getAsync();
        expect(uuid).toBeTruthy();
      }
    });

    it('should handle many parse calls', () => {
      const device = new DeviceUUID();
      for (let i = 0; i < 100; i++) {
        const agent = device.parse();
        expect(agent).toHaveProperty('browser');
      }
    });
  });

  describe('isFeatureSupported Edge Cases', () => {
    it('should handle unknown feature', () => {
      const result = DeviceUUID.isFeatureSupported('unknown' as FingerprintFeature);
      expect(typeof result).toBe('boolean');
      expect(result).toBe(false);
    });

    it('should return boolean for all known features', () => {
      const features: Array<
        | 'canvas'
        | 'webgl'
        | 'audio'
        | 'fonts'
        | 'mediaDevices'
        | 'networkInfo'
        | 'timezone'
        | 'incognitoDetection'
      > = [
        'canvas',
        'webgl',
        'audio',
        'fonts',
        'mediaDevices',
        'networkInfo',
        'timezone',
        'incognitoDetection',
      ];

      features.forEach((feature) => {
        const result = DeviceUUID.isFeatureSupported(feature);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('getComponents Edge Cases', () => {
    it('should return consistent results', () => {
      const device = new DeviceUUID();
      const components1 = device.getComponents();
      const components2 = device.getComponents();
      expect(components1).toEqual(components2);
    });

    it('should return components after reset', () => {
      const device = new DeviceUUID();
      device.reset();
      const components = device.getComponents();
      expect(components).toHaveProperty('userAgent');
    });

    it('should return components after async operations', async () => {
      const device = new DeviceUUID();
      await device.getAsync();
      const components = device.getComponents();
      expect(components).toHaveProperty('userAgent');
    });
  });

  describe('getDetailedAsync Edge Cases', () => {
    it('should handle all features disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({
        canvas: false,
        webgl: false,
        audio: false,
        fonts: false,
        mediaDevices: false,
        networkInfo: false,
        timezone: false,
        incognitoDetection: false,
      });

      expect(details).toHaveProperty('uuid');
      expect(details).toHaveProperty('components');
      expect(details).toHaveProperty('confidence');
      expect(details.confidence).toBeGreaterThan(0);
    });

    it('should handle empty options', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({});
      expect(details).toHaveProperty('uuid');
    });

    it('should return valid timestamp', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync();
      expect(details.timestamp).toBeGreaterThanOrEqual(0);
      expect(details.timestamp).toBeLessThanOrEqual(Date.now() + 1000);
    });
  });

  describe('parse() Edge Cases', () => {
    it('should handle reset userAgent before parsing', () => {
      const device = new DeviceUUID();
      device.userAgent = 'Custom Agent';
      const agent = device.parse();
      expect(agent).toHaveProperty('browser');
    });

    it('should handle parse after reset', () => {
      const device = new DeviceUUID();
      device.reset();
      const agent = device.parse();
      expect(agent).toHaveProperty('browser');
    });

    it('should handle special characters in user agent', () => {
      const device = new DeviceUUID();
      device.userAgent = 'Test/1.0 (<script>)';
      const agent = device.parse();
      expect(agent).toHaveProperty('browser');
      // Should not throw error
    });
  });

  describe('Error Recovery', () => {
    it('should continue working after failed async operation', async () => {
      const device = new DeviceUUID();
      // Call with invalid options
      await device.getAsync({ timeout: -1 });
      // Should still work normally
      const uuid = await device.getAsync();
      expect(uuid).toBeTruthy();
    });

    it('should recover from malformed user agent', () => {
      const device = new DeviceUUID();
      device.userAgent = '<<<<<<<<<<<<';
      device.parse();
      const uuid = device.get();
      expect(uuid).toBeTruthy();
    });
  });

  describe('TypeScript Type Safety', () => {
    it('should accept valid FingerprintOptions', async () => {
      const device = new DeviceUUID();

      // All valid options should be accepted
      const options1 = { canvas: true };
      const options2 = { canvas: false, webgl: true };
      const options3 = { canvas: true, webgl: true, audio: true, fonts: true };

      expect(await device.getAsync(options1)).toBeTruthy();
      expect(await device.getAsync(options2)).toBeTruthy();
      expect(await device.getAsync(options3)).toBeTruthy();
    });

    it('should accept FingerprintPreset', async () => {
      const device = new DeviceUUID();

      expect(await device.getAsync('minimal')).toBeTruthy();
      expect(await device.getAsync('standard')).toBeTruthy();
      expect(await device.getAsync('comprehensive')).toBeTruthy();
    });

    it('should return proper type for getDetailedAsync', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync();

      expect(details.uuid).toBeTruthy();
      expect(details.components).toBeDefined();
      expect(typeof details.confidence).toBe('number');
      expect(typeof details.duration).toBe('number');
      expect(typeof details.timestamp).toBe('number');
    });
  });
});
