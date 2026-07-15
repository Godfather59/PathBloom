import React, { useState } from 'react';
import { GOVERNMENT_TYPES, getGlobalStats } from '../logic/WorldSimulation';
import { CountryProfile } from './CountryProfile';
import './Modal.css';

export function WorldOverview({ person, onClose }) {
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const state = person?.geopoliticalState;
  const countries = state ? Object.values(state.countries) : [];
  const [sortKey, setSortKey] = useState('name');
  const [filterContinent, setFilterContinent] = useState('all');

  const stats = state
    ? getGlobalStats(state)
    : { avgHappiness: 0, avgStability: 0, totalPopulation: 0, wars: 0, democracies: 0 };
  const continents = [...new Set(countries.map(c => c.continent))].sort();

  const sorted = [...countries]
    .filter(c => filterContinent === 'all' || c.continent === filterContinent)
    .sort((a, b) => {
      if (sortKey === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortKey === 'gdp') {
        return b.gdp - a.gdp;
      }
      if (sortKey === 'military') {
        return b.militaryPower - a.militaryPower;
      }
      if (sortKey === 'happiness') {
        return b.happiness - a.happiness;
      }
      if (sortKey === 'stability') {
        return b.stability - a.stability;
      }
      return 0;
    });

  if (selectedCountryId) {
    return (
      <CountryProfile
        countryId={selectedCountryId}
        person={person}
        onClose={() => setSelectedCountryId(null)}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">World Overview</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                background: 'rgba(33,150,243,0.08)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#64b5f6' }}>
                {stats.avgHappiness}%
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>
                Avg Happiness
              </div>
            </div>
            <div
              style={{
                background: 'rgba(76,175,80,0.08)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#81c784' }}>
                {stats.avgStability}%
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>
                Avg Stability
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255,193,7,0.08)',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffd54f' }}>
                {stats.democracies}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>
                Democracies
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            <select
              value={sortKey}
              onChange={e => setSortKey(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#ddd',
                fontSize: '0.75rem',
              }}
            >
              <option value="name">Name</option>
              <option value="gdp">GDP</option>
              <option value="military">Military</option>
              <option value="happiness">Happiness</option>
              <option value="stability">Stability</option>
            </select>
            <button
              onClick={() => setFilterContinent('all')}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background:
                  filterContinent === 'all' ? 'rgba(33,150,243,0.2)' : 'rgba(255,255,255,0.05)',
                color: filterContinent === 'all' ? '#64b5f6' : '#888',
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              All
            </button>
            {continents.map(cont => (
              <button
                key={cont}
                onClick={() => setFilterContinent(cont)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background:
                    filterContinent === cont ? 'rgba(33,150,243,0.2)' : 'rgba(255,255,255,0.05)',
                  color: filterContinent === cont ? '#64b5f6' : '#888',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                {cont}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sorted.map(c => {
              const gov = GOVERNMENT_TYPES[c.govType] || GOVERNMENT_TYPES.democracy;
              const stabilityColor =
                c.stability >= 60 ? '#81c784' : c.stability >= 35 ? '#ffd54f' : '#ef5350';
              const warRisk = c.stability < 25 ? '🔴' : c.stability < 45 ? '🟡' : '🟢';
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCountryId(c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                  }}
                >
                  <div style={{ fontWeight: 700, flex: '0 0 140px', color: '#ddd' }}>{c.name}</div>
                  <div style={{ flex: '0 0 70px', fontSize: '0.7rem' }}>
                    <span
                      style={{
                        padding: '1px 5px',
                        borderRadius: '3px',
                        background: 'rgba(255,255,255,0.06)',
                        color: '#aaa',
                      }}
                    >
                      {gov?.label?.split(' ')[0] || c.govType}
                    </span>
                  </div>
                  <div style={{ flex: '0 0 60px', textAlign: 'right', color: '#888' }}>
                    ${c.gdp.toFixed(0)}B
                  </div>
                  <div style={{ flex: '0 0 50px', textAlign: 'right' }}>
                    <span style={{ color: stabilityColor, fontWeight: 700 }}>
                      {Math.round(c.stability)}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: '0 0 50px',
                      textAlign: 'right',
                      color: '#888',
                      fontSize: '0.75rem',
                    }}
                  >
                    {Math.round(c.militaryPower)}
                  </div>
                  <div style={{ flex: '0 0 24px', textAlign: 'center', fontSize: '0.85rem' }}>
                    {c.happiness >= 60 ? '😊' : c.happiness >= 35 ? '😐' : '😞'}
                  </div>
                  <div style={{ flex: '0 0 18px', textAlign: 'center' }}>{warRisk}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
