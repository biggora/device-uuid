/**
 * Environment detection and safe global access utilities
 * Provides compatibility for both browser and Node.js environments
 */

/**
 * Extended Navigator interface for legacy and experimental browser properties
 */
interface ExtendedNavigator extends Navigator {
  userLanguage?: string;
  browserLanguage?: string;
  systemLanguage?: string;
  msMaxTouchPoints?: number;
  deviceMemory?: number;
}

/**
 * Check if running in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
};

/**
 * Check if running in Node.js environment
 */
export const isNode = (): boolean => {
  return (
    typeof process !== 'undefined' && process.versions != null && process.versions.node != null
  );
};

/**
 * Safely get the navigator object
 */
export const getNavigator = (): Navigator | undefined => {
  if (isBrowser() && typeof navigator !== 'undefined') {
    return navigator;
  }
  return undefined;
};

/**
 * Safely get the screen object
 */
export const getScreen = (): Screen | undefined => {
  if (isBrowser() && typeof screen !== 'undefined') {
    return screen;
  }
  return undefined;
};

/**
 * Safely get the window object
 */
export const getWindow = (): Window | undefined => {
  if (isBrowser() && typeof window !== 'undefined') {
    return window;
  }
  return undefined;
};

/**
 * Get user agent string safely
 */
export const getUserAgent = (): string => {
  const nav = getNavigator();
  return nav?.userAgent || '';
};

/**
 * Get language safely
 */
export const getLanguage = (): string => {
  const nav = getNavigator() as ExtendedNavigator | undefined;
  if (!nav) return 'unknown';

  return (
    (
      nav.language ||
      nav.userLanguage ||
      nav.browserLanguage ||
      nav.systemLanguage ||
      ''
    ).toLowerCase() || 'unknown'
  );
};

/**
 * Get color depth safely
 */
export const getColorDepth = (): number => {
  const scr = getScreen();
  return scr?.colorDepth ?? -1;
};

/**
 * Get pixel depth safely
 */
export const getPixelDepth = (): number => {
  const scr = getScreen();
  return scr?.pixelDepth ?? -1;
};

/**
 * Get screen resolution safely
 */
export const getScreenResolution = (): [number, number] => {
  const scr = getScreen();
  if (scr) {
    return [scr.availWidth || 0, scr.availHeight || 0];
  }
  return [0, 0];
};

/**
 * Get CPU core count safely
 */
export const getCPUCores = (): number => {
  const nav = getNavigator();
  return nav?.hardwareConcurrency ?? -1;
};

/**
 * Check if touch screen is supported
 */
export const isTouchScreen = (): boolean => {
  const win = getWindow();
  const nav = getNavigator() as ExtendedNavigator | undefined;

  if (!win || !nav) return false;

  return (
    'ontouchstart' in win ||
    (nav.maxTouchPoints !== undefined && nav.maxTouchPoints > 0) ||
    (nav.msMaxTouchPoints !== undefined && nav.msMaxTouchPoints > 0)
  );
};

/**
 * Get device memory in GB safely
 * Returns approximate RAM: 0.25, 0.5, 1, 2, 4, or 8
 * Returns -1 if not supported (Safari, Firefox)
 */
export const getDeviceMemory = (): number => {
  const nav = getNavigator() as ExtendedNavigator | undefined;
  return nav?.deviceMemory ?? -1;
};

/**
 * Get max touch points safely
 * Returns number of simultaneous touch points supported
 * Returns 0 if not a touch device
 */
export const getMaxTouchPoints = (): number => {
  const nav = getNavigator() as ExtendedNavigator | undefined;
  if (!nav) return 0;

  return nav.maxTouchPoints ?? nav.msMaxTouchPoints ?? 0;
};

/**
 * Get Do Not Track preference safely
 * Returns '1' if enabled, '0' if disabled, null if not set
 */
export const getDoNotTrack = (): string | null => {
  const nav = getNavigator();
  const win = getWindow() as (Window & { doNotTrack?: string }) | undefined;

  if (!nav) return null;

  // Check navigator.doNotTrack (standard)
  if (nav.doNotTrack !== undefined && nav.doNotTrack !== null) {
    return nav.doNotTrack;
  }

  // Check window.doNotTrack (legacy IE)
  if (win?.doNotTrack !== undefined) {
    return win.doNotTrack;
  }

  return null;
};

/**
 * Check if PDF viewer is enabled in the browser
 * Returns true if enabled, false if disabled, null if not supported
 */
export const getPdfViewerEnabled = (): boolean | null => {
  const nav = getNavigator();

  if (!nav) return null;

  // pdfViewerEnabled is a standard API
  // Return directly as it's always present in modern Navigator
  return nav.pdfViewerEnabled;
};
