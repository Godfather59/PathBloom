export const LIFE_GOALS = [
  {
    id: 'grow_up',
    icon: '🎂',
    titleKey: 'goal.growUp',
    title: 'Reach age 18',
    progress: person => `${Math.min(person.age, 18)}/18`,
    complete: person => person.age >= 18,
  },
  {
    id: 'healthy_start',
    icon: '❤️',
    titleKey: 'goal.healthyStart',
    title: 'Keep health above 70',
    progress: person => `${person.health}%`,
    complete: person => person.age >= 12 && person.health >= 70,
  },
  {
    id: 'graduate',
    icon: '🎓',
    titleKey: 'goal.graduate',
    title: 'Graduate from school',
    progress: person =>
      person.educationHistory?.length
        ? person.educationHistory[person.educationHistory.length - 1]
        : 'Not yet',
    complete: person =>
      (person.educationHistory || []).some(
        entry => entry.includes('High School') || entry.includes('University')
      ),
  },
  {
    id: 'first_job',
    icon: '💼',
    titleKey: 'goal.firstJob',
    title: 'Get a job',
    progress: person => person.job?.title || 'Unemployed',
    complete: person => Boolean(person.job),
  },
  {
    id: 'savings',
    icon: '💰',
    titleKey: 'goal.savings',
    title: 'Save $10,000',
    progress: person => `$${Math.min(person.money, 10000).toLocaleString()} / $10,000`,
    complete: person => person.money >= 10000,
  },
  {
    id: 'relationship',
    icon: '💞',
    titleKey: 'goal.relationship',
    title: 'Build a close relationship',
    progress: person =>
      `${(person.relationships || []).filter(rel => rel.stat >= 70).length} close`,
    complete: person => (person.relationships || []).some(rel => rel.stat >= 70),
  },
  {
    id: 'home_owner',
    icon: '🏠',
    titleKey: 'goal.homeOwner',
    title: 'Own an asset',
    progress: person => `${person.assets?.length || 0} owned`,
    complete: person => (person.assets || []).length > 0,
  },
  {
    id: 'legacy',
    icon: '🌳',
    titleKey: 'goal.legacy',
    title: 'Start a legacy',
    progress: person =>
      `${(person.relationships || []).filter(rel => rel.type === 'Child').length} children`,
    complete: person => (person.relationships || []).some(rel => rel.type === 'Child'),
  },
];

export function getGoalState(person) {
  const goals = LIFE_GOALS.map(goal => ({
    ...goal,
    completed: goal.complete(person),
    progressText: goal.progress(person),
  }));

  return {
    goals,
    completed: goals.filter(goal => goal.completed),
    active: goals.filter(goal => !goal.completed).slice(0, 3),
  };
}

export function getLegacyScore(person) {
  const safeNetWorth =
    typeof person.getTotalEstateValue === 'function'
      ? person.getTotalEstateValue()
      : Math.max(
          0,
          (person.money || 0) +
            (person.assets || []).reduce(
              (total, asset) => total + (asset.value || asset.price || 0),
              0
            )
        );
  const children = (person.relationships || []).filter(rel => rel.type === 'Child').length;
  const degrees = person.educationHistory?.length || 0;
  const completedGoals = getGoalState(person).completed.length;
  const averageStats = Math.round(
    ((person.happiness || 0) +
      (person.health || 0) +
      (person.smarts || 0) +
      (person.looks || 0) +
      (person.karma || 0)) /
      5
  );

  return Math.max(
    0,
    (person.age || 0) * 12 +
      Math.floor(Math.log10(Math.max(1, safeNetWorth)) * 120) +
      children * 180 +
      degrees * 90 +
      (person.fame || 0) * 8 +
      completedGoals * 140 +
      averageStats * 4
  );
}

export function getLegacyRank(score) {
  if (score >= 3200) {
    return { labelKey: 'legacy.rank.legend', label: 'Legendary Bloom', icon: '🌟' };
  }
  if (score >= 2200) {
    return { labelKey: 'legacy.rank.great', label: 'Great Legacy', icon: '🏆' };
  }
  if (score >= 1300) {
    return { labelKey: 'legacy.rank.strong', label: 'Strong Roots', icon: '🌳' };
  }
  if (score >= 650) {
    return { labelKey: 'legacy.rank.growing', label: 'Growing Path', icon: '🌿' };
  }
  return { labelKey: 'legacy.rank.seed', label: 'New Seed', icon: '🌱' };
}
