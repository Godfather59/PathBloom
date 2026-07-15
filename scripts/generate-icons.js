import { Buffer } from 'buffer';
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const RES_PATH = join(ROOT, 'android', 'app', 'src', 'main', 'res');
const STORE_PATH = join(ROOT, 'store-assets');

const ICON_SIZES = [
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 },
];

const SPLASH_DIRS = [
  'drawable',
  'drawable-port-mdpi',
  'drawable-port-hdpi',
  'drawable-port-xhdpi',
  'drawable-port-xxhdpi',
  'drawable-port-xxxhdpi',
  'drawable-land-mdpi',
  'drawable-land-hdpi',
  'drawable-land-xhdpi',
  'drawable-land-xxhdpi',
  'drawable-land-xxxhdpi',
];

function buildIconSvg(size, round = false) {
  const s = size;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}" width="${s}" height="${s}">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06251f"/>
        <stop offset="52%" stop-color="#0d3b35"/>
        <stop offset="100%" stop-color="#10182e"/>
      </linearGradient>
      <linearGradient id="leaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7dffbd"/>
        <stop offset="100%" stop-color="#0fc67c"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffe7a1"/>
        <stop offset="100%" stop-color="#c8922f"/>
      </linearGradient>
    </defs>
    ${
      round
        ? `<circle cx="${s * 0.5}" cy="${s * 0.5}" r="${s * 0.5}" fill="url(#bg)"/>`
        : `<rect width="${s}" height="${s}" rx="${s * 0.22}" fill="url(#bg)"/>`
    }
    <circle cx="${s * 0.5}" cy="${s * 0.5}" r="${s * 0.39}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="${s * 0.025}"/>
    <path d="M${s * 0.5} ${s * 0.78} C${s * 0.4} ${s * 0.64}, ${s * 0.41} ${s * 0.46}, ${s * 0.5} ${s * 0.32}
             C${s * 0.58} ${s * 0.46}, ${s * 0.59} ${s * 0.64}, ${s * 0.5} ${s * 0.78}Z" fill="url(#gold)"/>
    <path d="M${s * 0.51} ${s * 0.43} C${s * 0.36} ${s * 0.24}, ${s * 0.18} ${s * 0.24}, ${s * 0.12} ${s * 0.39}
             C${s * 0.29} ${s * 0.39}, ${s * 0.4} ${s * 0.48}, ${s * 0.51} ${s * 0.43}Z" fill="url(#leaf)"/>
    <path d="M${s * 0.53} ${s * 0.43} C${s * 0.68} ${s * 0.22}, ${s * 0.86} ${s * 0.24}, ${s * 0.91} ${s * 0.4}
             C${s * 0.74} ${s * 0.4}, ${s * 0.64} ${s * 0.49}, ${s * 0.53} ${s * 0.43}Z" fill="#42e6a4"/>
    <path d="M${s * 0.25} ${s * 0.73} C${s * 0.38} ${s * 0.67}, ${s * 0.61} ${s * 0.67}, ${s * 0.75} ${s * 0.73}" fill="none" stroke="#7dffbd" stroke-width="${s * 0.045}" stroke-linecap="round" opacity="0.65"/>
    <circle cx="${s * 0.5}" cy="${s * 0.31}" r="${s * 0.035}" fill="#ffffff" opacity="0.85"/>
  </svg>`;
}

function foregroundVector() {
  return `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <group android:pivotX="54" android:pivotY="54" android:scaleX="0.72" android:scaleY="0.72">
        <path android:fillColor="#d6b45c" android:pathData="M54,90 C43,72 44,50 54,30 C64,50 65,72 54,90Z"/>
        <path android:fillColor="#42e6a4" android:pathData="M55,45 C38,22 17,24 10,42 C30,42 42,53 55,45Z"/>
        <path android:fillColor="#7dffbd" android:pathData="M57,45 C74,22 95,25 101,43 C81,43 69,53 57,45Z"/>
        <path android:fillColor="#00000000" android:strokeColor="#7dffbd" android:strokeWidth="5" android:strokeLineCap="round" android:pathData="M22,82 C40,72 68,72 86,82"/>
    </group>
</vector>`;
}

function monochromeVector() {
  return foregroundVector()
    .replaceAll('#d6b45c', '#FFFFFFFF')
    .replaceAll('#42e6a4', '#FFFFFFFF')
    .replaceAll('#7dffbd', '#FFFFFFFF');
}

async function pngFromSvg(svg, size) {
  return sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
}

async function main() {
  mkdirSync(join(RES_PATH, 'drawable'), { recursive: true });
  mkdirSync(STORE_PATH, { recursive: true });

  writeFileSync(join(RES_PATH, 'drawable', 'ic_launcher_foreground.xml'), foregroundVector());
  writeFileSync(join(RES_PATH, 'drawable', 'ic_launcher_monochrome.xml'), monochromeVector());
  writeFileSync(
    join(RES_PATH, 'values', 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#06251f</color>
</resources>
`
  );

  for (const { name, size } of ICON_SIZES) {
    const outDir = join(RES_PATH, `mipmap-${name}`);
    mkdirSync(outDir, { recursive: true });

    const fullPng = await pngFromSvg(buildIconSvg(size), size);
    const roundPng = await pngFromSvg(buildIconSvg(size, true), size);

    writeFileSync(join(outDir, 'ic_launcher.png'), fullPng);
    writeFileSync(join(outDir, 'ic_launcher_round.png'), roundPng);
  }

  writeFileSync(
    join(STORE_PATH, 'pathbloom-icon-512.png'),
    await pngFromSvg(buildIconSvg(512), 512)
  );

  const publicDir = join(ROOT, 'public');
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(join(publicDir, 'icon-192.png'), await pngFromSvg(buildIconSvg(192), 192));
  writeFileSync(join(publicDir, 'icon-512.png'), await pngFromSvg(buildIconSvg(512), 512));

  rmSync(join(RES_PATH, 'drawable', 'ic_launcher_background.xml'), { force: true });
  for (const { name } of ICON_SIZES) {
    rmSync(join(RES_PATH, `mipmap-${name}`, 'ic_launcher_foreground.png'), { force: true });
  }
  for (const dir of SPLASH_DIRS) {
    rmSync(join(RES_PATH, dir, 'splash.png'), { force: true });
  }

  const sourceDir = join(STORE_PATH, 'source');
  if (existsSync(sourceDir)) {
    const featureSource = readdirSync(sourceDir).find(
      file => file.includes('feature-background') && file.endsWith('.png')
    );
    if (featureSource) {
      await sharp(join(sourceDir, featureSource))
        .resize(1024, 500, { fit: 'cover' })
        .composite([
          {
            input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500">
              <defs>
                <linearGradient id="shade" x1="0" x2="1">
                  <stop offset="0%" stop-color="#06141f" stop-opacity="0.92"/>
                  <stop offset="54%" stop-color="#06141f" stop-opacity="0.62"/>
                  <stop offset="100%" stop-color="#06141f" stop-opacity="0.05"/>
                </linearGradient>
              </defs>
              <rect width="1024" height="500" fill="url(#shade)"/>
              <text x="72" y="178" font-family="Arial, sans-serif" font-size="76" font-weight="900" fill="#ffffff">PathBloom</text>
              <text x="76" y="238" font-family="Arial, sans-serif" font-size="36" font-weight="800" fill="#7dffbd">Life Simulator</text>
              <text x="76" y="306" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#f8e3a1">Live choices. Grow a legacy.</text>
            </svg>`),
          },
        ])
        .png()
        .toFile(join(STORE_PATH, 'pathbloom-feature-graphic.png'));
    }
  }

  console.log('PathBloom launcher icons and store assets generated.');
}

main().catch(error => {
  console.error(error);
  throw error;
});
