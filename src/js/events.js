/* ============================================================
   The Grind — events.js
   Every delegated click / change / input / keyboard handler.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};
  var store = window.TG.store;
  var ui = window.TG.ui;
  var editor = window.TG.editor;

  /* ---------- checkbox ---------- */
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

  /* ---------- review fields ---------- */
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

  /* ---------- clicks ---------- */
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

    /* edit-mode actions */
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
    if (add) { editor.itemModal(null, add.getAttribute("data-add"), "dsa"); return; }

    var ww = t.closest("[data-wweek]");
    if (ww) { editor.weekModal(store.weekByN(Number(ww.getAttribute("data-wweek")))); return; }

    var wd = t.closest("[data-wday]");
    if (wd) { editor.dayModal(store.dayByDate(wd.getAttribute("data-wday"))); return; }

    var ep = t.closest("[data-editpillar]");
    if (ep) { editor.pillarModal(Number(ep.getAttribute("data-editpillar"))); return; }

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

  /* ---------- import ---------- */
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

  /* ---------- reset progress ---------- */
  document.getElementById("resetBtn").addEventListener("click", function () {
    if (!confirm("Delete all checkmarks and review notes? The plan itself is untouched.")) return;
    store.resetState();
    location.reload();
  });

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea, select")) return;
    if (e.key === "p" || e.key === "P") TG.pen.setPen(!TG.pen.isOn());
    else if (e.key === "e" || e.key === "E") editor.toggle();
    else if (e.key === "Escape") { if (TG.pen.isOn()) TG.pen.setPen(false); }
  });
})();
