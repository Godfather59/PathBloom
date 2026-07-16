import { validateContentPack } from './ContentPackRegistry';

const modules =
  typeof import.meta.glob === 'function'
    ? import.meta.glob('../content/packs/*.json', { eager: true, import: 'default' })
    : {};

export function getBuiltinContentDiagnostics() {
  return Object.entries(modules).map(([path, rawPack]) => {
    const result = validateContentPack(rawPack);
    return {
      path,
      id: result.pack?.id || path,
      valid: result.valid,
      errors: result.errors,
      warnings: result.warnings,
      eventCount: result.pack?.events?.length || 0,
    };
  });
}

export function summarizeBuiltinContent() {
  const packs = getBuiltinContentDiagnostics();
  return {
    valid: packs.every(pack => pack.valid),
    packCount: packs.length,
    eventCount: packs.reduce((sum, pack) => sum + pack.eventCount, 0),
    errorCount: packs.reduce((sum, pack) => sum + pack.errors.length, 0),
    warningCount: packs.reduce((sum, pack) => sum + pack.warnings.length, 0),
    packs,
  };
}
