import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const srcRoot = resolve(root, 'src');
const strict = process.argv.includes('--strict');
const jsonOutput = process.argv.includes('--json');
const MAX_SAMPLES = 80;

const report = {
  criticalErrors: [],
  warnings: [],
  metrics: {
    englishUiKeys: 0,
    arabicUiKeys: 0,
    missingArabicUiKeys: 0,
    extraArabicUiKeys: 0,
    legacyPlaceholderEntries: 0,
    bilingualJsonObjects: 0,
    jsonTranslationErrors: 0,
    suspiciousJsxStrings: 0,
    scannedFiles: 0,
  },
};

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'android') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }
  return files;
}

function lineNumber(source, index) {
  return source.slice(0, Math.max(0, index)).split('\n').length;
}

function addCritical(path, line, message, code) {
  report.criticalErrors.push({ path, line, message, code });
}

function addWarning(path, line, message, code, sample) {
  if (report.warnings.length >= MAX_SAMPLES) return;
  report.warnings.push({ path, line, message, code, sample });
}

function extractObjectKeys(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) return new Set();
  const section = source.slice(start + startMarker.length, end);
  const keys = new Set();
  const pattern = /^\s*['"]([^'"]+)['"]\s*:/gm;
  for (const match of section.matchAll(pattern)) keys.add(match[1]);
  return keys;
}

function auditI18n(source, path) {
  const englishKeys = extractObjectKeys(source, '  en: {', '  ar: {');
  const arabicKeys = extractObjectKeys(source, '  ar: {', '\n  },\n};');
  report.metrics.englishUiKeys = englishKeys.size;
  report.metrics.arabicUiKeys = arabicKeys.size;

  const missing = [...englishKeys].filter(key => !arabicKeys.has(key));
  const extra = [...arabicKeys].filter(key => !englishKeys.has(key));
  report.metrics.missingArabicUiKeys = missing.length;
  report.metrics.extraArabicUiKeys = extra.length;
  missing.forEach(key => addCritical(path, 1, `Missing Arabic UI key: ${key}`, 'MISSING_ARABIC_UI_KEY'));

  const placeholderPattern = /\bar\s*:\s*(['"`])(?:(?!\1).)*?\sAR\1/g;
  const placeholders = [...source.matchAll(placeholderPattern)];
  report.metrics.legacyPlaceholderEntries = placeholders.length;
  placeholders.slice(0, 25).forEach(match =>
    addWarning(
      path,
      lineNumber(source, match.index),
      'Legacy placeholder Arabic is quarantined by the runtime fallback layer.',
      'LEGACY_AR_PLACEHOLDER',
      match[0].slice(0, 180)
    )
  );

  const obviousBadScript = /[\u0900-\u097f]/g;
  for (const match of source.matchAll(obviousBadScript)) {
    addCritical(path, lineNumber(source, match.index), 'Non-Arabic Indic character found in Arabic catalog.', 'INVALID_ARABIC_SCRIPT');
  }
}

function auditLocalizedObject(value, path, pointer = '$') {
  if (!value || typeof value !== 'object') return;
  if (!Array.isArray(value) && Object.hasOwn(value, 'en')) {
    report.metrics.bilingualJsonObjects += 1;
    const en = typeof value.en === 'string' ? value.en.trim() : '';
    const ar = typeof value.ar === 'string' ? value.ar.trim() : '';
    if (!en || !ar) {
      report.metrics.jsonTranslationErrors += 1;
      addCritical(path, 1, `${pointer} requires non-empty English and Arabic text.`, 'MISSING_JSON_TRANSLATION');
    } else if (/\sAR\s*$/i.test(ar) || ar === en) {
      report.metrics.jsonTranslationErrors += 1;
      addCritical(path, 1, `${pointer}.ar is still a placeholder or equals English.`, 'PLACEHOLDER_JSON_TRANSLATION');
    } else if (!/[\u0600-\u06ff]/.test(ar)) {
      report.metrics.jsonTranslationErrors += 1;
      addCritical(path, 1, `${pointer}.ar does not contain Arabic text.`, 'NON_ARABIC_JSON_TRANSLATION');
    }
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => auditLocalizedObject(entry, path, `${pointer}[${index}]`));
  } else {
    Object.entries(value).forEach(([key, entry]) => auditLocalizedObject(entry, path, `${pointer}.${key}`));
  }
}

function auditJsx(source, path) {
  const patterns = [
    />\s*([^<{\n][^<{\n]*[A-Za-z][^<{\n]*)\s*</g,
    /\b(?:placeholder|title|aria-label)\s*=\s*['"]([^'"]*[A-Za-z][^'"]*)['"]/g,
  ];
  const ignore = /^(?:x|×|USD|MAD|PathBloom|Android|GitHub|JSON|URL|API|SFX|NPC)$/;
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const text = String(match[1] || '').trim();
      if (!text || ignore.test(text) || /^(?:https?:|[\w.-]+@)/.test(text)) continue;
      if (/\b(?:className|style|onClick|return|const|function)\b/.test(text)) continue;
      report.metrics.suspiciousJsxStrings += 1;
      addWarning(
        path,
        lineNumber(source, match.index),
        'Possible hardcoded English UI string. Arabic runtime coverage will record it during device testing.',
        'HARDCODED_JSX_TEXT',
        text.slice(0, 180)
      );
    }
  }
}

const files = await walk(srcRoot);
for (const absolutePath of files) {
  const extension = extname(absolutePath);
  if (!['.js', '.jsx', '.json'].includes(extension)) continue;
  report.metrics.scannedFiles += 1;
  const path = relative(root, absolutePath).replaceAll('\\', '/');
  const source = await readFile(absolutePath, 'utf8');

  if (path === 'src/logic/i18n.js') auditI18n(source, path);
  if (extension === '.json') {
    try {
      auditLocalizedObject(JSON.parse(source), path);
    } catch (error) {
      addCritical(path, 1, `Invalid JSON: ${error.message}`, 'INVALID_JSON');
    }
  }
  if (extension === '.jsx') auditJsx(source, path);

  if (path !== 'src/logic/i18n.js') {
    for (const match of source.matchAll(/(?:['"`])([^'"`\n]*\sAR)(?:['"`])/g)) {
      addCritical(path, lineNumber(source, match.index), 'New AR placeholder marker found outside the legacy catalog.', 'NEW_AR_PLACEHOLDER');
    }
  }
}

report.valid = report.criticalErrors.length === 0;

if (jsonOutput) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('Arabic localization audit');
  console.log('=========================');
  Object.entries(report.metrics).forEach(([key, value]) => console.log(`${key}: ${value}`));
  console.log(`criticalErrors: ${report.criticalErrors.length}`);
  console.log(`warningSamples: ${report.warnings.length}`);

  if (report.criticalErrors.length) {
    console.log('\nCritical errors:');
    report.criticalErrors.slice(0, 100).forEach(error =>
      console.log(`- ${error.path}:${error.line} [${error.code}] ${error.message}`)
    );
  }
  if (report.warnings.length) {
    console.log('\nWarnings (sample):');
    report.warnings.forEach(warning =>
      console.log(`- ${warning.path}:${warning.line} [${warning.code}] ${warning.sample || warning.message}`)
    );
  }
}

if (strict && !report.valid) process.exitCode = 1;
