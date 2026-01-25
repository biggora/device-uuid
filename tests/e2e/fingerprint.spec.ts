import { expect, test } from '@playwright/test';

/**
 * Cross-browser E2E tests for device-uuid library
 *
 * These tests verify the fingerprinting functionality works correctly
 * across different browsers (Chromium, Firefox, WebKit).
 */

test.describe('DeviceUUID - Basic API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should load DeviceUUID globally', async ({ page }) => {
    const hasDeviceUUID = await page.evaluate(() => {
      return typeof (window as any).DeviceUUID === 'function';
    });
    expect(hasDeviceUUID).toBe(true);
  });

  test('should create DeviceUUID instance', async ({ page }) => {
    const instanceCreated = await page.evaluate(() => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return typeof du.get === 'function';
    });
    expect(instanceCreated).toBe(true);
  });

  test('should generate UUID synchronously', async ({ page }) => {
    const uuid = await page.evaluate(() => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return du.get();
    });
    expect(uuid).toBeTruthy();
    expect(typeof uuid).toBe('string');
    expect(uuid.length).toBeGreaterThan(0);
  });

  test('should generate consistent UUID on same device', async ({ page }) => {
    const uuids = await page.evaluate(() => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return [du.get(), du.get(), du.get()];
    });
    expect(uuids[0]).toBe(uuids[1]);
    expect(uuids[1]).toBe(uuids[2]);
  });
});

test.describe('DeviceUUID - Async API', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should generate async UUID', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getAsync();
    });
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('should support options for async fingerprinting', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getAsync({ canvas: true, webgl: true });
    });
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  test('should return detailed fingerprint results', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getDetailedAsync({ canvas: true, webgl: true, audio: true });
    });
    expect(result).toBeTruthy();
    expect(typeof result).toBe('object');
    expect(result).toHaveProperty('uuid');
    expect(result).toHaveProperty('components');
  });
});

test.describe('DeviceUUID - Canvas Fingerprinting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should generate canvas fingerprint when enabled', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getDetailedAsync({ canvas: true });
    });
    expect(result).toBeTruthy();
    expect(result.components).toBeDefined();
  });

  test('should handle canvas blocker gracefully', async ({ page }) => {
    // Simulate canvas blocker by injecting script before navigation
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.toDataURL = function () {
        return '';
      };
    });

    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');

    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getAsync({ canvas: true });
    });
    // Should still generate UUID even if canvas is blocked
    expect(result).toBeTruthy();
  });
});

test.describe('DeviceUUID - WebGL Fingerprinting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should generate WebGL fingerprint when enabled', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getDetailedAsync({ webgl: true });
    });
    expect(result).toBeTruthy();
    expect(result.components).toBeDefined();
  });
});

test.describe('DeviceUUID - Audio Fingerprinting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should generate audio fingerprint when enabled', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getDetailedAsync({ audio: true });
    });
    expect(result).toBeTruthy();
    expect(result.components).toBeDefined();
  });
});

test.describe('DeviceUUID - Font Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should detect fonts when enabled', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getDetailedAsync({ fonts: true });
    });
    expect(result).toBeTruthy();
    expect(result.components).toBeDefined();
  });
});

test.describe('DeviceUUID - Feature Detection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should check canvas support', async ({ page }) => {
    const isSupported = await page.evaluate(() => {
      return (window as any).DeviceUUID.isFeatureSupported('canvas');
    });
    expect(typeof isSupported).toBe('boolean');
  });

  test('should check WebGL support', async ({ page }) => {
    const isSupported = await page.evaluate(() => {
      return (window as any).DeviceUUID.isFeatureSupported('webgl');
    });
    expect(typeof isSupported).toBe('boolean');
  });

  test('should check AudioContext support', async ({ page }) => {
    const isSupported = await page.evaluate(() => {
      return (window as any).DeviceUUID.isFeatureSupported('audio');
    });
    expect(typeof isSupported).toBe('boolean');
  });
});

test.describe('DeviceUUID - Privacy & Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should respect default options (fingerprinting disabled)', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getDetailedAsync();
    });
    expect(result).toBeTruthy();
    // With defaults, advanced fingerprinting should be minimal
  });

  test('should handle missing permissions gracefully', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getAsync({ mediaDevices: true });
    });
    // Should not throw even if permissions are denied
    expect(result).toBeTruthy();
  });
});

test.describe('DeviceUUID - Browser Compatibility', () => {
  test('should work in Chromium-based browsers', async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    const uuid = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getAsync({ canvas: true, webgl: true });
    });
    expect(uuid).toBeTruthy();
  });

  test('should work in Firefox', async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    const uuid = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getAsync({ canvas: true, webgl: true });
    });
    expect(uuid).toBeTruthy();
  });

  test('should work in WebKit/Safari', async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    const uuid = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getAsync({ canvas: true, webgl: true });
    });
    expect(uuid).toBeTruthy();
  });
});

test.describe('DeviceUUID - Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');
  });

  test('should complete sync fingerprint quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.evaluate(() => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return du.get();
    });
    const duration = Date.now() - startTime;
    // Sync should be very fast (< 100ms)
    expect(duration).toBeLessThan(100);
  });

  test('should complete async fingerprint in reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return await du.getAsync({ canvas: true, webgl: true, audio: true, fonts: true });
    });
    const duration = Date.now() - startTime;
    // Async should complete in reasonable time (< 5 seconds)
    expect(duration).toBeLessThan(5000);
  });
});

test.describe('DeviceUUID - Cross-Browser UUID Stability', () => {
  test('should generate same UUID for multiple calls in same session', async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');

    const uuids = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      const uuid1 = await du.getAsync({ canvas: true, webgl: true });
      const uuid2 = await du.getAsync({ canvas: true, webgl: true });
      return { uuid1, uuid2 };
    });

    expect(uuids.uuid1).toBe(uuids.uuid2);
  });

  test('should include browser-specific characteristics in UUID', async ({ page }) => {
    await page.goto('/tests/e2e/test-page.html');
    await page.waitForLoadState('networkidle');

    const info = await page.evaluate(async () => {
      const DeviceUUIDClass = (window as any).DeviceUUID;
      const du = new DeviceUUIDClass();
      return {
        uuid: await du.getAsync({ canvas: true, webgl: true }),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };
    });

    expect(info.uuid).toBeTruthy();
    expect(info.userAgent).toBeTruthy();
  });
});
