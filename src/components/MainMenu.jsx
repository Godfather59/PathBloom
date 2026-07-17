import React, { useEffect, useRef, useState } from 'react';
import './Modal.css';
import './NewLifeStart.css';
import { generateRandomName } from '../logic/NameGenerator';
import { CHALLENGES } from '../logic/ChallengeMode';
import { LANGUAGES, translateCountryName } from '../logic/i18n';
import { hasPlayedToday, getDailyStreak } from '../logic/DailyStreak';
import { showGameToast } from '../utils/GameToast';
import { AppIcon } from './AppIcon';

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
    firstName: 'First name',
    firstPlaceholder: 'Enter first name',
    lastName: 'Last name',
    lastPlaceholder: 'Enter family name',
    randomize: 'Randomize name',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    country: 'Country',
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
    newLife: 'New Life',
    identity: 'Identity',
    identityHint: 'Choose who this life begins as.',
    settings: 'Life Settings',
    settingsHint: 'Choose the birthplace and optional rules.',
    next: 'Continue',
    back: 'Back',
    advanced: 'Challenges and advanced options',
    challenge: 'Challenge',
    mode: 'Daily Life',
  },
  ar: {
    firstName: 'الاسم الأول',
    firstPlaceholder: 'اكتب الاسم الأول',
    lastName: 'اسم العائلة',
    lastPlaceholder: 'اكتب اسم العائلة',
    randomize: 'ولّد اسما عشوائيا',
    gender: 'الجنس',
    male: 'ذكر',
    female: 'أنثى',
    country: 'بلد الميلاد',
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
    newLife: 'حياة جديدة',
    identity: 'الهوية',
    identityHint: 'اختر هوية بداية هذه الحياة.',
    settings: 'إعدادات الحياة',
    settingsHint: 'اختر بلد الميلاد والقواعد الاختيارية.',
    next: 'متابعة',
    back: 'رجوع',
    advanced: 'التحديات والخيارات المتقدمة',
    challenge: 'التحدي',
    mode: 'الحياة اليومية',
  },
};

function localizedCountry(language, country) {
  if (language === 'ar') {
    return COUNTRY_AR[country] || translateCountryName(language, country);
  }
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
  const [step, setStep] = useState(1);
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

  const getNames = () => ({
    first: firstName.trim().slice(0, 40),
    last: lastName.trim().slice(0, 40),
  });

  const continueToSettings = () => {
    const names = getNames();
    if (!names.first || !names.last) {
      showGameToast(t('main.fullNameAlert', copy.fullNameAlert), 'bad');
      return;
    }
    setStep(2);
  };

  const handleStart = () => {
    const names = getNames();
    if (!names.first || !names.last) {
      showGameToast(t('main.fullNameAlert', copy.fullNameAlert), 'bad');
      setStep(1);
      return;
    }

    const config = {
      firstName: names.first,
      lastName: names.last,
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
    <main
      className="main-menu animate-fade-in new-life-start"
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={locale}
    >
      <header className="new-life-brand">
        <span className="new-life-brand-icon">
          <AppIcon name="life" size={28} />
        </span>
        <h1 className="main-menu-title">{t('app.title', 'PathBloom')}</h1>
        <p>{t('app.subtitle', copy.subtitle)}</p>
      </header>

      <section className="main-menu-card new-life-card">
        <div className="settings-language new-life-language">
          <div className="settings-language-label">
            <AppIcon name="world" size={18} /> {t('system.language', copy.language)}
          </div>
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
              <div className="save-summary-name" dir="auto">
                {saveSummary.name}
              </div>
              <div className="save-summary-detail" dir="auto">
                {t('common.age', copy.age)} {saveSummary.age} · {saveSummary.job}
              </div>
            </div>
            <button type="button" onClick={onContinue} className="btn-primary new-life-continue">
              <AppIcon name="life" size={19} /> {t('main.continue', copy.continueLife)}
            </button>
          </div>
        )}

        {hasSave && (
          <button type="button" onClick={onLoad} className="btn-secondary new-life-load">
            <AppIcon name="recent" size={18} /> {t('main.loadOther', copy.loadOther)}
          </button>
        )}

        <div className="new-life-section-heading">
          <span aria-hidden="true">
            <AppIcon name="identity" size={22} />
          </span>
          <div>
            <h2>{copy.newLife}</h2>
            <p>{step === 1 ? copy.identityHint : copy.settingsHint}</p>
          </div>
        </div>

        <div className="new-life-progress" aria-label={copy.newLife}>
          <div className={`new-life-progress-step ${step === 1 ? 'is-active' : 'is-complete'}`}>
            {step > 1 ? <AppIcon name="check" size={17} /> : <AppIcon name="identity" size={17} />}
            <span>1. {copy.identity}</span>
          </div>
          <div className={`new-life-progress-step ${step === 2 ? 'is-active' : ''}`}>
            <AppIcon name="settings" size={17} />
            <span>2. {copy.settings}</span>
          </div>
        </div>

        {step === 1 ? (
          <div className="new-life-step-panel" data-step="identity">
            <div className="new-life-name-grid">
              <label className="main-menu-section new-life-field">
                <span className="main-menu-section-label">
                  <AppIcon name="identity" size={17} /> {t('main.firstName', copy.firstName)}
                </span>
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
                <span className="main-menu-section-label">
                  <AppIcon name="identity" size={17} /> {t('main.lastName', copy.lastName)}
                </span>
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

            <button
              type="button"
              onClick={randomizeName}
              className="randomize-btn new-life-randomize"
            >
              <AppIcon name="random" size={18} /> {t('main.randomizeName', copy.randomize)}
            </button>

            <fieldset className="main-menu-section new-life-fieldset">
              <legend className="main-menu-section-label">{t('main.gender', copy.gender)}</legend>
              <div className="menu-btn-row">
                <button
                  type="button"
                  onClick={() => setGender('Male')}
                  className={`menu-btn${gender === 'Male' ? ' active-gender-male' : ''}`}
                  aria-pressed={gender === 'Male'}
                >
                  {t('main.male', copy.male)}
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`menu-btn${gender === 'Female' ? ' active-gender-female' : ''}`}
                  aria-pressed={gender === 'Female'}
                >
                  {t('main.female', copy.female)}
                </button>
              </div>
            </fieldset>

            <div className="new-life-step-actions">
              <span />
              <button type="button" className="btn-primary" onClick={continueToSettings}>
                {copy.next} <AppIcon name="chevron" size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="new-life-step-panel" data-step="settings">
            <label className="main-menu-section new-life-field">
              <span className="main-menu-section-label">
                <AppIcon name="world" size={17} /> {t('main.country', copy.country)}
              </span>
              <select
                value={country}
                onChange={event => {
                  countryTouchedRef.current = true;
                  setCountry(event.target.value);
                }}
                className="main-menu-select"
              >
                {COUNTRIES.map(option => (
                  <option key={option} value={option}>
                    {localizedCountry(locale, option)}
                  </option>
                ))}
              </select>
            </label>

            <details className="new-life-advanced">
              <summary>
                <span>{copy.advanced}</span>
                <AppIcon name="chevron" size={17} />
              </summary>
              <div className="new-life-advanced-content">
                <label className="main-menu-section new-life-field">
                  <span className="main-menu-section-label">{copy.challenge}</span>
                  <select
                    value={challengeId}
                    onChange={event => setChallengeId(event.target.value)}
                    className="main-menu-select"
                  >
                    <option value="">{t('main.normalLife', copy.normalLife)}</option>
                    {CHALLENGES.filter(challenge => challenge.available !== false).map(
                      challenge => (
                        <option key={challenge.id} value={challenge.id}>
                          {locale === 'ar' ? challenge.nameAr || challenge.name : challenge.name}
                          {challenge.difficulty ? ` · ${challenge.difficulty}` : ''}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <fieldset className="main-menu-section new-life-fieldset">
                  <legend className="main-menu-section-label">{copy.mode}</legend>
                  <div className="menu-btn-row">
                    <button
                      type="button"
                      onClick={() => setMode('normal')}
                      className={`menu-btn${mode === 'normal' ? ' active-mode-normal' : ''}`}
                      aria-pressed={mode === 'normal'}
                    >
                      {t('main.normalLife', copy.normalShort)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('daily')}
                      disabled={dailyPlayed}
                      className={`menu-btn${mode === 'daily' && !dailyPlayed ? ' active-mode-daily' : ''}${dailyPlayed ? ' daily-disabled' : ''}`}
                      aria-pressed={mode === 'daily'}
                    >
                      {t('main.dailyLife', copy.dailyShort)}{' '}
                      {streak.streak > 0 ? `(${streak.streak})` : ''}
                    </button>
                  </div>
                  {dailyPlayed && (
                    <p className="daily-done-text">
                      {t('main.dailyAlreadyPlayed', copy.dailyDone)}
                    </p>
                  )}
                  {mode === 'daily' && !dailyPlayed && (
                    <p className="hint-text">{t('main.dailyLifeDesc', copy.dailyDescription)}</p>
                  )}
                </fieldset>
              </div>
            </details>

            <div className="new-life-step-actions">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                <AppIcon name="back" size={18} /> {copy.back}
              </button>
              <button
                type="button"
                onClick={handleStart}
                className={`start-btn${mode === 'daily' ? ' start-btn-daily' : ' start-btn-normal'}`}
              >
                <AppIcon name="life" size={19} /> {mode === 'daily' ? copy.startDaily : copy.start}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
