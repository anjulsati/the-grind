/* ============================================================
   The Grind — sync.js
   Shares the plan, progress and notes between the two allowed
   Google accounts through Firebase Realtime Database.
   Access is enforced by database.rules.json, not by this file.
   Does nothing until firebase-config.js is filled in.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};

  var ref = null;
  var timer = null;
  var lastStamp = 0;
  var applying = false;
  var seeded = false;

  function config() { return window.GRIND_FIREBASE || null; }

  function clean(v) { return JSON.parse(JSON.stringify(v)); }

  function push() {
    if (!ref || applying) return;
    lastStamp = Date.now();
    ref.set(clean({
      plan: TG.store.db,
      progress: TG.store.state,
      notes: TG.notes.getNotes(),
      updated: lastStamp
    })).catch(function () {
      TG.toast("Not allowed to change the shared plan");
    });
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

  function startListening() {
    if (ref) return;
    ref = firebase.database().ref("plan");
    ref.on("value", onRemote, function () {
      TG.toast("Not allowed to read the shared plan");
    });
  }

  function stopListening() {
    if (ref) ref.off();
    ref = null;
    seeded = false;
  }

  function showBar(user) {
    var bar = document.getElementById("syncSlot");
    if (!bar) return;
    if (user) {
      bar.innerHTML = '<span class="sync-who">' + user.email + '</span><button class="btn" id="syncOut">Sign out</button>';
      document.getElementById("syncOut").addEventListener("click", function () { firebase.auth().signOut(); });
    } else {
      bar.innerHTML = '<button class="btn solid" id="syncIn">Sign in with Google</button>';
      document.getElementById("syncIn").addEventListener("click", function () {
        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (err) {
          TG.toast("Sign-in failed: " + err.message);
        });
      });
    }
  }

  function connect() {
    var cfg = config();
    if (!cfg || !cfg.databaseURL || !window.firebase) return;

    if (!firebase.apps.length) firebase.initializeApp(cfg);
    firebase.auth().onAuthStateChanged(function (user) {
      showBar(user);
      if (user) startListening();
      else stopListening();
    });
  }

  TG.sync = { connect: connect, changed: changed };
})();
