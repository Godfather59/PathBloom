const CUSTOM_PACKS_KEY = 'pathbloom.customContentPacks.v1';
const DISABLED_PACKS_KEY = 'pathbloom.disabledContentPacks.v1';
const SCHEMA_VERSION = 1;

const builtinModules =
  typeof import.meta.glob === 'function'
    ? import.meta.glob('../content/packs/*.json', { eager: true, import: 'default' })
    : {};

const asObject = value => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});
const asArray = value => (Array.isArray(value) ? value : []);
const hasText = value => typeof value === 'string' && value.trim().length > 0;

function safeStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}

function parseStoredArray(key) {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeLocalizedText(value) {
  const text = asObject(value);
  return {
    en: hasText(text.en) ? text.en.trim() : '',
    ar: hasText(text.ar) ? text.ar.trim() : '',
  };
}

function normalizeChoice(choice) {
  const source = asObject(choice);
  return {
    ...source,
    id: hasText(source.id) ? source.id.trim() : '',
    text: normalizeLocalizedText(source.text),
    outcome: normalizeLocalizedText(source.outcome),
    effects: asObject(source.effects),
    reputation: asObject(source.reputation),
    setFlags: asObject(source.setFlags),
    next: source.next ? asObject(source.next) : null,
  };
}

function normalizeEvent(event, pack) {
  const source = asObject(event);
  return {
    ...source,
    id: hasText(source.id) ? source.id.trim() : '',
    category: hasText(source.category) ? source.category.trim() : pack.category,
    frequency: source.frequency === 'month' ? 'month' : 'year',
    weight: Math.max(1, Math.floor(Number(source.weight) || 1)),
    cooldownMonths: Math.max(0, Math.floor(Number(source.cooldownMonths) || 0)),
    hidden: Boolean(source.hidden),
    conditions: asObject(source.conditions),
    text: normalizeLocalizedText(source.text),
    choices: asArray(source.choices).map(normalizeChoice),
  };
}

export function normalizeContentPack(input, source = 'custom') {
  const raw = asObject(input);
  const pack = {
    schemaVersion: Math.floor(Number(raw.schemaVersion) || SCHEMA_VERSION),
    id: hasText(raw.id) ? raw.id.trim() : '',
    name: normalizeLocalizedText(raw.name),
    description: normalizeLocalizedText(raw.description),
    category: hasText(raw.category) ? raw.category.trim() : 'general',
    countries: asArray(raw.countries).filter(hasText),
    enabled: raw.enabled !== false,
    source,
    events: [],
  };
  pack.events = asArray(raw.events).map(event => normalizeEvent(event, pack));
  return pack;
}

function addError(errors, path, message, code = 'INVALID_CONTENT') {
  errors.push({ path, message, code });
}

export function validateContentPack(input) {
  const pack = normalizeContentPack(input, input?.source || 'custom');
  const errors = [];
  const warnings = [];

  if (pack.schemaVersion !== SCHEMA_VERSION) {
    addError(errors, 'schemaVersion', `Only schema version ${SCHEMA_VERSION} is supported.`, 'UNSUPPORTED_SCHEMA');
  }
  if (!pack.id || !/^[a-z0-9][a-z0-9_-]*$/i.test(pack.id)) {
    addError(errors, 'id', 'Pack id must contain only letters, numbers, underscores, and hyphens.');
  }
  if (!pack.name.en || !pack.name.ar) {
    addError(errors, 'name', 'Pack name requires both English and Arabic text.', 'MISSING_TRANSLATION');
  }
  if (pack.events.length === 0) {
    addError(errors, 'events', 'A content pack must contain at least one event.');
  }

  const eventIds = new Set();
  pack.events.forEach((event, eventIndex) => {
    const base = `events[${eventIndex}]`;
    if (!event.id || !/^[a-z0-9][a-z0-9_-]*$/i.test(event.id)) {
      addError(errors, `${base}.id`, 'Event id is missing or invalid.');
    } else if (eventIds.has(event.id)) {
      addError(errors, `${base}.id`, `Duplicate event id: ${event.id}.`, 'DUPLICATE_ID');
    }
    eventIds.add(event.id);

    if (!event.text.en || !event.text.ar) {
      addError(errors, `${base}.text`, 'Every event requires English and Arabic text.', 'MISSING_TRANSLATION');
    }
    if (event.choices.length < 2) {
      addError(errors, `${base}.choices`, 'Every playable event requires at least two choices.', 'MISSING_CHOICES');
    }

    const choiceIds = new Set();
    event.choices.forEach((choice, choiceIndex) => {
      const choicePath = `${base}.choices[${choiceIndex}]`;
      if (!choice.id) addError(errors, `${choicePath}.id`, 'Choice id is required.');
      else if (choiceIds.has(choice.id)) addError(errors, `${choicePath}.id`, `Duplicate choice id: ${choice.id}.`, 'DUPLICATE_ID');
      choiceIds.add(choice.id);
      if (!choice.text.en || !choice.text.ar) {
        addError(errors, `${choicePath}.text`, 'Every choice requires English and Arabic text.', 'MISSING_TRANSLATION');
      }
      if (!choice.outcome.en || !choice.outcome.ar) {
        warnings.push({
          path: `${choicePath}.outcome`,
          code: 'MISSING_OUTCOME_TRANSLATION',
          message: 'Choice outcome should include both English and Arabic text.',
        });
      }
    });
  });

  pack.events.forEach((event, eventIndex) => {
    event.choices.forEach((choice, choiceIndex) => {
      if (choice.next?.eventId && !eventIds.has(choice.next.eventId)) {
        addError(
          errors,
          `events[${eventIndex}].choices[${choiceIndex}].next.eventId`,
          `Follow-up event ${choice.next.eventId} does not exist in this pack.`,
          'BROKEN_FOLLOW_UP'
        );
      }
    });
  });

  return { valid: errors.length === 0, errors, warnings, pack };
}

function readCustomPacks() {
  return parseStoredArray(CUSTOM_PACKS_KEY)
    .map(pack => validateContentPack(pack))
    .filter(result => result.valid)
    .map(result => ({ ...result.pack, source: 'custom' }));
}

function getBuiltinPacks() {
  return Object.values(builtinModules)
    .map(pack => validateContentPack(pack))
    .filter(result => result.valid)
    .map(result => ({ ...result.pack, source: 'builtin' }));
}

export function getDisabledContentPackIds() {
  return new Set(parseStoredArray(DISABLED_PACKS_KEY).filter(hasText));
}

export function setContentPackEnabled(packId, enabled) {
  const storage = safeStorage();
  if (!storage || !hasText(packId)) return false;
  const disabled = getDisabledContentPackIds();
  if (enabled) disabled.delete(packId);
  else disabled.add(packId);
  storage.setItem(DISABLED_PACKS_KEY, JSON.stringify([...disabled]));
  return true;
}

export function getAllContentPacks({ includeDisabled = true } = {}) {
  const disabled = getDisabledContentPackIds();
  const byId = new Map();
  [...getBuiltinPacks(), ...readCustomPacks()].forEach(pack => byId.set(pack.id, pack));
  return [...byId.values()]
    .map(pack => ({ ...pack, enabled: pack.enabled !== false && !disabled.has(pack.id) }))
    .filter(pack => includeDisabled || pack.enabled);
}

export function getEnabledContentPacks() {
  return getAllContentPacks({ includeDisabled: false });
}

export function saveCustomContentPack(input) {
  const validation = validateContentPack(input);
  if (!validation.valid) return validation;
  const storage = safeStorage();
  if (!storage) {
    return {
      ...validation,
      valid: false,
      errors: [{ path: 'storage', code: 'STORAGE_UNAVAILABLE', message: 'Local storage is unavailable.' }],
    };
  }
  const packs = parseStoredArray(CUSTOM_PACKS_KEY);
  const index = packs.findIndex(pack => pack?.id === validation.pack.id);
  const storedPack = { ...validation.pack, source: undefined };
  if (index >= 0) packs[index] = storedPack;
  else packs.push(storedPack);
  storage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(packs.slice(-50)));
  return validation;
}

export function deleteCustomContentPack(packId) {
  const storage = safeStorage();
  if (!storage) return false;
  const packs = parseStoredArray(CUSTOM_PACKS_KEY).filter(pack => pack?.id !== packId);
  storage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(packs));
  return true;
}

export function createContentPackTemplate() {
  return {
    schemaVersion: SCHEMA_VERSION,
    id: 'my-story-pack',
    name: { en: 'My Story Pack', ar: 'حزمة قصصي' },
    description: { en: 'Custom PathBloom stories.', ar: 'قصص مخصصة للعبة.' },
    category: 'general',
    countries: ['*'],
    events: [
      {
        id: 'first_custom_event',
        frequency: 'year',
        weight: 5,
        cooldownMonths: 24,
        conditions: { minAge: 18 },
        text: { en: 'A new opportunity appeared.', ar: 'ظهرت أمامك فرصة جديدة.' },
        choices: [
          {
            id: 'accept',
            text: { en: 'Accept it', ar: 'اقبلها' },
            outcome: { en: 'You accepted the opportunity.', ar: 'قبلت الفرصة.' },
            effects: { happiness: 4, stress: 2 },
          },
          {
            id: 'decline',
            text: { en: 'Decline', ar: 'ارفض' },
            outcome: { en: 'You decided to wait.', ar: 'قررت الانتظار.' },
            effects: { stress: -1 },
          },
        ],
      },
    ],
  };
}

export const CONTENT_PACK_SCHEMA_VERSION = SCHEMA_VERSION;
