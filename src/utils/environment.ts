/**
 * Environment detection and safe global access utilities
 * Provides compatibility for both browser and Node.js environments
 */

/**
 * Extended Navigator interface for legacy browser properties
 */
interface ExtendedNavigator extends Navigator {
  userLanguage?: string;
  browserLanguage?: string;
  systemLanguage?: string;
  msMaxTouchPoints?: number;
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
