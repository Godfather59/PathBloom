// Deck of cards
const SUITS = ['S', 'H', 'D', 'C'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const createDeck = () => {
  const deck = [];
  for (const s of SUITS) {
    for (const r of RANKS) {
      deck.push({ suit: s, rank: r, value: getValue(r) });
    }
  }
  return shuffle(deck);
};

const getValue = rank => {
  if (['J', 'Q', 'K'].includes(rank)) {
    return 10;
  }
  if (rank === 'A') {
    return 11;
  }
  return parseInt(rank, 10);
};

const shuffle = array => {
  return array.sort(() => Math.random() - 0.5);
};

export const calculateScore = hand => {
  let score = 0;
  let aces = 0;
  for (const card of hand) {
    score += card.value;
    if (card.rank === 'A') {
      aces++;
    }
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
};

// Horse Racing
export const HORSES = [
  { id: 1, name: 'Lucky Strike', odds: 2 }, // 2:1 payout (approx 33-40% win chance)
  { id: 2, name: 'Thunderbolt', odds: 5 }, // 5:1 (approx 15-20%)
  { id: 3, name: 'Slowpoke', odds: 10 }, // 10:1 (Longshot)
  { id: 4, name: 'Majestic', odds: 3 },
  { id: 5, name: 'Glue Factory', odds: 50 }, // The 50:1 dream
];

export const runRace = () => {
  // Weighted random winner based on odds
  // Simple version: strictly random or biased?
  // Let's do a simple biased roll. Lower odds = higher weight.
  // Weight = 1 / odds

  const candidates = [];
  HORSES.forEach(h => {
    const count = Math.ceil(100 / h.odds); // 2:1 -> 50 tickets, 50:1 -> 2 tickets
    for (let i = 0; i < count; i++) {
      candidates.push(h.id);
    }
  });

  const winnerId = candidates[Math.floor(Math.random() * candidates.length)];
  return winnerId;
};

export const SLOT_REELS = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
export const SLOT_PAYOUTS = Object.freeze({
  '🍒🍒🍒': 2,
  '🍋🍋🍋': 4,
  '🍊🍊🍊': 6,
  '🍇🍇🍇': 10,
  '💎💎💎': 25,
  '7️⃣7️⃣7️⃣': 150,
});

export const getSlotPayout = (reels, wager = 10) => {
  const amount = Math.floor(Number(wager));
  if (!Array.isArray(reels) || reels.length !== 3 || !Number.isFinite(amount) || amount <= 0) {
    return 0;
  }
  const multiplier = SLOT_PAYOUTS[reels.join('')] || 0;
  return amount * multiplier;
};

export const getTheoreticalSlotRtp = () =>
  Object.values(SLOT_PAYOUTS).reduce((sum, multiplier) => sum + multiplier, 0) /
  SLOT_REELS.length ** 3;

// Lottery
export const LOTTERY_TICKET_COST = 5;
export const LOTTERY_JACKPOT = 10000000;
export const LOTTERY_JACKPOT_ODDS = 2500000;

export const playLottery = () => {
  return Math.floor(Math.random() * LOTTERY_JACKPOT_ODDS) === 0;
};
