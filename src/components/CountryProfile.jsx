import React from 'react';
import { GOVERNMENT_TYPES } from '../logic/WorldSimulation';
import './Modal.css';

function StatBar({ label, value, color }) {
  const barColor = value >= 70 ? '#4caf50' : value >= 40 ? '#ff9800' : '#f44336';
  return (
    <div style={{ marginBottom: '6px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          marginBottom: '2px',
        }}
      >
        <span style={{ color: '#aaa' }}>{label}</span>
        <span style={{ fontWeight: 700, color }}>{Math.round(value)}</span>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.min(100, value)}%`,
            background: barColor,
            borderRadius: '2px',
          }}
        />
      </div>
    </div>
  );
}

export function CountryProfile({ countryId, onClose, person }) {
  const state = person?.geopoliticalState;
  const country = state?.countries?.[countryId];
  if (!country) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '480px' }}>
          <div className="modal-header">
            <h2 className="modal-title">Country Not Found</h2>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div style={{ color: '#888', padding: '20px', textAlign: 'center' }}>
            Country data is not available yet. Age up to generate the world.
          </div>
        </div>
      </div>
    );
  }

  const gov = GOVERNMENT_TYPES[country.govType] || GOVERNMENT_TYPES.democracy;
  const govColor = country.stability >= 50 ? '#4caf50' : '#ff9800';

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{country.name}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.82rem',
              }}
            >
              <div>
                <span style={{ color: '#888' }}>Capital:</span>{' '}
                <span style={{ color: '#ddd', fontWeight: 600 }}>{country.capital}</span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Continent:</span>{' '}
                <span style={{ color: '#ddd', fontWeight: 600 }}>{country.continent}</span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Government:</span>{' '}
                <span style={{ color: govColor, fontWeight: 600 }}>
                  {gov?.label || country.govType}
                </span>
              </div>
              <div>
                <span style={{ color: '#888' }}>GDP:</span>{' '}
                <span style={{ color: '#ddd', fontWeight: 600 }}>${country.gdp.toFixed(0)}B</span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Population:</span>{' '}
                <span style={{ color: '#ddd', fontWeight: 600 }}>
                  {country.population.toFixed(1)}M
                </span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Influence:</span>{' '}
                <span style={{ color: '#42a5f5', fontWeight: 600 }}>
                  {Math.round(country.influence)}%
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#42a5f5',
                marginBottom: '8px',
              }}
            >
              Leader
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <span style={{ color: '#ddd', fontWeight: 600, fontSize: '0.9rem' }}>
                {country.leaderName}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background:
                    country.leaderApproval >= 50 ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                  color: country.leaderApproval >= 50 ? '#81c784' : '#ef5350',
                  fontWeight: 700,
                }}
              >
                {Math.round(country.leaderApproval)}% approval
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#888' }}>
              {country.leaderTitle} &bull; {country.leaderPersonality} &bull;{' '}
              {country.leaderYearsInPower} years in power
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{ fontWeight: 700, fontSize: '0.85rem', color: '#aaa', marginBottom: '8px' }}
            >
              National Stats
            </div>
            <StatBar
              label="Stability"
              value={country.stability}
              color={country.stability >= 50 ? '#81c784' : '#ff8a65'}
            />
            <StatBar
              label="Happiness"
              value={country.happiness}
              color={country.happiness >= 50 ? '#81c784' : '#ff8a65'}
            />
            <StatBar label="Education" value={country.education} color="#64b5f6" />
            <StatBar label="Healthcare" value={country.healthcare} color="#4db6ac" />
            <StatBar label="Technology" value={country.technology} color="#ba68c8" />
            <StatBar label="Military" value={country.militaryPower} color="#ff8a65" />
            <StatBar
              label="Corruption"
              value={country.corruption}
              color={country.corruption < 40 ? '#81c784' : '#ff8a65'}
            />
            <StatBar
              label="Crime"
              value={country.crime}
              color={country.crime < 40 ? '#81c784' : '#ff8a65'}
            />
          </div>

          <div
            style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '14px' }}
          >
            <div
              style={{ fontWeight: 700, fontSize: '0.85rem', color: '#aaa', marginBottom: '8px' }}
            >
              Economy
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '0.82rem',
              }}
            >
              <div>
                <span style={{ color: '#888' }}>GDP Growth:</span>{' '}
                <span
                  style={{ color: country.gdpGrowth >= 0 ? '#81c784' : '#ef5350', fontWeight: 600 }}
                >
                  {country.gdpGrowth >= 0 ? '+' : ''}
                  {country.gdpGrowth.toFixed(1)}%
                </span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Unemployment:</span>{' '}
                <span
                  style={{
                    color: country.unemployment > 10 ? '#ff8a65' : '#81c784',
                    fontWeight: 600,
                  }}
                >
                  {country.unemployment.toFixed(1)}%
                </span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Inflation:</span>{' '}
                <span
                  style={{ color: country.inflation > 10 ? '#ff8a65' : '#81c784', fontWeight: 600 }}
                >
                  {country.inflation.toFixed(1)}%
                </span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Tax Rate:</span>{' '}
                <span style={{ color: '#ddd', fontWeight: 600 }}>
                  {Math.round(country.taxRate)}%
                </span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Poverty:</span>{' '}
                <span
                  style={{ color: country.poverty > 30 ? '#ff8a65' : '#81c784', fontWeight: 600 }}
                >
                  {country.poverty.toFixed(1)}%
                </span>
              </div>
              <div>
                <span style={{ color: '#888' }}>Debt:</span>{' '}
                <span style={{ color: country.debt > 60 ? '#ff8a65' : '#81c784', fontWeight: 600 }}>
                  {Math.round(country.debt)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
