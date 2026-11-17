/* ============================================================
   The Grind — sync.js
   Shares the plan, progress and notes through Firebase Realtime
   Database. Access is enforced by database.rules.json. This file
   only shows the People panel to the admin; the rules decide what
   anyone can actually read or write.
   Does nothing until firebase-config.js is filled in.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};

  var ADMIN_EMAIL = "anjulsati147@gmail.com";

  var db = null;
  var ref = null;
  var accessRef = null;
  var timer = null;
  var lastStamp = 0;
  var applying = false;
  var seeded = false;
  var modal = null;
  var lastSeen = null;
  var HIST_KEY = "the-grind-hist-at";
  var HIST_GAP = 24 * 60 * 60 * 1000;
  var HIST_KEEP = 30;
  var HIST_MIGRATED = "the-grind-hist-v2";

  function config() { return window.GRIND_FIREBASE || null; }

  function clean(v) { return JSON.parse(JSON.stringify(v)); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function btn(label, cls, fn) {
    var b = el("button", cls || "btn", label);
    b.addEventListener("click", fn);
    return b;
  }

  function saveVersion(v) {
    return db.ref("history/" + v.updated).set(v)
      .then(function () { return db.ref("historyIndex/" + v.updated).set(true); })
      .catch(function () {});
  }

  function keepVersion(v) {
    localStorage.setItem(HIST_KEY, String(Date.now()));
    return saveVersion(v);
  }

  function push() {
    if (!ref || applying) return;
    var now = Date.now();
    if (lastSeen && now - Number(localStorage.getItem(HIST_KEY) || 0) >= HIST_GAP) keepVersion(lastSeen);
    lastStamp = now;
    var payload = clean({
      plan: TG.store.db,
      progress: TG.store.state,
      notes: TG.notes.getNotes(),
      updated: now
    });
    lastSeen = payload;
    ref.set(payload).catch(function () {
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
    lastSeen = v;
    apply(v);
  }

  function startListening() {
    if (ref) return;
    ref = db.ref("plan");
    ref.on("value", onRemote, function () {
      TG.toast("Not allowed to read the shared plan");
    });
  }

  function stopListening() {
    if (ref) ref.off();
    ref = null;
    seeded = false;
  }

  function menuItem(label, fn) {
    var b = el("button", "acct-item", label);
    b.addEventListener("click", function (e) { e.stopPropagation(); closeAccountMenus(); fn(); });
    return b;
  }

  function closeAccountMenus() {
    document.querySelectorAll(".acct-menu.open").forEach(function (m) { m.classList.remove("open"); });
  }

  function showBar(user, state) {
    var bar = document.getElementById("syncSlot");
    if (!bar) return;
    bar.textContent = "";
    if (!user) {
      var si = btn("Sign in", "btn solid", signIn);
      si.title = "Sign in with Google";
      si.setAttribute("aria-label", "Sign in with Google");
      bar.appendChild(si);
      return;
    }
    var wrap = el("div", "acct");
    var toggle = el("button", "acct-btn", (user.email || "?").charAt(0).toUpperCase());
    toggle.setAttribute("aria-label", "Account menu");
    var menu = el("div", "acct-menu");
    menu.appendChild(el("div", "acct-email", user.email));
    if (state === "waiting") menu.appendChild(el("div", "acct-state", "Waiting for approval"));
    if (user.email === ADMIN_EMAIL) menu.appendChild(menuItem("People", openPeople));
    menu.appendChild(menuItem("Sign out", function () { firebase.auth().signOut(); }));
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = menu.classList.contains("open");
      closeAccountMenus();
      if (!open) menu.classList.add("open");
    });
    wrap.appendChild(toggle);
    wrap.appendChild(menu);
    bar.appendChild(wrap);
  }

  function signIn() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (err) {
      TG.toast("Sign-in failed: " + err.message);
    });
  }

  function watchAccess(user) {
    if (accessRef) accessRef.off();
    accessRef = db.ref("allowed/" + user.uid);
    accessRef.on("value", function (snap) {
      if (snap.exists()) {
        showBar(user, "ok");
        startListening();
      } else {
        stopListening();
        showBar(user, "waiting");
        db.ref("requests/" + user.uid).set({ email: user.email, at: Date.now() }).catch(function () {});
      }
    });
  }

  function onSignedIn(user) {
    if (user.email === ADMIN_EMAIL) {
      db.ref("allowed/" + user.uid).set({ email: user.email, at: Date.now() }).catch(function () {});
      migrateHistory().then(pruneHistory).catch(function () {});
    }
    watchAccess(user);
  }

  function migrateHistory() {
    if (localStorage.getItem(HIST_MIGRATED)) return Promise.resolve();
    return db.ref("history").orderByKey().limitToLast(HIST_KEEP).once("value").then(function (kept) {
      var keep = [];
      kept.forEach(function (c) { keep.push(c.key); });
      var jobs = keep.map(function (k) { return db.ref("historyIndex/" + k).set(true); });
      if (!keep.length) return Promise.all(jobs);
      return db.ref("history").orderByKey().endBefore(keep[0]).once("value").then(function (old) {
        old.forEach(function (c) { jobs.push(db.ref("history/" + c.key).remove()); });
        return Promise.all(jobs);
      });
    }).then(function () { localStorage.setItem(HIST_MIGRATED, "1"); });
  }

  function pruneHistory() {
    return db.ref("historyIndex").once("value").then(function (snap) {
      var keys = [];
      snap.forEach(function (c) { keys.push(c.key); });
      var jobs = [];
      keys.slice(0, Math.max(0, keys.length - HIST_KEEP)).forEach(function (k) {
        jobs.push(db.ref("historyIndex/" + k).remove());
        jobs.push(db.ref("history/" + k).remove());
      });
      return Promise.all(jobs);
    });
  }

  function restore(key) {
    var when = new Date(Number(key)).toLocaleString("en-IN");
    if (!confirm("Restore the plan from " + when + "?\n\nYour current plan is saved first as \"Before restore\", so you can undo this.")) return;
    var now = Date.now();
    var backup = clean({
      plan: TG.store.db,
      progress: TG.store.state,
      notes: TG.notes.getNotes(),
      updated: now
    });
    db.ref("history/" + now).set(backup)
      .then(function () { return db.ref("historyIndex/" + now).set("Before restore"); })
      .then(function () { return db.ref("history/" + key).once("value"); })
      .then(function (snap) {
        var v = snap.val();
        if (!v) throw new Error("missing version");
        v.updated = Date.now();
        lastSeen = v;
        return db.ref("plan").set(v);
      })
      .then(function () { TG.toast("Restored from " + when + ". Undo: restore the \"Before restore\" entry."); closePeople(); })
      .catch(function () { TG.toast("Restore cancelled: the current plan could not be saved first"); });
  }

  function renderHistory(body) {
    body.appendChild(el("div", "sync-sec", "Version history"));
    var list = el("div", null, "Loading…");
    body.appendChild(list);
    db.ref("historyIndex").once("value").then(function (snap) {
      list.textContent = "";
      var keys = [];
      var labels = {};
      snap.forEach(function (c) { keys.push(c.key); labels[c.key] = typeof c.val() === "string" ? c.val() : "Automatic"; });
      if (!keys.length) { list.appendChild(el("div", "sync-empty", "No saved versions yet.")); return; }
      keys.reverse().forEach(function (key) {
        var row = el("div", "sync-row");
        var text = el("span", "sync-who", new Date(Number(key)).toLocaleString("en-IN") + "  ·  " + labels[key]);
        row.appendChild(text);
        row.appendChild(btn("Restore", "btn", function () { restore(key); }));
        list.appendChild(row);
      });
    }).catch(function () { list.textContent = "Could not load version history."; });
  }

  function openPeople() {
    if (!modal) {
      modal = el("div", "modal-wrap");
      modal.id = "peopleModal";
      modal.addEventListener("click", function (e) { if (e.target === modal) closePeople(); });
      document.body.appendChild(modal);
    }
    modal.style.display = "grid";
    renderPeople();
  }

  function closePeople() {
    if (modal) modal.style.display = "none";
  }

  function fail() { TG.toast("That change is not allowed"); }

  function renderPeople() {
    Promise.all([db.ref("requests").once("value"), db.ref("allowed").once("value")]).then(function (res) {
      var reqs = res[0].val() || {};
      var allowed = res[1].val() || {};
      modal.textContent = "";

      var box = el("div", "modal");
      var head = el("div", "modal-h");
      head.appendChild(el("b", null, "People who can change the plan"));
      head.appendChild(btn("✕", "tbtn", closePeople));
      var body = el("div", "modal-b");

      body.appendChild(el("div", "sync-sec", "Waiting for approval"));
      var rkeys = Object.keys(reqs);
      if (!rkeys.length) body.appendChild(el("div", "sync-empty", "No one is waiting."));
      rkeys.forEach(function (uid) {
        var row = el("div", "sync-row");
        row.appendChild(el("span", "sync-who", reqs[uid].email));
        row.appendChild(btn("Approve", "btn solid", function () { approve(uid, reqs[uid].email); }));
        row.appendChild(btn("Reject", "btn danger", function () { reject(uid); }));
        body.appendChild(row);
      });

      body.appendChild(el("div", "sync-sec", "Allowed"));
      Object.keys(allowed).forEach(function (uid) {
        var row = el("div", "sync-row");
        row.appendChild(el("span", "sync-who", allowed[uid].email));
        if (allowed[uid].email !== ADMIN_EMAIL) {
          row.appendChild(btn("Remove", "btn danger", function () { remove(uid); }));
        }
        body.appendChild(row);
      });

      body.appendChild(el("div", "sync-sec", "Plan tools"));
      var tools = el("div", "sync-tools");
      [["exportBtn", "Export plan"], ["importBtn", "Import plan"], ["restoreBtn", "Restore original"]].forEach(function (x) {
        var b = el("button", "btn");
        b.id = x[0];
        b.textContent = x[1];
        tools.appendChild(b);
      });
      body.appendChild(tools);

      var me = firebase.auth().currentUser;
      if (me && me.email === ADMIN_EMAIL) renderHistory(body);

      box.appendChild(head);
      box.appendChild(body);
      modal.appendChild(box);
    }).catch(fail);
  }

  function approve(uid, email) {
    db.ref("allowed/" + uid).set({ email: email, at: Date.now() })
      .then(function () { return db.ref("requests/" + uid).remove(); })
      .then(function () { TG.toast("Approved " + email); renderPeople(); })
      .catch(fail);
  }

  function reject(uid) {
    db.ref("requests/" + uid).remove().then(renderPeople).catch(fail);
  }

  function remove(uid) {
    db.ref("allowed/" + uid).remove()
      .then(function () { TG.toast("Removed access"); renderPeople(); })
      .catch(fail);
  }

  function connect() {
    var cfg = config();
    if (!cfg || !cfg.databaseURL || !window.firebase) return;
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".acct, .more")) return;
      closeAccountMenus();
    });
    if (!firebase.apps.length) firebase.initializeApp(cfg);
    db = firebase.database();
    firebase.auth().onAuthStateChanged(function (user) {
      showBar(user, null);
      if (user) onSignedIn(user);
      else {
        if (accessRef) accessRef.off();
        accessRef = null;
        stopListening();
      }
    });
  }

  TG.sync = { connect: connect, changed: changed };
})();
