import React from 'react';
import { SUBSTANCES } from '../logic/Addiction';
import './Modal.css';

export function AddictionMenu({
  person,
  onUse,
  onRehab,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const hasAddictions = Object.values(person.addictionLevels || {}).some(level => level > 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('addiction.title', 'Substances')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {hasAddictions && (
            <div
              style={{
                background: '#ff1744',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '12px',
                textAlign: 'center',
              }}
            >
              {t('addiction.activeWarning', 'You have active addictions! Consider rehab.')}
            </div>
          )}
          <div className="stack-list">
            {Object.entries(SUBSTANCES).map(([type, sub]) => {
              const level = person.addictionLevels?.[type] || 0;
              const isAddicted = level > 0;
              return (
                <button
                  key={type}
                  className="list-item"
                  onClick={() => onUse(type)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <strong>{sub.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      {t('addiction.cost', 'Cost: $')}
                      {sub.cost}
                    </div>
                    {isAddicted && (
                      <div style={{ fontSize: '0.75rem', color: '#ff1744' }}>
                        {t('addiction.level', 'Addiction: ')}
                        {level}/100
                      </div>
                    )}
                  </div>
                  <span className={`cost-pill ${isAddicted ? 'paid' : 'free'}`}>
                    {isAddicted ? t('addiction.addicted', 'ADDICTED') : t('addiction.use', 'USE')}
                  </span>
                </button>
              );
            })}
          </div>
          {hasAddictions && (
            <button
              className="btn-primary"
              onClick={() => onRehab(null)}
              style={{ marginTop: '12px', width: '100%', background: '#00c853' }}
            >
              {t('addiction.rehab', 'Enter Rehab ($5k+)')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
