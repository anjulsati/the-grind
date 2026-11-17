/* ============================================================
   The Grind — sync.js
   Shares the plan, progress and notes between browsers through
   Firebase Realtime Database. Does nothing until firebase-config.js
   is filled in.

   The shared code picks a hidden room in the database (its SHA-256
   hash), so the code itself is never stored in the database.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};

  var CODE_KEY = "the-grind-code";
  var ref = null;
  var timer = null;
  var lastStamp = 0;
  var applying = false;
  var seeded = false;

  function config() { return window.GRIND_FIREBASE || null; }

  function clean(v) { return JSON.parse(JSON.stringify(v)); }

  function hashCode(text) {
    var bytes = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", bytes).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  function push() {
    if (!ref || applying) return;
    lastStamp = Date.now();
    ref.set(clean({
      plan: TG.store.db,
      progress: TG.store.state,
      notes: TG.notes.getNotes(),
      updated: lastStamp
    }));
  }

  function changed() {
    if (!ref || applying) return;
    clearTimeout(timer);
    timer = setTimeout(push, 600);
  }

  function apply(v) {
    var active = document.activeElement;
    if (active && active.closest && active.closest(".sticky-note")) {
      setTimeout(function () { apply(v); }, 1500);
      return;
    }
    applying = true;
    try {
      TG.store.setAll(v.plan, v.progress || { done: {} });
      TG.notes.setNotes(v.notes || []);
      TG.ui.render();
    } finally {
      applying = false;
    }
    TG.toast("Updated from the shared plan");
  }

  function onRemote(snap) {
    var v = snap.val();
    if (!v) {
      if (!seeded) { seeded = true; push(); }
      return;
    }
    seeded = true;
    if (v.updated === lastStamp) return;
    lastStamp = v.updated;
    apply(v);
  }

  function connect() {
    var cfg = config();
    if (!cfg || !cfg.databaseURL || !window.firebase) return;

    var code = localStorage.getItem(CODE_KEY);
    if (!code) {
      code = (window.prompt("Shared code for you and Anurag (at least 6 characters). Use the same code on both browsers.") || "").trim();
      if (code.length < 6) return;
      localStorage.setItem(CODE_KEY, code);
    }

    if (!firebase.apps.length) firebase.initializeApp(cfg);
    hashCode("the-grind:" + code).then(function (h) {
      ref = firebase.database().ref("rooms/" + h);
      ref.on("value", onRemote, function (err) {
        TG.toast("Sync failed: " + err.message);
      });
    });
  }

  TG.sync = { connect: connect, changed: changed };
})();
