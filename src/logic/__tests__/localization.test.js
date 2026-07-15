import { describe, expect, it, vi } from 'vitest';
import {
  LIFE_EVENTS,
  CAREER_EVENTS,
  PANDEMIC_EVENTS,
  SEASONAL_EVENTS as CATALOG_SEASONAL_EVENTS,
} from '../Events';
import {
  POLITICAL_OFFICES,
  CAMPAIGN_ACTIONS,
  TERM_EVENTS,
  processPoliticalYear,
} from '../Politics';
import { HOLIDAYS, SEASONAL_EVENTS, processSeasonalEvent } from '../Seasons';
import { WORLD_EVENTS } from '../WorldEvents';
import { translateGameMessage, translateGameText } from '../i18n';

const EVENT_COLLECTIONS = [LIFE_EVENTS, CAREER_EVENTS, PANDEMIC_EVENTS, CATALOG_SEASONAL_EVENTS];

describe('generated event localization', () => {
  it('gives every event prompt, choice, and outcome a stable key and Arabic text', () => {
    for (const events of EVENT_COLLECTIONS) {
      for (const event of events) {
        expect(event.messageKey).toMatch(/^event\./);
        expect(translateGameMessage('ar', event.messageKey, {}, event.text)).not.toBe(event.text);

        for (const choice of event.choices || []) {
          expect(choice.messageKey).toMatch(/^event\./);
          expect(translateGameMessage('ar', choice.messageKey, {}, choice.text)).not.toBe(
            choice.text
          );

          if (choice.outcomeText) {
            expect(choice.outcomeMessageKey).toMatch(/^event\./);
            expect(
              translateGameMessage('ar', choice.outcomeMessageKey, {}, choice.outcomeText)
            ).not.toBe(choice.outcomeText);
          }
        }
      }
    }
  });

  it('localizes legacy political and world-event history strings', () => {
    expect(translateGameText('ar', '[Politics] You won re-election! Your term continues.')).toBe(
      '[السياسة] فزت بإعادة الانتخاب! تستمر ولايتك.'
    );
    expect(
      translateGameText(
        'ar',
        '[Politics] You lost re-election as President. Back to civilian life.'
      )
    ).toContain('رئيس الدولة');
    expect(
      translateGameText(
        'ar',
        '[World Event] Global Recession: Markets crash worldwide. Jobs are harder to find and salaries shrink.'
      )
    ).toContain('ركود عالمي');
  });

  it('localizes relationship stories and ambition history after a language switch', () => {
    const relationshipMessages = [
      'You broke your promise to make time for Sam.',
      'The unresolved conflict with Sam turned into resentment.',
      'Sam feels neglected and wants to talk about your relationship.',
      'You and Sam looked back on a favorite memory together.',
      'You spent time with your Partner, Sam. You kept your promise to make time for them.',
      'Sam asked, "What do you want?"',
      'You promised Sam that you would make time for them next year.',
      'You gave Sam a sincere apology and took responsibility.',
      'You and Sam agreed to manage a joint household budget.',
      "You listened to Sam's dream and promised to support it.",
      'You proposed to Sam with a $5,000 ring and they said YES!',
      'You married Sam! It was a beautiful ceremony ($10,000). You signed a prenup.',
      'You divorced Sam. Without a prenup, the settlement cost $25,000 across your cash and estate.',
    ];

    for (const message of relationshipMessages) {
      expect(translateGameText('ar', message)).not.toBe(message);
    }

    expect(
      translateGameMessage(
        'ar',
        'ambitions.event.selected',
        { path: 'Family Legacy', pathAr: 'إرث العائلة' },
        'You chose the Family Legacy ambition for this life.'
      )
    ).toBe('اخترت طموح «إرث العائلة» لهذه الحياة.');
    expect(
      translateGameMessage(
        'en',
        'ambitions.event.milestone',
        { stage: 'Trusted Circle', stageAr: 'دائرة الثقة' },
        'اكتملت مرحلة الطموح: دائرة الثقة.'
      )
    ).toBe('Ambition milestone completed: Trusted Circle.');
  });
});

describe('political localization metadata', () => {
  it('covers offices, campaign actions, and all term events', () => {
    for (const office of POLITICAL_OFFICES) {
      expect(translateGameMessage('ar', office.titleMessageKey, {}, office.title)).not.toBe(
        office.title
      );
    }
    for (const action of CAMPAIGN_ACTIONS) {
      expect(translateGameMessage('ar', action.titleMessageKey, {}, action.title)).not.toBe(
        action.title
      );
    }
    for (const event of TERM_EVENTS) {
      expect(event.id).toBeTruthy();
      expect(
        translateGameMessage('ar', event.messageKey, {}, `[Politics] ${event.text}`)
      ).not.toContain(event.text);
    }
  });

  it('records stable metadata for generated political history', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const person = {
      job: { isPolitical: true, title: 'President', yearsLeft: 2, termYears: 4, approval: 50 },
      fame: 0,
      karma: 0,
      stress: 0,
      logEvent: vi.fn(),
    };

    processPoliticalYear(person);

    expect(person.logEvent).toHaveBeenCalledWith(
      expect.any(String),
      'good',
      expect.objectContaining({ messageKey: 'politics.term.bipartisan_bill' })
    );
    vi.restoreAllMocks();
  });
});

describe('world and seasonal localization metadata', () => {
  it('covers every world event name, description, and announcement', () => {
    for (const event of WORLD_EVENTS) {
      expect(translateGameMessage('ar', event.nameMessageKey, {}, event.name)).not.toBe(event.name);
      expect(translateGameMessage('ar', event.descriptionMessageKey, {}, event.desc)).not.toBe(
        event.desc
      );
      expect(translateGameMessage('ar', event.messageKey, {}, event.desc)).toContain('[حدث عالمي]');
    }
  });

  it('covers all seasonal and holiday message keys', () => {
    for (const events of Object.values(SEASONAL_EVENTS)) {
      for (const event of events) {
        expect(translateGameMessage('ar', event.messageKey, {}, event.text)).not.toBe(event.text);
      }
    }
    for (const holiday of HOLIDAYS) {
      const fallback =
        typeof holiday.text === 'function' ? holiday.text({ age: 21 }) : holiday.text;
      expect(translateGameMessage('ar', holiday.messageKey, { age: 21 }, fallback)).not.toBe(
        fallback
      );
    }
  });

  it('records stable metadata when seasonal events are logged', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const person = {
      age: 4,
      logEvent: vi.fn(),
      updateStats: vi.fn(),
    };

    processSeasonalEvent(person);

    expect(person.logEvent).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      expect.objectContaining({ messageKey: 'season.spring.spring_bloom' })
    );
    expect(person.logEvent).toHaveBeenCalledWith(
      expect.any(String),
      'good',
      expect.objectContaining({ messageKey: 'holiday.birthday', messageParams: { age: 4 } })
    );
    vi.restoreAllMocks();
  });
});
