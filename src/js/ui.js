/* ============================================================
   The Grind — ui.js
   Every piece of HTML the app renders.
   ============================================================ */
(function () {
  "use strict";
  window.TG = window.TG || {};
  var store = window.TG.store;
  var D = window.CUDATA;

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function iso(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  var PREVIEW = null;
  try {
    var qp = new URLSearchParams(location.search).get("date");
    if (qp && /^\d{4}-\d{2}-\d{2}$/.test(qp)) PREVIEW = qp;
  } catch (e) { /* ignore */ }
  var TODAY = PREVIEW || iso(new Date());

  function fmtDate(s) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  }
  function shortDate(s) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  function monthYear(s) {
    return new Date(s + "T00:00:00").toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }
  function typeLabel(t) {
    return { dsa: "DSA", stretch: "STRETCH", watch: "WATCH", theory: "CONCEPT", career: "CAREER", review: "REVIEW", task: "TASK" }[t] || t;
  }
  function diffLabel(d) { return { E: "easy", M: "med", H: "hard" }[d] || d; }

  function dayDone(day) { return day.items.filter(function (i) { return store.state.done[i.id]; }).length; }
  function weekStats(w) {
    var t = 0, d = 0;
    w.days.forEach(function (day) {
      day.items.forEach(function (i) {
        if (!store.isProblemLink(i.url)) return;
        t++; if (store.state.done[i.id]) d++;
      });
    });
    return { total: t, done: d, pct: t ? Math.round((d / t) * 100) : 0 };
  }
  function overall() {
    var t = 0, d = 0;
    store.allDays().forEach(function (x) { t += x.items.length; d += dayDone(x); });
    return { total: t, done: d, pct: t ? (d / t) * 100 : 0 };
  }
  function dsaOverall() {
    /* unique DSA questions: one record per unique problem link */
    return store.dsaStats();
  }
  var LAST_DATE = store.allDays()[store.allDays().length - 1].date;
  var TODAY_DAY = store.allDays().filter(function (d) { return d.date === TODAY; })[0] || null;
  var FIRST_DATE = store.db.weeks[0].days[0].date;
  var ACTIVE_WEEK = TODAY_DAY ? TODAY_DAY.week : (TODAY < FIRST_DATE ? 1 : store.db.weeks.length);

  /* ============================================================
     ITEM — draggable, priority-tagged
     ============================================================ */
  function prioTag(p) {
    return p ? '<span class="prio ' + p + '">' + p + "</span>" : "";
  }
  function itemHTML(item, idx, total, editing) {
    var done = !!store.state.done[item.id];
    var ef2 = function (f) { return ' data-ef="task|' + item.id + '|' + f + '"'; };
    var title = editing
      ? '<span class="t"' + ef2("title") + ' contenteditable="true">' + esc(item.title) + "</span>"
      : item.url
        ? '<a href="' + item.url + '" target="_blank" rel="noopener">' + esc(item.title) + "</a>"
        : esc(item.title);
    var diff = item.diff
      ? '<span class="diff ' + item.diff + '"' + (editing ? ef2("diff") + ' contenteditable="true"' : "") + ">" + diffLabel(item.diff) + "</span>"
      : (editing ? '<span class="diff"' + ef2("diff") + ' contenteditable="true" data-ph="diff"></span>' : "");
    var prio = prioTag(item.priority);
    if (editing && item.priority) {
      prio = '<span class="prio ' + item.priority + '"' + ef2("priority") + ' contenteditable="true">' + esc(item.priority) + "</span>";
    }
    var hint = (!editing && item.hint) ? '<p class="hint">' + esc(item.hint) + "</p>" : "";
    var vid;
    if (editing) {
      vid = '<p class="vid">▶ <b' + ef2("vauthor") + ' contenteditable="true" data-ph="channel">' + esc(item.vauthor || "") + "</b>" +
        '<span class="vsep"> · </span><span' + ef2("vtitle") + ' contenteditable="true" data-ph="video title">' + esc(item.vtitle || "") + "</span></p>";
    } else {
      vid = item.vtitle
        ? '<p class="vid">▶ ' + (item.vauthor ? "<b>" + esc(item.vauthor) + "</b> · " : "") + esc(item.vtitle) + "</p>"
        : "";
    }
    var revisions = item.revisions || [];
    var revCount = revisions.length;
    var revBtn = "";
    if (item.type === "dsa" || item.type === "stretch") {
      revBtn = '<button class="rev-btn' + (revCount ? ' has-revs' : '') + '" data-rev="' + item.id + '" title="Revision tracker">' +
        (revCount ? '↻' + revCount : '↻') + '</button>';
    }
    var actions;
    if (editing) {
      actions = '<button class="tbtn danger" data-del="' + item.id + '" title="Delete task">✕</button>';
    } else {
      actions = item.url ? '<a class="go" href="' + item.url + '" target="_blank" rel="noopener">open ↗</a>' : "";
    }
    var inline = editing
      ? '<div class="eurl" data-ef="task|' + item.id + '|url" contenteditable="true" data-ph="link">' + esc(item.url || "") + "</div>" +
        '<p class="hint" data-ef="task|' + item.id + '|hint" contenteditable="true" data-ph="how to do it">' + esc(item.hint || "") + "</p>" +
        clsChip(item)
      : "";
    return '<li class="item' + (done ? " done" : "") + '" draggable="' + (editing ? "false" : "true") + '" data-dragid="' + item.id + '">' +
      '<span class="grip" title="Drag to reorder or move to another day">⠿</span>' +
      '<input type="checkbox" data-id="' + item.id + '"' + (done ? " checked" : "") + ' aria-label="' + esc(item.title) + '">' +
      '<div class="body"><div class="title"><span class="badge ' + item.type + '">' + typeLabel(item.type) + "</span>" + title + diff + prio + "</div>" + vid + inline + hint + "</div>" +
      '<div class="row-end">' + revBtn + actions + "</div></li>";
  }

  /* classification chip: shows how the link was judged, click to override */
  function clsChip(item) {
    if (!item.url) return "";
    var c = store.classifyInfo(item.url);
    var lbl = c.dsa ? "DSA question ✓" : (c.src === "unknown" ? "unverified" : "not DSA");
    return '<button class="cls-chip ' + (c.dsa ? "on" : "") + " src-" + esc(c.src) +
      '" data-clstoggle="' + esc(item.url) + '" title="Count this link as a DSA question? Click to toggle.">' +
      esc(lbl) + "</button>";
  }

  function dayHTML(day, editing) {
    var isToday = day.date === TODAY;
    var isNext = !TODAY_DAY && day.date === FIRST_DATE;
    var items = day.items.map(function (it, i) { return itemHTML(it, i, day.items.length, editing); });

    var pill = editing
      ? '<span class="pill" data-ef="day|' + day.date + '|title" contenteditable="true">' + esc(day.title) + "</span>"
      : '<span class="pill">' + esc(day.title) + "</span>";
    var time = editing
      ? '<span class="day-date" data-ef="day|' + day.date + '|time" contenteditable="true" data-ph="time">' + esc(day.time || "") + "</span>"
      : (day.time ? '<span class="day-date">' + esc(day.time) + "</span>" : "");
    var cls = "day" + (isToday ? " is-today" : "") + (isNext ? " is-next" : "") + (day.revision ? " revision" : "") + (day.light ? " light" : "");

    return '<article class="' + cls + '" id="d-' + day.date + '">' +
      '<div class="day-head"><div class="left">' +
      pill +
      '<span class="day-date">' + fmtDate(day.date) + "</span>" +
      (isToday ? '<span class="pill pill-on">TODAY</span>' : "") +
      (isNext ? '<span class="pill pill-on">STARTS TOMORROW</span>' : "") +
      time +
      '</div><span class="day-wrap">' +
      '<span class="day-count">' + dayDone(day) + "/" + day.items.length + "</span></span></div>" +
      '<div class="day-cols single">' +
      '<div class="dcol dsa" data-boxday="' + day.date + '" data-boxtrack="dsa"><div class="dcol-h"><span class="dnum">01</span>DSA' + (editing ? addBtn(day, "dsa") : "") + "</div>" +
      (items.length ? '<ul class="items">' + items.join("") + "</ul>" : '<div class="dempty">' + (editing ? "Nothing here — ＋ to add" : "Nothing here") + "</div>") + "</div>" +
      '</div></article>';
  }
  function addBtn(day, track) {
    return '<button class="addbtn" data-add="' + day.date + '" data-track="' + track + '" title="Add task">＋</button>';
  }

  /* ============================================================
     WEEK SUMMARY — derived from items, so edits always show
     ============================================================ */
  function weekSummaryHTML(w) {
    var items = [];
    w.days.forEach(function (d) { items = items.concat(d.items); });

    var by = function (t) { return items.filter(function (i) { return i.type === t; }); };
    var problems = store.dedupe(by("dsa").map(function (i) { return pchip(i.title, i.diff); }));
    var watch = by("watch")[0];
    var concepts = store.dedupe(by("theory").map(function (i) { return esc(i.title.replace(/^[^—]*— /, "")); }));
    var stretches = store.dedupe(by("stretch").map(function (i) { return pchip(i.title, i.diff); }));
    var career = store.dedupe(by("career").map(function (i) { return esc(i.title); }));

    var row = function (k, v) { return v ? '<div class="trow"><span class="sum-k">' + k + '</span><div class="sum-v">' + v + "</div></div>" : ""; };
    var line = function (k, arr) {
      return arr.length ? '<div class="trow"><span class="sum-k">' + k + '</span><div class="sum-v plain">' +
        arr.map(function (x) { return '<div class="sumline">' + x + "</div>"; }).join("") + "</div></div>" : "";
    };

    var b1 = '<div class="wbox dsa"><div class="wbox-h">01 · DSA</div><div class="wbox-b">' +
      (w.pattern ? row("Pattern", '<span class="plain">' + esc(w.pattern) + "</span>") : "") +
      (watch ? row("Watch 1st", '<span class="plain"><a href="' + watch.url + '" target="_blank" rel="noopener">' + esc(watch.vtitle || watch.title) + '</a><span class="a"> · ' + esc(watch.vauthor || "") + "</span></span>") : "") +
      (problems.length ? row("Problems", '<span class="sumcount">' + problems.length + "</span>" + problems.join("")) : "") +
      (concepts.length ? line("Concepts", concepts) : "") +
      (stretches.length ? row("Stretch", stretches.join("")) : "") +
      (career.length ? line("Career", career) : "") +
      row("Day 7", '<span class="plain">' + (w.mode === "sprint" ? "Consolidation" : (w.n >= 10 ? "Timed set: 2 unseen mediums, 60 min" : "Re-solve cold")) + "</span>") +
      "</div></div>";

    return '<div class="wk-sum single">' + b1 + "</div>";
  }
  function pchip(t, d) {
    return '<span class="pchip ' + (d || "") + '">' + esc(t) + (d ? '<span class="d">' + diffLabel(d) + "</span>" : "") + "</span>";
  }

  function weekHTML(w) {
    var st = weekStats(w);
    var isActive = w.n === ACTIVE_WEEK;
    var editing = TG.editor.isEditing(w.n);
    var badge = w.mode === "exam" ? '<span class="wtag exam">EXAMS</span>'
      : w.mode === "transition" ? '<span class="wtag trans">TRANSITION</span>'
      : w.mode === "sprint" ? '<span class="wtag sprint">SPRINT</span>' : "";
    var wtools = '<button class="btn wk-edit' + (editing ? " on" : "") + '" data-wedit="' + w.n + '">' +
      (editing ? "Done" : "Edit") + "</button>";

    return '<section class="wk' + (isActive ? " open active" : "") + (editing ? " editing" : "") + '" id="w' + w.n + '" data-week="' + w.n + '">' +
      '<div class="wk-head" data-toggle="' + w.n + '">' +
      '<div class="wk-left"><span class="wk-num">W' + w.n + "</span>" +
      '<div class="wk-title"><h3' + (editing ? ' data-ef="week|' + w.n + '|theme" contenteditable="true"' : "") + ">" + esc(w.theme) + "</h3>" +
      '<div class="wk-dates">' + shortDate(w.days[0].date) + " → " + shortDate(w.days[6].date) + "</div>" +
      (w.goal || editing ? '<div class="wk-goal"' + (editing ? ' data-ef="week|' + w.n + '|goal" contenteditable="true" data-ph="add a goal"' : "") + ">" + esc(w.goal || "") + "</div>" : "") +
      "</div></div>" +
      '<div class="wk-right">' + badge +
      '<div class="mini-bar"><div style="width:' + st.pct + '%"></div></div>' +
      '<span class="day-count">' + st.done + "/" + st.total + "</span>" +
      wtools + '<span class="caret">▾</span></div></div>' +
      (w.note || editing ? '<div class="wk-note"' + (editing ? ' data-ef="week|' + w.n + '|note" contenteditable="true" data-ph="add a note"' : "") + ">" + esc(w.note || "") + "</div>" : "") +
      weekSummaryHTML(w) +
      '<div class="wk-body">' + w.days.map(function (d) { return dayHTML(d, editing); }).join("") + "</div></section>";
  }

  /* ============================================================
     OVERVIEW — things to do till the plan ends (April 2027)
     ============================================================ */
  function navHTML() {
    var parts = [];
    store.db.weeks.forEach(function (w) {
      parts.push('<a href="#w' + w.n + '" class="navchip' + (w.n === ACTIVE_WEEK ? " on" : "") + '" data-nav="' + w.n + '">W' + w.n + "</a>");
    });
    return parts.join("");
  }

  /* ============================================================
     DAILY MOTIVATION — one button above Week 1
     ============================================================ */
  function motHTML() {
    return '<div class="mot-bar"><button id="motBtn" class="mot-btn" data-mot="1">' +
      '<span class="mot-ico">⚡</span><span class="mot-txt"><b>Daily Motivation</b>' +
      '<i>today\'s quote — same all day, new at midnight</i></span></button></div>';
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    var y = window.scrollY;
    var html = '';
    html += '<section id="plan"><div class="plan-head">' +
      '<div class="plan-tools"><button id="expandAll" class="btn">Expand all</button>' +
      '<button id="collapseAll" class="btn">Collapse all</button></div></div>' +
      motHTML() +
      store.db.weeks.map(weekHTML).join("") + "</section>";


    document.getElementById("app").innerHTML = html;
    document.getElementById("navchips").innerHTML = navHTML();
    refreshHeader();
    window.scrollTo(0, y);
    if (window.TG && TG.notes) TG.notes.renderAll();
    if (window.TG && TG.dashboard) TG.dashboard.refresh();
    if (window.TG && TG.verify) TG.verify.sweep();
  }

  function refreshHeader() {
    var o = dsaOverall();
    document.getElementById("overallbar").style.width = o.pct + "%";
    document.getElementById("overallcount").textContent =
      o.done + " / " + o.total + " DSA" + (o.pct > 0 ? " (" + (o.pct > 0 && o.pct < 10 ? o.pct.toFixed(1) : Math.round(o.pct)) + "%)" : "");
    var label;
    if (TODAY < FIRST_DATE) label = "Starts " + fmtDate(FIRST_DATE);
    else if (TODAY > LAST_DATE) label = store.db.weeks.length + " weeks complete";
    else label = "Day " + (D.diffDays(FIRST_DATE, TODAY) + 1) + " of " + store.allDays().length;
    document.getElementById("todayLabel").textContent = (PREVIEW ? "Preview · " : "") + label;
  }

  TG.ui = {
    esc: esc, iso: iso, TODAY: TODAY, PREVIEW: PREVIEW,
    fmtDate: fmtDate, shortDate: shortDate, monthYear: monthYear,
    typeLabel: typeLabel, diffLabel: diffLabel,
    dayDone: dayDone, weekStats: weekStats, overall: overall, dsaOverall: dsaOverall,
    LAST_DATE: LAST_DATE, TODAY_DAY: TODAY_DAY, FIRST_DATE: FIRST_DATE, ACTIVE_WEEK: ACTIVE_WEEK,
    itemHTML: itemHTML, dayHTML: dayHTML, weekHTML: weekHTML, weekSummaryHTML: weekSummaryHTML,
    clsChip: clsChip,
    navHTML: navHTML, render: render, refreshHeader: refreshHeader
  };
})();
