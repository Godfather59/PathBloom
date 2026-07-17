import React, { memo, useMemo, useState } from 'react';
import { ensurePlayerJourney, getJourneyGoals, getJourneyView } from '../logic/PlayerJourney';
import { formatArabicNumber } from '../logic/ArabicLocalization';
import './ReleasePolish.css';

function number(value, language) {
  return language === 'ar'
    ? formatArabicNumber(value, { maximumFractionDigits: 0 })
    : Number(value || 0).toLocaleString('en-US');
}

function dispatchJourneyAction(action) {
  if (typeof window === 'undefined' || !action) {
    return;
  }
  window.dispatchEvent(new CustomEvent('pathbloom-journey-action', { detail: { action } }));
}

function storedGuidedPreference() {
  try {
    return localStorage.getItem('pathbloom_guided_journey') === 'true';
  } catch {
    return false;
  }
}

export const JourneyCard = memo(({ person, language = 'en', onAction, onAgeUp }) => {
  const [expanded, setExpanded] = useState(false);
  const locale = language === 'ar' ? 'ar' : 'en';
  const hadJourney = Boolean(person?.playerJourney);
  const journey = ensurePlayerJourney(person, {
    newLife: !hadJourney && storedGuidedPreference(),
  });
  const view = useMemo(() => getJourneyView(person, locale), [person, locale]);
  const goals = useMemo(() => getJourneyGoals(person, locale), [person, locale]);

  if (!journey?.guidedEnabled) {
    return null;
  }

  const percent = Math.max(0, Math.min(100, Math.round((view.value / view.target) * 100) || 0));
  const progressLabel = `${number(view.completedCount, locale)}/${number(view.totalCount, locale)}`;
  const copy =
    locale === 'ar'
      ? {
          kicker: 'رحلة البداية',
          reward: 'المكافأة',
          progress: 'التقدم',
          show: 'اعرض كل الأهداف',
          hide: 'أخفِ الأهداف',
          blocked: 'سدّد الدين الشخصي أولا',
          completed: 'مكتمل',
        }
      : {
          kicker: 'Starter journey',
          reward: 'Reward',
          progress: 'Progress',
          show: 'Show all goals',
          hide: 'Hide goals',
          blocked: 'Clear overdue personal debt first',
          completed: 'Completed',
        };

  const handleCta = () => {
    if (view.complete) {
      setExpanded(value => !value);
      return;
    }
    if (view.action === 'age_up') {
      if (onAgeUp) {
        onAgeUp();
      } else {
        dispatchJourneyAction('age_up');
      }
      return;
    }
    if (onAction) {
      onAction(view.action);
    } else {
      dispatchJourneyAction(view.action);
    }
  };

  return (
    <section
      className={`journey-card ${view.complete ? 'is-complete' : ''}`}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="journey-card-heading">
        <span className="journey-card-icon" aria-hidden="true">
          {view.icon}
        </span>
        <div className="journey-card-copy">
          <span className="journey-card-kicker">
            {copy.kicker} · {progressLabel}
          </span>
          <h2>{view.title}</h2>
          <p>{view.body}</p>
        </div>
        <button
          type="button"
          className="journey-expand-button"
          onClick={() => setExpanded(value => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? copy.hide : copy.show}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      {!view.complete && (
        <>
          <div className="journey-progress-row">
            <span>{copy.progress}</span>
            <strong>
              {number(Math.min(view.value, view.target), locale)}/{number(view.target, locale)}
            </strong>
          </div>
          <div className="journey-progress-track" aria-hidden="true">
            <span style={{ width: `${percent}%` }} />
          </div>
          <div className="journey-card-footer">
            <span className="journey-reward">
              🎁 {copy.reward}: {view.reward}
            </span>
            <button type="button" onClick={handleCta} disabled={view.blocked}>
              {view.blocked ? copy.blocked : view.cta}
            </button>
          </div>
        </>
      )}

      {expanded && (
        <div className="journey-goal-list">
          {goals.map((goal, index) => {
            const goalPercent = Math.max(
              0,
              Math.min(100, Math.round((goal.value / goal.target) * 100) || 0)
            );
            return (
              <div
                key={goal.id}
                className={`journey-goal-row ${goal.complete ? 'is-complete' : ''}`}
              >
                <span className="journey-goal-order">
                  {goal.complete ? '✓' : number(index + 1, locale)}
                </span>
                <span className="journey-goal-icon" aria-hidden="true">
                  {goal.icon}
                </span>
                <span className="journey-goal-copy">
                  <strong>{goal.title}</strong>
                  <small>{goal.complete ? copy.completed : goal.reward}</small>
                  {!goal.complete && (
                    <span className="journey-goal-mini">
                      <i style={{ width: `${goalPercent}%` }} />
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
});

export default JourneyCard;
