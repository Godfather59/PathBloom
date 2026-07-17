import { beforeEach, describe, expect, it, vi } from 'vitest';
import { familyTree, FAMILY_TREE_STORAGE_KEY } from '../DynastyMode';
import { GameEngine } from '../GameEngine';
import { generateIPO, getActiveIPOs, restoreInvestmentMarketState } from '../Investments';
import { Person } from '../Person';
import {
  LEGACY_SAVE_KEY,
  loadSaveData,
  migrateLegacySave,
  readSaveMetadata,
  SAVE_KEY_PREFIX,
  SAVE_META_KEY,
  SAVE_VERSION,
  saveGameData,
} from '../SaveSystem';
import { getActiveEventIds, restoreWorldEvents } from '../WorldEvents';

const FIRST_SAVE_TIME = Date.UTC(2025, 0, 2, 3, 4, 5);
const SECOND_SAVE_TIME = Date.UTC(2025, 1, 3, 4, 5, 6);

function setRuntimeState({ economy, eventId, familyName, indexFund, ipoId }) {
  GameEngine.worldState = {
    economy,
    conflict: economy === 'Recession' ? 'War' : 'Peace',
    pandemic: economy === 'Recession',
    activeWorldEvents: [eventId],
  };
  GameEngine.marketTrends = { indexFund, dogecoin: indexFund / 100 };
  restoreWorldEvents([eventId]);
  restoreInvestmentMarketState({
    nextIpoId: Number(ipoId.split('_')[1]) + 1,
    activeIPOs: [
      {
        id: ipoId,
        name: `${familyName} Industries`,
        type: 'stock',
        volatility: 0.3,
        risk: 'medium',
        sector: 'tech',
        dividendYield: 0,
        ipoAge: 2,
        ipoPrice: 25,
      },
    ],
  });
  familyTree.restoreState({
    familyName,
    familyWealth: indexFund * 1000,
    generations: [{ id: indexFund, name: `${familyName} Founder` }],
  });
}

describe('save system', () => {
  beforeEach(() => {
    localStorage.clear();
    GameEngine.resetSimulationState();
    familyTree.reset({ persist: false });
    vi.restoreAllMocks();
  });

  it('restores world, market, IPO, and dynasty state independently for each slot', () => {
    const firstPerson = new Person('Ava', 'Alpha', 'Female', 'Canada');
    setRuntimeState({
      economy: 'Recession',
      eventId: 'global_recession',
      familyName: 'Alpha',
      indexFund: 75,
      ipoId: 'ipo_4',
    });
    expect(saveGameData(firstPerson, 'slot_alpha', { now: FIRST_SAVE_TIME })).toBe(true);

    const secondPerson = new Person('Ben', 'Beta', 'Male', 'Japan');
    setRuntimeState({
      economy: 'Boom',
      eventId: 'tech_boom',
      familyName: 'Beta',
      indexFund: 180,
      ipoId: 'ipo_9',
    });
    expect(saveGameData(secondPerson, 'slot_beta', { now: SECOND_SAVE_TIME })).toBe(true);

    const firstLoad = loadSaveData('slot_alpha');
    expect(firstLoad.person.getFullName()).toBe('Ava Alpha');
    expect(GameEngine.worldState).toMatchObject({
      economy: 'Recession',
      conflict: 'War',
      pandemic: true,
    });
    expect(GameEngine.marketTrends).toEqual({ indexFund: 75, dogecoin: 0.75 });
    expect(getActiveEventIds()).toEqual(['global_recession']);
    expect(getActiveIPOs().map(ipo => ipo.id)).toEqual(['ipo_4']);
    expect(generateIPO().id).toBe('ipo_5');
    expect(familyTree.familyName).toBe('Alpha');

    const secondLoad = loadSaveData('slot_beta');
    expect(secondLoad.person.getFullName()).toBe('Ben Beta');
    expect(GameEngine.worldState.economy).toBe('Boom');
    expect(GameEngine.marketTrends).toEqual({ indexFund: 180, dogecoin: 1.8 });
    expect(getActiveEventIds()).toEqual(['tech_boom']);
    expect(getActiveIPOs().map(ipo => ipo.id)).toEqual(['ipo_9']);
    expect(generateIPO().id).toBe('ipo_10');
    expect(familyTree.familyName).toBe('Beta');
  });

  it('resets runtime globals when loading a pre-version-4 save', () => {
    setRuntimeState({
      economy: 'Recession',
      eventId: 'global_recession',
      familyName: 'Leaked State',
      indexFund: 25,
      ipoId: 'ipo_12',
    });
    const person = new Person('Legacy', 'Player', 'Female', 'Morocco');
    localStorage.setItem(`${SAVE_KEY_PREFIX}slot_v3`, JSON.stringify({ version: 3, person }));

    expect(loadSaveData('slot_v3').person.getFullName()).toBe('Legacy Player');
    expect(GameEngine.worldState).toEqual({
      economy: 'Normal',
      conflict: 'Peace',
      pandemic: false,
      activeWorldEvents: [],
    });
    expect(GameEngine.marketTrends).toEqual({ indexFund: 100, dogecoin: 0.5 });
    expect(getActiveEventIds()).toEqual([]);
    expect(getActiveIPOs()).toEqual([]);
    expect(familyTree.familyName).toBe('');
  });

  it('migrates the single legacy save and its dynasty state exactly once', () => {
    const person = new Person('Mina', 'Legacy', 'Female', 'Morocco');
    localStorage.setItem(LEGACY_SAVE_KEY, JSON.stringify(person));
    localStorage.setItem(
      FAMILY_TREE_STORAGE_KEY,
      JSON.stringify({
        familyName: 'Legacy',
        familyWealth: 50000,
        generations: [{ id: 1, name: 'First Legacy' }],
      })
    );

    const migrated = migrateLegacySave({ now: FIRST_SAVE_TIME });
    expect(migrated?.slotId).toBe('slot_legacy');
    expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBeNull();
    expect(readSaveMetadata()).toEqual([
      expect.objectContaining({ id: 'slot_legacy', name: 'Mina Legacy' }),
    ]);

    const saved = JSON.parse(localStorage.getItem(`${SAVE_KEY_PREFIX}slot_legacy`));
    expect(saved.version).toBe(SAVE_VERSION);
    expect(saved.simulationState.familyTree.familyName).toBe('Legacy');
    expect(saved.createdAt).toBe(new Date(FIRST_SAVE_TIME).toISOString());
    expect(migrateLegacySave({ now: SECOND_SAVE_TIME })).toBeNull();
  });

  it('keeps a corrupt legacy save available for recovery', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(LEGACY_SAVE_KEY, '{invalid-json');

    expect(migrateLegacySave()).toBeNull();
    expect(localStorage.getItem(LEGACY_SAVE_KEY)).toBe('{invalid-json');
    expect(localStorage.getItem(SAVE_META_KEY)).toBeNull();
    expect(warning).toHaveBeenCalled();
  });

  it('hides metadata entries whose save payload is missing or corrupt', () => {
    const person = new Person('Valid', 'Slot', 'Male', 'Canada');
    expect(saveGameData(person, 'slot_valid', { now: FIRST_SAVE_TIME })).toBe(true);
    localStorage.setItem(`${SAVE_KEY_PREFIX}slot_corrupt`, JSON.stringify({ unexpected: true }));
    localStorage.setItem(
      SAVE_META_KEY,
      JSON.stringify([
        { id: 'slot_missing', name: 'Missing', lastPlayed: SECOND_SAVE_TIME },
        { id: 'slot_corrupt', name: 'Corrupt', lastPlayed: SECOND_SAVE_TIME },
        { id: 'slot_valid', name: 'Valid Slot', lastPlayed: FIRST_SAVE_TIME },
      ])
    );

    expect(readSaveMetadata()).toEqual([
      expect.objectContaining({ id: 'slot_valid', name: 'Valid Slot' }),
    ]);
  });

  it('preserves a slot creation timestamp across later saves', () => {
    const person = new Person('Time', 'Keeper', 'Male', 'Canada');
    expect(saveGameData(person, 'slot_time', { now: FIRST_SAVE_TIME })).toBe(true);
    person.age = 10;
    expect(saveGameData(person, 'slot_time', { now: SECOND_SAVE_TIME })).toBe(true);

    const saved = JSON.parse(localStorage.getItem(`${SAVE_KEY_PREFIX}slot_time`));
    expect(saved.createdAt).toBe(new Date(FIRST_SAVE_TIME).toISOString());
    expect(saved.updatedAt).toBe(new Date(SECOND_SAVE_TIME).toISOString());
    expect(readSaveMetadata()).toEqual([
      expect.objectContaining({ id: 'slot_time', age: 10, lastPlayed: SECOND_SAVE_TIME }),
    ]);
  });
});
