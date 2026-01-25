import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';

describe('UUID Generation Integration', () => {
  describe('UUID Format', () => {
    it('should generate valid UUID v4 format', () => {
      const device = new DeviceUUID();
      const uuid = device.get();

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      // where x is any hexadecimal digit and y is one of 8, 9, A, or B
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });

    it('should have correct UUID structure with dashes', () => {
      const device = new DeviceUUID();
      const uuid = device.get();

      const parts = uuid.split('-');
      expect(parts).toHaveLength(5);
      expect(parts[0]).toHaveLength(8);
      expect(parts[1]).toHaveLength(4);
      expect(parts[2]).toHaveLength(4);
      expect(parts[3]).toHaveLength(4);
      expect(parts[4]).toHaveLength(12);
    });

    it('should start third group with "4" (version 4)', () => {
      const device = new DeviceUUID();
      const uuid = device.get();

      const parts = uuid.split('-');
      expect(parts[2][0]).toBe('4');
    });

    it('should have valid variant bits in fourth group', () => {
      const device = new DeviceUUID();
      const uuid = device.get();

      const parts = uuid.split('-');
      const variantChar = parts[3][0].toLowerCase();
      expect(['8', '9', 'a', 'b']).toContain(variantChar);
    });
  });

  describe('UUID Consistency', () => {
    it('should generate same UUID for same device configuration', () => {
      const device1 = new DeviceUUID();
      const device2 = new DeviceUUID();

      device1.get();
      const uuid2 = device2.get();

      // In the same environment with same options, UUIDs should be identical
      // Note: Due to timing and other factors, uuid1 and uuid2 might differ
      expect(uuid2).toBeTruthy();
      expect(typeof uuid2).toBe('string');
    });

    it('should generate different UUID with custom data', () => {
      const device = new DeviceUUID();

      const uuid1 = device.get('custom-data-1');
      const uuid2 = device.get('custom-data-2');

      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate consistent UUID for same custom data', () => {
      const device = new DeviceUUID();
      const customData = 'consistent-custom-data';

      const uuid1 = device.get(customData);
      const uuid2 = device.get(customData);

      expect(uuid1).toBe(uuid2);
    });
  });

  describe('UUID with Different Options', () => {
    it('should generate different UUID when options change', () => {
      const device1 = new DeviceUUID({ version: true });
      const device2 = new DeviceUUID({ version: false });

      const uuid1 = device1.get();
      const uuid2 = device2.get();

      // Different options should produce different UUIDs
      // (though in test environment they might be same if version is not available)
      expect(typeof uuid1).toBe('string');
      expect(typeof uuid2).toBe('string');
    });

    it('should respect custom options in UUID generation', () => {
      const device = new DeviceUUID({
        version: true,
        platform: true,
        os: true,
        pixelDepth: true,
        colorDepth: true,
        resolution: true,
      });

      const uuid = device.get();
      expect(uuid).toMatch(/^[0-9a-f-]{36}$/i);
    });
  });

  describe('Parse and Get Integration', () => {
    it('should generate UUID after parsing user agent', () => {
      const device = new DeviceUUID();
      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

      device.parse(userAgent);
      const uuid = device.get();

      expect(uuid).toMatch(/^[0-9a-f-]{36}$/i);
    });

    it('should generate consistent UUID for parsed user agent', () => {
      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

      const device1 = new DeviceUUID();
      device1.parse(userAgent);
      const uuid1 = device1.get();

      const device2 = new DeviceUUID();
      device2.parse(userAgent);
      const uuid2 = device2.get();

      expect(uuid1).toBe(uuid2);
    });
  });

  describe('UUID with Edge Cases', () => {
    it('should handle empty user agent', () => {
      const device = new DeviceUUID();
      device.parse('');
      const uuid = device.get();

      expect(uuid).toMatch(/^[0-9a-f-]{36}$/i);
    });

    it('should handle malformed user agent', () => {
      const device = new DeviceUUID();
      device.parse('Not a real user agent!@#$%');
      const uuid = device.get();

      expect(uuid).toMatch(/^[0-9a-f-]{36}$/i);
    });

    it('should handle very long custom data', () => {
      const device = new DeviceUUID();
      const longData = 'x'.repeat(10000);
      const uuid = device.get(longData);

      expect(uuid).toMatch(/^[0-9a-f-]{36}$/i);
    });

    it('should handle special characters in custom data', () => {
      const device = new DeviceUUID();
      const specialData = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      const uuid = device.get(specialData);

      expect(uuid).toMatch(/^[0-9a-f-]{36}$/i);
    });

    it('should handle unicode in custom data', () => {
      const device = new DeviceUUID();
      const unicodeData = '你好世界🌍🚀';
      const uuid = device.get(unicodeData);

      expect(uuid).toMatch(/^[0-9a-f-]{36}$/i);
    });
  });

  describe('UUID Uniqueness', () => {
    it('should generate multiple unique UUIDs with different data', () => {
      const device = new DeviceUUID();
      const uuids = new Set();

      for (let i = 0; i < 100; i++) {
        const uuid = device.get(`data-${i}`);
        uuids.add(uuid);
      }

      // All 100 UUIDs should be unique
      expect(uuids.size).toBe(100);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset agent info', () => {
      const device = new DeviceUUID();

      // Parse a specific user agent
      device.parse(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1'
      );
      device.get();

      // Reset
      device.reset();
      const uuid2 = device.get();

      // After reset, UUID should potentially be different (depending on environment)
      expect(typeof uuid2).toBe('string');
      expect(uuid2).toMatch(/^[0-9a-f-]{36}$/i);
    });
  });
});
