/* ============================================================
   The Grind — verify.js
   Automatic link verification. For every task link we decide
   whether it is a real DSA coding question:

     1. verified entry (manual or metadata)  → settled, no work
     2. known judge URL pattern              → settled, confident
     3. unknown host                         → fetch the page (best
        effort, through a CORS text proxy) and score its title/body
        for problem-page markers. If the network says nothing,
        the link stays "unverified" and the user can classify it
        manually with one click (the chip in edit mode).

   Also fetches real page titles for question links whose task
   titles were never filled in ("New task").
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};
  var store = window.TG.store;

  var TIMEOUT = 9000;        /* per fetch */
  var GAP = 1200;            /* between fetches, keep proxies happy */
  var MAX_PER_SWEEP = 8;     /* network calls after each render */
  var RECHECK_MS = 10 * 60 * 1000; /* retry failed verifications later */

  var inflight = {};         /* key -> true */
  var failedAt = {};         /* key -> timestamp of last network failure */
  var lastFetch = 0;
  var queue = [];
  var draining = false;

  function withProto(u) {
    u = String(u || "").trim();
    if (!u) return "";
    return /^https?:\/\//i.test(u) ? u : "https://" + u;
  }

  /* ---------- fetch helpers (best effort, never blocking the UI) ---------- */
  function timedFetch(url) {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = null;
    if (ctrl) {
      timer = setTimeout(function () { try { ctrl.abort(); } catch (e) { /* ignore */ } }, TIMEOUT);
    }
    return fetch(url, ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) {
        if (timer) clearTimeout(timer);
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .catch(function (err) {
        if (timer) clearTimeout(timer);
        throw err;
      });
  }
  function wait(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

  /* r.jina.ai returns clean markdown with a "Title:" header */
  function fetchViaJina(url) {
    return timedFetch("https://r.jina.ai/" + url).then(function (t) {
      var m = /^Title:\s*(.+)$/im.exec(t || "");
      return { title: m ? m[1].trim() : "", text: t || "" };
    });
  }
  /* allorigins returns the raw HTML */
  function fetchViaProxy(url) {
    return timedFetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url)).then(function (h) {
      var m = /<title[^>]*>([^<]+)<\/title>/i.exec(h || "");
      return { title: m ? m[1].trim() : "", text: m ? m[1] : (h || "").slice(0, 4000) };
    });
  }
  function fetchPage(url) {
    var now = Date.now();
    var gap = Math.max(0, lastFetch + GAP - now);
    lastFetch = now + gap;
    return wait(gap).then(function () { return fetchViaJina(url); })
      .catch(function () { return fetchViaProxy(url); });
  }

  /* ---------- problem-page markers ---------- */
  var MARKERS = [
    "problem", "challenge", "kata", "constraints", "sample input", "example 1",
    "test case", "submit", "time limit", "difficulty", "accepted", "wrong answer",
    "input format", "output format", "expected output", "test cases",
    "## input", "## output", "memory limit", "time limit per test", "stdin", "stdout"
  ];
  function scoreText(t) {
    t = String(t || "").toLowerCase();
    var n = 0;
    for (var i = 0; i < MARKERS.length; i++) {
      if (t.indexOf(MARKERS[i]) !== -1) n++;
    }
    return n;
  }

  /* ---------- classification of one link ---------- */
  function decide(url, page) {
    var title = String(page.title || "").trim();
    var text = String(page.text || "");
    var low = text.toLowerCase();
    var hits = scoreText(text);
    /* the title alone carrying a problem word is a strong signal */
    if (/\b(problem|challenge|kata)\b/i.test(title)) return { dsa: true, title: title };
    /* a real problem statement has an input and an output section */
    if (/##\s*input/.test(low) && /##\s*output/.test(low)) return { dsa: true, title: title };
    /* the URL itself hinting at a problem plus any metadata corroboration */
    var urlHint = /(problem|task|challenge|question|kata|exercise)/i.test(url.toLowerCase());
    if (hits >= 3 || (hits >= 1 && urlHint)) return { dsa: true, title: title };
    return { dsa: false, title: title };
  }

  function verifyURL(rawUrl) {
    var k = store.urlKey(rawUrl);
    if (!k || inflight[k]) return Promise.resolve();
    if (store.verifiedTitle(k) || store.classifyInfo(rawUrl).src !== "unknown") return Promise.resolve();
    if (failedAt[k] && Date.now() - failedAt[k] < RECHECK_MS) return Promise.resolve();
    inflight[k] = true;
    var url = withProto(rawUrl);
    return fetchPage(url).then(function (page) {
      if (!page.title && !page.text) throw new Error("empty");
      var d = decide(url, page);
      store.setVerified(rawUrl, d.dsa, "meta", d.title || null);
      announce(k);
    }).catch(function () {
      failedAt[k] = Date.now(); /* stays unverified → manual chip */
    }).then(function () {
      delete inflight[k];
    });
  }

  /* ---------- real titles for question links titled "New task" ---------- */
  function needsTitle(p) {
    if (store.verifiedTitle(p.key)) return false;
    var fromItems = false;
    p.items.forEach(function (id) {
      var f = store.findItem(id);
      if (f && !store.isGenericTitle(f.item.title)) fromItems = true;
    });
    return !fromItems;
  }
  /* write the fetched name straight into the task, so the user never
     has to type a question name (only when the task is still untitled
     and its title field isn't being edited right now) */
  function autoNameTasks(k, title) {
    var changed = false;
    store.allDays().forEach(function (day) {
      day.items.forEach(function (it) {
        if (changed || store.urlKey(it.url) !== k || !store.isGenericTitle(it.title)) return;
        var ae = document.activeElement;
        if (ae && ae.getAttribute && ae.getAttribute("data-ef") === "task|" + it.id + "|title") return;
        it.title = title;
        changed = true;
      });
    });
    if (changed) store.saveDB();
    return changed;
  }

  function fetchTitle(rawUrl) {
    var k = store.urlKey(rawUrl);
    if (!k || inflight[k]) return Promise.resolve();
    if (store.verifiedTitle(k)) return Promise.resolve();
    if (failedAt[k] && Date.now() - failedAt[k] < RECHECK_MS) return Promise.resolve();
    inflight[k] = true;
    var url = withProto(rawUrl);
    return fetchPage(url).then(function (page) {
      var title = String(page.title || "").trim();
      if (title) {
        title = title.replace(/\s*[-|·–—]\s*(LeetCode|Codeforces|CodeChef|GeeksforGeeks|HackerRank|AtCoder|Coding Ninjas|InterviewBit|Eolymp|SPOJ|CSES|Timus)\s*$/i, "").trim();
        store.setVerified(rawUrl, store.classifyInfo(rawUrl).dsa, store.classifyInfo(rawUrl).src, title);
        autoNameTasks(k, title);
        announce(k);
      }
    }).catch(function () {
      failedAt[k] = Date.now();
    }).then(function () {
      delete inflight[k];
    });
  }

  function announce(k) {
    if (TG.ui) TG.ui.refreshHeader();
    if (TG.dashboard && TG.dashboard.isOpen()) TG.dashboard.render();
    /* never yank focus out of a field the user is typing in */
    var ae = document.activeElement;
    var typing = ae && ae.getAttribute && ae.getAttribute("data-ef");
    var editing = document.querySelector(".wk.editing");
    if (!typing && !editing && TG.ui) TG.ui.render();
    void k;
  }

  /* ---------- sweep: called after every render ---------- */
  var sweepTimer = null;
  function sweep() {
    clearTimeout(sweepTimer);
    sweepTimer = setTimeout(function () {
      var jobs = [];
      /* 1. verify unknown-host links */
      store.allDays().forEach(function (day) {
        day.items.forEach(function (it) {
          if (!it.url) return;
          if (store.classifyInfo(it.url).src !== "unknown") return;
          if (jobs.length < MAX_PER_SWEEP) jobs.push(verifyURL(it.url));
        });
      });
      /* 2. fetch real titles for untitled question links */
      if (jobs.length < MAX_PER_SWEEP) {
        store.problemIndex().forEach(function (p) {
          if (jobs.length >= MAX_PER_SWEEP) return;
          if (needsTitle(p)) jobs.push(fetchTitle(p.url));
        });
      }
      if (!jobs.length) return;
      draining = true;
      Promise.all(jobs).then(function () { draining = false; });
    }, 700);
  }

  /* called right after the user commits a URL in the editor */
  function check(url) {
    if (!url) return;
    verifyURL(url).then(function () {
      if (needsTitleFor(url)) return fetchTitle(url);
    });
  }
  function needsTitleFor(url) {
    var k = store.urlKey(url);
    if (!k || store.verifiedTitle(k)) return false;
    var found = false;
    store.allDays().forEach(function (day) {
      day.items.forEach(function (it) {
        if (found || store.urlKey(it.url) !== k) return;
        if (!store.isGenericTitle(it.title)) found = true;
      });
    });
    return !found;
  }

  TG.verify = { sweep: sweep, check: check, isBusy: function () { return draining; } };
})();
