import React from 'react';
import { CLUBS, getClubBenefits } from '../logic/Clubs';
import './Modal.css';

export function ClubsMenu({
  person,
  onJoin,
  onLeave,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const benefits = getClubBenefits(person);
  const memberIds = person.clubs || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('clubs.title', 'Clubs & Societies')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {benefits.length > 0 && (
            <div
              style={{
                background: '#1a1a2e',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            >
              <strong>{t('clubs.yourBenefits', 'Your Benefits:')}</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {benefits.map(b => (
                  <span
                    key={b}
                    style={{
                      background: '#333',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                    }}
                  >
                    {b.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="stack-list">
            {CLUBS.map(club => {
              const isMember = memberIds.includes(club.id);
              const canJoin =
                person.age >= club.minAge &&
                person.fame >= club.minFame &&
                person.money >= club.minMoney;
              return (
                <div
                  key={club.id}
                  className="list-item"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ flex: 1 }}>
                    <strong>{club.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{club.description}</div>
                    <div style={{ fontSize: '0.7rem', color: '#666' }}>
                      {t('clubs.fee', 'Fee')}: ${club.joinCost.toLocaleString()} | $
                      {club.annualDues.toLocaleString()}/{t('clubs.perYear', 'yr')}
                    </div>
                    {!isMember && !canJoin && (
                      <div style={{ fontSize: '0.7rem', color: '#ff1744' }}>
                        {person.age < club.minAge
                          ? `${t('clubs.minAge', 'Min age')}: ${club.minAge} `
                          : ''}
                        {person.fame < club.minFame
                          ? `${t('clubs.needFame', 'Need')} ${club.minFame} ${t('clubs.fame', 'fame')} `
                          : ''}
                        {person.money < club.minMoney
                          ? `${t('clubs.needMoney', 'Need')} $${club.minMoney.toLocaleString()}`
                          : ''}
                      </div>
                    )}
                  </div>
                  {isMember ? (
                    <button
                      className="btn-danger"
                      onClick={() => onLeave(club.id)}
                      style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                    >
                      {t('clubs.leave', 'Leave')}
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => onJoin(club.id)}
                      disabled={!canJoin}
                      style={{
                        padding: '4px 12px',
                        fontSize: '0.8rem',
                        opacity: canJoin ? 1 : 0.4,
                      }}
                    >
                      {t('clubs.join', 'Join')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
