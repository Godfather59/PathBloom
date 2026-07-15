import React from 'react';
import { SPACE_AGENCIES, SPACE_MISSIONS, TRAINING_MODULES } from '../logic/SpaceCareer';
import './Modal.css';

export function SpaceMenu({
  person,
  onJoin,
  onTrain,
  onMission,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const prog = person.spaceProgram;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('space.title', 'Space Program')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {!prog ? (
            <>
              <h3 className="section-heading">{t('space.joinAgency', 'Join a Space Agency')}</h3>
              <div className="stack-list">
                {SPACE_AGENCIES.map(agency => (
                  <button
                    key={agency.name}
                    className="list-item"
                    onClick={() => onJoin(agency)}
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div>
                      <strong>{agency.name}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        {t('space.smarts', 'Smarts')}: {agency.minSmarts}+ |{' '}
                        {t('space.difficulty', 'Difficulty')}: {agency.difficulty}
                      </div>
                    </div>
                    <span style={{ color: '#03a9f4' }}>{t('space.join', 'JOIN')}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  background: '#0d47a1',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                <strong>{prog.agency}</strong> - {prog.rank || t('space.trainee', 'Trainee')}
                <div>
                  {t('space.trainingLabel', 'Training')}: {prog.training}/100 |{' '}
                  {t('space.missionsLabel', 'Missions')}: {prog.missionsCompleted}
                </div>
              </div>

              <h3 className="section-heading">{t('space.training', 'Training')}</h3>
              <div className="stack-list">
                {TRAINING_MODULES.map(mod => {
                  const canAfford = person.money >= mod.cost;
                  const meetsReq = (prog.training || 0) >= mod.requirement;
                  return (
                    <button
                      key={mod.name}
                      className="list-item"
                      onClick={() => onTrain(mod.name)}
                      disabled={!canAfford || !meetsReq}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        opacity: meetsReq && canAfford ? 1 : 0.5,
                      }}
                    >
                      <div>
                        <strong>{mod.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>
                          {t('space.req', 'Req')}: {mod.requirement}{' '}
                          {t('space.training', 'training')} | +{mod.gains}{' '}
                          {t('space.training', 'training')}
                        </div>
                      </div>
                      <span className={`cost-pill ${mod.cost > 0 ? 'paid' : 'free'}`}>
                        {mod.cost > 0 ? `$${mod.cost.toLocaleString()}` : t('space.free', 'Free')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {prog.training >= 20 && (
                <>
                  <h3 className="section-heading">{t('space.missions', 'Missions')}</h3>
                  <div className="stack-list">
                    {SPACE_MISSIONS.filter(m => m.reqTraining <= (prog.training || 0)).map(m => (
                      <button
                        key={m.name}
                        className="list-item"
                        onClick={() => onMission(m)}
                        disabled={prog.lastMissionAge === person.age || (person.energy ?? 100) < 30}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          opacity:
                            prog.lastMissionAge === person.age || (person.energy ?? 100) < 30
                              ? 0.5
                              : 1,
                        }}
                      >
                        <div>
                          <strong>{m.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#888' }}>
                            {t('space.risk', 'Risk')}: {Math.floor(m.risk * 100)}% |{' '}
                            {t('space.pay', 'Pay')}: ${m.pay.toLocaleString()}
                          </div>
                        </div>
                        <span style={{ color: '#4caf50' }}>
                          {prog.lastMissionAge === person.age
                            ? t('space.nextYear', 'NEXT YEAR')
                            : t('space.go', 'GO')}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
