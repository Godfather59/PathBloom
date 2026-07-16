import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const worldsArg = process.argv.find(argument => argument.startsWith('--worlds='));
const monthsArg = process.argv.find(argument => argument.startsWith('--months='));
const worlds = Math.max(1, Math.min(5000, Number(worldsArg?.split('=')[1]) || 100));
const months = Math.max(12, Math.min(2400, Number(monthsArg?.split('=')[1]) || 600));
const countries = ['Morocco', 'United States', 'France', 'Germany', 'Russia', 'China', 'Japan', 'India', 'Brazil', 'Saudi Arabia', 'UAE', 'Canada'];

const report = {
  worlds,
  months,
  crashes: 0,
  invalidWorlds: 0,
  totalWars: 0,
  activeWars: 0,
  peaceDeals: 0,
  elections: 0,
  coups: 0,
  revolutions: 0,
  sanctions: 0,
  migrationFlows: 0,
  refugees: 0,
  averageGlobalGrowth: 0,
  averageGlobalInflation: 0,
  averageTension: 0,
  errors: [],
};

const server = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
});

try {
  const { Person } = await server.ssrLoadModule('/src/logic/Person.js');
  const {
    ensureWorldSimulation2,
    simulateWorldMonths,
    validateWorldSimulation2,
  } = await server.ssrLoadModule('/src/logic/WorldSimulation2.js');

  for (let index = 0; index < worlds; index += 1) {
    try {
      const country = countries[index % countries.length];
      const person = new Person(`World${index}`, 'Simulation', index % 2 ? 'Female' : 'Male', country);
      person.age = 30;
      person.isAlive = true;
      person.contentState = { flags: {}, scheduled: [], history: {}, resolved: [] };
      ensureWorldSimulation2(person);

      let remaining = months;
      while (remaining > 0) {
        const step = Math.min(120, remaining);
        simulateWorldMonths(person, step, { playerConsequences: false });
        remaining -= step;
      }

      const world = person.worldSimulation2;
      const validation = validateWorldSimulation2(person);
      if (!validation.valid) {
        report.invalidWorlds += 1;
        if (report.errors.length < 10) report.errors.push({ index, errors: validation.errors });
      }

      report.totalWars += world.wars.length;
      report.activeWars += world.wars.filter(war => war.status === 'active').length;
      report.peaceDeals += world.timeline.filter(event => event.type === 'peace').length;
      report.elections += world.timeline.filter(event => event.type === 'election').length;
      report.coups += world.timeline.filter(event => event.type === 'coup').length;
      report.revolutions += world.timeline.filter(event => event.type === 'revolution').length;
      report.sanctions += world.sanctions.filter(item => item.active).length;
      report.migrationFlows += world.migrationFlows.length;
      report.refugees += Number(world.global.refugees) || 0;
      report.averageGlobalGrowth += Number(world.global.growth) || 0;
      report.averageGlobalInflation += Number(world.global.inflation) || 0;
      report.averageTension += Number(world.global.tension) || 0;
    } catch (error) {
      report.crashes += 1;
      if (report.errors.length < 10) {
        report.errors.push({ index, error: error?.stack || error?.message || String(error) });
      }
    }
  }
} finally {
  await server.close();
}

report.averageGlobalGrowth = Number((report.averageGlobalGrowth / worlds).toFixed(2));
report.averageGlobalInflation = Number((report.averageGlobalInflation / worlds).toFixed(2));
report.averageTension = Number((report.averageTension / worlds).toFixed(2));
report.averageRefugees = Math.round(report.refugees / worlds);
delete report.refugees;

console.log(JSON.stringify(report, null, 2));
if (report.crashes > 0 || report.invalidWorlds > 0) process.exitCode = 1;
