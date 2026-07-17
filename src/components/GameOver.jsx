import React from 'react';
import { getLegacyRank, getLegacyScore, getGoalState, LIFE_GOALS } from '../logic/LifeGoals';
import { lifetimeStats } from '../logic/LifetimeStats';
import { familyTree } from '../logic/DynastyMode';
import './GameOver.css';

export function GameOver({
  person,
  achievements = [],
  onRestart,
  allowInheritance = true,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const getNetWorth = () => {
    return typeof person.getTotalEstateValue === 'function'
      ? person.getTotalEstateValue()
      : Number(person.money) || 0;
  };
  const legacyScore = getLegacyScore(person);
  const legacyRank = getLegacyRank(legacyScore);
  const goalState = getGoalState(person);
  const children = person.relationships.filter(r => r.type === 'Child');
  const spouses = person.relationships.filter(r => r.type === 'Spouse');
  const lifetime = lifetimeStats.getStats();
  const genCount = familyTree.getGenerationCount();
  const repRank = familyTree.getReputationRank();
  const totalFamilyWealth = familyTree.getTotalFamilyWealth();

  return (
    <div className="game-over-overlay" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="game-over-heading">{t('gameover.rip', 'R.I.P.')}</h1>

      <div style={{ marginBottom: '25px' }}>
        <h2 className="game-over-name">{person.getFullName()}</h2>
        <p className="game-over-sub">
          {t('gameover.diedAt', 'died at age')} {person.age}.
        </p>
      </div>

      <div className="game-over-card">
        <div className="game-over-legacy-row">
          <span className="game-over-legacy-icon">
            <span className="game-over-legacy-icon-main">{legacyRank.icon}</span>
            <span className="game-over-legacy-label">{t('legacy.score', 'Legacy Score')}:</span>
          </span>
          <span className="game-over-legacy-value">
            {legacyScore.toLocaleString()} · {t(legacyRank.labelKey, legacyRank.label)}
          </span>
        </div>

        <div className="game-over-stat-grid">
          <div className="game-over-stat">
            <div className="game-over-stat-value game-over-stat-value-green">
              ${getNetWorth().toLocaleString()}
            </div>
            <div className="game-over-stat-label">{t('gameover.netWorth', 'Net Worth')}</div>
          </div>
          <div className="game-over-stat">
            <div className="game-over-stat-value game-over-stat-value-gold">{person.fame}%</div>
            <div className="game-over-stat-label">{t('stat.fame', 'Fame')}</div>
          </div>
          <div className="game-over-stat">
            <div
              className="game-over-stat-value"
              style={{
                color: person.karma > 50 ? '#4caf50' : '#f44336',
              }}
            >
              {person.karma}/100
            </div>
            <div className="game-over-stat-label">{t('stat.karma', 'Karma')}</div>
          </div>
          <div className="game-over-stat">
            <div className="game-over-stat-value game-over-stat-value-red">{person.age}</div>
            <div className="game-over-stat-label">{t('gameover.age', 'Age')}</div>
          </div>
        </div>

        <div className="game-over-stat-grid" style={{ gap: '10px' }}>
          <div className="game-over-stat">
            <div className="game-over-stat-value game-over-stat-value-green">{spouses.length}</div>
            <div className="game-over-stat-label">{t('gameover.marriages', 'Marriages')}</div>
          </div>
          <div className="game-over-stat">
            <div className="game-over-stat-value game-over-stat-value-gold">{children.length}</div>
            <div className="game-over-stat-label">{t('gameover.children', 'Children')}</div>
          </div>
          <div className="game-over-stat">
            <div className="game-over-stat-value game-over-stat-value-blue">
              {person.educationHistory?.length || 0}
            </div>
            <div className="game-over-stat-label">{t('gameover.degrees', 'Degrees')}</div>
          </div>
          <div className="game-over-stat">
            <div className="game-over-stat-value game-over-stat-value-orange">
              {(person.history || []).length}
            </div>
            <div className="game-over-stat-label">{t('gameover.events', 'Life Events')}</div>
          </div>
        </div>

        <div className="game-over-section" style={{ marginBottom: '18px' }}>
          <div className="game-over-info-row">
            <span>{t('gameover.career', 'Career')}:</span>
            <span className="game-over-info-value">
              {person.job ? person.job.title : t('hud.unemployed', 'Unemployed')}
            </span>
          </div>
          <div className="game-over-info-row" style={{ marginBottom: 0 }}>
            <span>{t('gameover.education', 'Education')}:</span>
            <span className="game-over-info-value">
              {person.education || t('gameover.none', 'None')}
            </span>
          </div>
        </div>

        <div className="game-over-section" style={{ marginBottom: '18px' }}>
          <div className="game-over-section-title">
            {legacyRank.icon} {t('gameover.lifeGoals', 'Life Goals Completed')}:{' '}
            {goalState.completed.length}/{LIFE_GOALS.length}
          </div>
          <div className="game-over-goal-row">
            {LIFE_GOALS.map(goal => {
              const completed = goal.complete(person);
              return (
                <span
                  key={goal.id}
                  className={`goal-pill${completed ? ' goal-pill-done' : ' goal-pill-pending'}`}
                >
                  <span>{goal.icon}</span>
                  <span>{t(goal.titleKey, goal.title)}</span>
                </span>
              );
            })}
          </div>
        </div>

        {achievements.length > 0 && (
          <div className="game-over-section" style={{ marginBottom: '18px' }}>
            <div className="game-over-section-title">
              🏆 {t('gameover.achievements', 'Achievements Unlocked')}: {achievements.length}
            </div>
            <div className="achievement-row">
              {achievements.slice(0, 8).map(id => (
                <span key={id} className="achievement-pill">
                  🏆 {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {lifetime.livesLived > 0 && (
          <div className="game-over-section">
            <div className="game-over-section-title game-over-section-title-gold">
              📜 {t('gameover.lifetimeStats', 'Lifetime Legacy')}
            </div>
            <div className="game-over-sub-grid">
              <div className="game-over-sub-stat">
                <div className="game-over-sub-stat-value" style={{ color: '#ffd700' }}>
                  {lifetime.livesLived}
                </div>
                <div className="game-over-sub-stat-label">
                  {t('gameover.livesLived', 'Lives Lived')}
                </div>
              </div>
              <div className="game-over-sub-stat">
                <div className="game-over-sub-stat-value" style={{ color: '#4caf50' }}>
                  {lifetime.totalYearsLived}
                </div>
                <div className="game-over-sub-stat-label">
                  {t('gameover.totalYears', 'Total Years')}
                </div>
              </div>
              <div className="game-over-sub-stat">
                <div className="game-over-sub-stat-value" style={{ color: '#ffd700' }}>
                  {lifetime.totalChildrenBorn}
                </div>
                <div className="game-over-sub-stat-label">
                  {t('gameover.totalChildren', 'Total Children')}
                </div>
              </div>
              <div className="game-over-sub-stat">
                <div className="game-over-sub-stat-value" style={{ color: '#2196f3' }}>
                  {Object.keys(lifetime.jobsHeld).length}
                </div>
                <div className="game-over-sub-stat-label">
                  {t('gameover.careersHad', 'Careers Held')}
                </div>
              </div>
            </div>
          </div>
        )}
        {genCount > 0 && (
          <div className="game-over-section" style={{ marginTop: '16px' }}>
            <div className="game-over-section-title game-over-section-title-gold">
              {repRank.icon} {t('gameover.familyLegacy', 'Family Dynasty')}
            </div>
            <div className="game-over-sub-grid">
              <div className="game-over-sub-stat" style={{ background: 'rgba(255,215,0,0.04)' }}>
                <div className="game-over-sub-stat-value" style={{ color: '#ffd700' }}>
                  {genCount}
                </div>
                <div className="game-over-sub-stat-label">
                  {t('gameover.generations', 'Generations')}
                </div>
              </div>
              <div className="game-over-sub-stat" style={{ background: 'rgba(76,175,80,0.04)' }}>
                <div className="game-over-sub-stat-value" style={{ color: '#4caf50' }}>
                  $
                  {totalFamilyWealth >= 1000000000
                    ? `${(totalFamilyWealth / 1000000000).toFixed(1)}B`
                    : totalFamilyWealth >= 1000000
                      ? `${(totalFamilyWealth / 1000000).toFixed(1)}M`
                      : totalFamilyWealth.toLocaleString()}
                </div>
                <div className="game-over-sub-stat-label">
                  {t('gameover.familyWealth', 'Family Wealth')}
                </div>
              </div>
              <div className="game-over-sub-stat" style={{ background: 'rgba(255,152,0,0.04)' }}>
                <div className="game-over-sub-stat-value" style={{ color: '#ff9800' }}>
                  {familyTree.familyReputation}
                </div>
                <div className="game-over-sub-stat-label">
                  {t('gameover.reputation', 'Reputation')}
                </div>
              </div>
              <div className="game-over-sub-stat" style={{ background: 'rgba(33,150,243,0.04)' }}>
                <div className="game-over-sub-stat-value" style={{ color: '#2196f3' }}>
                  {repRank.title}
                </div>
                <div className="game-over-sub-stat-label">{t('gameover.rank', 'Rank')}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="game-over-actions">
        <button onClick={() => onRestart(null)} className="game-over-btn game-over-btn-restart">
          🌱 {t('gameover.startNewLife', 'Start New Life')}
        </button>

        {allowInheritance && children.length > 0 && (
          <div className="child-section">
            <h3 className="child-section-title">
              🌳 {t('gameover.continueAsChild', 'Continue as Child')}
            </h3>
            <div className="child-btn-row">
              {children.map(child => (
                <button key={child.id} onClick={() => onRestart(child)} className="child-btn">
                  <span className="child-btn-name">
                    {child.name} (Age {child.age || '?'})
                  </span>
                  {child.traits && child.traits.length > 0 && (
                    <span className="child-btn-traits">{child.traits.join(', ')}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
