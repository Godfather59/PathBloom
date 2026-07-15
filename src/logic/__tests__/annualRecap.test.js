import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  calculateNetWorth,
  calculateTotalDebt,
  captureYearStart,
  finalizeAnnualRecap,
} from '../AnnualRecap';
import { GameEngine } from '../GameEngine';
import { Person } from '../Person';
import { selectAmbition } from '../LifeAmbitions';

afterEach(() => vi.restoreAllMocks());

function makePerson(overrides = {}) {
  return {
    age: 30,
    money: 10000,
    personalDebt: 2000,
    loans: 3000,
    assets: [{ value: 100000, isMortgaged: true, mortgage: { balance: 40000 } }],
    portfolio: [{ currentValue: 5000 }],
    retirementAccounts: { ira: { balance: 8000 } },
    companies: [],
    relationships: [],
    history: [],
    lifeStats: {
      totalMoneyEarned: 50000,
      totalRetirementIncome: 0,
      totalLivingExpenses: 20000,
      totalDiscretionarySpending: 1000,
      totalTaxes: 5000,
      totalDebtPayments: 500,
    },
    happiness: 50,
    health: 75,
    smarts: 60,
    looks: 55,
    stress: 20,
    karma: 50,
    energy: 100,
    fame: 0,
    notoriety: 0,
    isAlive: true,
    isInPrison: false,
    job: { title: 'Analyst' },
    currentSchool: null,
    degrees: [],
    ...overrides,
  };
}

describe('annual recap', () => {
  it('calculates signed net worth and total debt', () => {
    const person = makePerson();
    expect(calculateTotalDebt(person)).toBe(45000);
    expect(calculateNetWorth(person)).toBe(78000);
  });

  it('records financial and stat changes and stops on a career change', () => {
    const person = makePerson();
    const start = captureYearStart(person);
    person.age = 31;
    person.money = 24000;
    person.health = 70;
    person.job = { title: 'Senior Analyst' };
    person.lifeStats.totalMoneyEarned += 30000;
    person.lifeStats.totalTaxes += 6000;
    person.lifeStats.totalLivingExpenses += 10000;
    person.history.unshift({ age: 31, text: 'You were promoted.', type: 'good' });

    const recap = finalizeAnnualRecap(person, start);

    expect(recap.finance.income).toBe(30000);
    expect(recap.finance.taxes).toBe(6000);
    expect(recap.finance.livingExpenses).toBe(10000);
    expect(recap.statChanges.health).toBe(-5);
    expect(recap.stopReason.key).toBe('recap.stop.career');
    expect(person.latestAgeUpRecaps).toHaveLength(1);
  });

  it('pauses smart fast-forward at a life milestone', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const person = new Person('Smart', 'Skip', 'Female', 'United States');

    GameEngine.ageUp(person, 10);

    expect(person.age).toBe(6);
    expect(person.fastForwardResult.completedYears).toBe(6);
    expect(person.fastForwardResult.reason.key).toBe('recap.stop.education');
    expect(person.latestAgeUpRecaps).toHaveLength(6);
  });

  it('pauses on the exact year an ambition milestone is completed', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const person = new Person('Focused', 'Player', 'Female', 'United States');
    person.age = 11;
    person.currentSchool = {
      name: 'Elementary School',
      type: 'elementary',
      year: 1,
      years: 8,
      performance: 50,
      cost: 0,
      tuitionPaid: 0,
    };
    person.relationships = [
      { id: 'parent-1', name: 'Ari', type: 'Parent', status: 'Alive', stat: 85, age: 40 },
      { id: 'sibling-1', name: 'Sam', type: 'Sibling', status: 'Alive', stat: 80, age: 13 },
    ];
    selectAmbition(person, 'family_legacy');

    GameEngine.ageUp(person, 5);

    expect(person.age).toBe(12);
    expect(person.lifeAmbition.currentStageIndex).toBe(1);
    expect(person.fastForwardResult.reason.key).toBe('recap.stop.ambition');
    expect(person.latestAgeUpRecaps).toHaveLength(1);
  });
});
