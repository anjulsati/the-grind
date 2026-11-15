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
  var DB_VERSION = 5;

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
        var learnIdx = d.items.findIndex(function (i) { return i.type === "watch" || i.type === "theory"; });
        if (learnIdx > 0) {
          var l = d.items.splice(learnIdx, 1)[0];
          d.items.unshift(l);
        } else if (learnIdx === -1 && !d.revision && d.idx > 0 && d.idx < 6 && w.pre) {
          d.items.unshift({
            id: "l" + d.date + "-" + w.n,
            type: "watch", track: "dsa",
            title: "Learn first — " + w.pattern,
            url: w.pre.url, vtitle: w.pre.vtitle, vauthor: w.pre.vauthor,
            hint: "Same week video — watch the part you need, then the questions below."
          });
        }
      });
    });

    return {
      v: DB_VERSION,
      by: "Anjul Sati",
      seededOn: new Date().toISOString().slice(0, 10),
      weeks: weeks,
      pillars: seedPillars()
    };
  }

  /* The rules, straight from Anjul:
     - DEV is reserved: no AI/project content is seeded. The box stays empty with a ＋.
     - CS Fundamentals content is not seeded into days — he writes that himself at the top.
     - Everything else (problems, DSA concepts, career) lives in the DSA box. */
  function remapItem(it) {
    if (it.type === "dev" || it.type === "project" || it.type === "ai") return null;
    if (it.track === "cs") return null;
    it.track = "dsa";
    return it;
  }

  function seedPillars() {
    return [
      { n: "01", name: "DSA", tag: "", items: [
        "Topics & techniques: arrays · hashing · two pointers · sliding window · strings · sorting · binary search · binary search on answer · recursion · backtracking · linked lists · stacks & queues · trees · BST · heaps · greedy · graphs · DP · tries · bits",
        "Striver A2Z to learn · NeetCode 150 to revise",
        "Aditya Verma for DP, recursion, stacks",
        "Timed set every week from W10",
        "Bar: easy under 15 min, medium under 30",
        "Material: LeetCode · Top Interview 150 · CTCI ch 1-6, 17",
        "Day-wise schedule: every day = the video/article first, then that day's questions — built into the boxes below"
      ]},
      { n: "02", name: "CS Fundamentals", tag: "", items: [] },
      { n: "03", name: "DEV", tag: "", items: [] }
    ];
  }

  /* ---------- load / save ---------- */
  var db = loadDB();
  function loadDB() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_DB));
      if (raw && raw.v === DB_VERSION && raw.weeks && raw.weeks.length) {
        if (!raw.pillars) raw.pillars = seedPillars();
        return raw;
      }
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
        raw.review = raw.review || { v: {}, a: {}, w: {}, name: "" };
        return raw;
      }
    } catch (e) { /* ignore */ }
    return { done: {}, review: { v: {}, a: {}, w: {}, name: "" } };
  }
  function saveState() {
    try { localStorage.setItem(LS_STATE, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }
  function resetState() {
    state = { done: {}, review: { v: {}, a: {}, w: {}, name: "" } };
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
