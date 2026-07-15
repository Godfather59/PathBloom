import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const strategies = ['balanced', 'academic', 'worker', 'entrepreneur', 'criminal', 'carefree', 'passive'];

function parseInteger(value, label, minimum, maximum) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(`${label} must be between ${minimum} and ${maximum}.`);
  }
  return parsed;
}

function parseArgs(argv) {
  const options = { lives: 1000, seed: 20260713, maxAge: 120, saveEvery: 10 };
  let json = false;
  let strict = false;
  let output = null;
  let replaySeed = null;
  let replayStrategy = 'balanced';

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    const next = () => {
      index++;
      if (index >= argv.length) throw new Error(`${argument} requires a value.`);
      return argv[index];
    };

    if (argument === '--lives') options.lives = parseInteger(next(), 'lives', 1, 50000);
    else if (argument === '--seed') options.seed = next();
    else if (argument === '--replay') replaySeed = parseInteger(next(), 'replay seed', 0, 4294967295);
    else if (argument === '--strategy') replayStrategy = next();
    else if (argument === '--max-age') options.maxAge = parseInteger(next(), 'max age', 20, 130);
    else if (argument === '--save-every') options.saveEvery = parseInteger(next(), 'save interval', 0, 100);
    else if (argument === '--strategies') options.strategies = next().split(',').map(value => value.trim()).filter(Boolean);
    else if (argument === '--json') json = true;
    else if (argument === '--strict') strict = true;
    else if (argument === '--output') output = next();
    else if (argument === '--help' || argument === '-h') return { help: true };
    else throw new Error(`Unknown option: ${argument}`);
  }
  if (!strategies.includes(replayStrategy)) {
    throw new Error(`strategy must be one of: ${strategies.join(', ')}.`);
  }
  return { options, json, strict, output, replaySeed, replayStrategy, help: false };
}

function printHelp() {
  console.log(`PathBloom life-simulation runner

Usage: npm run simulate -- [options]

Options:
  --lives N              Number of lives (default: 1000)
  --seed VALUE           Reproducible base seed (default: 20260713)
  --replay SEED          Replay one exact life from a reported seed
  --strategy NAME        Play style for --replay (default: balanced)
  --max-age N            Safety age cap, 20-130 (default: 120)
  --save-every N         JSON save/load interval; 0 disables (default: 10)
  --strategies LIST      Comma-separated play styles
  --json                 Print the complete JSON report
  --output PATH          Also write the complete JSON report to a file
  --strict               Exit non-zero for balance warnings as well as errors
  -h, --help             Show this help

Play styles: balanced, academic, worker, entrepreneur, criminal, carefree, passive`);
}

let parsed;
try {
  parsed = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(`Error: ${error.message}`);
  printHelp();
  process.exitCode = 1;
}

if (parsed?.help) {
  printHelp();
} else if (parsed) {
  const server = await createServer({
    root,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false }
  });

  try {
    const simulation = await server.ssrLoadModule('/src/logic/LifeSimulation.js');
    const startedAt = performance.now();
    const report = parsed.replaySeed === null
      ? simulation.runSimulationBatch(parsed.options)
      : (() => {
          const outcome = simulation.simulateLife({
            ...parsed.options,
            resolvedSeed: parsed.replaySeed,
            strategy: parsed.replayStrategy
          });
          return {
            summary: simulation.summarizeSimulation([outcome], {
              ...parsed.options,
              lives: 1,
              seed: parsed.replaySeed
            }),
            outcomes: [outcome]
          };
        })();
    report.summary.runtimeMs = Math.round(performance.now() - startedAt);

    if (parsed.json) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(simulation.formatSimulationReport(report));
      console.log(`Runtime: ${(report.summary.runtimeMs / 1000).toFixed(2)}s`);
    }

    if (parsed.output) {
      const outputPath = resolve(root, parsed.output);
      await mkdir(dirname(outputPath), { recursive: true });
      await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
      const notify = parsed.json ? console.error : console.log;
      notify(`Report written to ${outputPath}`);
    }

    const reliabilityFailed = report.summary.reliability.crashes > 0 || report.summary.reliability.invariantViolations > 0;
    const balanceFailed = report.summary.warnings.some(warning => warning.severity === 'warning');
    if (reliabilityFailed || (parsed.strict && balanceFailed)) process.exitCode = 1;
  } finally {
    await server.close();
  }
}
