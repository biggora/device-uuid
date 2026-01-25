/**
 * DeviceUUID - Fast browser device UUID generation
 * Analyzes user agent and device characteristics to generate unique identifiers
 */

import type {
  DeviceUUIDOptions,
  AgentInfo,
  FingerprintOptions,
  FingerprintDetails,
  FingerprintFeature,
  FingerprintPreset,
} from '../types';
import {
  DEFAULT_OPTIONS,
  DEFAULT_AGENT,
  VERSION_PATTERNS,
  BROWSER_PATTERNS,
  OS_PATTERNS,
  PLATFORM_PATTERNS,
  IS_BOT_REGEXP,
} from '../constants';
import { hashMD5, hashInt } from '../utils/md5';
import {
  getUserAgent,
  getLanguage,
  getColorDepth,
  getPixelDepth,
  getScreenResolution,
  getCPUCores,
  isTouchScreen as checkTouchScreen,
  getNavigator,
  isBrowser,
} from '../utils/environment';
import {
  mergeOptions,
  getPresetOptions,
  isFeatureSupported,
  withTimeout,
  combineHashes,
  calculateConfidence,
  getTimestamp,
  measureAsync,
} from '../utils/fingerprint';
import {
  getCanvasFingerprint,
  getWebGLFingerprint,
  getAudioFingerprint,
  getFontFingerprint,
} from '../fingerprints';

/**
 * DeviceUUID Class
 * Main class for device detection and UUID generation
 */
export class DeviceUUID {
  private readonly options: DeviceUUIDOptions;
  private readonly versionPatterns = VERSION_PATTERNS;
  private readonly browserPatterns = BROWSER_PATTERNS;
  private readonly osPatterns = OS_PATTERNS;
  private readonly platformPatterns = PLATFORM_PATTERNS;
  private agent: AgentInfo;

  /**
   * Get or set the user agent string
   */
  public get userAgent(): string {
    return this.agent.source;
  }
  public set userAgent(value: string) {
    this.agent.source = value;
  }

  /**
   * Create a new DeviceUUID instance
   * @param options - Configuration options
   */
  constructor(options: Partial<DeviceUUIDOptions> = {}) {
    // Merge provided options with defaults
    this.options = { ...DEFAULT_OPTIONS, ...options };

    // Initialize agent with default values and hash functions
    this.agent = {
      ...DEFAULT_AGENT,
      hashInt,
      hashMD5,
    };
  }

  /**
   * Get browser name from user agent string
   */
  private getBrowser(source: string): string {
    // Check browsers in priority order
    if (this.browserPatterns.Edge.test(source)) {
      this.agent.isEdge = true;
      return 'Edge';
    }
    if (this.browserPatterns.PhantomJS.test(source)) {
      this.agent.isPhantomJS = true;
      return 'PhantomJS';
    }
    if (this.browserPatterns.Konqueror.test(source)) {
      this.agent.isKonqueror = true;
      return 'Konqueror';
    }
    if (this.browserPatterns.Amaya.test(source)) {
      this.agent.isAmaya = true;
      return 'Amaya';
    }
    if (this.browserPatterns.Epiphany.test(source)) {
      this.agent.isEpiphany = true;
      return 'Epiphany';
    }
    if (this.browserPatterns.SeaMonkey.test(source)) {
      this.agent.isSeaMonkey = true;
      return 'SeaMonkey';
    }
    if (this.browserPatterns.Flock.test(source)) {
      this.agent.isFlock = true;
      return 'Flock';
    }
    if (this.browserPatterns.OmniWeb.test(source)) {
      this.agent.isOmniWeb = true;
      return 'OmniWeb';
    }
    if (this.browserPatterns.Opera.test(source)) {
      this.agent.isOpera = true;
      return 'Opera';
    }
    if (this.browserPatterns.Chromium.test(source)) {
      this.agent.isChrome = true;
      return 'Chromium';
    }
    if (this.browserPatterns.Chrome.test(source)) {
      this.agent.isChrome = true;
      return 'Chrome';
    }
    if (this.browserPatterns.Safari.test(source)) {
      this.agent.isSafari = true;
      return 'Safari';
    }
    if (this.browserPatterns.WinJs.test(source)) {
      this.agent.isWinJs = true;
      return 'WinJs';
    }
    if (this.browserPatterns.IE.test(source)) {
      this.agent.isIE = true;
      return 'IE';
    }
    if (this.browserPatterns.PS3.test(source)) {
      return 'ps3';
    }
    if (this.browserPatterns.PSP.test(source)) {
      return 'psp';
    }
    if (this.browserPatterns.Firefox.test(source)) {
      this.agent.isFirefox = true;
      return 'Firefox';
    }
    if (this.browserPatterns.UC.test(source)) {
      this.agent.isUC = true;
      return 'UCBrowser';
    }

    // If UA doesn't start with Mozilla, try to extract browser name
    if (source.indexOf('Mozilla') !== 0 && /^([\d\w-.]+)\/[\d\w.-]+/i.test(source)) {
      this.agent.isAuthoritative = false;
      return RegExp.$1;
    }

    return 'unknown';
  }

  /**
   * Get browser version from user agent string
   */
  private getBrowserVersion(source: string): string {
    const browser = this.agent.browser;

    const versionMap: Record<string, RegExp> = {
      Edge: this.versionPatterns.Edge,
      PhantomJS: this.versionPatterns.PhantomJS,
      Chrome: this.versionPatterns.Chrome,
      Chromium: this.versionPatterns.Chromium,
      Safari: this.versionPatterns.Safari,
      Opera: this.versionPatterns.Opera,
      Firefox: this.versionPatterns.Firefox,
      WinJs: this.versionPatterns.WinJs,
      IE: this.versionPatterns.IE,
      ps3: this.versionPatterns.Ps3,
      psp: this.versionPatterns.Psp,
      Amaya: this.versionPatterns.Amaya,
      Epiphany: this.versionPatterns.Epiphany,
      SeaMonkey: this.versionPatterns.SeaMonkey,
      Flock: this.versionPatterns.Flock,
      OmniWeb: this.versionPatterns.OmniWeb,
      UCBrowser: this.versionPatterns.UC,
    };

    const pattern = versionMap[browser];
    if (pattern && pattern.test(source)) {
      // Handle IE and Opera special cases with multiple capture groups
      if (browser === 'IE' || browser === 'Opera') {
        return RegExp.$2 || RegExp.$1 || 'unknown';
      }
      return RegExp.$1 || 'unknown';
    }

    // Try generic pattern if browser is not unknown
    if (browser !== 'unknown') {
      const regex = new RegExp(`${browser}[\\/ ]([\\d\\w.\\-]+)`, 'i');
      if (regex.test(source)) {
        return RegExp.$1 || 'unknown';
      }
    }

    return 'unknown';
  }

  /**
   * Get operating system from user agent string
   */
  private getOS(source: string): string {
    // Windows versions - check Windows 11 before Windows 10
    if (this.osPatterns.Windows11.test(source)) {
      // Windows 11 uses NT 10.0 but can be detected by platform version
      const match = source.match(this.osPatterns.Windows11);
      if (match && match[1]) {
        const version = parseInt(match[1]);
        // Chrome/Edge version >= 96 typically indicates Windows 11
        if (version >= 96) {
          this.agent.isWindows = true;
          return 'Windows 11';
        }
      }
    }
    if (this.osPatterns.Windows10.test(source)) {
      this.agent.isWindows = true;
      return 'Windows 10.0';
    }
    if (this.osPatterns.WindowsVista.test(source)) {
      this.agent.isWindows = true;
      return 'Windows Vista';
    }
    if (this.osPatterns.Windows7.test(source)) {
      this.agent.isWindows = true;
      return 'Windows 7';
    }
    if (this.osPatterns.Windows8.test(source)) {
      this.agent.isWindows = true;
      return 'Windows 8';
    }
    if (this.osPatterns.Windows81.test(source)) {
      this.agent.isWindows = true;
      return 'Windows 8.1';
    }
    if (this.osPatterns.Windows2003.test(source)) {
      this.agent.isWindows = true;
      return 'Windows 2003';
    }
    if (this.osPatterns.WindowsXP.test(source)) {
      this.agent.isWindows = true;
      return 'Windows XP';
    }
    if (this.osPatterns.Windows2000.test(source)) {
      this.agent.isWindows = true;
      return 'Windows 2000';
    }
    if (this.osPatterns.WindowsPhone8.test(source)) {
      return 'Windows Phone 8';
    }

    // Linux
    if (this.osPatterns.Linux64.test(source)) {
      this.agent.isLinux = true;
      this.agent.isLinux64 = true;
      return 'Linux 64';
    }
    if (this.osPatterns.Linux.test(source)) {
      this.agent.isLinux = true;
      return 'Linux';
    }
    if (this.osPatterns.ChromeOS.test(source)) {
      this.agent.isChromeOS = true;
      return 'Chrome OS';
    }

    // Gaming consoles
    if (this.osPatterns.Wii.test(source)) {
      return 'Wii';
    }
    if (this.osPatterns.PS3.test(source)) {
      return 'Playstation';
    }
    if (this.osPatterns.PSP.test(source)) {
      return 'Playstation';
    }

    // macOS versions
    if (this.osPatterns.OSXCheetah.test(source)) {
      this.agent.isMac = true;
      return 'OS X Cheetah';
    }
    if (this.osPatterns.OSXPuma.test(source)) {
      this.agent.isMac = true;
      return 'OS X Puma';
    }
    if (this.osPatterns.OSXJaguar.test(source)) {
      this.agent.isMac = true;
      return 'OS X Jaguar';
    }
    if (this.osPatterns.OSXPanther.test(source)) {
      this.agent.isMac = true;
      return 'OS X Panther';
    }
    if (this.osPatterns.OSXTiger.test(source)) {
      this.agent.isMac = true;
      return 'OS X Tiger';
    }
    if (this.osPatterns.OSXLeopard.test(source)) {
      this.agent.isMac = true;
      return 'OS X Leopard';
    }
    if (this.osPatterns.OSXSnowLeopard.test(source)) {
      this.agent.isMac = true;
      return 'OS X Snow Leopard';
    }
    if (this.osPatterns.OSXLion.test(source)) {
      this.agent.isMac = true;
      return 'OS X Lion';
    }
    if (this.osPatterns.OSXMountainLion.test(source)) {
      this.agent.isMac = true;
      return 'OS X Mountain Lion';
    }
    if (this.osPatterns.OSXMavericks.test(source)) {
      this.agent.isMac = true;
      return 'OS X Mavericks';
    }
    if (this.osPatterns.OSXYosemite.test(source)) {
      this.agent.isMac = true;
      return 'OS X Yosemite';
    }
    if (this.osPatterns.OSXElCapitan.test(source)) {
      this.agent.isMac = true;
      return 'OS X El Capitan';
    }
    if (this.osPatterns.OSXSierra.test(source)) {
      this.agent.isMac = true;
      return 'macOS Sierra';
    }
    if (this.osPatterns.OSXHighSierra.test(source)) {
      this.agent.isMac = true;
      return 'macOS High Sierra';
    }
    if (this.osPatterns.OSXMojave.test(source)) {
      this.agent.isMac = true;
      return 'macOS Mojave';
    }
    if (this.osPatterns.OSXCatalina.test(source)) {
      this.agent.isMac = true;
      return 'macOS Catalina';
    }
    if (this.osPatterns.MacOSBigSur.test(source)) {
      this.agent.isMac = true;
      return 'macOS Big Sur';
    }
    if (this.osPatterns.MacOSMonterey.test(source)) {
      this.agent.isMac = true;
      return 'macOS Monterey';
    }
    if (this.osPatterns.MacOSVentura.test(source)) {
      this.agent.isMac = true;
      return 'macOS Ventura';
    }
    if (this.osPatterns.MacOSSonoma.test(source)) {
      this.agent.isMac = true;
      return 'macOS Sonoma';
    }
    if (this.osPatterns.MacOSSequoia.test(source)) {
      this.agent.isMac = true;
      return 'macOS Sequoia';
    }

    // Mobile OS - check before Mac to avoid false Mac detection on iOS devices
    if (this.osPatterns.iPad.test(source)) {
      this.agent.isiPad = true;
      return 'iOS';
    }
    if (this.osPatterns.iPhone.test(source)) {
      this.agent.isiPhone = true;
      return 'iOS';
    }

    // Mac OS - check after iOS to avoid false positives
    if (this.osPatterns.Mac.test(source)) {
      this.agent.isMac = true;
      return 'Mac OS';
    }
    if (this.osPatterns.Bada.test(source)) {
      this.agent.isBada = true;
      return 'Bada';
    }
    if (this.osPatterns.Curl.test(source)) {
      this.agent.isCurl = true;
      return 'Curl';
    }

    return 'unknown';
  }

  /**
   * Get platform from user agent string
   */
  private getPlatform(source: string): string {
    if (this.platformPatterns.Windows.test(source)) {
      return 'Microsoft Windows';
    }
    if (this.platformPatterns.WindowsPhone.test(source)) {
      this.agent.isWindowsPhone = true;
      return 'Microsoft Windows Phone';
    }
    if (this.platformPatterns.Mac.test(source)) {
      return 'Apple Mac';
    }
    if (this.platformPatterns.Curl.test(source)) {
      return 'Curl';
    }
    if (this.platformPatterns.Android.test(source)) {
      this.agent.isAndroid = true;
      return 'Android';
    }
    if (this.platformPatterns.Blackberry.test(source)) {
      this.agent.isBlackberry = true;
      return 'Blackberry';
    }
    if (this.platformPatterns.Linux.test(source)) {
      return 'Linux';
    }
    if (this.platformPatterns.Wii.test(source)) {
      return 'Wii';
    }
    if (this.platformPatterns.Playstation.test(source)) {
      return 'Playstation';
    }
    if (this.platformPatterns.iPad.test(source)) {
      this.agent.isiPad = true;
      return 'iPad';
    }
    if (this.platformPatterns.iPod.test(source)) {
      this.agent.isiPod = true;
      return 'iPod';
    }
    if (this.platformPatterns.iPhone.test(source)) {
      this.agent.isiPhone = true;
      return 'iPhone';
    }
    if (this.platformPatterns.Samsung.test(source)) {
      this.agent.isSamsung = true;
      return 'Samsung';
    }

    return 'unknown';
  }

  /**
   * Test for bot/crawler
   */
  private testBot(): void {
    const isBot = IS_BOT_REGEXP.exec(this.agent.source.toLowerCase());
    if (isBot) {
      this.agent.isBot = isBot[1];
    } else if (!this.agent.isAuthoritative) {
      // Test unauthoritative parse for 'bot' in UA
      this.agent.isBot = /bot/i.test(this.agent.source);
    }
  }

  /**
   * Test for Smart TV
   */
  private testSmartTV(): void {
    const isSmartTV = /smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv/gi.exec(
      this.agent.source.toLowerCase()
    );
    if (isSmartTV) {
      this.agent.isSmartTV = isSmartTV[1] || true;
    }
  }

  /**
   * Test for mobile device
   */
  private testMobile(): void {
    // Smart TV check - Smart TVs are not mobile or desktop
    if (this.agent.isSmartTV) {
      this.agent.isMobile = false;
      this.agent.isDesktop = false;
      return;
    }

    // Mobile OS detection - check BEFORE desktop to avoid false Linux detection for Android
    if (
      this.agent.isAndroid ||
      this.agent.isSamsung ||
      this.agent.isiPhone ||
      this.agent.isiPod ||
      this.agent.isBada ||
      this.agent.isBlackberry ||
      this.agent.isWindowsPhone
    ) {
      this.agent.isMobile = true;
      this.agent.isDesktop = false;
      return;
    }

    // iPad is a tablet, not mobile
    if (this.agent.isiPad) {
      this.agent.isMobile = false;
      this.agent.isDesktop = false;
      return;
    }

    // Desktop OS detection
    if (this.agent.isWindows || this.agent.isLinux || this.agent.isMac || this.agent.isChromeOS) {
      this.agent.isDesktop = true;
      return;
    }

    // Check for mobile keyword in user agent
    if (/mobile/i.test(this.agent.source)) {
      this.agent.isMobile = true;
      this.agent.isDesktop = false;
    }
  }

  /**
   * Test for Android tablet
   */
  private testAndroidTablet(): void {
    if (this.agent.isAndroid && !/mobile/i.test(this.agent.source)) {
      this.agent.isAndroidTablet = true;
      this.agent.isMobile = false; // Tablets are not mobile
    }
  }

  /**
   * Test for tablet device
   */
  private testTablet(): void {
    if (this.agent.isiPad || this.agent.isAndroidTablet || this.agent.isKindleFire) {
      this.agent.isTablet = true;
    }

    if (/tablet/i.test(this.agent.source)) {
      this.agent.isTablet = true;
    }
  }

  /**
   * Test for IE compatibility mode
   */
  private testCompatibilityMode(): void {
    if (this.agent.isIE) {
      const tridentMatch = /Trident\/(\d)\.0/i.exec(this.agent.source);
      if (tridentMatch) {
        const tridentVersion = parseInt(tridentMatch[1], 10);
        const version = parseFloat(this.agent.version);

        if (version === 7 && tridentVersion === 7) {
          this.agent.isIECompatibilityMode = true;
          this.agent.version = '11.0';
        } else if (version === 7 && tridentVersion === 6) {
          this.agent.isIECompatibilityMode = true;
          this.agent.version = '10.0';
        } else if (version === 7 && tridentVersion === 5) {
          this.agent.isIECompatibilityMode = true;
          this.agent.version = '9.0';
        } else if (version === 7 && tridentVersion === 4) {
          this.agent.isIECompatibilityMode = true;
          this.agent.version = '8.0';
        }
      }
    }
  }

  /**
   * Test for Amazon Silk browser
   */
  private testSilk(): void {
    if (/silk/gi.test(this.agent.source)) {
      this.agent.isSilk = true;
    }
    if (/Silk-Accelerated=true/gi.test(this.agent.source)) {
      this.agent.silkAccelerated = true;
    }
  }

  /**
   * Test for Kindle Fire device
   */
  private testKindleFire(): void {
    const kindleTests: Array<[RegExp, string]> = [
      [/KFOT/gi, 'Kindle Fire'],
      [/KFTT/gi, 'Kindle Fire HD'],
      [/KFJWI/gi, 'Kindle Fire HD 8.9'],
      [/KFJWA/gi, 'Kindle Fire HD 8.9 4G'],
      [/KFSOWI/gi, 'Kindle Fire HD 7'],
      [/KFTHWI/gi, 'Kindle Fire HDX 7'],
      [/KFTHWA/gi, 'Kindle Fire HDX 7 4G'],
      [/KFAPWI/gi, 'Kindle Fire HDX 8.9'],
      [/KFAPWA/gi, 'Kindle Fire HDX 8.9 4G'],
      [/KFMAWI/gi, 'Kindle Fire HD 10'],
    ];

    for (const [pattern] of kindleTests) {
      if (pattern.test(this.agent.source)) {
        this.agent.isKindleFire = true;
        return;
      }
    }
  }

  /**
   * Test for Captive Network Assistant
   */
  private testCaptiveNetwork(): void {
    if (/CaptiveNetwork/gi.test(this.agent.source)) {
      this.agent.isCaptive = true;
      this.agent.isMac = true;
      this.agent.platform = 'Apple Mac';
    }
  }

  /**
   * Test for touch screen support
   */
  private testTouchSupport(): void {
    this.agent.isTouchScreen = checkTouchScreen();
  }

  /**
   * Get language from browser
   */
  private getLanguageInfo(): void {
    this.agent.language = getLanguage();
  }

  /**
   * Get color depth
   */
  private getColorDepthInfo(): void {
    this.agent.colorDepth = getColorDepth();
  }

  /**
   * Get pixel depth
   */
  private getPixelDepthInfo(): void {
    this.agent.pixelDepth = getPixelDepth();
  }

  /**
   * Get screen resolution
   */
  private getScreenResolutionInfo(): void {
    this.agent.resolution = getScreenResolution();
  }

  /**
   * Get CPU core count
   */
  private getCPUInfo(): void {
    this.agent.cpuCores = getCPUCores();
  }

  /**
   * Reset agent to default state
   */
  public reset(): this {
    this.agent = {
      ...DEFAULT_AGENT,
      hashInt,
      hashMD5,
    };
    return this;
  }

  /**
   * Parse user agent and collect device information
   * @param source - User agent string (defaults to navigator.userAgent)
   * @returns AgentInfo object with device details
   */
  public parse(source?: string): AgentInfo {
    const ua = new DeviceUUID();
    const userAgent = source || getUserAgent();

    ua.agent.source = userAgent.replace(/^\s*/, '').replace(/\s*$/, '');
    ua.agent.os = ua.getOS(ua.agent.source);
    ua.agent.platform = ua.getPlatform(ua.agent.source);
    ua.agent.browser = ua.getBrowser(ua.agent.source);
    ua.agent.version = ua.getBrowserVersion(ua.agent.source);

    // Run all tests
    ua.testBot();
    ua.testSmartTV();
    ua.testMobile();
    ua.testAndroidTablet();
    ua.testTablet();
    ua.testCompatibilityMode();
    ua.testSilk();
    ua.testKindleFire();
    ua.testCaptiveNetwork();
    ua.testTouchSupport();

    // Get device properties
    ua.getLanguageInfo();
    ua.getColorDepthInfo();
    ua.getPixelDepthInfo();
    ua.getScreenResolutionInfo();
    ua.getCPUInfo();

    return ua.agent;
  }

  /**
   * Generate a UUID based on device characteristics
   * @param customData - Optional custom data to include in UUID generation
   * @returns UUID string in v4 format
   */
  public get(customData?: string): string {
    const du = this.parse();
    const dataArray: unknown[] = [];

    // Collect data based on options
    for (const key in this.options) {
      if (Object.prototype.hasOwnProperty.call(this.options, key)) {
        const value = du[key as keyof AgentInfo];
        dataArray.push(value);
      }
    }

    // Add custom data if provided
    if (customData) {
      dataArray.push(customData);
    }

    // Add resolution for mobile devices if not in options
    if (!this.options.resolution && du.isMobile) {
      dataArray.push(du.resolution);
    }

    // Generate UUID v4 format
    const pref = 'b'; // UUID version 4 variant bits
    const tmpUuid = hashMD5(dataArray.join(':'));

    const uuid = [
      tmpUuid.slice(0, 8),
      tmpUuid.slice(8, 12),
      '4' + tmpUuid.slice(12, 15), // Version 4
      pref + tmpUuid.slice(15, 18), // Variant bits
      tmpUuid.slice(20),
    ];

    return uuid.join('-');
  }

  /**
   * Generate a UUID asynchronously with advanced fingerprinting methods
   * @param options - Fingerprint options or preset name
   * @returns Promise resolving to UUID string
   */
  public async getAsync(
    options?: Partial<FingerprintOptions> | FingerprintPreset
  ): Promise<string> {
    const details = await this.getDetailedAsync(options);
    return details.uuid;
  }

  /**
   * Generate detailed fingerprint with all component information
   * @param options - Fingerprint options or preset name
   * @returns Promise resolving to detailed fingerprint result
   */
  public async getDetailedAsync(
    options?: Partial<FingerprintOptions> | FingerprintPreset
  ): Promise<FingerprintDetails> {
    const startTime = getTimestamp();

    // Resolve options
    const resolvedOptions =
      typeof options === 'string' ? getPresetOptions(options) : mergeOptions(options);

    const components: FingerprintDetails['components'] = {
      basic: { name: 'basic', value: null, success: false },
    };

    // Get basic fingerprint (always included)
    const basicHash = this.get();
    components.basic = {
      name: 'basic',
      value: basicHash,
      success: true,
    };

    const hashes: (string | null)[] = [basicHash];
    let successCount = 1;
    let totalCount = 1;

    // Collect advanced fingerprints based on options
    const tasks: Promise<void>[] = [];

    // Canvas fingerprint
    if (resolvedOptions.canvas) {
      totalCount++;
      tasks.push(
        (async () => {
          const { result, duration } = await measureAsync(() =>
            getCanvasFingerprint({ timeout: resolvedOptions.methodTimeout })
          );
          components.canvas = {
            name: 'canvas',
            value: result,
            success: result !== null,
            duration,
          };
          if (result) {
            hashes.push(result);
            successCount++;
          }
        })()
      );
    }

    // WebGL fingerprint
    if (resolvedOptions.webgl) {
      totalCount++;
      tasks.push(
        (async () => {
          const { result, duration } = await measureAsync(() =>
            getWebGLFingerprint({ timeout: resolvedOptions.methodTimeout })
          );
          components.webgl = {
            name: 'webgl',
            value: result,
            success: result !== null,
            duration,
          };
          if (result) {
            hashes.push(result);
            successCount++;
          }
        })()
      );
    }

    // Audio fingerprint
    if (resolvedOptions.audio) {
      totalCount++;
      tasks.push(
        (async () => {
          const { result, duration } = await measureAsync(() =>
            getAudioFingerprint({ timeout: resolvedOptions.methodTimeout })
          );
          components.audio = {
            name: 'audio',
            value: result,
            success: result !== null,
            duration,
          };
          if (result) {
            hashes.push(result);
            successCount++;
          }
        })()
      );
    }

    // Font fingerprint
    if (resolvedOptions.fonts) {
      totalCount++;
      const fontList = Array.isArray(resolvedOptions.fonts) ? resolvedOptions.fonts : undefined;
      tasks.push(
        (async () => {
          const { result, duration } = await measureAsync(() =>
            getFontFingerprint({ timeout: resolvedOptions.methodTimeout, fonts: fontList })
          );
          components.fonts = {
            name: 'fonts',
            value: result,
            success: result !== null,
            duration,
          };
          if (result) {
            hashes.push(result);
            successCount++;
          }
        })()
      );
    }

    // Media devices fingerprint
    if (resolvedOptions.mediaDevices) {
      totalCount++;
      tasks.push(
        (async () => {
          const { result, duration } = await measureAsync(() => this.getMediaDevicesHash());
          components.mediaDevices = {
            name: 'mediaDevices',
            value: result,
            success: result !== null,
            duration,
          };
          if (result) {
            hashes.push(result);
            successCount++;
          }
        })()
      );
    }

    // Network info fingerprint
    if (resolvedOptions.networkInfo) {
      totalCount++;
      const { result, duration } = await measureAsync(() =>
        Promise.resolve(this.getNetworkInfoHash())
      );
      components.networkInfo = {
        name: 'networkInfo',
        value: result,
        success: result !== null,
        duration,
      };
      if (result) {
        hashes.push(result);
        successCount++;
      }
    }

    // Timezone fingerprint
    if (resolvedOptions.timezone) {
      totalCount++;
      const { result, duration } = await measureAsync(() =>
        Promise.resolve(this.getTimezoneHash())
      );
      components.timezone = {
        name: 'timezone',
        value: result,
        success: result !== null,
        duration,
      };
      if (result) {
        hashes.push(result);
        successCount++;
      }
    }

    // Incognito detection
    if (resolvedOptions.incognitoDetection) {
      totalCount++;
      tasks.push(
        (async () => {
          const { result, duration } = await measureAsync(() => this.detectIncognito());
          components.incognito = {
            name: 'incognito',
            value: result,
            success: result !== null,
            duration,
          };
          if (result) {
            hashes.push(result);
            successCount++;
          }
        })()
      );
    }

    // Wait for all async tasks with global timeout
    await withTimeout(Promise.all(tasks), resolvedOptions.timeout ?? 5000, []);

    // Combine all hashes into final UUID
    const combinedData = combineHashes(hashes);
    const finalHash = hashMD5(combinedData);

    const uuid = [
      finalHash.slice(0, 8),
      finalHash.slice(8, 12),
      '4' + finalHash.slice(12, 15),
      'b' + finalHash.slice(15, 18),
      finalHash.slice(20),
    ].join('-');

    const endTime = getTimestamp();

    return {
      uuid,
      components,
      confidence: calculateConfidence(totalCount, successCount),
      duration: endTime - startTime,
      timestamp: Date.now(),
    };
  }

  /**
   * Get individual fingerprint components (synchronous basic components only)
   * @returns Object with component hashes
   */
  public getComponents(): Record<string, string | null> {
    const du = this.parse();
    return {
      userAgent: hashMD5(du.source),
      platform: hashMD5(du.platform),
      os: hashMD5(du.os),
      browser: hashMD5(`${du.browser}:${du.version}`),
      screen: hashMD5(`${du.resolution[0]}x${du.resolution[1]}:${du.colorDepth}:${du.pixelDepth}`),
      hardware: hashMD5(`${du.cpuCores}:${du.isTouchScreen}`),
      language: hashMD5(du.language),
    };
  }

  /**
   * Check if a fingerprinting feature is supported
   * @param feature - Feature to check
   * @returns Whether the feature is supported
   */
  public static isFeatureSupported(feature: FingerprintFeature): boolean {
    return isFeatureSupported(feature);
  }

  /**
   * Get media devices fingerprint hash
   * @returns Promise resolving to hash or null
   */
  private async getMediaDevicesHash(): Promise<string | null> {
    if (!isBrowser()) return null;

    const nav = getNavigator();
    if (!nav?.mediaDevices?.enumerateDevices) return null;

    try {
      const devices = await nav.mediaDevices.enumerateDevices();

      const counts = {
        audioinput: 0,
        audiooutput: 0,
        videoinput: 0,
      };

      for (const device of devices) {
        if (device.kind in counts) {
          counts[device.kind as keyof typeof counts]++;
        }
      }

      return hashMD5(`${counts.audioinput}:${counts.audiooutput}:${counts.videoinput}`);
    } catch {
      return null;
    }
  }

  /**
   * Get network information fingerprint hash
   * @returns Hash or null
   */
  private getNetworkInfoHash(): string | null {
    if (!isBrowser()) return null;

    const nav = getNavigator() as Navigator & {
      connection?: {
        effectiveType?: string;
        downlink?: number;
        rtt?: number;
      };
    };

    if (!nav?.connection) return null;

    try {
      const conn = nav.connection;
      const parts = [
        conn.effectiveType ?? 'unknown',
        conn.downlink?.toString() ?? 'unknown',
        conn.rtt?.toString() ?? 'unknown',
      ];
      return hashMD5(parts.join(':'));
    } catch {
      return null;
    }
  }

  /**
   * Get timezone fingerprint hash
   * @returns Hash or null
   */
  private getTimezoneHash(): string | null {
    try {
      const parts: string[] = [];

      // Timezone offset
      parts.push(`offset:${new Date().getTimezoneOffset()}`);

      // Intl timezone
      if (typeof Intl !== 'undefined') {
        const options = Intl.DateTimeFormat().resolvedOptions();
        parts.push(`tz:${options.timeZone ?? 'unknown'}`);
        parts.push(`locale:${options.locale ?? 'unknown'}`);
      }

      // Languages
      const nav = getNavigator();
      if (nav?.languages) {
        parts.push(`langs:${nav.languages.join(',')}`);
      }

      return hashMD5(parts.join('|'));
    } catch {
      return null;
    }
  }

  /**
   * Detect incognito/private browsing mode
   * @returns Promise resolving to hash or null
   */
  private async detectIncognito(): Promise<string | null> {
    if (!isBrowser()) return null;

    try {
      const indicators: string[] = [];

      // Storage quota check
      if (navigator.storage?.estimate) {
        const estimate = await navigator.storage.estimate();
        const quota = estimate.quota ?? 0;
        // Private mode typically has significantly lower quota
        indicators.push(`quota:${quota < 120000000 ? 'low' : 'normal'}`);
      }

      // IndexedDB check
      try {
        const db = indexedDB.open('test');
        db.onerror = () => indicators.push('idb:blocked');
        await new Promise<void>((resolve) => {
          db.onsuccess = () => {
            indicators.push('idb:available');
            resolve();
          };
          db.onerror = () => {
            indicators.push('idb:blocked');
            resolve();
          };
          setTimeout(resolve, 100);
        });
      } catch {
        indicators.push('idb:error');
      }

      // FileSystem API availability check
      // Some browsers disable File System Access API in private mode
      if ('showOpenFilePicker' in window) {
        indicators.push('fsapi:available');
      } else {
        indicators.push('fsapi:unavailable');
      }

      // Cookie check
      indicators.push(`cookies:${navigator.cookieEnabled ? 'enabled' : 'disabled'}`);

      return hashMD5(indicators.join('|'));
    } catch {
      return null;
    }
  }
}
