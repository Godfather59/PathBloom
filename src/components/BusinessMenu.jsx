import React, { useState } from 'react';
import { BUSINESS_TYPES, canStartBusiness } from '../logic/BusinessLogic';
import './Modal.css';

const formatMoney = amount => `$${Math.floor(amount || 0).toLocaleString()}`;

export function BusinessMenu({
  person,
  onStart,
  onManage,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0].id);
  const [companyName, setCompanyName] = useState('');

  const selectedType = BUSINESS_TYPES.find(type => type.id === businessType);
  const startCheck = canStartBusiness(person, businessType);

  const handleStart = () => {
    const fallbackName = selectedType
      ? `${t('business.myPrefix', 'My')} ${selectedType.name}`
      : t('business.newCompany', 'New Company');
    onStart(businessType, companyName.trim() || fallbackName);
    setCompanyName('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px', maxHeight: '88vh' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('business.title', 'Business')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="list-item" style={{ marginBottom: '18px' }}>
            <span className="list-item-title">{t('business.startCompany', 'Start a Company')}</span>
            <div style={{ display: 'grid', gap: '10px', marginTop: '12px' }}>
              <select
                value={businessType}
                onChange={event => setBusinessType(event.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#222',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                {BUSINESS_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} - {formatMoney(type.startupCost)}
                  </option>
                ))}
              </select>
              <input
                value={companyName}
                onChange={event => setCompanyName(event.target.value)}
                placeholder={t('business.companyNamePlaceholder', 'Company name')}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#222',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
              {selectedType && (
                <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
                  {t('business.revenueRange', 'Revenue range:')}{' '}
                  {formatMoney(selectedType.revenueRange[0] * 12)} -{' '}
                  {formatMoney(selectedType.revenueRange[1] * 12)} {t('business.yearly', 'yearly')}
                </div>
              )}
              {!startCheck.canStart && (
                <div style={{ color: '#ef5350', fontSize: '0.85rem' }}>{startCheck.reason}</div>
              )}
              <button
                className="btn-primary"
                disabled={!startCheck.canStart}
                onClick={handleStart}
                style={{ opacity: startCheck.canStart ? 1 : 0.5 }}
              >
                {t('business.startBusiness', 'Start Business')}
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>
            {t('business.ownedCompanies', 'Owned Companies')}
          </h3>
          {person.companies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#888' }}>
              {t('business.noCompanies', 'You do not own a company yet.')}
            </div>
          ) : (
            person.companies.map(company => (
              <div key={company.id} className="list-item">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginBottom: '10px',
                  }}
                >
                  <div>
                    <span className="list-item-title">{company.name}</span>
                    <span className="list-item-subtitle">
                      {company.businessType?.name || company.type} &bull; {t('business.age', 'Age')}{' '}
                      {company.age}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', color: '#81c784', fontWeight: 700 }}>
                    {formatMoney(company.valuation)}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    {t('business.cash', 'Cash:')} {formatMoney(company.cash)}
                  </div>
                  <div>
                    {t('business.employees', 'Employees:')} {company.employees}/
                    {company.businessType?.maxEmployees || t('business.unknown', '?')}
                  </div>
                  <div>
                    {t('business.reputation', 'Reputation:')} {company.reputation}%
                  </div>
                  <div>
                    {company.isPublic
                      ? `${t('business.public', 'Public')} @ $${company.stockPrice}`
                      : t('business.private', 'Private')}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button className="btn-secondary" onClick={() => onManage(company.id, 'hire')}>
                    {t('business.hire', 'Hire')}
                  </button>
                  <button className="btn-secondary" onClick={() => onManage(company.id, 'fire')}>
                    {t('business.fire', 'Fire')}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => onManage(company.id, 'marketing')}
                  >
                    {t('business.marketing', 'Marketing')}
                  </button>
                  <button className="btn-primary" onClick={() => onManage(company.id, 'ipo')}>
                    {t('business.ipo', 'IPO')}
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => onManage(company.id, 'close')}
                    style={{ gridColumn: '1 / -1' }}
                  >
                    {t('business.closeCompany', 'Close Company')}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
