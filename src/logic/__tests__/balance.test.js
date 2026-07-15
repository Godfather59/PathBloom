import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LOTTERY_JACKPOT,
  LOTTERY_JACKPOT_ODDS,
  LOTTERY_TICKET_COST,
  getSlotPayout,
  getTheoreticalSlotRtp,
} from '../Gambling';
import { fileLawsuit, getLawsuitSuccessChance, LAWSUIT_GROUNDS } from '../Lawsuits';
import { Person } from '../Person';
import { Company } from '../BusinessLogic';
import { UNIVERSITY_MAJORS, GRAD_SCHOOLS } from '../EducationLogic';
import { JOBS } from '../Job';

describe('balance guardrails', () => {
  afterEach(() => vi.restoreAllMocks());

  it('keeps slot-machine return inside a conventional casino range', () => {
    expect(getTheoreticalSlotRtp()).toBeGreaterThanOrEqual(0.85);
    expect(getTheoreticalSlotRtp()).toBeLessThanOrEqual(0.98);
    expect(getSlotPayout(['🍒', '🍋', '🍒'], 10)).toBe(0);
    expect(getSlotPayout(['7️⃣', '7️⃣', '7️⃣'], 10)).toBe(1500);
  });

  it('keeps lottery expected return below the ticket price', () => {
    const expectedReturn = LOTTERY_JACKPOT / LOTTERY_JACKPOT_ODDS;
    expect(expectedReturn / LOTTERY_TICKET_COST).toBeCloseTo(0.8, 5);
  });

  it('limits lawsuits to one filing per year and charges losing costs', () => {
    const person = new Person('Casey', 'Claimant');
    person.age = 30;
    person.money = 200000;
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const result = fileLawsuit(person, 'fraud', 'Example Corp');
    const moneyAfterFirst = person.money;

    expect(result).toBeLessThan(0);
    expect(moneyAfterFirst).toBeLessThan(192000);
    expect(fileLawsuit(person, 'personal_injury', 'Another Corp')).toBe(false);
    expect(person.money).toBe(moneyAfterFirst);
  });

  it('makes unsupported lawsuits negative expected value', () => {
    const person = new Person('Casey', 'Claimant');
    person.age = 30;
    person.money = 20000;
    person.fame = 0;

    LAWSUIT_GROUNDS.forEach(grounds => {
      const successChance = getLawsuitSuccessChance(person, grounds.id, 'Example Corp');
      const averageSuccessNet = grounds.baseAward * 0.7 - grounds.filingFee;
      const lossNet = -(grounds.filingFee + grounds.baseAward * 0.12);
      const expectedValue = successChance * averageSuccessNet + (1 - successChance) * lossNet;
      expect(expectedValue).toBeLessThan(0);
    });
  });

  it('keeps first-year business valuations grounded and makes hiring situationally useful', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const solo = new Company('consulting_firm', 'Solo', 'Founder');
    const staffed = new Company('consulting_firm', 'Staffed', 'Founder');
    solo.reputation = 100;
    staffed.reputation = 100;
    staffed.cash = 100000;
    expect(staffed.hireEmployee().success).toBe(true);

    const soloResult = solo.simulate('Normal');
    const staffedResult = staffed.simulate('Normal');

    expect(staffedResult.profit).toBeGreaterThan(soloResult.profit);
    expect(solo.valuation).toBeLessThan(1100000);
  });

  it('keeps maximum staffing linear and within a grounded valuation', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const company = new Company('tech_startup', 'Scale Test', 'Founder');
    company.cash = 1000000;
    company.reputation = 100;
    while (company.employees < company.businessType.maxEmployees) {
      expect(company.hireEmployee().success).toBe(true);
    }

    const result = company.simulate('Normal');

    expect(company.employees).toBe(30);
    expect(result.profit).toBeLessThan(1000000);
    expect(company.valuation).toBeLessThan(5000000);
  });

  it('keeps every degree-gated career reachable through offered education', () => {
    const obtainableDegrees = new Set([
      ...UNIVERSITY_MAJORS.map(major => major.name),
      ...GRAD_SCHOOLS.map(school => school.major || school.name),
    ]);

    JOBS.filter(job => job.requirements?.degree_req).forEach(job => {
      expect(
        job.requirements.degree_req.some(degree => obtainableDegrees.has(degree)),
        `${job.title} has no obtainable qualifying degree`
      ).toBe(true);
    });
  });
});
