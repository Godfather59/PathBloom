import React, { useState } from 'react';
import './NewFeatures.css';
import './Modal.css';

const OPENINGS = [
  {
    name: 'Italian Game',
    difficulty: 1,
    desc: 'A classical opening focusing on quick development.',
  },
  { name: 'Sicilian Defense', difficulty: 2, desc: 'A sharp, counter-attacking opening.' },
  { name: "Queen's Gambit", difficulty: 2, desc: 'A strategic battle for center control.' },
  { name: "King's Indian Attack", difficulty: 3, desc: 'A complex, hypermodern approach.' },
];

const MIDDLEGAME_SCENARIOS = {
  1: [
    {
      question: 'Your opponent pushes a pawn forward. Do you:',
      choices: [
        {
          text: 'Develop your knight to attack',
          rating: 'good',
          response: 'Your knight dominates the center!',
        },
        {
          text: 'Retreat your bishop',
          rating: 'bad',
          response: 'You lose tempo and positional advantage.',
        },
        {
          text: 'Castle for safety',
          rating: 'neutral',
          response: 'A solid, if unambitious, move.',
        },
      ],
    },
    {
      question: 'You spot a potential fork. Do you:',
      choices: [
        { text: 'Go for the fork!', rating: 'good', response: 'Brilliant! You win a piece.' },
        {
          text: 'Trade pieces to simplify',
          rating: 'neutral',
          response: 'The position simplifies to an equal endgame.',
        },
        {
          text: 'Ignore it and attack',
          rating: 'bad',
          response: 'You miss your chance. The opportunity is gone.',
        },
      ],
    },
  ],
  2: [
    {
      question: 'Your opponent sacrifices a pawn for initiative. Do you:',
      choices: [
        {
          text: 'Accept the sacrifice and defend',
          rating: 'good',
          response: 'You calculated correctly. Your defense holds.',
        },
        {
          text: 'Decline and play solidly',
          rating: 'neutral',
          response: 'A safe choice, but your opponent keeps pressure.',
        },
        {
          text: 'Counter-sacrifice',
          rating: 'bad',
          response: 'The complications backfire. Your position crumbles.',
        },
      ],
    },
    {
      question: 'You have a chance to activate your rook. Do you:',
      choices: [
        {
          text: 'Open the file with a pawn break',
          rating: 'good',
          response: 'Your rook comes alive on the open file!',
        },
        {
          text: 'Double rooks on the d-file',
          rating: 'neutral',
          response: 'Solid buildup, but slow.',
        },
        {
          text: 'Push pawns near your king',
          rating: 'bad',
          response: "You weaken your king's position.",
        },
      ],
    },
  ],
  3: [
    {
      question: 'Complex tactical sequence arises. Do you:',
      choices: [
        {
          text: 'Calculate the deep line',
          rating: 'good',
          response: 'Your calculation is flawless. You come out a piece up!',
        },
        { text: 'Play a waiting move', rating: 'neutral', response: 'You maintain the tension.' },
        {
          text: 'Panic and exchange',
          rating: 'bad',
          response: 'You blunder into a losing endgame.',
        },
      ],
    },
    {
      question: 'Endgame approach — how do you convert?',
      choices: [
        {
          text: 'Use your king actively',
          rating: 'good',
          response: 'King activity is key. You dominate the endgame!',
        },
        {
          text: 'Push your passed pawn',
          rating: 'neutral',
          response: 'The pawn advances but your opponent defends well.',
        },
        {
          text: 'Trade down to a pawn ending',
          rating: 'bad',
          response: 'You miscalculate the pawn race and lose.',
        },
      ],
    },
  ],
};

export function ChessGame({ onResult, onClose, t = (key, fallback) => fallback || key }) {
  const [phase, setPhase] = useState('opening');
  const [opening, setOpening] = useState(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [won, setWon] = useState(false);

  const selectOpening = idx => {
    const op = OPENINGS[idx];
    setOpening(op);
    setMessage(t('chess.openingChosen', `You chose the ${op.name}. ${op.desc}`));
    setPhase('middlegame');
    setRound(0);
  };

  const handleChoice = rating => {
    const pts = rating === 'good' ? 2 : rating === 'neutral' ? 1 : 0;
    const nextScore = score + pts;
    setScore(nextScore);

    const scenarios = MIDDLEGAME_SCENARIOS[opening.difficulty] || MIDDLEGAME_SCENARIOS[1];
    if (round + 1 < scenarios.length) {
      setRound(r => r + 1);
    } else {
      const totalPossible = scenarios.length * 2;
      const didWin = nextScore / totalPossible >= 0.5;
      setWon(didWin);
      const resultMsg = didWin
        ? t('chess.won', `You won the chess tournament! Final score: ${nextScore}/${totalPossible}`)
        : t(
            'chess.lost',
            `You lost the chess tournament. Final score: ${nextScore}/${totalPossible}`
          );
      setMessage(resultMsg);
      setPhase('result');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-slide-up" style={{ maxWidth: '550px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('chess.title', '♟️ Chess Tournament')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {phase === 'opening' && (
            <>
              <p style={{ textAlign: 'center', marginBottom: '16px', color: '#aaa' }}>
                {t('chess.chooseOpening', 'Choose your opening strategy:')}
              </p>
              {OPENINGS.map((op, i) => (
                <div
                  key={op.name}
                  className="list-item"
                  style={{ cursor: 'pointer', padding: '12px', marginBottom: '8px' }}
                  onClick={() => selectOpening(i)}
                >
                  <div style={{ fontWeight: 'bold' }}>
                    {t(`chess.opening${i + 1}.name`, op.name)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
                    {t(`chess.opening${i + 1}.desc`, op.desc)}
                  </div>
                </div>
              ))}
            </>
          )}

          {phase === 'middlegame' &&
            (() => {
              const scenarios = MIDDLEGAME_SCENARIOS[opening.difficulty] || MIDDLEGAME_SCENARIOS[1];
              const current = scenarios[round];
              if (!current) {
                return null;
              }
              return (
                <>
                  <div
                    style={{
                      textAlign: 'center',
                      marginBottom: '12px',
                      color: '#ffd700',
                      fontSize: '0.85rem',
                    }}
                  >
                    {t('chess.round', 'Round')} {round + 1} {t('chess.of', 'of')} {scenarios.length}
                  </div>
                  <p style={{ marginBottom: '16px' }}>
                    {t(`chess.middlegame${opening.difficulty}.q${round + 1}`, current.question)}
                  </p>
                  {current.choices.map((c, i) => (
                    <button
                      key={i}
                      className="list-item"
                      style={{
                        cursor: 'pointer',
                        padding: '12px',
                        marginBottom: '8px',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onClick={() => handleChoice(c.rating)}
                    >
                      <div style={{ fontWeight: 'bold' }}>
                        {t(
                          `chess.middlegame${opening.difficulty}.q${round + 1}.choice${i + 1}`,
                          c.text
                        )}
                      </div>
                    </button>
                  ))}
                </>
              );
            })()}

          {phase === 'result' && (
            <>
              <p style={{ textAlign: 'center', fontSize: '1.2rem', margin: '20px 0' }}>{message}</p>
              <button
                className="btn-primary"
                onClick={() => onResult(won)}
                style={{ width: '100%' }}
              >
                {won
                  ? t('chess.claimVictory', '🏆 Claim Victory')
                  : t('chess.acceptDefeat', '😔 Accept Defeat')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
