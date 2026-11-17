/* ============================================================
   The Grind — editor.js
   Every modal that mutates the plan database.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};
  var store = window.TG.store;

  /* ---------- modal plumbing ---------- */
  function openModal(title, bodyHTML, onSave, extra) {
    extra = extra || {};
    var wrap = document.getElementById("modal");
    wrap.innerHTML = '<div class="modal"><div class="modal-h"><b>' + TG.ui.esc(title) +
      '</b><button class="tbtn" data-close="1">✕</button></div>' +
      '<div class="modal-b">' + bodyHTML + "</div>" +
      '<div class="modal-f"><button class="btn solid" data-save="1">Save</button>' +
      (extra.delete ? '<button class="btn danger" data-delete="1">Delete</button>' : "") +
      '<button class="btn" data-close="1">Cancel</button></div></div>';
    wrap.style.display = "grid";
    var first = wrap.querySelector("input,textarea,select");
    if (first) first.focus();

    wrap.querySelectorAll("[data-save],[data-close],[data-delete]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-save")) {
          var vals = {};
          wrap.querySelectorAll("[data-f]").forEach(function (f) { vals[f.getAttribute("data-f")] = f.value.trim(); });
          wrap.style.display = "none";
          onSave(vals);
        } else if (b.getAttribute("data-delete")) {
          wrap.style.display = "none";
          extra.onDelete();
        } else {
          wrap.style.display = "none";
        }
      });
    });
  }
  function field(label, name, value, opts) {
    opts = opts || {};
    if (opts.type === "textarea") {
      return '<label class="fld"><span>' + TG.ui.esc(label) + '</span><textarea data-f="' + name + '" rows="3">' + TG.ui.esc(value || "") + "</textarea></label>";
    }
    if (opts.options) {
      return '<label class="fld"><span>' + TG.ui.esc(label) + '</span><select data-f="' + name + '">' +
        opts.options.map(function (o) { return '<option value="' + TG.ui.esc(o[0]) + '"' + (value === o[0] ? " selected" : "") + ">" + TG.ui.esc(o[1]) + "</option>"; }).join("") +
        "</select></label>";
    }
    return '<label class="fld"><span>' + TG.ui.esc(label) + '</span><input type="text" data-f="' + name + '" value="' + TG.ui.esc(value || "") + '" placeholder="' + TG.ui.esc(opts.ph || "") + '"></label>';
  }

  var TYPES = [
    ["dsa", "DSA problem"], ["stretch", "Stretch problem"], ["watch", "Watch-first video"],
    ["theory", "Concept / theory"], ["career", "Career task"], ["review", "Review / other"], ["task", "Task"]
  ];
  var PRIOS = [["", "— none —"], ["P1", "P1 · must do today"], ["P2", "P2 · this week"], ["P3", "P3 · whenever"]];

  /* ---------- item ---------- */
  function itemModal(existing, dayDate, track) {
    var it = existing || { title: "", url: "", diff: "", type: track === "dsa" ? "dsa" : "task", priority: "", hint: "", vtitle: "", vauthor: "" };
    var body =
      field("Title", "title", it.title, { ph: "Two Sum / 5 SQL joins out loud" }) +
      field("Link (optional)", "url", it.url) +
      field("Type", "type", it.type, { options: TYPES }) +
      field("Priority", "priority", it.priority || "", { options: PRIOS }) +
      field("Difficulty", "diff", it.diff, { options: [["", "—"], ["E", "easy"], ["M", "medium"], ["H", "hard"]] }) +
      field("Video title (optional)", "vtitle", it.vtitle) +
      field("Channel (optional)", "vauthor", it.vauthor) +
      field("How to do it", "hint", it.hint, { type: "textarea" });

    openModal(existing ? "Edit item" : "Add item", body, function (v) {
      if (!v.title) { TG.toast("Title is required"); return; }
      if (existing) {
        Object.assign(existing, { title: v.title, url: v.url, type: v.type, priority: v.priority, diff: v.diff, hint: v.hint, vtitle: v.vtitle, vauthor: v.vauthor });
        TG.toast("Item updated");
      } else {
        var d = store.dayByDate(dayDate);
        d.items.push({ id: store.uid(), type: v.type, track: track === "dev" ? "dev" : "dsa", priority: v.priority, title: v.title, url: v.url, diff: v.diff, hint: v.hint, vtitle: v.vtitle, vauthor: v.vauthor });
        TG.toast("Item added");
      }
      store.saveDB(); TG.ui.render();
    });
  }

  /* ---------- week / day ---------- */
  function weekModal(w) {
    var body = field("Theme", "theme", w.theme) + field("One-line goal", "goal", w.goal) +
      field("Note (shown inside the week)", "note", w.note, { type: "textarea" });
    openModal("Week " + w.n, body, function (v) {
      w.theme = v.theme || w.theme; w.goal = v.goal; w.note = v.note;
      store.saveDB(); TG.ui.render(); TG.toast("Week updated");
    });
  }
  function dayModal(d) {
    var body = field("Day title", "title", d.title) + field("Time", "time", d.time);
    openModal("Day — " + TG.ui.fmtDate(d.date), body, function (v) {
      d.title = v.title || d.title; d.time = v.time;
      store.saveDB(); TG.ui.render(); TG.toast("Day updated");
    });
  }

  TG.editor = {
    itemModal: itemModal, weekModal: weekModal, dayModal: dayModal,
    TYPES: TYPES, PRIOS: PRIOS
  };
})();
