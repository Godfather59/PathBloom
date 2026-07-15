import React, { useState, useEffect } from 'react';
import './Modal.css';

const GRID_SIZE = 8;
const MINES = 10;

export function Minesweeper({ onWin, onLose, onClose, t = (key, fallback) => fallback || key }) {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Initialize Grid
  useEffect(() => {
    const newGrid = [];
    // Create empty grid
    for (let r = 0; r < GRID_SIZE; r++) {
      const row = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        row.push({
          r,
          c,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborCount: 0,
        });
      }
      newGrid.push(row);
    }

    // Place Mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate Numbers
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c].isMine) {
          continue;
        }
        let count = 0;
        // Check neighbors
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (r + i >= 0 && r + i < GRID_SIZE && c + j >= 0 && c + j < GRID_SIZE) {
              if (newGrid[r + i][c + j].isMine) {
                count++;
              }
            }
          }
        }
        newGrid[r][c].neighborCount = count;
      }
    }
    setGrid(newGrid);
  }, []);

  const revealCell = (r, c) => {
    if (gameOver || grid[r][c].isRevealed || grid[r][c].isFlagged) {
      return;
    }

    const newGrid = [...grid];
    // Recursive reveal
    const queue = [[r, c]];
    while (queue.length > 0) {
      const [currR, currC] = queue.pop();
      const cell = newGrid[currR][currC];

      if (cell.isRevealed) {
        continue;
      }

      if (cell.isMine) {
        // BOOM
        cell.isRevealed = true;
        setGrid(newGrid);
        setGameOver(true);
        setTimeout(onLose, 1000);
        return;
      }

      cell.isRevealed = true;

      if (cell.neighborCount === 0) {
        // Formatting neighbor expansion
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              currR + i >= 0 &&
              currR + i < GRID_SIZE &&
              currC + j >= 0 &&
              currC + j < GRID_SIZE
            ) {
              if (!newGrid[currR + i][currC + j].isRevealed) {
                queue.push([currR + i, currC + j]);
              }
            }
          }
        }
      }
    }

    setGrid(newGrid);

    // Check Win
    let totalRevealed = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (newGrid[i][j].isRevealed) {
          totalRevealed++;
        }
      }
    }

    // Win Condition: (Total Cells - Mines) = Revealed Cells
    // Actually simplest is tracking reveals or just checking remaining non-mines
    if (totalRevealed === GRID_SIZE * GRID_SIZE - MINES) {
      setGameOver(true);
      setTimeout(onWin, 1000);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{t('minesweeper.title', 'Minefield')}</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label={t('minesweeper.retreat', 'Retreat')}
          >
            &times;
          </button>
        </div>
        <div
          className="modal-body"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ marginBottom: '10px', color: '#ffeb3b' }}>
            {t('minesweeper.instruction', `Clear the field! Don't step on the ${MINES} mines.`)}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gap: '2px',
              background: '#444',
              padding: '4px',
              borderRadius: '4px',
            }}
          >
            {grid.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => revealCell(rIdx, cIdx)}
                  style={{
                    width: '35px',
                    height: '35px',
                    background: cell.isRevealed ? (cell.isMine ? 'red' : '#ddd') : '#666',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: cell.isMine ? '0.72em' : '1.2em',
                    color: cell.isMine ? 'white' : COLORS[cell.neighborCount],
                  }}
                >
                  {cell.isRevealed && !cell.isMine && cell.neighborCount > 0 && cell.neighborCount}
                  {cell.isRevealed && cell.isMine && t('minesweeper.mine', 'MINE')}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const COLORS = [
  'transparent',
  'blue',
  'green',
  'red',
  'darkblue',
  'brown',
  'cyan',
  'black',
  'gray',
];
