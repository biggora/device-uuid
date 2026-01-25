/**
 * AudioContext Fingerprinting Module
 * Generates unique fingerprint based on audio processing differences
 */

import { hashMD5 } from '../utils/md5';
import { isBrowser, getWindow } from '../utils/environment';
import { withTimeout } from '../utils/fingerprint';

/**
 * Audio fingerprint options
 */
interface AudioFingerprintOptions {
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Extended Window interface with webkit AudioContext
 */
interface ExtendedWindow extends Window {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
  OfflineAudioContext?: typeof OfflineAudioContext;
  webkitOfflineAudioContext?: typeof OfflineAudioContext;
}

/**
 * Get AudioContext constructor (with webkit fallback)
 * @returns AudioContext constructor or null
 */
const getAudioContextConstructor = (): typeof AudioContext | null => {
  const win = getWindow() as ExtendedWindow | undefined;
  if (!win) return null;

  return win.AudioContext || win.webkitAudioContext || null;
};

/**
 * Get OfflineAudioContext constructor (with webkit fallback)
 * @returns OfflineAudioContext constructor or null
 */
const getOfflineAudioContextConstructor = (): typeof OfflineAudioContext | null => {
  const win = getWindow() as ExtendedWindow | undefined;
  if (!win) return null;

  return win.OfflineAudioContext || win.webkitOfflineAudioContext || null;
};

/**
 * Generate fingerprint using OfflineAudioContext (more deterministic)
 * @param timeout - Timeout in milliseconds
 * @returns Promise resolving to fingerprint hash or null
 */
const generateOfflineFingerprint = async (timeout: number): Promise<string | null> => {
  const OfflineCtx = getOfflineAudioContextConstructor();
  if (!OfflineCtx) return null;

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => resolve(null), timeout);

    try {
      // Create offline context: sample rate 44100, 1 channel, 5000 samples
      const context = new OfflineCtx(1, 5000, 44100);

      // Create oscillator
      const oscillator = context.createOscillator();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(10000, context.currentTime);

      // Create dynamics compressor for more variance
      const compressor = context.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-50, context.currentTime);
      compressor.knee.setValueAtTime(40, context.currentTime);
      compressor.ratio.setValueAtTime(12, context.currentTime);
      compressor.attack.setValueAtTime(0, context.currentTime);
      compressor.release.setValueAtTime(0.25, context.currentTime);

      // Connect nodes: oscillator -> compressor -> destination
      oscillator.connect(compressor);
      compressor.connect(context.destination);

      // Start and schedule stop
      oscillator.start(0);

      // Render and extract fingerprint
      context
        .startRendering()
        .then((renderedBuffer) => {
          clearTimeout(timeoutId);

          try {
            // Get channel data
            const channelData = renderedBuffer.getChannelData(0);

            // Sample specific values for fingerprint (not entire buffer)
            const samples: number[] = [];
            const sampleIndices = [500, 1000, 2000, 3000, 4000, 4500];

            for (const idx of sampleIndices) {
              if (idx < channelData.length) {
                samples.push(channelData[idx]);
              }
            }

            // Also add some statistics
            let sum = 0;
            let max = -Infinity;
            let min = Infinity;

            for (let i = 0; i < channelData.length; i++) {
              const val = channelData[i];
              sum += val;
              if (val > max) max = val;
              if (val < min) min = val;
            }

            const fingerprint = [
              ...samples.map((s) => s.toString()),
              `sum:${sum}`,
              `max:${max}`,
              `min:${min}`,
              `sampleRate:${renderedBuffer.sampleRate}`,
            ].join('|');

            resolve(hashMD5(fingerprint));
          } catch {
            resolve(null);
          }
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(null);
        });
    } catch {
      clearTimeout(timeoutId);
      resolve(null);
    }
  });
};

/**
 * Generate fallback fingerprint using AudioContext properties
 * @returns Fingerprint hash or null
 */
const generateFallbackFingerprint = (): string | null => {
  const AudioCtx = getAudioContextConstructor();
  if (!AudioCtx) return null;

  try {
    const context = new AudioCtx();
    const parts: string[] = [];

    // Collect basic properties
    parts.push(`sampleRate:${context.sampleRate}`);
    parts.push(`state:${context.state}`);
    parts.push(`baseLatency:${context.baseLatency || 'unknown'}`);

    // Get destination properties
    parts.push(`maxChannels:${context.destination.maxChannelCount}`);
    parts.push(`channelCount:${context.destination.channelCount}`);
    parts.push(`channelInterpretation:${context.destination.channelInterpretation}`);

    // Close context
    context.close().catch(() => {
      // Ignore close errors
    });

    return hashMD5(parts.join('|'));
  } catch {
    return null;
  }
};

/**
 * Generate audio fingerprint
 * @param options - Fingerprint options
 * @returns Promise resolving to fingerprint hash or null
 */
export const getAudioFingerprint = async (
  options?: AudioFingerprintOptions
): Promise<string | null> => {
  const timeout = options?.timeout ?? 1000;

  if (!isBrowser()) return null;

  // Try offline audio context first (more deterministic)
  const offlineResult = await withTimeout(generateOfflineFingerprint(timeout), timeout, null);

  if (offlineResult) return offlineResult;

  // Fall back to basic AudioContext properties
  return generateFallbackFingerprint();
};

/**
 * Check if AudioContext is supported
 * @returns Whether AudioContext is available
 */
export const isAudioSupported = (): boolean => {
  return getAudioContextConstructor() !== null;
};

/**
 * Check if OfflineAudioContext is supported
 * @returns Whether OfflineAudioContext is available
 */
export const isOfflineAudioSupported = (): boolean => {
  return getOfflineAudioContextConstructor() !== null;
};
