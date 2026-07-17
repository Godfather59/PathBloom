import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const countries = ['Morocco', 'United States', 'France', 'Japan', 'Russia', 'Canada', 'Brazil'];
const livesArg = process.argv.find(argument => argument.startsWith('--lives='));
const lives = Math.max(1, Math.min(5000, Number(livesArg?.split('=')[1]) || 100));

const server = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
});

try {
  await server.ssrLoadModule('/src/logic/GameEngineRuntimeFixes.js');
  await server.ssrLoadModule('/src/logic/DeepSimulationRuntime.js');
  await server.ssrLoadModule('/src/logic/CountryJobRuntime.js');
  const { Person } = await server.ssrLoadModule('/src/logic/Person.js');
  const { GameEngine } = await server.ssrLoadModule('/src/logic/GameEngine.js');

  const report = {
    lives,
    crashes: 0,
    invalidStates: 0,
    unresolvedEvents: 0,
    completedChains: 0,
    activeChains: 0,
    pregnancies: 0,
    bankruptcies: 0,
    totalDebt: 0,
    creditScores: [],
    lifespans: [],
    reputation: { professional: [], criminal: [], family: [], public: [], trust: [] },
    errors: [],
  };

  function resolvePending(person) {
    let guard = 0;
    while (person.pendingEvent && guard < 20) {
      const choices = Array.isArray(person.pendingEvent.choices) ? person.pendingEvent.choices : [];
      if (choices.length === 0) {
        report.unresolvedEvents += 1;
        person.pendingEvent = null;
        break;
      }
      person.resolveEvent(choices[Math.floor(Math.random() * choices.length)]);
      guard += 1;
    }
    if (guard >= 20) report.unresolvedEvents += 1;
  }

  function validate(person, index) {
    const numeric = [
      person.age,
      person.money,
      person.personalDebt,
      person.health,
      person.happiness,
      person.reputation?.professional,
      person.reputation?.criminal,
      person.reputation?.family,
      person.finance?.creditScore,
    ];
    const invalid =
      numeric.some(value => !Number.isFinite(Number(value))) ||
      person.finance?.creditScore < 300 ||
      person.finance?.creditScore > 850 ||
      Object.values(person.reputation || {}).some(
        value => typeof value === 'number' && (value < 0 || value > 100)
      );
    if (invalid) {
      report.invalidStates += 1;
      if (report.errors.length < 10) {
        report.errors.push({ index, age: person.age, reason: 'invalid numeric state' });
      }
    }
  }

  for (let index = 0; index < lives; index += 1) {
    try {
      const country = countries[index % countries.length];
      const person = new Person(`Sim${index}`, 'Deep', index % 2 ? 'Female' : 'Male', country);
      GameEngine.initializeFamily(person);

      while (person.isAlive && person.age < 100) {
        resolvePending(person);
        GameEngine.ageUp(person, 1);
        resolvePending(person);
        validate(person, index);
      }

      report.lifespans.push(person.age);
      report.completedChains += person.completedEventChains?.length || 0;
      report.activeChains += person.eventChains?.length || 0;
      report.pregnancies += person.pregnancy?.active ? 1 : 0;
      report.bankruptcies += person.bankruptcies || 0;
      report.totalDebt +=
        Math.max(0, Number(person.personalDebt) || 0) + Math.max(0, Number(person.loans) || 0);
      report.creditScores.push(person.finance?.creditScore || 650);
      Object.keys(report.reputation).forEach(key =>
        report.reputation[key].push(person.reputation?.[key] || 0)
      );
    } catch (error) {
      report.crashes += 1;
      if (report.errors.length < 10) {
        report.errors.push({ index, reason: error?.stack || error?.message || String(error) });
      }
    }
  }

  const average = values =>
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const median = values => {
    const list = [...values].sort((a, b) => a - b);
    if (!list.length) return 0;
    const middle = Math.floor(list.length / 2);
    return list.length % 2 ? list[middle] : (list[middle - 1] + list[middle]) / 2;
  };

  const summary = {
    lives: report.lives,
    crashes: report.crashes,
    invalidStates: report.invalidStates,
    unresolvedEvents: report.unresolvedEvents,
    medianLifespan: median(report.lifespans),
    averageCreditScore: Math.round(average(report.creditScores)),
    averageDebt: Math.round(report.totalDebt / Math.max(1, lives)),
    completedChains: report.completedChains,
    activeChainsAtDeathOrCap: report.activeChains,
    bankruptcies: report.bankruptcies,
    averageReputation: Object.fromEntries(
      Object.entries(report.reputation).map(([key, values]) => [key, Math.round(average(values))])
    ),
    errors: report.errors,
  };

  console.log(JSON.stringify(summary, null, 2));
  if (
    summary.crashes > 0 ||
    summary.invalidStates > 0 ||
    summary.unresolvedEvents > Math.max(2, lives * 0.02)
  ) {
    process.exitCode = 1;
  }
} finally {
  await server.close();
}
