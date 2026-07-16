// @vitest-environment jsdom

import React from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  checksumText,
  deleteSaveTransaction,
  inspectSaveSlot,
  parseStoredSave,
  readSaveWithRecovery,
  writeSaveTransaction,
} from '../SaveReliability';
import {
  ensurePlayerJourney,
  getJourneyView,
  recordJourneyAction,
  setGuidedJourney,
  updatePlayerJourney,
} from '../PlayerJourney';
import { JourneyCard } from '../../components/JourneyCard';
import { MilestoneCelebration } from '../../components/MilestoneCelebration';
import { OnboardingOverlay } from '../../components/OnboardingOverlay';

const render = component => renderToStaticMarkup(component);

function createPerson(overrides = {}) {
  return {
    age: 0,
    money: 0,
    happiness: 70,
    health: 75,
    smarts: 60,
    karma: 50,
    personalDebt: 0,
    relationships: [],
    assets: [],
    portfolio: [],
    lifeStats: { totalMoneyEarned: 0 },
    ...overrides,
  };
}

describe('save reliability', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates stable checksums and accepts legacy saves', () => {
    expect(checksumText('{"age":4}')).toBe(checksumText('{"age":4}'));
    expect(checksumText('{"age":4}')).not.toBe(checksumText('{"age":5}'));

    const legacy = parseStoredSave(JSON.stringify({ age: 4, name: 'Legacy' }));
    expect(legacy.ok).toBe(true);
    expect(legacy.protected).toBe(false);
    expect(legacy.payload.age).toBe(4);
  });

  it('writes protected primary saves and keeps the previous valid backup', () => {
    const first = writeSaveTransaction('slot_test', { age: 7, name: 'First' });
    const second = writeSaveTransaction('slot_test', { age: 8, name: 'Second' });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(second.backupCreated).toBe(true);

    const primary = parseStoredSave(localStorage.getItem('bitlife_save_slot_test'));
    const backup = parseStoredSave(localStorage.getItem('bitlife_save_slot_test_backup'));
    expect(primary.ok).toBe(true);
    expect(primary.protected).toBe(true);
    expect(primary.payload.age).toBe(8);
    expect(backup.ok).toBe(true);
    expect(backup.payload.age).toBe(7);
  });

  it('recovers a damaged primary save from the verified backup', () => {
    writeSaveTransaction('slot_recovery', { age: 10, name: 'Backup life' });
    writeSaveTransaction('slot_recovery', { age: 11, name: 'Latest life' });
    localStorage.setItem('bitlife_save_slot_recovery', '{broken-json');

    const healthBefore = inspectSaveSlot('slot_recovery');
    expect(healthBefore.loadable).toBe(true);
    expect(healthBefore.recoveryAvailable).toBe(true);

    const recovered = readSaveWithRecovery('slot_recovery');
    expect(recovered.ok).toBe(true);
    expect(recovered.recovered).toBe(true);
    expect(recovered.source).toBe('backup');
    expect(recovered.payload.age).toBe(10);

    const repairedPrimary = parseStoredSave(localStorage.getItem('bitlife_save_slot_recovery'));
    expect(repairedPrimary.ok).toBe(true);
    expect(repairedPrimary.payload.age).toBe(10);
  });

  it('deletes primary, temporary, backup, and health data together', () => {
    writeSaveTransaction('slot_delete', { age: 3 });
    localStorage.setItem('bitlife_save_slot_delete_tmp', JSON.stringify({ age: 2 }));
    expect(deleteSaveTransaction('slot_delete')).toBe(true);
    expect(localStorage.getItem('bitlife_save_slot_delete')).toBeNull();
    expect(localStorage.getItem('bitlife_save_slot_delete_backup')).toBeNull();
    expect(localStorage.getItem('bitlife_save_slot_delete_tmp')).toBeNull();
  });
});

describe('guided starter journey', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('rewards completed goals once and advances sequentially', () => {
    const person = createPerson();
    ensurePlayerJourney(person, { newLife: true });
    person.age = 1;

    const firstNotifications = updatePlayerJourney(person, 'en');
    expect(firstNotifications.some(item => item.id === 'first_step')).toBe(true);
    expect(person.happiness).toBe(72);

    const duplicateCheck = updatePlayerJourney(person, 'en');
    expect(duplicateCheck.some(item => item.id === 'first_step')).toBe(false);
    expect(person.happiness).toBe(72);

    recordJourneyAction(person, 'open_activities');
    const secondNotifications = updatePlayerJourney(person, 'en');
    expect(secondNotifications.some(item => item.id === 'explore_activities')).toBe(true);
    expect(person.smarts).toBe(62);
  });

  it('keeps the journey optional and produces natural Arabic guidance', () => {
    const person = createPerson();
    ensurePlayerJourney(person);
    expect(person.playerJourney.guidedEnabled).toBe(false);

    setGuidedJourney(person, true);
    const view = getJourneyView(person, 'ar');
    expect(view.title).toBe('اتخذ خطوتك الأولى');
    expect(view.cta).toBe('تقدم سنة');
  });

  it('renders the active journey card only when guidance is enabled', () => {
    const enabled = createPerson();
    ensurePlayerJourney(enabled, { newLife: true });
    const enabledHtml = render(<JourneyCard person={enabled} language="en" />);
    expect(enabledHtml).toContain('Starter journey');
    expect(enabledHtml).toContain('Take your first step');
    expect(enabledHtml).toContain('Reward');

    const disabled = createPerson();
    ensurePlayerJourney(disabled);
    const disabledHtml = render(<JourneyCard person={disabled} language="en" />);
    expect(disabledHtml).toBe('');
  });
});

describe('release onboarding and celebrations', () => {
  it('renders the redesigned bilingual introduction', () => {
    const english = render(<OnboardingOverlay language="en" onClose={() => {}} />);
    const arabic = render(<OnboardingOverlay language="ar" onClose={() => {}} />);

    expect(english).toContain('Every life becomes a story');
    expect(english).toContain('Start guided journey');
    expect(english).toContain('Your timeline remembers important moments');
    expect(arabic).toContain('كل حياة تتحول إلى قصة');
    expect(arabic).toContain('ابدأ الرحلة الموجهة');
  });

  it('renders clear goal and unlock milestone feedback', () => {
    const goal = render(
      <MilestoneCelebration
        language="en"
        onClose={() => {}}
        notification={{
          type: 'goal',
          icon: '🌱',
          title: 'Journey goal complete',
          body: 'Take your first step',
          reward: '+2 happiness',
        }}
      />
    );
    const unlock = render(
      <MilestoneCelebration
        language="ar"
        onClose={() => {}}
        notification={{
          type: 'unlock',
          icon: '🎓',
          title: 'أصبح التعليم متاحا',
          body: 'يؤثر أداؤك الدراسي في المهن.',
        }}
      />
    );

    expect(goal).toContain('New milestone');
    expect(goal).toContain('+2 happiness');
    expect(unlock).toContain('ميزة جديدة');
  });
});
