// Game Configuration
const GRID_SIZE = 18;
const INITIAL_SPEED = 10;
const SPEED_INCREMENT = 0.5;
const MAX_SPEED = 20;

// Game Modes Configuration
const GAME_MODES = {
    classic: {
        name: 'Classic',
        icon: '🌀',
        speed: 10,
        maxSpeed: 20,
        speedIncrement: 0.5,
        wrapWalls: true,
        description: 'Wrap around edges'
    },
    wall: {
        name: 'Wall',
        icon: '🧱',
        speed: 10,
        maxSpeed: 20,
        speedIncrement: 0.5,
        wrapWalls: false,
        description: 'Die on walls'
    },
    speed: {
        name: 'Speed',
        icon: '⚡',
        speed: 18,
        maxSpeed: 30,
        speedIncrement: 1,
        wrapWalls: true,
        description: 'Super fast gameplay'
    },
    hard: {
        name: 'Hard',
        icon: '🔥',
        speed: 20,
        maxSpeed: 35,
        speedIncrement: 1.5,
        wrapWalls: false,
        description: 'Extreme difficulty'
    }
};

// Game State
let gameState = {
    mode: 'classic',
    snake: [{ x: 9, y: 9 }],
    food: { x: 5, y: 8 },
    direction: { x: 0, y: 0 },
    inputDir: { x: 0, y: 0 },
    speed: INITIAL_SPEED,
    score: 0,
    highScore: 0,
    isPaused: false,
    isRunning: false,
    gameLoop: null,
    lastPaintTime: 0
};

// DOM Elements
const elements = {
    startScreen: document.getElementById('startScreen'),
    gameContainer: document.getElementById('gameContainer'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    board: document.getElementById('board'),
    score: document.getElementById('score'),
    highScore: document.getElementById('highScore'),
    highScoreDisplay: document.getElementById('highScoreDisplay'),
    highScoreClassic: document.getElementById('highScoreClassic'),
    highScoreWall: document.getElementById('highScoreWall'),
    highScoreSpeed: document.getElementById('highScoreSpeed'),
    highScoreHard: document.getElementById('highScoreHard'),
    finalScore: document.getElementById('finalScore'),
    finalHighScore: document.getElementById('finalHighScore'),
    finalMode: document.getElementById('finalMode'),
    modeBadge: document.getElementById('modeBadge'),
    restartBtn: document.getElementById('restartBtn'),
    menuBtn: document.getElementById('menuBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    pauseIcon: document.getElementById('pauseIcon'),
    upBtn: document.getElementById('upBtn'),
    downBtn: document.getElementById('downBtn'),
    leftBtn: document.getElementById('leftBtn'),
    rightBtn: document.getElementById('rightBtn'),
    modeCards: document.querySelectorAll('.mode-card')
};

// Audio
const sounds = {
    food: null, // Will use Web Audio API for short sound
    gameOver: new Audio('videogame-death-sound-43894.mp3'),
    move: new Audio('Snake Game Sound.mp3')
};

// Configure audio settings
sounds.gameOver.loop = false;
sounds.gameOver.volume = 0.8;
sounds.move.loop = false;
sounds.move.volume = 0.5;

// Create short eating sound using Web Audio API
let audioContext = null;
function createEatingSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create a short "pop" sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Configure the sound - short, pleasant beep
        oscillator.frequency.value = 800; // Higher pitch
        oscillator.type = 'sine';
        
        // Envelope for smooth start/end
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick fade in
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15); // Quick fade out
        
        oscillator.start(now);
        oscillator.stop(now + 0.15); // Very short sound (150ms)
        
        return true;
    } catch (error) {
        console.warn('Web Audio API not supported, falling back to silent:', error);
        return false;
    }
}

// Initialize
function init() {
    try {
        // Load and display all high scores from localStorage on page load
        updateAllHighScores();
        setupEventListeners();
        
        // Verify localStorage is working
        try {
            localStorage.setItem('_test', '1');
            localStorage.removeItem('_test');
            console.log('Game initialized successfully - localStorage is available');
        } catch (e) {
            console.warn('localStorage may not be available:', e);
        }
    } catch (error) {
        console.error('Error initializing game:', error);
        alert('Error loading game. Please refresh the page.');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Mode Selection Cards
    elements.modeCards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.dataset.mode;
            selectMode(mode);
        });
    });
    
    // Restart Button
    elements.restartBtn.addEventListener('click', () => {
        hideGameOverScreen();
        resetGame();
        startGame();
    });
    
    // Menu Button
    elements.menuBtn.addEventListener('click', () => {
        hideGameOverScreen();
        hideGameContainer();
        showStartScreen();
        updateAllHighScores();
    });
    
    // Pause Button
    elements.pauseBtn.addEventListener('click', togglePause);
    
    // Keyboard Controls
    window.addEventListener('keydown', handleKeyPress);
    
    // Mobile Directional Buttons
    elements.upBtn.addEventListener('click', () => changeDirection(0, -1));
    elements.downBtn.addEventListener('click', () => changeDirection(0, 1));
    elements.leftBtn.addEventListener('click', () => changeDirection(-1, 0));
    elements.rightBtn.addEventListener('click', () => changeDirection(1, 0));
    
    // Touch/Swipe Controls
    let touchStartX = 0;
    let touchStartY = 0;
    
    elements.board.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        e.preventDefault();
    }, { passive: false });
    
    elements.board.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 30) {
                changeDirection(-1, 0); // Left
            } else if (diffX < -30) {
                changeDirection(1, 0); // Right
            }
        } else {
            // Vertical swipe
            if (diffY > 30) {
                changeDirection(0, -1); // Up
            } else if (diffY < -30) {
                changeDirection(0, 1); // Down
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
        e.preventDefault();
    }, { passive: false });
}

// Handle Keyboard Input
function handleKeyPress(e) {
    if (!gameState.isRunning || gameState.isPaused) {
        if (e.key === ' ') {
            togglePause();
        }
        return;
    }
    
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection(0, -1);
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection(0, 1);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection(1, 0);
            break;
        case ' ':
            e.preventDefault();
            togglePause();
            break;
    }
}

// Change Direction (prevents reverse direction)
function changeDirection(x, y) {
    if (!gameState.isRunning || gameState.isPaused) return;
    
    // Prevent reversing direction
    if (gameState.direction.x === -x && gameState.direction.y === -y) {
        return;
    }
    
    if (gameState.direction.x === x && gameState.direction.y === y) {
        return;
    }
    
    gameState.inputDir = { x, y };
}

// Start Game
function startGame() {
    resetGame();
    hideStartScreen();
    showGameContainer();
    gameState.isRunning = true;
    gameState.isPaused = false;
    gameState.gameLoop = window.requestAnimationFrame(main);
}

// Select Mode
function selectMode(mode) {
    if (!GAME_MODES[mode]) return;
    gameState.mode = mode;
    const modeConfig = GAME_MODES[mode];
    gameState.speed = modeConfig.speed;
    updateModeBadge();
    startGame();
}

// Reset Game
function resetGame() {
    if (gameState.gameLoop) {
        cancelAnimationFrame(gameState.gameLoop);
    }
    
    // Stop all sounds when resetting
    stopAllSounds();
    
    const modeConfig = GAME_MODES[gameState.mode];
    gameState.snake = [{ x: 9, y: 9 }];
    gameState.direction = { x: 0, y: 0 };
    gameState.inputDir = { x: 0, y: 0 };
    gameState.speed = modeConfig.speed;
    gameState.score = 0;
    gameState.lastPaintTime = 0;
    gameState.isPaused = false;
    gameState.gameLoop = null;
    // Load high score from localStorage for current mode
    gameState.highScore = getHighScoreForMode(gameState.mode);
    
    // Update score display (this will show 0 for current score, high score will show best)
    if (elements.score) elements.score.textContent = 0;
    updateHighScoreDisplay();
    generateFood();
    updateModeBadge();
    // Render initial state
    render();
}

// Main Game Loop
function main(currentTime) {
    if (!gameState.isRunning || gameState.isPaused) {
        if (gameState.isRunning) {
            gameState.gameLoop = window.requestAnimationFrame(main);
        }
        return;
    }
    
    gameState.gameLoop = window.requestAnimationFrame(main);
    
    // Control frame rate based on speed
    if ((currentTime - gameState.lastPaintTime) / 1000 < 1 / gameState.speed) {
        return;
    }
    
    gameState.lastPaintTime = currentTime;
    gameEngine();
}

// Game Engine
function gameEngine() {
    // Don't move if no direction is set yet (wait for first input)
    if (gameState.inputDir.x === 0 && gameState.inputDir.y === 0) {
        render();
        return;
    }
    
    // Update direction
    gameState.direction = { ...gameState.inputDir };
    
    // Move snake
    const modeConfig = GAME_MODES[gameState.mode];
    const head = {
        x: gameState.snake[0].x + gameState.direction.x,
        y: gameState.snake[0].y + gameState.direction.y
    };
    
    // Handle boundaries based on mode
    if (modeConfig.wrapWalls) {
        // Wrap around edges
        if (head.x >= GRID_SIZE) head.x = 0;
        if (head.x < 0) head.x = GRID_SIZE - 1;
        if (head.y >= GRID_SIZE) head.y = 0;
        if (head.y < 0) head.y = GRID_SIZE - 1;
    } else {
        // Die on walls
        if (head.x >= GRID_SIZE || head.x < 0 || head.y >= GRID_SIZE || head.y < 0) {
            gameOver();
            return;
        }
    }
    
    gameState.snake.unshift(head);
    
    // Check collision
    if (checkCollision()) {
        gameOver();
        return;
    }
    
    // Check food consumption
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        gameState.score++;
        const modeConfig = GAME_MODES[gameState.mode];
        gameState.speed = Math.min(gameState.speed + modeConfig.speedIncrement, modeConfig.maxSpeed);
        updateScore();
        generateFood();
        playSound('food');
    } else {
        gameState.snake.pop();
    }
    
    // Render
    render();
}

// Check Collision
function checkCollision() {
    const head = gameState.snake[0];
    
    // Check self-collision
    for (let i = 1; i < gameState.snake.length; i++) {
        if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
            return true;
        }
    }
    
    return false;
}

// Generate Food (avoid snake body)
function generateFood() {
    let newFood;
    let isOnSnake = true;
    
    while (isOnSnake) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        
        isOnSnake = false;
        for (let segment of gameState.snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                isOnSnake = true;
                break;
            }
        }
    }
    
    gameState.food = newFood;
}

// Render Game
function render() {
    elements.board.innerHTML = '';
    
    // Render snake
    gameState.snake.forEach((segment, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y + 1;
        snakeElement.style.gridColumnStart = segment.x + 1;
        
        if (index === 0) {
            snakeElement.classList.add('head');
            // Add smile element for Netflix-style appearance
            const smile = document.createElement('div');
            smile.classList.add('smile');
            snakeElement.appendChild(smile);
        } else {
            snakeElement.classList.add('snake');
        }
        
        elements.board.appendChild(snakeElement);
    });
    
    // Render food
    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = gameState.food.y + 1;
    foodElement.style.gridColumnStart = gameState.food.x + 1;
    foodElement.classList.add('food');
    elements.board.appendChild(foodElement);
}

// Get High Score for Mode
function getHighScoreForMode(mode) {
    try {
        const scores = JSON.parse(localStorage.getItem('snakeHighScores') || '{}');
        const score = parseInt(scores[mode] || 0);
        return isNaN(score) ? 0 : score;
    } catch (e) {
        console.error('Error reading high score from localStorage:', e);
        return 0;
    }
}

// Save High Score for Mode
function saveHighScoreForMode(mode, score) {
    try {
        // Get existing scores
        const scores = JSON.parse(localStorage.getItem('snakeHighScores') || '{}');
        
        // Only save if the new score is higher
        const currentHighScore = parseInt(scores[mode] || 0);
        if (score > currentHighScore) {
            scores[mode] = score;
            localStorage.setItem('snakeHighScores', JSON.stringify(scores));
            console.log(`New high score saved for ${mode}: ${score}`);
            return true;
        }
        return false;
    } catch (e) {
        console.error('Error saving high score to localStorage:', e);
        // Try to handle localStorage quota exceeded
        if (e.name === 'QuotaExceededError') {
            alert('Storage quota exceeded. Please clear some browser data.');
        }
        return false;
    }
}

// Update Score
function updateScore() {
    if (elements.score) elements.score.textContent = gameState.score;
    
    if (gameState.score > gameState.highScore) {
        const oldHighScore = gameState.highScore;
        gameState.highScore = gameState.score;
        
        // Save to localStorage
        const saved = saveHighScoreForMode(gameState.mode, gameState.highScore);
        
        if (saved) {
            // Update displays
            updateHighScoreDisplay();
            updateAllHighScores();
        } else {
            // If save failed, revert to old high score
            gameState.highScore = oldHighScore;
        }
    }
}

// Update High Score Display
function updateHighScoreDisplay() {
    gameState.highScore = getHighScoreForMode(gameState.mode);
    if (elements.highScore) elements.highScore.textContent = gameState.highScore;
}

// Update All High Scores (for mode selection screen)
function updateAllHighScores() {
    if (elements.highScoreClassic) elements.highScoreClassic.textContent = getHighScoreForMode('classic');
    if (elements.highScoreWall) elements.highScoreWall.textContent = getHighScoreForMode('wall');
    if (elements.highScoreSpeed) elements.highScoreSpeed.textContent = getHighScoreForMode('speed');
    if (elements.highScoreHard) elements.highScoreHard.textContent = getHighScoreForMode('hard');
}

// Update Mode Badge
function updateModeBadge() {
    const modeConfig = GAME_MODES[gameState.mode];
    if (elements.modeBadge) {
        elements.modeBadge.textContent = modeConfig.name;
        elements.modeBadge.innerHTML = `${modeConfig.icon} ${modeConfig.name}`;
    }
}

// Toggle Pause
function togglePause() {
    if (!gameState.isRunning) return;
    
    const wasPaused = gameState.isPaused;
    gameState.isPaused = !gameState.isPaused;
    elements.pauseIcon.textContent = gameState.isPaused ? '▶' : '⏸';
    
    // If pausing (was not paused, now is paused), stop all sounds immediately
    if (!wasPaused && gameState.isPaused) {
        stopAllSounds();
    }
    
    if (!gameState.isPaused && gameState.gameLoop === null) {
        gameState.gameLoop = window.requestAnimationFrame(main);
    }
}

// Stop All Sounds
function stopAllSounds() {
    Object.values(sounds).forEach(sound => {
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
            sound.onended = null; // Clear any event listeners
        }
    });
    // Note: Web Audio API sounds stop automatically, no need to stop them here
}

// Game Over
function gameOver() {
    gameState.isRunning = false;
    cancelAnimationFrame(gameState.gameLoop);
    gameState.gameLoop = null;
    
    // Stop all playing sounds first
    stopAllSounds();
    
    // Play game over sound
    playSound('gameOver');
    
    const modeConfig = GAME_MODES[gameState.mode];
    if (elements.finalScore) elements.finalScore.textContent = gameState.score;
    if (elements.finalHighScore) elements.finalHighScore.textContent = gameState.highScore;
    if (elements.finalMode) elements.finalMode.textContent = `Mode: ${modeConfig.name} ${modeConfig.icon}`;
    
    setTimeout(() => {
        showGameOverScreen();
        hideGameContainer();
    }, 500);
}

// Play Sound
function playSound(soundName) {
    // Don't play sounds if game is not running (except game over sound)
    if (!gameState.isRunning && soundName !== 'gameOver') {
        return;
    }
    
    // Don't play sounds if game is paused (except game over sound)
    if (gameState.isPaused && soundName !== 'gameOver') {
        // Stop the sound if it's currently playing
        if (sounds[soundName] && !sounds[soundName].paused) {
            sounds[soundName].pause();
            sounds[soundName].currentTime = 0;
        }
        return;
    }
    
    if (soundName === 'food') {
        // Use short programmatic sound for eating
        createEatingSound();
    } else if (sounds[soundName]) {
        // For other sounds, just play normally
        sounds[soundName].currentTime = 0;
        const playPromise = sounds[soundName].play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Ignore audio errors
            });
        }
    }
}

// Show/Hide Screens
function showStartScreen() {
    elements.startScreen.classList.remove('hidden');
}

function hideStartScreen() {
    elements.startScreen.classList.add('hidden');
}

function showGameContainer() {
    elements.gameContainer.classList.add('active');
}

function hideGameContainer() {
    elements.gameContainer.classList.remove('active');
}

function showGameOverScreen() {
    elements.gameOverScreen.classList.add('show');
}

function hideGameOverScreen() {
    elements.gameOverScreen.classList.remove('show');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}