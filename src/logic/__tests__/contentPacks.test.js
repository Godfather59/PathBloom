// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { Person } from '../Person';
import {
  createContentPackTemplate,
  getAllContentPacks,
  saveCustomContentPack,
  validateContentPack,
} from '../ContentPackRegistry';
import { summarizeBuiltinContent } from '../ContentPackDiagnostics';
import {
  ensureContentState,
  eventConditionsMatch,
  resolveContentEventChoice,
} from '../ContentEventEngine';

beforeEach(() => {
  localStorage.clear();
});

describe('data-driven content packs', () => {
  it('validates every bundled pack and both languages', () => {
    const report = summarizeBuiltinContent();
    expect(report.valid).toBe(true);
    expect(report.packCount).toBeGreaterThanOrEqual(7);
    expect(report.eventCount).toBeGreaterThanOrEqual(25);
    expect(report.errorCount).toBe(0);
  });

  it('rejects missing Arabic text and broken follow-up references', () => {
    const pack = createContentPackTemplate();
    pack.events[0].text.ar = '';
    pack.events[0].choices[0].next = { eventId: 'missing_event', delayMonths: 4 };
    const result = validateContentPack(pack);
    const codes = result.errors.map(error => error.code);
    expect(result.valid).toBe(false);
    expect(codes).toContain('MISSING_TRANSLATION');
    expect(codes).toContain('BROKEN_FOLLOW_UP');
  });

  it('enforces country and life-state conditions', () => {
    const moroccoPack = getAllContentPacks().find(pack => pack.id === 'country-morocco');
    const event = moroccoPack.events.find(entry => entry.id === 'morocco_baccalaureate_pressure');
    const person = new Person('Amine', 'Test', 'Male', 'Morocco');
    person.age = 18;
    person.currentSchool = { name: 'High School', year: 3, years: 3, performance: 70 };
    expect(eventConditionsMatch(person, moroccoPack, event)).toBe(true);
    person.country = 'France';
    expect(eventConditionsMatch(person, moroccoPack, event)).toBe(false);
  });

  it('applies costs without creating negative cash and schedules follow-ups', () => {
    const schoolPack = getAllContentPacks().find(pack => pack.id === 'school-core');
    const sourceEvent = schoolPack.events.find(event => event.id === 'school_group_project');
    const leadChoice = sourceEvent.choices.find(choice => choice.id === 'lead');
    const person = new Person('Sara', 'Test', 'Female', 'Morocco');
    person.age = 14;
    person.money = 0;
    ensureContentState(person);

    const pending = {
      type: 'content_event',
      contentPackId: schoolPack.id,
      contentEventId: sourceEvent.id,
      text: sourceEvent.text.en,
      localizedText: sourceEvent.text,
    };
    person.pendingEvent = pending;
    expect(resolveContentEventChoice(person, pending, leadChoice)).toBe(true);
    expect(person.pendingEvent).toBeNull();
    expect(person.contentState.scheduled).toHaveLength(1);
    expect(person.contentState.scheduled[0].eventId).toBe('school_group_project_result');
    expect(person.contentState.flags.schoolProjectRole).toBe('leader');
    expect(person.history.some(entry => entry.localizedText?.ar)).toBe(true);
  });

  it('moves unaffordable event costs into personal debt', () => {
    const familyPack = getAllContentPacks().find(pack => pack.id === 'family-core');
    const sourceEvent = familyPack.events.find(event => event.id === 'family_parent_job_loss');
    const helpChoice = sourceEvent.choices.find(choice => choice.id === 'help');
    const person = new Person('Youssef', 'Test', 'Male', 'Morocco');
    person.age = 22;
    person.money = 100;
    person.personalDebt = 0;
    ensureContentState(person);
    const pending = {
      type: 'content_event',
      contentPackId: familyPack.id,
      contentEventId: sourceEvent.id,
      text: sourceEvent.text.en,
      localizedText: sourceEvent.text,
    };
    person.pendingEvent = pending;
    resolveContentEventChoice(person, pending, helpChoice);
    expect(person.money).toBe(0);
    expect(person.personalDebt).toBe(400);
  });

  it('saves and replaces valid custom packs', () => {
    const pack = createContentPackTemplate();
    const first = saveCustomContentPack(pack);
    expect(first.valid).toBe(true);
    pack.name.en = 'Updated Pack';
    const second = saveCustomContentPack(pack);
    expect(second.valid).toBe(true);
    const stored = getAllContentPacks().filter(entry => entry.id === pack.id);
    expect(stored).toHaveLength(1);
    expect(stored[0].name.en).toBe('Updated Pack');
  });
});
