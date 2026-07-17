import { GameEngine } from './GameEngine';
import { handlePost, handleMonetization } from './SocialMedia';
import { performMafiaCrime, MAFIA_RANKS } from './MafiaLogic';
import { checkPrereq, meetsEducationRequirement } from './EducationLogic';
import { getRank } from './MilitaryLogic';
import { Company } from './BusinessLogic';
import { ImmigrationManager } from './ImmigrationSystem';
import { useSubstance as consumeSubstance, enterRehab } from './Addiction';
import { contributeToRetirement, withdrawFromRetirement, retire } from './Retirement';
import { exercise, changeDiet } from './Fitness';
import { buyInsurance, fileInsuranceClaim, cancelInsurance } from './Insurance';
import { renovateProperty, flipProperty } from './Renovation';
import { joinSpaceProgram, startTraining, beginSpaceMission, goOnMission } from './SpaceCareer';
import { donateToCharity, startFoundation, fundLegacyProject } from './Philanthropy';
import { joinClub, leaveClub } from './Clubs';
import { tryoutForSport, practiceSport, goProfessional } from './CollegeSports';
import { fileLawsuit, sueRandomPerson } from './Lawsuits';
import { writeTimeCapsule, readTimeCapsule } from './TimeCapsule';
import { getDefaultCityForCountry, CITIES } from './City';
import { familyTree } from './DynastyMode';
import { resolveActivity, getActivityWithDefaults } from './ActivityEngine';
import { generateBandMembers } from './Band';

const MAX_RELATIONSHIP_MEMORIES = 8;
const IMPORTANT_RELATIONSHIP_TYPES = new Set([
  'Father',
  'Mother',
  'Parent',
  'King',
  'Queen',
  'Child',
  'Sibling',
  'Friend',
  'Best Friend',
  'Partner',
  'Fiance',
  'Spouse',
]);

const RELATIONSHIP_PERSONALITIES = {
  loyal: { need: 'honesty', likes: ['make_promise', 'talk_it_out'], dislikes: ['cheat'] },
  affectionate: {
    need: 'affection',
    likes: ['compliment', 'spend_time'],
    dislikes: ['give_space'],
  },
  ambitious: {
    need: 'encouragement',
    likes: ['compliment', 'make_promise'],
    dislikes: ['give_space'],
  },
  independent: {
    need: 'autonomy',
    likes: ['give_space', 'talk_it_out'],
    dislikes: ['make_promise'],
  },
  sensitive: { need: 'reassurance', likes: ['apologize', 'compliment'], dislikes: ['insult'] },
  playful: { need: 'fun', likes: ['spend_time', 'compliment'], dislikes: ['give_space'] },
  practical: { need: 'stability', likes: ['talk_it_out', 'make_promise'], dislikes: ['cheat'] },
  adventurous: {
    need: 'shared_experiences',
    likes: ['spend_time', 'make_promise'],
    dislikes: ['give_space'],
  },
};

const PERSONALITY_IDS = Object.keys(RELATIONSHIP_PERSONALITIES);

function stableRelationshipHash(value) {
  let hash = 2166136261;
  const text = String(value ?? 'relationship');
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export class Person {
  constructor(firstName = 'John', lastName = 'Doe', gender = 'Male', country = 'United States') {
    this.name = { first: firstName, last: lastName };
    this.gender = gender;
    this.country = country;
    this.city = this.getDefaultCity(country);
    this.birthCity = this.city;
    this.birthCountry = country;
    this.yearsInCurrentCity = 0;
    this.age = 0;
    this.money = 0;

    // Core Stats (0-100)
    this.happiness = this.randomStat(80, 100); // Babies are usually happy
    this.health = this.randomStat(90, 100);
    this.conditions = [];
    this.smarts = this.randomStat(20, 80);
    this.looks = this.randomStat(20, 80);
    this.stress = 0; // 0-100
    this.karma = 50; // 0-100
    this.fame = 0; // 0-100
    this.energy = 100; // 0-100, refills on ageUp

    this.skills = {
      // Music
      voice: 0,
      instruments: {},

      // Hobbies/Skills
      martialArts: 0,
      cooking: 0,
      coding: 0,
      instrument: 0, // General instrument skill if used by Hobbies menu
    };

    this.traits = this.generateBirthTraits();
    this.musicalTalent = Math.floor(Math.random() * 100);
    this.athleticism = Math.floor(Math.random() * 100);

    this.careerData = null; // { totalSkillPointsEarned, availableSkillPoints, nodes: { id: level } }

    this.pets = [];

    this.isAlive = true;
    this.job = null; // { title, salary, performance }
    this.education = 'None';
    this.cabinet = {};
    this.policies = { taxRate: 30, militarySpending: 30, diplomacyBudget: 30, socialSpending: 30 };
    this.diplomaticHistory = [];
    this.pendingGeopoliticalEvent = null;

    this.pendingEvent = null; // For interactive events

    // Band
    this.band = null;

    // Assets
    this.assets = []; // Array of owned asset objects
    this.portfolio = []; // Array of investments { id, name, type, shares, purchasePrice, currentValue }

    // Simple Market Investments (for new system)
    this.investments = {
      indexFund: 0, // Number of shares owned
      dogecoin: 0, // Number of coins owned
    };

    // Relationships
    this.relationships = []; // [{ id, name, type, stat }]
    this.lastIntimacyAge = -1;

    // Royalty
    this.royalty = null; // { title: 'Prince', respect: 100, isReigning: false }

    // Education
    this.educationHistory = []; // [ "High School", "University (Science)" ]
    this.currentSchool = null; // { ...school, year: 1 }

    // Social Media
    this.social = {
      platforms: {}, // { 'insta': { followers: 0, posts: 0 } }
      totalFollowers: 0,
      isInfluencer: false,
    };
    this.energy = 100;

    // Detailed Education
    this.loans = 0; // Student debt
    this.personalDebt = 0; // Unsecured debt from living-cost shortfalls and overdrafts
    this.bankruptcies = 0;
    this.lastBankruptcyAge = -1000;
    this.degrees = []; // [{ type: 'CS', name: 'Computer Science' }]

    // Crime
    this.isInPrison = false;
    this.prisonSentence = 0;
    this.notoriety = 0; // 0-100
    this.mafia = {
      family: null, // family object
      rank: null, // rank id
      standing: 0, // 0-100 reputation within family
    };

    // Prison Stats
    this.prisonStats = {
      respect: 0,
      gang: null,
    };

    // Will & Estate
    this.will = null; // { primaryBeneficiary: relationshipId, allocations: { relationshipId: percentage }, createdAt: age }

    // Business & Companies
    this.companies = []; // Array of Company objects owned

    // Immigration
    this.citizenships = [country];
    this.yearsInCurrentCountry = 0;
    this.visaApplications = 0;
    this.visaRejections = 0;

    // Meta progression
    this.activeChallenge = null;
    this.completedChallenges = [];
    this.recordedLife = false;
    this.lifeStats = {
      crimesCommitted: 0,
      jailYears: 0,
      companiesStarted: 0,
      deploymentsSurvived: 0,
      totalMoneyEarned: 0,
      totalTaxes: 0,
      totalLivingExpenses: 0,
      totalDebtPayments: 0,
      totalDebtDischarged: 0,
      totalDiscretionarySpending: 0,
      totalRetirementIncome: 0,
    };

    // Life History
    this.history = [];

    // Stat history for charts (recorded at each age)
    this.statHistory = [];

    // Addiction
    this.addictions = {};
    this.addictionLevels = {};
    this.inTreatment = false;

    // Retirement
    this.retirementAccounts = {};
    this.isRetired = false;

    // Fitness
    this.fitness = { weight: 150, diet: 'standard', exerciseDays: 0, muscleMass: 30, bodyFat: 20 };

    // Insurance
    this.insurance = {};

    // Space Program
    this.spaceProgram = null;

    // Philanthropy
    this.foundations = [];
    this.legacyProjects = [];

    // Clubs
    this.clubs = [];

    // College Sports
    this.collegeSport = null;

    // Lawsuits
    this.activeLawsuits = [];
    this.lawsuitHistory = [];

    // Time Capsules & Memories
    this.timeCapsules = [];
    this.memories = [];

    // Family heirlooms passed down generations
    this.heirlooms = [];

    // Seasonal events tracking
    this.lastSeason = null;
    this.seasonalEventsThisYear = [];

    // World news feed (NPC events accumulated each year)
    this.worldNews = [];

    // Challenge requirement tracking
    this.totalDonated = 0;
    this.countriesVisited = [country];
    this.languages = ['English'];
    this.sportsChampionships = 0;
    this.mvpAwards = 0;
    this.isHeadOfState = false;
    this.hasNobelPrize = false;
    this.patents = [];
    this.avatar = null;
  }

  /**
   * Gets the default city name for a given country
   * @param {string} country - The country name
   * @returns {string} The default city name or 'Unknown' if not found
   */
  getDefaultCity(country) {
    const city = getDefaultCityForCountry(country);
    return city ? city.name : 'Unknown';
  }

  /**
   * Generates a random stat value within the specified range
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {number} Random stat value between min and max
   */
  randomStat(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Clamps a value between min and max bounds
   * @param {number} value - The value to clamp
   * @param {number} min - Minimum bound (default: 0)
   * @param {number} max - Maximum bound (default: 100)
   * @returns {number} Clamped value between min and max
   */
  clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(value, max));
  }

  /**
   * Gets the person's full name
   * @returns {string} Full name in format "First Last"
   */
  getFullName() {
    return `${this.name.first} ${this.name.last}`;
  }

  generateBirthTraits() {
    const traits = [];
    if (this.smarts >= 72 && Math.random() < 0.35) {
      traits.push('Genius');
    }
    if (this.health >= 92 && Math.random() < 0.25) {
      traits.push('Athletic');
    }
    if (this.looks >= 72 && Math.random() < 0.25) {
      traits.push('Charismatic');
    }
    if (Math.random() < 0.18) {
      traits.push('Musical');
    }
    if (Math.random() < 0.12) {
      traits.push('Reckless');
    }
    if (Math.random() < 0.1) {
      traits.push('Resilient');
    }
    return traits;
  }

  hasTrait(trait) {
    return Array.isArray(this.traits) && this.traits.includes(trait);
  }

  isImportantRelationship(relationship) {
    const type = String(relationship?.type || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return IMPORTANT_RELATIONSHIP_TYPES.has(type);
  }

  deriveRelationshipPersonalities(relationship) {
    const seed = [
      this.getFullName(),
      this.country,
      relationship?.id,
      relationship?.name,
      relationship?.type,
    ].join('|');
    const count = 2 + (stableRelationshipHash(seed) % 2);
    return PERSONALITY_IDS.map(id => ({ id, score: stableRelationshipHash(`${seed}|${id}`) }))
      .sort((left, right) => left.score - right.score || left.id.localeCompare(right.id))
      .slice(0, count)
      .map(entry => entry.id);
  }

  ensureRelationshipDepth(relationship) {
    if (
      !relationship ||
      typeof relationship !== 'object' ||
      !this.isImportantRelationship(relationship)
    ) {
      return relationship;
    }

    const generated = this.deriveRelationshipPersonalities(relationship);
    const existing = Array.isArray(relationship.personalityTraits)
      ? relationship.personalityTraits
          .filter(
            (trait, index, list) => PERSONALITY_IDS.includes(trait) && list.indexOf(trait) === index
          )
          .slice(0, 3)
      : [];
    generated.forEach(trait => {
      if (existing.length < 2 && !existing.includes(trait)) {
        existing.push(trait);
      }
    });
    relationship.personalityTraits = existing.length >= 2 ? existing : generated;

    const profiles = relationship.personalityTraits
      .map(trait => RELATIONSHIP_PERSONALITIES[trait])
      .filter(Boolean);
    relationship.needs = [...new Set(profiles.map(profile => profile.need))].slice(0, 3);
    relationship.preferences = {
      likes: [...new Set(profiles.flatMap(profile => profile.likes))].slice(0, 3),
      dislikes: [...new Set(profiles.flatMap(profile => profile.dislikes))].slice(0, 3),
    };

    relationship.memories = (Array.isArray(relationship.memories) ? relationship.memories : [])
      .filter(memory => memory && typeof memory.type === 'string')
      .map((memory, index) => ({
        id: String(memory.id || `${relationship.id}_legacy_memory_${index}`),
        type: memory.type,
        age: Math.max(0, Math.floor(Number(memory.age) || 0)),
        impact: this.clamp(Number(memory.impact) || 0, -100, 100),
        details: memory.details && typeof memory.details === 'object' ? { ...memory.details } : {},
      }))
      .slice(-MAX_RELATIONSHIP_MEMORIES);
    relationship.memorySequence = Math.max(
      relationship.memories.length,
      Math.floor(Number(relationship.memorySequence) || 0)
    );

    if (!relationship.activeConflict || typeof relationship.activeConflict !== 'object') {
      relationship.activeConflict = null;
    } else {
      relationship.activeConflict = {
        id: String(
          relationship.activeConflict.id ||
            `${relationship.id}_conflict_${relationship.memorySequence}`
        ),
        type: String(relationship.activeConflict.type || 'misunderstanding'),
        stage: ['tension', 'resentment'].includes(relationship.activeConflict.stage)
          ? relationship.activeConflict.stage
          : 'tension',
        startedAtAge: Math.max(
          0,
          Math.floor(Number(relationship.activeConflict.startedAtAge) || this.age)
        ),
        lastAdvancedAge: Math.max(
          0,
          Math.floor(Number(relationship.activeConflict.lastAdvancedAge) || this.age)
        ),
      };
    }

    if (!relationship.promise || typeof relationship.promise !== 'object') {
      relationship.promise = null;
    } else {
      relationship.promise = {
        type: 'quality_time',
        madeAtAge: Math.max(0, Math.floor(Number(relationship.promise.madeAtAge) || this.age)),
        dueAge: Math.max(0, Math.floor(Number(relationship.promise.dueAge) || this.age + 1)),
        status: ['active', 'kept', 'broken'].includes(relationship.promise.status)
          ? relationship.promise.status
          : 'active',
      };
    }

    if (
      !relationship.financialArrangement ||
      !['joint', 'separate'].includes(relationship.financialArrangement.style)
    ) {
      relationship.financialArrangement = null;
    } else {
      relationship.financialArrangement = {
        style: relationship.financialArrangement.style,
        decidedAtAge: Math.max(
          0,
          Math.floor(Number(relationship.financialArrangement.decidedAtAge) || this.age)
        ),
      };
    }
    const lastParentingDecisionAge = Number(relationship.lastParentingDecisionAge);
    relationship.lastParentingDecisionAge = Number.isFinite(lastParentingDecisionAge)
      ? Math.floor(lastParentingDecisionAge)
      : -1;

    const lastStoryAge = Number(relationship.lastRelationshipStoryAge);
    relationship.lastRelationshipStoryAge = Number.isFinite(lastStoryAge)
      ? Math.floor(lastStoryAge)
      : -1;
    return relationship;
  }

  rememberRelationship(relationshipOrId, type, impact = 0, details = {}) {
    const relationship =
      typeof relationshipOrId === 'object'
        ? relationshipOrId
        : this.relationships.find(entry => entry.id === relationshipOrId);
    if (!relationship || !this.isImportantRelationship(relationship)) {
      return null;
    }
    this.ensureRelationshipDepth(relationship);
    relationship.memorySequence += 1;
    const memory = {
      id: `${relationship.id}_memory_${relationship.memorySequence}`,
      type,
      age: this.age,
      impact: this.clamp(Number(impact) || 0, -100, 100),
      details: details && typeof details === 'object' ? { ...details } : {},
    };
    relationship.memories.push(memory);
    relationship.memories = relationship.memories.slice(-MAX_RELATIONSHIP_MEMORIES);
    return memory;
  }

  startRelationshipConflict(relationship, conflictType = 'misunderstanding') {
    if (!relationship || !this.isImportantRelationship(relationship)) {
      return null;
    }
    this.ensureRelationshipDepth(relationship);
    if (relationship.activeConflict) {
      relationship.activeConflict.type = conflictType;
      relationship.activeConflict.stage = 'resentment';
      relationship.activeConflict.lastAdvancedAge = this.age;
      return relationship.activeConflict;
    }
    relationship.activeConflict = {
      id: `${relationship.id}_conflict_${relationship.memorySequence + 1}`,
      type: conflictType,
      stage: 'tension',
      startedAtAge: this.age,
      lastAdvancedAge: this.age,
    };
    this.rememberRelationship(relationship, 'conflict_started', -8, { conflictType });
    return relationship.activeConflict;
  }

  relationshipActionAffinity(relationship, action) {
    this.ensureRelationshipDepth(relationship);
    const likes = relationship.preferences?.likes || [];
    const dislikes = relationship.preferences?.dislikes || [];
    if (likes.includes(action)) {
      return 3;
    }
    if (dislikes.includes(action)) {
      return -3;
    }
    return 0;
  }

  processRelationshipStories(relationshipId = null) {
    if (!Array.isArray(this.relationships)) {
      return 0;
    }
    let changes = 0;
    const relationships = relationshipId
      ? this.relationships.filter(relationship => relationship.id === relationshipId)
      : this.relationships;

    relationships.forEach(relationship => {
      if (!this.isImportantRelationship(relationship) || relationship.status === 'Deceased') {
        return;
      }
      this.ensureRelationshipDepth(relationship);
      if (relationship.lastRelationshipStoryAge === this.age) {
        return;
      }
      relationship.lastRelationshipStoryAge = this.age;

      if (relationship.promise?.status === 'active' && this.age > relationship.promise.dueAge) {
        relationship.promise.status = 'broken';
        relationship.stat = this.clamp((Number(relationship.stat) || 0) - 12);
        this.rememberRelationship(relationship, 'promise_broken', -18);
        this.startRelationshipConflict(relationship, 'broken_promise');
        this.logEvent(`You broke your promise to make time for ${relationship.name}.`, 'bad');
        this.updateStats({ happiness: -4, stress: 5 });
        changes += 1;
      }

      const conflict = relationship.activeConflict;
      if (conflict && this.age > conflict.lastAdvancedAge && this.age > conflict.startedAtAge) {
        conflict.stage = 'resentment';
        conflict.lastAdvancedAge = this.age;
        relationship.stat = this.clamp((Number(relationship.stat) || 0) - 5);
        this.rememberRelationship(relationship, 'conflict_deepened', -8, {
          conflictType: conflict.type,
        });
        this.logEvent(
          `The unresolved conflict with ${relationship.name} turned into resentment.`,
          'bad'
        );
        changes += 1;
      }

      if (
        !relationship.activeConflict &&
        (Number(relationship.stat) || 0) < 40 &&
        (Number(relationship.yearsKnown) || 0) > 0
      ) {
        const storyRoll =
          stableRelationshipHash(`${relationship.id}|${relationship.name}|${this.age}`) % 4;
        if (storyRoll === 0) {
          this.startRelationshipConflict(relationship, 'feeling_neglected');
          this.logEvent(
            `${relationship.name} feels neglected and wants to talk about your relationship.`,
            'bad'
          );
          changes += 1;
        }
      } else if (
        !relationship.activeConflict &&
        (Number(relationship.stat) || 0) >= 75 &&
        (Number(relationship.yearsKnown) || 0) >= 2
      ) {
        const storyRoll = stableRelationshipHash(`${relationship.id}|shared|${this.age}`) % 5;
        if (storyRoll === 0) {
          relationship.stat = this.clamp((Number(relationship.stat) || 0) + 1);
          this.rememberRelationship(relationship, 'shared_moment', 5);
          this.logEvent(
            `You and ${relationship.name} looked back on a favorite memory together.`,
            'good'
          );
          changes += 1;
        }
      }
    });
    return changes;
  }

  ensureDefaults() {
    this.traits ??= [];
    this.assets ??= [];
    this.relationships ??= [];
    this.history ??= [];
    this.worldNews ??= [];
    this.portfolio ??= [];
    this.pets ??= [];
    this.languages ??= ['English'];
    this.lifeStats ??= { totalMoneyEarned: 0, totalTaxes: 0 };
    this.milestones ??= [];
    this.completedChallenges ??= [];
    this.educationHistory ??= [];
    this.degrees ??= [];
    this.musicalTalent ??= Math.floor(Math.random() * 100);
    this.athleticism ??= Math.floor(Math.random() * 100);
    this.unlockedFeatures ??= [];
    this.warReactionChosen ??= false;
    this.wars ??= {};
    this.countryRelations ??= {};
    this.unResolutions ??= [];
    this.diplomaticHistory ??= [];
    this.pendingGeopoliticalEvent ??= null;
    this._breakingNews ??= [];

    if (!this.name) {
      this.name = {
        first: this.firstName || 'John',
        last: this.lastName || 'Doe',
      };
    }
    this.name.first = String(this.name.first || 'John').trim() || 'John';
    this.name.last = String(this.name.last || 'Doe').trim() || 'Doe';
    if (typeof this.gender !== 'string') {
      this.gender = 'Male';
    }
    if (typeof this.country !== 'string' || !this.country) {
      this.country = 'United States';
    }
    if (!this.skills) {
      this.skills = {};
    }
    this.skills = {
      voice: this.skills.voice || 0,
      instruments: { ...(this.skills.instruments || {}) },
      martialArts: this.skills.martialArts || 0,
      cooking: this.skills.cooking || 0,
      coding: this.skills.coding || 0,
      instrument: this.skills.instrument || 0,
    };
    if (!Array.isArray(this.traits)) {
      this.traits = [];
    }
    if (!this.careerData) {
      this.careerData = null;
    }
    if (this.careerData && typeof this.careerData === 'object') {
      if (typeof this.careerData.nodes !== 'object') {
        this.careerData.nodes = {};
      }
      if (typeof this.careerData.availableSkillPoints !== 'number') {
        this.careerData.availableSkillPoints = 0;
      }
      if (typeof this.careerData.totalSkillPointsEarned !== 'number') {
        this.careerData.totalSkillPointsEarned = 0;
      }
    }
    if (!Array.isArray(this.pets)) {
      this.pets = [];
    }
    if (!Array.isArray(this.assets)) {
      this.assets = [];
    }
    this.assets.forEach((asset, index) => {
      if (asset && (asset.uniqueId === undefined || asset.uniqueId === null)) {
        asset.uniqueId = `owned_${asset.id || 'asset'}_${index}_${Number(asset.purchasePrice ?? asset.price) || 0}`;
      }
    });
    if (!Array.isArray(this.portfolio)) {
      this.portfolio = [];
    }
    if (!Array.isArray(this.relationships)) {
      this.relationships = [];
    }
    this.relationships.forEach(relationship => this.ensureRelationshipDepth(relationship));
    if (!Array.isArray(this.educationHistory)) {
      this.educationHistory = [];
    }
    if (!Array.isArray(this.degrees)) {
      this.degrees = [];
    }
    if (!this.social) {
      this.social = { platforms: {}, totalFollowers: 0, isInfluencer: false };
    }
    if (!this.social.platforms) {
      this.social.platforms = {};
    }
    if (!this.mafia) {
      this.mafia = { family: null, rank: null, standing: 0 };
    }
    if (!this.prisonStats) {
      this.prisonStats = { respect: 0, gang: null };
    }
    if (!Array.isArray(this.companies)) {
      this.companies = [];
    }
    this.companies = this.companies
      .map(company => (company instanceof Company ? company : Company.fromData(company)))
      .filter(Boolean);
    if (!Array.isArray(this.citizenships)) {
      this.citizenships = [this.country || 'United States'];
    }
    if (this.yearsInCurrentCountry === undefined) {
      this.yearsInCurrentCountry = 0;
    }
    if (this.visaApplications === undefined) {
      this.visaApplications = 0;
    }
    if (this.visaRejections === undefined) {
      this.visaRejections = 0;
    }
    if (!this.city) {
      this.city = this.getDefaultCity(this.country);
    }
    if (!this.birthCity) {
      this.birthCity = this.city;
    }
    if (!this.birthCountry) {
      this.birthCountry = this.country;
    }
    if (this.yearsInCurrentCity === undefined) {
      this.yearsInCurrentCity = 1;
    }
    if (!Array.isArray(this.completedChallenges)) {
      this.completedChallenges = [];
    }
    this.lifeStats = {
      crimesCommitted: 0,
      jailYears: 0,
      companiesStarted: 0,
      deploymentsSurvived: 0,
      totalMoneyEarned: 0,
      totalTaxes: 0,
      totalLivingExpenses: 0,
      totalDebtPayments: 0,
      totalDebtDischarged: 0,
      totalDiscretionarySpending: 0,
      totalRetirementIncome: 0,
      ...(this.lifeStats || {}),
    };
    if (this.stress === undefined) {
      this.stress = 0;
    }
    if (this.karma === undefined) {
      this.karma = 50;
    }
    if (this.fame === undefined) {
      this.fame = 0;
    }
    if (this.notoriety === undefined) {
      this.notoriety = 0;
    }
    if (!this.addictions) {
      this.addictions = {};
    }
    if (!this.addictionLevels) {
      this.addictionLevels = {};
    }
    if (this.inTreatment === undefined) {
      this.inTreatment = false;
    }
    if (this.treatmentTypes !== null && !Array.isArray(this.treatmentTypes)) {
      this.treatmentTypes = this.inTreatment ? null : [];
    }
    if (!this.retirementAccounts) {
      this.retirementAccounts = {};
    }
    if (this.isRetired === undefined) {
      this.isRetired = false;
    }
    if (!this.fitness) {
      this.fitness = {
        weight: 150,
        diet: 'standard',
        exerciseDays: 0,
        muscleMass: 30,
        bodyFat: 20,
      };
    }
    if (!this.insurance) {
      this.insurance = {};
    }
    if (!this.spaceProgram) {
      this.spaceProgram = null;
    }
    if (!Array.isArray(this.foundations)) {
      this.foundations = [];
    }
    if (!Array.isArray(this.legacyProjects)) {
      this.legacyProjects = [];
    }
    if (!Array.isArray(this.heirlooms)) {
      this.heirlooms = [];
    }
    if (!Array.isArray(this.worldNews)) {
      this.worldNews = [];
    }
    if (!Array.isArray(this.clubs)) {
      this.clubs = [];
    }
    if (!this.collegeSport) {
      this.collegeSport = null;
    }
    if (!Array.isArray(this.activeLawsuits)) {
      this.activeLawsuits = [];
    }
    if (!Array.isArray(this.lawsuitHistory)) {
      this.lawsuitHistory = [];
    }
    if (!Array.isArray(this.timeCapsules)) {
      this.timeCapsules = [];
    }
    if (!Array.isArray(this.memories)) {
      this.memories = [];
    }
    if (!this.lastSeason) {
      this.lastSeason = null;
    }
    if (!Array.isArray(this.seasonalEventsThisYear)) {
      this.seasonalEventsThisYear = [];
    }
    if (!Array.isArray(this.conditions)) {
      this.conditions = [];
    }
    if (this.energy === undefined) {
      this.energy = 100;
    }
    if (this.lastRoyalDutyAge === undefined) {
      this.lastRoyalDutyAge = -1;
    }
    if (this.lastIntimacyAge === undefined) {
      this.lastIntimacyAge = -1;
    }
    if (!Array.isArray(this.statHistory)) {
      this.statHistory = [];
    }
    if (this.totalDonated === undefined) {
      this.totalDonated = 0;
    }
    if (!Array.isArray(this.countriesVisited)) {
      this.countriesVisited = [this.country || 'United States'];
    }
    if (!Array.isArray(this.languages)) {
      this.languages = ['English'];
    }
    if (this.sportsChampionships === undefined) {
      this.sportsChampionships = 0;
    }
    if (this.mvpAwards === undefined) {
      this.mvpAwards = 0;
    }
    if (this.isHeadOfState === undefined) {
      this.isHeadOfState = false;
    }
    if (this.hasNobelPrize === undefined) {
      this.hasNobelPrize = false;
    }
    if (!Array.isArray(this.patents)) {
      this.patents = [];
    }
    if (this.avatar === undefined) {
      this.avatar = null;
    }
    if (!this.cabinet || typeof this.cabinet !== 'object') {
      this.cabinet = {};
    }
    if (!this.policies || typeof this.policies !== 'object') {
      this.policies = {
        taxRate: 30,
        militarySpending: 30,
        diplomacyBudget: 30,
        socialSpending: 30,
      };
    }
    if (!Array.isArray(this.diplomaticHistory)) {
      this.diplomaticHistory = [];
    }
    if (!this.pendingGeopoliticalEvent) {
      this.pendingGeopoliticalEvent = null;
    }
    if (!this.geopoliticalState) {
      this.geopoliticalState = null;
    }

    const statDefaults = {
      happiness: 50,
      health: 50,
      smarts: 50,
      looks: 50,
      stress: 0,
      karma: 50,
      fame: 0,
      notoriety: 0,
      energy: 100,
    };
    Object.entries(statDefaults).forEach(([key, fallback]) => {
      const value = Number(this[key]);
      this[key] = this.clamp(Number.isFinite(value) ? value : fallback);
    });
    this.age = Math.max(0, Math.floor(Number(this.age) || 0));
    this.money = Number.isFinite(Number(this.money)) ? Number(this.money) : 0;
    this.loans = Math.max(0, Number(this.loans) || 0);
    this.personalDebt = Math.max(0, Number(this.personalDebt) || 0);
    this.bankruptcies = Math.max(0, Math.floor(Number(this.bankruptcies) || 0));
    if (!Number.isFinite(Number(this.lastBankruptcyAge))) {
      this.lastBankruptcyAge = -1000;
    }
    if (typeof this.isAlive !== 'boolean') {
      this.isAlive = true;
    }
    return this;
  }

  /**
   * Updates multiple stats at once with automatic clamping
   * @param {Object} changes - Object containing stat changes (e.g., { happiness: 10, health: -5, money: 100 })
   * Supports: happiness, health, smarts, looks, stress, karma, fame, notoriety, money, energy
   */
  updateStats(changes) {
    if (!this.isAlive) {
      return;
    }

    ['happiness', 'health', 'smarts', 'looks', 'stress', 'karma', 'fame', 'notoriety'].forEach(
      key => {
        const delta = Number(changes?.[key]);
        if (Number.isFinite(delta)) {
          this[key] = this.clamp((Number(this[key]) || 0) + delta);
        }
      }
    );
    const moneyDelta = Number(changes?.money);
    if (Number.isFinite(moneyDelta)) {
      this.money = (Number(this.money) || 0) + moneyDelta;
    }
    const energyDelta = Number(changes?.energy);
    if (Number.isFinite(energyDelta)) {
      this.energy = this.clamp((Number(this.energy) || 0) + energyDelta);
    }

    if (this.health <= 0 && this.isAlive) {
      this.isAlive = false;
      this.logEvent('Your health reached zero. You died.', 'bad');
    }
  }

  recordStatSnapshot() {
    this.statHistory.push({
      age: this.age,
      health: this.health,
      happiness: this.happiness,
      smarts: this.smarts,
      looks: this.looks,
      stress: this.stress,
      karma: this.karma,
      money: this.money,
      energy: this.energy ?? 100,
      fame: this.fame,
      notoriety: this.notoriety,
    });
    this.statHistory = this.statHistory.slice(-150);
  }

  setJob(jobData) {
    if (this.age < 18) {
      this.logEvent('You must be 18 to work full-time.', 'bad');
      return false;
    }
    if (
      !jobData ||
      typeof jobData.title !== 'string' ||
      !Number.isFinite(Number(jobData.salary)) ||
      Number(jobData.salary) < 0
    ) {
      this.logEvent('That job offer is invalid.', 'bad');
      return false;
    }

    const customRequirements = {
      influencer: () => Boolean(this.social?.isInfluencer),
      stuntman: () => (this.skills?.martialArts || 0) >= 100,
      coding_skill: () => (this.skills?.coding || 0) >= 80,
      cooking_skill: () => (this.skills?.cooking || 0) >= 90,
      actor: () => (this.fame || 0) >= 20,
      musician: () =>
        Math.max(
          this.skills?.voice || 0,
          this.skills?.instrument || 0,
          ...Object.values(this.skills?.instruments || {}).map(Number)
        ) >= 80,
    };
    if (
      jobData.customReq &&
      customRequirements[jobData.customReq] &&
      !customRequirements[jobData.customReq]()
    ) {
      this.logEvent(`You do not meet the special requirements for ${jobData.title}.`, 'bad');
      return false;
    }

    // Check Requirements
    if (jobData.requirements) {
      if (jobData.requirements.smarts && this.smarts < jobData.requirements.smarts) {
        this.logEvent(
          `You were rejected from being a ${jobData.title} because you aren't smart enough.`,
          'bad'
        );
        return false;
      }
      if (jobData.requirements.looks && this.looks < jobData.requirements.looks) {
        this.logEvent(`They said you don't have the 'look' for a ${jobData.title}.`, 'bad');
        return false;
      }
      if (jobData.requirements.health && this.health < jobData.requirements.health) {
        this.logEvent(`You failed the physical for ${jobData.title}.`, 'bad');
        return false;
      }

      if (!meetsEducationRequirement(this, jobData.requirements.education)) {
        this.logEvent(
          `You were rejected! You need ${jobData.requirements.education} education to be a ${jobData.title}.`,
          'bad'
        );
        return false;
      }

      // Degree Check
      if (jobData.requirements.degree_req) {
        const reqs = jobData.requirements.degree_req; // Array of acceptable majors
        // Check if player has ANY of these degrees
        // Player degrees are in this.degrees = [{ type: 'CS', name: 'Bachelor...' }]
        const hasDegree = this.degrees && this.degrees.some(d => reqs.includes(d.type));

        // Special Case: specific Grad Schools (Medical School etc are stored as degree types? or names?)
        // In GameEngine: person.educationHistory.push(school.grant_degree) for HS
        // For Uni: person.degrees.push({ type: major, name: degreeName })

        // For Grad School: type is major?
        // In EducationLogic: grad schools act as modifiers?
        // Wait, GameEngine logic:
        // const major = school.major || school.name;
        // person.degrees.push({ type: major, name: degreeName });
        // So if I go to Med School, type="Medical School".

        // So checking reqs.includes(d.type) should work if req is 'Medical School'

        if (!hasDegree) {
          this.logEvent(
            `You were rejected! You need a degree in ${reqs.join(' or ')} to be a ${jobData.title}.`,
            'bad'
          );
          return false;
        }
      }
    }

    this.job = {
      ...jobData,
      yearsEmployed: 0,
      performance: 50, // 0-100
    };
    this.logEvent(`You started working as a ${jobData.title}.`, 'good');
    return true;
  }

  quitJob() {
    if (this.job) {
      this.logEvent(`You quit your job as a ${this.job.title}.`, 'neutral');
      this.job = null;
    }
  }

  performActivity(activity) {
    if (!activity || typeof activity.title !== 'string') {
      return false;
    }
    const cost = Number(activity.cost ?? 0);
    const energyCost = Number(activity.energyCost ?? 0);
    if (!Number.isFinite(cost) || cost < 0 || !Number.isFinite(energyCost) || energyCost < 0) {
      this.logEvent('That activity has invalid requirements.', 'bad');
      return false;
    }
    if (activity.minAge && this.age < activity.minAge) {
      this.logEvent(
        `You must be at least ${activity.minAge} to ${activity.title.toLowerCase()}.`,
        'bad'
      );
      return false;
    }
    if (this.money < cost) {
      this.logEvent(`You can't afford to ${activity.title.toLowerCase()}!`, 'bad');
      return false;
    }

    if ((this.energy ?? 100) < energyCost) {
      this.logEvent("You're too exhausted to do that right now.", 'neutral');
      return false;
    }
    this.energy = Math.max(0, (this.energy ?? 100) - energyCost);

    if (activity.isDating) {
      this.findPartner();
      return true;
    }

    if (activity.isBusking) {
      // Busking Logic
      // Find max music skill (either voice or any instrument)
      let maxSkill = this.skills.voice || 0;
      if (this.skills.instruments) {
        Object.values(this.skills.instruments).forEach(val => {
          if (val > maxSkill) {
            maxSkill = val;
          }
        });
      }
      // Also check generic 'instrument' skill if used
      if (this.skills.instrument > maxSkill) {
        maxSkill = this.skills.instrument;
      }

      if (maxSkill < 10) {
        this.logEvent(
          'You tried to busk but you have no talent. People threw garbage at you.',
          'bad'
        );
        this.updateStats({ happiness: -5, health: -1 });
        return true;
      }

      const earnings = Math.floor((maxSkill / 2) * (Math.random() * 5)); // e.g., 50 skill -> $0-$125
      this.money += earnings;
      this.logEvent(`You busked on the street. You earned $${earnings}.`, 'good');
      this.updateStats({ happiness: 5 });
      return true;
    }

    if (activity.isCrime) {
      this.commitCrime(activity.crimeType);
      return true;
    }

    this.money -= cost;
    const enriched = getActivityWithDefaults(activity);
    const result = resolveActivity(this, enriched);

    if (!result) {
      this.updateStats({ ...(activity.effects || {}) });
      this.logEvent(activity.text, activity.type);
      return true;
    }

    this.updateStats(result.effects);
    this.logEvent(result.text, result.type);

    if (result.followUp && !this.pendingEvent) {
      this.updateStats(result.followUp.effects || {});
      this.pendingEvent = {
        type: 'chain_followup',
        text: result.followUp.text,
        choices: [{ text: 'Continue', effect: 'acknowledge', effects: {} }],
      };
    } else if (result.followUp) {
      this.updateStats(result.followUp.effects || {});
      this.logEvent(result.followUp.text, result.followUp.type);
    }

    if (result.unlock) {
      this.logEvent(`You unlocked ${result.unlock}!`, 'good');
    }

    // Challenge tracking: log countries visited on travel activities
    if (activity.id === 'travel_budget' || activity.id === 'travel_luxury') {
      if (!Array.isArray(this.countriesVisited)) {
        this.countriesVisited = [this.country];
      }
      const TRAVEL_DESTINATIONS = [
        'France',
        'Japan',
        'Italy',
        'Spain',
        'Australia',
        'Brazil',
        'Thailand',
        'Egypt',
        'Mexico',
        'India',
        'Greece',
        'Morocco',
        'Vietnam',
        'Peru',
        'Iceland',
      ];
      const visited = TRAVEL_DESTINATIONS.filter(c => !this.countriesVisited.includes(c));
      if (visited.length > 0) {
        const dest = visited[Math.floor(Math.random() * visited.length)];
        this.countriesVisited.push(dest);
        this.logEvent(`You visited ${dest}!`, 'good');
      }
    }

    return true;
  }

  // Removed old findPartner in favor of UI-driven dating
  // New method to start dating a specific generated candidate
  startDating(candidate) {
    if (this.age < 18 || !candidate || Number(candidate.age) < 18) {
      this.logEvent('Dating is only available to adults.', 'bad');
      return false;
    }

    const existingPartner = this.relationships.find(
      r => r.status !== 'Deceased' && ['Partner', 'Fiance', 'Spouse'].includes(r.type)
    );
    if (existingPartner) {
      this.logEvent(
        `You are already committed to ${existingPartner.name}. End that relationship before dating someone new.`,
        'neutral'
      );
      return false;
    }

    this.addRelationship({
      ...candidate,
      type: 'Partner',
      stat: 80, // High start for dating app
    });
    this.logEvent(
      `You started dating ${candidate.name} (Age ${candidate.age}, ${candidate.job})!`,
      'good'
    );
    this.updateStats({ happiness: 20 });
    return true;
  }

  setPendingEvent(event) {
    this.pendingEvent = event;
    // We don't log it yet, the modal will handle the description
  }

  // --- PETS ---
  adoptPet(pet) {
    if (!pet) {
      return;
    }
    this.pets.push(pet);
    this.logEvent(`You adopted a ${pet.type} named ${pet.name}.`, 'good');
    this.updateStats({ happiness: 10, karma: 5 });
  }

  interactWithPet(index, action) {
    const pet = this.pets[index];
    if (!pet) {
      return;
    }

    if (action === 'walk') {
      if ((this.energy ?? 100) < 15) {
        this.logEvent(`You're too tired to take ${pet.name} for a walk.`, 'neutral');
        return;
      }
      this.energy = Math.max(0, (this.energy ?? 100) - 15);
      const dim = 1 - Math.pow((pet.relationship || 0) / 100, 1.5);
      const gain = Math.max(1, Math.round(5 * dim));
      pet.happiness = Math.min(100, pet.happiness + 10);
      pet.health = Math.min(100, pet.health + 5);
      pet.relationship = Math.min(100, pet.relationship + gain);
      this.updateStats({ health: 2, happiness: 3 });
      this.logEvent(`You took ${pet.name} for a walk.`, 'good');
    } else if (action === 'treat') {
      if (this.money < 10) {
        this.logEvent(`You can't afford a treat for ${pet.name}.`, 'bad');
        return false;
      }
      pet.happiness = Math.min(100, pet.happiness + 20);
      pet.relationship = Math.min(100, pet.relationship + 5);
      this.money -= 10;
      this.logEvent(`You gave ${pet.name} a treat.`, 'good');
    } else if (action === 'sell') {
      // or release
      this.pets.splice(index, 1);
      this.logEvent(`You released ${pet.name}.`, 'neutral');
      this.updateStats({ karma: -5 });
    }
  }

  resolveEvent(choice) {
    if (!this.pendingEvent) {
      return;
    }
    const event = this.pendingEvent;

    if (choice.effect && choice.effect.startsWith('emigrate_')) {
      const targetName = choice.effect.replace('emigrate_', '');
      const immigrate = new ImmigrationManager(this);
      const result = immigrate.attemptEmigration(targetName);
      if (result.success) {
        this.logEvent(result.message, 'good');
        this.updateStats({ happiness: 10, stress: -5 });
      } else {
        this.logEvent(result.message, 'bad');
        this.updateStats({ happiness: -5, stress: 10 });
      }
      this.immigrationApplied = true;
      this.pendingEvent = null;
      return;
    }

    if (event.type === 'chain_followup') {
      this.logEvent(`Follow-up: ${event.text}`, 'neutral');
      this.pendingEvent = null;
      return;
    }

    if (event.type === 'war_reaction') {
      this.warReactionChosen = true;
      if (choice.effect === 'enlist_war') {
        this.job = { title: 'Soldier', salary: 30000, isMilitary: true, yearsOfWork: 0 };
        this.logEvent('You enlisted in the military to fight for your country.', 'neutral');
        this.updateStats({ stress: 15, happiness: -5 });
      } else if (choice.effect === 'war_profit') {
        this.money += 50000;
        this.logEvent('You secured lucrative war contracts. The blood money flows in.', 'bad');
        this.updateStats({ karma: -10 });
      } else if (choice.effect === 'war_journalist') {
        if (!this.job || this.job.title !== 'Journalist') {
          this.job = {
            title: 'War Journalist',
            salary: 45000,
            yearsOfWork: 0,
            isWarJournalist: true,
          };
        }
        this.logEvent('You embedded with troops to report from the front lines.', 'neutral');
        this.updateStats({ fame: 10, stress: 10 });
      } else if (choice.effect === 'war_protest') {
        this.notoriety = (this.notoriety || 0) + 5;
        this.logEvent('You joined the anti-war protests demanding peace.', 'neutral');
        this.updateStats({ fame: 5, stress: 10 });
      } else if (choice.effect === 'war_refugee') {
        this.logEvent('You fled the war-torn country as a refugee.', 'bad');
        const evacuationCost = Math.min(5000, Math.max(0, Number(this.money) || 0));
        this.updateStats({ stress: 20, happiness: -15, money: -evacuationCost });
        this.country = 'Refugee';
      } else if (choice.effect === 'war_help_refugees') {
        this.logEvent('You volunteered to help refugees displaced by the war.', 'good');
        this.updateStats({ karma: 10, happiness: -3 });
      } else if (choice.effect === 'war_become_general') {
        this.job = { title: 'General', salary: 80000, isMilitary: true, yearsOfWork: 0 };
        this.logEvent('You rose through the ranks to become a General!', 'good');
        this.updateStats({ fame: 15, stress: 20 });
      } else if (choice.effect === 'war_ignore') {
        this.logEvent('You chose to ignore the war and continue your life.', 'neutral');
      }
      this.pendingEvent = null;
      return;
    }

    // Apply specific choice effects
    if (choice.effects) {
      this.updateStats(choice.effects);
    }

    // Log the outcome
    // We log the event prompt + the choice taken
    this.logEvent(`Event: ${event.text}`, 'neutral', {
      messageKey: event.messageKey,
      messageParams: event.messageParams || {},
    });
    this.logEvent(`You chose to: ${choice.text}`, 'neutral', {
      messageKey: choice.messageKey,
      messageParams: choice.messageParams || {},
    });

    if (choice.outcomeText) {
      this.logEvent(choice.outcomeText, choice.type || 'neutral', {
        messageKey: choice.outcomeMessageKey,
        messageParams: choice.outcomeMessageParams || choice.messageParams || {},
      });
    }

    this.pendingEvent = null;
  }

  rentAsset(assetIndex, monthlyRent) {
    const asset = this.assets[assetIndex];
    const rent = Math.floor(Number(monthlyRent));
    if (!asset || asset.type !== 'Real Estate') {
      this.logEvent('Only real estate can be rented out.', 'bad');
      return false;
    }
    if (!Number.isFinite(rent) || rent <= 0) {
      this.logEvent('Choose a valid positive monthly rent.', 'bad');
      return false;
    }
    const propertyValue = Math.max(0, Number(asset.value ?? asset.price) || 0);
    const maximumRent = Math.max(1, Math.floor(propertyValue * 0.01));
    if (rent > maximumRent) {
      this.logEvent(
        `The maximum realistic rent for this property is $${maximumRent.toLocaleString()}/month.`,
        'bad'
      );
      return false;
    }

    asset.isRented = true;
    asset.rentPrice = rent;
    asset.tenant = {
      name: this.generateRandomName(),
      satisfaction: 50 + Math.floor(Math.random() * 50),
    };

    this.logEvent(
      `You rented out your ${asset.name} to ${asset.tenant.name} for $${rent.toLocaleString()}/month.`,
      'good'
    );
    this.updateStats({ happiness: 2 });
    return true;
  }

  evictTenant(assetIndex) {
    const asset = this.assets[assetIndex];
    if (!asset || !asset.isRented) {
      return;
    }

    const tenantName = asset.tenant.name;
    asset.isRented = false;
    asset.rentPrice = 0;
    asset.tenant = null;

    this.logEvent(`You evicted ${tenantName} from your ${asset.name}.`, 'neutral');
  }

  generateRandomName() {
    const firsts = ['John', 'Jane', 'Mike', 'Emily', 'Chris', 'Sarah', 'Alex', 'Sam'];
    const lasts = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
    return `${firsts[Math.floor(Math.random() * firsts.length)]} ${lasts[Math.floor(Math.random() * lasts.length)]}`;
  }

  buyAsset(asset, mortgage = null) {
    const price = Number(asset?.price);
    if (!asset || !Number.isFinite(price) || price <= 0) {
      this.logEvent('That asset is not available for purchase.', 'bad');
      return false;
    }

    const cost = mortgage ? Number(mortgage.downPayment) : price;
    const mortgageAmount = mortgage ? Number(mortgage.amount) : 0;
    const monthlyPayment = mortgage ? Number(mortgage.monthlyPayment) : 0;
    const mortgageRate = mortgage ? Number(mortgage.interestRate ?? 0.05) : 0;
    const invalidMortgage =
      mortgage &&
      (asset.type !== 'Real Estate' ||
        !Number.isFinite(mortgageAmount) ||
        mortgageAmount <= 0 ||
        !Number.isFinite(monthlyPayment) ||
        monthlyPayment <= 0 ||
        !Number.isFinite(mortgageRate) ||
        mortgageRate < 0 ||
        mortgageRate > 0.25 ||
        cost <= 0 ||
        Math.abs(cost + mortgageAmount - price) > 1);
    if (!Number.isFinite(cost) || cost < 0 || invalidMortgage) {
      this.logEvent('The payment details are invalid.', 'bad');
      return false;
    }

    if (this.money < cost) {
      this.logEvent(
        `You cannot afford the ${mortgage ? 'down payment' : 'price'} for the ${asset.name}.`,
        'bad'
      );
      return false;
    }

    this.money -= cost;

    const newAsset = {
      ...asset,
      uniqueId: asset.uniqueId ?? `asset_${Date.now()}_${Math.random()}`,
      purchasePrice: price,
      value: Number(asset.value) || price, // Set initial value for appreciation tracking
    };

    if (mortgage) {
      newAsset.isMortgaged = true;
      newAsset.mortgage = {
        amount: mortgageAmount,
        balance: mortgageAmount,
        monthlyPayment,
        interestRate: mortgageRate,
        term: Math.max(1, Math.floor(Number(mortgage.term) || 30)),
      };
      this.logEvent(
        `You bought a ${asset.name} with a mortgage! Down payment: $${cost.toLocaleString()}.`,
        'good'
      );
    } else {
      this.logEvent(`You bought a ${asset.name} for $${price.toLocaleString()} cash!`, 'good');
    }

    this.assets.push(newAsset);
    this.updateStats({ happiness: asset.happiness_bonus || 10 }); // Default bonus
    return true;
  }

  sellAsset(assetIndex) {
    const asset = this.assets[assetIndex];
    if (!asset) {
      return;
    }

    // Use current market value (calculated in GameEngine)
    const salePrice = Math.max(
      0,
      Number(asset.value) || Math.floor((Number(asset.price) || 0) * 0.7)
    );
    const mortgagePayoff =
      asset.isMortgaged && asset.mortgage ? Math.max(0, Number(asset.mortgage.balance) || 0) : 0;
    const proceeds = salePrice - mortgagePayoff;

    // Calculate profit/loss
    const profit = salePrice - (asset.purchasePrice || asset.price);
    const profitMsg =
      profit >= 0
        ? `profit of $${profit.toLocaleString()}`
        : `loss of $${Math.abs(profit).toLocaleString()}`;

    this.money += proceeds;
    this.assets.splice(assetIndex, 1);
    const payoffText =
      mortgagePayoff > 0
        ? ` after repaying $${mortgagePayoff.toLocaleString()} on the mortgage`
        : '';
    const proceedsText =
      proceeds >= 0
        ? `received $${proceeds.toLocaleString()}`
        : `paid a $${Math.abs(proceeds).toLocaleString()} shortfall`;
    this.logEvent(
      `You sold your ${asset.name} for $${salePrice.toLocaleString()} and ${proceedsText}${payoffText} (${profitMsg}).`,
      'neutral'
    );
    return proceeds;
  }

  addRelationship(rel) {
    const providedStat = Number(rel?.stat);
    const providedYearsKnown = Number(rel?.yearsKnown);
    const relationship = {
      ...rel,
      stat: Number.isFinite(providedStat) ? this.clamp(providedStat) : this.randomStat(40, 90),
      yearsKnown: Number.isFinite(providedYearsKnown) ? Math.max(0, providedYearsKnown) : 0,
    };
    this.ensureRelationshipDepth(relationship);
    relationship.lastRelationshipStoryAge = this.age;
    this.relationships.push(relationship);
    if (this.isImportantRelationship(relationship) && relationship.memories.length === 0) {
      const familyTypes = ['Father', 'Mother', 'Parent', 'King', 'Queen', 'Child', 'Sibling'];
      this.rememberRelationship(
        relationship,
        familyTypes.includes(relationship.type) ? 'family_bond' : 'relationship_started',
        5
      );
    }
    return relationship;
  }

  interactWithRel(relId, action, payload = {}) {
    const rel = this.relationships.find(r => r.id === relId);
    if (!rel) {
      return;
    }
    if (rel.status === 'Deceased') {
      this.logEvent(`You remember ${rel.name} fondly.`, 'neutral');
      return false;
    }
    this.ensureRelationshipDepth(rel);
    this.processRelationshipStories(relId);

    let text = '';
    let type = 'neutral';
    let change = 0;
    const personalityTraits = new Set(rel.personalityTraits || []);
    const recentMemoryScore = (rel.memories || [])
      .slice(-4)
      .reduce((total, memory) => total + (Number(memory.impact) || 0), 0);
    const memoryModifier = this.clamp(Math.round(recentMemoryScore / 20), -3, 3);

    switch (action) {
      case 'spend_time':
        if ((this.energy ?? 100) < 15) {
          text = "You're too exhausted to spend time with anyone.";
          type = 'neutral';
          break;
        }
        this.energy = Math.max(0, (this.energy ?? 100) - 15);
        const dimRel = 1 - Math.pow(rel.stat / 100, 1.5);
        change = Math.max(
          1,
          Math.round(5 * dimRel) + this.relationshipActionAffinity(rel, action) + memoryModifier
        );
        text = `You spent time with your ${rel.type}, ${rel.name}.`;
        type = 'good';
        if (
          rel.promise?.status === 'active' &&
          this.age > rel.promise.madeAtAge &&
          this.age <= rel.promise.dueAge
        ) {
          rel.promise.status = 'kept';
          change += 10;
          text += ' You kept your promise to make time for them.';
          this.rememberRelationship(rel, 'promise_kept', 18);
        } else {
          this.rememberRelationship(rel, 'quality_time', Math.max(3, change));
        }
        break;
      case 'compliment':
        // Personality and recent history shape how sincere the compliment feels.
        const annoyanceChance = personalityTraits.has('affectionate')
          ? 0.1
          : personalityTraits.has('independent')
            ? 0.4
            : 0.25;
        if (Math.random() < annoyanceChance + (recentMemoryScore < -15 ? 0.1 : 0)) {
          const replies = [
            `${rel.name} ignored you.`,
            `${rel.name} asked, "What do you want?"`,
            `${rel.name} told you to stop sucking up.`,
          ];
          text = replies[Math.floor(Math.random() * replies.length)];
          change = -2;
          type = 'neutral';
          this.rememberRelationship(rel, 'compliment_rejected', -3);
        } else {
          text = `You complimented your ${rel.type}, ${rel.name}.`;
          change = 8 + this.relationshipActionAffinity(rel, action) + Math.max(0, memoryModifier);
          type = 'good';
          this.rememberRelationship(rel, 'compliment', Math.max(4, change));
        }
        break;
      case 'insult':
        text = `You insulted your ${rel.type}, ${rel.name}!`;
        change = personalityTraits.has('sensitive') ? -22 : -15;
        if (personalityTraits.has('loyal')) {
          change -= 3;
        }
        type = 'bad';
        this.rememberRelationship(rel, 'insult', change);
        this.startRelationshipConflict(rel, 'hurtful_words');
        break;
      case 'make_promise':
        if (rel.promise?.status === 'active') {
          this.logEvent(
            `You already made ${rel.name} a promise that still needs to be kept.`,
            'neutral'
          );
          return false;
        }
        rel.promise = {
          type: 'quality_time',
          madeAtAge: this.age,
          dueAge: this.age + 1,
          status: 'active',
        };
        change = Math.max(0, 3 + this.relationshipActionAffinity(rel, action));
        text = `You promised ${rel.name} that you would make time for them next year.`;
        type = 'good';
        this.rememberRelationship(rel, 'promise_made', 6);
        break;
      case 'apologize':
      case 'give_space':
      case 'talk_it_out': {
        if (!rel.activeConflict) {
          this.logEvent(`There is no unresolved conflict with ${rel.name} right now.`, 'neutral');
          return false;
        }
        const baseChange =
          action === 'apologize'
            ? personalityTraits.has('sensitive') || personalityTraits.has('affectionate')
              ? 12
              : 7
            : action === 'give_space'
              ? personalityTraits.has('independent')
                ? 13
                : personalityTraits.has('affectionate')
                  ? 3
                  : 7
              : personalityTraits.has('practical') || personalityTraits.has('loyal')
                ? 12
                : 8;
        const stagePenalty = rel.activeConflict.stage === 'resentment' ? 2 : 0;
        change = Math.max(
          2,
          baseChange + this.relationshipActionAffinity(rel, action) - stagePenalty
        );
        const resolutionText =
          action === 'apologize'
            ? `You gave ${rel.name} a sincere apology and took responsibility.`
            : action === 'give_space'
              ? `You gave ${rel.name} space to cool down.`
              : `You and ${rel.name} talked honestly and found a way forward.`;
        text = resolutionText;
        type = 'good';
        this.rememberRelationship(rel, 'conflict_resolved', Math.max(6, change), {
          conflictType: rel.activeConflict.type,
          resolution: action,
        });
        rel.activeConflict = null;
        break;
      }
      case 'set_financial_style': {
        if (this.age < 18 || !['Partner', 'Fiance', 'Spouse'].includes(rel.type)) {
          this.logEvent(
            'Shared financial decisions are only available in an adult committed relationship.',
            'neutral'
          );
          return false;
        }
        const style = payload?.style;
        if (!['joint', 'separate'].includes(style)) {
          return false;
        }
        if (rel.financialArrangement?.style === style) {
          this.logEvent(`You and ${rel.name} already use that financial arrangement.`, 'neutral');
          return false;
        }
        const prefersJoint =
          personalityTraits.has('loyal') || personalityTraits.has('affectionate');
        const prefersSeparate = personalityTraits.has('independent');
        change =
          style === 'joint'
            ? prefersJoint
              ? 9
              : prefersSeparate
                ? -5
                : personalityTraits.has('practical')
                  ? 5
                  : 3
            : prefersSeparate
              ? 9
              : personalityTraits.has('practical')
                ? 6
                : personalityTraits.has('affectionate')
                  ? -3
                  : 2;
        rel.financialArrangement = { style, decidedAtAge: this.age };
        text =
          style === 'joint'
            ? `You and ${rel.name} agreed to manage a joint household budget.`
            : `You and ${rel.name} agreed to keep separate personal accounts.`;
        type = change >= 0 ? 'good' : 'bad';
        this.rememberRelationship(
          rel,
          style === 'joint' ? 'joint_finances' : 'separate_finances',
          change
        );
        if (change < 0) {
          this.startRelationshipConflict(rel, 'money_values');
        }
        break;
      }
      case 'support_child':
      case 'set_boundaries': {
        if (rel.type !== 'Child') {
          return false;
        }
        if (rel.lastParentingDecisionAge === this.age) {
          this.logEvent(
            `You already made an important parenting decision with ${rel.name} this year.`,
            'neutral'
          );
          return false;
        }
        if ((this.energy ?? 100) < 10) {
          this.logEvent(
            'You are too exhausted for an important parenting conversation.',
            'neutral'
          );
          return false;
        }
        this.energy = Math.max(0, (this.energy ?? 100) - 10);
        rel.lastParentingDecisionAge = this.age;
        if (action === 'support_child') {
          change =
            personalityTraits.has('ambitious') ||
            personalityTraits.has('adventurous') ||
            personalityTraits.has('playful')
              ? 11
              : 7;
          text = `You listened to ${rel.name}'s dream and promised to support it.`;
          type = 'good';
          this.rememberRelationship(rel, 'parenting_support', change);
        } else {
          change =
            personalityTraits.has('practical') || personalityTraits.has('loyal')
              ? 7
              : personalityTraits.has('playful') || personalityTraits.has('adventurous')
                ? -5
                : 2;
          text = `You set clear boundaries with ${rel.name}.`;
          type = change >= 0 ? 'good' : 'bad';
          this.rememberRelationship(rel, 'parenting_boundaries', change);
          if (change < 0) {
            this.startRelationshipConflict(rel, 'parenting_tension');
          }
        }
        break;
      }
      case 'make_love':
        if (this.age < 18 || !['Partner', 'Fiance', 'Spouse'].includes(rel.type)) {
          this.logEvent('You must be an adult in a committed relationship to do that.', 'bad');
          return false;
        }
        if (this.lastIntimacyAge === this.age) {
          this.logEvent('You have already spent intimate time together this year.', 'neutral');
          return false;
        }
        if ((this.energy ?? 100) < 15) {
          this.logEvent('You are too tired right now.', 'neutral');
          return false;
        }
        this.lastIntimacyAge = this.age;
        this.energy = Math.max(0, (this.energy ?? 100) - 15);
        const intimacyThreshold =
          30 +
          (rel.activeConflict ? 35 : 0) +
          (personalityTraits.has('independent') ? 5 : 0) -
          (personalityTraits.has('affectionate') ? 10 : 0);
        if (this.randomStat(0, 100) > intimacyThreshold) {
          text = `You made love to ${rel.name}.`;
          change = 15;
          type = 'good';
          this.rememberRelationship(rel, 'intimacy', 12);

          // Chance of pregnancy (simplified)
          if (this.randomStat(0, 100) < 15) {
            // 15% chance
            const childGender = Math.random() > 0.5 ? 'male' : 'female';
            const childName = childGender === 'male' ? 'James' : 'Olivia';
            const inheritedStats = this.generateChildInheritedStats();
            const child = {
              id: `child_${Date.now()}`,
              name: childName,
              type: 'Child',
              age: 0,
              gender: childGender,
              traits: this.generateChildTraits(),
              inheritedSmarts: inheritedStats.smarts,
              inheritedLooks: inheritedStats.looks,
              inheritedHealth: inheritedStats.health,
            };
            this.addRelationship(child);
            this.logEvent(`You had a baby ${childGender} named ${childName}!`, 'good');
            this.updateStats({ happiness: 30 });
          }
        } else {
          text = `${rel.name} turned you down.`;
          change = -5;
          type = 'neutral';
          this.rememberRelationship(rel, 'intimacy_rejected', -4);
        }
        break;
      case 'propose':
        if (this.age < 18 || rel.type !== 'Partner') {
          this.logEvent('You must be an adult with a partner before proposing.', 'bad');
          return false;
        }
        // Proposal Logic
        const ringCost = Math.floor(Number(payload?.ringCost ?? 1000));
        if (!Number.isFinite(ringCost) || ringCost <= 0) {
          this.logEvent('Choose a valid ring.', 'bad');
          return false;
        }
        if (this.money < ringCost) {
          this.logEvent("You can't afford that ring!", 'bad');
          return;
        }
        this.money -= ringCost;

        // Acceptance chance
        let chance = rel.stat;
        if (ringCost > 10000) {
          chance += 20;
        } // Nice ring bonus
        if (ringCost < 500) {
          chance -= personalityTraits.has('practical') ? 5 : 20;
        }
        if (personalityTraits.has('loyal')) {
          chance += 8;
        }
        if (personalityTraits.has('ambitious') && ringCost >= 10000) {
          chance += 10;
        }
        if (rel.activeConflict) {
          chance -= 25;
        }
        if (rel.promise?.status === 'broken') {
          chance -= 15;
        }

        if (chance > 60) {
          rel.type = 'Fiance';
          text = `You proposed to ${rel.name} with a $${ringCost.toLocaleString()} ring and they said YES!`;
          change = 30;
          type = 'good';
          this.rememberRelationship(rel, 'proposal_accepted', 25, { ringCost });
        } else {
          text = `You proposed to ${rel.name} with a $${ringCost.toLocaleString()} ring but they REJECTED you.`;
          change = -30;
          type = 'bad';
          this.rememberRelationship(rel, 'proposal_rejected', -20, { ringCost });
          this.startRelationshipConflict(rel, 'rejected_proposal');
        }
        break;

      case 'marry':
        if (this.age < 18 || rel.type !== 'Fiance') {
          this.logEvent('You must be an adult and engaged before getting married.', 'bad');
          return false;
        }
        const weddingCost = Math.floor(Number(payload?.budget ?? 5000));
        const signPrenup = payload?.prenup || false;

        if (!Number.isFinite(weddingCost) || weddingCost < 0) {
          this.logEvent('Choose a valid wedding budget.', 'bad');
          return false;
        }

        if (this.money < weddingCost) {
          this.logEvent(`You can't afford the wedding ($${weddingCost})!`, 'bad');
          return;
        }

        const prenupTrustThreshold = personalityTraits.has('practical')
          ? 55
          : personalityTraits.has('sensitive')
            ? 90
            : 80;
        if (signPrenup && rel.stat < prenupTrustThreshold) {
          this.logEvent(`${rel.name} refused to sign the prenup! The wedding is off.`, 'bad');
          change = -20;
          this.rememberRelationship(rel, 'prenup_conflict', -15);
          this.startRelationshipConflict(rel, 'prenup_disagreement');
          break;
        }

        this.money -= weddingCost;
        rel.type = 'Spouse';
        rel.hasPrenup = signPrenup;
        text = `You married ${rel.name}! It was a beautiful ceremony ($${weddingCost}).${signPrenup ? ' You signed a prenup.' : ''}`;
        change = 40;
        type = 'good';
        this.rememberRelationship(rel, 'wedding', 30, { weddingCost, prenup: signPrenup });
        break;

      case 'cheat':
        // Trust-focused personalities notice suspicious behavior more quickly.
        const caughtChance = personalityTraits.has('loyal')
          ? 0.42
          : personalityTraits.has('independent')
            ? 0.22
            : 0.3;
        if (Math.random() < caughtChance) {
          text = `You were CAUGHT cheating on ${rel.name}!`;
          change = -100; // Massive hit
          type = 'bad';
          this.rememberRelationship(rel, 'betrayal', -100);
          this.startRelationshipConflict(rel, 'betrayal');
          if (rel.stat < 50) {
            // Instant breakup/divorce
            if (rel.type === 'Spouse') {
              // Force divorce next tick or handle here?
              // Let's degrade stat now, maybe user has to manually divorce or get divorced event later
            } else {
              this.relationships = this.relationships.filter(r => r.id !== relId);
              text += ' They dumped you immediately.';
            }
          }
        } else {
          text = 'You cheated and got away with it... for now.';
          change = -5; // Guilt?
          type = 'neutral';
        }
        break;

      case 'give_gift': {
        const giftCosts = {
          Partner: 200,
          Spouse: 200,
          Fiance: 200,
          Child: 100,
          Parent: 100,
          Mother: 100,
          Father: 100,
          Sibling: 100,
          'Best Friend': 50,
          Friend: 50,
        };
        const cost = giftCosts[rel.type] || 100;
        if ((this.money ?? 0) < cost) {
          this.logEvent(`You can't afford a gift for ${rel.name} right now.`, 'bad');
          return false;
        }
        this.money -= cost;
        const baseGift = 10;
        change =
          baseGift + this.relationshipActionAffinity(rel, action) + Math.max(0, memoryModifier);
        const giftMessages = [
          `You gave ${rel.name} a thoughtful gift. They loved it!`,
          `${rel.name} was touched by your generous gift.`,
          `You surprised ${rel.name} with a gift. Their face lit up!`,
        ];
        text = giftMessages[Math.floor(Math.random() * giftMessages.length)];
        type = 'good';
        this.rememberRelationship(rel, 'gift_given', Math.max(5, change));
        break;
      }
      case 'break_up':
        text = `You broke up with ${rel.name}.`;
        change = -10;
        this.relationships = this.relationships.filter(r => r.id !== relId);
        type = 'neutral';
        break;

      case 'divorce':
        // Divorce Logic
        let settlement = 0;
        if (rel.hasPrenup) {
          text = `You divorced ${rel.name}. Thanks to the prenup, your assets are safe.`;
        } else {
          const maritalEstate = Math.max(0, this.getTotalEstateValue());
          settlement = Math.floor(maritalEstate * 0.5);
          const cashPayment = Math.min(settlement, Math.max(0, Number(this.money) || 0));
          this.money -= cashPayment;
          this.personalDebt =
            Math.max(0, Number(this.personalDebt) || 0) + (settlement - cashPayment);
          text = `You divorced ${rel.name}. Without a prenup, the settlement cost $${settlement.toLocaleString()} across your cash and estate.`;
        }
        change = -30;
        this.relationships = this.relationships.filter(r => r.id !== relId);
        type = 'bad';
        break;
    }

    if (text) {
      this.logEvent(text, type);
    }
    if (change !== 0) {
      rel.stat = Math.max(0, Math.min(100, rel.stat + change));
      this.updateStats({ happiness: change > 0 ? 5 : -5 });
    }
  }

  enrollInSchool(school) {
    if (this.currentSchool) {
      this.logEvent('You are already enrolled in school!', 'bad');
      return false;
    }

    if (!school || typeof school.type !== 'string') {
      this.logEvent('That school is not available.', 'bad');
      return false;
    }

    const completedDegree =
      school.type === 'grad_school'
        ? this.degrees.some(
            degree => degree.type === (school.major || school.name) && degree.name === school.name
          )
        : this.degrees.some(degree => degree.type === school.name);
    const alreadyCompleted =
      completedDegree || this.educationHistory.some(entry => String(entry).includes(school.name));
    if (alreadyCompleted) {
      this.logEvent(`You already completed ${school.name}.`, 'neutral');
      return false;
    }

    if (school.type === 'university') {
      const graduatedHighSchool = this.educationHistory.some(entry =>
        entry.includes('High School')
      );
      if (this.age < 17 || !graduatedHighSchool) {
        this.logEvent('You must graduate high school before attending university.', 'bad');
        return false;
      }
    }

    // Check prerequisites for Grad School
    if (school.type === 'grad_school') {
      if (
        !checkPrereq(
          school.id,
          this.degrees.map(d => d.type)
        )
      ) {
        // Assuming degrees store 'type' as name of major for now
        // Wait, degrees logic is new. We need to store degree objects properly.
        // Let's assume degrees list contains Strings of major names or Objects.
        // Simplified check:
        this.logEvent(
          `You don't have the required degree for ${school.name}! (${school.req_degree})`,
          'bad'
        );
        return false;
      }
    }

    // Smarts Check
    if (this.smarts < school.smarts_req) {
      this.logEvent(`You were rejected from ${school.name} (Smarts too low).`, 'bad');
      return false;
    }

    // Scholarship / Loan Logic
    let tuition = school.cost;
    let paymentMethod = 'Cash';

    if (this.smarts > 90 && Math.random() < 0.3) {
      this.logEvent(`You WON a full scholarship to ${school.name}!`, 'good');
      tuition = 0;
      paymentMethod = 'Scholarship';
    } else if (this.money < school.cost) {
      // Must take loan
      this.logEvent(`You took out a student loan for ${school.name}.`, 'neutral');
      this.loans += school.cost;
      paymentMethod = 'Loan'; // Flag for logic
    } else {
      this.logEvent(
        `You paid tuition for ${school.name} ($${school.cost.toLocaleString()}).`,
        'neutral'
      );
    }

    this.currentSchool = { ...school, year: 1, tuitionPaid: tuition, paymentMethod };
    if (paymentMethod === 'Cash') {
      this.money -= tuition;
    }

    const schoolLabel =
      school.type === 'grad_school'
        ? 'Graduate School'
        : school.type === 'university'
          ? 'University'
          : school.name;
    this.logEvent(`You started studying ${school.major || school.name} at ${schoolLabel}.`, 'good');
    return true;
  }

  studyHard() {
    if (!this.currentSchool) {
      return;
    }

    // Burnout check.
    if (this.stress === undefined) {
      this.stress = 0;
    }

    if (this.stress > 70 && Math.random() < 0.3) {
      this.logEvent('You suffered from burnout while trying to study!', 'bad');
      this.updateStats({ health: -5, happiness: -5 });
      this.stress = Math.min(100, this.stress + 10);
      return;
    }

    // Performance gain
    this.currentSchool.performance = (this.currentSchool.performance || 50) + 10;
    if (this.currentSchool.performance > 100) {
      this.currentSchool.performance = 100;
    }

    // Smarts gain
    this.updateStats({ smarts: 2 });

    // Stress gain
    this.stress = Math.min(100, this.stress + 10);

    this.logEvent('You studied hard for your classes.', 'good');
  }

  dropOut() {
    if (!this.currentSchool) {
      return;
    }

    this.logEvent(`You dropped out of ${this.currentSchool.name}.`, 'bad');
    this.currentSchool = null;
    this.updateStats({ smarts: -5, happiness: -10 });
  }

  /**
   * Logs an event to the person's history
   * @param {string} text - Event description text
   * @param {string} type - Event type: 'good', 'bad', 'neutral', 'special'
   * @param {Object} metadata - Optional metadata about the event (supports messageKey, messageParams for i18n)
   */
  logEvent(text, type = 'neutral', metadata = {}) {
    const safeMetadata = metadata && typeof metadata === 'object' ? metadata : {};
    this.history.unshift({
      age: this.age,
      text,
      type,
      messageKey: typeof safeMetadata.messageKey === 'string' ? safeMetadata.messageKey : null,
      messageParams:
        safeMetadata.messageParams && typeof safeMetadata.messageParams === 'object'
          ? { ...safeMetadata.messageParams }
          : {},
    });
  }

  /**
   * Deserialization helper to create a Person object from saved data
   * @param {Object} data - Saved person data from localStorage
   * @returns {Person} Restored Person object with defaults ensured
   */
  static load(data) {
    try {
      const p = new Person();
      Object.assign(p, data);
      return p.ensureDefaults();
    } catch (e) {
      console.error('Person.load failed:', e);
      throw e;
    }
  }

  clone() {
    // Manual clone to ensure array independence while preserving functions/references
    this.ensureDefaults();
    const p = new Person();
    Object.assign(p, this);
    p.ensureDefaults();

    // Clone arrays/objects that stand to be mutated
    p.assets = this.assets.map(asset => ({
      ...asset,
      mortgage: asset.mortgage ? { ...asset.mortgage } : null,
      tenant: asset.tenant ? { ...asset.tenant } : null,
    }));
    p.portfolio = this.portfolio.map(position => ({
      ...position,
      history: [...(position.history || [])],
    }));
    p.band = this.band
      ? {
          ...this.band,
          members: this.band.members.map(m => ({ ...m })),
          albums: this.band.albums ? this.band.albums.map(a => ({ ...a })) : [],
        }
      : null;
    p.pets = this.pets.map(pet => ({ ...pet }));
    p.relationships = this.relationships.map(r => ({
      ...r,
      personalityTraits: [...(r.personalityTraits || [])],
      needs: [...(r.needs || [])],
      preferences: {
        likes: [...(r.preferences?.likes || [])],
        dislikes: [...(r.preferences?.dislikes || [])],
      },
      memories: (r.memories || []).map(memory => ({
        ...memory,
        details: { ...(memory.details || {}) },
      })),
      activeConflict: r.activeConflict ? { ...r.activeConflict } : null,
      promise: r.promise ? { ...r.promise } : null,
      financialArrangement: r.financialArrangement ? { ...r.financialArrangement } : null,
    }));
    p.history = this.history.map(event => ({
      ...event,
      messageParams: { ...(event.messageParams || {}) },
    }));
    p.statHistory = this.statHistory.map(snapshot => ({ ...snapshot }));
    p.educationHistory = [...this.educationHistory];
    p.degrees = this.degrees.map(degree => ({ ...degree }));
    p.traits = [...this.traits];
    p.citizenships = [...this.citizenships];
    p.completedChallenges = [...this.completedChallenges];
    p.lifeStats = { ...this.lifeStats };
    p.activeChallenge = this.activeChallenge ? { ...this.activeChallenge } : null;
    p.companies = this.companies.map(company => Company.fromData(company));
    p.addictionLevels = { ...this.addictionLevels };
    p.addictions = { ...this.addictions };
    p.treatmentTypes = Array.isArray(this.treatmentTypes) ? [...this.treatmentTypes] : null;
    p.retirementAccounts = { ...this.retirementAccounts };
    Object.keys(p.retirementAccounts).forEach(k => {
      p.retirementAccounts[k] = { ...this.retirementAccounts[k] };
    });
    p.fitness = { ...this.fitness };
    p.insurance = { ...this.insurance };
    Object.keys(p.insurance).forEach(k => {
      p.insurance[k] = { ...this.insurance[k] };
    });
    p.spaceProgram = this.spaceProgram ? { ...this.spaceProgram } : null;
    p.foundations = (this.foundations || []).map(foundation => ({ ...foundation }));
    p.legacyProjects = [...(this.legacyProjects || [])];
    p.clubs = [...(this.clubs || [])];
    p.collegeSport = this.collegeSport ? { ...this.collegeSport } : null;
    p.activeLawsuits = (this.activeLawsuits || []).map(l => ({ ...l }));
    p.lawsuitHistory = (this.lawsuitHistory || []).map(l => ({ ...l }));
    p.timeCapsules = (this.timeCapsules || []).map(tc => ({ ...tc }));
    p.memories = (this.memories || []).map(m => ({ ...m }));
    p.heirlooms = (this.heirlooms || []).map(h => ({ ...h }));
    p.worldNews = (this.worldNews || []).map(n => ({ ...n }));
    p.seasonalEventsThisYear = [...(this.seasonalEventsThisYear || [])];
    p.investments = { ...(this.investments || {}) };
    p.mafia = {
      ...(this.mafia || {}),
      family: this.mafia?.family ? { ...this.mafia.family } : null,
    };
    p.prisonStats = { ...(this.prisonStats || {}) };
    p.royalty = this.royalty ? { ...this.royalty } : null;
    p.will = this.will ? { ...this.will, allocations: { ...(this.will.allocations || {}) } } : null;
    p.politics = this.politics
      ? { ...this.politics, office: this.politics.office ? { ...this.politics.office } : null }
      : null;
    p.avatar = this.avatar ? { ...this.avatar } : null;
    p.market = this.market
      ? {
          ...this.market,
          realEstate: (this.market.realEstate || []).map(asset => ({ ...asset })),
          cars: (this.market.cars || []).map(asset => ({ ...asset })),
          jobs: (this.market.jobs || []).map(job => ({ ...job })),
        }
      : null;
    if (this.currentSchool) {
      p.currentSchool = { ...this.currentSchool };
    }
    if (this.job) {
      p.job = { ...this.job };
    }

    // Clone social state
    p.social = {
      platforms: { ...this.social.platforms }, // Shallow copy of platforms map
      totalFollowers: this.social.totalFollowers,
      isInfluencer: this.social.isInfluencer,
    };
    // Deep copy platform objects
    Object.keys(p.social.platforms).forEach(key => {
      p.social.platforms[key] = { ...this.social.platforms[key] };
    });

    // pendingEvent is untouched (reference copy) so we keep functions

    // Deep-copy geopolitical state fields
    if (this.geopoliticalState) {
      p.geopoliticalState = JSON.parse(JSON.stringify(this.geopoliticalState));
    }
    p.countryRelations = {};
    Object.keys(this.countryRelations || {}).forEach(k => {
      p.countryRelations[k] = { ...this.countryRelations[k] };
    });
    p.wars = {};
    Object.keys(this.wars || {}).forEach(k => {
      p.wars[k] = { ...this.wars[k] };
    });
    p.unResolutions = (this.unResolutions || []).map(r => ({ ...r }));
    p.diplomaticHistory = (this.diplomaticHistory || []).map(d => ({ ...d }));
    p.cabinet = this.cabinet
      ? Object.fromEntries(
          Object.entries(this.cabinet).map(([pos, member]) => [pos, { ...member }])
        )
      : null;
    p.policies = this.policies ? { ...this.policies } : null;
    p.pendingGeopoliticalEvent = this.pendingGeopoliticalEvent
      ? { ...this.pendingGeopoliticalEvent }
      : null;

    return p;
  }

  practiceSkill(skillId) {
    if ((this.energy ?? 100) < 20) {
      this.logEvent("You're too exhausted to practice right now.", 'neutral');
      return;
    }
    this.energy = Math.max(0, (this.energy ?? 100) - 20);

    if (skillId === 'voice') {
      const current = this.skills.voice;
      const dim = 1 - Math.pow((current || 0) / 100, 1.5);
      const improvement = Math.max(1, Math.round((Math.floor(Math.random() * 6) + 1) * dim));
      const newVal = Math.min(100, (current || 0) + improvement);
      this.skills.voice = newVal;
      this.logEvent(`You took voice lessons. Skill: ${newVal}%`, 'good');
      this.updateStats({ happiness: 2 });
      return;
    }

    if (['martialArts', 'cooking', 'coding', 'instrument'].includes(skillId)) {
      const current = this.skills[skillId] || 0;
      const dim = 1 - Math.pow(current / 100, 1.5);
      const improvement = Math.max(1, Math.round((10 + Math.floor(this.smarts / 10)) * dim));
      const newVal = Math.min(100, current + improvement);
      this.skills[skillId] = newVal;
      this.logEvent(`You practiced ${skillId}. Your skill is now ${newVal}.`, 'good');
      this.updateStats({ happiness: 5, smarts: 1 });
      return;
    }

    if (!this.skills.instruments) {
      this.skills.instruments = {};
    }
    const current = this.skills.instruments[skillId] || 0;
    const dim = 1 - Math.pow(current / 100, 1.5);
    const improvement = Math.max(1, Math.round((Math.floor(Math.random() * 6) + 1) * dim));
    const newVal = Math.min(100, current + improvement);
    this.skills.instruments[skillId] = newVal;
    this.logEvent(`You practiced the ${skillId}. Skill: ${newVal}%`, 'good');
    this.updateStats({ happiness: 2 });
  }

  formBand(name, genre) {
    if (this.band) {
      this.logEvent('You are already in a band.', 'neutral');
      return null;
    }
    const memberCount = 2 + Math.floor(Math.random() * 2) + (this.fame > 30 ? 1 : 0);
    this.band = {
      name,
      genre: genre || 'rock',
      members: generateBandMembers(memberCount),
      cohesion: 30 + Math.floor(Math.random() * 30),
      totalEarnings: 0,
      albums: [],
      formedAtAge: this.age,
    };
    this.logEvent(`🎸 You formed "${name}"! The band has ${memberCount} members.`, 'good');
    return this.band;
  }

  disband() {
    if (!this.band) {
      this.logEvent("You're not in a band.", 'neutral');
      return;
    }
    const { name } = this.band;
    const earnings = this.band.totalEarnings || 0;
    this.band = null;
    this.logEvent(
      `"${name}" has disbanded. Total earnings: $${earnings.toLocaleString()}.`,
      'neutral'
    );
  }

  rest(amount = 30) {
    this.energy = Math.min(100, (this.energy ?? 100) + amount);
  }

  inherit(childRel) {
    if (!childRel || childRel.type !== 'Child') {
      return null;
    }

    const childFirstName =
      String(childRel.name || 'Heir')
        .trim()
        .split(/\s+/)[0] || 'Heir';
    const childGender =
      String(childRel.gender || '').toLowerCase() === 'female' ? 'Female' : 'Male';
    const newPerson = new Person(childFirstName, this.name.last, childGender, this.country);
    newPerson.age = Math.max(0, Math.floor(Number(childRel.age) || 0));
    newPerson.city = this.city;
    newPerson.birthCity = this.city;
    newPerson.birthCountry = this.country;
    newPerson.citizenships = [...this.citizenships];
    newPerson.traits = Array.isArray(childRel.traits) ? [...childRel.traits] : [];

    // Apply genetic inherited stats from parent
    if (childRel.inheritedSmarts != null) {
      newPerson.smarts = this.clamp(Number(childRel.inheritedSmarts), 10, 95);
    }
    if (childRel.inheritedLooks != null) {
      newPerson.looks = this.clamp(Number(childRel.inheritedLooks), 10, 95);
    }
    if (childRel.inheritedHealth != null) {
      newPerson.health = this.clamp(Number(childRel.inheritedHealth), 10, 95);
    }

    // Apply family generation bonuses
    const bonus = familyTree.getGenerationBonus();
    newPerson.smarts = this.clamp(newPerson.smarts + bonus.smarts, 10, 98);
    newPerson.looks = this.clamp(newPerson.looks + bonus.looks, 10, 98);
    newPerson.health = this.clamp(newPerson.health + bonus.health, 10, 98);
    newPerson.happiness = this.clamp(newPerson.happiness + bonus.happiness, 10, 100);
    newPerson.fame = Math.max(0, newPerson.fame + bonus.fame);
    newPerson.money += bonus.money;

    // Inherit family heirlooms from the family vault
    const heirlooms = familyTree.getHeirlooms();
    if (heirlooms.length > 0) {
      newPerson.heirlooms = heirlooms.map(h => ({ ...h }));
      newPerson.logEvent(
        `Your family heirlooms (${heirlooms.length}) have been passed to you.`,
        'good'
      );
    }

    const namedBeneficiary = this.will?.primaryBeneficiary;
    const receivesEstate = !namedBeneficiary || namedBeneficiary === childRel.id;
    const lifePolicy = this.insurance?.life;
    const lifeInsurancePayout =
      receivesEstate && lifePolicy && !lifePolicy.cancelled
        ? Math.max(0, Number(lifePolicy.payout) || 500000)
        : 0;
    const grossEstate = receivesEstate ? this.getTotalEstateValue() + lifeInsurancePayout : 0;
    const estateTax = Math.floor(this.calculateEstateTax(grossEstate));
    const netEstate = Math.max(0, Math.floor(grossEstate - estateTax));

    const inheritedAssets = receivesEstate
      ? this.assets.map(asset => ({
          ...asset,
          mortgage: asset.mortgage ? { ...asset.mortgage } : null,
          tenant: asset.tenant ? { ...asset.tenant } : null,
          renovations: [...(asset.renovations || [])],
        }))
      : [];
    const assetEquity = inheritedAssets.reduce((sum, asset) => {
      const value = Math.max(0, Number(asset.value ?? asset.price) || 0);
      const mortgage = asset.isMortgaged ? Math.max(0, Number(asset.mortgage?.balance) || 0) : 0;
      return sum + Math.max(0, value - mortgage);
    }, 0);

    if (assetEquity > netEstate) {
      newPerson.assets = [];
      newPerson.money = netEstate;
    } else {
      newPerson.assets = inheritedAssets;
      newPerson.money = netEstate - assetEquity;
    }

    newPerson.relationships = [
      {
        id: `deceased_parent_${Date.now()}`,
        name: this.getFullName(),
        type: 'Parent',
        age: this.age,
        stat: 100,
        status: 'Deceased',
      },
    ];
    GameEngine.generateYearlyMarket(newPerson);

    newPerson.logEvent(`You are ${newPerson.getFullName()}.`, 'neutral');
    if (receivesEstate) {
      const insuranceText =
        lifeInsurancePayout > 0
          ? `, including a $${lifeInsurancePayout.toLocaleString()} life-insurance payout`
          : '';
      newPerson.logEvent(
        `Your parent passed away. You inherited a net estate of $${netEstate.toLocaleString()}${insuranceText} after $${estateTax.toLocaleString()} in estate tax.`,
        'good'
      );
    } else {
      newPerson.logEvent(
        `Your parent's will named another beneficiary, so you did not inherit the estate.`,
        'neutral'
      );
    }

    return newPerson.ensureDefaults();
  }

  postToSocial(platformId, postId) {
    handlePost(this, platformId, postId);
  }

  monetizeSocial(platformId) {
    handleMonetization(this, platformId);
  }

  generateChildInheritedStats() {
    const parentAvg = stat => this[stat] || 50;
    const inheritChance = stat => {
      const parentVal = parentAvg(stat);
      const roll = Math.random();
      if (roll < 0.4) {
        return Math.round(parentVal + (Math.random() * 20 - 10));
      }
      if (roll < 0.7) {
        return Math.round(parentVal + (Math.random() * 15 - 5));
      }
      return Math.round(30 + Math.random() * 60);
    };
    return {
      smarts: this.clamp(inheritChance('smarts'), 10, 95),
      looks: this.clamp(inheritChance('looks'), 10, 95),
      health: this.clamp(inheritChance('health'), 10, 95),
    };
  }

  generateChildTraits() {
    const traits = [];
    const possibleTraits = ['Musical', 'Athletic', 'Genius', 'Fertile'];

    // Inheritance (50% chance for each parent trait)
    (this.traits || []).forEach(trait => {
      if (Math.random() < 0.5) {
        traits.push(trait);
      }
    });

    // Mutation (10% chance for a new random trait)
    if (Math.random() < 0.1) {
      const newTrait = possibleTraits[Math.floor(Math.random() * possibleTraits.length)];
      if (!traits.includes(newTrait)) {
        traits.push(newTrait);
      }
    }
    return traits;
  }

  commitCrime(type, forceSuccess = null) {
    if (this.age < 12) {
      this.logEvent('You are too young to commit crimes.', 'bad');
      return false;
    }
    if (this.isInPrison) {
      this.logEvent('You are already in prison!', 'bad');
      return false;
    }

    const crimeProfiles = {
      shoplifting: {
        name: 'Shoplifting',
        successChance: 0.82,
        payout: [20, 400],
        sentence: [0, 1],
        notoriety: 1,
        effects: { stress: 4, karma: -3 },
      },
      scam: {
        name: 'Online Scam',
        successChance: 0.58,
        payout: [500, 8000],
        sentence: [1, 4],
        notoriety: 5,
        effects: { stress: 8, karma: -8 },
        smartsBonus: true,
      },
      hacking: {
        name: 'System Hacking',
        successChance: 0.35,
        payout: [5000, 100000],
        sentence: [2, 10],
        notoriety: 10,
        effects: { stress: 15, karma: -15 },
        smartsBonus: true,
      },
      car_theft: {
        name: 'Grand Theft Auto',
        successChance: 0.42,
        payout: [2500, 25000],
        sentence: [2, 7],
        notoriety: 9,
        effects: { stress: 16, karma: -12 },
        healthBonus: true,
      },
      burglary: {
        name: 'Burglary',
        successChance: 0.6,
        payout: [500, 5000],
        sentence: [1, 5],
        notoriety: 5,
        effects: { stress: 10, karma: -10 },
      },
      fraud: {
        name: 'Fraud',
        successChance: 0.38,
        payout: [10000, 120000],
        sentence: [3, 12],
        notoriety: 14,
        effects: { stress: 22, karma: -18 },
        smartsBonus: true,
      },
      assault: {
        name: 'Assault',
        successChance: 0.45,
        payout: [0, 500],
        sentence: [1, 6],
        notoriety: 8,
        effects: { stress: 20, karma: -20, health: -4 },
        healthBonus: true,
      },
      robbery: {
        name: 'Bank Robbery',
        successChance: 0.15,
        payout: [50000, 500000],
        sentence: [10, 25],
        notoriety: 18,
        effects: { stress: 50, karma: -30 },
      },
    };

    const profile = crimeProfiles[type];
    if (!profile) {
      return false;
    }

    let { successChance } = profile;
    if (profile.smartsBonus) {
      successChance += (this.smarts - 50) / 500;
    }
    if (profile.healthBonus) {
      successChance += (this.health - 50) / 600;
    }
    if (this.hasTrait('Reckless')) {
      successChance += 0.05;
    }
    if (this.hasTrait('Genius') && profile.smartsBonus) {
      successChance += 0.08;
    }
    successChance = Math.max(0.05, Math.min(0.95, successChance));

    const payout = this.randomStat(profile.payout[0], profile.payout[1]);
    let sentence = this.randomStat(profile.sentence[0], profile.sentence[1]);
    const isSuccess = forceSuccess !== null ? forceSuccess : Math.random() < successChance;
    this.lifeStats.crimesCommitted++;
    this.updateStats(profile.effects);

    if (isSuccess) {
      this.money += payout;
      this.notoriety = this.clamp(this.notoriety + profile.notoriety);
      this.logEvent(
        `You successfully committed ${profile.name} and made $${payout.toLocaleString()}.`,
        'good'
      );
      this.updateStats({ happiness: profile.payout[1] > 10000 ? 15 : 5 });
      return true;
    }

    if (sentence > 0 && this.money >= 5000 && Math.random() < 0.35) {
      const legalBill = Math.min(this.money, this.randomStat(5000, 25000));
      this.money -= legalBill;
      sentence = Math.max(0, Math.floor(sentence / 2));
      this.logEvent(
        `Your lawyer reduced the sentence for ${profile.name}. Legal fees cost $${legalBill.toLocaleString()}.`,
        'neutral'
      );
    }

    if (sentence <= 0) {
      const fine = Math.min(this.money, Math.max(100, payout * 2));
      this.money -= fine;
      this.logEvent(
        `You were caught attempting ${profile.name} and paid a $${fine.toLocaleString()} fine.`,
        'bad'
      );
      this.notoriety = this.clamp(this.notoriety + Math.ceil(profile.notoriety / 2));
      return false;
    }

    this.logEvent(`You were caught attempting ${profile.name}!`, 'bad');
    this.notoriety = this.clamp(this.notoriety + profile.notoriety);
    this.goToPrison(sentence);
    return false;
  }

  // Prison Methods
  prisonAction(action) {
    if (!this.isInPrison) {
      return;
    }

    if (action === 'workout') {
      if ((this.energy ?? 100) < 20) {
        this.logEvent("You're too exhausted to work out.", 'neutral');
        return;
      }
      this.energy = Math.max(0, (this.energy ?? 100) - 20);
      const respectDim = 1 - Math.pow((this.prisonStats.respect || 0) / 100, 1.5);
      const respectGain = Math.max(1, Math.round(5 * respectDim));
      this.logEvent('You worked out in the yard.', 'good');
      this.updateStats({ health: 3, happiness: 1 });
      this.prisonStats.respect = Math.min(100, (this.prisonStats.respect || 0) + respectGain);
    } else if (action === 'library') {
      if ((this.energy ?? 100) < 15) {
        this.logEvent("You're too exhausted to read.", 'neutral');
        return;
      }
      this.energy = Math.max(0, (this.energy ?? 100) - 15);
      const smartDim = 1 - Math.pow((this.smarts || 0) / 100, 1.5);
      const smartGain = Math.max(1, Math.round(3 * smartDim));
      this.logEvent('You read a book in the prison library.', 'good');
      this.updateStats({ smarts: smartGain });
    } else if (action === 'gang') {
      if (this.prisonStats.gang) {
        this.logEvent('You hung out with your gang.', 'good');
        this.prisonStats.respect += 2;
      } else {
        // Try join
        if (this.notoriety > 40) {
          this.prisonStats.gang = 'The Skulls';
          this.logEvent("You were initiated into 'The Skulls' prison gang.", 'good');
          this.prisonStats.respect += 20;
        } else {
          this.logEvent('The gangs ignored you. You need more street cred.', 'neutral');
        }
      }
    } else if (action === 'riot') {
      if (Math.random() < 0.3) {
        this.logEvent('You started a RIOT! 10 people were injured.', 'bad');
        this.prisonSentence += 2;
        this.logEvent('Your sentence was extended by 2 years.', 'bad');
        this.prisonStats.respect += 15;
      } else {
        this.logEvent('You failed to incite a riot. The guards beat you.', 'bad');
        this.updateStats({ health: -20 });
      }
    } else if (action === 'escape') {
      // Escape logic -> Handled by Minigame usually, but here is the result handler or trigger
      // For now, let's do RNG Escape
      const chance = (this.smarts + this.health) / 400; // Max 50%
      if (Math.random() < chance) {
        this.isInPrison = false;
        this.prisonSentence = 0;
        this.logEvent('YOU ESCAPED PRISON!', 'good');
        this.notoriety += 50;
        this.updateStats({ happiness: 100 });
      } else {
        this.logEvent('Escape attempt FAILED! You were beaten and sentence extended.', 'bad');
        this.updateStats({ health: -30 });
        this.prisonSentence += 3;
      }
    } else if (action === 'appeal') {
      if (this.money < 5000) {
        this.logEvent("You can't afford a lawyer ($5,000).", 'bad');
        return;
      }
      this.money -= 5000;
      if (Math.random() < 0.2) {
        this.prisonSentence = 0;
        this.isInPrison = false;
        this.logEvent('Appeal SUCCESSFUL! You are a free person.', 'good');
      } else {
        this.logEvent('Appeal DENIED. You remain in prison.', 'bad');
      }
    }
  }

  joinMafia(family) {
    if (this.notoriety < 30) {
      this.logEvent(
        `The ${family.name} laughed at you. "Come back when you've done some real dirt."`,
        'bad'
      );
      return false;
    }
    this.mafia = {
      family,
      rank: 'associate',
      standing: 10,
    };
    this.job = { title: 'Mafia Associate', salary: 0, performance: 50 }; // Special job
    this.logEvent(`You have been inducted into the ${family.name} as an Associate.`, 'good');
    return true;
  }

  performMafiaAction(actionId) {
    if (!this.mafia.family) {
      return;
    }

    const result = performMafiaCrime(this, actionId);
    if (!result) {
      return;
    }

    this.logEvent(result.text, result.success ? 'good' : 'bad');

    if (result.success) {
      if (result.money) {
        this.money += result.money;
      }
      if (result.standing) {
        this.mafia.standing = Math.min(100, (this.mafia.standing || 0) + result.standing);
      }
      if (result.notoriety) {
        this.notoriety = Math.min(100, this.notoriety + result.notoriety);
      }

      // Promotion Check
      this.promoteMafia();
    } else {
      if (result.standing) {
        this.mafia.standing = Math.max(0, (this.mafia.standing || 0) + result.standing);
      } // Can lose standing

      if (result.caught) {
        this.logEvent('You were caught by the police!', 'bad');
        this.goToPrison(5); // Automatic 5 years for now
        // Mafia kicks you out logic? Or loss of standing?
        this.mafia.standing = 0;
      } else {
        this.mafia.standing = Math.max(0, (this.mafia.standing || 0) - 5);
      }
    }
  }

  promoteMafia() {
    if (!this.mafia.family) {
      return;
    }

    const currentRankIndex = MAFIA_RANKS.findIndex(r => r.id === this.mafia.rank);
    if (currentRankIndex === -1 || currentRankIndex >= MAFIA_RANKS.length - 1) {
      return;
    } // Top rank or invalid

    const nextRank = MAFIA_RANKS[currentRankIndex + 1];
    if (this.mafia.standing >= nextRank.standing_req) {
      // Extra RNG check for higher ranks?
      this.mafia.rank = nextRank.id;
      this.job.title = `${nextRank.title} (${this.mafia.family.name})`;
      this.job.salary = nextRank.salary;

      this.logEvent(
        `You have been PROMOTED to ${nextRank.title} in the ${this.mafia.family.name}!`,
        'good'
      );
      this.updateStats({ happiness: 20, notoriety: 10 });
    }
  }

  goToPrison(years) {
    this.isInPrison = true;
    this.prisonSentence = years;
    this.lifeStats.jailYears += years;
    this.quitJob(); // Lose job
    this.logEvent(`You have been sentenced to ${years} years in prison.`, 'bad');
    this.updateStats({ happiness: -50, looks: -10 });
  }

  postSocialMedia(platform, postType) {
    let viralChance = postType.viral_chance;
    if (postType.looks_bonus && this.looks > 80) {
      viralChance += 20;
    }

    const roll = Math.random() * 100;
    const isViral = roll < viralChance;

    let newFollowers = 0;
    let happinessChange = 0;

    if (isViral) {
      newFollowers = Math.floor(Math.random() * 1000) + 100;
      if (this.social.totalFollowers > 10000) {
        newFollowers *= 10;
      } // Scaling
      this.logEvent(
        `Your ${postType.title} on ${platform.name} went VIRAL! Gained ${newFollowers.toLocaleString()} followers.`,
        'good'
      );
      happinessChange = 10;
      this.fame = (this.fame || 0) + 2;
    } else {
      newFollowers = Math.floor(Math.random() * 20) + 1;
      this.logEvent(
        `You posted a ${postType.title} on ${platform.name}. Gained ${newFollowers} followers.`,
        'neutral'
      );
      happinessChange = 2;
    }

    // Risk Check (Trolls, Cancellation)
    if (Math.random() * 100 < postType.risk) {
      this.logEvent(`People hated your post. You lost followers!`, 'bad');
      newFollowers = -Math.floor(this.social.totalFollowers * 0.05); // Lose 5%
      happinessChange = -10;
    }

    this.social.totalFollowers = Math.max(0, (this.social.totalFollowers || 0) + newFollowers);
    this.updateStats({ happiness: happinessChange });

    // Influencer Status
    if (this.social.totalFollowers > 100000 && !this.social.isInfluencer) {
      this.social.isInfluencer = true;
      this.logEvent('You are now a verified Social Media Influencer!', 'good');
      this.fame = 20;
    }
  }

  buyFollowers(platform) {
    const cost = 100;
    if (this.money < cost) {
      this.logEvent('You assume you can buy followers with good looks? You need cash.', 'bad');
      return;
    }
    this.money -= cost;
    const bought = 500;
    this.social.totalFollowers = (this.social.totalFollowers || 0) + bought;
    this.logEvent(`You bought ${bought} followers on ${platform.name}. Shameful.`, 'neutral');
  }

  startCampaign(office) {
    if (this.money < office.cost) {
      this.logEvent(
        `You need $${office.cost.toLocaleString()} to run for ${office.title}.`,
        'bad',
        {
          messageKey: 'politics.campaign.need_funds',
          messageParams: { amount: office.cost.toLocaleString(), office: office.title },
        }
      );
      return false;
    }
    if (this.age < office.minAge) {
      this.logEvent(`You must be at least ${office.minAge} to run for ${office.title}.`, 'bad', {
        messageKey: 'politics.campaign.minimum_age',
        messageParams: { age: office.minAge, office: office.title },
      });
      return false;
    }

    this.money -= office.cost;
    this.politics = {
      office,
      approval: 40, // Start with 40% polling
      funds: office.cost, // Initial funds committed
      weeksLeft: 10, // Campaign duration
    };
    this.logEvent(`You announced your candidacy for ${office.title}! Campaign started.`, 'good', {
      messageKey: 'politics.campaign.announced',
      messageParams: { office: office.title },
    });
    return true;
  }

  campaignAction(action) {
    if (!this.politics) {
      return;
    }

    if (action.id === 'fundraise') {
      const raised = this.randomStat(1000, 10000) * (this.fame ? 2 : 1);
      this.politics.funds += raised;
      this.logEvent(`You held a fundraiser and raised $${raised.toLocaleString()}!`, 'good', {
        messageKey: 'politics.campaign.fundraiser',
        messageParams: { amount: raised.toLocaleString() },
      });
      this.politics.approval += 1;
    } else {
      // Cost check (campaign funds)
      if (this.politics.funds < action.cost) {
        this.logEvent('Your campaign is broke! Fundraise more.', 'bad', {
          messageKey: 'politics.campaign.insufficient_funds',
          messageParams: {},
        });
        return;
      }
      this.politics.funds -= action.cost;

      // Success Logic
      let successChance = 70 + this.smarts / 5 + this.looks / 5;
      if (action.risk > 0) {
        successChance -= action.risk;
      }

      if (Math.random() * 100 < successChance) {
        this.politics.approval = Math.min(100, this.politics.approval + action.impact);
        this.logEvent(`Campaign: ${action.title} was a success! Polls +${action.impact}%`, 'good', {
          messageKey: 'politics.campaign.action_success',
          messageParams: { action: action.title, impact: action.impact },
        });
      } else {
        const drop = Math.floor(action.impact / 2);
        this.politics.approval = Math.max(0, this.politics.approval - drop);
        this.logEvent(`Campaign: ${action.title} backfired! Polls -${drop}%`, 'bad', {
          messageKey: 'politics.campaign.action_backfire',
          messageParams: { action: action.title, impact: drop },
        });
      }
    }

    this.politics.weeksLeft--;

    // Election Day
    if (this.politics.weeksLeft <= 0) {
      this.holdElection();
    }
  }

  holdElection() {
    const { office } = this.politics;
    const winChance = this.politics.approval; // Direct % chance based on polling

    if (Math.random() * 100 < winChance) {
      // Victory
      this.logEvent(`ELECTION RESULTS: YOU WON! You are now the ${office.title}!`, 'good', {
        messageKey: 'politics.election.won',
        messageParams: { office: office.title },
      });
      this.job = {
        title: office.title,
        salary: office.salary,
        performance: 50,
        isPolitical: true,
        yearsLeft: office.term,
        termYears: office.term,
        approval: this.politics.approval,
      };
      this.fame = Math.min(100, (this.fame || 0) + office.prestige);
      if (office.id === 'president') {
        this.isHeadOfState = true;
      }
      this.politics = null; // End campaign
    } else {
      // Defeat
      this.logEvent(`ELECTION RESULTS: You lost the election for ${office.title}.`, 'bad', {
        messageKey: 'politics.election.lost',
        messageParams: { office: office.title },
      });
      this.politics = null;
    }
  }

  joinMilitary(branch, isOfficer = false) {
    if (this.job) {
      this.logEvent('You must quit your current job first.', 'bad');
      return false;
    }

    if (isOfficer) {
      // Requirement: University Degree
      const hasDegree = this.degrees.length > 0; // Simplified check
      if (!hasDegree) {
        this.logEvent('You need a university degree to join as an Officer!', 'bad');
        return false;
      }
    }

    const type = isOfficer ? 'officer' : 'enlisted';
    const rank = getRank(type, 0);

    this.job = {
      title: `${rank.title} (${branch.name})`,
      salary: rank.salary,
      performance: 50,
      isMilitary: true,
      branch: branch.id,
      rankType: type,
      rankIndex: 0,
    };
    this.logEvent(`You enlisted in the ${branch.name} as a ${rank.title}. Sir, yes sir!`, 'good');
    return true;
  }

  promoteMilitary() {
    if (!this.job || !this.job.isMilitary) {
      return;
    }

    // Check if next rank exists
    const nextIndex = this.job.rankIndex + 1;
    const nextRank = getRank(this.job.rankType, nextIndex);
    const currentRank = getRank(this.job.rankType, this.job.rankIndex);

    if (nextRank.id === currentRank.id) {
      return;
    } // Already max rank

    this.job.rankIndex = nextIndex;
    this.job.salary = nextRank.salary;
    this.job.title = `${nextRank.title} (${this.job.branch})`; // Simplified Branch Name check

    this.logEvent(`You were promoted to ${nextRank.title}!`, 'good');
    this.updateStats({ happiness: 10, fame: 5 });
  }

  buyInvestment(investment, amount) {
    amount = Math.floor(Number(amount) || 0);
    if (
      !investment ||
      typeof investment.id !== 'string' ||
      typeof investment.name !== 'string' ||
      amount <= 0
    ) {
      this.logEvent('Choose a positive amount to invest.', 'bad');
      return false;
    }

    if (this.money < amount) {
      this.logEvent("You don't have enough money to invest that.", 'bad');
      return false;
    }

    this.money -= amount;

    // Check if already owns logic? Or just push new lot?
    // Aggregating is cleaner
    let position = this.portfolio.find(p => p.id === investment.id);
    if (!position) {
      position = {
        id: investment.id,
        name: investment.name,
        type: investment.type,
        invested: 0,
        currentValue: 0,
        history: [],
      };
      this.portfolio.push(position);
    }

    position.invested += amount;
    position.currentValue += amount; // Initial value = cost
    position.history.push({ age: this.age, value: position.currentValue });
    position.history = position.history.slice(-12);

    this.logEvent(`You invested $${amount.toLocaleString()} in ${investment.name}.`, 'neutral');
    return true;
  }

  sellInvestment(investmentId) {
    const positionIndex = this.portfolio.findIndex(p => p.id === investmentId);
    if (positionIndex === -1) {
      return;
    }

    const position = this.portfolio[positionIndex];
    const currentValue = Math.max(0, Number(position.currentValue) || 0);
    const invested = Math.max(0, Number(position.invested) || 0);
    const profit = currentValue - invested;

    this.money += currentValue;

    if (profit >= 0) {
      this.logEvent(
        `You sold your position in ${position.name} for a profit of $${profit.toLocaleString()}.`,
        'good'
      );
    } else {
      this.logEvent(
        `You sold your position in ${position.name} at a loss of $${Math.abs(profit).toLocaleString()}.`,
        'bad'
      );
    }

    this.portfolio.splice(positionIndex, 1);
  }

  sellPartialInvestment(investmentId, sellPct) {
    const pct = Math.max(0, Math.min(1, Number(sellPct) || 0));
    if (pct <= 0 || pct > 1) {
      return false;
    }

    const positionIndex = this.portfolio.findIndex(p => p.id === investmentId);
    if (positionIndex === -1) {
      return false;
    }

    const position = this.portfolio[positionIndex];
    const sellValue = Math.floor(position.currentValue * pct);
    const sellCost = Math.floor(position.invested * pct);
    const sellDividends = Math.floor((position.totalDividends || 0) * pct);
    const profit = sellValue - sellCost;

    this.money += sellValue;

    position.currentValue -= sellValue;
    position.invested -= sellCost;
    position.totalDividends = (position.totalDividends || 0) - sellDividends;

    if (position.currentValue <= 0) {
      this.portfolio.splice(positionIndex, 1);
    }

    if (profit >= 0) {
      this.logEvent(
        `Sold ${Math.round(pct * 100)}% of ${position.name} for a profit of $${profit.toLocaleString()}.`,
        'good'
      );
    } else {
      this.logEvent(
        `Sold ${Math.round(pct * 100)}% of ${position.name} at a loss of $${Math.abs(profit).toLocaleString()}.`,
        'bad'
      );
    }

    return true;
  }

  visitDoctor(treatment) {
    const baseCost = Math.max(0, Number(treatment?.cost) || 0);
    if (!treatment || typeof treatment.id !== 'string') {
      return false;
    }
    const healthPolicy =
      treatment.id !== 'witch_doctor' && this.insurance?.health && !this.insurance.health.cancelled
        ? this.insurance.health
        : null;
    const coverage = healthPolicy ? this.clamp(Number(healthPolicy.coverage) || 0, 0, 1) : 0;
    const cost = healthPolicy ? Math.max(10, Math.floor(baseCost * (1 - coverage))) : baseCost;

    if (this.money < cost) {
      this.logEvent("You can't afford the medical bill!", 'bad');
      return false;
    }
    this.money -= cost;
    if (healthPolicy) {
      healthPolicy.claims = (Number(healthPolicy.claims) || 0) + 1;
      this.logEvent(
        `Health insurance reduced your $${baseCost.toLocaleString()} bill to $${cost.toLocaleString()}.`,
        'good'
      );
    }

    if (treatment.id === 'witch_doctor') {
      this.logEvent("You drank the Witch Doctor's concoction...", 'neutral');
      if (Math.random() < 0.3) {
        // Cured (Full Health)
        this.health = 100;
        this.happiness = 100;
        this.logEvent('Miracle! You feel invincible!', 'good');
      } else {
        // Poisoned
        this.health = Math.max(0, this.health - 50);
        this.logEvent('It was poison! You feel terrible.', 'bad');
        if (this.health <= 0) {
          this.isAlive = false;
          this.logEvent('The Witch Doctor killed you.', 'bad');
        }
      }
      return true;
    }

    if (treatment.heal) {
      this.health = Math.min(100, this.health + treatment.heal);
      this.logEvent(`You went for a ${treatment.name}. You feel better.`, 'good');
    }
    if (treatment.happiness) {
      this.happiness = Math.min(100, this.happiness + treatment.happiness);
      this.logEvent(`You went to therapy. Mental health improved.`, 'good');
    }
    return true;
  }

  plasticSurgery(surgery) {
    if (this.money < surgery.cost) {
      this.logEvent("Insurance doesn't cover vanity. You need cash.", 'bad');
      return;
    }
    this.money -= surgery.cost;

    // Risk Check
    if (Math.random() * 100 < surgery.risk) {
      // Botched
      this.looks = Math.max(0, this.looks - 30);
      this.happiness -= 40;
      this.health -= 10;
      this.logEvent(`The ${surgery.name} was BOTCHED! You look like a monster.`, 'bad');
    } else {
      // Success
      this.looks = Math.min(100, this.looks + surgery.looks_gain);
      this.happiness += 20;
      this.logEvent(`The ${surgery.name} was a success! You look stunning.`, 'good');
    }
  }

  // --- ROYALTY ---
  performRoyalDuty() {
    if (!this.royalty) {
      return;
    }

    if (this.lastRoyalDutyAge === this.age) {
      this.logEvent("You've already performed your duties this month.", 'neutral');
      return;
    }
    if ((this.energy ?? 100) < 25) {
      this.logEvent("You're too exhausted for royal duties.", 'neutral');
      return;
    }
    this.energy = Math.max(0, (this.energy ?? 100) - 25);
    this.lastRoyalDutyAge = this.age;

    const respectDim = 1 - Math.pow((this.royalty.respect || 50) / 100, 1.5);
    const gain = Math.max(1, Math.round((Math.floor(Math.random() * 5) + 2) * respectDim));
    this.royalty.respect = Math.min(100, (this.royalty.respect || 50) + gain);
    this.fame = Math.min(100, (this.fame || 0) + Math.round(3 * respectDim));
    this.updateStats({ happiness: 3, stress: 10 });

    this.logEvent(`You performed a public royal duty. The people love you more now.`, 'good');
  }

  abdicate() {
    if (!this.royalty) {
      return;
    }

    this.logEvent(`You have abdicated your title of ${this.royalty.title}.`, 'neutral');
    this.royalty = null;
    this.money = Math.floor(this.money * 0.1); // Lose most wealth? Or keep it? keeping 10% seems fair penalty
    this.fame = Math.max(0, this.fame - 20); // Lose fame
    this.updateStats({ happiness: 20 }); // Relief?
  }

  executeSubject() {
    if (!this.royalty) {
      return;
    }

    if (Math.random() < 0.2) {
      // Revolts!
      this.logEvent(
        'The people revolted against your tyranny! You have been overthrown and exiled.',
        'bad'
      );
      this.royalty = null;
      this.money = 0;
      this.country = 'Exile';
    } else {
      this.logEvent('You had a subject executed for fun. You monster.', 'bad');
      this.royalty.respect = Math.max(0, (this.royalty.respect || 50) - 20);
      this.updateStats({ happiness: 5, karma: -50 });
    }
  }

  // --- ESTATE PLANNING ---
  createWill(primaryBeneficiary, allocations = {}) {
    if (!primaryBeneficiary) {
      this.logEvent('You must choose a primary beneficiary.', 'bad');
      return false;
    }

    this.will = {
      primaryBeneficiary,
      allocations, // { relationshipId: percentage }
      createdAt: this.age,
    };

    const beneficiaryName =
      this.relationships.find(r => r.id === primaryBeneficiary)?.name || 'someone';
    this.logEvent(
      `You created a will naming ${beneficiaryName} as your primary beneficiary.`,
      'neutral'
    );
    return true;
  }

  calculateEstateTax(totalValue) {
    // Progressive tax brackets
    if (totalValue < 1000000) {
      return 0;
    }
    if (totalValue < 5000000) {
      return totalValue * 0.15;
    }
    if (totalValue < 10000000) {
      return totalValue * 0.25;
    }
    return totalValue * 0.4;
  }

  getTotalEstateValue() {
    let total = Number(this.money) || 0;

    // Add asset values
    this.assets.forEach(asset => {
      total += Number(asset.value ?? asset.price) || 0;
      if (asset.isMortgaged && asset.mortgage) {
        total -= Math.max(0, Number(asset.mortgage.balance) || 0);
      }
    });

    // Add investment values
    this.portfolio.forEach(investment => {
      total += Number(investment.currentValue) || 0;
    });

    this.companies.forEach(company => {
      total +=
        Math.max(0, Number(company.valuation) || 0) *
        Math.max(0, Math.min(1, Number(company.ownerEquity ?? 1)));
    });

    Object.values(this.retirementAccounts || {}).forEach(account => {
      total += Math.max(0, Number(account?.balance) || 0);
    });

    // Subtract debts
    total -= Number(this.loans) || 0;
    total -= Number(this.personalDebt) || 0;

    return Math.max(0, total);
  }

  // --- CELEBRITY METHODS ---
  signEndorsementDeal(deal, actualValue) {
    this.logEvent(
      `You signed an endorsement deal with ${deal.name} worth $${actualValue.toLocaleString()}!`,
      'good'
    );
    this.money += actualValue;
    this.fame = Math.min(100, this.fame + 5);
    this.updateStats({ happiness: 20 });

    // Track active endorsement
    if (!this.activeEndorsements) {
      this.activeEndorsements = [];
    }
    this.activeEndorsements.push({
      dealId: deal.id,
      name: deal.name,
      value: actualValue,
      yearsRemaining: deal.duration,
    });
  }

  triggerScandal(scandal) {
    this.logEvent(scandal.text, scandal.type || 'bad');

    if (scandal.fameImpact) {
      this.fame = Math.max(0, Math.min(100, this.fame + scandal.fameImpact));
    }

    if (scandal.happinessImpact) {
      this.updateStats({ happiness: scandal.happinessImpact });
    }

    if (scandal.healthImpact) {
      this.updateStats({ health: scandal.healthImpact });
    }

    if (scandal.moneyCost) {
      this.money -= scandal.moneyCost;
      this.logEvent(
        `The scandal cost you $${scandal.moneyCost.toLocaleString()} in legal fees.`,
        'bad'
      );
    }

    if (scandal.relationshipDamage && this.relationships.length > 0) {
      // Damage relationship with spouse/partner
      const partner = this.relationships.find(r => r.type === 'Spouse' || r.type === 'Partner');
      if (partner) {
        partner.stat = Math.max(0, partner.stat - 40);
      }
    }
  }

  // --- BUSINESS METHODS ---
  startCompany(companyType, companyName) {
    if (this.age < 18) {
      this.logEvent('You must be 18 to start a company.', 'bad');
      return null;
    }
    const company = new Company(companyType, companyName, this.getFullName());

    if (!company.businessType) {
      this.logEvent('That business type is not available.', 'bad');
      return null;
    }

    if (company.businessType.requiresDegree) {
      const hasDegree = this.degrees.some(degree =>
        company.businessType.requiresDegree.includes(degree.type)
      );
      if (!hasDegree) {
        this.logEvent(
          `You need a degree in ${company.businessType.requiresDegree.join(' or ')} to start that company.`,
          'bad'
        );
        return null;
      }
    }

    if (this.money < company.businessType.startupCost) {
      this.logEvent(
        `You need $${company.businessType.startupCost.toLocaleString()} to start that business.`,
        'bad'
      );
      return null;
    }

    this.companies.push(company);
    this.money -= company.businessType.startupCost;
    this.lifeStats.companiesStarted++;

    this.logEvent(`You started ${companyName}, a new ${company.businessType.name}.`, 'good');
    this.updateStats({ happiness: 20 });

    return company;
  }

  manageCompany(companyId, action) {
    this.ensureDefaults();
    const company = this.companies.find(c => c.id === companyId);
    if (!company) {
      return { success: false, message: 'Company not found' };
    }

    let result;
    switch (action) {
      case 'hire':
        result = company.hireEmployee();
        if (result.success) {
          this.logEvent(`${company.name}: ${result.message}`, 'good');
        }
        return result;

      case 'fire':
        result = company.fireEmployee();
        if (result.success) {
          this.logEvent(`${company.name}: ${result.message}`, 'neutral');
        }
        return result;

      case 'ipo':
        result = company.goPublic();
        if (result.success) {
          this.logEvent(`${company.name}: ${result.message}`, 'good');
          this.fame = Math.min(100, this.fame + 20);
        } else {
          this.logEvent(`${company.name}: ${result.message}`, 'bad');
        }
        return result;

      case 'marketing':
        if (company.cash < 10000) {
          return { success: false, message: 'Need $10,000 company cash for marketing.' };
        }
        company.cash -= 10000;
        company.reputation = Math.min(100, company.reputation + 8);
        this.logEvent(
          `${company.name} launched a marketing campaign. Reputation improved.`,
          'good'
        );
        return { success: true, message: 'Marketing campaign launched.' };

      default:
        return { success: false, message: 'Unknown action' };
    }
  }

  closeCompany(companyId) {
    const index = this.companies.findIndex(c => c.id === companyId);
    if (index === -1) {
      return;
    }

    const company = this.companies[index];

    // Liquidate assets
    if (company.cash > 0) {
      const proceeds = Math.floor(
        company.cash * Math.max(0, Math.min(1, Number(company.ownerEquity ?? 1)))
      );
      this.money += proceeds;
      this.logEvent(
        `You closed ${company.name} and recovered $${proceeds.toLocaleString()} for your ownership stake.`,
        'neutral'
      );
    } else {
      this.logEvent(`You closed ${company.name}. It was bankrupt.`, 'bad');
    }

    this.companies.splice(index, 1);
    this.updateStats({ happiness: -10 });
  }

  attemptEmigration(countryName) {
    const manager = new ImmigrationManager(this);
    manager.citizenships = [...(this.citizenships || [this.country])];
    manager.visaApplications = this.visaApplications || 0;
    manager.visaRejections = this.visaRejections || 0;
    const result = manager.attemptEmigration(countryName);

    this.citizenships = manager.citizenships;
    this.visaApplications = manager.visaApplications;
    this.visaRejections = manager.visaRejections;

    if (result.success) {
      this.yearsInCurrentCountry = 0;
      this.yearsInCurrentCity = 0;
      const cities = CITIES.filter(c => c.country === countryName);
      if (cities.length > 0) {
        this.city = cities[Math.floor(Math.random() * cities.length)].name;
      } else {
        this.city = this.getDefaultCity(countryName);
      }
      this.logEvent(result.message, 'good');
      this.updateStats({ happiness: 10 });
    } else {
      this.logEvent(result.message, 'bad');
      this.updateStats({ happiness: -5 });
    }

    return result;
  }

  applyForCitizenship() {
    const manager = new ImmigrationManager(this);
    manager.citizenships = [...(this.citizenships || [this.country])];
    manager.visaApplications = this.visaApplications || 0;
    manager.visaRejections = this.visaRejections || 0;

    if (this.yearsInCurrentCountry < 5) {
      const remaining = 5 - this.yearsInCurrentCountry;
      const message = `You need ${remaining} more year${remaining === 1 ? '' : 's'} of residency before applying for citizenship.`;
      this.logEvent(message, 'neutral');
      return { success: false, message };
    }

    const result = manager.applyForCitizenship(this.country);
    this.citizenships = manager.citizenships;
    this.visaApplications = manager.visaApplications;
    this.visaRejections = manager.visaRejections;
    return result;
  }

  consumeSubstance(type) {
    return consumeSubstance(this, type);
  }
  enterRehab(type) {
    return enterRehab(this, type);
  }

  contributeToRetirement(accountType, amount) {
    return contributeToRetirement(this, accountType, amount);
  }
  withdrawFromRetirement(accountType, amount) {
    return withdrawFromRetirement(this, accountType, amount);
  }
  retire() {
    return retire(this);
  }

  exercise(type) {
    return exercise(this, type);
  }
  changeDiet(dietType) {
    return changeDiet(this, dietType);
  }

  buyInsurance(type, provider) {
    return buyInsurance(this, type, provider);
  }
  fileInsuranceClaim(type, damageAmount) {
    return fileInsuranceClaim(this, type, damageAmount);
  }
  cancelInsurance(type) {
    return cancelInsurance(this, type);
  }

  renovateProperty(assetIndex, renovationKey) {
    return renovateProperty(this, assetIndex, renovationKey);
  }
  flipProperty(assetIndex) {
    return flipProperty(this, assetIndex);
  }

  joinSpaceProgram(agency) {
    return joinSpaceProgram(this, agency);
  }
  startTraining(moduleName) {
    return startTraining(this, moduleName);
  }
  beginSpaceMission(mission) {
    return beginSpaceMission(this, mission);
  }
  goOnMission() {
    return goOnMission(this);
  }

  donateToCharity(causeId, amount) {
    return donateToCharity(this, causeId, amount);
  }
  startFoundation(foundationType) {
    return startFoundation(this, foundationType);
  }
  fundLegacyProject(projectName) {
    return fundLegacyProject(this, projectName);
  }

  joinClub(clubId) {
    return joinClub(this, clubId);
  }
  leaveClub(clubId) {
    return leaveClub(this, clubId);
  }

  tryoutForSport(sportId) {
    return tryoutForSport(this, sportId);
  }
  practiceSport() {
    return practiceSport(this);
  }
  goProfessional() {
    return goProfessional(this);
  }

  fileLawsuit(groundsId, target) {
    return fileLawsuit(this, groundsId, target);
  }
  sueRandomPerson() {
    return sueRandomPerson(this);
  }

  writeTimeCapsule(message) {
    return writeTimeCapsule(this, message);
  }
  readTimeCapsule(index) {
    return readTimeCapsule(this, index);
  }
}
