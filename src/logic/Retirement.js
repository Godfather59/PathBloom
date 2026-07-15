export const ACCOUNT_TYPES = {
  '401k': {
    name: '401(k)',
    maxAnnual: 23000,
    employerMatch: 0.5,
    taxDeferred: true,
    growthRate: 0.05,
  },
  ira: { name: 'IRA', maxAnnual: 7000, employerMatch: 0, taxDeferred: true, growthRate: 0.05 },
  pension: {
    name: 'Company Pension',
    maxAnnual: 0,
    employerMatch: 0,
    taxDeferred: true,
    growthRate: 0.03,
  },
  rothIRA: {
    name: 'Roth IRA',
    maxAnnual: 7000,
    employerMatch: 0,
    taxDeferred: false,
    growthRate: 0.05,
  },
};

export const RETIREMENT_HOMES = [
  { name: 'Sunset Villa', cost: 2000, happiness: 10, quality: 'basic' },
  { name: 'Golden Years Community', cost: 5000, happiness: 20, quality: 'standard' },
  { name: 'Hillside Manor', cost: 12000, happiness: 35, quality: 'luxury' },
  { name: 'The Royal Retreat', cost: 30000, happiness: 50, quality: 'premium' },
];

function addEmployerMatch(person, account, definition, contribution) {
  if (!definition.employerMatch || !person.job || person.job.isRetired) {
    return 0;
  }
  const annualMatchCap = Math.max(0, Math.floor((Number(person.job.salary) || 0) * 0.03));
  const remainingMatch = Math.max(
    0,
    annualMatchCap - (Number(account.employerMatchedThisYear) || 0)
  );
  const match = Math.min(Math.floor(contribution * definition.employerMatch), remainingMatch);
  account.balance += match;
  account.employerMatchedThisYear = (Number(account.employerMatchedThisYear) || 0) + match;
  return match;
}

export function processRetirement(person) {
  if (!person.retirementAccounts) {
    person.retirementAccounts = {};
  }

  Object.keys(person.retirementAccounts).forEach(key => {
    const acct = person.retirementAccounts[key];
    const def = ACCOUNT_TYPES[key];
    if (!def) {
      return;
    }

    acct.balance = Math.max(0, Number(acct.balance) || 0);
    if (acct.lastContributionAge !== person.age) {
      acct.lastContributionAge = person.age;
      acct.contributedThisYear = 0;
      acct.employerMatchedThisYear = 0;
    }

    if (!acct.suspended) {
      const growth = Math.floor(acct.balance * (def.growthRate + (Math.random() * 0.04 - 0.02)));
      acct.balance += growth;

      if (
        acct.autoContribute &&
        def.maxAnnual > 0 &&
        person.age >= 18 &&
        person.age < 65 &&
        person.job
      ) {
        const allowance = Math.max(0, def.maxAnnual - (Number(acct.contributedThisYear) || 0));
        const contrib = Math.min(Math.max(0, Number(acct.autoContribute) || 0), allowance);
        if (person.money >= contrib) {
          person.money -= contrib;
          acct.balance += contrib;
          acct.contributedThisYear += contrib;
          addEmployerMatch(person, acct, def, contrib);
        }
      }
    }
  });

  if (person.age >= 65 && !person.isRetired) {
    if (person.job && !person.job.isRetired) {
      person.logEvent('You have reached retirement age (65). Consider retiring!', 'neutral');
    }
  }

  if (person.age >= 70 && !person.isRetired && person.job) {
    if (Math.random() < 0.3) {
      person.logEvent('You were gently nudged into retirement by your employer.', 'neutral');
      person.isRetired = true;
      if (person.job) {
        person.job = {
          ...person.job,
          isRetired: true,
          title: `Retired ${person.job.title}`,
          salary: 0,
        };
      }
      if (!person.retirementAccounts.pension) {
        person.retirementAccounts.pension = { balance: 0, autoContribute: 0, suspended: false };
      }
      person.retirementAccounts.pension.balance += Math.floor(
        person.lifeStats?.totalMoneyEarned * 0.02 || 50000
      );
    }
  }

  if (person.isRetired) {
    let retirementWithdrawal = 0;
    Object.values(person.retirementAccounts).forEach(account => {
      const balance = Math.max(0, Number(account.balance) || 0);
      const withdrawal = Math.min(balance, Math.floor(balance * (person.age >= 75 ? 0.05 : 0.04)));
      account.balance = balance - withdrawal;
      retirementWithdrawal += withdrawal;
    });
    person.money += retirementWithdrawal;
    const socialSecurity = Math.floor(1200 + (person.lifeStats?.totalMoneyEarned * 0.005 || 500));
    person.money += socialSecurity;
    person.lifeStats.totalRetirementIncome =
      (Number(person.lifeStats.totalRetirementIncome) || 0) + retirementWithdrawal + socialSecurity;
    if (Math.random() < 0.05) {
      person.logEvent(
        `You received $${(retirementWithdrawal + socialSecurity).toLocaleString()} in retirement income.`,
        'good'
      );
    }
  }
}

export function contributeToRetirement(person, accountType, amount) {
  const def = ACCOUNT_TYPES[accountType];
  if (!def) {
    return false;
  }

  const requestedAmount = Math.floor(Number(amount));
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    person.logEvent('Choose a positive retirement contribution.', 'bad');
    return false;
  }
  if (def.maxAnnual === 0) {
    person.logEvent(
      `${def.name} is funded by your employer and does not accept contributions.`,
      'neutral'
    );
    return false;
  }

  if (!person.retirementAccounts) {
    person.retirementAccounts = {};
  }
  if (!person.retirementAccounts[accountType]) {
    person.retirementAccounts[accountType] = { balance: 0, autoContribute: 0, suspended: false };
  }

  const acct = person.retirementAccounts[accountType];
  if (acct.lastContributionAge !== person.age) {
    acct.lastContributionAge = person.age;
    acct.contributedThisYear = 0;
    acct.employerMatchedThisYear = 0;
  }
  const remainingAllowance = Math.max(0, def.maxAnnual - (acct.contributedThisYear || 0));
  const effectiveAmount = Math.min(requestedAmount, remainingAllowance);

  if (effectiveAmount <= 0) {
    person.logEvent(`You have reached this year's ${def.name} contribution limit.`, 'neutral');
    return false;
  }

  if (person.money < effectiveAmount) {
    person.logEvent(`You can't afford to contribute $${effectiveAmount.toLocaleString()}.`, 'bad');
    return false;
  }

  person.money -= effectiveAmount;
  acct.balance += effectiveAmount;
  acct.contributedThisYear = (acct.contributedThisYear || 0) + effectiveAmount;

  if (def.employerMatch > 0 && person.job) {
    const match = addEmployerMatch(person, acct, def, effectiveAmount);
    if (match > 0) {
      person.logEvent(`Your employer matched $${match.toLocaleString()}!`, 'good');
    }
  }

  person.logEvent(
    `You contributed $${effectiveAmount.toLocaleString()} to your ${def.name}.`,
    'good'
  );
  return true;
}

export function withdrawFromRetirement(person, accountType, amount) {
  const def = ACCOUNT_TYPES[accountType];
  if (!def) {
    return false;
  }

  const requestedAmount = Math.floor(Number(amount));
  if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
    person.logEvent('Choose a positive withdrawal amount.', 'bad');
    return false;
  }

  const acct = person.retirementAccounts?.[accountType];
  if (!acct || acct.balance < requestedAmount) {
    person.logEvent('Insufficient funds in that account.', 'bad');
    return false;
  }

  const penalty = person.age < 59.5 ? 0.1 : 0;
  const tax = def.taxDeferred ? 0.22 : 0;
  const totalFee = penalty + tax;
  const received = Math.floor(requestedAmount * (1 - totalFee));

  acct.balance -= requestedAmount;
  person.money += received;

  person.logEvent(
    `You withdrew $${received.toLocaleString()} from your ${def.name} (fees: ${Math.floor(totalFee * 100)}%).`,
    'neutral'
  );
  return true;
}

export function retire(person) {
  if (person.age < 55) {
    person.logEvent('You are too young to retire!', 'bad');
    return false;
  }

  person.isRetired = true;
  if (person.job) {
    const jobTitle = person.job.title;
    person.job = { ...person.job, isRetired: true, title: `Retired ${jobTitle}`, salary: 0 };
  }

  const totalRetirement = Object.values(person.retirementAccounts || {}).reduce(
    (s, a) => s + a.balance,
    0
  );
  person.logEvent(
    `You retired with $${totalRetirement.toLocaleString()} in retirement savings.`,
    totalRetirement > 500000 ? 'good' : 'neutral'
  );

  if (totalRetirement < 100000) {
    person.logEvent('You might struggle financially in retirement...', 'bad');
  }

  return true;
}
