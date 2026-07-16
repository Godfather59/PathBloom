const MAX_CHAINS = 80;
const MAX_OBSERVED_EVENTS = 160;

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(value) || 0));

const CHAIN_TRIGGERS = [
  {
    type: 'school_bullying',
    test: text => /bully|bullied|made fun of your shoes/i.test(text),
    minAge: 5,
    maxAge: 18,
    delay: 2,
  },
  {
    type: 'family_conflict',
    test: text => /parents are fighting|family conflict|relationship.*conflict|resentment/i.test(text),
    maxAge: 25,
    delay: 2,
  },
  {
    type: 'health_recovery',
    test: text => /chest pains|migraine|nasty cold|flu|health scare|got sick/i.test(text),
    delay: 1,
  },
  {
    type: 'career_setback',
    test: text => /lost their job|lost your job|were fired|laid off|rejected from being/i.test(text),
    minAge: 16,
    delay: 3,
  },
  {
    type: 'financial_hardship',
    test: text => /can't afford|personal debt|living expenses|bankrupt|missed payment/i.test(text),
    minAge: 18,
    delay: 1,
  },
];

function makeId(type, person) {
  const sequence = Math.max(0, Number(person.eventChainSequence) || 0) + 1;
  person.eventChainSequence = sequence;
  return `${type}_${person.age}_${sequence}`;
}

export function ensureEventChains(person) {
  if (!person || typeof person !== 'object') return [];
  if (!Array.isArray(person.eventChains)) person.eventChains = [];
  if (!Array.isArray(person.completedEventChains)) person.completedEventChains = [];
  if (!Array.isArray(person.observedChainEvents)) person.observedChainEvents = [];
  person.eventChainSequence = Math.max(0, Math.floor(Number(person.eventChainSequence) || 0));
  return person.eventChains;
}

function hasRecentChain(person, type) {
  const currentAge = Math.max(0, Number(person.age) || 0);
  return [...(person.eventChains || []), ...(person.completedEventChains || [])].some(
    chain => chain?.type === type && currentAge - (Number(chain.startedAge) || currentAge) < 4
  );
}

export function startEventChain(person, type, context = {}, delayMonths = 1) {
  ensureEventChains(person);
  if (hasRecentChain(person, type)) return null;

  const chain = {
    id: makeId(type, person),
    type,
    stage: 0,
    status: 'active',
    startedAge: Math.max(0, Number(person.age) || 0),
    startedMonth: Math.max(0, Number(person.timeProgress?.month) || 0),
    elapsedMonths: 0,
    monthsUntilNext: Math.max(0, Math.floor(Number(delayMonths) || 0)),
    previousChoices: [],
    context: context && typeof context === 'object' ? { ...context } : {},
  };
  person.eventChains.unshift(chain);
  person.eventChains = person.eventChains.slice(0, MAX_CHAINS);
  return chain;
}

export function observeEventForChains(person, rawText) {
  if (!person?.isAlive || !rawText) return null;
  ensureEventChains(person);
  const text = String(rawText).replace(/^Event:\s*/i, '').trim();
  if (!text) return null;

  const fingerprint = `${person.age}|${text}`;
  if (person.observedChainEvents.includes(fingerprint)) return null;
  person.observedChainEvents.unshift(fingerprint);
  person.observedChainEvents = person.observedChainEvents.slice(0, MAX_OBSERVED_EVENTS);

  const trigger = CHAIN_TRIGGERS.find(candidate => {
    const age = Number(person.age) || 0;
    if (Number.isFinite(candidate.minAge) && age < candidate.minAge) return false;
    if (Number.isFinite(candidate.maxAge) && age > candidate.maxAge) return false;
    return candidate.test(text);
  });

  if (!trigger) return null;
  return startEventChain(person, trigger.type, { sourceText: text }, trigger.delay);
}

function choice(text, id, effects = {}, outcomeText = '', type = 'neutral') {
  return {
    text,
    effect: 'deep_chain_choice',
    chainChoice: id,
    effects,
    outcomeText,
    type,
  };
}

function buildChainEvent(chain) {
  const common = {
    type: 'deep_chain',
    chainId: chain.id,
    chainType: chain.type,
    chainStage: chain.stage,
  };

  if (chain.type === 'school_bullying') {
    if (chain.stage === 0) {
      return {
        ...common,
        text: 'The bullying has continued for several months. How will you deal with it?',
        choices: [
          choice('Report it to an adult', 'report', { stress: -5, smarts: 1 }, 'An adult promised to investigate.', 'good'),
          choice('Confront the bully', 'confront', { stress: 4, happiness: 2 }, 'You stood up for yourself.', 'neutral'),
          choice('Keep ignoring it', 'ignore', { stress: 8, happiness: -5 }, 'You tried to pretend it did not bother you.', 'bad'),
        ],
      };
    }
    return {
      ...common,
      text: 'A year later, you meet the same bully again. The old conflict still affects you.',
      choices: [
        choice('Try to make peace', 'make_peace', { happiness: 5, karma: 5, stress: -5 }, 'You both agreed to leave the past behind.', 'good'),
        choice('Demand an apology', 'demand_apology', { stress: 2, happiness: 2 }, 'The conversation was tense, but you finally spoke honestly.', 'neutral'),
        choice('Walk away', 'walk_away', { stress: -2 }, 'You decided the past no longer controls you.', 'neutral'),
      ],
    };
  }

  if (chain.type === 'family_conflict') {
    if (chain.stage === 0) {
      return {
        ...common,
        text: 'The family conflict is getting worse. What role will you take?',
        choices: [
          choice('Try to mediate', 'mediate', { karma: 4, stress: 4 }, 'You encouraged everyone to speak calmly.', 'good'),
          choice('Support one side', 'take_side', { happiness: -2, stress: 5 }, 'One person appreciated you, but another felt betrayed.', 'neutral'),
          choice('Stay out of it', 'avoid', { stress: -2, happiness: -3 }, 'You avoided the argument, but the tension remained.', 'neutral'),
        ],
      };
    }
    return {
      ...common,
      text: 'Your family wants to decide whether to repair the relationship or separate permanently.',
      choices: [
        choice('Organize an honest conversation', 'family_talk', { karma: 5, stress: -4 }, 'The family began rebuilding trust.', 'good'),
        choice('Accept the separation', 'accept_separation', { happiness: -4, stress: -3 }, 'You accepted that some relationships cannot be forced.', 'neutral'),
      ],
    };
  }

  if (chain.type === 'health_recovery') {
    return {
      ...common,
      text: 'Your symptoms have not completely disappeared. What will you do?',
      choices: [
        choice('Visit a doctor ($500)', 'doctor', { health: 8, stress: -4, money: -500 }, 'The doctor created a treatment plan.', 'good'),
        choice('Rest and change your routine', 'rest', { health: 4, happiness: -1, stress: -3 }, 'Rest helped, but recovery will take time.', 'neutral'),
        choice('Ignore the symptoms', 'ignore_health', { health: -6, stress: 3 }, 'The untreated symptoms became harder to ignore.', 'bad'),
      ],
    };
  }

  if (chain.type === 'career_setback') {
    return {
      ...common,
      text: 'Your career setback is forcing you to choose a new direction.',
      choices: [
        choice('Retrain for a better career', 'retrain', { smarts: 5, money: -1000, stress: 3 }, 'You enrolled in professional training.', 'good'),
        choice('Network aggressively', 'network', { fame: 2, stress: 2, money: -300 }, 'You started building valuable professional contacts.', 'good'),
        choice('Take any available work', 'quick_job', { happiness: -2, stress: -2 }, 'You accepted temporary work to stabilize your finances.', 'neutral'),
      ],
    };
  }

  return {
    ...common,
    text: 'Your financial situation needs an immediate decision.',
    choices: [
      choice('Create a strict budget', 'budget', { happiness: -2, stress: -3 }, 'You cut unnecessary spending and created a repayment plan.', 'good'),
      choice('Consolidate the debt', 'consolidate', { money: -250, stress: -2 }, 'You negotiated one structured payment plan.', 'neutral'),
      choice('Ignore the bills', 'ignore_debt', { stress: 8, happiness: -5 }, 'Late fees and collection calls began to accumulate.', 'bad'),
    ],
  };
}

function completeChain(person, chain) {
  chain.status = 'completed';
  chain.completedAge = Number(person.age) || 0;
  person.eventChains = person.eventChains.filter(entry => entry.id !== chain.id);
  person.completedEventChains.unshift(chain);
  person.completedEventChains = person.completedEventChains.slice(0, MAX_CHAINS);
}

function setRelationshipEffects(person, amount) {
  const familyTypes = new Set(['Father', 'Mother', 'Parent', 'Sibling', 'Child', 'Spouse', 'Partner']);
  (person.relationships || []).forEach(rel => {
    if (familyTypes.has(rel.type) && rel.status !== 'Deceased') {
      rel.stat = clamp((Number(rel.stat) || 50) + amount);
    }
  });
}

function applySpecialChoice(person, chain, choiceId) {
  if (chain.type === 'school_bullying') {
    person.confidence = clamp((Number(person.confidence) || 50) + (choiceId === 'ignore' ? -8 : 6));
    if (choiceId === 'make_peace') person.reputation.family = clamp((person.reputation?.family || 50) + 3);
  }

  if (chain.type === 'family_conflict') {
    if (choiceId === 'mediate' || choiceId === 'family_talk') setRelationshipEffects(person, 6);
    if (choiceId === 'take_side') setRelationshipEffects(person, -3);
    if (choiceId === 'accept_separation') setRelationshipEffects(person, -1);
  }

  if (chain.type === 'health_recovery') {
    if (choiceId === 'doctor' && (Number(person.money) || 0) < 0) {
      person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + 500;
      person.money = 0;
    }
    if (choiceId === 'ignore_health') {
      person.chronicRisk = clamp((Number(person.chronicRisk) || 0) + 15);
    }
  }

  if (chain.type === 'career_setback') {
    if (choiceId === 'network') {
      person.reputation.professional = clamp((person.reputation?.professional || 50) + 8);
    }
    if (choiceId === 'quick_job' && !person.job) {
      person.job = { title: 'Temporary Worker', salary: 24000, performance: 45, yearsEmployed: 0 };
    }
  }

  if (chain.type === 'financial_hardship') {
    if (choiceId === 'budget') {
      person.finance.budgetDiscipline = clamp((person.finance?.budgetDiscipline || 40) + 20);
    }
    if (choiceId === 'consolidate') {
      person.personalDebt = Math.max(0, Math.floor((Number(person.personalDebt) || 0) * 0.92));
    }
    if (choiceId === 'ignore_debt') {
      person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + 750;
      person.finance.missedPayments = Math.max(0, Number(person.finance?.missedPayments) || 0) + 1;
    }
  }
}

export function resolveEventChainChoice(person, event, selectedChoice) {
  ensureEventChains(person);
  if (!event || event.type !== 'deep_chain') return false;
  const chain = person.eventChains.find(entry => entry.id === event.chainId);
  if (!chain) {
    person.pendingEvent = null;
    return true;
  }

  const choiceId = selectedChoice?.chainChoice || selectedChoice?.id || 'unknown';
  if (selectedChoice?.effects) person.updateStats?.(selectedChoice.effects);
  person.logEvent?.(`Event: ${event.text}`, 'neutral');
  person.logEvent?.(`You chose to: ${selectedChoice?.text || choiceId}`, 'neutral');
  if (selectedChoice?.outcomeText) {
    person.logEvent?.(selectedChoice.outcomeText, selectedChoice.type || 'neutral');
  }

  chain.previousChoices.push(choiceId);
  applySpecialChoice(person, chain, choiceId);
  chain.stage += 1;
  chain.elapsedMonths = 0;

  const hasSecondStage = ['school_bullying', 'family_conflict'].includes(chain.type) && chain.stage < 2;
  if (hasSecondStage) {
    chain.monthsUntilNext = 12;
  } else {
    completeChain(person, chain);
  }

  person.pendingEvent = null;
  return true;
}

function advanceChains(person, months) {
  ensureEventChains(person);
  if (!person.isAlive || person.pendingEvent) return null;

  const active = person.eventChains.filter(chain => chain.status === 'active');
  for (const chain of active) {
    chain.elapsedMonths += months;
    chain.monthsUntilNext -= months;
    if (chain.monthsUntilNext <= 0 && !person.pendingEvent) {
      const pending = buildChainEvent(chain);
      if (pending) {
        person.pendingEvent = pending;
        return pending;
      }
    }
  }
  return null;
}

export function tickEventChainsMonth(person) {
  return advanceChains(person, 1);
}

export function tickEventChainsYear(person) {
  return advanceChains(person, 12);
}
