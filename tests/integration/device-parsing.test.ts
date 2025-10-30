import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src/core/DeviceUUID';
import type { AgentInfo } from '../../src/types';

describe('Complete Device Parsing Integration', () => {
  describe('Real-World Chrome Desktop', () => {
    it('should parse Chrome on Windows correctly', () => {
      const device = new DeviceUUID();
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const result: AgentInfo = device.parse(ua);

      expect(result.browser).toBe('Chrome');
      expect(result.version).toBe('120.0.0.0');
      expect(result.os).toBe('Windows 11');
      expect(result.platform).toBe('Microsoft Windows');
      expect(result.isChrome).toBe(true);
      expect(result.isWindows).toBe(true);
      expect(result.isDesktop).toBe(true);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isBot).toBe(false);
    });
  });

  describe('Real-World Safari Mobile', () => {
    it('should parse Safari on iPhone correctly', () => {
      const device = new DeviceUUID();
      const ua =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
      const result: AgentInfo = device.parse(ua);

      expect(result.browser).toBe('Safari');
      expect(result.version).toBe('17.2');
      expect(result.os).toBe('iOS');
      expect(result.isSafari).toBe(true);
      expect(result.isiPhone).toBe(true);
      expect(result.isMobile).toBe(true);
      expect(result.isDesktop).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isBot).toBe(false);
    });
  });

  describe('Real-World Firefox Linux', () => {
    it('should parse Firefox on Linux correctly', () => {
      const device = new DeviceUUID();
      const ua = 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0';
      const result: AgentInfo = device.parse(ua);

      expect(result.browser).toBe('Firefox');
      expect(result.version).toBe('121.0');
      expect(result.os).toBe('Linux 64');
      expect(result.platform).toBe('Linux');
      expect(result.isFirefox).toBe(true);
      expect(result.isLinux).toBe(true);
      expect(result.isDesktop).toBe(true);
      expect(result.isMobile).toBe(false);
    });
  });

  describe('Real-World Edge Windows', () => {
    it('should parse Edge on Windows correctly', () => {
      const device = new DeviceUUID();
      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';
      const result: AgentInfo = device.parse(ua);

      expect(result.browser).toBe('Edge');
      expect(result.version).toBe('120.0.0.0');
      expect(result.os).toBe('Windows 11');
      expect(result.isEdge).toBe(true);
      expect(result.isWindows).toBe(true);
      expect(result.isDesktop).toBe(true);
    });
  });

  describe('Real-World iPad', () => {
    it('should parse iPad correctly', () => {
      const device = new DeviceUUID();
      const ua =
        'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
      const result: AgentInfo = device.parse(ua);

      expect(result.browser).toBe('Safari');
      expect(result.os).toBe('iOS');
      expect(result.isiPad).toBe(true);
      expect(result.isTablet).toBe(true);
      expect(result.isMobile).toBe(false);
      expect(result.isDesktop).toBe(false);
    });
  });

  describe('Real-World Android Mobile', () => {
    it('should parse Android phone correctly', () => {
      const device = new DeviceUUID();
      const ua =
        'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36';
      const result: AgentInfo = device.parse(ua);

      expect(result.browser).toBe('Chrome');
      expect(result.os).toBe('Linux');
      expect(result.platform).toBe('Android');
      expect(result.isAndroid).toBe(true);
      expect(result.isChrome).toBe(true);
      expect(result.isMobile).toBe(true);
      expect(result.isTablet).toBe(false);
    });
  });

  describe('Real-World Android Tablet', () => {
    it('should parse Android tablet correctly', () => {
      const device = new DeviceUUID();
      const ua =
        'Mozilla/5.0 (Linux; Android 14; SM-X706B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Safari/537.36';
      const result: AgentInfo = device.parse(ua);

      expect(result.browser).toBe('Chrome');
      expect(result.os).toBe('Linux');
      expect(result.platform).toBe('Android');
      expect(result.isAndroid).toBe(true);
      expect(result.isAndroidTablet).toBe(true);
      expect(result.isTablet).toBe(true);
      expect(result.isMobile).toBe(false);
    });
  });

  describe('Real-World Googlebot', () => {
    it('should parse Googlebot correctly', () => {
      const device = new DeviceUUID();
      const ua = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';
      const result: AgentInfo = device.parse(ua);

      expect(result.isBot).toBeTruthy();
      expect(result.isBot).toBe('googlebot');
    });
  });

  describe('AgentInfo Properties', () => {
    it('should include all required properties', () => {
      const device = new DeviceUUID();
      const ua =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const result: AgentInfo = device.parse(ua);

      // Check existence of core properties
      expect(result).toHaveProperty('source');
      expect(result).toHaveProperty('browser');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('os');
      expect(result).toHaveProperty('platform');

      // Check boolean flags
      expect(result).toHaveProperty('isMobile');
      expect(result).toHaveProperty('isTablet');
      expect(result).toHaveProperty('isDesktop');
      expect(result).toHaveProperty('isBot');

      // Check browser flags
      expect(result).toHaveProperty('isChrome');
      expect(result).toHaveProperty('isFirefox');
      expect(result).toHaveProperty('isSafari');
      expect(result).toHaveProperty('isEdge');

      // Check OS flags
      expect(result).toHaveProperty('isWindows');
      expect(result).toHaveProperty('isMac');
      expect(result).toHaveProperty('isLinux');
      expect(result).toHaveProperty('isAndroid');

      // Check utility functions
      expect(result).toHaveProperty('hashMD5');
      expect(result).toHaveProperty('hashInt');
      expect(typeof result.hashMD5).toBe('function');
      expect(typeof result.hashInt).toBe('function');
    });

    it('should have working hash functions', () => {
      const device = new DeviceUUID();
      const result: AgentInfo = device.parse('any UA');

      const md5Hash = result.hashMD5('test');
      const intHash = result.hashInt('test');

      expect(typeof md5Hash).toBe('string');
      expect(md5Hash).toMatch(/^[a-f0-9]{32}$/);
      expect(typeof intHash).toBe('number');
      expect(Number.isInteger(intHash)).toBe(true);
    });
  });

  describe('Default Agent Values', () => {
    it('should handle missing user agent gracefully', () => {
      const device = new DeviceUUID();
      const result: AgentInfo = device.parse('');

      expect(result.browser).toBeDefined();
      expect(result.os).toBeDefined();
      expect(result.version).toBeDefined();
      expect(result.platform).toBeDefined();
    });
  });

  describe('Method Chaining', () => {
    it('should support reset method', () => {
      const device = new DeviceUUID();

      const ua1 =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
      device.parse(ua1);

      const resetResult = device.reset();
      expect(resetResult).toBe(device); // Should return this for chaining
    });
  });

  describe('Options Inheritance', () => {
    it('should respect custom options', () => {
      const device = new DeviceUUID({
        version: false,
        language: false,
        platform: false,
      });

      const ua =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const result = device.parse(ua);

      // Result should still be valid
      expect(result.browser).toBeDefined();
      expect(result.os).toBeDefined();
    });
  });
});
