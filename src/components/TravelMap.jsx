import React, { useState, useMemo } from 'react';
import { CITIES, getCityByName } from '../logic/City';
import {
  getCitiesByContinent,
  calculateFlightCost,
  getClimateIcon,
  getContinent,
} from '../logic/TravelSystem';
import './Modal.css';

export function TravelMap({
  person,
  onTravel,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  const currentCity = getCityByName(person.city);

  const citiesByContinent = useMemo(() => getCitiesByContinent(), []);
  const continentNames = Object.keys(citiesByContinent);

  const filteredCities = useMemo(() => {
    let cities = CITIES;
    if (filter === 'domestic') {
      cities = cities.filter(c => c.country === person.country);
    } else if (filter === 'international') {
      cities = cities.filter(c => c.country !== person.country);
    } else if (filter !== 'all') {
      cities = cities.filter(c => getContinent(c.country) === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      cities = cities.filter(
        c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
      );
    }
    return cities;
  }, [filter, search, person.country]);

  const flightCost = useMemo(() => {
    if (!selectedCity || !currentCity) {
      return 0;
    }
    return calculateFlightCost(currentCity, selectedCity);
  }, [selectedCity, currentCity]);

  const canTravel = selectedCity && person.city !== selectedCity.name && person.money >= flightCost;

  const continents = useMemo(
    () => [...new Set(CITIES.map(c => getContinent(c.country)))].sort(),
    []
  );

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '750px', maxHeight: '90vh', overflow: 'auto' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{t('travel.title', 'Travel Map')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                background: 'rgba(33,150,243,0.06)',
                border: '1px solid rgba(33,150,243,0.15)',
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '0.9rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span>{person.city ? `${person.city}, ${person.country}` : 'Unknown'}</span>
              <span style={{ color: '#888' }}>
                {Array.isArray(person.countriesVisited) ? `${person.countriesVisited.length}` : '0'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder={t('travel.search', 'Search cities...')}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setSelectedCity(null);
              }}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #444',
                background: '#222',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            />
            <select
              value={filter}
              onChange={e => {
                setFilter(e.target.value);
                setSelectedCity(null);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #444',
                background: '#222',
                color: '#fff',
                fontSize: '0.9rem',
              }}
            >
              <option value="all">{t('travel.all', 'All Cities')}</option>
              <option value="domestic">{t('travel.domestic', 'Domestic')}</option>
              <option value="international">{t('travel.international', 'International')}</option>
              {continents.map(cont => (
                <option key={cont} value={cont}>
                  {cont}
                </option>
              ))}
            </select>
          </div>

          {selectedCity && (
            <div
              style={{
                background: 'rgba(255,215,0,0.06)',
                border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                }}
              >
                <div>
                  <h3 style={{ margin: 0, color: '#ffd700', fontSize: '1.1rem' }}>
                    {selectedCity.name}
                  </h3>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>
                    {selectedCity.country} {getClimateIcon(selectedCity.climate)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4caf50' }}>
                    {t('travel.flightCost', 'Flight')}: ${flightCost.toLocaleString()}
                  </div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>
                    {t('travel.costOfLiving', 'Cost of Living')}: {selectedCity.costIndex}/100
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  fontSize: '0.85rem',
                  marginBottom: '12px',
                }}
              >
                <span>
                  {' '}
                  {selectedCity.culture} {t('travel.culture', 'Culture')}
                </span>
                <span>
                  {' '}
                  {selectedCity.tech} {t('travel.tech', 'Tech')}
                </span>
                <span>
                  {' '}
                  {selectedCity.nature} {t('travel.nature', 'Nature')}
                </span>
                <span style={{ color: selectedCity.crimeRate > 50 ? '#ef5350' : '#4caf50' }}>
                  {selectedCity.crimeRate > 50 ? '' : ''} {selectedCity.crimeRate}/100
                </span>
                <span> {selectedCity.population.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onTravel(selectedCity)}
                  disabled={!canTravel}
                  style={{
                    padding: '10px 20px',
                    background: canTravel ? 'linear-gradient(135deg, #1565c0, #0d47a1)' : '#333',
                    color: canTravel ? '#fff' : '#666',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: canTravel ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold',
                    flex: 1,
                  }}
                >
                  {person.city === selectedCity.name
                    ? t('travel.currentCity', 'Current City')
                    : !canTravel && person.money < flightCost
                      ? t('travel.insufficientFunds', 'Insufficient Funds')
                      : t('travel.travelHere', 'Travel Here')}
                </button>
                <button
                  onClick={() => setSelectedCity(null)}
                  style={{
                    padding: '10px 16px',
                    background: '#333',
                    color: '#ccc',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  {t('travel.close', 'Close')}
                </button>
              </div>
            </div>
          )}

          {filter === 'all' ? (
            <div>
              {continentNames.map(cont => {
                const cities = citiesByContinent[cont].filter(
                  c =>
                    !search.trim() ||
                    c.name.toLowerCase().includes(search.toLowerCase()) ||
                    c.country.toLowerCase().includes(search.toLowerCase())
                );
                if (cities.length === 0) {
                  return null;
                }
                return (
                  <div key={cont} style={{ marginBottom: '16px' }}>
                    <h3
                      style={{
                        fontSize: '0.9rem',
                        color: '#888',
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                        letterSpacing: '1px',
                      }}
                    >
                      {cont}
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '8px',
                      }}
                    >
                      {cities.map(city => (
                        <CityCard
                          key={city.id}
                          city={city}
                          isCurrent={person.city === city.name}
                          isSelected={selectedCity?.id === city.id}
                          flightCost={currentCity ? calculateFlightCost(currentCity, city) : 0}
                          onSelect={() => setSelectedCity(city)}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '8px',
              }}
            >
              {filteredCities.map(city => (
                <CityCard
                  key={city.id}
                  city={city}
                  isCurrent={person.city === city.name}
                  isSelected={selectedCity?.id === city.id}
                  flightCost={currentCity ? calculateFlightCost(currentCity, city) : 0}
                  onSelect={() => setSelectedCity(city)}
                  t={t}
                />
              ))}
              {filteredCities.length === 0 && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '30px',
                    color: '#888',
                  }}
                >
                  {t('travel.noResults', 'No cities found.')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CityCard({ city, isCurrent, isSelected, flightCost, onSelect, t }) {
  return (
    <div
      onClick={onSelect}
      style={{
        padding: '12px',
        borderRadius: '10px',
        background: isSelected
          ? 'rgba(255,215,0,0.1)'
          : isCurrent
            ? 'rgba(76,175,80,0.08)'
            : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isSelected ? 'rgba(255,215,0,0.4)' : isCurrent ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.06)'}`,
        cursor: 'pointer',
        transition: 'all 0.15s',
        position: 'relative',
      }}
    >
      {isCurrent && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            fontSize: '0.6rem',
            background: '#4caf50',
            color: '#fff',
            padding: '1px 6px',
            borderRadius: '6px',
          }}
        >
          Here
        </div>
      )}
      <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '2px' }}>{city.name}</div>
      <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '6px' }}>{city.country}</div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '0.7rem' }}>
        <span style={{ color: '#4caf50' }}>{city.culture}</span>
      </div>
      <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>
        ${flightCost.toLocaleString()}
      </div>
    </div>
  );
}
