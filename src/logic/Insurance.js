export const INSURANCE_TYPES = {
  health: {
    name: 'Health Insurance',
    basePremium: 300,
    deductible: 5000,
    coverage: 0.8,
    providers: ['BlueCross', 'Aetna', 'Cigna', 'UnitedHealth'],
  },
  auto: {
    name: 'Auto Insurance',
    basePremium: 150,
    deductible: 1000,
    coverage: 0.9,
    providers: ['Geico', 'State Farm', 'Progressive', 'Allstate'],
  },
  home: {
    name: 'Home Insurance',
    basePremium: 200,
    deductible: 2000,
    coverage: 0.85,
    providers: ['Lemonade', 'Nationwide', 'Liberty Mutual', 'Travelers'],
  },
  life: {
    name: 'Life Insurance',
    basePremium: 100,
    deductible: 0,
    coverage: 0,
    payout: 500000,
    providers: ['Prudential', 'MetLife', 'New York Life', 'Northwestern'],
  },
};

export function processInsurance(person) {
  if (!person.insurance) {
    person.insurance = {};
  }

  Object.keys(person.insurance).forEach(type => {
    const policy = person.insurance[type];
    if (!policy || policy.cancelled) {
      return;
    }

    const def = INSURANCE_TYPES[type];
    if (!def) {
      return;
    }
    if (policy.lastChargedAge === person.age) {
      return;
    }

    const monthlyPremium = Math.max(0, Number(policy.premium) || def.basePremium);
    const annualPremium = Math.floor(monthlyPremium * 12 * (1 + (policy.claims || 0) * 0.15));
    if (person.money >= annualPremium) {
      person.money -= annualPremium;
      policy.lastChargedAge = person.age;
      policy.yearsActive = (policy.yearsActive || 0) + 1;
    } else {
      policy.cancelled = true;
      person.logEvent(`Your ${def.name} was cancelled due to non-payment.`, 'bad');
    }
  });
}

export function buyInsurance(person, type, provider) {
  const def = INSURANCE_TYPES[type];
  if (!def) {
    return false;
  }

  if (!def.providers.includes(provider)) {
    person.logEvent('Invalid insurance provider.', 'bad');
    return false;
  }

  if (person.age < 18) {
    person.logEvent('You must be 18 or older to buy insurance.', 'bad');
    return false;
  }

  if (!person.insurance) {
    person.insurance = {};
  }

  if (person.insurance[type] && !person.insurance[type].cancelled) {
    person.logEvent(`You already have ${def.name}.`, 'bad');
    return false;
  }

  const ageMultiplier = person.age > 60 ? 2.5 : person.age > 40 ? 1.5 : 1;
  const premium = Math.floor(def.basePremium * ageMultiplier);
  const firstAnnualPremium = premium * 12;
  if (person.money < firstAnnualPremium) {
    person.logEvent(
      `You need $${firstAnnualPremium.toLocaleString()} to pay the first year of ${def.name}.`,
      'bad'
    );
    return false;
  }

  person.money -= firstAnnualPremium;

  person.insurance[type] = {
    provider,
    premium,
    deductible: def.deductible,
    coverage: def.coverage,
    payout: def.payout || 0,
    claims: 0,
    yearsActive: 0,
    lastChargedAge: person.age,
    cancelled: false,
  };

  person.logEvent(
    `You bought ${def.name} from ${provider} for $${premium}/month and paid $${firstAnnualPremium.toLocaleString()} for the first year.`,
    'good'
  );
  return true;
}

export function fileInsuranceClaim(person, type, damageAmount) {
  const policy = person.insurance?.[type];
  if (!policy || policy.cancelled) {
    person.logEvent(
      `You don't have active ${INSURANCE_TYPES[type]?.name || type} insurance.`,
      'bad'
    );
    return 0;
  }

  const def = INSURANCE_TYPES[type];
  if (!def) {
    return 0;
  }

  const damage = Math.floor(Number(damageAmount));
  if (!Number.isFinite(damage) || damage <= 0) {
    person.logEvent('That insurance claim amount is invalid.', 'bad');
    return 0;
  }

  const covered = Math.floor(damage * policy.coverage);
  const payout = Math.max(0, covered - policy.deductible);
  const actualPayout = Math.min(payout, def.payout || Infinity);

  if (actualPayout > 0) {
    person.money += actualPayout;
    policy.claims = (policy.claims || 0) + 1;
    person.logEvent(
      `Your ${def.name} covered $${actualPayout.toLocaleString()} of the $${damage.toLocaleString()} damages.`,
      'good'
    );
    if (policy.deductible > 0) {
      person.logEvent(`You paid $${policy.deductible.toLocaleString()} deductible.`, 'neutral');
    }
  } else {
    person.logEvent(
      `The damages ($${damage.toLocaleString()}) were below your deductible.`,
      'neutral'
    );
  }

  return actualPayout;
}

export function cancelInsurance(person, type) {
  const policy = person.insurance?.[type];
  if (!policy) {
    person.logEvent("You don't have that insurance.", 'bad');
    return false;
  }

  policy.cancelled = true;
  person.logEvent(
    `You cancelled your ${INSURANCE_TYPES[type]?.name || type} insurance.`,
    'neutral'
  );
  return true;
}
