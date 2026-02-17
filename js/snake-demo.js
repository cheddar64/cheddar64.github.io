/* ============================================
   DEMO 1: Snake moving left to right
   Grid-locked, random vertical wiggles
   ============================================ */

(() => {
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const GRID = 16;
  const COLS = Math.ceil(canvas.width / GRID);
  const ROWS = Math.ceil(canvas.height / GRID);

  const COLORS = [
    '#1802fd', '#ff7701', '#2ff429', '#ea2215',
    '#68f3e4', '#f6f927', '#f724ea'
  ];

  // Snake state — array of {gx, gy} grid positions
  const snake = [];
  const SNAKE_LEN = 35;
  const startRow = Math.floor(ROWS / 2);

  // Build initial snake trailing off-screen left
  for (let i = 0; i < SNAKE_LEN; i++) {
    snake.push({ gx: -i, gy: startRow });
  }

  let direction = 'right'; // current direction
  let moveTimer = 0;
  const MOVE_INTERVAL = 70; // ms between moves

  function pickDirection() {
    const head = snake[0];

    // Always bias toward moving right
    // Occasionally wiggle up or down
    const rand = Math.random();

    if (direction === 'right') {
      // 70% keep going right, 15% go up, 15% go down
      if (rand < 0.7) return 'right';
      if (rand < 0.85) return 'up';
      return 'down';
    }

    if (direction === 'up' || direction === 'down') {
      // After a vertical move, usually go right again
      // 60% right, 40% continue vertical
      if (rand < 0.6) return 'right';
      return direction;
    }

    return 'right';
  }

  function moveSnake() {
    const head = snake[0];
    direction = pickDirection();

    let nx = head.gx;
    let ny = head.gy;

    if (direction === 'right') nx += 1;
    else if (direction === 'up') ny -= 1;
    else if (direction === 'down') ny += 1;

    // Clamp vertical to stay on screen with margin
    if (ny < 2) { ny = 2; direction = 'down'; }
    if (ny > ROWS - 3) { ny = ROWS - 3; direction = 'up'; }

    // Add new head
    snake.unshift({ gx: nx, gy: ny });

    // Remove tail
    if (snake.length > SNAKE_LEN) snake.pop();

    // Check if fully off-screen right — loop back
    if (snake[snake.length - 1].gx > COLS + 2) {
      // Reset snake to left side
      const resetRow = Math.floor(Math.random() * (ROWS - 10)) + 5;
      snake.length = 0;
      for (let i = 0; i < SNAKE_LEN; i++) {
        snake.push({ gx: -i, gy: resetRow });
      }
      direction = 'right';
    }
  }

  function draw() {
    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((seg, i) => {
      const alpha = 1 - (i / snake.length) * 0.4;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fillRect(seg.gx * GRID, seg.gy * GRID, GRID, GRID);
    });

    ctx.globalAlpha = 1;
  }

  let lastTime = 0;

  function loop(time) {
    if (time - lastTime >= MOVE_INTERVAL) {
      moveSnake();
      lastTime = time;
    }
    draw();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
