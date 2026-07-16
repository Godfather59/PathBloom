import { getAllContentPacks, getEnabledContentPacks } from './ContentPackRegistry';
import { adjustReputation, ensureReputation } from './ReputationSystem';

const MAX_RESOLVED_EVENTS = 250;
const MAX_SCHEDULED_EVENTS = 40;

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(value) || 0));

function currentMonth(person) {
  return Math.max(0, Math.floor(Number(person?.age) || 0) * 12 + Math.floor(Number(person?.timeProgress?.month) || 0));
}

function normalizeState(state) {
  const source = state && typeof state === 'object' ? state : {};
  return {
    schemaVersion: 1,
    flags: source.flags && typeof source.flags === 'object' ? { ...source.flags } : {},
    history: source.history && typeof source.history === 'object' ? { ...source.history } : {},
    scheduled: Array.isArray(source.scheduled)
      ? source.scheduled
          .filter(item => item && typeof item === 'object')
          .map(item => ({
            packId: String(item.packId || ''),
            eventId: String(item.eventId || ''),
            dueMonth: Math.max(0, Math.floor(Number(item.dueMonth) || 0)),
            sourceChoice: String(item.sourceChoice || ''),
          }))
          .filter(item => item.packId && item.eventId)
          .slice(-MAX_SCHEDULED_EVENTS)
      : [],
    resolved: Array.isArray(source.resolved) ? source.resolved.slice(-MAX_RESOLVED_EVENTS) : [],
    generatedCount: Math.max(0, Math.floor(Number(source.generatedCount) || 0)),
    lastGeneratedMonth: Number.isFinite(Number(source.lastGeneratedMonth))
      ? Math.floor(Number(source.lastGeneratedMonth))
      : -1000,
  };
}

export function ensureContentState(person) {
  if (!person || typeof person !== 'object') return null;
  person.contentState = normalizeState(person.contentState);
  return person.contentState;
}

function relationshipMatches(relationship, requestedType) {
  const type = String(relationship?.type || '');
  const requested = String(requestedType || '');
  if (!requested) return false;
  if (requested.toLowerCase() === 'family') {
    return ['Father', 'Mother', 'Parent', 'Sibling', 'Child', 'Spouse', 'Partner', 'Fiance', 'Grandchild'].includes(type);
  }
  if (requested === 'Parent') return ['Father', 'Mother', 'Parent'].includes(type);
  return type === requested;
}

function hasRelationship(person, type) {
  return (person.relationships || []).some(
    relationship => relationship?.status !== 'Deceased' && relationshipMatches(relationship, type)
  );
}

function hasWar(person) {
  if (person?.monthlySituations?.war && Object.keys(person.monthlySituations.war).length > 0) return true;
  if (person?.wars && Object.values(person.wars).some(war => war && war.status !== 'ended')) return true;
  return Object.values(person?.countryRelations || {}).some(relation => relation?.atWar);
}

function hasCampaign(person) {
  return Boolean(person?.campaign || person?.campaignData || person?.politicalCampaign);
}

function hasPoliticalCareer(person) {
  return Boolean(
    person?.job?.isPolitical ||
      person?.politics?.office ||
      /president|mayor|senator|minister|governor|politic|parliament/i.test(person?.job?.title || '')
  );
}

function conditionNumber(conditions, key, actual, comparator) {
  const expected = Number(conditions[key]);
  return !Number.isFinite(expected) || comparator(Number(actual) || 0, expected);
}

function flagRequirementMatches(flags, requirement, shouldExist) {
  if (!requirement) return true;
  if (typeof requirement === 'string') {
    return shouldExist ? Boolean(flags[requirement]) : !Boolean(flags[requirement]);
  }
  if (typeof requirement === 'object') {
    return Object.entries(requirement).every(([key, value]) =>
      shouldExist ? flags[key] === value : flags[key] !== value
    );
  }
  return true;
}

export function eventConditionsMatch(person, pack, event) {
  const conditions = event?.conditions || {};
  const state = ensureContentState(person);
  const age = Number(person?.age) || 0;
  const packCountries = Array.isArray(pack?.countries) ? pack.countries : [];
  const eventCountries = Array.isArray(conditions.countries) ? conditions.countries : [];

  if (packCountries.length > 0 && !packCountries.includes('*') && !packCountries.includes(person.country)) return false;
  if (eventCountries.length > 0 && !eventCountries.includes('*') && !eventCountries.includes(person.country)) return false;
  if (Array.isArray(conditions.excludedCountries) && conditions.excludedCountries.includes(person.country)) return false;
  if (Number.isFinite(Number(conditions.minAge)) && age < Number(conditions.minAge)) return false;
  if (Number.isFinite(Number(conditions.maxAge)) && age > Number(conditions.maxAge)) return false;
  if (conditions.gender && String(person.gender).toLowerCase() !== String(conditions.gender).toLowerCase()) return false;
  if (conditions.requiresSchool && !person.currentSchool) return false;
  if (conditions.requiresJob && !person.job) return false;
  if (conditions.requiresNoJob && person.job) return false;
  if (conditions.requiresCampaign && !hasCampaign(person)) return false;
  if (conditions.requiresPoliticalCareer && !hasPoliticalCareer(person)) return false;
  if (conditions.requiresWar && !hasWar(person)) return false;
  if (conditions.requiresInPrison && !person.isInPrison) return false;
  if (conditions.requiresNotInPrison && person.isInPrison) return false;
  if (conditions.requiresRelationshipType && !hasRelationship(person, conditions.requiresRelationshipType)) return false;
  if (!flagRequirementMatches(state.flags, conditions.requiresFlag, true)) return false;
  if (!flagRequirementMatches(state.flags, conditions.excludesFlag, false)) return false;

  if (!conditionNumber(conditions, 'minMoney', person.money, (actual, expected) => actual >= expected)) return false;
  if (!conditionNumber(conditions, 'maxMoney', person.money, (actual, expected) => actual <= expected)) return false;
  if (!conditionNumber(conditions, 'minStress', person.stress, (actual, expected) => actual >= expected)) return false;
  if (!conditionNumber(conditions, 'maxStress', person.stress, (actual, expected) => actual <= expected)) return false;
  if (!conditionNumber(conditions, 'minJobYears', person.job?.yearsEmployed ?? person.job?.yearsOfWork, (actual, expected) => actual >= expected)) return false;

  const reputation = ensureReputation(person) || {};
  const reputationConditions = {
    minProfessionalReputation: ['professional', (actual, expected) => actual >= expected],
    minCriminalReputation: ['criminal', (actual, expected) => actual >= expected],
    maxCriminalReputation: ['criminal', (actual, expected) => actual <= expected],
    minPoliticalReputation: ['political', (actual, expected) => actual >= expected],
    minFamilyReputation: ['family', (actual, expected) => actual >= expected],
    minPublicReputation: ['public', (actual, expected) => actual >= expected],
    minTrustReputation: ['trust', (actual, expected) => actual >= expected],
  };
  for (const [key, [reputationKey, compare]] of Object.entries(reputationConditions)) {
    if (!conditionNumber(conditions, key, reputation[reputationKey], compare)) return false;
  }

  return true;
}

function eventKey(packId, eventId) {
  return `${packId}:${eventId}`;
}

function cooldownAllows(person, pack, event) {
  const state = ensureContentState(person);
  const last = state.history[eventKey(pack.id, event.id)];
  if (!last) return true;
  return currentMonth(person) - Math.max(0, Number(last.lastMonth) || 0) >= event.cooldownMonths;
}

function chooseWeighted(entries) {
  const total = entries.reduce((sum, entry) => sum + Math.max(1, Number(entry.event.weight) || 1), 0);
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= Math.max(1, Number(entry.event.weight) || 1);
    if (roll <= 0) return entry;
  }
  return entries[entries.length - 1] || null;
}

function localized(source) {
  return {
    en: String(source?.en || ''),
    ar: String(source?.ar || source?.en || ''),
  };
}

function buildPendingEvent(pack, event, scheduled = false) {
  return {
    type: 'content_event',
    contentPackId: pack.id,
    contentEventId: event.id,
    category: event.category || pack.category,
    text: event.text.en,
    localizedText: localized(event.text),
    scheduled,
    choices: event.choices.map(choice => ({
      id: choice.id,
      text: choice.text.en,
      localizedText: localized(choice.text),
      outcomeText: choice.outcome.en,
      outcomeLocalizedText: localized(choice.outcome),
      effects: { ...(choice.effects || {}) },
      reputation: { ...(choice.reputation || {}) },
      setFlags: { ...(choice.setFlags || {}) },
      relationshipEffects: choice.relationshipEffects ? { ...choice.relationshipEffects } : null,
      jobEffects: choice.jobEffects ? { ...choice.jobEffects } : null,
      situationEffects: choice.situationEffects ? { ...choice.situationEffects } : null,
      next: choice.next ? { ...choice.next } : null,
    })),
  };
}

function markPresented(person, pack, event) {
  const state = ensureContentState(person);
  const key = eventKey(pack.id, event.id);
  const previous = state.history[key] || {};
  state.history[key] = {
    lastMonth: currentMonth(person),
    lastAge: Number(person.age) || 0,
    timesPresented: Math.max(0, Number(previous.timesPresented) || 0) + 1,
  };
  state.generatedCount += 1;
  state.lastGeneratedMonth = currentMonth(person);
}

function findEvent(packId, eventId, { enabledOnly = true } = {}) {
  const packs = enabledOnly ? getEnabledContentPacks() : getAllContentPacks();
  const pack = packs.find(candidate => candidate.id === packId);
  const event = pack?.events.find(candidate => candidate.id === eventId);
  return pack && event ? { pack, event } : null;
}

function presentEvent(person, pack, event, scheduled = false) {
  if (!person?.isAlive || person.pendingEvent) return false;
  person.pendingEvent = buildPendingEvent(pack, event, scheduled);
  markPresented(person, pack, event);
  return true;
}

export function tickScheduledContent(person) {
  const state = ensureContentState(person);
  if (!state || person.pendingEvent || !person.isAlive) return false;
  const now = currentMonth(person);
  state.scheduled.sort((left, right) => left.dueMonth - right.dueMonth);
  const dueIndex = state.scheduled.findIndex(item => item.dueMonth <= now);
  if (dueIndex < 0) return false;
  const [scheduled] = state.scheduled.splice(dueIndex, 1);
  const match = findEvent(scheduled.packId, scheduled.eventId, { enabledOnly: true });
  if (!match || !eventConditionsMatch(person, match.pack, match.event)) return false;
  return presentEvent(person, match.pack, match.event, true);
}

export function maybeGenerateContentEvent(person, frequency = 'year') {
  const state = ensureContentState(person);
  if (!state || !person?.isAlive || person.pendingEvent) return false;
  if (tickScheduledContent(person)) return true;

  const now = currentMonth(person);
  if (now === state.lastGeneratedMonth) return false;
  const generationChance = frequency === 'month' ? 0.18 : 0.52;
  if (Math.random() >= generationChance) return false;

  const candidates = [];
  for (const pack of getEnabledContentPacks()) {
    for (const event of pack.events) {
      if (event.hidden || event.frequency !== frequency) continue;
      if (!cooldownAllows(person, pack, event)) continue;
      if (!eventConditionsMatch(person, pack, event)) continue;
      if (Number.isFinite(Number(event.conditions?.chance)) && Math.random() >= Number(event.conditions.chance)) continue;
      candidates.push({ pack, event });
    }
  }
  const selected = chooseWeighted(candidates);
  return selected ? presentEvent(person, selected.pack, selected.event) : false;
}

function chargeMoney(person, delta) {
  if (!Number.isFinite(delta) || delta === 0) return;
  if (delta > 0) {
    person.money = (Number(person.money) || 0) + delta;
    return;
  }
  const due = Math.abs(delta);
  const cash = Math.max(0, Number(person.money) || 0);
  const paid = Math.min(cash, due);
  person.money = cash - paid;
  if (paid < due) person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + due - paid;
}

function applyCoreEffects(person, effects) {
  const safe = { ...(effects || {}) };
  const money = Number(safe.money);
  delete safe.money;
  if (Number.isFinite(money)) chargeMoney(person, money);
  if (Number.isFinite(Number(safe.personalDebt))) {
    person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + Number(safe.personalDebt);
    delete safe.personalDebt;
  }
  person.updateStats?.(safe);
}

function applyRelationshipEffects(person, effect) {
  if (!effect) return;
  const amount = Number(effect.stat) || 0;
  (person.relationships || []).forEach(relationship => {
    if (relationship?.status === 'Deceased' || !relationshipMatches(relationship, effect.type)) return;
    relationship.stat = clamp((Number(relationship.stat) || 50) + amount);
    if (relationship.npcMemory) {
      relationship.npcMemory.closeness = clamp((Number(relationship.npcMemory.closeness) || 50) + amount * 0.6);
      relationship.npcMemory.trust = clamp((Number(relationship.npcMemory.trust) || 50) + amount * 0.5);
      relationship.npcMemory.resentment = clamp((Number(relationship.npcMemory.resentment) || 0) - amount * 0.35);
    }
  });
}

function applyJobEffects(person, effect) {
  if (!effect || !person.job) return;
  const multiplier = Number(effect.salaryMultiplier);
  if (Number.isFinite(multiplier) && multiplier > 0) {
    person.job.salary = Math.max(0, Math.floor((Number(person.job.salary) || 0) * multiplier));
  }
  if (Number.isFinite(Number(effect.performance))) {
    person.job.performance = clamp((Number(person.job.performance) || 50) + Number(effect.performance));
  }
}

function applySituationEffects(person, effect) {
  if (!effect) return;
  if (Number.isFinite(Number(effect.campaignPolling))) {
    const campaignState = person.monthlySituations?.campaign;
    if (campaignState) {
      campaignState.polling = clamp((Number(campaignState.polling) || 45) + Number(effect.campaignPolling));
    }
    const campaign = person.campaign || person.campaignData || person.politicalCampaign;
    if (campaign) {
      campaign.polls = clamp((Number(campaign.polls ?? campaign.support) || 45) + Number(effect.campaignPolling));
      campaign.support = campaign.polls;
    }
  }
}

function logLocalized(person, text, type = 'neutral') {
  const values = localized(text);
  person.logEvent?.(values.en, type);
  if (person.history?.[0]) person.history[0].localizedText = values;
}

function scheduleFollowUp(person, packId, choice) {
  if (!choice?.next?.eventId) return;
  const state = ensureContentState(person);
  const delay = Math.max(1, Math.floor(Number(choice.next.delayMonths) || 1));
  state.scheduled.push({
    packId,
    eventId: String(choice.next.eventId),
    dueMonth: currentMonth(person) + delay,
    sourceChoice: String(choice.id || ''),
  });
  state.scheduled = state.scheduled.slice(-MAX_SCHEDULED_EVENTS);
}

export function resolveContentEventChoice(person, event, choice) {
  if (event?.type !== 'content_event') return false;
  const match = findEvent(event.contentPackId, event.contentEventId, { enabledOnly: false });
  const canonicalChoice = match?.event?.choices.find(candidate => candidate.id === choice?.id);
  const selected = canonicalChoice || choice || {};
  const state = ensureContentState(person);

  applyCoreEffects(person, selected.effects);
  adjustReputation(person, selected.reputation || {});
  Object.assign(state.flags, selected.setFlags || {});
  applyRelationshipEffects(person, selected.relationshipEffects);
  applyJobEffects(person, selected.jobEffects);
  applySituationEffects(person, selected.situationEffects);

  logLocalized(person, event.localizedText || match?.event?.text || { en: event.text, ar: event.text }, 'neutral');
  logLocalized(
    person,
    selected.outcome || choice?.outcomeLocalizedText || { en: choice?.outcomeText || `You chose ${choice?.text || selected.id}.`, ar: choice?.outcomeText || `You chose ${choice?.text || selected.id}.` },
    selected.type || 'neutral'
  );
  scheduleFollowUp(person, event.contentPackId, selected);

  state.resolved.push({
    packId: event.contentPackId,
    eventId: event.contentEventId,
    choiceId: selected.id || choice?.id || 'unknown',
    age: Number(person.age) || 0,
    month: currentMonth(person),
  });
  state.resolved = state.resolved.slice(-MAX_RESOLVED_EVENTS);
  person.pendingEvent = null;
  return true;
}

export function getContentSimulationSummary(person) {
  const state = ensureContentState(person);
  const packs = getAllContentPacks();
  return {
    enabledPacks: packs.filter(pack => pack.enabled).length,
    totalPacks: packs.length,
    totalEvents: packs.reduce((sum, pack) => sum + pack.events.length, 0),
    resolvedEvents: state.resolved.length,
    scheduledEvents: state.scheduled.length,
    generatedCount: state.generatedCount,
    flags: { ...state.flags },
  };
}
