export const FAMILY_TREE_STORAGE_KEY = 'bitlife_family_tree';

function cloneSerializable(value, fallback) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return fallback;
  }
}

export class FamilyTree {
  constructor() {
    this.generations = [];
    this.heirlooms = [];
    this.familyWealth = 0;
    this.familyName = '';
    this.foundedYear = 0;
    this.familyReputation = 0;
    this.generationCount = 0;
    this.totalAchievements = 0;
    this.load();
  }

  load() {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    try {
      const saved = localStorage.getItem(FAMILY_TREE_STORAGE_KEY);
      if (saved) {
        this.restoreState(JSON.parse(saved));
        return true;
      }
    } catch (error) {
      console.warn('Unable to load the family tree.', error);
    }
    return false;
  }

  getState() {
    return {
      generations: cloneSerializable(this.generations, []),
      heirlooms: cloneSerializable(this.heirlooms, []),
      familyWealth: this.familyWealth,
      familyName: this.familyName,
      foundedYear: this.foundedYear,
      familyReputation: this.familyReputation,
      generationCount: this.generationCount || this.generations.length,
      totalAchievements: this.totalAchievements,
    };
  }

  restoreState(data = {}) {
    const state = data && typeof data === 'object' ? data : {};
    this.generations = cloneSerializable(
      Array.isArray(state.generations) ? state.generations : [],
      []
    );
    this.heirlooms = cloneSerializable(Array.isArray(state.heirlooms) ? state.heirlooms : [], []);
    this.familyWealth = Number.isFinite(Number(state.familyWealth))
      ? Number(state.familyWealth)
      : 0;
    this.familyName = typeof state.familyName === 'string' ? state.familyName : '';
    this.foundedYear = Number.isFinite(Number(state.foundedYear)) ? Number(state.foundedYear) : 0;
    this.familyReputation = Number.isFinite(Number(state.familyReputation))
      ? Number(state.familyReputation)
      : 0;
    this.generationCount = Number.isFinite(Number(state.generationCount))
      ? Number(state.generationCount)
      : this.generations.length;
    this.totalAchievements = Number.isFinite(Number(state.totalAchievements))
      ? Number(state.totalAchievements)
      : 0;
    return this.getState();
  }

  save() {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    try {
      localStorage.setItem(FAMILY_TREE_STORAGE_KEY, JSON.stringify(this.getState()));
      return true;
    } catch (error) {
      console.warn('Unable to save the family tree.', error);
      return false;
    }
  }

  addGeneration(person) {
    const fullName =
      typeof person.getFullName === 'function'
        ? person.getFullName()
        : `${person.name?.first || person.firstName || 'Unknown'} ${person.name?.last || person.lastName || ''}`.trim();
    const lastName = person.name?.last || person.lastName || '';

    const achievementCount = person.achievements ? person.achievements.length : 0;
    const childrenList = person.relationships.filter(r => r.type === 'Child');

    const generation = {
      id: Date.now(),
      name: fullName,
      birthYear: new Date().getFullYear() - person.age,
      deathYear: new Date().getFullYear(),
      age: person.age,
      peakWealth: person.getTotalEstateValue(),
      peakFame: person.fame || 0,
      occupation: person.job ? person.job.title : 'Unemployed',
      children: childrenList.length,
      achievements: achievementCount,
      royalty: person.royalty ? person.royalty.title : null,
      fame: person.fame || 0,
      companies: person.companies ? person.companies.length : 0,
      happiness: person.happiness,
      health: person.health,
      smarts: person.smarts,
      looks: person.looks,
      traits: Array.isArray(person.traits) ? [...person.traits] : [],
      marriageCount: person.marriageCount || 0,
      lifeEvents: person.lifeLog ? person.lifeLog.slice(-5) : [],
      legacyScore: this.calculateLegacyScore(person),
    };

    this.generations.push(generation);
    this.familyWealth += generation.peakWealth;
    this.totalAchievements += achievementCount;
    this.generationCount = this.generations.length;

    this.familyReputation += this.calculateReputationGain(person);

    if (this.generations.length === 1) {
      this.familyName = lastName;
      this.foundedYear = generation.birthYear;
    }

    this.save();
    return generation;
  }

  calculateLegacyScore(person) {
    let score = 0;
    score += Math.min(100, (person.getTotalEstateValue() || 0) / 100000);
    score += (person.fame || 0) * 2;
    score += person.happiness || 50;
    score += (person.achievements ? person.achievements.length : 0) * 25;
    if (person.royalty) {
      score += 150;
    }
    if (person.companies && person.companies.length > 0) {
      score += person.companies.length * 50;
    }
    return Math.floor(score);
  }

  calculateReputationGain(person) {
    let gain = 0;
    gain += Math.floor(Math.min(50, (person.getTotalEstateValue() || 0) / 200000));
    gain += person.fame || 0;
    gain += (person.achievements ? person.achievements.length : 0) * 10;
    gain += Math.floor(((person.happiness || 50) - 50) / 5);
    if (person.royalty) {
      gain += 30;
    }
    return Math.max(0, gain);
  }

  getFamilyLegacyScore() {
    let score = 0;
    score += this.generations.length * 100;
    score += Math.floor(this.familyWealth / 500000);
    score += this.familyReputation;
    score += this.heirlooms.length * 50;
    this.generations.forEach(gen => {
      score += (gen.achievements || 0) * 25;
      if (gen.royalty) {
        score += 100;
      }
    });
    return Math.floor(score);
  }

  getGenerationBonus() {
    const count = this.generations.length;
    if (count === 0) {
      return { smarts: 0, looks: 0, health: 0, happiness: 0, fame: 0, money: 0 };
    }
    const bonus = Math.min(15, Math.floor(count * 2));
    const repBonus = Math.min(10, Math.floor(this.familyReputation / 100));
    return {
      smarts: Math.min(bonus, 8),
      looks: Math.min(bonus, 8),
      health: Math.min(bonus, 10),
      happiness: Math.min(repBonus + 5, 15),
      fame: Math.min(Math.floor(count * 3), 20),
      money: Math.min(count * 5000, 100000),
    };
  }

  getReputationRank() {
    const r = this.familyReputation;
    if (r >= 1000) {
      return { title: 'Legendary Dynasty', icon: '👑', min: 1000 };
    }
    if (r >= 500) {
      return { title: 'Noble House', icon: '🏰', min: 500 };
    }
    if (r >= 250) {
      return { title: 'Prominent Family', icon: '⭐', min: 250 };
    }
    if (r >= 100) {
      return { title: 'Established Name', icon: '🌳', min: 100 };
    }
    if (r >= 50) {
      return { title: 'Rising Lineage', icon: '🌱', min: 50 };
    }
    return { title: 'Humble Beginnings', icon: '📍', min: 0 };
  }

  getUnlockedMilestones() {
    const count = this.generations.length;
    const milestones = [];
    if (count >= 2) {
      milestones.push({
        id: 'gen2',
        name: 'Second Generation',
        desc: 'Your bloodline continues',
        icon: '👶',
      });
    }
    if (count >= 3) {
      milestones.push({
        id: 'gen3',
        name: 'Third Generation',
        desc: 'A family tradition emerges',
        icon: '🌳',
      });
    }
    if (count >= 5) {
      milestones.push({ id: 'gen5', name: 'Five Generations', desc: 'A true dynasty', icon: '🏛️' });
    }
    if (count >= 7) {
      milestones.push({
        id: 'gen7',
        name: 'Seven Generations',
        desc: 'Centuries in the making',
        icon: '👑',
      });
    }
    if (count >= 10) {
      milestones.push({
        id: 'gen10',
        name: 'Ten Generations',
        desc: 'Legendary bloodline',
        icon: '⭐',
      });
    }
    if (this.familyWealth >= 100000000) {
      milestones.push({
        id: 'wealth100m',
        name: 'Century of Wealth',
        desc: 'Family net worth exceeds $100M',
        icon: '💰',
      });
    }
    if (this.familyWealth >= 1000000000) {
      milestones.push({
        id: 'wealth1b',
        name: 'Billionaire Dynasty',
        desc: 'Family net worth exceeds $1B',
        icon: '💎',
      });
    }
    if (this.familyReputation >= 500) {
      milestones.push({
        id: 'rep500',
        name: 'Noble House',
        desc: 'Family reputation reaches 500',
        icon: '🏰',
      });
    }
    return milestones;
  }

  addHeirloom(heirloom) {
    if (!heirloom) {
      return;
    }
    this.heirlooms.push({
      ...heirloom,
      inheritedAt: Date.now(),
    });
    this.save();
  }

  getHeirlooms() {
    return [...this.heirlooms];
  }

  getGenerationCount() {
    return this.generations.length;
  }

  getTotalFamilyWealth() {
    return this.familyWealth;
  }

  getPatriarchMatriarch() {
    return this.generations[0];
  }

  getMostSuccessful() {
    if (this.generations.length === 0) {
      return null;
    }
    return this.generations.reduce((best, gen) =>
      (gen.peakWealth || 0) > (best.peakWealth || 0) ? gen : best
    );
  }

  getMostFamous() {
    if (this.generations.length === 0) {
      return null;
    }
    return this.generations.reduce((best, gen) =>
      (gen.peakFame || gen.fame || 0) > (best.peakFame || best.fame || 0) ? gen : best
    );
  }

  getGenerationsByDecade() {
    return [...this.generations].sort((a, b) => a.birthYear - b.birthYear);
  }

  reset({ persist = true } = {}) {
    this.restoreState();
    if (persist && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(FAMILY_TREE_STORAGE_KEY);
      } catch {
        /* storage may be unavailable */
      }
    }
  }
}

export const HEIRLOOM_TYPES = [
  {
    id: 'family_ring',
    name: 'Family Ring',
    description: 'A precious ring passed down through generations',
    value: 5000,
    effects: { looks: 5, happiness: 10 },
    rarity: 'common',
  },
  {
    id: 'grandfather_watch',
    name: "Grandfather's Watch",
    description: 'An antique timepiece with sentimental value',
    value: 10000,
    effects: { happiness: 15 },
    rarity: 'uncommon',
  },
  {
    id: 'family_bible',
    name: 'Family Bible',
    description: 'Records of your family history spanning centuries',
    value: 2000,
    effects: { happiness: 20, karma: 10 },
    rarity: 'common',
  },
  {
    id: 'royal_crown',
    name: 'Royal Crown',
    description: 'A crown from your royal ancestor',
    value: 500000,
    effects: { fame: 20, happiness: 30 },
    rarity: 'legendary',
    requiresRoyalty: true,
  },
  {
    id: 'war_medal',
    name: 'War Medal',
    description: 'Medal of Honor from a military ancestor',
    value: 50000,
    effects: { fame: 10, karma: 15 },
    rarity: 'rare',
    requiresMilitary: true,
  },
  {
    id: 'business_deed',
    name: 'Original Business Deed',
    description: "Founding documents of your family's first company",
    value: 100000,
    effects: { smarts: 10, happiness: 20 },
    rarity: 'rare',
    requiresBusiness: true,
  },
  {
    id: 'university_diploma',
    name: 'Ancestral Diploma',
    description: 'A framed degree from a prestigious ancestor',
    value: 15000,
    effects: { smarts: 8, happiness: 10 },
    rarity: 'uncommon',
    requiresEducation: true,
  },
  {
    id: 'sports_trophy',
    name: 'Golden Trophy',
    description: 'A championship trophy won by an athletic ancestor',
    value: 25000,
    effects: { health: 8, fame: 5 },
    rarity: 'rare',
    requiresAthletic: true,
  },
];

export function createHeirloom(person) {
  const eligible = HEIRLOOM_TYPES.filter(h => {
    if (h.requiresRoyalty && !person.royalty) {
      return false;
    }
    if (h.requiresMilitary && (!person.job || !person.job.isMilitary)) {
      return false;
    }
    if (h.requiresBusiness && (!person.companies || person.companies.length === 0)) {
      return false;
    }
    if (h.requiresEducation && (!person.education || person.education.length === 0)) {
      return false;
    }
    if (
      h.requiresAthletic &&
      (!person.skills?.sports || !person.skills.sports.some(s => s >= 50))
    ) {
      return false;
    }
    return true;
  });

  if (eligible.length === 0) {
    return null;
  }

  const netWorth = person.getTotalEstateValue();
  let heirloom;

  if (netWorth > 10000000 && Math.random() < 0.3) {
    const legendary = eligible.filter(h => h.rarity === 'legendary');
    if (legendary.length > 0) {
      heirloom = legendary[Math.floor(Math.random() * legendary.length)];
    }
  } else if (netWorth > 1000000 && Math.random() < 0.5) {
    const rare = eligible.filter(h => h.rarity === 'rare');
    if (rare.length > 0) {
      heirloom = rare[Math.floor(Math.random() * rare.length)];
    }
  }

  if (!heirloom) {
    const common = eligible.filter(h => h.rarity === 'common' || h.rarity === 'uncommon');
    heirloom = common[Math.floor(Math.random() * common.length)];
  }

  return {
    ...heirloom,
    inheritedFrom:
      typeof person.getFullName === 'function'
        ? person.getFullName()
        : `${person.name?.first || person.firstName || 'Unknown'} ${person.name?.last || person.lastName || ''}`.trim(),
    yearAcquired: new Date().getFullYear(),
  };
}

export const familyTree = new FamilyTree();
