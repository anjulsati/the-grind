/* ============================================================
   The Grind — dashboard.js
   "DSA Questions" page. Opens when the top counter is clicked.
   Reads the same database records as the plan — no copies:

     - one row per unique problem link (duplicates collapse)
     - names come from the task, or auto-fetched from the page
     - First Added = when the link first entered the plan
   Minimal by design: search, two sorts, five columns.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};
  var store = window.TG.store;

  var view = null;
  var isOpenFlag = false;
  var q = "";
  var sortKey = "first";         /* name | first */
  var sortDir = -1;              /* -1 = newest first, name: A→Z */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(v) {
    if (!v) return "—";
    var d = new Date(v.length === 10 ? v + "T00:00:00" : v);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  function shortLink(u) {
    return String(u || "").replace(/^https?:\/\//, "").replace(/^www\./, "");
  }

  function ensureView() {
    if (view) return view;
    view = document.createElement("div");
    view.id = "dsaView";
    view.className = "dsa-view";
    view.hidden = true;
    document.body.appendChild(view);
    return view;
  }

  function visibleProblems() {
    var list = store.problemIndex().slice(0);
    var needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(function (p) {
        return (p.title || "").toLowerCase().indexOf(needle) !== -1 ||
          p.platform.toLowerCase().indexOf(needle) !== -1 ||
          p.url.toLowerCase().indexOf(needle) !== -1;
      });
    }
    list.sort(function (a, b) {
      if (sortKey === "name") {
        return (a.title || "").localeCompare(b.title || "") * (sortDir === 1 ? 1 : -1);
      }
      var x = a.firstAdded || "", y = b.firstAdded || "";
      if (!x && !y) return 0;
      if (!x) return 1;
      if (!y) return -1;
      return x.localeCompare(y) * (sortDir === 1 ? -1 : 1);
    });
    return list;
  }

  function sortBtn(label, key) {
    var on = sortKey === key;
    return '<button class="dsort' + (on ? " on" : "") + '" data-dsort="' + key + '">' +
      esc(label) + '<span class="dir">' + (on ? (sortKey === "name" ? (sortDir === 1 ? "↑" : "↓") : (sortDir === 1 ? "↑" : "↓")) : "↕") + "</span></button>";
  }

  function render() {
    if (!isOpenFlag) return;
    ensureView();
    var all = store.problemIndex();
    var list = visibleProblems();

    var rows = list.map(function (p, i) {
      var revs = p.revs.length;
      var anchor = p.items.length ? p.items[0] : null;
      return "<tr>" +
        '<td class="num">' + (i + 1) + "</td>" +
        '<td><a class="dname" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.title || "(untitled)") + "</a>" +
          '<button class="dtitle-edit" data-dtitle="' + esc(p.key) + '" title="Rename">✎</button>' +
          (anchor ? '<button class="drev-btn' + (revs ? " has-revs" : "") + '" data-drev="' + esc(anchor) + '" title="Revisions">↻' + (revs ? revs : "") + "</button>" : "") +
          "</td>" +
        '<td class="dplat">' + esc(p.platform || "—") + "</td>" +
        '<td class="dlink"><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(shortLink(p.url)) + "</a></td>" +
        "<td>" + esc(fmtDate(p.firstAdded)) + "</td>" +
        "</tr>";
    }).join("");

    view.innerHTML =
      '<div class="dsa-top"><button class="btn" id="dsaBack">← Back to plan</button>' +
      '<div class="dsa-headline"><h2>DSA Questions</h2>' +
      '<span class="dsa-stat">' + all.length + " questions</span></div></div>" +
      '<div class="dsa-tools">' +
      '<input id="dsaSearch" type="search" placeholder="Search…" value="' + esc(q) + '">' +
      '<div class="dseg" id="dsaSortSeg">' + sortBtn("Name", "name") + sortBtn("First added", "first") + "</div>" +
      "</div>" +
      '<div class="dsa-tablewrap"><table class="dsa-table"><thead><tr>' +
      "<th>#</th><th>Question</th><th>Platform</th><th>Link</th><th>First Added</th>" +
      "</tr></thead><tbody>" +
      (rows || '<tr><td colspan="5" class="dnone">No DSA questions yet — paste a problem link into any task.</td></tr>') +
      "</tbody></table></div>";

    /* wiring */
    view.querySelector("#dsaBack").addEventListener("click", close);
    var search = view.querySelector("#dsaSearch");
    search.addEventListener("input", function () { q = search.value; renderTableOnly(); });
    view.querySelectorAll("[data-dsort]").forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-dsort");
        if (sortKey === k) sortDir = -sortDir;
        else { sortKey = k; sortDir = (k === "name" ? 1 : -1); }
        render();
      });
    });
    view.querySelectorAll("[data-dtitle]").forEach(function (b) {
      b.addEventListener("click", function () { editTitle(b.getAttribute("data-dtitle")); });
    });
    view.querySelectorAll("[data-drev]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (TG.revision) TG.revision.open(b.getAttribute("data-drev"), b);
      });
    });
  }

  /* re-render but keep the search box focus + caret */
  function renderTableOnly() {
    var focus = document.activeElement === view.querySelector("#dsaSearch");
    var sel = null;
    try { sel = focus ? view.querySelector("#dsaSearch").selectionStart : null; } catch (e) { /* ignore */ }
    render();
    if (focus) {
      var s = view.querySelector("#dsaSearch");
      s.focus();
      try { s.setSelectionRange(sel, sel); } catch (e) { /* ignore */ }
    }
  }

  function editTitle(key) {
    var p = store.problemIndex().filter(function (x) { return x.key === key; })[0];
    if (!p) return;
    var cell = view.querySelector('[data-dtitle="' + key.replace(/"/g, '\\"') + '"]');
    var nameEl = cell && cell.parentElement.querySelector(".dname");
    if (!nameEl) return;
    var input = document.createElement("input");
    input.type = "text";
    input.className = "dname-input";
    input.value = p.title || "";
    nameEl.replaceWith(input);
    input.focus();
    input.select();
    function commitTitle() {
      var v = input.value.trim();
      if (v && v !== p.title) {
        store.setTitle(p.url, v);
        TG.toast("Question name updated");
      }
      render();
    }
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") { e.preventDefault(); input.blur(); }
      if (e.key === "Escape") { input.value = p.title || ""; input.blur(); }
    });
    input.addEventListener("blur", commitTitle);
    input.addEventListener("paste", function (e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData("text/plain");
      try { document.execCommand("insertText", false, text); } catch (err) { input.value += text; }
    });
  }

  function open() {
    isOpenFlag = true;
    ensureView();
    view.hidden = false;
    document.body.style.overflow = "hidden";
    render();
    window.scrollTo(0, 0);
  }
  function close() {
    isOpenFlag = false;
    if (view) view.hidden = true;
    document.body.style.overflow = "";
  }
  function refresh() { if (isOpenFlag) render(); }

  TG.dashboard = {
    open: open, close: close, refresh: refresh, render: render,
    isOpen: function () { return isOpenFlag; }
  };
})();
