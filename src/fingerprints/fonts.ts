/**
 * Font Detection Fingerprinting Module
 * Generates unique fingerprint based on installed fonts
 */

import { hashMD5 } from '../utils/md5';
import { isBrowser } from '../utils/environment';
import { withTimeout } from '../utils/fingerprint';

/**
 * Font fingerprint options
 */
interface FontFingerprintOptions {
  /** Timeout in milliseconds */
  timeout?: number;
  /** Custom list of fonts to check (overrides default) */
  fonts?: string[];
}

/**
 * Default list of fonts to check (cross-platform, most distinguishing)
 * Limited to 30 fonts for performance
 */
const DEFAULT_FONTS: readonly string[] = [
  // Windows fonts
  'Arial',
  'Arial Black',
  'Calibri',
  'Cambria',
  'Comic Sans MS',
  'Consolas',
  'Courier New',
  'Georgia',
  'Impact',
  'Lucida Console',
  'Segoe UI',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
  // Mac fonts
  'Helvetica',
  'Helvetica Neue',
  'Monaco',
  'Menlo',
  'SF Pro',
  // Linux fonts
  'Ubuntu',
  'DejaVu Sans',
  'Liberation Sans',
  'Noto Sans',
  // Common fonts
  'Roboto',
  'Open Sans',
  'Lato',
  'Source Code Pro',
  'Fira Code',
  'Inconsolata',
] as const;

/**
 * Fallback fonts for measurement comparison
 */
const FALLBACK_FONTS = ['monospace', 'sans-serif', 'serif'] as const;

/**
 * Test string with characters that vary significantly between fonts
 */
const TEST_STRING = 'mmmmmmmmmmlli';

/**
 * Font size for testing
 */
const TEST_SIZE = '72px';

/**
 * Font measurement result
 */
interface FontMeasurement {
  width: number;
  height: number;
}

/**
 * Create a hidden span element for font measurement
 * @returns Span element or null
 */
const createMeasurementSpan = (): HTMLSpanElement | null => {
  if (!isBrowser()) return null;

  try {
    const span = document.createElement('span');
    span.style.position = 'absolute';
    span.style.left = '-9999px';
    span.style.top = '-9999px';
    span.style.fontSize = TEST_SIZE;
    span.style.fontStyle = 'normal';
    span.style.fontWeight = 'normal';
    span.style.letterSpacing = 'normal';
    span.style.lineHeight = 'normal';
    span.style.textTransform = 'none';
    span.style.textAlign = 'left';
    span.style.textDecoration = 'none';
    span.style.whiteSpace = 'nowrap';
    span.textContent = TEST_STRING;

    return span;
  } catch {
    return null;
  }
};

/**
 * Measure font dimensions
 * @param span - Measurement span
 * @param font - Font family name
 * @param fallback - Fallback font
 * @returns Font measurements
 */
const measureFont = (span: HTMLSpanElement, font: string, fallback: string): FontMeasurement => {
  span.style.fontFamily = `'${font}', ${fallback}`;
  return {
    width: span.offsetWidth,
    height: span.offsetHeight,
  };
};

/**
 * Check if a font is available by comparing with fallback
 * @param span - Measurement span
 * @param font - Font to check
 * @param baselines - Baseline measurements for fallback fonts
 * @returns Whether font is available
 */
const isFontAvailable = (
  span: HTMLSpanElement,
  font: string,
  baselines: Map<string, FontMeasurement>
): boolean => {
  for (const fallback of FALLBACK_FONTS) {
    const baseline = baselines.get(fallback);
    if (!baseline) continue;

    const measurement = measureFont(span, font, fallback);

    // If dimensions differ from baseline, font is available
    if (measurement.width !== baseline.width || measurement.height !== baseline.height) {
      return true;
    }
  }

  return false;
};

/**
 * Detect installed fonts using DOM-based measurement
 * @param fonts - List of fonts to check
 * @returns Array of detected font names
 */
const detectFontsDOM = (fonts: readonly string[]): string[] => {
  if (!isBrowser()) return [];

  const span = createMeasurementSpan();
  if (!span) return [];

  const detected: string[] = [];

  try {
    // Append to body for accurate measurement
    document.body.appendChild(span);

    // Measure baselines
    const baselines = new Map<string, FontMeasurement>();
    for (const fallback of FALLBACK_FONTS) {
      span.style.fontFamily = fallback;
      baselines.set(fallback, {
        width: span.offsetWidth,
        height: span.offsetHeight,
      });
    }

    // Check each font
    for (const font of fonts) {
      if (isFontAvailable(span, font, baselines)) {
        detected.push(font);
      }
    }
  } finally {
    // Clean up
    if (span.parentNode) {
      span.parentNode.removeChild(span);
    }
  }

  return detected;
};

/**
 * Detect fonts using Canvas (alternative method)
 * @param fonts - List of fonts to check
 * @returns Array of detected font names
 */
const detectFontsCanvas = (fonts: readonly string[]): string[] => {
  if (!isBrowser()) return [];

  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    canvas.width = 500;
    canvas.height = 100;

    const detected: string[] = [];
    const baselines = new Map<string, number>();

    // Measure baselines
    for (const fallback of FALLBACK_FONTS) {
      ctx.font = `${TEST_SIZE} ${fallback}`;
      baselines.set(fallback, ctx.measureText(TEST_STRING).width);
    }

    // Check each font
    for (const font of fonts) {
      for (const fallback of FALLBACK_FONTS) {
        const baseline = baselines.get(fallback);
        if (baseline === undefined) continue;

        ctx.font = `${TEST_SIZE} '${font}', ${fallback}`;
        const width = ctx.measureText(TEST_STRING).width;

        if (width !== baseline) {
          detected.push(font);
          break;
        }
      }
    }

    return detected;
  } catch {
    return [];
  }
};

/**
 * Generate font fingerprint
 * @param options - Fingerprint options
 * @returns Promise resolving to fingerprint hash or null
 */
export const getFontFingerprint = async (
  options?: FontFingerprintOptions
): Promise<string | null> => {
  const timeout = options?.timeout ?? 2000;
  const fonts = options?.fonts ?? DEFAULT_FONTS;

  const generateFingerprint = async (): Promise<string | null> => {
    if (!isBrowser()) return null;

    try {
      // Try DOM-based detection first (more accurate)
      let detected = detectFontsDOM(fonts);

      // Fall back to Canvas if DOM detection fails
      if (detected.length === 0) {
        detected = detectFontsCanvas(fonts);
      }

      if (detected.length === 0) return null;

      // Sort for consistency
      detected.sort();

      return hashMD5(detected.join(','));
    } catch {
      return null;
    }
  };

  return withTimeout(generateFingerprint(), timeout, null);
};

/**
 * Get list of detected fonts (for debugging/info)
 * @param fonts - List of fonts to check
 * @returns Array of detected font names
 */
export const getDetectedFonts = (fonts?: string[]): string[] => {
  const fontList = fonts ?? [...DEFAULT_FONTS];
  return detectFontsDOM(fontList);
};

/**
 * Get default font list
 * @returns Default font list
 */
export const getDefaultFontList = (): string[] => {
  return [...DEFAULT_FONTS];
};

/**
 * Check if font detection is supported
 * @returns Whether font detection is available
 */
export const isFontDetectionSupported = (): boolean => {
  return isBrowser() && typeof document !== 'undefined' && !!document.createElement;
};

/**
 * Font detection cache options
 */
interface FontCacheOptions {
  /** Cache key in session storage */
  cacheKey?: string;
  /** Whether to use cached results */
  useCache?: boolean;
  /** Chunk size for async processing */
  chunkSize?: number;
  /** Delay between chunks in ms */
  chunkDelay?: number;
  /** Timeout for font detection in ms */
  timeout?: number;
}

/**
 * Cache key for font detection results
 */
const DEFAULT_CACHE_KEY = 'device-uuid-fonts';

/**
 * Get cached font detection results from session storage
 * @param cacheKey - Cache key to use
 * @returns Cached font list or null
 */
const getCachedFonts = (cacheKey: string): string[] | null => {
  if (!isBrowser()) return null;

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Session storage not available or corrupted data
  }
  return null;
};

/**
 * Cache font detection results in session storage
 * @param cacheKey - Cache key to use
 * @param fonts - Font list to cache
 */
const setCachedFonts = (cacheKey: string, fonts: string[]): void => {
  if (!isBrowser()) return;

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(fonts));
  } catch {
    // Session storage not available or quota exceeded
  }
};

/**
 * Detect fonts using async/chunked processing to avoid blocking main thread
 * @param fonts - List of fonts to check
 * @param options - Chunking options
 * @returns Promise resolving to array of detected font names
 */
export const getDetectedFontsAsync = async (
  fonts?: readonly string[] | string[],
  options?: FontCacheOptions
): Promise<string[]> => {
  const fontList = fonts ?? [...DEFAULT_FONTS];
  const chunkSize = options?.chunkSize ?? 10;
  const chunkDelay = options?.chunkDelay ?? 0;
  const cacheKey = options?.cacheKey ?? DEFAULT_CACHE_KEY;
  const useCache = options?.useCache ?? true;

  // Check cache first
  if (useCache) {
    const cached = getCachedFonts(cacheKey);
    if (cached !== null) {
      return cached;
    }
  }

  if (!isBrowser()) return [];

  const span = createMeasurementSpan();
  if (!span) return [];

  const detected: string[] = [];

  try {
    // Append to body for accurate measurement
    document.body.appendChild(span);

    // Measure baselines
    const baselines = new Map<string, FontMeasurement>();
    for (const fallback of FALLBACK_FONTS) {
      span.style.fontFamily = fallback;
      baselines.set(fallback, {
        width: span.offsetWidth,
        height: span.offsetHeight,
      });
    }

    // Process fonts in chunks
    for (let i = 0; i < fontList.length; i += chunkSize) {
      const chunk = fontList.slice(i, i + chunkSize);

      // Process chunk
      for (const font of chunk) {
        if (isFontAvailable(span, font, baselines)) {
          detected.push(font);
        }
      }

      // Yield to main thread between chunks
      if (i + chunkSize < fontList.length && chunkDelay > 0) {
        await new Promise((resolve) => setTimeout(resolve, chunkDelay));
      } else if (i + chunkSize < fontList.length) {
        // At least yield via microtask
        await Promise.resolve();
      }
    }

    // Cache results
    if (useCache) {
      setCachedFonts(cacheKey, detected);
    }
  } finally {
    // Clean up
    if (span.parentNode) {
      span.parentNode.removeChild(span);
    }
  }

  return detected;
};

/**
 * Generate font fingerprint with async/chunked processing
 * @param options - Fingerprint options including caching
 * @returns Promise resolving to fingerprint hash or null
 */
export const getFontFingerprintAsync = async (
  options?: FontFingerprintOptions & FontCacheOptions
): Promise<string | null> => {
  const timeout = options?.timeout ?? 3000;
  const fonts = options?.fonts ?? DEFAULT_FONTS;

  const generateFingerprint = async (): Promise<string | null> => {
    if (!isBrowser()) return null;

    try {
      // Use async/chunked detection for large font lists
      const detected = await getDetectedFontsAsync(fonts, {
        cacheKey: options?.cacheKey,
        useCache: options?.useCache,
        chunkSize: options?.chunkSize ?? 10,
        chunkDelay: options?.chunkDelay ?? 0,
      });

      if (detected.length === 0) return null;

      // Sort for consistency
      detected.sort();

      return hashMD5(detected.join(','));
    } catch {
      return null;
    }
  };

  return withTimeout(generateFingerprint(), timeout, null);
};
