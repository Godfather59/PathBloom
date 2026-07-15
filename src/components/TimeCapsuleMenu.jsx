import React, { useState } from 'react';
import { checkTimeCapsuleMilestone, MILESTONE_AGES } from '../logic/TimeCapsule';
import './Modal.css';

export function TimeCapsuleMenu({
  person,
  onWrite,
  onRead,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [message, setMessage] = useState('');
  const capsules = person.timeCapsules || [];
  const memories = person.memories || [];
  const canWrite = checkTimeCapsuleMilestone(person);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('timecapsule.title', 'Memories')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {canWrite && (
            <div
              style={{
                background: '#1a237e',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            >
              <strong>{t('timecapsule.milestoneAge', `Milestone Age ${person.age}!`)}</strong>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={t(
                    'timecapsule.placeholder',
                    'Write a message to your future self...'
                  )}
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#0d0d1a',
                    border: '1px solid #333',
                    color: '#fff',
                    borderRadius: '4px',
                  }}
                />
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (message) {
                      onWrite(message);
                    }
                    setMessage('');
                  }}
                >
                  {t('timecapsule.save', 'Save')}
                </button>
              </div>
            </div>
          )}

          {capsules.length > 0 && (
            <>
              <h3 className="section-heading">
                {t('timecapsule.timeCapsules', `Time Capsules (${capsules.length})`)}
              </h3>
              <div className="stack-list">
                {capsules.map((c, i) => (
                  <button
                    key={i}
                    className="list-item"
                    onClick={() => onRead(i)}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div>
                      <strong>{t('timecapsule.capsuleAge', `Age ${c.age}`)}</strong>
                      {c.milestoneAge && (
                        <span style={{ color: '#ffd700', marginLeft: '8px', fontSize: '0.8rem' }}>
                          {t('timecapsule.milestoneTag', 'Milestone!')}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#888' }}>
                      {c.message?.substring(0, 30)}...
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          <h3 className="section-heading">
            {t('timecapsule.lifeMemories', `Life Memories (${memories.length})`)}
          </h3>
          <div className="stack-list">
            {memories
              .slice(-10)
              .reverse()
              .map((m, i) => (
                <div key={i} className="list-item" style={{ cursor: 'default' }}>
                  <div>
                    <span style={{ color: '#ffd700' }}>
                      {t('timecapsule.memoryAge', `Age ${m.age}`)}
                    </span>{' '}
                    - {m.type}
                    {m.details && (
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{m.details}</div>
                    )}
                  </div>
                </div>
              ))}
            {memories.length === 0 && (
              <div style={{ color: '#888', padding: '12px', textAlign: 'center' }}>
                {t('timecapsule.noMemories', 'No memories yet. Live your life!')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
