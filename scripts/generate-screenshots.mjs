import { Buffer } from 'buffer';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCREENSHOTS_DIR = join(ROOT, 'store-assets', 'screenshots');

function screenshotSvg(label, sublabel, width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <defs>
      <radialGradient id="bg" cx="50%" cy="50%" r="75%">
        <stop offset="0%" stop-color="#1a5547"/>
        <stop offset="100%" stop-color="#0a1f2b"/>
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <circle cx="${width/2}" cy="${height*0.3}" r="48" fill="#42e6a4" opacity="0.15"/>
    <text x="${width/2}" y="${height*0.22}" text-anchor="middle" font-family="Arial" font-size="48" font-weight="bold" fill="#ffffff">PathBloom</text>
    <text x="${width/2}" y="${height*0.32}" text-anchor="middle" font-family="Arial" font-size="28" fill="#7dffbd">${label}</text>
    <text x="${width/2}" y="${height*0.42}" text-anchor="middle" font-family="Arial" font-size="18" fill="#aac4bd">${sublabel}</text>
    <rect x="${width*0.27}" y="${height*0.5}" width="${width*0.46}" height="${height*0.06}" rx="8" fill="#42e6a4" opacity="0.25"/>
    <rect x="${width*0.17}" y="${height*0.6}" width="${width*0.66}" height="${height*0.08}" rx="6" fill="#ffffff" opacity="0.08"/>
    <rect x="${width*0.17}" y="${height*0.72}" width="${width*0.50}" height="${height*0.08}" rx="6" fill="#ffffff" opacity="0.06"/>
  </svg>`;
}

const screenshots = [
  { name: '01-life-start', label: 'New Life', sublabel: 'Choose your starting country and name' },
  { name: '02-stats-and-activities', label: 'Stats &amp; Activities', sublabel: 'Manage health, happiness, smarts, looks' },
  { name: '03-career-and-money', label: 'Career &amp; Money', sublabel: 'Work, invest, and grow your wealth' },
  { name: '04-relationships', label: 'Relationships', sublabel: 'Find love, make friends, build bonds' },
  { name: '05-goals-and-legacy', label: 'Goals &amp; Legacy', sublabel: 'Complete goals and leave your mark' },
];

async function main() {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  for (const s of screenshots) {
    const svg = screenshotSvg(s.label, s.sublabel, 1080, 1920);
    await sharp(Buffer.from(svg)).png().toFile(join(SCREENSHOTS_DIR, s.name + '.png'));
    console.log('Created:', s.name + '.png');
  }
  console.log('Done -', screenshots.length, 'screenshots created');
}

main().catch(error => { console.error(error); process.exit(1); });