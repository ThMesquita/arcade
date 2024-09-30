const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

// const audioComer = document.getElementById("audioComer");
const audio = new Audio("../assets/sound.mp3");
const audioLose = new Audio("../assets/lose.wav");

const size = 30;

let snake = [
  { x: 210, y: 210 },
  { x: 240, y: 210 },
  { x: 270, y: 210 },
  { x: 300, y: 210 },
];

const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};

const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
};

const food = { x: randomPosition(), y: randomPosition(), color: randomColor() };

let direction, loopId;

const drawFood = () => {
  const { x, y, color } = food;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(food.x, food.y, size, size);
  ctx.shadowBlur = 0;
};

const drawSnake = () => {
  snake.forEach((position, index) => {
    ctx.fillStyle = "#30A500";
    if (index == snake.length - 2) {
      ctx.fillStyle = "#A8D944";
    }
    ctx.fillRect(position.x, position.y, size, size);
  });
};

const moveSnake = () => {
  const head = snake.at(-1);

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  } else if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  } else if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  } else if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  } else {
    return;
  }

  snake.shift();
};

const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

const randomFood = () => {
  let x = randomPosition();
  let y = randomPosition();

  while (snake.find((position) => position.x == x && position.y == y)) {
    x = randomPosition();
    y = randomPosition();
  }

  food.x = x;
  food.y = y;
  food.color = randomColor();
};

const checkEat = () => {
  const head = snake[snake.length - 1];
  if (head.x == food.x && head.y == food.y) {
    snake.push(head);
    // audioComer.currentTime = 0;
    audio.pause();
    audio.play();
    incrementScore();
    randomFood();
  }
};

let flag = 1;

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
    if (flag) {
      audioLose.play();
      flag = 0;
    }
  }
};

const gameOver = () => {
  direction = undefined;
  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};

const gameloop = () => {
  clearInterval(loopId);
  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  checkEat();
  checkCollision();

  loopId = setTimeout(() => {
    gameloop();
  }, 100);
};

gameloop();

document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  } else if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  } else if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  } else if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
});

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  flag = 1;

  snake = [
    { x: 210, y: 210 },
    { x: 240, y: 210 },
    { x: 270, y: 210 },
    { x: 300, y: 210 },
  ];

  randomFood();
});
