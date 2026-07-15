import React, { useState } from 'react';
import { CHARITABLE_CAUSES, FOUNDATION_TYPES, LEGACY_PROJECTS } from '../logic/Philanthropy';
import './Modal.css';

export function PhilanthropyMenu({
  person,
  onDonate,
  onFoundation,
  onProject,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [selectedCause, setSelectedCause] = useState(null);
  const [donationAmount, setDonationAmount] = useState(1000);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('philanthropy.title', 'Philanthropy')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {person.foundations?.length > 0 && (
            <div
              style={{
                background: '#1b5e20',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            >
              {t('philanthropy.yourFoundations', 'Your Foundations')}:{' '}
              {person.foundations.map(f => f.name).join(', ')}
            </div>
          )}

          <h3 className="section-heading">
            {t('philanthropy.donateCharity', 'Donate to Charity')}
          </h3>
          <div className="stack-list">
            {CHARITABLE_CAUSES.map(cause => (
              <div key={cause.id} className="list-item">
                <button
                  type="button"
                  onClick={() => setSelectedCause(selectedCause === cause.id ? null : cause.id)}
                  aria-expanded={selectedCause === cause.id}
                  style={{ width: '100%', textAlign: 'left', color: 'inherit' }}
                >
                  <strong>{cause.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{cause.description}</div>
                </button>
                {selectedCause === cause.id && (
                  <div
                    style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '10px' }}
                  >
                    <input
                      aria-label={`${t('philanthropy.donationTo', 'Donation to')} ${cause.name}`}
                      min="1"
                      type="number"
                      value={donationAmount}
                      onChange={e => setDonationAmount(Number(e.target.value) || 0)}
                      style={{
                        width: '100px',
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
                        onDonate(cause.id, donationAmount);
                        setSelectedCause(null);
                      }}
                      style={{ padding: '4px 10px' }}
                    >
                      {t('philanthropy.give', 'Give')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 className="section-heading">
            {t('philanthropy.startFoundation', 'Start a Foundation')}
          </h3>
          <div className="stack-list">
            {FOUNDATION_TYPES.map(ft => {
              const hasIt = person.foundations?.some(f => f.type === ft.id);
              return (
                <button
                  key={ft.id}
                  className="list-item"
                  onClick={() => onFoundation(ft.id)}
                  disabled={hasIt}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    opacity: hasIt ? 0.5 : 1,
                  }}
                >
                  <div>
                    <strong>{ft.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      ${ft.cost.toLocaleString()} | +{ft.impact}{' '}
                      {t('philanthropy.impact', 'impact')}
                    </div>
                  </div>
                  <span className={`cost-pill ${hasIt ? 'paid' : 'free'}`}>
                    {hasIt ? t('philanthropy.owned', 'OWNED') : `$${ft.cost.toLocaleString()}`}
                  </span>
                </button>
              );
            })}
          </div>

          {person.legacyProjects?.length > 0 && (
            <div
              style={{
                background: '#1a1a2e',
                padding: '8px',
                borderRadius: '6px',
                margin: '8px 0',
                fontSize: '0.85rem',
              }}
            >
              {t('philanthropy.legacyLabel', 'Legacy Projects')}: {person.legacyProjects.join(', ')}
            </div>
          )}

          <h3 className="section-heading">{t('philanthropy.legacy', 'Legacy Projects')}</h3>
          <div className="stack-list">
            {LEGACY_PROJECTS.map(proj => {
              const done = person.legacyProjects?.includes(proj.name);
              return (
                <button
                  key={proj.name}
                  className="list-item"
                  onClick={() => onProject(proj.name)}
                  disabled={done}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    opacity: done ? 0.5 : 1,
                  }}
                >
                  <div>
                    <strong>{proj.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      ${proj.cost.toLocaleString()} | +{proj.fameBonus}{' '}
                      {t('philanthropy.fame', 'fame')} +{proj.karmaBonus}{' '}
                      {t('philanthropy.karma', 'karma')}
                    </div>
                  </div>
                  <span className={`cost-pill ${done ? 'paid' : 'free'}`}>
                    {done ? t('philanthropy.done', 'DONE') : `$${proj.cost.toLocaleString()}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
