/**
 * Configuration options for DeviceUUID
 */
export interface DeviceUUIDOptions {
  version?: boolean;
  language?: boolean;
  platform?: boolean;
  os?: boolean;
  pixelDepth?: boolean;
  colorDepth?: boolean;
  resolution?: boolean;
  isAuthoritative?: boolean;
  silkAccelerated?: boolean;
  isKindleFire?: boolean;
  isDesktop?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
  isWindows?: boolean;
  isLinux?: boolean;
  isLinux64?: boolean;
  isChromeOS?: boolean;
  isMac?: boolean;
  isiPad?: boolean;
  isiPhone?: boolean;
  isiPod?: boolean;
  isAndroid?: boolean;
  isSamsung?: boolean;
  isSmartTV?: boolean;
  isRaspberry?: boolean;
  isBlackberry?: boolean;
  isTouchScreen?: boolean;
  isOpera?: boolean;
  isIE?: boolean;
  isEdge?: boolean;
  isIECompatibilityMode?: boolean;
  isSafari?: boolean;
  isFirefox?: boolean;
  isWebkit?: boolean;
  isChrome?: boolean;
  isKonqueror?: boolean;
  isOmniWeb?: boolean;
  isSeaMonkey?: boolean;
  isFlock?: boolean;
  isAmaya?: boolean;
  isPhantomJS?: boolean;
  isEpiphany?: boolean;
  source?: boolean;
  cpuCores?: boolean;
}

/**
 * Device and browser information
 */
export interface AgentInfo {
  // Device type flags
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  isBot: boolean | string;
  isSmartTV: boolean | string;
  isTouchScreen: boolean;

  // Platform flags
  isiPad: boolean;
  isiPod: boolean;
  isiPhone: boolean;
  isAndroid: boolean;
  isBlackberry: boolean;
  isSamsung: boolean;
  isRaspberry: boolean;
  isAndroidTablet: boolean;
  isWindowsPhone?: boolean;

  // Browser flags
  isOpera: boolean;
  isIE: boolean;
  isEdge: boolean;
  isIECompatibilityMode: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isWebkit: boolean;
  isChrome: boolean;
  isKonqueror: boolean;
  isOmniWeb: boolean;
  isSeaMonkey: boolean;
  isFlock: boolean;
  isAmaya: boolean;
  isPhantomJS: boolean;
  isEpiphany: boolean;
  isWinJs: boolean;
  isUC: boolean;

  // OS flags
  isWindows: boolean;
  isLinux: boolean;
  isLinux64: boolean;
  isMac: boolean;
  isChromeOS: boolean;
  isBada: boolean;

  // Amazon device flags
  isKindleFire: boolean;
  isSilk: boolean;
  silkAccelerated: boolean;

  // Other flags
  isCaptive: boolean;
  isCurl: boolean;
  isAuthoritative: boolean;

  // Device properties
  colorDepth: number;
  pixelDepth: number;
  resolution: [number, number];
  cpuCores: number;
  language: string;

  // Identification
  browser: string;
  version: string;
  os: string;
  platform: string;

  // GeoIP data
  geoIp: Record<string, unknown>;

  // User agent string
  source: string;

  // Hash functions
  hashInt: (str: string) => number;
  hashMD5: (str: string) => string;
}

/**
 * Regex patterns for browser detection
 */
export interface BrowserPatterns {
  [key: string]: RegExp;
}

/**
 * Regex patterns for version detection
 */
export interface VersionPatterns {
  [key: string]: RegExp;
}

/**
 * Regex patterns for OS detection
 */
export interface OSPatterns {
  [key: string]: RegExp;
}

/**
 * Regex patterns for platform detection
 */
export interface PlatformPatterns {
  [key: string]: RegExp;
}
