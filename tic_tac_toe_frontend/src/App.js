import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * Calculate the winner for a given 3x3 tic tac toe board.
 * @param {Array<("X"|"O"|null)>} squares
 * @returns {"X"|"O"|null}
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, isWinningSquare, disabled }) {
  /** Individual clickable square. */
  const ariaLabel = value ? `Square ${value}` : "Empty square";

  return (
    <button
      type="button"
      className={`ttt-square ${isWinningSquare ? "ttt-square--win" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onPlay, winningLine, disabled }) {
  /** 3x3 board grid. */
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {squares.map((value, idx) => (
        <Square
          // eslint-disable-next-line react/no-array-index-key
          key={idx}
          value={value}
          onClick={() => onPlay(idx)}
          isWinningSquare={Boolean(winningLine?.includes(idx))}
          disabled={disabled || Boolean(value)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root Tic Tac Toe app. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => !winner && squares.every((s) => s !== null),
    [winner, squares]
  );

  const winningLine = useMemo(() => {
    if (!winner) return null;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return (
      lines.find(([a, b, c]) => {
        return squares[a] && squares[a] === squares[b] && squares[a] === squares[c];
      }) || null
    );
  }, [squares, winner]);

  const statusText = useMemo(() => {
    if (winner) return `Winner: Player ${winner}`;
    if (isDraw) return "Draw game — no more moves.";
    return `Turn: Player ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  // PUBLIC_INTERFACE
  const handlePlay = (index) => {
    /** Place current player's mark if move is valid. */
    if (winner || squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Reset to a new game. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <div className="ttt-page">
        <header className="ttt-header">
          <div className="ttt-badge" aria-hidden="true">
            Tic Tac Toe
          </div>
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">Two players, one device. Take turns and win!</p>
        </header>

        <main className="ttt-card" aria-label="Game">
          <div className="ttt-status" role="status" aria-live="polite">
            <span className="ttt-status__label">{statusText}</span>
            {!winner && !isDraw ? (
              <span className="ttt-status__hint">First to align 3 wins.</span>
            ) : null}
          </div>

          <Board
            squares={squares}
            onPlay={handlePlay}
            winningLine={winningLine}
            disabled={Boolean(winner) || isDraw}
          />

          <div className="ttt-controls">
            <button type="button" className="ttt-btn ttt-btn--primary" onClick={resetGame}>
              New game
            </button>

            <div className="ttt-legend" aria-label="Player legend">
              <span className="ttt-pill ttt-pill--x">Player X</span>
              <span className="ttt-pill ttt-pill--o">Player O</span>
            </div>
          </div>
        </main>

        <footer className="ttt-footer">
          <span>Built with React • Local play only</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
