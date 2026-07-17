import { familyTree, FAMILY_TREE_STORAGE_KEY } from './DynastyMode';
import { GameEngine } from './GameEngine';
import { Person } from './Person';

export const SAVE_VERSION = 4;
export const SAVE_META_KEY = 'bitlife_save_meta';
export const LEGACY_SAVE_KEY = 'bitlife_save';
export const SAVE_KEY_PREFIX = 'bitlife_save_';

function resolveStorage(storage) {
  if (storage) {
    return storage;
  }
  return typeof localStorage === 'undefined' ? null : localStorage;
}

function resolveTimestamp(now) {
  const value = typeof now === 'function' ? now() : now;
  const date = value == null ? new Date() : new Date(value);
  return Number.isNaN(date.getTime()) ? Date.now() : date.getTime();
}

function parseStoredObject(storage, key) {
  const raw = storage?.getItem(key);
  if (!raw) {
    return null;
  }
  const parsed = JSON.parse(raw);
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
}

function isPersonData(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    value.name &&
    typeof value.name === 'object' &&
    (typeof value.name.first === 'string' || typeof value.name.last === 'string')
  );
}

function getPersonName(person) {
  const name =
    typeof person.getFullName === 'function'
      ? person.getFullName()
      : `${String(person.name?.first || '')} ${String(person.name?.last || '')}`.trim();
  return name || 'Unnamed Life';
}

function getCreatedAt(storage, slotId, person, fallback, explicitCreatedAt) {
  if (typeof explicitCreatedAt === 'string' && explicitCreatedAt) {
    return explicitCreatedAt;
  }

  try {
    const existing = parseStoredObject(storage, `${SAVE_KEY_PREFIX}${slotId}`);
    if (typeof existing?.createdAt === 'string' && existing.createdAt) {
      return existing.createdAt;
    }
  } catch {
    // A malformed previous slot should not prevent a clean overwrite.
  }

  return typeof person._createdAt === 'string' && person._createdAt ? person._createdAt : fallback;
}

function readLegacyFamilyState(storage) {
  try {
    return parseStoredObject(storage, FAMILY_TREE_STORAGE_KEY) || familyTree.getState();
  } catch {
    return familyTree.getState();
  }
}

export function createSlotId(now = Date.now) {
  return `slot_${resolveTimestamp(now)}`;
}

export function captureRuntimeState() {
  return {
    version: 1,
    engine: GameEngine.captureSimulationState(),
    familyTree: familyTree.getState(),
  };
}

export function restoreRuntimeState(state = null) {
  const runtimeState = state && typeof state === 'object' ? state : {};
  const engineState = runtimeState.engine || (runtimeState.worldState ? runtimeState : null);
  GameEngine.restoreSimulationState(engineState);
  familyTree.restoreState(runtimeState.familyTree);
  return captureRuntimeState();
}

export function resetRuntimeState() {
  GameEngine.resetSimulationState();
  familyTree.reset({ persist: false });
  return captureRuntimeState();
}

export function readSaveMetadata(storage) {
  const targetStorage = resolveStorage(storage);
  if (!targetStorage) {
    return [];
  }

  try {
    const parsed = JSON.parse(targetStorage.getItem(SAVE_META_KEY) || '[]');
    if (!Array.isArray(parsed)) {
      return [];
    }
    const metadata = [];
    const seen = new Set();
    for (const slot of parsed) {
      if (
        !slot ||
        typeof slot !== 'object' ||
        typeof slot.id !== 'string' ||
        slot.id.length === 0 ||
        typeof slot.name !== 'string' ||
        seen.has(slot.id)
      ) {
        continue;
      }

      try {
        const payload = parseStoredObject(targetStorage, `${SAVE_KEY_PREFIX}${slot.id}`);
        normalizeSavePayload(payload);
        const age = Number(slot.age);
        const lastPlayed = Number(slot.lastPlayed);
        seen.add(slot.id);
        metadata.push({
          ...slot,
          age: Number.isFinite(age) && age >= 0 ? Math.floor(age) : 0,
          job: typeof slot.job === 'string' && slot.job ? slot.job : 'Unemployed',
          lastPlayed: Number.isFinite(lastPlayed) ? lastPlayed : 0,
        });
      } catch {
        // Ignore metadata entries that do not point to a loadable save payload.
      }
    }
    return metadata;
  } catch {
    return [];
  }
}

export function getMostRecentSaveMetadata(metadata = readSaveMetadata()) {
  return [...metadata].sort((a, b) => Number(b.lastPlayed) - Number(a.lastPlayed))[0] || null;
}

export function normalizeSavePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new Error('Save data is not a valid object.');
  }

  const isEnvelope = payload.person && typeof payload.person === 'object';
  const personData = isEnvelope ? payload.person : payload;
  if (!isPersonData(personData)) {
    throw new Error('Save data does not contain a valid person.');
  }

  return {
    version: Number(payload.version) || 1,
    personData,
    simulationState: isEnvelope ? payload.simulationState || payload.runtimeState || null : null,
    createdAt: typeof payload.createdAt === 'string' ? payload.createdAt : null,
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : null,
  };
}

export function saveGameData(person, slotId, options = {}) {
  const storage = resolveStorage(options.storage);
  if (!storage || !slotId || !isPersonData(person)) {
    return false;
  }

  const timestamp = resolveTimestamp(options.now);
  const updatedAt = new Date(timestamp).toISOString();
  const createdAt = getCreatedAt(storage, slotId, person, updatedAt, options.createdAt);
  const save = {
    version: SAVE_VERSION,
    person,
    simulationState: options.simulationState || captureRuntimeState(),
    createdAt,
    updatedAt,
  };

  try {
    storage.setItem(`${SAVE_KEY_PREFIX}${slotId}`, JSON.stringify(save));

    const metadata = readSaveMetadata(storage).filter(slot => slot.id !== slotId);
    metadata.unshift({
      id: slotId,
      name: getPersonName(person),
      age: Number(person.age) || 0,
      job: person.job?.title || 'Unemployed',
      lastPlayed: timestamp,
    });
    storage.setItem(SAVE_META_KEY, JSON.stringify(metadata));
    return true;
  } catch (error) {
    console.error('Failed to save game data:', error);
    return false;
  }
}

export function loadSaveData(slotId, options = {}) {
  const storage = resolveStorage(options.storage);
  if (!storage || !slotId) {
    throw new Error('Save storage or slot ID is unavailable.');
  }

  const payload = parseStoredObject(storage, `${SAVE_KEY_PREFIX}${slotId}`);
  if (!payload) {
    throw new Error('Save slot was not found.');
  }

  const normalized = normalizeSavePayload(payload);
  const person = Person.load(normalized.personData);
  if (!person || !person.name || typeof person.name !== 'object') {
    throw new Error('Saved person could not be restored.');
  }

  if (options.restoreRuntime !== false) {
    restoreRuntimeState(normalized.simulationState);
  }

  return {
    person,
    version: normalized.version,
    simulationState: normalized.simulationState,
    createdAt: normalized.createdAt,
    updatedAt: normalized.updatedAt,
  };
}

export function migrateLegacySave(options = {}) {
  const storage = resolveStorage(options.storage);
  if (!storage || readSaveMetadata(storage).length > 0) {
    return null;
  }

  let normalized;
  try {
    const legacyPayload = parseStoredObject(storage, LEGACY_SAVE_KEY);
    if (!legacyPayload) {
      return null;
    }
    normalized = normalizeSavePayload(legacyPayload);
  } catch (error) {
    console.warn('Unable to migrate the legacy save.', error);
    return null;
  }

  const person = Person.load(normalized.personData);
  const legacyFamilyTree = readLegacyFamilyState(storage);
  const simulationState = normalized.simulationState
    ? {
        ...normalized.simulationState,
        familyTree: normalized.simulationState.familyTree || legacyFamilyTree,
      }
    : {
        version: 1,
        engine: GameEngine.resetSimulationState(),
        familyTree: legacyFamilyTree,
      };
  const slotId = options.slotId || 'slot_legacy';

  restoreRuntimeState(simulationState);
  const saved = saveGameData(person, slotId, {
    storage,
    now: options.now,
    createdAt: normalized.createdAt,
    simulationState,
  });
  if (!saved) {
    return null;
  }

  storage.removeItem(LEGACY_SAVE_KEY);
  return {
    slotId,
    person,
    metadata: getMostRecentSaveMetadata(readSaveMetadata(storage)),
  };
}
