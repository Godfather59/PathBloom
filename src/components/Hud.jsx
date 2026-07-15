import React, { memo } from 'react';
import { MiniAvatar } from './MiniAvatar';
import { translateGameText } from '../logic/i18n';
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

    // Helper for currency formatting
    const formatMoney = amt => {
      return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amt);
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

    return (
      <div className="hud-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header Section: Avatar + Name/Details */}
        <div className="hud-header">
          <div className="avatar-circle">
            {getAvatar()}
            {/* Status Dot: Green if alive/healthy, could change later */}
            <div className="status-dot"></div>
            {person.social?.isInfluencer && <div className="influencer-badge">⭐</div>}
          </div>

          <div className="person-info">
            <h2 className="person-name">{person.getFullName()}</h2>
            <div className="person-details">
              {genderLabel} - 🎂 {person.age} {t('hud.yearsOld', 'years old')}
              <div className="hud-money">💵 {formatMoney(person.money)}</div>
              {totalDebt > 0 && (
                <div className="hud-debt">💳 {t('hud.debt', 'Debt')}: {formatMoney(totalDebt)}</div>
              )}
              <div className="hud-role">{roleLabel}</div>
              <div className="hud-location">📍 {person.city}, {person.country}</div>
            </div>
          </div>

          {/* Top-right action buttons */}
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

        {/* Stats Grid */}
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
  return (
    <div className="stat-row">
      <div className="stat-header">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress-track">
        <div className={`progress-fill fill-${type}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
