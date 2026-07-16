import { GameEngine } from './GameEngine';
import { getActiveMonthlySituation } from './TimeProgression';

const originalAgeUp = GameEngine.ageUp.bind(GameEngine);

GameEngine.ageUp = function ageUpWithSmartMonthlyFastForward(person, amount = 1) {
  if (amount !== 'smart_months') {
    return originalAgeUp(person, amount);
  }

  person.fastForwardResult = null;
  let completedMonths = 0;
  const startingAge = Number(person.age) || 0;
  const startingMonth = Number(person.timeProgress?.month) || 0;

  for (let index = 0; index < 12; index += 1) {
    if (!person.isAlive || person.pendingEvent || !getActiveMonthlySituation(person)) break;
    originalAgeUp(person, 'month');
    completedMonths += 1;
    if (!person.isAlive || person.pendingEvent || !getActiveMonthlySituation(person)) break;
  }

  person.fastForwardResult = {
    mode: 'months',
    requestedMonths: 12,
    completedMonths,
    startingAge,
    startingMonth,
    stoppedAtAge: Number(person.age) || 0,
    stoppedAtMonth: Number(person.timeProgress?.month) || 0,
    reason: !person.isAlive
      ? 'death'
      : person.pendingEvent
        ? 'decision'
        : !getActiveMonthlySituation(person)
          ? 'situation_complete'
          : 'month_limit',
  };
  return person;
};
