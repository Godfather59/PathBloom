import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BottomNavigation } from '../../components/BottomNavigation';
import { DecisionModal } from '../../components/DecisionModal';
import { ActivitiesMenu } from '../../components/ActivitiesMenu';
import { SystemMenu } from '../../components/SystemMenu';
import SituationDetailsSheet from '../../components/SituationDetailsSheet';

const t = (key, fallback) => fallback || key;
const noop = () => {};

function render(component) {
  return renderToStaticMarkup(component);
}

describe('redesigned gameplay shell', () => {
  it('renders the four English destinations and clearly separated time actions', () => {
    const html = render(
      <BottomNavigation
        activeDestination="life"
        onNavigate={noop}
        onPrimaryAction={noop}
        onSmartAdvance={noop}
        primaryLabel="Age Up"
        primaryHint="Advance one year"
        smartLabel="Smart +5"
        language="en"
      />
    );

    expect(html).toContain('Life');
    expect(html).toContain('Activities');
    expect(html).toContain('World');
    expect(html).toContain('Menu');
    expect(html).toContain('+1 Year');
    expect(html).toContain('One step');
    expect(html).toContain('Auto: 5 Years');
    expect(html).toContain('Stops for decisions');
    expect(html).not.toContain('Smart +5');
    expect(html).toContain('aria-current="page"');
  });

  it('renders Arabic navigation and a monthly situation control', () => {
    const html = render(
      <BottomNavigation
        activeDestination="life"
        onNavigate={noop}
        onPrimaryAction={noop}
        onSmartAdvance={noop}
        primaryLabel="تابع الحملة شهرا"
        primaryHint="تقدم شهرا واحدا"
        smartLabel="ذكي +12"
        isMonthly
        language="ar"
      />
    );

    expect(html).toContain('الحياة');
    expect(html).toContain('الأنشطة');
    expect(html).toContain('العالم');
    expect(html).toContain('القائمة');
    expect(html).toContain('تابع الحملة شهرا');
    expect(html).toContain('شهر واحد');
    expect(html).toContain('تلقائي: حتى 12 شهرا');
    expect(html).toContain('يتوقف عند ظهور قرار');
    expect(html).toContain('is-monthly');
  });

  it('shows decision risk and visible consequence previews', () => {
    const event = {
      type: 'campaign',
      text: 'Your opponent attacks your record during a live debate.',
      localizedText: {
        en: 'Your opponent attacks your record during a live debate.',
        ar: 'هاجم خصمك سجلك خلال مناظرة مباشرة.',
      },
      choices: [
        {
          id: 'answer',
          text: 'Answer calmly',
          localizedText: { en: 'Answer calmly', ar: 'أجب بهدوء' },
          type: 'good',
          effects: { happiness: 3, stress: -2, money: -500 },
        },
        {
          id: 'attack',
          text: 'Attack the opponent',
          localizedText: { en: 'Attack the opponent', ar: 'هاجم الخصم' },
          type: 'bad',
          effects: { stress: 8, karma: -5 },
        },
      ],
    };

    const html = render(<DecisionModal event={event} onChoice={noop} language="en" t={t} />);
    expect(html).toContain('Decision');
    expect(html).toContain('Low risk');
    expect(html).toContain('High risk');
    expect(html).toContain('happiness');
    expect(html).toContain('money');
  });

  it('renders the searchable categorized activities destination in both languages', () => {
    const person = { age: 25, royalty: null };
    const english = render(
      <ActivitiesMenu person={person} onDoActivity={noop} onClose={noop} language="en" t={t} />
    );
    const arabic = render(
      <ActivitiesMenu person={person} onDoActivity={noop} onClose={noop} language="ar" t={t} />
    );

    expect(english).toContain('Search activities');
    expect(english).toContain('Featured paths');
    expect(english).toContain('Quick actions');
    expect(english).toContain('Wellness');
    expect(arabic).toContain('ابحث في الأنشطة');
    expect(arabic).toContain('مسارات مميزة');
    expect(arabic).toContain('الصحة');
  });

  it('renders the grouped system destination without conditional hook failures', () => {
    const html = render(
      <SystemMenu
        language="en"
        t={t}
        onResume={noop}
        onSave={noop}
        onExit={noop}
        onGodMode={noop}
        onStats={noop}
        onHistory={noop}
        onFamilyTree={noop}
        onWorldNews={noop}
        onWorldOverview={noop}
        onAchievements={noop}
        onChallenge={noop}
        onTutorial={noop}
        onResetTutorial={noop}
        onRelationshipDashboard={noop}
        onEventHistory={noop}
        onLifeTimeline={noop}
        onCountryProfile={noop}
      />
    );

    expect(html).toContain('Resume life');
    expect(html).toContain('Save now');
    expect(html).toContain('Home');
    expect(html).toContain('Settings');
    expect(html).toContain('Tools');
  });

  it('renders focused active-situation details with localized values', () => {
    const html = render(
      <SituationDetailsSheet
        situation={{ id: 'campaign', icon: '🗳️' }}
        summary={{ type: 'campaign', months: 3, polling: 54, funds: 12000, scandals: 1 }}
        person={{}}
        language="en"
        onClose={noop}
      />
    );

    expect(html).toContain('Election campaign');
    expect(html).toContain('Polling');
    expect(html).toContain('54%');
    expect(html).toContain('Campaign funds');
  });
});
