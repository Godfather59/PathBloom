import { GameEngine } from './GameEngine';
import { Person } from './Person';
import {
  ensureContentState,
  maybeGenerateContentEvent,
  resolveContentEventChoice,
  tickScheduledContent,
} from './ContentEventEngine';

function copy(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Fall back for older Android WebViews and class-backed values.
    }
  }
  return JSON.parse(JSON.stringify(value));
}

const originalEnsureDefaults = Person.prototype.ensureDefaults;
Person.prototype.ensureDefaults = function ensureDefaultsWithContentPacks() {
  const result = originalEnsureDefaults.call(this);
  ensureContentState(this);
  return result;
};

const originalClone = Person.prototype.clone;
Person.prototype.clone = function cloneWithContentPacks() {
  ensureContentState(this);
  const cloned = originalClone.call(this);
  cloned.contentState = copy(this.contentState);
  ensureContentState(cloned);
  return cloned;
};

const originalResolveEvent = Person.prototype.resolveEvent;
Person.prototype.resolveEvent = function resolveDataDrivenContent(choice) {
  ensureContentState(this);
  if (resolveContentEventChoice(this, this.pendingEvent, choice)) return;
  return originalResolveEvent.call(this, choice);
};

const originalSimulateYear = GameEngine.simulateYear.bind(GameEngine);
GameEngine.simulateYear = function simulateYearWithContentPacks(person) {
  ensureContentState(person);
  const result = originalSimulateYear(person);
  ensureContentState(person);
  if (person.isAlive && !person.pendingEvent) {
    tickScheduledContent(person);
    if (!person.pendingEvent) maybeGenerateContentEvent(person, 'year');
  }
  return result;
};

const originalAgeUp = GameEngine.ageUp.bind(GameEngine);
GameEngine.ageUp = function ageUpWithContentPacks(person, amount = 1) {
  ensureContentState(person);
  const result = originalAgeUp(person, amount);
  ensureContentState(person);
  if (amount === 'month' && person.isAlive && !person.pendingEvent) {
    tickScheduledContent(person);
    if (!person.pendingEvent) maybeGenerateContentEvent(person, 'month');
  }
  return result;
};

export function initializeDataDrivenContent(person) {
  return ensureContentState(person);
}
