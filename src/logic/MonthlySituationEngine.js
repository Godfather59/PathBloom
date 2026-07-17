import { getActiveMonthlySituation, ensureTimeProgress } from './TimeProgression';

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number(value) || 0)));

export function ensureMonthlySituations(person) {
  if (!person || typeof person !== 'object') {
    return null;
  }
  const current =
    person.monthlySituations && typeof person.monthlySituations === 'object'
      ? person.monthlySituations
      : {};
  person.monthlySituations = {
    campaign: current.campaign && typeof current.campaign === 'object' ? current.campaign : {},
    deployment:
      current.deployment && typeof current.deployment === 'object' ? current.deployment : {},
    lawsuit: current.lawsuit && typeof current.lawsuit === 'object' ? current.lawsuit : {},
    sports: current.sports && typeof current.sports === 'object' ? current.sports : {},
    business: current.business && typeof current.business === 'object' ? current.business : {},
    war: current.war && typeof current.war === 'object' ? current.war : {},
    treatment: current.treatment && typeof current.treatment === 'object' ? current.treatment : {},
  };
  return person.monthlySituations;
}

export function beginPregnancy(person, childData, partnerId = null) {
  ensureMonthlySituations(person);
  person.pregnancy = {
    active: true,
    month: 0,
    dueMonth: 9,
    health: 85,
    prenatalCare: 0,
    partnerSupport: 50,
    childData: childData ? { ...childData } : null,
    partnerId,
    complications: [],
  };
  person.logEvent?.('A pregnancy has begun. The baby is expected in nine months.', 'good');
  person.updateStats?.({ happiness: 10, stress: 4 });
  return person.pregnancy;
}

function resolveBirth(person) {
  const { pregnancy } = person;
  if (!pregnancy?.active) {
    return false;
  }
  const childData = pregnancy.childData || {
    id: `child_${Date.now()}`,
    name: Math.random() > 0.5 ? 'James' : 'Olivia',
    type: 'Child',
    age: 0,
    gender: Math.random() > 0.5 ? 'male' : 'female',
    traits: [],
  };
  childData.type = 'Child';
  childData.age = 0;
  if (!(person.relationships || []).some(rel => rel.id === childData.id)) {
    person.addRelationship?.(childData);
  }
  pregnancy.active = false;
  person.pregnancy = null;
  person.logEvent?.(
    `You welcomed a baby ${childData.gender || ''} named ${childData.name}!`,
    'good'
  );
  person.updateStats?.({ happiness: 25, stress: -6, health: -2 });
  return true;
}

function processPregnancy(person) {
  const { pregnancy } = person;
  if (!pregnancy?.active) {
    return;
  }
  pregnancy.month = clamp(pregnancy.month, 0, 9);
  const partner = (person.relationships || []).find(rel => rel.id === pregnancy.partnerId);
  if (partner) {
    pregnancy.partnerSupport = clamp(
      (Number(partner.stat) || 50) + (partner.npcMemory?.support || 50) / 4
    );
  }

  if (pregnancy.month >= 9) {
    resolveBirth(person);
    return;
  }

  const risk = Math.max(
    0.01,
    0.08 - pregnancy.prenatalCare * 0.012 + (100 - pregnancy.health) / 1000
  );
  if (Math.random() < risk) {
    pregnancy.health = clamp(pregnancy.health - 8);
    pregnancy.complications.push({ month: pregnancy.month, type: 'health_scare' });
    person.updateStats?.({ stress: 7, health: -2 });
    person.logEvent?.(`A pregnancy health scare occurred during month ${pregnancy.month}.`, 'bad');
  }

  if (!person.pendingEvent && [2, 5, 7].includes(pregnancy.month)) {
    person.pendingEvent = {
      type: 'monthly_situation',
      situationType: 'pregnancy',
      text: `Pregnancy month ${pregnancy.month}: how will you prepare?`,
      choices: [
        {
          text: 'Attend prenatal care ($300)',
          effect: 'pregnancy_prenatal',
          effects: { money: -300, stress: -2 },
        },
        {
          text: 'Rest and prepare at home',
          effect: 'pregnancy_rest',
          effects: { health: 2, happiness: 2 },
        },
        {
          text: 'Keep working normally',
          effect: 'pregnancy_work',
          effects: { money: 250, stress: 3 },
        },
      ],
    };
  }
}

function findCampaign(person) {
  return person.campaign || person.campaignData || person.politicalCampaign || null;
}

function processCampaign(person, state) {
  const campaign = findCampaign(person);
  if (!campaign) {
    return;
  }
  state.polling = clamp(state.polling ?? campaign.polls ?? campaign.support ?? 45);
  state.funds = Math.max(0, Number(state.funds ?? campaign.funds ?? campaign.money) || 0);
  state.scandals = Math.max(0, Number(state.scandals) || 0);
  state.months = Math.max(0, Number(state.months) || 0) + 1;

  const professional = Number(person.reputation?.professional) || 50;
  const publicRep = Number(person.reputation?.public) || 25;
  const drift =
    Math.floor(Math.random() * 7) - 3 + (professional >= 70 ? 1 : 0) + (publicRep >= 60 ? 1 : 0);
  state.polling = clamp(state.polling + drift);
  campaign.polls = state.polling;
  campaign.support = state.polling;

  if (!person.pendingEvent && Math.random() < 0.32) {
    person.pendingEvent = {
      type: 'monthly_situation',
      situationType: 'campaign',
      text: `Campaign month ${state.months}: polling is at ${state.polling}%. What is your strategy?`,
      choices: [
        {
          text: 'Run positive advertisements ($5,000)',
          effect: 'campaign_positive',
          effects: { money: -5000, stress: 2 },
        },
        {
          text: 'Attack your opponent',
          effect: 'campaign_attack',
          effects: { karma: -3, stress: 4 },
        },
        {
          text: 'Hold town halls',
          effect: 'campaign_townhall',
          effects: { energy: -15, stress: 2 },
        },
      ],
    };
  }
}

function processDeployment(person, state) {
  state.months = Math.max(0, Number(state.months) || 0) + 1;
  state.missions = Math.max(0, Number(state.missions) || 0);
  state.medals = Math.max(0, Number(state.medals) || 0);
  const skill = ((Number(person.health) || 50) + (Number(person.smarts) || 50)) / 2;
  const danger =
    person.spaceProgram?.activeMission || person.spaceProgram?.currentMission ? 0.07 : 0.11;

  if (Math.random() < danger) {
    const severe = Math.random() > skill / 120;
    person.updateStats?.({ health: severe ? -18 : -7, stress: severe ? 12 : 6 });
    person.logEvent?.(
      severe
        ? 'You were seriously injured during a deployment mission.'
        : 'You suffered a minor deployment injury.',
      'bad'
    );
  } else {
    state.missions += 1;
    if (Math.random() < 0.12 + skill / 500) {
      state.medals += 1;
      person.updateStats?.({ fame: 2, happiness: 3 });
      person.logEvent?.('Your performance during deployment earned a service medal.', 'good');
    }
  }
}

function processLawsuit(person, state) {
  const lawsuits = person.activeLawsuits || [];
  if (lawsuits.length === 0) {
    return;
  }
  state.evidence = clamp(state.evidence ?? 45);
  state.legalCosts = Math.max(0, Number(state.legalCosts) || 0);
  state.months = Math.max(0, Number(state.months) || 0) + 1;
  const legalBill = 250 + lawsuits.length * 150;
  state.legalCosts += legalBill;
  const cash = Math.max(0, Number(person.money) || 0);
  const paid = Math.min(cash, legalBill);
  person.money = cash - paid;
  if (paid < legalBill) {
    person.personalDebt = (Number(person.personalDebt) || 0) + legalBill - paid;
  }

  if (!person.pendingEvent && state.months % 3 === 0) {
    person.pendingEvent = {
      type: 'monthly_situation',
      situationType: 'lawsuit',
      text: `The court case has lasted ${state.months} months. Evidence strength is ${state.evidence}%.`,
      choices: [
        {
          text: 'Pay for an investigator ($2,000)',
          effect: 'lawsuit_investigate',
          effects: { money: -2000, stress: 2 },
        },
        { text: 'Offer a settlement', effect: 'lawsuit_settle', effects: { stress: -4 } },
        { text: 'Continue to trial', effect: 'lawsuit_trial', effects: { stress: 4 } },
      ],
    };
  }
}

function processSports(person, state) {
  if (!person.collegeSport) {
    return;
  }
  state.months = Math.max(0, Number(state.months) || 0) + 1;
  state.performance = clamp(state.performance ?? person.collegeSport.performance ?? 50);
  state.wins = Math.max(0, Number(state.wins) || 0);
  state.losses = Math.max(0, Number(state.losses) || 0);
  const athleticism = Number(person.athleticism) || Number(person.health) || 50;
  const winChance = clamp((state.performance + athleticism) / 2, 10, 90) / 100;
  if (Math.random() < winChance) {
    state.wins += 1;
    state.performance = clamp(state.performance + 3);
    person.updateStats?.({ happiness: 3, fame: person.collegeSport.isProfessional ? 2 : 0 });
    person.logEvent?.('Your team won this month’s important match.', 'good');
  } else {
    state.losses += 1;
    state.performance = clamp(state.performance - 2);
    person.updateStats?.({ happiness: -2, stress: 2 });
    person.logEvent?.('Your team lost this month’s important match.', 'bad');
  }
  if (Math.random() < 0.05) {
    person.updateStats?.({ health: -8, stress: 5 });
    person.logEvent?.('A sports injury will affect your next matches.', 'bad');
  }
  person.collegeSport.performance = state.performance;
}

function processBusinessCrisis(person, state) {
  const companies = (person.companies || []).filter(
    company =>
      company?.crisis ||
      company?.status === 'crisis' ||
      company?.status === 'bankruptcy_risk' ||
      Number(company?.health) <= 20
  );
  if (companies.length === 0) {
    return;
  }
  state.months = Math.max(0, Number(state.months) || 0) + 1;
  companies.forEach(company => {
    company.crisisSeverity = clamp(company.crisisSeverity ?? 60);
    const management =
      ((Number(person.smarts) || 50) + (Number(person.reputation?.professional) || 50)) / 2;
    company.crisisSeverity = clamp(
      company.crisisSeverity + (Math.random() * 12 - 5) - management / 25
    );
    if (company.crisisSeverity <= 15) {
      company.crisis = false;
      company.status = 'active';
      person.logEvent?.(`${company.name} recovered from its business crisis.`, 'good');
    } else if (company.crisisSeverity >= 95) {
      company.status = 'bankruptcy_risk';
      person.logEvent?.(`${company.name} is close to bankruptcy.`, 'bad');
    }
  });
}

function processWar(person, state) {
  state.months = Math.max(0, Number(state.months) || 0) + 1;
  state.shortages = clamp(state.shortages ?? 15);
  state.shortages = clamp(state.shortages + Math.floor(Math.random() * 7) - 1);
  if (state.shortages >= 55) {
    const cost = 100 + state.shortages * 5;
    const cash = Math.max(0, Number(person.money) || 0);
    person.money = Math.max(0, cash - cost);
    person.updateStats?.({ happiness: -2, stress: 3 });
    person.logEvent?.(
      `War shortages increased your monthly costs by $${cost.toLocaleString()}.`,
      'bad'
    );
  }
  if (Math.random() < 0.04) {
    person.updateStats?.({ health: -4, stress: 6 });
    person.logEvent?.('The war reached your area and disrupted normal life.', 'bad');
  }
}

function processTreatment(person, state) {
  state.months = Math.max(0, Number(state.months) || 0) + 1;
  state.response = clamp(state.response ?? 45);
  const health = Number(person.health) || 50;
  state.response = clamp(
    state.response + Math.floor(Math.random() * 9) - 3 + (health >= 70 ? 2 : 0)
  );
  if (state.response >= 80) {
    person.inTreatment = false;
    person.updateStats?.({ health: 6, stress: -6, happiness: 4 });
    person.logEvent?.('Your treatment produced a strong recovery.', 'good');
  } else if (state.response <= 20) {
    person.updateStats?.({ health: -4, stress: 5 });
    person.logEvent?.('The current treatment is not working well.', 'bad');
  }
}

export function processMonthlySituation(person) {
  ensureTimeProgress(person);
  const systems = ensureMonthlySituations(person);
  const situation = getActiveMonthlySituation(person);
  if (!situation) {
    return null;
  }

  switch (situation.id) {
    case 'pregnancy':
      processPregnancy(person);
      break;
    case 'campaign':
      processCampaign(person, systems.campaign);
      break;
    case 'deployment':
      processDeployment(person, systems.deployment);
      break;
    case 'lawsuit':
      processLawsuit(person, systems.lawsuit);
      break;
    case 'sports':
      processSports(person, systems.sports);
      break;
    case 'business':
      processBusinessCrisis(person, systems.business);
      break;
    case 'war':
      processWar(person, systems.war);
      break;
    case 'treatment':
      processTreatment(person, systems.treatment);
      break;
    default:
      break;
  }
  return situation;
}

export function resolveMonthlySituationChoice(person, event, choice) {
  if (event?.type !== 'monthly_situation') {
    return false;
  }
  ensureMonthlySituations(person);
  const effects = { ...(choice?.effects || {}) };
  const moneyEffect = Number(effects.money);
  if (Number.isFinite(moneyEffect) && moneyEffect < 0) {
    const cost = Math.abs(moneyEffect);
    const cash = Math.max(0, Number(person.money) || 0);
    const paid = Math.min(cash, cost);
    person.money = cash - paid;
    if (paid < cost) {
      person.personalDebt = (Number(person.personalDebt) || 0) + cost - paid;
    }
    delete effects.money;
  }
  person.updateStats?.(effects);

  if (choice.effect === 'pregnancy_prenatal' && person.pregnancy) {
    person.pregnancy.prenatalCare = clamp((person.pregnancy.prenatalCare || 0) + 1, 0, 9);
    person.pregnancy.health = clamp((person.pregnancy.health || 80) + 6);
  } else if (choice.effect === 'pregnancy_rest' && person.pregnancy) {
    person.pregnancy.health = clamp((person.pregnancy.health || 80) + 3);
  } else if (choice.effect === 'pregnancy_work' && person.pregnancy) {
    person.pregnancy.health = clamp((person.pregnancy.health || 80) - 2);
  } else if (choice.effect === 'campaign_positive') {
    person.monthlySituations.campaign.polling = clamp(
      person.monthlySituations.campaign.polling + 5
    );
  } else if (choice.effect === 'campaign_attack') {
    const success = Math.random() < 0.55;
    person.monthlySituations.campaign.polling = clamp(
      person.monthlySituations.campaign.polling + (success ? 7 : -6)
    );
    if (!success) {
      person.monthlySituations.campaign.scandals += 1;
    }
  } else if (choice.effect === 'campaign_townhall') {
    person.monthlySituations.campaign.polling = clamp(
      person.monthlySituations.campaign.polling + 3
    );
    if (person.reputation) {
      person.reputation.trust = clamp(person.reputation.trust + 3);
    }
  } else if (choice.effect === 'lawsuit_investigate') {
    person.monthlySituations.lawsuit.evidence = clamp(
      person.monthlySituations.lawsuit.evidence + 18
    );
  } else if (choice.effect === 'lawsuit_settle') {
    const settlement = Math.max(
      1000,
      Math.floor((person.monthlySituations.lawsuit.legalCosts || 1000) * 1.5)
    );
    const cash = Math.max(0, Number(person.money) || 0);
    person.money = Math.max(0, cash - settlement);
    if (cash < settlement) {
      person.personalDebt = (Number(person.personalDebt) || 0) + settlement - cash;
    }
    person.activeLawsuits = [];
    person.logEvent?.(`You settled the lawsuit for $${settlement.toLocaleString()}.`, 'neutral');
  } else if (choice.effect === 'lawsuit_trial') {
    const won = Math.random() * 100 < (person.monthlySituations.lawsuit.evidence || 45);
    if (won) {
      person.money = (Number(person.money) || 0) + 10000;
      person.logEvent?.('You won the court case at trial.', 'good');
    } else {
      person.personalDebt = (Number(person.personalDebt) || 0) + 10000;
      person.logEvent?.('You lost the court case and owe damages.', 'bad');
    }
    person.activeLawsuits = [];
  }

  if (!['lawsuit_settle', 'lawsuit_trial'].includes(choice.effect)) {
    person.logEvent?.(choice.outcomeText || `You chose: ${choice.text}.`, choice.type || 'neutral');
  }
  person.pendingEvent = null;
  return true;
}

export function getMonthlySituationSummary(person) {
  const situation = getActiveMonthlySituation(person);
  if (!situation) {
    return null;
  }
  const systems = ensureMonthlySituations(person);
  if (situation.id === 'pregnancy') {
    return { type: 'pregnancy', ...person.pregnancy };
  }
  return { type: situation.id, ...(systems[situation.id] || {}) };
}
