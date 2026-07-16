import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
});

try {
  const diagnostics = await server.ssrLoadModule('/src/logic/ContentPackDiagnostics.js');
  const report = diagnostics.summarizeBuiltinContent();

  console.log(`Content packs: ${report.packCount}`);
  console.log(`Events: ${report.eventCount}`);
  console.log(`Errors: ${report.errorCount}`);
  console.log(`Warnings: ${report.warningCount}`);

  for (const pack of report.packs) {
    const marker = pack.valid ? 'OK' : 'FAIL';
    console.log(`\n[${marker}] ${pack.id} — ${pack.eventCount} events`);
    for (const error of pack.errors) {
      console.error(`  ERROR ${error.path}: ${error.message} (${error.code})`);
    }
    for (const warning of pack.warnings) {
      console.warn(`  WARN  ${warning.path}: ${warning.message} (${warning.code})`);
    }
  }

  if (!report.valid) process.exitCode = 1;
} finally {
  await server.close();
}
