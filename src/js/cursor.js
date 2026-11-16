/* ============================================================
   The Grind — cursor.js
   Soft glow orb that follows the cursor + sparkle trail.
   ============================================================ */
(function () {
  "use strict";

  var glow = document.createElement("div");
  glow.id = "cursorGlow";
  document.body.appendChild(glow);

  var canvas = document.createElement("canvas");
  canvas.id = "sparkleCanvas";
  document.body.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  var mx = -100, my = -100, gx = -100, gy = -100;
  var sparks = [];
  var lastSpawn = 0;
  var sparkCount = 0;
  var visible = false;

  function sizeCanvas() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  sizeCanvas();
  window.addEventListener("resize", sizeCanvas);

  /* glow orb — follows with lerp for smooth trailing */
  document.addEventListener("mousemove", function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) { visible = true; glow.style.opacity = "1"; }
  });
  document.addEventListener("mouseleave", function () {
    visible = false; glow.style.opacity = "0";
  });

  /* sparkle particles */
  function spawnSparkle(x, y) {
    var n = 1 + Math.floor(Math.random() * 2);
    for (var i = 0; i < n; i++) {
      sparks.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6 - 0.2,
        life: 1,
        decay: 0.02 + Math.random() * 0.015,
        size: 1 + Math.random() * 1.5,
        hue: Math.random() > 0.6 ? "77,184,255" : "0,229,160"
      });
    }
  }

  document.addEventListener("mousemove", function (e) {
    var now = performance.now();
    if (now - lastSpawn > 80) {
      lastSpawn = now;
      spawnSparkle(e.clientX, e.clientY);
    }
  });

  /* render loop */
  var raf = null;
  function tick() {
    /* glow orb lerp */
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    glow.style.left = gx + "px";
    glow.style.top = gy + "px";

    /* sparkles */
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var keep = [];
    for (var i = 0; i < sparks.length; i++) {
      var s = sparks[i];
      s.life -= s.decay;
      if (s.life <= 0) continue;
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.005;
      var alpha = s.life * 0.9;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + s.hue + "," + alpha * 0.4 + ")";
      ctx.fill();
      keep.push(s);
    }
    sparks = keep;

    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  /* hide on touch devices (no cursor) */
  if ("ontouchstart" in window && window.innerWidth < 900) {
    glow.style.display = "none";
    canvas.style.display = "none";
  }
})();
