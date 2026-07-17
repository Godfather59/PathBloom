import React, { useRef, useState } from 'react';
import {
  createDeck,
  calculateScore,
  HORSES,
  runRace,
  playLottery,
  SLOT_REELS as REELS,
  SLOT_PAYOUTS,
  getSlotPayout,
  LOTTERY_TICKET_COST,
  LOTTERY_JACKPOT,
} from '../logic/Gambling';
import { showGameToast } from '../utils/GameToast';
import './Modal.css';

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createPokerDeck() {
  const d = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      d.push({ rank, suit, value: RANKS.indexOf(rank) + 2 });
    }
  }
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function compareHands(left, right) {
  if (left.rank !== right.rank) {
    return left.rank - right.rank;
  }
  const maxKickers = Math.max(left.kickers.length, right.kickers.length);
  for (let i = 0; i < maxKickers; i++) {
    const difference = (left.kickers[i] || 0) - (right.kickers[i] || 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}

function evaluateFiveCardHand(cards) {
  const values = cards.map(c => c.value).sort((a, b) => b - a);
  const suits = cards.map(c => c.suit);
  const counts = {};
  values.forEach(v => {
    counts[v] = (counts[v] || 0) + 1;
  });
  const groups = Object.entries(counts)
    .map(([value, count]) => ({ value: Number(value), count }))
    .sort((a, b) => b.count - a.count || b.value - a.value);

  const isFlush = suits.every(s => s === suits[0]);
  const uniqueValues = [...new Set(values)];
  const isWheel = uniqueValues.join(',') === '14,5,4,3,2';
  const isStraight =
    uniqueValues.length === 5 &&
    uniqueValues.every((value, index) => index === 0 || value === uniqueValues[index - 1] - 1);
  const straightHigh = isWheel ? 5 : uniqueValues[0];

  if (isFlush && (isStraight || isWheel)) {
    return { rank: 8, name: 'Straight Flush', kickers: [straightHigh] };
  }
  if (groups[0].count === 4) {
    return { rank: 7, name: 'Four of a Kind', kickers: [groups[0].value, groups[1].value] };
  }
  if (groups[0].count === 3 && groups[1]?.count === 2) {
    return { rank: 6, name: 'Full House', kickers: [groups[0].value, groups[1].value] };
  }
  if (isFlush) {
    return { rank: 5, name: 'Flush', kickers: values };
  }
  if (isStraight || isWheel) {
    return { rank: 4, name: 'Straight', kickers: [straightHigh] };
  }
  if (groups[0].count === 3) {
    return {
      rank: 3,
      name: 'Three of a Kind',
      kickers: [groups[0].value, ...groups.slice(1).map(group => group.value)],
    };
  }
  if (groups[0].count === 2 && groups[1]?.count === 2) {
    const pairs = [groups[0].value, groups[1].value].sort((a, b) => b - a);
    return { rank: 2, name: 'Two Pair', kickers: [...pairs, groups[2].value] };
  }
  if (groups[0].count === 2) {
    return {
      rank: 1,
      name: 'One Pair',
      kickers: [groups[0].value, ...groups.slice(1).map(group => group.value)],
    };
  }
  return { rank: 0, name: 'High Card', kickers: values };
}

function evaluateHand(cards) {
  if (cards.length < 5) {
    return { rank: -1, name: 'Incomplete Hand', kickers: [] };
  }
  let best = null;
  for (let a = 0; a < cards.length - 4; a++) {
    for (let b = a + 1; b < cards.length - 3; b++) {
      for (let c = b + 1; c < cards.length - 2; c++) {
        for (let d = c + 1; d < cards.length - 1; d++) {
          for (let e = d + 1; e < cards.length; e++) {
            const candidate = evaluateFiveCardHand([
              cards[a],
              cards[b],
              cards[c],
              cards[d],
              cards[e],
            ]);
            if (!best || compareHands(candidate, best) > 0) {
              best = candidate;
            }
          }
        }
      }
    }
  }
  return best;
}

export function GamblingMenu({
  person,
  onResult,
  onClose,
  allowLottery = true,
  t = (key, fallback) => fallback || key,
}) {
  const [view, setView] = useState('menu');
  const [bet, setBet] = useState(100);

  // Blackjack State
  const [deck, setDeck] = useState([]);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameState, setGameState] = useState('betting');
  const blackjackWagerRef = useRef(0);
  const blackjackSettledRef = useRef(false);

  // Racing State
  const [selectedHorse, setSelectedHorse] = useState(null);
  const horseBetLockedRef = useRef(false);
  const lotteryLockedRef = useRef(false);

  // Slot State
  const [slotReels, setSlotReels] = useState(['🍒', '🍒', '🍒']);
  const [spinning, setSpinning] = useState(false);
  const slotSpinLockedRef = useRef(false);

  // Poker State
  const [pokerPhase, setPokerPhase] = useState('betting');
  const [pokerDeck, setPokerDeck] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [aiCards, setAiCards] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [pokerMsg, setPokerMsg] = useState('');
  const [showdown, setShowdown] = useState(false);
  const pokerHandActiveRef = useRef(false);
  const pokerActionPhaseRef = useRef(null);

  const normalizedBet = () => {
    const amount = Math.floor(Number(bet));
    return Number.isFinite(amount) && amount > 0 ? amount : 0;
  };

  const handleBetChange = e => setBet(e.target.value);

  // --- BLACKJACK ---
  const startBlackjack = () => {
    const wager = normalizedBet();
    if (!wager || person.money < wager || blackjackWagerRef.current > 0) {
      return;
    }
    blackjackWagerRef.current = wager;
    blackjackSettledRef.current = false;
    setBet(wager);
    const newDeck = createDeck();
    const pHand = [newDeck.pop(), newDeck.pop()];
    const dHand = [newDeck.pop(), newDeck.pop()];
    setDeck(newDeck);
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setGameState('playing');
    onResult(-wager);
  };

  const hit = () => {
    const newDeck = [...deck];
    const card = newDeck.pop();
    const newHand = [...playerHand, card];
    setPlayerHand(newHand);
    setDeck(newDeck);
    if (calculateScore(newHand) > 21) {
      endBlackjack(newHand, dealerHand, 'bust');
    }
  };

  const stand = () => {
    const dHand = [...dealerHand];
    const dDeck = [...deck];
    while (calculateScore(dHand) < 17) {
      dHand.push(dDeck.pop());
    }
    setDealerHand(dHand);
    setDeck(dDeck);
    endBlackjack(playerHand, dHand, 'compare');
  };

  const endBlackjack = (pHand, dHand, reason) => {
    if (blackjackSettledRef.current) {
      return;
    }
    blackjackSettledRef.current = true;
    const wager = blackjackWagerRef.current;
    const pScore = calculateScore(pHand);
    const dScore = calculateScore(dHand);
    let winAmount = 0;
    if (reason === 'bust') {
      showGameToast(t('gambling.busted', 'Busted! You lose.'));
    } else if (dScore > 21) {
      winAmount = wager * 2;
      showGameToast(t('gambling.dealerBusts', 'Dealer busts! You win!'));
    } else if (pScore > dScore) {
      winAmount = wager * 2;
      showGameToast(t('gambling.youWin', 'You win!'));
    } else if (pScore === dScore) {
      winAmount = wager;
      showGameToast(t('gambling.pushTie', 'Push (Tie).'));
    } else {
      showGameToast(t('gambling.dealerWins', 'Dealer wins.'));
    }
    if (winAmount > 0) {
      onResult(winAmount);
    }
    setGameState('result');
  };

  // --- RACING ---
  const betHorse = () => {
    const wager = normalizedBet();
    if (!wager || person.money < wager || !selectedHorse || horseBetLockedRef.current) {
      return;
    }
    horseBetLockedRef.current = true;
    setBet(wager);
    onResult(-wager);
    const winnerId = runRace();
    const winner = HORSES.find(h => h.id === winnerId);
    if (selectedHorse === winnerId) {
      const winnings = wager * winner.odds;
      onResult(winnings);
      showGameToast(
        t('gambling.horseWon', `${winner.name} WON! You won $${winnings.toLocaleString()}!`)
      );
    } else {
      showGameToast(t('gambling.horseLost', `${winner.name} won the race. You lost.`));
    }
    setTimeout(() => {
      horseBetLockedRef.current = false;
    }, 250);
  };

  // --- SLOTS ---
  const spinSlots = () => {
    if (person.money < 10 || spinning || slotSpinLockedRef.current) {
      return;
    }
    slotSpinLockedRef.current = true;
    onResult(-10);
    setSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setSlotReels(REELS.map(() => REELS[Math.floor(Math.random() * REELS.length)]));
      count++;
      if (count >= 8) {
        clearInterval(interval);
        setSpinning(false);
        const final = REELS.map(() => REELS[Math.floor(Math.random() * REELS.length)]);
        setSlotReels(final);
        const win = getSlotPayout(final, 10);
        if (win > 0) {
          onResult(win);
        }
        slotSpinLockedRef.current = false;
      }
    }, 100);
  };

  // --- POKER ---
  const startPoker = () => {
    if (person.money < 50 || pokerHandActiveRef.current) {
      return;
    }
    pokerHandActiveRef.current = true;
    pokerActionPhaseRef.current = null;
    onResult(-50);
    const d = createPokerDeck();
    setPokerDeck(d);
    setPlayerCards([d.pop(), d.pop()]);
    setAiCards([
      [d.pop(), d.pop()],
      [d.pop(), d.pop()],
      [d.pop(), d.pop()],
    ]);
    setCommunityCards([]);
    setPot(200);
    setPokerMsg(t('gambling.preFlop', 'Pre-flop. Your move.'));
    setPokerPhase('preflop');
    setShowdown(false);
  };

  const pokerAction = action => {
    if (!pokerHandActiveRef.current || ['betting', 'result'].includes(pokerPhase)) {
      return;
    }
    if (pokerActionPhaseRef.current === pokerPhase) {
      return;
    }
    if (action === 'raise' && person.money < 50) {
      return;
    }
    pokerActionPhaseRef.current = pokerPhase;
    const d = [...pokerDeck];
    let p = pot;
    if (action === 'fold') {
      setPokerMsg(t('gambling.pokerFolded', 'You folded. Lost the pot.'));
      setPokerPhase('result');
      return;
    }
    if (action === 'raise') {
      const raiseAmt = 50;
      onResult(-raiseAmt);
      p += raiseAmt * 4;
    }

    if (pokerPhase === 'preflop') {
      const flop = [d.pop(), d.pop(), d.pop()];
      setCommunityCards(flop);
      setPokerDeck(d);
      setPot(p);
      setPokerPhase('flop');
      setPokerMsg(t('gambling.flopDealt', 'Flop dealt. Your move.'));
      return;
    }
    if (pokerPhase === 'flop') {
      const turn = d.pop();
      setCommunityCards([...communityCards, turn]);
      setPokerDeck(d);
      setPot(p);
      setPokerPhase('turn');
      setPokerMsg(t('gambling.turnDealt', 'Turn dealt. Your move.'));
      return;
    }
    if (pokerPhase === 'turn') {
      const river = d.pop();
      const allCommunity = [...communityCards, river];
      setCommunityCards(allCommunity);
      setPokerDeck(d);
      setPot(p);
      setPot(p);
      showdownPoker(allCommunity, p);
    }
  };

  const showdownPoker = (community, finalPot) => {
    const pH = evaluateHand([...playerCards, ...community]);
    const aiResults = aiCards.map(hand => evaluateHand([...hand, ...community]));
    const bestAi = aiResults.reduce((best, result) =>
      compareHands(result, best) > 0 ? result : best
    );
    const comparison = compareHands(pH, bestAi);
    const tiedOpponents = aiResults.filter(result => compareHands(pH, result) === 0).length;
    setTimeout(() => {
      if (comparison > 0) {
        const win = finalPot;
        onResult(win);
        setPokerMsg(t('gambling.pokerWin', `You win with ${pH.name}! +$${win}`));
      } else if (comparison === 0) {
        const share = Math.floor(finalPot / (tiedOpponents + 1));
        onResult(share);
        setPokerMsg(t('gambling.pokerSplit', `Split pot with ${pH.name}. Your share: $${share}.`));
      } else {
        setPokerMsg(t('gambling.pokerLose', `You lose. The winning hand was ${bestAi.name}.`));
      }
      setShowdown(true);
      setPokerPhase('result');
    }, 500);
  };

  const buyLotteryTicket = () => {
    if (!allowLottery || person.money < LOTTERY_TICKET_COST || lotteryLockedRef.current) {
      return;
    }
    lotteryLockedRef.current = true;
    onResult(-LOTTERY_TICKET_COST);
    if (playLottery()) {
      onResult(LOTTERY_JACKPOT);
      showGameToast(
        t('gambling.jackpot', `JACKPOT!!! YOU WON $${LOTTERY_JACKPOT.toLocaleString()}!`)
      );
    } else {
      showGameToast(t('gambling.lotteryLost', `You lost the lottery. ($${LOTTERY_TICKET_COST})`));
    }
    setTimeout(() => {
      lotteryLockedRef.current = false;
    }, 250);
  };

  // --- RENDER ---
  if (view === 'menu') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title">{t('gambling.title', 'High Roller Casino')}</h2>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div
            className="modal-body"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <button className="list-item" onClick={() => setView('blackjack')}>
              {t('gambling.blackjack', '🃏 Blackjack')}
            </button>
            <button className="list-item" onClick={() => setView('horses')}>
              {t('gambling.horseRacing', '🐎 Horse Racing')}
            </button>
            <button className="list-item" onClick={() => setView('slots')}>
              {t('gambling.slots', '🎰 Slots')}
            </button>
            <button className="list-item" onClick={() => setView('poker')}>
              {t('gambling.texasHoldem', "♠️ Texas Hold'em")}
            </button>
            <button className="list-item" disabled={!allowLottery} onClick={buyLotteryTicket}>
              {allowLottery
                ? t('gambling.buyLottery', `📄 Buy Lottery Ticket ($${LOTTERY_TICKET_COST})`)
                : t('gambling.lotteryDisabled', '🚫 Lottery disabled by challenge')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'slots') {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ textAlign: 'center' }}>
          <div className="modal-header">
            <h2>{t('gambling.slotsTitle', '🎰 Slots')}</h2>
            <button onClick={() => setView('menu')}>{t('gambling.back', 'Back')}</button>
          </div>
          <div className="modal-body">
            <div
              style={{
                fontSize: '3rem',
                letterSpacing: '1rem',
                margin: '20px 0',
                background: '#111',
                padding: '20px',
                borderRadius: '12px',
              }}
            >
              {slotReels.map((r, i) => (
                <span key={i}>{r}</span>
              ))}
            </div>
            <button className="btn-primary" onClick={spinSlots} disabled={spinning}>
              {spinning
                ? t('gambling.spinning', 'Spinning...')
                : t('gambling.spin', '🎰 Spin ($10)')}
            </button>
            <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#888' }}>
              {Object.entries(SLOT_PAYOUTS)
                .map(([symbols, multiplier]) => `${symbols} x${multiplier}`)
                .join(' · ')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'poker') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{t('gambling.pokerTitle', "♠️ Texas Hold'em")}</h2>
            <button onClick={() => setView('menu')}>{t('gambling.back', 'Back')}</button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            {pokerPhase === 'betting' ? (
              <div>
                <p>{t('gambling.buyIn', 'Buy in: $50')}</p>
                <button className="btn-primary" onClick={startPoker}>
                  {t('gambling.deal', 'Deal!')}
                </button>
              </div>
            ) : (
              <div>
                <div style={{ color: '#888', fontSize: '0.8rem', marginBottom: '8px' }}>
                  {t('gambling.pot', 'Pot: ${pot}')}
                </div>

                <div
                  style={{
                    background: 'rgba(0,100,0,0.2)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '6px' }}>
                    {t('gambling.communityCards', 'Community Cards')}
                  </div>
                  <div style={{ fontSize: '1.5rem' }}>
                    {communityCards.length === 0
                      ? '🂠 🂠 🂠'
                      : communityCards.map((c, i) => (
                          <span
                            key={i}
                            style={{ color: c.suit === '♥' || c.suit === '♦' ? '#f44336' : '#fff' }}
                          >
                            {c.rank}
                            {c.suit}{' '}
                          </span>
                        ))}
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255,215,0,0.1)',
                    padding: '12px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '6px' }}>
                    {t('gambling.yourHand', 'Your Hand')}
                  </div>
                  <div style={{ fontSize: '1.5rem' }}>
                    {playerCards.map((c, i) => (
                      <span
                        key={i}
                        style={{ color: c.suit === '♥' || c.suit === '♦' ? '#f44336' : '#fff' }}
                      >
                        {c.rank}
                        {c.suit}{' '}
                      </span>
                    ))}
                  </div>
                </div>

                {showdown && (
                  <div
                    style={{
                      background: 'rgba(255,0,0,0.1)',
                      padding: '12px',
                      borderRadius: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '6px' }}>
                      {t('gambling.aiHands', 'AI Hands')}
                    </div>
                    {aiCards.map((hand, i) => (
                      <div key={i} style={{ fontSize: '1rem' }}>
                        {t('gambling.aiLabel', `AI ${i + 1}:`)}{' '}
                        {hand.map(c => (
                          <span
                            key={c.rank + c.suit}
                            style={{ color: c.suit === '♥' || c.suit === '♦' ? '#f44336' : '#fff' }}
                          >
                            {c.rank}
                            {c.suit}{' '}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ color: '#ffd700', margin: '10px 0', fontSize: '0.9rem' }}>
                  {pokerMsg}
                </div>

                {pokerPhase !== 'result' && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button className="btn-secondary" onClick={() => pokerAction('fold')}>
                      {t('gambling.fold', 'Fold')}
                    </button>
                    <button className="btn-primary" onClick={() => pokerAction('call')}>
                      {t('gambling.check', 'Check')}
                    </button>
                    <button
                      className="btn-primary"
                      style={{ background: 'linear-gradient(45deg, #ff9800, #f44336)' }}
                      onClick={() => pokerAction('raise')}
                    >
                      {t('gambling.bet', 'Bet $50')}
                    </button>
                  </div>
                )}
                {pokerPhase === 'result' && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      pokerHandActiveRef.current = false;
                      pokerActionPhaseRef.current = null;
                      startPoker();
                    }}
                  >
                    {t('gambling.playAgain', 'Play Again')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'blackjack') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{t('gambling.blackjackTitle', '🃏 Blackjack')}</h2>
            <button onClick={() => setView('menu')}>{t('gambling.back', 'Back')}</button>
          </div>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            {gameState === 'betting' ? (
              <div>
                <input
                  type="number"
                  min="1"
                  max={Math.floor(person.money)}
                  value={bet}
                  onChange={handleBetChange}
                  className="text-input"
                  style={{ width: '120px', marginBottom: '10px' }}
                />
                <button className="btn-primary" onClick={startBlackjack}>
                  {t('gambling.dealBlackjack', 'Deal')}
                </button>
              </div>
            ) : (
              <div>
                <h3>
                  {t('gambling.dealerLabel', 'Dealer:')}{' '}
                  {gameState === 'playing' ? '?' : calculateScore(dealerHand)}
                </h3>
                <div style={{ fontSize: '1.2rem' }}>
                  {dealerHand.map((card, index) => (
                    <span key={card.rank + card.suit + index}>
                      {gameState === 'playing' && index === 1 ? '🂠 ' : `${card.rank}${card.suit} `}
                    </span>
                  ))}
                </div>
                <h3>
                  {t('gambling.youLabel', 'You:')} {calculateScore(playerHand)}
                </h3>
                <div style={{ fontSize: '1.2rem' }}>
                  {playerHand.map(c => `${c.rank}${c.suit} `)}
                </div>
                {gameState === 'playing' && (
                  <div style={{ marginTop: '20px' }}>
                    <button className="btn-primary" onClick={hit}>
                      {t('gambling.hit', 'Hit')}
                    </button>
                    <button className="btn-secondary" onClick={stand}>
                      {t('gambling.stand', 'Stand')}
                    </button>
                  </div>
                )}
                {gameState === 'result' && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      blackjackWagerRef.current = 0;
                      blackjackSettledRef.current = false;
                      setGameState('betting');
                    }}
                  >
                    {t('gambling.playAgain', 'Play Again')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === 'horses') {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{t('gambling.horsesTitle', '🐎 Horse Racing')}</h2>
            <button onClick={() => setView('menu')}>{t('gambling.back', 'Back')}</button>
          </div>
          <div className="modal-body">
            <input
              type="number"
              min="1"
              max={Math.floor(person.money)}
              value={bet}
              onChange={handleBetChange}
              className="text-input"
              style={{ width: '120px', marginBottom: '10px' }}
            />
            {HORSES.map(h => (
              <div
                key={h.id}
                className="list-item"
                onClick={() => setSelectedHorse(h.id)}
                style={{ background: selectedHorse === h.id ? 'rgba(76,175,80,0.3)' : '' }}
              >
                <span>{h.name}</span>
                <span style={{ color: '#ffd700' }}>{h.odds}:1</span>
              </div>
            ))}
            <button className="btn-primary" onClick={betHorse} style={{ marginTop: '10px' }}>
              {t('gambling.startRace', 'Start Race!')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
