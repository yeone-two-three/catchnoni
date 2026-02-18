const game = document.getElementById("game");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const finalScoreText = document.getElementById("finalScore");

let score = 0;
let gameRunning = true;

// 🔥 터치 확대 방지 추가 보호 코드
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

document.addEventListener("dblclick", function (e) {
  e.preventDefault();
}, { passive: false });


// 점수 증가 예시
function increaseScore() {
  if (!gameRunning) return;
  score++;
  scoreText.textContent = "Score: " + score;
}

// 게임오버
function gameOver() {
  gameRunning = false;
  finalScoreText.textContent = "Score: " + score + "점";

  // 🔥 튀어나오는 이미지 생성 코드 없음
  gameOverOverlay.classList.remove("hidden");
}

// 다시하기
function restartGame() {
  score = 0;
  gameRunning = true;
  scoreText.textContent = "Score: 0";
  gameOverOverlay.classList.add("hidden");
}

// 테스트용 (3초 후 게임오버)
setTimeout(gameOver, 3000);
