/**
 * device-uuid v2.0.0
 * Fast browser device UUID generation library
 *
 * @author Alexey Gordeyev
 * @license MIT
 */

// Export main class
export { DeviceUUID } from './core/DeviceUUID';

// Export types for TypeScript consumers
export type {
  DeviceUUIDOptions,
  AgentInfo,
  FingerprintOptions,
  FingerprintDetails,
  FingerprintComponent,
  FingerprintFeature,
  FingerprintPreset,
} from './types';

// Export constants for advanced users
export {
  BOTS,
  VERSION_PATTERNS,
  BROWSER_PATTERNS,
  OS_PATTERNS,
  PLATFORM_PATTERNS,
  DEFAULT_OPTIONS,
} from './constants';

// Export hash utilities
export { hashMD5, hashInt } from './utils/md5';

// Export fingerprint utilities
export {
  DEFAULT_FINGERPRINT_OPTIONS,
  FINGERPRINT_PRESETS,
  mergeOptions,
  getPresetOptions,
  isFeatureSupported,
  ErrorLoggerConfig,
  ErrorLogEntry,
  getErrorLogger,
  logError,
} from './utils/fingerprint';

// Export individual fingerprint methods for advanced use
export {
  getCanvasFingerprint,
  isCanvasSupported,
  getWebGLFingerprint,
  isWebGLSupported,
  getAudioFingerprint,
  isAudioSupported,
  getFontFingerprint,
  getFontFingerprintAsync,
  getDetectedFonts,
  getDetectedFontsAsync,
  getDefaultFontList,
  isFontDetectionSupported,
  isOfflineAudioSupported,
  isDebugInfoSupported,
} from './fingerprints';

// Default export for convenience
export { DeviceUUID as default } from './core/DeviceUUID';
