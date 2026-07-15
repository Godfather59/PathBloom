import React from 'react';
import { COUNTRIES } from '../logic/ImmigrationSystem';
import { CITIES, getCitiesByCountry } from '../logic/City';
import './Modal.css';

export function ImmigrationMenu({
  person,
  onEmigrate,
  onCitizenship,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '620px', maxHeight: '88vh' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('immigration.title', 'Immigration')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="list-item">
            <div className="list-item-title">
              {person.city}, {person.country}
            </div>
            <div className="list-item-subtitle">
              {person.yearsInCurrentCity || 0} years in {person.city} &bull;{' '}
              {person.yearsInCurrentCountry || 0} years residency
            </div>
            <div style={{ marginTop: '4px', color: '#888', fontSize: '0.8rem' }}>
              🏙️ Born in {person.birthCity}, {person.birthCountry}
            </div>
            <div style={{ marginTop: '4px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {t('immigration.citizenships', 'Citizenships')}:{' '}
              {(person.citizenships || [person.country]).join(', ')}
            </div>
            <button
              className="btn-primary"
              onClick={onCitizenship}
              style={{
                marginTop: '12px',
                opacity: (person.yearsInCurrentCountry || 0) >= 5 ? 1 : 0.55,
              }}
              disabled={(person.yearsInCurrentCountry || 0) < 5}
            >
              {t('immigration.applyCitizenship', 'Apply for Citizenship')}
            </button>
          </div>

          <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' }}>
            {t('immigration.countries', 'Countries')}
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {COUNTRIES.map(country => {
              const current = person.country === country.name;
              const tooYoung = person.age < 18;
              const cannotAfford = person.money < country.visaCost;
              const disabled = current || tooYoung || cannotAfford || person.isInPrison;
              const cities = getCitiesByCountry(country.name);

              return (
                <div key={country.id} className="list-item" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <span className="list-item-title">{country.name}</span>
                      <span className="list-item-subtitle">
                        {t('immigration.visa', 'Visa')}: ${country.visaCost.toLocaleString()} &bull;{' '}
                        {t('immigration.difficulty', 'Difficulty')}: {country.difficulty}
                        {cities.length > 0 && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#888' }}>
                            🏙️{' '}
                            {cities
                              .slice(0, 2)
                              .map(c => c.name)
                              .join(', ')}
                            {cities.length > 2 ? '...' : ''}
                          </span>
                        )}
                      </span>
                    </div>
                    <button
                      className={disabled ? 'btn-secondary' : 'btn-primary'}
                      disabled={disabled}
                      onClick={() => onEmigrate(country.name)}
                      style={{ width: 'auto', minWidth: '110px', opacity: disabled ? 0.5 : 1 }}
                    >
                      {current ? t('immigration.here', 'Here') : t('immigration.move', 'Move')}
                    </button>
                  </div>
                  {tooYoung && (
                    <div style={{ color: '#ef5350', fontSize: '0.8rem', marginTop: '6px' }}>
                      {t('immigration.ageReq', 'Must be 18+.')}
                    </div>
                  )}
                  {cannotAfford && !current && (
                    <div style={{ color: '#ef5350', fontSize: '0.8rem', marginTop: '6px' }}>
                      {t('immigration.noFunds', 'Not enough cash.')}
                    </div>
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
