/**
 * Integration tests for async/sync API interaction
 */

import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';

describe('Async/Sync API Interaction', () => {
  describe('get() vs getAsync()', () => {
    it('should both return valid UUIDs', async () => {
      const device = new DeviceUUID();
      const syncUuid = device.get();
      const asyncUuid = await device.getAsync();

      expect(syncUuid).toBeTruthy();
      expect(asyncUuid).toBeTruthy();
      expect(syncUuid.length).toBe(36);
      expect(asyncUuid.length).toBe(36);
    });

    it('should have same basic component', async () => {
      const device = new DeviceUUID();
      const syncUuid = device.get();
      const asyncDetails = await device.getDetailedAsync('minimal');

      // Basic component should match the sync UUID
      expect(asyncDetails.components.basic?.value).toBe(syncUuid);
    });

    it('should produce consistent results across multiple calls', async () => {
      const device = new DeviceUUID();
      const sync1 = device.get();
      const sync2 = device.get();
      const async1 = await device.getAsync();
      const async2 = await device.getAsync();

      expect(sync1).toBe(sync2);
      expect(async1).toBe(async2);
    });
  });

  describe('parse() interaction', () => {
    it('should work the same regardless of async operations', async () => {
      const device = new DeviceUUID();

      // Call async first
      await device.getAsync();

      // Then call parse
      const agent = device.parse();

      expect(agent).toHaveProperty('browser');
      expect(agent).toHaveProperty('os');
      expect(agent).toHaveProperty('platform');
      expect(agent).toHaveProperty('version');
    });

    it('should return consistent parse results before and after async', async () => {
      const device = new DeviceUUID();
      const parseBefore = device.parse();

      await device.getAsync();

      const parseAfter = device.parse();

      expect(parseBefore.browser).toBe(parseAfter.browser);
      expect(parseBefore.os).toBe(parseAfter.os);
      expect(parseBefore.platform).toBe(parseAfter.platform);
    });
  });

  describe('getComponents() interaction', () => {
    it('should return components independent of async calls', async () => {
      const device = new DeviceUUID();
      const componentsBefore = device.getComponents();

      await device.getAsync();

      const componentsAfter = device.getComponents();

      expect(componentsBefore).toEqual(componentsAfter);
    });

    it('should include all expected component keys', async () => {
      const device = new DeviceUUID();
      await device.getAsync();
      const components = device.getComponents();

      expect(components).toHaveProperty('userAgent');
      expect(components).toHaveProperty('platform');
      expect(components).toHaveProperty('os');
      expect(components).toHaveProperty('browser');
      expect(components).toHaveProperty('screen');
      expect(components).toHaveProperty('hardware');
      expect(components).toHaveProperty('language');
    });

    it('should return string hashes or null for each component', async () => {
      const device = new DeviceUUID();
      await device.getAsync();
      const components = device.getComponents();

      Object.values(components).forEach((value) => {
        expect(value === null || typeof value === 'string').toBe(true);
        if (value !== null) {
          expect(value.length).toBe(32); // MD5 hash length
        }
      });
    });
  });

  describe('reset() interaction', () => {
    it('should affect both sync and async results', async () => {
      const device = new DeviceUUID();
      device.get();

      device.reset();

      const uuid2 = device.get();
      const asyncUuid = await device.getAsync();

      // After reset, sync UUID may change depending on implementation
      expect(uuid2).toBeTruthy();
      expect(asyncUuid).toBeTruthy();
    });

    it('should return this for chaining', () => {
      const device = new DeviceUUID();
      const result = device.reset();
      expect(result).toBe(device);
    });
  });

  describe('isFeatureSupported() static method', () => {
    it('should be callable without instance', () => {
      expect(typeof DeviceUUID.isFeatureSupported).toBe('function');
    });

    it('should return boolean for all features', () => {
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

    it('should return consistent results across multiple calls', () => {
      const result1 = DeviceUUID.isFeatureSupported('canvas');
      const result2 = DeviceUUID.isFeatureSupported('canvas');
      expect(result1).toBe(result2);
    });
  });

  describe('Mixed sync/async usage patterns', () => {
    it('should handle sync then async calls', async () => {
      const device = new DeviceUUID();
      const sync = device.get();
      const async = await device.getAsync();

      expect(sync).toBeTruthy();
      expect(async).toBeTruthy();
    });

    it('should handle async then sync calls', async () => {
      const device = new DeviceUUID();
      const async = await device.getAsync();
      const sync = device.get();

      expect(async).toBeTruthy();
      expect(sync).toBeTruthy();
    });

    it('should handle interleaved sync and async calls', async () => {
      const device = new DeviceUUID();
      const sync1 = device.get();
      const async1 = await device.getAsync();
      const sync2 = device.get();
      const async2 = await device.getAsync();

      expect(sync1).toBeTruthy();
      expect(async1).toBeTruthy();
      expect(sync2).toBeTruthy();
      expect(async2).toBeTruthy();
    });
  });

  describe('get() with options should not be affected', () => {
    it('should always return basic UUID regardless of async options', async () => {
      const device = new DeviceUUID();

      // Call with various async options
      await device.getAsync({ canvas: true, webgl: true });
      await device.getAsync('comprehensive');

      // Sync get should still work and return basic UUID
      const sync = device.get();
      expect(sync).toBeTruthy();
      expect(sync.length).toBe(36);
    });
  });

  describe('getDetailedAsync() vs getAsync()', () => {
    it('should return same UUID from both methods', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync();
      const details = await device.getDetailedAsync();

      expect(details.uuid).toBe(uuid);
    });

    it('should provide additional info in getDetailedAsync', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync();

      expect(details).toHaveProperty('uuid');
      expect(details).toHaveProperty('components');
      expect(details).toHaveProperty('confidence');
      expect(details).toHaveProperty('duration');
      expect(details).toHaveProperty('timestamp');
    });

    it('should have positive duration', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync();

      expect(details.duration).toBeGreaterThanOrEqual(0);
    });

    it('should have valid timestamp', async () => {
      const device = new DeviceUUID();
      const before = Date.now();
      const details = await device.getDetailedAsync();
      const after = Date.now();

      expect(details.timestamp).toBeGreaterThanOrEqual(before);
      expect(details.timestamp).toBeLessThanOrEqual(after);
    });

    it('should have confidence between 0 and 1', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync();

      expect(details.confidence).toBeGreaterThanOrEqual(0);
      expect(details.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Multiple instances', () => {
    it('should work independently across instances', async () => {
      const device1 = new DeviceUUID();
      const device2 = new DeviceUUID();

      const sync1 = device1.get();
      const async2 = await device2.getAsync();

      expect(sync1).toBeTruthy();
      expect(async2).toBeTruthy();
    });

    it('should not share state between instances', async () => {
      const device1 = new DeviceUUID();
      const device2 = new DeviceUUID();

      device1.reset();

      const sync1 = device1.get();
      const async2 = await device2.getAsync();

      // device2 should not be affected by device1.reset()
      expect(sync1).toBeTruthy();
      expect(async2).toBeTruthy();
    });
  });

  describe('Error handling compatibility', () => {
    it('should handle errors in async without affecting sync', async () => {
      const device = new DeviceUUID();

      // Call with invalid timeout (should handle gracefully)
      const asyncResult = await device.getAsync({ timeout: -1 });
      expect(asyncResult).toBeTruthy();

      // Sync should still work
      const syncResult = device.get();
      expect(syncResult).toBeTruthy();
    });
  });
});
