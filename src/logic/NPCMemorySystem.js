const MAX_MEMORIES = 20;

const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number(value) || 0)));

function hash(value) {
  let result = 2166136261;
  const text = String(value ?? 'npc');
  for (let index = 0; index < text.length; index++) {
    result ^= text.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function ensureRelationshipMemory(rel, playerAge) {
  if (!rel || typeof rel !== 'object') {
    return null;
  }
  const current = rel.npcMemory && typeof rel.npcMemory === 'object' ? rel.npcMemory : {};
  rel.npcMemory = {
    trust: clamp(current.trust ?? rel.stat ?? 50),
    closeness: clamp(current.closeness ?? rel.stat ?? 50),
    resentment: clamp(current.resentment ?? 0),
    support: clamp(current.support ?? 50),
    neglectYears: Math.max(0, Math.floor(Number(current.neglectYears) || 0)),
    lastContactAge: Number.isFinite(Number(current.lastContactAge))
      ? Number(current.lastContactAge)
      : Number(playerAge) || 0,
    significantMoments: Array.isArray(current.significantMoments)
      ? current.significantMoments.slice(-MAX_MEMORIES)
      : [],
    autonomousState: {
      city: current.autonomousState?.city || rel.npcData?.city || null,
      country: current.autonomousState?.country || null,
      careerGoal: current.autonomousState?.careerGoal || null,
      relationshipStatus: current.autonomousState?.relationshipStatus || 'connected',
      financialNeed: Math.max(0, Number(current.autonomousState?.financialNeed) || 0),
    },
  };
  return rel.npcMemory;
}

export function ensureNPCMemories(person) {
  if (!person || typeof person !== 'object') {
    return [];
  }
  if (!Array.isArray(person.relationships)) {
    person.relationships = [];
  }
  person.relationships.forEach(rel => ensureRelationshipMemory(rel, person.age));
  return person.relationships;
}

export function rememberNPCMoment(person, relationship, type, impact = 0, details = {}) {
  if (!relationship) {
    return null;
  }
  const memory = ensureRelationshipMemory(relationship, person.age);
  const entry = {
    id: `${relationship.id || relationship.name}_${type}_${person.age}_${memory.significantMoments.length}`,
    type,
    age: Number(person.age) || 0,
    impact: Math.max(-100, Math.min(100, Number(impact) || 0)),
    details: details && typeof details === 'object' ? { ...details } : {},
  };
  memory.significantMoments.push(entry);
  memory.significantMoments = memory.significantMoments.slice(-MAX_MEMORIES);
  memory.trust = clamp(memory.trust + impact * 0.45);
  memory.closeness = clamp(memory.closeness + impact * 0.35);
  memory.support = clamp(memory.support + impact * 0.3);
  memory.resentment = clamp(
    memory.resentment + (impact < 0 ? Math.abs(impact) * 0.5 : -impact * 0.25)
  );
  relationship.stat = clamp((Number(relationship.stat) || 50) + impact * 0.2);
  return entry;
}

function findMentionedRelationships(person, text) {
  const normalized = String(text || '').toLowerCase();
  return (person.relationships || []).filter(rel => {
    const name = String(rel.name || '')
      .trim()
      .toLowerCase();
    if (name && normalized.includes(name)) {
      return true;
    }
    const type = String(rel.type || '').toLowerCase();
    return type && normalized.includes(`your ${type}`);
  });
}

export function observeNPCMemoryEvent(person, rawText) {
  if (!rawText) {
    return;
  }
  ensureNPCMemories(person);
  const text = String(rawText);
  const relationships = findMentionedRelationships(person, text);
  if (relationships.length === 0) {
    return;
  }

  let type = 'shared_event';
  let impact = 1;
  if (/spent time|gift|support|apology|made peace|married|baby|helped|listened/i.test(text)) {
    type = 'supportive_action';
    impact = 8;
  } else if (/promise/i.test(text) && !/broke your promise/i.test(text)) {
    type = 'promise_made';
    impact = 4;
  } else if (/broke your promise|cheated|insulted|ignored|neglected|betray|divorced/i.test(text)) {
    type = 'hurtful_action';
    impact = -12;
  } else if (/died|killed|passed away|sick|health scare|lost their job/i.test(text)) {
    type = 'family_crisis';
    impact = -3;
  }

  relationships.forEach(rel => {
    const memory = ensureRelationshipMemory(rel, person.age);
    memory.lastContactAge = Number(person.age) || 0;
    memory.neglectYears = 0;
    rememberNPCMoment(person, rel, type, impact, { text });
  });
}

function requestFinancialHelp(person, rel, memory) {
  const need = Math.max(
    250,
    Math.min(10000, Math.floor(memory.autonomousState.financialNeed || 1500))
  );
  if (person.pendingEvent) {
    return false;
  }
  person.pendingEvent = {
    type: 'npc_request',
    relationshipId: rel.id,
    text: `${rel.name} is struggling financially and asks you for $${need.toLocaleString()}.`,
    choices: [
      {
        text: 'Help them',
        effect: 'npc_help_money',
        amount: need,
        effects: { money: -need, happiness: 2 },
      },
      { text: 'Offer advice instead', effect: 'npc_offer_advice', effects: { smarts: 1 } },
      { text: 'Refuse', effect: 'npc_refuse_help', effects: { happiness: -1 } },
    ],
  };
  return true;
}

export function resolveNPCRequest(person, event, choice) {
  if (event?.type !== 'npc_request') {
    return false;
  }
  const rel = (person.relationships || []).find(entry => entry.id === event.relationshipId);
  if (!rel) {
    person.pendingEvent = null;
    return true;
  }
  const memory = ensureRelationshipMemory(rel, person.age);
  const amount = Math.max(0, Number(choice?.amount) || Number(choice?.effects?.money) * -1 || 0);

  if (choice.effect === 'npc_help_money') {
    const available = Math.max(0, Number(person.money) || 0);
    const paid = Math.min(available, amount);
    person.money = available - paid;
    if (paid < amount) {
      person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + (amount - paid);
    }
    memory.autonomousState.financialNeed = Math.max(
      0,
      memory.autonomousState.financialNeed - amount
    );
    rememberNPCMoment(person, rel, 'financial_support', 14, { amount });
    person.logEvent?.(`You helped ${rel.name} with $${amount.toLocaleString()}.`, 'good');
  } else if (choice.effect === 'npc_offer_advice') {
    rememberNPCMoment(person, rel, 'offered_advice', 3);
    person.logEvent?.(`You offered ${rel.name} advice instead of money.`, 'neutral');
  } else {
    rememberNPCMoment(person, rel, 'refused_support', -8);
    person.logEvent?.(`You refused to help ${rel.name}.`, 'bad');
  }
  if (choice?.effects) {
    const safeEffects = { ...choice.effects };
    delete safeEffects.money;
    person.updateStats?.(safeEffects);
  }
  person.pendingEvent = null;
  return true;
}

function simulateEstrangement(person, rel, memory) {
  if (memory.neglectYears < 3 || memory.closeness >= 40 || rel.status === 'Deceased') {
    return false;
  }
  if (hash(`${rel.id}|estrange|${person.age}`) % 100 >= 28) {
    return false;
  }
  memory.autonomousState.relationshipStatus = 'estranged';
  rel.stat = clamp((Number(rel.stat) || 50) - 15);
  rememberNPCMoment(person, rel, 'estrangement', -18);
  person.logEvent?.(`${rel.name} stopped speaking to you after years of neglect.`, 'bad');
  person.updateStats?.({ happiness: -7, stress: 4 });
  return true;
}

function simulateReconciliation(person, rel, memory) {
  if (memory.autonomousState.relationshipStatus !== 'estranged') {
    return false;
  }
  if (memory.trust < 45 || hash(`${rel.id}|reconcile|${person.age}`) % 100 >= 18) {
    return false;
  }
  memory.autonomousState.relationshipStatus = 'connected';
  memory.neglectYears = 0;
  rememberNPCMoment(person, rel, 'reconciliation', 12);
  person.logEvent?.(`${rel.name} reached out and offered to rebuild your relationship.`, 'good');
  return true;
}

function simulateIndependentMove(person, rel, memory) {
  if (
    Number(rel.age) < 18 ||
    memory.autonomousState.country ||
    hash(`${rel.id}|move|${person.age}`) % 100 >= 6
  ) {
    return false;
  }
  const destinations = [
    'France',
    'Canada',
    'Germany',
    'Japan',
    'United States',
    'Morocco',
    'Spain',
  ];
  const destination =
    destinations[hash(`${rel.id}|destination|${person.age}`) % destinations.length];
  if (destination === person.country) {
    return false;
  }
  memory.autonomousState.country = destination;
  memory.autonomousState.city = null;
  person.logEvent?.(`${rel.name} moved to ${destination} to start a new chapter.`, 'neutral');
  return true;
}

function simulateSupportReturn(person, rel, memory) {
  if (
    memory.support < 70 ||
    memory.trust < 70 ||
    hash(`${rel.id}|support|${person.age}`) % 100 >= 8
  ) {
    return false;
  }
  const help = Math.max(
    100,
    Math.min(5000, Math.floor((Number(rel.npcData?.money) || 2000) * 0.03))
  );
  person.money = (Number(person.money) || 0) + help;
  if (rel.npcData) {
    rel.npcData.money = Math.max(0, Number(rel.npcData.money) - help);
  }
  rememberNPCMoment(person, rel, 'support_returned', 4, { amount: help });
  person.logEvent?.(
    `${rel.name} helped you with $${help.toLocaleString()} because you were there for them.`,
    'good'
  );
  return true;
}

export function processNPCMemoryYear(person) {
  ensureNPCMemories(person);
  for (const rel of person.relationships || []) {
    if (!rel || rel.status === 'Deceased') {
      continue;
    }
    const memory = ensureRelationshipMemory(rel, person.age);
    const yearsSinceContact = Math.max(0, (Number(person.age) || 0) - memory.lastContactAge);
    if (yearsSinceContact >= 1) {
      memory.neglectYears += 1;
      memory.closeness = clamp(memory.closeness - (yearsSinceContact > 2 ? 5 : 2));
      memory.support = clamp(memory.support - (yearsSinceContact > 2 ? 3 : 1));
      memory.resentment = clamp(memory.resentment + (yearsSinceContact > 2 ? 4 : 1));
    }

    if (rel.npcData && !rel.npcData.job && Number(rel.age) >= 18) {
      memory.autonomousState.financialNeed = Math.min(
        20000,
        memory.autonomousState.financialNeed + 1000 + (hash(`${rel.id}|need|${person.age}`) % 2500)
      );
    } else {
      memory.autonomousState.financialNeed = Math.max(
        0,
        memory.autonomousState.financialNeed - 500
      );
    }

    if (simulateEstrangement(person, rel, memory)) {
      continue;
    }
    if (simulateReconciliation(person, rel, memory)) {
      continue;
    }
    simulateIndependentMove(person, rel, memory);

    if (
      memory.autonomousState.financialNeed >= 3000 &&
      memory.trust >= 35 &&
      hash(`${rel.id}|ask|${person.age}`) % 100 < 10 &&
      requestFinancialHelp(person, rel, memory)
    ) {
      break;
    }

    if ((Number(person.money) || 0) < 1000) {
      simulateSupportReturn(person, rel, memory);
    }
  }
}

export function getNPCMemorySummary(person) {
  ensureNPCMemories(person);
  return (person.relationships || [])
    .filter(rel => rel.status !== 'Deceased')
    .map(rel => ({
      id: rel.id,
      name: rel.name,
      type: rel.type,
      relationship: rel.stat,
      ...rel.npcMemory,
    }));
}
