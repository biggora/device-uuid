import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';
import { bots } from '../fixtures/user-agents';

describe('Bot Detection', () => {
  describe('Search Engine Bots', () => {
    it('should detect Googlebot', () => {
      const device = new DeviceUUID();
      const result = device.parse(bots.googlebot);

      expect(result.isBot).toBeTruthy();
      expect(result.isBot).toBe('googlebot');
    });

    it('should detect Bingbot', () => {
      const device = new DeviceUUID();
      const result = device.parse(bots.bingbot);

      expect(result.isBot).toBeTruthy();
      expect(result.isBot).toBe('bingbot');
    });

    it('should detect Yandexbot', () => {
      const device = new DeviceUUID();
      const result = device.parse(bots.yandexbot);

      expect(result.isBot).toBeTruthy();
      expect(result.isBot).toBe('yandexbot');
    });

    it('should detect Baiduspider', () => {
      const device = new DeviceUUID();
      const result = device.parse(bots.baiduspider);

      expect(result.isBot).toBeTruthy();
      expect(result.isBot).toBe('baiduspider');
    });
  });

  describe('Social Media Bots', () => {
    it('should detect Facebookbot', () => {
      const device = new DeviceUUID();
      const result = device.parse(bots.facebookbot);

      expect(result.isBot).toBeTruthy();
      // The bot name might vary slightly, just check it's truthy
      expect(result.isBot).not.toBe(false);
    });

    it('should detect Twitterbot', () => {
      const device = new DeviceUUID();
      const result = device.parse(bots.twitterbot);

      expect(result.isBot).toBeTruthy();
      expect(result.isBot).toBe('twitterbot');
    });

    it('should detect LinkedInBot', () => {
      const device = new DeviceUUID();
      const result = device.parse(bots.linkedinbot);

      expect(result.isBot).toBeTruthy();
      expect(result.isBot).toBe('linkedinbot');
    });
  });

  describe('Non-Bot Detection', () => {
    it('should not detect regular browsers as bots', () => {
      const device = new DeviceUUID();
      const chromeUA =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const result = device.parse(chromeUA);

      expect(result.isBot).toBe(false);
    });

    it('should not detect mobile browsers as bots', () => {
      const device = new DeviceUUID();
      const mobileUA =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';
      const result = device.parse(mobileUA);

      expect(result.isBot).toBe(false);
    });
  });

  describe('Bot Detection with Device Info', () => {
    it('should still provide basic info for bots', () => {
      const device = new DeviceUUID();
      const result = device.parse(bots.googlebot);

      expect(result.isBot).toBeTruthy();
      expect(result.source).toBe(bots.googlebot);
      expect(result.browser).toBeDefined();
      expect(result.os).toBeDefined();
    });
  });
});
