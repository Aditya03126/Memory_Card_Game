// DOM Elements
const gameBoard = document.querySelector('.game-board');
const movesCount = document.getElementById('moves-count');
const timeValue = document.getElementById('time');
const newGameBtn = document.getElementById('new-game-btn');
const difficultySelect = document.getElementById('difficulty');
const themeSelect = document.getElementById('theme');
const winModal = document.getElementById('win-modal');
const closeModal = document.querySelector('.close-modal');
const playAgainBtn = document.getElementById('play-again-btn');
const winMoves = document.getElementById('win-moves');
const winTime = document.getElementById('win-time');
const winScore = document.getElementById('win-score');
const highScoresList = document.getElementById('high-scores-list');

// Game Variables
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 0;
let gameStarted = false;
let timer;
let seconds = 0;
let minutes = 0;

// Theme Icons
const themes = {
    animals: [
        'fa-dog', 'fa-cat', 'fa-fish', 'fa-dove', 'fa-hippo', 'fa-dragon',
        'fa-horse', 'fa-frog', 'fa-spider', 'fa-kiwi-bird', 'fa-paw', 'fa-otter',
        'fa-cow', 'fa-mosquito', 'fa-shrimp', 'fa-bee', 'fa-worm', 'fa-bugs',
        'fa-crow', 'fa-bat', 'fa-rabbit', 'fa-turtle', 'fa-elephant', 'fa-lion',
        'fa-giraffe', 'fa-dolphin', 'fa-whale', 'fa-penguin', 'fa-monkey', 'fa-bear',
        'fa-wolf', 'fa-fox'
    ],
    emojis: [
        'fa-face-smile', 'fa-face-laugh', 'fa-face-grin', 'fa-face-angry',
        'fa-face-dizzy', 'fa-face-flushed', 'fa-face-frown', 'fa-face-grimace',
        'fa-face-grin-hearts', 'fa-face-grin-stars', 'fa-face-kiss', 'fa-face-laugh-beam',
        'fa-face-meh', 'fa-face-rolling-eyes', 'fa-face-sad-cry', 'fa-face-sad-tear',
        'fa-face-surprise', 'fa-face-tired', 'fa-face-grin-tongue', 'fa-face-grin-wink',
        'fa-face-kiss-beam', 'fa-face-grin-tears', 'fa-face-grin-squint', 'fa-face-grin-beam',
        'fa-face-meh-blank', 'fa-face-smile-beam', 'fa-face-grin-wide', 'fa-face-laugh-wink',
        'fa-face-laugh-squint', 'fa-face-grin-tongue-squint', 'fa-face-grin-tongue-wink', 'fa-face-kiss-wink-heart'
    ],
    food: [
        'fa-apple-whole', 'fa-bacon', 'fa-burger', 'fa-cake-candles',
        'fa-carrot', 'fa-cheese', 'fa-cookie', 'fa-drumstick-bite',
        'fa-egg', 'fa-ice-cream', 'fa-lemon', 'fa-pepper-hot',
        'fa-pizza-slice', 'fa-shrimp', 'fa-fish', 'fa-hotdog',
        'fa-bread-slice', 'fa-candy-cane', 'fa-wine-glass', 'fa-beer-mug-empty',
        'fa-martini-glass', 'fa-mug-hot', 'fa-whiskey-glass', 'fa-wine-bottle',
        'fa-bowl-food', 'fa-bowl-rice', 'fa-cubes-stacked', 'fa-jar',
        'fa-plate-wheat', 'fa-wheat-awn', 'fa-champagne-glasses', 'fa-utensils'
    ]
};

// Difficulty Settings
const difficulties = {
    easy: { grid: 4, pairs: 8 },
    medium: { grid: 6, pairs: 18 },
    hard: { grid: 8, pairs: 32 }
};

// Initialize Game
function initializeGame() {
    resetGame();
    setupEventListeners();
    loadHighScores();
    generateCards();
}

// Setup Event Listeners
function setupEventListeners() {
    newGameBtn.addEventListener('click', generateCards);
    difficultySelect.addEventListener('change', generateCards);
    themeSelect.addEventListener('change', generateCards);
    closeModal.addEventListener('click', () => winModal.style.display = 'none');
    playAgainBtn.addEventListener('click', () => {
        winModal.style.display = 'none';
        generateCards();
    });
    window.addEventListener('click', (e) => {
        if (e.target === winModal) winModal.style.display = 'none';
    });
}

// Reset Game State
function resetGame() {
    stopTimer();
    gameBoard.innerHTML = '';
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedPairs = 0;
    totalPairs = 0;
    gameStarted = false;
    seconds = 0;
    minutes = 0;
    movesCount.textContent = moves;
    timeValue.textContent = '00:00';
}

// Generate Cards Based on Difficulty and Theme
function generateCards() {
    resetGame();
    
    const difficulty = difficultySelect.value;
    const theme = themeSelect.value;
    const { grid, pairs } = difficulties[difficulty];
    totalPairs = pairs;
    
    // Set grid layout based on difficulty
    gameBoard.className = `game-board ${difficulty}`;
    
    // Get icons for the selected theme
    const selectedIcons = themes[theme].slice(0, pairs);
    
    // Create pairs of cards
    cards = [...selectedIcons, ...selectedIcons];
    
    // Shuffle cards
    shuffleCards();
    
    // Create card elements
    cards.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <i class="fas ${icon} fa-2x"></i>
                </div>
                <div class="card-back"></div>
            </div>
        `;
        
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Shuffle Cards (Fisher-Yates algorithm)
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// Flip Card
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    
    // Start timer on first card flip
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    this.classList.add('flipped');
    
    if (!firstCard) {
        // First card flipped
        firstCard = this;
        return;
    }
    
    // Second card flipped
    secondCard = this;
    lockBoard = true;
    
    // Increment moves
    moves++;
    movesCount.textContent = moves;
    
    // Check for match
    checkForMatch();
}

// Check if Cards Match
function checkForMatch() {
    const isMatch = firstCard.querySelector('i').className === secondCard.querySelector('i').className;
    
    if (isMatch) {
        disableCards();
        matchedPairs++;
        
        // Check if all pairs are matched
        if (matchedPairs === totalPairs) {
            setTimeout(() => {
                showWinModal();
                saveHighScore();
            }, 500);
        }
    } else {
        unflipCards();
    }
}

// Disable Matched Cards
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoardState();
}

// Unflip Non-Matching Cards
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        
        resetBoardState();
    }, 1000);
}

// Reset Board State After Each Turn
function resetBoardState() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Timer Functions
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        
        // Update timer display
        timeValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

// Show Win Modal
function showWinModal() {
    stopTimer();
    
    // Calculate score (lower moves and time = higher score)
    const timeInSeconds = minutes * 60 + seconds;
    const score = Math.max(Math.floor(10000 / (moves + timeInSeconds * 0.5)), 100);
    
    winMoves.textContent = moves;
    winTime.textContent = timeValue.textContent;
    winScore.textContent = score;
    
    winModal.style.display = 'flex';
}

// High Score Functions
function saveHighScore() {
    const difficulty = difficultySelect.value;
    const timeInSeconds = minutes * 60 + seconds;
    const score = Math.max(Math.floor(10000 / (moves + timeInSeconds * 0.5)), 100);
    
    // Get existing high scores
    let highScores = JSON.parse(localStorage.getItem('memoryGameHighScores')) || {};
    
    // Initialize difficulty category if it doesn't exist
    if (!highScores[difficulty]) {
        highScores[difficulty] = [];
    }
    
    // Add new score
    highScores[difficulty].push({
        score,
        moves,
        time: timeInSeconds,
        date: new Date().toLocaleDateString()
    });
    
    // Sort scores (highest first) and keep only top 5
    highScores[difficulty].sort((a, b) => b.score - a.score);
    highScores[difficulty] = highScores[difficulty].slice(0, 5);
    
    // Save to localStorage
    localStorage.setItem('memoryGameHighScores', JSON.stringify(highScores));
    
    // Update high scores display
    loadHighScores();
}

function loadHighScores() {
    const difficulty = difficultySelect.value;
    const highScores = JSON.parse(localStorage.getItem('memoryGameHighScores')) || {};
    
    // Clear current list
    highScoresList.innerHTML = '';
    
    // Check if there are scores for the current difficulty
    if (!highScores[difficulty] || highScores[difficulty].length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No high scores yet!';
        highScoresList.appendChild(li);
        return;
    }
    
    // Add scores to the list
    highScores[difficulty].forEach((score, index) => {
        const li = document.createElement('li');
        const minutes = Math.floor(score.time / 60);
        const seconds = score.time % 60;
        
        li.innerHTML = `
            <span>#${index + 1}: ${score.score} points</span>
            <span>${score.moves} moves, ${minutes}:${seconds.toString().padStart(2, '0')}</span>
        `;
        
        highScoresList.appendChild(li);
    });
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGame);

// Add sound effects (optional)
const sounds = {
    flip: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3'),
    match: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-bonus-earned-in-video-game-2058.mp3'),
    win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3')
};

// Preload sounds
for (const sound in sounds) {
    sounds[sound].load();
    sounds[sound].volume = 0.3;
}

// Add sound to card flip
const originalFlipCard = flipCard;
flipCard = function() {
    sounds.flip.currentTime = 0;
    sounds.flip.play().catch(e => console.log('Audio play failed:', e));
    originalFlipCard.apply(this, arguments);
};

// Add sound to card match
const originalDisableCards = disableCards;
disableCards = function() {
    sounds.match.currentTime = 0;
    sounds.match.play().catch(e => console.log('Audio play failed:', e));
    originalDisableCards.apply(this, arguments);
};

// Add sound to win
const originalShowWinModal = showWinModal;
showWinModal = function() {
    sounds.win.currentTime = 0;
    sounds.win.play().catch(e => console.log('Audio play failed:', e));
    originalShowWinModal.apply(this, arguments);
};

// Add keyboard support
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && winModal.style.display === 'flex') {
        winModal.style.display = 'none';
    }
});

// Add a mute button for sounds
const controlsDiv = document.querySelector('.controls');
const muteButton = document.createElement('button');
muteButton.id = 'mute-btn';
muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
muteButton.title = 'Toggle Sound';
muteButton.style.padding = '8px 15px';
muteButton.style.borderRadius = '4px';
muteButton.style.border = 'none';
muteButton.style.cursor = 'pointer';
muteButton.style.backgroundColor = '#f0f0f0';

let muted = false;
muteButton.addEventListener('click', () => {
    muted = !muted;
    for (const sound in sounds) {
        sounds[sound].muted = muted;
    }
    muteButton.innerHTML = muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

controlsDiv.appendChild(muteButton);

// Add a hint system
let hintsUsed = 0;
const hintButton = document.createElement('button');
hintButton.id = 'hint-btn';
hintButton.innerHTML = '<i class="fas fa-lightbulb"></i> Hint';
hintButton.title = 'Get a Hint';
hintButton.style.padding = '8px 15px';
hintButton.style.borderRadius = '4px';
hintButton.style.border = 'none';
hintButton.style.cursor = 'pointer';
hintButton.style.backgroundColor = '#f0f0f0';
hintButton.style.marginLeft = '10px';

hintButton.addEventListener('click', () => {
    if (!gameStarted || matchedPairs === totalPairs) return;
    
    // Find unmatched cards
    const unmatchedCards = Array.from(document.querySelectorAll('.card:not(.matched)'));
    if (unmatchedCards.length <= 1) return;
    
    // Get all possible pairs
    const possiblePairs = [];
    for (let i = 0; i < unmatchedCards.length; i++) {
        for (let j = i + 1; j < unmatchedCards.length; j++) {
            const card1 = unmatchedCards[i];
            const card2 = unmatchedCards[j];
            const icon1 = card1.querySelector('i').className;
            const icon2 = card2.querySelector('i').className;
            
            if (icon1 === icon2) {
                possiblePairs.push([card1, card2]);
            }
        }
    }
    
    if (possiblePairs.length === 0) return;
    
    // Select a random pair to hint
    const randomPair = possiblePairs[Math.floor(Math.random() * possiblePairs.length)];
    
    // Highlight the pair briefly
    randomPair.forEach(card => {
        card.classList.add('hint');
        setTimeout(() => card.classList.remove('hint'), 1000);
    });
    
    // Increase moves as penalty for using hint
    moves += 2;
    movesCount.textContent = moves;
    hintsUsed++;
});

controlsDiv.appendChild(hintButton);

// Add CSS for hint
const style = document.createElement('style');
style.textContent = `
    .card.hint .card-inner {
        border: 3px solid #ffcc00;
        animation: pulse 1s infinite;
    }
    
    #mute-btn, #hint-btn {
        transition: background-color 0.3s;
    }
    
    #mute-btn:hover, #hint-btn:hover {
        background-color: #e0e0e0;
    }
`;
document.head.appendChild(style);