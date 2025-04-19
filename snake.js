const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let snake = [{ x: 50, y: 50 }];
let food = { x: 100, y: 100 };
let dx = 10, dy = 0;
let score = 0;
let gameInterval;
function startGame() {
    snake = [{ x: 50, y: 50 }];
    dx = 10;
    dy = 0;
    score = 0;
    document.getElementById("score").innerText = `Score: ${score}`;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}
function gameLoop() {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    checkCollision();
    updateScore();
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function drawFood() {
    ctx.fillStyle = "#ff6347"; // Tomato Red
    ctx.fillRect(food.x, food.y, 10, 10);
}

function drawSnake() {
    ctx.fillStyle = "#32cd32"; // Lime Green
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
    }
}
function checkCollision() {
    let head = snake[0];
    // Check wall collision
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
    }
    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}
function generateFood() {
    let foodX, foodY;
    let isOnSnake;
    do {
        foodX = Math.floor(Math.random() * (canvas.width / 10)) * 10;
        foodY = Math.floor(Math.random() * (canvas.height / 10)) * 10;
        isOnSnake = snake.some(segment => segment.x === foodX && segment.y === foodY);
    } while (isOnSnake);
    return { x: foodX, y: foodY };
}
function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
}
function endGame() {
    clearInterval(gameInterval);
    alert("Game Over! Your final score is: " + score);
}
let nextDirection = { dx: 10, dy: 0 };

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && dy === 0) {
        nextDirection = { dx: 0, dy: -10 };
    } else if (event.key === "ArrowDown" && dy === 0) {
        nextDirection = { dx: 0, dy: 10 };
    } else if (event.key === "ArrowLeft" && dx === 0) {
        nextDirection = { dx: -10, dy: 0 };
    } else if (event.key === "ArrowRight" && dx === 0) {
        nextDirection = { dx: 10, dy: 0 };
    }
});

function moveSnake() {
    dx = nextDirection.dx;
    dy = nextDirection.dy;

    let head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = generateFood();
    } else {
        snake.pop();
    }
}