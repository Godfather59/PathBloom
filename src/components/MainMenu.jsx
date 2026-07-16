import React, { useEffect, useRef, useState } from 'react';
import './Modal.css';
import './NewLifeStart.css';
import { generateRandomName } from '../logic/NameGenerator';
import { CHALLENGES } from '../logic/ChallengeMode';
import { LANGUAGES, translateCountryName } from '../logic/i18n';
import { hasPlayedToday, getDailyStreak } from '../logic/DailyStreak';
import { showGameToast } from '../utils/GameToast';

const COUNTRIES = [
  'Morocco',
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
  'Saudi Arabia',
  'UAE',
];

const COUNTRY_AR = Object.freeze({
  Morocco: 'المغرب',
  'United States': 'الولايات المتحدة',
  'United Kingdom': 'المملكة المتحدة',
  Canada: 'كندا',
  Australia: 'أستراليا',
  Japan: 'اليابان',
  France: 'فرنسا',
  Germany: 'ألمانيا',
  Italy: 'إيطاليا',
  Brazil: 'البرازيل',
  China: 'الصين',
  India: 'الهند',
  Russia: 'روسيا',
  Mexico: 'المكسيك',
  Spain: 'إسبانيا',
  'South Korea': 'كوريا الجنوبية',
  'Saudi Arabia': 'السعودية',
  UAE: 'الإمارات',
});

const START_COPY = {
  en: {
    title: 'Start New Life',
    firstName: 'First name',
    firstPlaceholder: 'Enter first name',
    lastName: 'Last name',
    lastPlaceholder: 'Enter family name',
    randomize: 'Randomize name',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    country: 'Country',
    mode: 'Life mode',
    normalLife: 'Normal life',
    dailyLife: 'Daily life',
    dailyShort: 'Daily',
    normalShort: 'Normal',
    dailyDescription: 'One shared seed and one chance each day.',
    dailyDone: 'Daily life has already been completed today.',
    start: 'Start Life',
    startDaily: 'Start Daily Life',
    fullNameAlert: 'Enter both a first name and a family name.',
    language: 'Language',
    subtitle: 'Life Simulator',
    continueLife: 'Continue Life',
    loadOther: 'Load Other Game',
    age: 'Age',
  },
  ar: {
    title: 'ابدأ حياة جديدة',
    firstName: 'الاسم الأول',
    firstPlaceholder: 'اكتب الاسم الأول',
    lastName: 'اسم العائلة',
    lastPlaceholder: 'اكتب اسم العائلة',
    randomize: 'ولّد اسما عشوائيا',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    country: 'بلد الميلاد',
    mode: 'نمط الحياة',
    normalLife: 'حياة عادية',
    dailyLife: 'الحياة اليومية',
    dailyShort: 'يومية',
    normalShort: 'عادية',
    dailyDescription: 'بذرة مشتركة وفرصة واحدة كل يوم.',
    dailyDone: 'أكملت الحياة اليومية لهذا اليوم بالفعل.',
    start: 'ابدأ الحياة',
    startDaily: 'ابدأ الحياة اليومية',
    fullNameAlert: 'اكتب الاسم الأول واسم العائلة.',
    language: 'اللغة',
    subtitle: 'محاكي الحياة',
    continueLife: 'تابع الحياة',
    loadOther: 'حمّل حياة أخرى',
    age: 'العمر',
  },
};

function localizedCountry(language, country) {
  if (language === 'ar') return COUNTRY_AR[country] || translateCountryName(language, country);
  return translateCountryName(language, country);
}

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
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = START_COPY[locale];
  const isRtl = locale === 'ar';
  const countryTouchedRef = useRef(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState(isRtl ? 'Morocco' : 'United States');
  const [challengeId, setChallengeId] = useState('');
  const [mode, setMode] = useState('normal');

  const streak = getDailyStreak();
  const dailyPlayed = hasPlayedToday();

  useEffect(() => {
    if (!countryTouchedRef.current) {
      setCountry(language === 'ar' ? 'Morocco' : 'United States');
    }
  }, [language]);

  const handleStart = () => {
    const safeFirstName = firstName.trim().slice(0, 40);
    const safeLastName = lastName.trim().slice(0, 40);
    if (!safeFirstName || !safeLastName) {
      showGameToast(t('main.fullNameAlert', copy.fullNameAlert), 'bad');
      return;
    }

    const config = {
      firstName: safeFirstName,
      lastName: safeLastName,
      gender,
      country,
      challengeId: challengeId || null,
      isDaily: mode === 'daily',
    };

    if (mode === 'daily') {
      (onStartDailyLife || onStartGame)?.(config);
    } else {
      onStartGame?.(config);
    }
  };

  const randomizeName = () => {
    const { firstName: first, lastName: last } = generateRandomName(gender);
    setFirstName(first);
    setLastName(last);
  };

  return (
    <main className="main-menu animate-fade-in new-life-start" dir={isRtl ? 'rtl' : 'ltr'} lang={locale}>
      <header className="new-life-brand">
        <h1 className="main-menu-title">🌱 {t('app.title', 'PathBloom')}</h1>
        <p>{t('app.subtitle', copy.subtitle)}</p>
      </header>

      <section className="main-menu-card new-life-card">
        <div className="settings-language new-life-language">
          <div className="settings-language-label">🌐 {t('system.language', copy.language)}</div>
          <div className="settings-language-options">
            {LANGUAGES.map(option => (
              <button
                key={option.id}
                type="button"
                className={`language-chip ${language === option.id ? 'active' : ''}`}
                onClick={() => onLanguageChange?.(option.id)}
                aria-pressed={language === option.id}
              >
                {option.nativeName}
              </button>
            ))}
          </div>
        </div>

        {hasSave && saveSummary && (
          <div className="save-summary new-life-save-summary">
            <div className="save-summary-info">
              <div className="save-summary-name" dir="auto">{saveSummary.name}</div>
              <div className="save-summary-detail" dir="auto">
                🎂 {t('common.age', copy.age)} {saveSummary.age} · {saveSummary.job}
              </div>
            </div>
            <button type="button" onClick={onContinue} className="btn-primary new-life-continue">
              ▶ {t('main.continue', copy.continueLife)}
            </button>
          </div>
        )}

        {hasSave && (
          <button type="button" onClick={onLoad} className="btn-secondary new-life-load">
            📂 {t('main.loadOther', copy.loadOther)}
          </button>
        )}

        <div className="new-life-section-heading">
          <span aria-hidden="true">🌅</span>
          <div>
            <h2>{t('main.startNewLife', copy.title)}</h2>
            <p>{isRtl ? 'اختر هويتك الأساسية وابدأ القصة مباشرة.' : 'Choose the basics and begin the story immediately.'}</p>
          </div>
        </div>

        <div className="new-life-name-grid">
          <label className="main-menu-section new-life-field">
            <span className="main-menu-section-label">👤 {t('main.firstName', copy.firstName)}</span>
            <input
              type="text"
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
              maxLength={40}
              placeholder={t('main.firstNamePlaceholder', copy.firstPlaceholder)}
              className="main-menu-input"
              dir="auto"
              autoComplete="given-name"
              enterKeyHint="next"
            />
          </label>

          <label className="main-menu-section new-life-field">
            <span className="main-menu-section-label">🪪 {t('main.lastName', copy.lastName)}</span>
            <input
              type="text"
              value={lastName}
              onChange={event => setLastName(event.target.value)}
              maxLength={40}
              placeholder={t('main.lastNamePlaceholder', copy.lastPlaceholder)}
              className="main-menu-input"
              dir="auto"
              autoComplete="family-name"
              enterKeyHint="done"
            />
          </label>
        </div>

        <button type="button" onClick={randomizeName} className="randomize-btn new-life-randomize">
          🎲 {t('main.randomizeName', copy.randomize)}
        </button>

        <fieldset className="main-menu-section new-life-fieldset">
          <legend className="main-menu-section-label">⚧ {t('main.gender', copy.gender)}</legend>
          <div className="menu-btn-row">
            <button
              type="button"
              onClick={() => setGender('Male')}
              className={`menu-btn${gender === 'Male' ? ' active-gender-male' : ''}`}
              aria-pressed={gender === 'Male'}
            >
              👨 {t('main.male', copy.male)}
            </button>
            <button
              type="button"
              onClick={() => setGender('Female')}
              className={`menu-btn${gender === 'Female' ? ' active-gender-female' : ''}`}
              aria-pressed={gender === 'Female'}
            >
              👩 {t('main.female', copy.female)}
            </button>
          </div>
        </fieldset>

        <label className="main-menu-section new-life-field">
          <span className="main-menu-section-label">🌍 {t('main.country', copy.country)}</span>
          <select
            value={country}
            onChange={event => {
              countryTouchedRef.current = true;
              setCountry(event.target.value);
            }}
            className="main-menu-select"
          >
            {COUNTRIES.map(option => (
              <option key={option} value={option}>{localizedCountry(locale, option)}</option>
            ))}
          </select>
        </label>

        <label className="main-menu-section new-life-field">
          <span className="main-menu-section-label">🎯 {t('main.mode', copy.mode)}</span>
          <select
            value={challengeId}
            onChange={event => setChallengeId(event.target.value)}
            className="main-menu-select"
          >
            <option value="">🌿 {t('main.normalLife', copy.normalLife)}</option>
            {CHALLENGES.filter(challenge => challenge.available !== false).map(challenge => (
              <option key={challenge.id} value={challenge.id}>
                {challenge.icon} {locale === 'ar' ? challenge.nameAr || challenge.name : challenge.name}
                {challenge.difficulty ? ` · ${challenge.difficulty}` : ''}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="main-menu-section new-life-fieldset">
          <legend className="main-menu-section-label">📅 {t('main.dailyLife', copy.dailyLife)}</legend>
          <div className="menu-btn-row">
            <button
              type="button"
              onClick={() => setMode('normal')}
              className={`menu-btn${mode === 'normal' ? ' active-mode-normal' : ''}`}
              aria-pressed={mode === 'normal'}
            >
              🌿 {t('main.normalLife', copy.normalShort)}
            </button>
            <button
              type="button"
              onClick={() => setMode('daily')}
              disabled={dailyPlayed}
              className={`menu-btn${mode === 'daily' && !dailyPlayed ? ' active-mode-daily' : ''}${dailyPlayed ? ' daily-disabled' : ''}`}
              aria-pressed={mode === 'daily'}
            >
              🔥 {t('main.dailyLife', copy.dailyShort)} {streak.streak > 0 ? `(${streak.streak})` : ''}
            </button>
          </div>
          {dailyPlayed && <p className="daily-done-text">{t('main.dailyAlreadyPlayed', copy.dailyDone)}</p>}
          {mode === 'daily' && !dailyPlayed && (
            <p className="hint-text">{t('main.dailyLifeDesc', copy.dailyDescription)}</p>
          )}
        </fieldset>

        <button
          type="button"
          onClick={handleStart}
          className={`start-btn${mode === 'daily' ? ' start-btn-daily' : ' start-btn-normal'}`}
        >
          {mode === 'daily' ? `🔥 ${copy.startDaily}` : `🚀 ${copy.start}`}
        </button>
      </section>
    </main>
  );
}
