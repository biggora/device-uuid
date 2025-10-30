# device-uuid

Fast browser device UUID generation library with comprehensive device detection. Written in TypeScript with zero dependencies, supporting both Node.js and browser environments.

## Features

- 🚀 Zero dependencies
- 📦 Multiple module formats (ESM, CJS, IIFE)
- 🔍 Comprehensive device detection (OS, browser, platform)
- 📱 Mobile, tablet, and desktop detection
- 🤖 Bot detection
- 📺 Smart TV detection
- 🎨 TypeScript support with full type definitions
- 🌐 Browser and Node.js compatible

## Installation

```bash
npm install device-uuid
```

## Usage

### Node.js / Module Bundlers

```typescript
// ES Modules
import { DeviceUUID } from 'device-uuid';

// CommonJS
const { DeviceUUID } = require('device-uuid');

// Generate UUID
const device = new DeviceUUID();
const uuid = device.get();
console.log(uuid); // e9dc90ac-d03d-4f01-a7bb-873e14556d8e

// Get device information
const info = device.parse();
console.log(info.browser); // Chrome
console.log(info.os); // Windows 11
console.log(info.isMobile); // false
```

### Browser (via CDN or direct include)

```html
<!-- Minified version (recommended for production) -->
<script src="node_modules/device-uuid/dist/index.browser.min.js"></script>

<!-- Or unminified for development -->
<script src="node_modules/device-uuid/dist/index.browser.js"></script>

<script>
  // Create instance
  const device = new DeviceUUID.DeviceUUID();

  // Generate UUID
  const uuid = device.get();
  console.log('Device UUID:', uuid);

  // Parse user agent
  const info = device.parse();
  console.log('Browser:', info.browser);
  console.log('OS:', info.os);
  console.log('Is Mobile:', info.isMobile);
</script>
```

### Advanced Usage

#### Custom UUID Generation

```javascript
const device = new DeviceUUID();
const info = device.parse();

// Create custom UUID from specific properties
const customData = [
  info.language,
  info.platform,
  info.os,
  info.cpuCores,
  info.isAuthoritative,
  info.silkAccelerated,
  info.isKindleFire,
  info.isDesktop,
  info.isMobile,
  info.isTablet,
  info.isWindows,
  info.isLinux,
  info.isLinux64,
  info.isMac,
  info.isiPad,
  info.isiPhone,
  info.isiPod,
  info.isSmartTV,
  info.pixelDepth,
  info.isTouchScreen,
].join(':');

const customUUID = info.hashMD5(customData);
```

#### Parse Custom User Agent String

```javascript
const device = new DeviceUUID();
const customUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15';
const info = device.parse(customUA);

console.log(info.isiPhone); // true
console.log(info.os); // iOS
```

## API Reference

### DeviceUUID

#### Methods

- `get(customData?: string): string` - Generate a UUID based on device characteristics
- `parse(source?: string): AgentInfo` - Parse user agent string and return device information
- `reset(): this` - Reset the device information to default values

### AgentInfo Interface

The `parse()` method returns an object with the following properties:

#### Device Type Flags

- `isDesktop: boolean` - Desktop computer
- `isMobile: boolean` - Mobile phone
- `isTablet: boolean` - Tablet device
- `isBot: boolean | string` - Bot/crawler detection
- `isSmartTV: boolean` - Smart TV device
- `isTouchScreen: boolean` - Touch screen support

#### Browser Information

- `browser: string` - Browser name (Chrome, Firefox, Safari, Edge, etc.)
- `version: string` - Browser version
- `isChrome: boolean`
- `isFirefox: boolean`
- `isSafari: boolean`
- `isEdge: boolean`
- `isOpera: boolean`
- `isIE: boolean`

#### Operating System

- `os: string` - Operating system name and version
- `isWindows: boolean`
- `isMac: boolean`
- `isLinux: boolean`
- `isLinux64: boolean`
- `isChromeOS: boolean`

#### Mobile Platforms

- `isAndroid: boolean`
- `isAndroidTablet: boolean`
- `isiPhone: boolean`
- `isiPad: boolean`
- `isiPod: boolean`
- `isSamsung: boolean`
- `isBlackberry: boolean`

#### Device Properties

- `platform: string` - Platform name
- `language: string` - Browser language
- `colorDepth: number` - Screen color depth
- `pixelDepth: number` - Screen pixel depth
- `resolution: [number, number]` - Screen resolution [width, height]
- `cpuCores: number` - Number of CPU cores
- `source: string` - Original user agent string

#### Utility Functions

- `hashMD5(value: string): string` - Generate MD5 hash
- `hashInt(value: string): number` - Generate integer hash

## Supported Detection

### Operating Systems

- Windows (7, 8, 8.1, 10, 11)
- macOS (all versions including Catalina, Big Sur, Monterey, Ventura, Sonoma, Sequoia)
- Linux (including Ubuntu and other distributions)
- iOS
- Android
- Chrome OS
- Windows Phone

### Browsers

- Chrome / Chromium
- Firefox
- Safari
- Edge (Chromium and Legacy)
- Opera
- Internet Explorer
- PhantomJS
- UC Browser
- And many more

### Device Types

- Desktop computers
- Mobile phones
- Tablets
- Smart TVs (Samsung, LG, Apple TV)
- Kindle Fire devices
- Bots and crawlers (Google, Bing, Yandex, etc.)

## Bundle Sizes

- ESM: ~31 KB (unminified)
- CJS: ~31 KB (unminified)
- Browser (IIFE): ~34 KB (unminified), ~19 KB (minified)

## Example Output

```javascript
{
  "isMobile": false,
  "isDesktop": true,
  "isBot": false,
  "isTablet": false,
  "isiPad": false,
  "isiPhone": false,
  "isAndroid": false,
  "isBlackberry": false,
  "isOpera": false,
  "isIE": false,
  "isEdge": false,
  "isChrome": true,
  "isFirefox": false,
  "isSafari": false,
  "isWindows": true,
  "isMac": false,
  "isLinux": false,
  "browser": "Chrome",
  "version": "120.0.0.0",
  "os": "Windows 11",
  "platform": "Microsoft Windows",
  "language": "en-US",
  "colorDepth": 24,
  "pixelDepth": 24,
  "resolution": [1920, 1080],
  "cpuCores": 8,
  "source": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...",
  "hashMD5": [Function],
  "hashInt": [Function]
}
```

### LICENSE

[MIT](LICENSE) © Aleksejs Gordejevs and contributors.
