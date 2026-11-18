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
  function normalizeDB(x) {
    if (!x) return x;
    if (!x.verified || typeof x.verified !== "object") x.verified = {};
    return x;
  }
  function loadDB() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_DB));
      if (raw && raw.v === DB_VERSION && raw.weeks && raw.weeks.length) return normalizeDB(raw);
    } catch (e) { /* ignore */ }
    var seeded = seedDB();
    try { localStorage.setItem(LS_DB, JSON.stringify(seeded)); } catch (e) { /* ignore */ }
    return seeded;
  }
  function saveDB() {
    try { localStorage.setItem(LS_DB, JSON.stringify(db)); } catch (e) { /* ignore */ }
    if (window.TG && TG.sync) TG.sync.changed();
  }
  function restoreDB() {
    db = normalizeDB(seedDB());
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
    db = normalizeDB(parsed); saveDB();
    return db;
  }

  /* ---------- progress + review ---------- */
  var state = loadState();
  function loadState() {
    try {
      var raw = JSON.parse(localStorage.getItem(LS_STATE));
      if (raw && typeof raw === "object") {
        raw.done = raw.done || {};
        if (!raw.doneAt || typeof raw.doneAt !== "object") raw.doneAt = {};
        return raw;
      }
    } catch (e) { /* ignore */ }
    return { done: {}, doneAt: {} };
  }
  function saveState() {
    try { localStorage.setItem(LS_STATE, JSON.stringify(state)); } catch (e) { /* ignore */ }
    if (window.TG && TG.sync) TG.sync.changed();
  }
  function setAll(plan, progress) {
    db = normalizeDB(plan);
    state = progress;
    state.done = state.done || {};
    if (!state.doneAt || typeof state.doneAt !== "object") state.doneAt = {};
    saveDB();
    saveState();
  }
  function resetState() {
    state = { done: {}, doneAt: {} };
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
  /* ---------- link classification ----------
     A task counts as a DSA question only when its link points at a real
     coding problem. Three layers, checked in order:
       1. a verified entry (manual override or metadata check), else
       2. a URL pattern for the known judges, else
       3. not a DSA question (unknown hosts can be verified async by verify.js). */
  var PATTERNS = [
    { host: "leetcode", need: ["problems"] },
    { host: "codeforces", need: ["problem"] },
    { host: "codechef", need: ["problems", "practice", "status"] },
    { host: "atcoder", need: ["tasks", "problems"] },
    { host: "hackerrank", need: ["challenge", "problems"] },
    { host: "hackerearth", need: ["problems", "practice"] },
    { host: "spoj", need: ["problems"] },
    { host: "cses.fi", need: ["task"] },
    { host: "interviewbit", need: ["problems"] },
    { host: "codewars", need: ["kata"] },
    { host: "workat.tech", need: ["problem"] },
    { host: "topcoder", need: ["problem"] },
    { host: "geeksforgeeks", need: ["problems"] },
    { host: "codingninjas", need: ["problems"] },
    { host: "code360", need: ["problems"] },
    { host: "binarysearch.com", need: null },
    { host: "tlx.toki.id", need: null },
    { host: "beecrowd", need: null },
    { host: "lightoj", need: null },
    { host: "dmoj", need: null },
    { host: "oj.uz", need: null },
    { host: "kattis", need: null },
    { host: "projecteuler", need: null },
    { host: "urionlinejudge", need: null },
    { host: "eolymp", need: ["problems", "problem"] },
    { host: "e-olymp", need: ["problems", "problem"] },
    { host: "timus", need: ["problem"] },
    { host: "acmp.ru", need: null }
  ];
  function patternDSA(url) {
    var u = String(url || "").toLowerCase().trim();
    if (!u) return false;
    if (u.indexOf("http") !== 0 && u.indexOf(".") === -1) return false;
    for (var i = 0; i < PATTERNS.length; i++) {
      var p = PATTERNS[i];
      if (u.indexOf(p.host) === -1) continue;
      if (p.need === null) return true;
      for (var j = 0; j < p.need.length; j++) {
        if (u.indexOf(p.need[j]) !== -1) return true;
      }
      return false; /* the host is a judge, but this page isn't a problem */
    }
    return false;
  }
  /* canonical key for a link, so duplicates across days collapse to one */
  function urlKey(u) {
    u = String(u || "").trim().toLowerCase();
    if (!u) return "";
    u = u.replace(/^https?:\/\//, "").replace(/^www\./, "");
    u = u.split("?")[0].split("#")[0];
    return u.replace(/\/+$/, "");
  }
  function verifiedEntry(k) {
    return (db.verified && db.verified[k]) || null;
  }
  /* these hosts are documentation / video / discussion sites — their pages
     are never coding problems, so metadata inspection is skipped entirely */
  var OTHER_HOSTS = [
    "youtube", "youtu.be", "vimeo", "wikipedia", "medium.com", "docs.google",
    "drive.google", "github", "stackoverflow", "reddit", "quora",
    "developer.mozilla.org", "developer.mozilla", "w3schools", "javatpoint",
    "tutorialspoint", "baeldung", "mozilla", "telegram", "twitter", "x.com",
    "instagram", "linkedin", "notion.site", "geeksforgeeks", "codingninjas", "code360"
  ];
  function knownOther(url) {
    var u = String(url || "").toLowerCase();
    for (var i = 0; i < OTHER_HOSTS.length; i++) {
      if (u.indexOf(OTHER_HOSTS[i]) !== -1) return true;
    }
    return false;
  }
  /* synchronous classification: verified entry wins, then the pattern.
     src is "manual" / "meta" / "pattern" / "other" / "unknown" (unverified). */
  function classifyInfo(url) {
    var k = urlKey(url);
    if (!k) return { dsa: false, src: "unknown" };
    var v = verifiedEntry(k);
    if (v) return { dsa: !!v.dsa, src: v.src || "manual" };
    if (patternDSA(url)) return { dsa: true, src: "pattern" };
    if (knownOther(url)) return { dsa: false, src: "other" };
    return { dsa: false, src: "unknown" };
  }
  function isDSA(url) {
    return classifyInfo(url).dsa;
  }
  /* manual override — the user decides, the app never re-asks */
  function setVerified(url, dsa, src, title) {
    var k = urlKey(url);
    if (!k) return;
    if (!db.verified) db.verified = {};
    var v = db.verified[k] || {};
    v.dsa = !!dsa;
    v.src = src || v.src || "manual";
    if (title != null && String(title).trim()) v.title = String(title).trim();
    v.at = Date.now();
    db.verified[k] = v;
    saveDB();
  }
  function toggleDSA(url) {
    var cur = isDSA(url);
    setVerified(url, !cur, "manual");
    return !cur;
  }
  function setTitle(url, title) {
    var k = urlKey(url);
    if (!k) return;
    if (!db.verified) db.verified = {};
    var v = db.verified[k] || { dsa: isDSA(url), src: "manual" };
    if (v.src === "pattern") v.src = "manual";
    v.title = String(title || "").trim();
    v.at = Date.now();
    db.verified[k] = v;
    saveDB();
  }
  function isGenericTitle(t) {
    return !t || !String(t).trim() || /^new task$/i.test(String(t).trim());
  }
  function slugTitle(url) {
    var u = String(url || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");
    var seg = u.split("/").pop() || "";
    seg = decodeURIComponent(seg.split("?")[0]);
    if (!seg) return "";
    if (!/^[a-z0-9 _-]+$/i.test(seg)) return "";
    return seg.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim()
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /* ---------- unique DSA question index ----------
     One record per unique problem link, no matter how many days hold it. */
  function problemIndex() {
    var map = {}, out = [];
    allDays().forEach(function (day) {
      day.items.forEach(function (it) {
        if (!it.url || !isDSA(it.url)) return;
        var k = urlKey(it.url);
        var e = map[k];
        if (!e) {
          e = map[k] = { key: k, url: it.url, title: null, done: false, firstAt: null, revs: [], items: [] };
          out.push(e);
        }
        e.items.push(it.id);
        if (e.title === null && !isGenericTitle(it.title)) e.title = it.title;
        if (state.done[it.id]) {
          e.done = true;
          var at = state.doneAt[it.id];
          if (at && (!e.firstAt || at < e.firstAt)) e.firstAt = at;
        }
        (it.revisions || []).forEach(function (r) { e.revs.push(r); });
      });
    });
    out.forEach(function (e) {
      var uniq = dedupe(e.revs);
      e.revs = uniq.map(parseStamp).filter(Boolean).sort(function (a, b) { return a.t - b.t; });
      e.lastRev = e.revs.length ? e.revs[e.revs.length - 1] : null;
      if (e.title === null) e.title = verifiedTitle(e.key) || slugTitle(e.url) || "";
    });
    return out;
  }
  function verifiedTitle(k) {
    var v = verifiedEntry(k);
    return v && v.title ? v.title : "";
  }
  /* stamps look like "17 Nov 2026 · 10:30 am" (new) or "17 Nov · 10:30 am" (old) */
  function parseStamp(s) {
    var raw = String(s || "").trim();
    if (!raw) return null;
    var txt = raw.replace(/·/g, " ");
    var t = Date.parse(txt);
    if (isNaN(t)) {
      t = Date.parse(txt.replace(/(\d{1,2}\s+\w{3})(\s|$)/i, "$1 " + new Date().getFullYear() + "$2"));
      var d = isNaN(t) ? null : new Date(t);
      if (d && d.getTime() > Date.now() + 36e5 * 36) d = new Date(d.getFullYear() - 1, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
      t = d ? d.getTime() : null;
    }
    return t == null ? null : { t: t, label: raw };
  }
  /* the top counter: unique completed vs unique total DSA questions */
  function dsaStats() {
    var probs = problemIndex();
    var done = probs.filter(function (p) { return p.done; }).length;
    var total = probs.length;
    return { done: done, total: total, pct: total ? (done / total) * 100 : 0 };
  }

  function dedupe(list) {
    var seen = {}, out = [];
    list.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  TG.store = {
    LS_DB: LS_DB, LS_STATE: LS_STATE, setAll: setAll,
    get db() { return db; },
    get state() { return state; },
    seedDB: seedDB, loadDB: loadDB, saveDB: saveDB, restoreDB: restoreDB,
    exportDB: exportDB, importDB: importDB,
    state: state, saveState: saveState, resetState: resetState,
    today: today, allDays: allDays, weekByN: weekByN,
    findItem: findItem, dayByDate: dayByDate, uid: uid,
    problemCount: problemCount, dedupe: dedupe,
    isProblemLink: isDSA, isDSA: isDSA, patternDSA: patternDSA,
    classifyInfo: classifyInfo, setVerified: setVerified, toggleDSA: toggleDSA,
    setTitle: setTitle, urlKey: urlKey, verifiedTitle: verifiedTitle,
    problemIndex: problemIndex, dsaStats: dsaStats, slugTitle: slugTitle, isGenericTitle: isGenericTitle,
  };
})();
