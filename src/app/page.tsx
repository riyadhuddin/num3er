"use client";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Importing uuid
import {
  OpenFeatureProvider,
  useBooleanFlagValue,
  OpenFeature,
} from "@openfeature/react-sdk";
import DevCycleProvider from "@devcycle/openfeature-web-provider";

const GRID_SIZE = 6;
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const LEVEL_THRESHOLDS = [50, 100, 200, 300];
const TILE_COLORS = ["bg-green-300", "bg-blue-300", "bg-cyan-300", "bg-orange-300", "bg-pink-300"];

// Generate a unique user ID for each session
const generateUserId = () => uuidv4();

(async () => {
  const devCycleProvider = new DevCycleProvider("dvc_client_bdf76c5e_cab4_406c_9578_38ae2e0ed1a4_0c14775");
  await OpenFeature.setProviderAndWait(devCycleProvider);

  // Set the generated user ID in the OpenFeature context
  const userId = generateUserId();
  await OpenFeature.setContext({
    user_id: userId, // Use a unique identifier for the public user
  });
})();

const App = () => {
  return (
    <OpenFeatureProvider>
      <NumberMatch3Game />
    </OpenFeatureProvider>
  );
};

const NumberMatch3Game = () => {
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(0);

  // Use the DevCycle feature flag
  const newYearMessage = useBooleanFlagValue("new-year-message", false);

  const initializeGrid = () => {
    const newGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => NUMBERS[Math.floor(Math.random() * NUMBERS.length)])
    );
    setGrid(newGrid);
  };

  const startGame = () => {
    setScore(0);
    setLevel(0);
    setSelected(null);
    setGameStarted(true);
    setGameOver(false);
    initializeGrid();
  };

  const resetGame = () => {
    setScore(0);
    setSelected(null);
    setLevel(0);
    setGameOver(false);
    initializeGrid();
  };

  const swapTiles = (x1, y1, x2, y2) => {
    const newGrid = grid.map((row) => [...row]);
    [newGrid[x1][y1], newGrid[x2][y2]] = [newGrid[x2][y2], newGrid[x1][y1]];
    setGrid(newGrid);

    if (!checkMatches(newGrid)) {
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

  const checkMatches = (currentGrid) => {
    let matched = false;
    const newGrid = currentGrid.map((row) => [...row]);

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

    if (matched) {
      for (let j = 0; j < GRID_SIZE; j++) {
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
          if (newGrid[i][j] === null) {
            newGrid[i][j] = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
          }
        }
      }
      setGrid(newGrid);
      setTimeout(() => checkMatches(newGrid), 500);
    }

    return matched;
  };

  const levelUp = () => {
    setLevel((prev) => prev + 1);
    setScore(0);
  };

  const handleTileClick = (x, y) => {
    if (!selected) {
      setSelected({ x, y });
    } else {
      const dx = Math.abs(selected.x - x);
      const dy = Math.abs(selected.y - y);

      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        swapTiles(selected.x, selected.y, x, y);
      }
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-4">Number Snap Game</h1>
      {newYearMessage && (
        <p className="text-xl mb-4 text-green-600 font-bold">
          🎉 Happy New Year! 🎉
        </p>
      )}
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
          <p className="text-xl mb-2">Level: <span className="font-semibold">{level + 1}</span></p>
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
};

export default App;
