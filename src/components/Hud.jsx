import React, { memo, useState } from 'react';
import { MiniAvatar } from './MiniAvatar';
import { translateCountryName, translateGameText } from '../logic/i18n';
import {
  formatArabicDuration,
  formatArabicMoney,
  formatArabicNumber,
} from '../logic/ArabicLocalization';
import { ensureTimeProgress, setCurrentTimePerson } from '../logic/TimeProgression';
import { AppIcon } from './AppIcon';
import './Hud.css';

const STAT_DEFINITIONS = [
  { id: 'health', icon: '♥', key: 'stat.health', en: 'Health' },
  { id: 'happiness', icon: '☺', key: 'stat.happiness', en: 'Happiness' },
  { id: 'stress', icon: '!', key: 'stat.stress', en: 'Stress' },
  { id: 'smarts', icon: '◇', key: 'stat.smarts', en: 'Smarts' },
  { id: 'looks', icon: '✦', key: 'stat.looks', en: 'Looks' },
  { id: 'karma', icon: '⚖', key: 'stat.karma', en: 'Karma' },
  { id: 'energy', icon: 'ϟ', key: 'stat.energy', en: 'Energy' },
  { id: 'fame', icon: '★', key: 'stat.fame', en: 'Fame', optional: true },
];

export const Hud = memo(function Hud({
  person,
  onOpenMenu,
  onWorldNews,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const [expanded, setExpanded] = useState(false);

  if (!person) return null;

  const isArabic = language === 'ar';
  const timeState = ensureTimeProgress(person);
  setCurrentTimePerson(person, language);

  const getAvatar = () => {
    if (person.avatar) return <MiniAvatar data={person.avatar} size={40} />;
    const isMale = String(person.gender).toLowerCase() === 'male';
    if (person.age < 3) return '👶';
    if (person.age < 13) return isMale ? '👦' : '👧';
    if (person.age < 65) return isMale ? '👨' : '👩';
    return isMale ? '👴' : '👵';
  };

  const formatMoney = value => {
    const numeric = Math.round(Number(value) || 0);
    return isArabic
      ? formatArabicMoney(numeric, person.country === 'Morocco' ? 'MAD' : 'USD')
      : new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: person.country === 'Morocco' ? 'MAD' : 'USD',
          maximumFractionDigits: 0,
        }).format(numeric);
  };

  const roleLabel = person.job
    ? translateGameText(language, person.job.title)
    : person.currentSchool
      ? t('hud.student', 'Student')
      : t('hud.unemployed', 'Unemployed');
  const locationLabel = [person.city, translateCountryName(language, person.country)]
    .filter(Boolean)
    .join(isArabic ? '، ' : ', ');
  const month = Math.max(0, Math.min(11, Number(timeState?.month) || 0));
  const ageLabel = isArabic
    ? `${formatArabicDuration(person.age, 'year')}${month ? `، ${formatArabicDuration(month, 'month')}` : ''}`
    : `${person.age} yr${person.age === 1 ? '' : 's'}${month ? ` ${month} mo` : ''}`;
  const totalDebt =
    Math.max(0, Number(person.loans) || 0) + Math.max(0, Number(person.personalDebt) || 0);
  const visibleStats = STAT_DEFINITIONS.filter(definition => !definition.optional || Number(person.fame) > 0);
  const summaryStats = visibleStats.filter(definition => ['health', 'happiness', 'stress'].includes(definition.id));

  return (
    <header className={`hud-container ${expanded ? 'is-expanded' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="hud-identity-row">
        <div className="avatar-circle" data-person-name="true">
          {getAvatar()}
          <span className="status-dot" aria-hidden="true" />
          {person.social?.isInfluencer && <span className="influencer-badge">★</span>}
        </div>

        <div className="person-info">
          <div className="person-name-row">
            <h1 className="person-name" dir="auto" data-person-name="true">
              {person.getFullName()}
            </h1>
            <span className="hud-age-pill">{ageLabel}</span>
          </div>
          <div className="hud-role-line" dir="auto">
            <span className="hud-role">{roleLabel}</span>
            {locationLabel && <span className="hud-location">{locationLabel}</span>}
          </div>
        </div>

        <div className="hud-finance-block" dir="ltr">
          <strong className="hud-money">{formatMoney(person.money)}</strong>
          {totalDebt > 0 && (
            <span className="hud-debt">
              {isArabic ? 'دين' : 'Debt'} {formatMoney(totalDebt)}
            </span>
          )}
        </div>

        <div className="hud-top-btns">
          {Array.isArray(person.worldNews) && person.worldNews.length > 0 && (
            <button
              type="button"
              onClick={onWorldNews}
              className="hud-icon-button news-btn"
              aria-label={t('hud.news', 'World News')}
            >
              <AppIcon name="news" size={19} />
              <span className="news-btn-count">
                {isArabic
                  ? formatArabicNumber(person.worldNews.length, { maximumFractionDigits: 0 })
                  : person.worldNews.length}
              </span>
            </button>
          )}
          <button
            type="button"
            className="hud-icon-button hud-menu-fallback"
            onClick={onOpenMenu}
            aria-label={t('hud.openMenu', 'Open Menu')}
          >
            <AppIcon name="menu" size={19} />
          </button>
        </div>
      </div>

      <button
        type="button"
        className="hud-stat-summary"
        onClick={() => setExpanded(value => !value)}
        aria-expanded={expanded}
        aria-label={
          expanded
            ? isArabic
              ? 'أخفِ جميع الإحصائيات'
              : 'Hide all stats'
            : isArabic
              ? 'اعرض جميع الإحصائيات'
              : 'Show all stats'
        }
      >
        <span className="hud-summary-stats">
          {summaryStats.map(definition => (
            <CompactStat
              key={definition.id}
              definition={definition}
              value={person[definition.id]}
              language={language}
              t={t}
            />
          ))}
        </span>
        <AppIcon name="chevron" size={17} className={`hud-expand-icon ${expanded ? 'is-open' : ''}`} />
      </button>

      {expanded && (
        <div className="stat-grid">
          {visibleStats.map(definition => (
            <StatBar
              key={definition.id}
              definition={definition}
              value={person[definition.id] ?? (definition.id === 'energy' ? 100 : 0)}
              language={language}
              t={t}
            />
          ))}
        </div>
      )}
    </header>
  );
});

function CompactStat({ definition, value, language, t }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const number = language === 'ar'
    ? formatArabicNumber(safeValue, { maximumFractionDigits: 0 })
    : safeValue;
  return (
    <span className={`compact-stat compact-stat-${definition.id}`}>
      <span className="compact-stat-icon" aria-hidden="true">{definition.icon}</span>
      <span className="compact-stat-label">{t(definition.key, definition.en)}</span>
      <strong>{number}</strong>
    </span>
  );
}

function StatBar({ definition, value, language, t }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const number = language === 'ar'
    ? formatArabicNumber(safeValue, { maximumFractionDigits: 0 })
    : safeValue;

  return (
    <div className="stat-row">
      <div className="stat-header">
        <span>
          <span className="stat-symbol" aria-hidden="true">{definition.icon}</span>{' '}
          {t(definition.key, definition.en)}
        </span>
        <strong>{number}%</strong>
      </div>
      <div className="progress-track">
        <div className={`progress-fill fill-${definition.id}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
