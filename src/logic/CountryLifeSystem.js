const DEFAULT_RULES = {
  incomeTaxRate: 0.22,
  costOfLiving: 1,
  healthcareCost: 0.65,
  universityCost: 0.7,
  retirementAge: 65,
  mandatoryService: false,
  serviceMinAge: 18,
  serviceMaxAge: 25,
  unemploymentSupport: 0.25,
  inheritanceTaxRate: 0.1,
  politicalFreedom: 60,
  creditAccess: 60,
  childSupportRate: 0.12,
  publicHealthcare: false,
  publicUniversity: false,
  marriageAge: 18,
  unemploymentRate: 6,
  jobMarketStrength: 60,
};

export const COUNTRY_LIFE_RULES = {
  Morocco: {
    incomeTaxRate: 0.2, costOfLiving: 0.58, healthcareCost: 0.42, universityCost: 0.3,
    retirementAge: 63, mandatoryService: true, serviceMinAge: 19, serviceMaxAge: 25,
    unemploymentSupport: 0.18, inheritanceTaxRate: 0.04, politicalFreedom: 48,
    creditAccess: 45, childSupportRate: 0.1, publicHealthcare: true, publicUniversity: true,
  },
  'United States': {
    incomeTaxRate: 0.24, costOfLiving: 1.08, healthcareCost: 1.35, universityCost: 1.35,
    retirementAge: 67, mandatoryService: false, unemploymentSupport: 0.28,
    inheritanceTaxRate: 0.12, politicalFreedom: 82, creditAccess: 90,
    childSupportRate: 0.17, publicHealthcare: false, publicUniversity: false,
  },
  France: {
    incomeTaxRate: 0.31, costOfLiving: 0.98, healthcareCost: 0.25, universityCost: 0.2,
    retirementAge: 64, mandatoryService: false, unemploymentSupport: 0.65,
    inheritanceTaxRate: 0.22, politicalFreedom: 86, creditAccess: 75,
    childSupportRate: 0.13, publicHealthcare: true, publicUniversity: true,
  },
  Germany: {
    incomeTaxRate: 0.3, costOfLiving: 0.95, healthcareCost: 0.28, universityCost: 0.16,
    retirementAge: 67, mandatoryService: false, unemploymentSupport: 0.62,
    inheritanceTaxRate: 0.18, politicalFreedom: 90, creditAccess: 78,
    childSupportRate: 0.14, publicHealthcare: true, publicUniversity: true,
  },
  Japan: {
    incomeTaxRate: 0.25, costOfLiving: 1.02, healthcareCost: 0.35, universityCost: 0.72,
    retirementAge: 65, mandatoryService: false, unemploymentSupport: 0.35,
    inheritanceTaxRate: 0.28, politicalFreedom: 84, creditAccess: 78,
    childSupportRate: 0.11, publicHealthcare: true, publicUniversity: false,
  },
  Russia: {
    incomeTaxRate: 0.16, costOfLiving: 0.66, healthcareCost: 0.35, universityCost: 0.35,
    retirementAge: 63, mandatoryService: true, serviceMinAge: 18, serviceMaxAge: 27,
    unemploymentSupport: 0.16, inheritanceTaxRate: 0.03, politicalFreedom: 22,
    creditAccess: 48, childSupportRate: 0.12, publicHealthcare: true, publicUniversity: true,
  },
  'United Kingdom': {
    incomeTaxRate: 0.27, costOfLiving: 1.03, healthcareCost: 0.22, universityCost: 0.9,
    retirementAge: 66, mandatoryService: false, unemploymentSupport: 0.4,
    inheritanceTaxRate: 0.2, politicalFreedom: 88, creditAccess: 82,
    childSupportRate: 0.14, publicHealthcare: true, publicUniversity: false,
  },
  Canada: {
    incomeTaxRate: 0.27, costOfLiving: 1.02, healthcareCost: 0.22, universityCost: 0.62,
    retirementAge: 65, mandatoryService: false, unemploymentSupport: 0.52,
    inheritanceTaxRate: 0.05, politicalFreedom: 92, creditAccess: 84,
    childSupportRate: 0.14, publicHealthcare: true, publicUniversity: false,
  },
  China: {
    incomeTaxRate: 0.19, costOfLiving: 0.72, healthcareCost: 0.48, universityCost: 0.38,
    retirementAge: 61, mandatoryService: false, unemploymentSupport: 0.18,
    inheritanceTaxRate: 0.02, politicalFreedom: 15, creditAccess: 65,
    childSupportRate: 0.1, publicHealthcare: true, publicUniversity: true,
  },
  India: {
    incomeTaxRate: 0.16, costOfLiving: 0.42, healthcareCost: 0.55, universityCost: 0.38,
    retirementAge: 60, mandatoryService: false, unemploymentSupport: 0.08,
    inheritanceTaxRate: 0.01, politicalFreedom: 68, creditAccess: 52,
    childSupportRate: 0.09, publicHealthcare: false, publicUniversity: true,
  },
  'Saudi Arabia': {
    incomeTaxRate: 0.04, costOfLiving: 0.82, healthcareCost: 0.32, universityCost: 0.3,
    retirementAge: 60, mandatoryService: false, unemploymentSupport: 0.5,
    inheritanceTaxRate: 0, politicalFreedom: 18, creditAccess: 72,
    childSupportRate: 0.11, publicHealthcare: true, publicUniversity: true,
  },
  UAE: {
    incomeTaxRate: 0.02, costOfLiving: 1.05, healthcareCost: 0.5, universityCost: 0.72,
    retirementAge: 60, mandatoryService: true, serviceMinAge: 18, serviceMaxAge: 30,
    unemploymentSupport: 0.25, inheritanceTaxRate: 0, politicalFreedom: 25,
    creditAccess: 82, childSupportRate: 0.1, publicHealthcare: true, publicUniversity: false,
  },
  Brazil: {
    incomeTaxRate: 0.2, costOfLiving: 0.56, healthcareCost: 0.38, universityCost: 0.36,
    retirementAge: 65, mandatoryService: true, serviceMinAge: 18, serviceMaxAge: 22,
    unemploymentSupport: 0.3, inheritanceTaxRate: 0.06, politicalFreedom: 72,
    creditAccess: 55, childSupportRate: 0.13, publicHealthcare: true, publicUniversity: true,
  },
};

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(value) || 0));

export function getCountryRules(personOrCountry, countryState = null) {
  const country = typeof personOrCountry === 'string' ? personOrCountry : personOrCountry?.country;
  const explicit = COUNTRY_LIFE_RULES[country] || {};
  const base = { ...DEFAULT_RULES, ...explicit };
  const inflation = Number(countryState?.inflation);
  const unemployment = Number(countryState?.unemployment);
  const stability = Number(countryState?.stability);
  const corruption = Number(countryState?.corruption);
  const freedom = Number(countryState?.freedom);
  const economicPower = Number(countryState?.power ?? countryState?.technology ?? 55);

  const inflationAdjustment = Number.isFinite(inflation)
    ? Math.max(0.85, Math.min(1.35, 1 + (inflation - 3) / 100))
    : 1;
  const unemploymentRate = Number.isFinite(unemployment) ? clamp(unemployment, 0, 50) : base.unemploymentRate;
  const jobMarketStrength = clamp(
    75 - unemploymentRate * 2 + (Number.isFinite(stability) ? (stability - 50) * 0.25 : 0) +
      (economicPower - 50) * 0.15,
    5,
    95
  );

  return {
    ...base,
    costOfLiving: Math.max(0.3, Math.min(1.8, base.costOfLiving * inflationAdjustment)),
    politicalFreedom: Number.isFinite(freedom) ? clamp((base.politicalFreedom + freedom) / 2) : base.politicalFreedom,
    creditAccess: Number.isFinite(corruption)
      ? clamp(base.creditAccess * 0.65 + (100 - corruption) * 0.35)
      : base.creditAccess,
    unemploymentRate,
    jobMarketStrength,
    country: country || 'Unknown',
  };
}

export function ensureCountryLife(person, countryState = null) {
  if (!person || typeof person !== 'object') return null;
  const rules = getCountryRules(person, countryState);
  const previous = person.countryLife && typeof person.countryLife === 'object' ? person.countryLife : {};
  person.countryLife = {
    country: person.country,
    rules,
    militaryServiceCompleted: Boolean(previous.militaryServiceCompleted),
    militaryServiceDeferred: Boolean(previous.militaryServiceDeferred),
    benefitsReceived: Math.max(0, Number(previous.benefitsReceived) || 0),
    healthcareAccess: rules.publicHealthcare ? 'public' : 'private',
    educationAccess: rules.publicUniversity ? 'subsidized' : 'paid',
    legalFlags: Array.isArray(previous.legalFlags) ? previous.legalFlags : [],
    lastUpdatedAge: Number(person.age) || 0,
    lastIncomeTax: Math.max(0, Number(previous.lastIncomeTax) || 0),
    lastTaxAdjustment: Number(previous.lastTaxAdjustment) || 0,
    layoffsExperienced: Math.max(0, Math.floor(Number(previous.layoffsExperienced) || 0)),
  };
  return person.countryLife;
}

function getCountryState(person, worldState) {
  if (!worldState?.countries) return null;
  return Object.values(worldState.countries).find(country => country?.name === person.country) || null;
}

function processJobMarketRisk(person, countryLife, state) {
  if (
    !person.job ||
    person.job.isMilitary ||
    person.job.isPolitical ||
    person.job.isMafia ||
    person.job.isRetired ||
    person.isInPrison
  ) {
    return false;
  }

  const unemployment = countryLife.rules.unemploymentRate;
  const recession = Number(state?.gdpGrowth) < -1.5;
  const weakMarket = countryLife.rules.jobMarketStrength < 40;
  const risk = Math.max(
    0,
    Math.min(0.28, (unemployment - 7) / 220 + (recession ? 0.055 : 0) + (weakMarket ? 0.025 : 0))
  );
  if (risk <= 0 || Math.random() >= risk) return false;

  const previousTitle = person.job.title;
  person.job = null;
  countryLife.layoffsExperienced += 1;
  person.logEvent?.(
    `You were laid off from your ${previousTitle} job as ${person.country}'s job market weakened.`,
    'bad'
  );
  person.updateStats?.({ happiness: -8, stress: 12 });
  return true;
}

export function processCountryLifeYear(person, worldState) {
  const state = getCountryState(person, worldState);
  const countryLife = ensureCountryLife(person, state);
  const rules = countryLife.rules;

  if (state) {
    const healthEffect = (Number(state.healthcare) || 50) >= 80 ? 1 : (Number(state.healthcare) || 50) < 45 ? -1 : 0;
    const educationEffect = person.currentSchool && (Number(state.education) || 50) >= 80 ? 1 : 0;
    const safetyEffect = (Number(state.crime) || 40) >= 65 ? -1 : 0;
    person.updateStats?.({ health: healthEffect, smarts: educationEffect, happiness: safetyEffect });
  }

  processJobMarketRisk(person, countryLife, state);

  if (
    rules.mandatoryService &&
    person.age >= rules.serviceMinAge &&
    person.age <= rules.serviceMaxAge &&
    !countryLife.militaryServiceCompleted &&
    !countryLife.militaryServiceDeferred &&
    !person.job?.isMilitary &&
    !person.pendingEvent &&
    Math.random() < 0.2
  ) {
    person.pendingEvent = {
      type: 'country_service',
      text: `${person.country} requires you to respond to a national service notice.`,
      choices: [
        { text: 'Complete national service', effect: 'country_service_accept', effects: { stress: 8, health: 2 } },
        { text: 'Request a study deferment', effect: 'country_service_defer', effects: { stress: 3 } },
        { text: 'Refuse the notice', effect: 'country_service_refuse', effects: { stress: 12, notoriety: 5 } },
      ],
    };
  }

  if (!person.job && person.age >= 18 && !person.isInPrison && rules.unemploymentSupport > 0) {
    const support = Math.floor(12000 * rules.costOfLiving * rules.unemploymentSupport);
    if (support > 0 && (Number(person.money) || 0) < support && Math.random() < 0.55) {
      person.money = (Number(person.money) || 0) + support;
      countryLife.benefitsReceived += support;
      if (person.finance) person.finance.benefitsReceived = (Number(person.finance.benefitsReceived) || 0) + support;
      person.logEvent?.(`You received $${support.toLocaleString()} in unemployment support from ${person.country}.`, 'neutral');
    }
  }

  if (rules.politicalFreedom < 30 && person.reputation?.political >= 45 && Math.random() < 0.08) {
    person.updateStats?.({ stress: 8, happiness: -3 });
    person.logEvent?.('Authorities questioned you about your political activity.', 'bad');
  }

  countryLife.lastUpdatedAge = Number(person.age) || 0;
  return countryLife;
}

export function resolveCountryServiceChoice(person, event, choice) {
  if (event?.type !== 'country_service') return false;
  const countryLife = ensureCountryLife(person);
  if (choice?.effects) person.updateStats?.(choice.effects);

  if (choice.effect === 'country_service_accept') {
    countryLife.militaryServiceCompleted = true;
    person.job = person.job || {
      title: 'National Service Recruit', salary: 12000, performance: 50,
      isMilitary: true, isNationalService: true, yearsEmployed: 0,
    };
    person.logEvent?.('You began compulsory national service.', 'neutral');
  } else if (choice.effect === 'country_service_defer') {
    countryLife.militaryServiceDeferred = true;
    person.logEvent?.('Your national service was deferred while you continue your studies.', 'neutral');
  } else {
    person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + 1500;
    countryLife.legalFlags = [...new Set([...(countryLife.legalFlags || []), 'service_refusal'])];
    person.logEvent?.('You refused national service and received a legal penalty.', 'bad');
  }
  person.pendingEvent = null;
  return true;
}

export function getCountryLifeSummary(person, worldState = null) {
  const state = getCountryState(person, worldState);
  const life = ensureCountryLife(person, state);
  return {
    country: person.country,
    rules: life.rules,
    healthcareAccess: life.healthcareAccess,
    educationAccess: life.educationAccess,
    militaryService: life.rules.mandatoryService
      ? life.militaryServiceCompleted ? 'completed' : life.militaryServiceDeferred ? 'deferred' : 'required'
      : 'not required',
    layoffsExperienced: life.layoffsExperienced,
  };
}
