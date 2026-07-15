import { describe, it, expect, beforeEach } from 'vitest';
import { CITIES, getCitiesByCountry, getDefaultCityForCountry } from '../City';
import {
  generateWorldEvents,
  getEventEffects,
  getActiveWorldEvents,
  clearWorldEvents,
  ageWorldEvents,
} from '../WorldEvents';

describe('City Data', () => {
  it('has at least 30 cities', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(30);
  });

  it('returns cities by country', () => {
    const usCities = getCitiesByCountry('United States');
    expect(usCities.length).toBeGreaterThanOrEqual(4);
    expect(usCities[0].country).toBe('United States');
  });

  it('returns default city for a country', () => {
    const city = getDefaultCityForCountry('Japan');
    expect(city).toBeTruthy();
    expect(city.country).toBe('Japan');
  });

  it('each city has required fields', () => {
    for (const city of CITIES) {
      expect(city.id).toBeTruthy();
      expect(city.name).toBeTruthy();
      expect(city.country).toBeTruthy();
      expect(typeof city.population).toBe('number');
      expect(typeof city.costIndex).toBe('number');
      expect(typeof city.crimeRate).toBe('number');
      expect(typeof city.culture).toBe('number');
    }
  });
});

describe('World Events', () => {
  beforeEach(() => {
    clearWorldEvents();
  });

  it('generates world events', () => {
    const events = generateWorldEvents(25);
    expect(Array.isArray(events)).toBe(true);
  });

  it('getEventEffects returns defaults when no active events', () => {
    const effects = getEventEffects();
    expect(effects.salaryMult).toBe(1);
    expect(effects.happinessImpact).toBe(0);
    expect(effects.travelBan).toBe(false);
  });

  it('ageWorldEvents reduces event count over time', () => {
    clearWorldEvents();
    generateWorldEvents(25);
    const before = getActiveWorldEvents().length;
    for (let i = 0; i < 10; i++) {
      ageWorldEvents();
    }
    const after = getActiveWorldEvents().length;
    expect(after).toBeLessThanOrEqual(before);
  });
});
