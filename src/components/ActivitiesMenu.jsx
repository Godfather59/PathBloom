import React, { useMemo, useState } from 'react';
import { ACTIVITIES } from '../logic/Activities';
import { formatArabicMoney, formatArabicNumber } from '../logic/ArabicLocalization';
import { AppIcon } from './AppIcon';
import './Modal.css';

const FEATURE_CARDS = [
  {
    key: 'royalty',
    title: 'Royalty',
    emoji: '👑',
    category: 'status',
    when: person => Boolean(person.royalty),
    payload: { isRoyalty: true },
  },
  {
    key: 'social',
    title: 'Social Media',
    emoji: '📱',
    category: 'social',
    minAge: 13,
    payload: { isSocial: true },
  },
  {
    key: 'love',
    title: 'Love',
    emoji: '💘',
    category: 'social',
    minAge: 18,
    payload: { isLove: true },
  },
  {
    key: 'music',
    title: 'Instruments',
    emoji: '🎵',
    category: 'growth',
    minAge: 6,
    payload: { isMusic: true },
  },
  {
    key: 'doctor',
    title: 'Doctor',
    emoji: '🏥',
    category: 'wellness',
    payload: { isDoctor: true },
  },
  {
    key: 'politics',
    title: 'Politics',
    emoji: '🗳️',
    category: 'status',
    minAge: 18,
    payload: { isPolitics: true },
  },
  {
    key: 'crime',
    title: 'Crime',
    emoji: '🕵️',
    category: 'risk',
    minAge: 12,
    payload: { isCrimeHub: true },
  },
  {
    key: 'business',
    title: 'Business',
    emoji: '🏢',
    category: 'money',
    minAge: 18,
    payload: { isBusiness: true },
  },
  {
    key: 'immigration',
    title: 'Immigration',
    emoji: '🌍',
    category: 'world',
    minAge: 18,
    payload: { isImmigration: true },
  },
  {
    key: 'casino',
    title: 'Casino',
    emoji: '🎰',
    category: 'risk',
    minAge: 18,
    payload: { isGambling: true },
  },
  {
    key: 'hobbies',
    title: 'Hobbies',
    emoji: '🎨',
    category: 'growth',
    minAge: 6,
    payload: { isHobbies: true },
  },
  {
    key: 'fitness',
    title: 'Fitness',
    emoji: '💪',
    category: 'wellness',
    minAge: 13,
    payload: { isFitness: true },
  },
  {
    key: 'addiction',
    title: 'Substances',
    emoji: '⚠️',
    category: 'risk',
    minAge: 18,
    payload: { isAddiction: true },
  },
  {
    key: 'insurance',
    title: 'Insurance',
    emoji: '🛡️',
    category: 'money',
    minAge: 18,
    payload: { isInsurance: true },
  },
  {
    key: 'retirement',
    title: 'Retirement',
    emoji: '🏖️',
    category: 'money',
    minAge: 18,
    payload: { isRetirement: true },
  },
  {
    key: 'sports',
    title: 'College Sports',
    emoji: '🏀',
    category: 'wellness',
    minAge: 14,
    payload: { isSports: true },
  },
  {
    key: 'space',
    title: 'Space Program',
    emoji: '🚀',
    category: 'growth',
    minAge: 22,
    payload: { isSpace: true },
  },
  {
    key: 'philanthropy',
    title: 'Philanthropy',
    emoji: '🎁',
    category: 'social',
    minAge: 18,
    payload: { isPhilanthropy: true },
  },
  {
    key: 'clubs',
    title: 'Clubs & Societies',
    emoji: '🎓',
    category: 'social',
    minAge: 6,
    payload: { isClubs: true },
  },
  {
    key: 'lawsuits',
    title: 'Lawsuits',
    emoji: '⚖️',
    category: 'risk',
    minAge: 18,
    payload: { isLawsuits: true },
  },
  {
    key: 'memories',
    title: 'Memories',
    emoji: '📸',
    category: 'growth',
    minAge: 6,
    payload: { isMemories: true },
  },
];

const ACTIVITY_EMOJIS = {
  gym: '💪',
  meditate: '🧘',
  library: '📚',
  club: '🪩',
  plastic_surgery: '✨',
  find_date: '💌',
  commit_crime_burglary: '🏚️',
  commit_crime_robbery: '🏦',
  gamble_lottery: '🎟️',
  gamble_horse: '🏇',
  adopt_pet_dog: '🐶',
  adopt_pet_cat: '🐱',
  travel_budget: '🎒',
  travel_luxury: '🛳️',
  busk: '🎸',
  estate_planning: '📜',
  pickpocket_activity: '🖐️',
  court_case_activity: '⚖️',
};

const EFFECT_ICONS = {
  happiness: '☺',
  health: '♥',
  smarts: '◇',
  looks: '✦',
  stress: '!',
  karma: '⚖',
  fame: '★',
  notoriety: '◆',
};

const COPY = {
  en: {
    title: 'Activities',
    subtitle: 'Choose how to spend your time and shape this life.',
    search: 'Search activities',
    featured: 'Featured paths',
    quick: 'Quick actions',
    noResults: 'No activities match this search.',
    all: 'All',
    wellness: 'Wellness',
    social: 'Social',
    growth: 'Growth',
    money: 'Money',
    risk: 'Risk',
    world: 'World',
    status: 'Influence',
    locked: 'Unlocks at age',
    free: 'Free',
    energy: 'energy',
  },
  ar: {
    title: 'الأنشطة',
    subtitle: 'اختر كيف تقضي وقتك وتصنع مسار هذه الحياة.',
    search: 'ابحث في الأنشطة',
    featured: 'مسارات مميزة',
    quick: 'أنشطة سريعة',
    noResults: 'لا توجد أنشطة مطابقة للبحث.',
    all: 'الكل',
    wellness: 'الصحة',
    social: 'اجتماعي',
    growth: 'التطور',
    money: 'المال',
    risk: 'المخاطرة',
    world: 'العالم',
    status: 'النفوذ',
    locked: 'يفتح في عمر',
    free: 'مجاني',
    energy: 'طاقة',
  },
};

const CATEGORIES = ['all', 'wellness', 'social', 'growth', 'money', 'risk', 'world', 'status'];

const isBasicActivity = activity =>
  !activity.isDating &&
  !activity.isSocial &&
  !activity.isMusic &&
  !activity.isMafia &&
  !activity.isPolitics &&
  !activity.isGambling &&
  !activity.isDoctor &&
  !activity.isCrime;

function inferBasicCategory(activity) {
  const id = String(activity.id || '').toLowerCase();
  if (/gym|meditat|plastic|doctor/.test(id)) {
    return 'wellness';
  }
  if (/date|club|pet/.test(id)) {
    return 'social';
  }
  if (/crime|robbery|burglary|pickpocket|gamble|court/.test(id)) {
    return 'risk';
  }
  if (/travel/.test(id)) {
    return 'world';
  }
  if (/estate|lottery/.test(id)) {
    return 'money';
  }
  return 'growth';
}

function getEffectSummary(activity, language, t) {
  return Object.entries(activity.effects || {})
    .filter(([, value]) => Number(value) !== 0)
    .slice(0, 3)
    .map(([key, value]) => ({
      key,
      positive: key === 'stress' ? Number(value) < 0 : Number(value) > 0,
      text: `${EFFECT_ICONS[key] || '•'} ${t(`stat.${key}`, key)} ${Number(value) > 0 ? '+' : ''}${
        language === 'ar' ? formatArabicNumber(value, { maximumFractionDigits: 0 }) : value
      }`,
    }));
}

export function ActivitiesMenu({
  person,
  onDoActivity,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const normalizedQuery = query.trim().toLowerCase();

  const visibleCards = useMemo(
    () =>
      FEATURE_CARDS.filter(card => !card.when || card.when(person))
        .filter(card => category === 'all' || card.category === category)
        .filter(card => {
          const title = t(`activities.${card.key}`, card.title);
          return (
            !normalizedQuery || `${title} ${card.title}`.toLowerCase().includes(normalizedQuery)
          );
        }),
    [person, category, normalizedQuery, t]
  );

  const basicActivities = useMemo(
    () =>
      ACTIVITIES.filter(isBasicActivity)
        .map(activity => ({ ...activity, uiCategory: inferBasicCategory(activity) }))
        .filter(activity => category === 'all' || activity.uiCategory === category)
        .filter(activity => {
          const title = t(`activity.${activity.id}`, activity.title);
          return (
            !normalizedQuery || `${title} ${activity.title}`.toLowerCase().includes(normalizedQuery)
          );
        }),
    [category, normalizedQuery, t]
  );

  const hasResults = visibleCards.length > 0 || basicActivities.length > 0;

  return (
    <div className="modal-overlay destination-overlay">
      <section className="destination-screen activities-hub" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <header className="destination-header">
          <div className="destination-title-group">
            <span className="destination-icon">
              <AppIcon name="activities" size={23} />
            </span>
            <div>
              <h1>{copy.title}</h1>
              <p>{copy.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            className="destination-close"
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
          >
            <AppIcon name="close" size={21} />
          </button>
        </header>

        <div className="destination-toolbar">
          <label className="activity-search">
            <AppIcon name="activities" size={17} />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder={copy.search}
              aria-label={copy.search}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={t('common.close', 'Clear')}
              >
                <AppIcon name="close" size={15} />
              </button>
            )}
          </label>

          <div className="activity-category-tabs" role="tablist" aria-label={copy.title}>
            {CATEGORIES.map(id => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={category === id}
                className={category === id ? 'is-active' : ''}
                onClick={() => setCategory(id)}
              >
                {copy[id]}
              </button>
            ))}
          </div>
        </div>

        <div className="destination-scroll">
          {visibleCards.length > 0 && (
            <section className="activity-section">
              <div className="activity-section-heading">
                <span>{copy.featured}</span>
                <strong>{visibleCards.length}</strong>
              </div>
              <div className="feature-path-grid">
                {visibleCards.map(card => {
                  const locked = Number.isFinite(card.minAge) && person.age < card.minAge;
                  return (
                    <button
                      key={card.key}
                      type="button"
                      className={`feature-path-card category-${card.category}`}
                      onClick={() =>
                        onDoActivity({ ...card.payload, minAge: card.minAge, title: card.title })
                      }
                      disabled={locked}
                    >
                      <span className="feature-path-icon" aria-hidden="true">
                        {card.emoji}
                      </span>
                      <span className="feature-path-copy">
                        <strong>{t(`activities.${card.key}`, card.title)}</strong>
                        <small>
                          {locked
                            ? `${copy.locked} ${
                                locale === 'ar'
                                  ? formatArabicNumber(card.minAge, { maximumFractionDigits: 0 })
                                  : card.minAge
                              }`
                            : t(`activities.${card.key}Hint`, '')}
                        </small>
                      </span>
                      <AppIcon name="chevron" size={17} className="feature-path-arrow" />
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {basicActivities.length > 0 && (
            <section className="activity-section">
              <div className="activity-section-heading">
                <span>{copy.quick}</span>
                <strong>{basicActivities.length}</strong>
              </div>
              <div className="quick-activity-list">
                {basicActivities.map(activity => {
                  const locked = Number.isFinite(activity.minAge) && person.age < activity.minAge;
                  const effects = getEffectSummary(activity, locale, t);
                  const cost = Number(activity.cost) || 0;
                  return (
                    <button
                      key={activity.id}
                      type="button"
                      className={`quick-activity-row category-${activity.uiCategory}`}
                      onClick={() => onDoActivity(activity)}
                      disabled={locked}
                    >
                      <span className="quick-activity-icon" aria-hidden="true">
                        {ACTIVITY_EMOJIS[activity.id] || '✦'}
                      </span>
                      <span className="quick-activity-copy">
                        <strong>{t(`activity.${activity.id}`, activity.title)}</strong>
                        {effects.length > 0 && (
                          <span className="quick-effect-list">
                            {effects.map(effect => (
                              <span
                                key={effect.key}
                                className={effect.positive ? 'is-positive' : 'is-negative'}
                              >
                                {effect.text}
                              </span>
                            ))}
                          </span>
                        )}
                        {locked && (
                          <small>
                            {copy.locked}{' '}
                            {locale === 'ar'
                              ? formatArabicNumber(activity.minAge, { maximumFractionDigits: 0 })
                              : activity.minAge}
                          </small>
                        )}
                      </span>
                      <span className="quick-activity-meta">
                        <span className={cost > 0 ? 'is-paid' : 'is-free'}>
                          {cost > 0
                            ? locale === 'ar'
                              ? formatArabicMoney(cost)
                              : `$${cost.toLocaleString('en-US')}`
                            : copy.free}
                        </span>
                        <span>
                          ϟ{' '}
                          {locale === 'ar'
                            ? formatArabicNumber(Number(activity.energyCost) || 0, {
                                maximumFractionDigits: 0,
                              })
                            : Number(activity.energyCost) || 0}{' '}
                          {copy.energy}
                        </span>
                        {activity.risk && (
                          <span className={`risk-${activity.risk}`}>
                            {t(`risk.${activity.risk}`, activity.risk)}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {!hasResults && (
            <div className="destination-empty">
              <span>
                <AppIcon name="activities" size={28} />
              </span>
              <strong>{copy.noResults}</strong>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
