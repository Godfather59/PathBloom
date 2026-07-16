import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Person } from '../Person';
import {
  ensureWorldSimulation2,
  performWorldSimulationAction,
  simulateWorldMonth,
  simulateWorldMonths,
  validateWorldSimulation2,
} from '../WorldSimulation2';

function makePerson(country = 'Morocco') {
  const person = new Person('World', 'Tester', 'Male', country);
  person.age = 30;
  person.isAlive = true;
  person.contentState = { flags: {}, scheduled: [], history: {}, resolved: [] };
  return person;
}

describe('World Simulation 2.0', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('initializes a connected world with country economies and relations', () => {
    const person = makePerson();
    const world = ensureWorldSimulation2(person);
    expect(Object.keys(world.countries)).toHaveLength(13);
    expect(Object.keys(world.relations).length).toBeGreaterThan(60);
    expect(world.countries.Morocco.budget.revenue).toBeGreaterThan(0);
    expect(validateWorldSimulation2(person).valid).toBe(true);
  });

  it('runs twenty years without invalid country state', () => {
    const person = makePerson('Canada');
    const world = simulateWorldMonths(person, 240, { playerConsequences: false });
    const validation = validateWorldSimulation2(person);
    expect(world.year).toBe(2046);
    expect(validation.valid).toBe(true);
    expect(world.timeline.length).toBeLessThanOrEqual(300);
    Object.values(world.countries).forEach(country => {
      expect(country.population).toBeGreaterThan(0);
      expect(country.gdp).toBeGreaterThan(0);
      expect(country.stability).toBeGreaterThanOrEqual(0);
      expect(country.stability).toBeLessThanOrEqual(100);
    });
  });

  it('schedules a bilingual personal crisis when inflation becomes severe', () => {
    const person = makePerson('Morocco');
    const world = ensureWorldSimulation2(person);
    world.countries.Morocco.inflation = 18;
    world.countries.Morocco.shortages.food = 70;
    simulateWorldMonth(person);
    expect(person.contentState.flags.world2ShortageCrisis).toBe(true);
    expect(person.contentState.scheduled.some(item => item.eventId === 'inflation_shortage_crisis')).toBe(true);
  });

  it('progresses an active war and keeps both countries synchronized', () => {
    const person = makePerson('Morocco');
    const world = ensureWorldSimulation2(person);
    const war = {
      id: 'test-war', attacker: 'Morocco', defender: 'France', startMonth: 0, months: 0,
      status: 'active', front: 0, casualties: { attacker: 0, defender: 0, civilian: 0 },
      exhaustion: { attacker: 0, defender: 0 }, occupation: { attacker: 0, defender: 0 }, peaceOffers: 0,
    };
    world.wars.push(war);
    world.countries.Morocco.atWar = ['France'];
    world.countries.France.atWar = ['Morocco'];
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    simulateWorldMonth(person, { playerConsequences: false });
    expect(war.months).toBe(1);
    expect(war.casualties.attacker + war.casualties.defender).toBeGreaterThan(0);
    expect(world.countries.Morocco.atWar).toContain('France');
    expect(world.countries.France.atWar).toContain('Morocco');
  });

  it('allows influential players to change diplomacy and records it in the timeline', () => {
    const person = makePerson('Morocco');
    person.money = 50000;
    person.reputation = { professional: 50, criminal: 0, political: 75, family: 50, public: 40, trust: 50 };
    const world = ensureWorldSimulation2(person);
    const before = world.timeline.length;
    const result = performWorldSimulationAction(person, 'diplomacy', 'France');
    expect(result.success).toBe(true);
    expect(person.money).toBe(40000);
    expect(world.timeline.length).toBe(before + 1);
    expect(world.timeline[0].playerAction).toBe(true);
  });

  it('preserves all world data through JSON save and restoration', () => {
    const person = makePerson('Japan');
    simulateWorldMonths(person, 36, { playerConsequences: false });
    const saved = JSON.parse(JSON.stringify(person.worldSimulation2));
    const restored = makePerson('Japan');
    restored.worldSimulation2 = saved;
    const world = ensureWorldSimulation2(restored);
    expect(world.month).toBe(saved.month);
    expect(world.year).toBe(saved.year);
    expect(world.countries.Japan.gdp).toBe(saved.countries.Japan.gdp);
    expect(validateWorldSimulation2(restored).valid).toBe(true);
  });
});
