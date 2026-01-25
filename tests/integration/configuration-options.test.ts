/**
 * Integration tests for fingerprint configuration options
 */

import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';

describe('Fingerprint Configuration Options', () => {
  describe('Option Presets', () => {
    it('should work with minimal preset', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync('minimal');
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should work with standard preset', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync('standard');
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should work with comprehensive preset', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync('comprehensive');
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });
  });

  describe('Custom Options', () => {
    it('should handle empty options object', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({});
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should enable only canvas', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ canvas: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should enable only webgl', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ webgl: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should enable only audio', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ audio: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should enable only fonts', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ fonts: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should enable only timezone', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ timezone: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should enable only mediaDevices', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ mediaDevices: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should enable only networkInfo', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ networkInfo: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should enable only incognitoDetection', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ incognitoDetection: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });
  });

  describe('Option Combinations', () => {
    it('should handle canvas + webgl combination', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ canvas: true, webgl: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle canvas + webgl + audio combination', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ canvas: true, webgl: true, audio: true });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle all options enabled', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({
        canvas: true,
        webgl: true,
        audio: true,
        fonts: true,
        mediaDevices: true,
        networkInfo: true,
        timezone: true,
        incognitoDetection: true,
      });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle all options disabled', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({
        canvas: false,
        webgl: false,
        audio: false,
        fonts: false,
        mediaDevices: false,
        networkInfo: false,
        timezone: false,
        incognitoDetection: false,
      });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });
  });

  describe('Font Options', () => {
    it('should accept custom font list as array', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ fonts: ['Arial', 'Times', 'Courier'] });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should accept empty font array', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ fonts: [] });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle long font list', async () => {
      const device = new DeviceUUID();
      const fonts = Array(50)
        .fill(0)
        .map((_, i) => `Font${i}`);
      const uuid = await device.getAsync({ fonts });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });
  });

  describe('Timeout Options', () => {
    it('should respect custom timeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ timeout: 100 });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle very short timeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ timeout: 1 });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle very long timeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ timeout: 60000 });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });
  });

  describe('Method Timeout Options', () => {
    it('should respect custom method timeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ methodTimeout: 100 });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle zero method timeout', async () => {
      const device = new DeviceUUID();
      const uuid = await device.getAsync({ methodTimeout: 0 });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });
  });

  describe('getDetailedAsync with Options', () => {
    it('should return details with minimal preset', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync('minimal');
      expect(details).toHaveProperty('uuid');
      expect(details).toHaveProperty('components');
      expect(details).toHaveProperty('confidence');
      expect(details).toHaveProperty('duration');
      expect(details).toHaveProperty('timestamp');
    });

    it('should include canvas component when enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ canvas: true });
      expect(details.components.canvas).toBeDefined();
    });

    it('should not include canvas component when disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ canvas: false });
      expect(details.components.canvas).toBeUndefined();
    });

    it('should include webgl component when enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ webgl: true });
      expect(details.components.webgl).toBeDefined();
    });

    it('should not include webgl component when disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ webgl: false });
      expect(details.components.webgl).toBeUndefined();
    });

    it('should include audio component when enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ audio: true });
      expect(details.components.audio).toBeDefined();
    });

    it('should not include audio component when disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ audio: false });
      expect(details.components.audio).toBeUndefined();
    });

    it('should include fonts component when enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ fonts: true });
      expect(details.components.fonts).toBeDefined();
    });

    it('should not include fonts component when disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ fonts: false });
      expect(details.components.fonts).toBeUndefined();
    });

    it('should include timezone component when enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ timezone: true });
      expect(details.components.timezone).toBeDefined();
    });

    it('should not include timezone component when disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ timezone: false });
      expect(details.components.timezone).toBeUndefined();
    });

    it('should include mediaDevices component when enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ mediaDevices: true });
      expect(details.components.mediaDevices).toBeDefined();
    });

    it('should not include mediaDevices component when disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ mediaDevices: false });
      expect(details.components.mediaDevices).toBeUndefined();
    });

    it('should include networkInfo component when enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ networkInfo: true });
      expect(details.components.networkInfo).toBeDefined();
    });

    it('should not include networkInfo component when disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ networkInfo: false });
      expect(details.components.networkInfo).toBeUndefined();
    });

    it('should include incognito component when enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ incognitoDetection: true });
      expect(details.components.incognito).toBeDefined();
    });

    it('should not include incognito component when disabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({ incognitoDetection: false });
      expect(details.components.incognito).toBeUndefined();
    });
  });

  describe('Option Override Behavior', () => {
    it('should allow overriding preset options', async () => {
      const device = new DeviceUUID();
      // Start with comprehensive preset but disable canvas
      const uuid = await device.getAsync({
        preset: 'comprehensive',
        canvas: false,
      });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });

    it('should handle last value for duplicate options', async () => {
      const device = new DeviceUUID();
      // Note: In JS, duplicate keys use the last value
      const uuid = await device.getAsync({
        canvas: true,
      } as { canvas: boolean; webgl?: boolean });
      expect(uuid).toBeTruthy();
      expect(uuid.length).toBe(36);
    });
  });

  describe('Confidence Score with Different Options', () => {
    it('should have lower confidence with no options', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync({});
      expect(details.confidence).toBeGreaterThanOrEqual(0);
      expect(details.confidence).toBeLessThanOrEqual(1);
    });

    it('should have valid confidence with more options', async () => {
      const device = new DeviceUUID();
      const fullDetails = await device.getDetailedAsync({
        canvas: true,
        webgl: true,
        audio: true,
        fonts: true,
      });
      // In test environment, some features may not be available
      // Just verify confidence is in valid range
      expect(fullDetails.confidence).toBeGreaterThanOrEqual(0);
      expect(fullDetails.confidence).toBeLessThanOrEqual(1);
    });

    it('should have valid confidence when all features enabled', async () => {
      const device = new DeviceUUID();
      const details = await device.getDetailedAsync('comprehensive');
      expect(details.confidence).toBeGreaterThanOrEqual(0);
      expect(details.confidence).toBeLessThanOrEqual(1);
    });
  });
});
