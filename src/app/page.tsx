"use client";
import { useState, useEffect } from 'react';

const GRID_SIZE = 6; // 6x6 grid
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const LEVEL_THRESHOLDS = [50, 100, 200, 300]; // Milestones for leveling up
const TILE_COLORS = ["bg-green-300", "bg-blue-300", "bg-cyan-300", "bg-orange-300", "bg-pink-300"];

export default function NumberMatch3Game() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null); // Track selected tile
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false); // Track game state
  const [gameOver, setGameOver] = useState(false); // Track "Game Over" state
  const [level, setLevel] = useState(0); // Track current level

  // Initialize the grid with random numbers
  const initializeGrid = () => {
    const newGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => NUMBERS[Math.floor(Math.random() * NUMBERS.length)])
    );
    setGrid(newGrid);
  };

  const startGame = () => {
    setScore(0);
    setLevel(0); // Reset level to 0 when starting the game
    setSelected(null);
    setGameStarted(true);
    setGameOver(false);
    initializeGrid();
  };

  const resetGame = () => {
    setScore(0);
    setSelected(null);
    setLevel(0); // Reset level to 0 when resetting the game
    setGameOver(false);
    initializeGrid();
  };

  // Swap two tiles
  const swapTiles = (x1, y1, x2, y2) => {
    const newGrid = grid.map((row) => [...row]);
    [newGrid[x1][y1], newGrid[x2][y2]] = [newGrid[x2][y2], newGrid[x1][y1]];
    setGrid(newGrid);

    // Check for matches after the swap
    if (!checkMatches(newGrid)) {
      // If no match, revert the swap and apply penalty
      setTimeout(() => {
        [newGrid[x1][y1], newGrid[x2][y2]] = [newGrid[x2][y2], newGrid[x1][y1]];
        setGrid(newGrid);
      }, 300);

      setScore((prev) => {
        const newScore = Math.max(0, prev - 5);
        if (newScore < 0) {
          setGameOver(true);
          setGameStarted(false);
        }
        return newScore;
      });
    }
  };

  // Check for matches including diagonal matches
  const checkMatches = (currentGrid) => {
    let matched = false;
    const newGrid = currentGrid.map((row) => [...row]);

    // Check rows for matches
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE - 2; j++) {
        if (
          newGrid[i][j] &&
          newGrid[i][j] === newGrid[i][j + 1] &&
          newGrid[i][j] === newGrid[i][j + 2]
        ) {
          newGrid[i][j] = newGrid[i][j + 1] = newGrid[i][j + 2] = null;
          setScore((prev) => {
            const newScore = prev + 10;
            if (LEVEL_THRESHOLDS[level] && newScore >= LEVEL_THRESHOLDS[level]) {
              levelUp();
            }
            return newScore;
          });
          matched = true;
        }
      }
    }

    // Check columns for matches
    for (let j = 0; j < GRID_SIZE; j++) {
      for (let i = 0; i < GRID_SIZE - 2; i++) {
        if (
          newGrid[i][j] &&
          newGrid[i][j] === newGrid[i + 1][j] &&
          newGrid[i][j] === newGrid[i + 2][j]
        ) {
          newGrid[i][j] = newGrid[i + 1][j] = newGrid[i + 2][j] = null;
          setScore((prev) => {
            const newScore = prev + 10;
            if (LEVEL_THRESHOLDS[level] && newScore >= LEVEL_THRESHOLDS[level]) {
              levelUp();
            }
            return newScore;
          });
          matched = true;
        }
      }
    }

    // Check diagonals for matches (top-left to bottom-right)
    for (let i = 0; i < GRID_SIZE - 2; i++) {
      for (let j = 0; j < GRID_SIZE - 2; j++) {
        if (
          newGrid[i][j] &&
          newGrid[i][j] === newGrid[i + 1][j + 1] &&
          newGrid[i][j] === newGrid[i + 2][j + 2]
        ) {
          newGrid[i][j] = newGrid[i + 1][j + 1] = newGrid[i + 2][j + 2] = null;
          setScore((prev) => {
            const newScore = prev + 10;
            if (LEVEL_THRESHOLDS[level] && newScore >= LEVEL_THRESHOLDS[level]) {
              levelUp();
            }
            return newScore;
          });
          matched = true;
        }
      }
    }

    // Check diagonals for matches (top-right to bottom-left)
    for (let i = 0; i < GRID_SIZE - 2; i++) {
      for (let j = 2; j < GRID_SIZE; j++) {
        if (
          newGrid[i][j] &&
          newGrid[i][j] === newGrid[i + 1][j - 1] &&
          newGrid[i][j] === newGrid[i + 2][j - 2]
        ) {
          newGrid[i][j] = newGrid[i + 1][j - 1] = newGrid[i + 2][j - 2] = null;
          setScore((prev) => {
            const newScore = prev + 10;
            if (LEVEL_THRESHOLDS[level] && newScore >= LEVEL_THRESHOLDS[level]) {
              levelUp();
            }
            return newScore;
          });
          matched = true;
        }
      }
    }

    // Fill null spaces with new numbers
    if (matched) {
      for (let j = 0; j < GRID_SIZE; j++) {
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
          if (newGrid[i][j] === null) {
            newGrid[i][j] = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
          }
        }
      }
      setGrid(newGrid);
      setTimeout(() => checkMatches(newGrid), 500); // Re-check for cascading matches
    }

    return matched; // Return whether a match was found
  };

  const levelUp = () => {
    // Increment level and reset it to 0 after reaching 4
    setLevel((prev) => (prev + 1) % 5);
    setScore(0); // Reset score for the new level
  };

  // Handle tile click
  const handleTileClick = (x, y) => {
    if (!selected) {
      setSelected({ x, y });
    } else {
      const dx = Math.abs(selected.x - x);
      const dy = Math.abs(selected.y - y);

      // Only allow swapping adjacent tiles, including diagonals
      if (
        (dx === 1 && dy === 0) ||  // Horizontal swap
        (dx === 0 && dy === 1) ||  // Vertical swap
        (dx === 1 && dy === 1)     // Diagonal swap
      ) {
        swapTiles(selected.x, selected.y, x, y);
      }
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Number Snap Game</h1>
      {!gameStarted && !gameOver && (
        <button
          onClick={startGame}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
        >
          Start Game
        </button>
      )}
      {gameOver && (
        <div className="text-center">
          <p className="text-2xl font-bold mb-4 text-red-500">Game Over!</p>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
      {gameStarted && !gameOver && (
        <>
          <p className="text-xl mb-2">Level: <span className="font-semibold">{level}</span></p>
          <p className="text-xl mb-4">Score: <span className="font-semibold">{score}</span></p>
          <button
            onClick={resetGame}
            className="mb-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Reset Game
          </button>
          <div className="grid grid-cols-6 gap-2">
            {grid.map((row, rowIndex) =>
              row.map((number, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`w-14 h-14 flex items-center justify-center border rounded-md cursor-pointer text-lg font-semibold ${
                    selected?.x === rowIndex && selected?.y === colIndex
                      ? "border-blue-600"
                      : `${TILE_COLORS[level % TILE_COLORS.length]} border-gray-300 hover:bg-gray-200`
                  }`}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                >
                  {number}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
