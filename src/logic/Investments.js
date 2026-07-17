export const STOCKS = [
  {
    id: 'sp500',
    name: 'S&P 500 Index',
    type: 'stock',
    volatility: 0.1,
    risk: 'low',
    sector: 'index',
    dividendYield: 0.015,
  },
  {
    id: 'tech',
    name: 'Tech ETF',
    type: 'stock',
    volatility: 0.2,
    risk: 'medium',
    sector: 'index',
    dividendYield: 0.005,
  },
  {
    id: 'pharma',
    name: 'Pharma Giant',
    type: 'stock',
    volatility: 0.15,
    risk: 'medium',
    sector: 'index',
    dividendYield: 0.02,
  },
  {
    id: 'startups',
    name: 'Emerging Startups',
    type: 'stock',
    volatility: 0.4,
    risk: 'high',
    sector: 'index',
    dividendYield: 0,
  },
];

export const COMPANY_STOCKS = [
  {
    id: 'aapl',
    name: 'Apple Inc.',
    type: 'stock',
    volatility: 0.18,
    risk: 'medium',
    sector: 'tech',
    dividendYield: 0.008,
  },
  {
    id: 'tsla',
    name: 'Tesla Inc.',
    type: 'stock',
    volatility: 0.35,
    risk: 'high',
    sector: 'auto',
    dividendYield: 0,
  },
  {
    id: 'amzn',
    name: 'Amazon.com',
    type: 'stock',
    volatility: 0.22,
    risk: 'medium',
    sector: 'tech',
    dividendYield: 0,
  },
  {
    id: 'googl',
    name: 'Alphabet Inc.',
    type: 'stock',
    volatility: 0.2,
    risk: 'medium',
    sector: 'tech',
    dividendYield: 0.004,
  },
  {
    id: 'jnj',
    name: 'Johnson & Johnson',
    type: 'stock',
    volatility: 0.12,
    risk: 'low',
    sector: 'healthcare',
    dividendYield: 0.028,
  },
  {
    id: 'jpm',
    name: 'JPMorgan Chase',
    type: 'stock',
    volatility: 0.2,
    risk: 'medium',
    sector: 'finance',
    dividendYield: 0.025,
  },
  {
    id: 'nflx',
    name: 'Netflix Inc.',
    type: 'stock',
    volatility: 0.28,
    risk: 'high',
    sector: 'tech',
    dividendYield: 0,
  },
  {
    id: 'dis',
    name: 'Walt Disney Co.',
    type: 'stock',
    volatility: 0.18,
    risk: 'medium',
    sector: 'entertainment',
    dividendYield: 0.012,
  },
  {
    id: 'xom',
    name: 'Exxon Mobil',
    type: 'stock',
    volatility: 0.22,
    risk: 'medium',
    sector: 'energy',
    dividendYield: 0.035,
  },
  {
    id: 'ba',
    name: 'Boeing Co.',
    type: 'stock',
    volatility: 0.25,
    risk: 'high',
    sector: 'aerospace',
    dividendYield: 0.01,
  },
];

export const CRYPTO = [
  {
    id: 'btc',
    name: 'BitCoin',
    type: 'crypto',
    volatility: 0.6,
    risk: 'high',
    sector: 'crypto',
    dividendYield: 0,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    type: 'crypto',
    volatility: 0.5,
    risk: 'high',
    sector: 'crypto',
    dividendYield: 0,
  },
  {
    id: 'doge',
    name: 'DogeCoin',
    type: 'crypto',
    volatility: 0.9,
    risk: 'extreme',
    sector: 'crypto',
    dividendYield: 0,
  },
];

export const SECTOR_BONUS = {
  tech: { Boom: 0.05, Normal: 0.02, Recession: -0.06 },
  auto: { Boom: 0.06, Normal: 0.01, Recession: -0.1 },
  healthcare: { Boom: 0.03, Normal: 0.02, Recession: -0.02 },
  finance: { Boom: 0.07, Normal: 0.02, Recession: -0.12 },
  entertainment: { Boom: 0.04, Normal: 0.01, Recession: -0.08 },
  energy: { Boom: 0.08, Normal: 0.01, Recession: -0.15 },
  aerospace: { Boom: 0.04, Normal: 0.01, Recession: -0.08 },
  index: { Boom: 0.03, Normal: 0.01, Recession: -0.05 },
  crypto: { Boom: 0.1, Normal: 0, Recession: -0.15 },
};

const IPO_POOL = [
  { name: 'Quantum Computing Inc.', sector: 'tech', volatility: 0.4, dividendYield: 0 },
  { name: 'Green Energy Corp.', sector: 'energy', volatility: 0.3, dividendYield: 0.01 },
  { name: 'BioGenix Therapeutics', sector: 'healthcare', volatility: 0.35, dividendYield: 0 },
  { name: 'CloudFront Systems', sector: 'tech', volatility: 0.25, dividendYield: 0 },
  { name: 'AutoDrive AI', sector: 'auto', volatility: 0.4, dividendYield: 0 },
  { name: 'SpaceXplore Inc.', sector: 'aerospace', volatility: 0.38, dividendYield: 0 },
  { name: 'FinTech Global', sector: 'finance', volatility: 0.28, dividendYield: 0.005 },
  { name: 'StreamFlix Media', sector: 'entertainment', volatility: 0.32, dividendYield: 0 },
];

let nextIpoId = 1;
let activeIPOs = [];

export function generateIPO() {
  const template = IPO_POOL[Math.floor(Math.random() * IPO_POOL.length)];
  const ipo = {
    id: `ipo_${nextIpoId++}`,
    name: template.name,
    type: 'stock',
    volatility: template.volatility + (Math.random() - 0.5) * 0.1,
    risk: template.volatility > 0.35 ? 'high' : 'medium',
    sector: template.sector,
    dividendYield: template.dividendYield,
    ipoAge: 0,
    ipoPrice: 5 + Math.random() * 45,
  };
  activeIPOs.push(ipo);
  return ipo;
}

export function getActiveIPOs() {
  return activeIPOs;
}

export function getInvestmentMarketState() {
  return {
    nextIpoId,
    activeIPOs: activeIPOs.map(ipo => ({ ...ipo })),
  };
}

export function restoreInvestmentMarketState(state = {}) {
  const restoredIPOs = Array.isArray(state?.activeIPOs)
    ? state.activeIPOs
        .filter(ipo => ipo && typeof ipo.id === 'string' && typeof ipo.name === 'string')
        .map(ipo => {
          const ipoAge = Number(ipo.ipoAge);
          const ipoPrice = Number(ipo.ipoPrice);
          const volatility = Number(ipo.volatility);
          const dividendYield = Number(ipo.dividendYield);
          return {
            id: ipo.id,
            name: ipo.name,
            type: 'stock',
            volatility: Number.isFinite(volatility) ? Math.max(0, Math.min(1, volatility)) : 0.3,
            risk: ['low', 'medium', 'high', 'extreme'].includes(ipo.risk) ? ipo.risk : 'medium',
            sector: typeof ipo.sector === 'string' ? ipo.sector : 'index',
            dividendYield: Number.isFinite(dividendYield)
              ? Math.max(0, Math.min(1, dividendYield))
              : 0,
            ipoAge: Number.isFinite(ipoAge) ? Math.max(0, Math.floor(ipoAge)) : 0,
            ipoPrice: Number.isFinite(ipoPrice) ? Math.max(0.01, ipoPrice) : 0.01,
          };
        })
    : [];
  const highestSavedId = restoredIPOs.reduce((highest, ipo) => {
    const match = /^ipo_(\d+)$/.exec(ipo.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  const savedNextId = Number(state?.nextIpoId);
  const requestedNextId = Number.isFinite(savedNextId) ? Math.max(1, Math.floor(savedNextId)) : 1;

  activeIPOs = restoredIPOs;
  nextIpoId = Math.max(requestedNextId, highestSavedId + 1);
  return getInvestmentMarketState();
}

export function resetInvestmentMarketState() {
  activeIPOs = [];
  nextIpoId = 1;
}

export function clearOldIPOs() {
  activeIPOs = activeIPOs.filter(ipo => ipo.ipoAge < 15);
}

export function ageIPOs() {
  activeIPOs.forEach(ipo => {
    ipo.ipoAge += 1;
  });
}

export function getAllInvestableAssets() {
  return [...STOCKS, ...COMPANY_STOCKS, ...CRYPTO, ...activeIPOs];
}

export function getSectorPerformance(economy) {
  const result = {};
  for (const [sector, bonuses] of Object.entries(SECTOR_BONUS)) {
    result[sector] = bonuses[economy] || bonuses.Normal || 0;
  }
  return result;
}

export function getDividendPayout(asset, currentValue) {
  if (!asset.dividendYield || asset.dividendYield <= 0) {
    return 0;
  }
  return Math.floor(currentValue * asset.dividendYield);
}

export function getInvestmentReturn(asset, economy) {
  let change = 0;
  const { volatility } = asset;

  if (asset.type === 'crypto') {
    const sentiment = Math.random();
    if (sentiment > 0.9) {
      change = 2.0;
    } else if (sentiment < 0.2) {
      change = -0.5;
    } else {
      change = (Math.random() - 0.5) * volatility;
    }
    return change;
  }

  const baseReturn = economy === 'Boom' ? 0.08 : economy === 'Recession' ? -0.08 : 0.03;
  const sectorBonus = SECTOR_BONUS[asset.sector]
    ? SECTOR_BONUS[asset.sector][economy] || SECTOR_BONUS[asset.sector].Normal || 0
    : 0;
  const noise = (Math.random() - 0.5) * volatility;
  change = baseReturn + sectorBonus + noise;
  return change;
}

export function getMarketNews(economy, stocks, sectors) {
  const headlines = [];
  if (economy === 'Boom') {
    headlines.push('📈 Economy booming! Broad market rally across all sectors.');
  } else if (economy === 'Recession') {
    headlines.push('📉 Economy in recession — markets down across the board.');
  }

  const bestSector = Object.entries(sectors).sort((a, b) => b[1] - a[1])[0];
  const worstSector = Object.entries(sectors).sort((a, b) => a[1] - b[1])[0];
  if (bestSector && bestSector[1] > 0.03) {
    headlines.push(
      `⭐ ${bestSector[0].charAt(0).toUpperCase() + bestSector[0].slice(1)} sector is outperforming this year.`
    );
  }
  if (worstSector && worstSector[1] < -0.03) {
    headlines.push(
      `⚠️ ${worstSector[0].charAt(0).toUpperCase() + worstSector[0].slice(1)} sector is underperforming.`
    );
  }

  stocks.forEach(s => {
    if (s.sector === 'index' || s.sector === 'crypto') {
      return;
    }
    const perf = getInvestmentReturn(s, economy);
    if (perf > 0.4) {
      headlines.push(`🚀 ${s.name} surged ${Math.round(perf * 100)}% this year!`);
    } else if (perf < -0.3) {
      headlines.push(`📉 ${s.name} dropped ${Math.round(Math.abs(perf) * 100)}% this year.`);
    }
  });

  if (headlines.length > 3) {
    return headlines.slice(0, 3 + Math.floor(Math.random() * 2));
  }
  return headlines.length > 0 ? headlines : ['📊 Markets were relatively stable this year.'];
}
