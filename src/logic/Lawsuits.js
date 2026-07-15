export const LAWSUIT_GROUNDS = [
  {
    id: 'defamation',
    name: 'Defamation',
    filingFee: 5000,
    baseAward: 50000,
    difficulty: 0.4,
    fameMultiplier: true,
  },
  {
    id: 'breach_of_contract',
    name: 'Breach of Contract',
    filingFee: 3000,
    baseAward: 100000,
    difficulty: 0.5,
    fameMultiplier: false,
  },
  {
    id: 'personal_injury',
    name: 'Personal Injury',
    filingFee: 4000,
    baseAward: 150000,
    difficulty: 0.3,
    fameMultiplier: false,
  },
  {
    id: 'fraud',
    name: 'Fraud',
    filingFee: 8000,
    baseAward: 200000,
    difficulty: 0.45,
    fameMultiplier: false,
  },
  {
    id: 'wrongful_termination',
    name: 'Wrongful Termination',
    filingFee: 3000,
    baseAward: 75000,
    difficulty: 0.5,
    fameMultiplier: false,
  },
  {
    id: 'harassment',
    name: 'Harassment',
    filingFee: 2000,
    baseAward: 100000,
    difficulty: 0.35,
    fameMultiplier: true,
  },
];

export function getLawsuitSuccessChance(person, groundsId, target = null) {
  const grounds =
    typeof groundsId === 'string'
      ? LAWSUIT_GROUNDS.find(entry => entry.id === groundsId)
      : groundsId;
  if (!grounds) {
    return 0;
  }

  const lawyerBonus = person.money > 100000 ? 0.06 : person.money > 50000 ? 0.04 : 0.02;
  const fameBonus = grounds.fameMultiplier ? Math.min(0.03, (person.fame || 0) / 3000) : 0;
  const evidence = (person.legalClaims || []).find(
    claim =>
      !claim.used &&
      claim.grounds === grounds.id &&
      (!claim.target || !target || claim.target === target) &&
      (!claim.expiresAtAge || claim.expiresAtAge >= person.age)
  );
  const evidenceBonus = evidence
    ? Math.min(0.3, Math.max(0, Number(evidence.strength) || 0) * 0.3)
    : 0;
  return Math.max(
    0.05,
    Math.min(0.45, 0.04 + grounds.difficulty * 0.15 + lawyerBonus + fameBonus + evidenceBonus)
  );
}

export function processLawsuits(person) {
  if (!person.activeLawsuits) {
    person.activeLawsuits = [];
  }

  person.activeLawsuits = person.activeLawsuits.filter(lawsuit => {
    lawsuit.yearsActive = (lawsuit.yearsActive || 0) + 1;

    if (lawsuit.yearsActive > 3) {
      const dismissed = Math.random() < 0.3;
      if (dismissed) {
        person.logEvent(
          `The ${lawsuit.grounds} lawsuit against you was dismissed due to lack of progress.`,
          'good'
        );
        return false;
      }
    }

    if (lawsuit.yearsActive > 1 && Math.random() < 0.15) {
      const judgment = Math.random() < 0.5 ? 'plaintiff' : 'defendant';
      if (judgment === 'plaintiff') {
        const award = Math.floor(lawsuit.amount * (0.3 + Math.random() * 0.4));
        person.money -= award;
        person.logEvent(
          `Lawsuit verdict: You must pay $${award.toLocaleString()} in ${lawsuit.grounds} case.`,
          'bad'
        );
      } else {
        person.logEvent(`Lawsuit verdict: You won the ${lawsuit.grounds} case!`, 'good');
      }
      return false;
    }

    person.updateStats({ stress: 5 });
    return true;
  });
}

export function fileLawsuit(person, groundsId, target) {
  if (person.age < 18) {
    person.logEvent('You must be 18 to file a lawsuit yourself.', 'bad');
    return false;
  }
  const grounds = LAWSUIT_GROUNDS.find(g => g.id === groundsId);
  if (!grounds) {
    return false;
  }

  if (person.money < grounds.filingFee) {
    person.logEvent(
      `Filing fees are $${grounds.filingFee.toLocaleString()}. You can't afford it.`,
      'bad'
    );
    return false;
  }

  if (!person.activeLawsuits) {
    person.activeLawsuits = [];
  }

  if (person.lastLawsuitAge === person.age) {
    person.logEvent('You can only file one lawsuit per year.', 'neutral');
    return false;
  }

  if (!person.lawsuitHistory) {
    person.lawsuitHistory = [];
  }
  const targetName = target || 'a third party';
  const duplicateClaim = person.lawsuitHistory.some(
    entry =>
      entry.grounds === grounds.name && entry.target === targetName && person.age - entry.year < 3
  );
  if (duplicateClaim) {
    person.logEvent(
      `You recently brought the same ${grounds.name} claim against ${targetName}.`,
      'neutral'
    );
    return false;
  }

  const successChance = getLawsuitSuccessChance(person, grounds, targetName);
  const success = Math.random() < successChance;
  let award = 0;

  person.money -= grounds.filingFee;
  person.lastLawsuitAge = person.age;

  if (success) {
    award = Math.floor(grounds.baseAward * (0.5 + Math.random()));
    const legalFee = Math.floor(award * 0.3);
    award -= legalFee;
    person.money += award;
    person.fame = Math.min(100, (person.fame || 0) + 2);
    person.logEvent(
      `You won the ${grounds.name} case against ${targetName}! You received $${award.toLocaleString()} after legal fees.`,
      'good'
    );
  } else {
    const adverseCosts = Math.floor(grounds.baseAward * 0.12);
    person.money -= adverseCosts;
    award = -(grounds.filingFee + adverseCosts);
    person.logEvent(
      `You lost the ${grounds.name} case against ${targetName}. Filing and opposing legal costs totaled $${Math.abs(award).toLocaleString()}.`,
      'bad'
    );
  }

  person.lawsuitHistory.push({
    grounds: grounds.name,
    target: targetName,
    year: person.age,
    success,
    amount: award,
  });
  const supportingClaim = (person.legalClaims || []).find(
    claim =>
      !claim.used && claim.grounds === grounds.id && (!claim.target || claim.target === targetName)
  );
  if (supportingClaim) {
    supportingClaim.used = true;
  }
  return award;
}

export function sueRandomPerson(person) {
  if (person.relationships.length < 2) {
    person.logEvent("You don't have enough people in your life to sue.", 'bad');
    return false;
  }

  const target = person.relationships[Math.floor(Math.random() * person.relationships.length)];
  const ground = LAWSUIT_GROUNDS[Math.floor(Math.random() * LAWSUIT_GROUNDS.length)];

  person.logEvent(`You filed a ${ground.name} lawsuit against ${target.name}!`, 'neutral');
  const result = fileLawsuit(person, ground.id, target.name);

  if (result > 0) {
    person.relationships = person.relationships.filter(r => r.id !== target.id);
    person.logEvent(`${target.name} is no longer speaking to you.`, 'bad');
  }

  return result;
}
