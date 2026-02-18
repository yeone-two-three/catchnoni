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
   랭킹
===================== */
function loadRanking() {
  return JSON.parse(localStorage.getItem("ranking")) || [];
}

function saveRanking(name, score) {
  const ranking = loadRanking();
  ranking.push({ name, score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function renderRanking(target, limit = null) {
  let ranking = loadRanking();
  if (limit) ranking = ranking.slice(0, limit);

  target.innerHTML = "";
  ranking.forEach((r, i) => {
    const li = document.createElement("li");
    li.innerText = `${i + 1}. ${r.name} - ${r.score}점`;
    target.appendChild(li);
  });
}

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
   플레이어 이동 (모바일)
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

  block.style.left =
    Math.random() * (game.clientWidth - 40) + "px";

  block.style.top = "0px";

  game.appendChild(block);
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

      // 점수 올라갈수록 속도 증가
      if (score % 5 === 0) speed += 0.5;
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

  requestAnimationFrame(update);
}

/* =====================
   시작
===================== */
startBtn.addEventListener("click", () => {
  nickname = nicknameInput.value.trim();
  if (!nickname) return alert("닉네임 입력!");

  startOverlay.style.display = "none";
  gameStarted = true;
  gameOver = false;
  score = 0;
  speed = 3;
  scoreText.innerText = "Score: 0";

  blockInterval = setInterval(createBlock, 800);
  update();
});

/* =====================
   종료
===================== */
function endGame() {
  gameOver = true;
  gameStarted = false;
  clearInterval(blockInterval);

  saveRanking(nickname, score);
  renderRanking(finalRankingList);

  finalScoreText.innerText = `Score: ${score}점`;
  gameOverOverlay.style.display = "flex";
}

/* =====================
   다시하기
===================== */
restartBtn.addEventListener("click", () => {
  blocks.forEach(b => b.remove());
  blocks = [];

  gameOverOverlay.style.display = "none";
  startOverlay.style.display = "flex";

  renderRanking(rankingList, 3);
});

/* 초기 랭킹 */
renderRanking(rankingList, 3);
