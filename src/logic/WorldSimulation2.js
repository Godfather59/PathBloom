import { COUNTRY_NAME_AR, WORLD2_COUNTRY_TEMPLATES, WORLD2_VERSION } from './WorldSimulation2Data';

const MAX_TIMELINE = 300;
const MAX_WARS = 12;
const MAX_FLOWS = 80;
const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0));
const round = (value, digits = 2) => Number((Number(value) || 0).toFixed(digits));
const pick = values => values[Math.floor(Math.random() * values.length)];
const monthNow = person => Math.max(0, Math.floor(Number(person?.age) || 0) * 12 + Math.floor(Number(person?.timeProgress?.month) || 0));
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
const relationKey = (left, right) => [left, right].sort().join('::');

function copy(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === 'function') {
    try { return structuredClone(value); } catch { /* older WebViews */ }
  }
  return JSON.parse(JSON.stringify(value));
}

function makeLeader(template) {
  return {
    name: template.leader,
    age: 45 + Math.floor(Math.random() * 25),
    approval: clamp(template.stability + Math.floor(Math.random() * 21) - 10),
    traits: [...template.traits],
    monthsInOffice: Math.floor(Math.random() * 72),
  };
}

function makeCountry(template) {
  const taxRate = template.government.includes('Monarchy') ? 0.18 : template.freedom < 30 ? 0.22 : 0.27;
  const revenue = template.gdp * taxRate;
  return {
    id: slug(template.name),
    name: template.name,
    population: template.population,
    gdp: template.gdp,
    growth: 2.2,
    government: template.government,
    ideology: template.ideology,
    leader: makeLeader(template),
    stability: template.stability,
    freedom: template.freedom,
    corruption: template.corruption,
    military: template.military,
    technology: template.technology,
    resources: { energy: template.energy, food: template.food, minerals: template.minerals },
    inflation: template.inflation,
    unemployment: template.unemployment,
    debt: round(template.gdp * template.debtRatio / 100),
    debtRatio: template.debtRatio,
    treasury: round(revenue * 0.08),
    budget: {
      taxRate,
      revenue: round(revenue),
      military: round(revenue * 0.16),
      welfare: round(revenue * 0.22),
      infrastructure: round(revenue * 0.16),
      education: round(revenue * 0.16),
      healthcare: round(revenue * 0.18),
      security: round(revenue * 0.07),
      other: round(revenue * 0.05),
    },
    alliances: [],
    tradePacts: [],
    rivals: [],
    sanctionsFrom: [],
    sanctionsAgainst: [],
    atWar: [],
    refugeesHosted: 0,
    refugeesAbroad: 0,
    migrationPressure: 0,
    warWeariness: 0,
    shortages: { energy: 0, food: 0, medicine: 0 },
    electionDueMonths: template.freedom >= 55 ? 12 + Math.floor(Math.random() * 48) : 999,
    regimeAgeMonths: 12 + Math.floor(Math.random() * 240),
    territoryControl: 100,
    lastMonthlyBalance: 0,
  };
}

function makeRelation(left, right) {
  const bothDemocratic = left.freedom >= 60 && right.freedom >= 60;
  const ideologyMatch = left.ideology === right.ideology;
  let score = 5 + (bothDemocratic ? 15 : 0) + (ideologyMatch ? 10 : 0) + Math.floor(Math.random() * 21) - 10;
  const friendlyPairs = [
    ['United States', 'Canada'], ['United States', 'United Kingdom'], ['France', 'Germany'],
    ['France', 'Morocco'], ['Saudi Arabia', 'UAE'], ['Japan', 'United States'],
  ];
  if (friendlyPairs.some(pair => pair.includes(left.name) && pair.includes(right.name))) score += 45;
  const tensePairs = [['United States', 'Russia'], ['United States', 'China'], ['Japan', 'China']];
  if (tensePairs.some(pair => pair.includes(left.name) && pair.includes(right.name))) score -= 45;
  return {
    score: clamp(score, -100, 100),
    trade: clamp(35 + score / 3 + Math.floor(Math.random() * 25), 0, 100),
    alliance: score >= 65,
    rivalry: score <= -55,
    sanctions: false,
    borderTension: clamp(Math.max(0, -score - 25), 0, 100),
    lastChange: 0,
  };
}

function logWorld(world, type, en, ar, metadata = {}) {
  world.timeline.unshift({
    id: `world2_${world.month}_${world.sequence++}`,
    month: world.month,
    year: world.year,
    type,
    text: { en, ar },
    ...metadata,
  });
  world.timeline = world.timeline.slice(0, MAX_TIMELINE);
}

function createInitialWorld() {
  const countries = Object.fromEntries(WORLD2_COUNTRY_TEMPLATES.map(template => {
    const country = makeCountry(template);
    return [country.name, country];
  }));
  const names = Object.keys(countries);
  const relations = {};
  for (let leftIndex = 0; leftIndex < names.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex += 1) {
      const left = countries[names[leftIndex]];
      const right = countries[names[rightIndex]];
      const relation = makeRelation(left, right);
      relations[relationKey(left.name, right.name)] = relation;
      if (relation.alliance) {
        left.alliances.push(right.name);
        right.alliances.push(left.name);
      }
      if (relation.trade >= 58) {
        left.tradePacts.push(right.name);
        right.tradePacts.push(left.name);
      }
      if (relation.rivalry) {
        left.rivals.push(right.name);
        right.rivals.push(left.name);
      }
    }
  }
  return {
    version: WORLD2_VERSION,
    month: 0,
    year: 2026,
    sequence: 1,
    countries,
    relations,
    wars: [],
    treaties: [],
    sanctions: [],
    migrationFlows: [],
    timeline: [],
    global: { growth: 2.4, inflation: 3.2, trade: 68, tension: 36, refugees: 0 },
    playerTriggers: {},
  };
}

function normalizeCountry(country, fallback) {
  const fresh = makeCountry(fallback);
  const merged = { ...fresh, ...(country || {}) };
  merged.leader = { ...fresh.leader, ...(country?.leader || {}) };
  merged.resources = { ...fresh.resources, ...(country?.resources || {}) };
  merged.budget = { ...fresh.budget, ...(country?.budget || {}) };
  merged.shortages = { energy: 0, food: 0, medicine: 0, ...(country?.shortages || {}) };
  ['alliances', 'tradePacts', 'rivals', 'sanctionsFrom', 'sanctionsAgainst', 'atWar'].forEach(key => {
    merged[key] = Array.isArray(merged[key]) ? [...new Set(merged[key])] : [];
  });
  return merged;
}

export function ensureWorldSimulation2(person) {
  if (!person || typeof person !== 'object') return null;
  const current = person.worldSimulation2 && typeof person.worldSimulation2 === 'object'
    ? person.worldSimulation2
    : createInitialWorld();
  const defaults = createInitialWorld();
  current.version = WORLD2_VERSION;
  current.month = Math.max(0, Math.floor(Number(current.month) || 0));
  current.year = Math.max(2026, Math.floor(Number(current.year) || 2026));
  current.sequence = Math.max(1, Math.floor(Number(current.sequence) || 1));
  current.countries = current.countries && typeof current.countries === 'object' ? current.countries : {};
  WORLD2_COUNTRY_TEMPLATES.forEach(template => {
    current.countries[template.name] = normalizeCountry(current.countries[template.name], template);
  });
  current.relations = current.relations && typeof current.relations === 'object' ? current.relations : defaults.relations;
  current.wars = Array.isArray(current.wars) ? current.wars.slice(-MAX_WARS) : [];
  current.treaties = Array.isArray(current.treaties) ? current.treaties.slice(-80) : [];
  current.sanctions = Array.isArray(current.sanctions) ? current.sanctions.slice(-80) : [];
  current.migrationFlows = Array.isArray(current.migrationFlows) ? current.migrationFlows.slice(-MAX_FLOWS) : [];
  current.timeline = Array.isArray(current.timeline) ? current.timeline.slice(0, MAX_TIMELINE) : [];
  current.global = { ...defaults.global, ...(current.global || {}) };
  current.playerTriggers = current.playerTriggers && typeof current.playerTriggers === 'object' ? current.playerTriggers : {};
  person.worldSimulation2 = current;
  return current;
}

function relation(world, left, right) {
  const key = relationKey(left, right);
  if (!world.relations[key]) {
    world.relations[key] = makeRelation(world.countries[left], world.countries[right]);
  }
  return world.relations[key];
}

function setLinked(list, value, enabled) {
  const values = new Set(Array.isArray(list) ? list : []);
  if (enabled) values.add(value); else values.delete(value);
  return [...values];
}

function updateAlliance(world, leftName, rightName, enabled) {
  const rel = relation(world, leftName, rightName);
  rel.alliance = enabled;
  world.countries[leftName].alliances = setLinked(world.countries[leftName].alliances, rightName, enabled);
  world.countries[rightName].alliances = setLinked(world.countries[rightName].alliances, leftName, enabled);
}

function updateRivalry(world, leftName, rightName, enabled) {
  const rel = relation(world, leftName, rightName);
  rel.rivalry = enabled;
  world.countries[leftName].rivals = setLinked(world.countries[leftName].rivals, rightName, enabled);
  world.countries[rightName].rivals = setLinked(world.countries[rightName].rivals, leftName, enabled);
}

function processEconomy(world, country) {
  const sanctionPenalty = country.sanctionsFrom.length * 0.12;
  const warPenalty = country.atWar.length * 0.42;
  const resourceBonus = (country.resources.energy + country.resources.food + country.resources.minerals - 150) / 280;
  const stabilityBonus = (country.stability - 50) / 55;
  const randomShock = (Math.random() - 0.5) * 0.7;
  const annualGrowth = clamp(2 + resourceBonus + stabilityBonus - sanctionPenalty - warPenalty + randomShock, -9, 9);
  country.growth = round(annualGrowth);
  country.gdp = Math.max(12, round(country.gdp * (1 + annualGrowth / 1200)));

  const inflationPressure = warPenalty * 0.65 + sanctionPenalty * 0.7 + Math.max(0, country.shortages.energy + country.shortages.food - 70) / 120;
  country.inflation = round(clamp(country.inflation + inflationPressure + (Math.random() - 0.52) * 0.45, -1, 35));
  country.unemployment = round(clamp(country.unemployment - annualGrowth / 45 + (Math.random() - 0.5) * 0.25, 1.5, 32));

  const annualRevenue = country.gdp * clamp(country.budget.taxRate, 0.02, 0.55);
  country.budget.revenue = round(annualRevenue);
  const annualSpending = ['military', 'welfare', 'infrastructure', 'education', 'healthcare', 'security', 'other']
    .reduce((sum, key) => sum + Math.max(0, Number(country.budget[key]) || 0), 0);
  const monthlyBalance = (annualRevenue - annualSpending) / 12;
  country.lastMonthlyBalance = round(monthlyBalance);
  country.treasury = round(Math.max(0, country.treasury + monthlyBalance));
  if (monthlyBalance < 0) country.debt = round(country.debt + Math.abs(monthlyBalance));
  else country.debt = round(Math.max(0, country.debt - monthlyBalance * 0.35));
  country.debtRatio = round(clamp(country.debt / Math.max(1, country.gdp) * 100, 0, 400));

  country.shortages.energy = round(clamp(country.shortages.energy + country.atWar.length * 1.1 + country.sanctionsFrom.length * 0.8 - country.resources.energy / 140, 0, 100));
  country.shortages.food = round(clamp(country.shortages.food + country.atWar.length * 0.8 - country.resources.food / 180, 0, 100));
  country.shortages.medicine = round(clamp(country.shortages.medicine + country.sanctionsFrom.length * 0.7 + country.atWar.length * 0.5 - country.technology / 240, 0, 100));
  country.stability = round(clamp(country.stability + annualGrowth / 25 - Math.max(0, country.inflation - 8) / 18 - country.unemployment / 160 - country.warWeariness / 300, 0, 100));
}

function replacementLeader(country) {
  const first = pick(['Amal', 'Lina', 'Omar', 'Youssef', 'Maya', 'Daniel', 'Emma', 'Lucas', 'Noor', 'Kenji', 'Anika', 'Rafael']);
  const last = pick(['Rahman', 'Martin', 'Costa', 'Weber', 'Sato', 'Morgan', 'Bennani', 'Singh', 'Chen', 'Dubois', 'Haddad']);
  return {
    name: `${first} ${last}`,
    age: 38 + Math.floor(Math.random() * 28),
    approval: 48 + Math.floor(Math.random() * 22),
    traits: [pick(['reformist', 'pragmatic', 'populist', 'technocratic', 'nationalist', 'diplomatic'])],
    monthsInOffice: 0,
  };
}

function processPolitics(world, country) {
  country.regimeAgeMonths += 1;
  country.leader.monthsInOffice += 1;
  country.leader.approval = round(clamp(country.leader.approval + (country.growth > 2 ? 0.25 : -0.2) - Math.max(0, country.inflation - 6) / 25 + (Math.random() - 0.5), 5, 95));

  if (country.freedom >= 55) {
    country.electionDueMonths -= 1;
    if (country.electionDueMonths <= 0) {
      const incumbentWins = Math.random() < clamp(country.leader.approval / 100, 0.25, 0.78);
      if (!incumbentWins) country.leader = replacementLeader(country);
      country.electionDueMonths = 42 + Math.floor(Math.random() * 31);
      country.stability = clamp(country.stability + (incumbentWins ? 1 : 3));
      logWorld(
        world,
        'election',
        `${country.name} held a national election. ${incumbentWins ? 'The incumbent remained in office.' : `${country.leader.name} formed a new government.`}`,
        `أجرت ${COUNTRY_NAME_AR[country.name] || country.name} انتخابات وطنية. ${incumbentWins ? 'بقيت الحكومة الحالية في السلطة.' : `شكّل ${country.leader.name} حكومة جديدة.`}`,
        { countries: [country.name] }
      );
      country.lastPoliticalEvent = 'election';
    }
  }

  const coupRisk = country.freedom < 45 && country.stability < 32 && country.corruption > 55 ? 0.025 : 0;
  const revolutionRisk = country.stability < 24 && country.unemployment > 14 ? 0.018 : 0;
  if (coupRisk && Math.random() < coupRisk) {
    country.government = 'Military Government';
    country.leader = replacementLeader(country);
    country.freedom = clamp(country.freedom - 12);
    country.stability = 42;
    country.military = clamp(country.military + 4);
    country.lastPoliticalEvent = 'coup';
    logWorld(world, 'coup', `A military coup replaced the government of ${country.name}.`, `أطاح انقلاب عسكري بحكومة ${COUNTRY_NAME_AR[country.name] || country.name}.`, { countries: [country.name] });
  } else if (revolutionRisk && Math.random() < revolutionRisk) {
    country.government = 'Transitional Government';
    country.leader = replacementLeader(country);
    country.freedom = clamp(country.freedom + 15);
    country.stability = 35;
    country.corruption = clamp(country.corruption - 8);
    country.lastPoliticalEvent = 'revolution';
    logWorld(world, 'revolution', `Mass protests forced a transitional government in ${country.name}.`, `أجبرت احتجاجات واسعة على تشكيل حكومة انتقالية في ${COUNTRY_NAME_AR[country.name] || country.name}.`, { countries: [country.name] });
  }
}

function imposeSanctions(world, senderName, targetName) {
  const rel = relation(world, senderName, targetName);
  if (rel.sanctions) return false;
  rel.sanctions = true;
  rel.score = clamp(rel.score - 12, -100, 100);
  const sender = world.countries[senderName];
  const target = world.countries[targetName];
  sender.sanctionsAgainst = setLinked(sender.sanctionsAgainst, targetName, true);
  target.sanctionsFrom = setLinked(target.sanctionsFrom, senderName, true);
  world.sanctions.push({ id: `sanction_${world.month}_${world.sequence++}`, sender: senderName, target: targetName, startMonth: world.month, active: true });
  world.sanctions = world.sanctions.slice(-80);
  logWorld(world, 'sanctions', `${senderName} imposed economic sanctions on ${targetName}.`, `فرضت ${COUNTRY_NAME_AR[senderName] || senderName} عقوبات اقتصادية على ${COUNTRY_NAME_AR[targetName] || targetName}.`, { countries: [senderName, targetName] });
  return true;
}

function createWar(world, attackerName, defenderName) {
  if (world.wars.filter(war => war.status === 'active').length >= 4) return null;
  const attacker = world.countries[attackerName];
  const defender = world.countries[defenderName];
  if (!attacker || !defender || attacker.atWar.includes(defenderName)) return null;
  updateAlliance(world, attackerName, defenderName, false);
  updateRivalry(world, attackerName, defenderName, true);
  attacker.atWar = setLinked(attacker.atWar, defenderName, true);
  defender.atWar = setLinked(defender.atWar, attackerName, true);
  const war = {
    id: `war_${slug(attackerName)}_${slug(defenderName)}_${world.month}`,
    attacker: attackerName,
    defender: defenderName,
    startMonth: world.month,
    months: 0,
    status: 'active',
    front: 0,
    casualties: { attacker: 0, defender: 0, civilian: 0 },
    exhaustion: { attacker: 0, defender: 0 },
    occupation: { attacker: 0, defender: 0 },
    peaceOffers: 0,
  };
  world.wars.push(war);
  world.wars = world.wars.slice(-MAX_WARS);
  relation(world, attackerName, defenderName).score = -100;
  logWorld(world, 'war_start', `${attackerName} declared war on ${defenderName}.`, `أعلنت ${COUNTRY_NAME_AR[attackerName] || attackerName} الحرب على ${COUNTRY_NAME_AR[defenderName] || defenderName}.`, { countries: [attackerName, defenderName], warId: war.id });
  return war;
}

function processDiplomacy(world) {
  const names = Object.keys(world.countries);
  const leftName = pick(names);
  let rightName = pick(names);
  while (rightName === leftName) rightName = pick(names);
  const left = world.countries[leftName];
  const right = world.countries[rightName];
  const rel = relation(world, leftName, rightName);
  const tradeInfluence = rel.trade / 130;
  const ideologyFriction = left.ideology === right.ideology ? 0.4 : -0.35;
  const randomChange = (Math.random() - 0.5) * 3;
  rel.lastChange = round(tradeInfluence + ideologyFriction + randomChange);
  rel.score = round(clamp(rel.score + rel.lastChange, -100, 100));
  rel.trade = round(clamp(rel.trade + rel.score / 500 + (Math.random() - 0.5), 0, 100));
  rel.borderTension = round(clamp(Math.max(0, -rel.score - 25) + (Math.random() - 0.5) * 2, 0, 100));

  if (!rel.alliance && rel.score >= 78 && rel.trade >= 55 && Math.random() < 0.08) {
    updateAlliance(world, leftName, rightName, true);
    world.treaties.push({ id: `alliance_${world.month}_${world.sequence++}`, type: 'alliance', members: [leftName, rightName], startMonth: world.month, active: true });
    logWorld(world, 'alliance', `${leftName} and ${rightName} signed a defensive alliance.`, `وقّعت ${COUNTRY_NAME_AR[leftName] || leftName} و${COUNTRY_NAME_AR[rightName] || rightName} تحالفا دفاعيا.`, { countries: [leftName, rightName] });
  }
  if (!left.tradePacts.includes(rightName) && rel.score >= 48 && Math.random() < 0.1) {
    left.tradePacts = setLinked(left.tradePacts, rightName, true);
    right.tradePacts = setLinked(right.tradePacts, leftName, true);
    rel.trade = clamp(rel.trade + 12);
    world.treaties.push({ id: `trade_${world.month}_${world.sequence++}`, type: 'trade', members: [leftName, rightName], startMonth: world.month, active: true });
    logWorld(world, 'trade', `${leftName} and ${rightName} signed a trade agreement.`, `وقّعت ${COUNTRY_NAME_AR[leftName] || leftName} و${COUNTRY_NAME_AR[rightName] || rightName} اتفاقية تجارية.`, { countries: [leftName, rightName] });
  }
  if (!rel.sanctions && rel.score <= -62 && Math.random() < 0.08) imposeSanctions(world, leftName, rightName);
  if (!rel.rivalry && rel.score <= -58) updateRivalry(world, leftName, rightName, true);
  if (rel.rivalry && rel.score > -25) updateRivalry(world, leftName, rightName, false);

  const warChance = rel.score <= -82 && rel.borderTension >= 62 && !rel.alliance ? 0.012 : 0;
  if (warChance && Math.random() < warChance) {
    const attacker = left.military + left.leader.approval / 5 >= right.military + right.leader.approval / 5 ? leftName : rightName;
    const defender = attacker === leftName ? rightName : leftName;
    createWar(world, attacker, defender);
  }
}

function endWar(world, war, winner = null) {
  war.status = 'ended';
  war.endMonth = world.month;
  war.winner = winner;
  const attacker = world.countries[war.attacker];
  const defender = world.countries[war.defender];
  attacker.atWar = setLinked(attacker.atWar, defender.name, false);
  defender.atWar = setLinked(defender.atWar, attacker.name, false);
  relation(world, attacker.name, defender.name).score = -55;
  if (winner) {
    const loser = winner === attacker.name ? defender : attacker;
    const winningCountry = world.countries[winner];
    winningCountry.stability = clamp(winningCountry.stability + 4);
    loser.stability = clamp(loser.stability - 8);
    loser.territoryControl = clamp(loser.territoryControl - 8, 45, 100);
  }
  logWorld(
    world,
    'peace',
    `${attacker.name} and ${defender.name} signed a peace agreement${winner ? ` after ${winner} gained the advantage` : ''}.`,
    `وقّعت ${COUNTRY_NAME_AR[attacker.name] || attacker.name} و${COUNTRY_NAME_AR[defender.name] || defender.name} اتفاق سلام${winner ? ` بعد تفوق ${COUNTRY_NAME_AR[winner] || winner}` : ''}.`,
    { countries: [attacker.name, defender.name], warId: war.id }
  );
}

function processWars(world) {
  world.wars.filter(war => war.status === 'active').forEach(war => {
    const attacker = world.countries[war.attacker];
    const defender = world.countries[war.defender];
    if (!attacker || !defender) return;
    war.months += 1;
    const attackerPower = attacker.military * (0.7 + attacker.technology / 250) * (0.65 + attacker.stability / 250);
    const defenderPower = defender.military * (0.75 + defender.technology / 250) * (0.7 + defender.stability / 250);
    const balance = (attackerPower - defenderPower) / Math.max(20, attackerPower + defenderPower);
    const frontMove = balance * 16 + (Math.random() - 0.5) * 10;
    war.front = round(clamp(war.front + frontMove, -100, 100));

    const intensity = 500 + Math.random() * 4500;
    const attackerLoss = Math.floor(intensity * clamp(0.55 - balance, 0.25, 0.85));
    const defenderLoss = Math.floor(intensity * clamp(0.55 + balance, 0.25, 0.85));
    const civilianLoss = Math.floor(intensity * (0.08 + Math.abs(war.front) / 900));
    war.casualties.attacker += attackerLoss;
    war.casualties.defender += defenderLoss;
    war.casualties.civilian += civilianLoss;
    war.exhaustion.attacker = round(clamp(war.exhaustion.attacker + attackerLoss / 900 + attacker.inflation / 35, 0, 100));
    war.exhaustion.defender = round(clamp(war.exhaustion.defender + defenderLoss / 900 + defender.inflation / 35, 0, 100));
    attacker.warWeariness = round(clamp(attacker.warWeariness + attackerLoss / 1200, 0, 100));
    defender.warWeariness = round(clamp(defender.warWeariness + defenderLoss / 1200, 0, 100));
    attacker.population = Math.max(0.5, round(attacker.population - (attackerLoss + civilianLoss / 2) / 1_000_000, 4));
    defender.population = Math.max(0.5, round(defender.population - (defenderLoss + civilianLoss / 2) / 1_000_000, 4));
    war.occupation.attacker = round(clamp(Math.max(0, war.front), 0, 100));
    war.occupation.defender = round(clamp(Math.max(0, -war.front), 0, 100));

    if (war.months % 6 === 0) {
      logWorld(world, 'war_update', `${war.attacker}–${war.defender} war: the front is ${war.front > 12 ? 'favoring the attacker' : war.front < -12 ? 'favoring the defender' : 'largely deadlocked'}.`, `الحرب بين ${COUNTRY_NAME_AR[war.attacker] || war.attacker} و${COUNTRY_NAME_AR[war.defender] || war.defender}: الجبهة ${war.front > 12 ? 'تميل للمهاجم' : war.front < -12 ? 'تميل للمدافع' : 'شبه متوقفة'}.`, { countries: [war.attacker, war.defender], warId: war.id });
    }

    const totalExhaustion = war.exhaustion.attacker + war.exhaustion.defender;
    if (Math.abs(war.front) >= 88 || (war.months >= 8 && totalExhaustion >= 135) || war.months >= 60) {
      const winner = war.front >= 35 ? war.attacker : war.front <= -35 ? war.defender : null;
      endWar(world, war, winner);
    } else if (war.months >= 6 && totalExhaustion >= 95 && Math.random() < 0.08) {
      war.peaceOffers += 1;
    }
  });
}

function processMigration(world) {
  const countries = Object.values(world.countries);
  const sources = countries.filter(country => country.atWar.length > 0 || country.stability < 42 || country.unemployment > 17);
  const destinations = countries.filter(country => country.stability >= 68 && country.atWar.length === 0 && country.unemployment < 10);
  if (!sources.length || !destinations.length) return;
  const source = pick(sources);
  const possible = destinations.filter(country => country.name !== source.name);
  if (!possible.length) return;
  const destination = possible.sort((a, b) => (b.stability - b.unemployment) - (a.stability - a.unemployment))[Math.floor(Math.random() * Math.min(3, possible.length))];
  const crisis = source.atWar.length * 1.8 + Math.max(0, 50 - source.stability) / 15 + Math.max(0, source.unemployment - 10) / 10;
  const people = Math.max(500, Math.floor((4000 + Math.random() * 26000) * Math.max(0.5, crisis)));
  source.population = Math.max(0.5, round(source.population - people / 1_000_000, 4));
  destination.population = round(destination.population + people / 1_000_000, 4);
  source.refugeesAbroad += people;
  destination.refugeesHosted += people;
  source.migrationPressure = clamp(source.migrationPressure + people / 30000);
  destination.migrationPressure = clamp(destination.migrationPressure + people / 80000);
  world.migrationFlows.unshift({ id: `flow_${world.month}_${world.sequence++}`, from: source.name, to: destination.name, people, month: world.month });
  world.migrationFlows = world.migrationFlows.slice(0, MAX_FLOWS);
  world.global.refugees = Math.floor(Object.values(world.countries).reduce((sum, country) => sum + country.refugeesAbroad, 0));
  if (people >= 30000 || Math.random() < 0.08) {
    logWorld(world, 'migration', `${people.toLocaleString()} people fled ${source.name} for ${destination.name}.`, `غادر ${people.toLocaleString()} شخصا ${COUNTRY_NAME_AR[source.name] || source.name} نحو ${COUNTRY_NAME_AR[destination.name] || destination.name}.`, { countries: [source.name, destination.name] });
  }
}

function ensureContentHooks(person) {
  if (!person.contentState || typeof person.contentState !== 'object') person.contentState = {};
  if (!person.contentState.flags || typeof person.contentState.flags !== 'object') person.contentState.flags = {};
  if (!Array.isArray(person.contentState.scheduled)) person.contentState.scheduled = [];
  return person.contentState;
}

function scheduleWorldContent(person, world, eventId, flag, cooldown = 12) {
  const state = ensureContentHooks(person);
  const last = Number(world.playerTriggers[eventId]);
  if (Number.isFinite(last) && world.month - last < cooldown) return false;
  if (state.scheduled.some(item => item.packId === 'world-geopolitics' && item.eventId === eventId)) return false;
  state.flags[flag] = true;
  state.scheduled.push({ packId: 'world-geopolitics', eventId, dueMonth: monthNow(person), sourceChoice: 'world2' });
  state.scheduled = state.scheduled.slice(-40);
  world.playerTriggers[eventId] = world.month;
  return true;
}

function worldYear(world) {
  return Math.max(2026, Number(world?.year) || 2026);
}

function syncPlayerWar(person, home, activeWars) {
  if (!person.wars || typeof person.wars !== 'object') person.wars = {};
  Object.keys(person.wars).filter(key => key.startsWith('world2_')).forEach(key => delete person.wars[key]);
  activeWars.forEach(war => {
    person.wars[`world2_${war.id}`] = {
      id: war.id,
      enemyCountry: war.attacker === home.name ? war.defender : war.attacker,
      status: 'active',
      startYear: worldYear(person.worldSimulation2),
      worldSimulation2: true,
    };
  });
}

function applyPlayerConsequences(person, world) {
  const home = world.countries[person.country];
  if (!home || !person.isAlive) return;
  const activeWars = world.wars.filter(war => war.status === 'active' && (war.attacker === home.name || war.defender === home.name));
  syncPlayerWar(person, home, activeWars);

  if (activeWars.length) {
    scheduleWorldContent(person, world, 'war_home_front', 'world2HomeWar', 10);
    person.updateStats?.({ stress: 1, happiness: -1 });
  }
  if (home.inflation >= 10 || home.shortages.food >= 50 || home.shortages.energy >= 55) {
    scheduleWorldContent(person, world, 'inflation_shortage_crisis', 'world2ShortageCrisis', 10);
  }
  if (home.sanctionsFrom.length) scheduleWorldContent(person, world, 'sanctions_personal_cost', 'world2Sanctions', 18);
  const recentFlow = world.migrationFlows.find(flow => flow.to === home.name && world.month - flow.month <= 1 && flow.people >= 10000);
  if (recentFlow) scheduleWorldContent(person, world, 'refugee_arrival', 'world2RefugeeArrival', 12);
  if (home.lastPoliticalEvent === 'election') {
    scheduleWorldContent(person, world, 'national_election_day', 'world2Election', 24);
    home.lastPoliticalEvent = null;
  } else if (['coup', 'revolution'].includes(home.lastPoliticalEvent)) {
    scheduleWorldContent(person, world, 'regime_change_at_home', 'world2RegimeChange', 30);
    home.lastPoliticalEvent = null;
  }
  if (person.job && home.unemployment >= 14 && !person.job.isMilitary && !person.job.isPolitical && Math.random() < 0.006 * Math.max(1, home.unemployment - 11)) {
    scheduleWorldContent(person, world, 'layoff_wave', 'world2LayoffWave', 18);
  }
  if (!activeWars.length && home.growth >= 4.5 && home.stability >= 65) {
    scheduleWorldContent(person, world, 'economic_boom_opportunity', 'world2EconomicBoom', 24);
  }
}

function updateGlobal(world) {
  const countries = Object.values(world.countries);
  const weightedGdp = countries.reduce((sum, country) => sum + country.gdp, 0);
  const weighted = key => countries.reduce((sum, country) => sum + country[key] * country.gdp, 0) / Math.max(1, weightedGdp);
  world.global.growth = round(weighted('growth'));
  world.global.inflation = round(weighted('inflation'));
  world.global.trade = round(clamp(Object.values(world.relations).reduce((sum, rel) => sum + rel.trade, 0) / Math.max(1, Object.keys(world.relations).length), 0, 100));
  const activeWars = world.wars.filter(war => war.status === 'active').length;
  const rivalries = Object.values(world.relations).filter(rel => rel.rivalry).length;
  world.global.tension = round(clamp(22 + activeWars * 13 + rivalries * 1.5 + world.sanctions.filter(item => item.active).length * 0.8, 0, 100));
}

export function simulateWorldMonth(person, { playerConsequences = true } = {}) {
  const world = ensureWorldSimulation2(person);
  world.month += 1;
  if (world.month % 12 === 0) world.year += 1;
  Object.values(world.countries).forEach(country => {
    processEconomy(world, country);
    processPolitics(world, country);
  });
  processDiplomacy(world);
  processWars(world);
  if (Math.random() < 0.45) processMigration(world);
  updateGlobal(world);
  if (playerConsequences) applyPlayerConsequences(person, world);
  return world;
}

export function simulateWorldMonths(person, months = 1, options = {}) {
  const count = Math.max(0, Math.min(120, Math.floor(Number(months) || 0)));
  let world = ensureWorldSimulation2(person);
  for (let index = 0; index < count; index += 1) {
    world = simulateWorldMonth(person, { ...options, playerConsequences: options.playerConsequences !== false && index === count - 1 });
  }
  return world;
}

function charge(person, amount) {
  const cost = Math.max(0, Math.floor(Number(amount) || 0));
  const cash = Math.max(0, Number(person.money) || 0);
  const paid = Math.min(cash, cost);
  person.money = cash - paid;
  if (paid < cost) person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + cost - paid;
}

export function resolveWorldSimulationChoice(person, event, choice) {
  if (event?.type !== 'world2_event') return false;
  const world = ensureWorldSimulation2(person);
  const home = world.countries[person.country];
  if (!home) { person.pendingEvent = null; return true; }
  const effect = choice?.effect;
  if (choice?.effects) person.updateStats?.(choice.effects);
  if (effect === 'world2_conscription_join') {
    person.job = { title: 'Mobilized Reservist', salary: 18000, performance: 50, yearsEmployed: 0, isMilitary: true };
    person.deployment = { active: true, worldWarId: event.warId, months: 0 };
    person.logEvent?.('You reported for military mobilization.', 'neutral');
  } else if (effect === 'world2_conscription_object') {
    if (person.reputation) person.reputation.trust = clamp(person.reputation.trust - 5);
    person.logEvent?.('You applied for conscientious-objector status.', 'neutral');
  } else if (effect === 'world2_conscription_flee') {
    charge(person, 3000);
    const destinations = Object.values(world.countries).filter(country => country.name !== home.name && country.stability >= 70 && country.atWar.length === 0);
    if (destinations.length) person.country = pick(destinations).name;
    person.city = null;
    person.logEvent?.(`You fled to ${person.country} to avoid mobilization.`, 'bad');
  }
  person.pendingEvent = null;
  return true;
}

export function maybeCreateDirectWorldDecision(person) {
  const world = ensureWorldSimulation2(person);
  if (!person.isAlive || person.pendingEvent) return false;
  const home = world.countries[person.country];
  const war = world.wars.find(item => item.status === 'active' && (item.attacker === home?.name || item.defender === home?.name));
  if (!war || person.age < 18 || person.age > 45 || person.job?.isMilitary) return false;
  const key = `conscription:${war.id}`;
  if (world.playerTriggers[key]) return false;
  if (Math.random() >= 0.08) return false;
  world.playerTriggers[key] = world.month;
  person.pendingEvent = {
    type: 'world2_event',
    warId: war.id,
    text: 'Your country issued a military mobilization order. How will you respond?',
    localizedText: { en: 'Your country issued a military mobilization order. How will you respond?', ar: 'أصدرت دولتك أمرا بالتعبئة العسكرية. كيف ستتصرف؟' },
    choices: [
      { text: 'Report for service', localizedText: { en: 'Report for service', ar: 'التحق بالخدمة' }, effect: 'world2_conscription_join', effects: { stress: 10, health: -2 } },
      { text: 'Request objector status', localizedText: { en: 'Request objector status', ar: 'اطلب صفة معترض ضميري' }, effect: 'world2_conscription_object', effects: { stress: 6 } },
      { text: 'Flee the country ($3,000)', localizedText: { en: 'Flee the country ($3,000)', ar: 'غادر البلاد (3,000 دولار)' }, effect: 'world2_conscription_flee', effects: { stress: 15, happiness: -5 } },
    ],
  };
  return true;
}

export function performWorldSimulationAction(person, action, targetName = null) {
  const world = ensureWorldSimulation2(person);
  const home = world.countries[person.country];
  if (!home) return { success: false, message: 'Your country is not represented in this world model.' };
  const influence = Boolean(person.isHeadOfState || person.job?.isPolitical || Number(person.reputation?.political) >= 60);
  if (!influence) return { success: false, message: 'You need a major political role or 60 political reputation.' };
  const candidates = Object.values(world.countries).filter(country => country.name !== home.name);
  const target = world.countries[targetName] || candidates.sort((a, b) => relation(world, home.name, a.name).score - relation(world, home.name, b.name).score)[0];
  if (!target) return { success: false, message: 'No target country is available.' };

  if (action === 'diplomacy') {
    charge(person, 10000);
    const rel = relation(world, home.name, target.name);
    rel.score = clamp(rel.score + 14, -100, 100);
    rel.trade = clamp(rel.trade + 6);
    if (person.reputation) person.reputation.political = clamp(person.reputation.political + 2);
    logWorld(world, 'player_diplomacy', `${person.getFullName?.() || 'A political figure'} opened talks between ${home.name} and ${target.name}.`, `فتح ${person.getFullName?.() || 'مسؤول سياسي'} محادثات بين ${COUNTRY_NAME_AR[home.name] || home.name} و${COUNTRY_NAME_AR[target.name] || target.name}.`, { countries: [home.name, target.name], playerAction: true });
    return { success: true, message: `Relations with ${target.name} improved.` };
  }
  if (action === 'sanctions') {
    if (!imposeSanctions(world, home.name, target.name)) return { success: false, message: 'Sanctions are already active.' };
    if (person.reputation) person.reputation.political = clamp(person.reputation.political + 1);
    return { success: true, message: `Sanctions were imposed on ${target.name}.` };
  }
  if (action === 'humanitarian_aid') {
    charge(person, 5000);
    const flow = world.migrationFlows.find(item => item.to === home.name || item.from === target.name);
    home.stability = clamp(home.stability + 1);
    home.migrationPressure = clamp(home.migrationPressure - 6);
    if (person.reputation) {
      person.reputation.public = clamp(person.reputation.public + 4);
      person.reputation.trust = clamp(person.reputation.trust + 3);
    }
    if (flow) flow.aid = (Number(flow.aid) || 0) + 5000;
    logWorld(world, 'humanitarian_aid', `${home.name} funded humanitarian assistance after pressure from the player.`, `موّلت ${COUNTRY_NAME_AR[home.name] || home.name} مساعدات إنسانية بدفع من اللاعب.`, { countries: [home.name], playerAction: true });
    return { success: true, message: 'Humanitarian aid was funded.' };
  }
  if (action === 'emergency_budget') {
    charge(person, 15000);
    home.budget.welfare = round(home.budget.welfare + home.gdp * 0.004);
    home.budget.healthcare = round(home.budget.healthcare + home.gdp * 0.003);
    home.stability = clamp(home.stability + 3);
    home.inflation = clamp(home.inflation - 0.8, -1, 35);
    logWorld(world, 'emergency_budget', `${home.name} approved an emergency cost-of-living budget.`, `أقرت ${COUNTRY_NAME_AR[home.name] || home.name} ميزانية طارئة لمواجهة تكاليف المعيشة.`, { countries: [home.name], playerAction: true });
    return { success: true, message: 'The emergency budget reduced pressure at home.' };
  }
  return { success: false, message: 'Unknown world action.' };
}

export function getWorldSimulation2Summary(person) {
  const world = ensureWorldSimulation2(person);
  const countries = Object.values(world.countries);
  const home = world.countries[person.country] || null;
  return {
    world,
    home,
    activeWars: world.wars.filter(war => war.status === 'active'),
    activeSanctions: world.sanctions.filter(item => item.active),
    alliances: world.treaties.filter(item => item.active && item.type === 'alliance'),
    tradePacts: world.treaties.filter(item => item.active && item.type === 'trade'),
    topEconomies: [...countries].sort((a, b) => b.gdp - a.gdp).slice(0, 6),
    unstableCountries: [...countries].sort((a, b) => a.stability - b.stability).slice(0, 5),
    recentTimeline: world.timeline.slice(0, 20),
    influenceAvailable: Boolean(person.isHeadOfState || person.job?.isPolitical || Number(person.reputation?.political) >= 60),
  };
}

export function validateWorldSimulation2(person) {
  const world = ensureWorldSimulation2(person);
  const errors = [];
  Object.values(world.countries).forEach(country => {
    ['population', 'gdp', 'inflation', 'unemployment', 'debt', 'stability', 'military', 'technology'].forEach(key => {
      if (!Number.isFinite(Number(country[key]))) errors.push(`${country.name}.${key} is not finite`);
    });
    if (country.population <= 0) errors.push(`${country.name}.population must be positive`);
    if (country.stability < 0 || country.stability > 100) errors.push(`${country.name}.stability is outside 0-100`);
  });
  world.wars.forEach(war => {
    if (!world.countries[war.attacker] || !world.countries[war.defender]) errors.push(`${war.id} references a missing country`);
    if (!['active', 'ended'].includes(war.status)) errors.push(`${war.id} has invalid status`);
  });
  return { valid: errors.length === 0, errors, countryCount: Object.keys(world.countries).length, activeWars: world.wars.filter(war => war.status === 'active').length };
}

export function cloneWorldSimulation2(person) {
  return copy(ensureWorldSimulation2(person));
}
