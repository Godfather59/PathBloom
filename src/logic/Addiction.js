export const SUBSTANCES = {
  alcohol: {
    name: 'Alcohol',
    cost: 20,
    addictionRate: 0.08,
    withdrawalSeverity: 20,
    effect: { happiness: 10, health: -2, stress: -10, looks: -1 },
    overdoseChance: 0.005,
    overdoseDamage: 60,
    treatment: { name: 'Rehab (Alcohol)', cost: 5000, successRate: 0.6 },
  },
  tobacco: {
    name: 'Cigarettes',
    cost: 15,
    addictionRate: 0.15,
    withdrawalSeverity: 15,
    effect: { stress: -5, health: -3, looks: -2 },
    overdoseChance: 0.001,
    overdoseDamage: 20,
    treatment: { name: 'Nicotine Patch Program', cost: 2000, successRate: 0.7 },
  },
  marijuana: {
    name: 'Marijuana',
    cost: 30,
    addictionRate: 0.05,
    withdrawalSeverity: 10,
    effect: { happiness: 15, stress: -15, smarts: -2, health: -1 },
    overdoseChance: 0.001,
    overdoseDamage: 5,
    treatment: { name: 'Drug Counseling', cost: 3000, successRate: 0.65 },
  },
  cocaine: {
    name: 'Cocaine',
    cost: 150,
    addictionRate: 0.25,
    withdrawalSeverity: 35,
    effect: { happiness: 25, stress: -20, health: -8, looks: -3 },
    overdoseChance: 0.03,
    overdoseDamage: 80,
    treatment: { name: 'Intensive Rehab', cost: 15000, successRate: 0.4 },
  },
  opioids: {
    name: 'Opioids',
    cost: 80,
    addictionRate: 0.35,
    withdrawalSeverity: 40,
    effect: { happiness: 30, stress: -25, health: -10, smarts: -5 },
    overdoseChance: 0.05,
    overdoseDamage: 90,
    treatment: { name: 'Medical Detox', cost: 20000, successRate: 0.35 },
  },
};

export function processAddictions(person) {
  if (!person.addictions) {
    person.addictions = {};
  }
  if (!person.addictionLevels) {
    person.addictionLevels = {};
  }

  Object.keys(person.addictions).forEach(type => {
    const sub = SUBSTANCES[type];
    if (!sub) {
      return;
    }

    const level = person.addictionLevels[type] || 0;

    const activeTreatments = Array.isArray(person.treatmentTypes) ? person.treatmentTypes : null;
    const treatingThisSubstance =
      person.inTreatment === true && (activeTreatments === null || activeTreatments.includes(type));
    if (level > 0 && treatingThisSubstance) {
      person.addictionLevels[type] = Math.max(0, level - 15);
      if (person.addictionLevels[type] <= 0) {
        delete person.addictions[type];
        delete person.addictions[`${type}_warning`];
        delete person.addictionLevels[type];
        if (activeTreatments) {
          person.treatmentTypes = activeTreatments.filter(treatmentType => treatmentType !== type);
        }
        person.logEvent(`You beat your ${sub.name} addiction!`, 'good');
      }
      return;
    }

    if (level > 50) {
      person.logEvent(`Your ${sub.name} addiction is causing withdrawal symptoms.`, 'bad');
      person.updateStats({ health: -5, happiness: -10, stress: 10 });
      if (Math.random() < 0.1) {
        person.logEvent(`You relapsed and used ${sub.name}.`, 'bad');
        person.updateStats(sub.effect);
      }
    }
    if (level > 70 && Math.random() < sub.overdoseChance) {
      person.health = Math.max(0, person.health - sub.overdoseDamage);
      person.logEvent(`You OVERDOSED on ${sub.name}!`, 'bad');
      if (person.health <= 0) {
        person.isAlive = false;
        person.logEvent(`You died from a ${sub.name} overdose.`, 'bad');
      }
    }
    if (level > 30 && Math.random() < 0.15) {
      person.money -= sub.cost * 2;
    }
  });

  const hasActiveAddiction = Object.values(person.addictionLevels).some(level => level > 0);
  if (
    !hasActiveAddiction ||
    (Array.isArray(person.treatmentTypes) && person.treatmentTypes.length === 0)
  ) {
    person.inTreatment = false;
  }
}

export function useSubstance(person, type) {
  const sub = SUBSTANCES[type];
  if (!sub) {
    return false;
  }

  if (person.age < 18) {
    person.logEvent('You must be 18 or older to use substances.', 'bad');
    return false;
  }

  if (person.money < sub.cost) {
    person.logEvent(`You can't afford ${sub.name}.`, 'bad');
    return false;
  }

  if (!person.addictions) {
    person.addictions = {};
  }
  if (!person.addictionLevels) {
    person.addictionLevels = {};
  }

  person.money -= sub.cost;
  person.updateStats(sub.effect);

  const level = person.addictionLevels[type] || 0;
  const increase = Math.floor(sub.addictionRate * 100) + (level > 0 ? 5 : 0);
  person.addictionLevels[type] = Math.min(100, level + increase);

  if (person.addictionLevels[type] > 0) {
    person.addictions[type] = true;
  }

  if (person.addictionLevels[type] >= 50 && !person.addictions[`${type}_warning`]) {
    person.addictions[`${type}_warning`] = true;
    person.logEvent(`You might be developing a dependency on ${sub.name}.`, 'bad');
  }

  if (person.addictionLevels[type] >= 80) {
    person.logEvent(`You are severely addicted to ${sub.name}.`, 'bad');
  }

  if (Math.random() < sub.overdoseChance * 2) {
    person.health = Math.max(0, person.health - Math.floor(sub.overdoseDamage / 2));
    person.logEvent(`You had a bad reaction to ${sub.name} and needed medical attention.`, 'bad');
    if (person.health <= 0) {
      person.isAlive = false;
      person.logEvent(`You died after a severe reaction to ${sub.name}.`, 'bad');
    }
  }

  person.logEvent(`You used ${sub.name}.`, level > 50 ? 'bad' : 'neutral');
  return true;
}

export function enterRehab(person, type) {
  if (!type) {
    const activeTypes = Object.keys(SUBSTANCES).filter(
      substanceType => (person.addictionLevels?.[substanceType] || 0) > 0
    );
    if (activeTypes.length === 0) {
      person.logEvent("You don't have any addictions to treat.", 'neutral');
      return false;
    }
    const totalCost = activeTypes.reduce(
      (sum, substanceType) => sum + SUBSTANCES[substanceType].treatment.cost,
      0
    );
    if (person.money < totalCost) {
      person.logEvent(`Rehab costs $${totalCost.toLocaleString()}. You can't afford it.`, 'bad');
      return false;
    }
    person.money -= totalCost;
    person.inTreatment = true;
    person.treatmentTypes = activeTypes;
    person.logEvent(
      `You checked into a comprehensive rehab program for $${totalCost.toLocaleString()}.`,
      'good'
    );
    return true;
  }

  const sub = SUBSTANCES[type];
  if (!sub || !sub.treatment) {
    return false;
  }

  if (person.money < sub.treatment.cost) {
    person.logEvent(
      `${sub.treatment.name} costs $${sub.treatment.cost.toLocaleString()}. You can't afford it.`,
      'bad'
    );
    return false;
  }

  person.money -= sub.treatment.cost;
  person.inTreatment = true;
  person.treatmentTypes = [type];
  person.logEvent(
    `You started ${sub.treatment.name} for $${sub.treatment.cost.toLocaleString()}.`,
    'good'
  );
  return true;
}
