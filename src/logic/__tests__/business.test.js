import { describe, expect, it } from 'vitest';
import { Company } from '../BusinessLogic';
import { Person } from '../Person';

describe('business accounting', () => {
  it('keeps IPO proceeds in the company instead of crediting them twice', () => {
    const person = new Person('Ari', 'Founder', 'Female', 'Canada');
    const company = new Company('tech_startup', 'Path Systems', person.getFullName());
    company.valuation = 1000000;
    company.cash = 0;
    person.money = 100;
    person.companies = [company];
    const estateBeforeIpo = person.getTotalEstateValue();

    const result = person.manageCompany(company.id, 'ipo');

    expect(result.success).toBe(true);
    expect(person.money).toBe(100);
    expect(company.cash).toBe(250000);
    expect(company.valuation).toBe(1250000);
    expect(company.ownerEquity).toBeCloseTo(0.8);
    expect(person.getTotalEstateValue()).toBe(estateBeforeIpo);
  });
});
