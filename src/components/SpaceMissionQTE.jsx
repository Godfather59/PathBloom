import React, { useState, useEffect, useCallback } from 'react';
import './NewFeatures.css';
import './Modal.css';

const SEQUENCES = [
  { key: 'Q', label: 'Throttle Up' },
  { key: 'W', label: 'Stabilize' },
  { key: 'E', label: 'Navigate' },
  { key: 'R', label: 'Dock' },
  { key: 'T', label: 'Deploy' },
];

export function SpaceMissionQTE({
  missionName,
  onResult,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('playing');
  const [timeLeft, setTimeLeft] = useState(100);
  const [score, setScore] = useState(0);

  const currentSeq = SEQUENCES[step % SEQUENCES.length];

  useEffect(() => {
    if (phase !== 'playing') {
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [phase, step]);

  const handleInput = useCallback(
    inputKey => {
      if (phase !== 'playing') {
        return;
      }
      const key = String(inputKey || '').toUpperCase();
      if (key === currentSeq.key) {
        const bonus = Math.floor(timeLeft / 10) + 1;
        setScore(prev => prev + bonus);
        if (step >= 7) {
          setPhase('success');
        } else {
          setStep(prev => prev + 1);
          setTimeLeft(100);
        }
      } else {
        setTimeLeft(prev => Math.max(0, prev - 10));
      }
    },
    [phase, step, currentSeq, timeLeft]
  );

  const handleKeyDown = useCallback(
    event => {
      handleInput(event.key);
    },
    [handleInput]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '400px', position: 'relative', minHeight: '300px' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {t('spacemission.title', `Mission: ${missionName || 'Space Ops'}`)}
          </h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {phase === 'playing' && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div className="timer-bar">
                <div className="timer-fill" style={{ width: `${timeLeft}%` }} />
              </div>

              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  margin: '20px 0',
                  color: timeLeft > 50 ? '#00e676' : timeLeft > 25 ? '#ffc107' : '#ff1744',
                  textShadow: '0 0 20px currentColor',
                  letterSpacing: '8px',
                }}
              >
                {currentSeq.key}
              </div>

              <div
                style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: '#fff' }}
              >
                {t(`spacemission.action.${currentSeq.key.toLowerCase()}`, currentSeq.label)}
              </div>

              <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: '16px' }}>
                {t('spacemission.step', `Step ${step + 1} of 8`)}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}
              >
                {SEQUENCES.map((seq, i) => (
                  <button
                    key={seq.key}
                    type="button"
                    onClick={() => handleInput(seq.key)}
                    aria-label={t(
                      `spacemission.aria.${seq.key.toLowerCase()}`,
                      `${seq.key}: ${seq.label}`
                    )}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background:
                        i < step % SEQUENCES.length
                          ? 'rgba(0,230,118,0.15)'
                          : 'rgba(255,255,255,0.04)',
                      color: i < step % SEQUENCES.length ? '#00e676' : '#666',
                      border: `1px solid ${i < step % SEQUENCES.length ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.12)'}`,
                      cursor: 'pointer',
                      minWidth: '44px',
                      minHeight: '44px',
                    }}
                  >
                    {seq.key}
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#666' }}>
                {t('spacemission.score', 'Score:')}{' '}
                <strong style={{ color: '#ffd700' }}>{score}</strong>
              </div>
            </div>
          )}

          {phase === 'success' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px', color: '#00e676' }}>✓</div>
              <div
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#00e676',
                  marginBottom: '8px',
                }}
              >
                {t('spacemission.missionComplete', 'Mission Complete!')}
              </div>
              <div style={{ color: '#888', marginBottom: '16px' }}>
                {t(
                  'spacemission.successMessage',
                  `You successfully completed all objectives. Score: ${score}`
                )}
              </div>
              <button className="btn-primary" onClick={() => onResult(true)}>
                {t('spacemission.continue', 'Continue')}
              </button>
            </div>
          )}

          {phase === 'failed' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px', color: '#ff1744' }}>✕</div>
              <div
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#ff1744',
                  marginBottom: '8px',
                }}
              >
                {t('spacemission.missionFailed', 'Mission Failed')}
              </div>
              <div style={{ color: '#888', marginBottom: '16px' }}>
                {t('spacemission.failMessage', 'You ran out of time! Systems are failing...')}
              </div>
              <button className="btn-danger" onClick={() => onResult(false)}>
                {t('spacemission.abort', 'Abort')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
