import { GameEngine } from './GameEngine';
import { Person } from './Person';
import { getCountryRules } from './CountryLifeSystem';

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

function getSalaryMultiplier(person, countryState, rules) {
  const economicPower = Number(countryState?.power ?? countryState?.technology ?? 55);
  const stability = Number(countryState?.stability ?? 55);
  const productivity = 0.64 + rules.costOfLiving * 0.25 + economicPower / 500 + (stability - 50) / 1000;
  return clamp(productivity, 0.55, 1.4);
}

function isProtectedCareer(jobData) {
  return Boolean(
    jobData?.isMilitary ||
      jobData?.isPolitical ||
      jobData?.isRoyal ||
      jobData?.isMafia ||
      jobData?.isNationalService
  );
}

const originalSetJob = Person.prototype.setJob;
Person.prototype.setJob = function setJobWithCountryEconomy(jobData) {
  if (!jobData || typeof jobData !== 'object') {
    return originalSetJob.call(this, jobData);
  }

  const countryState = GameEngine.getCountryForPerson?.(this) || null;
  const rules = getCountryRules(this, countryState);
  const protectedCareer = isProtectedCareer(jobData);
  const unemployment = Math.max(0, Number(rules.unemploymentRate) || 0);
  const marketWeakness = Math.max(0, 50 - (Number(rules.jobMarketStrength) || 50));
  const rejectionChance = protectedCareer
    ? 0
    : clamp((unemployment - 6) / 170 + marketWeakness / 650, 0, 0.28);

  if (rejectionChance > 0 && Math.random() < rejectionChance) {
    this.logEvent(
      `The employer rejected your ${jobData.title || 'job'} application because the ${this.country} job market is highly competitive.`,
      'bad'
    );
    this.updateStats?.({ happiness: -3, stress: 3 });
    return false;
  }

  const salary = Math.max(0, Number(jobData.salary) || 0);
  const salaryMultiplier = protectedCareer ? 1 : getSalaryMultiplier(this, countryState, rules);
  const adjustedJob = {
    ...jobData,
    salary: Math.max(0, Math.floor(salary * salaryMultiplier)),
    baseSalary: Number(jobData.baseSalary ?? salary),
    countrySalaryMultiplier: salaryMultiplier,
    countryAtHire: this.country,
  };

  return originalSetJob.call(this, adjustedJob);
};
