import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';
import { smartTV } from '../fixtures/user-agents';

describe('Smart TV Detection', () => {
  describe('Samsung TV', () => {
    it('should detect Samsung Smart TV', () => {
      const device = new DeviceUUID();
      const result = device.parse(smartTV.samsungTV);

      expect(result.isSmartTV).toBe(true);
      expect(result.isMobile).toBe(false);
      expect(result.isTablet).toBe(false);
      expect(result.isDesktop).toBe(false);
    });
  });

  describe('LG TV', () => {
    it('should detect LG Smart TV', () => {
      const device = new DeviceUUID();
      const result = device.parse(smartTV.lgTV);

      expect(result.isSmartTV).toBe(true);
      expect(result.isMobile).toBe(false);
    });
  });

  describe('Apple TV', () => {
    it('should detect Apple TV', () => {
      const device = new DeviceUUID();
      const result = device.parse(smartTV.appleTV);

      expect(result.isSmartTV).toBe(true);
      expect(result.isMobile).toBe(false);
    });
  });

  describe('Non-TV Detection', () => {
    it('should not detect regular browsers as Smart TV', () => {
      const device = new DeviceUUID();
      const chromeUA =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const result = device.parse(chromeUA);

      expect(result.isSmartTV).toBe(false);
    });

    it('should not detect mobile devices as Smart TV', () => {
      const device = new DeviceUUID();
      const mobileUA =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
      const result = device.parse(mobileUA);

      expect(result.isSmartTV).toBe(false);
    });
  });
});
