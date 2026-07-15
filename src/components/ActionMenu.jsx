import React, { memo } from 'react';
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
  ({ onAgeUp, onAction, onAgeSkip, t = (key, fallback) => fallback || key }) => {
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

        <div className="age-actions">
          <button className="age-up-btn" onClick={onAgeUp}>
            🎂 {t('action.ageUp', 'Age Up')}
          </button>
          <button
            className="age-skip-btn"
            onClick={() => onAgeSkip(5)}
            title={t('action.smartSkipHint', 'Stops when an important decision needs you.')}
          >
            ⏩ {t('action.smartSkip5', 'Smart +5')}
          </button>
          <button
            className="age-skip-btn warning"
            onClick={() => onAgeSkip(10)}
            title={t('action.smartSkipHint', 'Stops when an important decision needs you.')}
          >
            🚀 {t('action.smartSkip10', 'Smart +10')}
          </button>
        </div>
      </div>
    );
  }
);
