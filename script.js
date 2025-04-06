const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const highScoreDisplay = document.getElementById('high-score');

const tileSize = 20;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let snake = [{ x: 5, y: 5 }];
let food = spawnFood();
let direction = { x: 0, y: 0 };
let score = 0;
let level = 1;
let speed = 200; // milliseconds per frame
let highScore = localStorage.getItem('snakeHighScore') || 0;

highScoreDisplay.textContent = `High Score: ${highScore}`;

function drawCircle(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2, tileSize / 2 - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#222";
  ctx.stroke();
}

function spawnFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check collisions
  if (
    head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
    }
    alert(`Game over! Your score: ${score}`);
    document.location.reload();
    return;
  }

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    food = spawnFood();

    // Increase level every 5 points
    if (score % 5 === 0) {
      level++;
      levelDisplay.textContent = `Level: ${level}`;
      speed = Math.max(50, speed - 20); // Increase speed (min 50ms)
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, speed);
    }
  } else {
    snake.pop(); // Remove tail
  }

  // Add new head
  snake.unshift(head);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  drawCircle(food.x, food.y, 'red');

  // Draw snake
  snake.forEach((segment, index) =>
    drawCircle(segment.x, segment.y, index === 0 ? 'lime' : '#00ff00')
  );
}

function gameLoop() {
  if (direction.x !== 0 || direction.y !== 0) {
    update();
  }
  draw();
}

function changeDirection(event) {
  const keyMap = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
  };

  const newDir = keyMap[event.key];
  if (newDir) {
    // Prevent reversing direction
    if ((newDir.x !== -direction.x || newDir.y !== -direction.y) &&
        (direction.x !== newDir.x || direction.y !== newDir.y)) {
      direction = newDir;
    }
  }
}

document.addEventListener('keydown', changeDirection);

let gameInterval = setInterval(gameLoop, speed);

if (/Mobi|Android/i.test(navigator.userAgent)) {
  document.getElementById('mobile-controls').style.display = 'block';
}

document.getElementById('btn-up').addEventListener('click', () => setDirection(0, -1));
document.getElementById('btn-down').addEventListener('click', () => setDirection(0, 1));
document.getElementById('btn-left').addEventListener('click', () => setDirection(-1, 0));
document.getElementById('btn-right').addEventListener('click', () => setDirection(1, 0));

function setDirection(x, y) {
  if ((x !== -direction.x || y !== -direction.y) &&
      (direction.x !== x || direction.y !== y)) {
    direction = { x, y };
  }
}
//document.getElementById('mobile-controls').style.display = 'block';
