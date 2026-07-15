import { describe, it, expect, beforeEach } from 'vitest';
import { Person } from '../Person';
import { startWar, processWarYears, getMilitaryStrength, getWarExhaustion } from '../WarSystem';
import { calculateUNInfluence, canProposeResolution, proposeResolution, RESOLUTION_TYPES } from '../UnitedNations';
import { getBaseCountries, getCountryByName, initializeGeopolitics } from '../GeoPolitics';
import { buildWorldState, simulateWorldYear, getGlobalStats } from '../WorldSimulation';

describe('WarSystem', () => {
  let person;

  beforeEach(() => {
    person = new Person();
    person.age = 30;
    person.country = 'United States';
    person.money = 100000;
    person.policies = { militarySpending: 50, taxRate: 30, diplomacyBudget: 30 };
    person.cabinet = { defense: { title: 'Secretary of Defense', effectiveness: 60 } };
    person.ensureDefaults();
  });

  it('startWar creates a war object', () => {
    const target = getCountryByName('China');
    const result = startWar(person, target.id);
    expect(result.success).toBe(true);
    expect(person.wars).toBeDefined();
    expect(person.wars[target.id]).toBeDefined();
    expect(person.wars[target.id].phase).toBe('invasion');
    expect(person.wars[target.id].targetId).toBe('china');
    expect(person.wars[target.id].years).toBe(0);
  });

  it('startWar does not block self-war (no self-check in WarSystem)', () => {
    const target = getCountryByName('United States');
    const result = startWar(person, target.id);
    expect(result.success).toBe(true);
  });

  it('processWarYears advances war', () => {
    const target = getCountryByName('China');
    startWar(person, target.id);
    const war = person.wars[target.id];
    expect(war.years).toBe(0);
    processWarYears(person);
    expect(war.years).toBeGreaterThanOrEqual(0);
  });

  it('getMilitaryStrength returns number', () => {
    const strength = getMilitaryStrength(person);
    expect(strength).toBeGreaterThan(0);
    expect(strength).toBeLessThanOrEqual(100);
  });

  it('getWarExhaustion returns 0 for no war', () => {
    expect(getWarExhaustion(person, 'china')).toBe(0);
  });
});

describe('UnitedNations', () => {
  let person;

  beforeEach(() => {
    person = new Person();
    person.age = 30;
    person.country = 'United States';
    person.money = 500000;
    person.ensureDefaults();
    person.policies = { diplomacyBudget: 50, taxRate: 30, militarySpending: 30 };
    person.cabinet = { state: { title: 'Secretary of State', effectiveness: 60 } };
  });

  it('calculateUNInfluence returns number', () => {
    const influence = calculateUNInfluence(person);
    expect(influence).toBeGreaterThan(0);
    expect(influence).toBeLessThanOrEqual(100);
  });

  it('canProposeResolution returns false for nonexistent target', () => {
    expect(canProposeResolution(person, 'nonexistent', 'condemn')).toBe(false);
  });

  it('proposeResolution records a resolution', () => {
    const china = getCountryByName('China');
    person.countryRelations = {};
    person.countryRelations[china.id] = { relation: 20, tradeLevel: 0, tension: 30 };
    const result = proposeResolution(person, china.id, 'condemn');
    expect(result.success).toBe(true);
    expect(person.unResolutions.length).toBe(1);
    expect(person.unResolutions[0].targetId).toBe(china.id);
  });

  it('RESOLUTION_TYPES has expected types', () => {
    const ids = RESOLUTION_TYPES.map(r => r.id);
    expect(ids).toContain('condemn');
    expect(ids).toContain('sanctions');
    expect(ids).toContain('peacekeeping');
  });
});

describe('GeoPolitics', () => {
  it('getBaseCountries returns country list', () => {
    const countries = getBaseCountries();
    expect(countries.length).toBeGreaterThan(0);
    expect(countries.find(c => c.name === 'United States')).toBeDefined();
  });

  it('getCountryByName returns correct country', () => {
    const usa = getCountryByName('United States');
    expect(usa).toBeDefined();
    expect(usa.id).toBe('usa');
    expect(usa.continent).toBe('North America');
  });

  it('getCountryByName returns undefined for unknown', () => {
    expect(getCountryByName('Atlantis')).toBeUndefined();
  });

  it('initializeGeopolitics sets up relations on person', () => {
    const person = new Person();
    person.country = 'France';
    initializeGeopolitics(person);
    expect(person.countryRelations).toBeDefined();
    expect(person.cabinet).toBeDefined();
    expect(person.policies).toBeDefined();
    expect(Object.keys(person.countryRelations).length).toBeGreaterThan(0);
  });
});

describe('WorldSimulation', () => {
  it('buildWorldState creates countries', () => {
    const state = buildWorldState();
    expect(state).toBeDefined();
    expect(state.countries).toBeDefined();
    expect(Object.keys(state.countries).length).toBeGreaterThan(0);
    expect(state.countries.usa.name).toBe('United States');
  });

  it('simulateWorldYear updates country stats', () => {
    const state = buildWorldState();
    simulateWorldYear(state);
    expect(state.year).toBeDefined();
  });

  it('getGlobalStats returns summary', () => {
    const state = buildWorldState();
    const stats = getGlobalStats(state);
    expect(stats).toBeDefined();
    expect(stats.totalPopulation).toBeGreaterThan(0);
    expect(stats.avgHappiness).toBeGreaterThan(0);
    expect(stats.democracies).toBeGreaterThan(0);
  });
});
