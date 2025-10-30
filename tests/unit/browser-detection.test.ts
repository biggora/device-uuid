import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';
import { browsers } from '../fixtures/user-agents';

describe('Browser Detection', () => {
  describe('Chrome', () => {
    it('should detect Chrome on Windows', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.chrome.windows);

      expect(result.browser).toBe('Chrome');
      expect(result.isChrome).toBe(true);
      expect(result.isDesktop).toBe(true);
      expect(result.isMobile).toBe(false);
    });

    it('should detect Chrome on macOS', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.chrome.mac);

      expect(result.browser).toBe('Chrome');
      expect(result.isChrome).toBe(true);
      expect(result.os).toBe('macOS Catalina');
    });

    it('should detect Chrome on Linux', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.chrome.linux);

      expect(result.browser).toBe('Chrome');
      expect(result.isChrome).toBe(true);
      expect(result.os).toBe('Linux 64');
    });

    it('should extract Chrome version', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.chrome.windows);

      expect(result.version).toBe('120.0.0.0');
    });
  });

  describe('Firefox', () => {
    it('should detect Firefox on Windows', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.firefox.windows);

      expect(result.browser).toBe('Firefox');
      expect(result.isFirefox).toBe(true);
      expect(result.isDesktop).toBe(true);
    });

    it('should detect Firefox on macOS', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.firefox.mac);

      expect(result.browser).toBe('Firefox');
      expect(result.isFirefox).toBe(true);
      expect(result.os).toBe('macOS Catalina');
    });

    it('should extract Firefox version', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.firefox.windows);

      expect(result.version).toBe('121.0');
    });
  });

  describe('Safari', () => {
    it('should detect Safari on macOS', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.safari.mac);

      expect(result.browser).toBe('Safari');
      expect(result.isSafari).toBe(true);
      expect(result.os).toBe('macOS Catalina');
      expect(result.isDesktop).toBe(true);
    });

    it('should detect Safari on iOS', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.safari.iOS);

      expect(result.browser).toBe('Safari');
      expect(result.isSafari).toBe(true);
      expect(result.os).toBe('iOS');
      expect(result.isMobile).toBe(true);
    });

    it('should extract Safari version', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.safari.mac);

      expect(result.version).toBe('17.2');
    });
  });

  describe('Edge', () => {
    it('should detect Edge on Windows', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.edge.windows);

      expect(result.browser).toBe('Edge');
      expect(result.isEdge).toBe(true);
      expect(result.isDesktop).toBe(true);
    });

    it('should extract Edge version', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.edge.windows);

      expect(result.version).toBe('120.0.0.0');
    });
  });

  describe('Opera', () => {
    it('should detect Opera on Windows', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.opera.windows);

      expect(result.browser).toBe('Opera');
      expect(result.isOpera).toBe(true);
      expect(result.isDesktop).toBe(true);
    });

    it('should extract Opera version', () => {
      const device = new DeviceUUID();
      const result = device.parse(browsers.opera.windows);

      expect(result.version).toBe('106.0.0.0');
    });
  });

  describe('Unknown browser', () => {
    it('should extract browser name from unrecognized user agents', () => {
      const device = new DeviceUUID();
      const result = device.parse('CustomBrowser/1.0');

      // Library extracts browser name and version from UA string for unknown browsers
      expect(result.browser).toBe('CustomBrowser');
      expect(result.version).toBe('1.0');
    });
  });
});
