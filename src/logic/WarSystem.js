import { getCountryData, getCountryByName } from './GeoPolitics';

export function getMilitaryStrength(person) {
  if (!person.policies) {
    return 50;
  }
  const base = getCountryByName(person.country)?.power || 50;
  const spendBonus = Math.floor((person.policies.militarySpending || 30) / 10) * 8;
  const defMember = person.cabinet?.defense;
  const cabBonus = defMember ? Math.floor(defMember.effectiveness / 3) : 0;
  const warDurationPenalty = Math.min(
    30,
    Object.keys(person.countryRelations || {}).filter(id => person.countryRelations[id]?.atWar)
      .length * 5
  );
  return Math.max(10, Math.min(100, base + spendBonus + cabBonus - warDurationPenalty));
}

export function getWarExhaustion(person, countryId) {
  if (!person.wars) {
    person.wars = {};
  }
  const war = person.wars[countryId];
  if (!war) {
    return 0;
  }

  const yearsExhaustion = (Number(war.years) || 0) * 8;
  const casualtyExhaustion = Math.floor((Number(war.casualties) || 0) / 10000);
  return Math.min(100, yearsExhaustion + casualtyExhaustion);
}

export function startWar(person, targetId) {
  const target = getCountryData(targetId);
  if (!target) {
    return { success: false, message: 'Target not found.' };
  }
  const myCountry = getCountryByName(person.country);
  if (!myCountry) {
    return { success: false, message: 'Your country not found.' };
  }

  if (!person.wars) {
    person.wars = {};
  }
  person.wars[targetId] = {
    targetId,
    targetName: target.name,
    years: 0,
    casualties: 0,
    territoryGained: 0,
    phase: 'invasion',
    battles: [],
    pendingEvent: null,
  };

  const rel = person.countryRelations?.[targetId];
  if (rel) {
    rel.atWar = true;
    rel.tension = 100;
    rel.relation = Math.max(0, (rel.relation || 50) - 60);
    rel.tradeLevel = 0;
  }

  return { success: true, message: `⚔️ War declared on ${target.name}!` };
}

export function getWarPhases(person, countryId) {
  const war = person.wars?.[countryId];
  if (!war) {
    return [];
  }
  const myStrength = getMilitaryStrength(person);
  const target = getCountryData(countryId);
  const targetPower = target?.power || 50;
  const relativePower = myStrength - targetPower;

  const phases = [
    {
      id: 'offensive',
      name: 'Full Offensive',
      desc: 'All-out attack to crush enemy forces quickly',
      risk: 30 + relativePower,
      reward: 40 + relativePower,
      morale: 10,
    },
    {
      id: 'defensive',
      name: 'Defensive Posture',
      desc: 'Hold positions, minimize casualties',
      risk: 10,
      reward: 10,
      morale: -5,
    },
    {
      id: 'siege',
      name: 'Strategic Siege',
      desc: 'Cut supply lines and wait them out',
      risk: 15,
      reward: 25 + relativePower,
      morale: 0,
    },
    {
      id: 'special_ops',
      name: 'Special Operations',
      desc: 'Elite strikes on key infrastructure',
      risk: 40,
      reward: 35,
      morale: 15,
    },
    {
      id: 'naval_blockade',
      name: 'Naval Blockade',
      desc: 'Block trade and isolate economically',
      risk: 20,
      reward: 20,
      morale: 5,
    },
  ];
  return phases;
}

export function executeWarPhase(person, countryId, phaseId) {
  const war = person.wars?.[countryId];
  if (!war) {
    return { success: false, message: 'War not found.' };
  }

  const myStrength = getMilitaryStrength(person);
  const target = getCountryData(countryId);
  const targetPower = target?.power || 50;
  const exhaustion = getWarExhaustion(person, countryId);

  const phases = getWarPhases(person, countryId);
  const phase = phases.find(p => p.id === phaseId);
  if (!phase) {
    return { success: false, message: 'Invalid phase.' };
  }

  const roll = Math.random() * 100;
  const successChance =
    50 + (myStrength - targetPower) / 2 - exhaustion / 3 + (phase.reward - phase.risk) / 2;
  const success = roll < Math.min(90, Math.max(10, successChance));

  const casualties = Math.floor(1000 + Math.random() * 9000 * (phase.risk / 50));
  war.years += 1;
  war.casualties += casualties;

  let message;
  let territory = 0;
  let approvalDelta = 0;
  let relationDelta = 0;
  let tensionDelta = 5;

  if (success) {
    territory = Math.floor(5 + Math.random() * 15 * (phase.reward / 30));
    war.territoryGained += territory;
    approvalDelta = 3 + Math.floor(phase.morale / 3);
    relationDelta = -5;
    message = `✅ ${phase.name} succeeded! Gained ${territory}% territory control. ${casualties.toLocaleString()} casualties.`;
    person.logEvent(`[War] ${message}`, 'good');
  } else {
    war.territoryGained = Math.max(0, war.territoryGained - Math.floor(5 + Math.random() * 10));
    approvalDelta = -3;
    relationDelta = -10;
    tensionDelta = 10;
    message = `❌ ${phase.name} failed! Lost ground. ${casualties.toLocaleString()} casualties.`;
    person.logEvent(`[War] ${message}`, 'bad');
  }

  war.pendingEvent = null;
  war.battles.push({ phase: phaseId, success, casualties, territory, year: person.age });

  const rel = person.countryRelations?.[countryId];
  if (rel) {
    rel.relation = Math.max(0, (rel.relation || 50) + relationDelta);
    rel.tension = Math.min(100, (rel.tension || 50) + tensionDelta);
  }
  if (person.job) {
    person.job.approval = Math.max(0, Math.min(100, (person.job.approval || 50) + approvalDelta));
  }

  if (war.territoryGained >= 80) {
    war.pendingEvent = {
      type: 'victory',
      text: `${target.name} is on the verge of collapse! You control ${war.territoryGained}% of their territory.`,
      choices: [
        { text: 'Accept Surrender — Demand Reparations ($500k)', effect: 'reparations' },
        { text: 'Accept Surrender — Annex Territory', effect: 'annex' },
        { text: 'Accept Surrender — Install Puppet Government', effect: 'puppet' },
        { text: 'Total Conquest — Crush Them Completely', effect: 'total' },
      ],
    };
  } else if (war.territoryGained <= 0 && war.years > 2) {
    war.pendingEvent = {
      type: 'defeat',
      text: `Your military is in shambles. ${target.name} is counter-attacking successfully.`,
      choices: [
        { text: 'Sue for Peace — Pay Reparations ($300k)', effect: 'surrender_reparations' },
        { text: 'Sue for Peace — Cede Territory', effect: 'cede' },
        { text: 'Fight On — Desperate Defense', effect: 'desperate' },
      ],
    };
  }

  return { success, message, casualties, territory, war, victory: war.territoryGained >= 80 };
}

export function resolveWarEnd(person, countryId, choice) {
  const war = person.wars?.[countryId];
  if (!war) {
    return { message: 'War not found.' };
  }
  const target = getCountryData(countryId);
  const rel = person.countryRelations?.[countryId];

  let message;
  switch (choice) {
    case 'reparations':
      person.money = (person.money || 0) + 500000;
      if (rel) {
        rel.relation = 30;
        rel.atWar = false;
        rel.tension = 30;
      }
      message = `💰 ${target.name} pays $500,000 in war reparations. Victory is yours!`;
      person.logEvent(`[War] ${message}`, 'good');
      break;
    case 'annex':
      if (rel) {
        rel.relation = 10;
        rel.atWar = false;
        rel.tension = 50;
      }
      person.fame = Math.min(100, (person.fame || 0) + 15);
      if (person.job) {
        person.job.approval = Math.min(100, (person.job.approval || 50) + 15);
      }
      message = `🗺️ You annexed ${target.name}! Your country grows stronger. The world is alarmed.`;
      person.logEvent(`[War] ${message}`, 'good');
      break;
    case 'puppet':
      if (rel) {
        rel.relation = 50;
        rel.atWar = false;
        rel.tension = 20;
        rel.alliance = 'ally';
      }
      person.fame = Math.min(100, (person.fame || 0) + 10);
      message = `🎭 A puppet government installed in ${target.name}. They answer to you now.`;
      person.logEvent(`[War] ${message}`, 'good');
      break;
    case 'total':
      if (rel) {
        rel.relation = 0;
        rel.atWar = false;
        rel.tension = 80;
      }
      person.fame = Math.min(100, (person.fame || 0) + 25);
      person.notoriety = Math.min(100, (person.notoriety || 0) + 30);
      if (person.job) {
        person.job.approval = Math.min(100, (person.job.approval || 50) + 20);
      }
      message = `💀 ${target.name} has been completely conquered! The world condemns your brutality.`;
      person.logEvent(`[War] ${message}`, 'neutral');
      break;
    case 'surrender_reparations':
      person.money = Math.max(0, (person.money || 0) - 300000);
      if (rel) {
        rel.relation = 20;
        rel.atWar = false;
        rel.tension = 60;
      }
      if (person.job) {
        person.job.approval = Math.max(0, (person.job.approval || 50) - 15);
      }
      message = `😔 You paid $300,000 in reparations to ${target.name}. Humiliating defeat.`;
      person.logEvent(`[War] ${message}`, 'bad');
      break;
    case 'cede':
      if (rel) {
        rel.relation = 15;
        rel.atWar = false;
        rel.tension = 70;
      }
      if (person.job) {
        person.job.approval = Math.max(0, (person.job.approval || 50) - 20);
      }
      person.fame = Math.max(0, (person.fame || 0) - 10);
      message = `🗺️ You ceded territory to ${target.name}. The nation mourns.`;
      person.logEvent(`[War] ${message}`, 'bad');
      break;
    case 'desperate':
      if (rel) {
        rel.atWar = false;
        rel.tension = 50;
        rel.relation = 10;
      }
      if (person.job) {
        person.job.approval = Math.max(0, (person.job.approval || 50) - 5);
      }
      message = `⚔️ Your desperate defense held. A stalemate. War ends with no clear victor.`;
      person.logEvent(`[War] ${message}`, 'neutral');
      break;
    default:
      if (rel) {
        rel.atWar = false;
        rel.tension = 50;
        rel.relation = 25;
      }
      message = `🕊️ War with ${target.name} has ended.`;
      person.logEvent(`[War] ${message}`, 'neutral');
  }

  delete person.wars[countryId];
  return { message };
}

export function getWarStatus(person) {
  if (!person.wars) {
    return [];
  }
  return Object.entries(person.wars)
    .filter(([_, war]) => war)
    .map(([id, war]) => ({
      countryId: id,
      targetName: war.targetName,
      years: war.years,
      casualties: war.casualties,
      territoryGained: war.territoryGained,
      phase: war.phase,
      hasPendingEvent: !!war.pendingEvent,
      pendingEvent: war.pendingEvent,
      battles: war.battles,
    }));
}

export function processWarYears(person) {
  if (!person.wars) {
    return;
  }
  if (!person.countryRelations) {
    return;
  }

  Object.entries(person.wars).forEach(([countryId, war]) => {
    if (!war) {
      return;
    }
    const rel = person.countryRelations[countryId];
    if (!rel) {
      return;
    }

    war.years += 1;
    war.casualties += Math.floor(500 + Math.random() * 3000);

    rel.relation = Math.max(0, (rel.relation || 50) - 3);
    rel.tension = Math.min(100, (rel.tension || 50) + 2);

    if (person.job) {
      person.job.approval = Math.max(0, (person.job.approval || 50) - 1);
    }

    if (war.years > 1 && Math.random() < 0.1) {
      const myStrength = getMilitaryStrength(person);
      const target = getCountryData(countryId);
      const targetPower = target?.power || 50;
      const autoProgress = (myStrength - targetPower) / 2 + (Math.random() - 0.5) * 20;
      if (autoProgress > 0) {
        war.territoryGained = Math.min(
          100,
          war.territoryGained + Math.floor(2 + Math.random() * 5)
        );
        if (war.territoryGained >= 80) {
          war.pendingEvent = {
            type: 'victory',
            text: `${war.targetName} is on the verge of collapse! You control ${war.territoryGained}% of their territory.`,
            choices: [
              { text: 'Accept Surrender — Demand Reparations ($500k)', effect: 'reparations' },
              { text: 'Accept Surrender — Annex Territory', effect: 'annex' },
              { text: 'Accept Surrender — Install Puppet Government', effect: 'puppet' },
              { text: 'Total Conquest — Crush Them Completely', effect: 'total' },
            ],
          };
        }
      } else {
        war.territoryGained = Math.max(0, war.territoryGained - Math.floor(2 + Math.random() * 5));
        if (war.territoryGained <= 0 && war.years > 3) {
          war.pendingEvent = {
            type: 'defeat',
            text: `Your military is crumbling. ${war.targetName} is winning.`,
            choices: [
              { text: 'Sue for Peace — Pay Reparations ($300k)', effect: 'surrender_reparations' },
              { text: 'Sue for Peace — Cede Territory', effect: 'cede' },
              { text: 'Fight On — Desperate Defense', effect: 'desperate' },
            ],
          };
        }
      }
    }
  });
}
