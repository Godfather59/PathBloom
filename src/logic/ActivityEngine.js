// ActivityEngine — resolves activity outcomes with dynamic event chains

import { ACTIVITIES } from './Activities';

/**
 * Resolve an activity's outcome, possibly triggering event chains.
 * Returns { success, text, type, effects, unlock, followUp }
 */
export function resolveActivity(person, activity) {
  if (!activity) return null;

  const outcome = pickOutcome(activity, person);

  const result = {
    success: true,
    text: outcome.text || activity.text,
    type: outcome.type || activity.type || 'neutral',
    effects: { ...(activity.effects || {}), ...(outcome.effects || {}) },
    unlock: outcome.unlock || null,
    followUp: null,
  };

  if (outcome.chains) {
    result.followUp = triggerChain(outcome.chains, person);
  }

  if (result.unlock) {
    applyUnlock(person, result.unlock);
  }

  return result;
}

function pickOutcome(activity, person) {
  if (!Array.isArray(activity.outcomes) || activity.outcomes.length === 0) {
    return { text: activity.text, type: activity.type, effects: {} };
  }

  const roll = Math.random();
  let cumulative = 0;
  for (const outcome of activity.outcomes) {
    const chance = outcome.chance || 0;
    if (outcome.condition && !outcome.condition(person)) continue;
    cumulative += chance;
    if (roll < cumulative) return outcome;
  }

  // Fallback to default outcome
  return activity.outcomes[0] || { text: activity.text, type: activity.type, effects: {} };
}

function triggerChain(chains, person) {
  if (!Array.isArray(chains)) return null;
  const chain = chains[Math.floor(Math.random() * chains.length)];
  if (!chain || !chain.events) return null;

  for (const event of chain.events) {
    const conditionMet = !event.condition || event.condition(person);
    if (conditionMet && Math.random() < (event.chance || 1)) {
      return {
        text: event.text,
        type: event.type || 'neutral',
        effects: event.effects || {},
      };
    }
  }
  return null;
}

function applyUnlock(person, unlock) {
  if (!unlock) return;
  if (!Array.isArray(person.unlockedFeatures)) person.unlockedFeatures = [];
  if (!person.unlockedFeatures.includes(unlock)) {
    person.unlockedFeatures.push(unlock);
    person.logEvent(`🔓 Unlocked: ${unlock}`, 'good');
  }
}

/**
 * Activity outcomes are now defined per activity.
 * This function returns the enriched activity with default outcomes
 * for activities that don't define their own.
 */
export function getActivityWithDefaults(activity) {
  if (activity.outcomes) return activity;

  const enriched = { ...activity };

  // Generate sensible default outcomes based on activity type
  if (activity.risk === 'high' || activity.risk === 'extreme') {
    enriched.outcomes = [
      {
        chance: 0.6 - (activity.risk === 'extreme' ? 0.2 : 0),
        text: activity.text + ' It went well!',
        type: 'good',
        effects: {},
        condition: () => Math.random() < 0.6,
      },
      {
        chance: 0.4 + (activity.risk === 'extreme' ? 0.2 : 0),
        text: 'Things went wrong. ' + (activity.text || ''),
        type: 'bad',
        effects: { health: -3, stress: 10, happiness: -5 },
      },
    ];
  }

  if (activity.id === 'gym') {
    enriched.outcomes = [
      {
        chance: 0.5, text: 'You had a great workout!', type: 'good', effects: { health: 4, looks: 2, stress: -8 },
        chains: [{
          events: [
            { text: 'Your consistency impressed a fitness influencer. They offered you a shoutout!', type: 'good', effects: { fame: 5 }, chance: 0.15, condition: p => (p.fame || 0) < 20 },
            { text: 'A gym regular invited you to join a running club.', type: 'good', effects: { happiness: 3, health: 2 }, chance: 0.1 },
          ],
        }],
      },
      { chance: 0.25, text: 'You pulled a muscle at the gym.', type: 'bad', effects: { health: -2, stress: 5 } },
      { chance: 0.15, text: 'You met a personal trainer who gave you tips.', type: 'good', effects: { health: 3, looks: 1, happiness: 3 }, unlock: 'personal_training' },
      {
        chance: 0.1, text: 'Someone challenged you to a spar! You made a gym friend.', type: 'good', effects: { health: 2, happiness: 5 },
        chains: [{
          events: [
            { text: 'Your new gym buddy introduced you to their boxing club.', type: 'good', effects: { health: 3, happiness: 3 }, chance: 0.3 },
            { text: 'You started training together regularly. Your fitness improved!', type: 'good', effects: { health: 5, looks: 2 }, chance: 0.4 },
          ],
        }],
      },
    ];
  }

  if (activity.id === 'library') {
    enriched.outcomes = [
      {
        chance: 0.5, text: 'You read a fascinating book.', type: 'good', effects: { smarts: 3, happiness: 2 },
        chains: [{
          events: [
            { text: 'The book inspired you to start writing your own stories.', type: 'good', effects: { happiness: 3, smarts: 2 }, chance: 0.1, condition: p => (p.smarts || 0) > 60 },
            { text: 'You joined a local book club after finishing the book.', type: 'good', effects: { happiness: 4 }, chance: 0.15 },
          ],
        }],
      },
      {
        chance: 0.2, text: 'You found a rare book that changed your perspective.', type: 'good', effects: { smarts: 5, happiness: 3 },
        chains: [{
          events: [
            { text: 'The rare book turned out to be valuable! You sold it for a profit.', type: 'good', effects: { money: 2000 }, chance: 0.2 },
            { text: 'You became obsessed with the topic and started researching deeply.', type: 'good', effects: { smarts: 5 }, chance: 0.3 },
          ],
        }],
      },
      { chance: 0.2, text: 'You studied quietly for hours.', type: 'good', effects: { smarts: 2 } },
      { chance: 0.1, text: 'You discovered a local study group.', type: 'good', effects: { smarts: 2, happiness: 2 }, unlock: 'study_group' },
    ];
  }

  if (activity.id === 'plastic_surgery') {
    enriched.outcomes = [
      {
        chance: 0.7, text: 'The surgery was a success! You look amazing.', type: 'good', effects: { looks: 20, happiness: 10 },
        chains: [{
          events: [
            { text: 'Your new look got you noticed. A modeling agency reached out!', type: 'good', effects: { fame: 15 }, chance: 0.1, condition: p => (p.looks || 0) > 80 },
          ],
        }],
      },
      { chance: 0.15, text: 'The results are decent but not what you expected.', type: 'neutral', effects: { looks: 10, happiness: -3 } },
      {
        chance: 0.1, text: 'Minor complications. Recovery will take time.', type: 'bad', effects: { looks: 5, health: -10, stress: 15 },
        chains: [{
          events: [
            { text: 'The complications led to an infection. You needed additional treatment.', type: 'bad', effects: { health: -10, money: -5000 }, chance: 0.3 },
          ],
        }],
      },
      {
        chance: 0.05, text: 'The surgery went horribly wrong!', type: 'bad', effects: { looks: -10, health: -20, stress: 30 },
        chains: [{
          events: [
            { text: 'You filed a malpractice lawsuit. The legal battle is draining.', type: 'bad', effects: { money: -10000, stress: 15 }, chance: 0.5 },
            { text: 'The botched surgery scarred you for life.', type: 'bad', effects: { looks: -5, happiness: -10 }, chance: 0.5 },
          ],
        }],
      },
    ];
  }

  if (activity.id === 'club') {
    enriched.outcomes = [
      {
        chance: 0.4, text: 'You danced all night!', type: 'good', effects: { happiness: 8, stress: -10 },
        chains: [{
          events: [
            { text: 'A talent scout spotted you on the dance floor!', type: 'good', effects: { fame: 10 }, chance: 0.05, condition: p => (p.looks || 0) > 60 },
            { text: 'You made a group of new friends.', type: 'good', effects: { happiness: 5 }, chance: 0.2 },
          ],
        }],
      },
      {
        chance: 0.2, text: 'You met someone interesting!', type: 'good', effects: { happiness: 10, stress: -5 },
        chains: [{
          events: [
            { text: 'You exchanged numbers. A new romance might bloom!', type: 'good', effects: { happiness: 5 }, chance: 0.4 },
          ],
        }],
      },
      { chance: 0.2, text: 'You had fun but spent too much.', type: 'neutral', effects: { happiness: 5, stress: -3 } },
      { chance: 0.15, text: 'You got into a minor argument.', type: 'bad', effects: { happiness: -3, stress: 8 } },
      {
        chance: 0.05, text: 'The bouncer threw you out!', type: 'bad', effects: { happiness: -10, stress: 15, fame: -2 },
        chains: [{
          events: [
            { text: 'Word got around. Your reputation took a hit.', type: 'bad', effects: { fame: -3, notoriety: 2 }, chance: 0.3 },
          ],
        }],
      },
    ];
  }

  return enriched;
}
