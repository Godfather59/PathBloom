export const WORLD_EVENTS = [
  {
    id: 'global_recession',
    name: 'Global Recession',
    type: 'economic',
    severity: 'major',
    desc: 'Markets crash worldwide. Jobs are harder to find and salaries shrink.',
    effects: { salaryMult: 0.7, jobChance: 0.6, happinessImpact: -10 },
  },
  {
    id: 'tech_boom',
    name: 'Tech Boom',
    type: 'economic',
    severity: 'major',
    desc: 'Technology sector explodes. New startups emerge and tech salaries soar.',
    effects: { salaryMult: 1.3, jobChance: 1.4, happinessImpact: 5 },
  },
  {
    id: 'real_estate_bubble',
    name: 'Real Estate Bubble',
    type: 'economic',
    severity: 'moderate',
    desc: 'Property values skyrocket. Great time to sell, terrible time to buy.',
    effects: { housingCostMult: 1.5, salaryMult: 1.05, happinessImpact: 0 },
  },
  {
    id: 'pandemic',
    name: 'Global Pandemic',
    type: 'health',
    severity: 'catastrophic',
    desc: 'A deadly virus spreads across borders. Quarantines and lockdowns everywhere.',
    effects: { healthImpact: -15, salaryMult: 0.8, happinessImpact: -20, travelBan: true },
  },
  {
    id: 'climate_disaster',
    name: 'Climate Disaster',
    type: 'natural',
    severity: 'major',
    desc: 'Extreme weather events devastate regions worldwide.',
    effects: { healthImpact: -5, housingCostMult: 1.2, happinessImpact: -10 },
  },
  {
    id: 'cultural_renaissance',
    name: 'Cultural Renaissance',
    type: 'cultural',
    severity: 'moderate',
    desc: 'Arts, music, and film flourish. Creativity is at an all-time high.',
    effects: { cultureBoost: 15, happinessImpact: 10, fameMult: 1.2 },
  },
  {
    id: 'sports_madness',
    name: 'Sports Fever',
    type: 'cultural',
    severity: 'minor',
    desc: 'The world is captivated by major sporting events. Athletic careers get a spotlight.',
    effects: { sportsFameMult: 1.5, happinessImpact: 5 },
  },
  {
    id: 'political_upheaval',
    name: 'Political Upheaval',
    type: 'political',
    severity: 'major',
    desc: 'Governments fall and protests erupt. Political careers are made and broken.',
    effects: { politicalChance: 0.5, happinessImpact: -10, fameMult: 1.1 },
  },
  {
    id: 'gold_rush',
    name: 'Modern Gold Rush',
    type: 'economic',
    severity: 'moderate',
    desc: 'Cryptocurrency and commodity prices explode. Early investors get rich.',
    effects: { investmentMult: 1.8, salaryMult: 1.1, happinessImpact: 5 },
  },
  {
    id: 'space_race',
    name: 'New Space Race',
    type: 'technological',
    severity: 'major',
    desc: 'Nations and corporations compete for space exploration. STEM careers thrive.',
    effects: { techJobMult: 1.6, salaryMult: 1.15, happinessImpact: 8 },
  },
  {
    id: 'education_reform',
    name: 'Education Reform',
    type: 'social',
    severity: 'moderate',
    desc: 'Governments invest heavily in education. Scholarships and grants abound.',
    effects: { eduCostMult: 0.6, smartsGainMult: 1.3, happinessImpact: 5 },
  },
  {
    id: 'crime_wave',
    name: 'Crime Wave',
    type: 'social',
    severity: 'major',
    desc: 'Organized crime and street violence spike. Law enforcement is stretched thin.',
    effects: { crimeSuccessMult: 1.3, notorietyGainMult: 1.5, happinessImpact: -8 },
  },
  {
    id: 'peace_treaty',
    name: 'Global Peace Treaty',
    type: 'political',
    severity: 'moderate',
    desc: 'Historic peace agreements are signed. Military tensions ease worldwide.',
    effects: { happinessImpact: 12, militaryChance: 0.7 },
  },
  {
    id: 'baby_boom',
    name: 'Baby Boom',
    type: 'social',
    severity: 'minor',
    desc: 'Birth rates surge. Families are celebrated and child benefits increase.',
    effects: { fertilityMult: 1.3, happinessImpact: 5 },
  },
  {
    id: 'immigration_wave',
    name: 'Open Borders Initiative',
    type: 'political',
    severity: 'moderate',
    desc: 'Countries ease immigration policies. Moving abroad has never been easier.',
    effects: { visaCostMult: 0.5, immigrationChance: 1.4, happinessImpact: 3 },
  },
  {
    id: 'cyber_attack',
    name: 'Massive Cyber Attack',
    type: 'technological',
    severity: 'major',
    desc: 'Critical infrastructure is compromised. Digital security is paramount.',
    effects: { techJobMult: 1.3, happinessImpact: -5, salaryMult: 0.95 },
  },
  {
    id: 'green_revolution',
    name: 'Green Revolution',
    type: 'environmental',
    severity: 'moderate',
    desc: 'Renewable energy and sustainability drive the economy.',
    effects: { natureBoost: 15, jobChance: 1.2, happinessImpact: 8 },
  },
  {
    id: 'olympic_games',
    name: 'Olympic Games',
    type: 'cultural',
    severity: 'minor',
    desc: 'The Olympics unite the world. Athletic achievements are celebrated globally.',
    effects: { sportsFameMult: 2.0, happinessImpact: 8 },
  },
  {
    id: 'medieval_festival',
    name: 'Renaissance Fair Craze',
    type: 'cultural',
    severity: 'minor',
    desc: 'Historical reenactments and medieval fairs are all the rage.',
    effects: { cultureBoost: 5, happinessImpact: 5 },
  },
  {
    id: 'housing_crisis',
    name: 'Housing Crisis',
    type: 'economic',
    severity: 'major',
    desc: 'Affordable housing disappears. Rent and mortgage payments skyrocket.',
    effects: { housingCostMult: 1.8, salaryMult: 0.9, happinessImpact: -15 },
  },
];

for (const event of WORLD_EVENTS) {
  event.nameMessageKey = `worldEvent.${event.id}.name`;
  event.descriptionMessageKey = `worldEvent.${event.id}.description`;
  event.messageKey = `worldEvent.${event.id}.announcement`;
}

let activeEvents = [];

export function getActiveWorldEvents() {
  return activeEvents.map(event => ({
    ...event,
    effects: { ...(event.effects || {}) },
  }));
}

export function getActiveEventIds() {
  return activeEvents.map(e => e.id);
}

export function generateWorldEvents(personAge) {
  const newEvents = [];
  const minSeverity = personAge < 18 ? 'minor' : personAge < 40 ? 'moderate' : 'major';

  const eligible = WORLD_EVENTS.filter(e => {
    const severityOrder = ['minor', 'moderate', 'major', 'catastrophic'];
    return (
      severityOrder.indexOf(e.severity) <= severityOrder.indexOf(minSeverity) ||
      e.severity === 'minor'
    );
  });

  const numEvents = Math.floor(Math.random() * 3) + 1;
  for (let i = 0; i < numEvents && eligible.length > 0; i++) {
    if (Math.random() < 0.25) {
      const idx = Math.floor(Math.random() * eligible.length);
      const picked = eligible[idx];
      if (!activeEvents.some(e => e.id === picked.id) && !newEvents.some(e => e.id === picked.id)) {
        newEvents.push({ ...picked });
      }
    }
  }

  return newEvents;
}

export function startWorldEvents(personAge) {
  const newOnes = generateWorldEvents(personAge);
  activeEvents = [...activeEvents, ...newOnes];
  return newOnes;
}

export function ageWorldEvents() {
  // 20% chance each event ends per year
  activeEvents = activeEvents.filter(() => Math.random() >= 0.2);
  return activeEvents;
}

export function clearWorldEvents() {
  activeEvents = [];
}

export function restoreWorldEvents(events = []) {
  const catalogById = new Map(WORLD_EVENTS.map(event => [event.id, event]));
  const restored = [];
  const seen = new Set();

  for (const savedEvent of Array.isArray(events) ? events : []) {
    const eventId = typeof savedEvent === 'string' ? savedEvent : savedEvent?.id;
    const catalogEvent = catalogById.get(eventId);
    if (!catalogEvent || seen.has(eventId)) {
      continue;
    }

    seen.add(eventId);
    restored.push({
      ...catalogEvent,
      effects: { ...catalogEvent.effects },
    });
  }

  activeEvents = restored;
  return getActiveWorldEvents();
}

export function getEventEffects() {
  const effects = {
    salaryMult: 1,
    jobChance: 1,
    housingCostMult: 1,
    healthImpact: 0,
    happinessImpact: 0,
    fameMult: 1,
    sportsFameMult: 1,
    investmentMult: 1,
    crimeSuccessMult: 1,
    notorietyGainMult: 1,
    visaCostMult: 1,
    immigrationChance: 1,
    cultureBoost: 0,
    natureBoost: 0,
    techJobMult: 1,
    eduCostMult: 1,
    smartsGainMult: 1,
    fertilityMult: 1,
    travelBan: false,
  };

  for (const event of activeEvents) {
    if (event.effects.salaryMult) {
      effects.salaryMult *= event.effects.salaryMult;
    }
    if (event.effects.jobChance) {
      effects.jobChance *= event.effects.jobChance;
    }
    if (event.effects.housingCostMult) {
      effects.housingCostMult *= event.effects.housingCostMult;
    }
    if (event.effects.healthImpact) {
      effects.healthImpact += event.effects.healthImpact;
    }
    if (event.effects.happinessImpact) {
      effects.happinessImpact += event.effects.happinessImpact;
    }
    if (event.effects.fameMult) {
      effects.fameMult *= event.effects.fameMult;
    }
    if (event.effects.sportsFameMult) {
      effects.sportsFameMult *= event.effects.sportsFameMult;
    }
    if (event.effects.investmentMult) {
      effects.investmentMult *= event.effects.investmentMult;
    }
    if (event.effects.crimeSuccessMult) {
      effects.crimeSuccessMult *= event.effects.crimeSuccessMult;
    }
    if (event.effects.notorietyGainMult) {
      effects.notorietyGainMult *= event.effects.notorietyGainMult;
    }
    if (event.effects.visaCostMult) {
      effects.visaCostMult *= event.effects.visaCostMult;
    }
    if (event.effects.immigrationChance) {
      effects.immigrationChance *= event.effects.immigrationChance;
    }
    if (event.effects.cultureBoost) {
      effects.cultureBoost += event.effects.cultureBoost;
    }
    if (event.effects.natureBoost) {
      effects.natureBoost += event.effects.natureBoost;
    }
    if (event.effects.techJobMult) {
      effects.techJobMult *= event.effects.techJobMult;
    }
    if (event.effects.eduCostMult) {
      effects.eduCostMult *= event.effects.eduCostMult;
    }
    if (event.effects.smartsGainMult) {
      effects.smartsGainMult *= event.effects.smartsGainMult;
    }
    if (event.effects.fertilityMult) {
      effects.fertilityMult *= event.effects.fertilityMult;
    }
    if (event.effects.travelBan) {
      effects.travelBan = true;
    }
  }

  return effects;
}

export function getEventName(id) {
  const event = WORLD_EVENTS.find(e => e.id === id);
  return event ? event.name : 'Unknown Event';
}
