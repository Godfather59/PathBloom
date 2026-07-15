// WorldSimulation.js — Full geopolitical world engine

// ─── Government Types ───────────────────────────────────────────────
export const GOVERNMENT_TYPES = {
  democracy: {
    id: 'democracy', label: 'Democracy', stabilityBase: 10, corruptionBase: 20,
    freedom: 85, electionCycle: 4, militaryControl: 20, revolutionRisk: 0.02,
    description: 'Free elections, civil rights, rule of law.',
  },
  monarchy: {
    id: 'monarchy', label: 'Monarchy', stabilityBase: 15, corruptionBase: 30,
    freedom: 40, electionCycle: 0, militaryControl: 40, revolutionRisk: 0.04,
    description: 'Hereditary rule, limited freedoms.',
  },
  dictatorship: {
    id: 'dictatorship', label: 'Dictatorship', stabilityBase: 5, corruptionBase: 50,
    freedom: 10, electionCycle: 0, militaryControl: 70, revolutionRisk: 0.08,
    description: 'Single ruler, no elections, repression.',
  },
  junta: {
    id: 'junta', label: 'Military Junta', stabilityBase: 0, corruptionBase: 40,
    freedom: 5, electionCycle: 0, militaryControl: 90, revolutionRisk: 0.06,
    description: 'Military rulers, martial law.',
  },
  communist: {
    id: 'communist', label: 'Communist State', stabilityBase: 8, corruptionBase: 35,
    freedom: 15, electionCycle: 5, militaryControl: 60, revolutionRisk: 0.03,
    description: 'State-controlled economy, single party.',
  },
  theocracy: {
    id: 'theocracy', label: 'Theocracy', stabilityBase: 12, corruptionBase: 25,
    freedom: 20, electionCycle: 0, militaryControl: 30, revolutionRisk: 0.05,
    description: 'Religious leadership, laws based on faith.',
  },
  federal_republic: {
    id: 'federal_republic', label: 'Federal Republic', stabilityBase: 12, corruptionBase: 15,
    freedom: 90, electionCycle: 4, militaryControl: 15, revolutionRisk: 0.01,
    description: 'Constitutional republic with strong states.',
  },
  failed_state: {
    id: 'failed_state', label: 'Failed State', stabilityBase: -20, corruptionBase: 80,
    freedom: 5, electionCycle: 0, militaryControl: 10, revolutionRisk: 0.2,
    description: 'No central authority, civil wars, chaos.',
  },
};

// ─── Country Definitions (Enhanced) ─────────────────────────────────
export const RAW_COUNTRIES = [
  { id: 'usa', name: 'United States', capital: 'Washington D.C.', continent: 'North America', govType: 'federal_republic', power: 95, population: 331, gdp: 25460, stability: 75, corruption: 25, unemployment: 4, inflation: 3, militaryPower: 90, education: 85, healthcare: 80, technology: 95, happiness: 70, crime: 45, resources: ['oil', 'gas', 'coal', 'agriculture', 'tech'], influence: 95, culture: 'western' },
  { id: 'china', name: 'China', capital: 'Beijing', continent: 'Asia', govType: 'communist', power: 92, population: 1412, gdp: 19910, stability: 80, corruption: 45, unemployment: 5, inflation: 2, militaryPower: 85, education: 75, healthcare: 70, technology: 88, happiness: 65, crime: 30, resources: ['manufacturing', 'rare_earths', 'coal', 'tech'], influence: 90, culture: 'east_asian' },
  { id: 'russia', name: 'Russia', capital: 'Moscow', continent: 'Europe', govType: 'dictatorship', power: 85, population: 144, gdp: 1480, stability: 55, corruption: 65, unemployment: 6, inflation: 7, militaryPower: 88, education: 70, healthcare: 60, technology: 65, happiness: 50, crime: 50, resources: ['oil', 'gas', 'minerals', 'timber'], influence: 75, culture: 'eastern_european' },
  { id: 'uk', name: 'United Kingdom', capital: 'London', continent: 'Europe', govType: 'democracy', power: 78, population: 67, gdp: 3340, stability: 78, corruption: 20, unemployment: 4, inflation: 3, militaryPower: 65, education: 82, healthcare: 85, technology: 82, happiness: 72, crime: 40, resources: ['finance', 'tech', 'pharma'], influence: 70, culture: 'western' },
  { id: 'france', name: 'France', capital: 'Paris', continent: 'Europe', govType: 'democracy', power: 75, population: 65, gdp: 3050, stability: 72, corruption: 28, unemployment: 7, inflation: 3, militaryPower: 70, education: 78, healthcare: 82, technology: 78, happiness: 68, crime: 42, resources: ['agriculture', 'nuclear', 'tourism'], influence: 68, culture: 'western' },
  { id: 'germany', name: 'Germany', capital: 'Berlin', continent: 'Europe', govType: 'federal_republic', power: 82, population: 83, gdp: 4250, stability: 82, corruption: 18, unemployment: 3, inflation: 2, militaryPower: 68, education: 85, healthcare: 85, technology: 88, happiness: 75, crime: 35, resources: ['manufacturing', 'tech', 'engineering'], influence: 72, culture: 'western' },
  { id: 'japan', name: 'Japan', capital: 'Tokyo', continent: 'Asia', govType: 'democracy', power: 80, population: 125, gdp: 4900, stability: 82, corruption: 15, unemployment: 2, inflation: 1, militaryPower: 55, education: 88, healthcare: 88, technology: 92, happiness: 65, crime: 20, resources: ['tech', 'manufacturing', 'automotive'], influence: 65, culture: 'east_asian' },
  { id: 'india', name: 'India', capital: 'New Delhi', continent: 'Asia', govType: 'democracy', power: 70, population: 1428, gdp: 3850, stability: 62, corruption: 55, unemployment: 8, inflation: 5, militaryPower: 72, education: 60, healthcare: 55, technology: 65, happiness: 60, crime: 55, resources: ['agriculture', 'tech', 'pharma', 'minerals'], influence: 60, culture: 'south_asian' },
  { id: 'brazil', name: 'Brazil', capital: 'Brasília', continent: 'South America', govType: 'federal_republic', power: 62, population: 216, gdp: 1840, stability: 50, corruption: 55, unemployment: 9, inflation: 6, militaryPower: 55, education: 55, healthcare: 55, technology: 55, happiness: 60, crime: 65, resources: ['agriculture', 'minerals', 'oil', 'timber'], influence: 45, culture: 'latin_american' },
  { id: 'canada', name: 'Canada', capital: 'Ottawa', continent: 'North America', govType: 'democracy', power: 65, population: 38, gdp: 2000, stability: 88, corruption: 12, unemployment: 5, inflation: 2, militaryPower: 40, education: 85, healthcare: 88, technology: 80, happiness: 78, crime: 25, resources: ['oil', 'timber', 'minerals', 'agriculture'], influence: 50, culture: 'western' },
  { id: 'australia', name: 'Australia', capital: 'Canberra', continent: 'Oceania', govType: 'democracy', power: 70, population: 26, gdp: 1680, stability: 85, corruption: 14, unemployment: 4, inflation: 2, militaryPower: 45, education: 82, healthcare: 82, technology: 78, happiness: 80, crime: 30, resources: ['minerals', 'agriculture', 'energy'], influence: 45, culture: 'western' },
  { id: 'south_korea', name: 'South Korea', capital: 'Seoul', continent: 'Asia', govType: 'democracy', power: 68, population: 52, gdp: 1800, stability: 78, corruption: 25, unemployment: 3, inflation: 2, militaryPower: 60, education: 90, healthcare: 85, technology: 90, happiness: 60, crime: 28, resources: ['tech', 'manufacturing', 'shipbuilding'], influence: 52, culture: 'east_asian' },
  { id: 'mexico', name: 'Mexico', capital: 'Mexico City', continent: 'North America', govType: 'federal_republic', power: 55, population: 128, gdp: 1420, stability: 48, corruption: 60, unemployment: 7, inflation: 5, militaryPower: 45, education: 50, healthcare: 50, technology: 48, happiness: 58, crime: 70, resources: ['oil', 'manufacturing', 'agriculture'], influence: 40, culture: 'latin_american' },
  { id: 'italy', name: 'Italy', capital: 'Rome', continent: 'Europe', govType: 'democracy', power: 60, population: 59, gdp: 2100, stability: 62, corruption: 35, unemployment: 8, inflation: 3, militaryPower: 48, education: 72, healthcare: 78, technology: 70, happiness: 64, crime: 45, resources: ['tourism', 'manufacturing', 'agriculture'], influence: 48, culture: 'western' },
  { id: 'spain', name: 'Spain', capital: 'Madrid', continent: 'Europe', govType: 'democracy', power: 58, population: 47, gdp: 1480, stability: 65, corruption: 30, unemployment: 12, inflation: 3, militaryPower: 42, education: 70, healthcare: 75, technology: 68, happiness: 66, crime: 40, resources: ['tourism', 'agriculture', 'energy'], influence: 42, culture: 'western' },
  { id: 'turkey', name: 'Turkey', capital: 'Ankara', continent: 'Europe', govType: 'dictatorship', power: 60, population: 85, gdp: 820, stability: 45, corruption: 55, unemployment: 10, inflation: 35, militaryPower: 55, education: 58, healthcare: 55, technology: 52, happiness: 45, crime: 50, resources: ['agriculture', 'manufacturing', 'tourism'], influence: 40, culture: 'middle_eastern' },
  { id: 'saudi_arabia', name: 'Saudi Arabia', capital: 'Riyadh', continent: 'Asia', govType: 'monarchy', power: 68, population: 36, gdp: 1040, stability: 70, corruption: 40, unemployment: 8, inflation: 2, militaryPower: 62, education: 60, healthcare: 65, technology: 58, happiness: 58, crime: 25, resources: ['oil', 'gas'], influence: 55, culture: 'middle_eastern' },
  { id: 'uae', name: 'UAE', capital: 'Abu Dhabi', continent: 'Asia', govType: 'monarchy', power: 55, population: 10, gdp: 500, stability: 82, corruption: 22, unemployment: 3, inflation: 2, militaryPower: 40, education: 70, healthcare: 78, technology: 72, happiness: 72, crime: 15, resources: ['oil', 'gas', 'tourism', 'finance'], influence: 42, culture: 'middle_eastern' },
  { id: 'israel', name: 'Israel', capital: 'Jerusalem', continent: 'Asia', govType: 'democracy', power: 62, population: 9, gdp: 520, stability: 55, corruption: 30, unemployment: 4, inflation: 2, militaryPower: 72, education: 88, healthcare: 85, technology: 90, happiness: 62, crime: 30, resources: ['tech', 'innovation', 'agriculture'], influence: 48, culture: 'middle_eastern' },
  { id: 'iran', name: 'Iran', capital: 'Tehran', continent: 'Asia', govType: 'theocracy', power: 58, population: 88, gdp: 430, stability: 42, corruption: 60, unemployment: 12, inflation: 40, militaryPower: 60, education: 60, healthcare: 55, technology: 48, happiness: 38, crime: 40, resources: ['oil', 'gas', 'minerals'], influence: 40, culture: 'middle_eastern' },
  { id: 'egypt', name: 'Egypt', capital: 'Cairo', continent: 'Africa', govType: 'dictatorship', power: 45, population: 110, gdp: 400, stability: 40, corruption: 58, unemployment: 9, inflation: 8, militaryPower: 50, education: 45, healthcare: 45, technology: 40, happiness: 40, crime: 55, resources: ['oil', 'agriculture', 'tourism'], influence: 35, culture: 'middle_eastern' },
  { id: 'nigeria', name: 'Nigeria', capital: 'Abuja', continent: 'Africa', govType: 'federal_republic', power: 42, population: 223, gdp: 510, stability: 35, corruption: 70, unemployment: 33, inflation: 15, militaryPower: 38, education: 40, healthcare: 38, technology: 35, happiness: 42, crime: 65, resources: ['oil', 'agriculture', 'minerals'], influence: 30, culture: 'african' },
  { id: 'south_africa', name: 'South Africa', capital: 'Pretoria', continent: 'Africa', govType: 'democracy', power: 40, population: 60, gdp: 420, stability: 42, corruption: 55, unemployment: 32, inflation: 5, militaryPower: 35, education: 55, healthcare: 50, technology: 48, happiness: 42, crime: 72, resources: ['minerals', 'gold', 'agriculture'], influence: 28, culture: 'african' },
  { id: 'kenya', name: 'Kenya', capital: 'Nairobi', continent: 'Africa', govType: 'democracy', power: 30, population: 55, gdp: 110, stability: 42, corruption: 50, unemployment: 12, inflation: 6, militaryPower: 25, education: 45, healthcare: 40, technology: 35, happiness: 45, crime: 50, resources: ['agriculture', 'tourism', 'tech'], influence: 20, culture: 'african' },
  { id: 'argentina', name: 'Argentina', capital: 'Buenos Aires', continent: 'South America', govType: 'federal_republic', power: 45, population: 46, gdp: 630, stability: 38, corruption: 55, unemployment: 10, inflation: 50, militaryPower: 40, education: 62, healthcare: 60, technology: 52, happiness: 48, crime: 55, resources: ['agriculture', 'energy', 'minerals'], influence: 30, culture: 'latin_american' },
  { id: 'sweden', name: 'Sweden', capital: 'Stockholm', continent: 'Europe', govType: 'democracy', power: 50, population: 10, gdp: 600, stability: 90, corruption: 8, unemployment: 7, inflation: 2, militaryPower: 30, education: 88, healthcare: 90, technology: 85, happiness: 82, crime: 22, resources: ['tech', 'manufacturing', 'innovation'], influence: 35, culture: 'western' },
  { id: 'singapore', name: 'Singapore', capital: 'Singapore', continent: 'Asia', govType: 'autocracy', power: 52, population: 6, gdp: 420, stability: 92, corruption: 12, unemployment: 3, inflation: 2, militaryPower: 35, education: 90, healthcare: 88, technology: 90, happiness: 75, crime: 12, resources: ['finance', 'tech', 'trade'], influence: 40, culture: 'east_asian' },
  { id: 'netherlands', name: 'Netherlands', capital: 'Amsterdam', continent: 'Europe', govType: 'democracy', power: 56, population: 18, gdp: 1050, stability: 85, corruption: 12, unemployment: 4, inflation: 3, militaryPower: 35, education: 85, healthcare: 85, technology: 82, happiness: 80, crime: 28, resources: ['agriculture', 'trade', 'tech'], influence: 40, culture: 'western' },
  { id: 'switzerland', name: 'Switzerland', capital: 'Bern', continent: 'Europe', govType: 'federal_republic', power: 48, population: 9, gdp: 820, stability: 95, corruption: 5, unemployment: 3, inflation: 1, militaryPower: 25, education: 88, healthcare: 92, technology: 88, happiness: 82, crime: 15, resources: ['finance', 'pharma', 'tech'], influence: 38, culture: 'western' },
  { id: 'thailand', name: 'Thailand', capital: 'Bangkok', continent: 'Asia', govType: 'monarchy', power: 50, population: 72, gdp: 530, stability: 48, corruption: 55, unemployment: 5, inflation: 2, militaryPower: 42, education: 55, healthcare: 55, technology: 50, happiness: 55, crime: 45, resources: ['agriculture', 'tourism', 'manufacturing'], influence: 30, culture: 'east_asian' },
  { id: 'poland', name: 'Poland', capital: 'Warsaw', continent: 'Europe', govType: 'democracy', power: 48, population: 38, gdp: 690, stability: 65, corruption: 35, unemployment: 4, inflation: 4, militaryPower: 42, education: 72, healthcare: 68, technology: 62, happiness: 60, crime: 35, resources: ['manufacturing', 'agriculture', 'coal'], influence: 32, culture: 'eastern_european' },
  { id: 'ukraine', name: 'Ukraine', capital: 'Kyiv', continent: 'Europe', govType: 'democracy', power: 40, population: 38, gdp: 180, stability: 35, corruption: 60, unemployment: 10, inflation: 12, militaryPower: 42, education: 70, healthcare: 60, technology: 48, happiness: 38, crime: 45, resources: ['agriculture', 'coal', 'minerals'], influence: 28, culture: 'eastern_european' },
  { id: 'north_korea', name: 'North Korea', capital: 'Pyongyang', continent: 'Asia', govType: 'dictatorship', power: 40, population: 26, gdp: 35, stability: 60, corruption: 70, unemployment: 5, inflation: 0, militaryPower: 55, education: 50, healthcare: 35, technology: 25, happiness: 20, crime: 10, resources: ['minerals', 'coal'], influence: 25, culture: 'east_asian' },
  { id: 'venezuela', name: 'Venezuela', capital: 'Caracas', continent: 'South America', govType: 'dictatorship', power: 30, population: 28, gdp: 45, stability: 18, corruption: 80, unemployment: 25, inflation: 200, militaryPower: 30, education: 45, healthcare: 30, technology: 30, happiness: 25, crime: 80, resources: ['oil'], influence: 15, culture: 'latin_american' },
  { id: 'cuba', name: 'Cuba', capital: 'Havana', continent: 'North America', govType: 'communist', power: 20, population: 11, gdp: 45, stability: 45, corruption: 50, unemployment: 4, inflation: 0, militaryPower: 20, education: 65, healthcare: 75, technology: 35, happiness: 45, crime: 25, resources: ['agriculture', 'pharma'], influence: 12, culture: 'latin_american' },
];

// ─── World State Builder ────────────────────────────────────────────
export function buildWorldState() {
  const countries = {};
  RAW_COUNTRIES.forEach(c => {
    const gov = GOVERNMENT_TYPES[c.govType] || GOVERNMENT_TYPES.democracy;
    countries[c.id] = {
      ...c,
      leaderName: generateLeaderName(c.culture),
      leaderTitle: c.govType === 'monarchy' ? 'King/Queen' : c.govType === 'dictatorship' ? 'Supreme Leader' : 'President',
      leaderApproval: 50 + Math.floor(Math.random() * 30),
      leaderYearsInPower: Math.floor(Math.random() * 8),
      leaderPersonality: ['aggressive', 'peaceful', 'corrupt', 'reformist', 'populist', 'nationalist'][Math.floor(Math.random() * 6)],
      gdp: c.gdp,
      gdpGrowth: 0,
      population: c.population,
      unemployment: c.unemployment,
      inflation: c.inflation,
      militaryPower: c.militaryPower,
      stability: c.stability,
      crime: c.crime,
      education: c.education,
      healthcare: c.healthcare,
      technology: c.technology,
      happiness: c.happiness,
      corruption: c.corruption,
      influence: c.influence,
      debt: Math.floor(Math.random() * 60),
      taxRate: 25 + Math.floor(Math.random() * 20),
      budgetMilitary: 20,
      budgetEducation: 15,
      budgetHealthcare: 15,
      budgetInfrastructure: 10,
      budgetPolice: 10,
      budgetWelfare: 10,
      poverty: 10 + Math.floor(Math.random() * 20),
      tradeBalance: Math.random() > 0.5 ? 1 : -1,
      electionsNext: gov.electionCycle > 0 ? gov.electionCycle : null,
      electionsHeld: 0,
      coupsAttempted: 0,
    disasterRelief: 50,
    lastElectionYear: 0,
    costOfLiving: Math.max(30, Math.min(150, (c.gdp / c.population) * 0.3 + Math.random() * 20)),
    jobMarketStrength: Math.max(10, Math.min(100, 70 - c.unemployment * 2 + (c.technology - 30) / 2)),
    warExhaustion: 0,
    };
  });

  return {
    countries,
    year: 2025,
    globalTension: 30,
    globalEconomy: 'stable',
    climateEvents: [],
    pandemicRisk: 0,
  };
}

function generateLeaderName(culture) {
  const names = {
    western: ['Joseph', 'Sarah', 'Michael', 'Emma', 'John', 'Olivia', 'David', 'Sophia'],
    east_asian: ['Wei', 'Yuki', 'Hyun', 'Mei', 'Hiro', 'Jing', 'Min', 'Sakura'],
    south_asian: ['Arjun', 'Priya', 'Raj', 'Ananya', 'Vikram', 'Lakshmi', 'Sanjay', 'Neha'],
    middle_eastern: ['Ali', 'Fatima', 'Hassan', 'Aisha', 'Omar', 'Layla', 'Khalid', 'Noor'],
    latin_american: ['Carlos', 'Maria', 'Jose', 'Ana', 'Luis', 'Carmen', 'Diego', 'Sofia'],
    african: ['Kwame', 'Amina', 'Chidi', 'Zara', 'Kofi', 'Nadia', 'Amara', 'Olu'],
    eastern_european: ['Ivan', 'Natalia', 'Dmitri', 'Olga', 'Vladimir', 'Tatiana', 'Mikhail', 'Anna'],
  };
  const pool = names[culture] || names.western;
  const last = ['Smith', 'Chen', 'Kim', 'Singh', 'Al-Rashid', 'Garcia', 'Okafor', 'Ivanov', 'Mueller', 'Park'];
  return `${pool[Math.floor(Math.random() * pool.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
}

// ─── World Events ────────────────────────────────────────────────────
const WORLD_EVENT_TEMPLATES = [
  { id: 'economic_boom', name: 'Economic Boom', conditions: c => c.stability > 60 && Math.random() < 0.04, effects: c => { c.gdpGrowth += 3; c.unemployment = Math.max(0, c.unemployment - 2); c.happiness = Math.min(100, c.happiness + 5); }, text: c => `${c.name} is experiencing an economic boom! GDP soaring, unemployment dropping.`, type: 'good' },
  { id: 'recession', name: 'Recession', conditions: c => Math.random() < 0.04, effects: c => { c.gdpGrowth -= 3; c.unemployment = Math.min(30, c.unemployment + 2); c.happiness = Math.max(0, c.happiness - 5); }, text: c => `${c.name} has entered a recession. Jobs lost, economy shrinking.`, type: 'bad' },
  { id: 'natural_disaster', name: 'Natural Disaster', conditions: c => Math.random() < 0.03, effects: c => { c.stability = Math.max(0, c.stability - 8); c.gdpGrowth -= 2; c.happiness = Math.max(0, c.happiness - 8); }, text: c => `A devastating natural disaster has struck ${c.name}.`, type: 'bad' },
  { id: 'corruption_scandal', name: 'Corruption Scandal', conditions: c => c.corruption > 40 && Math.random() < 0.05, effects: c => { c.stability = Math.max(0, c.stability - 5); c.leaderApproval = Math.max(0, c.leaderApproval - 15); }, text: c => `A massive corruption scandal rocks ${c.name}'s government.`, type: 'bad' },
  { id: 'tech_breakthrough', name: 'Tech Breakthrough', conditions: c => c.technology > 60 && Math.random() < 0.03, effects: c => { c.technology = Math.min(100, c.technology + 3); c.gdpGrowth += 2; }, text: c => `${c.name} achieves a major technological breakthrough!`, type: 'good' },
  { id: 'protests', name: 'Mass Protests', conditions: c => c.happiness < 40 && c.stability > 10 && Math.random() < 0.2, effects: c => { c.stability = Math.max(0, c.stability - 10); if (c.stability < 20) c.government = 'failed_state'; }, text: c => `Mass protests have broken out across ${c.name}.`, type: 'bad' },
  { id: 'civil_war', name: 'Civil War', conditions: c => c.stability < 20 && c.happiness < 30 && c.crime > 60 && Math.random() < 0.15, effects: c => { c.stability = Math.max(0, c.stability - 20); c.militaryPower = Math.max(5, c.militaryPower - 15); c.gdpGrowth -= 10; c.population = Math.max(1, c.population - Math.floor(c.population * 0.02)); }, text: c => `CIVIL WAR erupts in ${c.name}! Multiple factions fighting for control.`, type: 'bad' },
  { id: 'election_held', name: 'Election', conditions: c => { const gov = GOVERNMENT_TYPES[c.govType]; return gov && gov.electionCycle > 0 && c.lastElectionYear + gov.electionCycle <= c.electionsHeld; }, effects: c => { c.lastElectionYear = c.electionsHeld; c.leaderName = generateLeaderName(c.culture); c.leaderApproval = 50 + Math.floor(Math.random() * 25); }, text: c => `${c.name} holds national elections. A new leader takes office.`, type: 'neutral' },
  { id: 'coup', name: 'Coup d\'état', conditions: c => c.stability < 25 && c.militaryPower > 50 && Math.random() < 0.08, effects: c => { c.govType = 'junta'; c.leaderName = `Gen. ${generateLeaderName(c.culture)}`; c.leaderTitle = 'Military Commander'; c.stability = Math.max(0, c.stability + 10); c.militaryPower = Math.min(100, c.militaryPower + 5); c.corruption = Math.min(100, c.corruption + 10); c.leaderApproval = 40; }, text: c => `MILITARY COUP in ${c.name}! The army has seized power.`, type: 'bad' },
  { id: 'terror_attack', name: 'Terrorist Attack', conditions: c => c.stability < 50 && Math.random() < 0.02, effects: c => { c.stability = Math.max(0, c.stability - 5); c.happiness = Math.max(0, c.happiness - 5); c.crime = Math.min(100, c.crime + 3); }, text: c => `A terrorist attack in ${c.name} has killed dozens.`, type: 'bad' },
  { id: 'resource_discovery', name: 'Resource Discovery', conditions: c => Math.random() < 0.02, effects: c => { c.gdpGrowth += 4; c.happiness = Math.min(100, c.happiness + 3); }, text: c => `Major resource deposits discovered in ${c.name}! Economic outlook brightens.`, type: 'good' },
  { id: 'refugee_crisis', name: 'Refugee Crisis', conditions: () => Math.random() < 0.03, effects: c => { c.stability = Math.max(0, c.stability - 3); c.crime = Math.min(100, c.crime + 2); c.happiness = Math.max(0, c.happiness - 2); }, text: c => `${c.name} is facing a refugee crisis. Social services strained.`, type: 'bad' },
  { id: 'pandemic_outbreak', name: 'Pandemic', conditions: () => Math.random() < 0.008, effects: c => { c.healthcare = Math.max(5, c.healthcare - 10); c.gdpGrowth -= 5; c.population = Math.max(1, c.population - Math.floor(c.population * 0.005)); c.happiness = Math.max(0, c.happiness - 10); }, text: c => `A deadly pandemic has reached ${c.name}. Healthcare system overwhelmed.`, type: 'bad' },
  { id: 'independence_movement', name: 'Independence Movement', conditions: c => c.stability < 30 && c.happiness < 35 && Math.random() < 0.05, effects: c => { c.stability = Math.max(0, c.stability - 8); }, text: c => `An independence movement is gaining strength in ${c.name}.`, type: 'bad' },
  { id: 'border_conflict', name: 'Border Conflict', conditions: c => c.militaryPower > 40 && c.stability < 50 && Math.random() < 0.03, effects: c => { c.stability = Math.max(0, c.stability - 5); c.militaryPower = Math.min(100, c.militaryPower + 3); c.gdpGrowth -= 2; }, text: c => `A border conflict has erupted between ${c.name} and a neighboring state.`, type: 'bad' },
  { id: 'peace_talks', name: 'Peace Talks', conditions: c => { const isAtWar = c.warExhaustion > 30; return isAtWar && Math.random() < 0.1; }, effects: c => { c.warExhaustion = Math.max(0, c.warExhaustion - 15); c.leaderApproval = Math.min(100, c.leaderApproval + 8); c.stability = Math.min(100, c.stability + 5); }, text: c => `${c.name} has entered peace negotiations to end the conflict.`, type: 'good' },
  { id: 'sanctions', name: 'International Sanctions', conditions: c => c.influence > 40 && c.stability < 40 && Math.random() < 0.025, effects: c => { c.gdpGrowth -= 4; c.inflation = Math.min(100, c.inflation + 5); c.stability = Math.max(0, c.stability - 5); }, text: c => `International sanctions imposed on ${c.name}. Economy crippled.`, type: 'bad' },
  { id: 'propaganda_campaign', name: 'Propaganda Campaign', conditions: c => c.stability < 45 && c.leaderApproval < 40 && Math.random() < 0.04, effects: c => { c.leaderApproval = Math.min(100, c.leaderApproval + 10); c.happiness = Math.min(100, c.happiness + 3); c.corruption = Math.min(100, c.corruption + 5); }, text: c => `${c.name}'s government launched a massive propaganda campaign.`, type: 'neutral' },
  { id: 'assassination', name: 'Assassination', conditions: c => c.stability < 35 && c.corruption > 40 && Math.random() < 0.015, effects: c => { c.leaderName = generateLeaderName(c.culture); c.leaderApproval = 45 + Math.floor(Math.random() * 20); c.stability = Math.max(0, c.stability - 15); c.crime = Math.min(100, c.crime + 5); }, text: c => `The leader of ${c.name} has been ASSASSINATED! Chaos ensues.`, type: 'bad' },
  { id: 'nuclear_escalation', name: 'Nuclear Escalation', conditions: c => c.militaryPower > 80 && c.stability < 20 && Math.random() < 0.005, effects: c => { c.population = Math.max(0.1, c.population * 0.7); c.gdpGrowth -= 25; c.stability = Math.max(0, c.stability - 40); c.technology = Math.max(5, c.technology - 20); c.healthcare = Math.max(5, c.healthcare - 30); }, text: c => `NUCLEAR WEAPONS DETONATED in ${c.name}! Catastrophic devastation.`, type: 'bad' },
];

// ─── AI Country Decisions ───────────────────────────────────────────
function aiDecideWar(country, allCountries, relations) {
  if (!relations || country.stability < 30) return null;
  const targets = Object.keys(relations).filter(id => {
    const rel = relations[id];
    const target = allCountries[id];
    if (!target || !rel) return false;
    if (rel.atWar) return false;
    if (rel.alliance === 'ally') return false;
    if (country.militaryPower < target.militaryPower * 0.7) return false;
    if (rel.relation > 60) return false;
    if (country.leaderPersonality === 'peaceful' && Math.random() < 0.9) return false;
    return true;
  });
  if (targets.length === 0) return null;
  const targetId = targets[Math.floor(Math.random() * targets.length)];
  if (Math.random() < 0.05) return { type: 'declare_war', targetId };
  return null;
}

function aiFormAlliance(country, allCountries, relations) {
  if (!relations) return null;
  const candidates = Object.keys(relations).filter(id => {
    const rel = relations[id];
    const target = allCountries[id];
    if (!target || !rel) return false;
    if (rel.atWar) return false;
    if (rel.alliance === 'ally') return false;
    if (rel.relation < 60) return false;
    if (country.leaderPersonality === 'isolationist') return false;
    return true;
  });
  if (candidates.length === 0) return null;
  const targetId = candidates[Math.floor(Math.random() * candidates.length)];
  if (Math.random() < 0.08) return { type: 'form_alliance', targetId };
  return null;
}

// ─── Main Yearly Simulation ─────────────────────────────────────────
export function simulateWorldYear(worldState, personRelations) {
  if (!worldState || !worldState.countries) return { news: [], changes: [] };

  const news = [];
  const changes = [];
  const countries = worldState.countries;

  worldState.year += 1;
  worldState.globalTension += Math.floor(Math.random() * 6) - 3;
  worldState.globalTension = Math.max(0, Math.min(100, worldState.globalTension));

  const economyRoll = Math.random();
  if (economyRoll < 0.15) worldState.globalEconomy = 'boom';
  else if (economyRoll < 0.25) worldState.globalEconomy = 'recession';
  else worldState.globalEconomy = 'stable';

  if (worldState.pandemicRisk > 0) worldState.pandemicRisk = Math.max(0, worldState.pandemicRisk - 0.05);
  if (Math.random() < 0.02) worldState.pandemicRisk = Math.min(1, worldState.pandemicRisk + 0.3);

  Object.values(countries).forEach(c => {
    const gov = GOVERNMENT_TYPES[c.govType] || GOVERNMENT_TYPES.democracy;
    c.electionsHeld += 1;

    // Base GDP growth
    c.gdpGrowth = (Math.random() - 0.45) * 4 + (worldState.globalEconomy === 'boom' ? 2 : worldState.globalEconomy === 'recession' ? -2 : 0);
    c.gdpGrowth += (c.technology - 50) / 50;
    c.gdpGrowth += (c.stability - 50) / 40;
    c.gdpGrowth += (c.corruption - 50) / -30;
    c.gdpGrowth = Math.max(-10, Math.min(10, c.gdpGrowth));
    c.gdp = Math.max(1, c.gdp * (1 + c.gdpGrowth / 100));

    // Population
    const popGrowth = (c.healthcare / 100) * 0.01 + 0.005 - (c.stability < 20 ? 0.01 : 0);
    c.population = Math.max(0.1, c.population * (1 + popGrowth));

    // Inflation
    if (c.gdpGrowth > 5) c.inflation = Math.min(100, c.inflation + 1);
    else if (c.gdpGrowth < -3) c.inflation = Math.max(0, c.inflation + 2);
    else c.inflation = Math.max(0, c.inflation + (Math.random() - 0.5) * 2);

    // Unemployment
    c.unemployment = Math.max(1, Math.min(40, c.unemployment + (c.gdpGrowth > 0 ? -0.3 : 0.5) + (Math.random() - 0.5) * 1));

    // Stability drift
    c.stability = Math.max(0, Math.min(100, c.stability + (gov.stabilityBase / 10) - (c.corruption / 30) - (c.unemployment / 20) + (c.happiness - 50) / 30 + (Math.random() - 0.5) * 3));

    // Happiness
    c.happiness = Math.max(0, Math.min(100, c.happiness + (c.stability - 50) / 25 - (c.unemployment / 15) - (c.inflation / 20) + (c.gdpGrowth > 0 ? 0.5 : -0.5)));

    // Crime
    c.crime = Math.max(5, Math.min(95, c.crime + (c.unemployment - 10) / 15 - c.stability / 30 + (Math.random() - 0.5) * 2));

    // Education
    c.education = Math.max(5, Math.min(100, c.education + (c.gdpGrowth > 0 ? 0.2 : -0.1) + (Math.random() - 0.5) * 0.5));

    // Healthcare
    c.healthcare = Math.max(5, Math.min(100, c.healthcare + (c.gdpGrowth > 0 ? 0.2 : -0.2) + (Math.random() - 0.5) * 0.5));

    // Corruption
    c.corruption = Math.max(0, Math.min(100, c.corruption + (gov.corruptionBase - c.corruption) / 30 + (Math.random() - 0.5) * 2));

    // Technology
    c.technology = Math.max(5, Math.min(100, c.technology + (c.education - 30) / 50 + (Math.random() - 0.5)));

    // Military power
    c.militaryPower = Math.max(5, Math.min(100, c.militaryPower + (c.budgetMilitary - 20) / 20 + (Math.random() - 0.5) * 2));

    // Influence
    c.influence = Math.max(0, Math.min(100, c.influence + (c.militaryPower + c.gdp / 100 + c.technology) / 100 - 0.5 + (Math.random() - 0.5)));

    // Poverty
    c.poverty = Math.max(5, Math.min(80, c.poverty + c.unemployment / 20 - c.gdpGrowth / 15 - (c.budgetWelfare - 10) / 20 + (Math.random() - 0.5)));

    // Tax
    c.taxRate = Math.max(10, Math.min(70, c.taxRate + (c.debt > 60 ? 1 : c.debt < 20 ? -1 : 0) + (Math.random() - 0.5) * 2));

    // Debt
    c.debt = Math.max(0, Math.min(150, c.debt + (c.gdpGrowth < 0 ? 2 : 0) + (c.taxRate < 20 ? 1 : 0) + (Math.random() - 0.5)));

    // Cost of living & job market
    c.costOfLiving = Math.max(30, Math.min(150, c.costOfLiving + (c.inflation - 3) / 5 + (Math.random() - 0.5) * 2));
    c.jobMarketStrength = Math.max(10, Math.min(100, 70 - c.unemployment * 1.5 + (c.technology - 30) / 3 + (Math.random() - 0.5) * 3));

    // Leader approval drift
    c.leaderApproval = Math.max(0, Math.min(100, c.leaderApproval + (c.happiness - 50) / 20 + (c.stability - 50) / 20 + (c.unemployment - 10) / -15 + (Math.random() - 0.5) * 5));

    // Leader years
    c.leaderYearsInPower += 1;

    // War effects on economy & society (applied per country based on active wars in personRelations)
    if (personRelations) {
      const warsAgainst = Object.entries(personRelations)
        .filter(([_, rel]) => rel && rel.atWar)
        .map(([id, _]) => id);
      const isAtWar = warsAgainst.length > 0;
      if (isAtWar) {
        c.gdpGrowth -= 3;
        c.inflation = Math.min(100, c.inflation + 4);
        c.unemployment = Math.min(40, c.unemployment + 2);
        c.stability = Math.max(0, c.stability - 5);
        c.happiness = Math.max(0, c.happiness - 5);
        c.militaryPower = Math.min(100, c.militaryPower + 2);
        c.crime = Math.min(100, c.crime + 3);
        c.debt = Math.min(150, c.debt + 5);
        c.poverty = Math.min(80, c.poverty + 2);
        c.influence = Math.max(0, c.influence - 2);
        c.warExhaustion = Math.min(100, (c.warExhaustion || 0) + 5 + Math.floor(Math.random() * 5));
        if (c.population > 1) {
          const warCasualties = Math.floor(c.population * (0.001 + Math.random() * 0.004));
          c.population = Math.max(0.5, c.population - warCasualties);
        }
      }
    } else {
      c.warExhaustion = Math.max(0, (c.warExhaustion || 0) - 3);
    }

    // Check elections
    if (gov.electionCycle > 0 && c.lastElectionYear > 0 && c.electionsHeld - c.lastElectionYear >= gov.electionCycle) {
      c.lastElectionYear = c.electionsHeld;
      const won = c.leaderApproval > 40 + Math.random() * 20;
      if (won) {
        c.leaderApproval = 50 + Math.floor(Math.random() * 15);
        news.push({ text: `🗳️ ${c.name} re-elected their leader.`, type: 'good', country: c.id, year: worldState.year });
      } else {
        c.leaderName = generateLeaderName(c.culture);
        c.leaderApproval = 55 + Math.floor(Math.random() * 20);
        c.leaderPersonality = ['aggressive', 'peaceful', 'corrupt', 'reformist', 'populist', 'nationalist'][Math.floor(Math.random() * 6)];
        news.push({ text: `🗳️ ${c.name} elected a new leader: ${c.leaderName}.`, type: 'neutral', country: c.id, year: worldState.year });
      }
      changes.push({ country: c.id, type: 'election' });
    }

    // World events
    for (const template of WORLD_EVENT_TEMPLATES) {
      if (template.conditions(c)) {
        template.effects(c);
        if (c.population <= 0) c.population = 0.1;
        news.push({ text: template.text(c), type: template.type, country: c.id, year: worldState.year });
        break;
      }
    }

      // AI diplomatic decisions
    if (personRelations && c.id !== 'player') {
      const warDecision = aiDecideWar(c, countries, personRelations);
      if (warDecision) {
        news.push({ text: `⚔️ ${c.name} has declared war on ${countries[warDecision.targetId]?.name || warDecision.targetId}!`, type: 'bad', country: c.id, year: worldState.year, action: 'declare_war', targetId: warDecision.targetId });
      }
      const allianceDecision = aiFormAlliance(c, countries, personRelations);
      if (allianceDecision) {
        news.push({ text: `🤝 ${c.name} formed an alliance with ${countries[allianceDecision.targetId]?.name || allianceDecision.targetId}.`, type: 'good', country: c.id, year: worldState.year, action: 'form_alliance', targetId: allianceDecision.targetId });
      }
    }
  });

  return { news, changes, worldState };
}

export function getCountryById(worldState, id) {
  if (!worldState?.countries) return null;
  return worldState.countries[id] || null;
}

export function getGlobalStats(worldState) {
  if (!worldState?.countries) return { avgHappiness: 50, avgStability: 50, totalPopulation: 0, wars: 0, democracies: 0 };
  const values = Object.values(worldState.countries);
  return {
    avgHappiness: Math.round(values.reduce((s, c) => s + c.happiness, 0) / values.length),
    avgStability: Math.round(values.reduce((s, c) => s + c.stability, 0) / values.length),
    totalPopulation: values.reduce((s, c) => s + c.population, 0),
    wars: 0,
    democracies: values.filter(c => c.govType === 'democracy' || c.govType === 'federal_republic').length,
  };
}
