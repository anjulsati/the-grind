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
    return { dsa: "DSA", stretch: "STRETCH", watch: "WATCH", theory: "CS", project: "SHIP", career: "CAREER", review: "REVIEW", dev: "BUILD" }[t] || t;
  }
  function diffLabel(d) { return { E: "easy", M: "med", H: "hard" }[d] || d; }

  function dayDone(day) { return day.items.filter(function (i) { return store.state.done[i.id]; }).length; }
  function weekStats(w) {
    var t = 0, d = 0;
    w.days.forEach(function (x) { t += x.items.length; d += dayDone(x); });
    return { total: t, done: d, pct: t ? Math.round((d / t) * 100) : 0 };
  }
  function overall() {
    var t = 0, d = 0;
    store.allDays().forEach(function (x) { t += x.items.length; d += dayDone(x); });
    return { total: t, done: d, pct: t ? (d / t) * 100 : 0 };
  }
  var LAST_DATE = store.allDays()[store.allDays().length - 1].date;
  var TODAY_DAY = store.allDays().filter(function (d) { return d.date === TODAY; })[0] || null;
  var FIRST_DATE = db0().days[0].date;
  var ACTIVE_WEEK = TODAY_DAY ? TODAY_DAY.week : (TODAY < FIRST_DATE ? 1 : store.db.weeks.length);
  function db0() { return store.db.weeks[0]; }

  /* ============================================================
     ITEM
     ============================================================ */
  function itemHTML(item) {
    var done = !!store.state.done[item.id];
    var title = item.url
      ? '<a href="' + item.url + '" target="_blank" rel="noopener">' + esc(item.title) + "</a>"
      : esc(item.title);
    var diff = item.diff ? '<span class="diff ' + item.diff + '">' + diffLabel(item.diff) + "</span>" : "";
    var hint = item.hint ? '<p class="hint">' + esc(item.hint) + "</p>" : "";
    var vid = item.vtitle
      ? '<p class="vid">▶ ' + (item.vauthor ? "<b>" + esc(item.vauthor) + "</b> · " : "") + esc(item.vtitle) + "</p>"
      : "";
    var actions;
    if (TG.editor.isOn()) {
      actions = '<span class="itools">' +
        '<button class="tbtn" data-edit="' + item.id + '" title="Edit">✎</button>' +
        '<button class="tbtn danger" data-del="' + item.id + '" title="Delete">✕</button></span>';
    } else {
      actions = item.url ? '<a class="go" href="' + item.url + '" target="_blank" rel="noopener">open ↗</a>' : "";
    }
    return '<li class="item' + (done ? " done" : "") + '">' +
      '<input type="checkbox" data-id="' + item.id + '"' + (done ? " checked" : "") + ' aria-label="' + esc(item.title) + '">' +
      '<div class="body"><div class="title"><span class="badge ' + item.type + '">' + typeLabel(item.type) + "</span>" + title + diff + "</div>" + vid + hint + "</div>" +
      actions + "</li>";
  }

  /* ============================================================
     DAY — two boxes: 01 DSA (everything actionable), 02 DEV (reserved)
     ============================================================ */
  function dayHTML(day) {
    var isToday = day.date === TODAY;
    var isNext = !TODAY_DAY && day.date === FIRST_DATE;
    var items = day.items.map(itemHTML);

    var wtools = TG.editor.isOn() ? '<button class="tbtn" data-wday="' + day.date + '" title="Rename this day">✎</button>' : "";
    var cls = "day" + (isToday ? " is-today" : "") + (isNext ? " is-next" : "") + (day.revision ? " revision" : "") + (day.light ? " light" : "");

    return '<article class="' + cls + '" id="d-' + day.date + '">' +
      '<div class="day-head"><div class="left">' +
      '<span class="pill">' + esc(day.title) + "</span>" +
      '<span class="day-date">' + fmtDate(day.date) + "</span>" +
      (isToday ? '<span class="pill pill-on">TODAY</span>' : "") +
      (isNext ? '<span class="pill pill-on">STARTS TOMORROW</span>' : "") +
      (day.time ? '<span class="day-date">· ' + esc(day.time) + "</span>" : "") +
      '</div><span class="day-wrap">' + wtools +
      '<span class="day-count">' + dayDone(day) + "/" + day.items.length + "</span></span></div>" +
      '<div class="day-cols">' +
      '<div class="dcol dsa"><div class="dcol-h"><span class="dnum">01</span>DSA' + addBtn(day, "dsa") + "</div>" +
      (items.length ? '<ul class="items">' + items.join("") + "</ul>" : '<div class="dempty">Nothing here</div>') + "</div>" +
      '<div class="dcol dev"><div class="dcol-h"><span class="dnum">02</span>DEV' + addBtn(day, "dev") + "</div>" +
      '<div class="dempty">Reserved — being decided.</div>' +
      "</div></div></article>";
  }
  function addBtn(day, track) {
    return TG.editor.isOn()
      ? '<button class="addbtn" data-add="' + day.date + '" data-track="' + track + '" title="Add">＋</button>'
      : "";
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
      (concepts.length ? line("CS study", concepts) : "") +
      (stretches.length ? row("Stretch", stretches.join("")) : "") +
      (career.length ? line("Career", career) : "") +
      row("Day 7", '<span class="plain">' + (w.mode === "sprint" ? "Consolidation" : (w.n >= 10 ? "Timed set: 2 unseen mediums, 60 min" : "Re-solve cold")) + "</span>") +
      "</div></div>";

    var b2 = '<div class="wbox dev"><div class="wbox-h">02 · DEV</div><div class="wbox-b">' +
      '<div class="dim">Reserved — still deciding what goes here.</div></div></div>';

    return '<div class="wk-sum two">' + b1 + b2 + "</div>";
  }
  function pchip(t, d) {
    return '<span class="pchip ' + (d || "") + '">' + esc(t) + (d ? '<span class="d">' + diffLabel(d) + "</span>" : "") + "</span>";
  }

  function weekHTML(w) {
    var st = weekStats(w);
    var isActive = w.n === ACTIVE_WEEK;
    var badge = w.mode === "exam" ? '<span class="wtag exam">EXAMS</span>'
      : w.mode === "transition" ? '<span class="wtag trans">TRANSITION</span>'
      : w.mode === "sprint" ? '<span class="wtag sprint">SPRINT</span>' : "";
    var wtools = TG.editor.isOn() ? '<button class="tbtn" data-wweek="' + w.n + '" title="Edit week">✎</button>' : "";

    return '<section class="wk' + (isActive ? " open active" : "") + '" id="w' + w.n + '" data-week="' + w.n + '">' +
      '<div class="wk-head" data-toggle="' + w.n + '">' +
      '<div class="wk-left"><span class="wk-num">W' + w.n + "</span>" +
      '<div class="wk-title"><h3>' + esc(w.theme) + "</h3>" +
      '<div class="wk-dates">' + shortDate(w.days[0].date) + " → " + shortDate(w.days[6].date) +
      (w.goal ? " · " + esc(w.goal) : "") + "</div></div></div>" +
      '<div class="wk-right">' + badge +
      '<div class="mini-bar"><div style="width:' + st.pct + '%"></div></div>' +
      '<span class="day-count">' + st.done + "/" + st.total + "</span>" +
      '<span class="wk-tools">' + wtools + '</span><span class="caret">▾</span></div></div>' +
      (w.note ? '<div class="wk-note">' + esc(w.note) + "</div>" : "") +
      weekSummaryHTML(w) +
      '<div class="wk-body">' + w.days.map(dayHTML).join("") + "</div></section>";
  }

  /* ============================================================
     OVERVIEW — things to do till placement season
     ============================================================ */
  function overviewHTML() {
    var html = '<section id="overview">';

    html += '<h2>Things to do till ' + monthYear(D.PLACEMENT_SEASON) + '</h2>';
    html += '<div class="grid three">' + store.db.pillars.map(function (p, i) {
      var edit = TG.editor.isOn()
        ? '<button class="tbtn" data-editpillar="' + i + '" title="Edit ' + esc(p.name) + '">✎</button>' : "";
      return '<div class="card proj"><div class="proj-head"><span class="proj-n">' + esc(p.n) + "</span>" + edit + "</div>" +
        "<h4>" + esc(p.name) + '</h4><p class="proj-tag">' + esc(p.tag) + "</p><ul>" +
        p.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div>";

    html += "<h2>All the weeks</h2>";
    html += '<div class="tablewrap"><table><thead><tr><th>Week</th><th>Dates</th><th>Theme</th><th>Problems</th></tr></thead><tbody>' +
      store.db.weeks.map(function (w) {
        var probs = store.dedupe(w.days.reduce(function (a, d) {
          return a.concat(d.items.filter(function (i) { return i.type === "dsa"; }).map(function (i) { return i.title; }));
        }, []));
        return '<tr class="idxrow" data-goto="w' + w.n + '">' +
          '<td><span class="pill sm">W' + w.n + "</span></td>" +
          '<td class="dim">' + shortDate(w.days[0].date) + " – " + shortDate(w.days[6].date) + "</td>" +
          "<td>" + esc(w.theme) + (w.mode === "exam" ? ' <span class="wtag exam" style="font-size:9px;padding:1px 6px">EXAMS</span>' : "") + "</td>" +
          '<td class="num">' + probs.length + "</td></tr>";
      }).join("") + "</tbody></table></div>";

    html += "</section>";
    return html;
  }

  /* ============================================================
     DSA MATERIAL — the watch-first list + the best resources
     ============================================================ */
  function dsaHTML() {
    var html = '<section id="dsa"><h2>DSA — the material</h2>' +
      '<p class="lead">One video per pattern, watched before the week starts. Picked from what the Indian prep community actually recommends, then verified link by link.</p>';

    html += '<h3>The watch-first list</h3><div class="tablewrap"><table><thead><tr><th>Week</th><th>Pattern</th><th>Watch before the week</th></tr></thead><tbody>' +
      store.db.weeks.filter(function (w) { return w.pre; }).map(function (w) {
        return "<tr><td><span class=\"pill sm\">W" + w.n + "</span></td><td>" + esc(w.pattern) + "</td>" +
          '<td><a href="' + w.pre.url + '" target="_blank" rel="noopener">' + esc(w.pre.vtitle) + '</a><span class="dim"> · ' + esc(w.pre.vauthor) + "</span></td></tr>";
      }).join("") + "</tbody></table></div>";

    html += '<h3>The resources that matter</h3><div class="grid">' +
      dsaResources().map(function (r) {
        return '<div class="card"><h4><a href="' + r.url + '" target="_blank" rel="noopener">' + esc(r.label) + "</a></h4><p>" + esc(r.note) + "</p></div>";
      }).join("") + "</div>";

    html += '<div class="callout"><b>The method, every single problem:</b> 45 minutes alone → 20 minutes learning → close the editor and rewrite it from scratch. Then re-solve it three days later without looking.</div>';
    html += "</section>";
    return html;
  }
  function dsaResources() {
    return [
      { label: "Striver A2Z Sheet", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", note: "The spine. 433 problems in dependency order — the sheet FAANG folks point to." },
      { label: "NeetCode 150", url: "https://neetcode.io/practice", note: "The revision sheet. Subset of patterns, best video explanations on the internet." },
      { label: "LeetCode", url: "https://leetcode.com/problemset/", note: "Where you submit. Free tier is enough. Contests every Sunday." },
      { label: "LeetCode — Top Interview 150", url: "https://leetcode.com/studyplan/top-interview-150/", note: "Company-tagged classics. Do it after A2Z." },
      { label: "Aditya Verma — DP playlist", url: "https://www.youtube.com/playlist?list=PL_z_8CaSLPWekqhdCPmFohncHwz8TY2Go", note: "The most recommended DP playlist in the Indian community. Hindi." },
      { label: "Aditya Verma — Recursion", url: "https://www.youtube.com/watch?v=XuVDW9rwx68", note: "Recursion + backtracking, taught by identification, not by problem." },
      { label: "Kunal Kushwaha — Java DSA", url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", note: "Java-first DSA bootcamp. Best for building from zero." },
      { label: "Take U Forward (Striver) — YouTube", url: "https://www.youtube.com/@takeUforward", note: "Trees, graphs, DP series with notes on takeuforward.org." },
      { label: "Abdul Bari — Algorithms", url: "https://www.youtube.com/watch?v=0IAPZzGS8ME", note: "Heaps, greedy, graph algorithms — the theory done properly." },
      { label: "Cracking the Coding Interview", url: "https://www.crackingthecodinginterview.com/", note: "Chapters 1-6 and 17 are enough for FAANG behaviour + patterns." }
    ];
  }

  /* ============================================================
     OTHER SECTIONS
     ============================================================ */
  function faangHTML() {
    var html = '<section id="faang"><h2>The FAANG bar</h2>' +
      '<p class="lead">' + D.FAANG.thesis + "</p>";
    html += '<h3>Three routes in</h3><div class="grid">' + D.FAANG.route.map(function (r) {
      return '<div class="card"><h4>' + esc(r[0]) + '</h4><p class="dim tiny">' + esc(r[1]) + "</p><p>" + esc(r[2]) + "</p></div>";
    }).join("") + "</div>";
    html += '<h3>The interview loop, honestly</h3><div class="steps">' + D.FAANG.loop.map(function (l, i) {
      return '<div class="step"><span class="stnum">' + (i + 1) + '</span><div><h4>' + esc(l[0]) + "</h4><p>" + esc(l[1]) + "</p></div></div>";
    }).join("") + "</div>";
    html += '<h3>The bar you are training for</h3><div class="callout">' + D.FAANG.bar.map(function (b) { return "• " + esc(b); }).join("<br>") + "</div>";
    html += '<h3>STAR — the round everyone underestimates</h3><div class="grid">' + D.FAANG.star.map(function (x) {
      return '<div class="card tight"><h4>' + esc(x[0]) + "</h4><p>" + esc(x[1]) + "</p></div>";
    }).join("") + "</div></section>";
    return html;
  }

  function resourcesHTML() {
    var html = '<section id="links"><h2>Links</h2>';
    D.RESOURCES.forEach(function (g) {
      if (g.group.indexOf("DSA") === 0) return; // DSA material has its own section now
      html += "<h3>" + esc(g.group) + '</h3><div class="grid">' + g.items.map(function (it) {
        return '<div class="card tight"><h4><a href="' + it.url + '" target="_blank" rel="noopener">' + esc(it.label) + "</a></h4>" +
          (it.note ? "<p>" + esc(it.note) + "</p>" : "") + "</div>";
      }).join("") + "</div>";
    });
    html += '<div class="callout">' + D.RULES.map(function (r) { return "• " + esc(r); }).join("<br>") + "</div>";
    html += '<h3>Checkpoints</h3><div class="grid">' + D.MILESTONES.map(function (m) {
      return '<div class="card"><h4>' + esc(m.when) + "</h4><ul>" + m.checks.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></div>";
    }).join("") + "</div></section>";
    return html;
  }

  var VERDICTS = [
    ["overall", "Overall verdict", ["Keep as is", "Compress to 4 months", "Expand to 6 months", "Restructure"]],
    ["dsa", "DSA volume", ["Too little", "About right", "Too much"]],
    ["cs", "CS Fundamentals depth", ["Too shallow", "About right", "Too deep"]],
    ["exam", "Exam weeks (45 min/day)", ["Too light", "About right", "Too heavy for endsems"]],
    ["time", "Daily budget (2h 45m)", ["Unrealistic", "Tight but doable", "Comfortable"]],
    ["apply", "Applications from week 8", ["Too late", "About right", "Too early"]]
  ];

  function reviewMarkdown() {
    var L = [];
    L.push("# The Grind — plan review");
    L.push("");
    L.push("**Plan by:** Anjul Sati  ");
    L.push("**Reviewer:** " + (store.state.review.name || "(unnamed)") + "  ");
    L.push("**Date:** " + iso(new Date()));
    L.push("");
    L.push("## Verdicts");
    VERDICTS.forEach(function (v) { L.push("- **" + v[1] + ":** " + (rv(v[0]) || "-")); });
    L.push(""); L.push("## Biggest risk"); L.push(rv("risk") || "-");
    L.push(""); L.push("## What to cut"); L.push(rv("cut") || "-");
    L.push(""); L.push("## What is missing"); L.push(rv("add") || "-");
    L.push(""); L.push("## Final instruction"); L.push(rv("final") || "-");
    L.push(""); L.push("## Week by week");
    L.push(""); L.push("| Week | Theme | Comment |"); L.push("| --- | --- | --- |");
    store.db.weeks.forEach(function (w) {
      var c = rv("w" + w.n);
      if (c) L.push("| W" + w.n + " | " + w.theme + " | " + c.replace(/\|/g, "/").replace(/\n/g, " ") + " |");
    });
    L.push(""); L.push("---"); L.push("Generated from The Grind, by Anjul Sati.");
    return L.join("\n");
  }
  function rv(key) {
    var r = store.state.review;
    if (!r) return "";
    if (key === "risk" || key === "cut" || key === "add" || key === "final") return (r.a && r.a[key]) || "";
    return (r.v && r.v[key]) || "";
  }

  function reviewHTML() {
    var html = '<section id="review"><h2>Review</h2>' +
      '<p class="lead">For an audit: pick a verdict, comment where you disagree, then download the file and send it back. Nothing leaves this browser until you do.</p>';
    html += '<div class="form"><input type="text" id="rvName" placeholder="Reviewer name" value="' + esc(store.state.review.name || "") + '" style="flex:1;min-width:240px"></div>';
    html += '<div class="grid">' + VERDICTS.map(function (v) {
      var cur = rv(v[0]);
      return '<div class="card"><h4>' + esc(v[1]) + '</h4><select data-rk="v:' + v[0] + '" style="width:100%">' +
        '<option value="">— pick —</option>' +
        v[2].map(function (o) { return '<option value="' + esc(o) + '"' + (cur === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") +
        "</select></div>";
    }).join("") + "</div>";
    html += [["risk", "Biggest risk", "Be blunt. What breaks first?"],
             ["cut", "What to cut", "Which weeks are wasted effort?"],
             ["add", "What is missing", "Anything that isn't here?"],
             ["final", "Final instruction", "One paragraph to read every Monday."]].map(function (a) {
      return '<div class="card" style="margin-bottom:14px"><h4>' + esc(a[1]) + "</h4><p>" + esc(a[2]) + "</p>" +
        '<textarea data-rk="a:' + a[0] + '" rows="3" placeholder="...">' + esc(rv(a[0])) + "</textarea></div>";
    }).join("");
    html += "<h3>Week by week</h3><p class=\"dim tiny\">Comment only where you disagree. Empty means approved.</p>";
    html += '<div class="wklist">' + store.db.weeks.map(function (w) {
      return '<div class="wkrow"><span class="pill sm">W' + w.n + "</span>" +
        '<input type="text" data-rk="w:' + w.n + '" placeholder="' + esc(w.theme) + '" value="' + esc(rv("w" + w.n)) + '"></div>';
    }).join("") + "</div>";
    html += '<div class="form" style="margin-top:22px"><button id="rvDownload" class="btn solid">Download review .md</button>' +
      '<button id="rvCopy" class="btn">Copy as text</button>' +
      '<button id="rvClear" class="btn">Clear</button>' +
      '<span id="rvStatus" class="dim tiny" style="align-self:center"></span></div></section>';
    return html;
  }

  function navHTML() {
    var parts = ['<a href="#overview" class="navchip">Overview</a>'];
    store.db.weeks.forEach(function (w) {
      parts.push('<a href="#w' + w.n + '" class="navchip' + (w.n === ACTIVE_WEEK ? " on" : "") + '" data-nav="' + w.n + '">W' + w.n + "</a>");
    });
    parts.push('<a href="#dsa" class="navchip">DSA material</a>');
    parts.push('<a href="#faang" class="navchip">FAANG</a>');
    parts.push('<a href="#links" class="navchip">Links</a>');
    parts.push('<a href="#review" class="navchip">Review</a>');
    return parts.join("");
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function render() {
    var y = window.scrollY;
    var html = overviewHTML();
    html += '<section id="plan"><div class="plan-head"><h2>Week by week</h2>' +
      '<div class="plan-tools"><button id="expandAll" class="btn">Expand all</button>' +
      '<button id="collapseAll" class="btn">Collapse all</button></div></div>' +
      '<p class="lead">Two boxes a day. <b>01 DSA</b> is everything you do today. <b>02 DEV</b> is reserved.</p>' +
      store.db.weeks.map(weekHTML).join("") + "</section>";
    html += dsaHTML();
    html += faangHTML();
    html += resourcesHTML();
    html += reviewHTML();

    document.getElementById("app").innerHTML = html;
    document.getElementById("navchips").innerHTML = navHTML();
    refreshHeader();
    window.scrollTo(0, y);
  }

  function refreshHeader() {
    var o = overall();
    document.getElementById("overallbar").style.width = o.pct + "%";
    document.getElementById("overallcount").textContent =
      o.done + " / " + o.total + " (" + (o.pct > 0 && o.pct < 10 ? o.pct.toFixed(1) : Math.round(o.pct)) + "%)";
    var left = D.diffDays(TODAY, D.PLACEMENT_SEASON);
    document.getElementById("countdown").textContent = left > 0 ? left + " days to placements" : "placement season";
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
    dayDone: dayDone, weekStats: weekStats, overall: overall,
    LAST_DATE: LAST_DATE, TODAY_DAY: TODAY_DAY, FIRST_DATE: FIRST_DATE, ACTIVE_WEEK: ACTIVE_WEEK,
    itemHTML: itemHTML, dayHTML: dayHTML, weekHTML: weekHTML, weekSummaryHTML: weekSummaryHTML,
    overviewHTML: overviewHTML, dsaHTML: dsaHTML, faangHTML: faangHTML,
    resourcesHTML: resourcesHTML, reviewHTML: reviewHTML, reviewMarkdown: reviewMarkdown,
    navHTML: navHTML, render: render, refreshHeader: refreshHeader
  };
})();
