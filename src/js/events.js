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
     REVISION TRACKER
     ============================================================ */
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function openRevisionPanel(itemId, anchorEl) {
    var f = store.findItem(itemId);
    if (!f) return;
    var item = f.item;
    item.revisions = item.revisions || [];

    /* remove existing panel */
    var old = document.getElementById("revPanel");
    if (old) { old.remove(); return; }

    var panel = document.createElement("div");
    panel.id = "revPanel";
    panel.className = "rev-panel";

    var html = '<div class="rp-head"><b>' + esc(item.title.slice(0, 40)) + '</b><button class="tbtn" id="rpClose">✕</button></div>';
    html += '<div class="rp-body">';
    if (item.revisions.length === 0) {
      html += '<div class="rp-empty">No revisions yet. Tap ＋ each time you re-solve this problem.</div>';
    } else {
      item.revisions.forEach(function (r, i) {
        html += '<div class="rp-entry">' +
          '<span class="rp-num">' + ordinal(i + 1) + '</span>' +
          '<span class="rp-date">' + esc(r) + '</span>' +
          '<button class="rp-edit" data-rp-edit="' + i + '" title="Edit">✎</button>' +
          '<button class="rp-del" data-rp-del="' + i + '" title="Delete">✕</button>' +
          '</div>';
      });
    }
    html += '<button class="rp-add" id="rpAdd">＋ Add revision</button>';
    html += "</div>";

    panel.innerHTML = html;
    document.body.appendChild(panel);

    /* position near the button */
    var rect = anchorEl.getBoundingClientRect();
    var px = Math.min(rect.left - 10, window.innerWidth - 280);
    var py = rect.bottom + 6;
    if (py + 200 > window.innerHeight) py = rect.top - 210;
    panel.style.left = Math.max(10, px) + "px";
    panel.style.top = Math.max(10, py) + "px";

    document.getElementById("rpClose").addEventListener("click", function () { panel.remove(); });
    panel.querySelectorAll("[data-rp-edit]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ri = Number(btn.getAttribute("data-rp-edit"));
        var newVal = prompt("Edit revision date:", item.revisions[ri]);
        if (newVal !== null && newVal.trim()) {
          item.revisions[ri] = newVal.trim();
          store.saveDB();
          panel.remove();
          TG.ui.render();
          openRevisionPanel(itemId, anchorEl);
        }
      });
    });
    panel.querySelectorAll("[data-rp-del]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var ri = Number(btn.getAttribute("data-rp-del"));
        if (!confirm("Delete this revision entry?")) return;
        item.revisions.splice(ri, 1);
        store.saveDB();
        panel.remove();
        TG.ui.render();
        if (item.revisions.length > 0) openRevisionPanel(itemId, anchorEl);
      });
    });
    document.getElementById("rpAdd").addEventListener("click", function () {
      var d = new Date();
      var stamp = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
        " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      item.revisions.push(stamp);
      store.saveDB();
      panel.remove();
      TG.ui.render();
      TG.toast(ordinal(item.revisions.length) + " revision logged — " + stamp);
    });

    /* close on outside click */
    setTimeout(function () {
      document.addEventListener("click", function close(e) {
        if (!panel.contains(e.target) && e.target !== anchorEl) {
          panel.remove();
          document.removeEventListener("click", close);
        }
      });
    }, 10);
  }

  function ordinal(n) {
    var s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /* ============================================================
     CLICKS
     ============================================================ */
  document.addEventListener("click", function (e) {
    var t = e.target;

    var we = t.closest("[data-wedit]");
    if (we) { editor.toggle(we.getAttribute("data-wedit")); return; }

    var tg = t.closest("[data-toggle]");
    if (tg && !t.closest("[contenteditable]")) { var sec = tg.closest(".wk"); if (sec) sec.classList.toggle("open"); return; }

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
    if (t.id === "restoreBtn") {
      if (confirm("Restore the original plan? Everything you added, edited or deleted goes back to factory state. Checkmarks stay.")) {
        store.restoreDB(); ui.render(); TG.toast("Plan restored to the original");
      }
      return;
    }
    if (t.id === "exportBtn") { store.exportDB(); TG.toast("Plan exported as JSON"); return; }
    if (t.id === "importBtn") { document.getElementById("importFile").click(); return; }

    /* revision tracker */
    var rev = t.closest("[data-rev]");
    if (rev) { openRevisionPanel(rev.getAttribute("data-rev"), rev); return; }

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
    if (add) { editor.addTask(add.getAttribute("data-add"), add.getAttribute("data-track")); return; }

  });

  /* ============================================================
     IMPORT / KEYBOARD
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

  /* ============================================================
     INLINE EDITING — one Edit button per week, no dialogs
     ============================================================ */
  document.addEventListener("keydown", function (e) {
    var ce = e.target.closest && e.target.closest("[contenteditable][data-ef]");
    if (ce && e.key === "Enter") { e.preventDefault(); ce.blur(); return; }
    if (e.target.matches("input, textarea, select, [contenteditable]")) return;
    if (e.key === "p" || e.key === "P") TG.pen.setPen(!TG.pen.isOn());
    else if (e.key === "Escape") { if (TG.pen.isOn()) TG.pen.setPen(false); }
  });

  document.addEventListener("paste", function (e) {
    var ce = e.target.closest && e.target.closest("[contenteditable][data-ef]");
    if (!ce) return;
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData("text/plain");
    try { document.execCommand("insertText", false, text); } catch (err) { /* ignore */ }
  });

  document.addEventListener("focusout", function (e) {
    var ce = e.target;
    if (!ce.getAttribute) return;
    var ef = ce.getAttribute("data-ef");
    if (!ef) return;
    editor.commit(ef, ce.textContent || "");
    /* refresh the counts without re-rendering (that would kill focus) */
    ui.refreshHeader();
    var wk = ce.closest && ce.closest(".wk");
    if (wk) {
      var st = ui.weekStats(store.weekByN(Number(wk.getAttribute("data-week"))));
      var wcnt = wk.querySelector(".wk-head .day-count");
      var bar = wk.querySelector(".mini-bar > div");
      if (wcnt) wcnt.textContent = st.done + "/" + st.total;
      if (bar) bar.style.width = st.pct + "%";
    }
  });
})();
