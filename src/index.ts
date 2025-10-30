/**
 * device-uuid v2.0.0
 * Fast browser device UUID generation library
 *
 * @author Alexey Gordeyev
 * @license MIT
 */

// Export main class
export { DeviceUUID } from './core/DeviceUUID';

// Export types for TypeScript consumers
export type { DeviceUUIDOptions, AgentInfo } from './types';

// Export constants for advanced users
export {
  BOTS,
  VERSION_PATTERNS,
  BROWSER_PATTERNS,
  OS_PATTERNS,
  PLATFORM_PATTERNS,
  DEFAULT_OPTIONS,
} from './constants';

// Export hash utilities
export { hashMD5, hashInt } from './utils/md5';

// Default export for convenience
export { DeviceUUID as default } from './core/DeviceUUID';
