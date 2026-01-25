/**
 * Unit tests for async fingerprint API
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DeviceUUID } from '../../src';

describe('DeviceUUID Async API', () => {
  let device: DeviceUUID;

  beforeEach(() => {
    device = new DeviceUUID();
  });

  describe('getAsync', () => {
    it('should return a promise', () => {
      const result = device.getAsync();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to a UUID string', async () => {
      const uuid = await device.getAsync();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[ab][a-f0-9]{3}-[a-f0-9]{12}$/);
    });

    it('should accept minimal preset', async () => {
      const uuid = await device.getAsync('minimal');
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
    });

    it('should accept standard preset', async () => {
      const uuid = await device.getAsync('standard');
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
    });

    it('should accept comprehensive preset', async () => {
      const uuid = await device.getAsync('comprehensive');
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
    });

    it('should accept custom options', async () => {
      const uuid = await device.getAsync({
        canvas: false,
        webgl: false,
        timezone: true,
      });
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
    });
  });

  describe('getDetailedAsync', () => {
    it('should return a promise', () => {
      const result = device.getDetailedAsync();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to FingerprintDetails object', async () => {
      const details = await device.getDetailedAsync();

      expect(details).toHaveProperty('uuid');
      expect(details).toHaveProperty('components');
      expect(details).toHaveProperty('confidence');
      expect(details).toHaveProperty('duration');
      expect(details).toHaveProperty('timestamp');
    });

    it('should include basic component', async () => {
      const details = await device.getDetailedAsync();

      expect(details.components.basic).toBeDefined();
      expect(details.components.basic.name).toBe('basic');
      expect(details.components.basic.success).toBe(true);
      expect(details.components.basic.value).not.toBeNull();
    });

    it('should have valid UUID format', async () => {
      const details = await device.getDetailedAsync();
      expect(details.uuid).toMatch(
        /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[ab][a-f0-9]{3}-[a-f0-9]{12}$/
      );
    });

    it('should have confidence between 0 and 1', async () => {
      const details = await device.getDetailedAsync();
      expect(details.confidence).toBeGreaterThanOrEqual(0);
      expect(details.confidence).toBeLessThanOrEqual(1);
    });

    it('should have positive duration', async () => {
      const details = await device.getDetailedAsync();
      expect(details.duration).toBeGreaterThanOrEqual(0);
    });

    it('should have valid timestamp', async () => {
      const before = Date.now();
      const details = await device.getDetailedAsync();
      const after = Date.now();

      expect(details.timestamp).toBeGreaterThanOrEqual(before);
      expect(details.timestamp).toBeLessThanOrEqual(after);
    });

    it('should include timezone component when enabled', async () => {
      const details = await device.getDetailedAsync({ timezone: true });
      expect(details.components.timezone).toBeDefined();
      expect(details.components.timezone?.name).toBe('timezone');
    });

    it('should not include canvas component when disabled', async () => {
      const details = await device.getDetailedAsync({ canvas: false });
      expect(details.components.canvas).toBeUndefined();
    });
  });

  describe('getComponents', () => {
    it('should return component hashes', () => {
      const components = device.getComponents();

      expect(components).toHaveProperty('userAgent');
      expect(components).toHaveProperty('platform');
      expect(components).toHaveProperty('os');
      expect(components).toHaveProperty('browser');
      expect(components).toHaveProperty('screen');
      expect(components).toHaveProperty('hardware');
      expect(components).toHaveProperty('language');
    });

    it('should return string hashes', () => {
      const components = device.getComponents();

      Object.values(components).forEach((value) => {
        if (value !== null) {
          expect(typeof value).toBe('string');
          expect(value.length).toBe(32); // MD5 hash length
        }
      });
    });
  });

  describe('isFeatureSupported', () => {
    it('should be a static method', () => {
      expect(typeof DeviceUUID.isFeatureSupported).toBe('function');
    });

    it('should return boolean for canvas', () => {
      const result = DeviceUUID.isFeatureSupported('canvas');
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for webgl', () => {
      const result = DeviceUUID.isFeatureSupported('webgl');
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for audio', () => {
      const result = DeviceUUID.isFeatureSupported('audio');
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for fonts', () => {
      const result = DeviceUUID.isFeatureSupported('fonts');
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for mediaDevices', () => {
      const result = DeviceUUID.isFeatureSupported('mediaDevices');
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for networkInfo', () => {
      const result = DeviceUUID.isFeatureSupported('networkInfo');
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for timezone', () => {
      const result = DeviceUUID.isFeatureSupported('timezone');
      expect(typeof result).toBe('boolean');
    });

    it('should return boolean for incognitoDetection', () => {
      const result = DeviceUUID.isFeatureSupported('incognitoDetection');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('backward compatibility', () => {
    it('should maintain synchronous get() method', () => {
      const uuid = device.get();
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
    });

    it('should produce same basic fingerprint from get() and getAsync()', async () => {
      // Note: This test verifies the basic component is the same
      // The full async UUID may differ due to additional components
      const syncUuid = device.get();
      const asyncDetails = await device.getDetailedAsync('minimal');

      // Basic component should match the sync UUID
      expect(asyncDetails.components.basic.value).toBe(syncUuid);
    });

    it('should maintain parse() method', () => {
      const agent = device.parse();
      expect(agent).toHaveProperty('browser');
      expect(agent).toHaveProperty('os');
      expect(agent).toHaveProperty('platform');
    });

    it('should maintain reset() method', () => {
      const result = device.reset();
      expect(result).toBe(device); // Returns this for chaining
    });
  });
});
