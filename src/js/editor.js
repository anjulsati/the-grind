/* ============================================================
   The Grind — editor.js
   Inline week editing. One Edit button per week; while it is on,
   the week's text is edited directly on the page. No dialogs.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};
  var store = window.TG.store;
  var editing = {}; // week number -> true while that week is being edited

  function isEditing(n) { return !!editing[Number(n)]; }

  function toggle(n) {
    n = Number(n);
    editing[n] = !editing[n];
    TG.ui.render();
    TG.toast(editing[n] ? "Edit directly — click any text to change it" : "Edits saved");
  }

  /* Called when an edited field loses focus.
     spec is "kind|key|field": kind is week / day / task. */
  function commit(spec, value) {
    var parts = String(spec).split("|");
    var kind = parts[0];
    var field = parts[2];
    value = String(value == null ? "" : value).trim();
    var target;
    if (kind === "week") target = store.weekByN(Number(parts[1]));
    else if (kind === "day") target = store.dayByDate(parts[1]);
    else if (kind === "task") { var f = store.findItem(parts[1]); target = f && f.item; }
    else return;
    if (!target || !field) return;
    if ((target[field] || "") === value) return;
    target[field] = value;
    store.saveDB();
  }

  /* ＋ inside an edited week — adds a task straight into the day */
  function addTask(dayDate, track) {
    var d = store.dayByDate(dayDate);
    if (!d) return;
    var it = {
      id: store.uid(), type: track === "dsa" ? "dsa" : "task", track: track,
      title: "New task", url: "", diff: "", priority: "", hint: "", vtitle: "", vauthor: ""
    };
    d.items.push(it);
    store.saveDB();
    TG.ui.render();
    var el2 = document.querySelector('[data-ef="task|' + it.id + '|title"]');
    if (el2) {
      el2.focus();
      try { document.execCommand("selectAll", false, null); } catch (e) { /* ignore */ }
    }
  }

  TG.editor = { isEditing: isEditing, toggle: toggle, commit: commit, addTask: addTask };
})();
