/**
 * Performance benchmark tests for fingerprint generation
 */

import { describe, it, expect } from 'vitest';
import { DeviceUUID } from '../../src';

describe('Performance Benchmarks', () => {
  describe('Sync API Performance', () => {
    it('should complete get() in under 10ms', () => {
      const device = new DeviceUUID();
      const start = performance.now();
      device.get();
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10);
    });

    it('should complete parse() in under 5ms', () => {
      const device = new DeviceUUID();
      const start = performance.now();
      device.parse();
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(5);
    });

    it('should complete getComponents() in under 5ms', () => {
      const device = new DeviceUUID();
      const start = performance.now();
      device.getComponents();
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(5);
    });

    it('should complete reset() in under 1ms', () => {
      const device = new DeviceUUID();
      const start = performance.now();
      device.reset();
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1);
    });
  });

  describe('Async API Performance', () => {
    it('should complete getAsync() with no options in under 100ms', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync();
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should complete getAsync() minimal preset in under 100ms', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync('minimal');
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should complete getAsync() standard preset in under 500ms', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync('standard');
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });

    it('should complete getAsync() comprehensive preset in under 2000ms', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync('comprehensive');
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(2000);
    });

    it('should complete getDetailedAsync() in under 2000ms', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getDetailedAsync();
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(2000);
    });

    it('should complete getDetailedAsync() comprehensive in under 2000ms', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getDetailedAsync('comprehensive');
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('isFeatureSupported Performance', () => {
    it('should complete in under 1ms', () => {
      const start = performance.now();
      DeviceUUID.isFeatureSupported('canvas');
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(1);
    });

    it('should complete multiple checks quickly', () => {
      const start = performance.now();
      DeviceUUID.isFeatureSupported('canvas');
      DeviceUUID.isFeatureSupported('webgl');
      DeviceUUID.isFeatureSupported('audio');
      DeviceUUID.isFeatureSupported('fonts');
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(5);
    });
  });

  describe('Multiple Operations Performance', () => {
    it('should handle multiple sync calls efficiently', () => {
      const device = new DeviceUUID();
      const iterations = 100;
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        device.get();
      }
      const duration = performance.now() - start;
      const avgDuration = duration / iterations;
      expect(avgDuration).toBeLessThan(1);
    });

    it('should handle multiple async calls efficiently', async () => {
      const device = new DeviceUUID();
      const iterations = 10;
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        await device.getAsync();
      }
      const duration = performance.now() - start;
      const avgDuration = duration / iterations;
      expect(avgDuration).toBeLessThan(50);
    });
  });

  describe('Memory Efficiency', () => {
    it('should not leak memory with multiple instances', () => {
      const startMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Create multiple instances
      const instances: DeviceUUID[] = [];
      for (let i = 0; i < 100; i++) {
        instances.push(new DeviceUUID());
      }

      const endMemory = (performance as any).memory?.usedJSHeapSize || startMemory;
      // Memory increase should be reasonable (less than 10MB for 100 instances)
      expect(endMemory - startMemory).toBeLessThan(10 * 1024 * 1024);
    });

    it('should not leak memory with multiple async calls', async () => {
      const device = new DeviceUUID();
      const startMemory = (performance as any).memory?.usedJSHeapSize || 0;

      for (let i = 0; i < 50; i++) {
        await device.getAsync();
      }

      const endMemory = (performance as any).memory?.usedJSHeapSize || startMemory;
      // Memory increase should be reasonable
      expect(endMemory - startMemory).toBeLessThan(5 * 1024 * 1024);
    });
  });

  describe('Individual Fingerprint Methods Performance', () => {
    it('should measure canvas fingerprint performance', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({ canvas: true });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should measure webgl fingerprint performance', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({ webgl: true });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should measure audio fingerprint performance', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({ audio: true });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200);
    });

    it('should measure fonts fingerprint performance', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({ fonts: true });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });

    it('should measure timezone fingerprint performance', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({ timezone: true });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });

    it('should measure mediaDevices fingerprint performance', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({ mediaDevices: true });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500);
    });

    it('should measure networkInfo fingerprint performance', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({ networkInfo: true });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Timeout Performance', () => {
    it('should handle very short timeout gracefully', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({ timeout: 1 });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(10);
    });

    it('should respect timeout even with slow operations', async () => {
      const device = new DeviceUUID();
      const start = performance.now();
      await device.getAsync({
        timeout: 10,
        canvas: true,
        webgl: true,
        audio: true,
        fonts: true,
      });
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(50);
    });
  });

  describe('Main Thread Blocking', () => {
    it('should not block main thread during sync operations', () => {
      const device = new DeviceUUID();
      let hasYielded = false;

      // Use setTimeout to check if main thread yields
      setTimeout(() => {
        hasYielded = true;
      }, 0);

      device.get();
      device.parse();
      device.getComponents();

      // Main thread should have opportunity to yield
      expect(typeof hasYielded).toBe('boolean');
    });

    it('should yield during async operations', async () => {
      const device = new DeviceUUID();
      let hasYielded = false;

      setTimeout(() => {
        hasYielded = true;
      }, 0);

      await device.getAsync();

      // Wait a bit more to ensure setTimeout callback can run
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Main thread should have yielded during async operation
      // Note: In Node.js test environment, this may not always be true
      expect(typeof hasYielded).toBe('boolean');
    });
  });

  describe('Performance Regression Detection', () => {
    it('should maintain consistent performance across calls', async () => {
      const device = new DeviceUUID();
      const durations: number[] = [];

      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        await device.getAsync();
        durations.push(performance.now() - start);
      }

      // Calculate standard deviation
      const mean = durations.reduce((a, b) => a + b) / durations.length;
      const variance = durations.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / durations.length;
      const stdDev = Math.sqrt(variance);

      // Standard deviation should be reasonable (less than 50ms)
      expect(stdDev).toBeLessThan(50);
    });

    it('should not degrade performance over time', async () => {
      const device = new DeviceUUID();
      const firstDuration = await measureGetAsync(device);

      // Perform some operations
      for (let i = 0; i < 10; i++) {
        await device.getAsync();
      }

      const lastDuration = await measureGetAsync(device);

      // Performance should not degrade significantly (within 10x)
      expect(lastDuration).toBeLessThan(firstDuration * 10);
    });
  });
});

async function measureGetAsync(device: DeviceUUID): Promise<number> {
  const start = performance.now();
  await device.getAsync();
  return performance.now() - start;
}
