export const CHARITABLE_CAUSES = [
  { id: 'education', name: 'Education', description: 'Build schools and fund scholarships' },
  { id: 'health', name: 'Healthcare', description: 'Fund hospitals and medical research' },
  { id: 'environment', name: 'Environment', description: 'Protect forests and wildlife' },
  { id: 'poverty', name: 'Poverty Relief', description: 'Feed the hungry and house the homeless' },
  { id: 'arts', name: 'Arts & Culture', description: 'Support museums and artists' },
  { id: 'science', name: 'Scientific Research', description: 'Fund breakthrough discoveries' },
];

export const FOUNDATION_TYPES = [
  {
    id: 'small',
    name: 'Community Foundation',
    cost: 50000,
    impact: 10,
    fameGain: 5,
    taxDeduction: 0.2,
  },
  {
    id: 'medium',
    name: 'National Foundation',
    cost: 500000,
    impact: 25,
    fameGain: 15,
    taxDeduction: 0.3,
  },
  {
    id: 'large',
    name: 'Global Foundation',
    cost: 5000000,
    impact: 50,
    fameGain: 30,
    taxDeduction: 0.4,
  },
];

export const LEGACY_PROJECTS = [
  {
    name: 'Fund a Scholarship Program',
    cost: 100000,
    impact: 'education',
    fameBonus: 10,
    karmaBonus: 20,
  },
  { name: 'Build a Hospital Wing', cost: 1000000, impact: 'health', fameBonus: 25, karmaBonus: 30 },
  {
    name: 'Create a Nature Reserve',
    cost: 500000,
    impact: 'environment',
    fameBonus: 15,
    karmaBonus: 25,
  },
  {
    name: 'Sponsor a Research Lab',
    cost: 2000000,
    impact: 'science',
    fameBonus: 30,
    karmaBonus: 20,
  },
  { name: 'Endow a Museum', cost: 750000, impact: 'arts', fameBonus: 20, karmaBonus: 15 },
];

export function donateToCharity(person, causeId, amount) {
  const donation = Math.floor(Number(amount));
  if (!Number.isFinite(donation) || donation <= 0 || person.money < donation) {
    person.logEvent("You can't afford that donation.", 'bad');
    return false;
  }

  const cause = CHARITABLE_CAUSES.find(c => c.id === causeId);
  if (!cause) {
    return false;
  }

  person.money -= donation;
  person.totalDonated = (Number(person.totalDonated) || 0) + donation;
  const happinessGain = Math.min(20, Math.floor(donation / 5000));
  person.updateStats({
    karma: Math.min(10, Math.floor(donation / 100000)),
    happiness: happinessGain,
  });

  if (donation > 100000) {
    person.fame = Math.min(100, (person.fame || 0) + 2);
    person.logEvent(
      `You donated $${donation.toLocaleString()} to ${cause.name}! You feel great.`,
      'good'
    );
  } else {
    person.logEvent(`You donated $${donation.toLocaleString()} to ${cause.name}.`, 'good');
  }

  return true;
}

export function startFoundation(person, foundationType) {
  const ft = FOUNDATION_TYPES.find(f => f.id === foundationType);
  if (!ft) {
    return false;
  }

  if (person.money < ft.cost) {
    person.logEvent(`You need $${ft.cost.toLocaleString()} to start a ${ft.name}.`, 'bad');
    return false;
  }

  if (!person.foundations) {
    person.foundations = [];
  }

  person.money -= ft.cost;
  person.foundations.push({
    name: ft.name,
    type: foundationType,
    impact: ft.impact,
    yearFounded: person.age,
  });

  person.fame = Math.min(100, (person.fame || 0) + ft.fameGain);
  person.updateStats({ karma: ft.impact / 2, happiness: 15 });
  person.logEvent(`You established a ${ft.name}! Your legacy grows.`, 'good');

  return true;
}

export function fundLegacyProject(person, projectName) {
  const proj = LEGACY_PROJECTS.find(p => p.name === projectName);
  if (!proj) {
    return false;
  }

  if (person.money < proj.cost) {
    person.logEvent(`The ${proj.name} costs $${proj.cost.toLocaleString()}.`, 'bad');
    return false;
  }

  if (!person.legacyProjects) {
    person.legacyProjects = [];
  }
  if (person.legacyProjects.includes(proj.name)) {
    person.logEvent("You've already funded this project.", 'bad');
    return false;
  }

  person.money -= proj.cost;
  person.legacyProjects.push(proj.name);

  person.fame = Math.min(100, (person.fame || 0) + proj.fameBonus);
  person.updateStats({ karma: proj.karmaBonus, happiness: 20 });
  person.logEvent(`You funded a project: ${proj.name}! Your name will live on.`, 'good');

  return true;
}
