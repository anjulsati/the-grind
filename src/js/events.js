/* ============================================================
   The Grind — events.js
   Every delegated click / change / input / drag / keyboard handler.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};
  var store = window.TG.store;
  var ui = window.TG.ui;
  var editor = window.TG.editor;

  /* ============================================================
     DRAG & DROP — swap within a day, move to any other day
     ============================================================ */
  var dragId = null;

  document.addEventListener("dragstart", function (e) {
    var li = e.target.closest && e.target.closest(".item");
    if (!li) return;
    dragId = li.getAttribute("data-dragid");
    li.classList.add("dragging");
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      try { e.dataTransfer.setData("text/plain", dragId); } catch (err) { /* ignore */ }
    }
  });

  document.addEventListener("dragover", function (e) {
    if (!dragId) return;
    var itemEl = e.target.closest && e.target.closest(".item");
    var boxEl = e.target.closest && e.target.closest(".dcol");
    if (!itemEl && !boxEl) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    document.querySelectorAll(".drag-over").forEach(function (x) { x.classList.remove("drag-over"); });
    if (itemEl && !itemEl.classList.contains("dragging")) itemEl.classList.add("drag-over");
    else if (boxEl) boxEl.classList.add("drag-over");
  });

  document.addEventListener("drop", function (e) {
    if (!dragId) return;
    e.preventDefault();
    var f = store.findItem(dragId);
    cleanupDrag();
    if (!f) return;

    var itemEl = e.target.closest && e.target.closest(".item");
    var boxEl = e.target.closest && e.target.closest(".dcol");
    var dayEl = e.target.closest && e.target.closest(".day");

    var targetDay = null, targetTrack = "dsa", beforeItemId = null;

    if (itemEl) {
      var tid = (itemEl.querySelector("input[data-id]") || {}).getAttribute;
      var idAttr = itemEl.getAttribute("data-dragid");
      var tf = store.findItem(idAttr);
      if (tf && tf.item.id !== f.item.id) { targetDay = tf.day; beforeItemId = tf.item.id; targetTrack = tf.item.track; }
      else if (tf) { return; } // dropped on itself
    }
    if (!targetDay && boxEl && dayEl) {
      targetDay = store.dayByDate(dayEl.id.replace("d-", ""));
      targetTrack = boxEl.classList.contains("dev") ? "dev" : "dsa";
    }
    if (!targetDay && dayEl) {
      targetDay = store.dayByDate(dayEl.id.replace("d-", ""));
      targetTrack = "dsa";
    }
    if (!targetDay) return;

    /* remove from source, insert at target */
    f.day.items = f.day.items.filter(function (x) { return x.id !== f.item.id; });
    f.item.track = targetTrack;
    var arr = targetDay.items;
    var idx = beforeItemId ? arr.findIndex(function (x) { return x.id === beforeItemId; }) : arr.length;
    if (idx < 0) idx = arr.length;
    arr.splice(idx, 0, f.item);
    store.saveDB(); ui.render();
    TG.toast("Task moved" + (targetDay.date !== f.day.date ? " to " + ui.fmtDate(targetDay.date) : ""));
  });

  document.addEventListener("dragend", cleanupDrag);
  function cleanupDrag() {
    dragId = null;
    document.querySelectorAll(".drag-over,.dragging").forEach(function (x) {
      x.classList.remove("drag-over", "dragging");
    });
  }

  /* ============================================================
     CHECKBOX
     ============================================================ */
  document.addEventListener("change", function (e) {
    var cb = e.target;
    if (!cb.matches || !cb.matches('input[type="checkbox"][data-id]')) return;
    var id = cb.getAttribute("data-id");
    if (cb.checked) store.state.done[id] = true; else delete store.state.done[id];
    store.saveState();

    var li = cb.closest(".item");
    if (li) li.classList.toggle("done", cb.checked);

    var card = cb.closest(".day");
    if (card) {
      var boxes = card.querySelectorAll('input[type="checkbox"]');
      var checked = card.querySelectorAll('input[type="checkbox"]:checked');
      var cnt = card.querySelector(".day-count");
      if (cnt) cnt.textContent = checked.length + "/" + boxes.length;
    }
    var wk = cb.closest(".wk");
    if (wk) {
      var st = ui.weekStats(store.weekByN(Number(wk.getAttribute("data-week"))));
      var wcnt = wk.querySelector(".wk-head .day-count");
      var bar = wk.querySelector(".mini-bar > div");
      if (wcnt) wcnt.textContent = st.done + "/" + st.total;
      if (bar) bar.style.width = st.pct + "%";
    }
    ui.refreshHeader();
  });

  /* ============================================================
     REVIEW FIELDS
     ============================================================ */
  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.id === "rvName") { store.state.review.name = el.value; store.saveState(); return; }
    var rk = el.getAttribute && el.getAttribute("data-rk");
    if (!rk) return;
    var p = rk.split(":");
    store.state.review[p[0]] = store.state.review[p[0]] || {};
    store.state.review[p[0]][p[1]] = el.value;
    store.saveState();
  });

  /* ============================================================
     REORDER (▲▼ in edit mode)
     ============================================================ */
  function reorder(id, dir) {
    var f = store.findItem(id);
    if (!f) return;
    var arr = f.day.items;
    var i = arr.findIndex(function (x) { return x.id === id; });
    var j = dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    store.saveDB(); ui.render();
  }

  /* ============================================================
     CLICKS
     ============================================================ */
  document.addEventListener("click", function (e) {
    var t = e.target;

    var tg = t.closest("[data-toggle]");
    if (tg) { var sec = tg.closest(".wk"); if (sec) sec.classList.toggle("open"); return; }

    var go = t.closest("[data-goto]");
    if (go) {
      var s2 = document.getElementById(go.getAttribute("data-goto"));
      if (s2) { s2.classList.add("open"); s2.scrollIntoView({ behavior: "smooth", block: "start" }); }
      return;
    }

    if (t.id === "expandAll") { document.querySelectorAll(".wk").forEach(function (w) { w.classList.add("open"); }); return; }
    if (t.id === "collapseAll") { document.querySelectorAll(".wk").forEach(function (w) { w.classList.remove("open"); }); return; }
    if (t.id === "jumpToday") {
      var tt = document.getElementById("w" + ui.ACTIVE_WEEK);
      if (tt) { tt.classList.add("open"); tt.scrollIntoView({ behavior: "smooth", block: "start" }); }
      return;
    }
    if (t.id === "topBtn") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (t.id === "editBtn") { editor.toggle(); return; }
    if (t.id === "restoreBtn") {
      if (confirm("Restore the original plan? Everything you added, edited or deleted goes back to factory state. Checkmarks stay.")) {
        store.restoreDB(); ui.render(); TG.toast("Plan restored to the original");
      }
      return;
    }
    if (t.id === "exportBtn") { store.exportDB(); TG.toast("Plan exported as JSON"); return; }
    if (t.id === "importBtn") { document.getElementById("importFile").click(); return; }

    /* pillars — always available */
    var pa = t.closest("[data-pillaradd]");
    if (pa) { editor.pillarQuickAdd(Number(pa.getAttribute("data-pillaradd"))); return; }
    var pe = t.closest("[data-editpillar]");
    if (pe) { editor.pillarModal(Number(pe.getAttribute("data-editpillar"))); return; }
    var rb = t.closest("[data-rmbullet]");
    if (rb) {
      var pr = rb.getAttribute("data-rmbullet").split(":");
      store.db.pillars[Number(pr[0])].items.splice(Number(pr[1]), 1);
      store.saveDB(); ui.render(); TG.toast("Removed");
      return;
    }

    /* edit-mode actions */
    var up = t.closest("[data-up]");
    if (up) { reorder(up.getAttribute("data-up"), "up"); return; }
    var dn = t.closest("[data-down]");
    if (dn) { reorder(dn.getAttribute("data-down"), "down"); return; }

    var ed = t.closest("[data-edit]");
    if (ed) { var f = store.findItem(ed.getAttribute("data-edit")); if (f) editor.itemModal(f.item, f.day.date, f.item.track); return; }

    var del = t.closest("[data-del]");
    if (del) {
      var fi = store.findItem(del.getAttribute("data-del"));
      if (fi && confirm('Delete "' + fi.item.title + '"?')) {
        fi.day.items = fi.day.items.filter(function (x) { return x.id !== fi.item.id; });
        delete store.state.done[fi.item.id];
        store.saveState(); store.saveDB(); ui.render(); TG.toast("Item deleted");
      }
      return;
    }

    var add = t.closest("[data-add]");
    if (add) { editor.itemModal(null, add.getAttribute("data-add"), add.getAttribute("data-track")); return; }

    var ww = t.closest("[data-wweek]");
    if (ww) { editor.weekModal(store.weekByN(Number(ww.getAttribute("data-wweek")))); return; }

    var wd = t.closest("[data-wday]");
    if (wd) { editor.dayModal(store.dayByDate(wd.getAttribute("data-wday"))); return; }

    /* review */
    if (t.id === "rvDownload") {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ui.reviewMarkdown()], { type: "text/markdown;charset=utf-8" }));
      a.download = "the-grind-review-" + store.today() + ".md";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
      document.getElementById("rvStatus").textContent = "downloaded";
      return;
    }
    if (t.id === "rvCopy") {
      var txt = ui.reviewMarkdown(), s3 = document.getElementById("rvStatus");
      function fb() {
        var ta = document.createElement("textarea"); ta.value = txt;
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); s3.textContent = "copied"; } catch (err) { s3.textContent = "copy failed — use Download"; }
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { s3.textContent = "copied"; }, fb);
      else fb();
      return;
    }
    if (t.id === "rvClear") {
      if (!confirm("Clear the whole review?")) return;
      store.state.review = { v: {}, a: {}, w: {}, name: "" };
      store.saveState(); ui.render();
      document.getElementById("review").scrollIntoView();
    }
  });

  /* ============================================================
     IMPORT / RESET / KEYBOARD
     ============================================================ */
  document.getElementById("importFile").addEventListener("change", function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var fr = new FileReader();
    fr.onload = function () {
      try { store.importDB(fr.result); ui.render(); TG.toast("Plan imported"); }
      catch (err) { TG.toast("Import failed — not a valid plan file"); }
    };
    fr.readAsText(file);
    e.target.value = "";
  });

  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "p" || e.key === "P") TG.pen.setPen(!TG.pen.isOn());
    else if (e.key === "e" || e.key === "E") editor.toggle();
    else if (e.key === "Escape") { if (TG.pen.isOn()) TG.pen.setPen(false); }
  });
})();
