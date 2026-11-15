/* ============================================================
   The Grind — pen.js
   Draw over the page. Strokes fade on their own.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};

  var canvas = document.getElementById("penCanvas");
  var ctx = canvas.getContext("2d");
  var toggle = document.getElementById("penToggle");
  var on = false, drawing = null, raf = null, dpr = 1;
  var strokes = [], color = "#3ddc97", width = 4, fade = 30;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function drawStroke(s, alpha) {
    var pts = s.pts;
    ctx.globalAlpha = alpha; ctx.strokeStyle = s.color; ctx.fillStyle = s.color;
    ctx.lineWidth = s.w; ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (pts.length === 1) {
      ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, s.w / 2, 0, Math.PI * 2); ctx.fill();
      return;
    }
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length - 1; i++) {
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, (pts[i].x + pts[i + 1].x) / 2, (pts[i].y + pts[i + 1].y) / 2);
    }
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
  }
  function tick(now) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var keep = [];
    for (var i = 0; i < strokes.length; i++) {
      var s = strokes[i], age = (now - s.born) / 1000, a = 1;
      if (fade > 0) {
        if (age > fade) continue;
        var hold = fade * 0.4;
        a = age <= hold ? 1 : 1 - (age - hold) / (fade - hold);
      }
      drawStroke(s, Math.max(0, Math.min(1, a)));
      keep.push(s);
    }
    strokes = keep; ctx.globalAlpha = 1;
    if (on || strokes.length) raf = requestAnimationFrame(tick);
    else { raf = null; ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }
  function start() { size(); if (raf === null) raf = requestAnimationFrame(tick); }

  function setPen(v) {
    on = v;
    document.body.classList.toggle("pen-on", v);
    toggle.textContent = v ? "✕ Done" : "✎ Pen";
    if (v) start();
  }
  function clear() { strokes = []; }

  function pos(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  canvas.addEventListener("pointerdown", function (e) {
    if (!on) return;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    drawing = { pts: [pos(e)], color: color, w: width, born: performance.now() };
    strokes.push(drawing); e.preventDefault();
  });
  canvas.addEventListener("pointermove", function (e) { if (drawing) { drawing.pts.push(pos(e)); e.preventDefault(); } });
  canvas.addEventListener("pointerup", function () { drawing = null; });
  canvas.addEventListener("pointercancel", function () { drawing = null; });

  toggle.addEventListener("click", function () { setPen(!on); });
  document.getElementById("penExit").addEventListener("click", function () { setPen(false); });
  document.getElementById("penClear").addEventListener("click", clear);
  document.querySelectorAll(".sw").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".sw").forEach(function (x) { x.classList.remove("on"); });
      b.classList.add("on"); color = b.getAttribute("data-color");
    });
  });
  document.getElementById("penSize").addEventListener("change", function (e) { width = Number(e.target.value); });
  document.getElementById("penFade").addEventListener("change", function (e) { fade = Number(e.target.value); });
  window.addEventListener("resize", function () { if (on) size(); });

  TG.pen = { setPen: setPen, clear: clear, isOn: function () { return on; } };
})();
