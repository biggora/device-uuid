/**
 * Fingerprint utility functions
 * Common operations for hash combining, error handling, and feature detection
 */

import type { FingerprintFeature, FingerprintOptions, FingerprintPreset } from '../types';
import { isBrowser, getNavigator, getWindow } from './environment';

/**
 * Default fingerprint options - all advanced methods disabled for privacy
 */
export const DEFAULT_FINGERPRINT_OPTIONS: Readonly<FingerprintOptions> = {
  canvas: false,
  webgl: false,
  audio: false,
  fonts: false,
  mediaDevices: false,
  networkInfo: false,
  timezone: false,
  incognitoDetection: false,
  timeout: 5000,
  methodTimeout: 1000,
} as const;

/**
 * Fingerprint option presets
 */
export const FINGERPRINT_PRESETS: Readonly<Record<FingerprintPreset, FingerprintOptions>> = {
  /** Minimal - only basic device info, no advanced fingerprinting */
  minimal: {
    canvas: false,
    webgl: false,
    audio: false,
    fonts: false,
    mediaDevices: false,
    networkInfo: false,
    timezone: false,
    incognitoDetection: false,
    timeout: 5000,
    methodTimeout: 1000,
  },
  /** Standard - canvas and webgl for good uniqueness */
  standard: {
    canvas: true,
    webgl: true,
    audio: false,
    fonts: false,
    mediaDevices: false,
    networkInfo: false,
    timezone: true,
    incognitoDetection: false,
    timeout: 5000,
    methodTimeout: 1000,
  },
  /** Comprehensive - all fingerprinting methods enabled */
  comprehensive: {
    canvas: true,
    webgl: true,
    audio: true,
    fonts: true,
    mediaDevices: true,
    networkInfo: true,
    timezone: true,
    incognitoDetection: true,
    timeout: 10000,
    methodTimeout: 2000,
  },
} as const;

/**
 * Merge fingerprint options with defaults
 * @param options - Partial options to merge
 * @returns Complete options object
 */
export const mergeOptions = (options?: Partial<FingerprintOptions>): FingerprintOptions => {
  if (!options) return { ...DEFAULT_FINGERPRINT_OPTIONS };
  return { ...DEFAULT_FINGERPRINT_OPTIONS, ...options };
};

/**
 * Get preset options by name
 * @param preset - Preset name
 * @returns Fingerprint options for the preset
 */
export const getPresetOptions = (preset: FingerprintPreset): FingerprintOptions => {
  return { ...FINGERPRINT_PRESETS[preset] };
};

/**
 * Check if a specific fingerprinting feature is supported in the current environment
 * @param feature - Feature to check
 * @returns Whether the feature is supported
 */
export const isFeatureSupported = (feature: FingerprintFeature): boolean => {
  if (!isBrowser()) return false;

  const nav = getNavigator();
  const win = getWindow();

  switch (feature) {
    case 'canvas': {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext && canvas.getContext('2d'));
      } catch {
        return false;
      }
    }

    case 'webgl': {
      try {
        const canvas = document.createElement('canvas');
        return !!(
          canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl')
        );
      } catch {
        return false;
      }
    }

    case 'audio': {
      return !!(
        win &&
        (typeof AudioContext !== 'undefined' ||
          typeof (win as Window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext !== 'undefined')
      );
    }

    case 'fonts': {
      // Font detection always works via canvas or DOM measurement
      return isBrowser() && !!document.createElement;
    }

    case 'mediaDevices': {
      return !!(nav && nav.mediaDevices && typeof nav.mediaDevices.enumerateDevices === 'function');
    }

    case 'networkInfo': {
      return !!(nav && 'connection' in nav);
    }

    case 'timezone': {
      return typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat === 'function';
    }

    case 'incognitoDetection': {
      return !!(nav && 'storage' in nav && typeof nav.storage?.estimate === 'function');
    }

    default:
      return false;
  }
};

/**
 * Wrap a promise with a timeout
 * @param promise - Promise to wrap
 * @param ms - Timeout in milliseconds
 * @param fallback - Fallback value on timeout
 * @returns Promise that resolves with result or fallback
 */
export const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    }),
  ]);
};

/**
 * Safely execute an async function with error handling
 * @param fn - Async function to execute
 * @param fallback - Fallback value on error
 * @returns Promise with result or fallback
 */
export const safeAsync = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch {
    return fallback;
  }
};

/**
 * Combine multiple hash strings into a single hash
 * @param hashes - Array of hash strings (null values are skipped)
 * @param separator - Separator between hashes
 * @returns Combined hash string
 */
export const combineHashes = (hashes: (string | null)[], separator = ':'): string => {
  return hashes.filter((h): h is string => h !== null && h !== '').join(separator);
};

/**
 * Calculate confidence score based on available components
 * @param totalComponents - Total number of components attempted
 * @param successfulComponents - Number of successful components
 * @param weights - Optional weights for different component categories
 * @returns Confidence score between 0 and 1
 */
export const calculateConfidence = (
  totalComponents: number,
  successfulComponents: number,
  weights?: { basic: number; advanced: number }
): number => {
  if (totalComponents === 0) return 0;

  const baseConfidence = successfulComponents / totalComponents;

  // Apply weights if provided (basic components are more reliable)
  if (weights) {
    const weightedScore = baseConfidence * (weights.basic * 0.6 + weights.advanced * 0.4);
    return Math.min(1, Math.max(0, weightedScore));
  }

  return baseConfidence;
};

/**
 * Get current high-resolution timestamp
 * @returns Timestamp in milliseconds
 */
export const getTimestamp = (): number => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
};

/**
 * Measure execution time of an async function
 * @param fn - Async function to measure
 * @returns Promise with result and duration
 */
export const measureAsync = async <T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> => {
  const start = getTimestamp();
  const result = await fn();
  const duration = getTimestamp() - start;
  return { result, duration };
};

/**
 * Error log entry
 */
export interface ErrorLogEntry {
  /** Component that caused the error */
  component: string;
  /** Error message */
  error: string;
  /** Timestamp when error occurred */
  timestamp: number;
}

/**
 * Error logger configuration
 */
export interface ErrorLoggerConfig {
  /** Whether logging is enabled */
  enabled?: boolean;
  /** Maximum number of errors to store */
  maxErrors?: number;
  /** Custom callback for errors */
  onError?: (entry: ErrorLogEntry) => void;
}

/**
 * Error logger class for centralized error handling
 */
class ErrorLogger {
  private errors: ErrorLogEntry[] = [];
  private config: Required<Pick<ErrorLoggerConfig, 'enabled' | 'maxErrors'>> & {
    onError?: (entry: ErrorLogEntry) => void;
  };

  constructor(config?: ErrorLoggerConfig) {
    this.config = {
      enabled: config?.enabled ?? false,
      maxErrors: config?.maxErrors ?? 50,
      onError: config?.onError,
    };
  }

  /**
   * Log an error
   * @param component - Component that caused the error
   * @param error - Error object or message
   */
  log(component: string, error: unknown): void {
    if (!this.config.enabled) return;

    const errorMessage = error instanceof Error ? error.message : String(error);
    const entry: ErrorLogEntry = {
      component,
      error: errorMessage,
      timestamp: Date.now(),
    };

    // Add to errors array
    this.errors.push(entry);

    // Trim if exceeds max
    if (this.errors.length > this.config.maxErrors) {
      this.errors.shift();
    }

    // Call custom callback
    if (this.config.onError) {
      try {
        this.config.onError(entry);
      } catch {
        // Ignore callback errors
      }
    }
  }

  /**
   * Get all logged errors
   * @returns Array of error entries
   */
  getErrors(): readonly ErrorLogEntry[] {
    return this.errors;
  }

  /**
   * Clear all logged errors
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * Enable or disable logging
   * @param enabled - Whether to enable logging
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Check if logging is enabled
   * @returns Whether logging is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }
}

/**
 * Global error logger instance
 */
let globalErrorLogger: ErrorLogger | null = null;

/**
 * Get or create the global error logger
 * @param config - Optional configuration
 * @returns Error logger instance
 */
export const getErrorLogger = (config?: ErrorLoggerConfig): ErrorLogger => {
  if (!globalErrorLogger) {
    globalErrorLogger = new ErrorLogger(config);
  } else if (config) {
    // Update configuration if provided
    if (config.enabled !== undefined) {
      globalErrorLogger.setEnabled(config.enabled);
    }
  }
  return globalErrorLogger;
};

/**
 * Log an error to the global error logger
 * @param component - Component that caused the error
 * @param error - Error object or message
 */
export const logError = (component: string, error: unknown): void => {
  if (globalErrorLogger) {
    globalErrorLogger.log(component, error);
  }
};
