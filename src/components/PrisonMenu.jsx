import React, { useRef, useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { AppIcon } from './AppIcon';
import WorldSimulation2Dashboard from './WorldSimulation2Dashboard';
import {
  formatArabicDuration,
  formatArabicNumber,
} from '../logic/ArabicLocalization';
import './Modal.css';

export function PrisonMenu({
  person,
  onAction,
  onSystem,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const [showWorld, setShowWorld] = useState(false);
  const actionsRef = useRef(null);
  const isArabic = language === 'ar';
  const storedMonths = Number(person.timeProgress?.prisonMonthsRemaining);
  const remainingMonths = Number.isFinite(storedMonths)
    ? Math.max(0, Math.floor(storedMonths))
    : Math.max(0, Math.round((Number(person.prisonSentence) || 0) * 12));
  const remainingYears = Math.floor(remainingMonths / 12);
  const extraMonths = remainingMonths % 12;
  const sentenceLabel = isArabic
    ? [
        remainingYears > 0 ? formatArabicDuration(remainingYears, 'year') : '',
        extraMonths > 0 ? formatArabicDuration(extraMonths, 'month') : '',
      ].filter(Boolean).join(' و') || 'أقل من شهر'
    : `${remainingYears > 0 ? `${remainingYears} year${remainingYears === 1 ? '' : 's'}` : ''}${remainingYears > 0 && extraMonths > 0 ? ', ' : ''}${extraMonths > 0 ? `${extraMonths} month${extraMonths === 1 ? '' : 's'}` : remainingYears === 0 ? 'Less than one month' : ''}`;

  if (showWorld) {
    return (
      <WorldSimulation2Dashboard
        person={person}
        onClose={() => setShowWorld(false)}
        language={isArabic ? 'ar' : 'en'}
      />
    );
  }

  const openSystem = () => {
    if (onSystem) onSystem();
    else document.querySelector('.hud-menu-fallback')?.click();
  };

  const handleNavigate = destination => {
    if (destination === 'activities') {
      actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (destination === 'world') {
      setShowWorld(true);
    } else if (destination === 'menu') {
      openSystem();
    }
  };

  const respect = Math.max(0, Math.min(100, Math.round(Number(person.notoriety) || 0)));
  const displayRespect = isArabic
    ? formatArabicNumber(respect, { maximumFractionDigits: 0 })
    : respect;

  return (
    <div className="prison-mode" dir={isArabic ? 'rtl' : 'ltr'}>
      <header className="prison-mode-header">
        <div className="prison-mode-symbol" aria-hidden="true">🔒</div>
        <div className="prison-mode-heading">
          <span>{isArabic ? 'وضع السجن' : 'Prison mode'}</span>
          <h1>{t('prison.title', 'State Penitentiary')}</h1>
        </div>
        <button type="button" className="prison-mode-menu" onClick={openSystem} aria-label={t('hud.openMenu', 'Open Menu')}>
          <AppIcon name="menu" size={20} />
        </button>
      </header>

      <main className="prison-mode-scroll">
        <section className="prison-sentence-hero">
          <span className="prison-sentence-kicker">{t('prison.sentence', 'Sentence Remaining')}</span>
          <strong className="prison-sentence-value">{sentenceLabel}</strong>
          <div className="prison-sentence-meta">
            <span>{t('prison.respect', 'Respect')} <strong>{displayRespect}%</strong></span>
            <span>
              {t('prison.gang', 'Gang')}{' '}
              <strong>{person.mafia?.family ? t('prison.affiliated', 'Affiliated') : t('prison.none', 'None')}</strong>
            </span>
          </div>
          <div className="prison-sentence-track" aria-hidden="true">
            <span style={{ width: `${Math.min(100, Math.max(8, respect))}%` }} />
          </div>
        </section>

        <section className="prison-action-section" ref={actionsRef}>
          <div className="prison-section-heading">
            <span>{isArabic ? 'الأنشطة اليومية' : 'Daily activities'}</span>
            <h2>{t('prison.yard', 'Prison Yard')}</h2>
          </div>
          <div className="prison-action-grid">
            <button type="button" className="prison-action-card" onClick={() => onAction('workout')}>
              <span className="prison-action-icon">💪</span>
              <strong>{t('prison.workout', 'Yard Workout')}</strong>
              <small>{isArabic ? 'حافظ على صحتك واكسب الاحترام' : 'Build health and respect'}</small>
            </button>
            <button type="button" className="prison-action-card" onClick={() => onAction('library')}>
              <span className="prison-action-icon">📚</span>
              <strong>{t('prison.library', 'Prison Library')}</strong>
              <small>{isArabic ? 'تعلم وخفف التوتر' : 'Learn and reduce stress'}</small>
            </button>
            <button type="button" className="prison-action-card" onClick={() => onAction('gang')}>
              <span className="prison-action-icon">⚠️</span>
              <strong>{t('prison.gangAction', 'Gang Interaction')}</strong>
              <small>{isArabic ? 'نفوذ أكبر ومخاطر أعلى' : 'More influence, more danger'}</small>
            </button>
          </div>
        </section>

        <section className="prison-action-section prison-risk-section">
          <div className="prison-section-heading">
            <span>{isArabic ? 'قرارات خطرة' : 'High-risk choices'}</span>
            <h2>{t('prison.legal', 'Legal & Illegal')}</h2>
          </div>
          <div className="prison-action-grid">
            <button type="button" className="prison-action-card" onClick={() => onAction('appeal')}>
              <span className="prison-action-icon">⚖️</span>
              <strong>{t('prison.appeal', 'Appeal Sentence ($5,000)')}</strong>
              <small>{isArabic ? 'محاولة قانونية لتقليل العقوبة' : 'A legal chance to shorten the sentence'}</small>
            </button>
            <button type="button" className="prison-action-card is-danger" onClick={() => onAction('riot')}>
              <span className="prison-action-icon">🔥</span>
              <strong>{t('prison.riot', 'Incite Riot')}</strong>
              <small>{isArabic ? 'خطر شديد وعقوبة محتملة' : 'Extreme risk and possible punishment'}</small>
            </button>
            <button type="button" className="prison-action-card is-danger" onClick={() => onAction('escape')}>
              <span className="prison-action-icon">🏃</span>
              <strong>{t('prison.escape', 'Escape!')}</strong>
              <small>{isArabic ? 'قد تنجو أو تطول عقوبتك' : 'Freedom or a much longer sentence'}</small>
            </button>
          </div>
        </section>
      </main>

      <div className="prison-bottom-dock">
        <BottomNavigation
          activeDestination="life"
          onNavigate={handleNavigate}
          onPrimaryAction={() => onAction('__advance_month__')}
          onSmartAdvance={() => onAction('__advance_year__')}
          primaryLabel={isArabic ? 'اقضِ شهرا' : 'Serve 1 Month'}
          primaryHint={isArabic ? 'اقضِ شهرا واحدا من مدة السجن.' : 'Serve one month of the sentence.'}
          smartLabel={isArabic ? 'اقضِ سنة' : 'Serve 1 Year'}
          isMonthly
          language={isArabic ? 'ar' : 'en'}
        />
      </div>
    </div>
  );
}
