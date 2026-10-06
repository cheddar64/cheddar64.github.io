/* ==================================================================
   laith.world: motion for every page.

   Order of this file
     1. The navigation bar takes the colour of the section under it
     2. Home page only: the name, the rain, the portrait, the paragraph
     3. Every page: smooth scrolling, then things arriving as they scroll in

   If the visitor asks for reduced motion, or the animation library did
   not load, the pages are complete and nothing moves.
   ================================================================== */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  var hero = document.getElementById('hero');           // present on the home page only

  // One clock for everything that moves.
  var STEP = 60 / 128.57;

  // ---- 1. The navigation bar takes the colour of the section under it ----
  var zones = Array.prototype.slice.call(document.querySelectorAll('[data-navrgb]'));
  var navQueued = false;
  function tone() {
    navQueued = false;
    if (!zones.length) return;
    var hit = zones[0];
    zones.forEach(function (z) { var r = z.getBoundingClientRect(); if (r.top <= 44 && r.bottom > 44) hit = z; });
    if (root.dataset.nav !== hit.dataset.nav) root.dataset.nav = hit.dataset.nav;
    root.style.setProperty('--nav-rgb', hit.dataset.navrgb);
  }
  window.addEventListener('scroll', function () { if (!navQueued) { navQueued = true; requestAnimationFrame(tone); } }, { passive: true });
  window.addEventListener('resize', tone);
  tone();

  // ---- 2. Home page only ----
  var homeMotion = null;
  if (hero) {
    var rainMode = 'drops';
    // ---- The name spans the column (sized from the real letter widths, capped by the height of the screen) ----
    var nameEl = hero.querySelector('.h-name');
    function fitName() {
      if (window.innerWidth <= 900) { nameEl.style.fontSize = ''; return; }
      var cs = getComputedStyle(nameEl.parentNode.parentNode);
      var box = nameEl.parentNode.parentNode.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      nameEl.style.fontSize = '100px'; nameEl.style.display = 'inline-block'; nameEl.style.whiteSpace = 'nowrap';
      var w = nameEl.getBoundingClientRect().width;
      nameEl.style.display = ''; nameEl.style.whiteSpace = '';
      nameEl.style.fontSize = Math.min(100 * box * 0.995 / w, window.innerHeight * 0.31) + 'px';
    }
    fitName();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitName);
    window.addEventListener('resize', fitName);

    /* ------------------------------------------------------------------
       Rain, on the first screen only.
       The screen is divided into large squares. A drop lands on one square:
       it shows, then the squares around it show more faintly, ring by ring,
       and everything fades over about a second and a half.
       ------------------------------------------------------------------ */
    var canvas = document.getElementById('rain'), ctx = canvas.getContext('2d');
    var W = 0, H = 0, cell = 34, cols = 0, rowsN = 0, dpr = 1;
    var drops = [], running = false, raf = 0, lastT = 0;
    var seed = 5102026;
    function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    function sizeRain() {
      var b = canvas.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = b.width; H = b.height;
      cell = W < 700 ? 22 : W < 1200 ? 30 : 36;
      cols = Math.ceil(W / cell); rowsN = Math.ceil(H / cell);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }
    function land(cx, cy, strength) {
      if (rainMode === 'fall') drops.push({ col: cx, y: cy, v: 2.2 + rnd() * 2.6, len: 3 + Math.floor(rnd() * 3), a: strength });
      else drops.push({ cx: cx, cy: cy, t: performance.now(), a: strength });
    }
    var RING = [1, 0.44, 0.2, 0.09], LIFE = 1.75, GAP = 0.19;
    function square(x, y, alpha) {
      if (alpha <= 0.004) return;
      ctx.fillStyle = 'rgba(33,72,216,' + alpha.toFixed(3) + ')';
      ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
    }
    function drawRain(now) {
      var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var keep = [];
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        if (rainMode === 'fall') {
          d.y += d.v * dt;
          var head = Math.floor(d.y);
          for (var k = 0; k < d.len; k++) square(d.col, head - k, d.a * (1 - k / d.len) * (k === 0 ? 1 : 0.6));
          if (head - d.len < rowsN) keep.push(d);
        } else {
          var age = (now - d.t) / 1000, alive = false;
          for (var r = 0; r < RING.length; r++) {
            var la = age - r * GAP;
            if (la < 0) { alive = true; continue; }
            var f = 1 - la / LIFE;
            if (f <= 0) continue;
            alive = true;
            var al = d.a * RING[r] * f * f * Math.min(1, la / 0.12);
            if (r === 0) { square(d.cx, d.cy, al); continue; }
            for (var dx = -r; dx <= r; dx++) for (var dy = -r; dy <= r; dy++) {
              if (Math.round(Math.sqrt(dx * dx + dy * dy)) === r) square(d.cx + dx, d.cy + dy, al);
            }
          }
          if (alive) keep.push(d);
        }
      }
      drops = keep;
    }
    function loopRain(now) { if (!running) return; drawRain(now); raf = requestAnimationFrame(loopRain); }
    function playRain() { if (running || reduce) return; running = true; lastT = performance.now(); raf = requestAnimationFrame(loopRain); }
    function pauseRain() { running = false; cancelAnimationFrame(raf); }
    function drop(strong) {
      if (!running) return;
      if (rainMode === 'fall') land(Math.floor(rnd() * cols), -1, 0.16 + rnd() * 0.2);
      else land(1 + Math.floor(rnd() * (cols - 2)), 1 + Math.floor(rnd() * (rowsN - 2)), (strong ? 0.5 : 0.36) * (0.75 + rnd() * 0.25));
    }
    sizeRain();
    window.addEventListener('resize', sizeRain);
    // The pointer lets a drop fall where it is, at most a few times a second.
    var lastPointer = 0;
    hero.addEventListener('pointermove', function (e) {
      if (!running || e.pointerType === 'touch' || rainMode === 'fall') return;
      var now = performance.now(); if (now - lastPointer < 260) return; lastPointer = now;
      var b = canvas.getBoundingClientRect();
      land(Math.floor((e.clientX - b.left) / cell), Math.floor((e.clientY - b.top) / cell), 0.26);
    });

    /* ------------------------------------------------------------------
       The portrait in About me.
       It is drawn as a small number of large squares and redrawn with more,
       smaller squares as the page scrolls, until it is the photograph.
       ------------------------------------------------------------------ */
    var face = document.getElementById('face'), fctx = face.getContext('2d');
    var faceImg = new Image(), faceReady = false, faceP = 0, faceLevel = -2;
    var ACROSS = [4, 5, 6, 8, 10, 13, 16, 20, 25, 32, 40, 50, 64, 80, 104, 136, 0];   // squares across the picture; 0 means the photograph itself
    var small = document.createElement('canvas'), sctx = small.getContext('2d');
    function drawFace(force) {
      if (!faceReady) return;
      var idx = Math.min(ACROSS.length - 1, Math.floor(Math.pow(faceP, 1.7) * ACROSS.length));   // the coarse stages last longest
      var b = face.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      var w = Math.round(b.width * dpr), h = Math.round(b.height * dpr);
      if (!w || !h) return;
      if (face.width !== w || face.height !== h) { face.width = w; face.height = h; force = true; }
      if (!force && idx === faceLevel) return;
      faceLevel = idx;
      var n = ACROSS[idx];
      if (!n) { fctx.imageSmoothingEnabled = true; fctx.imageSmoothingQuality = 'high'; fctx.drawImage(faceImg, 0, 0, w, h); return; }
      var nh = Math.round(n * h / w);
      small.width = n; small.height = nh;
      sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = 'high';
      sctx.drawImage(faceImg, 0, 0, n, nh);
      fctx.imageSmoothingEnabled = false;
      fctx.clearRect(0, 0, w, h);
      fctx.drawImage(small, 0, 0, n, nh, 0, 0, w, h);
    }
    function setFace(p) { faceP = p < 0 ? 0 : p > 1 ? 1 : p; drawFace(false); }
    faceImg.onload = function () { faceReady = true; drawFace(true); };
    faceImg.src = face.getAttribute('data-src');
    window.addEventListener('resize', function () { drawFace(true); });
    if (reduce || !hasGsap) faceP = 1;        // nothing moves: show the photograph

    // ---- The paragraph, split into words ----
    var sayText = document.getElementById('sayText'), words = [];
    (function split(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); words.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { split(n); }
      });
    })(sayText);
    homeMotion = function () {
      // ---- Arrival ----
      gsap.from('.h-in', { y: 24, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: STEP / 4, delay: 0.1 });

      // ---- The clock: a drop on every second step, and now and then one between ----
      var clock = gsap.timeline({ repeat: -1, delay: 0.9 });
      for (var n = 0; n < 16; n++) {
        (function (n) {
          clock.call(function () { if (n % 2 === 0) { drop(n % 4 === 0); } else if (rnd() < 0.22) { drop(false); } }, null, n * STEP);
        })(n);
      }
      clock.to({}, { duration: STEP }, 15 * STEP);
      playRain();
      ScrollTrigger.create({ trigger: '#hero', start: 'top bottom', end: 'bottom top', onToggle: function (s) { if (s.isActive) { clock.play(); playRain(); } else { clock.pause(); pauseRain(); } } });

      // ---- About me: the words fill in, then the paragraph holds while My Projects slides over it ----
      // On wide screens the section is held in place while this happens; on narrow ones it scrolls by normally.
      var wide = window.innerWidth > 900;
      var reveal = wide
        ? { trigger: '.h-sayrun', start: 'top 62%', end: function () { return '+=' + window.innerHeight * 1.2; }, scrub: 0.4 }
        : { trigger: '#sayText', start: 'top 82%', end: 'bottom 55%', scrub: 0.4 };
      reveal.onUpdate = function (self) { setFace(self.progress * 1.06); };     // the portrait is sharp just before the last words
      gsap.set(words, { opacity: 0.16 });
      gsap.to(words, { opacity: 1, ease: 'none', stagger: 0.5, scrollTrigger: reveal });
      if (wide) {
        gsap.from('#sayCta', { autoAlpha: 0, y: 18, ease: 'none', scrollTrigger: { trigger: '.h-sayrun', start: function () { return 'top+=' + window.innerHeight * 0.5 + ' top'; }, end: function () { return '+=' + window.innerHeight * 0.2; }, scrub: true } });
        gsap.to('#sayIn', { scale: 0.94, opacity: 0.35, transformOrigin: '50% 40%', ease: 'none', scrollTrigger: { trigger: '#projects', start: 'top bottom', end: 'top top', scrub: true } });
      }
    };
  }

  if (reduce || !hasGsap) return;          // a plain page: nothing moves

  // ---- 3. Every page ----
  root.classList.add('fx');
  gsap.registerPlugin(ScrollTrigger);

  if (typeof Lenis !== 'undefined') {
    var lenis = new Lenis({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) { var t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: 0 }); } });
    });
  }

  if (homeMotion) homeMotion();

  // The top of a page arrives in order
  if (document.querySelector('.p-in')) gsap.from('.p-in', { y: 24, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: STEP / 4, delay: 0.1 });

  // Section headings and their contents rise in as they are reached
  gsap.utils.toArray('.h-head, .p-sec > .h-grid, .p-block').forEach(function (g) {
    gsap.from(g.children, { y: 26, autoAlpha: 0, duration: 0.75, ease: 'power3.out', stagger: STEP / 3, scrollTrigger: { trigger: g, start: 'top 84%' } });
  });

  // Project rows: each title slides in and settles as its row crosses the screen
  gsap.utils.toArray('.h-row').forEach(function (row) {
    gsap.fromTo(row.querySelector('.h-row__title'), { xPercent: -7, opacity: 0.2 }, { xPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 96%', end: 'top 56%', scrub: 0.5 } });
    gsap.from([row.querySelector('.h-row__when'), row.querySelector('.h-row__side')], { y: 22, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: STEP / 4, scrollTrigger: { trigger: row, start: 'top 78%' } });
  });

  // Timelines: the line draws as you read down it; each entry arrives as the line reaches it
  gsap.utils.toArray('.h-tl__body').forEach(function (body) {
    var line = body.querySelector('.h-tl__line');
    if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: body, start: 'top 68%', end: 'bottom 62%', scrub: 0.3 } });
    body.querySelectorAll('li').forEach(function (li) {
      gsap.from(li, { x: 26, autoAlpha: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 72%' } });
    });
  });
  gsap.utils.toArray('.h-tl__head').forEach(function (head) {
    gsap.from(head.children, { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: STEP / 3, scrollTrigger: { trigger: head, start: 'top 78%' } });
  });

  // Skills: the rules draw across, the items follow
  gsap.utils.toArray('.h-kit').forEach(function (kit) {
    gsap.utils.toArray(kit.children).forEach(function (col, i) {
      var items = col.querySelectorAll('li');
      var tl = gsap.timeline({ scrollTrigger: { trigger: kit, start: 'top 80%' }, delay: i * STEP / 4 });
      tl.from(col.querySelector('h3'), { autoAlpha: 0, y: 12, duration: 0.5, ease: 'power3.out' })
        .fromTo(items, { '--rule': 0 }, { '--rule': 1, duration: 0.7, ease: 'power3.out', stagger: STEP / 8 }, 0.1)
        .from(items, { autoAlpha: 0, duration: 0.5, ease: 'power2.out', stagger: STEP / 8 }, 0.2);
    });
  });

  // Charts: the bars grow from the baseline
  gsap.utils.toArray('.p-plot').forEach(function (plot) {
    gsap.from(plot.querySelectorAll('.p-bar'), { scaleY: 0, duration: 0.9, ease: 'power3.out', stagger: STEP / 6, scrollTrigger: { trigger: plot, start: 'top 78%' } });
    gsap.from(plot.querySelectorAll('.p-bar b'), { autoAlpha: 0, duration: 0.4, delay: 0.7, stagger: STEP / 6, scrollTrigger: { trigger: plot, start: 'top 78%' } });
  });

  // Contact
  gsap.utils.toArray('.h-contact').forEach(function (c) {
    gsap.from(c.querySelectorAll('.h-rail, .h-contact__line, .h-btns'), { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: STEP / 3, scrollTrigger: { trigger: c, start: 'top 80%' } });
  });
})();
