import { GameEngine } from './GameEngine';
import { Person } from './Person';
import { GOVERNMENT_TYPES } from './WorldSimulation';
import { getCountryData } from './GeoPolitics';
import {
  advanceOneMonth,
  ensureTimeProgress,
  recordYearAdvance,
} from './TimeProgression';

// Centralized compatibility fixes for the simulation engine. These keep old saves
// playable while avoiding a large GameEngine rewrite in one patch.
if (!GOVERNMENT_TYPES.autocracy) {
  GOVERNMENT_TYPES.autocracy = {
    id: 'autocracy',
    label: 'Autocracy',
    stabilityBase: 12,
    corruptionBase: 28,
    freedom: 25,
    electionCycle: 0,
    militaryControl: 45,
    revolutionRisk: 0.04,
    description: 'Centralized rule with limited political competition.',
  };
}

function cloneDefaultWorldState() {
  const base = GameEngine.worldState || {
    economy: 'Normal',
    conflict: 'Peace',
    pandemic: false,
    activeWorldEvents: [],
  };

  if (typeof structuredClone === 'function') {
    return structuredClone(base);
  }

  return JSON.parse(JSON.stringify(base));
}

function createSimulationSeed(person) {
  const name =
    typeof person?.getFullName === 'function'
      ? person.getFullName()
      : `${person?.name?.first || 'Player'} ${person?.name?.last || ''}`.trim();
  return `${name || 'player'}-${person?.country || 'world'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ensurePersonalWorldState(person) {
  if (!person || typeof person !== 'object') {
    return GameEngine.worldState;
  }

  if (!person.worldState || typeof person.worldState !== 'object') {
    person.worldState = cloneDefaultWorldState();
  }

  person.worldState.economy ??= 'Normal';
  person.worldState.conflict ??= 'Peace';
  person.worldState.pandemic ??= false;
  person.worldState.activeWorldEvents ??= [];
  person.simulationSeed ??= createSimulationSeed(person);
  ensureTimeProgress(person);

  // Keep legacy GameEngine methods working while making world state per-life.
  GameEngine.worldState = person.worldState;
  return person.worldState;
}

function normalizeGeopoliticalYear(state) {
  if (!state || typeof state !== 'object') return state;
  const currentYear = new Date().getFullYear();
  if (!Number.isFinite(state.year) || state.year === 2025) {
    state.year = currentYear;
  }
  return state;
}

const originalGetGeopoliticalState = GameEngine.getGeopoliticalState.bind(GameEngine);
GameEngine.getGeopoliticalState = function getGeopoliticalStateWithCurrentYear(person) {
  const state = originalGetGeopoliticalState(person);
  return normalizeGeopoliticalYear(state);
};

const originalInitializeFamily = GameEngine.initializeFamily?.bind(GameEngine);
if (originalInitializeFamily) {
  GameEngine.initializeFamily = function initializeFamilyWithSaveWorld(person) {
    ensurePersonalWorldState(person);
    GameEngine.getGeopoliticalState(person);
    return originalInitializeFamily(person);
  };
}

const originalUpdateWorldState = GameEngine.updateWorldState.bind(GameEngine);
GameEngine.updateWorldState = function updatePersonalWorldState(person) {
  ensurePersonalWorldState(person);
  return originalUpdateWorldState(person);
};

// Hybrid time progression: normal play advances one year, while active situations
// may advance one month at a time. Twelve monthly ticks still run the full yearly
// simulation and annual recap exactly once.
const originalSimulateYear = GameEngine.simulateYear.bind(GameEngine);
GameEngine.simulateYear = function simulateYearWithMonthlyCompatibility(person) {
  const timeState = ensureTimeProgress(person);
  if (timeState?.skipPrisonAnnualTick && person?.isInPrison) {
    // Monthly prison progression already removed twelve months. Neutralize the
    // legacy yearly sentence decrement while still running the rest of the year.
    person.prisonSentence = Math.max(0, Number(person.prisonSentence) || 0) + 1;
  }

  try {
    return originalSimulateYear(person);
  } finally {
    if (timeState) timeState.skipPrisonAnnualTick = false;
  }
};

const originalAgeUp = GameEngine.ageUp.bind(GameEngine);
GameEngine.ageUp = function ageUpWithHybridTime(person, amount = 1) {
  const timeState = ensureTimeProgress(person);

  if (amount === 'month') {
    return advanceOneMonth(person, target => originalAgeUp(target, 1));
  }

  const ageBefore = Math.max(0, Math.floor(Number(person?.age) || 0));
  const wasInPrison = Boolean(person?.isInPrison);
  if (wasInPrison && timeState.prisonMonthsRemaining === null) {
    timeState.prisonMonthsRemaining = Math.max(
      0,
      Math.round((Number(person.prisonSentence) || 0) * 12)
    );
  }

  const result = originalAgeUp(person, amount);
  const ageAfter = Math.max(ageBefore, Math.floor(Number(person?.age) || ageBefore));
  const completedYears = ageAfter - ageBefore;

  if (wasInPrison) {
    if (person.isInPrison) {
      timeState.prisonMonthsRemaining = Math.max(
        0,
        (Number(timeState.prisonMonthsRemaining) || 0) - completedYears * 12
      );
      person.prisonSentence = Math.ceil(timeState.prisonMonthsRemaining / 12);
    } else {
      timeState.prisonMonthsRemaining = null;
    }
  }

  recordYearAdvance(person);
  return result;
};

// Preserve monthly state through the Person cloning path used by React updates.
const originalClone = Person.prototype.clone;
if (typeof originalClone === 'function') {
  Person.prototype.clone = function cloneWithTimeProgress() {
    const cloned = originalClone.call(this);
    if (this.timeProgress) {
      cloned.timeProgress = { ...this.timeProgress };
    }
    ensureTimeProgress(cloned);
    return cloned;
  };
}

// The prison screen previously received no onAgeUp callback. Route its progression
// through the action callback that App already provides.
const originalPrisonAction = Person.prototype.prisonAction;
Person.prototype.prisonAction = function prisonActionWithTimeControls(action) {
  if (action === '__advance_month__') {
    return GameEngine.ageUp(this, 'month');
  }
  if (action === '__advance_year__') {
    return GameEngine.ageUp(this, 1);
  }
  return originalPrisonAction.call(this, action);
};

function getActiveWarEntries(person) {
  const wars = Object.entries(person?.wars || {}).filter(([, war]) => war);
  if (wars.length > 0) return wars;

  return Object.entries(person?.countryRelations || {})
    .filter(([, rel]) => rel?.atWar)
    .map(([countryId]) => [countryId, { targetId: countryId }]);
}

function getEnemyName(countryId, war, state) {
  return (
    war?.targetName ||
    state?.countries?.[countryId]?.name ||
    getCountryData(countryId)?.name ||
    countryId
  );
}

GameEngine.processWarReactions = function processWarReactionsWithEnemyNames(person, state) {
  if (!state || !state.countries) return;
  if (person.age < 18) return;
  if (person.pendingEvent) return;

  const warEntries = getActiveWarEntries(person);
  const activeWarEntries = warEntries.filter(
    ([countryId]) => person.countryRelations?.[countryId]?.atWar || person.wars?.[countryId]
  );
  if (activeWarEntries.length === 0) return;
  if (person.warReactionChosen) return;

  const inMilitary = person.job && person.job.isMilitary;
  const warDur = activeWarEntries.reduce((sum, [, war]) => sum + (war?.years || 0), 0);
  const enemyNames = activeWarEntries
    .map(([countryId, war]) => getEnemyName(countryId, war, state))
    .filter(Boolean);
  const enemyText =
    enemyNames.length > 1
      ? `${enemyNames.slice(0, -1).join(', ')} and ${enemyNames[enemyNames.length - 1]}`
      : enemyNames[0] || 'a foreign power';

  if (Math.random() < 0.12) {
    const choices = [];

    if (!inMilitary && person.age >= 18 && person.age <= 35) {
      choices.push({
        text: '⚔️ Enlist in the military',
        effect: 'enlist_war',
        effects: { happiness: -5, stress: 15 },
      });
    }
    if (person.money > 10000) {
      choices.push({
        text: '💼 Profit from war contracts (+$50k)',
        effect: 'war_profit',
        effects: { money: 50000, karma: -5 },
      });
    }
    choices.push({
      text: '📰 Become a war journalist',
      effect: 'war_journalist',
      effects: { fame: 10, stress: 10 },
    });
    choices.push({
      text: '✊ Join the protests',
      effect: 'war_protest',
      effects: { fame: 5, stress: 10, notoriety: 5 },
    });
    choices.push({ text: '🏃 Flee the country as a refugee', effect: 'war_refugee' });
    choices.push({
      text: '🤝 Volunteer to help refugees',
      effect: 'war_help_refugees',
      effects: { karma: 10, happiness: -3 },
    });
    if (warDur > 3) {
      choices.push({
        text: '🎖️ Attempt to become a general',
        effect: 'war_become_general',
        effects: { fame: 15, stress: 20 },
      });
    }
    choices.push({ text: 'Ignore it and continue life', effect: 'war_ignore' });

    person.pendingEvent = {
      type: 'war_reaction',
      text: `⚔️ Your country is at war with ${enemyText}! The conflict has been raging for ${warDur || 1} years. How do you respond?`,
      choices,
    };
  }
};
