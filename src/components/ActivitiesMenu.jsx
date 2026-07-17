import React, { useEffect, useMemo, useState } from 'react';
import { ACTIVITIES } from '../logic/Activities';
import { formatArabicMoney, formatArabicNumber } from '../logic/ArabicLocalization';
import { AppIcon } from './AppIcon';
import './Modal.css';

const FAVORITES_KEY = 'pathbloom_activity_favorites';
const RECENT_KEY = 'pathbloom_activity_recent';
const MAX_RECENT = 8;

const FEATURE_CARDS = [
  {
    key: 'royalty',
    title: 'Royalty',
    icon: 'fame',
    category: 'status',
    when: person => Boolean(person.royalty),
    payload: { isRoyalty: true },
  },
  {
    key: 'social',
    title: 'Social Media',
    icon: 'relationships',
    category: 'social',
    minAge: 13,
    payload: { isSocial: true },
  },
  {
    key: 'love',
    title: 'Love',
    icon: 'health',
    category: 'social',
    minAge: 18,
    payload: { isLove: true },
  },
  {
    key: 'music',
    title: 'Instruments',
    icon: 'activities',
    category: 'growth',
    minAge: 6,
    payload: { isMusic: true },
  },
  {
    key: 'doctor',
    title: 'Doctor',
    icon: 'health',
    category: 'wellness',
    payload: { isDoctor: true },
  },
  {
    key: 'politics',
    title: 'Politics',
    icon: 'trend',
    category: 'status',
    minAge: 18,
    payload: { isPolitics: true },
  },
  {
    key: 'crime',
    title: 'Crime',
    icon: 'warning',
    category: 'risk',
    minAge: 12,
    payload: { isCrimeHub: true },
  },
  {
    key: 'business',
    title: 'Business',
    icon: 'briefcase',
    category: 'money',
    minAge: 18,
    payload: { isBusiness: true },
  },
  {
    key: 'immigration',
    title: 'Immigration',
    icon: 'world',
    category: 'world',
    minAge: 18,
    payload: { isImmigration: true },
  },
  {
    key: 'casino',
    title: 'Casino',
    icon: 'assets',
    category: 'risk',
    minAge: 18,
    payload: { isGambling: true },
  },
  {
    key: 'hobbies',
    title: 'Hobbies',
    icon: 'activities',
    category: 'growth',
    minAge: 6,
    payload: { isHobbies: true },
  },
  {
    key: 'fitness',
    title: 'Fitness',
    icon: 'health',
    category: 'wellness',
    minAge: 13,
    payload: { isFitness: true },
  },
  {
    key: 'addiction',
    title: 'Substances',
    icon: 'warning',
    category: 'risk',
    minAge: 18,
    payload: { isAddiction: true },
  },
  {
    key: 'insurance',
    title: 'Insurance',
    icon: 'assets',
    category: 'money',
    minAge: 18,
    payload: { isInsurance: true },
  },
  {
    key: 'retirement',
    title: 'Retirement',
    icon: 'assets',
    category: 'money',
    minAge: 18,
    payload: { isRetirement: true },
  },
  {
    key: 'sports',
    title: 'College Sports',
    icon: 'health',
    category: 'wellness',
    minAge: 14,
    payload: { isSports: true },
  },
  {
    key: 'space',
    title: 'Space Program',
    icon: 'trend',
    category: 'growth',
    minAge: 22,
    payload: { isSpace: true },
  },
  {
    key: 'philanthropy',
    title: 'Philanthropy',
    icon: 'relationships',
    category: 'social',
    minAge: 18,
    payload: { isPhilanthropy: true },
  },
  {
    key: 'clubs',
    title: 'Clubs & Societies',
    icon: 'education',
    category: 'social',
    minAge: 6,
    payload: { isClubs: true },
  },
  {
    key: 'lawsuits',
    title: 'Lawsuits',
    icon: 'karma',
    category: 'risk',
    minAge: 18,
    payload: { isLawsuits: true },
  },
  {
    key: 'memories',
    title: 'Memories',
    icon: 'recent',
    category: 'growth',
    minAge: 6,
    payload: { isMemories: true },
  },
];

const ACTIVITY_ICONS = {
  gym: 'health',
  meditate: 'happiness',
  library: 'education',
  club: 'relationships',
  plastic_surgery: 'looks',
  find_date: 'relationships',
  commit_crime_burglary: 'warning',
  commit_crime_robbery: 'warning',
  gamble_lottery: 'assets',
  gamble_horse: 'assets',
  adopt_pet_dog: 'relationships',
  adopt_pet_cat: 'relationships',
  travel_budget: 'world',
  travel_luxury: 'world',
  busk: 'activities',
  estate_planning: 'assets',
  pickpocket_activity: 'warning',
  court_case_activity: 'karma',
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
    noResults: 'No activities match these filters.',
    all: 'All',
    favorites: 'Favorites',
    recent: 'Recent',
    wellness: 'Wellness',
    social: 'Social',
    growth: 'Growth',
    money: 'Money',
    risk: 'Risk',
    world: 'World',
    status: 'Influence',
    locked: 'Requires age',
    favorite: 'Add to favorites',
    unfavorite: 'Remove from favorites',
    free: 'Free',
    energy: 'energy',
  },
  ar: {
    title: 'الأنشطة',
    subtitle: 'اختر كيف تقضي وقتك وتصنع مسار هذه الحياة.',
    search: 'ابحث في الأنشطة',
    featured: 'مسارات مميزة',
    quick: 'أنشطة سريعة',
    noResults: 'لا توجد أنشطة مطابقة لهذه المرشحات.',
    all: 'الكل',
    favorites: 'المفضلة',
    recent: 'الأخيرة',
    wellness: 'الصحة',
    social: 'اجتماعي',
    growth: 'التطور',
    money: 'المال',
    risk: 'المخاطرة',
    world: 'العالم',
    status: 'النفوذ',
    locked: 'يتطلب عمر',
    favorite: 'أضف إلى المفضلة',
    unfavorite: 'أزل من المفضلة',
    free: 'مجاني',
    energy: 'طاقة',
  },
};

const CATEGORIES = ['all', 'wellness', 'social', 'growth', 'money', 'risk', 'world', 'status'];
const VIEWS = ['all', 'favorites', 'recent'];

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

function readStoredArray(key) {
  if (typeof localStorage === 'undefined') {
    return [];
  }
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value.filter(item => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function persistArray(key, value) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Activity preferences are optional and should never block gameplay.
  }
}

function activityKey(kind, id) {
  return `${kind}:${id}`;
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
  const [view, setView] = useState('all');
  const [favorites, setFavorites] = useState(() => readStoredArray(FAVORITES_KEY));
  const [recent, setRecent] = useState(() => readStoredArray(RECENT_KEY));
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const normalizedQuery = query.trim().toLowerCase();
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const recentPositions = useMemo(
    () => new Map(recent.map((key, index) => [key, index])),
    [recent]
  );

  useEffect(() => persistArray(FAVORITES_KEY, favorites), [favorites]);
  useEffect(() => persistArray(RECENT_KEY, recent), [recent]);

  const matchesView = key => {
    if (view === 'favorites') {
      return favoriteSet.has(key);
    }
    if (view === 'recent') {
      return recentPositions.has(key);
    }
    return true;
  };

  const sortRecent = (left, right) => {
    if (view !== 'recent') {
      return 0;
    }
    return (recentPositions.get(left.uiKey) ?? 999) - (recentPositions.get(right.uiKey) ?? 999);
  };

  const visibleCards = useMemo(
    () =>
      FEATURE_CARDS.filter(card => !card.when || card.when(person))
        .map(card => ({ ...card, uiKey: activityKey('feature', card.key) }))
        .filter(card => category === 'all' || card.category === category)
        .filter(card => matchesView(card.uiKey))
        .filter(card => {
          const title = t(`activities.${card.key}`, card.title);
          return !normalizedQuery || `${title} ${card.title}`.toLowerCase().includes(normalizedQuery);
        })
        .sort(sortRecent),
    [person, category, view, normalizedQuery, t, favoriteSet, recentPositions]
  );

  const basicActivities = useMemo(
    () =>
      ACTIVITIES.filter(isBasicActivity)
        .map(activity => ({
          ...activity,
          uiCategory: inferBasicCategory(activity),
          uiKey: activityKey('activity', activity.id),
        }))
        .filter(activity => category === 'all' || activity.uiCategory === category)
        .filter(activity => matchesView(activity.uiKey))
        .filter(activity => {
          const title = t(`activity.${activity.id}`, activity.title);
          return !normalizedQuery || `${title} ${activity.title}`.toLowerCase().includes(normalizedQuery);
        })
        .sort(sortRecent),
    [category, view, normalizedQuery, t, favoriteSet, recentPositions]
  );

  const hasResults = visibleCards.length > 0 || basicActivities.length > 0;

  const toggleFavorite = key => {
    setFavorites(current =>
      current.includes(key) ? current.filter(item => item !== key) : [key, ...current]
    );
  };

  const perform = (key, payload) => {
    setRecent(current => [key, ...current.filter(item => item !== key)].slice(0, MAX_RECENT));
    onDoActivity(payload);
  };

  const favoriteButton = key => {
    const active = favoriteSet.has(key);
    return (
      <button
        type="button"
        className={`activity-favorite ${active ? 'is-active' : ''}`}
        onClick={() => toggleFavorite(key)}
        aria-pressed={active}
        aria-label={active ? copy.unfavorite : copy.favorite}
        title={active ? copy.unfavorite : copy.favorite}
      >
        <AppIcon name="favorite" size={19} />
      </button>
    );
  };

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
            data-back-handler="close"
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
              <button type="button" onClick={() => setQuery('')} aria-label={t('common.close', 'Clear')}>
                <AppIcon name="close" size={15} />
              </button>
            )}
          </label>

          <div className="activity-view-tabs" role="tablist" aria-label={copy.title}>
            {VIEWS.map(id => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={view === id}
                className={view === id ? 'is-active' : ''}
                onClick={() => setView(id)}
              >
                <AppIcon name={id === 'favorites' ? 'favorite' : id === 'recent' ? 'recent' : 'activities'} size={16} />
                {copy[id]}
              </button>
            ))}
          </div>

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
                  const lockReason = locked
                    ? `${copy.locked} ${
                        locale === 'ar'
                          ? formatArabicNumber(card.minAge, { maximumFractionDigits: 0 })
                          : card.minAge
                      }`
                    : '';
                  return (
                    <div className="activity-row-shell" key={card.key}>
                      <button
                        type="button"
                        className={`feature-path-card category-${card.category}`}
                        onClick={() => perform(card.uiKey, { ...card.payload, minAge: card.minAge, title: card.title })}
                        disabled={locked}
                        aria-describedby={locked ? `${card.key}-lock` : undefined}
                      >
                        <span className="feature-path-icon" aria-hidden="true">
                          <AppIcon name={card.icon} size={23} />
                        </span>
                        <span className="feature-path-copy">
                          <strong>{t(`activities.${card.key}`, card.title)}</strong>
                          <small id={`${card.key}-lock`} className={locked ? 'activity-lock-reason' : ''}>
                            {lockReason || t(`activities.${card.key}Hint`, '')}
                          </small>
                        </span>
                        <AppIcon name="chevron" size={17} className="feature-path-arrow" />
                      </button>
                      {favoriteButton(card.uiKey)}
                    </div>
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
                    <div className="activity-row-shell" key={activity.id}>
                      <button
                        type="button"
                        className={`quick-activity-row category-${activity.uiCategory}`}
                        onClick={() => perform(activity.uiKey, activity)}
                        disabled={locked}
                      >
                        <span className="quick-activity-icon" aria-hidden="true">
                          <AppIcon name={ACTIVITY_ICONS[activity.id] || 'activities'} size={22} />
                        </span>
                        <span className="quick-activity-copy">
                          <strong>{t(`activity.${activity.id}`, activity.title)}</strong>
                          {effects.length > 0 && (
                            <span className="quick-effect-list">
                              {effects.map(effect => (
                                <span key={effect.key} className={effect.positive ? 'is-positive' : 'is-negative'}>
                                  {effect.text}
                                </span>
                              ))}
                            </span>
                          )}
                          {locked && (
                            <small className="activity-lock-reason">
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
                              ? formatArabicNumber(Number(activity.energyCost) || 0, { maximumFractionDigits: 0 })
                              : Number(activity.energyCost) || 0}{' '}
                            {copy.energy}
                          </span>
                          {activity.risk && (
                            <span className={`risk-${activity.risk}`}>{t(`risk.${activity.risk}`, activity.risk)}</span>
                          )}
                        </span>
                      </button>
                      {favoriteButton(activity.uiKey)}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {!hasResults && (
            <div className="destination-empty">
              <span>
                <AppIcon name={view === 'favorites' ? 'favorite' : view === 'recent' ? 'recent' : 'activities'} size={28} />
              </span>
              <strong>{copy.noResults}</strong>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
