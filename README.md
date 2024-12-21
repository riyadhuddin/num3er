# Number Snap Game

Number Snap is a simple and engaging number-based Match-3 game built using Next.js and styled with Tailwind CSS. Players swap adjacent tiles on a 6x6 grid to create matches of three or more identical numbers. Matching numbers earn points, and cascading matches keep the gameplay dynamic and fun!

## Features

- **Interactive Gameplay**: Swap tiles and create matches of three or more identical numbers.
- **Dynamic Scoring**: Earn points for every match and watch your score grow.
- **Cascading Matches**: Matched tiles are replaced, creating opportunities for chain reactions.
- **Reset Button**: Restart the game at any time to reset the grid and score.
- **Tile Highlights**: Clicked tiles change color for better visual feedback.
- **Responsive Design**: Fully responsive layout, optimized for both desktop and mobile devices.
- **Feature Toggles**: Integrated with DevCycle for dynamic feature management.

## Technologies Used

- **Next.js**: A React framework for building performant web applications.
- **Tailwind CSS**: A utility-first CSS framework for fast and customizable styling.
- **DevCycle**: A feature flagging and A/B testing tool for managing dynamic features.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/number-snap.git
   cd number-snap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Gameplay Instructions

1. Launch the game in your browser.
2. Click on a tile to select it.
3. Click on an adjacent tile to swap their positions.
4. Match three or more identical numbers horizontally or vertically to earn points.
5. Use the "Reset Game" button to start over if needed.

## DevCycle Integration

This project uses DevCycle for feature toggling. To enable or disable features dynamically:

1. Create an account at [DevCycle](https://www.devcycle.com/).
2. Get your SDK key and replace `<YOUR_SDK_KEY>` in `devcycle.js`.
3. Configure feature flags in the DevCycle dashboard.

## Folder Structure

```
number-snap/
├── src/
│   ├── app/
│   │   └── page.tsx   # Main game component
│   └── styles/
│       └── game.module.css # Custom styles (if needed)
├── public/     # Static assets
├── devcycle.js # DevCycle integration
└── README.md  # Project documentation
```

## Future Enhancements

- Add animations for matches and cascading tiles.
- Introduce power-ups and special tiles for advanced gameplay.
- Implement a leaderboard to track high scores.
- Add time-limited challenges or levels.

## Contributions

Contributions are welcome! If you have ideas or suggestions, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

Enjoy playing Number Snap! Let us know if you encounter any issues or have feedback to improve the game.

