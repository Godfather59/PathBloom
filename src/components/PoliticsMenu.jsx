import React from 'react';
import { POLITICAL_OFFICES, CAMPAIGN_ACTIONS } from '../logic/Politics';
import { translateGameMessage } from '../logic/i18n';
import './Modal.css';

export function PoliticsMenu({
  person,
  onRun,
  onCampaignAction,
  onGeopolitics,
  onQuit,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const localizeDefinition = (messageKey, fallback) =>
    translateGameMessage(language, messageKey, {}, fallback);

  // 0. Office Management (already in office)
  if (!person.politics && person.job?.isPolitical) {
    const { job } = person;
    return (
      <div className="modal-overlay">
        <div className="modal-content" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="modal-header">
            <h2 className="modal-title">{job.title}</h2>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(33,150,243,0.15), rgba(21,101,192,0.1))',
                padding: '16px',
                borderRadius: '10px',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  marginBottom: '4px',
                  color:
                    job.approval >= 60 ? '#81c784' : job.approval >= 40 ? '#ffcc80' : '#ef5350',
                }}
              >
                {job.approval || 50}%
              </div>
              <div style={{ color: '#aaa', fontSize: '0.85rem' }}>Approval Rating</div>
              <div style={{ marginTop: '8px', color: '#888', fontSize: '0.8rem' }}>
                Salary: ${(job.salary || 0).toLocaleString()} | Term: {job.yearsLeft || 0}y left
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {job.title === 'President' && (
                <button
                  className="btn-primary"
                  style={{ padding: '14px', fontSize: '1rem' }}
                  onClick={() => onGeopolitics?.()}
                >
                  World Stage
                </button>
              )}
              <button
                className="btn-danger"
                style={{ padding: '12px' }}
                onClick={() => {
                  if (confirm('Resign from office?')) {
                    onQuit?.();
                  }
                }}
              >
                Resign from Office
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 1. Selection Screen (if not campaigning)
  if (!person.politics) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="modal-header">
            <h2 className="modal-title">{t('politics.offices', 'Political Offices')}</h2>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {POLITICAL_OFFICES.map(office => (
              <div key={office.id} className="list-item">
                <div>
                  <div className="bold">
                    {localizeDefinition(office.titleMessageKey, office.title)}
                  </div>
                  <div className="list-item-subtitle">
                    {t('politics.term', 'Term')}: {office.term} {t('politics.years', 'yrs')} |{' '}
                    {t('politics.salary', 'Salary')}: ${office.salary.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                    {t('politics.campaignCost', 'Campaign Cost')}: ${office.cost.toLocaleString()}
                  </div>
                </div>
                <button className="btn-primary" onClick={() => onRun(office)}>
                  {t('politics.run', 'Run for Office')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Campaign Dashboard
  const { office, approval, funds, weeksLeft } = person.politics;

  return (
    <div className="modal-overlay">
      <div className="modal-content" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <h2 className="modal-title">
            {localizeDefinition(office.titleMessageKey, office.title)} ·{' '}
            {t('politics.campaign', 'Campaign')}
          </h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              background: '#222',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{approval}%</div>
            <div style={{ color: '#aaa' }}>{t('politics.approval', 'Approval Rating')}</div>
            <div style={{ marginTop: '10px', fontWeight: 'bold', color: '#81c784' }}>
              {t('politics.funds', 'Funds')}: ${funds.toLocaleString()}
            </div>
            <div style={{ marginTop: '5px', color: '#ffcc80' }}>
              {weeksLeft} {t('politics.weeksLeft', 'weeks until Election')}
            </div>
          </div>

          <h3>{t('politics.actions', 'Campaign Actions')}</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {CAMPAIGN_ACTIONS.map(action => (
              <button
                key={action.id}
                className="list-item"
                style={{
                  width: '100%',
                  textAlign: language === 'ar' ? 'right' : 'left',
                  cursor: 'pointer',
                }}
                onClick={() => onCampaignAction(action)}
              >
                <div className="bold">
                  {localizeDefinition(action.titleMessageKey, action.title)}
                </div>
                <div className="list-item-subtitle">
                  {t('politics.cost', 'Cost')}: ${action.cost} | {t('politics.impact', 'Impact')}: ~
                  {action.impact}%
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
