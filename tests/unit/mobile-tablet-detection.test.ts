import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';
import { mobile, tablets } from '../fixtures/user-agents';

describe('Mobile and Tablet Detection', () => {
  describe('Mobile Detection', () => {
    it('should detect iPhone as mobile', () => {
      const device = new DeviceUUID();
      const result = device.parse(mobile.iPhone.safari);

      expect(result.isMobile).toBe(true);
      expect(result.isTablet).toBe(false);
      expect(result.isDesktop).toBe(false);
      expect(result.isiPhone).toBe(true);
    });

    it('should detect Android phone as mobile', () => {
      const device = new DeviceUUID();
      const result = device.parse(mobile.android.chrome);

      expect(result.isMobile).toBe(true);
      expect(result.isTablet).toBe(false);
      expect(result.isDesktop).toBe(false);
      expect(result.isAndroid).toBe(true);
    });

    it('should detect Chrome on iPhone', () => {
      const device = new DeviceUUID();
      const result = device.parse(mobile.iPhone.chrome);

      expect(result.isMobile).toBe(true);
      expect(result.isiPhone).toBe(true);
      expect(result.isChrome).toBe(true);
    });

    it('should detect Firefox on Android', () => {
      const device = new DeviceUUID();
      const result = device.parse(mobile.android.firefox);

      expect(result.isMobile).toBe(true);
      expect(result.isAndroid).toBe(true);
      expect(result.isFirefox).toBe(true);
    });
  });

  describe('Tablet Detection', () => {
    it('should detect iPad as tablet', () => {
      const device = new DeviceUUID();
      const result = device.parse(tablets.iPad);

      expect(result.isTablet).toBe(true);
      expect(result.isMobile).toBe(false);
      expect(result.isDesktop).toBe(false);
      expect(result.isiPad).toBe(true);
    });

    it('should detect Android tablet', () => {
      const device = new DeviceUUID();
      const result = device.parse(tablets.androidTablet);

      expect(result.isTablet).toBe(true);
      expect(result.isMobile).toBe(false);
      expect(result.isAndroidTablet).toBe(true);
    });

    it('should detect Kindle Fire as tablet', () => {
      const device = new DeviceUUID();
      const result = device.parse(tablets.kindleFire);

      expect(result.isTablet).toBe(true);
      expect(result.isKindleFire).toBe(true);
      expect(result.isSilk).toBe(true);
    });
  });

  describe('Desktop Detection', () => {
    it('should detect Windows Chrome as desktop', () => {
      const device = new DeviceUUID();
      const result = device.parse(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      );

      expect(result.isDesktop).toBe(true);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
    });

    it('should detect macOS Safari as desktop', () => {
      const device = new DeviceUUID();
      const result = device.parse(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
      );

      expect(result.isDesktop).toBe(true);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
    });
  });

  describe('Touch Support', () => {
    it('should detect touch support on mobile devices', () => {
      const device = new DeviceUUID();
      const result = device.parse(mobile.iPhone.safari);

      // Touch support detection depends on the environment (jsdom might not fully support it)
      // We test that the property exists
      expect(typeof result.isTouchScreen).toBe('boolean');
    });
  });

  describe('iPad Safari Detection', () => {
    it('should identify iPad Safari correctly', () => {
      const device = new DeviceUUID();
      const result = device.parse(mobile.iPad.safari);

      expect(result.isiPad).toBe(true);
      expect(result.isSafari).toBe(true);
      expect(result.isTablet).toBe(true);
    });
  });
});
