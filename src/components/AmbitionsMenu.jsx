import React, { useMemo, useState } from 'react';
import {
  AMBITION_PATHS,
  evaluateAmbition,
  getAmbitionView,
  localizeAmbition,
  selectAmbition,
} from '../logic/LifeAmbitions';
import './Modal.css';
import './AmbitionsMenu.css';

function rewardSummary(reward, language) {
  const parts = [];
  if (reward?.points) {
    parts.push(`+${reward.points} ${language === 'ar' ? 'نقطة' : 'points'}`);
  }
  if (reward?.money) {
    parts.push(`+$${Number(reward.money).toLocaleString(language === 'ar' ? 'ar-MA' : 'en-US')}`);
  }
  const statNames =
    language === 'ar'
      ? {
          happiness: 'السعادة',
          health: 'الصحة',
          smarts: 'الذكاء',
          looks: 'المظهر',
          karma: 'الكارما',
          fame: 'الشهرة',
          notoriety: 'السمعة الإجرامية',
        }
      : {
          happiness: 'happiness',
          health: 'health',
          smarts: 'smarts',
          looks: 'looks',
          karma: 'karma',
          fame: 'fame',
          notoriety: 'notoriety',
        };
  for (const [stat, amount] of Object.entries(reward?.stats || {})) {
    parts.push(`+${amount} ${statNames[stat] || stat}`);
  }
  return parts.join(' · ');
}

export function AmbitionsMenu({
  person,
  onUpdate,
  onClose,
  language = 'en',
  t = (_key, fallback) => fallback,
}) {
  const isArabic = language === 'ar';
  const view = useMemo(() => getAmbitionView(person, language), [person, language]);
  const [pendingPathId, setPendingPathId] = useState(null);
  const tr = (key, english, arabic) => t(key, isArabic ? arabic : english);

  const choosePath = pathId => {
    if (typeof onUpdate !== 'function') {
      return;
    }
    onUpdate(nextPerson => {
      const result = selectAmbition(nextPerson, pathId, { language });
      if (result.success) {
        evaluateAmbition(nextPerson, { language });
      }
    });
    setPendingPathId(null);
  };

  const checkProgress = () => {
    if (typeof onUpdate !== 'function') {
      return;
    }
    onUpdate(nextPerson => evaluateAmbition(nextPerson, { language }));
  };

  return (
    <div className="modal-overlay" dir={isArabic ? 'rtl' : 'ltr'}>
      <div
        className="modal-content ambitions-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ambitions-title"
      >
        <div className="modal-header">
          <div>
            <h2 id="ambitions-title" className="modal-title">
              🧭 {tr('ambitions.title', 'Life Ambitions', 'طموحات الحياة')}
            </h2>
            <p className="ambitions-kicker">
              {tr(
                'ambitions.subtitle',
                'Choose what this life will stand for.',
                'اختر ما ستمثله هذه الحياة.'
              )}
            </p>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label={tr('common.close', 'Close', 'إغلاق')}
          >
            &times;
          </button>
        </div>

        <div className="modal-body ambitions-body">
          {!view.selected ? (
            <>
              <div className="ambitions-warning" role="note">
                <span aria-hidden="true">🔒</span>
                <span>
                  {tr(
                    'ambitions.permanentChoice',
                    'Your ambition is permanent for this life. Choose carefully.',
                    'طموحك دائم في هذه الحياة، لذلك اختر بعناية.'
                  )}
                </span>
              </div>

              <div className="ambitions-path-grid">
                {AMBITION_PATHS.map(path => {
                  const pending = pendingPathId === path.id;
                  const localizedName = localizeAmbition(path.name, language);
                  return (
                    <article
                      key={path.id}
                      className="ambition-path-card"
                      style={{ '--ambition-color': path.color }}
                    >
                      <button
                        type="button"
                        className="ambition-path-select"
                        onClick={() => setPendingPathId(pending ? null : path.id)}
                        aria-expanded={pending}
                      >
                        <span className="ambition-path-icon" aria-hidden="true">
                          {path.icon}
                        </span>
                        <span className="ambition-path-copy">
                          <strong>{t(`ambitions.${path.id}.name`, localizedName)}</strong>
                          <small>
                            {t(
                              `ambitions.${path.id}.description`,
                              localizeAmbition(path.description, language)
                            )}
                          </small>
                          <span className="ambition-stage-count">
                            {path.stages.length} {tr('ambitions.milestones', 'milestones', 'مراحل')}
                          </span>
                        </span>
                      </button>

                      {pending && (
                        <div className="ambition-confirm">
                          <p>
                            {tr(
                              'ambitions.confirmQuestion',
                              `Commit to ${localizedName}? You cannot switch paths later.`,
                              `هل تلتزم بمسار «${localizedName}»؟ لن تتمكن من تغييره لاحقاً.`
                            )}
                          </p>
                          <div className="ambition-confirm-actions">
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => setPendingPathId(null)}
                            >
                              {tr('common.cancel', 'Cancel', 'إلغاء')}
                            </button>
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => choosePath(path.id)}
                            >
                              {tr('ambitions.commit', 'Commit', 'التزام')}
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <section className="ambition-hero" style={{ '--ambition-color': view.path.color }}>
                <div className="ambition-hero-heading">
                  <span className="ambition-hero-icon" aria-hidden="true">
                    {view.path.icon}
                  </span>
                  <div>
                    <span className="ambitions-kicker">
                      {tr('ambitions.yourPath', 'Your path', 'مسارك')}
                    </span>
                    <h3>{view.path.name}</h3>
                  </div>
                  <span className="ambition-points">
                    ✦ {view.state.points.toLocaleString(isArabic ? 'ar-MA' : 'en-US')}
                  </span>
                </div>
                <p>{view.path.description}</p>
                <div className="ambition-total-progress">
                  <div className="ambition-total-label">
                    <span>
                      {view.completedCount}/{view.totalStages}{' '}
                      {tr('ambitions.complete', 'complete', 'مكتمل')}
                    </span>
                    <strong>{view.completionPercent}%</strong>
                  </div>
                  <div
                    className="ambition-progress-track"
                    aria-label={tr('ambitions.progress', 'Ambition progress', 'تقدم الطموح')}
                  >
                    <span style={{ width: `${view.completionPercent}%` }} />
                  </div>
                </div>
              </section>

              {view.state.completed && (
                <div className="ambition-complete-banner" role="status">
                  <span aria-hidden="true">🏆</span>
                  <div>
                    <strong>
                      {tr('ambitions.pathComplete', 'Ambition fulfilled!', 'تحقق الطموح!')}
                    </strong>
                    <small>
                      {tr(
                        'ambitions.pathCompleteHint',
                        'This life has achieved something extraordinary.',
                        'حققت هذه الحياة شيئاً استثنائياً.'
                      )}
                    </small>
                  </div>
                </div>
              )}

              <div className="ambition-stage-list">
                {view.stages.map((stage, index) => {
                  const status = stage.completed
                    ? 'completed'
                    : stage.ageLocked
                      ? 'locked'
                      : stage.current
                        ? 'current'
                        : 'future';
                  const progressWidth = stage.completed
                    ? 100
                    : Math.round(stage.progress.ratio * 100);
                  return (
                    <article key={stage.id} className={`ambition-stage ${status}`}>
                      <div className="ambition-stage-marker">
                        {stage.completed ? '✓' : stage.ageLocked ? '🔒' : index + 1}
                      </div>
                      <div className="ambition-stage-main">
                        <div className="ambition-stage-heading">
                          <div>
                            <strong>
                              {stage.icon} {stage.name}
                            </strong>
                            <span>{stage.description}</span>
                          </div>
                          <span className="ambition-age-pill">
                            {stage.completed
                              ? tr('ambitions.done', 'Done', 'مكتمل')
                              : `${tr('ambitions.age', 'Age', 'العمر')} ${stage.minAge}+`}
                          </span>
                        </div>

                        {!stage.ageLocked && !stage.completed && (
                          <div className="ambition-stage-progress">
                            <div>
                              <span>{stage.progressText}</span>
                              <span>{progressWidth}%</span>
                            </div>
                            <div className="ambition-progress-track">
                              <span style={{ width: `${progressWidth}%` }} />
                            </div>
                          </div>
                        )}

                        <div className="ambition-reward">
                          <span aria-hidden="true">🎁</span>
                          <span>
                            {tr('ambitions.reward', 'Reward', 'المكافأة')}:{' '}
                            {rewardSummary(stage.reward, language)}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {!view.state.completed && (
                <button
                  type="button"
                  className="btn-primary ambition-check-button"
                  onClick={checkProgress}
                >
                  🔄 {tr('ambitions.checkProgress', 'Check Progress', 'تحقق من التقدم')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
