import React from 'react';
import './Modal.css';

const CRIMES = [
  { id: 'pickpocket', name: 'Pickpocket', risk: 'Low', payout: '$50 - $500', minigame: true },
  { id: 'shoplifting', name: 'Shoplifting', risk: 'Low', payout: '$20 - $400' },
  { id: 'scam', name: 'Online Scam', risk: 'Medium', payout: '$500 - $8,000' },
  { id: 'car_theft', name: 'Grand Theft Auto', risk: 'High', payout: '$2,500 - $25,000' },
  { id: 'burglary', name: 'Burglary', risk: 'Medium', payout: '$500 - $5,000', minigame: true },
  { id: 'hacking', name: 'System Hacking', risk: 'High', payout: '$5,000 - $100,000' },
  { id: 'fraud', name: 'Fraud', risk: 'High', payout: '$10,000 - $120,000' },
  { id: 'assault', name: 'Assault', risk: 'High', payout: '$0 - $500' },
  { id: 'robbery', name: 'Bank Robbery', risk: 'Extreme', payout: '$50,000 - $500,000' },
];

export function CrimeMenu({
  person,
  onCrime,
  onMafia,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', maxHeight: '88vh' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('crime.title', 'Crime')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="list-item" style={{ borderLeft: '3px solid #ef5350' }}>
            <span className="list-item-title">
              {t('crime.criminalProfile', 'Criminal Profile')}
            </span>
            <span className="list-item-subtitle">
              {t('crime.notoriety', 'Notoriety')}: {person.notoriety || 0}/100 &bull;{' '}
              {t('crime.crimes', 'Crimes')}: {person.lifeStats?.crimesCommitted || 0}
            </span>
            <button className="btn-secondary" onClick={onMafia} style={{ marginTop: '12px' }}>
              {t('crime.organizedCrime', 'Organized Crime')}
            </button>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            {CRIMES.map(crime => (
              <div key={crime.id} className="list-item" style={{ marginBottom: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span className="list-item-title">{crime.name}</span>
                    <span className="list-item-subtitle">
                      {t('crime.risk', 'Risk')}: {crime.risk} &bull; {t('crime.payout', 'Payout')}:{' '}
                      {crime.payout}
                      {crime.minigame ? ` &bull; ${t('crime.minigame', 'Mini-game')}` : ''}
                    </span>
                  </div>
                  <button
                    className="btn-danger"
                    disabled={person.isInPrison}
                    onClick={() => onCrime(crime.id)}
                    style={{
                      width: 'auto',
                      minWidth: '110px',
                      opacity: person.isInPrison ? 0.5 : 1,
                    }}
                  >
                    {t('crime.doIt', 'Do It')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
