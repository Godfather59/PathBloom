import { describe, expect, it, vi } from 'vitest';
import {
  AMBITION_PATHS,
  createAmbitionState,
  evaluateAmbition,
  evaluateAmbitionRequirement,
  getAmbitionView,
  sanitizeAmbitionState,
  selectAmbition,
} from '../LifeAmbitions';

function makePerson(overrides = {}) {
  return {
    age: 18,
    money: 0,
    happiness: 50,
    health: 50,
    smarts: 50,
    looks: 50,
    karma: 50,
    fame: 0,
    stress: 0,
    notoriety: 0,
    energy: 100,
    relationships: [],
    assets: [],
    portfolio: [],
    retirementAccounts: {},
    companies: [],
    social: { totalFollowers: 0 },
    skills: { voice: 0, instrument: 0, instruments: {} },
    mafia: { family: null, rank: null, standing: 0 },
    lifeStats: { crimesCommitted: 0 },
    loans: 0,
    personalDebt: 0,
    totalDonated: 0,
    logEvent: vi.fn(),
    ...overrides,
  };
}

describe('LifeAmbitions', () => {
  it('provides five distinct paths with age-aware multi-stage progression and Arabic content', () => {
    expect(AMBITION_PATHS.map(path => path.id)).toEqual([
      'family_legacy',
      'business_empire',
      'creative_fame',
      'public_service',
      'criminal_mastermind',
    ]);

    for (const path of AMBITION_PATHS) {
      expect(path.stages.length).toBeGreaterThanOrEqual(4);
      expect(path.stages.length).toBeLessThanOrEqual(6);
      expect(path.name.ar.length).toBeGreaterThan(0);
      expect(path.description.ar.length).toBeGreaterThan(0);
      expect(
        path.stages.every(stage => stage.minAge >= 0 && stage.name.ar && stage.description.ar)
      ).toBe(true);
      expect(path.stages.map(stage => stage.minAge)).toEqual(
        [...path.stages.map(stage => stage.minAge)].sort((a, b) => a - b)
      );
    }
  });

  it('locks the player to one path for the entire life', () => {
    const person = makePerson();

    expect(selectAmbition(person, 'family_legacy', { language: 'ar' }).reason).toBe('selected');
    expect(person.lifeAmbition.pathId).toBe('family_legacy');
    expect(person.lifeAmbition.language).toBe('ar');

    const samePath = selectAmbition(person, 'family_legacy');
    expect(samePath.success).toBe(true);
    expect(samePath.reason).toBe('already_selected');

    const otherPath = selectAmbition(person, 'business_empire');
    expect(otherPath.success).toBe(false);
    expect(otherPath.reason).toBe('path_locked');
    expect(person.lifeAmbition.pathId).toBe('family_legacy');
  });

  it('enforces minimum ages and applies every stage reward only once', () => {
    const person = makePerson({
      age: 11,
      relationships: [
        { type: 'Parent', stat: 90 },
        { type: 'Sibling', stat: 80 },
      ],
    });
    selectAmbition(person, 'family_legacy');

    const tooYoung = evaluateAmbition(person);
    expect(tooYoung.completedStages).toEqual([]);
    expect(person.lifeAmbition.points).toBe(0);

    person.age = 12;
    const completed = evaluateAmbition(person);
    expect(completed.completedStages).toEqual(['trusted_circle']);
    expect(person.lifeAmbition.points).toBe(100);
    expect(person.happiness).toBe(54);

    evaluateAmbition(person);
    expect(person.lifeAmbition.points).toBe(100);
    expect(person.happiness).toBe(54);
    expect(person.lifeAmbition.claimedRewardIds).toEqual(['trusted_circle']);
  });

  it('can complete multiple already-earned stages sequentially and finish a path', () => {
    const person = makePerson({
      age: 60,
      money: 6_000_000,
      companies: [{ employees: 20, valuation: 2_000_000, isPublic: true, ownerEquity: 1 }],
    });
    selectAmbition(person, 'business_empire');

    const result = evaluateAmbition(person);

    expect(result.completedStages).toHaveLength(6);
    expect(result.completedNow).toBe(true);
    expect(person.lifeAmbition.completed).toBe(true);
    expect(person.lifeAmbition.completedAtAge).toBe(60);
    expect(person.lifeAmbition.points).toBe(1975);
    expect(person.money).toBe(6_175_000);
  });

  it('keeps persisted ambition state JSON-safe and repairs tampered progression', () => {
    const raw = createAmbitionState('creative_fame', 8, 'ar');
    raw.completedStageIds = ['find_your_voice', 'cultural_icon', 'not-a-stage'];
    raw.claimedRewardIds = ['find_your_voice', 'cultural_icon'];
    raw.currentStageIndex = 99;
    raw.points = Number.NaN;

    const clean = sanitizeAmbitionState(JSON.parse(JSON.stringify(raw)));
    expect(clean.completedStageIds).toEqual(['find_your_voice']);
    expect(clean.claimedRewardIds).toEqual(['find_your_voice']);
    expect(clean.currentStageIndex).toBe(1);
    expect(clean.points).toBe(100);
    expect(() => JSON.stringify(clean)).not.toThrow();
    expect(JSON.stringify(clean)).not.toContain('function');
  });

  it('evaluates real business, political, creative and criminal game fields', () => {
    const person = makePerson({
      age: 40,
      companies: [{ employees: 12, valuation: 1_500_000, isPublic: true }],
      job: { title: 'President', isPolitical: true, approval: 72 },
      isHeadOfState: true,
      social: { totalFollowers: 550_000 },
      skills: { voice: 82, instruments: { piano: 60 } },
      fame: 95,
      notoriety: 96,
      mafia: { family: 'triad', rank: 'godfather', standing: 100 },
      lifeStats: { crimesCommitted: 30 },
    });

    expect(
      evaluateAmbitionRequirement(person, { type: 'business_employees', target: 10 }).met
    ).toBe(true);
    expect(
      evaluateAmbitionRequirement(person, { type: 'political_approval', target: 65 }).met
    ).toBe(true);
    expect(evaluateAmbitionRequirement(person, { type: 'creative_skill', target: 80 }).met).toBe(
      true
    );
    expect(
      evaluateAmbitionRequirement(person, { type: 'mafia_rank', targetRank: 'godfather' }).met
    ).toBe(true);
  });

  it('returns fully localized Arabic view models without changing the person', () => {
    const person = makePerson({ age: 30, karma: 70 });
    selectAmbition(person, 'public_service', { language: 'ar' });
    const before = JSON.stringify(person.lifeAmbition);

    const view = getAmbitionView(person, 'ar');

    expect(view.path.name).toBe('الخدمة العامة');
    expect(view.path.description).toContain('ثقة');
    expect(view.stages[0].name).toBe('روح المجتمع');
    expect(view.stages[0].progressText).toContain('%');
    expect(JSON.stringify(person.lifeAmbition)).toBe(before);
  });
});
