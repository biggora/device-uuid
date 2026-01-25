# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-01-25

### Major Release - Async Fingerprinting & Enhanced Privacy

This release introduces comprehensive async fingerprinting capabilities with privacy-by-design principles, improved build system, and extensive test coverage.

### Added

#### Async API
- `getAsync()` - Generate UUID with advanced async fingerprinting methods
- `getDetailedAsync()` - Generate UUID with detailed component breakdown and metadata
- `getComponents()` - Access individual fingerprint components
- `isFeatureSupported()` - Static method to check feature availability at runtime

#### Advanced Fingerprinting Methods (All Opt-In)
- **Canvas Fingerprinting** - 2D rendering context extraction via `getCanvasFingerprint()`
- **WebGL Fingerprinting** - GPU and graphics capabilities detection via `getWebGLFingerprint()`
- **Audio Fingerprinting** - AudioContext-based fingerprinting via `getAudioFingerprint()`
- **Font Detection** - Font enumeration via `getFontFingerprint()` and `getFontFingerprintAsync()`
- **Media Devices** - Connected media device enumeration
- **Network Information** - Connection type and effective bandwidth detection
- **Timezone Detection** - Timezone and locale information extraction
- **Incognito Detection** - Private/incognito browser mode detection heuristics

#### Configuration System
- **Presets** - Pre-configured options: `minimal`, `standard`, `comprehensive`
- **Custom Options** - Fine-grained control over each fingerprinting method
- **Timeout Protection** - Global and per-method timeout configuration
- **Font Customization** - Support for custom font lists in font detection

#### TypeScript Types
- `FingerprintOptions` - Configuration interface for async fingerprinting
- `FingerprintDetails` - Detailed output interface with components, options, and duration
- `FingerprintComponent` - Individual component type definition
- `FingerprintPreset` - Preset type: 'minimal' | 'standard' | 'comprehensive'
- `FingerprintFeature` - Feature detection type: 'canvas' | 'webgl' | 'audio' | 'fonts'

#### Browser Compatibility
- Browser detection utilities in `src/utils/browser-compatibility.ts`
- Feature support detection for all fingerprinting methods
- Graceful degradation when features are unavailable

#### Build System
- **tsup** - Modern TypeScript build tool replacing legacy bundler
- **Triple Output** - ESM, CJS, and IIFE (browser) builds from single source
- **Browser Build** - Separate entry point (`src/browser.ts`) for IIFE/global export
- **Sourcemaps** - Generated for all build outputs
- **Type Declarations** - Automatic `.d.ts` generation

#### Testing
- **Vitest** - Modern unit testing framework
- **Playwright** - Cross-browser E2E testing (Chromium, Firefox, WebKit)
- **16+ Unit Tests** - Comprehensive coverage of all functionality
- **4 Integration Tests** - Async/sync interaction, configuration, parsing, generation
- **E2E Test Suite** - Real browser testing with multiple device profiles
- **Performance Tests** - Benchmark suite for performance validation

#### Code Quality
- **ESLint** - Modern ESLint configuration with TypeScript support
- **Prettier** - Code formatting with consistent style
- **Strict TypeScript** - All strict checks enabled, no unused locals/parameters
- **2-space Indentation** - Consistent code formatting throughout

### Changed

#### Architecture
- **Modular Structure** - Reorganized into `core/`, `fingerprints/`, `utils/`, `types/`, `constants/`
- **Dual API Pattern** - Separate synchronous (basic) and asynchronous (advanced) APIs
- **Entry Points** - Separate entry points for module (`index.ts`) and browser (`browser.ts`) builds

#### Build Configuration
- **Target ES2020** - Modern JavaScript target for better performance and smaller bundles
- **Module Resolution** - Changed to 'bundler' for improved compatibility
- **Package Exports** - Proper `exports` field for selective bundling

#### Dependencies
- **Zero Runtime Dependencies** - Pure TypeScript implementation
- - Removed all legacy runtime dependencies

#### Package Structure
- **package.json** - Updated exports field for proper module resolution
- **tsconfig.json** - Updated for ES2020 target and bundler resolution
- **vitest.config.ts** - Added Vitest configuration
- **playwright.config.ts** - Added Playwright E2E test configuration
- - Removed legacy configuration files

### Fixed

- **Type Safety** - All TypeScript errors resolved with strict mode enabled
- **Test Isolation** - Fixed module import conflicts in unit tests
- **Fingerprint Timeouts** - Added timeout protection to prevent hanging operations
- **Error Handling** - Graceful fallbacks when fingerprinting methods fail
- **GlobalThis Access** - Fixed type issues with global property access
- **Unused Code** - Removed unused imports, variables, and parameters throughout codebase

### Security

- **Privacy by Default** - All advanced fingerprinting methods are opt-in (disabled by default)
- **Explicit Consent Required** - Users must explicitly enable each fingerprinting method
- **Timeout Protection** - All async operations have configurable timeouts (default 5000ms global, 1000ms per-method)
- **No Data Exfiltration** - All processing happens locally; nothing is sent to external servers
- **Error Silence** - Failed fingerprinting methods return `null` rather than throwing

### Developer Experience

- **JSDoc Comments** - Comprehensive documentation for public API methods
- **Type Exports** - All types exported for consumer use
- **CLAUDE.md** - Project documentation for AI-assisted development
- **README.md** - Comprehensive user documentation with examples
- **CHANGELOG.md** - Detailed changelog following Keep a Changelog format

### Bundle Sizes

| Format | Size |
|--------|------|
| ESM | ~31 KB (unminified) |
| CJS | ~31 KB (unminified) |
| Browser (IIFE) | ~34 KB (unminified) |
| Browser (IIFE, minified) | ~19 KB |

### Breaking Changes from 2.x

- **Build Output** - Changed from single bundle to triple output (ESM, CJS, IIFE)
- **Import Path** - Browser users may need to update import paths to use `exports` field
- **TypeScript** - Now requires TypeScript 4.7+ for ES2020 target support
- **Node.js** - Minimum Node.js version now 14.0.0 for ES2020 support

### Migration Guide from 2.x

```typescript
// Before (2.x)
import { DeviceUUID } from 'device-uuid';
const device = new DeviceUUID();
const uuid = device.get();

// After (3.x) - Basic usage unchanged
import { DeviceUUID } from 'device-uuid';
const device = new DeviceUUID();
const uuid = device.get(); // Still works!

// New in 3.x - Advanced fingerprinting
const advancedUuid = await device.getAsync({
  canvas: true,
  webgl: true,
  audio: true,
  fonts: true
});

// Or use a preset
const standardUuid = await device.getAsync({ preset: 'standard' });
```

## [2.0.0] - Legacy Release

### Features

- Basic device detection from User-Agent
- Screen resolution detection
- Language and locale detection
- CPU core count detection
- Touch screen detection
- Platform and OS detection
- Browser detection and version parsing
- Bot detection for web crawlers

[3.0.0]: https://github.com/yourusername/device-uuid/releases/tag/v3.0.0
[2.0.0]: https://github.com/yourusername/device-uuid/releases/tag/v2.0.0
