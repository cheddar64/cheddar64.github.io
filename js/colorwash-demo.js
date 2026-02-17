/* ============================================
   DEMO 2: Color Wash / Pixel Flood
   Random color per pixel — chaotic mosaic texture
   ============================================ */

(() => {
  const canvas = document.getElementById('wash-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const GRID = 10;
  const COLS = Math.ceil(canvas.width / GRID);
  const ROWS = Math.ceil(canvas.height / GRID);

  const COLORS = [
    '#f724ea', '#ea2215', '#ff7701', '#f6f927',
    '#2ff429', '#68f3e4', '#1802fd', '#422a8b',
    '#dd54a1', '#386e97'
  ];

  // Grid state: null = empty, string = filled color
  const grid = new Array(COLS * ROWS).fill(null);

  // Active frontier — cells that can grow
  let frontier = [];

  // Seed the left edge with random starting points
  const seedCount = Math.floor(ROWS * 0.5);
  for (let i = 0; i < seedCount; i++) {
    const row = Math.floor(Math.random() * ROWS);
    const idx = row * COLS + 0;
    if (!grid[idx]) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      grid[idx] = color;
      frontier.push({ col: 0, row: row });
    }
  }

  const SPREAD_PER_FRAME = Math.max(10, Math.floor(COLS * ROWS * 0.004));

  function spreadStep() {
    if (frontier.length === 0) return;

    const newFrontier = [];
    const batch = Math.min(SPREAD_PER_FRAME, frontier.length);

    for (let b = 0; b < batch; b++) {
      const fi = Math.floor(Math.random() * frontier.length);
      const cell = frontier[fi];

      const neighbors = [
        { col: cell.col + 1, row: cell.row },
        { col: cell.col + 1, row: cell.row },     // right double weight
        { col: cell.col, row: cell.row - 1 },
        { col: cell.col, row: cell.row + 1 },
        { col: cell.col + 1, row: cell.row - 1 },
        { col: cell.col + 1, row: cell.row + 1 },
      ];

      let spread = false;

      for (const n of neighbors) {
        if (n.col < 0 || n.col >= COLS || n.row < 0 || n.row >= ROWS) continue;
        const ni = n.row * COLS + n.col;
        if (grid[ni]) continue;

        const isRight = n.col > cell.col;
        const chance = isRight ? 0.65 : 0.3;
        if (Math.random() > chance) continue;

        // FULLY RANDOM color — no gradient, no inheritance
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        grid[ni] = color;
        newFrontier.push({ col: n.col, row: n.row });
        spread = true;
      }

      if (!spread) {
        frontier.splice(fi, 1);
      }
    }

    frontier = frontier.concat(newFrontier);

    if (frontier.length > COLS * ROWS * 0.5) {
      frontier = frontier.slice(-Math.floor(COLS * ROWS * 0.3));
    }
  }

  function draw() {
    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < grid.length; i++) {
      if (!grid[i]) continue;
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      ctx.fillStyle = grid[i];
      ctx.fillRect(col * GRID, row * GRID, GRID, GRID);
    }
  }

  function loop() {
    spreadStep();
    spreadStep();
    draw();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
