import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSeededRandom,
  inspectPersonState,
  resetSimulationState,
  runSimulationBatch,
  simulateLife,
} from '../LifeSimulation';
import { Person } from '../Person';
import { GameEngine } from '../GameEngine';

describe('deterministic life simulation', () => {
  beforeEach(() => resetSimulationState());
  afterEach(() => vi.restoreAllMocks());

  it('produces a reproducible random stream', () => {
    const first = createSeededRandom('same-seed');
    const second = createSeededRandom('same-seed');
    const values = Array.from({ length: 20 }, () => first());

    expect(values).toEqual(Array.from({ length: 20 }, () => second()));
    values.forEach(value => expect(value).toBeGreaterThanOrEqual(0));
    values.forEach(value => expect(value).toBeLessThan(1));
  });

  it('replays the same life exactly from its seed and policy', () => {
    const options = { seed: 'replay-me', index: 4, strategy: 'balanced', maxAge: 70, saveEvery: 7 };
    const original = simulateLife(options);

    expect(simulateLife(options)).toEqual(original);
    expect(
      simulateLife({
        resolvedSeed: String(original.seed),
        strategy: original.strategy,
        maxAge: 70,
        saveEvery: 7,
      })
    ).toEqual(original);
  });

  it('allows save/load stress checks to be disabled explicitly', () => {
    expect(
      simulateLife({
        seed: 'no-save-roundtrips',
        strategy: 'worker',
        maxAge: 30,
        saveEvery: 0,
      }).saveRoundTrips
    ).toBe(0);
  });

  it('does not count someone who dies at a checkpoint age as a survivor', () => {
    vi.spyOn(GameEngine, 'ageUp').mockImplementation(person => {
      if (!person.isAlive) {
        return person;
      }
      person.age += 1;
      if (person.age === 25) {
        person.health = 0;
        person.isAlive = false;
      }
      return person;
    });
    const outcome = simulateLife({
      resolvedSeed: 4184039992,
      strategy: 'balanced',
      maxAge: 30,
      saveEvery: 0,
    });

    expect(outcome.died).toBe(true);
    expect(outcome.age).toBe(25);
    expect(outcome.checkpoints[25]).toBeUndefined();
  });

  it('records and clears malformed decision events without hanging', () => {
    const originalAgeUp = GameEngine.ageUp.bind(GameEngine);
    vi.spyOn(GameEngine, 'ageUp').mockImplementation((person, years) => {
      const result = originalAgeUp(person, years);
      if (person.isAlive) {
        person.pendingEvent = {
          id: 'broken-event',
          text: 'This event has no possible response.',
          choices: [],
        };
      }
      return result;
    });

    const outcome = simulateLife({
      resolvedSeed: 123456,
      strategy: 'worker',
      maxAge: 20,
      saveEvery: 0,
    });

    expect(outcome.age).toBe(20);
    expect(outcome.violations.some(entry => entry.code === 'UNRESOLVABLE_EVENT')).toBe(true);
  });

  it('runs a mixed cohort without crashes, broken saves, or invalid state', () => {
    const report = runSimulationBatch({ lives: 36, seed: 481516, maxAge: 100, saveEvery: 8 });

    expect(report.summary.reliability.crashes).toBe(0);
    expect(report.summary.reliability.invariantViolations).toBe(0);
    expect(report.summary.reliability.saveRoundTrips).toBeGreaterThan(0);
    expect(report.outcomes).toHaveLength(36);
    expect(report.outcomes.every(outcome => outcome.age <= 100)).toBe(true);
    expect(report.outcomes.every(outcome => !outcome.reachedAgeCap || !outcome.died)).toBe(true);
  }, 20000);

  it('reports malformed and impossible person state', () => {
    const person = new Person('Invalid', 'State');
    person.money = Number.NaN;
    person.health = 0;
    person.relationships = [
      { id: 'same', name: 'A', type: 'Partner', age: 25, stat: 50 },
      { id: 'same', name: 'B', type: 'Spouse', age: 26, stat: 60 },
    ];

    const codes = inspectPersonState(person).map(entry => entry.code);
    expect(codes).toContain('NON_FINITE_NUMBER');
    expect(codes).toContain('ALIVE_WITHOUT_HEALTH');
    expect(codes).toContain('DUPLICATE_ID');
    expect(codes).toContain('MULTIPLE_COMMITTED_PARTNERS');
  });

  it('uses per-instance IDs when validating duplicate asset ownership', () => {
    const person = new Person('Asset', 'Collector');
    person.assets = [
      { id: 'condo', uniqueId: 'condo-one', type: 'Real Estate', value: 100000 },
      { id: 'condo', uniqueId: 'condo-two', type: 'Real Estate', value: 100000 },
    ];

    expect(inspectPersonState(person).map(entry => entry.code)).not.toContain('DUPLICATE_ID');
    person.assets[1].uniqueId = 'condo-one';
    expect(inspectPersonState(person).map(entry => entry.code)).toContain('DUPLICATE_ID');
  });
});
