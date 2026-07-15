import React from 'react';
import './Modal.css';

export function PrisonMenu({
  person,
  onAction,
  onAgeUp,
  onSystem,
  t = (key, fallback) => fallback || key,
}) {
  // If we wanted a sub-modal state, we could add it here

  const handleAction = action => {
    onAction(action);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ border: '2px solid #ff4444' }}>
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: '#ff4444' }}>
            🚔 {t('prison.title', 'State Penitentiary')}
          </h2>
          <button
            className="close-btn"
            onClick={onSystem}
            aria-label={t('system.title', 'Open system menu')}
          >
            ⚙
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              padding: '15px',
              background: 'rgba(255,0,0,0.1)',
              borderRadius: '8px',
            }}
          >
            <div className="empty-state-badge">🔒</div>
            <h3>{t('prison.sentence', 'Sentence Remaining')}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
              {person.prisonSentence} {t('prison.years', 'Years')}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '5px' }}>
              {t('prison.respect', 'Respect')}: {person.notoriety || 0}% |{' '}
              {t('prison.gang', 'Gang')}:{' '}
              {person.mafia?.family
                ? t('prison.affiliated', 'Affiliated')
                : t('prison.none', 'None')}
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid #ff4444' }}>{t('prison.yard', 'Prison Yard')}</h3>
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

          <button className="btn-primary" onClick={onAgeUp} style={{ marginBottom: '20px' }}>
            🎂 {t('prison.serveYear', 'Serve One Year')}
          </button>

          <h3 style={{ borderBottom: '1px solid #ff4444', marginTop: '20px' }}>
            {t('prison.legal', 'Legal & Illegal')}
          </h3>
          <div className="activity-grid">
            <button className="list-item activity-card" onClick={() => handleAction('appeal')}>
              <span className="activity-token">⚖️</span>
              <span>{t('prison.appeal', 'Appeal Sentence ($5,000)')}</span>
            </button>
            <button
              className="list-item activity-card"
              onClick={() => handleAction('riot')}
              style={{ borderColor: '#ff4444', color: '#ff4444' }}
            >
              <span className="activity-token">🔥</span>
              <span>{t('prison.riot', 'Incite Riot')}</span>
            </button>
            <button
              className="list-item activity-card"
              onClick={() => handleAction('escape')}
              style={{ borderColor: '#ff4444', color: '#ff4444' }}
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
