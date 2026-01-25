/**
 * Canvas Fingerprinting Module
 * Generates unique fingerprint based on canvas rendering differences
 */

import { hashMD5 } from '../utils/md5';
import { isBrowser } from '../utils/environment';
import { withTimeout } from '../utils/fingerprint';

/**
 * Canvas fingerprint options
 */
interface CanvasFingerprintOptions {
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * Create an offscreen canvas element
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Canvas element or null if unavailable
 */
const createOffscreenCanvas = (width: number, height: number): HTMLCanvasElement | null => {
  if (!isBrowser()) return null;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'none';
    return canvas;
  } catch {
    return null;
  }
};

/**
 * Render text with multiple fonts for fingerprinting
 * @param ctx - Canvas 2D context
 */
const renderText = (ctx: CanvasRenderingContext2D): void => {
  const fonts = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'];
  const testText = 'Cwm fjordbank glyphs vext quiz, 😃🎨';

  ctx.textBaseline = 'top';

  fonts.forEach((font, index) => {
    ctx.font = `14px ${font}`;
    ctx.fillStyle = `hsl(${index * 72}, 70%, 50%)`;
    ctx.fillText(testText, 2, 2 + index * 18);
  });
};

/**
 * Render geometric shapes for fingerprinting
 * @param ctx - Canvas 2D context
 * @param width - Canvas width
 * @param height - Canvas height
 */
const renderShapes = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  // Gradient rectangle
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
  gradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 255, 0.5)');
  ctx.fillStyle = gradient;
  ctx.fillRect(10, 100, 80, 50);

  // Arc
  ctx.beginPath();
  ctx.arc(150, 125, 30, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 165, 0, 0.7)';
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Bezier curve
  ctx.beginPath();
  ctx.moveTo(200, 100);
  ctx.bezierCurveTo(220, 80, 260, 160, 280, 120);
  ctx.strokeStyle = 'rgba(128, 0, 128, 0.8)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Triangle with shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.beginPath();
  ctx.moveTo(310, 150);
  ctx.lineTo(340, 100);
  ctx.lineTo(370, 150);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 128, 128, 0.8)';
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

/**
 * Render emoji for additional uniqueness
 * @param ctx - Canvas 2D context
 */
const renderEmoji = (ctx: CanvasRenderingContext2D): void => {
  ctx.font = '30px Arial';
  ctx.fillText('🔥💧🌿⚡🎭', 10, 180);
};

/**
 * Check if canvas is blocked or returns noise
 * @param canvas - Canvas element
 * @returns Whether canvas fingerprinting is blocked
 */
const isCanvasBlocked = (canvas: HTMLCanvasElement): boolean => {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;

    // Draw a simple pattern
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 1, 1);

    const imageData = ctx.getImageData(0, 0, 1, 1);
    const pixel = imageData.data;

    // Check if pixel matches expected value
    // Canvas blockers often return random or zero values
    return pixel[0] !== 255 || pixel[1] !== 0 || pixel[2] !== 0;
  } catch {
    return true;
  }
};

/**
 * Generate canvas fingerprint
 * @param options - Fingerprint options
 * @returns Promise resolving to fingerprint hash or null
 */
export const getCanvasFingerprint = async (
  options?: CanvasFingerprintOptions
): Promise<string | null> => {
  const timeout = options?.timeout ?? 1000;

  const generateFingerprint = async (): Promise<string | null> => {
    if (!isBrowser()) return null;

    try {
      const width = 400;
      const height = 200;

      const canvas = createOffscreenCanvas(width, height);
      if (!canvas) return null;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Check if canvas is blocked
      if (isCanvasBlocked(canvas)) {
        return null;
      }

      // Clear and set background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, width, height);

      // Render various elements
      renderText(ctx);
      renderShapes(ctx, width, height);
      renderEmoji(ctx);

      // Extract data
      const dataUrl = canvas.toDataURL('image/png');

      // Hash the data URL
      return hashMD5(dataUrl);
    } catch {
      return null;
    }
  };

  return withTimeout(generateFingerprint(), timeout, null);
};

/**
 * Check if Canvas 2D is supported
 * @returns Whether Canvas 2D is available
 */
export const isCanvasSupported = (): boolean => {
  if (!isBrowser()) return false;

  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  } catch {
    return false;
  }
};
