import React, { useState } from 'react';
import { SURGERIES, TREATMENTS } from '../logic/Health';
import { DISEASES, getAvailableTreatments, getDiseaseSummary } from '../logic/Disease';
import './Modal.css';

export function DoctorMenu({
  person,
  onTreat,
  onSurgery,
  onDiagnose,
  onAdmitHospital,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [tab, setTab] = useState(person.conditions?.length > 0 ? 'conditions' : 'doctor');
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [treatmentResult, setTreatmentResult] = useState(null);

  const summary = getDiseaseSummary(person);

  const renderHealthStatus = () => (
    <div
      style={{
        background: 'var(--bg-card)',
        borderRadius: '10px',
        padding: '14px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          {t('doctor.health', 'Health')}
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.1em',
            color: person.health > 70 ? '#4caf50' : person.health > 40 ? '#ff9800' : '#ef5350',
          }}
        >
          {person.health}/100
        </div>
      </div>
      {summary && (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {t('doctor.activeConditions', 'Active Conditions')}
          </div>
          <div style={{ fontWeight: 700, color: '#ef5350' }}>{summary.count}</div>
        </div>
      )}
    </div>
  );

  const renderConditionsTab = () => (
    <div>
      <h4 style={{ marginBottom: '12px' }}>
        {t('doctor.yourConditions', 'Your Medical Conditions')}
      </h4>
      {!person.conditions || person.conditions.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>
          {t('doctor.noConditions', 'No active conditions. You are healthy.')}
        </p>
      ) : (
        <div className="list-container">
          {person.conditions
            .filter(c => !c.cured)
            .map(cond => {
              const def = DISEASES[cond.id];
              return (
                <div key={cond.id} className="list-item">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div className="bold">{cond.name}</div>
                      <div className="list-item-subtitle">
                        {def?.description || ''} &bull;
                        {t('doctor.aged', 'Age')} {cond.contractedAtAge}
                      </div>
                      <div className="list-item-subtitle">
                        {t('doctor.severity', 'Severity:')} {'⬛'.repeat(def?.severity || 1)}
                        {cond.treated && ` ${t('doctor.treated', '(Treated)')}`}
                      </div>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => setSelectedDisease(cond)}
                    >
                      {t('doctor.treat', 'Treat')}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );

  const renderTreatmentView = () => {
    if (!selectedDisease) {
      return null;
    }
    const def = DISEASES[selectedDisease.id];
    const treatments = getAvailableTreatments(person, selectedDisease.id);

    return (
      <div>
        <button onClick={() => setSelectedDisease(null)} style={{ marginBottom: '12px' }}>
          &larr; {t('doctor.back', 'Back')}
        </button>
        <h4 style={{ marginBottom: '8px' }}>
          {t('doctor.treating', 'Treating')} {selectedDisease.name}
        </h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          {def?.description}
        </p>

        {treatmentResult && (
          <div
            style={{
              background: '#1b5e20',
              borderRadius: '8px',
              padding: '10px',
              marginBottom: '12px',
              fontSize: '0.85rem',
            }}
          >
            {treatmentResult}
            <button
              style={{
                marginLeft: '8px',
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
              }}
              onClick={() => setTreatmentResult(null)}
            >
              &times;
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {treatments.map(tx => (
            <button
              key={tx.id}
              className={`list-item ${tx.alreadyUsed ? 'readonly' : ''}`}
              disabled={tx.alreadyUsed}
              onClick={() => {
                const result = onDiagnose(selectedDisease.id, tx.id);
                if (result) {
                  setTreatmentResult(result);
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div className="bold">
                    {tx.id === 'hospitalization'
                      ? t('doctor.hospitalize', '🏥 Admit to Hospital')
                      : tx.label}
                  </div>
                  <div className="list-item-subtitle">
                    {tx.cost > 0 ? `$${tx.cost.toLocaleString()}` : t('doctor.free', 'Free')}
                    {tx.alreadyUsed ? ` ${t('doctor.alreadyUsed', '(Already tried)')}` : ''}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    alignSelf: 'center',
                  }}
                >
                  {tx.id === 'hospitalization'
                    ? t('doctor.hospitalNote', 'Best recovery chance')
                    : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDoctorTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {TREATMENTS.map(tx => {
        const isWitchDoctor = tx.id === 'witch_doctor';
        const healthPolicy =
          !isWitchDoctor && person.insurance?.health && !person.insurance.health.cancelled
            ? person.insurance.health
            : null;
        const cost = healthPolicy
          ? Math.max(10, Math.floor(tx.cost * (1 - healthPolicy.coverage)))
          : tx.cost;
        return (
          <button
            key={tx.id}
            className="list-item"
            onClick={() => onTreat(tx)}
            style={{ width: '100%' }}
          >
            <div className="bold">{tx.name}</div>
            <div className="list-item-subtitle">
              {healthPolicy
                ? `$${cost}${t('doctor.insured', ' (insured, normally $')}${tx.cost})`
                : `$${tx.cost}`}
              {tx.heal > 0 && ` | +${tx.heal} ${t('doctor.health', 'Health')}`}
              {tx.happiness > 0 && ` | +${tx.happiness} ${t('doctor.happiness', 'Happiness')}`}
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderSurgeryTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {SURGERIES.map(s => (
        <button
          key={s.id}
          className="list-item"
          onClick={() => onSurgery(s)}
          style={{ width: '100%' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className="bold">{s.name}</div>
            <div style={{ color: '#e91e63' }}>${s.cost.toLocaleString()}</div>
          </div>
          <div className="list-item-subtitle">
            {t('doctor.risk', 'Risk: ')}
            {s.risk}% | {t('doctor.looks', 'Looks: +')}
            {s.looks_gain}
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '500px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{t('doctor.title', '🏥 Hospital')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {renderHealthStatus()}

          {!selectedDisease && (
            <>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                <button
                  className={`language-chip ${tab === 'doctor' ? 'active' : ''}`}
                  onClick={() => setTab('doctor')}
                >
                  {t('doctor.doctor', '🩺 Doctor')}
                </button>
                <button
                  className={`language-chip ${tab === 'conditions' ? 'active' : ''}`}
                  onClick={() => setTab('conditions')}
                >
                  {t('doctor.conditions', '🦠 Conditions')}
                  {summary?.count > 0 && ` (${summary.count})`}
                </button>
                <button
                  className={`language-chip ${tab === 'surgery' ? 'active' : ''}`}
                  onClick={() => setTab('surgery')}
                >
                  {t('doctor.surgery', '🔪 Surgery')}
                </button>
              </div>

              {tab === 'doctor' && renderDoctorTab()}
              {tab === 'conditions' && renderConditionsTab()}
              {tab === 'surgery' && renderSurgeryTab()}
            </>
          )}

          {selectedDisease && renderTreatmentView()}
        </div>
      </div>
    </div>
  );
}
