import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OccupationMenu } from '../../components/OccupationMenu';
import { EducationMenu } from '../../components/EducationMenu';
import { RelationshipDashboard } from '../../components/RelationshipDashboard';
import { CountryProfile } from '../../components/CountryProfile';
import { WorldOverview } from '../../components/WorldOverview';
import { WorldNewsFeed } from '../../components/WorldNewsFeed';
import { CareerModal } from '../../components/CareerModal';
import { getPhaseTwoAssetSummary } from '../PhaseTwoScreenRuntime';

const noop = () => {};
const t = (key, fallback) => fallback || key;
const render = component => renderToStaticMarkup(component);

const basePerson = {
  age: 26,
  money: 25000,
  loans: 0,
  personalDebt: 0,
  smarts: 80,
  looks: 70,
  health: 75,
  fame: 10,
  social: {},
  skills: { coding: 90, voice: 35, instruments: { guitar: 42 } },
  unlockedFeatures: [],
  degrees: [{ type: 'Computer Science' }],
  educationHistory: ['University'],
  currentSchool: null,
  relationships: [],
  assets: [],
  portfolio: [],
  market: {
    jobs: [
      {
        id: 'developer',
        title: 'Software Developer',
        salary: 85000,
        requirements: { smarts: 70, education: 'University' },
      },
      {
        id: 'surgeon',
        title: 'Surgeon',
        salary: 190000,
        requirements: { smarts: 90, education: 'Medical School' },
      },
    ],
  },
};

const worldPerson = {
  ...basePerson,
  country: 'morocco',
  worldNews: [
    {
      age: 26,
      year: 2026,
      category: 'geopolitics',
      type: 'good',
      text: 'Morocco signed a trade agreement.',
    },
    {
      age: 25,
      year: 2025,
      type: 'bad',
      relName: 'Nadia',
      text: 'Your friend, Nadia lost her job.',
    },
  ],
  geopoliticalState: {
    countries: {
      morocco: {
        id: 'morocco',
        name: 'Morocco',
        capital: 'Rabat',
        continent: 'Africa',
        govType: 'democracy',
        gdp: 150,
        population: 37.5,
        influence: 48,
        stability: 68,
        happiness: 61,
        education: 58,
        healthcare: 55,
        technology: 52,
        militaryPower: 45,
        corruption: 42,
        crime: 31,
        gdpGrowth: 3.4,
        unemployment: 9.2,
        inflation: 4.1,
        taxRate: 25,
        poverty: 18,
        debt: 54,
        leaderName: 'Amine Idrissi',
        leaderTitle: 'Prime Minister',
        leaderPersonality: 'Pragmatic',
        leaderApproval: 57,
        leaderYearsInPower: 3,
      },
    },
    wars: [],
  },
};

describe('phase two destination redesign', () => {
  it('renders a searchable career market with qualification states', () => {
    const html = render(
      <OccupationMenu
        person={basePerson}
        onApply={noop}
        onQuit={noop}
        onClose={noop}
        language="en"
        t={t}
      />
    );
    expect(html).toContain('Work and occupation');
    expect(html).toContain('Job market');
    expect(html).toContain('Software Developer');
    expect(html).toContain('Not qualified');
    expect(html).toContain('Military');
  });

  it('renders Arabic education metrics and program navigation', () => {
    const html = render(
      <EducationMenu
        person={{ ...basePerson, age: 20 }}
        onEnroll={noop}
        onStudy={noop}
        onDropOut={noop}
        onClose={noop}
        language="ar"
        t={t}
      />
    );
    expect(html).toContain('الدراسة والتعلم');
    expect(html).toContain('الجامعة');
    expect(html).toContain('الدراسات العليا');
    expect(html).toContain('السجل التعليمي');
  });

  it('renders relationship health, conflicts, promises, and Arabic tabs', () => {
    const person = {
      ...basePerson,
      relationships: [
        { id: '1', name: 'Sara', type: 'Partner', stat: 82, memories: [{ id: 'm1' }] },
        { id: '2', name: 'Youssef', type: 'Friend', stat: 43, activeConflict: true },
        { id: '3', name: 'Amina', type: 'Mother', stat: 91, promise: { status: 'active' } },
      ],
    };
    const html = render(
      <RelationshipDashboard
        person={person}
        onClose={noop}
        onOpenFullManager={noop}
        language="ar"
      />
    );
    expect(html).toContain('الأشخاص في حياتك');
    expect(html).toContain('العائلة');
    expect(html).toContain('الحب');
    expect(html).toContain('الخلافات');
    expect(html).toContain('Sara');
  });

  it('calculates net worth for the redesigned assets summary', () => {
    const summary = getPhaseTwoAssetSummary({
      money: 20000,
      loans: 3000,
      personalDebt: 2000,
      assets: [{ value: 100000, mortgage: { balance: 60000 } }, { price: 15000 }],
      portfolio: [{ currentValue: 12000 }, { value: 3000 }],
    });
    expect(summary.cash).toBe(20000);
    expect(summary.ownedValue).toBe(115000);
    expect(summary.portfolioValue).toBe(15000);
    expect(summary.debt).toBe(65000);
    expect(summary.netWorth).toBe(85000);
    expect(summary.ownedCount).toBe(2);
    expect(summary.positions).toBe(2);
  });

  it('renders country overview, economy, society, and security tabs', () => {
    const html = render(
      <CountryProfile person={worldPerson} countryId="morocco" onClose={noop} language="en" t={t} />
    );
    expect(html).toContain('Morocco');
    expect(html).toContain('Overview');
    expect(html).toContain('Economy');
    expect(html).toContain('Society');
    expect(html).toContain('Security');
    expect(html).toContain('Amine Idrissi');
  });

  it('renders the searchable world overview and country stability card', () => {
    const html = render(<WorldOverview person={worldPerson} onClose={noop} language="en" t={t} />);
    expect(html).toContain('World overview');
    expect(html).toContain('Search countries');
    expect(html).toContain('Morocco');
    expect(html).toContain('Stable');
  });

  it('renders Arabic news categories and localized story hierarchy', () => {
    const html = render(<WorldNewsFeed person={worldPerson} onClose={noop} language="ar" t={t} />);
    expect(html).toContain('الأخبار والتاريخ');
    expect(html).toContain('قصص العالم');
    expect(html).toContain('قصص الأشخاص');
    expect(html).toContain('أحدث القصص');
  });

  it('renders specialty music career metrics and instrument navigation', () => {
    const html = render(
      <CareerModal
        person={{ ...basePerson, musicalTalent: 73, band: null }}
        onAction={noop}
        onClose={noop}
        onBand={noop}
        language="en"
      />
    );
    expect(html).toContain('Music and talent');
    expect(html).toContain('Musical talent');
    expect(html).toContain('Voice skill');
    expect(html).toContain('Instruments');
    expect(html).toContain('Manage band');
  });
});
