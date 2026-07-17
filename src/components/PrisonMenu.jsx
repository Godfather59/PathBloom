import React from 'react';
import './Modal.css';

export function PrisonMenu({
  person,
  onAction,
  onSystem,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const isArabic = language === 'ar';
  const storedMonths = Number(person.timeProgress?.prisonMonthsRemaining);
  const remainingMonths = Number.isFinite(storedMonths)
    ? Math.max(0, Math.floor(storedMonths))
    : Math.max(0, Math.round((Number(person.prisonSentence) || 0) * 12));
  const remainingYears = Math.floor(remainingMonths / 12);
  const extraMonths = remainingMonths % 12;
  const sentenceLabel = isArabic
    ? `${remainingYears > 0 ? `${remainingYears} سنة` : ''}${remainingYears > 0 && extraMonths > 0 ? ' و' : ''}${extraMonths > 0 ? `${extraMonths} شهر` : remainingYears === 0 ? 'أقل من شهر' : ''}`
    : `${remainingYears > 0 ? `${remainingYears} year${remainingYears === 1 ? '' : 's'}` : ''}${remainingYears > 0 && extraMonths > 0 ? ', ' : ''}${extraMonths > 0 ? `${extraMonths} month${extraMonths === 1 ? '' : 's'}` : remainingYears === 0 ? 'Less than one month' : ''}`;

  const handleAction = action => {
    onAction(action);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content prison-modal" dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <h2 className="modal-title prison-title">🚔 {t('prison.title', 'State Penitentiary')}</h2>
          <button
            className="close-btn"
            onClick={onSystem}
            aria-label={t('system.title', 'Open system menu')}
          >
            ⚙
          </button>
        </div>

        <div className="modal-body">
          <div className="prison-sentence-card">
            <div className="empty-state-badge">🔒</div>
            <h3>{t('prison.sentence', 'Sentence Remaining')}</h3>
            <div className="prison-sentence-value">{sentenceLabel}</div>
            <div className="prison-meta">
              {t('prison.respect', 'Respect')}: {person.notoriety || 0}% |{' '}
              {t('prison.gang', 'Gang')}:{' '}
              {person.mafia?.family
                ? t('prison.affiliated', 'Affiliated')
                : t('prison.none', 'None')}
            </div>
          </div>

          <div className="prison-time-actions">
            <button
              className="age-skip-btn month-btn"
              onClick={() => handleAction('__advance_month__')}
            >
              🗓️ {isArabic ? 'اقضِ شهرا' : 'Serve 1 Month'}
            </button>
            <button className="age-up-btn" onClick={() => handleAction('__advance_year__')}>
              🎂 {isArabic ? 'اقضِ سنة' : t('prison.serveYear', 'Serve One Year')}
            </button>
          </div>

          <h3 className="prison-section-title">{t('prison.yard', 'Prison Yard')}</h3>
          <div className="activity-grid">
            <button className="list-item activity-card" onClick={() => handleAction('workout')}>
              <span className="activity-token">💪</span>
              <span>{t('prison.workout', 'Yard Workout')}</span>
            </button>
            <button className="list-item activity-card" onClick={() => handleAction('library')}>
              <span className="activity-token">📚</span>
              <span>{t('prison.library', 'Prison Library')}</span>
            </button>
            <button className="list-item activity-card" onClick={() => handleAction('gang')}>
              <span className="activity-token">⚠️</span>
              <span>{t('prison.gangAction', 'Gang Interaction')}</span>
            </button>
          </div>

          <h3 className="prison-section-title prison-legal-title">
            {t('prison.legal', 'Legal & Illegal')}
          </h3>
          <div className="activity-grid">
            <button className="list-item activity-card" onClick={() => handleAction('appeal')}>
              <span className="activity-token">⚖️</span>
              <span>{t('prison.appeal', 'Appeal Sentence ($5,000)')}</span>
            </button>
            <button
              className="list-item activity-card prison-danger-action"
              onClick={() => handleAction('riot')}
            >
              <span className="activity-token">🔥</span>
              <span>{t('prison.riot', 'Incite Riot')}</span>
            </button>
            <button
              className="list-item activity-card prison-danger-action"
              onClick={() => handleAction('escape')}
            >
              <span className="activity-token">🏃</span>
              <span>{t('prison.escape', 'Escape!')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
