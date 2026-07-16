const JOURNEY_VERSION = 1;

const GOALS = [
  {
    id: 'first_step',
    icon: '🌱',
    action: 'age_up',
    reward: { happiness: 2 },
    en: { title: 'Take your first step', body: 'Advance your life by one year.', cta: 'Age up', reward: '+2 happiness' },
    ar: { title: 'اتخذ خطوتك الأولى', body: 'تقدم سنة واحدة في حياتك.', cta: 'تقدم سنة', reward: '+2 سعادة' },
    progress: person => ({ value: Math.min(1, Number(person?.age) || 0), target: 1 }),
  },
  {
    id: 'explore_activities',
    icon: '✨',
    action: 'activities',
    reward: { smarts: 2 },
    en: { title: 'Explore your choices', body: 'Open Activities and discover what this life can become.', cta: 'Open Activities', reward: '+2 smarts' },
    ar: { title: 'استكشف اختياراتك', body: 'افتح الأنشطة واكتشف ما يمكن أن تصبح عليه حياتك.', cta: 'افتح الأنشطة', reward: '+2 ذكاء' },
    progress: person => ({ value: person?.playerJourney?.actions?.open_activities ? 1 : 0, target: 1 }),
  },
  {
    id: 'care_for_self',
    icon: '💚',
    action: 'activities',
    reward: { health: 3 },
    en: { title: 'Care for yourself', body: 'Complete a healthy or relaxing activity.', cta: 'Choose an activity', reward: '+3 health' },
    ar: { title: 'اعتنِ بنفسك', body: 'أكمل نشاطا صحيا أو مريحا.', cta: 'اختر نشاطا', reward: '+3 صحة' },
    progress: person => ({ value: person?.playerJourney?.actions?.healthy_activity ? 1 : 0, target: 1 }),
  },
  {
    id: 'learn_something',
    icon: '🎓',
    action: 'education',
    reward: { smarts: 3 },
    en: { title: 'Invest in knowledge', body: 'Study, enroll, or reach solid school performance.', cta: 'Open Education', reward: '+3 smarts' },
    ar: { title: 'استثمر في المعرفة', body: 'ادرس أو سجّل أو حقق أداء دراسيا جيدا.', cta: 'افتح التعليم', reward: '+3 ذكاء' },
    progress: person => ({
      value: person?.playerJourney?.actions?.studied || Number(person?.currentSchool?.performance) >= 60 ? 1 : 0,
      target: 1,
    }),
  },
  {
    id: 'earn_income',
    icon: '💼',
    action: 'occupation',
    reward: { money: 500 },
    en: { title: 'Build an income', body: 'Get a job or earn your first meaningful income.', cta: 'Open Career', reward: '$500 bonus' },
    ar: { title: 'ابنِ دخلا', body: 'احصل على وظيفة أو اكسب أول دخل مهم.', cta: 'افتح المهنة', reward: 'مكافأة 500$' },
    progress: person => ({
      value: person?.job || Number(person?.lifeStats?.totalMoneyEarned) >= 1000 ? 1 : 0,
      target: 1,
    }),
  },
  {
    id: 'strong_bond',
    icon: '🤝',
    action: 'relationships',
    reward: { happiness: 3, karma: 2 },
    en: { title: 'Strengthen a bond', body: 'Build a relationship to at least 75%.', cta: 'Open Relationships', reward: '+3 happiness · +2 karma' },
    ar: { title: 'قوِّ رابطة', body: 'ارفع قوة إحدى العلاقات إلى 75% على الأقل.', cta: 'افتح العلاقات', reward: '+3 سعادة · +2 كارما' },
    progress: person => {
      const best = Math.max(0, ...(person?.relationships || []).map(rel => Number(rel?.stat) || 0));
      return { value: Math.min(75, best), target: 75 };
    },
  },
  {
    id: 'financial_buffer',
    icon: '💰',
    action: 'occupation',
    reward: { money: 750 },
    en: { title: 'Create a safety buffer', body: 'Reach $10,000 in cash with no overdue personal debt.', cta: 'Review your income', reward: '$750 bonus' },
    ar: { title: 'كوّن احتياطيا ماليا', body: 'امتلك 10,000$ نقدا من دون دين شخصي متأخر.', cta: 'راجع دخلك', reward: 'مكافأة 750$' },
    progress: person => ({
      value: Math.min(10000, Math.max(0, Number(person?.money) || 0)),
      target: 10000,
      blocked: Number(person?.personalDebt) > 0,
    }),
  },
  {
    id: 'own_something',
    icon: '🏠',
    action: 'assets',
    reward: { happiness: 4 },
    en: { title: 'Own part of your future', body: 'Buy your first asset or investment.', cta: 'Open Assets', reward: '+4 happiness' },
    ar: { title: 'امتلك جزءا من مستقبلك', body: 'اشترِ أول أصل أو استثمار.', cta: 'افتح الممتلكات', reward: '+4 سعادة' },
    progress: person => ({
      value: (person?.assets || []).length + (person?.portfolio || []).length > 0 ? 1 : 0,
      target: 1,
    }),
  },
];

const UNLOCK_TIPS = [
  {
    id: 'school',
    condition: person => Number(person?.age) >= 6,
    en: { title: 'Education is available', body: 'School performance now shapes future careers.', icon: '🎓' },
    ar: { title: 'أصبح التعليم متاحا', body: 'يؤثر أداؤك الدراسي الآن في المهن المستقبلية.', icon: '🎓' },
  },
  {
    id: 'relationships',
    condition: person => Number(person?.age) >= 12,
    en: { title: 'Relationships are getting deeper', body: 'Memories, trust, promises, and conflict now matter more.', icon: '🤝' },
    ar: { title: 'أصبحت العلاقات أعمق', body: 'للذكريات والثقة والوعود والخلافات أهمية أكبر الآن.', icon: '🤝' },
  },
  {
    id: 'adult_life',
    condition: person => Number(person?.age) >= 18,
    en: { title: 'Adult life unlocked', body: 'Careers, assets, travel, politics, and more are now open.', icon: '🔓' },
    ar: { title: 'فُتحت حياة البالغين', body: 'أصبحت المهن والممتلكات والسفر والسياسة وغيرها متاحة.', icon: '🔓' },
  },
  {
    id: 'world_influence',
    condition: person => Number(person?.reputation?.political) >= 25 || Number(person?.fame) >= 30,
    en: { title: 'Your influence is growing', body: 'The World screen now matters personally—your choices can shape events.', icon: '🌍' },
    ar: { title: 'نفوذك يتزايد', body: 'أصبحت شاشة العالم مهمة لك شخصيا ويمكن لاختياراتك تشكيل الأحداث.', icon: '🌍' },
  },
];

function clampStat(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export function ensurePlayerJourney(person, options = {}) {
  if (!person || typeof person !== 'object') return null;
  const existing = person.playerJourney && typeof person.playerJourney === 'object'
    ? person.playerJourney
    : {};
  person.playerJourney = {
    version: JOURNEY_VERSION,
    guidedEnabled: options.newLife ? true : Boolean(existing.guidedEnabled),
    tipsEnabled: existing.tipsEnabled !== false,
    completedGoalIds: Array.isArray(existing.completedGoalIds) ? existing.completedGoalIds : [],
    rewardedGoalIds: Array.isArray(existing.rewardedGoalIds) ? existing.rewardedGoalIds : [],
    seenUnlockIds: Array.isArray(existing.seenUnlockIds) ? existing.seenUnlockIds : [],
    actions: existing.actions && typeof existing.actions === 'object' ? existing.actions : {},
    completedAt: existing.completedAt && typeof existing.completedAt === 'object' ? existing.completedAt : {},
    lastActiveAt: existing.lastActiveAt || Date.now(),
  };
  return person.playerJourney;
}

export function setGuidedJourney(person, enabled) {
  const journey = ensurePlayerJourney(person);
  if (!journey) return;
  journey.guidedEnabled = Boolean(enabled);
  journey.tipsEnabled = Boolean(enabled) || journey.tipsEnabled;
}

export function recordJourneyAction(person, action, amount = 1) {
  const journey = ensurePlayerJourney(person);
  if (!journey || !action) return;
  const current = Number(journey.actions[action]) || 0;
  journey.actions[action] = current + Math.max(1, Number(amount) || 1);
  journey.lastActiveAt = Date.now();
}

function isGoalComplete(person, goal) {
  const progress = goal.progress(person);
  return !progress.blocked && Number(progress.value) >= Number(progress.target);
}

function grantReward(person, reward = {}) {
  if (reward.money) person.money = (Number(person.money) || 0) + reward.money;
  ['happiness', 'health', 'smarts', 'karma'].forEach(stat => {
    if (!reward[stat]) return;
    person[stat] = clampStat((Number(person[stat]) || 0) + reward[stat]);
  });
}

export function updatePlayerJourney(person, language = 'en') {
  const journey = ensurePlayerJourney(person);
  if (!journey) return [];
  const locale = language === 'ar' ? 'ar' : 'en';
  const notifications = [];

  if (journey.guidedEnabled) {
    // Keep progression readable: complete at most two sequential goals per action.
    for (let pass = 0; pass < 2; pass += 1) {
      const goal = GOALS.find(item => !journey.completedGoalIds.includes(item.id));
      if (!goal || !isGoalComplete(person, goal)) break;
      journey.completedGoalIds.push(goal.id);
      journey.completedAt[goal.id] = { age: Number(person.age) || 0, at: Date.now() };
      if (!journey.rewardedGoalIds.includes(goal.id)) {
        grantReward(person, goal.reward);
        journey.rewardedGoalIds.push(goal.id);
      }
      notifications.push({
        type: 'goal',
        id: goal.id,
        icon: goal.icon,
        title: locale === 'ar' ? 'اكتمل هدف الرحلة' : 'Journey goal complete',
        body: goal[locale].title,
        reward: goal[locale].reward,
      });
    }
  }

  if (journey.tipsEnabled) {
    UNLOCK_TIPS.forEach(tip => {
      if (journey.seenUnlockIds.includes(tip.id) || !tip.condition(person)) return;
      journey.seenUnlockIds.push(tip.id);
      notifications.push({ type: 'unlock', id: tip.id, ...tip[locale] });
    });
  }

  journey.lastActiveAt = Date.now();
  return notifications.slice(0, 3);
}

export function getJourneyView(person, language = 'en') {
  const journey = ensurePlayerJourney(person);
  const locale = language === 'ar' ? 'ar' : 'en';
  const completed = new Set(journey?.completedGoalIds || []);
  const goal = GOALS.find(item => !completed.has(item.id)) || null;
  if (!goal) {
    return {
      complete: true,
      completedCount: GOALS.length,
      totalCount: GOALS.length,
      title: locale === 'ar' ? 'اكتملت رحلة البداية' : 'Starter journey complete',
      body: locale === 'ar' ? 'أصبحت مستعدا لبناء إرثك بطريقتك.' : 'You are ready to build your legacy your way.',
      icon: '🌳',
    };
  }
  const progress = goal.progress(person);
  return {
    complete: false,
    id: goal.id,
    icon: goal.icon,
    action: goal.action,
    title: goal[locale].title,
    body: goal[locale].body,
    cta: goal[locale].cta,
    reward: goal[locale].reward,
    value: Math.max(0, Number(progress.value) || 0),
    target: Math.max(1, Number(progress.target) || 1),
    blocked: Boolean(progress.blocked),
    completedCount: completed.size,
    totalCount: GOALS.length,
  };
}

export function getJourneyGoals(person, language = 'en') {
  const journey = ensurePlayerJourney(person);
  const locale = language === 'ar' ? 'ar' : 'en';
  return GOALS.map(goal => {
    const progress = goal.progress(person);
    return {
      id: goal.id,
      icon: goal.icon,
      ...goal[locale],
      action: goal.action,
      complete: journey.completedGoalIds.includes(goal.id),
      value: Math.max(0, Number(progress.value) || 0),
      target: Math.max(1, Number(progress.target) || 1),
      blocked: Boolean(progress.blocked),
    };
  });
}
