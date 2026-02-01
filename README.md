# device-uuid

Fast browser device UUID generation library with comprehensive device detection and advanced fingerprinting capabilities. Written in TypeScript with zero runtime dependencies, supporting both Node.js and browser environments.

## Features

- 🚀 Zero runtime dependencies
- 📦 Multiple module formats (ESM, CJS, IIFE)
- 🔍 Comprehensive device detection (OS, browser, platform)
- 📱 Mobile, tablet, and desktop detection
- 🤖 Bot detection (32+ known bot patterns)
- 📺 Smart TV and gaming console detection
- 🎨 Advanced fingerprinting (Canvas, WebGL, Audio, Fonts)
- ⚡ Dual API: Synchronous and Asynchronous
- 🔒 Privacy-by-design (fingerprinting is opt-in)
- 🎨 TypeScript support with full type definitions
- 🌐 Browser and Node.js compatible

## Installation

```bash
npm install device-uuid
```

## Quick Start

### Node.js / Module Bundlers

```typescript
import { DeviceUUID } from 'device-uuid';

// Basic synchronous UUID (user agent + screen properties)
const device = new DeviceUUID();
const uuid = device.get();
console.log(uuid); // e9dc90ac-d03d-4f01-a7bb-873e14556d8e

// Get device information
const info = device.parse();
console.log(info.browser); // Chrome
console.log(info.os); // Windows 11
console.log(info.isMobile); // false
```

### Browser (via `<script>` tag)

```html
<script src="node_modules/device-uuid/dist/index.browser.min.js"></script>
<script>
  const device = new DeviceUUID();
  const uuid = device.get();
  console.log('Device UUID:', uuid);
</script>
```

### React

```tsx
'use client';

import { useEffect, useState } from 'react';
import { DeviceUUID } from 'device-uuid';

export function DeviceInfo() {
  const [uuid, setUuid] = useState<string | null>(null);

  useEffect(() => {
    const device = new DeviceUUID();
    setUuid(device.get());
  }, []);

  if (!uuid) return <p>Loading...</p>;

  return <p>Device UUID: {uuid}</p>;
}
```

## API Reference

### Synchronous API

Basic device identification using user agent and screen properties.

#### `get(customData?: string): string`

Generate a UUID based on device characteristics.

```typescript
const device = new DeviceUUID();
const uuid = device.get();
```

#### `parse(source?: string): AgentInfo`

Parse user agent string and return device information.

```typescript
const info = device.parse();
console.log(info.browser); // 'Chrome'
console.log(info.os); // 'Windows 11'
console.log(info.isMobile); // false
```

#### `getComponents(): Record<string, string | null>`

Get individual fingerprint components.

```typescript
const components = device.getComponents();
console.log(components);
// { userAgent: '...', screen: '1920x1080', language: 'en-US', ... }
```

### Asynchronous API

Advanced fingerprinting with browser characteristics. **All methods are opt-in for privacy.**

#### `getAsync(options?: FingerprintOptions): Promise<string>`

Generate a UUID with advanced fingerprinting methods.

```typescript
// Enable specific fingerprinting methods
const uuid = await device.getAsync({
  canvas: true,
  webgl: true,
  audio: true,
  fonts: true,
  timeout: 5000,
});

// Or use a preset
const uuid = await device.getAsync({ preset: 'standard' });
```

#### `getDetailedAsync(options?: FingerprintOptions): Promise<FingerprintDetails>`

Generate UUID and return detailed fingerprint information.

```typescript
const details = await device.getDetailedAsync({ preset: 'standard' });

console.log(details.uuid);       // Generated UUID
console.log.details.components); // Individual components
console.log(details.options);    // Options used
console.log.details.duration);   // Time taken (ms)
```

### Static Methods

#### `DeviceUUID.isFeatureSupported(feature: FingerprintFeature): boolean`

Check if a fingerprinting feature is supported in the current environment.

```typescript
import { DeviceUUID } from 'device-uuid';

DeviceUUID.isFeatureSupported('canvas'); // true/false
DeviceUUID.isFeatureSupported('webgl'); // true/false
DeviceUUID.isFeatureSupported('audio'); // true/false
```

## Configuration Options

### Fingerprint Presets

Presets provide pre-configured options for common use cases:

```typescript
// Minimal - basic device info only (no advanced fingerprinting)
await device.getAsync({ preset: 'minimal' });

// Standard - canvas and WebGL (good uniqueness)
await device.getAsync({ preset: 'standard' });

// Comprehensive - all fingerprinting methods
await device.getAsync({ preset: 'comprehensive' });
```

### Custom Options

Fine-grained control over fingerprinting methods:

```typescript
interface FingerprintOptions {
  // Fingerprinting methods (all opt-in, default: false)
  canvas?: boolean;
  webgl?: boolean;
  audio?: boolean;
  fonts?: boolean | string[]; // true for default list, or custom font list
  mediaDevices?: boolean;
  networkInfo?: boolean;
  timezone?: boolean;
  incognitoDetection?: boolean;

  // Timeouts
  timeout?: number; // Global timeout (default: 5000ms)
  methodTimeout?: number; // Per-method timeout (default: 1000ms)

  // Preset (overrides individual options)
  preset?: 'minimal' | 'standard' | 'comprehensive';
}
```

#### Font Detection

```typescript
// Use default font list
await device.getAsync({ fonts: true });

// Use custom font list
await device.getAsync({
  fonts: ['Arial', 'Times New Roman', 'Helvetica', 'Courier New'],
});
```

## Usage Examples

### Basic Device Detection

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();
const info = device.parse();

if (info.isMobile) {
  console.log('Mobile device detected');
} else if (info.isTablet) {
  console.log('Tablet device detected');
} else {
  console.log('Desktop device detected');
}

console.log(`Browser: ${info.browser} ${info.version}`);
console.log(`OS: ${info.os}`);
console.log(`Platform: ${info.platform}`);
```

### Advanced Fingerprinting

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

// Check feature support before using
if (DeviceUUID.isFeatureSupported('canvas')) {
  const uuid = await device.getAsync({
    canvas: true,
    webgl: true,
    timeout: 5000,
  });
  console.log('Advanced UUID:', uuid);
}
```

### Detailed Fingerprint Analysis

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

const details = await device.getDetailedAsync({
  preset: 'standard',
});

console.log('UUID:', details.uuid);
console.log('Components:', details.components);
console.log('Duration:', details.duration, 'ms');

// Check which components were used
for (const [key, value] of Object.entries(details.components)) {
  if (value !== null) {
    console.log(`${key}: ${value}`);
  }
}
```

### Custom User Agent Parsing

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

// Parse a custom user agent string
const customUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15';
const info = device.parse(customUA);

console.log(info.isiPhone); // true
console.log(info.os); // iOS
console.log(info.browser); // Safari
```

### Error Handling

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

try {
  const uuid = await device.getAsync({
    preset: 'comprehensive',
    timeout: 10000,
  });
  console.log('UUID:', uuid);
} catch (error) {
  console.error('Fingerprinting failed:', error);
  // Fall back to basic UUID
  const basicUuid = device.get();
  console.log('Basic UUID:', basicUuid);
}
```

## AgentInfo Interface

The `parse()` method returns an `AgentInfo` object with the following properties:

### Device Type Flags

| Property        | Type              | Description           |
| --------------- | ----------------- | --------------------- |
| `isDesktop`     | boolean           | Desktop computer      |
| `isMobile`      | boolean           | Mobile phone          |
| `isTablet`      | boolean           | Tablet device         |
| `isBot`         | boolean \| string | Bot/crawler detection |
| `isSmartTV`     | boolean           | Smart TV device       |
| `isTouchScreen` | boolean           | Touch screen support  |

### Browser Information

| Property    | Type    | Description                                        |
| ----------- | ------- | -------------------------------------------------- |
| `browser`   | string  | Browser name (Chrome, Firefox, Safari, Edge, etc.) |
| `version`   | string  | Browser version                                    |
| `isChrome`  | boolean | Chrome browser                                     |
| `isFirefox` | boolean | Firefox browser                                    |
| `isSafari`  | boolean | Safari browser                                     |
| `isEdge`    | boolean | Edge browser                                       |
| `isOpera`   | boolean | Opera browser                                      |
| `isIE`      | boolean | Internet Explorer                                  |

### Operating System

| Property     | Type    | Description                       |
| ------------ | ------- | --------------------------------- |
| `os`         | string  | Operating system name and version |
| `isWindows`  | boolean | Windows OS                        |
| `isMac`      | boolean | macOS                             |
| `isLinux`    | boolean | Linux OS                          |
| `isLinux64`  | boolean | 64-bit Linux                      |
| `isChromeOS` | boolean | Chrome OS                         |

### Mobile Platforms

| Property          | Type    | Description       |
| ----------------- | ------- | ----------------- |
| `isAndroid`       | boolean | Android platform  |
| `isAndroidTablet` | boolean | Android tablet    |
| `isiPhone`        | boolean | iPhone            |
| `isiPad`          | boolean | iPad              |
| `isiPod`          | boolean | iPod touch        |
| `isSamsung`       | boolean | Samsung device    |
| `isBlackberry`    | boolean | Blackberry device |

### Device Properties

| Property     | Type             | Description                       |
| ------------ | ---------------- | --------------------------------- |
| `platform`   | string           | Platform name                     |
| `language`   | string           | Browser language                  |
| `colorDepth` | number           | Screen color depth                |
| `pixelDepth` | number           | Screen pixel depth                |
| `resolution` | [number, number] | Screen resolution [width, height] |
| `cpuCores`   | number           | Number of CPU cores               |
| `source`     | string           | Original user agent string        |

### Utility Functions

| Method                           | Description           |
| -------------------------------- | --------------------- |
| `hashMD5(value: string): string` | Generate MD5 hash     |
| `hashInt(value: string): number` | Generate integer hash |

## Type Exports

The library exports the following TypeScript types:

```typescript
import type {
  DeviceUUIDOptions,
  AgentInfo,
  FingerprintOptions,
  FingerprintDetails,
  FingerprintComponent,
  FingerprintPreset,
  FingerprintFeature,
} from 'device-uuid';
```

## Bundle Sizes

| Format                   | Size                |
| ------------------------ | ------------------- |
| ESM                      | ~31 KB (unminified) |
| CJS                      | ~31 KB (unminified) |
| Browser (IIFE)           | ~34 KB (unminified) |
| Browser (IIFE, minified) | ~19 KB              |

## Browser Support

- Chrome / Chromium (all versions)
- Firefox (all versions)
- Safari (all versions)
- Edge (Chromium and Legacy)
- Opera (all versions)
- Internet Explorer 11+

## Privacy Considerations

This library follows a **privacy-by-design** approach:

1. **Opt-in Default**: All advanced fingerprinting methods are **disabled by default**
2. **User Control**: Explicit configuration required for each fingerprinting method
3. **Timeout Protection**: All async operations have configurable timeouts
4. **Error Handling**: Graceful fallbacks when methods fail or are blocked
5. **No Data Exfiltration**: All processing happens locally; nothing is sent to external servers

When using advanced fingerprinting:

- Always inform users about data collection
- Obtain appropriate consent when required
- Provide a way to opt-out
- Consider using the `minimal` preset for basic identification only

## License

[MIT](LICENSE) © Aleksejs Gordejevs and contributors.
