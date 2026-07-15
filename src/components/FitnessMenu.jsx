import React from 'react';
import { DIET_TYPES, EXERCISE_TYPES, getBMI, getBMICategory } from '../logic/Fitness';
import './Modal.css';

export function FitnessMenu({
  person,
  onExercise,
  onDiet,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const bmi = getBMI(person);
  const category = getBMICategory(bmi);
  const fitness = person.fitness || {
    weight: 150,
    diet: 'standard',
    exerciseDays: 0,
    muscleMass: 30,
    bodyFat: 20,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('fitness.title', 'Fitness & Health')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div
            style={{
              background: '#1a1a2e',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                {t('fitness.weight', 'Weight: ')}
                <strong>
                  {fitness.weight}
                  {t('fitness.lbs', ' lbs')}
                </strong>
              </div>
              <div>
                {t('fitness.bmi', 'BMI: ')}
                <strong>{bmi.toFixed(1)}</strong> ({category})
              </div>
              <div>
                {t('fitness.muscle', 'Muscle: ')}
                <strong>{fitness.muscleMass}%</strong>
              </div>
              <div>
                {t('fitness.bodyFat', 'Body Fat: ')}
                <strong>{fitness.bodyFat}%</strong>
              </div>
              <div>
                {t('fitness.diet', 'Diet: ')}
                <strong>
                  {DIET_TYPES[fitness.diet]?.name || t('fitness.standard', 'Standard')}
                </strong>
              </div>
              <div>
                {t('fitness.exerciseDays', 'Exercise Days: ')}
                <strong>{fitness.exerciseDays}/7</strong>
              </div>
            </div>
          </div>

          <h3 className="section-heading">{t('fitness.exercise', 'Exercise')}</h3>
          <div className="stack-list">
            {Object.values(EXERCISE_TYPES).map(ex => {
              const key = Object.keys(EXERCISE_TYPES).find(k => EXERCISE_TYPES[k] === ex);
              return (
                <button
                  key={key}
                  className="list-item"
                  onClick={() => onExercise(key)}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>
                    <strong>{ex.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      {t('fitness.health', 'Health +')}
                      {ex.healthGain}
                      {t('fitness.stress', ' Stress -')}
                      {ex.stressRelief}
                    </div>
                  </div>
                  <span style={{ color: '#4caf50', fontSize: '0.8rem' }}>
                    {t('fitness.go', 'GO')}
                  </span>
                </button>
              );
            })}
          </div>

          <h3 className="section-heading">{t('fitness.dietSection', 'Diet')}</h3>
          <div className="stack-list">
            {Object.entries(DIET_TYPES).map(([key, diet]) => (
              <button
                key={key}
                className="list-item"
                onClick={() => onDiet(key)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  opacity: fitness.diet === key ? 0.6 : 1,
                }}
              >
                <div>
                  <strong>
                    {diet.name}
                    {fitness.diet === key ? t('fitness.active', ' (Active)') : ''}
                  </strong>
                  {diet.cost > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      ${diet.cost}
                      {t('fitness.perMonth', '/month')}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
