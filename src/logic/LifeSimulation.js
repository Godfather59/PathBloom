import { Person } from './Person';
import { GameEngine } from './GameEngine';
import { JOBS } from './Job';
import { STOCKS } from './Investments';
import {
  UNIVERSITY_MAJORS,
  GRAD_SCHOOLS,
  checkPrereq,
  meetsEducationRequirement,
} from './EducationLogic';
import { RelationshipManager } from './Relationships';
import { ACTIVITIES } from './Activities';

const CORE_STATS = [
  'happiness',
  'health',
  'smarts',
  'looks',
  'stress',
  'karma',
  'fame',
  'notoriety',
  'energy',
];
const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Morocco', 'Japan', 'Brazil'];
const FIRST_NAMES = ['Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery'];

export const SIMULATION_STRATEGIES = Object.freeze([
  'balanced',
  'academic',
  'worker',
  'entrepreneur',
  'criminal',
  'carefree',
  'passive',
]);

export const DEFAULT_STRATEGY_SEQUENCE = Object.freeze([
  'balanced',
  'academic',
  'worker',
  'carefree',
  'entrepreneur',
  'passive',
  'balanced',
  'criminal',
  'academic',
  'carefree',
  'worker',
  'balanced',
  'entrepreneur',
  'worker',
  'passive',
  'academic',
  'criminal',
  'worker',
  'balanced',
  'balanced',
]);

export const DEFAULT_BALANCE_TARGETS = Object.freeze({
  medianLifespan: [65, 92],
  ageCapRateMax: 0.02,
  earlyDeathRateMax: 0.12,
  everEmployedRate: [0.55, 0.95],
  universityRate: [0.15, 0.7],
  millionaireAt65Rate: [0.1, 0.7],
  negativeCashRateMax: 0.25,
  insolventRateMax: 0.25,
  retirementRate: [0.1, 0.8],
});

export const DEFAULT_STRATEGY_TARGETS = Object.freeze({
  balanced: {
    medianAge: [60, 95],
    medianNetWorth: [-100000, 10000000],
    earlyDeathRateMax: 0.25,
    insolventRateMax: 0.1,
    ageCapRateMax: 0.05,
  },
  academic: {
    medianAge: [60, 95],
    medianNetWorth: [-100000, 10000000],
    earlyDeathRateMax: 0.25,
    insolventRateMax: 0.15,
    ageCapRateMax: 0.05,
  },
  worker: {
    medianAge: [60, 95],
    medianNetWorth: [-100000, 10000000],
    earlyDeathRateMax: 0.25,
    insolventRateMax: 0.15,
    ageCapRateMax: 0.05,
  },
  entrepreneur: {
    medianAge: [60, 95],
    medianNetWorth: [-250000, 25000000],
    earlyDeathRateMax: 0.25,
    insolventRateMax: 0.15,
    ageCapRateMax: 0.05,
  },
  criminal: {
    medianAge: [45, 90],
    medianNetWorth: [-500000, 10000000],
    earlyDeathRateMax: 0.4,
    insolventRateMax: 0.55,
    ageCapRateMax: 0.05,
  },
  carefree: {
    medianAge: [50, 95],
    medianNetWorth: [-500000, 2000000],
    earlyDeathRateMax: 0.4,
    insolventRateMax: 0.6,
    ageCapRateMax: 0.05,
  },
  passive: {
    medianAge: [25, 75],
    medianNetWorth: [-500000, 1000000],
    earlyDeathRateMax: 0.9,
    insolventRateMax: 1,
    ageCapRateMax: 0.05,
  },
});

function hashSeed(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value >>> 0;
  }
  const text = String(value ?? 'pathbloom');
  if (/^\d+$/.test(text)) {
    const numericSeed = Number(text);
    if (Number.isSafeInteger(numericSeed)) {
      return numericSeed >>> 0;
    }
  }
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createSeededRandom(seed) {
  let state = hashSeed(seed);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function deriveSimulationSeed(baseSeed, index) {
  let value = (hashSeed(baseSeed) + Math.imul((index + 1) >>> 0, 0x9e3779b1)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x85ebca6b);
  value ^= value >>> 13;
  value = Math.imul(value, 0xc2b2ae35);
  return (value ^ (value >>> 16)) >>> 0;
}

export function withDeterministicRuntime(seed, callback) {
  const originalRandom = Math.random;
  const originalNow = Date.now;
  const random = createSeededRandom(seed);
  let clock = 1700000000000 + hashSeed(seed) * 1000;

  Math.random = random;
  Date.now = () => clock++;
  try {
    return callback();
  } finally {
    Math.random = originalRandom;
    Date.now = originalNow;
  }
}

export function resetSimulationState() {
  GameEngine.resetSimulationState();
}

function issue(code, path, message) {
  return { code, path, message };
}

function checkFinite(issues, path, value, options = {}) {
  if (!Number.isFinite(value)) {
    issues.push(issue('NON_FINITE_NUMBER', path, `${path} must be finite.`));
    return;
  }
  if (options.min !== undefined && value < options.min) {
    issues.push(issue('NUMBER_BELOW_MIN', path, `${path} must be at least ${options.min}.`));
  }
  if (options.max !== undefined && value > options.max) {
    issues.push(issue('NUMBER_ABOVE_MAX', path, `${path} must be at most ${options.max}.`));
  }
}

function checkUniqueIds(issues, path, values, key = 'id') {
  const ids = values.map(value => value?.[key]).filter(id => id !== undefined && id !== null);
  if (ids.length !== values.length) {
    issues.push(issue('MISSING_ID', path, `${path} contains an entry without a ${key}.`));
  }
  if (new Set(ids.map(String)).size !== ids.length) {
    issues.push(issue('DUPLICATE_ID', path, `${path} contains duplicate ${key} values.`));
  }
}

export function inspectPersonState(person) {
  const issues = [];
  if (!person || typeof person !== 'object') {
    return [issue('INVALID_PERSON', 'person', 'Person state is missing.')];
  }

  checkFinite(issues, 'age', person.age, { min: 0, max: 130 });
  if (Number.isFinite(person.age) && !Number.isInteger(person.age)) {
    issues.push(issue('NON_INTEGER_AGE', 'age', 'Age must be an integer.'));
  }
  checkFinite(issues, 'money', person.money);
  if (Number.isFinite(person.money) && Math.abs(person.money) > 1e15) {
    issues.push(
      issue('RUNAWAY_MONEY', 'money', 'Liquid money exceeded the simulation safety limit.')
    );
  }
  checkFinite(issues, 'loans', person.loans, { min: 0 });
  checkFinite(issues, 'personalDebt', person.personalDebt, { min: 0 });

  CORE_STATS.forEach(stat => checkFinite(issues, stat, person[stat], { min: 0, max: 100 }));
  if (person.isAlive && person.health <= 0) {
    issues.push(
      issue('ALIVE_WITHOUT_HEALTH', 'isAlive', 'A living person cannot have zero health.')
    );
  }
  if (person.isInPrison) {
    checkFinite(issues, 'prisonSentence', person.prisonSentence, { min: 1 });
  } else if (Number(person.prisonSentence) < 0) {
    issues.push(
      issue('NEGATIVE_PRISON_SENTENCE', 'prisonSentence', 'Prison sentence cannot be negative.')
    );
  }

  const arrays = [
    'history',
    'statHistory',
    'assets',
    'portfolio',
    'relationships',
    'pets',
    'degrees',
    'educationHistory',
    'companies',
  ];
  arrays.forEach(path => {
    if (!Array.isArray(person[path])) {
      issues.push(issue('INVALID_ARRAY', path, `${path} must be an array.`));
    }
  });

  if (Array.isArray(person.statHistory) && person.statHistory.length > 150) {
    issues.push(
      issue('UNBOUNDED_STAT_HISTORY', 'statHistory', 'Stat history exceeded 150 entries.')
    );
  }

  if (person.pendingEvent) {
    if (!Array.isArray(person.pendingEvent.choices) || person.pendingEvent.choices.length === 0) {
      issues.push(
        issue(
          'UNRESOLVABLE_EVENT',
          'pendingEvent',
          'A pending event must contain at least one choice.'
        )
      );
    }
  }

  if (person.currentSchool) {
    checkFinite(issues, 'currentSchool.year', person.currentSchool.year, { min: 1 });
    checkFinite(issues, 'currentSchool.years', person.currentSchool.years, { min: 1 });
    checkFinite(issues, 'currentSchool.performance', person.currentSchool.performance ?? 50, {
      min: 0,
      max: 100,
    });
    if (person.currentSchool.year > person.currentSchool.years) {
      issues.push(
        issue('INVALID_SCHOOL_YEAR', 'currentSchool.year', 'School year exceeded program length.')
      );
    }
  }

  if (person.job) {
    checkFinite(issues, 'job.salary', Number(person.job.salary), { min: 0 });
    checkFinite(issues, 'job.performance', Number(person.job.performance ?? 50), {
      min: 0,
      max: 100,
    });
  }

  if (Array.isArray(person.assets)) {
    checkUniqueIds(issues, 'assets', person.assets, 'uniqueId');
    person.assets.forEach((asset, index) => {
      checkFinite(issues, `assets[${index}].value`, Number(asset?.value ?? asset?.price), {
        min: 0,
      });
      if (asset?.mortgage) {
        checkFinite(issues, `assets[${index}].mortgage.balance`, Number(asset.mortgage.balance), {
          min: 0,
        });
        checkFinite(
          issues,
          `assets[${index}].mortgage.monthlyPayment`,
          Number(asset.mortgage.monthlyPayment),
          { min: 0 }
        );
        checkFinite(
          issues,
          `assets[${index}].mortgage.interestRate`,
          Number(asset.mortgage.interestRate ?? 0.05),
          { min: 0, max: 0.25 }
        );
      }
    });
  }

  if (Array.isArray(person.portfolio)) {
    checkUniqueIds(issues, 'portfolio', person.portfolio);
    person.portfolio.forEach((position, index) => {
      checkFinite(issues, `portfolio[${index}].invested`, Number(position?.invested), { min: 0 });
      checkFinite(issues, `portfolio[${index}].currentValue`, Number(position?.currentValue), {
        min: 0,
      });
    });
  }

  if (Array.isArray(person.relationships)) {
    checkUniqueIds(issues, 'relationships', person.relationships);
    const committed = person.relationships.filter(
      rel => rel?.status !== 'Deceased' && ['Partner', 'Fiance', 'Spouse'].includes(rel?.type)
    );
    if (committed.length > 1) {
      issues.push(
        issue(
          'MULTIPLE_COMMITTED_PARTNERS',
          'relationships',
          'A person cannot have multiple committed partners.'
        )
      );
    }
    person.relationships.forEach((relationship, index) => {
      checkFinite(issues, `relationships[${index}].stat`, Number(relationship?.stat), {
        min: 0,
        max: 100,
      });
      checkFinite(issues, `relationships[${index}].age`, Number(relationship?.age), {
        min: 0,
        max: 130,
      });
    });
  }

  if (Array.isArray(person.pets)) {
    checkUniqueIds(issues, 'pets', person.pets);
    person.pets.forEach((pet, index) => {
      ['health', 'happiness', 'relationship'].forEach(stat => {
        checkFinite(issues, `pets[${index}].${stat}`, Number(pet?.[stat]), { min: 0, max: 100 });
      });
    });
  }

  if (Array.isArray(person.companies)) {
    checkUniqueIds(issues, 'companies', person.companies);
    person.companies.forEach((company, index) => {
      checkFinite(issues, `companies[${index}].cash`, Number(company?.cash));
      checkFinite(issues, `companies[${index}].valuation`, Number(company?.valuation), { min: 0 });
      checkFinite(issues, `companies[${index}].employees`, Number(company?.employees), { min: 1 });
      if (typeof company?.simulate !== 'function') {
        issues.push(
          issue(
            'COMPANY_PROTOTYPE_LOST',
            `companies[${index}]`,
            'Saved companies must retain simulation behavior.'
          )
        );
      }
    });
  }

  Object.entries(person.retirementAccounts || {}).forEach(([account, data]) => {
    checkFinite(issues, `retirementAccounts.${account}.balance`, Number(data?.balance), { min: 0 });
  });

  checkFinite(issues, 'marketTrends.indexFund', Number(GameEngine.marketTrends?.indexFund), {
    min: 0,
  });
  checkFinite(issues, 'marketTrends.dogecoin', Number(GameEngine.marketTrends?.dogecoin), {
    min: 0,
  });
  return issues;
}

function scoreChoice(choice, strategy) {
  const effects = choice?.effects || {};
  const weights =
    strategy === 'criminal'
      ? {
          health: 5,
          happiness: 1,
          smarts: 2,
          looks: 1,
          stress: -1,
          karma: -0.5,
          money: 0.003,
          fame: 2,
          notoriety: 2,
        }
      : {
          health: 7,
          happiness: 2,
          smarts: 3,
          looks: 1,
          stress: -2,
          karma: 1,
          money: 0.002,
          fame: 1,
          notoriety: -1,
        };
  return Object.entries(weights).reduce(
    (total, [key, weight]) => total + (Number(effects[key]) || 0) * weight,
    0
  );
}

function resolvePendingEvent(person, strategy, tracker, addViolation) {
  if (!person.pendingEvent) {
    return;
  }
  const { choices } = person.pendingEvent;
  if (!Array.isArray(choices) || choices.length === 0) {
    addViolation?.(
      issue(
        'UNRESOLVABLE_EVENT',
        'pendingEvent',
        'A pending event must contain at least one choice.'
      ),
      'decision'
    );
    person.pendingEvent = null;
    return;
  }
  const choice = choices.reduce(
    (best, current) =>
      scoreChoice(current, strategy) > scoreChoice(best, strategy) ? current : best,
    choices[0]
  );
  tracker.decisionsResolved++;
  person.resolveEvent(choice);
}

function hasHighSchool(person) {
  return person.educationHistory.some(entry => String(entry).includes('High School'));
}

function hasBachelor(person) {
  return person.degrees.some(degree => String(degree?.name).includes("Bachelor's Degree"));
}

function hasGraduateDegree(person) {
  return person.degrees.some(degree => !String(degree?.name).includes("Bachelor's Degree"));
}

function pickUniversity(person, strategy) {
  const preferences =
    strategy === 'academic'
      ? ['Biology', 'Political Science', 'Finance', 'Computer Science', 'English', 'Arts']
      : strategy === 'entrepreneur'
        ? ['Computer Science', 'Finance', 'English', 'Arts']
        : ['Computer Science', 'Finance', 'English', 'Arts'];
  return preferences
    .map(name => UNIVERSITY_MAJORS.find(major => major.name === name))
    .find(major => major && person.smarts >= major.smarts_req);
}

function pickGraduateSchool(person) {
  const degreeNames = person.degrees.map(degree => degree?.type);
  return GRAD_SCHOOLS.find(
    school => person.smarts >= school.smarts_req && checkPrereq(school.id, degreeNames)
  );
}

function handleEducation(person, strategy) {
  if (person.currentSchool) {
    if (person.currentSchool.performance < 80 && person.stress < 65) {
      person.studyHard();
    }
    return;
  }
  if (!['balanced', 'academic', 'entrepreneur'].includes(strategy)) {
    return;
  }
  if (person.age < 17 || !hasHighSchool(person)) {
    return;
  }

  if (!hasBachelor(person)) {
    const university = pickUniversity(person, strategy);
    if (university) {
      person.enrollInSchool(university);
    }
    return;
  }

  if (strategy === 'academic' && !hasGraduateDegree(person)) {
    const graduateSchool = pickGraduateSchool(person);
    if (graduateSchool) {
      person.enrollInSchool(graduateSchool);
    }
  }
}

function meetsCustomRequirement(person, job) {
  if (job.customReq === 'influencer') {
    return Boolean(person.social?.isInfluencer);
  }
  if (job.customReq === 'stuntman') {
    return (person.skills?.martialArts || 0) >= 100;
  }
  if (job.customReq === 'coding_skill') {
    return (person.skills?.coding || 0) >= 80;
  }
  if (job.customReq === 'cooking_skill') {
    return (person.skills?.cooking || 0) >= 90;
  }
  if (job.customReq === 'actor') {
    return (person.fame || 0) >= 20;
  }
  if (job.customReq === 'musician') {
    return (
      Math.max(
        person.skills?.voice || 0,
        person.skills?.instrument || 0,
        ...Object.values(person.skills?.instruments || {}).map(Number)
      ) >= 80
    );
  }
  return true;
}

function qualifiesForJob(person, job) {
  const requirements = job?.requirements || {};
  if (person.smarts < (requirements.smarts || 0)) {
    return false;
  }
  if (person.looks < (requirements.looks || 0)) {
    return false;
  }
  if (person.health < (requirements.health || 0)) {
    return false;
  }
  if (!meetsEducationRequirement(person, requirements.education)) {
    return false;
  }
  if (
    Array.isArray(requirements.degree_req) &&
    !person.degrees.some(degree => requirements.degree_req.includes(degree?.type))
  ) {
    return false;
  }
  return meetsCustomRequirement(person, job);
}

function handleCareer(person, strategy, tracker) {
  if (
    person.age < 18 ||
    person.job ||
    person.isInPrison ||
    person.isRetired ||
    strategy === 'passive'
  ) {
    return;
  }
  let listings = Array.isArray(person.market?.jobs) ? person.market.jobs : JOBS;
  if (strategy === 'worker') {
    listings = listings.filter(
      job =>
        !['University', 'Graduate School', 'Medical School', 'Law School'].includes(
          job.requirements?.education
        )
    );
  }
  const job = listings
    .filter(candidate => qualifiesForJob(person, candidate))
    .sort((a, b) => b.salary - a.salary)[0];
  if (job && person.setJob(job)) {
    tracker.jobsHeld.add(job.title);
  }
}

function handleHealth(person, strategy) {
  if (strategy === 'passive' || !person.isAlive) {
    return;
  }
  const meditate = ACTIVITIES.find(activity => activity.id === 'meditate');
  if (person.stress >= 35 && meditate) {
    person.performActivity(meditate);
  }
  const healthThreshold = strategy === 'carefree' ? 65 : 88;
  const proactiveAge = strategy === 'carefree' ? 55 : 45;
  if (person.age >= 13 && (person.health < healthThreshold || person.age >= proactiveAge)) {
    person.exercise(strategy === 'criminal' ? 'strength' : 'walking');
  }
}

function handleRelationships(person, strategy) {
  if (
    !['balanced', 'academic', 'worker', 'entrepreneur', 'carefree'].includes(strategy) ||
    person.age < 22
  ) {
    return;
  }
  let partner = person.relationships.find(
    rel => rel.status !== 'Deceased' && ['Partner', 'Fiance', 'Spouse'].includes(rel.type)
  );
  if (!partner) {
    const preferredGender = String(person.gender).toLowerCase() === 'male' ? 'female' : 'male';
    const candidate = RelationshipManager.generateBatch(3, preferredGender).sort(
      (a, b) => b.smarts + b.looks - (a.smarts + a.looks)
    )[0];
    person.startDating(candidate);
    partner = person.relationships.find(rel => rel.id === candidate.id);
  }
  if (!partner) {
    return;
  }

  person.interactWithRel(partner.id, 'spend_time');
  if (
    partner.type === 'Partner' &&
    partner.stat >= 75 &&
    person.money >= 1000 &&
    person.age >= 24
  ) {
    person.interactWithRel(partner.id, 'propose', { ringCost: 1000 });
  } else if (partner.type === 'Fiance' && person.money >= 5000) {
    person.interactWithRel(partner.id, 'marry', { budget: 5000, prenup: person.money >= 250000 });
  } else if (partner.type === 'Spouse' && person.age <= 40) {
    const childCount = person.relationships.filter(rel => rel.type === 'Child').length;
    if (childCount < 2) {
      person.interactWithRel(partner.id, 'make_love');
    }
  }
}

function handleCrime(person, strategy, tracker) {
  if (strategy !== 'criminal' || person.age < 15 || person.isInPrison || !person.isAlive) {
    return;
  }
  const type =
    person.age >= 18 && person.smarts >= 70 ? 'hacking' : person.age >= 18 ? 'scam' : 'burglary';
  const crimesBefore = person.lifeStats.crimesCommitted;
  const succeeded = person.commitCrime(type);
  if (person.lifeStats.crimesCommitted > crimesBefore) {
    tracker.crimeAttempts++;
  }
  if (succeeded) {
    tracker.crimeSuccesses++;
  }
}

function handleFinances(person, strategy, tracker) {
  if (!person.isAlive || person.isInPrison || person.age < 18 || strategy === 'passive') {
    return;
  }
  if (person.age >= 65 && person.job && !person.isRetired) {
    person.retire();
  }

  if (strategy === 'carefree') {
    const discretionarySpending = Math.min(
      15000,
      Math.floor(Math.max(0, person.money - 10000) * 0.35)
    );
    if (discretionarySpending > 0) {
      person.money -= discretionarySpending;
      person.lifeStats.totalDiscretionarySpending =
        (Number(person.lifeStats.totalDiscretionarySpending) || 0) + discretionarySpending;
      person.updateStats({ happiness: 2 });
    }
    return;
  }

  const savingsPlan = {
    balanced: { retirementCap: 3000, investmentRate: 0.06 },
    academic: { retirementCap: 4000, investmentRate: 0.07 },
    worker: { retirementCap: 2500, investmentRate: 0.05 },
    entrepreneur: { retirementCap: 4000, investmentRate: 0.1 },
    criminal: { retirementCap: 1000, investmentRate: 0.03 },
  }[strategy] || { retirementCap: 2500, investmentRate: 0.05 };

  if (person.job && person.age < 65 && person.money > 15000) {
    const amount = Math.min(
      savingsPlan.retirementCap,
      Math.floor(Math.max(0, person.money - 15000) * 0.1)
    );
    if (amount > 0) {
      person.contributeToRetirement('401k', amount);
    }
  }

  if (strategy === 'entrepreneur' && person.companies.length === 0 && person.money >= 125000) {
    const type = person.degrees.some(degree => degree.type === 'Computer Science')
      ? 'tech_startup'
      : 'restaurant';
    const company = person.startCompany(type, `${person.name.first} Ventures`);
    if (company) {
      tracker.businessesStarted++;
    }
  }

  const reserve = strategy === 'entrepreneur' ? 40000 : 25000;
  if (person.money > reserve * 1.5) {
    const amount = Math.floor((person.money - reserve) * savingsPlan.investmentRate);
    if (amount > 0) {
      person.buyInvestment(STOCKS[0], amount);
    }
  }
}

function applyPolicy(person, strategy, tracker) {
  handleEducation(person, strategy);
  if (strategy === 'entrepreneur' && (person.skills?.coding || 0) < 80 && person.age >= 12) {
    person.practiceSkill('coding');
  }
  handleHealth(person, strategy);
  handleRelationships(person, strategy);
  handleCareer(person, strategy, tracker);
  handleCrime(person, strategy, tracker);
  handleFinances(person, strategy, tracker);
}

function saveFingerprint(person) {
  return JSON.stringify({
    age: person.age,
    isAlive: person.isAlive,
    money: person.money,
    loans: person.loans,
    personalDebt: person.personalDebt,
    stats: CORE_STATS.map(stat => person[stat]),
    job: person.job
      ? [
          person.job.id,
          person.job.title,
          person.job.salary,
          person.job.performance,
          person.job.yearsEmployed,
          person.job.isRetired,
        ]
      : null,
    currentSchool: person.currentSchool,
    assets: person.assets.map(asset => [
      asset.uniqueId,
      asset.id,
      asset.type,
      asset.value,
      asset.condition,
      asset.age,
      asset.isRented,
      asset.rentPrice,
      asset.mortgage
        ? [
            asset.mortgage.balance,
            asset.mortgage.monthlyPayment,
            asset.mortgage.interestRate,
            asset.mortgage.term,
          ]
        : null,
    ]),
    portfolio: person.portfolio.map(position => [
      position.id,
      position.invested,
      position.currentValue,
    ]),
    relationships: person.relationships.map(relationship => [
      relationship.id,
      relationship.type,
      relationship.status,
      relationship.age,
      relationship.stat,
    ]),
    companies: person.companies.map(company => [
      company.id,
      company.type,
      company.cash,
      company.valuation,
      company.employees,
      company.expenses,
      company.reputation,
      company.ownerEquity,
      company.isPublic,
    ]),
    degrees: person.degrees.map(degree => [degree.type, degree.name]),
    retirement: Object.entries(person.retirementAccounts || {})
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([account, data]) => [
        account,
        data.balance,
        data.autoContribute,
        data.contributedThisYear,
        data.employerMatchedThisYear,
        data.lastContributionAge,
        data.suspended,
      ]),
    lifeStats: person.lifeStats,
    social: person.social,
    skills: person.skills,
    prison: [person.isInPrison, person.prisonSentence],
    retirementState: [person.isRetired, person.lastIntimacyAge],
    bankruptcy: [person.bankruptcies, person.lastBankruptcyAge],
    pendingEvent: person.pendingEvent,
  });
}

function roundTripSave(person, addViolation, tracker) {
  const before = saveFingerprint(person);
  const restored = Person.load(JSON.parse(JSON.stringify(person)));
  const after = saveFingerprint(restored);
  tracker.saveRoundTrips++;
  if (before !== after) {
    addViolation(
      issue('SAVE_ROUNDTRIP_MISMATCH', 'save', 'Save/load changed persistent game state.'),
      'save-load'
    );
  }
  return restored;
}

function netWorth(person) {
  let total =
    (Number(person.money) || 0) -
    Math.max(0, Number(person.loans) || 0) -
    Math.max(0, Number(person.personalDebt) || 0);
  (person.assets || []).forEach(asset => {
    total += Math.max(0, Number(asset?.value ?? asset?.price) || 0);
    if (asset?.isMortgaged) {
      total -= Math.max(0, Number(asset?.mortgage?.balance) || 0);
    }
  });
  (person.portfolio || []).forEach(position => {
    total += Math.max(0, Number(position?.currentValue) || 0);
  });
  (person.companies || []).forEach(company => {
    total +=
      Math.max(0, Number(company?.valuation) || 0) *
      Math.max(0, Math.min(1, Number(company?.ownerEquity ?? 1)));
  });
  Object.values(person.retirementAccounts || {}).forEach(account => {
    total += Math.max(0, Number(account?.balance) || 0);
  });
  return total;
}

function wealthBreakdown(person) {
  const assetEquity = (person.assets || []).reduce((sum, asset) => {
    const value = Math.max(0, Number(asset?.value ?? asset?.price) || 0);
    const mortgage = asset?.isMortgaged ? Math.max(0, Number(asset?.mortgage?.balance) || 0) : 0;
    return sum + Math.max(0, value - mortgage);
  }, 0);
  const portfolio = (person.portfolio || []).reduce(
    (sum, position) => sum + Math.max(0, Number(position?.currentValue) || 0),
    0
  );
  const retirement = Object.values(person.retirementAccounts || {}).reduce(
    (sum, account) => sum + Math.max(0, Number(account?.balance) || 0),
    0
  );
  const business = (person.companies || []).reduce(
    (sum, company) =>
      sum +
      Math.max(0, Number(company?.valuation) || 0) *
        Math.max(0, Math.min(1, Number(company?.ownerEquity ?? 1))),
    0
  );
  return { assetEquity, portfolio, retirement, business };
}

function findDeathCause(person) {
  return (
    person.history.find(entry =>
      /died|death|killed|health reached zero/i.test(String(entry?.text || ''))
    )?.text || 'Unknown'
  );
}

function createCheckpoint(person, tracker) {
  const breakdown = wealthBreakdown(person);
  return {
    netWorth: Math.round(netWorth(person)),
    money: Math.round(person.money),
    loans: Math.round(person.loans),
    personalDebt: Math.round(person.personalDebt),
    totalDebt: Math.round((Number(person.loans) || 0) + (Number(person.personalDebt) || 0)),
    portfolio: Math.round(breakdown.portfolio),
    retirement: Math.round(breakdown.retirement),
    lifetimeEarnings: Math.round(Number(person.lifeStats?.totalMoneyEarned) || 0),
    livingExpenses: Math.round(Number(person.lifeStats?.totalLivingExpenses) || 0),
    employedYears: tracker.employedYears,
    employed: Boolean(person.job && !person.job.isRetired),
    degrees: person.degrees.length,
  };
}

export function simulateLife(options = {}) {
  const seed =
    options.resolvedSeed !== undefined
      ? hashSeed(options.resolvedSeed)
      : deriveSimulationSeed(options.seed ?? 20260713, options.index ?? 0);
  const strategy = SIMULATION_STRATEGIES.includes(options.strategy) ? options.strategy : 'balanced';
  const maxAge = Math.max(20, Math.min(130, Math.floor(Number(options.maxAge) || 120)));
  const requestedSaveInterval = Number(options.saveEvery);
  const saveEvery = Math.max(
    0,
    Math.floor(Number.isFinite(requestedSaveInterval) ? requestedSaveInterval : 10)
  );
  const cloneEachTurn = options.cloneEachTurn !== false;

  return withDeterministicRuntime(seed, () => {
    resetSimulationState();
    const violations = [];
    const violationKeys = new Set();
    const trace = [];
    const tracker = {
      decisionsResolved: 0,
      saveRoundTrips: 0,
      crimeAttempts: 0,
      crimeSuccesses: 0,
      businessesStarted: 0,
      jobsHeld: new Set(),
      employedYears: 0,
      prisonYears: 0,
      minMoney: 0,
      peakNetWorth: 0,
      highestSalary: 0,
      checkpoints: {},
    };

    const addViolation = (entry, phase) => {
      const key = `${entry.code}:${entry.path}`;
      if (violationKeys.has(key)) {
        return;
      }
      violationKeys.add(key);
      violations.push({ ...entry, phase, age: person?.age ?? 0 });
    };
    const inspect = phase =>
      inspectPersonState(person).forEach(entry => addViolation(entry, phase));

    let person;
    try {
      person = new Person(
        FIRST_NAMES[seed % FIRST_NAMES.length],
        `Seed${seed}`,
        seed % 2 === 0 ? 'Male' : 'Female',
        COUNTRIES[seed % COUNTRIES.length]
      );
      GameEngine.initializeFamily(person);
      tracker.minMoney = person.money;
      tracker.peakNetWorth = netWorth(person);
      inspect('birth');

      let turns = 0;
      const turnLimit = (maxAge + 1) * 3;
      while (person.isAlive && person.age < maxAge) {
        turns++;
        if (turns > turnLimit) {
          addViolation(
            issue(
              'SIMULATION_TURN_LIMIT',
              'age',
              'The simulation stopped after too many turns without completion.'
            ),
            'loop-guard'
          );
          break;
        }
        if (person.pendingEvent) {
          resolvePendingEvent(person, strategy, tracker, addViolation);
        }
        if (!person.isAlive) {
          break;
        }

        if (cloneEachTurn) {
          person = person.clone();
        }
        applyPolicy(person, strategy, tracker);
        inspect('after-actions');
        if (!person.isAlive) {
          break;
        }

        const previousAge = person.age;
        const wasAlive = person.isAlive;
        if (cloneEachTurn) {
          person = person.clone();
        }
        GameEngine.ageUp(person, 1);
        if (wasAlive && person.age !== previousAge + 1) {
          addViolation(
            issue(
              'AGE_DID_NOT_ADVANCE',
              'age',
              'A live annual tick must advance exactly one year.'
            ),
            'age-up'
          );
        }

        if (person.pendingEvent) {
          resolvePendingEvent(person, strategy, tracker, addViolation);
        }
        if (person.job && !person.job.isRetired) {
          tracker.employedYears++;
          tracker.highestSalary = Math.max(tracker.highestSalary, Number(person.job.salary) || 0);
          tracker.jobsHeld.add(person.job.title);
        }
        if (person.isInPrison) {
          tracker.prisonYears++;
        }

        tracker.minMoney = Math.min(tracker.minMoney, person.money);
        tracker.peakNetWorth = Math.max(tracker.peakNetWorth, netWorth(person));
        trace.push({
          age: person.age,
          money: Math.round(person.money),
          health: person.health,
          job: person.job?.title || null,
        });
        if (trace.length > 8) {
          trace.shift();
        }
        if (person.isAlive && [25, 40, 65].includes(person.age)) {
          tracker.checkpoints[person.age] = createCheckpoint(person, tracker);
        }

        if (saveEvery > 0 && person.isAlive && person.age > 0 && person.age % saveEvery === 0) {
          person = roundTripSave(person, addViolation, tracker);
        }
        inspect('year-end');
      }

      if (!person.isAlive) {
        const ageBefore = person.age;
        GameEngine.ageUp(person, 1);
        if (person.age !== ageBefore) {
          addViolation(
            issue('DEAD_PERSON_AGED', 'age', 'A dead person advanced another year.'),
            'post-death'
          );
        }
      }

      const breakdown = wealthBreakdown(person);
      return {
        seed,
        strategy,
        age: person.age,
        died: !person.isAlive,
        reachedAgeCap: person.isAlive && person.age >= maxAge,
        deathCause: person.isAlive ? null : findDeathCause(person),
        money: Math.round(person.money),
        minMoney: Math.round(tracker.minMoney),
        netWorth: Math.round(netWorth(person)),
        peakNetWorth: Math.round(tracker.peakNetWorth),
        portfolioValue: Math.round(breakdown.portfolio),
        retirementValue: Math.round(breakdown.retirement),
        assetEquity: Math.round(breakdown.assetEquity),
        businessValue: Math.round(breakdown.business),
        loans: Math.round(person.loans),
        personalDebt: Math.round(person.personalDebt),
        totalDebt: Math.round((Number(person.loans) || 0) + (Number(person.personalDebt) || 0)),
        lifetimeEarnings: Math.round(Number(person.lifeStats?.totalMoneyEarned) || 0),
        livingExpenses: Math.round(Number(person.lifeStats?.totalLivingExpenses) || 0),
        debtPayments: Math.round(Number(person.lifeStats?.totalDebtPayments) || 0),
        degrees: person.degrees.length,
        graduateDegree: hasGraduateDegree(person),
        employedYears: tracker.employedYears,
        jobsHeld: tracker.jobsHeld.size,
        highestSalary: Math.round(tracker.highestSalary),
        finalJob: person.job?.title || 'Unemployed',
        retired: Boolean(person.isRetired || person.job?.isRetired),
        prisonYears: tracker.prisonYears,
        crimeAttempts: tracker.crimeAttempts,
        crimeSuccesses: tracker.crimeSuccesses,
        businessesStarted: tracker.businessesStarted,
        decisionsResolved: tracker.decisionsResolved,
        saveRoundTrips: tracker.saveRoundTrips,
        checkpoints: tracker.checkpoints,
        finalStats: Object.fromEntries(CORE_STATS.map(stat => [stat, person[stat]])),
        violations,
        trace,
      };
    } finally {
      resetSimulationState();
    }
  });
}

function percentile(values, fraction) {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = (sorted.length - 1) * fraction;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sorted[lower];
  }
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function stats(values) {
  if (values.length === 0) {
    return { mean: 0, p10: 0, median: 0, p90: 0, p99: 0, max: 0 };
  }
  return {
    mean: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
    p10: Math.round(percentile(values, 0.1)),
    median: Math.round(percentile(values, 0.5)),
    p90: Math.round(percentile(values, 0.9)),
    p99: Math.round(percentile(values, 0.99)),
    max: Math.round(Math.max(...values)),
  };
}

function rate(outcomes, predicate) {
  return outcomes.length === 0 ? 0 : outcomes.filter(predicate).length / outcomes.length;
}

function topDistribution(outcomes, selector, limit = 8) {
  const counts = new Map();
  outcomes.forEach(outcome => {
    const key = selector(outcome);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count, rate: count / outcomes.length }));
}

function outside(value, range) {
  return value < range[0] || value > range[1];
}

function buildWarnings(summary, targets, strategyTargets) {
  const warnings = [];
  const add = (code, message, severity = 'warning') => warnings.push({ code, severity, message });
  if (summary.reliability.crashes > 0) {
    add('CRASHES', `${summary.reliability.crashes} simulated lives crashed.`, 'error');
  }
  if (summary.reliability.invariantViolations > 0) {
    add(
      'INVARIANTS',
      `${summary.reliability.invariantViolations} unique state invariants failed.`,
      'error'
    );
  }
  if (outside(summary.lifespan.median, targets.medianLifespan)) {
    add(
      'LIFESPAN',
      `Median lifespan ${summary.lifespan.median} is outside ${targets.medianLifespan[0]}-${targets.medianLifespan[1]}.`
    );
  }
  if (summary.lifespan.ageCapRate > targets.ageCapRateMax) {
    add(
      'IMMORTALITY_TAIL',
      `${Math.round(summary.lifespan.ageCapRate * 100)}% reached the age cap alive.`
    );
  }
  if (summary.lifespan.earlyDeathRate > targets.earlyDeathRateMax) {
    add(
      'EARLY_DEATHS',
      `${Math.round(summary.lifespan.earlyDeathRate * 100)}% died before age 50.`
    );
  }
  if (outside(summary.career.everEmployedRate, targets.everEmployedRate)) {
    add('EMPLOYMENT', 'Employment frequency is outside the target range.');
  }
  if (outside(summary.education.universityRate, targets.universityRate)) {
    add('EDUCATION', 'University completion frequency is outside the target range.');
  }
  if (
    summary.checkpoints.age65.lives > 0 &&
    outside(summary.checkpoints.age65.millionaireRate, targets.millionaireAt65Rate)
  ) {
    add('WEALTH_AT_65', 'Millionaire frequency at age 65 is outside the target range.');
  }
  if (summary.wealth.negativeCashRate > targets.negativeCashRateMax) {
    add('NEGATIVE_CASH', 'Too many lives end with negative liquid cash.');
  }
  if (summary.wealth.insolventRate > targets.insolventRateMax) {
    add('INSOLVENCY', 'Too many lives end with liabilities greater than their assets.');
  }
  if (outside(summary.career.retirementRate, targets.retirementRate)) {
    add('RETIREMENT', 'Retirement frequency is outside the target range.');
  }
  Object.entries(strategyTargets).forEach(([strategy, target]) => {
    const data = summary.strategies[strategy];
    if (!data || data.lives < 5) {
      return;
    }
    if (outside(data.medianAge, target.medianAge)) {
      add(
        `STYLE_LIFESPAN_${strategy.toUpperCase()}`,
        `${strategy} median lifespan ${data.medianAge} is outside ${target.medianAge[0]}-${target.medianAge[1]}.`
      );
    }
    if (outside(data.medianNetWorth, target.medianNetWorth)) {
      add(
        `STYLE_WEALTH_${strategy.toUpperCase()}`,
        `${strategy} median net worth ${money(data.medianNetWorth)} is outside its guardrail.`
      );
    }
    if (data.earlyDeathRate > target.earlyDeathRateMax) {
      add(
        `STYLE_EARLY_DEATHS_${strategy.toUpperCase()}`,
        `${strategy} early-death rate is ${percent(data.earlyDeathRate)}.`
      );
    }
    if (data.insolventRate > target.insolventRateMax) {
      add(
        `STYLE_INSOLVENCY_${strategy.toUpperCase()}`,
        `${strategy} insolvency rate is ${percent(data.insolventRate)}.`
      );
    }
    if (data.ageCapRate > target.ageCapRateMax) {
      add(
        `STYLE_AGE_CAP_${strategy.toUpperCase()}`,
        `${strategy} age-cap rate is ${percent(data.ageCapRate)}.`
      );
    }
  });
  return warnings;
}

export function summarizeSimulation(outcomes, options = {}) {
  const completed = outcomes.filter(outcome => !outcome.crashed);
  const violations = completed.flatMap(outcome =>
    outcome.violations.map(entry => ({ seed: outcome.seed, strategy: outcome.strategy, ...entry }))
  );
  const targets = { ...DEFAULT_BALANCE_TARGETS, ...(options.targets || {}) };
  const strategyTargets = Object.fromEntries(
    SIMULATION_STRATEGIES.map(strategy => [
      strategy,
      { ...DEFAULT_STRATEGY_TARGETS[strategy], ...(options.strategyTargets?.[strategy] || {}) },
    ])
  );
  const strategyGroups = Object.fromEntries(
    SIMULATION_STRATEGIES.map(strategy => {
      const group = completed.filter(outcome => outcome.strategy === strategy);
      return [
        strategy,
        {
          lives: group.length,
          medianAge: stats(group.map(outcome => outcome.age)).median,
          medianNetWorth: stats(group.map(outcome => outcome.netWorth)).median,
          medianEarnings: stats(group.map(outcome => outcome.lifetimeEarnings)).median,
          medianPortfolio: stats(group.map(outcome => outcome.portfolioValue)).median,
          medianRetirement: stats(group.map(outcome => outcome.retirementValue)).median,
          medianBusiness: stats(group.map(outcome => outcome.businessValue)).median,
          earlyDeathRate: rate(group, outcome => outcome.died && outcome.age < 50),
          insolventRate: rate(group, outcome => outcome.netWorth < 0),
          ageCapRate: rate(group, outcome => outcome.reachedAgeCap),
        },
      ];
    })
  );

  const checkpointSummary = age => {
    const rows = completed.map(outcome => outcome.checkpoints?.[age]).filter(Boolean);
    return {
      lives: rows.length,
      netWorth: stats(rows.map(row => row.netWorth)),
      liquidCash: stats(rows.map(row => row.money)),
      debt: stats(rows.map(row => row.totalDebt)),
      portfolio: stats(rows.map(row => row.portfolio)),
      retirement: stats(rows.map(row => row.retirement)),
      millionaireRate: rate(rows, row => row.netWorth >= 1000000),
      negativeCashRate: rate(rows, row => row.money < 0),
      employedRate: rate(rows, row => row.employed),
      universityRate: rate(rows, row => row.degrees > 0),
    };
  };

  const summary = {
    config: {
      lives: outcomes.length,
      seed: options.seed ?? 20260713,
      maxAge: options.maxAge ?? 120,
      saveEvery: options.saveEvery ?? 10,
    },
    reliability: {
      completed: completed.length,
      crashes: outcomes.length - completed.length,
      invariantViolations: violations.length,
      saveRoundTrips: completed.reduce((sum, outcome) => sum + outcome.saveRoundTrips, 0),
      failureSamples: [
        ...outcomes
          .filter(outcome => outcome.crashed)
          .slice(0, 5)
          .map(outcome => ({
            seed: outcome.seed,
            strategy: outcome.strategy,
            error: outcome.error,
          })),
        ...violations.slice(0, 10),
      ],
    },
    lifespan: {
      ...stats(completed.map(outcome => outcome.age)),
      earlyDeathRate: rate(completed, outcome => outcome.died && outcome.age < 50),
      ageCapRate: rate(completed, outcome => outcome.reachedAgeCap),
      deathRate: rate(completed, outcome => outcome.died),
    },
    wealth: {
      netWorth: stats(completed.map(outcome => outcome.netWorth)),
      liquidCash: stats(completed.map(outcome => outcome.money)),
      debt: stats(completed.map(outcome => outcome.totalDebt)),
      portfolio: stats(completed.map(outcome => outcome.portfolioValue)),
      retirement: stats(completed.map(outcome => outcome.retirementValue)),
      business: stats(completed.map(outcome => outcome.businessValue)),
      lifetimeEarnings: stats(completed.map(outcome => outcome.lifetimeEarnings)),
      livingExpenses: stats(completed.map(outcome => outcome.livingExpenses)),
      debtPayments: stats(completed.map(outcome => outcome.debtPayments)),
      millionaireRate: rate(completed, outcome => outcome.netWorth >= 1000000),
      billionaireRate: rate(completed, outcome => outcome.netWorth >= 1000000000),
      negativeCashRate: rate(completed, outcome => outcome.money < 0),
      insolventRate: rate(completed, outcome => outcome.netWorth < 0),
    },
    career: {
      everEmployedRate: rate(completed, outcome => outcome.employedYears > 0),
      retirementRate: rate(completed, outcome => outcome.retired),
      employmentYears: stats(completed.map(outcome => outcome.employedYears)),
      highestSalary: stats(completed.map(outcome => outcome.highestSalary)),
    },
    education: {
      universityRate: rate(completed, outcome => outcome.degrees > 0),
      graduateRate: rate(completed, outcome => outcome.graduateDegree),
      degreeCount: stats(completed.map(outcome => outcome.degrees)),
    },
    crime: {
      attemptedRate: rate(completed, outcome => outcome.crimeAttempts > 0),
      incarceratedRate: rate(completed, outcome => outcome.prisonYears > 0),
      attempts: stats(completed.map(outcome => outcome.crimeAttempts)),
      prisonYears: stats(completed.map(outcome => outcome.prisonYears)),
    },
    business: {
      founderRate: rate(completed, outcome => outcome.businessesStarted > 0),
    },
    checkpoints: {
      age25: checkpointSummary(25),
      age40: checkpointSummary(40),
      age65: checkpointSummary(65),
    },
    decisions: stats(completed.map(outcome => outcome.decisionsResolved)),
    strategies: strategyGroups,
    strategyDistribution: topDistribution(completed, outcome => outcome.strategy),
  };
  summary.career.finalJobs = topDistribution(
    completed,
    outcome => outcome.finalJob || 'Unemployed'
  );
  summary.warnings = buildWarnings(summary, targets, strategyTargets);
  return summary;
}

export function runSimulationBatch(options = {}) {
  const lives = Math.max(1, Math.min(50000, Math.floor(Number(options.lives) || 1000)));
  const strategies =
    Array.isArray(options.strategies) && options.strategies.length > 0
      ? options.strategies.filter(strategy => SIMULATION_STRATEGIES.includes(strategy))
      : DEFAULT_STRATEGY_SEQUENCE;
  if (strategies.length === 0) {
    throw new Error('At least one valid simulation strategy is required.');
  }

  const outcomes = [];
  for (let index = 0; index < lives; index++) {
    const strategy = strategies[index % strategies.length];
    try {
      outcomes.push(simulateLife({ ...options, index, strategy }));
    } catch (error) {
      outcomes.push({
        seed: deriveSimulationSeed(options.seed ?? 20260713, index),
        strategy,
        crashed: true,
        error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
        trace: [],
      });
    }
  }
  return { summary: summarizeSimulation(outcomes, options), outcomes };
}

function percent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function money(value) {
  return `$${Math.round(value).toLocaleString('en-US')}`;
}

export function formatSimulationReport(report) {
  const summary = report.summary || report;
  const reliabilityFailed =
    summary.reliability.crashes > 0 || summary.reliability.invariantViolations > 0;
  const status = reliabilityFailed ? 'FAIL' : summary.warnings.length > 0 ? 'WARN' : 'PASS';
  const lines = [
    `PathBloom deterministic life simulation — ${status}`,
    `${summary.config.lives.toLocaleString('en-US')} lives | seed ${summary.config.seed} | age cap ${summary.config.maxAge}`,
    '',
    `Reliability: ${summary.reliability.completed} completed, ${summary.reliability.crashes} crashes, ${summary.reliability.invariantViolations} invariant failures, ${summary.reliability.saveRoundTrips} save/load checks`,
    `Lifespan: p10 ${summary.lifespan.p10}, median ${summary.lifespan.median}, p90 ${summary.lifespan.p90}, early deaths ${percent(summary.lifespan.earlyDeathRate)}, capped alive ${percent(summary.lifespan.ageCapRate)}`,
    `Net worth: p10 ${money(summary.wealth.netWorth.p10)}, median ${money(summary.wealth.netWorth.median)}, p90 ${money(summary.wealth.netWorth.p90)}, millionaires ${percent(summary.wealth.millionaireRate)}, insolvent ${percent(summary.wealth.insolventRate)}`,
    `Wealth sources (median): earnings ${money(summary.wealth.lifetimeEarnings.median)}, investments ${money(summary.wealth.portfolio.median)}, retirement ${money(summary.wealth.retirement.median)}, living costs ${money(summary.wealth.livingExpenses.median)}`,
    `Age 65 (${summary.checkpoints.age65.lives} survivors): median net worth ${money(summary.checkpoints.age65.netWorth.median)}, millionaires ${percent(summary.checkpoints.age65.millionaireRate)}, negative cash ${percent(summary.checkpoints.age65.negativeCashRate)}`,
    `Career: ever employed ${percent(summary.career.everEmployedRate)}, median employed years ${summary.career.employmentYears.median}, retired ${percent(summary.career.retirementRate)}`,
    `Top final jobs: ${summary.career.finalJobs
      .slice(0, 5)
      .map(entry => `${entry.name} (${entry.count})`)
      .join(', ')}`,
    `Education: university ${percent(summary.education.universityRate)}, graduate degree ${percent(summary.education.graduateRate)}, median debt ${money(summary.wealth.debt.median)}`,
    `Crime: attempted ${percent(summary.crime.attemptedRate)}, incarcerated ${percent(summary.crime.incarceratedRate)}`,
    '',
    'Play-style medians:',
  ];

  SIMULATION_STRATEGIES.forEach(strategy => {
    const data = summary.strategies[strategy];
    if (data?.lives) {
      lines.push(
        `  ${strategy.padEnd(12)} ${String(data.lives).padStart(4)} lives | age ${String(data.medianAge).padStart(3)} | net worth ${money(data.medianNetWorth)} | invested ${money(data.medianPortfolio + data.medianRetirement)} | insolvent ${percent(data.insolventRate)} | capped ${percent(data.ageCapRate)}`
      );
    }
  });

  if (summary.warnings.length > 0) {
    lines.push('', 'Balance warnings:');
    summary.warnings.forEach(warning =>
      lines.push(`  [${warning.severity.toUpperCase()}] ${warning.code}: ${warning.message}`)
    );
  } else {
    lines.push('', 'All configured balance guardrails are within range.');
  }

  if (summary.reliability.failureSamples.length > 0) {
    lines.push('', 'Replay samples:');
    summary.reliability.failureSamples.slice(0, 5).forEach(sample => {
      lines.push(
        `  seed ${sample.seed} (${sample.strategy}): ${
          sample.error || `${sample.code} at ${sample.path}, age ${sample.age}`
        }`
      );
      lines.push(
        `    npm run simulate -- --replay ${sample.seed} --strategy ${sample.strategy} --max-age ${
          summary.config.maxAge
        } --save-every ${summary.config.saveEvery}`
      );
    });
  }
  return lines.join('\n');
}
