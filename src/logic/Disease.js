export const DISEASES = {
  common_cold: {
    id: 'common_cold', name: 'Common Cold', category: 'acute', severity: 1,
    contagious: 0.3, healthDrain: 3, duration: { min: 1, max: 2 },
    treatments: ['rest', 'medicine'], cureRate: 0.95, mortalityRate: 0,
    description: 'Runny nose, cough, mild fatigue.',
  },
  flu: {
    id: 'flu', name: 'Seasonal Flu', category: 'acute', severity: 2,
    contagious: 0.4, healthDrain: 8, duration: { min: 1, max: 2 },
    treatments: ['rest', 'medicine'], cureRate: 0.9, mortalityRate: 0.005,
    description: 'High fever, body aches, extreme fatigue.',
  },
  food_poisoning: {
    id: 'food_poisoning', name: 'Food Poisoning', category: 'acute', severity: 1,
    contagious: 0, healthDrain: 5, duration: { min: 1, max: 1 },
    treatments: ['rest', 'medicine'], cureRate: 0.95, mortalityRate: 0.001,
    description: 'Stomach cramps, nausea, dehydration.',
  },
  pneumonia: {
    id: 'pneumonia', name: 'Pneumonia', category: 'serious', severity: 3,
    contagious: 0.15, healthDrain: 15, duration: { min: 1, max: 3 },
    treatments: ['antibiotics', 'hospitalization'], cureRate: 0.8, mortalityRate: 0.05,
    description: 'Severe lung infection, difficulty breathing, high fever.',
  },
  mono: {
    id: 'mono', name: 'Mononucleosis', category: 'serious', severity: 2,
    contagious: 0.2, healthDrain: 10, duration: { min: 1, max: 2 },
    treatments: ['rest', 'medicine'], cureRate: 0.85, mortalityRate: 0.001,
    description: 'Extreme fatigue, swollen lymph nodes, sore throat.',
  },
  hepatitis_b: {
    id: 'hepatitis_b', name: 'Hepatitis B', category: 'chronic', severity: 3,
    contagious: 0.1, healthDrain: 8, duration: { min: 5, max: 20 },
    treatments: ['antivirals', 'hospitalization'], cureRate: 0.6, mortalityRate: 0.02,
    description: 'Liver inflammation, jaundice, abdominal pain.',
  },
  diabetes: {
    id: 'diabetes', name: 'Type 2 Diabetes', category: 'chronic', severity: 2,
    contagious: 0, healthDrain: 4, duration: { min: 999, max: 999 },
    treatments: ['medicine', 'lifestyle'], cureRate: 0.1, mortalityRate: 0.005,
    description: 'High blood sugar, requires ongoing management.',
  },
  asthma: {
    id: 'asthma', name: 'Asthma', category: 'chronic', severity: 2,
    contagious: 0, healthDrain: 3, duration: { min: 999, max: 999 },
    treatments: ['medicine'], cureRate: 0.05, mortalityRate: 0.002,
    description: 'Wheezing, shortness of breath, triggered by exertion.',
  },
  heart_disease: {
    id: 'heart_disease', name: 'Coronary Artery Disease', category: 'chronic', severity: 4,
    contagious: 0, healthDrain: 12, duration: { min: 999, max: 999 },
    treatments: ['surgery', 'lifestyle'], cureRate: 0.15, mortalityRate: 0.05,
    description: 'Blocked arteries, chest pain, risk of heart attack.',
  },
  cancer: {
    id: 'cancer', name: 'Cancer', category: 'critical', severity: 5,
    contagious: 0, healthDrain: 20, duration: { min: 2, max: 6 },
    treatments: ['chemotherapy', 'surgery', 'radiation'], cureRate: 0.35, mortalityRate: 0.3,
    description: 'Malignant tumor. Early detection improves survival odds.',
  },
  stroke: {
    id: 'stroke', name: 'Stroke', category: 'critical', severity: 5,
    contagious: 0, healthDrain: 25, duration: { min: 1, max: 5 },
    treatments: ['hospitalization', 'surgery'], cureRate: 0.25, mortalityRate: 0.2,
    description: 'Brain hemorrhage. Immediate treatment critical.',
  },
  kidney_disease: {
    id: 'kidney_disease', name: 'Kidney Disease', category: 'chronic', severity: 3,
    contagious: 0, healthDrain: 10, duration: { min: 5, max: 15 },
    treatments: ['dialysis', 'surgery'], cureRate: 0.2, mortalityRate: 0.03,
    description: 'Kidney failure, requires dialysis or transplant.',
  },
};

export const TREATMENT_EFFECTS = {
  rest: { cost: 0, healMult: 1.5, label: 'Rest at Home' },
  medicine: { cost: 200, healMult: 2.5, label: 'Get Medicine ($200)' },
  antibiotics: { cost: 800, healMult: 3.5, label: 'Antibiotics ($800)' },
  antivirals: { cost: 2000, healMult: 3.0, label: 'Antiviral Therapy ($2,000)' },
  chemotherapy: { cost: 15000, healMult: 4.0, label: 'Chemotherapy ($15,000)' },
  radiation: { cost: 20000, healMult: 4.5, label: 'Radiation Therapy ($20,000)' },
  dialysis: { cost: 30000, healMult: 3.0, label: 'Dialysis ($30,000/year)' },
  hospitalization: { cost: 10000, healMult: 4.0, label: 'Hospitalization ($10,000)' },
  surgery: { cost: 50000, healMult: 5.0, label: 'Surgery ($50,000)' },
  lifestyle: { cost: 0, healMult: 1.2, label: 'Lifestyle Changes' },
};

export const DISEASE_TRIGGERS = [
  { diseaseId: 'common_cold', chance: 0.2, minAge: 0, condition: () => true },
  { diseaseId: 'flu', chance: 0.08, minAge: 0, condition: () => true },
  { diseaseId: 'food_poisoning', chance: 0.03, minAge: 0, condition: () => true },
  { diseaseId: 'pneumonia', chance: 0.03, minAge: 0, condition: person => person.health < 30 },
  { diseaseId: 'mono', chance: 0.02, minAge: 12, condition: person => person.health < 50 },
  { diseaseId: 'hepatitis_b', chance: 0.005, minAge: 15, condition: () => true },
  { diseaseId: 'diabetes', chance: 0.008, minAge: 30, condition: person => person.health < 50 },
  { diseaseId: 'asthma', chance: 0.005, minAge: 0, condition: () => true },
  { diseaseId: 'heart_disease', chance: 0.005, minAge: 40, condition: person => person.health < 40 },
  { diseaseId: 'cancer', chance: 0.003, minAge: 30, condition: () => true },
  { diseaseId: 'stroke', chance: 0.002, minAge: 50, condition: person => person.health < 35 },
  { diseaseId: 'kidney_disease', chance: 0.002, minAge: 35, condition: person => person.health < 40 },
];

export function contractDisease(person, diseaseId) {
  const def = DISEASES[diseaseId];
  if (!def) return null;

  if (!person.conditions) person.conditions = [];
  if (person.conditions.some(c => c.id === diseaseId)) return null;

  const condition = {
    id: def.id,
    name: def.name,
    category: def.category,
    contractedAtAge: person.age,
    treated: false,
    treatmentApplied: null,
    yearsRemaining: def.duration.min + Math.floor(Math.random() * (def.duration.max - def.duration.min + 1)),
    cured: false,
  };

  person.conditions.push(condition);
  person.logEvent(`🩺 You've been diagnosed with ${def.name}.`, 'bad');
  return condition;
}

export function tryContractDisease(person) {
  if (person.age < 5) return null;
  if (!person.conditions) person.conditions = [];

  for (const trigger of DISEASE_TRIGGERS) {
    if (person.age < trigger.minAge) continue;
    if (!trigger.condition(person)) continue;
    if (person.conditions.some(c => c.id === trigger.diseaseId)) continue;
    if (Math.random() < trigger.chance) {
      return contractDisease(person, trigger.diseaseId);
    }
  }
  return null;
}

export function getAvailableTreatments(person, diseaseId) {
  const def = DISEASES[diseaseId];
  if (!def) return [];
  const condition = person.conditions?.find(c => c.id === diseaseId);
  if (!condition) return [];

  return def.treatments.map(tId => ({
    id: tId,
    ...TREATMENT_EFFECTS[tId],
    alreadyUsed: condition.treatmentApplied === tId,
  }));
}

export function treatDisease(person, diseaseId, treatmentId) {
  const def = DISEASES[diseaseId];
  const condition = person.conditions?.find(c => c.id === diseaseId);
  if (!def || !condition) return { success: false, message: 'Condition not found.' };

  const treatment = TREATMENT_EFFECTS[treatmentId];
  if (!treatment) return { success: false, message: 'Invalid treatment.' };

  const cost = treatment.cost;
  if (person.money < cost) {
    return { success: false, message: `Treatment costs $${cost.toLocaleString()}. You can't afford it.` };
  }

  if (cost > 0) {
    person.money -= cost;
  }

  condition.treated = true;
  condition.treatmentApplied = treatmentId;

  const healAmount = Math.floor(condition.yearsRemaining * def.healthDrain * 0.5);
  const roll = Math.random();

  let message;
  if (roll < def.cureRate * 0.4) {
    condition.cured = true;
    condition.yearsRemaining = 0;
    person.health = Math.min(100, (person.health || 100) + healAmount);
    message = `✅ The ${treatment.label.split(' (')[0]} worked! You've recovered from ${def.name}.`;
    person.logEvent(message, 'good');
    return { success: true, message, cured: true, cost };
  }

  if (roll < def.cureRate) {
    condition.yearsRemaining = Math.max(0, condition.yearsRemaining - 1);
    person.health = Math.min(100, (person.health || 100) + Math.floor(healAmount * 0.5));
    message = `💊 The ${treatment.label.split(' (')[0]} is helping. You're on the mend.`;
    person.logEvent(message, 'good');
    return { success: true, message, cured: false, cost };
  }

  person.health = Math.max(0, (person.health || 100) - 5);
  message = `😔 The ${treatment.label.split(' (')[0]} didn't help much. You feel worse.`;
  person.logEvent(message, 'bad');
  return { success: true, message, cured: false, cost };
}

export function processConditions(person) {
  if (!person.conditions || person.conditions.length === 0) return [];

  const events = [];
  const toRemove = [];

  for (const condition of person.conditions) {
    if (condition.cured) {
      toRemove.push(condition);
      continue;
    }

    const def = DISEASES[condition.id];
    if (!def) {
      toRemove.push(condition);
      continue;
    }

    condition.yearsRemaining -= 1;

    const drain = def.healthDrain * (condition.treated ? 0.4 : 1.0);
    person.health = Math.max(0, (person.health || 100) - drain);

    if (!condition.treated && Math.random() < def.mortalityRate) {
      person.isAlive = false;
      person.logEvent(`☠️ ${def.name} has claimed your life.`, 'bad');
      events.push(`Died from ${def.name}.`);
      return events;
    }

    if (condition.yearsRemaining <= 0) {
      if (def.category === 'chronic') {
        if (Math.random() < 0.2) {
          condition.cured = true;
          events.push(`🩺 Your ${def.name} has gone into remission.`);
        } else {
          condition.yearsRemaining = 1;
        }
      } else {
        condition.cured = true;
        events.push(`✅ You've recovered from ${def.name}.`);
      }
    } else if (drain > 5 && Math.random() < 0.15) {
      events.push(`⚠️ Your ${def.name} is taking a toll on your health.`);
    }
  }

  person.conditions = person.conditions.filter(c => !c.cured && !toRemove.includes(c));
  return events;
}

export function getDiseaseSummary(person) {
  if (!person.conditions || person.conditions.length === 0) return null;
  const totalHealthDrain = person.conditions.reduce((sum, c) => {
    const def = DISEASES[c.id];
    return sum + (def ? def.healthDrain : 0);
  }, 0);
  return {
    count: person.conditions.length,
    active: person.conditions.filter(c => !c.cured).length,
    totalHealthDrain,
    conditions: person.conditions.filter(c => !c.cured),
  };
}
