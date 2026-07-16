import { GameEngine } from './GameEngine';
import { Person } from './Person';
import {
  cloneWorldSimulation2,
  ensureWorldSimulation2,
  maybeCreateDirectWorldDecision,
  resolveWorldSimulationChoice,
  simulateWorldMonths,
} from './WorldSimulation2';

const originalEnsureDefaults = Person.prototype.ensureDefaults;
Person.prototype.ensureDefaults = function ensureDefaultsWithWorldSimulation2() {
  const result = originalEnsureDefaults.call(this);
  ensureWorldSimulation2(this);
  return result;
};

const originalClone = Person.prototype.clone;
Person.prototype.clone = function cloneWithWorldSimulation2() {
  ensureWorldSimulation2(this);
  const cloned = originalClone.call(this);
  cloned.worldSimulation2 = cloneWorldSimulation2(this);
  ensureWorldSimulation2(cloned);
  return cloned;
};

const originalResolveEvent = Person.prototype.resolveEvent;
Person.prototype.resolveEvent = function resolveWorldSimulation2Event(choice) {
  ensureWorldSimulation2(this);
  if (resolveWorldSimulationChoice(this, this.pendingEvent, choice)) return;
  return originalResolveEvent.call(this, choice);
};

const originalSimulateYear = GameEngine.simulateYear.bind(GameEngine);
GameEngine.simulateYear = function simulateYearWithWorldSimulation2(person) {
  ensureWorldSimulation2(person);
  const result = originalSimulateYear(person);
  ensureWorldSimulation2(person);
  if (person.isAlive) {
    simulateWorldMonths(person, 12);
    if (!person.pendingEvent) maybeCreateDirectWorldDecision(person);
  }
  return result;
};

const originalAgeUp = GameEngine.ageUp.bind(GameEngine);
GameEngine.ageUp = function ageUpWithWorldSimulation2(person, amount = 1) {
  ensureWorldSimulation2(person);
  const ageBefore = Math.max(0, Number(person.age) || 0);
  const result = originalAgeUp(person, amount);
  ensureWorldSimulation2(person);
  if (amount === 'month' && person.isAlive && (Number(person.age) || 0) === ageBefore) {
    simulateWorldMonths(person, 1);
    if (!person.pendingEvent) maybeCreateDirectWorldDecision(person);
  }
  return result;
};

export function initializeWorldSimulation2(person) {
  return ensureWorldSimulation2(person);
}
