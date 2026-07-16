import { LIFE_EVENTS, CAREER_EVENTS, PANDEMIC_EVENTS } from './Events';
import { ROYAL_EVENTS, MILITARY_EVENTS, CELEBRITY_EVENTS, MAFIA_EVENTS } from './StatusEvents';
import { evaluateJobPerformance, JOBS } from './Job';
import { getCareerEffects, getTreeIdForJob, getSalaryMultiplier } from './CareerSkillTree';
import { AssetMarket } from './Assets';
import {
  STOCKS,
  CRYPTO,
  COMPANY_STOCKS,
  getInvestmentReturn,
  getDividendPayout,
  getAllInvestableAssets,
  getSectorPerformance,
  getMarketNews,
  generateIPO,
  getActiveIPOs,
  clearOldIPOs,
  ageIPOs,
  getInvestmentMarketState,
  restoreInvestmentMarketState,
  resetInvestmentMarketState,
} from './Investments';
import { ROYAL_COUNTRIES, getTitle } from './RoyaltyLogic';
import { processCollegeSports } from './CollegeSports';
import { processSeasonalEvent } from './Seasons';
import { processPoliticalYear } from './Politics';
import { processAddictions } from './Addiction';
import { processRetirement } from './Retirement';
import { processFitness } from './Fitness';
import { processInsurance } from './Insurance';
import { processConditions, tryContractDisease } from './Disease';
import { processSpaceCareer } from './SpaceCareer';
import { processClubs } from './Clubs';
import { processLawsuits } from './Lawsuits';
import {
  startWorldEvents,
  ageWorldEvents,
  getEventEffects,
  getActiveEventIds,
  getActiveWorldEvents,
  restoreWorldEvents,
  clearWorldEvents,
} from './WorldEvents';
import { CITIES, getCityByName } from './City';
import { buildWorldState, simulateWorldYear } from './WorldSimulation';
import { initializeGeopolitics, getCountryByName } from './GeoPolitics';
import { startWar, processWarYears } from './WarSystem';
import { proposeResolution, SECURITY_COUNCIL, RESOLUTION_TYPES, calculateUNInfluence } from './UnitedNations';
import { ImmigrationManager } from './ImmigrationSystem';
import { captureYearStart, finalizeAnnualRecap } from './AnnualRecap';
import { evaluateAmbition } from './LifeAmbitions';
import { NPCSimulator } from './NPCSimulator';

/**
 * Calculates progressive income tax based on US-style tax brackets
 * @param {number} income - Annual income to calculate tax for
 * @returns {number} Calculated tax amount
 */
export function calculateIncomeTax(income) {
  const taxableIncome = Math.max(0, Number(income) || 0);
  const brackets = [
    { ceiling: 30000, rate: 0.1 },
    { ceiling: 60000, rate: 0.18 },
    { ceiling: 100000, rate: 0.24 },
    { ceiling: 200000, rate: 0.3 },
    { ceiling: Infinity, rate: 0.37 },
  ];
  let tax = 0;
  let lowerBound = 0;
  for (const bracket of brackets) {
    const taxableAtRate = Math.max(0, Math.min(taxableIncome, bracket.ceiling) - lowerBound);
    tax += taxableAtRate * bracket.rate;
    if (taxableIncome <= bracket.ceiling) {
      break;
    }
    lowerBound = bracket.ceiling;
  }
  return Math.floor(tax);
}

function isTechnologyJob(job) {
  return (
    ['tech', 'data'].includes(job?.careerPath) ||
    ['app_dev', 'electrical_engineer', 'data_scientist'].includes(job?.id)
  );
}

export class GameEngine {
  static worldState = {
    economy: 'Normal',
    conflict: 'Peace',
    pandemic: false,
    activeWorldEvents: [],
  };

  static getGeopoliticalState(person) {
    if (!person.geopoliticalState) {
      person.geopoliticalState = buildWorldState();
    }
    if (!person.countryRelations) {
      initializeGeopolitics(person);
    }
    return person.geopoliticalState;
  }

  static getCountryForPerson(person) {
    const state = GameEngine.getGeopoliticalState(person);
    return Object.values(state.countries).find(c => c.name === person.country) || null;
  }

  static marketTrends = {
    indexFund: 100, // Starts at $100
    dogecoin: 0.5, // Starts at $0.50
  };

  static captureSimulationState() {
    return {
      version: 1,
      worldState: {
        ...this.worldState,
        activeWorldEvents: [...(this.worldState.activeWorldEvents || [])],
      },
      marketTrends: { ...this.marketTrends },
      worldEvents: getActiveWorldEvents(),
      investmentMarket: getInvestmentMarketState(),
    };
  }

  static restoreSimulationState(state = null) {
    const savedState = state && typeof state === 'object' ? state : {};
    const savedWorld =
      savedState.worldState && typeof savedState.worldState === 'object'
        ? savedState.worldState
        : {};
    const savedMarket =
      savedState.marketTrends && typeof savedState.marketTrends === 'object'
        ? savedState.marketTrends
        : {};
    const economy = ['Normal', 'Recession', 'Boom'].includes(savedWorld.economy)
      ? savedWorld.economy
      : 'Normal';
    const conflict = ['Peace', 'War'].includes(savedWorld.conflict)
      ? savedWorld.conflict
      : 'Peace';
    const indexFund = Number(savedMarket.indexFund);
    const dogecoin = Number(savedMarket.dogecoin);

    restoreWorldEvents(savedState.worldEvents || savedWorld.activeWorldEvents);
    restoreInvestmentMarketState(savedState.investmentMarket);

    this.worldState = {
      economy,
      conflict,
      pandemic: savedWorld.pandemic === true,
      activeWorldEvents: getActiveEventIds(),
    };
    this.marketTrends = {
      indexFund: Number.isFinite(indexFund) && indexFund > 0 ? indexFund : 100,
      dogecoin: Number.isFinite(dogecoin) && dogecoin > 0 ? dogecoin : 0.5,
    };

    return this.captureSimulationState();
  }

  static resetSimulationState() {
    clearWorldEvents();
    resetInvestmentMarketState();
    this.worldState = {
      economy: 'Normal',
      conflict: 'Peace',
      pandemic: false,
      activeWorldEvents: [],
    };
    this.marketTrends = { indexFund: 100, dogecoin: 0.5 };
    return this.captureSimulationState();
  }

  /**
   * Central one-year simulation tick — ordered pipeline.
   * Every sub-system runs in a deterministic order so that world, country,
   * family, NPC, health, career, and finance effects cascade properly.
   */
  static simulateYear(person) {
    if (!person.isAlive) return;

    person.age++;
    person.energy = 100;
    person.history = person.history.slice(0, 49);

    // 1. World & geopolitical changes
    this.updateWorldState(person);
    this.processWorldEvents(person);
    if (!person.isAlive) return;

    this.processGeopoliticalYear(person);
    this.applyCountryEffects(person);

    // 2. Economy & markets
    this.updateMarketPrices(person);
    this.generateYearlyMarket(person);

    // 3. Family milestones (before random events)
    this.processSchoolMilestones(person);
    this.processRelationships(person);

    // 4. NPC simulation
    const npcEvents = NPCSimulator.simulateYear(person, person.geopoliticalState);
    if (Array.isArray(npcEvents)) {
      if (!Array.isArray(person.worldNews)) person.worldNews = [];
      npcEvents.forEach(ev => {
        if (ev && ev.text) {
          person.worldNews.push({
            text: ev.text,
            type: ev.mood || 'neutral',
            age: person.age,
            relName: ev.rel?.name || '',
            relType: ev.rel?.type || '',
            year: new Date().getFullYear(),
            category: ev.type || 'general',
          });
        }
      });
      if (person.worldNews.length > 100) person.worldNews = person.worldNews.slice(-100);
    }

    // 5. Prison or career
    if (person.isInPrison) {
      person.prisonSentence--;
      person.logEvent(`You spent the year in prison. ${person.prisonSentence} years remaining.`, 'bad');
      person.updateStats({ happiness: -5, health: -2 });
      if (person.prisonSentence <= 0) {
        person.isInPrison = false;
        person.logEvent('You have been released from prison!', 'good');
        person.updateStats({ happiness: 20 });
      }
    } else {
      this.processCareer(person);
    }
    if (!person.isAlive) return;

    // 6. Finances
    processRetirement(person);
    const openingPersonalDebt = Math.max(0, Number(person.personalDebt) || 0);
    this.processLivingExpenses(person);
    this.processPersonalDebt(person, openingPersonalDebt);
    this.processStudentLoans(person);

    // 7. Natural changes
    this.processNaturalChanges(person);
    this.processStatConsequences(person);
    if (!person.isAlive) return;

    // 8. Assets, businesses, pets
    this.processAssets(person);
    this.processBusinesses(person);
    this.processPets(person);

    // 9. Education & sports
    this.processEducation(person);
    if (!person.isInPrison) processCollegeSports(person);
    if (!person.isAlive) return;

    // 10. Long-running systems
    processAddictions(person);
    if (!person.isAlive) return;
    processFitness(person);
    if (!person.isAlive) return;
    tryContractDisease(person);
    const diseaseEvents = processConditions(person);
    diseaseEvents.forEach(e => person.logEvent(e, e.includes('recovered') ? 'good' : 'bad'));
    if (!person.isAlive) return;
    processInsurance(person);
    processSpaceCareer(person);
    processClubs(person);
    processLawsuits(person);

    // 11. Research & patents
    if (person.age >= 35 && person.smarts >= 85 && person.degrees.length >= 2 &&
        person.job?.isResearch === true && Math.random() < 0.03) {
      person.hasNobelPrize = true;
      person.logEvent('You won the Nobel Prize for your groundbreaking research!', 'good');
    }
    if (person.smarts >= 70 && person.job?.isResearch === true && Math.random() < 0.12) {
      if (!Array.isArray(person.patents)) person.patents = [];
      person.patents.push({ name: `Patent #${person.patents.length + 1}`, year: person.age });
      person.logEvent(`You filed patent #${person.patents.length}.`, 'good');
    }

    // 12. Seasonal & political
    processSeasonalEvent(person);
    if (!person.isAlive) return;
    processPoliticalYear(person);
    if (!person.isAlive) return;

    // 13. Language learning
    if (person.age >= 10 && person.smarts >= 40 && Math.random() < 0.02) {
      if (!Array.isArray(person.languages)) person.languages = ['English'];
      const newLangs = ['Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Arabic', 'Portuguese', 'Russian', 'Italian', 'Korean'];
      const available = newLangs.filter(l => !person.languages.includes(l));
      if (available.length > 0) {
        const learned = available[Math.floor(Math.random() * available.length)];
        person.languages.push(learned);
        person.logEvent(`You learned ${learned} this year!`, 'good');
      }
    }

    // 14. Status events
    this.processStatusEvents(person);
    if (!person.isAlive) return;

    // 15. Random event & ambition
    const event = this.generateEvent(person);
    if (event) {
      if (event.choices && event.choices.length > 0) {
        person.setPendingEvent(event);
      } else {
        person.logEvent(event.text, event.type, {
          messageKey: event.messageKey,
          messageParams: event.messageParams || {},
        });
        person.updateStats(event.effects);
      }
    } else {
      person.logEvent(`Age ${person.age}: Another year passes.`, 'neutral');
    }
    evaluateAmbition(person);

    // 16. Final health check
    if (person.isAlive && person.health <= 0) {
      person.isAlive = false;
      person.logEvent('You have died.', 'bad');
    }

    // 17. Stat snapshot
    person.recordStatSnapshot();
  }

  /**
   * Ages up the person by the specified number of years (1-10)
   * Delegates to simulateYear() for each tick
   */
  static ageUp(person, years = 1) {
    if (!person.isAlive) {
      return person;
    }

    const requestedYears = Math.max(1, Math.min(10, Math.floor(Number(years) || 1)));
    person.latestAgeUpRecaps = [];
    person.fastForwardResult = null;
    for (let i = 0; i < requestedYears; i++) {
      if (!person.isAlive || person.pendingEvent) {
        break;
      }

      const yearStart = captureYearStart(person);
      const finishYear = () => {
        const recap = finalizeAnnualRecap(person, yearStart);
        if (requestedYears > 1 && recap.stopReason) {
          person.fastForwardResult = {
            requestedYears,
            completedYears: i + 1,
            stoppedAtAge: person.age,
            reason: recap.stopReason,
          };
          return true;
        }
        return false;
      };

      this.simulateYear(person);

      if (!person.isAlive) {
        person.recordStatSnapshot();
        if (finishYear()) break;
        continue;
      }
      if (finishYear()) break;
    }

    person.milestones = (person.milestones || []).slice(0, 500);
    person.ensureDefaults();
    return person;
  }

  static processNaturalChanges(person) {
    // Younger characters recover a little from minor illness without making
    // health maintenance irrelevant later in life.
    if (person.age <= 50 && person.health < 70) {
      person.updateStats({ health: 1 });
    }

    // Looks fade with age
    if (person.age > 50) {
      person.updateStats({ looks: -2, health: -1 });
    }
    if (person.age > 65) {
      person.updateStats({ health: -1 });
    }
    if (person.age > 80) {
      person.updateStats({ health: -1 });
    }
    if (person.age > 95) {
      person.updateStats({ health: -2 });
    }
    // Happiness reverts to baseline? or just random fluctuation
    const moodSwing = Math.floor(Math.random() * 5) - 2;
    person.updateStats({ happiness: moodSwing, stress: -4 });

    // Pandemic Health Hit
    if (this.worldState.pandemic) {
      person.updateStats({ health: -5, happiness: -5 });
      if (Math.random() < 0.2) {
        person.logEvent('The pandemic isolation is getting to you.', 'bad');
      }
    }

    // City residency tracking
    person.yearsInCurrentCity = (person.yearsInCurrentCity || 0) + 1;
    person.yearsInCurrentCountry = (person.yearsInCurrentCountry || 0) + 1;

    // World event effects
    const effects = getEventEffects();
    if (effects.happinessImpact !== 0) {
      person.updateStats({ happiness: Math.round(effects.happinessImpact * 0.25) });
    }
    if (effects.healthImpact !== 0) {
      person.updateStats({ health: Math.round(effects.healthImpact * 0.35) });
    }

    // Location-based random events
    const city = getCityByName(person.city);
    if (city && Math.random() < 0.08) {
      if (city.crimeRate > 55 && Math.random() < 0.3) {
        person.logEvent(`A pickpocket stole your wallet in ${person.city}.`, 'bad');
        person.money = Math.max(0, person.money - Math.floor(Math.random() * 200 + 50));
        person.updateStats({ happiness: -5 });
      } else if (city.culture > 80 && Math.random() < 0.3) {
        person.logEvent(`You attended a wonderful cultural festival in ${person.city}!`, 'good');
        person.updateStats({ happiness: 8, smarts: 1 });
      } else if (city.nature > 60 && Math.random() < 0.3) {
        person.logEvent(`You explored the beautiful nature around ${person.city}.`, 'good');
        person.updateStats({ happiness: 5, health: 2 });
      } else if (city.tech > 80 && Math.random() < 0.3) {
        person.logEvent(`You visited a cutting-edge tech expo in ${person.city}.`, 'good');
        person.updateStats({ smarts: 3, happiness: 3 });
      }
    }
  }

  static processWorldEvents(person) {
    // Age existing events (20% chance each ends)
    ageWorldEvents();

    // Generate new events
    const newEvents = startWorldEvents(person.age);
    for (const event of newEvents) {
      person.logEvent(
        `[World Event] ${event.name}: ${event.desc}`,
        event.effects.happinessImpact >= 0 ? 'good' : 'bad',
        { messageKey: event.messageKey, messageParams: {} }
      );
      if (!Array.isArray(person.worldNews)) {
        person.worldNews = [];
      }
      person.worldNews.push({
        text: `${event.name}: ${event.desc}`,
        type: event.effects.happinessImpact >= 0 ? 'good' : 'bad',
        age: person.age,
        relName: '',
        relType: 'world',
        year: new Date().getFullYear(),
      });
      if (person.worldNews.length > 100) {
        person.worldNews = person.worldNews.slice(-100);
      }
    }

    // Track active event IDs on world state
    this.worldState.activeWorldEvents = getActiveEventIds();

    // Apply travel ban from pandemic-like events
    const effects = getEventEffects();
    if (effects.travelBan) {
      this.worldState.pandemic = true;
    }
  }

  static processGeopoliticalYear(person) {
    const state = GameEngine.getGeopoliticalState(person);
    const result = simulateWorldYear(state, person.countryRelations);
    person.geopoliticalState = result.worldState;

    GameEngine.applyPlayerPoliciesToWorld(person);

    if (Array.isArray(result.news) && result.news.length > 0) {
      if (!Array.isArray(person.worldNews)) {
        person.worldNews = [];
      }
      const MAJOR_EVENT_KEYWORDS = ['war', 'coup', 'assassinat', 'nuclear', 'erupts', 'disaster', 'pandemic', 'CIVIL'];
      result.news.forEach(item => {
        if (item && item.text) {
          const countryState = state.countries[item.country];
          person.worldNews.push({
            text: item.text,
            type: item.type === 'good' ? 'good' : 'bad',
            age: person.age,
            relName: countryState?.name || '',
            relType: 'world',
            year: state.year,
            category: 'geopolitics',
          });

          if (item.action === 'declare_war') {
            const myCountryId = getCountryByName(person.country)?.id;
            if (myCountryId && (item.country === myCountryId || item.targetId === myCountryId)) {
              const warResult = startWar(person, item.targetId);
              if (warResult.success) {
                person.logEvent(warResult.message, 'bad');
                person._breakingNews = person._breakingNews || [];
                person._breakingNews.push({ text: item.text, type: 'bad' });
              }
            }
          }

          if (item.action === 'form_alliance') {
            const myCountryId = getCountryByName(person.country)?.id;
            if (myCountryId && (item.country === myCountryId || item.targetId === myCountryId)) {
              const targetId = item.country === myCountryId ? item.targetId : item.country;
              if (!person.countryRelations) person.countryRelations = {};
              if (!person.countryRelations[targetId]) {
                person.countryRelations[targetId] = { relation: 50, tradeLevel: 0, tension: 0 };
              }
              person.countryRelations[targetId].alliance = 'ally';
              person.countryRelations[targetId].relation = Math.min(100, (person.countryRelations[targetId].relation || 50) + 30);
              person.countryRelations[targetId].tension = Math.max(0, (person.countryRelations[targetId].tension || 0) - 20);
              person._breakingNews = person._breakingNews || [];
              person._breakingNews.push({ text: item.text, type: 'good' });
            }
          }

          const isBreaking = MAJOR_EVENT_KEYWORDS.some(kw => item.text.includes(kw));
          if (isBreaking && !item.action) {
            person._breakingNews = person._breakingNews || [];
            person._breakingNews.push({ text: item.text, type: item.type === 'good' ? 'good' : 'bad' });
          }
        }
      });
      if (person.worldNews.length > 100) {
        person.worldNews = person.worldNews.slice(-100);
      }
    }

    processWarYears(person);

    GameEngine.processUNYear(person, state);
    GameEngine.processWarReactions(person, state);
    GameEngine.processMigrationEvents(person, state);
  }

  static processUNYear(person, state) {
    if (!state?.countries || !person.countryRelations) return;

    if (!person.unResolutions) person.unResolutions = [];
    if (!person.policies) person.policies = { diplomacyBudget: 30, taxRate: 30, militarySpending: 30 };

    // Auto-decay old resolutions
    person.unResolutions = person.unResolutions.map(r => {
      if (!r.resolved && r.year && person.age - r.year > 5) {
        return { ...r, resolved: true, outcome: 'expired' };
      }
      return r;
    });

    // Random UN event for influential countries
    const myCountry = Object.values(state.countries).find(c => c.name === person.country);
    if (!myCountry || myCountry.influence < 40) return;
    if (Math.random() > 0.08) return;

    // Pick a random country with poor relations to target
    const targets = Object.entries(person.countryRelations)
      .filter(([id, rel]) => rel && (rel.relation || 50) < 40 && id !== myCountry.id)
      .map(([id]) => id);

    if (targets.length === 0) return;
    const targetId = targets[Math.floor(Math.random() * targets.length)];

    const influence = calculateUNInfluence(person);
    if (influence < 30) return;

    const types = RESOLUTION_TYPES.filter(t => influence >= t.minApproval);
    if (types.length === 0) return;
    const type = types[Math.floor(Math.random() * types.length)];

    const result = proposeResolution(person, targetId, type.id);
    if (result?.success) {
      person.logEvent(`[UN Auto] ${result.message}`, result.passed ? 'good' : 'neutral');
    }
  }

  static applyCountryEffects(person) {
    if (person.isInPrison) {
      return;
    }

    const countryData = GameEngine.getCountryForPerson(person);
    if (!countryData) {
      return;
    }

    if (countryData.crime > 60 && Math.random() < 0.05) {
      const stolen = Math.floor(Math.random() * 300 + 50);
      person.money = Math.max(0, (person.money || 0) - stolen);
      person.updateStats({ happiness: -3, stress: 3 });
      person.logEvent(
        `Due to high crime in ${countryData.name}, you lost $${stolen.toLocaleString()} to theft.`,
        'bad'
      );
    }

    if (countryData.unemployment > 15 && person.job && Math.random() < 0.04) {
      person.logEvent(
        `The high unemployment rate (${Math.round(countryData.unemployment)}%) in ${countryData.name} is affecting job security.`,
        'bad'
      );
      person.updateStats({ stress: 5 });
    }

    if (countryData.healthcare < 40 && Math.random() < 0.06) {
      person.updateStats({ health: -2 });
      person.logEvent(
        `Poor healthcare infrastructure in ${countryData.name} has impacted your health.`,
        'bad'
      );
    }

    if (countryData.happiness > 70 && Math.random() < 0.1) {
      person.updateStats({ happiness: 2 });
    }

    if (countryData.stability < 30 && Math.random() < 0.03) {
      person.logEvent(`Political instability in ${countryData.name} is causing concern.`, 'bad');
      person.updateStats({ stress: 8 });
    }

    if (
      person.age >= 18 &&
      person.age <= 35 &&
      countryData.militaryPower > 60 &&
      countryData.stability < 40 &&
      countryData.unemployment > 12 &&
      Math.random() < 0.02
    ) {
      person.logEvent('You have been drafted into the military due to national instability.', 'bad');
      person.updateStats({ happiness: -15, stress: 20 });
      if (person.job && !person.job.isMilitary) {
        person.quitJob();
      }
    }

    if (person.currentSchool && Math.random() < 0.1) {
      const eduBonus = Math.floor((countryData.education - 50) / 20);
      if (eduBonus !== 0) {
        person.currentSchool.performance = Math.max(0, Math.min(100, (person.currentSchool.performance || 50) + eduBonus));
        if (eduBonus > 0) {
          person.logEvent(`Quality education in ${countryData.name} is boosting your learning.`, 'good');
        } else {
          person.logEvent(`Poor education standards in ${countryData.name} are hindering your studies.`, 'bad');
        }
      }
    }

    if (person.job && isTechnologyJob(person.job) && Math.random() < 0.08) {
      const techMod = (countryData.technology - 50) / 50;
      if (techMod > 0.1) {
        const bonus = Math.floor((person.job.salary || 0) * techMod * 0.1);
        if (bonus > 0) {
          person.money = (person.money || 0) + bonus;
          person.logEvent(`Your tech skills are in high demand in ${countryData.name}. Earned $${bonus.toLocaleString()} bonus.`, 'good');
        }
      }
    }

    if (countryData.happiness < 35 && Math.random() < 0.08) {
      person.updateStats({ happiness: -2 });
    }

    if (countryData.education < 40 && person.age < 25 && Math.random() < 0.05) {
      person.updateStats({ smarts: -1 });
    }

    if (countryData.corruption > 60 && person.job && Math.random() < 0.03) {
      const taxWaste = Math.floor((person.job.salary || 0) * 0.02);
      if (taxWaste > 0) {
        person.money = Math.max(0, (person.money || 0) - taxWaste);
        person.logEvent(`Government corruption in ${countryData.name} cost you $${taxWaste.toLocaleString()} in wasted taxes.`, 'bad');
      }
    }
  }

  static applyPlayerPoliciesToWorld(person) {
    const state = person.geopoliticalState;
    if (!state || !state.countries) return;
    const myCountry = Object.values(state.countries).find(c => c.name === person.country);
    if (!myCountry) return;
    if (!person.policies) return;

    const taxRate = person.policies.taxRate ?? 30;
    const militarySpending = person.policies.militarySpending ?? 30;
    const socialSpending = person.policies.socialSpending ?? 30;

    myCountry.militaryPower = Math.max(10, Math.min(100, (myCountry.militaryPower || 60) + Math.floor((militarySpending - 30) / 5)));
    myCountry.stability = Math.max(10, Math.min(100, (myCountry.stability || 50) + Math.floor((socialSpending - 30) / 8) - Math.floor((taxRate - 30) / 10)));
    myCountry.happiness = Math.max(10, Math.min(100, (myCountry.happiness || 50) + Math.floor((socialSpending - 30) / 6) - Math.floor(taxRate / 8)));
    myCountry.unemployment = Math.max(2, Math.min(40, (myCountry.unemployment || 8) + Math.floor((30 - socialSpending) / 5) - Math.floor((30 - militarySpending) / 10)));
  }

  static processMigrationEvents(person, state) {
    if (!state || !state.countries) return;
    if (person.age < 18) return;

    const myCountry = Object.values(state.countries).find(c => c.name === person.country);
    if (!myCountry) return;
    if (person.immigrationApplied) return;

    const atWar = person.countryRelations
      ? Object.values(person.countryRelations).some(rel => rel && rel.atWar)
      : false;

    const reason =
      (atWar && Math.random() < 0.15) ? 'Your country is at war!'
      : (myCountry.inflation > 50 && Math.random() < 0.08) ? `Hyperinflation (${Math.round(myCountry.inflation)}%) is destroying your savings.`
      : (myCountry.stability < 30 && myCountry.unemployment > 15 && Math.random() < 0.06) ? `Life is getting tough in ${myCountry.name} (stability: ${Math.round(myCountry.stability)}%, unemployment: ${Math.round(myCountry.unemployment)}%).`
      : null;

    if (!reason) return;

    const safeCountries = Object.values(state.countries)
      .filter(c =>
        c.stability > 55 &&
        c.unemployment < 15 &&
        c.inflation < 20 &&
        c.name !== person.country
      );

    if (safeCountries.length === 0) return;
    const target = safeCountries[Math.floor(Math.random() * safeCountries.length)];

    const visaCost = target.name === 'United States' ? 0
      : target.name === 'Canada' ? 3000
      : target.name === 'Australia' ? 4000
      : target.name === 'Japan' ? 6000
      : target.name === 'Russia' ? 5500
      : 4000;

    const costSuffix = visaCost > 0 ? ` (Visa: $${visaCost.toLocaleString()})` : '';

    person.pendingEvent = {
      type: 'emigration_opportunity',
      text: `${reason} ${target.name} looks promising.${costSuffix} Would you like to emigrate?`,
      choices: [
        { text: `Move to ${target.name}${costSuffix}`, effect: `emigrate_${target.name}` },
        { text: 'Stay and tough it out', effect: 'stay' },
      ],
    };
  }

  static processWarReactions(person, state) {
    if (!state || !state.countries) return;
    if (person.age < 18) return;
    if (person.pendingEvent) return;

    const atWar = person.countryRelations
      ? Object.values(person.countryRelations).some(rel => rel && rel.atWar)
      : false;
    if (!atWar) return;
    if (person.warReactionChosen) return;

    const myCountry = Object.values(state.countries).find(c => c.name === person.country);
    if (!myCountry) return;

    const inMilitary = person.job && person.job.isMilitary;
    const warDur = Object.values(person.wars || {}).reduce((s, w) => s + (w.years || 0), 0);

    if (Math.random() < 0.12) {
      const choices = [];

      if (!inMilitary && person.age >= 18 && person.age <= 35) {
        choices.push({ text: '⚔️ Enlist in the military', effect: 'enlist_war', effects: { happiness: -5, stress: 15 } });
      }
      if (person.money > 10000) {
        choices.push({ text: '💼 Profit from war contracts (+$50k)', effect: 'war_profit', effects: { money: 50000, karma: -5 } });
      }
      choices.push({ text: '📰 Become a war journalist', effect: 'war_journalist', effects: { fame: 10, stress: 10 } });
      choices.push({ text: '✊ Join the protests', effect: 'war_protest', effects: { fame: 5, stress: 10, notoriety: 5 } });
      choices.push({ text: '🏃 Flee the country as a refugee', effect: 'war_refugee' });
      choices.push({ text: '🤝 Volunteer to help refugees', effect: 'war_help_refugees', effects: { karma: 10, happiness: -3 } });
      if (warDur > 3) {
        choices.push({ text: '🎖️ Attempt to become a general', effect: 'war_become_general', effects: { fame: 15, stress: 20 } });
      }
      choices.push({ text: 'Ignore it and continue life', effect: 'war_ignore' });

      person.pendingEvent = {
        type: 'war_reaction',
        text: `⚔️ Your country is at war! The conflict with ${myCountry.name} has been raging for ${warDur || 1} years. How do you respond?`,
        choices,
      };
    }
  }

  static processStatConsequences(person) {
    // --- STRESS ---
    if (person.stress > 80) {
      person.updateStats({ health: -3, happiness: -5 });
      if (Math.random() < 0.2) {
        // 20% chance of warning sig
        person.logEvent('You are suffering from high blood pressure due to stress.', 'bad');
      }
      if (Math.random() < 0.01) {
        // 1% chance of Heart Attack
        person.logEvent('You had a massive HEART ATTACK due to extreme stress!', 'bad');
        person.updateStats({ health: -35 });
      }
    }

    // --- KARMA ---
    if (person.karma > 90 && Math.random() < 0.1) {
      person.logEvent('Good Karma! You found a diamond ring on the floor.', 'good');
      person.updateStats({ money: 2000, happiness: 10 });
    } else if (person.karma < 10 && Math.random() < 0.1) {
      person.logEvent('Bad Karma! A bird pooped on your head.', 'bad');
      person.updateStats({ happiness: -10 });
    }

    // --- FAME ---
    if (person.fame > 50 && Math.random() < 0.1) {
      const fanInteractions = [
        { text: 'A fan asked for your autograph!', type: 'good', effect: { happiness: 5 } },
        { text: 'A fan was stalking you...', type: 'bad', effect: { stress: 10 } },
      ];
      const interaction = fanInteractions[Math.floor(Math.random() * fanInteractions.length)];
      person.logEvent(interaction.text, interaction.type);
      person.updateStats(interaction.effect);
    }
  }

  static processCareer(person) {
    if (person.job) {
      const worldEffects = getEventEffects();
      const salary = Math.max(0, Number(person.job.salary) || 0);
      const technologyMultiplier = isTechnologyJob(person.job) ? worldEffects.techJobMult : 1;

      const countryData = GameEngine.getCountryForPerson(person);
      const countryMult = countryData ? Math.max(0.7, Math.min(1.3, 1 + (countryData.technology - 50) / 200 + (countryData.education - 50) / 200)) : 1;

      const careerMult = getSalaryMultiplier(person);
      const grossIncome = Math.floor(
        salary * worldEffects.salaryMult * technologyMultiplier * careerMult * countryMult
      );
      const tax = calculateIncomeTax(grossIncome);
      const netIncome = grossIncome - tax;
      person.updateStats({ money: netIncome });

      const treeId = getTreeIdForJob(person.job);
      const careerEffects = treeId ? getCareerEffects(person, treeId) : {};
      const stressReduction = careerEffects.stressReduction || 0;
      person.updateStats({
        stress: Math.max(0, Number(person.job.stress) || 0) / 20 - stressReduction,
      });
      if (careerEffects.happiness) {
        person.updateStats({ happiness: careerEffects.happiness });
      }
      if (careerEffects.fame) {
        person.fame = Math.min(100, (person.fame || 0) + careerEffects.fame);
      }
      if (careerEffects.health) {
        person.health = Math.min(100, (person.health || 0) + careerEffects.health);
      }

      person.job.yearsEmployed = (Number(person.job.yearsEmployed) || 0) + 1;
      person.lifeStats.totalMoneyEarned =
        (Number(person.lifeStats.totalMoneyEarned) || 0) + netIncome;
      person.lifeStats.totalTaxes = (Number(person.lifeStats.totalTaxes) || 0) + tax;

      // Performance Evaluation (Raises, Promotions, Firing, Layoffs)
      const careerEvents = evaluateJobPerformance(person, this.worldState.economy);
      if (careerEvents && careerEvents.length > 0) {
        careerEvents.forEach(evt => {
          person.logEvent(evt.text, evt.type);
        });
      }
    }
  }

  static processAssets(person) {
    if (!Array.isArray(person.assets)) {
      person.assets = [];
    }

    if (person.assets.length > 0) {
      let totalMaintenance = 0;
      let totalMortgage = 0;
      const messages = [];

      person.assets.forEach(asset => {
        totalMaintenance += Math.max(0, Number(asset.maintenance) || 0);

        // Mortgage Logic
        if (asset.isMortgaged && asset.mortgage) {
          const mortgageBalance = Math.max(0, Number(asset.mortgage.balance) || 0);
          const monthlyPayment = Math.max(0, Number(asset.mortgage.monthlyPayment) || 0);
          const interestRate = Math.max(
            0,
            Math.min(0.25, Number(asset.mortgage.interestRate ?? 0.05) || 0)
          );
          const monthlyRate = interestRate / 12;
          let remainingBalance = mortgageBalance;
          let annualPayment = 0;

          for (let month = 0; month < 12 && remainingBalance > 0; month++) {
            const amountDue = remainingBalance * (1 + monthlyRate);
            const payment = Math.min(monthlyPayment, amountDue);
            remainingBalance = amountDue - payment;
            annualPayment += payment;
          }

          totalMortgage += Math.round(annualPayment);
          asset.mortgage.interestRate = interestRate;
          asset.mortgage.balance = Math.max(0, Math.round(remainingBalance));

          if (asset.mortgage.balance <= 0) {
            asset.isMortgaged = false;
            asset.mortgage = null;
            messages.push(`You paid off your mortgage on the ${asset.name}!`);
          }
        }

        // Age the asset
        asset.age = (asset.age || 0) + 1;

        if (asset.type === 'Real Estate') {
          // Real Estate Appreciation: -2% to +8%
          const marketChange = Math.random() * 0.1 - 0.02;
          const currentValue = Math.max(0, Number(asset.value ?? asset.price) || 0);
          asset.value = Math.floor(currentValue * (1 + marketChange));

          // Big swing event
          if (marketChange > 0.07) {
            messages.push(
              `The value of your ${asset.name} soared by ${Math.floor(marketChange * 100)}%!`
            );
          }

          // Rental Logic
          if (asset.isRented && asset.tenant) {
            const maximumMonthlyRent = Math.max(1, Math.floor(asset.value * 0.01));
            asset.rentPrice = Math.min(
              Math.max(0, Number(asset.rentPrice) || 0),
              maximumMonthlyRent
            );
            const annualRent = asset.rentPrice * 12;
            person.money += annualRent;

            // Tenant Events
            if (Math.random() < 0.1) {
              // 10% chance of issue
              if (Math.random() > 0.5) {
                const damage = Math.floor(annualRent * 0.5);
                person.money -= damage;
                if (typeof person.fileInsuranceClaim === 'function') {
                  person.fileInsuranceClaim('home', damage);
                }
                messages.push(
                  `BAD TENANT! ${asset.tenant.name} trashed your ${asset.name}. Repairs cost $${damage.toLocaleString()}.`
                );
                asset.tenant.satisfaction -= 20;
              } else {
                // Non-payment
                person.money -= Math.floor(annualRent / 4); // Lose 3 months rent
                messages.push(`Tenant ${asset.tenant.name} missed rent payments on ${asset.name}.`);
              }
            } else {
              // Good year
              asset.tenant.satisfaction = Math.min(100, asset.tenant.satisfaction + 5);
            }
          }
        } else if (asset.type === 'Vehicle') {
          // Vehicle Depreciation
          // Standard cars lose ~15% per year early on, slowing down later
          let depreciation = 0.15;
          if (asset.age > 5) {
            depreciation = 0.1;
          }
          if (asset.age > 10) {
            depreciation = 0.05;
          }

          // Condition also drops
          asset.condition = Math.max(0, (asset.condition || 100) - 5);

          const currentValue = Math.max(0, Number(asset.value ?? asset.price) || 0);
          asset.value = Math.floor(currentValue * (1 - depreciation));

          if (asset.condition < 20 && Math.random() < 0.3) {
            messages.push(`Your ${asset.name} broke down! Repair cost $500.`);
            person.money -= 500; // Auto-repair for now or just fee
          }
        }
      });

      if (totalMaintenance > 0) {
        person.money -= totalMaintenance;
        // person.logEvent(`You paid $${totalMaintenance.toLocaleString()} in asset maintenance.`);
      }

      if (totalMortgage > 0) {
        person.money -= totalMortgage;
        // messages.push(`You paid $${totalMortgage.toLocaleString()} in mortgage payments.`);
      }

      if (messages.length > 0) {
        // Pick one significant event to log to avoid spam
        person.logEvent(messages[0]);
      }
    }

    // --- INVESTMENT PROCESSING ---
    if (person.portfolio && person.portfolio.length > 0) {
      const worldEffects = getEventEffects();
      let totalDividend = 0;

      person.portfolio.forEach(pos => {
        const assetDef = [...STOCKS, ...COMPANY_STOCKS, ...CRYPTO, ...getActiveIPOs()].find(
          a => a.id === pos.id
        );
        if (!assetDef) {
          return;
        }

        const baseChange = getInvestmentReturn(assetDef, this.worldState.economy);
        const percentChange =
          baseChange >= 0 ? baseChange * worldEffects.investmentMult : baseChange;
        const valueChange = Math.floor(pos.currentValue * percentChange);
        pos.currentValue = Math.max(0, pos.currentValue + valueChange);
        if (!Array.isArray(pos.history)) {
          pos.history = [];
        }
        pos.history.push({ age: person.age, value: pos.currentValue });
        pos.history = pos.history.slice(-12);

        // Dividend processing
        const dividend = getDividendPayout(assetDef, pos.currentValue);
        if (dividend > 0) {
          pos.totalDividends = (pos.totalDividends || 0) + dividend;
          totalDividend += dividend;
        }

        if (percentChange > 0.5) {
          person.logEvent(
            `🚀 ${pos.name} IS MOONING! (+${Math.floor(percentChange * 100)}%)`,
            'good'
          );
        }
        if (percentChange < -0.4) {
          person.logEvent(`📉 ${pos.name} CRASHED! (${Math.floor(percentChange * 100)}%)`, 'bad');
        }
      });

      if (totalDividend > 0) {
        person.money = (person.money || 0) + totalDividend;
        person.logEvent(
          `💰 You received $${totalDividend.toLocaleString()} in dividends this year.`,
          'good'
        );
      }
    }

    // IPO generation (small chance per year)
    if (Math.random() < 0.15) {
      const ipo = generateIPO();
      person.logEvent(
        `📋 New IPO: ${ipo.name} is now available at $${Math.floor(ipo.ipoPrice).toLocaleString()}!`,
        'neutral'
      );
    }
    clearOldIPOs();
    ageIPOs();

    // Market news
    const sectors = getSectorPerformance(this.worldState.economy);
    const allAssets = [...STOCKS, ...COMPANY_STOCKS, ...CRYPTO];
    const news = getMarketNews(this.worldState.economy, allAssets, sectors);
    if (news.length > 0 && Math.random() < 0.4) {
      const headline = news[Math.floor(Math.random() * Math.min(news.length, 2))];
      person.logEvent(headline, 'neutral');
    }
  }

  static processLivingExpenses(person) {
    if (person.age < 18 || person.isInPrison) {
      return 0;
    }

    const city = getCityByName(person.city);
    const costIndex = Math.max(30, Math.min(110, Number(city?.costIndex) || 60));
    const locationMultiplier = costIndex / 70;
    const baseCost = person.isRetired ? 28000 : person.age < 25 ? 23000 : 32000;
    const ownsHome = person.assets?.some(asset => asset.type === 'Real Estate' && !asset.isRented);
    const housingMultiplier = ownsHome ? 0.75 : 1;
    const hasOngoingIncome = Boolean(
      (person.job && !person.job.isRetired) ||
      person.isRetired ||
      person.assets?.some(asset => asset.isRented) ||
      person.companies?.length
    );
    const hardshipMultiplier = !hasOngoingIncome && person.money < 5000 ? 0.55 : 1;
    const dependentChildren = (person.relationships || []).filter(
      relationship =>
        relationship.type === 'Child' &&
        relationship.status !== 'Deceased' &&
        Number(relationship.age) < 18
    ).length;
    const annualCost = Math.max(
      0,
      Math.floor(
        baseCost * locationMultiplier * housingMultiplier * hardshipMultiplier +
          dependentChildren * 10000 * locationMultiplier
      )
    );

    const currentCash = Number(person.money) || 0;
    const existingOverdraft = Math.max(0, -currentCash);
    const availableCash = Math.max(0, currentCash);
    const paidFromCash = Math.min(availableCash, annualCost);
    const shortfall = existingOverdraft + annualCost - paidFromCash;
    person.money = availableCash - paidFromCash;
    person.personalDebt = Math.max(0, Number(person.personalDebt) || 0) + shortfall;
    const couldAfford = shortfall === 0;
    person.lastLivingCost = annualCost;
    person.lifeStats.totalLivingExpenses =
      (Number(person.lifeStats.totalLivingExpenses) || 0) + annualCost;
    if (!couldAfford) {
      person.updateStats({ happiness: -2, stress: 4 });
    }
    if (person.age === 18 || person.age % 10 === 0) {
      person.logEvent(
        `Your annual living expenses were $${annualCost.toLocaleString()}.`,
        couldAfford ? 'neutral' : 'bad'
      );
    }
    return annualCost;
  }

  static processPersonalDebt(person, openingBalance = person.personalDebt) {
    const totalBalance = Math.max(0, Math.floor(Number(person.personalDebt) || 0));
    const existingBalance = Math.min(
      totalBalance,
      Math.max(0, Math.floor(Number(openingBalance) || 0))
    );
    const newBorrowing = totalBalance - existingBalance;
    let balance = existingBalance;
    if (balance <= 0) {
      person.personalDebt = newBorrowing;
      return 0;
    }

    balance += Math.floor(balance * 0.08);
    const yearsSinceBankruptcy = person.age - (Number(person.lastBankruptcyAge) || -1000);
    const lowIncome =
      !person.job || person.job.isRetired || (Number(person.job.salary) || 0) < 30000;
    if (balance >= 150000 && person.money <= 5000 && lowIncome && yearsSinceBankruptcy >= 7) {
      const discharged = Math.floor(balance * 0.65);
      balance -= discharged;
      person.bankruptcies = Math.max(0, Number(person.bankruptcies) || 0) + 1;
      person.lastBankruptcyAge = person.age;
      person.lifeStats.totalDebtDischarged =
        (Number(person.lifeStats.totalDebtDischarged) || 0) + discharged;
      person.updateStats({ happiness: -15, stress: 15 });
      person.logEvent(
        `You declared bankruptcy and discharged $${discharged.toLocaleString()} of unsecured debt.`,
        'bad'
      );
    }
    let payment = 0;
    if (!person.isInPrison && person.money > 5000) {
      const salaryBasedPayment =
        person.job && !person.job.isRetired
          ? Math.max(1200, Math.floor((Number(person.job.salary) || 0) * 0.08))
          : 0;
      const cashBasedPayment = Math.floor((Math.max(0, Number(person.money) || 0) - 5000) * 0.1);
      const targetPayment = Math.max(salaryBasedPayment, cashBasedPayment);
      payment = Math.min(balance, targetPayment, Math.max(0, Math.floor(person.money)));
      person.money -= payment;
      balance -= payment;
      person.lifeStats.totalDebtPayments =
        (Number(person.lifeStats.totalDebtPayments) || 0) + payment;
    }

    person.personalDebt = Math.max(0, balance + newBorrowing);
    if (payment > 0 && person.personalDebt === 0) {
      person.logEvent('You paid off your personal debt!', 'good');
    }
    return payment;
  }

  static processStudentLoans(person) {
    let balance = Math.max(0, Math.floor(Number(person.loans) || 0));
    if (balance <= 0) {
      person.loans = 0;
      return 0;
    }

    const interest = Math.floor(balance * 0.04);
    balance += interest;
    let payment = 0;
    if (!person.isInPrison && person.money > 5000) {
      const salaryBasedPayment =
        person.job && !person.job.isRetired
          ? Math.max(1200, Math.floor((Number(person.job.salary) || 0) * 0.06))
          : 0;
      const cashBasedPayment = Math.floor((Math.max(0, Number(person.money) || 0) - 5000) * 0.08);
      const targetPayment = Math.max(salaryBasedPayment, cashBasedPayment);
      payment = Math.min(balance, targetPayment, Math.max(0, Math.floor(person.money)));
      if (payment > 0) {
        person.money -= payment;
        balance -= payment;
        person.lifeStats.totalDebtPayments =
          (Number(person.lifeStats.totalDebtPayments) || 0) + payment;
      }
    }

    person.loans = Math.max(0, balance);
    if (payment > 0 && person.loans === 0) {
      person.logEvent('You paid off your student loans!', 'good');
    }
    return payment;
  }

  static processSchoolMilestones(person) {
    if (
      person.age >= 6 &&
      person.age < 14 &&
      !person.currentSchool &&
      !person.educationHistory.includes('Elementary School')
    ) {
      person.currentSchool = {
        name: 'Elementary School',
        type: 'elementary',
        year: Math.min(8, person.age - 5),
        years: 8,
        performance: 50,
        cost: 0,
        tuitionPaid: 0,
      };
      person.logEvent('You started Elementary School.', 'neutral');
    }

    if (
      person.age >= 14 &&
      person.age <= 18 &&
      !person.currentSchool &&
      !person.educationHistory.includes('High School')
    ) {
      person.currentSchool = {
        name: 'High School',
        type: 'high_school',
        year: Math.min(4, person.age - 13),
        years: 4,
        performance: 50,
        cost: 0,
        tuitionPaid: 0,
      };
      person.logEvent('You started High School.', 'neutral');
    }
  }

  static processRelationships(person) {
    if (!Array.isArray(person.relationships)) {
      return;
    }
    person.relationships.forEach(relationship => {
      if (relationship.status === 'Deceased') {
        return;
      }

      if (Number.isFinite(relationship.age)) {
        relationship.age += 1;
      }
      relationship.yearsKnown = Math.max(0, Number(relationship.yearsKnown) || 0) + 1;

      const age = Number(relationship.age) || 0;
      const deathChance =
        age >= 120
          ? 1
          : age >= 105
            ? 0.3
            : age >= 95
              ? 0.12
              : age >= 85
                ? 0.05
                : age >= 75
                  ? 0.015
                  : 0;
      if (deathChance > 0 && Math.random() < deathChance) {
        relationship.status = 'Deceased';
        const loss = ['Spouse', 'Child'].includes(relationship.type) ? -25 : -15;
        person.logEvent(
          `Your ${relationship.type}, ${relationship.name}, died at age ${age}.`,
          'bad'
        );
        person.updateStats({ happiness: loss, stress: Math.abs(loss) / 2 });
        return;
      }

      if (
        relationship.type === 'Child' &&
        Number.isFinite(relationship.stat) &&
        Math.random() < 0.25
      ) {
        relationship.stat = Math.max(0, relationship.stat - 1);
      }
    });
    person.processRelationshipStories?.();
  }

  static processBusinesses(person) {
    if (!Array.isArray(person.companies) || person.companies.length === 0) {
      return;
    }

    const survivingCompanies = [];
    person.companies.forEach(company => {
      if (!company || typeof company.simulate !== 'function') {
        return;
      }
      const result = company.simulate(this.worldState.economy);

      if (Math.abs(result.profit) > 10000 || Math.random() < 0.35) {
        const amount = Math.abs(result.profit).toLocaleString();
        person.logEvent(
          `${company.name} ${result.profit >= 0 ? 'earned' : 'lost'} $${amount} this year.`,
          result.profit >= 0 ? 'good' : 'bad'
        );
      }

      if (company.isBankrupt()) {
        person.logEvent(`${company.name} went bankrupt and closed.`, 'bad');
        person.updateStats({ happiness: -15, stress: 15 });
      } else {
        survivingCompanies.push(company);
      }
    });
    person.companies = survivingCompanies;
  }

  static processPets(person) {
    if (!person.pets || person.pets.length === 0) {
      return;
    }

    person.pets.forEach((pet, index) => {
      pet.age++;
      // Stats decay
      pet.happiness = Math.max(0, pet.happiness - 5);
      pet.health = Math.max(0, pet.health - 2);
      pet.relationship = Math.max(0, pet.relationship - 2);

      // Death Check
      // Simplified lifespan check
      const maxAge =
        pet.type === 'Dog' ? 15 : pet.type === 'Cat' ? 18 : pet.type === 'Rabbit' ? 8 : 3;
      const deathChance = pet.age > maxAge ? 0.3 : 0.01;

      if (pet.health === 0 || Math.random() < deathChance) {
        person.logEvent(`Your ${pet.type}, ${pet.name}, died at age ${pet.age}. RIP.`, 'bad');
        person.updateStats({ happiness: -20 });
        // Mark for removal (filter after loop or use splice carefully if iterating backwards, but we'll just set a flag and filter)
        pet.isDead = true;
      }
    });

    // Cleanup dead pets
    person.pets = person.pets.filter(p => !p.isDead);
  }

  static updateWorldState(person) {
    // Use bounded economic cycles instead of decade-long accidental lock-ins.
    let newEconomy = this.worldState.economy;
    if (newEconomy === 'Normal' && Math.random() < 0.08) {
      newEconomy = Math.random() < 0.5 ? 'Recession' : 'Boom';
    } else if (newEconomy === 'Recession' && Math.random() < 0.25) {
      newEconomy = 'Normal';
    } else if (newEconomy === 'Boom' && Math.random() < 0.2) {
      newEconomy = 'Normal';
    }
    if (newEconomy !== this.worldState.economy) {
      this.worldState.economy = newEconomy;
      person.logEvent(`The economy has entered a ${newEconomy}.`, 'neutral');
    }

    // Conflict Change (5% chance)
    if (Math.random() < 0.05) {
      const newState = this.worldState.conflict === 'Peace' ? 'War' : 'Peace';
      this.worldState.conflict = newState;
      if (newState === 'War') {
        person.logEvent('War has been declared! The country is in conflict.', 'bad');
      } else {
        person.logEvent('The war has ended. Peace has been restored.', 'good');
      }
    }

    // Pandemic Change
    if (this.worldState.pandemic) {
      // End chance 50%
      if (Math.random() < 0.5) {
        this.worldState.pandemic = false;
        person.logEvent('The global pandemic has officially ended.', 'good');
      }
    } else {
      // Start chance 2%
      if (Math.random() < 0.02) {
        this.worldState.pandemic = true;
        person.logEvent('A GLOBAL PANDEMIC has been declared! Stay safe.', 'bad');
      }
    }
  }

  static generateYearlyMarket(person) {
    // Economy Multipliers
    let reMultiplier = 1.0;
    let salaryMultiplier = 1.0;
    const worldEffects = getEventEffects();

    if (this.worldState.economy === 'Recession') {
      reMultiplier = 0.7;
      salaryMultiplier = 0.8;
    } else if (this.worldState.economy === 'Boom') {
      reMultiplier = 1.3;
      salaryMultiplier = 1.2;
    }

    reMultiplier *= worldEffects.housingCostMult;
    // Real Estate
    const realEstate = AssetMarket.generateRealEstateListings(5).map(house => ({
      ...house,
      price: Math.floor(house.price * reMultiplier),
      value: Math.floor(house.value * reMultiplier),
    }));

    // Cars (Optional: could also be affected, but keeping simple for now)
    const cars = AssetMarket.generateCarListings(6);

    // Country-based job market modifiers
    const countryData = GameEngine.getCountryForPerson(person);
    const unemploymentRate = countryData?.unemployment ?? 8;
    const techLevel = countryData?.technology ?? 50;
    const eduLevel = countryData?.education ?? 50;

    const jobAvailabilityMod = Math.max(0.2, Math.min(1.5, (20 - unemploymentRate) / 15));
    const countrySalaryMod = Math.max(0.7, Math.min(1.3, 1 + (techLevel - 50) / 200 + (eduLevel - 50) / 200));

    // Job Market (New: Persistent yearly listings)
    // We pick a subset or generated variations of JOBS
    const jobs = JOBS.filter(
      () => worldEffects.jobChance >= 1 || Math.random() < Math.max(0.1, worldEffects.jobChance * jobAvailabilityMod)
    ).map(job => {
      // Randomly fluctuate base salary slightly + economy + country modifiers
      const variance = Math.random() * 0.1 - 0.05; // +/- 5%
      const offeredSalary = Math.floor(job.salary * salaryMultiplier * countrySalaryMod * (1 + variance));

      return {
        ...job,
        salary: offeredSalary,
        uniqueId: Date.now() + Math.random(),
      };
    });

    person.market = {
      realEstate,
      cars,
      jobs,
    };
  }

  static processEducation(person) {
    if (!person.currentSchool) {
      return;
    }

    const school = person.currentSchool;

    // Performance Decay if you don't study
    if (school.performance) {
      school.performance -= Math.floor(Math.random() * 5);
      if (school.performance < 0) {
        school.performance = 0;
      }
    }

    if (school.year < school.years) {
      school.year++;
      if (school.tuitionPaid > 0) {
        if (school.paymentMethod === 'Loan') {
          person.loans = (Number(person.loans) || 0) + school.tuitionPaid;
          person.logEvent(`Another year of loans added to your debt.`);
        } else if (school.paymentMethod === 'Scholarship') {
          person.logEvent(`Your scholarship covered this year's tuition.`);
        } else if (person.money >= school.tuitionPaid) {
          person.money -= school.tuitionPaid;
          person.logEvent(`You paid tuition for ${school.name}.`);
        } else {
          person.loans = (Number(person.loans) || 0) + school.tuitionPaid;
          school.paymentMethod = 'Loan';
          person.logEvent(
            `You could not cover tuition, so this year's cost became a student loan.`,
            'bad'
          );
        }
      }

      // Random events based on performance?
      if (school.performance < 20) {
        person.logEvent(`Your grades in ${school.name} are failing!`, 'bad');
        person.updateStats({ happiness: -5 });
      }

      person.updateStats({ smarts: 1, stress: 2 });
      // person.logEvent(`Finished year ${school.year - 1} of ${school.name}.`, "neutral"); // Reduce spam?
    } else {
      // Graduated!
      if (school.type === 'elementary') {
        person.educationHistory.push('Elementary School');
        person.logEvent('You finished Elementary School!', 'good');
        person.updateStats({ smarts: 3, happiness: 5 });
        person.currentSchool = null; // Will likely get High School next year or same tick? Logic in ageUp handles it next tick usually
      } else if (school.type === 'high_school') {
        person.educationHistory.push('High School');
        person.logEvent('You graduated High School!', 'good');
        person.updateStats({ smarts: 5, happiness: 10 });
        person.currentSchool = null;
      } else if (school.type === 'university' || school.type === 'grad_school') {
        const degreeName = school.type === 'university' ? "Bachelor's Degree" : school.name;
        const major = school.major || school.name;

        person.educationHistory.push(`${degreeName} in ${major}`);
        // Store actual degree object for logic
        person.degrees.push({ type: major, name: degreeName });

        person.logEvent(`You graduated with a ${degreeName} in ${major}!`, 'good');
        person.updateStats({ smarts: 10, happiness: 20 });
        person.currentSchool = null;

        // Repay loan if they have money? Not automatically.
        // Loans accumulate interest?
      } else {
        person.educationHistory.push(school.grant_degree);
        person.education = school.grant_degree; // Set highest education
        person.logEvent(`You graduated from ${school.name}!`, 'good');
        person.updateStats({ smarts: 10, happiness: 20 });
        person.currentSchool = null;
      }
    }
  }

  static generateEvent(person) {
    // Collect all possible events
    let pool = LIFE_EVENTS.filter(e => e.trigger(person));

    // Add Pandemic Events if active
    if (this.worldState.pandemic) {
      const panEvents = PANDEMIC_EVENTS.filter(e => e.trigger(person));
      pool = [...pool, ...panEvents];

      // High chance to force a pandemic event for flavor
      if (panEvents.length > 0 && Math.random() < 0.4) {
        return panEvents[Math.floor(Math.random() * panEvents.length)];
      }
    }

    // Add Career Events
    const careerEvents = CAREER_EVENTS.filter(e => e.trigger(person));

    if (careerEvents.length > 0) {
      // WAR OVERRIDE: If War and Military, very high chance of deployment
      if (this.worldState.conflict === 'War' && person.job?.isMilitary) {
        const deployment = CAREER_EVENTS.find(e => e.id === 'mil_deployment');
        if (deployment && Math.random() < 0.6) {
          // 60% chance of deployment/war event
          return deployment;
        }
      }

      // 50% chance to pick a career event if available
      if (Math.random() < 0.5) {
        return careerEvents[Math.floor(Math.random() * careerEvents.length)];
      }

      // Otherwise mix them into the general pool
      pool = [...pool, ...careerEvents];
    }

    if (pool.length === 0) {
      return null;
    }

    // Select one
    const choice = pool[Math.floor(Math.random() * pool.length)];
    return choice;
  }

  static initializeFamily(person) {
    const isRoyalCountry = ROYAL_COUNTRIES.includes(person.country);
    const isRoyalBirth = isRoyalCountry && Math.random() < 0.05; // 5% chance in royal countries

    let fatherTitle = 'Father',
      motherTitle = 'Mother';
    let fatherName = 'Dad',
      motherName = 'Mom';

    if (isRoyalBirth) {
      // Born as Prince/Princess
      // Parents are King/Queen or Prince/Princess
      const title = getTitle(person.gender, 1); // Rank 1 = Prince/Princess. 0 = King/Queen
      person.royalty = {
        title: title.title,
        respect: 100,
        isReigning: false,
        rank: 'prince', // simplified
      };
      person.logEvent(`👑 You were born a ${title.title} of ${person.country}!`, 'good');
      person.fame = 50; // Royals are famous
      person.money += 1000000; // Rich start

      fatherTitle = 'King';
      motherTitle = 'Queen';
      fatherName = 'King Henry';
      motherName = 'Queen Elizabeth';
    }

    person.addRelationship({
      id: 'father',
      name: fatherName,
      type: fatherTitle,
      age: 20 + Math.floor(Math.random() * 20),
    });

    person.addRelationship({
      id: 'mother',
      name: motherName,
      type: motherTitle,
      age: 20 + Math.floor(Math.random() * 20),
    });

    // Initial Market
    this.generateYearlyMarket(person);
  }

  static updateMarketPrices(person) {
    // Index Fund: Stable growth -5% to +10%
    const indexChange = Math.random() * 0.15 - 0.05; // -5% to +10%
    this.marketTrends.indexFund *= 1 + indexChange;
    this.marketTrends.indexFund = Math.max(10, this.marketTrends.indexFund); // Floor at $10

    // Dogecoin: Volatile -50% to +200%
    const cryptoChange = Math.random() * 2.5 - 0.5; // -50% to +200%
    this.marketTrends.dogecoin *= 1 + cryptoChange;
    this.marketTrends.dogecoin = Math.max(0.01, this.marketTrends.dogecoin); // Floor at $0.01

    // Log significant changes
    if (Math.abs(indexChange) > 0.05) {
      const direction = indexChange > 0 ? 'up' : 'down';
      person.logEvent(
        `The stock market went ${direction} this year.`,
        indexChange > 0 ? 'good' : 'neutral'
      );
    }
    if (Math.abs(cryptoChange) > 0.5) {
      const direction = cryptoChange > 0 ? 'surged' : 'crashed';
      person.logEvent(`Dogecoin ${direction}!`, cryptoChange > 0 ? 'good' : 'bad');
    }
  }

  static processStatusEvents(person) {
    // Only trigger status events with a certain probability to avoid spam
    const triggerChance = 0.25; // 25% chance per year
    if (Math.random() > triggerChance) {
      return;
    }

    let eventPool = [];

    // Royal Events
    if (person.royalty) {
      eventPool = ROYAL_EVENTS.filter(e => {
        if (e.condition) {
          return e.condition(person);
        }
        return true;
      });
    }

    // Military Events
    if (person.job && person.job.isMilitary && eventPool.length === 0) {
      eventPool = MILITARY_EVENTS.filter(e => {
        if (e.condition) {
          return e.condition(person);
        }
        return true;
      });
    }

    // Celebrity Events
    if (person.fame >= 60 && eventPool.length === 0) {
      eventPool = CELEBRITY_EVENTS.filter(e => {
        if (e.condition) {
          return e.condition(person);
        }
        return true;
      });
    }

    // Mafia Events
    if (person.mafia && person.mafia.family && eventPool.length === 0) {
      eventPool = MAFIA_EVENTS.filter(e => {
        if (e.condition) {
          return e.condition(person);
        }
        return true;
      });
    }

    // Trigger an event if available
    if (eventPool.length > 0) {
      const event = eventPool[Math.floor(Math.random() * eventPool.length)];
      person.logEvent(event.text, event.type);

      if (event.effects) {
        person.updateStats(event.effects);
      }

      if (event.customEffect) {
        event.customEffect(person);
      }
    }
  }
}
