const scoreText = document.getElementById("score");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreText = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let gameRunning = true;

/* 🔥 모바일 확대 방지 */
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

document.addEventListener("dblclick", function (e) {
  e.preventDefault();
}, { passive: false });

/* 점수 증가 (테스트용) */
function increaseScore() {
  if (!gameRunning) return;
  score++;
  scoreText.textContent = "Score: " + score;
}

/* 게임오버 */
function gameOver() {
  if (!gameRunning) return;

  gameRunning = false;
  finalScoreText.textContent = "Score: " + score + "점";
  gameOverOverlay.classList.remove("hidden");
}

/* 다시하기 버튼 */
restartBtn.addEventListener("click", function () {
  score = 0;
  gameRunning = true;
  scoreText.textContent = "Score: 0";
  gameOverOverlay.classList.add("hidden");
});
