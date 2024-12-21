"use client";
import { useState, useEffect } from 'react';

import styles from './game.module.css'; 
const GRID_SIZE = 6; // 6x6 grid
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function NumberMatch3Game() {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null); // Track selected tile
  const [score, setScore] = useState(0);

  // Initialize the grid with random numbers
  useEffect(() => {
    const newGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => NUMBERS[Math.floor(Math.random() * NUMBERS.length)])
    );
    setGrid(newGrid);
  }, []);

  // Swap two tiles
  const swapTiles = (x1, y1, x2, y2) => {
    const newGrid = grid.map((row) => [...row]);
    [newGrid[x1][y1], newGrid[x2][y2]] = [newGrid[x2][y2], newGrid[x1][y1]];
    setGrid(newGrid);
    checkMatches(newGrid);
  };

  // Check for matches
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
          setScore((prev) => prev + 10);
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
          setScore((prev) => prev + 10);
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
  };

  // Handle tile click
  const handleTileClick = (x, y) => {
    if (!selected) {
      setSelected({ x, y });
    } else {
      const dx = Math.abs(selected.x - x);
      const dy = Math.abs(selected.y - y);

      // Only allow swapping adjacent tiles
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        swapTiles(selected.x, selected.y, x, y);
      }
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Number Snap Game</h1>
      <p className="text-xl mb-4">Score: <span className="font-semibold">{score}</span></p>
      <div className="grid grid-cols-6 gap-2">
        {grid.map((row, rowIndex) =>
          row.map((number, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-14 h-14 flex items-center justify-center border rounded-md cursor-pointer text-lg font-semibold ${
                selected?.x === rowIndex && selected?.y === colIndex
                  ? "bg-blue-300 border-blue-600"
                  : "bg-gray-100 border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() => handleTileClick(rowIndex, colIndex)}
            >
              {number}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
