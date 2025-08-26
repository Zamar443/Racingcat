const player = document.getElementById("player");
const opponent = document.getElementById("opponent");
const result = document.getElementById("result");
const restartBtn = document.getElementById("restartBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const countdownEl = document.getElementById("countdown");

const finishLine = 820;
let gameOver = false;
let paused = false;
let raceStarted = false;
let opponentAnimation;

// Player movement
document.addEventListener("keydown", (e) => {
  if (gameOver || paused || !raceStarted) return;

  let currentLeft = parseInt(window.getComputedStyle(player).left);
  let currentBottom = parseInt(window.getComputedStyle(player).bottom);

  if (e.key === "ArrowRight") {
    player.style.left = Math.min(currentLeft + 25, finishLine) + "px";
  }
  if (e.key === "ArrowUp") {
    if (currentBottom < 180) {
      player.style.bottom = currentBottom + 50 + "px";
    }
  }
  if (e.key === "ArrowDown") {
    if (currentBottom > 20) {
      player.style.bottom = currentBottom - 50 + "px";
    }
  }

  checkWinner();
});

// Opponent automatic movement
function moveOpponent() {
  if (gameOver || paused || !raceStarted) return;

  let currentLeft = parseInt(window.getComputedStyle(opponent).left);
  if (currentLeft < finishLine) {
    opponent.style.left = (currentLeft + 15) + "px";
    checkWinner();
    opponentAnimation = requestAnimationFrame(moveOpponent);

  }
}
//Racing game simulation
let laptimes = [32.5, 30.8, 29.9];
let startTime;1
let lapCount = 0;
const totalLaps = 3;
function startLap() {
  if (lapCount < totalLaps) {
    lapCount++;
    startTime = Date.now();
    console.log(`Lap ${lapCount} started`);
  }
}

// Check winner
function checkWinner() {
  let playerLeft = parseInt(window.getComputedStyle(player).left);
  let opponentLeft = parseInt(window.getComputedStyle(opponent).left);

  if (playerLeft >= finishLine && !gameOver) {
    gameOver = true;
    cancelAnimationFrame(opponentAnimation);
    result.textContent = "🎉 You Win!";
  } else if (opponentLeft >= finishLine && !gameOver) {
    gameOver = true;
    cancelAnimationFrame(opponentAnimation);
    result.textContent = "😢 Opponent Wins!";
  }
}

// Countdown before race
function startCountdown() {
  let count = 3;
  countdownEl.style.display = "block";
  countdownEl.textContent = count;

  let countdownInterval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else if (count === 0) {
      countdownEl.textContent = "GO!";
    } else {
      clearInterval(countdownInterval);
      countdownEl.style.display = "none";
      raceStarted = true;
      moveOpponent();
    }
  }, 1000);
}

// Restart game
restartBtn.addEventListener("click", () => {
  gameOver = false;
  paused = false;
  raceStarted = false;
  result.textContent = "";
  player.style.left = "0px";
  player.style.bottom = "20px";
  opponent.style.left = "0px";
  opponent.style.bottom = "120px";
  cancelAnimationFrame(opponentAnimation);
  startCountdown();
});

// Pause game
pauseBtn.addEventListener("click", () => {
  if (!gameOver && raceStarted) {
    paused = true;
    cancelAnimationFrame(opponentAnimation);
  }
});

// Resume game
resumeBtn.addEventListener("click", () => {
  if (!gameOver && paused) {
    paused = false;
    moveOpponent();
  }
});

// Start game with countdown
startCountdown();
