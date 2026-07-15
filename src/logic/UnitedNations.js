import { getBaseCountries, getCountryData, getCountryByName } from './GeoPolitics';

export const SECURITY_COUNCIL = ['usa', 'uk', 'france', 'russia', 'china'];

export const RESOLUTION_TYPES = [
  {
    id: 'condemn',
    name: 'Condemn Nation',
    desc: 'Official UN condemnation — damages reputation and relations',
    cost: 0,
    minApproval: 0,
    effect: { relationDelta: -15, tensionDelta: 10 },
  },
  {
    id: 'sanctions',
    name: 'Impose UN Sanctions',
    desc: 'Multilateral economic sanctions — hurts target economy',
    cost: 50000,
    minApproval: 30,
    effect: { relationDelta: -25, tensionDelta: 20, tradeLevel: -2 },
  },
  {
    id: 'peacekeeping',
    name: 'Deploy Peacekeepers',
    desc: 'UN peacekeeping force to stabilize a conflict zone',
    cost: 200000,
    minApproval: 40,
    effect: { tensionDelta: -30, relationDelta: 10 },
  },
  {
    id: 'authorize_force',
    name: 'Authorize Military Force',
    desc: 'UN authorization to use military force against a nation',
    cost: 100000,
    minApproval: 50,
    effect: { relationDelta: -40, tensionDelta: 30 },
  },
  {
    id: 'war_crimes',
    name: 'War Crimes Tribunal',
    desc: 'Refer nation to International Criminal Court',
    cost: 100000,
    minApproval: 40,
    effect: { relationDelta: -35, relationToAll: -5 },
  },
  {
    id: 'demand_peace',
    name: 'Demand Ceasefire',
    desc: 'UN demands immediate ceasefire in ongoing conflict',
    cost: 0,
    minApproval: 30,
    effect: { tensionDelta: -20 },
  },
];

export function calculateUNInfluence(person) {
  const myCountry = getCountryByName(person.country);
  if (!myCountry) return 0;
  let influence = myCountry.power;
  if (SECURITY_COUNCIL.includes(myCountry.id)) influence += 20;
  influence += Math.floor((person.policies?.diplomacyBudget || 30) / 5);
  const stateMember = person.cabinet?.state;
  if (stateMember) influence += Math.floor(stateMember.effectiveness / 5);
  return Math.min(100, influence);
}

export function canProposeResolution(person, targetId, resolutionId) {
  const myCountry = getCountryByName(person.country);
  if (!myCountry) return false;
  const target = getCountryData(targetId);
  if (!target) return false;
  if (target.name === person.country) return false;

  const resolution = RESOLUTION_TYPES.find(r => r.id === resolutionId);
  if (!resolution) return false;

  if (!person.unResolutions) person.unResolutions = [];
  const existing = person.unResolutions.find(r => r.targetId === targetId && r.type === resolutionId && !r.resolved);
  if (existing) return false;

  const influence = calculateUNInfluence(person);
  if (influence < resolution.minApproval) return false;

  return true;
}

export function proposeResolution(person, targetId, resolutionId) {
  if (!canProposeResolution(person, targetId, resolutionId)) {
    return { success: false, message: 'Cannot propose this resolution.' };
  }

  const resolution = RESOLUTION_TYPES.find(r => r.id === resolutionId);
  const target = getCountryData(targetId);

  if (resolution.cost > 0 && person.money < resolution.cost) {
    return { success: false, message: `Need $${resolution.cost.toLocaleString()} to propose.` };
  }

  if (resolution.cost > 0) person.money -= resolution.cost;

  const myCountry = getCountryByName(person.country);
  const influence = calculateUNInfluence(person);
  const countries = getBaseCountries().filter(c => c.name !== person.country);
  let votesFor = 0;
  let votesAgainst = 0;
  let vetoed = false;

  countries.forEach(c => {
    const rel = person.countryRelations?.[c.id];
    const baseSupport = rel ? (rel.relation - 30) / 10 : 0;
    let supportModifier = (influence - 30) / 15;

    if (SECURITY_COUNCIL.includes(c.id) && c.name !== person.country) {
      const councilRel = rel?.relation || 50;
      if (councilRel < 30) {
        vetoed = true;
      }
      supportModifier += 10;
    }

    if (c.government !== myCountry.government) supportModifier -= 2;
    if (c.continent === myCountry.continent) supportModifier += 2;
    if (rel?.alliance === 'ally') supportModifier += 5;
    if (rel?.atWar) supportModifier -= 10;

    const support = Math.max(0, Math.min(100, 50 + baseSupport * 5 + supportModifier));
    if (support > 50) votesFor++;
    else votesAgainst++;
  });

  const total = votesFor + votesAgainst;
  const pctFor = total > 0 ? (votesFor / total) * 100 : 0;
  const passed = pctFor > 50 && !vetoed;

  const resolutionEntry = {
    type: resolutionId,
    targetId,
    targetName: target.name,
    year: person.age,
    votesFor,
    votesAgainst,
    total,
    pctFor: Math.round(pctFor),
    passed,
    vetoed,
    resolved: true,
  };

  if (!person.unResolutions) person.unResolutions = [];
  person.unResolutions.push(resolutionEntry);

  const rel = person.countryRelations?.[targetId];
  if (rel && resolution.effect.relationDelta) {
    rel.relation = Math.max(0, Math.min(100, (rel.relation || 50) + resolution.effect.relationDelta));
  }
  if (rel && resolution.effect.tensionDelta) {
    rel.tension = Math.max(0, Math.min(100, (rel.tension || 0) + resolution.effect.tensionDelta));
  }
  if (rel && resolution.effect.tradeLevel) {
    rel.tradeLevel = Math.max(0, Math.min(3, (rel.tradeLevel || 0) + resolution.effect.tradeLevel));
  }

  if (resolution.effect.relationToAll) {
    Object.keys(person.countryRelations || {}).forEach(cId => {
      if (cId !== targetId) {
        person.countryRelations[cId].relation = Math.max(0, Math.min(100,
          (person.countryRelations[cId].relation || 50) + resolution.effect.relationToAll));
      }
    });
  }

  let message;
  if (vetoed) {
    message = `🚫 Resolution to ${resolution.name} against ${target.name} was VETOED by a Security Council member!`;
    person.logEvent(`[UN] ${message}`, 'bad');
  } else if (passed) {
    message = `✅ UN Resolution to ${resolution.name} against ${target.name} PASSED (${Math.round(pctFor)}% for).`;
    person.logEvent(`[UN] ${message}`, 'good');
    if (person.job) person.job.approval = Math.min(100, (person.job.approval || 50) + 3);
  } else {
    message = `❌ UN Resolution to ${resolution.name} against ${target.name} FAILED (${Math.round(pctFor)}% for).`;
    person.logEvent(`[UN] ${message}`, 'neutral');
  }

  return { success: true, message, passed, vetoed, votesFor, votesAgainst, pctFor: Math.round(pctFor) };
}

export function getUNResolutions(person) {
  return person.unResolutions || [];
}

export function getPendingUNResolutions(person) {
  return (person.unResolutions || []).filter(r => !r.resolved);
}
