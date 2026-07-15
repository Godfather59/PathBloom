import React, { useState } from 'react';
import { ACCOUNT_TYPES, RETIREMENT_HOMES } from '../logic/Retirement';
import './Modal.css';

export function RetirementMenu({
  person,
  onContribute,
  onWithdraw,
  onRetire,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [selectedAcct, setSelectedAcct] = useState(null);
  const [amount, setAmount] = useState(1000);
  const totalRetirement = Object.values(person.retirementAccounts || {}).reduce(
    (s, a) => s + a.balance,
    0
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('retirement.title', 'Retirement Planning')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              background: '#1b5e20',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              textAlign: 'center',
            }}
          >
            {t('retirement.totalSavings', 'Total Retirement Savings')}:{' '}
            <strong>${totalRetirement.toLocaleString()}</strong>
            {person.isRetired && (
              <div style={{ color: '#ffd700', marginTop: '4px' }}>
                {t('retirement.retired', 'Retired')}
              </div>
            )}
          </div>

          <h3 className="section-heading">{t('retirement.accounts', 'Accounts')}</h3>
          <div className="stack-list">
            {Object.values(ACCOUNT_TYPES).map(def => {
              const acct =
                person.retirementAccounts?.[
                  Object.keys(ACCOUNT_TYPES).find(k => ACCOUNT_TYPES[k] === def)
                ];
              const key = Object.keys(ACCOUNT_TYPES).find(k => ACCOUNT_TYPES[k] === def);
              const disabled = def.maxAnnual === 0 && !acct;
              const acctBalance = acct?.balance || 0;
              return (
                <button
                  key={key}
                  className="list-item"
                  onClick={() => setSelectedAcct(key)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    opacity: disabled ? 0.5 : 1,
                  }}
                  disabled={disabled}
                >
                  <div>
                    <strong>{def.name}</strong>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>
                      ${acctBalance.toLocaleString()}
                    </div>
                  </div>
                  <span className={`cost-pill ${acctBalance > 0 ? 'paid' : 'free'}`}>
                    {acctBalance > 0
                      ? `$${acctBalance.toLocaleString()}`
                      : t('retirement.empty', 'Empty')}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedAcct && (
            <div
              style={{
                marginTop: '12px',
                background: '#1a1a2e',
                padding: '12px',
                borderRadius: '8px',
              }}
            >
              <h4>{ACCOUNT_TYPES[selectedAcct]?.name}</h4>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value) || 0)}
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
                    onContribute(selectedAcct, amount);
                    setSelectedAcct(null);
                  }}
                >
                  {t('retirement.contribute', 'Contribute')}
                </button>
                {person.age >= 59.5 && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      onWithdraw(selectedAcct, amount);
                      setSelectedAcct(null);
                    }}
                  >
                    {t('retirement.withdraw', 'Withdraw')}
                  </button>
                )}
              </div>
            </div>
          )}

          {!person.isRetired && person.age >= 55 && (
            <button
              className="btn-danger"
              onClick={onRetire}
              style={{ marginTop: '12px', width: '100%' }}
            >
              {t('retirement.retire', 'Retire')}
            </button>
          )}

          {person.isRetired && (
            <div style={{ marginTop: '12px' }}>
              <h3 className="section-heading">{t('retirement.homes', 'Retirement Homes')}</h3>
              <div className="stack-list">
                {RETIREMENT_HOMES.map(home => (
                  <div
                    key={home.name}
                    className="list-item"
                    style={{ display: 'flex', justifyContent: 'space-between', cursor: 'default' }}
                  >
                    <div>
                      <strong>{home.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        ${home.cost}
                        {t('retirement.perMonth', '/mo')} - +{home.happiness}{' '}
                        {t('retirement.happiness', 'happiness')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
