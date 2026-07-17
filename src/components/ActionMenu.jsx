import React, { memo } from 'react';
import {
  getActiveMonthlySituation,
  getCurrentTimePerson,
  getSituationLabel,
} from '../logic/TimeProgression';
import './ActionMenu.css';

const ACTIONS = [
  { id: 'occupation', labelKey: 'action.occupation', label: 'Occupation', emoji: '💼' },
  { id: 'activities', labelKey: 'action.activities', label: 'Activities', emoji: '🎯' },
  { id: 'relationships', labelKey: 'action.relationships', label: 'Relationships', emoji: '❤️' },
  { id: 'assets', labelKey: 'action.assets', label: 'Assets', emoji: '🏠' },
  { id: 'education', labelKey: 'action.education', label: 'Education', emoji: '📚' },
  { id: 'pets', labelKey: 'action.pets', label: 'Pets', emoji: '🐾' },
  { id: 'travel', labelKey: 'action.travel', label: 'Travel', emoji: '✈️' },
];

export const ActionMenu = memo(
  ({ onAgeUp, onAction, onAgeSkip, language = 'en', t = (key, fallback) => fallback || key }) => {
    const person = getCurrentTimePerson();
    const activeSituation = getActiveMonthlySituation(person);
    const isArabic = language === 'ar';

    return (
      <div className="action-menu">
        <div className="action-menu-grid">
          {ACTIONS.map(action => (
            <button key={action.id} className="action-btn" onClick={() => onAction(action.id)}>
              <span className="action-icon" aria-hidden="true">
                {action.emoji}
              </span>
              <span className="action-label">{t(action.labelKey, action.label)}</span>
            </button>
          ))}
        </div>

        {activeSituation && (
          <div className="time-situation" role="status">
            <span aria-hidden="true">{activeSituation.icon}</span>
            <span>
              {isArabic ? 'تقدم شهري متاح:' : 'Monthly progression available:'}{' '}
              <strong>{getSituationLabel(activeSituation, language)}</strong>
            </span>
          </div>
        )}

        <div className={`age-actions ${activeSituation ? 'is-monthly' : 'is-normal'}`}>
          {activeSituation ? (
            <>
              <button
                className="age-skip-btn month-btn"
                onClick={() => onAgeSkip('month')}
                title={
                  isArabic
                    ? 'تقدم شهرا واحدا داخل الحالة الحالية.'
                    : 'Advance one month inside the active situation.'
                }
              >
                🗓️ {isArabic ? 'شهر واحد' : '1 Month'}
              </button>
              <button
                className="age-up-btn"
                onClick={() => onAgeSkip('smart_months')}
                title={
                  isArabic
                    ? 'تقدم حتى 12 شهرا وتوقف عند أي قرار مهم.'
                    : 'Advance up to 12 months and stop for decisions.'
                }
              >
                ⏩ {isArabic ? 'ذكي +12 شهرا' : 'Smart +12 Months'}
              </button>
            </>
          ) : (
            <>
              <button
                className="age-skip-btn"
                onClick={() => onAgeSkip(5)}
                title={t('action.smartSkipHint', 'Stops when an important decision needs you.')}
              >
                ⏩ {t('action.smartSkip5', 'Smart +5')}
              </button>
              <button className="age-up-btn" onClick={onAgeUp}>
                🎂 {t('action.ageUp', 'Age Up')}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
);
