/* ============================================================
   The Grind — dashboard.js
   "Completed DSA Questions" page. Opens when the top counter is
   clicked. Reads the same database records as the plan and the
   revision tracker — no copies, so it is always in sync:

     - one row per unique problem link (duplicates collapse)
     - First Attempted = earliest "done" timestamp
     - Revision History = the question's existing revision entries
     - Last Revised    = latest of those entries
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};
  var store = window.TG.store;

  var view = null;
  var isOpenFlag = false;
  var q = "";
  var filter = "all";            /* all | done | pending */
  var sortKey = "first";         /* name | first | last */
  var sortDir = -1;              /* -1 = most recent first for dates, A→Z for names */

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDT(iso) {
    if (!iso) return "—";
    var d = new Date(iso);
    if (isNaN(d)) return "—";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }
  function fmtStamp(st) {
    if (!st) return "—";
    var d = new Date(st.t);
    if (isNaN(d)) return st.label;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
      " · " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
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
    if (filter === "done") list = list.filter(function (p) { return p.done; });
    if (filter === "pending") list = list.filter(function (p) { return !p.done; });
    var needle = q.trim().toLowerCase();
    if (needle) {
      list = list.filter(function (p) {
        return (p.title || "").toLowerCase().indexOf(needle) !== -1 ||
          p.url.toLowerCase().indexOf(needle) !== -1;
      });
    }
    list.sort(function (a, b) {
      var cmp;
      if (sortKey === "name") {
        cmp = (a.title || "").localeCompare(b.title || "");
        return cmp * (sortDir === 1 ? 1 : -1);
      }
      if (sortKey === "first") {
        if (!a.firstAt && !b.firstAt) cmp = 0;
        else if (!a.firstAt) cmp = 1;          /* never-dated rows sink */
        else if (!b.firstAt) cmp = -1;
        else cmp = a.firstAt.localeCompare(b.firstAt);
        return cmp * (sortDir === 1 ? -1 : 1); /* default: most recent first */
      }
      var x = a.lastRev ? a.lastRev.t : 0, y = b.lastRev ? b.lastRev.t : 0;
      cmp = x - y;
      if (cmp === 0) return 0;
      return (cmp > 0 ? 1 : -1) * (sortDir === 1 ? -1 : 1);
    });
    return list;
  }

  function sortBtn(label, key) {
    var on = sortKey === key;
    return '<button class="dsort' + (on ? " on" : "") + '" data-dsort="' + key + '">' +
      esc(label) + '<span class="dir">' + (on ? (sortDir === 1 ? "↑" : "↓") : "↕") + "</span></button>";
  }

  function render() {
    if (!isOpenFlag) return;
    ensureView();
    var all = store.problemIndex();
    var doneCount = all.filter(function (p) { return p.done; }).length;
    var list = visibleProblems();

    var rows = list.map(function (p, i) {
      var revs = p.revs.length
        ? p.revs.map(function (r, ri) {
            return '<div class="drev"><span class="n">' + (ri + 1) + "</span>" + esc(fmtStamp(r)) + "</div>";
          }).join("")
        : '<span class="dim">—</span>';
      var name = p.title || "(untitled)";
      return "<tr>" +
        '<td class="num">' + (i + 1) + "</td>" +
        '<td><a class="dname" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(name) + "</a>" +
          '<span class="dtag ' + (p.done ? "ok" : "pend") + '">' + (p.done ? "solved" : "pending") + "</span>" +
          '<button class="dtitle-edit" data-dtitle="' + esc(p.key) + '" title="Edit this title">✎</button></td>' +
        '<td class="dlink"><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(shortLink(p.url)) + "</a></td>" +
        "<td>" + esc(fmtDT(p.firstAt)) + "</td>" +
        '<td class="drevs">' + revs + "</td>" +
        "<td>" + esc(fmtStamp(p.lastRev)) + "</td>" +
        "</tr>";
    }).join("");

    view.innerHTML =
      '<div class="dsa-top"><button class="btn" id="dsaBack">← Back to plan</button>' +
      '<div class="dsa-headline"><h2>DSA Questions</h2>' +
      '<span class="dsa-stat"><b>' + doneCount + "</b> completed · <b>" + all.length + "</b> unique questions tracked</span></div></div>" +
      '<div class="dsa-tools">' +
      '<input id="dsaSearch" type="search" placeholder="Search name or link…" value="' + esc(q) + '">' +
      '<div class="dseg" id="dsaFilterSeg">' +
      '<button data-dfilter="all" class="' + (filter === "all" ? "on" : "") + '">All</button>' +
      '<button data-dfilter="done" class="' + (filter === "done" ? "on" : "") + '">Completed</button>' +
      '<button data-dfilter="pending" class="' + (filter === "pending" ? "on" : "") + '">Pending</button>' +
      "</div>" +
      '<div class="dseg" id="dsaSortSeg">' + sortBtn("Name", "name") + sortBtn("First attempted", "first") + sortBtn("Last revised", "last") + "</div>" +
      "</div>" +
      '<div class="dsa-tablewrap"><table class="dsa-table"><thead><tr>' +
      "<th>S. No.</th><th>Question Name</th><th>Question Link</th><th>First Attempted</th><th>Revision History</th><th>Last Revised</th>" +
      "</tr></thead><tbody>" +
      (rows || '<tr><td colspan="6" class="dnone">No questions match.</td></tr>') +
      "</tbody></table></div>";

    /* wiring */
    view.querySelector("#dsaBack").addEventListener("click", close);
    var search = view.querySelector("#dsaSearch");
    search.addEventListener("input", function () { q = search.value; renderTableOnly(); });
    view.querySelectorAll("[data-dfilter]").forEach(function (b) {
      b.addEventListener("click", function () { filter = b.getAttribute("data-dfilter"); render(); });
    });
    view.querySelectorAll("[data-dsort]").forEach(function (b) {
      b.addEventListener("click", function () {
        var k = b.getAttribute("data-dsort");
        if (sortKey === k) sortDir = -sortDir;
        else { sortKey = k; sortDir = (k === "name" ? 1 : -1); }
        render();
      });
    });
    /* title editing: ✎ turns the name into an editable field */
    view.querySelectorAll("[data-dtitle]").forEach(function (b) {
      b.addEventListener("click", function () { editTitle(b.getAttribute("data-dtitle")); });
    });
  }

  /* re-render just the tbody so the search box keeps focus */
  function renderTableOnly() {
    var keep = { q: q };
    var focus = document.activeElement === view.querySelector("#dsaSearch");
    var sel = null;
    try { sel = focus ? view.querySelector("#dsaSearch").selectionStart : null; } catch (e) { /* ignore */ }
    render();
    if (focus) {
      var s = view.querySelector("#dsaSearch");
      s.focus();
      try { s.setSelectionRange(sel, sel); } catch (e) { /* ignore */ }
    }
    void keep;
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
    try { view.scrollIntoView(); } catch (e) { /* ignore */ }
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
