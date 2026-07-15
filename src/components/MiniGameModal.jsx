import React, { useState, useEffect, useCallback } from 'react';
import './Modal.css';

// Simple grid-based game: Avoid the dogs/police (obstacles) to reach the loot (goal)
export function MiniGameModal({
  type,
  difficulty,
  onResult,
  onClose,
  t = (key, fallback) => fallback || key,
}) {
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

  // Config based on type
  // Dynamic Config based on difficulty
  const GRID_SIZE = 5 + difficulty; // 6, 7, 8...

  // Generate Level
  const [levelConfig] = useState(() => {
    const goal = { x: GRID_SIZE - 1, y: GRID_SIZE - 1 };
    const numObstacles = Math.floor(GRID_SIZE * GRID_SIZE * (0.15 + difficulty * 0.05)); // 20-30% density

    // Reserve a randomized path first, then place guards only on remaining cells.
    const safeCells = new Set(['0,0']);
    let pathX = 0;
    let pathY = 0;
    while (pathX < goal.x || pathY < goal.y) {
      const canMoveRight = pathX < goal.x;
      const canMoveDown = pathY < goal.y;
      if (canMoveRight && (!canMoveDown || Math.random() < 0.5)) {
        pathX += 1;
      } else {
        pathY += 1;
      }
      safeCells.add(`${pathX},${pathY}`);
    }

    const candidates = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (!safeCells.has(`${x},${y}`)) {
          candidates.push({ x, y });
        }
      }
    }
    candidates.sort(() => Math.random() - 0.5);
    const obstacles = candidates.slice(0, Math.min(numObstacles, candidates.length));
    return { goal, obstacles };
  });

  const GOAL_POS = levelConfig.goal;
  const OBSTACLES = levelConfig.obstacles;

  const movePlayer = useCallback(
    (dx, dy) => {
      if (gameState !== 'playing') {
        return;
      }

      setPlayerPos(prev => {
        const newX = Math.max(0, Math.min(GRID_SIZE - 1, prev.x + dx));
        const newY = Math.max(0, Math.min(GRID_SIZE - 1, prev.y + dy));

        // Check collision with obstacles
        if (OBSTACLES.some(obs => obs.x === newX && obs.y === newY)) {
          setGameState('lost');
          setTimeout(() => onResult(false), 1000);
          return { x: newX, y: newY };
        }

        // Check win
        if (newX === GOAL_POS.x && newY === GOAL_POS.y) {
          setGameState('won');
          setTimeout(() => onResult(true), 1000);
        }

        return { x: newX, y: newY };
      });
    },
    [gameState, onResult, GRID_SIZE, OBSTACLES, GOAL_POS.x, GOAL_POS.y]
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowUp') {
        movePlayer(0, -1);
      }
      if (e.key === 'ArrowDown') {
        movePlayer(0, 1);
      }
      if (e.key === 'ArrowLeft') {
        movePlayer(-1, 0);
      }
      if (e.key === 'ArrowRight') {
        movePlayer(1, 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <h3 className="modal-title">{t('minigame.title', 'Burglary: Steal the Loot!')}</h3>
        {gameState === 'lost' && (
          <h2 style={{ color: 'red' }}>{t('minigame.busted', 'BUSTED!')}</h2>
        )}
        {gameState === 'won' && (
          <h2 style={{ color: 'green' }}>{t('minigame.escaped', 'ESCAPED!')}</h2>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gap: '4px',
            justifyContent: 'center',
            width: 'min(100%, 348px)',
            margin: '20px auto',
            userSelect: 'none',
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);

            let content = '';
            let bg = '#eee';

            if (x === playerPos.x && y === playerPos.y) {
              content = t('minigame.you', 'YOU');
              bg = '#fffde7'; // Highlight
            } else if (x === GOAL_POS.x && y === GOAL_POS.y) {
              content = t('minigame.loot', 'LOOT');
              bg = '#e3f2fd';
            } else if (OBSTACLES.some(o => o.x === x && o.y === y)) {
              content = t('minigame.guard', 'GUARD');
              bg = '#ffebee';
            }

            return (
              <div
                key={i}
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  minWidth: 0,
                  background: bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.58rem',
                  fontWeight: 800,
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              >
                {content}
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            maxWidth: '200px',
            margin: '0 auto',
          }}
        >
          <div />
          <button onClick={() => movePlayer(0, -1)}>{t('minigame.up', 'Up')}</button>
          <div />
          <button onClick={() => movePlayer(-1, 0)}>{t('minigame.left', 'Left')}</button>
          <button onClick={() => movePlayer(0, 1)}>{t('minigame.down', 'Down')}</button>
          <button onClick={() => movePlayer(1, 0)}>{t('minigame.right', 'Right')}</button>
        </div>

        <button onClick={onClose} style={{ marginTop: '20px', padding: '8px 16px' }}>
          {t('minigame.cancel', 'Cancel')}
        </button>
      </div>
    </div>
  );
}
