const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 캐릭터 초기 위치
let thief = { x: 100, y: 100, size: 20, crouching: false };
let owner = { x: 400, y: 300, size: 20, flashlightRange: 100, patrolDirection: 1 };
let guard = { x: 700, y: 500, size: 20, flashlightRange: 100, patrolDirection: 1 };

// 돈의 위치
let money = { x: 750, y: 500, size: 15, collected: false };

// CCTV 위치 및 감지 범위
let cctvs = [
  { x: 200, y: 150, range: 100 },
  { x: 600, y: 400, range: 100 }
];

// 레이저 함정 (다양한 형태와 많이 배치)
let lasers = [
  // 일직선 레이저
  { type: 'line', x1: 100, y1: 200, x2: 700, y2: 200 },
  { type: 'line', x1: 50, y1: 300, x2: 750, y2: 300 },
  { type: 'line', x1: 150, y1: 400, x2: 700, y2: 400 },

  // 곡선 레이저
  { type: 'curve', cx: 400, cy: 400, radius: 80 },
  { type: 'curve', cx: 600, cy: 300, radius: 100 },
  { type: 'curve', cx: 500, cy: 500, radius: 120 }
];

// 키 입력 상태
let keys = {};

// 이벤트 리스너
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (e.key === 'k') collectMoney();
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// 게임 업데이트 함수
function update() {
  moveThief();
  moveOwner();
  moveGuard();
  checkCollisions();
}

// 도둑 이동 로직
function moveThief() {
  let speed = 3;
  if (keys['Shift']) {
    thief.crouching = true;
    speed = 1.5;
  } else {
    thief.crouching = false;
  }

  if (keys['w']) thief.y -= speed;
  if (keys['s']) thief.y += speed;
  if (keys['a']) thief.x -= speed;
  if (keys['d']) thief.x += speed;
}

// 집 주인 이동 로직
function moveOwner() {
  owner.x += owner.patrolDirection * 2;
  if (owner.x >= canvas.width - owner.size || owner.x <= 0) {
    owner.patrolDirection *= -1;
  }
}

// 경비 이동 로직
function moveGuard() {
  guard.y += guard.patrolDirection * 2;
  if (guard.y >= canvas.height - guard.size || guard.y <= 0) {
    guard.patrolDirection *= -1;
  }
}

// 돈 획득 함수
function collectMoney() {
  if (
    thief.x < money.x + money.size &&
    thief.x + thief.size > money.x &&
    thief.y < money.y + money.size &&
    thief.y + thief.size > money.y
  ) {
    alert('돈을 획득했습니다! 당신의 승리입니다!');
    resetGame();
  }
}

// 충돌 및 감지 로직
function checkCollisions() {
  // 집 주인과의 거리
  if (Math.hypot(owner.x - thief.x, owner.y - thief.y) < owner.flashlightRange) {
    alert('집 주인에게 들켰습니다! 게임 오버!');
    resetGame();
  }

  // 경비와의 거리
  if (Math.hypot(guard.x - thief.x, guard.y - thief.y) < guard.flashlightRange) {
    alert('경비에게 들켰습니다! 게임 오버!');
    resetGame();
  }
}

// 그리기 함수들
function drawThief() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(thief.x, thief.y, thief.size, thief.size);
}

function drawOwner() {
  ctx.fillStyle = 'red';
  ctx.fillRect(owner.x, owner.y, owner.size, owner.size);
  drawFlashlight(owner);
}

function drawGuard() {
  ctx.fillStyle = 'orange';
  ctx.fillRect(guard.x, guard.y, guard.size, guard.size);
  drawFlashlight(guard);
}

function drawFlashlight(character) {
  ctx.beginPath();
  ctx.arc(character.x + character.size / 2, character.y + character.size / 2, character.flashlightRange, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 0, 0.1)';
  ctx.fill();
}

function drawMoney() {
  ctx.fillStyle = 'green';
  ctx.fillRect(money.x, money.y, money.size, money.size);
}

function drawLasers() {
  ctx.strokeStyle = 'red';
  lasers.forEach((laser) => {
    if (laser.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(laser.x1, laser.y1);
      ctx.lineTo(laser.x2, laser.y2);
      ctx.stroke();
    } else if (laser.type === 'curve') {
      ctx.beginPath();
      ctx.arc(laser.cx, laser.cy, laser.radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
}

// 메인 루프
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawThief();
  drawOwner();
  drawGuard();
  drawMoney();
  drawLasers();
  requestAnimationFrame(gameLoop);
}

// 게임 초기화
function resetGame() {
  thief.x = 100;
  thief.y = 100;
}

// 게임 시작
gameLoop();
