// Lifetime Statistics Tracker
// Tracks cumulative stats across all lives

const createDefaultStats = () => ({
  livesLived: 0,
  totalYearsLived: 0,
  totalMoneyEarned: 0,
  totalJobsHeld: 0,
  totalChildrenBorn: 0,
  totalMarriages: 0,
  totalDivorces: 0,
  totalAssetsOwned: 0,
  totalCrimesCommitted: 0,
  totalJailTime: 0,
  degreesEarned: 0,
  companiesStarted: 0,
  highestNetWorth: { value: 0, name: '', age: 0 },
  longestLife: { age: 0, name: '' },
  mostChildren: { count: 0, name: '' },
  highestFame: { value: 0, name: '' },
  mostCriminal: { notoriety: 0, name: '' },
  jobsHeld: {},
  countriesLived: {},
});

const NUMBER_FIELDS = [
  'livesLived',
  'totalYearsLived',
  'totalMoneyEarned',
  'totalJobsHeld',
  'totalChildrenBorn',
  'totalMarriages',
  'totalDivorces',
  'totalAssetsOwned',
  'totalCrimesCommitted',
  'totalJailTime',
  'degreesEarned',
  'companiesStarted',
];

export class LifetimeStats {
  constructor() {
    this.stats = this.loadStats();
  }

  loadStats() {
    const defaults = createDefaultStats();
    try {
      const saved = localStorage.getItem('bitlife_lifetime_stats');
      if (!saved) {
        return defaults;
      }
      const parsed = JSON.parse(saved);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return defaults;
      }

      const merged = {
        ...defaults,
        ...parsed,
        highestNetWorth: { ...defaults.highestNetWorth, ...(parsed.highestNetWorth || {}) },
        longestLife: { ...defaults.longestLife, ...(parsed.longestLife || {}) },
        mostChildren: { ...defaults.mostChildren, ...(parsed.mostChildren || {}) },
        highestFame: { ...defaults.highestFame, ...(parsed.highestFame || {}) },
        mostCriminal: { ...defaults.mostCriminal, ...(parsed.mostCriminal || {}) },
        jobsHeld:
          parsed.jobsHeld && typeof parsed.jobsHeld === 'object' && !Array.isArray(parsed.jobsHeld)
            ? parsed.jobsHeld
            : {},
        countriesLived:
          parsed.countriesLived &&
          typeof parsed.countriesLived === 'object' &&
          !Array.isArray(parsed.countriesLived)
            ? parsed.countriesLived
            : {},
      };
      NUMBER_FIELDS.forEach(field => {
        const value = Number(merged[field]);
        merged[field] = Number.isFinite(value) && value >= 0 ? value : 0;
      });
      return merged;
    } catch (error) {
      console.warn('Unable to load lifetime statistics.', error);
      return defaults;
    }
  }

  saveStats() {
    try {
      localStorage.setItem('bitlife_lifetime_stats', JSON.stringify(this.stats));
    } catch (error) {
      console.warn('Unable to save lifetime statistics.', error);
    }
  }

  recordLife(person) {
    const fullName =
      typeof person.getFullName === 'function'
        ? person.getFullName()
        : `${person.name?.first || person.firstName || 'Unknown'} ${person.name?.last || person.lastName || ''}`.trim();

    // Update cumulative stats
    this.stats.livesLived++;
    this.stats.totalYearsLived += person.age;

    // Money tracking
    const netWorth = person.getTotalEstateValue();
    this.stats.totalMoneyEarned += netWorth;

    // Check if new record
    if (netWorth > this.stats.highestNetWorth.value) {
      this.stats.highestNetWorth = {
        value: netWorth,
        name: fullName,
        age: person.age,
      };
    }

    // Age record
    if (person.age > this.stats.longestLife.age) {
      this.stats.longestLife = {
        age: person.age,
        name: fullName,
      };
    }

    // Children
    const relationships = Array.isArray(person.relationships) ? person.relationships : [];
    const childrenCount = relationships.filter(r => r.type === 'Child').length;
    this.stats.totalChildrenBorn += childrenCount;
    if (childrenCount > this.stats.mostChildren.count) {
      this.stats.mostChildren = {
        count: childrenCount,
        name: fullName,
      };
    }

    // Fame
    if (person.fame > this.stats.highestFame.value) {
      this.stats.highestFame = {
        value: person.fame,
        name: fullName,
      };
    }

    // Notoriety
    if (person.notoriety > this.stats.mostCriminal.notoriety) {
      this.stats.mostCriminal = {
        notoriety: person.notoriety,
        name: fullName,
      };
    }

    // Other stats
    this.stats.totalMarriages += relationships.filter(r => r.type === 'Spouse').length;
    this.stats.totalAssetsOwned += Array.isArray(person.assets) ? person.assets.length : 0;
    this.stats.degreesEarned += person.degrees ? person.degrees.length : 0;

    // Job tracking
    if (person.job) {
      const jobId = person.job.title || 'Unknown';
      this.stats.jobsHeld[jobId] = (this.stats.jobsHeld[jobId] || 0) + 1;
      this.stats.totalJobsHeld++;
    }

    // Country tracking
    if (person.country) {
      this.stats.countriesLived[person.country] =
        (this.stats.countriesLived[person.country] || 0) + person.age;
    }

    this.saveStats();
  }

  getStats() {
    return this.stats;
  }

  reset() {
    try {
      localStorage.removeItem('bitlife_lifetime_stats');
    } catch {
      /* storage is optional */
    }
    this.stats = createDefaultStats();
    this.saveStats();
  }
}

export const lifetimeStats = new LifetimeStats();
