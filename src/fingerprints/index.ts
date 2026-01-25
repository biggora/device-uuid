/**
 * Fingerprint modules index
 * Exports all fingerprinting methods
 */

export { getCanvasFingerprint, isCanvasSupported } from './canvas';
export { getWebGLFingerprint, isWebGLSupported, isDebugInfoSupported } from './webgl';
export { getAudioFingerprint, isAudioSupported, isOfflineAudioSupported } from './audio';
export {
  getFontFingerprint,
  getFontFingerprintAsync,
  getDetectedFonts,
  getDetectedFontsAsync,
  getDefaultFontList,
  isFontDetectionSupported,
} from './fonts';
