import { afterEach, describe, expect, it, vi } from 'vitest';
import { Person } from '../Person';
import {
  observeEventForChains,
  resolveEventChainChoice,
  tickEventChainsMonth,
} from '../EventChainEngine';
import { getCountryRules, ensureCountryLife } from '../CountryLifeSystem';
import { ensurePersonalFinance, processPersonalFinanceYear } from '../PersonalFinanceSystem';
import {
  ensureNPCMemories,
  observeNPCMemoryEvent,
  processNPCMemoryYear,
} from '../NPCMemorySystem';
import {
  beginPregnancy,
  processMonthlySituation,
  resolveMonthlySituationChoice,
} from '../MonthlySituationEngine';
import { ensureReputation, observeReputationEvent } from '../ReputationSystem';

afterEach(() => vi.restoreAllMocks());

describe('deep simulation systems', () => {
  it('creates a persistent event chain and resolves a later choice', () => {
    const person = new Person('Chain', 'Tester', 'Male', 'Morocco');
    person.age = 10;
    observeEventForChains(person, 'A bully made fun of your shoes at school.');

    expect(person.eventChains).toHaveLength(1);
    expect(person.eventChains[0].type).toBe('school_bullying');

    tickEventChainsMonth(person);
    tickEventChainsMonth(person);
    expect(person.pendingEvent?.type).toBe('deep_chain');

    const selected = person.pendingEvent.choices[0];
    resolveEventChainChoice(person, person.pendingEvent, selected);
    expect(person.pendingEvent).toBeNull();
    expect(person.eventChains[0].stage).toBe(1);
    expect(person.eventChains[0].previousChoices).toContain('report');
  });

  it('makes countries materially different', () => {
    const morocco = getCountryRules('Morocco');
    const usa = getCountryRules('United States');

    expect(morocco.costOfLiving).toBeLessThan(usa.costOfLiving);
    expect(morocco.mandatoryService).toBe(true);
    expect(usa.healthcareCost).toBeGreaterThan(morocco.healthcareCost);

    const person = new Person('Country', 'Tester', 'Male', 'Morocco');
    expect(ensureCountryLife(person).healthcareAccess).toBe('public');
  });

  it('tracks a financial ledger and credit consequences', () => {
    const person = new Person('Finance', 'Tester', 'Female', 'United States');
    person.age = 30;
    person.job = { title: 'Teacher', salary: 50000 };
    person.money = 2000;
    person.lastLivingCost = 42000;
    person.personalDebt = 30000;
    ensurePersonalFinance(person);

    processPersonalFinanceYear(person);

    expect(person.finance.annualLedger).toHaveLength(1);
    expect(person.finance.creditScore).toBeGreaterThanOrEqual(300);
    expect(person.finance.creditScore).toBeLessThanOrEqual(850);
    expect(person.finance.lastBudget.income).toBe(50000);
  });

  it('records NPC memories and allows autonomous relationship consequences', () => {
    const person = new Person('Memory', 'Tester');
    person.age = 35;
    person.relationships = [
      { id: 'child-1', name: 'Alex Tester', type: 'Child', age: 12, stat: 70, status: 'Alive' },
    ];
    ensureNPCMemories(person);
    observeNPCMemoryEvent(person, 'You gave Alex Tester a thoughtful gift. They loved it!');

    expect(person.relationships[0].npcMemory.significantMoments).toHaveLength(1);
    expect(person.relationships[0].npcMemory.trust).toBeGreaterThan(70);

    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    processNPCMemoryYear(person);
    expect(person.relationships[0].npcMemory).toBeTruthy();
  });

  it('turns pregnancy into a nine-month situation and supports prenatal choices', () => {
    const person = new Person('Pregnancy', 'Tester', 'Female');
    person.age = 28;
    person.money = 5000;
    beginPregnancy(person, {
      id: 'future-child', name: 'Sam', type: 'Child', age: 0, gender: 'female', traits: [],
    });
    person.pregnancy.month = 2;
    processMonthlySituation(person);

    expect(person.pendingEvent?.situationType).toBe('pregnancy');
    const prenatal = person.pendingEvent.choices.find(choice => choice.effect === 'pregnancy_prenatal');
    resolveMonthlySituationChoice(person, person.pendingEvent, prenatal);
    expect(person.pregnancy.prenatalCare).toBe(1);
    expect(person.money).toBe(4700);
  });

  it('builds identity from actions across several reputation domains', () => {
    const person = new Person('Reputation', 'Tester');
    ensureReputation(person);
    observeReputationEvent(person, 'You successfully committed Bank Robbery and made $50,000.');
    observeReputationEvent(person, 'You volunteered to help refugees displaced by the war.');

    expect(person.reputation.criminal).toBeGreaterThan(0);
    expect(person.reputation.public).toBeGreaterThan(0);
    expect(person.reputation.trust).toBeLessThanOrEqual(50);
  });
});
