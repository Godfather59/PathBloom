import React, { useState } from 'react';
import './Modal.css';
import { generateRandomName } from '../logic/NameGenerator';
import { CHALLENGES } from '../logic/ChallengeMode';
import { LANGUAGES, translateCountryName } from '../logic/i18n';
import { hasPlayedToday, getDailyStreak } from '../logic/DailyStreak';
import { showGameToast } from '../utils/GameToast';
import AvatarCreator from './AvatarCreator';

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Japan',
  'France',
  'Germany',
  'Italy',
  'Brazil',
  'China',
  'India',
  'Russia',
  'Mexico',
  'Spain',
  'South Korea',
];

export function MainMenu({
  onStartGame,
  onStartDailyLife,
  onContinue,
  onLoad,
  hasSave,
  saveSummary,
  language = 'en',
  onLanguageChange,
  t = (key, fallback) => fallback || key,
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState('United States');
  const [challengeId, setChallengeId] = useState('');
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const [mode, setMode] = useState('normal');
  const isRtl = language === 'ar';

  const streak = getDailyStreak();
  const dailyPlayed = hasPlayedToday();

  const handleStart = () => {
    if (!firstName.trim() || !lastName.trim()) {
      showGameToast(t('main.fullNameAlert', 'Please enter a full name.'), 'bad');
      return;
    }
    setShowAvatarCreator(true);
  };

  const handleAvatarComplete = avatarData => {
    const config = {
      firstName: firstName.trim().slice(0, 40),
      lastName: lastName.trim().slice(0, 40),
      gender,
      country,
      challengeId: challengeId || null,
      avatarData,
      isDaily: mode === 'daily',
    };
    if (mode === 'daily') {
      onStartDailyLife?.(config);
    } else {
      onStartGame(config);
    }
    setShowAvatarCreator(false);
  };

  const randomizeName = () => {
    const { firstName: first, lastName: last } = generateRandomName(gender);
    setFirstName(first);
    setLastName(last);
  };

  return (
    <>
      {showAvatarCreator && (
        <AvatarCreator
          onComplete={handleAvatarComplete}
          onCancel={() => setShowAvatarCreator(false)}
          language={language}
          t={t}
        />
      )}

      <div className="main-menu animate-fade-in" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <h1 className="main-menu-title">🌱 {t('app.title', 'PathBloom')}</h1>

        <div className="main-menu-card">
          <h2 className="main-menu-subtitle">✨ {t('app.subtitle', 'Life Simulator')}</h2>

          <div className="settings-language" style={{ marginBottom: '12px' }}>
            <div className="settings-language-label">🌐 {t('system.language', 'Language')}</div>
            <div className="settings-language-options">
              {LANGUAGES.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={`language-chip ${language === option.id ? 'active' : ''}`}
                  onClick={() => onLanguageChange?.(option.id)}
                >
                  {option.nativeName}
                </button>
              ))}
            </div>
          </div>

          {hasSave && saveSummary && (
            <div className="save-summary">
              <div className="save-summary-info">
                <div className="save-summary-name">{saveSummary.name}</div>
                <div className="save-summary-detail">
                  🎂 {t('common.age', 'Age')} {saveSummary.age} - {saveSummary.job}
                </div>
              </div>
              <button
                onClick={onContinue}
                className="btn-primary"
                style={{
                  width: '100%',
                  fontSize: '1.1em',
                  background: 'linear-gradient(90deg, #11998e, #38ef7d)',
                }}
              >
                ▶️ {t('main.continue', 'Continue Life')}
              </button>
            </div>
          )}

          {hasSave && (
            <button
              onClick={onLoad}
              className="btn-secondary"
              style={{
                width: '100%',
                fontSize: '1em',
                marginBottom: '24px',
              }}
            >
              📂 {t('main.loadOther', 'Load Other Game')}
            </button>
          )}

          <h3 className="section-heading">🌅 {t('main.startNewLife', 'Start New Life')}</h3>

          <div className="main-menu-section" style={{ marginBottom: '8px' }}>
            <label className="main-menu-section-label">
              👤 {t('main.firstName', 'First Name')}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              maxLength={40}
              placeholder={t('main.firstNamePlaceholder', 'Enter first name')}
              className="main-menu-input"
            />
          </div>

          <div className="main-menu-section" style={{ marginBottom: '8px' }}>
            <label className="main-menu-section-label">🪪 {t('main.lastName', 'Last Name')}</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              maxLength={40}
              placeholder={t('main.lastNamePlaceholder', 'Enter last name')}
              className="main-menu-input"
            />
          </div>

          <button onClick={randomizeName} className="randomize-btn">
            🎲 {t('main.randomizeName', 'Randomize Name')}
          </button>

          <div className="main-menu-section">
            <label className="main-menu-section-label">⚧️ {t('main.gender', 'Gender')}</label>
            <div className="menu-btn-row">
              <button
                onClick={() => setGender('Male')}
                className={`menu-btn${gender === 'Male' ? ' active-gender-male' : ''}`}
              >
                👨 {t('main.male', 'Male')}
              </button>
              <button
                onClick={() => setGender('Female')}
                className={`menu-btn${gender === 'Female' ? ' active-gender-female' : ''}`}
              >
                👩 {t('main.female', 'Female')}
              </button>
            </div>
          </div>

          <div className="main-menu-section">
            <label className="main-menu-section-label">🌍 {t('main.country', 'Country')}</label>
            <select
              value={country}
              onChange={e => setCountry(e.target.value)}
              className="main-menu-select"
            >
              {COUNTRIES.map(c => (
                <option key={c} value={c}>
                  {translateCountryName(language, c)}
                </option>
              ))}
            </select>
          </div>

          <div className="main-menu-section">
            <label className="main-menu-section-label">🎯 {t('main.mode', 'Mode')}</label>
            <select
              value={challengeId}
              onChange={e => setChallengeId(e.target.value)}
              className="main-menu-select"
            >
              <option value="">🌿 {t('main.normalLife', 'Normal Life')}</option>
              {CHALLENGES.filter(challenge => challenge.available !== false).map(challenge => (
                <option key={challenge.id} value={challenge.id}>
                  {challenge.icon} {challenge.name} ({challenge.difficulty})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="main-menu-section-label">
              📅 {t('main.dailyLife', 'Daily Life')}
            </label>
            <div className="menu-btn-row">
              <button
                onClick={() => setMode('normal')}
                className={`menu-btn${mode === 'normal' ? ' active-mode-normal' : ''}`}
              >
                🌿 {t('main.normalLife', 'Normal')}
              </button>
              <button
                onClick={() => setMode('daily')}
                disabled={dailyPlayed}
                className={`menu-btn${mode === 'daily' && !dailyPlayed ? ' active-mode-daily' : ''}${dailyPlayed ? ' daily-disabled' : ''}`}
              >
                🔥 {t('main.dailyLife', 'Daily')} {streak.streak > 0 ? `(${streak.streak})` : ''}
              </button>
            </div>
            {dailyPlayed && (
              <div className="daily-done-text">
                {t('main.dailyAlreadyPlayed', 'Daily life already completed today.')}
              </div>
            )}
            {mode === 'daily' && !dailyPlayed && (
              <div className="hint-text">
                {t('main.dailyLifeDesc', 'One shared seed, one chance per day.')}
              </div>
            )}
          </div>

          <button
            onClick={handleStart}
            className={`start-btn${mode === 'daily' ? ' start-btn-daily' : ' start-btn-normal'}`}
          >
            {mode === 'daily' ? '🔥 Daily Life' : '🚀 Start Life'}
          </button>
        </div>
      </div>
    </>
  );
}
