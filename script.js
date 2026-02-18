window.addEventListener("DOMContentLoaded", () => {

const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");

const startOverlay = document.getElementById("startOverlay");
const gameOverOverlay = document.getElementById("gameOverOverlay");

const rankingList = document.getElementById("ranking");
const finalRankingList = document.getElementById("finalRanking");

const nicknameInput = document.getElementById("nicknameInput");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const finalScoreText = document.getElementById("finalScore");

let gameStarted = false;
let gameOver = false;
let blocks = [];
let score = 0;
let speed = 3;
let nickname = "";
let blockInterval;

/* =====================
   플레이어 이동 (PC)
===================== */
game.addEventListener("mousemove", e => {
  if (!gameStarted) return;

  const rect = game.getBoundingClientRect();
  let x = e.clientX - rect.left - player.offsetWidth / 2;
  x = Math.max(0, Math.min(x, game.clientWidth - player.offsetWidth));
  player.style.left = x + "px";
});

/* =====================
   플레이어 이동 (모바일 추가)
===================== */
game.addEventListener("touchmove", e => {
  if (!gameStarted) return;
  e.preventDefault();

  const rect = game.getBoundingClientRect();
  const touch = e.touches[0];

  let x = touch.clientX - rect.left - player.offsetWidth / 2;
  x = Math.max(0, Math.min(x, game.clientWidth - player.offsetWidth));
  player.style.left = x + "px";
}, { passive: false });

/* =====================
   블럭 생성
===================== */
function createBlock() {
  if (!gameStarted || gameOver) return;

  const block = document.createElement("div");
  block.classList.add("block");

  const isBad = Math.random() < 0.3;
  block.classList.add(isBad ? "bad" : "good");
  block.dataset.type = isBad ? "bad" : "good";

  // 🔥 블럭 실제 width 기준으로 위치 계산
  game.appendChild(block);

  block.style.left =
    Math.random() * (game.clientWidth - block.offsetWidth) + "px";

  block.style.top = "0px";

  blocks.push(block);
}

/* =====================
   충돌 체크
===================== */
function isColliding(a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();

  return !(
    ar.top > br.bottom ||
    ar.bottom < br.top ||
    ar.right < br.left ||
    ar.left > br.right
  );
}

/* =====================
   게임 루프
===================== */
function update() {
  if (!gameStarted || gameOver) return;

  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i];
    block.style.top = block.offsetTop + speed + "px";

    if (isColliding(player, block)) {
      if (block.dataset.type === "bad") {
        endGame();
        return;
      }

      block.remove();
      blocks.splice(i, 1);
      score++;
      scoreText.innerText = "Score: " + score;
      continue;
    }

    if (block.offsetTop > game.clientHeight) {
      if (block.dataset.type === "good") {
        endGame();
        return;
      }
      block.remove();
      blocks.splice(i, 1);
    }
  }

   });

  requestAnimationFrame(update);
}
