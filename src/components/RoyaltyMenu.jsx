import React from 'react';
import './Modal.css';

export function RoyaltyMenu({ person, onAction, onClose, t = (key, fallback) => fallback || key }) {
  if (!person.royalty) {
    return null;
  }

  const { title, respect } = person.royalty;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{t('royalty.title', 'Royal Duties')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {/* Royal Dashboard */}
          <div
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '20px',
              color: 'black',
              textShadow: 'none',
              textAlign: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '2em' }}>
              {title}
              {t('royalty.of', ' of ')}
              {person.country}
            </h2>
            <div style={{ marginTop: '10px', fontSize: '1.1em', fontWeight: 'bold' }}>
              {t('royalty.respect', 'Respect')}: {respect}%
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
            <button
              className="btn-primary"
              onClick={() => onAction('public_service')}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid gold',
                color: 'gold',
              }}
            >
              {t('royalty.publicService', 'Perform Public Service')}
            </button>

            <button
              className="btn-primary"
              onClick={() => onAction('execute')}
              style={{
                background: 'rgba(200, 0, 0, 0.3)',
                border: '1px solid red',
                color: '#ffaaaa',
              }}
            >
              {t('royalty.execute', 'Execute a Subject')}
            </button>

            <button
              className="btn-danger"
              onClick={() => {
                if (
                  window.confirm(
                    t(
                      'royalty.confirmAbdicate',
                      'Are you sure you want to abdicate? You will lose your title and fortune.'
                    )
                  )
                ) {
                  onAction('abdicate');
                }
              }}
              style={{ marginTop: '20px' }}
            >
              {t('royalty.abdicate', 'Abdicate')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
