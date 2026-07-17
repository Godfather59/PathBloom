import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];
const passed = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function check(condition, message, warning = false) {
  if (condition) passed.push(message);
  else if (warning) warnings.push(message);
  else failures.push(message);
}

const requiredFiles = [
  'package.json',
  'package-lock.json',
  'capacitor.config.json',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res/values/strings.xml',
  'android/app/src/main/res/values/styles.xml',
  'docs/BETA_RELEASE_CHECKLIST.md',
];
requiredFiles.forEach(file => check(exists(file), `Required file exists: ${file}`));

const packageJson = JSON.parse(read('package.json'));
const capacitor = JSON.parse(read('capacitor.config.json'));
const manifest = read('android/app/src/main/AndroidManifest.xml');
const gradle = read('android/app/build.gradle');

const versionName = gradle.match(/versionName\s+["']([^"']+)["']/)?.[1];
const versionCode = Number(gradle.match(/versionCode\s+(\d+)/)?.[1]);
const applicationId = gradle.match(/applicationId\s+["']([^"']+)["']/)?.[1];

check(Boolean(packageJson.version), 'Web package version is defined.');
check(packageJson.version === versionName, `Web and Android versions match (${packageJson.version}).`);
check(Number.isInteger(versionCode) && versionCode > 0, `Android versionCode is valid (${versionCode || 'missing'}).`);
check(capacitor.appId === applicationId, `Capacitor and Android application IDs match (${capacitor.appId}).`);
check(capacitor.webDir === 'dist', 'Capacitor packages the production dist directory.');
check(Boolean(capacitor.appName?.trim()), 'Capacitor app name is defined.');
check(/android:supportsRtl=["']true["']/.test(manifest), 'Android RTL support is enabled.');
check(/android:allowBackup=["']false["']/.test(manifest), 'Unencrypted Android system backup is disabled.');
check(/android:exported=["']true["']/.test(manifest), 'Launcher activity export setting is explicit.');
check(/android.permission.INTERNET/.test(manifest), 'Android internet permission is declared.');
check(/minifyEnabled\s+true/.test(gradle), 'Release code shrinking is enabled.');
check(/shrinkResources\s+true/.test(gradle), 'Release resource shrinking is enabled.');

const requiredScripts = [
  'build',
  'validate:content',
  'validate:i18n',
  'validate:release',
  'test:release',
  'test:ui',
  'test:content',
  'test:world',
];
requiredScripts.forEach(script => check(Boolean(packageJson.scripts?.[script]), `npm script exists: ${script}`));

const iconDensities = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
iconDensities.forEach(density => {
  check(
    exists(`android/app/src/main/res/mipmap-${density}/ic_launcher.png`),
    `Launcher icon exists for ${density}.`
  );
  check(
    exists(`android/app/src/main/res/mipmap-${density}/ic_launcher_round.png`),
    `Round launcher icon exists for ${density}.`
  );
});

check(
  exists('android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml'),
  'Adaptive launcher icon metadata exists.',
  true
);
check(
  exists('android/app/src/main/res/drawable/splash.png') ||
    exists('android/app/src/main/res/drawable-port-mdpi/splash.png'),
  'At least one Android splash image exists.',
  true
);
check(exists('privacy-policy.md') || exists('PRIVACY.md'), 'A privacy policy file exists before store submission.', true);
check(exists('docs/store-listing'), 'Store listing screenshots/text directory exists.', true);

console.log(`\nPathBloom release readiness: ${passed.length} checks passed.`);
passed.forEach(message => console.log(`  ✓ ${message}`));

if (warnings.length) {
  console.log(`\n${warnings.length} release warnings:`);
  warnings.forEach(message => console.log(`  ! ${message}`));
}

if (failures.length) {
  console.error(`\n${failures.length} required release checks failed:`);
  failures.forEach(message => console.error(`  ✗ ${message}`));
  process.exit(1);
}

console.log('\nRequired beta release checks passed. Physical-device and Play Console review are still required.');
