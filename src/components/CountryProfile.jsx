import React, { useState } from 'react';
import { GOVERNMENT_TYPES } from '../logic/WorldSimulation';
import { translateGameText, getStoredLanguage } from '../logic/i18n';
import { formatArabicNumber, formatArabicPercent } from '../logic/ArabicLocalization';
import {
  PhaseTwoEmpty,
  PhaseTwoMetric,
  PhaseTwoProgress,
  PhaseTwoScreen,
  PhaseTwoSection,
  PhaseTwoTabs,
} from './PhaseTwoScaffold';

const COPY = {
  en: {
    eyebrow: 'Country profile',
    unavailable: 'Country data unavailable',
    unavailableHint: 'Age up to initialize the geopolitical world and generate country data.',
    overview: 'Overview',
    economy: 'Economy',
    society: 'Society',
    security: 'Security',
    capital: 'Capital',
    continent: 'Continent',
    government: 'Government',
    population: 'Population',
    gdp: 'GDP',
    influence: 'Influence',
    stability: 'Stability',
    happiness: 'Happiness',
    leader: 'National leader',
    approval: 'approval',
    yearsPower: 'years in power',
    nationalSnapshot: 'National snapshot',
    nationalSnapshotHint: 'The indicators most likely to affect daily life and opportunity.',
    economicConditions: 'Economic conditions',
    economicHint: 'Growth, prices, employment, public debt, and taxes.',
    socialConditions: 'Public services and society',
    socialHint: 'Education, healthcare, living standards, corruption, and crime.',
    securityConditions: 'Security and power',
    securityHint: 'Military strength, state stability, technology, and global influence.',
    growth: 'GDP growth',
    unemployment: 'Unemployment',
    inflation: 'Inflation',
    tax: 'Tax rate',
    poverty: 'Poverty',
    debt: 'Public debt',
    education: 'Education',
    healthcare: 'Healthcare',
    technology: 'Technology',
    military: 'Military power',
    corruption: 'Corruption',
    crime: 'Crime',
    close: 'Close country profile',
  },
  ar: {
    eyebrow: 'ملف البلد',
    unavailable: 'بيانات البلد غير متاحة',
    unavailableHint: 'تقدم في العمر لتهيئة العالم الجيوسياسي وتوليد بيانات الدول.',
    overview: 'نظرة عامة',
    economy: 'الاقتصاد',
    society: 'المجتمع',
    security: 'الأمن',
    capital: 'العاصمة',
    continent: 'القارة',
    government: 'نظام الحكم',
    population: 'السكان',
    gdp: 'الناتج المحلي',
    influence: 'النفوذ',
    stability: 'الاستقرار',
    happiness: 'السعادة',
    leader: 'قائد الدولة',
    approval: 'تأييد',
    yearsPower: 'سنوات في السلطة',
    nationalSnapshot: 'ملخص الدولة',
    nationalSnapshotHint: 'المؤشرات الأكثر تأثيرا في الحياة اليومية والفرص.',
    economicConditions: 'الوضع الاقتصادي',
    economicHint: 'النمو والأسعار والتوظيف والدين العام والضرائب.',
    socialConditions: 'الخدمات العامة والمجتمع',
    socialHint: 'التعليم والصحة ومستوى المعيشة والفساد والجريمة.',
    securityConditions: 'الأمن والقوة',
    securityHint: 'القوة العسكرية واستقرار الدولة والتقنية والنفوذ العالمي.',
    growth: 'نمو الناتج',
    unemployment: 'البطالة',
    inflation: 'التضخم',
    tax: 'معدل الضريبة',
    poverty: 'الفقر',
    debt: 'الدين العام',
    education: 'التعليم',
    healthcare: 'الرعاية الصحية',
    technology: 'التقنية',
    military: 'القوة العسكرية',
    corruption: 'الفساد',
    crime: 'الجريمة',
    close: 'أغلق ملف البلد',
  },
};

function formatNumber(value, language, options = {}) {
  const numeric = Number(value) || 0;
  return language === 'ar'
    ? formatArabicNumber(numeric, options)
    : numeric.toLocaleString('en-US', options);
}

function percent(value, language, digits = 0) {
  const numeric = Number(value) || 0;
  return language === 'ar'
    ? formatArabicPercent(numeric)
    : `${numeric.toFixed(digits)}%`;
}

export function CountryProfile({ countryId, onClose, person, language = getStoredLanguage(), t = (key, fallback) => fallback || key }) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const [activeTab, setActiveTab] = useState('overview');
  const state = person?.geopoliticalState;
  const country = state?.countries?.[countryId];

  if (!country) {
    return (
      <PhaseTwoScreen
        icon="world"
        eyebrow={copy.eyebrow}
        title={copy.unavailable}
        onClose={onClose}
        closeLabel={copy.close}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <PhaseTwoEmpty icon="🌍" title={copy.unavailable} description={copy.unavailableHint} />
      </PhaseTwoScreen>
    );
  }

  const gov = GOVERNMENT_TYPES[country.govType] || GOVERNMENT_TYPES.democracy;
  const governmentLabel = translateGameText(language, gov?.label || country.govType);
  const countryName = translateGameText(language, country.name);
  const tabs = [
    { id: 'overview', label: copy.overview, icon: '🌍' },
    { id: 'economy', label: copy.economy, icon: '📈' },
    { id: 'society', label: copy.society, icon: '🏥' },
    { id: 'security', label: copy.security, icon: '🛡️' },
  ];

  const leaderApproval = Number(country.leaderApproval) || 0;

  return (
    <PhaseTwoScreen
      icon="world"
      eyebrow={copy.eyebrow}
      title={countryName}
      subtitle={`${governmentLabel} · ${translateGameText(language, country.continent)}`}
      onClose={onClose}
      closeLabel={copy.close}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="country-profile-destination"
    >
      <div className="phase-two-metrics">
        <PhaseTwoMetric icon="🏙️" label={copy.capital} value={translateGameText(language, country.capital)} />
        <PhaseTwoMetric icon="👥" label={copy.population} value={`${formatNumber(country.population, language, { maximumFractionDigits: 1 })}M`} />
        <PhaseTwoMetric icon="💵" label={copy.gdp} value={`$${formatNumber(country.gdp, language, { maximumFractionDigits: 0 })}B`} tone="growth" />
        <PhaseTwoMetric icon="🌐" label={copy.influence} value={percent(country.influence, language)} tone="world" />
      </div>

      <PhaseTwoTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} ariaLabel={countryName} />

      {activeTab === 'overview' && (
        <>
          <PhaseTwoSection title={copy.leader}>
            <div className="phase-two-card phase-two-card-highlight country-leader-card">
              <span className="country-leader-avatar" aria-hidden="true">🏛️</span>
              <div className="country-leader-copy">
                <span className="phase-two-eyebrow">{translateGameText(language, country.leaderTitle)}</span>
                <h2 dir="auto">{country.leaderName}</h2>
                <p>
                  {translateGameText(language, country.leaderPersonality)} · {formatNumber(country.leaderYearsInPower, language)} {copy.yearsPower}
                </p>
              </div>
              <span className={`phase-two-pill ${leaderApproval >= 50 ? 'good' : 'danger'}`}>
                {percent(leaderApproval, language)} {copy.approval}
              </span>
            </div>
          </PhaseTwoSection>

          <PhaseTwoSection title={copy.nationalSnapshot} subtitle={copy.nationalSnapshotHint}>
            <div className="phase-two-card">
              <PhaseTwoProgress label={copy.stability} value={country.stability} tone={country.stability >= 60 ? 'growth' : country.stability >= 35 ? 'warning' : 'danger'} />
              <PhaseTwoProgress label={copy.happiness} value={country.happiness} tone={country.happiness >= 60 ? 'growth' : country.happiness >= 35 ? 'warning' : 'danger'} />
              <PhaseTwoProgress label={copy.influence} value={country.influence} tone="world" />
            </div>
          </PhaseTwoSection>

          <div className="phase-two-data-grid">
            <div className="phase-two-data-item"><span>{copy.capital}</span><strong>{translateGameText(language, country.capital)}</strong></div>
            <div className="phase-two-data-item"><span>{copy.continent}</span><strong>{translateGameText(language, country.continent)}</strong></div>
            <div className="phase-two-data-item"><span>{copy.government}</span><strong>{governmentLabel}</strong></div>
          </div>
        </>
      )}

      {activeTab === 'economy' && (
        <PhaseTwoSection title={copy.economicConditions} subtitle={copy.economicHint}>
          <div className="phase-two-metrics country-economy-metrics">
            <PhaseTwoMetric icon="📈" label={copy.growth} value={`${Number(country.gdpGrowth) >= 0 ? '+' : ''}${percent(country.gdpGrowth, language, 1)}`} tone={Number(country.gdpGrowth) >= 0 ? 'growth' : 'danger'} />
            <PhaseTwoMetric icon="💼" label={copy.unemployment} value={percent(country.unemployment, language, 1)} tone={Number(country.unemployment) > 10 ? 'danger' : 'neutral'} />
            <PhaseTwoMetric icon="🛒" label={copy.inflation} value={percent(country.inflation, language, 1)} tone={Number(country.inflation) > 10 ? 'danger' : 'neutral'} />
            <PhaseTwoMetric icon="🧾" label={copy.tax} value={percent(country.taxRate, language)} />
            <PhaseTwoMetric icon="🏚️" label={copy.poverty} value={percent(country.poverty, language, 1)} tone={Number(country.poverty) > 30 ? 'danger' : 'neutral'} />
            <PhaseTwoMetric icon="🏦" label={copy.debt} value={percent(country.debt, language)} tone={Number(country.debt) > 60 ? 'danger' : 'gold'} />
          </div>
        </PhaseTwoSection>
      )}

      {activeTab === 'society' && (
        <PhaseTwoSection title={copy.socialConditions} subtitle={copy.socialHint}>
          <div className="phase-two-card">
            <PhaseTwoProgress label={copy.happiness} value={country.happiness} />
            <PhaseTwoProgress label={copy.education} value={country.education} tone="world" />
            <PhaseTwoProgress label={copy.healthcare} value={country.healthcare} tone="growth" />
            <PhaseTwoProgress label={copy.corruption} value={country.corruption} inverse tone={Number(country.corruption) > 55 ? 'danger' : 'warning'} />
            <PhaseTwoProgress label={copy.crime} value={country.crime} inverse tone={Number(country.crime) > 55 ? 'danger' : 'warning'} />
          </div>
        </PhaseTwoSection>
      )}

      {activeTab === 'security' && (
        <PhaseTwoSection title={copy.securityConditions} subtitle={copy.securityHint}>
          <div className="phase-two-card">
            <PhaseTwoProgress label={copy.stability} value={country.stability} tone={country.stability >= 60 ? 'growth' : country.stability >= 35 ? 'warning' : 'danger'} />
            <PhaseTwoProgress label={copy.military} value={country.militaryPower} tone="danger" />
            <PhaseTwoProgress label={copy.technology} value={country.technology} tone="purple" />
            <PhaseTwoProgress label={copy.influence} value={country.influence} tone="world" />
          </div>
        </PhaseTwoSection>
      )}
    </PhaseTwoScreen>
  );
}
