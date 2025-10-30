import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';
import { operatingSystems } from '../fixtures/user-agents';

describe('Operating System Detection', () => {
  describe('Windows', () => {
    it('should detect Windows 10', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.windows.win10);

      expect(result.os).toBe('Windows 10.0');
      expect(result.isWindows).toBe(true);
    });

    it('should detect Windows 11', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.windows.win11);

      expect(result.os).toBe('Windows 11');
      expect(result.isWindows).toBe(true);
    });
  });

  describe('macOS', () => {
    it('should detect macOS Catalina', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.macOS.catalina);

      expect(result.os).toBe('macOS Catalina');
      expect(result.isMac).toBe(true);
      expect(result.isDesktop).toBe(true);
    });

    it('should detect macOS Big Sur', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.macOS.bigSur);

      expect(result.os).toBe('macOS Big Sur');
      expect(result.isMac).toBe(true);
      expect(result.isDesktop).toBe(true);
    });

    it('should detect macOS Monterey', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.macOS.monterey);

      expect(result.os).toBe('macOS Monterey');
      expect(result.isMac).toBe(true);
      expect(result.isDesktop).toBe(true);
    });

    it('should detect macOS Ventura', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.macOS.ventura);

      expect(result.os).toBe('macOS Ventura');
      expect(result.isMac).toBe(true);
      expect(result.isDesktop).toBe(true);
    });

    it('should detect macOS Sonoma', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.macOS.sonoma);

      expect(result.os).toBe('macOS Sonoma');
      expect(result.isMac).toBe(true);
      expect(result.isDesktop).toBe(true);
    });
  });

  describe('Linux', () => {
    it('should detect Linux', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.linux.ubuntu);

      expect(result.os).toBe('Linux 64');
      expect(result.isLinux).toBe(true);
      expect(result.isDesktop).toBe(true);
    });
  });

  describe('iOS', () => {
    it('should detect iOS on iPhone', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.iOS.iphone);

      expect(result.os).toBe('iOS');
      expect(result.isiPhone).toBe(true);
      expect(result.isMobile).toBe(true);
    });

    it('should detect iOS on iPad', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.iOS.ipad);

      expect(result.os).toBe('iOS');
      expect(result.isiPad).toBe(true);
      expect(result.isTablet).toBe(true);
    });
  });

  describe('Android', () => {
    it('should detect Android on phone', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.android.phone);

      expect(result.os).toBe('Linux');
      expect(result.platform).toBe('Android');
      expect(result.isAndroid).toBe(true);
      expect(result.isMobile).toBe(true);
    });

    it('should detect Android on tablet', () => {
      const device = new DeviceUUID();
      const result = device.parse(operatingSystems.android.tablet);

      expect(result.os).toBe('Linux');
      expect(result.platform).toBe('Android');
      expect(result.isAndroid).toBe(true);
      expect(result.isAndroidTablet).toBe(true);
    });
  });

  describe('Unknown OS', () => {
    it('should return "unknown" for unrecognized OS', () => {
      const device = new DeviceUUID();
      const result = device.parse('CustomOS/1.0 (Unknown)');

      expect(result.os).toBe('unknown');
    });
  });
});
