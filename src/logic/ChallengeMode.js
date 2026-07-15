// Challenge Mode System - Preset scenarios with specific goals

export const CHALLENGES = [
  {
    id: 'rags_to_riches',
    name: 'Rags to Riches',
    description: 'Start with nothing, become a millionaire by age 50',
    difficulty: 'Medium',
    icon: '💰',
    startConditions: {
      money: 0,
      smarts: 30,
      looks: 30,
      health: 50,
    },
    winConditions: {
      type: 'money',
      target: 1000000,
      beforeAge: 50,
    },
    restrictions: {
      noInheritance: true,
      noLottery: true,
    },
  },
  {
    id: 'royal_redemption',
    name: 'Royal Redemption',
    description: 'Born royal, abdicate, then become famous through merit',
    difficulty: 'Hard',
    icon: '👑',
    startConditions: {
      forceRoyal: true,
      money: 1000000,
    },
    winConditions: {
      type: 'fame',
      target: 90,
      afterAbdication: true,
      beforeAge: 60,
    },
  },
  {
    id: 'military_legend',
    name: 'Military Legend',
    description: 'Rise to General and survive deployment',
    difficulty: 'Hard',
    icon: '🎖️',
    startConditions: {
      smarts: 70,
      health: 90,
    },
    winConditions: {
      type: 'military_rank',
      targetRank: 'General',
      surviveDeployment: true,
      beforeAge: 65,
    },
  },
  {
    id: 'family_dynasty',
    name: 'Family Dynasty',
    description: 'Have 10+ children and $5M by age 70',
    difficulty: 'Medium',
    icon: '👨‍👩‍👧‍👦',
    startConditions: {},
    winConditions: {
      type: 'combined',
      requirements: [
        { type: 'children', target: 10 },
        { type: 'money', target: 5000000 },
      ],
      beforeAge: 70,
    },
  },
  {
    id: 'criminal_mastermind',
    name: 'Criminal Mastermind',
    description: 'Become Godfather without getting caught',
    difficulty: 'Very Hard',
    icon: '🤵',
    startConditions: {
      smarts: 60,
    },
    winConditions: {
      type: 'mafia',
      targetRank: 'Godfather',
      noJailTime: true,
      beforeAge: 60,
    },
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Live to 100 with all stats above 50',
    difficulty: 'Very Hard',
    icon: '🎂',
    startConditions: {},
    winConditions: {
      type: 'longevity',
      targetAge: 100,
      minStats: {
        health: 50,
        happiness: 50,
        smarts: 50,
        looks: 50,
      },
    },
  },
  {
    id: 'business_tycoon',
    name: 'Business Tycoon',
    description: 'Own 3 companies and go public with one',
    difficulty: 'Hard',
    icon: '🏢',
    startConditions: {
      money: 100000,
      smarts: 70,
    },
    winConditions: {
      type: 'business',
      ownCompanies: 3,
      hasPublicCompany: true,
      beforeAge: 65,
    },
  },
  {
    id: 'global_explorer',
    name: 'Global Explorer',
    description: 'Visit 15 countries and learn 5 languages by age 60',
    difficulty: 'Medium',
    icon: '🌍',
    startConditions: {
      smarts: 50,
    },
    winConditions: {
      type: 'combined',
      requirements: [
        { type: 'countries_visited', target: 15 },
        { type: 'languages_known', target: 5 },
      ],
      beforeAge: 60,
    },
  },
  {
    id: 'philanthropist',
    name: 'Philanthropist',
    description: 'Donate $5M to charity and establish 3 foundations by age 65',
    difficulty: 'Hard',
    icon: '❤️',
    startConditions: {
      money: 100000,
      karma: 70,
    },
    winConditions: {
      type: 'combined',
      requirements: [
        { type: 'donated_money', target: 5000000 },
        { type: 'foundations', target: 3 },
      ],
      beforeAge: 65,
    },
  },
  {
    id: 'sports_legend',
    name: 'Sports Legend',
    description: 'Win 3 championships and be MVP 5 times by age 40',
    difficulty: 'Hard',
    icon: '🏆',
    startConditions: {
      health: 80,
      smarts: 50,
    },
    winConditions: {
      type: 'combined',
      requirements: [
        { type: 'championships', target: 3 },
        { type: 'mvp_awards', target: 5 },
      ],
      beforeAge: 40,
    },
  },
  {
    id: 'political_dynasty',
    name: 'Political Dynasty',
    description: 'Become Head of State and have child become Head of State',
    difficulty: 'Extreme',
    icon: '🏛️',
    available: false,
    startConditions: {
      smarts: 80,
      looks: 60,
    },
    winConditions: {
      type: 'combined',
      requirements: [
        { type: 'head_of_state', value: true },
        { type: 'child_head_of_state', value: true },
      ],
      beforeAge: 80,
    },
  },
  {
    id: 'scientist_extraordinaire',
    name: 'Scientist Extraordinaire',
    description: 'Win a Nobel Prize, patent 3 inventions, and earn a graduate degree by age 50',
    difficulty: 'Extreme',
    icon: '🔬',
    startConditions: {
      smarts: 90,
    },
    winConditions: {
      type: 'combined',
      requirements: [
        { type: 'nobel_prize', value: true },
        { type: 'patents', target: 3 },
        { type: 'degree', level: 'PhD' },
      ],
      beforeAge: 50,
    },
  },
];

export class ChallengeTracker {
  constructor(challenge) {
    this.challenge = challenge;
    this.startAge = 0;
    this.progress = {};
    this.completed = false;
    this.failed = false;
    this.failureReason = null;
  }

  checkWinCondition(person) {
    const { winConditions } = this.challenge;

    // Age limit check
    if (winConditions.beforeAge && person.age > winConditions.beforeAge) {
      this.failed = true;
      this.failureReason = `Failed to complete before age ${winConditions.beforeAge}`;
      return false;
    }

    let conditionMet = false;

    switch (winConditions.type) {
      case 'money':
        conditionMet = person.getTotalEstateValue() >= winConditions.target;
        break;

      case 'fame':
        if (winConditions.afterAbdication && person.royalty) {
          return false; // Must abdicate first
        }
        conditionMet = person.fame >= winConditions.target;
        break;

      case 'military_rank':
        if (person.job && person.job.isMilitary) {
          conditionMet = person.job.title === winConditions.targetRank;
        }
        break;

      case 'mafia':
        if (person.mafia && person.mafia.rank) {
          const isBoss = person.mafia.rank === 'boss';
          const noJail = winConditions.noJailTime
            ? person.prisonSentence === 0 && !person.isInPrison
            : true;
          conditionMet = isBoss && noJail;
        }
        break;

      case 'longevity':
        const statsOk = Object.keys(winConditions.minStats).every(
          stat => person[stat] >= winConditions.minStats[stat]
        );
        conditionMet = person.age >= winConditions.targetAge && statsOk;
        break;

      case 'business':
        const hasEnough = person.companies.length >= winConditions.ownCompanies;
        const hasPublic = person.companies.some(c => c.isPublic);
        conditionMet = hasEnough && (winConditions.hasPublicCompany ? hasPublic : true);
        break;

      case 'combined':
        conditionMet = winConditions.requirements.every(req => {
          switch (req.type) {
            case 'money':
              return person.getTotalEstateValue() >= req.target;
            case 'children':
              return person.relationships.filter(r => r.type === 'Child').length >= req.target;
            case 'married':
              return person.relationships.some(r => r.type === 'Spouse');
            case 'stats':
              return Object.keys(req.minStats).every(stat => person[stat] >= req.minStats[stat]);
            case 'degree':
              return req.level === 'PhD'
                ? hasGradDegree(person)
                : (person.degrees || []).some(d => d.name === req.level || d.type === req.level);
            case 'countries_visited':
              return (person.countriesVisited || []).length >= req.target;
            case 'languages_known':
              return (person.languages || []).length >= req.target;
            case 'donated_money':
              return (person.totalDonated || 0) >= req.target;
            case 'foundations':
              return (person.foundations || []).length >= req.target;
            case 'championships':
              return (person.sportsChampionships || 0) >= req.target;
            case 'mvp_awards':
              return (person.mvpAwards || 0) >= req.target;
            case 'head_of_state':
              return person.isHeadOfState === (req.value !== false);
            case 'child_head_of_state':
              return person.relationships.some(
                r => r.type === 'Child' && r.isHeadOfState === (req.value !== false)
              );
            case 'nobel_prize':
              return person.hasNobelPrize === (req.value !== false);
            case 'patents':
              return (person.patents || []).length >= req.target;
            default:
              return false;
          }
        });
        break;
    }

    if (conditionMet) {
      this.completed = true;
      this.completionAge = person.age;
    }

    return conditionMet;
  }

  getProgressString(person) {
    const { winConditions } = this.challenge;

    switch (winConditions.type) {
      case 'money':
        const netWorth = person.getTotalEstateValue();
        return `$${netWorth.toLocaleString()} / $${winConditions.target.toLocaleString()}`;

      case 'fame':
        return `${person.fame} / ${winConditions.target} fame`;

      case 'combined':
        const met = winConditions.requirements.filter(req => requirementMet(person, req)).length;
        return `${met} / ${winConditions.requirements.length} requirements`;

      default:
        return 'In Progress';
    }
  }
}

export function getChallengeById(id) {
  return CHALLENGES.find(c => c.id === id);
}

export function isChallengeActionAllowed(person, action) {
  const active = person?.activeChallenge;
  if (!active || active.completed || active.failed) {
    return true;
  }
  const restrictions = getChallengeById(active.id)?.restrictions || {};
  if (action === 'lottery' && restrictions.noLottery) {
    return false;
  }
  if (action === 'inheritance' && restrictions.noInheritance) {
    return false;
  }
  return true;
}

export function applyChallengeStart(person, challenge) {
  if (!challenge) {
    return;
  }

  const start = challenge.startConditions || {};
  if (start.money !== undefined) {
    person.money = start.money;
  }
  if (start.smarts !== undefined) {
    person.smarts = start.smarts;
  }
  if (start.looks !== undefined) {
    person.looks = start.looks;
  }
  if (start.health !== undefined) {
    person.health = start.health;
  }

  if (start.forceRoyal) {
    person.country = 'United Kingdom';
    person.royalty = {
      title: person.gender === 'Female' ? 'Princess' : 'Prince',
      respect: 100,
      isReigning: false,
      rank: 'prince',
    };
    person.fame = Math.max(person.fame || 0, 50);
    person.logEvent(`Challenge start: You were born into royalty for ${challenge.name}.`, 'good');
  }

  person.activeChallenge = {
    id: challenge.id,
    startedAt: person.age,
    completed: false,
    failed: false,
    message: '',
  };
  person.logEvent(`Challenge started: ${challenge.name}.`, 'neutral');
}

function hasGradDegree(person) {
  return (person.educationHistory || []).some(entry =>
    ['Medical School', 'Law School', 'Business School', 'Graduate School'].some(name =>
      entry.includes(name)
    )
  );
}

function requirementMet(person, requirement) {
  switch (requirement.type) {
    case 'money':
      return person.getTotalEstateValue() >= requirement.target;
    case 'children':
      return person.relationships.filter(r => r.type === 'Child').length >= requirement.target;
    case 'married':
      return person.relationships.some(r => r.type === 'Spouse') === requirement.value;
    case 'stats':
      return Object.keys(requirement.minStats).every(
        stat => person[stat] >= requirement.minStats[stat]
      );
    case 'degree':
      return requirement.level === 'PhD'
        ? hasGradDegree(person)
        : (person.degrees || []).some(
            d => d.name === requirement.level || d.type === requirement.level
          );
    case 'countries_visited':
      return (person.countriesVisited || []).length >= requirement.target;
    case 'languages_known':
      return (person.languages || []).length >= requirement.target;
    case 'donated_money':
      return (person.totalDonated || 0) >= requirement.target;
    case 'foundations':
      return (person.foundations || []).length >= requirement.target;
    case 'championships':
      return (person.sportsChampionships || 0) >= requirement.target;
    case 'mvp_awards':
      return (person.mvpAwards || 0) >= requirement.target;
    case 'head_of_state':
      return person.isHeadOfState === (requirement.value !== false);
    case 'child_head_of_state':
      return person.relationships.some(
        r => r.type === 'Child' && r.isHeadOfState === (requirement.value !== false)
      );
    case 'nobel_prize':
      return person.hasNobelPrize === (requirement.value !== false);
    case 'patents':
      return (person.patents || []).length >= requirement.target;
    default:
      return false;
  }
}

export function getChallengeProgress(person) {
  const challenge = getChallengeById(person.activeChallenge?.id);
  if (!challenge) {
    return null;
  }

  const win = challenge.winConditions;
  switch (win.type) {
    case 'money':
      return `$${person.getTotalEstateValue().toLocaleString()} / $${win.target.toLocaleString()}`;
    case 'fame':
      return `${person.fame || 0} / ${win.target} fame`;
    case 'military_rank':
      return person.job?.isMilitary ? person.job.title : 'Not enlisted';
    case 'mafia':
      return person.mafia?.rank ? `${person.mafia.rank} rank` : 'Not in mafia';
    case 'longevity':
      return `Age ${person.age} / ${win.targetAge}`;
    case 'business': {
      const companyCount = person.companies?.length || 0;
      const publicCount = (person.companies || []).filter(c => c.isPublic).length;
      return `${companyCount}/${win.ownCompanies} companies, ${publicCount} public`;
    }
    case 'combined': {
      const met = win.requirements.filter(req => requirementMet(person, req)).length;
      return `${met} / ${win.requirements.length} requirements`;
    }
    default:
      return 'In progress';
  }
}

export function evaluateChallenge(person) {
  const challenge = getChallengeById(person.activeChallenge?.id);
  if (!challenge || person.activeChallenge.completed || person.activeChallenge.failed) {
    return null;
  }

  const win = challenge.winConditions;
  let completed = false;

  if (win.beforeAge && person.age > win.beforeAge) {
    person.activeChallenge.failed = true;
    person.activeChallenge.message = `Failed to complete ${challenge.name} before age ${win.beforeAge}.`;
    person.logEvent(person.activeChallenge.message, 'bad');
    return person.activeChallenge;
  }

  switch (win.type) {
    case 'money':
      completed = person.getTotalEstateValue() >= win.target;
      break;
    case 'fame':
      completed = (!win.afterAbdication || !person.royalty) && person.fame >= win.target;
      break;
    case 'military_rank':
      completed = Boolean(person.job?.isMilitary && person.job.title.includes(win.targetRank));
      if (completed && win.surviveDeployment) {
        completed = (person.lifeStats?.deploymentsSurvived || 0) > 0;
      }
      break;
    case 'mafia':
      completed = person.mafia?.rank === 'godfather';
      if (completed && win.noJailTime) {
        completed = (person.lifeStats?.jailYears || 0) === 0 && !person.isInPrison;
      }
      break;
    case 'longevity':
      completed =
        person.age >= win.targetAge &&
        Object.keys(win.minStats).every(stat => person[stat] >= win.minStats[stat]);
      break;
    case 'business':
      completed = (person.companies?.length || 0) >= win.ownCompanies;
      if (completed && win.hasPublicCompany) {
        completed = person.companies.some(c => c.isPublic);
      }
      break;
    case 'combined':
      completed = win.requirements.every(req => requirementMet(person, req));
      break;
  }

  if (completed) {
    person.activeChallenge.completed = true;
    person.activeChallenge.message = `Challenge completed: ${challenge.name}!`;
    if (!person.completedChallenges.includes(challenge.id)) {
      person.completedChallenges.push(challenge.id);
    }
    person.logEvent(person.activeChallenge.message, 'good');
  }

  return person.activeChallenge;
}
