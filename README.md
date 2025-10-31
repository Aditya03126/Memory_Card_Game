# Memory Card Game

## Project Overview
This is an interactive Memory Card Game built using HTML, CSS, and vanilla JavaScript. The game challenges players to match pairs of cards by flipping them over two at a time. It features multiple difficulty levels, themes, animations, and a scoring system.

## Features

### Core Functionality
- **Card Matching**: Flip cards to find matching pairs
- **Move Counter**: Tracks the number of moves made
- **Timer**: Records how long it takes to complete the game
- **New Game**: Reset and shuffle cards at any time
- **Win Detection**: Automatically detects when all pairs are matched

### Enhanced Features
- **Multiple Difficulty Levels**: Easy (4x4), Medium (6x6), and Hard (8x8) grid sizes
- **Theme Selection**: Choose from different card themes (Animals, Emojis, Food)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **High Score Tracking**: Saves and displays top scores for each difficulty level
- **Sound Effects**: Audio feedback for card flips, matches, and wins
- **Hint System**: Get help finding a matching pair (with a move penalty)
- **Animations**: Smooth card flips, matches, and transitions

### Technical Features
- **Local Storage**: Persists high scores between sessions
- **Adaptive Layout**: Grid adjusts based on screen size and difficulty
- **Keyboard Support**: Use Escape key to close modals
- **Sound Controls**: Toggle sound effects on/off

## How to Play
1. Select a difficulty level and theme
2. Click on any card to flip it and reveal its icon
3. Click on a second card to try to find a match
4. If the cards match, they stay face up
5. If they don't match, they flip back over
6. Continue until all pairs are matched
7. Try to complete the game in the fewest moves and shortest time

## How to Run the Application
1. Clone or download this repository
2. Open the `index.html` file in any modern web browser
3. Start playing!

## Technologies Used
- HTML5
- CSS3 (with Flexbox, Grid, and CSS animations)
- Vanilla JavaScript (ES6+)
- Local Storage API
- Font Awesome icons

## Project Structure
- `index.html`: Main HTML structure
- `style.css`: All styling and responsive design rules
- `script.js`: Game logic and functionality

## Implementation Details

### Card Generation
- Cards are dynamically generated based on the selected difficulty and theme
- Fisher-Yates algorithm is used for thorough card shuffling

### Game Logic
- The game tracks the state of flipped cards and prevents invalid moves
- Matching logic compares the icons of the two flipped cards
- Win condition checks if all pairs have been matched

### Scoring System
- Score is calculated based on moves made and time taken
- Formula: `Score = Math.max(Math.floor(10000 / (moves + timeInSeconds * 0.5)), 100)`
- Lower moves and faster completion result in higher scores

### Responsive Design
- CSS Grid is used for the game board layout
- Media queries adjust the grid and card sizes for different screen sizes
- The interface remains usable on devices as small as mobile phones

## Future Enhancements
- Multiplayer mode
- Custom card uploads
- More themes and difficulty levels
- Achievements and badges
- Dark/light mode toggle
- Card animations and effects

## Credits
This project was created as part of a front-end web development assignment to demonstrate HTML, CSS, and JavaScript skills.