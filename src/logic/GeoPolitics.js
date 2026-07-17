const GOVERNMENT_TYPES = ['democracy', 'autocracy', 'monarchy', 'communist', 'theocracy'];

const GOV_TYPE_MAP = {
  democracy: 'democracy',
  federal_republic: 'democracy',
  dictatorship: 'autocracy',
  junta: 'autocracy',
  failed_state: 'autocracy',
  autocracy: 'autocracy',
  monarchy: 'monarchy',
  communist: 'communist',
  theocracy: 'theocracy',
};

const ECONOMY_MAP = {
  usa: 'strong',
  china: 'strong',
  uk: 'strong',
  japan: 'strong',
  germany: 'strong',
  france: 'stable',
  canada: 'stable',
  australia: 'stable',
  south_korea: 'strong',
  netherlands: 'strong',
  sweden: 'strong',
  switzerland: 'strong',
  singapore: 'strong',
  uae: 'strong',
  saudi_arabia: 'strong',
  israel: 'strong',
};

import { RAW_COUNTRIES } from './WorldSimulation';

function buildBaseCountries() {
  return RAW_COUNTRIES.map(c => ({
    id: c.id,
    name: c.name,
    continent: c.continent,
    power: c.power,
    stability: c.stability,
    government: GOV_TYPE_MAP[c.govType] || 'democracy',
    economy: ECONOMY_MAP[c.id] || 'stable',
    relation: 50,
    tradeLevel: 0,
    alliance: null,
    atWar: false,
    tension: 5,
  }));
}

export function getBaseCountries() {
  return buildBaseCountries();
}

export function getCountryData(countryId) {
  return buildBaseCountries().find(c => c.id === countryId);
}

export function getCountryByName(name) {
  return buildBaseCountries().find(c => c.name === name);
}

export function initializeGeopolitics(person) {
  const myCountryName = person.country;
  const myCountry = getCountryByName(myCountryName);
  if (!myCountry) {
    return;
  }

  person.cabinet = {};
  person.policies = { taxRate: 30, militarySpending: 30, diplomacyBudget: 30, socialSpending: 30 };
  person.diplomaticHistory = [];
  person.countryRelations = {};

  getBaseCountries().forEach(c => {
    if (c.name === myCountryName) {
      person.countryRelations[c.id] = {
        relation: 100,
        tradeLevel: 3,
        alliance: 'self',
        atWar: false,
        tension: 0,
      };
      return;
    }
    let baseRelation = 50;
    if (c.continent === myCountry.continent) {
      baseRelation += 10;
    }
    if (c.government === myCountry.government) {
      baseRelation += 5;
    }
    if (
      c.government !== myCountry.government &&
      ['autocracy', 'theocracy', 'communist'].includes(c.government)
    ) {
      baseRelation -= 10;
    }
    if (
      c.government !== myCountry.government &&
      ['autocracy', 'theocracy', 'communist'].includes(myCountry.government)
    ) {
      baseRelation -= 10;
    }
    if (c.power > 80) {
      baseRelation -= 5;
    }
    person.countryRelations[c.id] = {
      relation: Math.max(5, Math.min(95, baseRelation)),
      tradeLevel: 0,
      alliance: null,
      atWar: false,
      tension: Math.max(0, 50 - baseRelation),
    };
  });
}

export const CABINET_POSITIONS = [
  {
    id: 'state',
    title: 'Secretary of State',
    effect: 'diplomacy',
    desc: 'Handles foreign affairs and diplomacy.',
  },
  {
    id: 'defense',
    title: 'Secretary of Defense',
    effect: 'military',
    desc: 'Oversees military and national security.',
  },
  {
    id: 'treasury',
    title: 'Secretary of Treasury',
    effect: 'economy',
    desc: 'Manages economic and fiscal policy.',
  },
  {
    id: 'justice',
    title: 'Attorney General',
    effect: 'justice',
    desc: 'Enforces law and administers justice.',
  },
  {
    id: 'health',
    title: 'Secretary of Health',
    effect: 'wellness',
    desc: 'Public health and social services.',
  },
];

export const CABINET_EFFECTS = {
  diplomacy: { label: 'Diplomacy Bonus', apply: eff => eff * 0.5 },
  military: { label: 'Military Bonus', apply: eff => eff * 1.5 },
  economy: { label: 'Economy Bonus', apply: eff => eff * 2 },
  justice: { label: 'Justice Bonus', apply: eff => eff * 0.3 },
  wellness: { label: 'Wellness Bonus', apply: eff => eff * 0.8 },
};

export function generateCabinetMember(person, position) {
  const firstNames = [
    'James',
    'Sarah',
    'Michael',
    'Emily',
    'Robert',
    'Linda',
    'David',
    'Maria',
    'Thomas',
    'Karen',
  ];
  const lastNames = [
    'Miller',
    'Garcia',
    'Williams',
    'Brown',
    'Jones',
    'Davis',
    'Martinez',
    'Anderson',
    'Taylor',
    'Thomas',
  ];
  const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  return {
    name,
    position: position.id,
    smarts: 50 + Math.floor(Math.random() * 40),
    loyalty: 50 + Math.floor(Math.random() * 40),
    effectiveness: 40 + Math.floor(Math.random() * 50),
    yearsServed: 0,
  };
}

export function getCabinetEffectiveness(person) {
  const cabinet = person.cabinet || {};
  let total = 0;
  let count = 0;
  CABINET_POSITIONS.forEach(pos => {
    const member = cabinet[pos.id];
    if (member) {
      total += member.effectiveness || 30;
      count++;
    }
  });
  return count > 0 ? Math.floor(total / count) : 30;
}

export const DIPLOMATIC_ACTIONS = [
  {
    id: 'improve_relations',
    name: 'Improve Relations',
    cost: 10000,
    minRelation: 0,
    cooldown: 2,
    effects: { relation: 12, tension: -5 },
    risk: 5,
    desc: 'Send diplomats to improve bilateral relations.',
  },
  {
    id: 'trade_deal',
    name: 'Sign Trade Deal',
    cost: 50000,
    minRelation: 50,
    cooldown: 4,
    effects: { relation: 15, tradeLevel: 1 },
    risk: 10,
    desc: 'Negotiate a bilateral trade agreement.',
  },
  {
    id: 'form_alliance',
    name: 'Form Alliance',
    cost: 200000,
    minRelation: 75,
    cooldown: 8,
    effects: { relation: 20, alliance: 'ally' },
    risk: 15,
    desc: 'Propose a formal military alliance.',
  },
  {
    id: 'impose_sanctions',
    name: 'Impose Sanctions',
    cost: 50000,
    minRelation: 0,
    cooldown: 3,
    effects: { relation: -30, tension: 35, tradeLevel: -1 },
    risk: 20,
    desc: 'Economic sanctions to pressure the regime.',
  },
  {
    id: 'declare_war',
    name: 'Declare War',
    cost: 1000000,
    minRelation: 0,
    cooldown: 0,
    effects: { relation: -50, atWar: true, tension: 100, tradeLevel: -99 },
    risk: 50,
    desc: 'Military conflict. Extreme consequences.',
  },
  {
    id: 'peace_treaty',
    name: 'Peace Treaty',
    cost: 200000,
    minRelation: 25,
    cooldown: 0,
    effects: { relation: 30, atWar: false, tension: -60 },
    risk: 10,
    desc: 'Negotiate an end to military hostilities.',
  },
  {
    id: 'send_aid',
    name: 'Send Humanitarian Aid',
    cost: 100000,
    minRelation: 0,
    cooldown: 3,
    effects: { relation: 15, tension: -10 },
    risk: 2,
    desc: 'Send aid to a struggling nation.',
  },
  {
    id: 'state_visit',
    name: 'State Visit',
    cost: 50000,
    minRelation: 30,
    cooldown: 2,
    effects: { relation: 20, fame: 3 },
    risk: 8,
    desc: 'Visit the country for diplomatic talks.',
  },
];

export function executeDiplomaticAction(person, targetCountryId, actionId) {
  const action = DIPLOMATIC_ACTIONS.find(a => a.id === actionId);
  if (!action) {
    return { success: false, message: 'Unknown action.' };
  }

  const target = getCountryData(targetCountryId);
  if (!target) {
    return { success: false, message: 'Country not found.' };
  }
  if (target.name === person.country) {
    return { success: false, message: 'You cannot target your own country.' };
  }

  if (!person.countryRelations || !person.countryRelations[targetCountryId]) {
    return { success: false, message: 'No relations data for this country.' };
  }
  const rel = person.countryRelations[targetCountryId];

  if (actionId === 'declare_war' && rel.atWar) {
    return { success: false, message: `Already at war with ${target.name}.` };
  }
  if (actionId === 'peace_treaty' && !rel.atWar) {
    return { success: false, message: `Not at war with ${target.name}.` };
  }
  if (actionId === 'form_alliance' && rel.alliance === 'ally') {
    return { success: false, message: `Already allied with ${target.name}.` };
  }
  if (action.minRelation > rel.relation) {
    return {
      success: false,
      message: `Relations too low (need ${action.minRelation}, have ${rel.relation}).`,
    };
  }

  if (person.money < action.cost) {
    return { success: false, message: `Need $${action.cost.toLocaleString()} for this action.` };
  }

  const cabEff = getCabinetEffectiveness(person);
  const diploMember = person.cabinet?.state;
  const diploBonus = diploMember ? Math.floor(diploMember.effectiveness / 20) : 0;

  const successChance = Math.min(90, 50 + cabEff / 5 + diploBonus - action.risk);
  const roll = Math.random() * 100;

  if (roll > successChance) {
    person.money = Math.max(0, person.money - Math.floor(action.cost * 0.3));
    return {
      success: false,
      message: `${action.name} failed! International embarrassment. Relations worsened.`,
    };
  }

  person.money = Math.max(0, person.money - action.cost);

  if (action.effects.relation) {
    rel.relation = Math.max(0, Math.min(100, rel.relation + action.effects.relation));
  }
  if (action.effects.tension !== undefined) {
    rel.tension = Math.max(0, Math.min(100, (rel.tension || 0) + action.effects.tension));
  }
  if (action.effects.tradeLevel !== undefined) {
    if (action.effects.tradeLevel === -99) {
      rel.tradeLevel = 0;
    } else {
      rel.tradeLevel = Math.max(0, Math.min(3, (rel.tradeLevel || 0) + action.effects.tradeLevel));
    }
  }
  if (action.effects.alliance) {
    rel.alliance = action.effects.alliance;
  }
  if (action.effects.atWar !== undefined) {
    rel.atWar = action.effects.atWar;
  }
  if (action.effects.fame && action.effects.fame > 0) {
    person.fame = Math.min(100, (person.fame || 0) + action.effects.fame);
  }

  if (actionId === 'declare_war') {
    person.wars ??= {};
    person.wars[targetCountryId] ??= {
      targetId: targetCountryId,
      targetName: target.name,
      years: 0,
      casualties: 0,
      territoryGained: 0,
      phase: 'invasion',
      battles: [],
      pendingEvent: null,
    };
    person.logEvent(
      `WAR DECLARED! You have declared war on ${target.name}. The world watches with concern.`,
      'bad'
    );
    if (person.job) {
      person.job.approval = Math.max(0, (person.job.approval ?? 50) + 5);
    }
  } else if (actionId === 'peace_treaty') {
    if (person.wars) {
      delete person.wars[targetCountryId];
    }
    person.logEvent(`PEACE! A peace treaty with ${target.name} has been signed.`, 'good');
    if (person.job) {
      person.job.approval = Math.min(100, (person.job.approval ?? 50) + 10);
    }
  } else if (actionId === 'form_alliance') {
    person.logEvent(
      `ALLIANCE FORMED! You have entered into a formal alliance with ${target.name}.`,
      'good'
    );
  } else {
    person.logEvent(`Diplomacy: ${action.name} with ${target.name} succeeded.`, 'good');
  }

  const event = { action: actionId, country: targetCountryId, age: person.age, success: true };
  if (!person.diplomaticHistory) {
    person.diplomaticHistory = [];
  }
  person.diplomaticHistory.push(event);

  return { success: true, message: `${action.name} with ${target.name} succeeded!` };
}

export const GEOPOLITICAL_EVENTS = [
  {
    id: 'border_dispute',
    minPower: 30,
    trigger: (p, c) => c.tension > 50 && Math.random() < 0.3,
    text: 'A border dispute with {country} is escalating. Troops are massing near the border.',
    choices: [
      {
        text: 'Negotiate',
        effects: { money: -50000, relation: 5, tension: -15 },
        outcome: 'Diplomacy defused the situation. Tensions ease.',
      },
      {
        text: 'Show Force',
        effects: { tension: 20, relation: -10, approval: 3 },
        outcome: 'Your show of strength is popular at home but escalates tensions.',
      },
      {
        text: 'Ignore',
        effects: { tension: 10, relation: -5, approval: -5 },
        outcome: 'Your inaction is seen as weakness.',
      },
    ],
  },
  {
    id: 'terrorist_threat',
    minPower: 20,
    trigger: (p, c) => c.tension > 30 && Math.random() < 0.2,
    text: 'Intelligence reports a terrorist cell operating from {country}. They demand action.',
    choices: [
      {
        text: 'Military Strike',
        effects: { money: -200000, relation: -15, tension: 20, approval: 8 },
        outcome: 'The strike succeeded but caused international outrage.',
      },
      {
        text: 'Cooperate',
        effects: { money: -50000, relation: 10, tension: -10 },
        outcome: 'Joint operation neutralized the threat. Relations improved.',
      },
      {
        text: 'Do Nothing',
        effects: { approval: -8, tension: 5 },
        outcome: 'The threat remains. Your approval drops.',
      },
    ],
  },
  {
    id: 'trade_dispute',
    minPower: 40,
    trigger: (p, c) => c.tradeLevel > 0 && Math.random() < 0.25,
    text: '{country} has imposed tariffs on your exports. A trade war is brewing.',
    choices: [
      {
        text: 'Retaliate',
        effects: { money: -100000, relation: -15, tension: 20, approval: 5 },
        outcome: 'Tit-for-tat tariffs. Both economies suffer.',
      },
      {
        text: 'Negotiate',
        effects: { money: -30000, relation: 8, tension: -10 },
        outcome: 'A compromise was reached. Trade continues.',
      },
      {
        text: 'Stand Down',
        effects: { relation: 5, tension: -15, approval: -5 },
        outcome: 'You backed down. Relations stabilize but you look weak.',
      },
    ],
  },
  {
    id: 'diplomatic_incident',
    minPower: 30,
    trigger: (p, c) => Math.random() < 0.15,
    text: 'An embarrassing diplomatic incident with {country} has gone viral. The ambassador is recalled.',
    choices: [
      {
        text: 'Apologize',
        effects: { relation: 5, tension: -10, approval: -3 },
        outcome: 'Apology accepted. Tensions cool.',
      },
      {
        text: 'Blame Media',
        effects: { relation: -10, tension: 15, approval: 2 },
        outcome: 'Your base loves it, but relations sour.',
      },
    ],
  },
  {
    id: 'economic_aid_request',
    minPower: 20,
    trigger: (p, c) => c.economy === 'weak' && Math.random() < 0.3,
    text: '{country} is facing a humanitarian crisis and has requested emergency aid.',
    choices: [
      {
        text: 'Send Aid ($200k)',
        effects: { money: -200000, relation: 20, tension: -15, approval: 3 },
        outcome: 'The aid saves lives. Your prestige grows.',
      },
      {
        text: 'Modest Aid ($50k)',
        effects: { money: -50000, relation: 8, tension: -5 },
        outcome: 'A modest contribution. They are grateful.',
      },
      {
        text: 'Decline',
        effects: { relation: -15, tension: 10 },
        outcome: 'They feel abandoned. Relations cool.',
      },
    ],
  },
  {
    id: 'olympics_hosting',
    minPower: 40,
    trigger: () => Math.random() < 0.08,
    text: 'The International Olympic Committee has offered {country} a chance to co-host the next Olympic Games.',
    choices: [
      {
        text: 'Bid Generously ($500k)',
        effects: { money: -500000, fame: 8, approval: 10, relation: 10 },
        outcome: 'The games are a massive success! The world applauds.',
      },
      {
        text: 'Support Nomination',
        effects: { money: -100000, fame: 3, approval: 3, relation: 5 },
        outcome: 'A moderate bid. The games go well.',
      },
      {
        text: 'Pass',
        effects: { approval: -3 },
        outcome: 'Another country will host. Missed opportunity.',
      },
    ],
  },
  {
    id: 'intelligence_breach',
    minPower: 50,
    trigger: (p, c) => c.tension > 40 && Math.random() < 0.15,
    text: 'A massive intelligence breach linked to {country} has exposed classified operations.',
    choices: [
      {
        text: 'Condemn Publicly',
        effects: { relation: -20, tension: 25, approval: 5 },
        outcome: 'Strong words. Tensions spike.',
      },
      {
        text: 'Secret Diplomacy',
        effects: { money: -50000, relation: -5, tension: -5 },
        outcome: 'Backchannel talks contain the damage.',
      },
    ],
  },
];
GEOPOLITICAL_EVENTS.forEach(e => {
  if (!e.choices) {
    e.choices = [];
  }
});

export function processGeopoliticsYear(person) {
  if (!person.job || !person.job.isPolitical || !person.countryRelations) {
    return;
  }

  const myCountry = getCountryByName(person.country);
  if (!myCountry) {
    return;
  }

  Object.keys(person.countryRelations).forEach(cId => {
    const rel = person.countryRelations[cId];
    if (!rel || cId === getCountryByName(person.country)?.id) {
      return;
    }
    rel.relation = Math.max(
      0,
      Math.min(100, (rel.relation ?? 50) + Math.floor(Math.random() * 5) - 2)
    );
    rel.tension = Math.max(
      0,
      Math.min(100, (rel.tension || 0) + Math.floor(Math.random() * 4) - 2)
    );
    if (rel.atWar) {
      rel.relation = Math.max(0, rel.relation - 2);
      rel.tension = Math.min(100, rel.tension + 3);
    }
  });

  CABINET_POSITIONS.forEach(pos => {
    const member = person.cabinet?.[pos.id];
    if (member) {
      member.yearsServed = (member.yearsServed || 0) + 1;
      member.loyalty = Math.min(100, (member.loyalty ?? 50) + Math.floor(Math.random() * 3) - 1);
      const effChange = Math.floor(Math.random() * 5) - 2;
      member.effectiveness = Math.max(10, Math.min(100, (member.effectiveness ?? 30) + effChange));
    }
  });

  if (Math.random() < 0.4) {
    const eligible = Object.keys(person.countryRelations)
      .map(id => ({ id, data: person.countryRelations[id], country: getCountryData(id) }))
      .filter(x => x.country && x.id !== myCountry.id);
    if (eligible.length > 0) {
      const target = eligible[Math.floor(Math.random() * eligible.length)];
      const crisisEvents = GEOPOLITICAL_EVENTS.filter(
        e => e.minPower <= (target.country.power || 50)
      );
      for (const evt of crisisEvents) {
        if (evt.trigger && evt.trigger(person, target.data)) {
          person.pendingGeopoliticalEvent = {
            eventId: evt.id,
            countryId: target.id,
            countryName: target.country.name,
            text: evt.text.replace('{country}', target.country.name),
            choices: evt.choices,
          };
          break;
        }
      }
    }
  }
}

export function resolveGeopoliticalEvent(person, choiceIndex) {
  const geoEvent = person.pendingGeopoliticalEvent;
  if (!geoEvent) {
    return;
  }

  const choice = geoEvent.choices?.[choiceIndex];
  if (!choice) {
    person.pendingGeopoliticalEvent = null;
    return;
  }

  if (choice.effects.money) {
    person.money = Math.max(0, person.money + choice.effects.money);
  }
  if (choice.effects.relation && geoEvent.countryId) {
    const rel = person.countryRelations?.[geoEvent.countryId];
    if (rel) {
      rel.relation = Math.max(0, Math.min(100, rel.relation + choice.effects.relation));
    }
  }
  if (choice.effects.tension && geoEvent.countryId) {
    const rel = person.countryRelations?.[geoEvent.countryId];
    if (rel) {
      rel.tension = Math.max(0, Math.min(100, (rel.tension || 0) + choice.effects.tension));
    }
  }
  if (choice.effects.approval && person.job) {
    person.job.approval = Math.max(
      0,
      Math.min(100, (person.job.approval ?? 50) + choice.effects.approval)
    );
  }
  if (choice.effects.fame) {
    person.fame = Math.min(100, (person.fame || 0) + choice.effects.fame);
  }

  person.logEvent(
    `[Geopolitics] ${choice.outcome}`,
    choice.effects.approval > 0 ? 'good' : choice.effects.approval < 0 ? 'bad' : 'neutral'
  );
  person.pendingGeopoliticalEvent = null;
}

export function updatePolicies(person) {
  if (!person.policies) {
    return;
  }
  if (!person.job?.isPolitical) {
    return;
  }

  const p = person.policies;

  let economyImpact = 0;
  economyImpact += Math.floor((p.taxRate - 30) / 10) * 3;
  economyImpact += Math.floor((p.militarySpending - 30) / 10) * -2;
  economyImpact += Math.floor((p.socialSpending - 30) / 10) * 2;

  const treasuryMember = person.cabinet?.treasury;
  if (treasuryMember) {
    economyImpact += Math.floor(treasuryMember.effectiveness / 20);
  }

  if (economyImpact > 0) {
    person.logEvent(`Sound economic policies are paying off. The economy is thriving.`, 'good');
    if (person.job) {
      person.job.approval = Math.min(100, (person.job.approval ?? 50) + 2);
    }
  } else if (economyImpact < -5) {
    person.logEvent(
      `Economic mismanagement is taking a toll. The public is growing restless.`,
      'bad'
    );
    if (person.job) {
      person.job.approval = Math.max(0, (person.job.approval ?? 50) - 3);
    }
  }

  const socImpact = Math.floor((p.socialSpending - 30) / 10) * 3;
  if (socImpact > 3) {
    person.updateStats({ happiness: 3 });
  } else if (socImpact < -3) {
    person.updateStats({ happiness: -3 });
  }
}

export function getAvailableActions(person, targetCountryId) {
  const rel = person.countryRelations?.[targetCountryId];
  if (!rel) {
    return [];
  }

  return DIPLOMATIC_ACTIONS.filter(action => {
    if (action.id === 'peace_treaty' && !rel.atWar) {
      return false;
    }
    if (action.id === 'declare_war' && rel.atWar) {
      return false;
    }
    if (action.id === 'form_alliance' && rel.alliance === 'ally') {
      return false;
    }
    if (action.minRelation > rel.relation) {
      return false;
    }
    if (
      rel.atWar &&
      ['improve_relations', 'trade_deal', 'send_aid', 'state_visit'].includes(action.id)
    ) {
      return false;
    }
    return true;
  });
}
