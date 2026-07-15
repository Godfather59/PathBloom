import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS, checkAchievements } from '../Achievements';

function makePerson(overrides = {}) {
  return {
    age: 30,
    money: 50000,
    assets: [],
    happiness: 50,
    health: 80,
    smarts: 50,
    looks: 50,
    karma: 50,
    stress: 0,
    fame: 0,
    energy: 100,
    isAlive: true,
    isInPrison: false,
    history: [],
    educationHistory: [],
    degrees: [],
    relationships: [],
    pets: [],
    countriesVisited: ['United States'],
    job: null,
    traits: [],
    fitness: { muscleMass: 20, bodyFat: 20 },
    languages: ['English'],
    totalDonated: 0,
    hasNobelPrize: false,
    patents: [],
    mafia: null,
    royalty: null,
    ...overrides,
  };
}

describe('ACHIEVEMENTS', () => {
  it('has at least 50 achievements', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(50);
  });

  it('each achievement has required fields', () => {
    ACHIEVEMENTS.forEach(ach => {
      expect(ach.id).toBeTruthy();
      expect(ach.title).toBeTruthy();
      expect(ach.description).toBeTruthy();
      expect(ach.icon).toBeTruthy();
    });
  });

  it('all achievement IDs are unique', () => {
    const ids = ACHIEVEMENTS.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('checkAchievements', () => {
  it('returns survivor at age 50', () => {
    const p = makePerson({ age: 50 });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('survivor');
  });

  it('returns centenarian at age 100', () => {
    const p = makePerson({ age: 100 });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('centenarian');
  });

  it('returns millionaire at $1M net worth', () => {
    const p = makePerson({ money: 1500000 });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('millionaire');
  });

  it('does not return already unlocked achievements', () => {
    const p = makePerson({ age: 100, money: 9999999999 });
    const unlocked = checkAchievements(p, ['centenarian', 'millionaire']);
    expect(unlocked).not.toContain('centenarian');
    expect(unlocked).not.toContain('millionaire');
  });

  it('returns criminal when in prison', () => {
    const p = makePerson({ isInPrison: true });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('criminal');
  });

  it('returns educated when university graduate', () => {
    const p = makePerson({ educationHistory: ['Bachelor of Science at University'] });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('educated');
  });

  it('returns educated for the degree format created by graduation', () => {
    const p = makePerson({ degrees: [{ type: 'Computer Science', name: "Bachelor's Degree" }] });
    expect(checkAchievements(p, [])).toContain('educated');
  });

  it('recognizes real retirement, prison escape, and space mission state', () => {
    const p = makePerson({
      isRetired: true,
      spaceProgram: { missionsCompleted: 1 },
      history: [{ text: 'YOU ESCAPED PRISON!' }],
    });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('retired');
    expect(unlocked).toContain('astronaut');
    expect(unlocked).toContain('prison_escape');
  });

  it('uses owned pets and visited countries for their achievements', () => {
    const p = makePerson({
      pets: [{}, {}, {}],
      countriesVisited: Array.from({ length: 10 }, (_, index) => `Country ${index}`),
    });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('pet_lover');
    expect(unlocked).toContain('world_traveler');
  });

  it('recognizes a successful system hacking crime', () => {
    const p = makePerson({
      history: [{ text: 'You successfully committed System Hacking and made $10,000.' }],
    });
    expect(checkAchievements(p, [])).toContain('hacker');
  });

  it('only grants Immaculate Life after a crime-free death', () => {
    const living = makePerson({ karma: 95, isAlive: true });
    const dead = makePerson({ karma: 95, isAlive: false });
    expect(checkAchievements(living, [])).not.toContain('immaculate');
    expect(checkAchievements(dead, [])).toContain('immaculate');
  });

  it('returns billionaire at $1B', () => {
    const p = makePerson({ money: 2000000000 });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('billionaire');
  });

  it('returns philanthropist when donated $1M+', () => {
    const p = makePerson({ totalDonated: 1500000 });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('philanthropist');
  });

  it('returns fertile when 3+ children', () => {
    const p = makePerson({
      relationships: [{ type: 'Child' }, { type: 'Child' }, { type: 'Child' }],
    });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('fertile');
  });

  it('returns made_man when in mafia', () => {
    const p = makePerson({ mafia: { family: 'Test', rank: 'Soldier' } });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('made_man');
  });

  it('returns godfather when mafia rank is Godfather', () => {
    const p = makePerson({ mafia: { family: 'Test', rank: 'Godfather' } });
    const unlocked = checkAchievements(p, []);
    expect(unlocked).toContain('godfather');
  });
});
