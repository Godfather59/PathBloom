import * as AudioModule from './Audio';
import * as ImmigrationModule from './ImmigrationSystem';
import * as TravelModule from './TravelSystem';

const LEGACY_MODULES = Object.freeze({
  './logic/Audio': AudioModule,
  './logic/Audio.js': AudioModule,
  './logic/ImmigrationSystem': ImmigrationModule,
  './logic/ImmigrationSystem.js': ImmigrationModule,
  './logic/TravelSystem': TravelModule,
  './logic/TravelSystem.js': TravelModule,
});

/**
 * Temporary browser compatibility for legacy handlers in App.jsx that still
 * call CommonJS require(). The bridge is installed before App.jsx is imported,
 * so Android WebView can resolve the known modules without exposing a general
 * dynamic module loader.
 */
export function browserRequire(moduleId) {
  const resolved = LEGACY_MODULES[String(moduleId || '')];
  if (!resolved) {
    throw new Error(`Unsupported browser require: ${String(moduleId)}`);
  }
  return resolved;
}

if (typeof globalThis.require !== 'function') {
  Object.defineProperty(globalThis, 'require', {
    value: browserRequire,
    configurable: true,
    enumerable: false,
    writable: false,
  });
}

export const supportedLegacyModules = Object.freeze(Object.keys(LEGACY_MODULES));
