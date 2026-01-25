/**
 * WebGL Fingerprinting Module
 * Generates unique fingerprint based on WebGL parameters and GPU info
 */

import { hashMD5 } from '../utils/md5';
import { isBrowser } from '../utils/environment';
import { withTimeout } from '../utils/fingerprint';

/**
 * WebGL fingerprint options
 */
interface WebGLFingerprintOptions {
  /** Timeout in milliseconds */
  timeout?: number;
}

/**
 * WebGL debug renderer info extension interface
 */
interface WEBGL_debug_renderer_info {
  UNMASKED_VENDOR_WEBGL: number;
  UNMASKED_RENDERER_WEBGL: number;
}

/**
 * WebGL parameters to collect for fingerprinting
 */
const WEBGL_PARAMS = [
  'MAX_TEXTURE_SIZE',
  'MAX_VERTEX_UNIFORM_VECTORS',
  'MAX_FRAGMENT_UNIFORM_VECTORS',
  'MAX_VARYING_VECTORS',
  'MAX_VERTEX_ATTRIBS',
  'MAX_RENDERBUFFER_SIZE',
  'MAX_CUBE_MAP_TEXTURE_SIZE',
  'MAX_TEXTURE_IMAGE_UNITS',
  'MAX_VERTEX_TEXTURE_IMAGE_UNITS',
  'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
] as const;

/**
 * WebGL range parameters (return [min, max])
 */
const WEBGL_RANGE_PARAMS = ['ALIASED_LINE_WIDTH_RANGE', 'ALIASED_POINT_SIZE_RANGE'] as const;

/**
 * Create WebGL context with fallbacks
 * @param canvas - Canvas element
 * @returns WebGL context or null
 */
const createWebGLContext = (
  canvas: HTMLCanvasElement
): WebGLRenderingContext | WebGL2RenderingContext | null => {
  const contextOptions = {
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: false,
  };

  try {
    // Try WebGL2 first
    const gl2 = canvas.getContext('webgl2', contextOptions) as WebGL2RenderingContext | null;
    if (gl2) return gl2;
  } catch {
    // WebGL2 not available
  }

  try {
    // Try WebGL
    const gl = canvas.getContext('webgl', contextOptions) as WebGLRenderingContext | null;
    if (gl) return gl;
  } catch {
    // WebGL not available
  }

  try {
    // Try experimental WebGL (older browsers)
    const glExp = canvas.getContext(
      'experimental-webgl',
      contextOptions
    ) as WebGLRenderingContext | null;
    if (glExp) return glExp;
  } catch {
    // Experimental WebGL not available
  }

  return null;
};

/**
 * Get GPU vendor and renderer info
 * @param gl - WebGL context
 * @returns Object with vendor and renderer or null
 */
const getGPUInfo = (
  gl: WebGLRenderingContext | WebGL2RenderingContext
): { vendor: string; renderer: string } | null => {
  try {
    const debugInfo = gl.getExtension(
      'WEBGL_debug_renderer_info'
    ) as WEBGL_debug_renderer_info | null;
    if (!debugInfo) return null;

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string;
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;

    return { vendor, renderer };
  } catch {
    return null;
  }
};

/**
 * Collect WebGL parameters
 * @param gl - WebGL context
 * @returns Array of parameter values
 */
const collectParameters = (gl: WebGLRenderingContext | WebGL2RenderingContext): string[] => {
  const params: string[] = [];

  // Collect scalar parameters
  for (const param of WEBGL_PARAMS) {
    try {
      const glParam = gl[param as keyof WebGLRenderingContext] as number | undefined;
      if (glParam !== undefined) {
        const value = gl.getParameter(glParam);
        params.push(`${param}:${value}`);
      }
    } catch {
      // Parameter not available
    }
  }

  // Collect range parameters
  for (const param of WEBGL_RANGE_PARAMS) {
    try {
      const glParam = gl[param as keyof WebGLRenderingContext] as number | undefined;
      if (glParam !== undefined) {
        const range = gl.getParameter(glParam) as Float32Array | null;
        if (range) {
          params.push(`${param}:${range[0]}-${range[1]}`);
        }
      }
    } catch {
      // Parameter not available
    }
  }

  return params;
};

/**
 * Get supported WebGL extensions
 * @param gl - WebGL context
 * @returns Sorted list of extension names
 */
const getExtensions = (gl: WebGLRenderingContext | WebGL2RenderingContext): string[] => {
  try {
    const extensions = gl.getSupportedExtensions();
    return extensions ? extensions.sort() : [];
  } catch {
    return [];
  }
};

/**
 * Get WebGL2 specific parameters
 * @param gl - WebGL2 context
 * @returns Array of WebGL2-specific parameter values
 */
const collectWebGL2Parameters = (gl: WebGL2RenderingContext): string[] => {
  const params: string[] = [];

  const webgl2Params = [
    'MAX_3D_TEXTURE_SIZE',
    'MAX_ARRAY_TEXTURE_LAYERS',
    'MAX_DRAW_BUFFERS',
    'MAX_SAMPLES',
    'MAX_UNIFORM_BUFFER_BINDINGS',
  ];

  for (const param of webgl2Params) {
    try {
      const glParam = gl[param as keyof WebGL2RenderingContext] as number | undefined;
      if (glParam !== undefined) {
        const value = gl.getParameter(glParam);
        params.push(`${param}:${value}`);
      }
    } catch {
      // Parameter not available
    }
  }

  return params;
};

/**
 * Generate WebGL fingerprint
 * @param options - Fingerprint options
 * @returns Promise resolving to fingerprint hash or null
 */
export const getWebGLFingerprint = async (
  options?: WebGLFingerprintOptions
): Promise<string | null> => {
  const timeout = options?.timeout ?? 1000;

  const generateFingerprint = async (): Promise<string | null> => {
    if (!isBrowser()) return null;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;

      const gl = createWebGLContext(canvas);
      if (!gl) return null;

      const parts: string[] = [];

      // Get GPU info
      const gpuInfo = getGPUInfo(gl);
      if (gpuInfo) {
        parts.push(`vendor:${gpuInfo.vendor}`);
        parts.push(`renderer:${gpuInfo.renderer}`);
      }

      // Collect parameters
      const params = collectParameters(gl);
      parts.push(...params);

      // Collect WebGL2-specific parameters if available
      if ('MAX_3D_TEXTURE_SIZE' in gl) {
        const webgl2Params = collectWebGL2Parameters(gl as WebGL2RenderingContext);
        parts.push(...webgl2Params);
        parts.push('webgl2:true');
      } else {
        parts.push('webgl2:false');
      }

      // Get extensions (shortened to avoid excessive data)
      const extensions = getExtensions(gl);
      parts.push(`extensions:${extensions.length}`);
      parts.push(`ext_hash:${hashMD5(extensions.join(','))}`);

      // Clean up
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) {
        loseContext.loseContext();
      }

      // Return hash of all collected data
      return hashMD5(parts.join('|'));
    } catch {
      return null;
    }
  };

  return withTimeout(generateFingerprint(), timeout, null);
};

/**
 * Check if WebGL is supported
 * @returns Whether WebGL is available
 */
export const isWebGLSupported = (): boolean => {
  if (!isBrowser()) return false;

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
};

/**
 * Check if WebGL debug info extension is available
 * @returns Whether WEBGL_debug_renderer_info is accessible
 */
export const isDebugInfoSupported = (): boolean => {
  if (!isBrowser()) return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return false;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return debugInfo !== null;
  } catch {
    return false;
  }
};
