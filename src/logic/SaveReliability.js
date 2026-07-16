const STORAGE_VERSION = 1;

function storage() {
  if (typeof localStorage === 'undefined') return null;
  return localStorage;
}

function keySet(slotId) {
  const primary = `bitlife_save_${slotId}`;
  return {
    primary,
    backup: `${primary}_backup`,
    temp: `${primary}_tmp`,
    health: `pathbloom_save_health_${slotId}`,
  };
}

export function checksumText(text) {
  let hash = 0x811c9dc5;
  const source = String(text || '');
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function wrapPayload(payload) {
  const payloadText = JSON.stringify(payload);
  return {
    storageVersion: STORAGE_VERSION,
    checksum: checksumText(payloadText),
    payload,
  };
}

export function parseStoredSave(raw) {
  if (typeof raw !== 'string' || !raw.trim()) {
    return { ok: false, reason: 'empty' };
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'invalid_json' };
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, reason: 'invalid_shape' };
  }

  if (parsed.storageVersion === STORAGE_VERSION && Object.hasOwn(parsed, 'payload')) {
    const payloadText = JSON.stringify(parsed.payload);
    if (checksumText(payloadText) !== parsed.checksum) {
      return { ok: false, reason: 'checksum_mismatch' };
    }
    if (!parsed.payload || typeof parsed.payload !== 'object' || Array.isArray(parsed.payload)) {
      return { ok: false, reason: 'invalid_payload' };
    }
    return { ok: true, payload: parsed.payload, protected: true };
  }

  // Legacy saves are accepted and will be upgraded on the next successful save.
  return { ok: true, payload: parsed, protected: false };
}

function setHealth(slotId, health) {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(
      keySet(slotId).health,
      JSON.stringify({ ...health, checkedAt: Date.now() })
    );
  } catch {
    // Health metadata is optional and should never block gameplay.
  }
}

export function writeSaveTransaction(slotId, payload) {
  const store = storage();
  if (!store || !slotId || !payload || typeof payload !== 'object') {
    return { ok: false, reason: 'unavailable' };
  }

  const keys = keySet(slotId);
  const wrapped = wrapPayload(payload);
  const serialized = JSON.stringify(wrapped);
  let backupCreated = false;

  try {
    const existing = store.getItem(keys.primary);
    if (existing && parseStoredSave(existing).ok) {
      store.setItem(keys.backup, existing);
      backupCreated = true;
    }

    store.setItem(keys.temp, serialized);
    const verifiedTemp = parseStoredSave(store.getItem(keys.temp));
    if (!verifiedTemp.ok) {
      throw new Error(`Temporary save verification failed: ${verifiedTemp.reason}`);
    }

    store.setItem(keys.primary, serialized);
    const verifiedPrimary = parseStoredSave(store.getItem(keys.primary));
    if (!verifiedPrimary.ok) {
      throw new Error(`Primary save verification failed: ${verifiedPrimary.reason}`);
    }

    store.removeItem(keys.temp);
    setHealth(slotId, {
      status: 'healthy',
      protected: true,
      backupAvailable: Boolean(store.getItem(keys.backup)),
      updatedAt: payload.updatedAt || new Date().toISOString(),
    });

    return {
      ok: true,
      backupCreated,
      protected: true,
      updatedAt: payload.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    setHealth(slotId, {
      status: 'error',
      protected: false,
      backupAvailable: Boolean(store.getItem(keys.backup)),
      reason: error?.message || String(error),
    });
    return { ok: false, reason: error?.message || String(error), backupCreated };
  }
}

export function readSaveWithRecovery(slotId) {
  const store = storage();
  if (!store || !slotId) return { ok: false, reason: 'unavailable' };
  const keys = keySet(slotId);
  const candidates = [
    ['primary', keys.primary],
    ['temp', keys.temp],
    ['backup', keys.backup],
  ];
  const failures = [];

  for (const [source, key] of candidates) {
    const raw = store.getItem(key);
    if (!raw) continue;
    const parsed = parseStoredSave(raw);
    if (parsed.ok) {
      if (source !== 'primary') {
        try {
          store.setItem(keys.primary, raw);
          if (source === 'temp') store.removeItem(keys.temp);
        } catch {
          // Returning the recovered payload is still better than failing the load.
        }
      }
      setHealth(slotId, {
        status: source === 'primary' ? 'healthy' : 'recovered',
        protected: parsed.protected,
        recoveredFrom: source,
        backupAvailable: Boolean(store.getItem(keys.backup)),
      });
      return {
        ok: true,
        payload: parsed.payload,
        source,
        recovered: source !== 'primary',
        protected: parsed.protected,
      };
    }
    failures.push({ source, reason: parsed.reason });
  }

  setHealth(slotId, {
    status: 'corrupt',
    protected: false,
    backupAvailable: false,
    failures,
  });
  return { ok: false, reason: 'no_valid_copy', failures };
}

export function inspectSaveSlot(slotId) {
  const store = storage();
  if (!store || !slotId) return { status: 'missing', loadable: false };
  const keys = keySet(slotId);
  const primary = parseStoredSave(store.getItem(keys.primary));
  const temp = parseStoredSave(store.getItem(keys.temp));
  const backup = parseStoredSave(store.getItem(keys.backup));
  const loadable = primary.ok || temp.ok || backup.ok;
  const recoveryAvailable = !primary.ok && (temp.ok || backup.ok);
  return {
    status: primary.ok ? 'healthy' : recoveryAvailable ? 'recoverable' : 'corrupt',
    loadable,
    protected: primary.ok ? primary.protected : temp.ok ? temp.protected : backup.protected,
    backupAvailable: backup.ok,
    recoveryAvailable,
  };
}

export function deleteSaveTransaction(slotId) {
  const store = storage();
  if (!store || !slotId) return false;
  const keys = keySet(slotId);
  try {
    store.removeItem(keys.primary);
    store.removeItem(keys.backup);
    store.removeItem(keys.temp);
    store.removeItem(keys.health);
    return true;
  } catch {
    return false;
  }
}

export function readSaveHealth(slotId) {
  const store = storage();
  if (!store || !slotId) return null;
  try {
    const raw = store.getItem(keySet(slotId).health);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
