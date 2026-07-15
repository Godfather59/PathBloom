import React from 'react';
import { CHALLENGES, getChallengeById, getChallengeProgress } from '../logic/ChallengeMode';
import './Modal.css';

export function ChallengeMenu({ person, onClose }) {
  const active = getChallengeById(person.activeChallenge?.id);
  const completedIds = person.completedChallenges || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', maxHeight: '88vh' }}>
        <div className="modal-header">
          <h2 className="modal-title">Challenges</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {active ? (
            <div
              className="list-item"
              style={{
                borderLeft: person.activeChallenge.completed
                  ? '3px solid #4caf50'
                  : person.activeChallenge.failed
                    ? '3px solid #ef5350'
                    : '3px solid #42a5f5',
              }}
            >
              <span className="list-item-title">{active.name}</span>
              <span className="list-item-subtitle">{active.description}</span>
              <div style={{ marginTop: '12px', fontWeight: 700 }}>
                {person.activeChallenge.completed
                  ? 'Completed'
                  : person.activeChallenge.failed
                    ? 'Failed'
                    : getChallengeProgress(person)}
              </div>
              {person.activeChallenge.message && (
                <div style={{ marginTop: '8px', color: '#aaa', fontSize: '0.9rem' }}>
                  {person.activeChallenge.message}
                </div>
              )}
            </div>
          ) : (
            <div className="list-item">
              <span className="list-item-title">No Active Challenge</span>
              <span className="list-item-subtitle">
                Start a challenge from the main menu when creating a new life.
              </span>
            </div>
          )}

          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>
            🎯 Challenge List
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {CHALLENGES.filter(challenge => challenge.available !== false).map(challenge => (
              <div
                key={challenge.id}
                className="list-item"
                style={{ marginBottom: 0, opacity: completedIds.includes(challenge.id) ? 1 : 0.75 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', minWidth: 0 }}>
                    <span className="activity-row-emoji" aria-hidden="true">
                      {challenge.icon}
                    </span>
                    <div>
                      <span className="list-item-title">{challenge.name}</span>
                      <span className="list-item-subtitle">{challenge.description}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      color: completedIds.includes(challenge.id) ? '#4caf50' : '#aaa',
                      fontWeight: 700,
                    }}
                  >
                    {completedIds.includes(challenge.id) ? '✅ Done' : challenge.difficulty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
