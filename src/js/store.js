/* ============================================================
   The Grind — store.js
   The plan database: seeded once, then edited in the browser.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};

  var D = window.CUDATA;
  var LS_DB = "the-grind-db-v1";
  var LS_STATE = "the-grind-v1";
  var DB_VERSION = 10;

  /* ---------- seed ---------- */
  function seedDB() {
    var weeks = D.WEEKS.map(function (w) {
      var days = D.DAYS.filter(function (d) { return d.week === w.n; }).map(function (d) {
        return {
          n: d.n, week: d.week, date: d.date, idx: d.idx,
          title: d.title, time: d.time, revision: !!d.revision, light: !!d.light,
          items: d.items.map(function (it) { return remapItem(JSON.parse(JSON.stringify(it))); })
            .filter(Boolean)
        };
      });
      return {
        n: w.n, mode: w.mode, theme: w.theme, goal: w.goal || "", note: w.note || "",
        pattern: w.pattern || "", pre: w.pre || null, cs: w.cs || "",
        days: days
      };
    });

    /* day-wise DSA schedule: the video/article always comes before the questions */
    weeks.forEach(function (w) {
      if (w.mode === "sprint") return;
      w.days.forEach(function (d) {
        var learn = (window.CUDATA.LEARN && window.CUDATA.LEARN[w.n]) ? window.CUDATA.LEARN[w.n][d.idx] : null;
        if (learn) {
          d.items.unshift({
            id: "l" + d.date + "-" + w.n, type: "watch", track: "dsa",
            title: learn.t, url: "https://www.youtube.com/watch?v=" + learn.v,
            vtitle: learn.t.replace(/^Learn first — /, ""), vauthor: learn.a, hint: learn.h
          });
        } else {
          var learnIdx = d.items.findIndex(function (i) { return i.type === "watch" || i.type === "theory"; });
          if (learnIdx > 0) {
            var l = d.items.splice(learnIdx, 1)[0];
            d.items.unshift(l);
          }
        }
      });
    });

    return {
      v: DB_VERSION,
      by: "Anjul Sati",
      seededOn: new Date().toISOString().slice(0, 10),
      weeks: weeks,
    };
  }

  /* The rules, straight from Anjul:
     - DEV is reserved: no AI/project content is seeded. The box stays empty with a ＋.
     - CS Fundamentals content is not seeded into days — he writes that himself at the top.
     - Everything else (problems, DSA concepts, career) lives in the DSA box. */
  function remapItem(it) {
    if (it.type === "dev" || it.type === "project" || it.type === "ai" || it.type === "career") return null;
    if (it.track === "cs") return null;
    it.track = "dsa";
    return it;
  }

  /* the plan is DSA-only now — no pillar cards */

  /* ---------- load / save ---------- */
  var db = loadDB();
  function loadDB() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_DB));
      if (raw && raw.v === DB_VERSION && raw.weeks && raw.weeks.length) return raw;
    } catch (e) { /* ignore */ }
    var seeded = seedDB();
    try { localStorage.setItem(LS_DB, JSON.stringify(seeded)); } catch (e) { /* ignore */ }
    return seeded;
  }
  function saveDB() {
    try { localStorage.setItem(LS_DB, JSON.stringify(db)); } catch (e) { /* ignore */ }
  }
  function restoreDB() {
    db = seedDB();
    saveDB();
    return db;
  }
  function exportDB() {
    var blob = new Blob([JSON.stringify(db, null, 1)], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "the-grind-plan-" + today() + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
  }
  function importDB(text) {
    var parsed = JSON.parse(text);
    if (!parsed.weeks || !parsed.weeks.length) throw new Error("no weeks");
    db = parsed; saveDB();
    return db;
  }

  /* ---------- progress + review ---------- */
  var state = loadState();
  function loadState() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_STATE));
      if (raw && typeof raw === "object") {
        raw.done = raw.done || {};
        return raw;
      }
    } catch (e) { /* ignore */ }
    return { done: {} };
  }
  function saveState() {
    try { localStorage.setItem(LS_STATE, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function resetState() {
    state = { done: {} };
    saveState();
  }

  /* ---------- helpers ---------- */
  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function allDays() {
    var a = [];
    db.weeks.forEach(function (w) { w.days.forEach(function (d) { a.push(d); }); });
    return a;
  }
  function weekByN(n) {
    return db.weeks.filter(function (w) { return w.n === n; })[0];
  }
  function findItem(id) {
    var out = null;
    db.weeks.forEach(function (w) {
      w.days.forEach(function (d) {
        d.items.forEach(function (it) { if (it.id === id) out = { item: it, day: d, week: w }; });
      });
    });
    return out;
  }
  function dayByDate(date) {
    return allDays().filter(function (d) { return d.date === date; })[0];
  }
  function uid() { return "x" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function problemCount() {
    var n = 0, seen = {};
    allDays().forEach(function (d) {
      d.items.forEach(function (it) { if (it.type === "dsa" && !seen[it.title]) { seen[it.title] = 1; n++; } });
    });
    return n;
  }
  function dedupe(list) {
    var seen = {}, out = [];
    list.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  TG.store = {
    LS_DB: LS_DB, LS_STATE: LS_STATE,
    get db() { return db; },
    get state() { return state; },
    seedDB: seedDB, loadDB: loadDB, saveDB: saveDB, restoreDB: restoreDB,
    exportDB: exportDB, importDB: importDB,
    state: state, saveState: saveState, resetState: resetState,
    today: today, allDays: allDays, weekByN: weekByN,
    findItem: findItem, dayByDate: dayByDate, uid: uid,
    problemCount: problemCount, dedupe: dedupe
  };
})();
