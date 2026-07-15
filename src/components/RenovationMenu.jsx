import React from 'react';
import { RENOVATIONS } from '../logic/Renovation';
import './Modal.css';

export function RenovationMenu({
  person,
  assetIndex,
  asset,
  onRenovate,
  onFlip,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const hasRenos = asset.renovations && asset.renovations.length > 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {t('renovation.title', 'Renovate')}: {asset.name}
          </h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              background: '#1a1a2e',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '12px',
              textAlign: 'center',
            }}
          >
            {t('renovation.currentValue', 'Current Value')}:{' '}
            <strong>${(asset.value || asset.price || 0).toLocaleString()}</strong>
            {hasRenos && (
              <div>
                {t('renovation.renovations', 'Renovations')}: {asset.renovations.length} |{' '}
                {t('renovation.cost', 'Cost')}: ${(asset.renovationCost || 0).toLocaleString()}
              </div>
            )}
          </div>

          <h3 className="section-heading">{t('renovation.heading', 'Renovations')}</h3>
          <div className="stack-list">
            {Object.entries(RENOVATIONS).map(([key, ren]) => {
              const done = asset.renovations?.includes(key);
              const affordable = person.money >= ren.cost;
              return (
                <button
                  key={key}
                  className="list-item"
                  onClick={() => onRenovate(assetIndex, key)}
                  disabled={done || !affordable}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    opacity: done ? 0.5 : 1,
                  }}
                >
                  <div>
                    <strong>{ren.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      ${ren.cost.toLocaleString()} - +{Math.floor(ren.valueBoost * 100)}%{' '}
                      {t('renovation.value', 'value')}
                    </div>
                  </div>
                  <span className={`cost-pill ${done ? 'paid' : affordable ? 'free' : ''}`}>
                    {done
                      ? t('renovation.done', 'DONE')
                      : affordable
                        ? `$${ren.cost.toLocaleString()}`
                        : t('renovation.na', 'N/A')}
                  </span>
                </button>
              );
            })}
          </div>

          {hasRenos && (
            <button
              className="btn-primary"
              onClick={() => {
                onFlip(assetIndex);
                onClose();
              }}
              style={{ marginTop: '12px', width: '100%', background: '#ff6f00' }}
            >
              {t('renovation.sell', 'Sell / Flip This Property')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
