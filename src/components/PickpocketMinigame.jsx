import React, { useState, useEffect, useCallback } from 'react';
import './NewFeatures.css';
import './Modal.css';

export function PickpocketMinigame({
  difficulty = 1,
  onResult,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [phase, setPhase] = useState('ready');
  const [targetPosition, setTargetPosition] = useState(50);
  const [currentPos, setCurrentPos] = useState(0);
  const [speed, setSpeed] = useState(2);

  useEffect(() => {
    if (phase !== 'moving') {
      return;
    }
    const baseSpeed = 1 + difficulty * 0.5;
    setSpeed(baseSpeed);
    setTargetPosition(20 + Math.random() * 60);
    setCurrentPos(0);
  }, [phase, difficulty]);

  useEffect(() => {
    if (phase !== 'moving') {
      return;
    }
    const interval = setInterval(() => {
      setCurrentPos(prev => {
        const next = prev + speed;
        if (next >= 100) {
          clearInterval(interval);
          setPhase('failed');
          return 100;
        }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [phase, speed]);

  const handleSnatch = useCallback(() => {
    if (phase !== 'moving') {
      return;
    }
    const zone = 8;
    const diff = Math.abs(currentPos - targetPosition);
    if (diff < zone) {
      const quality = diff < 3 ? 'perfect' : 'good';
      setPhase(quality === 'perfect' ? 'success_perfect' : 'success');
    } else {
      setPhase('failed');
    }
  }, [phase, currentPos, targetPosition]);

  const handleKeyDown = useCallback(
    e => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (phase === 'ready') {
          setPhase('moving');
        } else if (phase === 'moving') {
          handleSnatch();
        }
      }
    },
    [phase, handleSnatch]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const payoutMap = { success_perfect: 500, success: 200, failed: -300 };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '380px', position: 'relative', minHeight: '280px' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{t('pickpocket.title', 'Pickpocket')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {phase === 'ready' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👤</div>
              <p style={{ color: '#a0a0b0', marginBottom: '16px', lineHeight: 1.5 }}>
                {t(
                  'pickpocket.description1',
                  'A distracted stranger walks ahead of you. Their wallet is half-exposed.'
                )}
                <br />
                {t('pickpocket.description2', 'Tap the controls or press')} <strong>SPACE</strong>
                {t(
                  'pickpocket.description3',
                  ' to start, then snatch when the marker is in the green zone.'
                )}
              </p>
              <button className="btn-primary" onClick={() => setPhase('moving')}>
                {t('pickpocket.begin', 'Begin')}
              </button>
            </div>
          )}

          {phase === 'moving' && (
            <div style={{ padding: '10px 0' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#888',
                  marginBottom: '8px',
                  textAlign: 'center',
                }}
              >
                {t('pickpocket.instruction1', 'Tap')} <strong>SNATCH</strong>{' '}
                {t('pickpocket.instruction2', 'or press')} <strong>SPACE</strong>{' '}
                {t('pickpocket.instruction3', 'in the green zone!')}
              </div>

              <div
                style={{
                  width: '100%',
                  height: '40px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '10px',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${targetPosition - 8}%`,
                    width: '16%',
                    height: '100%',
                    background: 'rgba(0, 230, 118, 0.25)',
                    border: '2px solid #00e676',
                    borderRadius: '4px',
                    transition: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: `${currentPos}%`,
                    width: '8px',
                    height: '100%',
                    background: 'linear-gradient(180deg, #7000ff, #ae00ff)',
                    borderRadius: '4px',
                    transition: 'none',
                    boxShadow: '0 0 8px rgba(112,0,255,0.5)',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '6px',
                  fontSize: '0.65rem',
                  color: '#666',
                }}
              >
                <span>{t('pickpocket.tooEarly', 'Too Early')}</span>
                <span>{t('pickpocket.sweetSpot', 'SWEET SPOT')}</span>
                <span>{t('pickpocket.tooLate', 'Too Late')}</span>
              </div>
              <button
                className="btn-primary"
                onClick={handleSnatch}
                style={{ marginTop: '18px', minHeight: '52px' }}
              >
                {t('pickpocket.snatch', 'SNATCH')}
              </button>
            </div>
          )}

          {(phase === 'success' || phase === 'success_perfect') && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px', color: '#00e676' }}>✓</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00e676' }}>
                {phase === 'success_perfect'
                  ? t('pickpocket.perfectSnatch', 'Perfect Snatch!')
                  : t('pickpocket.gotIt', 'Got it!')}
              </div>
              <div style={{ color: '#888', marginTop: '8px', marginBottom: '16px' }}>
                {t(
                  'pickpocket.successMessage',
                  `You lifted $${payoutMap[phase]} without being noticed.`
                )}
              </div>
              <button className="btn-primary" onClick={() => onResult(payoutMap[phase])}>
                {t('pickpocket.collect', 'Collect')}
              </button>
            </div>
          )}

          {phase === 'failed' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px', color: '#ff1744' }}>✕</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff1744' }}>
                {t('pickpocket.busted', 'Busted!')}
              </div>
              <div style={{ color: '#888', marginTop: '8px', marginBottom: '16px' }}>
                {t(
                  'pickpocket.failMessage',
                  `They caught you! You barely escaped but dropped $${Math.abs(payoutMap[phase])}.`
                )}
              </div>
              <button className="btn-danger" onClick={() => onResult(payoutMap[phase])}>
                {t('pickpocket.flee', 'Flee')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
