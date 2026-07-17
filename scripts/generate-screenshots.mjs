import { Buffer } from 'buffer';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SCREENSHOTS_DIR = join(ROOT, 'store-assets', 'screenshots');
const WIDTH = 1080;
const HEIGHT = 1920;

const escapeXml = value =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

function text(x, y, value, size, color = '#f5f8fc', weight = 600, anchor = 'start') {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${escapeXml(value)}</text>`;
}

function card(x, y, width, height, accent, title, body, chips = []) {
  const chipMarkup = chips
    .map(
      (chip, index) => `
        <rect x="${x + 34 + index * 190}" y="${y + height - 64}" width="170" height="34" rx="17" fill="${chip.positive ? '#143a2d' : '#3a1c29'}"/>
        ${text(x + 119 + index * 190, y + height - 40, chip.label, 19, chip.positive ? '#52e5a0' : '#ff8391', 700, 'middle')}`
    )
    .join('');

  return `
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="30" fill="#101f33" stroke="#26384f" stroke-width="2"/>
    <rect x="${x}" y="${y}" width="8" height="${height}" rx="4" fill="${accent}"/>
    ${text(x + 34, y + 48, title, 23, accent, 800)}
    ${text(x + 34, y + 88, body, 28, '#f5f8fc', 600)}
    ${chipMarkup}
  `;
}

function topBar({ name = 'Amira El Idrissi', age = 'Age 24', money = 'MAD 42,600', rtl = false }) {
  const contentX = rtl ? 760 : 210;
  const anchor = rtl ? 'end' : 'start';
  return `
    <rect x="70" y="100" width="940" height="190" rx="32" fill="#0b1728" stroke="#26384f" stroke-width="2"/>
    <circle cx="140" cy="175" r="48" fill="#dce8f6"/>
    <circle cx="140" cy="175" r="36" fill="#9cb7cc"/>
    ${text(contentX, 160, name, 33, '#f5f8fc', 800, anchor)}
    ${text(contentX, 205, age, 23, '#aab9cc', 700, anchor)}
    ${text(820, 162, money, 25, '#f3c969', 800, 'end')}
    <rect x="884" y="133" width="76" height="76" rx="22" fill="#16273d" stroke="#31465e"/>
    <path d="M905 155h34M905 171h34M905 187h34" stroke="#dce8f6" stroke-width="5" stroke-linecap="round"/>
    <rect x="90" y="235" width="280" height="40" rx="20" fill="#143a2d"/>
    ${text(230, 262, rtl ? 'الصحة ٨٦' : 'Health 86', 20, '#52e5a0', 700, 'middle')}
    <rect x="385" y="235" width="280" height="40" rx="20" fill="#3a3320"/>
    ${text(525, 262, rtl ? 'السعادة ٧٤' : 'Happiness 74', 20, '#f3c969', 700, 'middle')}
    <rect x="680" y="235" width="280" height="40" rx="20" fill="#3a1c29"/>
    ${text(820, 262, rtl ? 'التوتر ٢١' : 'Stress 21', 20, '#ff8391', 700, 'middle')}
  `;
}

function bottomNavigation({ center = 'Age Up', rtl = false }) {
  const labels = rtl
    ? ['الحياة', 'الأنشطة', 'العالم', 'القائمة']
    : ['Life', 'Activities', 'World', 'Menu'];
  const positions = [175, 350, 730, 905];
  const items = labels
    .map(
      (label, index) => `
        <circle cx="${positions[index]}" cy="1702" r="24" fill="${index === 0 ? '#39d98a' : '#74859b'}" opacity="${index === 0 ? 1 : 0.8}"/>
        ${text(positions[index], 1760, label, 20, index === 0 ? '#52e5a0' : '#aab9cc', 700, 'middle')}`
    )
    .join('');
  return `
    <rect x="70" y="1635" width="940" height="190" rx="42" fill="#081423" stroke="#26384f" stroke-width="2"/>
    ${items}
    <circle cx="540" cy="1660" r="92" fill="#07111f"/>
    <rect x="454" y="1570" width="172" height="166" rx="48" fill="#39d98a"/>
    <circle cx="540" cy="1620" r="25" fill="none" stroke="#062219" stroke-width="6"/>
    <path d="M540 1606v18l14 9" fill="none" stroke="#062219" stroke-width="6" stroke-linecap="round"/>
    ${text(540, 1688, center, 22, '#062219', 900, 'middle')}
  `;
}

function shellScreenshot({ headline, subheadline, body, rtl = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
    <defs>
      <radialGradient id="bg" cx="50%" cy="0%" r="95%">
        <stop offset="0%" stop-color="#143a35"/>
        <stop offset="45%" stop-color="#0b1728"/>
        <stop offset="100%" stop-color="#07111f"/>
      </radialGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
    ${text(540, 55, headline, 40, '#f5f8fc', 900, 'middle')}
    ${text(540, 91, subheadline, 22, '#aab9cc', 600, 'middle')}
    ${body}
  </svg>`;
}

function lifeStory() {
  return shellScreenshot({
    headline: 'Your whole life, one story',
    subheadline: 'Choose, grow, and see every consequence',
    body: `
      ${topBar({})}
      ${text(95, 345, 'YOUR STORY', 22, '#aab9cc', 800)}
      ${card(105, 390, 870, 205, '#67a9ff', 'CAREER', 'You earned a promotion to Senior Developer.', [
        { label: 'Money +$8K', positive: true },
        { label: 'Stress +6', positive: false },
      ])}
      ${card(105, 625, 870, 205, '#f38ca9', 'RELATIONSHIP', 'You and Salma decided to move in together.', [
        { label: 'Happiness +8', positive: true },
      ])}
      ${card(105, 860, 870, 205, '#5dd6d0', 'WORLD', 'Regional trade growth lowered local prices.', [
        { label: 'Money +$500', positive: true },
      ])}
      ${card(105, 1095, 870, 205, '#f3c969', 'MILESTONE', 'You completed your first major life goal.', [
        { label: 'Karma +4', positive: true },
      ])}
      ${bottomNavigation({})}
    `,
  });
}

function decisions() {
  return shellScreenshot({
    headline: 'Every decision shapes the future',
    subheadline: 'See risks and consequences before you choose',
    body: `
      ${topBar({ name: 'Youssef Benali', age: 'Age 31', money: 'MAD 118,300' })}
      <rect x="70" y="320" width="940" height="1505" rx="42" fill="#000" opacity="0.42"/>
      <rect x="70" y="650" width="940" height="1175" rx="52" fill="#16273d" stroke="#31465e" stroke-width="2"/>
      <rect x="460" y="675" width="160" height="12" rx="6" fill="#52647a"/>
      ${text(120, 760, 'DECISION', 24, '#f3c969', 800)}
      ${text(120, 815, 'A rival offers you a secret political deal.', 31, '#f5f8fc', 700)}
      ${text(120, 860, 'Your choice may return later in the story.', 23, '#aab9cc', 500)}
      ${card(110, 920, 860, 210, '#52e5a0', 'LOW RISK', 'Reject the offer and stay transparent.', [
        { label: 'Karma +7', positive: true },
      ])}
      ${card(110, 1160, 860, 210, '#ffb45e', 'MEDIUM RISK', 'Negotiate stronger protections first.', [
        { label: 'Stress +4', positive: false },
        { label: 'Fame +3', positive: true },
      ])}
      ${card(110, 1400, 860, 210, '#ff6b7a', 'HIGH RISK', 'Accept the deal and hide the evidence.', [
        { label: 'Money +$12K', positive: true },
        { label: 'Karma -15', positive: false },
      ])}
    `,
  });
}

function activities() {
  const row = (y, icon, title, detail, favorite = false) => `
    <rect x="105" y="${y}" width="870" height="135" rx="28" fill="#101f33" stroke="#26384f" stroke-width="2"/>
    <rect x="130" y="${y + 26}" width="82" height="82" rx="24" fill="#143a2d"/>
    ${text(171, y + 80, icon, 34, '#52e5a0', 800, 'middle')}
    ${text(245, y + 56, title, 27, '#f5f8fc', 800)}
    ${text(245, y + 93, detail, 21, '#aab9cc', 500)}
    ${text(925, y + 82, favorite ? '★' : '☆', 40, favorite ? '#f3c969' : '#74859b', 700, 'middle')}
  `;
  return shellScreenshot({
    headline: 'Find the right activity fast',
    subheadline: 'Search, filter, favorite, and repeat',
    body: `
      <rect x="70" y="115" width="940" height="1710" rx="42" fill="#0b1728" stroke="#26384f" stroke-width="2"/>
      ${text(115, 190, 'Activities', 38, '#f5f8fc', 900)}
      ${text(115, 230, 'Shape your health, skills, money, and relationships.', 22, '#aab9cc', 500)}
      <rect x="105" y="270" width="870" height="82" rx="24" fill="#101f33" stroke="#31465e" stroke-width="2"/>
      ${text(145, 322, 'Search activities', 24, '#91a2b8', 500)}
      <rect x="105" y="380" width="180" height="62" rx="31" fill="#143a2d"/>
      ${text(195, 420, 'All', 22, '#52e5a0', 800, 'middle')}
      <rect x="300" y="380" width="210" height="62" rx="31" fill="#16273d"/>
      ${text(405, 420, 'Favorites', 22, '#f3c969', 800, 'middle')}
      <rect x="525" y="380" width="190" height="62" rx="31" fill="#16273d"/>
      ${text(620, 420, 'Recent', 22, '#aab9cc', 800, 'middle')}
      ${row(485, '♥', 'Fitness', 'Health +4  ·  Energy -10', true)}
      ${row(640, '◇', 'Library', 'Smarts +3  ·  Free', true)}
      ${row(795, '◎', 'Relationships', 'Spend time with people you care about')}
      ${row(950, '$', 'Business', 'Requires age 18  ·  Locked')}
      ${row(1105, '✦', 'Hobbies', 'Practice a skill and build mastery')}
      ${row(1260, '◉', 'Travel', 'Explore cities and discover new events')}
      ${row(1415, '!', 'Crime', 'High risk  ·  Requires age 12')}
    `,
  });
}

function world() {
  return shellScreenshot({
    headline: 'A living world changes every year',
    subheadline: 'Economies, elections, wars, migration, and diplomacy',
    body: `
      <rect x="70" y="115" width="940" height="1710" rx="42" fill="#0b1728" stroke="#26384f" stroke-width="2"/>
      ${text(115, 190, 'World', 38, '#f5f8fc', 900)}
      ${text(115, 230, 'Global simulation overview', 22, '#aab9cc', 500)}
      <rect x="105" y="275" width="870" height="260" rx="32" fill="#101f33" stroke="#26384f" stroke-width="2"/>
      <circle cx="315" cy="405" r="93" fill="none" stroke="#5dd6d0" stroke-width="8"/>
      <path d="M222 405h186M315 312c28 31 43 62 43 93s-15 62-43 93M315 312c-28 31-43 62-43 93s15 62 43 93" fill="none" stroke="#5dd6d0" stroke-width="5"/>
      ${text(500, 360, '13 countries simulated', 29, '#f5f8fc', 800)}
      ${text(500, 410, 'Trade growth  +2.8%', 24, '#52e5a0', 700)}
      ${text(500, 455, 'Global tension  47%', 24, '#ffb45e', 700)}
      ${card(105, 575, 870, 190, '#f3c969', 'ELECTION', 'A reform coalition won the national election.', [])}
      ${card(105, 795, 870, 190, '#ff6b7a', 'CONFLICT', 'Border tensions escalated after failed talks.', [])}
      ${card(105, 1015, 870, 190, '#52e5a0', 'TRADE', 'A new agreement lowered food and energy costs.', [])}
      ${card(105, 1235, 870, 190, '#5dd6d0', 'MIGRATION', 'Workers moved toward fast-growing cities.', [])}
      <rect x="105" y="1475" width="870" height="225" rx="32" fill="#143a2d" stroke="#245a47" stroke-width="2"/>
      ${text(145, 1540, 'Your life is connected to the world', 28, '#52e5a0', 800)}
      ${text(145, 1590, 'Prices, jobs, safety, travel, and politics react', 23, '#d5e9df', 500)}
      ${text(145, 1630, 'to events happening beyond your character.', 23, '#d5e9df', 500)}
    `,
  });
}

function arabicLife() {
  return shellScreenshot({
    headline: 'حياتك. قصتك. اختياراتك.',
    subheadline: 'واجهة عربية كاملة من اليمين إلى اليسار',
    rtl: true,
    body: `
      ${topBar({ name: 'سلمى الإدريسي', age: 'العمر ٢٧', money: '٤٢٬٦٠٠ د.م.', rtl: true })}
      ${text(975, 345, 'قصتك', 26, '#f5f8fc', 900, 'end')}
      ${card(105, 390, 870, 205, '#67a9ff', 'المهنة', 'حصلتِ على ترقية في عملك.', [
        { label: 'المال +٨٠٠٠', positive: true },
        { label: 'التوتر +٦', positive: false },
      ])}
      ${card(105, 625, 870, 205, '#f38ca9', 'العلاقات', 'قررتِ الانتقال للعيش مع شريكك.', [
        { label: 'السعادة +٨', positive: true },
      ])}
      ${card(105, 860, 870, 205, '#5dd6d0', 'العالم', 'ساهم نمو التجارة في انخفاض الأسعار.', [
        { label: 'المال +٥٠٠', positive: true },
      ])}
      ${card(105, 1095, 870, 205, '#f3c969', 'إنجاز', 'أكملتِ هدفا مهما في حياتك.', [
        { label: 'الكارما +٤', positive: true },
      ])}
      ${bottomNavigation({ center: 'تقدم سنة', rtl: true })}
    `,
  });
}

const screenshots = [
  { name: '01-life-story', render: lifeStory },
  { name: '02-decisions', render: decisions },
  { name: '03-activities', render: activities },
  { name: '04-living-world', render: world },
  { name: '05-arabic-rtl', render: arabicLife },
];

async function main() {
  mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  for (const screenshot of screenshots) {
    const output = join(SCREENSHOTS_DIR, `${screenshot.name}.png`);
    await sharp(Buffer.from(screenshot.render())).png().toFile(output);
    console.log('Created:', output);
  }
  console.log('Done -', screenshots.length, 'store screenshots created');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
