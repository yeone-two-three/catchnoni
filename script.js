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
   랭킹 저장 / 불러오기
===================== */
function loadRanking() {
  const data = localStorage.getItem("ranking");
  return data ? JSON.parse(data) : [];
}

function saveRanking(name, score) {
  const ranking = loadRanking();
  ranking.push({ name, score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem("ranking", JSON.stringify(ranking));
}

function renderRanking(target, limit = null) {
  let ranking = loadRanking();
  if (limit !== null) ranking = ranking.slice(0, limit);

  target.innerHTML = "";
  ranking.forEach((r, i) => {
    const li = document.createElement("li");
    li.innerText = `${i + 1}. ${r.name} - ${r.score}점`;
    target.appendChild(li);
  });
}

/* =====================
   플레이어 이동
===================== */
game.addEventListener("mousemove", e => {
  if (!gameStarted) return;

  const rect = game.getBoundingClientRect();
  let x = e.clientX - rect.left - player.offsetWidth / 2;
  x = Math.max(0, Math.min(x, game.clientWidth - player.offsetWidth));
  player.style.left = x + "px";
});

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

  block.style.left = Math.random() * (game.clientWidth - 40) + "px";
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

  blocks.forEach((block, i) => {
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
    }

    // 초록 블럭 놓치면 게임 오버
    if (block.offsetTop > game.clientHeight) {
      if (block.dataset.type === "good") {
        endGame();
        return;
      }
      block.remove();
      blocks.splice(i, 1);
    }
  });

  requestAnimationFrame(update);
}

/* =====================
   게임 시작 / 종료
===================== */
startBtn.addEventListener("click", () => {
  nickname = nicknameInput.value.trim();
  if (!nickname) return alert("닉네임을 입력하세요!");

  startOverlay.style.display = "none";
  gameStarted = true;
  gameOver = false;
  score = 0;

  scoreText.innerText = "Score: 0";

  blockInterval = setInterval(createBlock, 800);
  update();
});

function endGame() {
  gameOver = true;
  gameStarted = false;
  clearInterval(blockInterval);

  saveRanking(nickname, score);
  renderRanking(finalRankingList);

  finalScoreText.innerText = `Score: ${score}점`;
  gameOverOverlay.style.display = "flex";
}

restartBtn.addEventListener("click", () => {
  blocks.forEach(b => b.remove());
  blocks = [];

  gameOverOverlay.style.display = "none";
  startOverlay.style.display = "flex";

  renderRanking(rankingList, 3);
});

function getHitbox(el, padding = 10) {
  const r = el.getBoundingClientRect();
  return {
    top: r.top + padding,
    left: r.left + padding,
    right: r.right - padding,
    bottom: r.bottom - padding
  };
}

function isColliding(a, b) {
  const ar = getHitbox(a, 12);
  const br = getHitbox(b, 12);

  return !(
    ar.top > br.bottom ||
    ar.bottom < br.top ||
    ar.right < br.left ||
    ar.left > br.right
  );
}



/* =====================
   초기 랭킹 표시
===================== */
renderRanking(rankingList, 3);
