# API Reference

Complete API documentation for the device-uuid library.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Classes](#classes)
  - [DeviceUUID](#deviceuuid)
- [Types](#types)
  - [DeviceUUIDOptions](#deviceuuidoptions)
  - [FingerprintPreset](#fingerprintpreset)
  - [FingerprintDetails](#fingerprintfdetails)
- [Examples](#examples)

## Installation

```bash
npm install device-uuid
```

```bash
yarn add device-uuid
```

## Quick Start

```typescript
import { DeviceUUID } from 'device-uuid';

// Basic synchronous usage (backward compatible)
const device = new DeviceUUID();
const uuid = device.get();
console.log(uuid); // e.g., "4b8f5c9e-1a2d-3e4f-5b6c-7d8e9f0a1b2c"

// Async usage with advanced fingerprinting
const detailedUuid = await device.getAsync('comprehensive');
console.log(detailedUuid);

// Get detailed information
const details = await device.getDetailedAsync('standard');
console.log(details.uuid); // The generated UUID
console.log(details.confidence); // Confidence score (0-1)
console.log(details.components); // Individual component hashes
```

## Classes

### DeviceUUID

Main class for device detection and UUID generation.

#### Constructor

```typescript
constructor(options?: Partial<DeviceUUIDOptions>)
```

Creates a new DeviceUUID instance with optional configuration.

**Parameters:**

- `options` - Partial configuration options to override defaults

**Example:**

```typescript
const device = new DeviceUUID({ canvas: true, webgl: true });
```

---

#### get()

```typescript
get(): string
```

Synchronously generates a UUID based on basic device properties.

**Returns:** UUID string (36 characters)

**Example:**

```typescript
const uuid = device.get();
```

---

#### getAsync()

```typescript
getAsync(options?: FingerprintPreset | FingerprintOptions): Promise<string>
```

Asynchronously generates a UUID with optional advanced fingerprinting methods.

**Parameters:**

- `options` - Either a preset name ('minimal', 'standard', 'comprehensive') or custom options

**Returns:** Promise resolving to UUID string

**Example:**

```typescript
// Using preset
const uuid1 = await device.getAsync('standard');

// Using custom options
const uuid2 = await device.getAsync({ canvas: true, webgl: true });
```

---

#### getDetailedAsync()

```typescript
getDetailedAsync(options?: FingerprintPreset | FingerprintOptions): Promise<FingerprintDetails>
```

Asynchronously generates a UUID and returns detailed information about the fingerprint.

**Parameters:**

- `options` - Either a preset name or custom options

**Returns:** Promise resolving to FingerprintDetails object

**Example:**

```typescript
const details = await device.getDetailedAsync('comprehensive');
console.log(details.uuid);        // UUID string
console.log(details.confidence);   // 0.85
console.log.details.components);  // { canvas: "abc123...", webgl: "def456..." }
```

---

#### getComponents()

```typescript
getComponents(): Record<string, ComponentInfo>
```

Returns the individual components that make up the device fingerprint.

**Returns:** Object containing component information

**Example:**

```typescript
const components = device.getComponents();
console.log(components.userAgent); // User agent string
console.log(components.screen); // Screen resolution
```

---

#### parse()

```typescript
parse(): AgentInfo
```

Parses the current user agent and returns detailed browser/device information.

**Returns:** AgentInfo object with browser, OS, platform, and version info

**Example:**

```typescript
const info = device.parse();
console.log(info.browser);  // "Chrome"
console.log.info.os);       // "Windows 10"
console.log(info.version);  // "120.0.6099.109"
```

---

#### reset()

```typescript
reset(): void
```

Resets the internal cache and state, forcing regeneration on next call.

**Example:**

```typescript
device.reset();
const newUuid = device.get(); // Regenerates UUID
```

---

#### isFeatureSupported() (Static)

```typescript
static isFeatureSupported(feature: FingerprintFeature): boolean
```

Checks if a specific fingerprinting feature is supported in the current environment.

**Parameters:**

- `feature` - Name of the feature to check ('canvas', 'webgl', 'audio', 'fonts', 'mediaDevices', 'networkInfo', 'timezone', 'incognitoDetection')

**Returns:** boolean indicating support

**Example:**

```typescript
if (DeviceUUID.isFeatureSupported('webgl')) {
  // WebGL fingerprinting is available
}
```

---

## Types

### DeviceUUIDOptions

Configuration options for fingerprint generation.

```typescript
interface DeviceUUIDOptions {
  /** Enable canvas fingerprinting (default: false) */
  canvas?: boolean;

  /** Enable WebGL fingerprinting (default: false) */
  webgl?: boolean;

  /** Enable AudioContext fingerprinting (default: false) */
  audio?: boolean;

  /** Enable font detection (default: false, or array of font names) */
  fonts?: boolean | string[];

  /** Enable media devices enumeration (default: false) */
  mediaDevices?: boolean;

  /** Enable network information detection (default: false) */
  networkInfo?: boolean;

  /** Enable timezone detection (default: false) */
  timezone?: boolean;

  /** Enable incognito mode detection (default: false) */
  incognitoDetection?: boolean;

  /** Global timeout for async operations in ms (default: 5000) */
  timeout?: number;

  /** Per-method timeout in ms (default: 1000) */
  methodTimeout?: number;
}
```

---

### FingerprintPreset

Pre-configured option presets.

```typescript
type FingerprintPreset = 'minimal' | 'standard' | 'comprehensive';
```

**Presets:**

- **`minimal`** - Only basic device info (userAgent, screen, language, etc.)
- **`standard`** - Basic info + Canvas + WebGL + Timezone
- **`comprehensive`** - All available fingerprinting methods

---

### FingerprintDetails

Detailed result from getDetailedAsync().

```typescript
interface FingerprintDetails {
  /** The generated UUID */
  uuid: string;

  /** Individual component hashes */
  components: {
    basic?: string; // Basic device properties hash
    canvas?: string; // Canvas fingerprint hash
    webgl?: string; // WebGL fingerprint hash
    audio?: string; // Audio fingerprint hash
    fonts?: string; // Font detection hash
    mediaDevices?: string; // Media devices hash
    networkInfo?: string; // Network info hash
    timezone?: string; // Timezone hash
    incognito?: string; // Incognito detection result
  };

  /** Confidence score (0-1) based on available data */
  confidence: number;

  /** Time taken to generate fingerprint in ms */
  duration: number;

  /** Timestamp of generation */
  timestamp: number;
}
```

---

## Examples

### Basic Usage

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();
console.log(device.get());
```

### With Custom Options

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

// Enable specific fingerprinting methods
const uuid = await device.getAsync({
  canvas: true,
  webgl: true,
  timezone: true,
});
```

### Using Presets

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

// Minimal - fastest, least unique
const minimal = await device.getAsync('minimal');

// Standard - good balance
const standard = await device.getAsync('standard');

// Comprehensive - most unique, slower
const comprehensive = await device.getAsync('comprehensive');
```

### Get Detailed Information

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

const details = await device.getDetailedAsync('standard');

console.log('UUID:', details.uuid);
console.log('Confidence:', details.confidence);
console.log('Duration:', details.duration, 'ms');
console.log('Components:', Object.keys(details.components));
```

### Check Feature Support

```typescript
import { DeviceUUID } from 'device-uuid';

// Check if WebGL is available
if (DeviceUUID.isFeatureSupported('webgl')) {
  console.log('WebGL fingerprinting is available');
}

// Check audio support
if (DeviceUUID.isFeatureSupported('audio')) {
  console.log('Audio fingerprinting is available');
}
```

### Custom Font List

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

// Check for specific fonts
const uuid = await device.getAsync({
  fonts: ['Arial', 'Times New Roman', 'Courier New', 'Georgia'],
});
```

### Parse User Agent

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

// Set custom user agent (for testing)
device.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

const info = device.parse();
console.log(info.browser); // "Chrome"
console.log(info.os); // "Windows 10"
```

### Error Handling

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

try {
  // Set timeout to avoid long waits
  const uuid = await device.getAsync({
    canvas: true,
    webgl: true,
    timeout: 2000, // 2 second timeout
  });
  console.log('UUID:', uuid);
} catch (error) {
  console.error('Fingerprint generation failed:', error);
  // Fall back to basic UUID
  const basicUuid = device.get();
}
```

### Get Individual Components

```typescript
import { DeviceUUID } from 'device-uuid';

const device = new DeviceUUID();

const components = device.getComponents();

console.log('User Agent:', components.userAgent);
console.log('Screen:', components.screen);
console.log('Language:', components.language);
console.log('Platform:', components.platform);
```

## Privacy Considerations

The device-uuid library is designed with privacy in mind:

1. **Opt-in by default** - All advanced fingerprinting methods are disabled by default
2. **No persistent storage** - No cookies, localStorage, or sessionStorage usage
3. **No external requests** - All detection is done locally
4. **Graceful degradation** - Works even when users block fingerprinting

When using advanced fingerprinting methods:

- Always inform users in your privacy policy
- Provide a way to opt-out
- Use the data responsibly for legitimate purposes only
- Consider legal requirements (GDPR, CCPA, etc.)

## Browser Compatibility

| Feature       | Chrome | Firefox | Safari | Edge | Brave | Tor |
| ------------- | ------ | ------- | ------ | ---- | ----- | --- |
| Basic         | ✅     | ✅      | ✅     | ✅   | ✅    | ✅  |
| Canvas        | ✅     | ⚠️      | ⚠️     | ✅   | ⚠️    | ❌  |
| WebGL         | ✅     | ⚠️      | ⚠️     | ✅   | ⚠️    | ❌  |
| Audio         | ⚠️     | ⚠️      | ⚠️     | ⚠️   | ⚠️    | ❌  |
| Fonts         | ✅     | ✅      | ✅     | ✅   | ✅    | ⚠️  |
| Media Devices | ✅     | ✅      | ✅     | ✅   | ✅    | ⚠️  |
| Network Info  | ✅     | ✅      | ❌     | ✅   | ✅    | ❌  |
| Timezone      | ✅     | ✅      | ✅     | ✅   | ✅    | ✅  |

Legend:

- ✅ Fully supported
- ⚠️ Partially supported (may be limited by privacy features)
- ❌ Not supported

## License

MIT License - see LICENSE file for details.
