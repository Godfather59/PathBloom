import { GameEngine } from './GameEngine';
import { Person } from './Person';
import {
  ensureEventChains,
  observeEventForChains,
  resolveEventChainChoice,
  tickEventChainsMonth,
  tickEventChainsYear,
} from './EventChainEngine';
import {
  applyJobReputation,
  ensureReputation,
  observeReputationEvent,
  processReputationYear,
} from './ReputationSystem';
import {
  ensureCountryLife,
  getCountryRules,
  processCountryLifeYear,
  resolveCountryServiceChoice,
} from './CountryLifeSystem';
import {
  ensurePersonalFinance,
  processPersonalFinanceMonth,
  processPersonalFinanceYear,
} from './PersonalFinanceSystem';
import {
  ensureNPCMemories,
  observeNPCMemoryEvent,
  processNPCMemoryYear,
  resolveNPCRequest,
} from './NPCMemorySystem';
import {
  beginPregnancy,
  ensureMonthlySituations,
  processMonthlySituation,
  resolveMonthlySituationChoice,
} from './MonthlySituationEngine';

function copy(value) {
  if (value === undefined) return undefined;
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      // Fall through for class-backed or unsupported values.
    }
  }
  return JSON.parse(JSON.stringify(value));
}

function ensureDeepSystems(person) {
  ensureEventChains(person);
  ensureReputation(person);
  ensureCountryLife(person);
  ensurePersonalFinance(person);
  ensureNPCMemories(person);
  ensureMonthlySituations(person);
  return person;
}

const originalEnsureDefaults = Person.prototype.ensureDefaults;
Person.prototype.ensureDefaults = function ensureDefaultsWithDeepSimulation() {
  const result = originalEnsureDefaults.call(this);
  ensureDeepSystems(this);
  return result;
};

const originalClone = Person.prototype.clone;
Person.prototype.clone = function cloneWithDeepSimulation() {
  ensureDeepSystems(this);
  const cloned = originalClone.call(this);
  cloned.eventChains = copy(this.eventChains) || [];
  cloned.completedEventChains = copy(this.completedEventChains) || [];
  cloned.observedChainEvents = [...(this.observedChainEvents || [])];
  cloned.eventChainSequence = this.eventChainSequence || 0;
  cloned.reputation = copy(this.reputation);
  cloned.countryLife = copy(this.countryLife);
  cloned.finance = copy(this.finance);
  cloned.monthlySituations = copy(this.monthlySituations);
  cloned.pregnancy = copy(this.pregnancy);
  cloned.confidence = Number(this.confidence) || 50;
  cloned.chronicRisk = Number(this.chronicRisk) || 0;
  cloned.relationships = (cloned.relationships || []).map((relationship, index) => ({
    ...relationship,
    npcMemory: copy(this.relationships?.[index]?.npcMemory),
  }));
  ensureDeepSystems(cloned);
  return cloned;
};

const originalLogEvent = Person.prototype.logEvent;
Person.prototype.logEvent = function logEventWithConsequences(text, type = 'neutral', metadata = {}) {
  const result = originalLogEvent.call(this, text, type, metadata);
  ensureDeepSystems(this);
  observeEventForChains(this, text);
  observeReputationEvent(this, text);
  observeNPCMemoryEvent(this, text);
  return result;
};

const originalResolveEvent = Person.prototype.resolveEvent;
Person.prototype.resolveEvent = function resolveDeepSimulationEvent(choice) {
  ensureDeepSystems(this);
  const event = this.pendingEvent;
  if (resolveEventChainChoice(this, event, choice)) return;
  if (resolveMonthlySituationChoice(this, event, choice)) return;
  if (resolveNPCRequest(this, event, choice)) return;
  if (resolveCountryServiceChoice(this, event, choice)) return;
  return originalResolveEvent.call(this, choice);
};

const originalSetJob = Person.prototype.setJob;
Person.prototype.setJob = function setJobWithReputation(jobData) {
  ensureDeepSystems(this);
  const opportunity = applyJobReputation(this, jobData);
  if (!opportunity.allowed) {
    this.logEvent(opportunity.reason, 'bad');
    return false;
  }
  const hired = originalSetJob.call(this, jobData);
  if (hired && this.job && opportunity.performanceBonus) {
    this.job.performance = Math.max(
      0,
      Math.min(100, (Number(this.job.performance) || 50) + opportunity.performanceBonus)
    );
  }
  return hired;
};

// Convert the legacy instant-birth relationship action into a nine-month pregnancy.
const originalInteractWithRel = Person.prototype.interactWithRel;
if (typeof originalInteractWithRel === 'function') {
  Person.prototype.interactWithRel = function interactWithRelationshipDepth(relId, action, payload) {
    ensureDeepSystems(this);
    const childIdsBefore = new Set(
      (this.relationships || []).filter(rel => rel.type === 'Child').map(rel => rel.id)
    );
    const result = originalInteractWithRel.call(this, relId, action, payload);

    if (action === 'make_love' && !this.pregnancy?.active) {
      const newChildren = (this.relationships || []).filter(
        rel => rel.type === 'Child' && !childIdsBefore.has(rel.id)
      );
      if (newChildren.length > 0) {
        const child = newChildren[0];
        this.relationships = this.relationships.filter(rel => rel.id !== child.id);
        if (this.history?.[0]?.text && /You had a baby/i.test(this.history[0].text)) {
          this.history.shift();
        }
        // The legacy branch already granted +30 happiness for the instant birth.
        // Remove that reward before applying the smaller pregnancy-start reward.
        this.happiness = Math.max(0, (Number(this.happiness) || 0) - 30);
        beginPregnancy(this, child, relId);
      }
    }
    return result;
  };
}

const originalProcessLivingExpenses = GameEngine.processLivingExpenses.bind(GameEngine);
GameEngine.processLivingExpenses = function processCountryAdjustedLivingExpenses(person) {
  ensureDeepSystems(person);
  const originalCost = Math.max(0, Number(originalProcessLivingExpenses(person)) || 0);
  if (originalCost <= 0) return originalCost;

  const countryState = GameEngine.getCountryForPerson?.(person) || null;
  const rules = getCountryRules(person, countryState);
  const discipline = Math.max(0, Math.min(100, Number(person.finance?.budgetDiscipline) || 45));
  const budgetMultiplier = 1 - Math.max(0, discipline - 50) / 500;
  const adjustedCost = Math.max(0, Math.floor(originalCost * rules.costOfLiving * budgetMultiplier));
  const difference = adjustedCost - originalCost;

  if (difference > 0) {
    const cash = Math.max(0, Number(person.money) || 0);
    const paid = Math.min(cash, difference);
    person.money = cash - paid;
    person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + difference - paid;
  } else if (difference < 0) {
    let saving = Math.abs(difference);
    const debtReduction = Math.min(Math.max(0, Number(person.personalDebt) || 0), saving);
    person.personalDebt = Math.max(0, Number(person.personalDebt) - debtReduction);
    saving -= debtReduction;
    person.money = (Number(person.money) || 0) + saving;
  }

  person.lastLivingCost = adjustedCost;
  if (person.lifeStats) {
    person.lifeStats.totalLivingExpenses = Math.max(
      0,
      (Number(person.lifeStats.totalLivingExpenses) || 0) + difference
    );
  }
  return adjustedCost;
};

const originalSimulateYear = GameEngine.simulateYear.bind(GameEngine);
GameEngine.simulateYear = function simulateYearWithDeepSystems(person) {
  ensureDeepSystems(person);
  const result = originalSimulateYear(person);
  ensureDeepSystems(person);
  if (!person.isAlive) return result;

  // These systems intentionally run after the legacy yearly pipeline so they can
  // react to that year's jobs, bills, relationships, world events, and decisions.
  processCountryLifeYear(person, person.geopoliticalState);
  processPersonalFinanceYear(person);
  processReputationYear(person);
  processNPCMemoryYear(person);
  tickEventChainsYear(person);
  return result;
};

const originalAgeUp = GameEngine.ageUp.bind(GameEngine);
GameEngine.ageUp = function ageUpWithMonthlyDepth(person, amount = 1) {
  ensureDeepSystems(person);
  const ageBefore = Math.max(0, Number(person.age) || 0);
  const result = originalAgeUp(person, amount);
  ensureDeepSystems(person);

  if (amount === 'month' && person.isAlive) {
    const crossedYearBoundary = (Number(person.age) || 0) > ageBefore;
    processMonthlySituation(person);
    // The yearly wrapper already processed finance and chains on month 12.
    if (!crossedYearBoundary) {
      processPersonalFinanceMonth(person);
      tickEventChainsMonth(person);
    }
  }
  return result;
};

export function initializeDeepSimulation(person) {
  return ensureDeepSystems(person);
}
