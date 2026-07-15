import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'store-assets', 'screenshots');
mkdirSync(OUT, { recursive: true });

const URL = 'http://127.0.0.1:5173';
const VIEWPORT = { width: 480, height: 960, deviceScaleFactor: 2 };

async function clickText(page, text, options = {}) {
  const btn = await page.$(`button, a, div[role="button"]`);
  const all = await page.$$('button, a, [role="button"], .clickable');
  for (const el of all) {
    const t = await el.evaluate(e => e.textContent);
    if (t && t.toLowerCase().includes(text.toLowerCase())) {
      await el.click();
      if (options.delay) await new Promise(r => setTimeout(r, options.delay));
      return true;
    }
  }
  return false;
}

async function screenshot(page, name) {
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: false });
  console.log(`  ✓ ${name}.png`);
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=480,960']
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // 1. Main Menu
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await screenshot(page, '01-main-menu');

  // 2. Start a new game — click "New Life"
  await clickText(page, 'new', { delay: 500 });
  // Fill in some details if needed
  const inputs = await page.$$('input');
  for (const inp of inputs) {
    const placeholder = await inp.evaluate(el => el.placeholder || '');
    if (placeholder.toLowerCase().includes('first')) await inp.type('Alex');
    if (placeholder.toLowerCase().includes('last')) await inp.type('River');
  }
  await screenshot(page, '02-character-creation');

  // 3. Start the game
  await clickText(page, 'start', { delay: 500 });
  await clickText(page, 'start', { delay: 500 });

  // Close onboarding if it appears
  await new Promise(r => setTimeout(r, 2000));
  const closeBtns = await page.$$('button');
  for (const btn of closeBtns) {
    const t = await btn.evaluate(el => el.textContent);
    if (t && (t.includes('Skip') || t.includes('Done') || t.includes('Close'))) {
      await btn.click(); break;
    }
  }

  // 3. Gameplay HUD
  await new Promise(r => setTimeout(r, 1500));
  await screenshot(page, '03-gameplay-hud');

  // 4. Age up a few times to generate events
  await clickText(page, 'age', { delay: 500 });
  await new Promise(r => setTimeout(r, 1000));
  await clickText(page, 'age', { delay: 500 });
  await new Promise(r => setTimeout(r, 1000));
  await clickText(page, 'age', { delay: 500 });
  await new Promise(r => setTimeout(r, 1000));
  await screenshot(page, '04-age-progress');

  // 5. Open Activities menu
  await clickText(page, 'activit', { delay: 500 });
  await new Promise(r => setTimeout(r, 1000));
  await screenshot(page, '05-activities');

  // 6. Close activities, open system menu
  await clickText(page, 'back', { delay: 300 });
  await clickText(page, 'back', { delay: 300 });
  await page.evaluate(() => {
    const hud = document.querySelector('.app-container');
    if (hud) {
      const gears = hud.querySelectorAll('button');
      for (const g of gears) {
        if (g.textContent.includes('☰') || g.textContent.includes('⚙') || g.textContent.includes('Menu')) {
          g.click(); break;
        }
      }
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  await screenshot(page, '06-system-menu');

  // 7. Close menu, age to death for Game Over
  await clickText(page, 'resume', { delay: 300 });
  for (let i = 0; i < 30; i++) {
    await clickText(page, 'age', { delay: 100 });
    await new Promise(r => setTimeout(r, 100));
    const dead = await page.evaluate(() => document.querySelector('.game-over, [class*="GameOver"]'));
    if (dead) break;
  }
  await new Promise(r => setTimeout(r, 2000));
  await screenshot(page, '07-game-over');

  await browser.close();
  console.log('\nAll screenshots captured!');
}

main().catch(e => { console.error(e); process.exit(1); });