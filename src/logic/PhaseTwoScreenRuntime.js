import { getCurrentTimePerson } from './TimeProgression';
import { formatArabicMoney, formatArabicNumber } from './ArabicLocalization';

let observer = null;
let processing = false;

function currentLanguage() {
  try {
    return localStorage.getItem('pathbloom_language') === 'ar' ||
      localStorage.getItem('lifepath_language') === 'ar'
      ? 'ar'
      : 'en';
  } catch {
    return document.documentElement.lang?.startsWith('ar') ? 'ar' : 'en';
  }
}

function money(value, language) {
  const amount = Math.round(Number(value) || 0);
  return language === 'ar'
    ? formatArabicMoney(amount, 'USD')
    : `$${amount.toLocaleString('en-US')}`;
}

function number(value, language) {
  const amount = Math.round(Number(value) || 0);
  return language === 'ar'
    ? formatArabicNumber(amount, { maximumFractionDigits: 0 })
    : amount.toLocaleString('en-US');
}

function calculateAssets(person) {
  const ownedValue = (person?.assets || []).reduce(
    (sum, asset) => sum + Math.max(0, Number(asset?.value ?? asset?.price) || 0),
    0
  );
  const portfolioValue = (person?.portfolio || []).reduce(
    (sum, position) => sum + Math.max(0, Number(position?.currentValue ?? position?.value) || 0),
    0
  );
  const mortgageDebt = (person?.assets || []).reduce(
    (sum, asset) => sum + Math.max(0, Number(asset?.mortgage?.balance) || 0),
    0
  );
  const debt =
    Math.max(0, Number(person?.loans) || 0) +
    Math.max(0, Number(person?.personalDebt) || 0) +
    mortgageDebt;
  const cash = Number(person?.money) || 0;
  return {
    cash,
    ownedValue,
    portfolioValue,
    debt,
    netWorth: cash + ownedValue + portfolioValue - debt,
    ownedCount: (person?.assets || []).length,
    positions: (person?.portfolio || []).length,
  };
}

function createMetric(icon, label, value, tone = '') {
  const card = document.createElement('div');
  card.className = `phase-two-assets-runtime-metric ${tone}`.trim();
  const top = document.createElement('div');
  const symbol = document.createElement('span');
  symbol.textContent = icon;
  const strong = document.createElement('strong');
  strong.textContent = value;
  strong.dir = 'auto';
  top.append(symbol, strong);
  const caption = document.createElement('small');
  caption.textContent = label;
  card.append(top, caption);
  return card;
}

function enhanceAssets(overlay) {
  if (!overlay || overlay.dataset.phaseTwoAssets === '1') return;
  const title = overlay.querySelector('.modal-title');
  const tabs = [...overlay.querySelectorAll('button')].map(button => button.textContent || '').join(' ');
  const signature = `${title?.textContent || ''} ${tabs}`.toLowerCase();
  if (!/(assets|shopping|my assets|real estate|investments|الأصول|العقارات|الاستثمارات)/i.test(signature)) {
    return;
  }

  overlay.dataset.phaseTwoAssets = '1';
  overlay.classList.add('phase-two-assets-host');
  const content = overlay.querySelector('.modal-content');
  if (!content) return;
  content.classList.add('phase-two-assets-content');

  const person = getCurrentTimePerson();
  const language = currentLanguage();
  const values = calculateAssets(person);
  const copy = language === 'ar'
    ? {
        netWorth: 'صافي الثروة',
        cash: 'النقد',
        assets: 'قيمة الأصول',
        debt: 'إجمالي الدين',
        holdings: `${number(values.ownedCount, language)} أصل · ${number(values.positions, language)} استثمار`,
      }
    : {
        netWorth: 'Net worth',
        cash: 'Cash',
        assets: 'Asset value',
        debt: 'Total debt',
        holdings: `${number(values.ownedCount, language)} assets · ${number(values.positions, language)} investments`,
      };

  const summary = document.createElement('section');
  summary.className = 'phase-two-assets-runtime-summary';
  const heading = document.createElement('div');
  heading.className = 'phase-two-assets-runtime-heading';
  const headingCopy = document.createElement('div');
  const headingTitle = document.createElement('strong');
  headingTitle.textContent = copy.netWorth;
  const headingHint = document.createElement('small');
  headingHint.textContent = copy.holdings;
  headingCopy.append(headingTitle, headingHint);
  const total = document.createElement('b');
  total.textContent = money(values.netWorth, language);
  total.dir = 'auto';
  heading.append(headingCopy, total);

  const metrics = document.createElement('div');
  metrics.className = 'phase-two-assets-runtime-metrics';
  metrics.append(
    createMetric('💵', copy.cash, money(values.cash, language), 'growth'),
    createMetric('🏠', copy.assets, money(values.ownedValue + values.portfolioValue, language), 'world'),
    createMetric('💳', copy.debt, money(values.debt, language), values.debt > 0 ? 'danger' : '')
  );
  summary.append(heading, metrics);

  const header = content.querySelector('.modal-header');
  if (header?.nextSibling) content.insertBefore(summary, header.nextSibling);
  else content.append(summary);
}

function enhanceRelationships(root) {
  if (!root || root.dataset.phaseTwoRelationships === '1') return;
  root.dataset.phaseTwoRelationships = '1';
  root.classList.add('phase-two-relationships-host');
  const panel = root.querySelector(':scope > .animate-slide-up');
  panel?.classList.add('phase-two-relationships-content');
}

function scan(root = document) {
  if (processing || !root) return;
  processing = true;
  try {
    if (root instanceof Element && root.matches('.relationships-menu')) enhanceRelationships(root);
    root.querySelectorAll?.('.relationships-menu').forEach(enhanceRelationships);

    if (root instanceof Element && root.matches('.modal-overlay')) enhanceAssets(root);
    root.querySelectorAll?.('.modal-overlay').forEach(enhanceAssets);
  } finally {
    processing = false;
  }
}

export function installPhaseTwoScreenRuntime() {
  if (typeof document === 'undefined' || observer) return () => {};
  observer = new MutationObserver(mutations => {
    if (processing) return;
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) scan(node);
      });
    });
  });
  observer.observe(document.documentElement, { subtree: true, childList: true });
  scan(document);
  return () => {
    observer?.disconnect();
    observer = null;
  };
}
