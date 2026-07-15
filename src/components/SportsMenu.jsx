import React from 'react';
import { SPORTS } from '../logic/CollegeSports';
import './Modal.css';

export function SportsMenu({
  person,
  onTryout,
  onPractice,
  onPro,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const sport = person.collegeSport;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('sports.title', 'College Athletics')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {sport ? (
            <>
              <div
                style={{
                  background: '#1a237e',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                <strong>
                  {SPORTS.find(s => s.id === sport.sportId)?.name || t('sports.sport', 'Sport')}
                </strong>
                <div>
                  {t('sports.skill', 'Skill')}: {sport.skill}/100
                </div>
                {sport.professionalDraft && (
                  <div style={{ color: '#ffd700' }}>
                    {t('sports.professionalPlayer', 'Professional Player!')}
                  </div>
                )}
              </div>
              <button
                className="btn-primary"
                onClick={onPractice}
                style={{ width: '100%', marginBottom: '8px' }}
              >
                {t('sports.practice', 'Practice')}
              </button>
              {sport.skill >= 80 && !sport.professionalDraft && (
                <button
                  className="btn-primary"
                  onClick={onPro}
                  style={{ width: '100%', background: '#ff6f00' }}
                >
                  {t('sports.goProfessional', 'Go Professional')}
                </button>
              )}
            </>
          ) : (
            <>
              <h3 className="section-heading">{t('sports.tryoutTitle', 'Try Out for a Sport')}</h3>
              <div className="stack-list">
                {SPORTS.map(s => (
                  <button
                    key={s.id}
                    className="list-item"
                    onClick={() => onTryout(s.id)}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div>
                      <strong>{s.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>
                        {t('sports.position', 'Position')}: {s.position}
                      </div>
                    </div>
                    <span style={{ color: '#4caf50' }}>{t('sports.tryout', 'TRYOUT')}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
