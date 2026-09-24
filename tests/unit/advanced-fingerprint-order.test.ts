import { describe, expect, it, vi } from 'vitest';

const fingerprintState = vi.hoisted(() => ({ calls: 0 }));

vi.mock('../../src/fingerprints', () => {
  const hashes = ['canvas-hash', 'webgl-hash', 'audio-hash', 'fonts-hash'];

  const createFingerprint = (featureIndex: number) => async (): Promise<string> => {
    const callIndex = fingerprintState.calls++;
    const runIndex = Math.floor(callIndex / hashes.length);
    const completionOrder = runIndex % 2 === 0 ? [40, 30, 20, 10] : [10, 20, 30, 40];

    await new Promise((resolve) => setTimeout(resolve, completionOrder[featureIndex]));
    return hashes[featureIndex];
  };

  return {
    getCanvasFingerprint: createFingerprint(0),
    getWebGLFingerprint: createFingerprint(1),
    getAudioFingerprint: createFingerprint(2),
    getFontFingerprint: createFingerprint(3),
  };
});

import { DeviceUUID } from '../../src';

describe('DeviceUUID advanced fingerprint ordering', () => {
  it('keeps the UUID stable when async components finish in different orders', async () => {
    const device = new DeviceUUID();
    const options = {
      canvas: true,
      webgl: true,
      audio: true,
      fonts: true,
      timeout: 500,
    } as const;

    const first = await device.getAsync(options);
    const second = await device.getAsync(options);

    expect(second).toBe(first);
  });
});
