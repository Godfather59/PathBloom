const text = (en, ar) => Object.freeze({ en, ar });

const reward = (points, stats = {}, money = 0) =>
  Object.freeze({
    points,
    stats: Object.freeze({ ...stats }),
    money,
  });

/**
 * Ambition definitions are deliberately declarative. They can be displayed,
 * inspected and balanced without serialising executable functions into a save.
 * Only the small lifeAmbition state attached to a person is persisted.
 */
export const AMBITION_PATHS = Object.freeze([
  Object.freeze({
    id: 'family_legacy',
    icon: '🌳',
    color: '#66bb6a',
    name: text('Family Legacy', 'إرث العائلة'),
    description: text(
      'Build a loving, secure family whose influence lasts for generations.',
      'ابنِ عائلة محبة ومستقرة يستمر تأثيرها عبر الأجيال.'
    ),
    stages: Object.freeze([
      Object.freeze({
        id: 'trusted_circle',
        minAge: 12,
        icon: '🤝',
        name: text('Trusted Circle', 'دائرة الثقة'),
        description: text(
          'Have two living relationships at 70% or better.',
          'حافظ على علاقتين مع أشخاص أحياء بنسبة 70٪ أو أفضل.'
        ),
        requirement: Object.freeze({ type: 'close_relationships', target: 2, threshold: 70 }),
        reward: reward(100, { happiness: 4, karma: 2 }),
      }),
      Object.freeze({
        id: 'life_partner',
        minAge: 18,
        icon: '💍',
        name: text('Life Partner', 'شريك الحياة'),
        description: text(
          'Build a strong bond with a partner, fiancé or spouse.',
          'ابنِ رابطة قوية مع شريك أو خطيب أو زوج.'
        ),
        requirement: Object.freeze({
          type: 'relationship_types',
          types: Object.freeze(['Partner', 'Fiance', 'Spouse']),
          target: 1,
          threshold: 75,
        }),
        reward: reward(150, { happiness: 6 }),
      }),
      Object.freeze({
        id: 'next_generation',
        minAge: 20,
        icon: '👶',
        name: text('Next Generation', 'الجيل القادم'),
        description: text('Welcome a child into your family.', 'استقبل طفلاً في عائلتك.'),
        requirement: Object.freeze({ type: 'children', target: 1 }),
        reward: reward(200, { happiness: 7, karma: 3 }),
      }),
      Object.freeze({
        id: 'strong_roots',
        minAge: 30,
        icon: '🏡',
        name: text('Strong Roots', 'جذور راسخة'),
        description: text(
          'Raise two children and own a home or other valuable asset.',
          'ربِّ طفلين وامتلك منزلاً أو أصلاً قيّماً.'
        ),
        requirement: Object.freeze({
          type: 'all',
          requirements: Object.freeze([
            Object.freeze({ type: 'children', target: 2 }),
            Object.freeze({ type: 'assets', target: 1 }),
          ]),
        }),
        reward: reward(300, { happiness: 8, health: 2 }, 5000),
      }),
      Object.freeze({
        id: 'lasting_legacy',
        minAge: 45,
        icon: '🌟',
        name: text('Lasting Legacy', 'إرث خالد'),
        description: text(
          'Have three close family bonds and a net worth of $500,000.',
          'حافظ على ثلاث روابط عائلية قوية وثروة صافية قدرها 500,000 دولار.'
        ),
        requirement: Object.freeze({
          type: 'all',
          requirements: Object.freeze([
            Object.freeze({ type: 'close_family', target: 3, threshold: 70 }),
            Object.freeze({ type: 'net_worth', target: 500000 }),
          ]),
        }),
        reward: reward(500, { happiness: 10, karma: 8 }, 25000),
      }),
    ]),
  }),
  Object.freeze({
    id: 'business_empire',
    icon: '🏙️',
    color: '#42a5f5',
    name: text('Business Empire', 'إمبراطورية الأعمال'),
    description: text(
      'Turn discipline and bold ideas into an enduring commercial empire.',
      'حوّل الانضباط والأفكار الجريئة إلى إمبراطورية تجارية راسخة.'
    ),
    stages: Object.freeze([
      Object.freeze({
        id: 'seed_capital',
        minAge: 16,
        icon: '💰',
        name: text('Seed Capital', 'رأس المال الأولي'),
        description: text(
          'Save $10,000 to fund your first idea.',
          'ادّخر 10,000 دولار لتمويل فكرتك الأولى.'
        ),
        requirement: Object.freeze({ type: 'money', target: 10000 }),
        reward: reward(100, { smarts: 3 }),
      }),
      Object.freeze({
        id: 'founder',
        minAge: 18,
        icon: '🚀',
        name: text('Founder', 'المؤسس'),
        description: text('Launch your first company.', 'أطلق شركتك الأولى.'),
        requirement: Object.freeze({ type: 'companies', target: 1 }),
        reward: reward(175, { happiness: 4, smarts: 2 }, 5000),
      }),
      Object.freeze({
        id: 'growing_team',
        minAge: 23,
        icon: '👥',
        name: text('Growing Team', 'فريق متنامٍ'),
        description: text(
          'Employ at least ten people across your companies.',
          'وظّف عشرة أشخاص على الأقل في شركاتك.'
        ),
        requirement: Object.freeze({ type: 'business_employees', target: 10 }),
        reward: reward(225, { karma: 3, smarts: 3 }),
      }),
      Object.freeze({
        id: 'market_leader',
        minAge: 30,
        icon: '📈',
        name: text('Market Leader', 'رائد السوق'),
        description: text(
          'Build a combined company valuation of $1,000,000.',
          'ابنِ شركات بقيمة إجمالية تبلغ 1,000,000 دولار.'
        ),
        requirement: Object.freeze({ type: 'business_valuation', target: 1000000 }),
        reward: reward(325, { fame: 5 }, 20000),
      }),
      Object.freeze({
        id: 'ring_the_bell',
        minAge: 35,
        icon: '🔔',
        name: text('Ring the Bell', 'قرع جرس البورصة'),
        description: text('Take one of your companies public.', 'اطرح إحدى شركاتك في البورصة.'),
        requirement: Object.freeze({ type: 'public_companies', target: 1 }),
        reward: reward(450, { fame: 10, happiness: 6 }, 50000),
      }),
      Object.freeze({
        id: 'business_legend',
        minAge: 45,
        icon: '👑',
        name: text('Business Legend', 'أسطورة الأعمال'),
        description: text(
          'Reach a net worth of $5,000,000 while owning a public company.',
          'حقق ثروة صافية تبلغ 5,000,000 دولار مع امتلاك شركة عامة.'
        ),
        requirement: Object.freeze({
          type: 'all',
          requirements: Object.freeze([
            Object.freeze({ type: 'net_worth', target: 5000000 }),
            Object.freeze({ type: 'public_companies', target: 1 }),
          ]),
        }),
        reward: reward(700, { fame: 12, happiness: 8 }, 100000),
      }),
    ]),
  }),
  Object.freeze({
    id: 'creative_fame',
    icon: '🎨',
    color: '#ab47bc',
    name: text('Creative Fame', 'الشهرة الإبداعية'),
    description: text(
      'Master your craft, find an audience and become a cultural icon.',
      'أتقن موهبتك واعثر على جمهورك وأصبح أيقونة ثقافية.'
    ),
    stages: Object.freeze([
      Object.freeze({
        id: 'find_your_voice',
        minAge: 8,
        icon: '🎵',
        name: text('Find Your Voice', 'اكتشف صوتك'),
        description: text('Develop any creative skill to 25%.', 'طوّر أي مهارة إبداعية إلى 25٪.'),
        requirement: Object.freeze({ type: 'creative_skill', target: 25 }),
        reward: reward(100, { happiness: 3, smarts: 2 }),
      }),
      Object.freeze({
        id: 'professional_break',
        minAge: 18,
        icon: '🎙️',
        name: text('Professional Break', 'الفرصة الاحترافية'),
        description: text(
          'Start a creative career or attract 10,000 followers.',
          'ابدأ مسيرة إبداعية أو اجذب 10,000 متابع.'
        ),
        requirement: Object.freeze({
          type: 'any',
          requirements: Object.freeze([
            Object.freeze({ type: 'creative_career', target: 1 }),
            Object.freeze({ type: 'followers', target: 10000 }),
          ]),
        }),
        reward: reward(175, { fame: 5, happiness: 4 }),
      }),
      Object.freeze({
        id: 'rising_star',
        minAge: 21,
        icon: '⭐',
        name: text('Rising Star', 'نجم صاعد'),
        description: text(
          'Reach 25 fame and grow your audience to 50,000 followers.',
          'صل إلى 25 نقطة شهرة ووسّع جمهورك إلى 50,000 متابع.'
        ),
        requirement: Object.freeze({
          type: 'all',
          requirements: Object.freeze([
            Object.freeze({ type: 'fame', target: 25 }),
            Object.freeze({ type: 'followers', target: 50000 }),
          ]),
        }),
        reward: reward(250, { fame: 5, happiness: 5 }, 10000),
      }),
      Object.freeze({
        id: 'household_name',
        minAge: 27,
        icon: '🏆',
        name: text('Household Name', 'اسم مشهور'),
        description: text(
          'Reach 60 fame and 100,000 followers.',
          'صل إلى 60 نقطة شهرة و100,000 متابع.'
        ),
        requirement: Object.freeze({
          type: 'all',
          requirements: Object.freeze([
            Object.freeze({ type: 'fame', target: 60 }),
            Object.freeze({ type: 'followers', target: 100000 }),
          ]),
        }),
        reward: reward(350, { fame: 7, happiness: 6 }, 25000),
      }),
      Object.freeze({
        id: 'cultural_icon',
        minAge: 35,
        icon: '🌍',
        name: text('Cultural Icon', 'أيقونة ثقافية'),
        description: text(
          'Reach 90 fame and inspire an audience of 500,000 followers.',
          'صل إلى 90 نقطة شهرة وألهم 500,000 متابع.'
        ),
        requirement: Object.freeze({
          type: 'all',
          requirements: Object.freeze([
            Object.freeze({ type: 'fame', target: 90 }),
            Object.freeze({ type: 'followers', target: 500000 }),
          ]),
        }),
        reward: reward(600, { happiness: 10, karma: 5 }, 75000),
      }),
    ]),
  }),
  Object.freeze({
    id: 'public_service',
    icon: '⚖️',
    color: '#26a69a',
    name: text('Public Service', 'الخدمة العامة'),
    description: text(
      'Earn the public trust and lead with integrity from your community to the nation.',
      'اكسب ثقة الناس وقُد بنزاهة من مجتمعك إلى وطنك.'
    ),
    stages: Object.freeze([
      Object.freeze({
        id: 'community_spirit',
        minAge: 14,
        icon: '🫂',
        name: text('Community Spirit', 'روح المجتمع'),
        description: text(
          'Build a reputation for kindness with 65 karma.',
          'ابنِ سمعة طيبة بالوصول إلى 65 نقطة كارما.'
        ),
        requirement: Object.freeze({ type: 'karma', target: 65 }),
        reward: reward(100, { happiness: 3, karma: 3 }),
      }),
      Object.freeze({
        id: 'give_back',
        minAge: 18,
        icon: '🤲',
        name: text('Give Back', 'رد الجميل'),
        description: text(
          'Donate a total of $5,000 to causes you believe in.',
          'تبرع بمجموع 5,000 دولار لقضايا تؤمن بها.'
        ),
        requirement: Object.freeze({ type: 'charitable_giving', target: 5000 }),
        reward: reward(175, { karma: 5, happiness: 4 }),
      }),
      Object.freeze({
        id: 'win_a_mandate',
        minAge: 21,
        icon: '🗳️',
        name: text('Win a Mandate', 'افز بتفويض'),
        description: text(
          'Win elected office and begin serving the public.',
          'افز بمنصب منتخب وابدأ خدمة الناس.'
        ),
        requirement: Object.freeze({ type: 'political_career', target: 1 }),
        reward: reward(250, { fame: 5, karma: 3 }),
      }),
      Object.freeze({
        id: 'trusted_leader',
        minAge: 28,
        icon: '🏛️',
        name: text('Trusted Leader', 'قائد موثوق'),
        description: text(
          'Earn an approval rating of at least 65%.',
          'حقق نسبة تأييد لا تقل عن 65٪.'
        ),
        requirement: Object.freeze({ type: 'political_approval', target: 65 }),
        reward: reward(325, { fame: 8, happiness: 4 }),
      }),
      Object.freeze({
        id: 'national_leader',
        minAge: 35,
        icon: '🌐',
        name: text('National Leader', 'قائد وطني'),
        description: text('Become head of state.', 'أصبح رئيس الدولة.'),
        requirement: Object.freeze({ type: 'head_of_state', target: 1 }),
        reward: reward(650, { fame: 12, karma: 8, happiness: 8 }, 50000),
      }),
    ]),
  }),
  Object.freeze({
    id: 'criminal_mastermind',
    icon: '🎭',
    color: '#ef5350',
    name: text('Criminal Mastermind', 'العقل المدبّر'),
    description: text(
      'Choose a dangerous rise through the underworld and seize its highest rank.',
      'اختر صعوداً خطيراً في عالم الجريمة واستولِ على أعلى مراتبه.'
    ),
    stages: Object.freeze([
      Object.freeze({
        id: 'first_steps',
        minAge: 14,
        icon: '🧤',
        name: text('First Steps', 'الخطوات الأولى'),
        description: text('Commit three crimes.', 'ارتكب ثلاث جرائم.'),
        requirement: Object.freeze({ type: 'crimes', target: 3 }),
        reward: reward(100, { notoriety: 3 }),
      }),
      Object.freeze({
        id: 'known_operator',
        minAge: 18,
        icon: '🕶️',
        name: text('Known Operator', 'عنصر معروف'),
        description: text(
          'Commit ten crimes and reach 25 notoriety.',
          'ارتكب عشر جرائم وصل إلى 25 نقطة سمعة إجرامية.'
        ),
        requirement: Object.freeze({
          type: 'all',
          requirements: Object.freeze([
            Object.freeze({ type: 'crimes', target: 10 }),
            Object.freeze({ type: 'notoriety', target: 25 }),
          ]),
        }),
        reward: reward(175, { notoriety: 5, smarts: 2 }, 5000),
      }),
      Object.freeze({
        id: 'made_member',
        minAge: 21,
        icon: '🤝',
        name: text('Made Member', 'عضو معتمد'),
        description: text('Join a criminal family.', 'انضم إلى عائلة إجرامية.'),
        requirement: Object.freeze({ type: 'mafia_membership', target: 1 }),
        reward: reward(225, { notoriety: 5 }),
      }),
      Object.freeze({
        id: 'underworld_boss',
        minAge: 27,
        icon: '🦈',
        name: text('Underworld Boss', 'زعيم العالم السفلي'),
        description: text(
          'Reach Caporegime rank or 70 notoriety.',
          'اصل إلى رتبة كابو أو 70 نقطة سمعة إجرامية.'
        ),
        requirement: Object.freeze({
          type: 'any',
          requirements: Object.freeze([
            Object.freeze({ type: 'mafia_rank', targetRank: 'capo' }),
            Object.freeze({ type: 'notoriety', target: 70 }),
          ]),
        }),
        reward: reward(350, { notoriety: 8, fame: 3 }, 25000),
      }),
      Object.freeze({
        id: 'mastermind',
        minAge: 35,
        icon: '👑',
        name: text('Mastermind', 'العقل المدبّر'),
        description: text(
          'Become the Godfather, or reach 95 notoriety with a $1,000,000 net worth.',
          'أصبح الزعيم الأعلى، أو صل إلى 95 نقطة سمعة إجرامية مع ثروة صافية قدرها 1,000,000 دولار.'
        ),
        requirement: Object.freeze({
          type: 'any',
          requirements: Object.freeze([
            Object.freeze({ type: 'mafia_rank', targetRank: 'godfather' }),
            Object.freeze({
              type: 'all',
              requirements: Object.freeze([
                Object.freeze({ type: 'notoriety', target: 95 }),
                Object.freeze({ type: 'net_worth', target: 1000000 }),
              ]),
            }),
          ]),
        }),
        reward: reward(650, { notoriety: 5, fame: 8, happiness: 6 }, 100000),
      }),
    ]),
  }),
]);

export const LIFE_AMBITIONS = AMBITION_PATHS;

const STAT_LIMITED_FIELDS = new Set([
  'happiness',
  'health',
  'smarts',
  'looks',
  'karma',
  'fame',
  'stress',
  'notoriety',
  'energy',
]);

const FAMILY_TYPES = new Set([
  'Parent',
  'Sibling',
  'Child',
  'Partner',
  'Fiance',
  'Spouse',
  'Grandchild',
]);
const CREATIVE_JOB_TERMS = [
  'actor',
  'musician',
  'singer',
  'artist',
  'writer',
  'director',
  'influencer',
];
const MAFIA_RANK_ORDER = ['associate', 'soldier', 'capo', 'underboss', 'godfather'];

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function livingRelationships(person) {
  return Array.isArray(person?.relationships)
    ? person.relationships.filter(
        relationship => relationship && relationship.status !== 'Deceased'
      )
    : [];
}

function companyValue(company) {
  const equity = clamp(finiteNumber(company?.ownerEquity, 1), 0, 1);
  return Math.max(0, finiteNumber(company?.valuation)) * equity;
}

export function getAmbitionNetWorth(person) {
  if (!person) {
    return 0;
  }

  if (typeof person.getTotalEstateValue === 'function') {
    const estate = Number(person.getTotalEstateValue());
    if (Number.isFinite(estate)) {
      return estate;
    }
  }

  const assetValue = (person.assets || []).reduce((total, asset) => {
    const value = Math.max(0, finiteNumber(asset?.value ?? asset?.price));
    const mortgage = Math.max(0, finiteNumber(asset?.mortgage?.balance));
    return total + value - mortgage;
  }, 0);
  const portfolioValue = (person.portfolio || []).reduce(
    (total, holding) => total + Math.max(0, finiteNumber(holding?.currentValue ?? holding?.value)),
    0
  );
  const retirementValue = Object.values(person.retirementAccounts || {}).reduce(
    (total, account) => total + Math.max(0, finiteNumber(account?.balance ?? account)),
    0
  );
  const businessValue = (person.companies || []).reduce(
    (total, company) => total + companyValue(company),
    0
  );
  const debt =
    Math.max(0, finiteNumber(person.loans)) + Math.max(0, finiteNumber(person.personalDebt));

  return (
    finiteNumber(person.money) +
    assetValue +
    portfolioValue +
    retirementValue +
    businessValue -
    debt
  );
}

export function getAmbitionPath(pathId) {
  return AMBITION_PATHS.find(path => path.id === pathId) || null;
}

export function localizeAmbition(value, language = 'en') {
  if (typeof value === 'string') {
    return value;
  }
  if (!value || typeof value !== 'object') {
    return '';
  }
  return value[language === 'ar' ? 'ar' : 'en'] || value.en || value.ar || '';
}

export function createAmbitionState(pathId, age = 0, language = 'en') {
  const path = getAmbitionPath(pathId);
  if (!path) {
    return null;
  }

  return {
    version: 1,
    pathId: path.id,
    selectedAtAge: Math.max(0, Math.floor(finiteNumber(age))),
    language: language === 'ar' ? 'ar' : 'en',
    currentStageIndex: 0,
    completedStageIds: [],
    claimedRewardIds: [],
    points: 0,
    completed: false,
    completedAtAge: null,
    lastEvaluatedAge: null,
  };
}

/** Returns a clean, JSON-safe copy and discards forged/obsolete stage IDs. */
export function sanitizeAmbitionState(rawState) {
  if (!rawState || typeof rawState !== 'object') {
    return null;
  }
  const path = getAmbitionPath(rawState.pathId);
  if (!path) {
    return null;
  }

  const validStageIds = new Set(path.stages.map(stage => stage.id));
  const completedStageIds = [
    ...new Set(
      (Array.isArray(rawState.completedStageIds) ? rawState.completedStageIds : []).filter(id =>
        validStageIds.has(id)
      )
    ),
  ];
  const claimedRewardIds = [
    ...new Set(
      (Array.isArray(rawState.claimedRewardIds) ? rawState.claimedRewardIds : []).filter(id =>
        completedStageIds.includes(id)
      )
    ),
  ];
  const contiguousCompletedIds = [];
  for (const stage of path.stages) {
    if (!completedStageIds.includes(stage.id)) {
      break;
    }
    contiguousCompletedIds.push(stage.id);
  }
  const completed = contiguousCompletedIds.length === path.stages.length;
  const canonicalClaimedIds = claimedRewardIds.filter(id => contiguousCompletedIds.includes(id));
  const canonicalPoints = path.stages
    .filter(stage => canonicalClaimedIds.includes(stage.id))
    .reduce(
      (total, stage) => total + Math.max(0, Math.floor(finiteNumber(stage.reward?.points))),
      0
    );

  return {
    version: 1,
    pathId: path.id,
    selectedAtAge: Math.max(0, Math.floor(finiteNumber(rawState.selectedAtAge))),
    language: rawState.language === 'ar' ? 'ar' : 'en',
    currentStageIndex: contiguousCompletedIds.length,
    completedStageIds: contiguousCompletedIds,
    claimedRewardIds: canonicalClaimedIds,
    points: canonicalPoints,
    completed,
    completedAtAge:
      completed && Number.isFinite(Number(rawState.completedAtAge))
        ? Math.max(0, Math.floor(Number(rawState.completedAtAge)))
        : null,
    lastEvaluatedAge: Number.isFinite(Number(rawState.lastEvaluatedAge))
      ? Math.max(0, Math.floor(Number(rawState.lastEvaluatedAge)))
      : null,
  };
}

export function getAmbitionState(person) {
  return sanitizeAmbitionState(person?.lifeAmbition);
}

export function ensureAmbitionState(person) {
  if (!person || typeof person !== 'object') {
    return null;
  }
  const state = sanitizeAmbitionState(person.lifeAmbition);
  person.lifeAmbition = state;
  return state;
}

function requirementResult(value, target, unit = 'count') {
  const safeTarget = Math.max(1, finiteNumber(target, 1));
  const safeValue = Math.max(0, finiteNumber(value));
  return {
    met: safeValue >= safeTarget,
    value: safeValue,
    target: safeTarget,
    unit,
    ratio: clamp(safeValue / safeTarget, 0, 1),
  };
}

export function evaluateAmbitionRequirement(person, requirement) {
  if (!requirement || typeof requirement !== 'object') {
    return requirementResult(0, 1);
  }

  const relationships = livingRelationships(person);
  const companies = Array.isArray(person?.companies) ? person.companies : [];
  const target = Math.max(1, finiteNumber(requirement.target, 1));

  switch (requirement.type) {
    case 'all': {
      const results = (requirement.requirements || []).map(item =>
        evaluateAmbitionRequirement(person, item)
      );
      return requirementResult(
        results.filter(result => result.met).length,
        Math.max(1, results.length),
        'objectives'
      );
    }
    case 'any': {
      const results = (requirement.requirements || []).map(item =>
        evaluateAmbitionRequirement(person, item)
      );
      const best = results.reduce((maximum, result) => Math.max(maximum, result.ratio), 0);
      return {
        met: results.some(result => result.met),
        value: results.some(result => result.met) ? 1 : best,
        target: 1,
        unit: 'alternative',
        ratio: best,
      };
    }
    case 'stat':
      return requirementResult(person?.[requirement.stat], target, 'percent');
    case 'money':
      return requirementResult(person?.money, target, 'money');
    case 'net_worth':
      return requirementResult(getAmbitionNetWorth(person), target, 'money');
    case 'assets':
      return requirementResult(person?.assets?.length, target);
    case 'close_relationships':
      return requirementResult(
        relationships.filter(
          rel => finiteNumber(rel.stat) >= finiteNumber(requirement.threshold, 70)
        ).length,
        target
      );
    case 'close_family':
      return requirementResult(
        relationships.filter(
          rel =>
            FAMILY_TYPES.has(rel.type) &&
            finiteNumber(rel.stat) >= finiteNumber(requirement.threshold, 70)
        ).length,
        target
      );
    case 'relationship_types': {
      const types = new Set(requirement.types || []);
      return requirementResult(
        relationships.filter(
          rel =>
            types.has(rel.type) && finiteNumber(rel.stat) >= finiteNumber(requirement.threshold, 0)
        ).length,
        target
      );
    }
    case 'children':
      return requirementResult(relationships.filter(rel => rel.type === 'Child').length, target);
    case 'companies':
      return requirementResult(companies.length, target);
    case 'business_employees':
      return requirementResult(
        companies.reduce(
          (total, company) => total + Math.max(0, finiteNumber(company?.employees)),
          0
        ),
        target
      );
    case 'business_valuation':
      return requirementResult(
        companies.reduce(
          (total, company) => total + Math.max(0, finiteNumber(company?.valuation)),
          0
        ),
        target,
        'money'
      );
    case 'public_companies':
      return requirementResult(companies.filter(company => company?.isPublic).length, target);
    case 'creative_skill': {
      const instruments = Object.values(person?.skills?.instruments || {}).map(value =>
        finiteNumber(value)
      );
      const skills = [
        finiteNumber(person?.skills?.voice),
        finiteNumber(person?.skills?.instrument),
        finiteNumber(person?.skills?.cooking),
        finiteNumber(person?.skills?.coding),
        finiteNumber(person?.musicalTalent),
        ...instruments,
      ];
      return requirementResult(Math.max(0, ...skills), target, 'percent');
    }
    case 'creative_career': {
      const jobTitle = String(person?.job?.title || '').toLowerCase();
      const customRequirement = String(person?.job?.customReq || '').toLowerCase();
      const creative = CREATIVE_JOB_TERMS.some(
        term => jobTitle.includes(term) || customRequirement.includes(term)
      );
      return requirementResult(creative ? 1 : 0, target);
    }
    case 'followers':
      return requirementResult(person?.social?.totalFollowers, target);
    case 'fame':
      return requirementResult(person?.fame, target, 'percent');
    case 'karma':
      return requirementResult(person?.karma, target, 'percent');
    case 'charitable_giving':
      return requirementResult(person?.totalDonated, target, 'money');
    case 'political_career':
      return requirementResult(person?.job?.isPolitical ? 1 : 0, target);
    case 'political_approval':
      return requirementResult(
        person?.job?.approval ?? person?.politics?.approval,
        target,
        'percent'
      );
    case 'head_of_state':
      return requirementResult(person?.isHeadOfState ? 1 : 0, target);
    case 'crimes':
      return requirementResult(person?.lifeStats?.crimesCommitted, target);
    case 'notoriety':
      return requirementResult(person?.notoriety, target, 'percent');
    case 'mafia_membership':
      return requirementResult(person?.mafia?.family || person?.mafia?.rank ? 1 : 0, target);
    case 'mafia_standing':
      return requirementResult(person?.mafia?.standing, target, 'percent');
    case 'mafia_rank': {
      const currentRank = MAFIA_RANK_ORDER.indexOf(person?.mafia?.rank);
      const requiredRank = MAFIA_RANK_ORDER.indexOf(requirement.targetRank);
      const value = currentRank < 0 ? 0 : currentRank + 1;
      const rankTarget = requiredRank < 0 ? MAFIA_RANK_ORDER.length : requiredRank + 1;
      return requirementResult(value, rankTarget, 'rank');
    }
    default:
      return requirementResult(0, target);
  }
}

function applyReward(person, state, stage) {
  if (!stage?.reward || state.claimedRewardIds.includes(stage.id)) {
    return false;
  }

  for (const [field, amount] of Object.entries(stage.reward.stats || {})) {
    const nextValue = finiteNumber(person[field]) + finiteNumber(amount);
    person[field] = STAT_LIMITED_FIELDS.has(field) ? clamp(nextValue, 0, 100) : nextValue;
  }
  person.money = finiteNumber(person.money) + finiteNumber(stage.reward.money);
  state.points += Math.max(0, Math.floor(finiteNumber(stage.reward.points)));
  state.claimedRewardIds.push(stage.id);
  return true;
}

function resolveLanguageOption(options, state) {
  if (typeof options === 'string') {
    return options === 'ar' ? 'ar' : 'en';
  }
  if (options?.language === 'ar') {
    return 'ar';
  }
  return state?.language === 'ar' ? 'ar' : 'en';
}

export function selectAmbition(person, pathId, options = {}) {
  if (!person || typeof person !== 'object') {
    return { success: false, reason: 'invalid_person', state: null };
  }

  const path = getAmbitionPath(pathId);
  if (!path) {
    return { success: false, reason: 'unknown_path', state: getAmbitionState(person) };
  }

  const existing = getAmbitionState(person);
  if (existing) {
    return {
      success: existing.pathId === path.id,
      reason: existing.pathId === path.id ? 'already_selected' : 'path_locked',
      state: existing,
    };
  }

  const language = resolveLanguageOption(options);
  const state = createAmbitionState(path.id, person.age, language);
  person.lifeAmbition = state;

  if (typeof person.logEvent === 'function') {
    const pathName = localizeAmbition(path.name, language);
    const message =
      language === 'ar'
        ? `اخترت طموح «${pathName}» لهذه الحياة.`
        : `You chose the ${pathName} ambition for this life.`;
    person.logEvent(message, 'good', {
      messageKey: 'ambitions.event.selected',
      messageParams: { path: path.name.en, pathAr: path.name.ar },
    });
  }

  return { success: true, reason: 'selected', state };
}

/**
 * Completes every currently eligible stage in order. Calling this repeatedly is
 * idempotent: completed stages and their rewards can never be applied twice.
 */
export function evaluateAmbition(person, options = {}) {
  const state = ensureAmbitionState(person);
  if (!state) {
    return { success: false, reason: 'no_ambition', state: null, completedStages: [] };
  }

  const path = getAmbitionPath(state.pathId);
  const language = resolveLanguageOption(options, state);
  const age = Math.max(0, Math.floor(finiteNumber(person.age)));
  const completedStages = [];

  while (state.currentStageIndex < path.stages.length) {
    const stage = path.stages[state.currentStageIndex];
    if (age < stage.minAge) {
      break;
    }

    const progress = evaluateAmbitionRequirement(person, stage.requirement);
    if (!progress.met) {
      break;
    }

    if (!state.completedStageIds.includes(stage.id)) {
      state.completedStageIds.push(stage.id);
    }
    applyReward(person, state, stage);
    state.currentStageIndex += 1;
    completedStages.push(stage.id);

    if (typeof person.logEvent === 'function') {
      const stageName = localizeAmbition(stage.name, language);
      const message =
        language === 'ar'
          ? `اكتملت مرحلة الطموح: ${stageName}.`
          : `Ambition milestone completed: ${stageName}.`;
      person.logEvent(message, 'good', {
        messageKey: 'ambitions.event.milestone',
        messageParams: { stage: stage.name.en, stageAr: stage.name.ar },
      });
    }
  }

  state.completed = state.currentStageIndex >= path.stages.length;
  if (state.completed && state.completedAtAge === null) {
    state.completedAtAge = age;
  }
  state.lastEvaluatedAge = age;
  state.language = language;
  person.lifeAmbition = state;

  return {
    success: true,
    reason:
      completedStages.length > 0 ? 'progressed' : state.completed ? 'completed' : 'in_progress',
    state,
    completedStages,
    completedNow: completedStages.length > 0 && state.completed,
  };
}

export function formatAmbitionProgress(progress, language = 'en') {
  if (!progress) {
    return '';
  }
  const locale = language === 'ar' ? 'ar-MA' : 'en-US';
  const format = value => Math.floor(finiteNumber(value)).toLocaleString(locale);

  if (progress.unit === 'money') {
    return language === 'ar'
      ? `${format(progress.value)} / ${format(progress.target)} دولار`
      : `$${format(progress.value)} / $${format(progress.target)}`;
  }
  if (progress.unit === 'percent') {
    return `${format(progress.value)}% / ${format(progress.target)}%`;
  }
  if (progress.unit === 'objectives') {
    return language === 'ar'
      ? `${format(progress.value)} / ${format(progress.target)} أهداف`
      : `${format(progress.value)} / ${format(progress.target)} objectives`;
  }
  if (progress.unit === 'alternative') {
    return language === 'ar' ? 'أكمل أحد المسارين' : 'Complete either route';
  }
  return `${format(progress.value)} / ${format(progress.target)}`;
}

export function getAmbitionView(person, language = 'en') {
  const state = getAmbitionState(person);
  if (!state) {
    return {
      selected: false,
      paths: AMBITION_PATHS.map(path => ({
        id: path.id,
        icon: path.icon,
        color: path.color,
        name: localizeAmbition(path.name, language),
        description: localizeAmbition(path.description, language),
        stageCount: path.stages.length,
      })),
    };
  }

  const path = getAmbitionPath(state.pathId);
  const age = Math.max(0, Math.floor(finiteNumber(person?.age)));
  const stages = path.stages.map((stage, index) => {
    const completed = state.completedStageIds.includes(stage.id);
    const current = !state.completed && index === state.currentStageIndex;
    const ageLocked = !completed && age < stage.minAge;
    const progress = evaluateAmbitionRequirement(person, stage.requirement);
    return {
      id: stage.id,
      icon: stage.icon,
      name: localizeAmbition(stage.name, language),
      description: localizeAmbition(stage.description, language),
      minAge: stage.minAge,
      completed,
      current,
      ageLocked,
      progress,
      progressText: formatAmbitionProgress(progress, language),
      reward: { ...stage.reward, stats: { ...stage.reward.stats } },
    };
  });

  return {
    selected: true,
    path: {
      id: path.id,
      icon: path.icon,
      color: path.color,
      name: localizeAmbition(path.name, language),
      description: localizeAmbition(path.description, language),
    },
    state,
    stages,
    completedCount: state.completedStageIds.length,
    totalStages: path.stages.length,
    completionPercent: Math.round((state.completedStageIds.length / path.stages.length) * 100),
    currentStage: stages[state.currentStageIndex] || null,
  };
}
