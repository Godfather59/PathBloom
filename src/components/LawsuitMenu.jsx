import React from 'react';
import { LAWSUIT_GROUNDS } from '../logic/Lawsuits';
import './Modal.css';

export function LawsuitMenu({
  person,
  onFileLawsuit,
  onSueRandom,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const activeLawsuits = person.activeLawsuits || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('lawsuit.title', 'Legal Actions')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {activeLawsuits.length > 0 && (
            <div
              style={{
                background: '#b71c1c',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            >
              {t(
                'lawsuit.activeWarning',
                `You have ${activeLawsuits.length} active lawsuit${activeLawsuits.length > 1 ? 's' : ''} against you!`
              )}
            </div>
          )}

          {person.lawsuitHistory?.length > 0 && (
            <div
              style={{
                background: '#1a1a2e',
                padding: '8px',
                borderRadius: '6px',
                marginBottom: '12px',
                fontSize: '0.8rem',
              }}
            >
              {t(
                'lawsuit.pastLawsuits',
                `Past Lawsuits: ${person.lawsuitHistory.filter(l => l.success).length} won, ${person.lawsuitHistory.filter(l => !l.success).length} lost`
              )}
            </div>
          )}

          <h3 className="section-heading">{t('lawsuit.fileLawsuit', 'File a Lawsuit')}</h3>
          <div className="stack-list">
            {LAWSUIT_GROUNDS.map(ground => (
              <button
                key={ground.id}
                className="list-item"
                onClick={() => onFileLawsuit(ground.id)}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <div>
                  <strong>{ground.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#888' }}>
                    {t(
                      'lawsuit.feeInfo',
                      `Fee: $${ground.filingFee.toLocaleString()} | Avg Award: $${ground.baseAward.toLocaleString()}`
                    )}
                  </div>
                </div>
                <span className="cost-pill paid">${ground.filingFee.toLocaleString()}</span>
              </button>
            ))}
          </div>

          {person.relationships.length >= 2 && (
            <button
              className="btn-secondary"
              onClick={onSueRandom}
              style={{ marginTop: '12px', width: '100%' }}
            >
              {t('lawsuit.sueRandom', 'Sue Someone Random')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
