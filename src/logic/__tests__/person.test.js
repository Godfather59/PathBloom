import { describe, it, expect, vi } from 'vitest';

// Mock the heavy imports
vi.mock('../SocialMedia', () => ({ handlePost: vi.fn(), handleMonetization: vi.fn() }));
vi.mock('../MafiaLogic', () => ({ performMafiaCrime: vi.fn(), MAFIA_RANKS: [] }));
vi.mock('../MilitaryLogic', () => ({ getRank: vi.fn(() => 'Private') }));
vi.mock('../BusinessLogic', () => ({ Company: class Company {} }));
vi.mock('../ImmigrationSystem', () => ({ ImmigrationManager: class ImmigrationManager {} }));
vi.mock('../Addiction', () => ({ useSubstance: vi.fn(), enterRehab: vi.fn() }));
vi.mock('../Retirement', () => ({
  contributeToRetirement: vi.fn(),
  withdrawFromRetirement: vi.fn(),
  retire: vi.fn(),
}));
vi.mock('../Fitness', () => ({ exercise: vi.fn(), changeDiet: vi.fn() }));
vi.mock('../Insurance', () => ({
  buyInsurance: vi.fn(),
  fileInsuranceClaim: vi.fn(),
  cancelInsurance: vi.fn(),
}));
vi.mock('../Renovation', () => ({ renovateProperty: vi.fn(), flipProperty: vi.fn() }));
vi.mock('../SpaceCareer', () => ({
  joinSpaceProgram: vi.fn(),
  startTraining: vi.fn(),
  beginSpaceMission: vi.fn(),
  goOnMission: vi.fn(),
}));
vi.mock('../Philanthropy', () => ({
  donateToCharity: vi.fn(),
  startFoundation: vi.fn(),
  fundLegacyProject: vi.fn(),
}));
vi.mock('../Clubs', () => ({ joinClub: vi.fn(), leaveClub: vi.fn() }));
vi.mock('../CollegeSports', () => ({
  tryoutForSport: vi.fn(),
  practiceSport: vi.fn(),
  goProfessional: vi.fn(),
}));
vi.mock('../Lawsuits', () => ({ fileLawsuit: vi.fn(), sueRandomPerson: vi.fn() }));
vi.mock('../TimeCapsule', () => ({ writeTimeCapsule: vi.fn(), readTimeCapsule: vi.fn() }));

import { Person } from '../Person';

describe('Person', () => {
  it('creates a person with default values', () => {
    const p = new Person();
    expect(p.name.first).toBe('John');
    expect(p.name.last).toBe('Doe');
    expect(p.age).toBe(0);
    expect(p.money).toBe(0);
    expect(p.isAlive).toBe(true);
    expect(p.energy).toBe(100);
    expect(p.stress).toBe(0);
    expect(p.karma).toBe(50);
    expect(p.fame).toBe(0);
  });

  it('creates a person with given name', () => {
    const p = new Person('Alice', 'Smith', 'Female', 'Canada');
    expect(p.name.first).toBe('Alice');
    expect(p.name.last).toBe('Smith');
    expect(p.gender).toBe('Female');
    expect(p.country).toBe('Canada');
  });

  it('has stats in valid ranges', () => {
    const p = new Person();
    expect(p.happiness).toBeGreaterThanOrEqual(0);
    expect(p.happiness).toBeLessThanOrEqual(100);
    expect(p.health).toBeGreaterThanOrEqual(0);
    expect(p.health).toBeLessThanOrEqual(100);
    expect(p.smarts).toBeGreaterThanOrEqual(0);
    expect(p.smarts).toBeLessThanOrEqual(100);
  });

  it('updateStats clamps values to 0-100', () => {
    const p = new Person();
    p.happiness = 50;
    p.updateStats({ happiness: 200 });
    // Person uses clamp internally, happiness should be at 100
    expect(p.happiness).toBeLessThanOrEqual(100);
  });

  it('isAlive prevents updateStats', () => {
    const p = new Person();
    p.isAlive = false;
    p.happiness = 50;
    p.updateStats({ happiness: 100 });
    expect(p.happiness).toBe(50);
  });

  it('ends the life immediately when health reaches zero', () => {
    const p = new Person();
    p.health = 5;

    p.updateStats({ health: -10 });

    expect(p.health).toBe(0);
    expect(p.isAlive).toBe(false);
  });

  it('can afford when money >= cost', () => {
    const p = new Person();
    p.money = 1000;
    expect(p.money >= 500).toBe(true);
    expect(p.money >= 2000).toBe(false);
  });

  it('has energy when energy >= cost', () => {
    const p = new Person();
    p.energy = 50;
    expect(p.energy >= 20).toBe(true);
    expect(p.energy >= 100).toBe(false);
  });

  it('traits is an array', () => {
    const p = new Person();
    expect(Array.isArray(p.traits)).toBe(true);
  });

  it('ensureDefaults sets missing properties', () => {
    const p = new Person();
    delete p.totalDonated;
    p.ensureDefaults();
    expect(p.totalDonated).toBe(0);
  });

  it('repays the full mortgage balance when an asset is sold', () => {
    const p = new Person();
    p.money = 100;
    p.assets = [
      {
        name: 'Starter Home',
        type: 'Real Estate',
        price: 100,
        purchasePrice: 100,
        value: 50,
        isMortgaged: true,
        mortgage: { balance: 80, monthlyPayment: 1 },
      },
    ];

    const proceeds = p.sellAsset(0);

    expect(proceeds).toBe(-30);
    expect(p.money).toBe(70);
    expect(p.assets).toHaveLength(0);
  });

  it('rejects malformed zero-down mortgages', () => {
    const p = new Person();
    p.money = 1000;
    const bought = p.buyAsset(
      { name: 'House', type: 'Real Estate', price: 100000, value: 100000 },
      { downPayment: 0, amount: 100000, monthlyPayment: 500, term: 30 }
    );

    expect(bought).toBe(false);
    expect(p.assets).toHaveLength(0);
    expect(p.money).toBe(1000);
  });

  it('persists the fixed interest rate on a valid mortgage', () => {
    const p = new Person();
    p.money = 20000;

    expect(
      p.buyAsset(
        { id: 'house', name: 'House', type: 'Real Estate', price: 100000, value: 100000 },
        { downPayment: 20000, amount: 80000, monthlyPayment: 430, interestRate: 0.05, term: 30 }
      )
    ).toBe(true);
    expect(p.assets[0].mortgage.interestRate).toBe(0.05);
    expect(p.assets[0].uniqueId).toBeTruthy();
  });

  it('enforces one committed partner at a time', () => {
    const p = new Person();
    p.age = 30;
    const first = { id: 'first', name: 'First Partner', age: 30, job: 'Teacher' };
    const second = { id: 'second', name: 'Second Partner', age: 29, job: 'Nurse' };

    expect(p.startDating(first)).toBe(true);
    expect(p.startDating(second)).toBe(false);
    expect(p.relationships).toHaveLength(1);
    expect(p.relationships[0].id).toBe('first');
  });

  it('limits intimacy to once per year and consumes energy', () => {
    const p = new Person();
    p.age = 30;
    p.relationships = [{ id: 'partner', name: 'Partner', type: 'Partner', age: 30, stat: 80 }];
    vi.spyOn(p, 'randomStat').mockReturnValue(100);

    p.interactWithRel('partner', 'make_love');
    const energyAfterFirst = p.energy;
    const secondAttempt = p.interactWithRel('partner', 'make_love');

    expect(p.lastIntimacyAge).toBe(30);
    expect(energyAfterFirst).toBe(85);
    expect(secondAttempt).toBe(false);
    expect(p.energy).toBe(85);
  });

  it('includes non-cash wealth in a divorce settlement', () => {
    const p = new Person();
    p.age = 40;
    p.money = 0;
    p.portfolio = [{ id: 'sp500', invested: 50000, currentValue: 100000 }];
    p.relationships = [
      { id: 'spouse', name: 'Spouse', type: 'Spouse', age: 40, stat: 80, hasPrenup: false },
    ];

    p.interactWithRel('spouse', 'divorce');

    expect(p.personalDebt).toBe(50000);
    expect(p.getTotalEstateValue()).toBe(50000);
    expect(p.relationships).toHaveLength(0);
  });

  it('caps rent at one percent of the property value per month', () => {
    const p = new Person();
    p.assets = [{ name: 'Townhouse', type: 'Real Estate', value: 100000, price: 100000 }];

    expect(p.rentAsset(0, 1001)).toBe(false);
    expect(p.rentAsset(0, 1000)).toBe(true);
    expect(p.assets[0].rentPrice).toBe(1000);
  });

  it('accepts the real graduation format for degree-gated careers', () => {
    const p = new Person();
    p.age = 22;
    p.smarts = 100;
    p.degrees = [{ type: 'Computer Science', name: "Bachelor's Degree" }];
    p.educationHistory = ["Bachelor's Degree in Computer Science"];

    const hired = p.setJob({
      title: 'Software Engineer',
      salary: 80000,
      requirements: { smarts: 80, education: 'University', degree_req: ['Computer Science'] },
    });

    expect(hired).toBe(true);
  });

  it('rejects a career when its professional school is missing', () => {
    const p = new Person();
    p.smarts = 100;
    p.degrees = [{ type: 'Biology', name: "Bachelor's Degree" }];

    expect(
      p.setJob({
        title: 'Brain Surgeon',
        salary: 300000,
        requirements: { smarts: 95, education: 'Medical School' },
      })
    ).toBe(false);
  });

  it('continues as a child with a correctly valued net estate', () => {
    const p = new Person('Parent', 'Legacy', 'Female', 'Canada');
    p.age = 80;
    p.money = 500000;
    p.assets = [{ name: 'Home', type: 'Real Estate', value: 100000, price: 100000 }];
    p.portfolio = [{ id: 'sp500', currentValue: 50000, invested: 30000 }];
    p.insurance.life = { cancelled: false, payout: 500000 };
    const child = {
      id: 'child_1',
      name: 'Alex',
      type: 'Child',
      age: 20,
      gender: 'male',
      traits: ['Genius'],
    };

    const heir = p.inherit(child);

    expect(heir.getFullName()).toBe('Alex Legacy');
    expect(heir.gender).toBe('Male');
    expect(heir.relationships).toHaveLength(1);
    expect(heir.relationships[0].status).toBe('Deceased');
    expect(heir.getTotalEstateValue()).toBe(977500);
  });

  it('gives important NPCs a stable personality, needs, preferences, and a bounded memory', () => {
    const p = new Person('Maya', 'Memory', 'Female', 'Canada');
    p.age = 25;
    const friend = p.addRelationship({
      id: 'best_friend',
      name: 'Avery',
      type: 'Best Friend',
      age: 25,
      stat: 70,
    });

    expect(friend.personalityTraits.length).toBeGreaterThanOrEqual(2);
    expect(friend.personalityTraits.length).toBeLessThanOrEqual(3);
    expect(friend.needs.length).toBeGreaterThanOrEqual(2);
    expect(friend.preferences.likes.length).toBeGreaterThan(0);
    expect(friend.memories).toHaveLength(1);

    for (let index = 0; index < 12; index++) {
      p.rememberRelationship(friend, `shared_test_${index}`, index);
    }

    expect(friend.memories).toHaveLength(8);
    expect(friend.memories.at(-1).type).toBe('shared_test_11');
  });

  it('makes relationship actions react to NPC personality', () => {
    const p = new Person();
    p.age = 30;
    const sensitive = p.addRelationship({
      id: 'sensitive_friend',
      name: 'Sam',
      type: 'Friend',
      age: 30,
      stat: 80,
      personalityTraits: ['sensitive', 'loyal'],
    });
    const practical = p.addRelationship({
      id: 'practical_friend',
      name: 'Alex',
      type: 'Friend',
      age: 30,
      stat: 80,
      personalityTraits: ['practical', 'adventurous'],
    });

    p.interactWithRel(sensitive.id, 'insult');
    p.interactWithRel(practical.id, 'insult');

    expect(sensitive.stat).toBe(55);
    expect(practical.stat).toBe(65);
    expect(sensitive.activeConflict?.type).toBe('hurtful_words');
  });

  it('turns promises into a yearly story chain that can be kept or repaired', () => {
    const p = new Person();
    p.age = 30;
    const partner = p.addRelationship({
      id: 'promise_partner',
      name: 'Jordan',
      type: 'Partner',
      age: 30,
      stat: 70,
      personalityTraits: ['loyal', 'practical'],
    });

    p.interactWithRel(partner.id, 'make_promise');
    p.age = 31;
    p.processRelationshipStories();
    p.interactWithRel(partner.id, 'spend_time');

    expect(partner.promise.status).toBe('kept');
    expect(partner.memories.some(memory => memory.type === 'promise_kept')).toBe(true);

    p.interactWithRel(partner.id, 'make_promise');
    p.age = 33;
    p.processRelationshipStories();

    expect(partner.promise.status).toBe('broken');
    expect(partner.activeConflict?.type).toBe('broken_promise');
    const strainedStat = partner.stat;

    p.interactWithRel(partner.id, 'talk_it_out');

    expect(partner.activeConflict).toBeNull();
    expect(partner.stat).toBeGreaterThan(strainedStat);
    expect(partner.memories.some(memory => memory.type === 'conflict_resolved')).toBe(true);
  });

  it('remembers shared-finance and parenting decisions with personality-aware reactions', () => {
    const p = new Person();
    p.age = 35;
    const partner = p.addRelationship({
      id: 'finance_partner',
      name: 'Morgan',
      type: 'Partner',
      age: 34,
      stat: 70,
      personalityTraits: ['independent', 'practical'],
    });
    const child = p.addRelationship({
      id: 'adventurous_child',
      name: 'Riley',
      type: 'Child',
      age: 10,
      stat: 75,
      personalityTraits: ['adventurous', 'playful'],
    });

    p.interactWithRel(partner.id, 'set_financial_style', { style: 'separate' });
    p.interactWithRel(child.id, 'set_boundaries');

    expect(partner.financialArrangement.style).toBe('separate');
    expect(partner.stat).toBe(79);
    expect(partner.memories.some(memory => memory.type === 'separate_finances')).toBe(true);
    expect(child.activeConflict?.type).toBe('parenting_tension');
    expect(child.lastParentingDecisionAge).toBe(35);
    expect(p.interactWithRel(child.id, 'support_child')).toBe(false);
  });

  it('upgrades relationships from older saves without changing their identity or bond', () => {
    const restored = Person.load({
      name: { first: 'Old', last: 'Save' },
      age: 42,
      relationships: [{ id: 'legacy_spouse', name: 'Taylor', type: 'Spouse', age: 41, stat: 77 }],
    });
    const spouse = restored.relationships[0];

    expect(spouse.id).toBe('legacy_spouse');
    expect(spouse.stat).toBe(77);
    expect(spouse.personalityTraits.length).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(spouse.memories)).toBe(true);
    expect(spouse.activeConflict).toBeNull();
  });

  it('preserves stable localization metadata through choices and cloning', () => {
    const p = new Person();
    p.setPendingEvent({
      text: 'Fallback event',
      messageKey: 'event.test.prompt',
      messageParams: { subject: 'budget' },
      choices: [],
    });

    p.resolveEvent({
      text: 'Fallback choice',
      messageKey: 'event.test.choice',
      messageParams: { option: 'invest' },
      outcomeText: 'Fallback outcome',
      outcomeMessageKey: 'event.test.outcome',
      outcomeMessageParams: { result: 'success' },
      type: 'good',
      effects: {},
    });

    expect(p.history[0]).toMatchObject({
      messageKey: 'event.test.outcome',
      messageParams: { result: 'success' },
    });
    expect(p.history[1]).toMatchObject({
      messageKey: 'event.test.choice',
      messageParams: { option: 'invest' },
    });
    expect(p.history[2]).toMatchObject({
      messageKey: 'event.test.prompt',
      messageParams: { subject: 'budget' },
    });

    const cloned = p.clone();
    cloned.history[0].messageParams.result = 'changed';
    expect(p.history[0].messageParams.result).toBe('success');
  });
});
