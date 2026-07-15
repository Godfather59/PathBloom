import React, { memo } from 'react';
import { getGoalState, getLegacyRank, getLegacyScore } from '../logic/LifeGoals';
import { getAmbitionView } from '../logic/LifeAmbitions';

export const GoalsPanel = memo(
  ({ person, language = 'en', t = (key, fallback) => fallback || key, onOpenAmbitions }) => {
    if (!person) {
      return null;
    }

    const goalState = getGoalState(person);
    const score = getLegacyScore(person);
    const rank = getLegacyRank(score);
    const ambition = getAmbitionView(person, language);
    const visibleGoals =
      goalState.active.length > 0 ? goalState.active : goalState.completed.slice(-3);
    const translateProgress = progressText => {
      if (progressText === 'Not yet') {
        return t('goals.notYet', 'Not yet');
      }
      if (progressText === 'Unemployed') {
        return t('hud.unemployed', 'Unemployed');
      }
      return progressText;
    };

    return (
      <section
        className="goals-panel"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        aria-label={t('goals.title', 'Life Goals')}
      >
        <div className="goals-panel-top">
          <div>
            <div className="goals-label">🎯 {t('goals.title', 'Life Goals')}</div>
            <div className="goals-progress">
              {goalState.completed.length}/{goalState.goals.length}{' '}
              {t('goals.completed', 'completed')}
            </div>
          </div>
          <div className="goals-panel-actions">
            <button
              type="button"
              className={`ambition-pill ${ambition.selected ? 'selected' : ''}`}
              onClick={onOpenAmbitions}
              aria-label={
                ambition.selected
                  ? `${t('ambitions.title', 'Life Ambitions')}: ${ambition.path.name}`
                  : t('ambitions.choose', 'Choose ambition')
              }
            >
              <span>{ambition.selected ? ambition.path.icon : '🧭'}</span>
              <span>
                {ambition.selected
                  ? `${ambition.completionPercent}%`
                  : t('ambitions.choose', 'Choose ambition')}
              </span>
            </button>
            <div className="legacy-score-pill">
              <span>{rank.icon}</span>
              <span>{score.toLocaleString(language === 'ar' ? 'ar-MA' : 'en-US')}</span>
            </div>
          </div>
        </div>

        <div className="goal-chip-row">
          {visibleGoals.map(goal => (
            <div key={goal.id} className={`goal-chip ${goal.completed ? 'done' : ''}`}>
              <span className="goal-chip-icon" aria-hidden="true">
                {goal.completed ? '✅' : goal.icon}
              </span>
              <span className="goal-chip-text">
                <strong>{t(goal.titleKey, goal.title)}</strong>
                <small>
                  {goal.completed ? t('goals.done', 'Done') : translateProgress(goal.progressText)}
                </small>
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }
);
