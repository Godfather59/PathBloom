const TRACKED_STATS = [
  'happiness',
  'health',
  'smarts',
  'looks',
  'stress',
  'karma',
  'energy',
  'fame',
  'notoriety',
];

const number = value => (Number.isFinite(Number(value)) ? Number(value) : 0);

function mortgageDebt(person) {
  return (person.assets || []).reduce(
    (total, asset) =>
      total + (asset?.isMortgaged ? Math.max(0, number(asset.mortgage?.balance)) : 0),
    0
  );
}

export function calculateTotalDebt(person) {
  return Math.round(
    Math.max(0, number(person.personalDebt)) +
      Math.max(0, number(person.loans)) +
      mortgageDebt(person)
  );
}

export function calculateNetWorth(person) {
  const assets = (person.assets || []).reduce(
    (total, asset) => total + Math.max(0, number(asset?.value ?? asset?.price)),
    0
  );
  const portfolio = (person.portfolio || []).reduce(
    (total, position) => total + Math.max(0, number(position?.currentValue)),
    0
  );
  const retirement = Object.values(person.retirementAccounts || {}).reduce(
    (total, account) => total + Math.max(0, number(account?.balance)),
    0
  );
  const companies = (person.companies || []).reduce(
    (total, company) =>
      total +
      Math.max(0, number(company?.valuation)) *
        Math.max(0, Math.min(1, number(company?.ownerEquity ?? 1))),
    0
  );

  return Math.round(
    number(person.money) + assets + portfolio + retirement + companies - calculateTotalDebt(person)
  );
}

function schoolSignature(person) {
  if (!person.currentSchool) {
    return 'none';
  }
  return person.currentSchool.type || person.currentSchool.name || 'school';
}

function relationshipSnapshot(person) {
  return (person.relationships || []).map(relationship => ({
    id: relationship.id,
    name: relationship.name,
    type: relationship.type,
    status: relationship.status || 'Alive',
    stat: Math.round(number(relationship.stat)),
  }));
}

export function captureYearStart(person) {
  const lifeStats = person.lifeStats || {};
  return {
    age: number(person.age),
    money: number(person.money),
    netWorth: calculateNetWorth(person),
    debt: calculateTotalDebt(person),
    stats: Object.fromEntries(TRACKED_STATS.map(key => [key, number(person[key])])),
    historyLength: (person.history || []).length,
    jobTitle: person.job?.title || null,
    school: schoolSignature(person),
    degreeCount: (person.degrees || []).length,
    relationships: relationshipSnapshot(person),
    inPrison: Boolean(person.isInPrison),
    alive: person.isAlive !== false,
    ambitionStage: number(person.lifeAmbition?.currentStageIndex),
    totals: {
      income: number(lifeStats.totalMoneyEarned) + number(lifeStats.totalRetirementIncome),
      living: number(lifeStats.totalLivingExpenses),
      discretionary: number(lifeStats.totalDiscretionarySpending),
      taxes: number(lifeStats.totalTaxes),
      debtPayments: number(lifeStats.totalDebtPayments),
    },
  };
}

function findRelationshipChanges(before, after) {
  const changes = [];
  const beforeById = new Map(before.map(relationship => [relationship.id, relationship]));
  const afterById = new Map(after.map(relationship => [relationship.id, relationship]));

  after.forEach(relationship => {
    const previous = beforeById.get(relationship.id);
    if (!previous) {
      changes.push({
        key: 'recap.change.relationshipNew',
        params: { name: relationship.name, type: relationship.type },
        fallback: `${relationship.name} became part of your life.`,
      });
    } else if (previous.status !== relationship.status) {
      changes.push({
        key: 'recap.change.relationshipStatus',
        params: { name: relationship.name, status: relationship.status },
        fallback: `${relationship.name}'s relationship status changed to ${relationship.status}.`,
      });
    } else if (previous.stat >= 45 && relationship.stat < 45) {
      changes.push({
        key: 'recap.change.relationshipStrained',
        params: { name: relationship.name },
        fallback: `Your relationship with ${relationship.name} became strained.`,
      });
    }
  });

  before.forEach(relationship => {
    if (!afterById.has(relationship.id)) {
      changes.push({
        key: 'recap.change.relationshipEnded',
        params: { name: relationship.name },
        fallback: `${relationship.name} left your life.`,
      });
    }
  });

  return changes;
}

function determineStopReason(person, start, recap) {
  if (!person.isAlive) {
    return { key: 'recap.stop.death', fallback: 'Life ended' };
  }
  if (person.pendingEvent) {
    return { key: 'recap.stop.decision', fallback: 'A decision needs your attention' };
  }
  if (start.inPrison !== Boolean(person.isInPrison)) {
    return { key: 'recap.stop.legal', fallback: 'Your legal status changed' };
  }
  if (start.jobTitle !== (person.job?.title || null)) {
    return { key: 'recap.stop.career', fallback: 'Your career changed' };
  }
  if (
    start.school !== schoolSignature(person) ||
    start.degreeCount !== (person.degrees || []).length
  ) {
    return { key: 'recap.stop.education', fallback: 'An education milestone occurred' };
  }
  if ([6, 13, 18, 21, 65].includes(person.age)) {
    return { key: 'recap.stop.milestone', fallback: 'You reached a life milestone' };
  }
  if (start.stats.health >= 50 && number(person.health) < 50) {
    return { key: 'recap.stop.health', fallback: 'Your health needs attention' };
  }
  if (start.ambitionStage !== number(person.lifeAmbition?.currentStageIndex)) {
    return { key: 'recap.stop.ambition', fallback: 'Your ambition advanced' };
  }
  if (recap.relationshipChanges.length > 0) {
    return { key: 'recap.stop.relationship', fallback: 'A relationship changed' };
  }
  return null;
}

export function finalizeAnnualRecap(person, start) {
  const lifeStats = person.lifeStats || {};
  const currentTotals = {
    income: number(lifeStats.totalMoneyEarned) + number(lifeStats.totalRetirementIncome),
    living: number(lifeStats.totalLivingExpenses),
    discretionary: number(lifeStats.totalDiscretionarySpending),
    taxes: number(lifeStats.totalTaxes),
    debtPayments: number(lifeStats.totalDebtPayments),
  };
  const relationshipChanges = findRelationshipChanges(
    start.relationships,
    relationshipSnapshot(person)
  );
  const historyAdded = Math.max(0, (person.history || []).length - start.historyLength);
  const events = (person.history || [])
    .slice(0, historyAdded)
    .reverse()
    .slice(-6)
    .map(event => ({ ...event }));
  const statChanges = Object.fromEntries(
    TRACKED_STATS.map(key => [key, Math.round(number(person[key]) - start.stats[key])])
  );
  const changes = [...relationshipChanges];

  if (start.jobTitle !== (person.job?.title || null)) {
    changes.unshift({
      key: person.job ? 'recap.change.newJob' : 'recap.change.leftJob',
      params: { job: person.job?.title || start.jobTitle || '' },
      fallback: person.job
        ? `Career changed to ${person.job.title}.`
        : `You left ${start.jobTitle || 'your job'}.`,
    });
  }
  if (start.degreeCount < (person.degrees || []).length) {
    const degree = person.degrees[person.degrees.length - 1];
    changes.push({
      key: 'recap.change.degree',
      params: { degree: degree?.name || degree?.type || '' },
      fallback: `You earned ${degree?.name || degree?.type || 'a degree'}.`,
    });
  }

  const recap = {
    id: `${person.age}:${(person.annualRecaps || []).length}:${(person.history || []).length}`,
    age: person.age,
    yearsAdvanced: Math.max(1, person.age - start.age),
    finance: {
      income: Math.round(currentTotals.income - start.totals.income),
      livingExpenses: Math.round(currentTotals.living - start.totals.living),
      discretionary: Math.round(currentTotals.discretionary - start.totals.discretionary),
      taxes: Math.round(currentTotals.taxes - start.totals.taxes),
      debtPayments: Math.round(currentTotals.debtPayments - start.totals.debtPayments),
      cashChange: Math.round(number(person.money) - start.money),
      netWorth: calculateNetWorth(person),
      netWorthChange: calculateNetWorth(person) - start.netWorth,
      debt: calculateTotalDebt(person),
      debtChange: calculateTotalDebt(person) - start.debt,
    },
    statChanges,
    relationshipChanges,
    changes,
    events,
    stopReason: null,
    worldNews: (person.worldNews || []).slice(-5).map(n => ({ text: n.text, type: n.type })),
    countryAtWar: false,
  };

  const geoState = person.geopoliticalState;
  if (geoState && geoState.countries) {
    const myCountry = Object.values(geoState.countries).find(c => c.name === person.country);
    if (myCountry) {
      recap.countryStats = {
        stability: Math.round(myCountry.stability),
        happiness: Math.round(myCountry.happiness),
        unemployment: Math.round(myCountry.unemployment),
        gdpGrowth: Math.round(myCountry.gdpGrowth * 10) / 10,
        warExhaustion: Math.round(myCountry.warExhaustion || 0),
      };
      // Check if any active wars involve player's country
      if (person.countryRelations) {
        recap.countryAtWar = Object.values(person.countryRelations).some(rel => rel && rel.atWar);
      }
    }
  }

  recap.stopReason = determineStopReason(person, start, recap);
  person.annualRecaps = [
    ...(Array.isArray(person.annualRecaps) ? person.annualRecaps : []),
    recap,
  ].slice(-20);
  person.latestAgeUpRecaps = [
    ...(Array.isArray(person.latestAgeUpRecaps) ? person.latestAgeUpRecaps : []),
    recap,
  ].slice(-10);
  return recap;
}
