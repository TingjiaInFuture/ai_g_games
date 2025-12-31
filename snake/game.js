const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const finalScoreDisplay = document.getElementById('final-score');
const finalHighScoreDisplay = document.getElementById('final-high-score');
const gameOverScreen = document.getElementById('game-over');
const startScreen = document.getElementById('start-screen');
const pauseScreen = document.getElementById('pause-screen');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const muteButton = document.getElementById('mute-button');
const speedButtons = document.querySelectorAll('.speed-btn');

const gridSize = 20; // Size of each grid cell
const canvasSize = canvas.width; // Assuming square canvas
const tileCount = canvasSize / gridSize; // Number of tiles in each row/column

let snake = [
    { x: 10, y: 10 } // Initial snake position (in grid units)
];
let dx = 0; // Horizontal velocity
let dy = 0; // Vertical velocity
let food = { x: 15, y: 15 }; // Initial food position
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') ? parseInt(localStorage.getItem('snakeHighScore')) : 0;
let changingDirection = false;
let gameRunning = false;
let isPaused = false;
let gameLoopTimeout;
let gameSpeed = 100; // Default medium speed
let isMuted = localStorage.getItem('snakeMuted') === 'true';

// 音效
let eatSound, gameOverSound;
try {
    eatSound = new Audio('data:audio/wav;base64,UklGRl4FAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToFAACAf35/gH+Af4B/gH+Af4B/f3+Af4CAf4CAgICBgIGAgYCBgIGAgYGAgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgoGCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoGCgYKBgoGCgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYCBgICAgIB/gH+Af4B/f39/f39/f39/fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn9/f39/f39/f39/gH+Af4CAgICAgICAgYCBgIGAgYGBgYGBgYGBgYGBgoGCgoKCgoKCgoKCgoKCgoKCgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgYKBgoGCgYKBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYCBgICAgICAgICAf4B/gH9/f39/f39/f39+f35/fn5+fn5+fn5+fn1+fX59fn1+fX59fn1+fX59fn1+fX59fn1+fX59fn1+fX59fn5+fn5+fn5+fn5+fn5/fn9+f39/f39/f4B/gH+AgICAgICBgIGAgYGBgYGBgYGBgYKBgoGCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgYKBgoGCgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYCBgICAgICAf4B/gH+Af39/f39/f35/fn9+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5/fn9/f39/f39/f3+Af4B/gICAgICAgIGAgYCBgYGBgYGBgYGBgYGCgYKCgoKCgoKCgoKCgoKCgoKCgoKDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKBgoGCgYKBgoGBgYGBgYGBgYGBgYGBgYGBgYGBgYGAgYCAgICAgIB/gH+Af4B/f39/f39/f35/fn9+fn5+fn5+fn59fn1+fX59fn1+fX59fn1+fX59fn1+fX59fn1+fX59fn5+fn5+fn5+fn5+fn5/fn9+f39/f39/gH+Af4CAgICAgIGAgYCBgYGBgYGBgYGBgoGCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgYKBgoGCgYKBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGAgYCAgICAgH+Af4B/gH9/f39/f39/fn9+f35+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+f35/f39/f39/f39/gH+Af4CAgICAgICBgIGAgYGBgYGBgYGBgYGBgoGCgoKCgoKCgoKCgoKCgoKCgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgYKBgoGCgYKBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYCBgICAgICAgIB/gH+Af39/f39/f39/fn9+f35+fn5+fn5+fX59fn1+fX59fn1+fX59fn1+fX59fn1+fX59fn1+fX5+fn5+fn5+fn5+fn5+f35/fn9/f39/f4B/gH+AgICAgICBgIGAgYGBgYGBgYGBgYKBgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKBgoGCgYKBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgIGAgICAgIB/gH+Af4B/f39/f39/f35/fn9+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn9+f39/f39/f39/f4B/gH+AgICAgICAgYCBgIGBgYGBgYGBgYGBgYKBgoKCgoKCgoKCgoKCgoKCgoKCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KDgoOCg4KCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKBgoGCgYKBgoGCgYGBgYGBgYGBgYGBgYGBgYGBgYGBgIGAgICAgICAgH+Af4B/f39/f39/f39+f35/fn5+fn5+fn5+fX59fn1+fX59fn1+fX59fn1+fX59fn1+fX59fn1+fn5+fn5+fn5+fn5+fn9+f35/f39/f3+Af4B/gICAgICAg');
    gameOverSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVYGAACAf4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af35/fX18fHt7ent6eXl5eHh3d3Z2dXV0dHNzc3JycXFxcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBxcXFxcnJyc3NzdHR1dXZ2d3d4eHl5enp7e3x8fX1+fn9/gICAgH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/fn99fXx8e3t6enl5eHh3d3Z2dXV0dHNzc3JycXFwcHBvb29vb29vb29vb29vb29vb29vcHBwcHFxcXJycnNzdHR1dXZ2d3d4eHl5enp7e3x8fX1+f39/gICAgIB/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+AfH59fXx8e3t6enl5eHh3d3Z2dXV0dHNzc3JycXFwcHBvb29vb29vb29vb29vb29vb29vcHBwcHFxcXJyc3NzdHR1dXZ2d3d4eHl5enp7e3x8fX5+f3+AgICAf4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH9+fn19fHx7e3p6eXl4eHd3dnZ1dXR0c3Nzc3JycXFwcG9vb29vb29vb29vb29vb29vb29wcHBwcXFxcnJyc3N0dHV1dnZ3d3h4eXl6ent7fHx9fX5/f4CAgIB/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af35/fX18fHt7e3p5eXh4d3d2dnV1dHR0c3NycnFxcHBwb29vb29vb29vb29vb29vb29vb3BwcHBxcXFycnJzc3R0dXV2dnd3eHh5eXp6e3t8fH19fn9/f4CAgH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH9+fn19fHx7e3t6eXl4eHd3dnZ1dXR0dHNzcnJxcXBwcG9vb29vb29vb29vb29vb29vb29wcHBwcXFxcnJyc3N0dHV1dnZ3d3h4eXl6ent7fHx9fn5/f4CAgIB/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Afn99fX18fHt7enp5eXh4d3d2dnV1dHR0c3NycnFxcHBwb29vb29vb29vb29vb29vb29vb3BwcHBxcXFycnJzc3R0dXV2dnd3eHh5eXp6e3t8fH19fn9/gICAf4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH9/fn59fXx8e3t6enl5eHh3d3Z2dXV1dHRzc3JycXFxcHBvb29vb29vb29vb29vb29vb29wcHBwcXFxcnJyc3N0dHV1dnZ3d3h4eXl6ent7fHx9fX5/f4CAgH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/fn99fXx8fHt6enl5eHh3d3Z2dXV1dHRzc3JycXFxcHBvb29vb29vb29vb29vb29vb29wcHBwcXFxcnJyc3N0dHV1dnZ3d3h4eXl6ent7fHx9fX5/f4CAgIB/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH9/fn5+fX18fHt7enp5eXh4d3d2dnZ1dHR0c3NycnFxcXBwb29vb29vb29vb29vb29vb29vcHBwcHFxcXJycnNzdHR1dXZ2d3d4eHl5enp7e3x8fX1+f3+AgICAgH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af39+fn19fHx7e3p6eXl4eHd3d3Z1dXR0c3Nzc3JycXFwcHBvb29vb29vb29vb29vb29vb29wcHBwcXFxcnJyc3N0dHV1dnZ3d3h4eXl6ent7fHx9fX5/f4CAgIB/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH9/f359fXx8e3t6enl5eXh3d3Z2dXV1dHRzc3JycXFxcHBwb29vb29vb29vb29vb29vb29wcHBwcXFxcnJyc3N0dHV1dnZ3d3h4eXl6ent7fHx9fX5/f4CAgIB/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH+Af4B/gH9/fn59fXx8e3t7enl5eHh3d3Z2dXV1dHRzc3JycXFxcHBwb29vb29vb29vb29vb29vb29wcHBwcXFxcnJyc3N0dHV1dnZ3d3h4eXl6ent7fHx9fX5/f4CAgH+Af4B/');
} catch (e) {
    console.warn('音效加载失败');
}

// 初始化最高分显示
highScoreDisplay.textContent = highScore;

// 静音按钮更新
function updateMuteButton() {
    muteButton.textContent = isMuted ? '🔇' : '🔊';
}
updateMuteButton();

// --- Game Logic Functions ---

function main() {
    if (!gameRunning || isPaused) return;

    gameLoopTimeout = setTimeout(() => {
        changingDirection = false;
        clearCanvas();
        moveSnake();
        drawFood();
        drawSnake();
        main(); // Recursive call for game loop
    }, gameSpeed); // Game speed (lower is faster)
}

function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
    resetGame(); // Reset game state first
    gameRunning = true; // Set gameRunning to true *after* reset
    isPaused = false;
    dx = 1; // Move right initially
    dy = 0;
    changingDirection = false;
    main(); // Start the loop
}

function pauseGame() {
    if (!gameRunning) return;
    isPaused = true;
    clearTimeout(gameLoopTimeout);
    pauseScreen.style.display = 'flex';
    pauseButton.textContent = '继续';
}

function resumeGame() {
    if (!gameRunning) return;
    isPaused = false;
    pauseScreen.style.display = 'none';
    pauseButton.textContent = '暂停';
    main();
}

function togglePause() {
    if (isPaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

function resetGame() {
    clearTimeout(gameLoopTimeout); // Clear any existing loop
    snake = [{ x: 10, y: 10 }];
    dx = 0; // Reset direction here
    dy = 0; // Reset direction here
    score = 0;
    scoreDisplay.textContent = score;
    placeFood();
}

function clearCanvas() {
    ctx.fillStyle = '#f9f9f9'; // Background color
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.strokeStyle = '#eee'; // Grid lines (optional)
    ctx.lineWidth = 0.5;
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvasSize, i * gridSize);
        ctx.stroke();
    }
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = '#4CAF50'; // Snake color
    ctx.strokeStyle = '#388E3C'; // Snake border
    ctx.fillRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
    ctx.strokeRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head); // Add new head

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        // 更新最高分
        if (score > highScore) {
            highScore = score;
            highScoreDisplay.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
        // 播放吃食物音效
        if (!isMuted && eatSound) {
            eatSound.currentTime = 0;
            eatSound.play().catch(() => {});
        }
        placeFood(); // Place new food
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    // Check for game over conditions
    if (hasGameEnded()) {
        endGame();
    }
}

function changeDirection(event) {
    // Start the game on first key press if not running yet
    // (Optional: could keep the start button requirement)
    // if (!gameRunning) {
    //     startGame();
    // }

    if (changingDirection || !gameRunning) return; // Prevent rapid changes or changes when not running
    changingDirection = true;

    const keyPressed = event.key;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingLeft = dx === -1;
    const goingRight = dx === 1;

    // Use Arrow keys or WASD
    if ((keyPressed === 'ArrowLeft' || keyPressed.toLowerCase() === 'a') && !goingRight) {
        dx = -1;
        dy = 0;
    } else if ((keyPressed === 'ArrowUp' || keyPressed.toLowerCase() === 'w') && !goingDown) {
        dx = 0;
        dy = -1;
    } else if ((keyPressed === 'ArrowRight' || keyPressed.toLowerCase() === 'd') && !goingLeft) {
        dx = 1;
        dy = 0;
    } else if ((keyPressed === 'ArrowDown' || keyPressed.toLowerCase() === 's') && !goingUp) {
        dx = 0;
        dy = 1;
    } else {
         // If invalid key or opposite direction, don't change direction
         changingDirection = false;
    }
}

function randomPosition() {
    return Math.floor(Math.random() * tileCount);
}

function placeFood() {
    food.x = randomPosition();
    food.y = randomPosition();
    // Ensure food doesn't spawn on the snake
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            placeFood(); // Recursively try again
        }
    });
}

function drawFood() {
    ctx.fillStyle = '#FF4500'; // Food color
    ctx.strokeStyle = '#cc3700'; // Food border
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function hasGameEnded() {
    // Check wall collision
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= tileCount;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= tileCount;

    if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
        return true;
    }

    // Check self collision
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    return false;
}

function endGame() {
    gameRunning = false; // endGame is the correct place to set gameRunning to false
    clearTimeout(gameLoopTimeout);
    // 播放游戏结束音效
    if (!isMuted && gameOverSound) {
        gameOverSound.currentTime = 0;
        gameOverSound.play().catch(() => {});
    }
    finalScoreDisplay.textContent = score;
    finalHighScoreDisplay.textContent = highScore;
    gameOverScreen.style.display = 'flex';
}

// --- Event Listeners ---
document.addEventListener('keydown', changeDirection);

// 暂停键监听
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (gameRunning) togglePause();
    }
});

restartButton.addEventListener('click', () => {
    resetGame(); // Reset first
    startGame(); // Then start
});
startButton.addEventListener('click', startGame);

pauseButton.addEventListener('click', togglePause);
resumeButton.addEventListener('click', resumeGame);

// 静音按钮
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    localStorage.setItem('snakeMuted', isMuted);
    updateMuteButton();
});

// 速度选择
speedButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        speedButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const speed = btn.dataset.speed;
        if (speed === 'slow') gameSpeed = 150;
        else if (speed === 'medium') gameSpeed = 100;
        else if (speed === 'fast') gameSpeed = 60;
    });
});

// --- Initial Setup ---
resetGame(); // Prepare the game board initially
clearCanvas(); // Draw initial empty canvas with grid
drawFood();    // Draw initial food
drawSnake();   // Draw initial snake
// Show start screen by default (handled in HTML/CSS)
