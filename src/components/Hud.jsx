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
import { BottomSheet } from './ShellPrimitives';
import './Hud.css';
import './HudSafeActions.css';

const STAT_DEFINITIONS = [
  { id: 'health', icon: 'health', key: 'stat.health', en: 'Health' },
  { id: 'happiness', icon: 'happiness', key: 'stat.happiness', en: 'Happiness' },
  { id: 'stress', icon: 'stress', key: 'stat.stress', en: 'Stress' },
  { id: 'smarts', icon: 'smarts', key: 'stat.smarts', en: 'Smarts' },
  { id: 'looks', icon: 'looks', key: 'stat.looks', en: 'Looks' },
  { id: 'karma', icon: 'karma', key: 'stat.karma', en: 'Karma' },
  { id: 'energy', icon: 'energy', key: 'stat.energy', en: 'Energy' },
  { id: 'fame', icon: 'fame', key: 'stat.fame', en: 'Fame', optional: true },
];

export const Hud = memo(
  ({
    person,
    onOpenMenu,
    onWorldNews,
    language = 'en',
    t = (key, fallback) => fallback || key,
  }) => {
    const [statsOpen, setStatsOpen] = useState(false);

    if (!person) {
      return null;
    }

    const isArabic = language === 'ar';
    const timeState = ensureTimeProgress(person);
    setCurrentTimePerson(person, language);

    const getAvatar = () => {
      if (person.avatar) {
        return <MiniAvatar data={person.avatar} size={40} />;
      }
      const isMale = String(person.gender).toLowerCase() === 'male';
      if (person.age < 3) {
        return '👶';
      }
      if (person.age < 13) {
        return isMale ? '👦' : '👧';
      }
      if (person.age < 65) {
        return isMale ? '👨' : '👩';
      }
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

    const openEventHistory = () => {
      onOpenMenu?.();
      if (typeof document === 'undefined' || typeof window === 'undefined') {
        return;
      }

      let attempts = 0;
      const findAndOpenHistory = () => {
        attempts += 1;
        const menu = document.querySelector('.system-destination');
        if (menu) {
          const recordsTab = Array.from(menu.querySelectorAll('.system-tabs button')).find(button =>
            /^(?:Life|الحياة)$/i.test(String(button.textContent || '').trim())
          );
          if (recordsTab && !recordsTab.classList.contains('is-active')) {
            recordsTab.click();
          } else {
            const historyButton = Array.from(menu.querySelectorAll('.system-menu-tile')).find(
              button => /(?:Event history|سجل الأحداث)/i.test(String(button.textContent || ''))
            );
            if (historyButton) {
              historyButton.click();
              return;
            }
          }
        }

        if (attempts < 40) {
          window.setTimeout(findAndOpenHistory, 25);
        }
      };

      window.setTimeout(findAndOpenHistory, 0);
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
    const visibleStats = STAT_DEFINITIONS.filter(
      definition => !definition.optional || Number(person.fame) > 0
    );
    const summaryStats = visibleStats.filter(definition =>
      ['health', 'happiness', 'stress'].includes(definition.id)
    );

    return (
      <>
        <header className="hud-container" dir={isArabic ? 'rtl' : 'ltr'}>
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
          </div>

          <div
            className="hud-safe-actions"
            aria-label={isArabic ? 'اختصارات الأخبار والسجل' : 'News and history shortcuts'}
          >
            {Array.isArray(person.worldNews) && person.worldNews.length > 0 && (
              <button
                type="button"
                onClick={onWorldNews}
                className="hud-safe-action is-news"
                aria-label={t('hud.news', 'World News')}
              >
                <AppIcon name="news" size={18} />
                <span>{t('hud.news', 'World News')}</span>
                <strong className="hud-safe-action-count">
                  {isArabic
                    ? formatArabicNumber(person.worldNews.length, { maximumFractionDigits: 0 })
                    : person.worldNews.length}
                </strong>
              </button>
            )}
            <button
              type="button"
              className="hud-safe-action is-history"
              onClick={openEventHistory}
              aria-label={t('hud.eventHistory', 'Event History')}
            >
              <AppIcon name="recent" size={18} />
              <span>{t('hud.eventHistory', 'Event History')}</span>
            </button>
          </div>

          <button
            type="button"
            className="hud-stat-summary"
            onClick={() => setStatsOpen(true)}
            aria-expanded={statsOpen}
            aria-haspopup="dialog"
            aria-label={isArabic ? 'اعرض جميع الإحصائيات' : 'Show all stats'}
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
            <AppIcon name="chevron" size={17} className="hud-expand-icon" />
          </button>
        </header>

        <BottomSheet
          open={statsOpen}
          onClose={() => setStatsOpen(false)}
          title={isArabic ? 'جميع الإحصائيات' : 'All stats'}
          subtitle={isArabic ? 'ملخص حالتك الحالية.' : 'A complete view of your current condition.'}
          closeLabel={t('common.close', 'Close')}
          className="stats-bottom-sheet"
        >
          <div className="stats-sheet-grid">
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
        </BottomSheet>
      </>
    );
  }
);

function CompactStat({ definition, value, language, t }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const number =
    language === 'ar' ? formatArabicNumber(safeValue, { maximumFractionDigits: 0 }) : safeValue;
  return (
    <span className={`compact-stat compact-stat-${definition.id}`}>
      <span className="compact-stat-icon" aria-hidden="true">
        <AppIcon name={definition.icon} size={12} strokeWidth={2} />
      </span>
      <span className="compact-stat-label">{t(definition.key, definition.en)}</span>
      <strong>{number}</strong>
    </span>
  );
}

function StatBar({ definition, value, language, t }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
  const number =
    language === 'ar' ? formatArabicNumber(safeValue, { maximumFractionDigits: 0 }) : safeValue;

  return (
    <div className="stat-row">
      <div className="stat-header">
        <span>
          <span className="stat-symbol" aria-hidden="true">
            <AppIcon name={definition.icon} size={15} strokeWidth={2} />
          </span>{' '}
          {t(definition.key, definition.en)}
        </span>
        <strong>{number}%</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={safeValue}
      >
        <div className={`progress-fill fill-${definition.id}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
