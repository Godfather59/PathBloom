import React, { useMemo, useState } from 'react';
import { GOVERNMENT_TYPES, getGlobalStats } from '../logic/WorldSimulation';
import { getStoredLanguage, translateGameText } from '../logic/i18n';
import { formatArabicNumber } from '../logic/ArabicLocalization';
import { CountryProfile } from './CountryProfile';
import {
  PhaseTwoEmpty,
  PhaseTwoMetric,
  PhaseTwoProgress,
  PhaseTwoScreen,
  PhaseTwoSection,
} from './PhaseTwoScaffold';

const COPY = {
  en: {
    eyebrow: 'World',
    title: 'World overview',
    subtitle: 'Compare countries, stability, prosperity, and military power.',
    happiness: 'Avg happiness',
    stability: 'Avg stability',
    population: 'Population',
    wars: 'Active wars',
    countries: 'Countries',
    countriesHint: 'Search, filter by continent, and open a country for full details.',
    search: 'Search countries…',
    all: 'All',
    sort: 'Sort',
    name: 'Name',
    gdp: 'GDP',
    military: 'Military',
    sortHappiness: 'Happiness',
    sortStability: 'Stability',
    noCountries: 'No country data available',
    noCountriesHint: 'Age up to initialize the geopolitical simulation.',
    close: 'Close world overview',
    stable: 'Stable',
    watch: 'Watch',
    fragile: 'Fragile',
  },
  ar: {
    eyebrow: 'العالم',
    title: 'نظرة عامة على العالم',
    subtitle: 'قارن الدول والاستقرار والازدهار والقوة العسكرية.',
    happiness: 'متوسط السعادة',
    stability: 'متوسط الاستقرار',
    population: 'عدد السكان',
    wars: 'الحروب النشطة',
    countries: 'الدول',
    countriesHint: 'ابحث وصفِّ حسب القارة وافتح أي دولة للتفاصيل.',
    search: 'ابحث عن دولة…',
    all: 'الكل',
    sort: 'الترتيب',
    name: 'الاسم',
    gdp: 'الناتج المحلي',
    military: 'العسكرية',
    sortHappiness: 'السعادة',
    sortStability: 'الاستقرار',
    noCountries: 'لا توجد بيانات دول',
    noCountriesHint: 'تقدم في العمر لتهيئة المحاكاة الجيوسياسية.',
    close: 'أغلق نظرة العالم',
    stable: 'مستقرة',
    watch: 'تحت المراقبة',
    fragile: 'هشة',
  },
};

function formatNumber(value, language, options = {}) {
  const numeric = Number(value) || 0;
  return language === 'ar'
    ? formatArabicNumber(numeric, options)
    : numeric.toLocaleString('en-US', options);
}

export function WorldOverview({
  person,
  onClose,
  language = getStoredLanguage(),
  t = (key, fallback) => fallback || key,
}) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [sortKey, setSortKey] = useState('name');
  const [filterContinent, setFilterContinent] = useState('all');
  const [query, setQuery] = useState('');
  const state = person?.geopoliticalState;
  const countries = state ? Object.values(state.countries || {}) : [];
  const stats = state
    ? getGlobalStats(state)
    : { avgHappiness: 0, avgStability: 0, totalPopulation: 0, wars: 0, democracies: 0 };
  const continents = [
    ...new Set(countries.map(country => country.continent).filter(Boolean)),
  ].sort();

  const visibleCountries = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale === 'ar' ? 'ar' : 'en');
    return [...countries]
      .filter(country => filterContinent === 'all' || country.continent === filterContinent)
      .filter(country => {
        if (!needle) {
          return true;
        }
        const name = translateGameText(language, country.name).toLocaleLowerCase();
        return name.includes(needle);
      })
      .sort((a, b) => {
        if (sortKey === 'name') {
          return translateGameText(language, a.name).localeCompare(
            translateGameText(language, b.name)
          );
        }
        if (sortKey === 'gdp') {
          return Number(b.gdp) - Number(a.gdp);
        }
        if (sortKey === 'military') {
          return Number(b.militaryPower) - Number(a.militaryPower);
        }
        if (sortKey === 'happiness') {
          return Number(b.happiness) - Number(a.happiness);
        }
        if (sortKey === 'stability') {
          return Number(b.stability) - Number(a.stability);
        }
        return 0;
      });
  }, [countries, filterContinent, language, locale, query, sortKey]);

  if (selectedCountryId) {
    return (
      <CountryProfile
        countryId={selectedCountryId}
        person={person}
        onClose={() => setSelectedCountryId(null)}
        language={language}
        t={t}
      />
    );
  }

  const sortOptions = [
    ['name', copy.name],
    ['gdp', copy.gdp],
    ['military', copy.military],
    ['happiness', copy.sortHappiness],
    ['stability', copy.sortStability],
  ];

  return (
    <PhaseTwoScreen
      icon="world"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      onClose={onClose}
      closeLabel={copy.close}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="world-overview-destination"
    >
      <div className="phase-two-metrics">
        <PhaseTwoMetric
          icon="😊"
          label={copy.happiness}
          value={`${formatNumber(stats.avgHappiness, language)}%`}
          tone="growth"
        />
        <PhaseTwoMetric
          icon="🛡️"
          label={copy.stability}
          value={`${formatNumber(stats.avgStability, language)}%`}
          tone="world"
        />
        <PhaseTwoMetric
          icon="👥"
          label={copy.population}
          value={`${formatNumber(stats.totalPopulation, language, { maximumFractionDigits: 1 })}M`}
        />
        <PhaseTwoMetric
          icon="⚔️"
          label={copy.wars}
          value={formatNumber(stats.wars, language)}
          tone={Number(stats.wars) > 0 ? 'danger' : 'neutral'}
        />
      </div>

      <PhaseTwoSection title={copy.countries} subtitle={copy.countriesHint}>
        {countries.length === 0 ? (
          <PhaseTwoEmpty icon="🌍" title={copy.noCountries} description={copy.noCountriesHint} />
        ) : (
          <>
            <div className="world-overview-controls">
              <input
                className="phase-two-search"
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder={copy.search}
                aria-label={copy.search}
              />
              <label className="world-sort-control">
                <span>{copy.sort}</span>
                <select
                  className="phase-two-select"
                  value={sortKey}
                  onChange={event => setSortKey(event.target.value)}
                >
                  {sortOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="phase-two-filter-row" aria-label={copy.countries}>
              <button
                type="button"
                className={filterContinent === 'all' ? 'is-active' : ''}
                onClick={() => setFilterContinent('all')}
              >
                {copy.all}
              </button>
              {continents.map(continent => (
                <button
                  key={continent}
                  type="button"
                  className={filterContinent === continent ? 'is-active' : ''}
                  onClick={() => setFilterContinent(continent)}
                >
                  {translateGameText(language, continent)}
                </button>
              ))}
            </div>

            <div className="world-country-list">
              {visibleCountries.map(country => {
                const gov = GOVERNMENT_TYPES[country.govType] || GOVERNMENT_TYPES.democracy;
                const stability = Math.max(0, Math.min(100, Number(country.stability) || 0));
                const status =
                  stability >= 60 ? copy.stable : stability >= 35 ? copy.watch : copy.fragile;
                const tone = stability >= 60 ? 'good' : stability >= 35 ? 'warning' : 'danger';
                return (
                  <button
                    key={country.id}
                    type="button"
                    className="phase-two-card world-country-card"
                    onClick={() => setSelectedCountryId(country.id)}
                  >
                    <div className="world-country-heading">
                      <div>
                        <span className="phase-two-eyebrow">
                          {translateGameText(language, country.continent)}
                        </span>
                        <h2>{translateGameText(language, country.name)}</h2>
                        <p>{translateGameText(language, gov?.label || country.govType)}</p>
                      </div>
                      <span className={`phase-two-pill ${tone}`}>{status}</span>
                    </div>
                    <div className="world-country-stats">
                      <span>
                        💵 ${formatNumber(country.gdp, language, { maximumFractionDigits: 0 })}B
                      </span>
                      <span>🪖 {formatNumber(country.militaryPower, language)}</span>
                      <span>
                        {Number(country.happiness) >= 60
                          ? '😊'
                          : Number(country.happiness) >= 35
                            ? '😐'
                            : '😞'}{' '}
                        {formatNumber(country.happiness, language)}%
                      </span>
                    </div>
                    <PhaseTwoProgress
                      label={copy.stability}
                      value={stability}
                      tone={stability >= 60 ? 'growth' : stability >= 35 ? 'warning' : 'danger'}
                    />
                  </button>
                );
              })}
            </div>

            {visibleCountries.length === 0 && (
              <PhaseTwoEmpty icon="🔎" title={copy.noCountries} description={copy.countriesHint} />
            )}
          </>
        )}
      </PhaseTwoSection>
    </PhaseTwoScreen>
  );
}
