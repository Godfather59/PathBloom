// SimulationBench — dev tool to mass-simulate lives and detect errors
import { Person } from '../logic/Person';
import { GameEngine } from '../logic/GameEngine';

export function runSimulationBatch(count = 100, maxAge = 80) {
  const results = {
    total: 0,
    deaths: 0,
    errors: [],
    deathCauses: {},
    jobsAtDeath: {},
    finalMoney: [],
    lifespans: [],
    warsFought: 0,
    nanMoney: 0,
    nanStats: 0,
    ageBugs: 0,
  };

  for (let i = 0; i < count; i++) {
    try {
      const person = new Person();
      while (person.isAlive && person.age < maxAge && !person.pendingEvent) {
        GameEngine.simulateYear(person);
        if (typeof person.money !== 'number' || isNaN(person.money)) {
          results.nanMoney++;
          break;
        }
        for (const stat of ['happiness', 'health', 'smarts', 'looks', 'stress', 'karma']) {
          if (
            typeof person[stat] !== 'number' ||
            isNaN(person[stat]) ||
            person[stat] < -1000 ||
            person[stat] > 1000
          ) {
            results.nanStats++;
            break;
          }
        }
        if (!person.isAlive) {
          break;
        }
      }
      results.total++;
      if (!person.isAlive) {
        results.deaths++;
        const cause = person.deathCause || 'unknown';
        results.deathCauses[cause] = (results.deathCauses[cause] || 0) + 1;
        results.lifespans.push(person.age);
      }
      if (person.job) {
        results.jobsAtDeath[person.job.title] = (results.jobsAtDeath[person.job.title] || 0) + 1;
      }
      results.finalMoney.push(person.money || 0);
      if (person.wars) {
        results.warsFought += Object.keys(person.wars).length;
      }
      if (person.age > maxAge + 5 || person.age < 0) {
        results.ageBugs++;
      }
    } catch (e) {
      results.errors.push(e.message);
    }
  }

  return results;
}

export function printSimulationReport(results) {
  const lines = [
    '=== SIMULATION BENCH REPORT ===',
    `Total lives simulated: ${results.total}`,
    `Deaths: ${results.deaths} (${results.total > 0 ? Math.round((results.deaths / results.total) * 100) : 0}%)`,
    `Errors: ${results.errors.length}`,
    `NaN money bugs: ${results.nanMoney}`,
    `NaN stat bugs: ${results.nanStats}`,
    `Age bugs: ${results.ageBugs}`,
    `Wars fought: ${results.warsFought}`,
    '',
    'Death causes:',
    ...Object.entries(results.deathCauses)
      .sort((a, b) => b[1] - a[1])
      .map(([cause, count]) => `  ${cause}: ${count}`),
    '',
    'Common jobs at death:',
    ...Object.entries(results.jobsAtDeath)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([job, count]) => `  ${job}: ${count}`),
    '',
    `Average lifespan: ${results.lifespans.length > 0 ? Math.round(results.lifespans.reduce((a, b) => a + b, 0) / results.lifespans.length) : 'N/A'}`,
    `Average final money: $${results.finalMoney.length > 0 ? Math.round(results.finalMoney.reduce((a, b) => a + b, 0) / results.finalMoney.length).toLocaleString() : 'N/A'}`,
  ];
  console.log(lines.join('\n'));
  return lines;
}
