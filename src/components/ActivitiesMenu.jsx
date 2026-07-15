import React from 'react';
import { ACTIVITIES } from '../logic/Activities';
import './Modal.css';

const FEATURE_CARDS = [
  {
    key: 'royalty',
    title: 'Royalty',
    emoji: '👑',
    color: 'gold',
    when: person => Boolean(person.royalty),
    payload: { isRoyalty: true },
  },
  {
    key: 'social',
    title: 'Social Media',
    emoji: '📱',
    color: '#03a9f4',
    minAge: 13,
    payload: { isSocial: true },
  },
  {
    key: 'love',
    title: 'Love',
    emoji: '💘',
    color: '#e91e63',
    minAge: 18,
    payload: { isLove: true },
  },
  {
    key: 'music',
    title: 'Instruments',
    emoji: '🎵',
    color: '#9c27b0',
    minAge: 6,
    payload: { isMusic: true },
  },
  { key: 'doctor', title: 'Doctor', emoji: '🏥', color: '#00e676', payload: { isDoctor: true } },
  {
    key: 'politics',
    title: 'Politics',
    emoji: '🗳️',
    color: '#1e88e5',
    minAge: 18,
    payload: { isPolitics: true },
  },
  {
    key: 'crime',
    title: 'Crime',
    emoji: '🕵️',
    color: '#777',
    minAge: 12,
    payload: { isCrimeHub: true },
  },
  {
    key: 'business',
    title: 'Business',
    emoji: '🏢',
    color: '#43a047',
    minAge: 18,
    payload: { isBusiness: true },
  },
  {
    key: 'immigration',
    title: 'Immigration',
    emoji: '🌍',
    color: '#26c6da',
    minAge: 18,
    payload: { isImmigration: true },
  },
  {
    key: 'casino',
    title: 'Casino',
    emoji: '🎰',
    color: '#ffb300',
    minAge: 18,
    payload: { isGambling: true },
  },
  {
    key: 'hobbies',
    title: 'Hobbies',
    emoji: '🎨',
    color: '#8d6e63',
    minAge: 6,
    payload: { isHobbies: true },
  },
  {
    key: 'fitness',
    title: 'Fitness',
    emoji: '💪',
    color: '#4caf50',
    minAge: 13,
    payload: { isFitness: true },
  },
  {
    key: 'addiction',
    title: 'Substances',
    emoji: '⚠️',
    color: '#ff1744',
    minAge: 18,
    payload: { isAddiction: true },
  },
  {
    key: 'insurance',
    title: 'Insurance',
    emoji: '🛡️',
    color: '#7c4dff',
    minAge: 18,
    payload: { isInsurance: true },
  },
  {
    key: 'retirement',
    title: 'Retirement',
    emoji: '🏖️',
    color: '#ffab00',
    minAge: 18,
    payload: { isRetirement: true },
  },
  {
    key: 'sports',
    title: 'College Sports',
    emoji: '🏀',
    color: '#1a237e',
    minAge: 14,
    payload: { isSports: true },
  },
  {
    key: 'space',
    title: 'Space Program',
    emoji: '🚀',
    color: '#0d47a1',
    minAge: 22,
    payload: { isSpace: true },
  },
  {
    key: 'philanthropy',
    title: 'Philanthropy',
    emoji: '🎁',
    color: '#2e7d32',
    minAge: 18,
    payload: { isPhilanthropy: true },
  },
  {
    key: 'clubs',
    title: 'Clubs & Societies',
    emoji: '🎓',
    color: '#6a1b9a',
    minAge: 6,
    payload: { isClubs: true },
  },
  {
    key: 'lawsuits',
    title: 'Lawsuits',
    emoji: '⚖️',
    color: '#bf360c',
    minAge: 18,
    payload: { isLawsuits: true },
  },
  {
    key: 'memories',
    title: 'Memories',
    emoji: '📸',
    color: '#f06292',
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

const isBasicActivity = activity => {
  return (
    !activity.isDating &&
    !activity.isSocial &&
    !activity.isMusic &&
    !activity.isMafia &&
    !activity.isPolitics &&
    !activity.isGambling &&
    !activity.isDoctor &&
    !activity.isCrime
  );
};

const EFFECT_ICONS = {
  happiness: '😊',
  health: '❤️',
  smarts: '🧠',
  looks: '✨',
  stress: '😵',
  karma: '⚖️',
  fame: '🌟',
  notoriety: '🕶️',
};

const getEffectSummary = (activity, t) =>
  Object.entries(activity.effects || {})
    .filter(([, value]) => Number(value) !== 0)
    .slice(0, 4)
    .map(
      ([key, value]) =>
        `${EFFECT_ICONS[key] || '•'} ${t(`stat.${key}`, key)} ${Number(value) > 0 ? '+' : ''}${value}`
    )
    .join(' · ');

export function ActivitiesMenu({
  person,
  onDoActivity,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const visibleCards = FEATURE_CARDS.filter(card => !card.when || card.when(person));
  const isRtl = language === 'ar';

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <h2 className="modal-title">🎯 {t('activities.title', 'Activities')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="activity-grid">
            {visibleCards.map(card => {
              const locked = Number.isFinite(card.minAge) && person.age < card.minAge;
              return (
                <button
                  key={card.key}
                  className="list-item activity-card"
                  onClick={() =>
                    onDoActivity({ ...card.payload, minAge: card.minAge, title: card.title })
                  }
                  disabled={locked}
                  style={{
                    ...(isRtl ? { borderRightColor: card.color } : { borderLeftColor: card.color }),
                    opacity: locked ? 0.5 : 1,
                  }}
                >
                  <span className="activity-token" aria-hidden="true">
                    {card.emoji}
                  </span>
                  <span className="list-item-title">{t(`activities.${card.key}`, card.title)}</span>
                  <span className="activity-hint">
                    {locked
                      ? `${t('activities.unlocksAt', 'Unlocks at')} ${card.minAge}`
                      : t(`activities.${card.key}Hint`, '')}
                  </span>
                </button>
              );
            })}
          </div>

          <h3 className="section-heading">✨ {t('activities.more', 'More Activities')}</h3>

          <div className="stack-list">
            {ACTIVITIES.filter(isBasicActivity).map(act => (
              <button
                key={act.id}
                className="list-item activity-row"
                onClick={() => onDoActivity(act)}
                disabled={Number.isFinite(act.minAge) && person.age < act.minAge}
                style={{
                  opacity: Number.isFinite(act.minAge) && person.age < act.minAge ? 0.5 : 1,
                }}
              >
                <span className="activity-row-copy">
                  <span className="activity-row-main">
                    <span className="activity-row-emoji" aria-hidden="true">
                      {ACTIVITY_EMOJIS[act.id] || '✨'}
                    </span>
                    <span className="list-item-title" style={{ margin: 0 }}>
                      {t(`activity.${act.id}`, act.title)}
                    </span>
                  </span>
                  {getEffectSummary(act, t) && (
                    <small className="activity-effect-summary">{getEffectSummary(act, t)}</small>
                  )}
                </span>
                <span className="activity-meta-stack">
                  <span className={`cost-pill ${act.cost > 0 ? 'paid' : 'free'}`}>
                    {act.cost > 0
                      ? `$${Number(act.cost).toLocaleString()}`
                      : t('common.free', 'Free')}
                  </span>
                  <span className="activity-meta-pill energy">
                    ⚡ {Number(act.energyCost) || 0}
                  </span>
                  {Number.isFinite(act.minAge) && (
                    <span className="activity-meta-pill age">🎂 {act.minAge}+</span>
                  )}
                  {act.risk && (
                    <span className={`activity-meta-pill risk-${act.risk}`}>
                      ⚠️ {t(`risk.${act.risk}`, act.risk)}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
