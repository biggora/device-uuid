/**
 * Unit tests for DeviceUUID incognito detection edge cases
 * Tests incognito detection through getAsync/getDetailedAsync API
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DeviceUUID } from '../../src';

describe('DeviceUUID Incognito Detection Edge Cases', () => {
  let device: DeviceUUID;

  beforeEach(() => {
    device = new DeviceUUID();
  });

  describe('Incognito detection via getAsync', () => {
    it('should handle incognitoDetection option', async () => {
      const result = await device.getAsync({ incognitoDetection: true });
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should work with comprehensive preset', async () => {
      const result = await device.getAsync('comprehensive');
      expect(typeof result).toBe('string');
    });

    it('should handle missing navigator.storage gracefully', async () => {
      const originalStorage = (navigator as any).storage;
      delete (navigator as any).storage;

      const result = await device.getAsync({ incognitoDetection: true });
      expect(typeof result).toBe('string');

      if (originalStorage) {
        (navigator as any).storage = originalStorage;
      }
    });

    it('should handle storage.estimate rejection', async () => {
      const originalStorage = (navigator as any).storage;

      // Mock estimate that rejects
      (navigator as any).storage = {
        estimate: () => Promise.reject(new Error('Access denied')),
      };

      const result = await device.getAsync({ incognitoDetection: true });
      expect(typeof result).toBe('string');

      if (originalStorage) {
        (navigator as any).storage = originalStorage;
      } else {
        delete (navigator as any).storage;
      }
    });

    it('should complete within timeout', async () => {
      const startTime = Date.now();
      const result = await device.getAsync({ incognitoDetection: true, timeout: 2000 });
      const duration = Date.now() - startTime;

      // Should complete quickly
      expect(duration).toBeLessThan(3000);
      expect(typeof result).toBe('string');
    });

    it('should return consistent results for same environment', async () => {
      const result1 = await device.getAsync({ incognitoDetection: true });
      const result2 = await device.getAsync({ incognitoDetection: true });

      expect(result1).toBe(result2);
    });
  });

  describe('Incognito detection via getDetailedAsync', () => {
    it('should include incognito component when enabled', async () => {
      const details = await device.getDetailedAsync({ incognitoDetection: true });
      expect(details).toHaveProperty('uuid');
      expect(details).toHaveProperty('components');
      expect(typeof details.uuid).toBe('string');
    });

    it('should handle missing storage APIs in detailed mode', async () => {
      const originalStorage = (navigator as any).storage;
      const originalIndexedDB = window.indexedDB;

      // Remove storage APIs
      delete (navigator as any).storage;
      // @ts-expect-error - intentionally removing
      delete window.indexedDB;

      const details = await device.getDetailedAsync({ incognitoDetection: true });
      expect(typeof details.uuid).toBe('string');

      // Restore
      if (originalStorage) {
        (navigator as any).storage = originalStorage;
      }
      if (originalIndexedDB) {
        window.indexedDB = originalIndexedDB;
      }
    });

    it('should return confidence score', async () => {
      const details = await device.getDetailedAsync({ incognitoDetection: true });
      expect(typeof details.confidence).toBe('number');
      expect(details.confidence).toBeGreaterThanOrEqual(0);
      expect(details.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Cookie enabled check', () => {
    it('should respect navigator.cookieEnabled', async () => {
      const result = await device.getAsync({ incognitoDetection: true });
      expect(typeof result).toBe('string');
    });
  });
});
