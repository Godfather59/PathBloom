import { afterEach, describe, expect, it, vi } from 'vitest';
import { contributeToRetirement, processRetirement } from '../Retirement';
import { donateToCharity } from '../Philanthropy';
import { flipProperty } from '../Renovation';
import { buyInsurance, fileInsuranceClaim, processInsurance } from '../Insurance';
import { changeDiet, exercise, processFitness } from '../Fitness';
import { enterRehab, processAddictions } from '../Addiction';
import { Company } from '../BusinessLogic';
import {
  beginSpaceMission,
  joinSpaceProgram,
  SPACE_AGENCIES,
  SPACE_MISSIONS,
  startTraining,
} from '../SpaceCareer';
import { isChallengeActionAllowed } from '../ChallengeMode';

const makePerson = (overrides = {}) => ({
  age: 30,
  money: 100000,
  job: { title: 'Engineer' },
  retirementAccounts: {},
  lifeStats: { totalMoneyEarned: 0 },
  logEvent: vi.fn(),
  updateStats: vi.fn(),
  ...overrides,
});

describe('long-running financial systems', () => {
  afterEach(() => vi.restoreAllMocks());

  it('rejects negative retirement contributions', () => {
    const person = makePerson();

    expect(contributeToRetirement(person, '401k', -5000)).toBe(false);
    expect(person.money).toBe(100000);
    expect(person.retirementAccounts['401k']).toBeUndefined();
  });

  it('keeps automatic contributions within the annual limit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const person = makePerson({
      retirementAccounts: {
        '401k': {
          balance: 20000,
          autoContribute: 10000,
          lastContributionAge: 30,
          contributedThisYear: 20000,
          suspended: false,
        },
      },
    });

    processRetirement(person);

    expect(person.retirementAccounts['401k'].contributedThisYear).toBe(23000);
    expect(person.money).toBe(97000);
  });

  it('caps the annual employer retirement match at three percent of salary', () => {
    const person = makePerson({
      job: { title: 'Engineer', salary: 100000 },
    });

    expect(contributeToRetirement(person, '401k', 23000)).toBe(true);

    expect(person.retirementAccounts['401k'].balance).toBe(26000);
    expect(person.retirementAccounts['401k'].employerMatchedThisYear).toBe(3000);
  });

  it('turns retirement savings into annual retirement income', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const person = makePerson({
      age: 70,
      money: 0,
      job: { title: 'Retired Engineer', salary: 0, isRetired: true },
      isRetired: true,
      retirementAccounts: {
        '401k': { balance: 100000, suspended: false },
      },
    });

    processRetirement(person);

    expect(person.retirementAccounts['401k'].balance).toBe(100800);
    expect(person.money).toBe(5900);
    expect(person.lifeStats.totalRetirementIncome).toBe(5900);
  });

  it('tracks a donation once', () => {
    const person = makePerson({ totalDonated: 0 });

    expect(donateToCharity(person, 'education', 5000)).toBe(true);
    expect(person.money).toBe(95000);
    expect(person.totalDonated).toBe(5000);
  });

  it('repays a mortgage when flipping a renovated property', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const person = makePerson({
      money: 100,
      assets: [
        {
          name: 'Fixer Upper',
          type: 'Real Estate',
          price: 100,
          purchasePrice: 100,
          value: 100,
          renovations: ['kitchen'],
          renovationCost: 10,
          isMortgaged: true,
          mortgage: { balance: 80 },
        },
      ],
    });

    const result = flipProperty(person, 0);

    expect(result.netProceeds).toBe(20);
    expect(person.money).toBe(120);
    expect(person.assets).toHaveLength(0);
  });

  it('does not charge an insurance deductible twice', () => {
    const person = makePerson({
      money: 0,
      insurance: {
        home: { cancelled: false, coverage: 0.85, deductible: 2000, claims: 0 },
      },
    });

    const payout = fileInsuranceClaim(person, 'home', 10000);

    expect(payout).toBe(6500);
    expect(person.money).toBe(6500);
  });

  it('charges the first insurance year before coverage starts', () => {
    const person = makePerson({ age: 30, money: 5000, insurance: {} });

    expect(buyInsurance(person, 'health', 'BlueCross')).toBe(true);
    expect(person.money).toBe(1400);
    processInsurance(person);
    expect(person.money).toBe(1400);
  });

  it('does not multiply payroll by employee count twice', () => {
    const company = new Company('restaurant', 'Test Kitchen', 'Founder');
    company.employees = 2;
    company.expenses = 11000;
    vi.spyOn(Math, 'random').mockReturnValue(0.5);

    expect(company.simulate('Normal').expenses).toBe(132000);
  });

  it('bills a selected diet once per simulated year', () => {
    const person = makePerson({
      money: 5000,
      fitness: { weight: 150, diet: 'vegan', exerciseDays: 0, muscleMass: 30, bodyFat: 20 },
    });

    processFitness(person);

    expect(person.money).toBe(3800);
  });

  it('applies diet benefits and does not carry exercise sessions into later years', () => {
    const person = makePerson({
      money: 5000,
      fitness: { weight: 150, diet: 'vegan', exerciseDays: 3, muscleMass: 30, bodyFat: 20 },
    });

    processFitness(person);

    expect(person.fitness.exerciseDays).toBe(0);
    expect(person.fitness.weight).toBe(148.5);
    expect(person.updateStats).toHaveBeenCalledWith({ health: 3, looks: 2 });
  });

  it('does not charge for a diet until its annual simulation', () => {
    const person = makePerson({
      money: 1000,
      fitness: { weight: 150, diet: 'standard', exerciseDays: 0, muscleMass: 30, bodyFat: 20 },
    });

    expect(changeDiet(person, 'vegetarian')).toBe(true);
    expect(person.money).toBe(1000);
  });

  it('does not treat zero energy as full energy', () => {
    const person = makePerson({
      energy: 0,
      fitness: { weight: 150, diet: 'standard', exerciseDays: 0, muscleMass: 30, bodyFat: 20 },
      hasTrait: vi.fn(() => false),
    });

    expect(exercise(person, 'strength')).toBe(false);
    expect(person.energy).toBe(0);
  });

  it('limits targeted rehab to the selected addiction', () => {
    vi.spyOn(Math, 'random').mockReturnValue(1);
    const person = makePerson({
      money: 50000,
      addictions: { alcohol: true, tobacco: true },
      addictionLevels: { alcohol: 30, tobacco: 30 },
      inTreatment: false,
      treatmentTypes: [],
    });

    expect(enterRehab(person, 'alcohol')).toBe(true);
    processAddictions(person);

    expect(person.addictionLevels.alcohol).toBe(15);
    expect(person.addictionLevels.tobacco).toBe(30);
  });

  it('accepts Computer Science for space and limits actions to once per age', () => {
    const person = makePerson({
      age: 25,
      country: 'United States',
      citizenships: ['United States'],
      degrees: [{ type: 'Computer Science', name: "Bachelor's Degree" }],
      smarts: 100,
      energy: 100,
      job: null,
      spaceProgram: null,
    });

    expect(joinSpaceProgram(person, SPACE_AGENCIES[0])).toBe(true);
    expect(startTraining(person, 'Basic Training')).toBe(true);
    expect(startTraining(person, 'Basic Training')).toBe(false);
    person.spaceProgram.training = 20;
    expect(beginSpaceMission(person, SPACE_MISSIONS[0])).toBe(true);
    expect(beginSpaceMission(person, SPACE_MISSIONS[0])).toBe(false);
    expect(person.energy).toBe(45);
  });

  it('enforces active challenge action restrictions', () => {
    const person = makePerson({
      activeChallenge: { id: 'rags_to_riches', completed: false, failed: false },
    });
    expect(isChallengeActionAllowed(person, 'lottery')).toBe(false);
    expect(isChallengeActionAllowed(person, 'inheritance')).toBe(false);
  });
});
