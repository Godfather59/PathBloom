import React, { memo } from 'react';
import { MiniAvatar } from './MiniAvatar';
import { translateGameText } from '../logic/i18n';
import { ensureTimeProgress, setCurrentTimePerson } from '../logic/TimeProgression';
import './Hud.css';

export const Hud = memo(
  ({
    person,
    onOpenMenu,
    onWorldNews,
    language = 'en',
    t = (key, fallback) => fallback || key,
  }) => {
    if (!person) {
      return null;
    }

    const timeState = ensureTimeProgress(person);
    setCurrentTimePerson(person);

    const formatMoney = amt => {
      const value = Math.round(Number(amt) || 0);
      const absValue = Math.abs(value).toLocaleString('en-US');
      const sign = value < 0 ? '-' : '';

      return language === 'ar' ? `${sign}${absValue} دولار` : `${sign}$${absValue}`;
    };

    const getAvatar = () => {
      if (person.avatar) {
        return <MiniAvatar data={person.avatar} size={40} />;
      }
      const isMale = person.gender.toLowerCase() === 'male';
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

    const genderLabel =
      person.gender === 'Female' ? t('main.female', 'Female') : t('main.male', 'Male');
    const roleLabel = person.job
      ? translateGameText(language, person.job.title)
      : person.currentSchool
        ? t('hud.student', 'Student')
        : t('hud.unemployed', 'Unemployed');
    const totalDebt =
      Math.max(0, Number(person.loans) || 0) + Math.max(0, Number(person.personalDebt) || 0);
    const locationLabel = [person.city, person.country]
      .filter(Boolean)
      .map(value => translateGameText(language, value))
      .join(', ');
    const month = Math.max(0, Math.min(11, Number(timeState?.month) || 0));
    const ageLabel =
      language === 'ar'
        ? `${person.age} ${t('hud.yearsOld', 'سنة')}${month > 0 ? ` و${month} شهر` : ''}`
        : `${person.age} ${t('hud.yearsOld', 'years old')}${month > 0 ? `, ${month} month${month === 1 ? '' : 's'}` : ''}`;

    return (
      <div className="hud-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="hud-header">
          <div className="avatar-circle">
            {getAvatar()}
            <div className="status-dot"></div>
            {person.social?.isInfluencer && <div className="influencer-badge">⭐</div>}
          </div>

          <div className="person-info">
            <h2 className="person-name">{person.getFullName()}</h2>
            <div className="person-details">
              {genderLabel} - 🎂 {ageLabel}
              <div className="hud-money">💵 {formatMoney(person.money)}</div>
              {totalDebt > 0 && (
                <div className="hud-debt">
                  💳 {t('hud.debt', 'Debt')}: {formatMoney(totalDebt)}
                </div>
              )}
              <div className="hud-role">{roleLabel}</div>
              <div className="hud-location">📍 {locationLabel}</div>
            </div>
          </div>

          <div className="hud-top-btns">
            {Array.isArray(person.worldNews) && person.worldNews.length > 0 && (
              <button
                type="button"
                onClick={onWorldNews}
                className="news-btn"
                aria-label={t('hud.news', 'News')}
                title={t('hud.news', 'World News')}
              >
                <span className="news-btn-icon">📰</span>
                <span className="news-btn-count">{person.worldNews.length}</span>
              </button>
            )}
            <button
              className="settings-btn"
              onClick={onOpenMenu}
              aria-label={t('hud.openMenu', 'Open Menu')}
            >
              <span className="settings-icon" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>

        <div className="stat-grid">
          <StatBar
            label={`😊 ${t('stat.happiness', 'Happiness')}`}
            value={person.happiness}
            type="happiness"
          />
          <StatBar label={`❤️ ${t('stat.health', 'Health')}`} value={person.health} type="health" />
          <StatBar label={`🧠 ${t('stat.smarts', 'Smarts')}`} value={person.smarts} type="smarts" />
          <StatBar label={`✨ ${t('stat.looks', 'Looks')}`} value={person.looks} type="looks" />
          <StatBar label={`😵 ${t('stat.stress', 'Stress')}`} value={person.stress} type="stress" />
          <StatBar label={`⚖️ ${t('stat.karma', 'Karma')}`} value={person.karma} type="karma" />
          {person.fame > 0 && (
            <StatBar label={`⭐ ${t('stat.fame', 'Fame')}`} value={person.fame} type="fame" />
          )}
          <StatBar
            label={`⚡ ${t('stat.energy', 'Energy')}`}
            value={person.energy ?? 100}
            type="energy"
          />
        </div>
      </div>
    );
  }
);

function StatBar({ label, value, type }) {
  const safeValue = Math.max(0, Math.min(100, Math.round(Number(value) || 0)));

  return (
    <div className="stat-row">
      <div className="stat-header">
        <span>{label}</span>
        <span>{safeValue}%</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill fill-${type}`} style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
