import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatOrdinal, getSeason, processSeasonalEvent } from '../Seasons';

describe('getSeason', () => {
  afterEach(() => vi.restoreAllMocks());
  it('returns Spring for age 0 mod 4', () => {
    expect(getSeason(0)).toBe('Spring');
    expect(getSeason(4)).toBe('Spring');
    expect(getSeason(8)).toBe('Spring');
  });

  it('returns Summer for age 1 mod 4', () => {
    expect(getSeason(1)).toBe('Summer');
    expect(getSeason(5)).toBe('Summer');
  });

  it('returns Fall for age 2 mod 4', () => {
    expect(getSeason(2)).toBe('Fall');
    expect(getSeason(6)).toBe('Fall');
  });

  it('returns Winter for age 3 mod 4', () => {
    expect(getSeason(3)).toBe('Winter');
    expect(getSeason(7)).toBe('Winter');
  });

  it('applies money effects exactly once', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const person = {
      age: 2,
      money: 100,
      happiness: 50,
      stress: 0,
      logEvent: vi.fn(),
      updateStats(effects) {
        this.money += Number(effects.money) || 0;
        this.happiness += Number(effects.happiness) || 0;
        this.stress += Number(effects.stress) || 0;
      },
    };

    processSeasonalEvent(person);

    expect(person.money).toBe(300);
  });
});

describe('formatOrdinal', () => {
  it('formats regular and teen birthday suffixes correctly', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 111].map(formatOrdinal)).toEqual([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '11th',
      '12th',
      '13th',
      '21st',
      '22nd',
      '23rd',
      '111th',
    ]);
  });
});
