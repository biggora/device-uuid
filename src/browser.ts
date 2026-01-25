/**
 * Browser entry point for device-uuid library
 * This file is used for IIFE browser builds
 */

// Import everything first
import { DeviceUUID as DeviceUUIDClass, isFeatureSupported } from './index';
export * from './index';

// Export the class with a different name for the module system
export { DeviceUUIDClass as DeviceUUID };

// Extend Window interface for global assignment
declare global {
  interface Window {
    DeviceUUID: typeof DeviceUUIDClass & { isFeatureSupported: typeof isFeatureSupported };
  }
}

// CRITICAL: Assign to window IMMEDIATELY at module level
// Don't use block scope which might be optimized away
if (typeof window !== 'undefined') {
  // Direct assignment without intermediate variables
  window.DeviceUUID = Object.assign(DeviceUUIDClass, { isFeatureSupported });
}
