import React from 'react';
import { INSURANCE_TYPES } from '../logic/Insurance';
import './Modal.css';

export function InsuranceMenu({
  person,
  onBuy,
  onCancel,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('insurance.title', 'Insurance')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="stack-list">
            {Object.entries(INSURANCE_TYPES).map(([key, def]) => {
              const policy = person.insurance?.[key];
              const active = policy && !policy.cancelled;
              return (
                <div
                  key={key}
                  className="list-item"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <strong>{def.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      {active
                        ? t('insurance.policyActive', `${policy.provider} - $${policy.premium}/mo`)
                        : t('insurance.notCovered', 'Not covered')}
                    </div>
                    {active && (
                      <div style={{ fontSize: '0.75rem', color: '#4caf50' }}>
                        {t(
                          'insurance.deductible',
                          `Deductible: $${policy.deductible.toLocaleString()} | Claims: ${policy.claims || 0}`
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {active ? (
                      <button
                        className="btn-danger"
                        onClick={() => onCancel(key)}
                        style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                      >
                        {t('insurance.cancel', 'Cancel')}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {def.providers.map(p => (
                          <button
                            key={p}
                            className="btn-primary"
                            onClick={() => onBuy(key, p)}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
