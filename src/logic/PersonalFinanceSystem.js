import { getCountryRules } from './CountryLifeSystem';

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

export function ensurePersonalFinance(person) {
  if (!person || typeof person !== 'object') return null;
  const current = person.finance && typeof person.finance === 'object' ? person.finance : {};
  person.finance = {
    creditScore: Math.round(clamp(current.creditScore ?? 650, 300, 850)),
    savingsAccount: Math.max(0, Number(current.savingsAccount) || 0),
    missedPayments: Math.max(0, Math.floor(Number(current.missedPayments) || 0)),
    onTimePayments: Math.max(0, Math.floor(Number(current.onTimePayments) || 0)),
    bankruptcies: Math.max(0, Math.floor(Number(current.bankruptcies ?? person.bankruptcies) || 0)),
    budgetDiscipline: Math.round(clamp(current.budgetDiscipline ?? 45, 0, 100)),
    annualLedger: Array.isArray(current.annualLedger) ? current.annualLedger.slice(-15) : [],
    lastBudget: current.lastBudget && typeof current.lastBudget === 'object' ? current.lastBudget : null,
    collectionsBalance: Math.max(0, Number(current.collectionsBalance) || 0),
    childSupportPaid: Math.max(0, Number(current.childSupportPaid) || 0),
    benefitsReceived: Math.max(0, Number(current.benefitsReceived) || 0),
  };
  return person.finance;
}

function splitLivingCost(total, ownsHome) {
  const value = Math.max(0, Math.floor(Number(total) || 0));
  const shares = ownsHome
    ? { housing: 0.25, food: 0.28, transport: 0.18, utilities: 0.14, healthcare: 0.1, other: 0.05 }
    : { housing: 0.4, food: 0.24, transport: 0.15, utilities: 0.1, healthcare: 0.07, other: 0.04 };
  const result = {};
  let assigned = 0;
  Object.entries(shares).forEach(([key, share], index, entries) => {
    const amount = index === entries.length - 1 ? value - assigned : Math.floor(value * share);
    result[key] = Math.max(0, amount);
    assigned += amount;
  });
  return result;
}

function calculateChildSupport(person, rules) {
  const hasPartner = (person.relationships || []).some(
    rel => ['Spouse', 'Partner', 'Fiance'].includes(rel.type) && rel.status !== 'Deceased'
  );
  if (hasPartner) return 0;
  const dependentChildren = (person.relationships || []).filter(
    rel => rel.type === 'Child' && rel.status !== 'Deceased' && Number(rel.age) < 18
  ).length;
  if (!dependentChildren || !person.job) return 0;
  const income = Math.max(0, Number(person.job.salary) || 0);
  return Math.floor(income * rules.childSupportRate * Math.min(2, dependentChildren));
}

function chargeObligation(person, amount) {
  const due = Math.max(0, Math.floor(Number(amount) || 0));
  if (due <= 0) return { paid: 0, shortfall: 0 };
  const cash = Math.max(0, Number(person.money) || 0);
  const paid = Math.min(cash, due);
  const shortfall = due - paid;
  person.money = cash - paid;
  if (shortfall > 0) {
    person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + shortfall;
  }
  return { paid, shortfall };
}

function updateCreditScore(person, finance, yearData) {
  const debt = Math.max(0, Number(person.personalDebt) || 0) + Math.max(0, Number(person.loans) || 0);
  const income = Math.max(1, Number(person.job?.salary) || 1);
  const debtRatio = debt / income;
  let change = 0;

  if (yearData.shortfall > 0) {
    finance.missedPayments += 1;
    finance.collectionsBalance += yearData.shortfall;
    change -= Math.min(55, 15 + yearData.shortfall / 1500);
  } else if (debt > 0) {
    finance.onTimePayments += 1;
    change += 8;
  } else {
    finance.onTimePayments += 1;
    change += 5;
  }

  if (debtRatio > 1.5) change -= 18;
  else if (debtRatio > 0.75) change -= 8;
  else if (debtRatio < 0.2) change += 5;

  if (person.bankruptcies > finance.bankruptcies) {
    finance.bankruptcies = person.bankruptcies;
    change -= 120;
  }

  finance.creditScore = Math.round(clamp(finance.creditScore + change, 300, 850));
}

export function processPersonalFinanceYear(person) {
  const finance = ensurePersonalFinance(person);
  if (!finance || person.age < 18) return finance;

  const rules = getCountryRules(person);
  const livingCost = Math.max(0, Number(person.lastLivingCost) || 0);
  const ownsHome = (person.assets || []).some(asset => asset.type === 'Real Estate' && !asset.isRented);
  const categories = splitLivingCost(livingCost, ownsHome);
  const childSupport = calculateChildSupport(person, rules);
  const childSupportResult = chargeObligation(person, childSupport);
  finance.childSupportPaid += childSupportResult.paid;

  const savingsRate = rules.creditAccess >= 70 ? 0.025 : 0.012;
  const savingsInterest = Math.floor(finance.savingsAccount * savingsRate);
  finance.savingsAccount += savingsInterest;

  const debt = Math.max(0, Number(person.personalDebt) || 0);
  const collectionInterest = debt > 0 ? Math.floor(debt * (rules.creditAccess >= 70 ? 0.035 : 0.07)) : 0;
  if (collectionInterest > 0) {
    person.personalDebt += collectionInterest;
  }

  const totalShortfall = childSupportResult.shortfall + Math.max(0, collectionInterest);
  updateCreditScore(person, finance, { shortfall: totalShortfall });

  const annualIncome = Math.max(0, Number(person.job?.salary) || 0);
  const discretionary = Math.max(0, annualIncome - livingCost - childSupport - collectionInterest);
  finance.lastBudget = {
    income: annualIncome,
    ...categories,
    childSupport,
    debtInterest: collectionInterest,
    discretionary,
    country: person.country,
    age: person.age,
  };
  finance.annualLedger.push({ ...finance.lastBudget, creditScore: finance.creditScore });
  finance.annualLedger = finance.annualLedger.slice(-15);

  if (childSupportResult.shortfall > 0) {
    person.logEvent?.(
      `You missed $${childSupportResult.shortfall.toLocaleString()} in child-support payments.`,
      'bad'
    );
    person.updateStats?.({ stress: 6, happiness: -3 });
  }

  if (finance.creditScore < 450 && Math.random() < 0.35) {
    person.logEvent?.('Your poor credit score is blocking loans and rental applications.', 'bad');
  } else if (finance.creditScore >= 760 && person.age % 5 === 0) {
    person.logEvent?.('Your excellent credit gives you access to the best borrowing rates.', 'good');
  }

  return finance;
}

export function processPersonalFinanceMonth(person) {
  const finance = ensurePersonalFinance(person);
  if (!finance || person.age < 18) return finance;
  const monthlyIncome = Math.max(0, Number(person.job?.salary) || 0) / 12;
  const monthlyLiving = Math.max(0, Number(person.lastLivingCost) || 0) / 12;
  const surplus = monthlyIncome - monthlyLiving;
  if (surplus > 0 && finance.budgetDiscipline >= 70) {
    const automaticSaving = Math.floor(surplus * 0.08);
    const available = Math.max(0, Number(person.money) || 0);
    const moved = Math.min(available, automaticSaving);
    person.money = available - moved;
    finance.savingsAccount += moved;
  }
  return finance;
}

export function canAccessCredit(person, minimumScore = 620) {
  const finance = ensurePersonalFinance(person);
  return finance.creditScore >= minimumScore;
}

export function getFinanceSummary(person) {
  const finance = ensurePersonalFinance(person);
  return {
    cash: Math.max(0, Number(person.money) || 0),
    savings: finance.savingsAccount,
    debt: Math.max(0, Number(person.personalDebt) || 0) + Math.max(0, Number(person.loans) || 0),
    creditScore: finance.creditScore,
    missedPayments: finance.missedPayments,
    lastBudget: finance.lastBudget,
  };
}
