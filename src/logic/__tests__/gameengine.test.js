import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateIncomeTax, GameEngine } from '../GameEngine';
import { Person } from '../Person';

function makeMockPerson() {
  return {
    age: 30,
    looks: 80,
    health: 80,
    happiness: 50,
    fitness: { muscleMass: 20, bodyFat: 20 },
    logEvent: vi.fn(),
    updateStats(changes) {
      if (changes.looks != null) {
        this.looks = Math.max(0, Math.min(100, (this.looks || 50) + changes.looks));
      }
      if (changes.health != null) {
        this.health = Math.max(0, Math.min(100, (this.health || 50) + changes.health));
      }
      if (changes.happiness != null) {
        this.happiness = Math.max(0, Math.min(100, (this.happiness || 50) + changes.happiness));
      }
      if (changes.smarts != null) {
        this.smarts = Math.max(0, Math.min(100, (this.smarts || 50) + changes.smarts));
      }
      if (changes.stress != null) {
        this.stress = Math.max(0, Math.min(100, (this.stress || 0) + changes.stress));
      }
      if (changes.fame != null) {
        this.fame = Math.max(0, Math.min(100, (this.fame || 0) + changes.fame));
      }
    },
  };
}

describe('GameEngine', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    GameEngine.worldState = {
      economy: 'Normal',
      conflict: 'Peace',
      pandemic: false,
    };
    GameEngine.marketTrends = {
      indexFund: 100,
      dogecoin: 0.5,
    };
  });

  it('has initial world state', () => {
    expect(GameEngine.worldState.economy).toBe('Normal');
    expect(GameEngine.worldState.conflict).toBe('Peace');
    expect(GameEngine.worldState.pandemic).toBe(false);
  });

  it('calls updateWorldState without error', () => {
    const person = makeMockPerson();
    expect(() => GameEngine.updateWorldState(person)).not.toThrow();
  });

  it('updateWorldState calls logEvent when state changes', () => {
    const person = makeMockPerson();
    GameEngine.worldState.economy = 'Recession';
    // Force the odds by calling many times
    for (let i = 0; i < 500; i++) {
      GameEngine.updateWorldState(person);
    }
    // Should have logged some economy changes
    const economyLogs = person.logEvent.mock.calls.filter(
      c => typeof c[0] === 'string' && c[0].includes('economy')
    );
    expect(economyLogs.length).toBeGreaterThan(0);
  });

  it('processNaturalChanges reduces looks after 50', () => {
    const p = makeMockPerson();
    p.age = 55;
    p.looks = 80;
    p.health = 80;
    p.happiness = 50;
    GameEngine.processNaturalChanges(p);
    expect(p.looks).toBeLessThan(80);
  });

  it('uses marginal tax brackets without take-home-pay cliffs', () => {
    const netAtThirtyThousand = 30000 - calculateIncomeTax(30000);
    const netOneDollarHigher = 30001 - calculateIncomeTax(30001);

    expect(calculateIncomeTax(30000)).toBe(3000);
    expect(calculateIncomeTax(60000)).toBe(8400);
    expect(netOneDollarHigher).toBeGreaterThanOrEqual(netAtThirtyThousand);
    expect(calculateIncomeTax(250000)).toBe(66500);
  });

  it('stops a multi-year skip when a decision event appears', () => {
    const person = new Person('Ava', 'Tester', 'Female', 'Canada');
    person.age = 20;
    vi.spyOn(GameEngine, 'generateEvent').mockReturnValue({
      id: 'decision',
      text: 'Choose carefully',
      choices: [{ text: 'Continue', effects: {} }],
    });

    GameEngine.ageUp(person, 5);

    expect(person.age).toBe(21);
    expect(person.pendingEvent?.id).toBe('decision');
  });

  it('starts school even when the same year generates an event', () => {
    const person = new Person('Noah', 'Tester', 'Male', 'Canada');
    person.age = 5;
    vi.spyOn(GameEngine, 'generateEvent').mockReturnValue({
      id: 'school_day',
      text: 'A memorable first day',
      choices: [{ text: 'Smile', effects: {} }],
    });

    GameEngine.ageUp(person);

    expect(person.currentSchool?.type).toBe('elementary');
    expect(person.pendingEvent?.id).toBe('school_day');
  });

  it('updates investments even when no physical assets are owned', () => {
    const person = new Person('Mia', 'Investor', 'Female', 'Canada');
    person.age = 25;
    person.assets = [];
    person.portfolio = [
      { id: 'sp500', name: 'S&P 500 Index', invested: 1000, currentValue: 1000, history: [] },
    ];

    GameEngine.processAssets(person);

    expect(person.portfolio[0].history).toHaveLength(1);
    expect(Number.isFinite(person.portfolio[0].currentValue)).toBe(true);
  });

  it('amortizes mortgages with their fixed interest rate', () => {
    const person = new Person('Mia', 'Homeowner', 'Female', 'Canada');
    person.age = 30;
    person.money = 100000;
    person.assets = [
      {
        name: 'Starter Home',
        type: 'Real Estate',
        price: 300000,
        value: 300000,
        maintenance: 0,
        isMortgaged: true,
        mortgage: {
          balance: 240000,
          monthlyPayment: 1288,
          interestRate: 0.05,
          term: 30,
        },
      },
    ];
    vi.spyOn(Math, 'random').mockReturnValue(0.2);

    GameEngine.processAssets(person);

    expect(person.money).toBe(84544);
    expect(person.assets[0].mortgage.balance).toBeGreaterThan(240000 - 1288 * 12);
    expect(person.assets[0].mortgage.balance).toBeLessThan(240000);
  });

  it('does not charge interest immediately on a new living-cost shortfall', () => {
    const person = new Person('Lee', 'Borrower', 'Non-binary', 'Canada');
    person.age = 30;
    person.money = 0;
    const openingDebt = person.personalDebt;

    const livingCost = GameEngine.processLivingExpenses(person);
    GameEngine.processPersonalDebt(person, openingDebt);

    expect(livingCost).toBeGreaterThan(0);
    expect(person.personalDebt).toBe(livingCost);
  });

  it('repays debt from available cash even without a current job', () => {
    const person = new Person('Robin', 'Landlord', 'Non-binary', 'Canada');
    person.age = 50;
    person.money = 100000;
    person.personalDebt = 10000;
    person.loans = 10000;

    const personalPayment = GameEngine.processPersonalDebt(person);
    const studentPayment = GameEngine.processStudentLoans(person);

    expect(personalPayment).toBeGreaterThan(0);
    expect(studentPayment).toBeGreaterThan(0);
    expect(person.personalDebt).toBeLessThan(10800);
    expect(person.loans).toBeLessThan(10400);
  });

  it('prevents unpayable unsecured debt from compounding without limit', () => {
    const person = new Person('Robin', 'Hardship', 'Non-binary', 'Canada');
    person.age = 40;
    person.money = 0;
    person.personalDebt = 200000;

    GameEngine.processPersonalDebt(person);

    expect(person.bankruptcies).toBe(1);
    expect(person.personalDebt).toBeLessThan(100000);
    expect(person.lifeStats.totalDebtDischarged).toBeGreaterThan(0);
  });

  it('stops processing the year as soon as the person dies', () => {
    const person = new Person('Kai', 'Tester', 'Male', 'Canada');
    person.age = 60;
    vi.spyOn(GameEngine, 'processNaturalChanges').mockImplementation(p =>
      p.updateStats({ health: -200 })
    );
    const processAssets = vi.spyOn(GameEngine, 'processAssets');

    GameEngine.ageUp(person);

    expect(person.isAlive).toBe(false);
    expect(processAssets).not.toHaveBeenCalled();
    expect(person.pendingEvent).toBeNull();
  });
});
