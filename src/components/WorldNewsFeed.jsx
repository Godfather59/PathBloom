import React, { useMemo, useState } from 'react';
import { translateGameMessage, translateGameText } from '../logic/i18n';
import { cleanLocalizedText } from '../logic/localizationSanitizer';
import { translateDeepSimulationText } from '../logic/DeepLocalization';
import { formatArabicNumber, localizeArabicCandidate } from '../logic/ArabicLocalization';
import {
  PhaseTwoEmpty,
  PhaseTwoMetric,
  PhaseTwoScreen,
  PhaseTwoSection,
  PhaseTwoTabs,
} from './PhaseTwoScaffold';

const COPY = {
  en: {
    eyebrow: 'World',
    title: 'News and history',
    subtitle: 'Global events and important stories from the people around you.',
    all: 'All',
    world: 'World',
    personal: 'People',
    positive: 'Positive',
    critical: 'Critical',
    stories: 'Stories',
    worldStories: 'World stories',
    peopleStories: 'People stories',
    ages: 'Life stages',
    latest: 'Latest stories',
    latestHint: 'The newest events appear first and remain grouped by your age.',
    search: 'Search news…',
    noNews: 'No news yet',
    noNewsHint:
      'As the world turns and people around you live their lives, stories will appear here.',
    age: 'Age',
    year: 'Year',
    worldBadge: 'WORLD',
    close: 'Close world news',
  },
  ar: {
    eyebrow: 'العالم',
    title: 'الأخبار والتاريخ',
    subtitle: 'الأحداث العالمية والقصص المهمة من حياة الأشخاص حولك.',
    all: 'الكل',
    world: 'العالم',
    personal: 'الأشخاص',
    positive: 'إيجابية',
    critical: 'حرجة',
    stories: 'القصص',
    worldStories: 'قصص العالم',
    peopleStories: 'قصص الأشخاص',
    ages: 'مراحل الحياة',
    latest: 'أحدث القصص',
    latestHint: 'تظهر الأحداث الأحدث أولا وتبقى مجمعة حسب عمرك.',
    search: 'ابحث في الأخبار…',
    noNews: 'لا توجد أخبار بعد',
    noNewsHint: 'مع تغير العالم واستمرار حياة من حولك ستظهر القصص هنا.',
    age: 'العمر',
    year: 'السنة',
    worldBadge: 'العالم',
    close: 'أغلق أخبار العالم',
  },
};

function formatNumber(value, language) {
  return language === 'ar'
    ? formatArabicNumber(value, { maximumFractionDigits: 0 })
    : Number(value || 0).toLocaleString('en-US');
}

function localizeNews(item, language) {
  const fallback =
    typeof item?.text === 'string'
      ? item.text.replace(/^Your\s+\S+,\s+/, '')
      : String(item?.text || '');
  const packText =
    item?.localizedText && typeof item.localizedText === 'object'
      ? item.localizedText[language] || item.localizedText.en
      : null;
  if (packText) {
    return language === 'ar'
      ? localizeArabicCandidate(packText, item.localizedText.en || fallback, 'world-news')
      : String(packText);
  }
  const translated = item?.messageKey
    ? translateGameMessage(language, item.messageKey, item.messageParams || {}, fallback)
    : translateGameText(language, fallback);
  const cleaned = cleanLocalizedText(translated, fallback, language);
  const deep = translateDeepSimulationText(cleaned, language);
  return language === 'ar' ? localizeArabicCandidate(deep, fallback, 'world-news') : deep;
}

function storyIcon(item) {
  if (item?.category === 'geopolitics') {
    if (item.type === 'bad') {
      return '⚔️';
    }
    if (item.type === 'good') {
      return '🌍';
    }
    return '🏛️';
  }
  if (item?.type === 'bad') {
    return '⚠️';
  }
  if (item?.type === 'good') {
    return '✨';
  }
  return '📰';
}

export function WorldNewsFeed({
  person,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const news = Array.isArray(person?.worldNews) ? person.worldNews.filter(Boolean) : [];
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');

  const normalized = useMemo(
    () =>
      news
        .map((item, index) => ({
          ...item,
          _index: index,
          _age: Number.isFinite(Number(item?.age)) ? Number(item.age) : 0,
          _year: Number.isFinite(Number(item?.year)) ? Number(item.year) : null,
          _text: localizeNews(item, language),
          _world: item?.category === 'geopolitics',
        }))
        .sort(
          (a, b) =>
            b._age - a._age || Number(b._year || 0) - Number(a._year || 0) || b._index - a._index
        ),
    [news, language]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale === 'ar' ? 'ar' : 'en');
    return normalized.filter(item => {
      const tabMatch =
        activeTab === 'all' ||
        (activeTab === 'world' && item._world) ||
        (activeTab === 'personal' && !item._world) ||
        (activeTab === 'positive' && item.type === 'good') ||
        (activeTab === 'critical' && item.type === 'bad');
      const textMatch =
        !needle || `${item._text} ${item.relName || ''}`.toLocaleLowerCase().includes(needle);
      return tabMatch && textMatch;
    });
  }, [activeTab, locale, normalized, query]);

  const groups = useMemo(() => {
    const map = new Map();
    visible.forEach(item => {
      if (!map.has(item._age)) {
        map.set(item._age, []);
      }
      map.get(item._age).push(item);
    });
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [visible]);

  const worldCount = normalized.filter(item => item._world).length;
  const peopleCount = normalized.length - worldCount;
  const ageCount = new Set(normalized.map(item => item._age)).size;
  const tabs = [
    { id: 'all', label: copy.all, icon: '📰', count: normalized.length },
    { id: 'world', label: copy.world, icon: '🌍', count: worldCount },
    { id: 'personal', label: copy.personal, icon: '👥', count: peopleCount },
    { id: 'positive', label: copy.positive, icon: '✨' },
    { id: 'critical', label: copy.critical, icon: '⚠️' },
  ];

  return (
    <PhaseTwoScreen
      icon="news"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      onClose={onClose}
      closeLabel={copy.close}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="world-news-destination"
    >
      <div className="phase-two-metrics">
        <PhaseTwoMetric
          icon="📰"
          label={copy.stories}
          value={formatNumber(normalized.length, language)}
        />
        <PhaseTwoMetric
          icon="🌍"
          label={copy.worldStories}
          value={formatNumber(worldCount, language)}
          tone="world"
        />
        <PhaseTwoMetric
          icon="👥"
          label={copy.peopleStories}
          value={formatNumber(peopleCount, language)}
          tone="growth"
        />
        <PhaseTwoMetric
          icon="🎂"
          label={copy.ages}
          value={formatNumber(ageCount, language)}
          tone="gold"
        />
      </div>

      <PhaseTwoTabs
        tabs={tabs}
        activeId={activeTab}
        onChange={setActiveTab}
        ariaLabel={copy.title}
      />

      <PhaseTwoSection title={copy.latest} subtitle={copy.latestHint}>
        <input
          className="phase-two-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={copy.search}
          aria-label={copy.search}
        />

        {groups.length > 0 ? (
          <div className="world-news-groups">
            {groups.map(([age, items]) => (
              <section key={age} className="world-news-age-group">
                <header>
                  <span>
                    {copy.age} {formatNumber(age, language)}
                  </span>
                  {items[0]?._year != null && (
                    <small>
                      {copy.year} {formatNumber(items[0]._year, language)}
                    </small>
                  )}
                </header>
                <div className="world-news-story-list">
                  {items.map(item => (
                    <article
                      key={`${item._age}-${item._year}-${item._index}`}
                      className={`world-news-story type-${item.type || 'neutral'}`}
                    >
                      <span className="world-news-story-icon" aria-hidden="true">
                        {storyIcon(item)}
                      </span>
                      <div className="world-news-story-copy">
                        <div className="world-news-story-meta">
                          {item.relName && <strong dir="auto">{item.relName}</strong>}
                          {item._world && (
                            <span className="phase-two-pill world">{copy.worldBadge}</span>
                          )}
                        </div>
                        <p dir="auto">{item._text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <PhaseTwoEmpty icon="📰" title={copy.noNews} description={copy.noNewsHint} />
        )}
      </PhaseTwoSection>
    </PhaseTwoScreen>
  );
}
