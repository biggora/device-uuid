/**
 * Browser Compatibility Documentation
 *
 * This file documents known limitations and compatibility issues across different browsers
 * for the device-uuid fingerprinting library.
 *
 * @module browser-compatibility
 */

/**
 * Known browser limitations for fingerprinting features
 */
export const BROWSER_LIMITATIONS = {
  /** Safari limitations */
  safari: {
    canvas: {
      /**
       * Safari returns consistent canvas but may resist fingerprinting in Private Browsing mode
       * Canvas blocker extensions may return empty/pixelated results
       */
      privateBrowsing: 'May return blank canvas or limited pixel data',
      trackers: 'Canvas blocker extensions affect results',
    },
    webgl: {
      /**
       * Safari supports WebGL but may block in Private Browsing
       * WEBGL_debug_renderer_info extension may not be available
       */
      privateBrowsing: 'WebGL may be disabled in Private Browsing',
      debugInfo: 'WEBGL_debug_renderer_info extension not available',
    },
    audio: {
      /**
       * Safari requires user interaction to start AudioContext
       * Must be triggered by user gesture (click, tap, etc.)
       */
      autoplayPolicy: 'AudioContext requires user gesture to start',
    },
    fonts: {
      /**
       * Safari has limited font detection due to privacy protections
       * Some system fonts may not be detectable
       */
      privacyProtection: 'Some system fonts may not be detectable',
    },
  },

  /** Firefox limitations */
  firefox: {
    canvas: {
      /**
       * Firefox has privacy.resistFingerprinting preference in about:config
       * When enabled, returns canvas with noise/applied
       */
      privacyMode: 'privacy.resistFingerprinting adds noise to canvas',
    },
    webgl: {
      /**
       * Firefox may block WebGL in certain configurations
       * Tor browser completely disables WebGL
       */
      torBrowser: 'WebGL completely disabled in Tor',
      privateBrowsing: 'May limit WebGL capabilities',
    },
    audio: {
      /**
       * Firefox may block audio in Private Browsing
       * AudioContext may require explicit start()
       */
      privateBrowsing: 'AudioContext may be blocked',
    },
  },

  /** Chrome/Chromium limitations */
  chrome: {
    canvas: {
      /**
       * Chrome may add noise to canvas in Incognito mode
       * Chrome's tracking protection affects results
       */
      incognito: 'May add noise to canvas in Incognito mode',
      trackingProtection: 'Chrome Safe Browsing affects results',
    },
    webgl: {
      /**
       * Chrome supports most WebGL features
       * Some hardware acceleration settings may affect results
       */
      hardwareAcceleration: 'Results vary based on hardware acceleration',
    },
    audio: {
      /**
       * Chrome has autoplay policy - requires user interaction
       */
      autoplayPolicy: 'AudioContext requires user gesture to start',
    },
  },

  /** Brave Browser limitations */
  brave: {
    canvas: {
      /**
       * Brave Shields may block or modify canvas fingerprinting
       * Shields -> Fingerprinting protection affects results
       */
      shields: 'Brave Shields may block canvas fingerprinting',
    },
    webgl: {
      /**
       * Brave may inject noise into WebGL fingerprinting
       * Shields -> Fingerprinting protection affects results
       */
    },
    audio: {
      /**
       * Brave may block audio fingerprinting for privacy
       */
    },
  },

  /** Tor Browser limitations */
  tor: {
    canvas: {
      /**
       * Tor Browser attempts to normalize canvas across users
       * Returns fake canvas data to prevent fingerprinting
       */
      alwaysBlocked: 'Canvas always returns fake/normalized data',
    },
    webgl: {
      /**
       * Tor Browser completely disables WebGL
       * No WebGL context available
       */
      alwaysBlocked: 'WebGL completely disabled',
    },
    audio: {
      /**
       * Tor Browser may block AudioContext
       */
      oftenBlocked: 'AudioContext often unavailable',
    },
    fonts: {
      /**
       * Tor Browser may limit font detection
       */
      limitedDetection: 'Font detection may be limited',
    },
  },

  /** Edge (Chromium-based) limitations */
  edge: {
    canvas: {
      /**
       * Edge (Chromium-based) similar to Chrome
       * Tracking protection may affect results
       */
      trackingProtection: 'Microsoft Defender Tracking Protection affects results',
    },
    webgl: {
      /**
       * Edge requires hardware acceleration for WebGL
       */
      hardwareAcceleration: 'Requires hardware acceleration enabled',
    },
    audio: {
      /**
       * Edge has similar autoplay policy as Chrome
       */
      autoplayPolicy: 'AudioContext requires user gesture to start',
    },
  },
} as const;

/**
 * Feature support matrix by browser
 */
export const BROWSER_FEATURE_SUPPORT = {
  safari: {
    canvas: 'partial',
    webgl: 'partial',
    audio: 'partial',
    fonts: 'full',
    mediaDevices: 'full',
    networkInfo: 'full',
    timezone: 'full',
    incognitoDetection: 'limited',
  },
  firefox: {
    canvas: 'partial',
    webgl: 'partial',
    audio: 'partial',
    fonts: 'full',
    mediaDevices: 'full',
    networkInfo: 'full',
    timezone: 'full',
    incognitoDetection: 'limited',
  },
  chrome: {
    canvas: 'full',
    webgl: 'full',
    audio: 'partial',
    fonts: 'full',
    mediaDevices: 'full',
    networkInfo: 'full',
    timezone: 'full',
    incognitoDetection: 'limited',
  },
  edge: {
    canvas: 'full',
    webgl: 'full',
    audio: 'partial',
    fonts: 'full',
    mediaDevices: 'full',
    networkInfo: 'full',
    timezone: 'full',
    incognitoDetection: 'limited',
  },
  brave: {
    canvas: 'limited',
    webgl: 'limited',
    audio: 'limited',
    fonts: 'full',
    mediaDevices: 'full',
    networkInfo: 'full',
    timezone: 'full',
    incognitoDetection: 'limited',
  },
  tor: {
    canvas: 'blocked',
    webgl: 'blocked',
    audio: 'blocked',
    fonts: 'limited',
    mediaDevices: 'limited',
    networkInfo: 'limited',
    timezone: 'full',
    incognitoDetection: 'blocked',
  },
} as const;

/**
 * Workarounds for known browser limitations
 */
export const BROWSER_WORKAROUNDS = {
  /**
   * Safari: Use OfflineAudioContext with user interaction
   * Chrome: Request user interaction for AudioContext
   * Firefox: Check privacy.resistFingerprinting and handle gracefully
   * Brave: Warn users that Shields may affect results
   * Tor: Gracefully degrade to basic fingerprint only
   */
  detectPrivacyMode: (): string[] => {
    // Attempt to detect if browser is in privacy/private mode
    const indicators: string[] = [];

    // Check for reduced storage quota
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      navigator.storage.estimate().then((estimate) => {
        if (estimate.quota && estimate.quota < 120000000) {
          indicators.push('low-storage-quota');
        }
      });
    }

    return indicators;
  },

  /**
   * Check if canvas is blocked or returns fake data
   */
  detectCanvasBlocked: () => {
    if (typeof document === 'undefined') return false;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return true;

      // Draw a known pattern
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.fillRect(0, 0, 1, 1);

      const imageData = ctx.getImageData(0, 0, 1, 1);
      const pixel = imageData.data;

      // Check if pixel matches expected (255, 0, 0)
      return pixel[0] !== 255 || pixel[1] !== 0 || pixel[2] !== 0;
    } catch {
      return true;
    }
  },
};

/**
 * Get browser compatibility information for a feature
 * @param feature - The fingerprint feature to check
 * @returns Compatibility information object
 */
export const getCompatibilityInfo = (
  feature: FingerprintFeature
): {
  feature: FingerprintFeature;
  supportLevel: 'full' | 'partial' | 'limited' | 'blocked';
  limitations: string[];
  workarounds: string[];
} => {
  const limitations: string[] = [];
  const workarounds: string[] = [];
  let supportLevel: 'full' | 'partial' | 'limited' | 'blocked' = 'full';

  switch (feature) {
    case 'canvas':
      // Canvas is widely supported but has privacy mode limitations
      limitations.push('Private browsing may return blank/modified canvas');
      limitations.push('Canvas blocker extensions may affect results');
      limitations.push('Firefox privacy.resistFingerprinting adds noise');
      workarounds.push('Use multiple fingerprinting methods for redundancy');
      break;

    case 'webgl':
      // WebGL may be disabled in private browsing or by user settings
      limitations.push('Private browsing may disable WebGL');
      limitations.push('Hardware acceleration may be required');
      limitations.push('Tor browser completely blocks WebGL');
      workarounds.push('Fall back to canvas fingerprinting');
      workarounds.push('Use 2D canvas as alternative');
      break;

    case 'audio':
      // AudioContext requires user interaction in modern browsers
      limitations.push('Autoplay policy requires user gesture');
      limitations.push('May be blocked in private browsing');
      limitations.push('iOS Safari has strict audio limitations');
      workarounds.push('Request user interaction first');
      workarounds.push('Use OfflineAudioContext for deterministic results');
      break;

    case 'fonts':
      // Font detection is generally reliable
      limitations.push('May be limited by privacy protections');
      limitations.push('Custom font installation may not be detected');
      workarounds.push('Use both DOM and canvas-based detection');
      break;

    case 'mediaDevices':
      // Media devices require permissions
      limitations.push('Requires user permission');
      limitations.push('Labels not available without permission');
      workarounds.push('Use device counts instead of labels');
      break;

    case 'networkInfo':
      // Network Information API has limited support
      limitations.push('Not supported in all browsers');
      limitations.push('May return default values');
      workarounds.push('Handle gracefully with defaults');
      break;

    case 'timezone':
      // Timezone detection is widely supported
      limitations.push('User may have custom timezone settings');
      supportLevel = 'full';
      break;

    case 'incognitoDetection':
      // Incognito detection is probabilistic
      limitations.push('Not 100% reliable');
      limitations.push('Users can workaround detection');
      supportLevel = 'limited';
      break;
  }

  return { feature, supportLevel, limitations, workarounds };
};

/**
 * FingerprintFeature type - imported from types
 */
type FingerprintFeature =
  | 'canvas'
  | 'webgl'
  | 'audio'
  | 'fonts'
  | 'mediaDevices'
  | 'networkInfo'
  | 'timezone'
  | 'incognitoDetection';
