# Browser Limitations and Known Issues

This document describes known limitations and issues with fingerprinting across different browsers.

## Table of Contents

- [Overview](#overview)
- [Chrome/Chromium](#chromechromium)
- [Firefox](#firefox)
- [Safari](#safari)
- [Edge](#edge)
- [Brave](#brave)
- [Tor Browser](#tor-browser)
- [Mobile Browsers](#mobile-browsers)
- [Detection Strategies](#detection-strategies)

---

## Overview

Different browsers implement various privacy protections that affect fingerprinting reliability. This library is designed to gracefully degrade when these protections are detected, falling back to basic device properties.

---

## Chrome/Chromium

### Version Support

- **Minimum version**: 56+
- **Recommended**: 90+
- **Testing performed on**: 120, 121, 122

### Known Limitations

| Feature | Limitation                                        | Mitigation                                       |
| ------- | ------------------------------------------------- | ------------------------------------------------ |
| Canvas  | Chrome 94+ adds small random noise to canvas data | Still produces consistent results on same device |
| WebGL   | Returns consistent GPU info on most platforms     | Falls back gracefully when unavailable           |
| Audio   | Requires user interaction in some contexts        | Uses OfflineAudioContext for consistency         |
| Fonts   | Limited to installed system fonts                 | Detects ~30 common fonts by default              |

### Privacy Sandbox

Chrome's Privacy Sandbox (rolled out 2023-2024) may introduce additional protections:

- User-Agent reduction (frozen to major version)
- **Impact**: Minimal, as we use multiple data sources beyond UA

### Incognito Mode

Detection method: `navigator.storage.estimate()` quota check

- **Limitation**: Quota-based detection is probabilistic, not definitive
- **False positive rate**: ~5%
- **False negative rate**: ~15%

---

## Firefox

### Version Support

- **Minimum version**: 52+
- **Recommended**: 100+
- **Testing performed on**: 120, 121

### Known Limitations

| Feature       | Limitation                                       | Mitigation                            |
| ------------- | ------------------------------------------------ | ------------------------------------- |
| Canvas        | `privacy.resistFingerprinting` affects canvas    | Returns null when resistance detected |
| WebGL         | `privacy.resistFingerprinting` reduces precision | Falls back to basic properties        |
| Audio         | May be blocked in strict privacy mode            | Timeout prevents hanging              |
| Media Devices | Requires permission prompt                       | Uses count only, not labels           |

### `privacy.resistFingerprinting`

When enabled in `about:config`:

- Canvas returns random or white noise
- WebGL parameters are rounded to common values
- AudioContext timing information is obfuscated
- Navigator properties are spoofed

**Detection**: The library detects canvas blocking and returns `null` for affected methods.

### ETP (Enhanced Tracking Protection)

- **Strict mode**: May block canvas fingerprinting
- **Standard mode**: Usually allows fingerprinting
- **Custom mode**: Depends on user configuration

---

## Safari

### Version Support

- **Minimum version**: 11+
- **Recommended**: 15+
- **Testing performed on**: 16, 17

### Known Limitations

| Feature       | Limitation                                 | Mitigation                             |
| ------------- | ------------------------------------------ | -------------------------------------- |
| Canvas        | ITP 2.0+ may add per-session randomization | Hash remains consistent within session |
| WebGL         | Slightly different precision than Chrome   | Works, but values may differ           |
| Audio         | Requires user gesture on iOS               | Timeout handles this gracefully        |
| Network Info  | `navigator.connection` not available       | Feature check returns false            |
| Media Devices | Requires HTTPS and permission              | Falls back when unavailable            |

### Intelligent Tracking Prevention (ITP)

Safari's ITP introduces several challenges:

1. **Partitioned cache**: Each day gets new cache partition
   - **Impact**: Minimal for our use case (no cookies/storage)

2. **Link decoration**: Parameters added to outbound links
   - **Impact**: None (we don't use links)

3. **Per-session canvas noise**: Small random values added
   - **Impact**: Canvas fingerprint may change between sessions
   - **Mitigation**: Combine with other stable sources

### iOS Safari Limitations

On iOS (all browsers use WebKit):

- `AudioContext` cannot be created without user gesture
- `OfflineAudioContext` may not be available
- **Mitigation**: Timeout ensures fallback to other methods

---

## Edge

### Version Support

- **Minimum version**: 79+ (Chromium-based)
- **Recommended**: 110+
- **Testing performed on**: 120, 121

### Known Limitations

Edge (Chromium-based) behaves similarly to Chrome:

- Same canvas noise injection
- Same WebGL behavior
- Same privacy sandbox limitations

### Edge-Specific Features

- **Tracking Prevention**: Similar to Chrome's protections
- **Strict mode**: May block some fingerprinting methods
- **Mitigation**: Feature detection and graceful fallback

---

## Brave

### Version Support

- **Minimum version**: 1.0+
- **Recommended**: 1.50+
- **Testing performed on**: 1.60, 1.61

### Known Limitations

| Feature | Limitation                              | Mitigation                   |
| ------- | --------------------------------------- | ---------------------------- |
| Canvas  | **Blocked** by default in Brave Shields | Returns null, falls back     |
| WebGL   | **Blocked** by default in Brave Shields | Returns null, falls back     |
| Audio   | May be blocked depending on settings    | Timeout prevents hanging     |
| Fonts   | Often limited or randomized             | Partial results still useful |

### Brave Shields

Brave's fingerprinting protections are aggressive:

**Shields settings → Fingerprinting blocking:**

- **Strict**: All canvas/WebGL blocked
- **Standard**: Canvas blocked, WebGL partially allowed
- **Disabled**: All methods available

**Detection**: Canvas blocker detection catches this and returns `null`.

### Fingerprint Randomization

Brave may return fake values for:

- `navigator.deviceMemory`
- `navigator.hardwareConcurrency`
- Screen dimensions (in some cases)

**Mitigation**: Use multiple data sources for better reliability.

---

## Tor Browser

### Version Support

- **Minimum**: Tor Browser 12+
- **Status**: **Severely limited**

### Known Limitations

| Feature      | Status     | Notes                                |
| ------------ | ---------- | ------------------------------------ |
| Canvas       | ❌ Blocked | Returns blank/white canvas           |
| WebGL        | ❌ Blocked | Returns null or generic values       |
| Audio        | ❌ Blocked | Disabled by default                  |
| Fonts        | ⚠️ Limited | Only generic fonts                   |
| Network Info | ❌ Blocked | Returns safe defaults                |
| Basic        | ✅ Works   | User-agent and basic properties only |

### Tor Browser Protections

Tor Browser has **`privacy.resistFingerprinting = true`** by default:

1. **Canvas**: Always returns white/transparent pixels
2. **WebGL**: Returns minimal info or disabled
3. **Navigator**: Properties spoofed to common values
4. **Screen**: Dimensions rounded to multiples of 50-200
5. **Timezone**: Always UTC
6. **Language**: Always `en-US`

### Recommended Usage

For Tor Browser users:

- Use `get()` (synchronous) instead of `getAsync()`
- Expect all advanced methods to return `null`
- UUID will be based on basic properties only

---

## Mobile Browsers

### iOS Safari (see Safari section above)

### Chrome Android

**Version Support**: 90+

**Known Limitations:**

- Audio requires user interaction
- `OfflineAudioContext` available but may fail without gesture
- Network Information API available
- **Mitigation**: Timeout and graceful fallback

### Firefox Android

**Version Support**: 100+

**Known Limitations:**

- Similar to desktop Firefox
- `privacy.resistFingerprinting` may be enabled
- More aggressive privacy protections by default

### Samsung Internet

**Version Support**: 14+

**Known Limitations:**

- Based on Chromium, similar to Chrome
- May have additional privacy features
- Canvas/WebGL generally available

---

## Detection Strategies

### Canvas Blocker Detection

```typescript
// Internal implementation
const isCanvasBlocked = (canvas: HTMLCanvasElement): boolean => {
  // Draw known pattern
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(0, 0, 1, 1);

  const imageData = ctx.getImageData(0, 0, 1, 1);
  const pixel = imageData.data;

  // If pixel doesn't match, canvas is being blocked/randomized
  return pixel[0] !== 255 || pixel[1] !== 0 || pixel[2] !== 0;
};
```

### Graceful Degradation

When a method fails or is blocked:

1. **Log the error** (optional, if error logging enabled)
2. **Return `null`** for that component
3. **Continue with other methods**
4. **Generate UUID from available data**

### Timeout Protection

All async methods have timeouts:

- **Default**: 1000ms per method
- **Global**: 5000ms for all methods
- **Result**: Partial results returned on timeout

---

## Recommendations for Developers

### 1. Always Check Feature Support

```typescript
import { DeviceUUID } from 'device-uuid';

if (DeviceUUID.isFeatureSupported('canvas')) {
  // Canvas fingerprinting is available
} else {
  // Fall back to other methods
}
```

### 2. Use Presets for Different Scenarios

```typescript
// Minimal - works everywhere, fastest
const minimal = await device.getAsync('minimal');

// Standard - good balance
const standard = await device.getAsync('standard');

// Comprehensive - best for non-Tor/Brave users
const comprehensive = await device.getAsync('comprehensive');
```

### 3. Handle Partial Results

```typescript
const details = await device.getDetailedAsync('comprehensive');

// Check which methods succeeded
if (details.components.canvas) {
  console.log('Canvas fingerprint available');
}

if (!details.components.webgl) {
  console.log('WebGL blocked or unavailable');
}

// Use confidence score
if (details.confidence < 0.5) {
  console.warn('Low confidence - consider additional verification');
}
```

### 4. Respect User Privacy

```typescript
// Always inform users
// Provide opt-out mechanism
// Use data responsibly
```

---

## Testing Checklist

When testing in different browsers:

- [ ] Chrome (latest, latest-1)
- [ ] Firefox (latest, latest-1)
- [ ] Safari (latest macOS, latest iOS)
- [ ] Edge (latest)
- [ ] Brave (default Shields settings)
- [ ] Tor Browser (default settings)
- [ ] Chrome Android
- [ ] Firefox Android
- [ ] Samsung Internet

### Test Cases

1. **Basic get()**: Should work everywhere
2. **Canvas**: Should return `null` in Tor/Brave
3. **WebGL**: Should return `null` in Tor/Brave
4. **Audio**: Should timeout gracefully when blocked
5. **Fonts**: Should work but may return limited results
6. **Incognito detection**: Should detect with ~80% accuracy

---

## Version History

| Version | Date    | Changes               |
| ------- | ------- | --------------------- |
| 1.0.0   | 2024-01 | Initial documentation |
